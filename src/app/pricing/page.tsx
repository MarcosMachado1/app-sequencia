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
      const stripe: Stripe | null = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe não carregou");
      }

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