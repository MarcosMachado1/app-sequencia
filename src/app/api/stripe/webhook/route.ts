import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature")!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return NextResponse.json(
        { error: "Webhook signature verification failed" },
        { status: 400 }
      );
    }

    // Processar eventos
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: error.message || "Webhook error" },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const customerEmail = session.customer_email;
  const customerId = session.customer as string;

  if (!userId) {
    console.error("UserId not found in session metadata");
    return;
  }

  // Atualizar usuário no Supabase
  const { error } = await supabase
    .from("users")
    .update({
      isPremium: true,
      stripeCustomerId: customerId,
      subscriptionStatus: "active",
      email: customerEmail,
    })
    .eq("id", userId);

  if (error) {
    console.error("Error updating user:", error);
  } else {
    console.log(`User ${userId} upgraded to premium`);
    // TODO: Enviar email de boas-vindas premium
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const status = subscription.status;

  // Atualizar status da assinatura
  const { error } = await supabase
    .from("users")
    .update({
      subscriptionStatus: status,
      isPremium: status === "active" || status === "trialing",
    })
    .eq("stripeCustomerId", customerId);

  if (error) {
    console.error("Error updating subscription:", error);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  // Rebaixar para gratuito
  const { error } = await supabase
    .from("users")
    .update({
      isPremium: false,
      subscriptionStatus: "canceled",
    })
    .eq("stripeCustomerId", customerId);

  if (error) {
    console.error("Error canceling subscription:", error);
  } else {
    console.log(`Subscription canceled for customer ${customerId}`);
  }
}
