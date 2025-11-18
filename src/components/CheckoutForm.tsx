'use client';

import { useState, FormEvent } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    if (!email) {
      setError('Email é obrigatório');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Criar Payment Intent no backend
      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name,
        }),
      });

      const { clientSecret, error: backendError } = await response.json();

      if (backendError) {
        throw new Error(backendError);
      }

      // Confirmar pagamento com Stripe
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error('Elemento de cartão não encontrado');
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              email,
              name: name || undefined,
            },
          },
        }
      );

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (paymentIntent?.status === 'succeeded') {
        setSuccess(true);
        
        // Redirecionar para login após 2 segundos
        setTimeout(() => {
          window.location.href = `/login?email=${encodeURIComponent(email)}&premium=true`;
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao processar pagamento');
    } finally {
      setLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#111827',
        fontFamily: 'Inter, system-ui, sans-serif',
        '::placeholder': {
          color: '#9CA3AF',
        },
        iconColor: '#6366F1',
      },
      invalid: {
        color: '#EF4444',
        iconColor: '#EF4444',
      },
    },
    hidePostalCode: true,
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-[#111827] mb-2">Pagamento Confirmado! 🎉</h3>
        <p className="text-[#6B7280]">Redirecionando para o login...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" className="text-[#111827] font-medium">
          Email <span className="text-red-500">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
          className="border-gray-300 focus:border-[#6366F1] focus:ring-[#6366F1]"
        />
        <p className="text-sm text-[#6B7280]">Este será seu email de login</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name" className="text-[#111827] font-medium">
          Nome (opcional)
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="Seu nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
          className="border-gray-300 focus:border-[#6366F1] focus:ring-[#6366F1]"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-[#111827] font-medium">
          Cartão de Crédito <span className="text-red-500">*</span>
        </Label>
        <div className="border border-gray-300 rounded-lg p-4 bg-white focus-within:border-[#6366F1] focus-within:ring-2 focus-within:ring-[#6366F1] focus-within:ring-opacity-20 transition-all">
          <CardElement options={cardElementOptions} />
        </div>
        <p className="text-sm text-[#6B7280]">
          Você não será cobrado nos próximos 7 dias
        </p>
      </div>

      <Button
        type="submit"
        disabled={!stripe || loading}
        className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:opacity-90 transition-opacity text-white shadow-lg"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processando...
          </>
        ) : (
          'Iniciar 7 Dias Grátis'
        )}
      </Button>

      <p className="text-xs text-center text-[#6B7280]">
        Ao continuar, você concorda com nossos{' '}
        <a href="/termos" className="text-[#6366F1] hover:underline">
          Termos de Serviço
        </a>{' '}
        e{' '}
        <a href="/privacidade" className="text-[#6366F1] hover:underline">
          Política de Privacidade
        </a>
      </p>
    </form>
  );
}
