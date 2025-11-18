import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
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

    // **CORREÇÃO DEFINITIVA** - Criar PaymentIntent diretamente
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 499, // R$ 4,99 em centavos
      currency: 'brl',
      customer: customer.id,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        trial_days: '7',
        source: 'sequencia_app'
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      customerId: customer.id,
      // **CORREÇÃO** - Não precisa mais do subscriptionId aqui
      // A assinatura será criada depois no webhook quando o pagamento for confirmado
    });
  } catch (error: any) {
    console.error('Erro ao criar payment intent:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao processar pagamento' },
      { status: 500 }
    );
  }
}
