import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
});

export async function POST(request: Request) {
  try {
    const { priceId } = await request.json();

    // VERSÃO SIMPLES E GARANTIDA - apenas cria um PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 499, // R$ 4,99 em centavos (valor mensal)
      currency: 'brl',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        price_id: priceId // guardamos o priceId nos metadados
      }
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      success: true
    });

  } catch (error: any) {
    console.error('Erro ao criar payment intent:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
