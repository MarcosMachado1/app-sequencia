import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      );
    }

    // Criar ou buscar cliente no Stripe
    let customer;
    const existingCustomers = await stripe.customers.list({
      email,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      customer = await stripe.customers.create({
        email,
        name: name || undefined,
        metadata: {
          source: 'sequencia_app',
        },
      });
    }

    // Criar assinatura com trial de 7 dias
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [
        {
          price: process.env.STRIPE_PRICE_ID!, // ID do preço mensal no Stripe
        },
      ],
      trial_period_days: 7,
      payment_behavior: 'default_incomplete',
      payment_settings: {
        save_default_payment_method: 'on_subscription',
      },
      expand: ['latest_invoice.payment_intent'],
    });

    const invoice = subscription.latest_invoice as Stripe.Invoice;
    const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      subscriptionId: subscription.id,
      customerId: customer.id,
    });
  } catch (error: any) {
    console.error('Erro ao criar payment intent:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao processar pagamento' },
      { status: 500 }
    );
  }
}
