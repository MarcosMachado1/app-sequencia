"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Logo } from "@/components/custom/logo";
import { Button } from "@/components/ui/button";
import { Flame, TrendingUp, Users, Zap, Loader2, CheckCircle, BarChart3, Target } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      router.push("/dashboard");
    } else {
      setChecking(false);
    }
  };

  const handleCTA = () => {
    router.push("/auth");
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-green-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-950">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-indigo-950/80 border-b border-purple-500/20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Logo />
          <Button
            onClick={handleCTA}
            variant="ghost"
            className="text-white/90 hover:text-white hover:bg-purple-500/10"
          >
            Entrar
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Hero Content */}
          <div className="text-center mb-20 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-400/30 mb-6">
              <Zap className="w-4 h-4 text-purple-300" />
              <span className="text-sm text-purple-200 font-medium">
                Hábitos + Comunidade = Transformação
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-purple-200 via-indigo-200 to-blue-200 bg-clip-text text-transparent">
                Construa Hábitos
              </span>
              <br />
              <span className="text-white">que Transformam Vidas</span>
            </h1>

            <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              Junte-se a uma comunidade que te apoia. Acompanhe sequências, celebre conquistas e cresça junto com pessoas comprometidas.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button
                onClick={handleCTA}
                size="lg"
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-2xl shadow-green-500/30 text-lg px-8 h-14 font-semibold"
              >
                Começar Agora - É Grátis
              </Button>
              <Button
                onClick={handleCTA}
                size="lg"
                variant="outline"
                className="border-purple-400/30 text-white hover:bg-purple-500/10 text-lg px-8 h-14"
              >
                Ver Como Funciona
              </Button>
            </div>

            <p className="text-sm text-white/50 pt-2">
              ✨ Sem cartão de crédito • Comece em 30 segundos
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mt-20">
            {/* Feature 1 - Hábitos */}
            <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-purple-500/10 to-indigo-500/5 border border-purple-400/20 hover:border-purple-400/40 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30">
                  <Flame className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">
                  Sequências Poderosas
                </h3>
                <p className="text-white/70 leading-relaxed">
                  Mantenha sua chama acesa todos os dias. Cada sequência fortalece seu compromisso e te aproxima dos seus objetivos.
                </p>
              </div>
            </div>

            {/* Feature 2 - Progresso */}
            <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-blue-500/5 border border-indigo-400/20 hover:border-indigo-400/40 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/30">
                  <BarChart3 className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">
                  Progresso Visual
                </h3>
                <p className="text-white/70 leading-relaxed">
                  Veja sua evolução com gráficos elegantes, calendários e estatísticas que mostram seu crescimento real.
                </p>
              </div>
            </div>

            {/* Feature 3 - Comunidade */}
            <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-blue-500/10 to-purple-500/5 border border-blue-400/20 hover:border-blue-400/40 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">
                  Comunidade Motivadora
                </h3>
                <p className="text-white/70 leading-relaxed">
                  Compartilhe conquistas, inspire e seja inspirado por uma comunidade comprometida com a transformação.
                </p>
              </div>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="mt-32">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Como Funciona
              </h2>
              <p className="text-xl text-white/70">
                Simples, poderoso e feito para você ter sucesso
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto shadow-lg shadow-green-500/30">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-xl font-bold text-white">Crie Seus Hábitos</h3>
                <p className="text-white/70">
                  Escolha hábitos que você quer desenvolver. Personalize com ícones e defina suas metas.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center mx-auto shadow-lg shadow-purple-500/30">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-xl font-bold text-white">Marque Diariamente</h3>
                <p className="text-white/70">
                  Todo dia, marque seus hábitos como completos. Construa sequências e veja seu progresso crescer.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/30">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-xl font-bold text-white">Compartilhe & Inspire</h3>
                <p className="text-white/70">
                  Celebre conquistas na comunidade, motive outros e receba apoio quando precisar.
                </p>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-32 text-center">
            <div className="inline-flex flex-col sm:flex-row gap-12 sm:gap-20 p-10 rounded-3xl bg-gradient-to-br from-purple-500/10 to-indigo-500/5 border border-purple-400/20">
              <div>
                <div className="text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                  98%
                </div>
                <div className="text-white/70">Taxa de Sucesso</div>
              </div>
              <div>
                <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent mb-2">
                  45+
                </div>
                <div className="text-white/70">Dias Médios de Sequência</div>
              </div>
              <div>
                <div className="text-5xl font-bold bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent mb-2">
                  10k+
                </div>
                <div className="text-white/70">Hábitos Criados</div>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="mt-32 text-center p-12 rounded-3xl bg-gradient-to-br from-purple-500/20 to-indigo-500/10 border border-purple-400/30">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Pronto para Transformar Sua Vida?
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Junte-se a milhares de pessoas que já estão construindo hábitos poderosos e alcançando seus objetivos.
            </p>
            <Button
              onClick={handleCTA}
              size="lg"
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-2xl shadow-green-500/30 text-lg px-12 h-16 font-semibold"
            >
              Começar Agora - É Grátis
            </Button>
            <p className="text-sm text-white/50 mt-4">
              ✨ Sem compromisso • Cancele quando quiser
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-500/20 py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <Logo />
              <p className="text-white/50 text-sm mt-2">
                Construa hábitos que transformam vidas
              </p>
            </div>
            <div className="text-white/40 text-sm text-center">
              <p>© 2024 Sequencia. Todos os direitos reservados.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}