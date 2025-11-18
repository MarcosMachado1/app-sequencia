"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Logo } from "@/components/custom/logo";
import { Button } from "@/components/ui/button";
import { Flame, TrendingUp, Users, Zap, Loader2, MessageCircle, BarChart3, Check, X, Star } from "lucide-react";
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

  const scrollToPlans = () => {
    const element = document.getElementById('plans');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Logo />
          <Button
            onClick={() => router.push("/auth")}
            variant="ghost"
            className="text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
          >
            Entrar
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-20 space-y-6">
            {/* Imagem placeholder do dashboard */}
            <div className="mb-8">
              <div className="mx-auto w-full max-w-4xl h-96 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-indigo-200">
                <div className="text-center">
                  <Users className="w-16 h-16 text-indigo-500 mx-auto mb-4" />
                  <p className="text-gray-600">Dashboard do app mostrando feed da comunidade com posts reais</p>
                </div>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight text-gray-900">
              A Força da Comunidade na Sua Evolução Pessoal 👥
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Transforme hábitos com a motivação de quem entende sua jornada. Não é só uma sequência - é uma rede de apoio.
            </p>

            <div className="pt-6">
              <Button
                onClick={scrollToPlans}
                size="lg"
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg text-lg px-8 h-14 rounded-xl"
              >
                Fazer Parte da Comunidade - 7 Dias Grátis
              </Button>
            </div>
          </div>

          {/* Seção O Diferencial da Comunidade */}
          <section className="mb-32">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                No Sequencia, Você Nunca Está Sozinho
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-6">👥</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Motivação Coletiva</h3>
                <p className="text-gray-600 leading-relaxed">
                  Veja João comemorando 100 dias de exercício e sinta: 'Eu também consigo!' Ver as conquistas dos outros é o combustível para suas próprias sequências.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-6">💬</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Apoio Quando Mais Precisa</h3>
                <p className="text-gray-600 leading-relaxed">
                  Poste 'hoje quase quebrei a sequência' e receba mensagens de incentivo da comunidade. Nos dias difíceis, você tem uma torcida.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-6">📈</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Crescimento Compartilhado</h3>
                <p className="text-gray-600 leading-relaxed">
                  Desafie amigos, comemore milestones juntos, compartilhe dicas. Sua evolução inspira outros, e a deles motiva você.
                </p>
              </div>
            </div>
          </section>

          {/* Seção Como Funciona a Comunidade */}
          <section className="mb-32">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-8">
                  Como Funciona a Comunidade
                </h2>
                <ul className="space-y-6">
                  <li className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-gray-600">Poste foto do seu progresso #SequenciaBoa</p>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-gray-600">Comente e apoie as conquistas dos outros</p>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-gray-600">Receba notificações quando amigos completarem hábitos</p>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-gray-600">Participe de grupos por interesse: exercício, estudo, meditação</p>
                  </li>
                </ul>
              </div>
              <div>
                <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl p-8 border-2 border-dashed border-indigo-200">
                  <div className="text-center">
                    <Users className="w-16 h-16 text-indigo-500 mx-auto mb-4" />
                    <p className="text-gray-600">Feed real do app com posts</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Seção Planos */}
          <section id="plans" className="mb-32">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Escolha Seu Plano de Comunidade
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Card Gratuito */}
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Versão Solo</h3>
                <div className="text-4xl font-bold text-gray-900 mb-6">Grátis</div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-gray-600">Até 3 hábitos básicos</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-gray-600">Apenas seu progresso pessoal</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <X className="w-5 h-5 text-red-500" />
                    <span className="text-gray-600">SEM ACESSO À COMUNIDADE</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <X className="w-5 h-5 text-red-500" />
                    <span className="text-gray-600">Sem gráficos avançados</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <X className="w-5 h-5 text-red-500" />
                    <span className="text-gray-600">Com anúncios leves</span>
                  </li>
                </ul>
                <Button
                  onClick={() => router.push("/auth")}
                  variant="outline"
                  className="w-full bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200"
                >
                  Começar Sozinho
                </Button>
              </div>

              {/* Card Premium */}
              <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-indigo-200 relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                    🏆 COMUNIDADE INCLUÍDA
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Versão Comunidade</h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">R$ 4,99/mês</div>
                <div className="text-sm text-gray-500 mb-6">ou R$ 49,90/ano (50% off)</div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-gray-600">Hábitos ilimitados</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-gray-600">Gráficos completos + calendário</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 font-bold" />
                    <span className="text-gray-900 font-medium">ACESSO COMPLETO À COMUNIDADE</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-gray-600">Postar e interagir com fotos/textos</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-gray-600">Ver sequências dos amigos</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-gray-600">Desafios em grupo</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-gray-600">Notificações inteligentes</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-gray-600">Sem anúncios</span>
                  </li>
                </ul>
                <Button
                  onClick={() => router.push("/pricing")}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg"
                >
                  Entrar na Comunidade - 7 Dias Grátis
                </Button>
              </div>
            </div>
          </section>

          {/* Seção Prova Social Viva */}
          <section className="mb-32">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                A Comunidade em Ação Agora
              </h2>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">M</span>
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium">Maria postou:</p>
                      <p className="text-gray-600">Dia 45 de meditação! 🧘‍♀️ #sequenciaBoa</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 ml-14">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 font-medium text-sm">J</span>
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium">João comentou:</p>
                      <p className="text-gray-600">'Você me inspirou a começar!'</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">A</span>
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium">Ana compartilhou:</p>
                      <p className="text-gray-600">30 dias bebendo água! 💧</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">1.243 sequências mantidas esta semana pela comunidade</div>
              </div>
            </div>
          </section>

          {/* Seção FAQ */}
          <section className="mb-32">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Perguntas Frequentes sobre a Comunidade
              </h2>
            </div>

            <div className="max-w-3xl mx-auto space-y-8">
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Posso participar da comunidade no plano gratuito?</h3>
                <p className="text-gray-600">O plano gratuito oferece apenas acesso limitado ao seu próprio progresso. Para participar da comunidade completa, você precisa do plano premium.</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Como funcionam os posts e interações?</h3>
                <p className="text-gray-600">Você pode postar fotos e textos sobre seu progresso, comentar nas publicações dos outros e receber notificações quando amigos completam hábitos.</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Posso desafiar amigos específicos?</h3>
                <p className="text-gray-600">Sim! Você pode criar desafios personalizados e convidar amigos específicos para participar, tornando a motivação ainda mais pessoal.</p>
              </div>
            </div>
          </section>

          {/* Chamada Final */}
          <section className="text-center mb-32">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Junte-se a milhares de pessoas transformando hábitos juntas. A sequência é mais forte quando compartilhada.
            </h2>
            <Button
              onClick={() => router.push("/auth")}
              size="lg"
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg text-lg px-8 h-14 rounded-xl"
            >
              Quero Fazer Parte - 7 Dias Grátis
            </Button>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 bg-white">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2024 Sequencia. Construa hábitos que transformam.</p>
        </div>
      </footer>
    </div>
  );
}