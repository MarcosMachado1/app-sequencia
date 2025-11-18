"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, Crown, Loader2, Sparkles, Zap } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { loadStripe, type Stripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
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

      // Criar sessão de checkout
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

      // Redirecionar para o Stripe Checkout
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe não carregou");
      }

      const { error } = await (stripe as any).redirectToCheckout({
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Escolha seu Plano
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Comece sua jornada premium hoje mesmo
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Plano Básico */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Básico</h3>
              <div className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                R$ 9,90<span className="text-lg font-normal text-slate-500">/mês</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-slate-600 dark:text-slate-300">Acesso básico</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-slate-600 dark:text-slate-300">Suporte por email</span>
              </li>
            </ul>

            <Button
              onClick={() => handleSubscribe("price_basico", "Básico")}
              disabled={loading === "price_basico"}
              className="w-full"
            >
              {loading === "price_basico" ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Assinar Básico
            </Button>
          </div>

          {/* Plano Premium */}
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-xl p-8 text-white relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-yellow-400 text-slate-900 px-4 py-2 rounded-full text-sm font-bold">
                MAIS POPULAR
              </div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Premium</h3>
              <div className="text-4xl font-bold mb-4">
                R$ 19,90<span className="text-lg font-normal opacity-80">/mês</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <Check className="w-5 h-5 text-yellow-400 mr-3" />
                <span>Tudo do Básico</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-yellow-400 mr-3" />
                <span>Acesso ilimitado</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-yellow-400 mr-3" />
                <span>Suporte prioritário</span>
              </li>
            </ul>

            <Button
              onClick={() => handleSubscribe("price_premium", "Premium")}
              disabled={loading === "price_premium"}
              className="w-full bg-white text-purple-600 hover:bg-white/90"
            >
              {loading === "price_premium" ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Assinar Premium
            </Button>
          </div>

          {/* Plano Pro */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Pro</h3>
              <div className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                R$ 39,90<span className="text-lg font-normal text-slate-500">/mês</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-3" />
                <span>Tudo do Premium</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-3" />
                <span>Recursos avançados</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-3" />
                <span>Suporte 24/7</span>
              </li>
            </ul>

            <Button
              onClick={() => handleSubscribe("price_pro", "Pro")}
              disabled={loading === "price_pro"}
              className="w-full"
            >
              {loading === "price_pro" ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Assinar Pro
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}