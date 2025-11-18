import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
});

export async function POST(request: Request) {
  try {
    const { email, name, priceId } = await request.json();

    // Criar cliente no Stripe
    const customer = await stripe.customers.create({
      email,
      name,
    });

    // Criar assinatura com trial - MÉTODO SIMPLIFICADO
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
      trial_period_days: 7,
    });

    // CORREÇÃO DEFINITIVA - Acessar o payment_intent corretamente
    const invoice = subscription.latest_invoice as Stripe.Invoice;
    
    // Verificar se payment_intent existe e é um objeto expandido
    if (invoice.payment_intent && typeof invoice.payment_intent === 'object') {
      const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;
      
      return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
        subscriptionId: subscription.id,
      });
    }

    // Fallback: se não tiver payment_intent, criar um separadamente
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000, // R$ 10,00 em centavos (valor simbólico para teste)
      currency: 'brl',
      customer: customer.id,
      setup_future_usage: 'on_session',
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      subscriptionId: subscription.id,
    });

  } catch (error) {
    console.error('Erro ao criar payment intent:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
