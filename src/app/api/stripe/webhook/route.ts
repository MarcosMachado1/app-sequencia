import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
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

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentSucceeded(paymentIntent);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentSucceeded(invoice);
        break;
      }

      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCreated(subscription);
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

  console.log("Checkout completed:", { userId, customerEmail, customerId });

  if (!userId && !customerEmail) {
    console.error("Neither userId nor email found in session");
    return;
  }

  // Se temos userId, atualizar diretamente
  if (userId) {
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
    }
  } 
  // Se não temos userId mas temos email, criar ou atualizar usuário
  else if (customerEmail) {
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", customerEmail)
      .single();

    if (existingUser) {
      // Atualizar usuário existente
      const { error } = await supabase
        .from("users")
        .update({
          isPremium: true,
          stripeCustomerId: customerId,
          subscriptionStatus: "active",
        })
        .eq("email", customerEmail);

      if (error) {
        console.error("Error updating existing user:", error);
      }
    } else {
      // Criar novo usuário premium
      const { error } = await supabase
        .from("users")
        .insert({
          email: customerEmail,
          isPremium: true,
          stripeCustomerId: customerId,
          subscriptionStatus: "active",
        });

      if (error) {
        console.error("Error creating new user:", error);
      } else {
        console.log(`New premium user created: ${customerEmail}`);
      }
    }
  }
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const customerId = paymentIntent.customer as string;
  
  if (!customerId) {
    console.log("No customer ID in payment intent");
    return;
  }

  console.log("Payment succeeded for customer:", customerId);

  // Buscar customer no Stripe para pegar o email
  const customer = await stripe.customers.retrieve(customerId);
  
  if (customer.deleted) {
    console.error("Customer was deleted");
    return;
  }

  const customerEmail = customer.email;

  if (!customerEmail) {
    console.error("No email found for customer");
    return;
  }

  // Verificar se usuário já existe
  const { data: existingUser } = await supabase
    .from("users")
    .select("id, isPremium")
    .eq("email", customerEmail)
    .single();

  if (existingUser) {
    // Atualizar usuário existente
    const { error } = await supabase
      .from("users")
      .update({
        isPremium: true,
        stripeCustomerId: customerId,
        subscriptionStatus: "active",
      })
      .eq("email", customerEmail);

    if (error) {
      console.error("Error updating user after payment:", error);
    } else {
      console.log(`User ${customerEmail} updated to premium after payment`);
    }
  } else {
    // Criar novo usuário premium
    const { error } = await supabase
      .from("users")
      .insert({
        email: customerEmail,
        isPremium: true,
        stripeCustomerId: customerId,
        subscriptionStatus: "trialing",
      });

    if (error) {
      console.error("Error creating user after payment:", error);
    } else {
      console.log(`New premium user created after payment: ${customerEmail}`);
    }
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  const subscriptionId = invoice.subscription as string;

  console.log("Invoice payment succeeded:", { customerId, subscriptionId });

  // Garantir que o usuário está premium
  const { error } = await supabase
    .from("users")
    .update({
      isPremium: true,
      subscriptionStatus: "active",
    })
    .eq("stripeCustomerId", customerId);

  if (error) {
    console.error("Error updating user after invoice payment:", error);
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const status = subscription.status;

  console.log("Subscription created:", { customerId, status });

  // Buscar customer no Stripe
  const customer = await stripe.customers.retrieve(customerId);
  
  if (customer.deleted) {
    console.error("Customer was deleted");
    return;
  }

  const customerEmail = customer.email;

  if (!customerEmail) {
    console.error("No email found for customer");
    return;
  }

  // Verificar se usuário existe
  const { data: existingUser } = await supabase
    .from("users")
    .select("id")
    .eq("email", customerEmail)
    .single();

  if (existingUser) {
    // Atualizar usuário existente
    const { error } = await supabase
      .from("users")
      .update({
        isPremium: status === "active" || status === "trialing",
        stripeCustomerId: customerId,
        subscriptionStatus: status,
      })
      .eq("email", customerEmail);

    if (error) {
      console.error("Error updating user subscription:", error);
    }
  } else {
    // Criar novo usuário
    const { error } = await supabase
      .from("users")
      .insert({
        email: customerEmail,
        isPremium: status === "active" || status === "trialing",
        stripeCustomerId: customerId,
        subscriptionStatus: status,
      });

    if (error) {
      console.error("Error creating user from subscription:", error);
    } else {
      console.log(`New user created from subscription: ${customerEmail}`);
    }
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const status = subscription.status;

  console.log("Subscription updated:", { customerId, status });

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
  } else {
    console.log(`Subscription updated for customer ${customerId}: ${status}`);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  console.log("Subscription deleted:", customerId);

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
