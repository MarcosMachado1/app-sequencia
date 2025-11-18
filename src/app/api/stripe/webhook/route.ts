import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import type { Subscription } from 'stripe';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Assinatura do webhook ausente' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Erro ao verificar webhook:', err.message);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }

    // Processar eventos do Stripe
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        if (session.mode === 'subscription') {
          const subscriptionId = session.subscription as string;
          const customerId = session.customer as string;
          const userId = session.metadata?.user_id;

          if (!userId) {
            console.error('User ID não encontrado nos metadados');
            break;
          }

          // Buscar detalhes da subscription
          const subscription: Subscription = await stripe.subscriptions.retrieve(subscriptionId);

          // Salvar subscription no banco
          await supabase.from('subscriptions').upsert({
            user_id: userId,
            stripe_subscription_id: subscriptionId,
            stripe_customer_id: customerId,
            status: subscription.status,
            price_id: subscription.items.data[0].price.id,
            quantity: subscription.items.data[0].quantity,
            cancel_at_period_end: subscription.cancel_at_period_end,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          });

          // Atualizar is_premium no perfil do usuário
          await supabase
            .from('profiles')
            .update({ is_premium: true })
            .eq('id', userId);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Subscription;
        const customerId = subscription.customer as string;

        // Buscar user_id pelo customer_id
        const { data: customer } = await supabase
          .from('customers')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (!customer) {
          console.error('Customer não encontrado:', customerId);
          break;
        }

        // Atualizar subscription
        await supabase.from('subscriptions').upsert({
          user_id: customer.user_id,
          stripe_subscription_id: subscription.id,
          stripe_customer_id: customerId,
          status: subscription.status,
          price_id: subscription.items.data[0].price.id,
          quantity: subscription.items.data[0].quantity,
          cancel_at_period_end: subscription.cancel_at_period_end,
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        });

        // Atualizar is_premium baseado no status
        const isPremium = ['active', 'trialing'].includes(subscription.status);
        await supabase
          .from('profiles')
          .update({ is_premium: isPremium })
          .eq('id', customer.user_id);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Subscription;
        const customerId = subscription.customer as string;

        // Buscar user_id pelo customer_id
        const { data: customer } = await supabase
          .from('customers')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (!customer) {
          console.error('Customer não encontrado:', customerId);
          break;
        }

        // Atualizar status da subscription
        await supabase
          .from('subscriptions')
          .update({ status: 'canceled' })
          .eq('user_id', customer.user_id);

        // Remover is_premium
        await supabase
          .from('profiles')
          .update({ is_premium: false })
          .eq('id', customer.user_id);
        break;
      }

      default:
        console.log(`Evento não tratado: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Erro ao processar webhook:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao processar webhook' },
      { status: 500 }
    );
  }
}