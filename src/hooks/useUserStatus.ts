"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type UserStatus = {
  isPremium: boolean;
  isTrialActive: boolean;
  needsPayment: boolean;
  daysRemaining: number | null;
  loading: boolean;
};

export function useUserStatus(): UserStatus {
  const [status, setStatus] = useState<UserStatus>({
    isPremium: false,
    isTrialActive: false,
    needsPayment: false,
    daysRemaining: null,
    loading: true,
  });

  useEffect(() => {
    loadUserStatus();
  }, []);

  const loadUserStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setStatus({
          isPremium: false,
          isTrialActive: false,
          needsPayment: false,
          daysRemaining: null,
          loading: false,
        });
        return;
      }

      // Buscar perfil do usuário
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("is_premium, trial_started_at")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Erro ao buscar perfil:", error);
        setStatus(prev => ({ ...prev, loading: false }));
        return;
      }

      // Verificar se tem assinatura ativa no Stripe
      const { data: subscription } = await supabase
        .from("subscriptions")
        .select("status, current_period_end")
        .eq("user_id", user.id)
        .single();

      // Se tem assinatura ativa, é premium
      const hasActiveSubscription = subscription && ['active', 'trialing'].includes(subscription.status);

      // Se trial_started_at for NULL, ativar o teste agora
      if (!profile.trial_started_at) {
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ trial_started_at: new Date().toISOString() })
          .eq("id", user.id);

        if (updateError) {
          console.error("Erro ao ativar teste:", updateError);
        }

        // Recarregar perfil após ativação
        const { data: updatedProfile } = await supabase
          .from("profiles")
          .select("is_premium, trial_started_at")
          .eq("id", user.id)
          .single();

        if (updatedProfile) {
          calculateStatus(
            updatedProfile.is_premium || hasActiveSubscription || false,
            updatedProfile.trial_started_at
          );
        }
      } else {
        calculateStatus(
          profile.is_premium || hasActiveSubscription || false,
          profile.trial_started_at
        );
      }
    } catch (error) {
      console.error("Erro ao carregar status do usuário:", error);
      setStatus(prev => ({ ...prev, loading: false }));
    }
  };

  const calculateStatus = (isPremium: boolean, trialStartedAt: string) => {
    const now = new Date();
    const trialStart = new Date(trialStartedAt);
    const trialEnd = new Date(trialStart);
    trialEnd.setDate(trialEnd.getDate() + 7);

    const isTrialActive = !isPremium && now <= trialEnd;
    const needsPayment = !isPremium && now > trialEnd;

    // Calcular dias restantes
    let daysRemaining: number | null = null;
    if (isTrialActive) {
      const diffTime = trialEnd.getTime() - now.getTime();
      daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    setStatus({
      isPremium,
      isTrialActive,
      needsPayment,
      daysRemaining,
      loading: false,
    });
  };

  return status;
}
