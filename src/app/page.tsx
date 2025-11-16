"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Logo } from "@/components/custom/logo";
import { Button } from "@/components/ui/button";
import { Flame, TrendingUp, Users, Zap, Loader2, CheckCircle, BarChart3, Target, Bell, BookOpen, MessageSquare } from "lucide-react";
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

      {/* Seção 1: Hero Section */}
      <main className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Hero Content */}
          <div className="text-center mb-20 space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-purple-200 via-indigo-200 to-blue-200 bg-clip-text text-transparent">
                Sequencia:
              </span>
              <br />
              <span className="text-white">O rastreador de hábitos que te conecta ao sucesso.</span>
            </h1>

            <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              Crie rotinas inquebráveis e encontre motivação na maior comunidade de desenvolvimento pessoal.
            </p>

            {/* Mockup do Aplicativo */}
            <div className="py-8">
              <div className="relative max-w-sm mx-auto">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-purple-500/30 border-4 border-purple-400/30">
                  <div className="bg-gradient-to-br from-indigo-900 to-purple-900 p-8 aspect-[9/16]">
                    <div className="text-left space-y-4">
                      <div className="text-white/90 text-sm font-medium">Meus Hábitos</div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                          <CheckCircle className="w-6 h-6 text-green-400" />
                          <span className="text-white text-sm">Meditar 10min</span>
                          <span className="ml-auto text-green-400 text-xs font-bold">🔥 15</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                          <CheckCircle className="w-6 h-6 text-green-400" />
                          <span className="text-white text-sm">Ler 30min</span>
                          <span className="ml-auto text-green-400 text-xs font-bold">🔥 8</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                          <div className="w-6 h-6 rounded-full border-2 border-white/30"></div>
                          <span className="text-white/70 text-sm">Exercício</span>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-white/10">
                        <div className="text-white/90 text-xs font-medium mb-2">Comunidade</div>
                        <div className="flex items-center gap-2 text-xs text-white/70">
                          <Users className="w-4 h-4" />
                          <span>1.2k pessoas online agora</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button
                onClick={handleCTA}
                size="lg"
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-2xl shadow-green-500/30 text-lg px-8 h-14 font-semibold"
              >
                Comece seu Teste Gratuito de 7 Dias
              </Button>
            </div>

            <p className="text-sm text-white/50 pt-2">
              ✨ Sem cartão de crédito • Comece em 30 segundos
            </p>
          </div>

          {/* Seção 2: Proposta de Valor Única (Hábito + Comunidade) */}
          <div className="grid md:grid-cols-2 gap-8 mt-32">
            {/* Bloco 1: Foco no Hábito */}
            <div className="group relative p-10 rounded-3xl bg-gradient-to-br from-purple-500/10 to-indigo-500/5 border border-purple-400/20 hover:border-purple-400/40 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-4 text-white">
                  Rastreie seu dia em 3 segundos.
                </h3>
                <p className="text-white/70 leading-relaxed text-lg">
                  Design minimalista e intuitivo. Marque seus hábitos com um toque e mantenha sua sequência (streak) viva sem distrações.
                </p>
              </div>
            </div>

            {/* Bloco 2: Foco na Comunidade */}
            <div className="group relative p-10 rounded-3xl bg-gradient-to-br from-blue-500/10 to-purple-500/5 border border-blue-400/20 hover:border-blue-400/40 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-4 text-white">
                  A Força da Comunidade.
                </h3>
                <p className="text-white/70 leading-relaxed text-lg">
                  Compartilhe seu progresso, receba dicas de especialistas e encontre pessoas que te motivam a não falhar. O sucesso é melhor quando é compartilhado.
                </p>
              </div>
            </div>
          </div>

          {/* Seção 3: Recursos (Benefícios) */}
          <div className="mt-32">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Recursos Poderosos
              </h2>
              <p className="text-xl text-white/70">
                Tudo que você precisa para construir hábitos duradouros
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Recurso 1: Sequências Visuais */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-indigo-500/5 border border-purple-400/20 hover:border-purple-400/40 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">
                  Sequências (Streaks) Visuais
                </h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  Acompanhe suas sequências com gráficos visuais que motivam você a continuar todos os dias.
                </p>
              </div>

              {/* Recurso 2: Lembretes Inteligentes */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-blue-500/5 border border-indigo-400/20 hover:border-indigo-400/40 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/30">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">
                  Lembretes Inteligentes
                </h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  Receba notificações personalizadas no momento certo para nunca perder um dia.
                </p>
              </div>

              {/* Recurso 3: Biblioteca de Dicas (IA) */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/5 border border-blue-400/20 hover:border-blue-400/40 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">
                  Biblioteca de Dicas (IA)
                </h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  Acesse dicas personalizadas impulsionadas por IA para otimizar seus hábitos.
                </p>
              </div>

              {/* Recurso 4: Fóruns de Motivação */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/5 border border-purple-400/20 hover:border-purple-400/40 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">
                  Fóruns de Motivação
                </h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  Participe de fóruns e receba suporte de uma comunidade engajada e motivadora.
                </p>
              </div>
            </div>
          </div>

          {/* Seção 4: Preço */}
          <div className="mt-32">
            <div className="text-center p-12 rounded-3xl bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-400/30">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Comece a construir seu futuro hoje.
              </h2>
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-500/20 border border-green-400/40 mb-6">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span className="text-lg text-green-200 font-semibold">
                  7 Dias de Teste Gratuito. Sem compromisso.
                </span>
              </div>
              <p className="text-2xl text-white/90 mb-8">
                <span className="font-bold">Sequencia Premium:</span> R$ 19,90/mês após o teste.
              </p>
              <Button
                onClick={handleCTA}
                size="lg"
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-2xl shadow-green-500/30 text-lg px-12 h-16 font-semibold"
              >
                Quero 7 Dias Grátis
              </Button>
              <p className="text-sm text-white/50 mt-4">
                ✨ Cancele quando quiser • Sem taxas ocultas
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Seção 5: Footer */}
      <footer className="border-t border-purple-500/20 py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <Logo />
              <p className="text-white/50 text-sm mt-2">
                Construa hábitos que transformam vidas
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                Termos de Uso
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                Política de Privacidade
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                Instagram
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                Twitter
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                LinkedIn
              </a>
            </div>
          </div>
          
          <div className="text-center mt-8 text-white/40 text-sm">
            <p>© 2024 Sequencia. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
