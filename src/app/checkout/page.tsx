'use client';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from '@/components/CheckoutForm';
import { ArrowLeft, Shield, Clock, Users } from 'lucide-react';
import Link from 'next/link';

// Inicializar Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white py-6 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-white/90 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold">Entre para a Comunidade Sequencia</h1>
          <p className="text-white/90 mt-2 text-lg">
            Comece sua jornada de transformação hoje
          </p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Coluna Esquerda - Benefícios */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-[#111827] mb-6">
                O que você ganha:
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#111827] mb-1">
                      Acesso à Comunidade
                    </h3>
                    <p className="text-[#6B7280] text-sm">
                      Conecte-se com pessoas que compartilham seus objetivos
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#111827] mb-1">
                      7 Dias Grátis
                    </h3>
                    <p className="text-[#6B7280] text-sm">
                      Experimente todos os recursos premium sem compromisso
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#111827] mb-1">
                      Cancele Quando Quiser
                    </h3>
                    <p className="text-[#6B7280] text-sm">
                      Sem taxas de cancelamento ou multas
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Plano Selecionado */}
            <div className="bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Plano Premium</h3>
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                  Recomendado
                </span>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Hábitos ilimitados</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Acesso total à comunidade</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Gráficos e estatísticas avançadas</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Sem anúncios</span>
                </div>
              </div>

              <div className="border-t border-white/20 pt-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">R$ 4,99</span>
                  <span className="text-white/80">/mês</span>
                </div>
                <p className="text-white/80 text-sm mt-1">
                  Primeiro mês grátis • Cancele quando quiser
                </p>
              </div>
            </div>

            {/* Segurança */}
            <div className="flex items-center gap-3 text-[#6B7280] text-sm">
              <Shield className="w-5 h-5" />
              <span>Pagamento seguro processado pelo Stripe</span>
            </div>
          </div>

          {/* Coluna Direita - Formulário */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-[#111827] mb-6">
              Dados de Pagamento
            </h2>
            
            <Elements stripe={stripePromise}>
              <CheckoutForm />
            </Elements>
          </div>
        </div>

        {/* FAQ Rápido */}
        <div className="mt-12 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-[#111827] mb-6">Perguntas Frequentes</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-[#111827] mb-1">
                Quando serei cobrado?
              </h4>
              <p className="text-[#6B7280] text-sm">
                Você terá 7 dias grátis para experimentar. A primeira cobrança acontecerá apenas após esse período.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-[#111827] mb-1">
                Posso cancelar a qualquer momento?
              </h4>
              <p className="text-[#6B7280] text-sm">
                Sim! Você pode cancelar sua assinatura a qualquer momento, sem taxas ou multas.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-[#111827] mb-1">
                Meus dados estão seguros?
              </h4>
              <p className="text-[#6B7280] text-sm">
                Sim! Usamos o Stripe, a plataforma de pagamentos mais segura do mundo. Não armazenamos dados do seu cartão.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
