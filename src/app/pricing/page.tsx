"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, Crown, Loader2, Sparkles, Zap } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";

// Carrega o Stripe no front-end
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/auth");
    } else {
      setUser(user);
    }
  };

  const handleSubscribe = async (priceId: string, planName: string) => {
    if (!user) {
      toast.error("Você precisa estar logado para assinar");
      router.push("/auth");
      return;
    }

    try {
      setLoading(priceId);

      // Criar sessão de checkout no backend
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId,
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao criar checkout");
      }

      // Carrega a Stripe no navegador
      const stripe = await stripePromise;

      if (!stripe) {
        throw new Error("Stripe não carregou");
      }

      // Redireciona para o Checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error("Erro ao processar assinatura:", error);
      toast.error(error.message || "Erro ao processar assinatura");
    } finally {
      setLoading(null);
    }
  };

  const features = [
    "Hábitos ilimitados",
    "Acompanhamento de sequências",
    "Estatísticas detalhadas",
    "Acesso à Comunidade",
    "Dicas personalizadas com IA",
    "Suporte prioritário",
    "Sem anúncios",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[oklch(0.45_0.15_265)] to-[oklch(0.40_0.18_280)] flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[oklch(0.45_0.15_265)] to-[oklch(0.40_0.18_280)] bg-clip-text text-transparent">
              Sequencia Premium
            </h1>
          </div>
          <Button
            onClick={() => router.push("/dashboard")}
            variant="ghost"
            className="text-gray-600 hover:text-gray-900"
          >
            Voltar ao Dashboard
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 sm:py-16 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-700">
              Oferta Especial de Lançamento
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Transforme seus hábitos,
            <br />
            <span className="bg-gradient-to-r from-[oklch(0.45_0.15_265)] to-[oklch(0.40_0.18_280)] bg-clip-text text-transparent">
              transforme sua vida
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Desbloqueie todo o potencial do Sequencia e alcance seus objetivos
            com recursos premium
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {/* Plano Mensal */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-gray-200 hover:border-[oklch(0.45_0.15_265)] transition-all duration-300">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Mensal</h3>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-5xl font-bold text-gray-900">R$ 19</span>
                <span className="text-gray-600">/mês</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Cancele quando quiser
              </p>
            </div>

            <ul className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[oklch(0.65_0.20_145)] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              onClick={() =>
                handleSubscribe(
                  process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY!,
                  "Mensal"
                )
              }
              disabled={loading !== null}
              className="w-full bg-gradient-to-r from-[oklch(0.45_0.15_265)] to-[oklch(0.40_0.18_280)] hover:from-[oklch(0.40_0.18_280)] hover:to-[oklch(0.45_0.15_265)] text-white font-semibold py-6 text-lg rounded-xl shadow-lg"
            >
              {loading === process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Crown className="w-5 h-5 mr-2" />
                  Assinar Plano Mensal
                </>
              )}
            </Button>
          </div>

          {/* Plano Anual */}
          <div className="bg-gradient-to-br from-[oklch(0.45_0.15_265)] to-[oklch(0.40_0.18_280)] rounded-3xl p-8 shadow-2xl border-2 border-[oklch(0.45_0.15_265)] relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-amber-400 text-amber-900 px-3 py-1 rounded-full text-xs font-bold">
              ECONOMIZE 37%
            </div>

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Anual</h3>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-5xl font-bold text-white">R$ 144</span>
                <span className="text-white/80">/ano</span>
              </div>
              <p className="text-sm text-white/70 mt-2">
                R$ 12/mês • Pague uma vez por ano
              </p>
            </div>

            <ul className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-[oklch(0.45_0.15_265)]" />
                  </div>
                  <span className="text-white">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              onClick={() =>
                handleSubscribe(
                  process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_YEARLY!,
                  "Anual"
                )
              }
              disabled={loading !== null}
              className="w-full bg-white hover:bg-gray-100 text-[oklch(0.45_0.15_265)] font-semibold py-6 text-lg rounded-xl shadow-lg"
            >
              {loading === process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_YEARLY ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  Assinar Plano Anual
                </>
              )}
            </Button>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Perguntas Frequentes
          </h3>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h4 className="font-semibold text-gray-900 mb-2">
                Posso cancelar a qualquer momento?
              </h4>
              <p className="text-gray-600">
                Sim! Você pode cancelar sua assinatura a qualquer momento
                através do portal de gerenciamento. Não há taxas de cancelamento.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h4 className="font-semibold text-gray-900 mb-2">
                Como funciona o teste gratuito?
              </h4>
              <p className="text-gray-600">
                Todos os novos usuários têm 7 dias de teste gratuito para
                experimentar todos os recursos premium antes de assinar.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h4 className="font-semibold text-gray-900 mb-2">
                Quais formas de pagamento são aceitas?
              </h4>
              <p className="text-gray-600">
                Aceitamos cartões de crédito e débito através do Stripe, uma
                plataforma segura e confiável de pagamentos.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/80 backdrop-blur-xl mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600">
          <p>© 2024 Sequencia. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

