"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Crown, Loader2 } from "lucide-react";
import { Logo } from "@/components/custom/logo";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

type PlanType = "monthly" | "annual";

export default function CheckoutPremiumPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("annual");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const plans = {
    monthly: {
      id: "price_mensal",
      name: "Plano Mensal",
      price: "R$ 4,99/mês",
      features: ["7 dias grátis", "Cancelamento a qualquer momento"],
    },
    annual: {
      id: "price_anual",
      name: "Plano Anual",
      price: "R$ 49,90/ano",
      savings: "50% off",
      features: ["7 dias grátis", "Economize R$ 10/ano", "🏆 Melhor Custo-Benefício"],
    },
  };

  const handleCheckout = async () => {
    if (!email) {
      alert("Por favor, preencha seu email");
      return;
    }

    try {
      setLoading(true);

      // Criar sessão de checkout
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: plans[selectedPlan].id,
          userId: "temp_user_id", // Será substituído após autenticação
          email,
          name,
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

      const { error } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error("Erro ao processar checkout:", error);
      alert(error.message || "Erro ao processar checkout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Logo />
          <Button
            onClick={() => router.push("/")}
            variant="ghost"
            className="text-gray-700 hover:text-indigo-600"
          >
            Voltar
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Entre para a Comunidade Sequencia
          </h1>
          <p className="text-gray-600 text-lg">
            Escolha seu plano e comece sua jornada premium hoje
          </p>
        </div>

        {/* Plan Selection */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Monthly Plan */}
          <div
            onClick={() => setSelectedPlan("monthly")}
            className={`bg-white p-6 rounded-2xl border-2 cursor-pointer transition-all ${
              selectedPlan === "monthly"
                ? "border-indigo-500 shadow-lg"
                : "border-gray-200 hover:border-indigo-300"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-sm text-indigo-600 font-medium mb-1">RECOMENDADO</div>
                <h3 className="text-xl font-bold text-gray-900">{plans.monthly.name}</h3>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedPlan === "monthly"
                    ? "border-indigo-500 bg-indigo-500"
                    : "border-gray-300"
                }`}
              >
                {selectedPlan === "monthly" && <Check className="w-4 h-4 text-white" />}
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-4">{plans.monthly.price}</div>
            <ul className="space-y-2">
              {plans.monthly.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-600">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Annual Plan */}
          <div
            onClick={() => setSelectedPlan("annual")}
            className={`bg-white p-6 rounded-2xl border-2 cursor-pointer transition-all relative ${
              selectedPlan === "annual"
                ? "border-purple-500 shadow-lg"
                : "border-gray-200 hover:border-purple-300"
            }`}
          >
            <div className="absolute -top-3 right-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-medium">
              {plans.annual.savings}
            </div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-sm text-purple-600 font-medium mb-1">DESTAQUE</div>
                <h3 className="text-xl font-bold text-gray-900">{plans.annual.name}</h3>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedPlan === "annual"
                    ? "border-purple-500 bg-purple-500"
                    : "border-gray-300"
                }`}
              >
                {selectedPlan === "annual" && <Check className="w-4 h-4 text-white" />}
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-4">{plans.annual.price}</div>
            <ul className="space-y-2">
              {plans.annual.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-600">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Checkout Form */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <Crown className="w-6 h-6 text-purple-500" />
            <h2 className="text-2xl font-bold text-gray-900">Informações de Pagamento</h2>
          </div>

          <div className="space-y-6">
            <div>
              <Label htmlFor="email">Email (obrigatório para login)</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2"
                required
              />
            </div>

            <div>
              <Label htmlFor="name">Nome (opcional)</Label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2"
              />
            </div>

            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-200">
              <p className="text-sm text-gray-700 text-center">
                Você será redirecionado para o checkout seguro do Stripe para adicionar seu cartão
              </p>
            </div>

            <Button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white h-12 text-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Processando...
                </>
              ) : (
                <>
                  Iniciar 7 Dias Grátis - Cobrar {plans[selectedPlan].price} após trial
                </>
              )}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              Ao assinar, concordo com os Termos e Política de Privacidade
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
