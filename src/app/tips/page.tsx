"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { 
  Flame, 
  Users, 
  Lightbulb, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Sparkles,
  TrendingUp,
  Target,
  Clock,
  Zap,
  Heart,
  Brain,
  Coffee
} from "lucide-react";

type Tip = {
  id: string;
  category: 'produtividade' | 'foco' | 'motivacao' | 'saude' | 'mindset';
  title: string;
  content: string;
  icon: string;
};

export default function TipsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dailyTip, setDailyTip] = useState<Tip | null>(null);
  const [allTips, setAllTips] = useState<Tip[]>([]);

  // Dicas personalizadas baseadas em hábitos
  const tips: Tip[] = [
    {
      id: '1',
      category: 'produtividade',
      title: 'Comece com a tarefa mais difícil',
      content: 'Ao acordar, identifique a tarefa mais desafiadora do dia e faça ela primeiro. Isso libera energia mental para o resto do dia.',
      icon: 'zap'
    },
    {
      id: '2',
      category: 'foco',
      title: 'Técnica Pomodoro',
      content: 'Trabalhe por 25 minutos com foco total, depois faça uma pausa de 5 minutos. Repita 4 vezes e faça uma pausa maior de 15-30 minutos.',
      icon: 'clock'
    },
    {
      id: '3',
      category: 'motivacao',
      title: 'Celebre pequenas vitórias',
      content: 'Cada hábito completado é uma vitória! Reconheça seu progresso diário, por menor que pareça. Consistência é a chave.',
      icon: 'sparkles'
    },
    {
      id: '4',
      category: 'saude',
      title: 'Hidratação é fundamental',
      content: 'Beba água logo ao acordar. Seu corpo passou horas sem hidratação. Mantenha uma garrafa sempre por perto durante o dia.',
      icon: 'heart'
    },
    {
      id: '5',
      category: 'mindset',
      title: 'Mentalidade de crescimento',
      content: 'Erros são oportunidades de aprendizado. Se você quebrou sua sequência, não desista - comece de novo hoje mesmo!',
      icon: 'brain'
    },
    {
      id: '6',
      category: 'produtividade',
      title: 'Regra dos 2 minutos',
      content: 'Se uma tarefa leva menos de 2 minutos, faça agora. Não deixe pequenas tarefas acumularem e virarem grandes problemas.',
      icon: 'zap'
    },
    {
      id: '7',
      category: 'foco',
      title: 'Elimine distrações digitais',
      content: 'Durante períodos de foco, coloque o celular em modo avião ou em outro cômodo. Notificações quebram sua concentração.',
      icon: 'target'
    },
    {
      id: '8',
      category: 'motivacao',
      title: 'Visualize seu sucesso',
      content: 'Dedique 5 minutos pela manhã para visualizar como será sua vida quando seus hábitos estiverem consolidados.',
      icon: 'sparkles'
    },
    {
      id: '9',
      category: 'saude',
      title: 'Movimento é vida',
      content: 'Faça pausas ativas a cada hora. Levante, alongue, caminhe. Seu corpo e mente agradecem.',
      icon: 'trending-up'
    },
    {
      id: '10',
      category: 'mindset',
      title: 'Gratidão diária',
      content: 'Antes de dormir, liste 3 coisas pelas quais você é grato hoje. Isso melhora seu humor e perspectiva de vida.',
      icon: 'heart'
    },
    {
      id: '11',
      category: 'produtividade',
      title: 'Prepare o dia anterior',
      content: 'Antes de dormir, defina suas 3 prioridades para o dia seguinte. Você acordará com clareza e propósito.',
      icon: 'coffee'
    },
    {
      id: '12',
      category: 'foco',
      title: 'Ambiente organizado',
      content: 'Um espaço limpo e organizado reduz distrações mentais. Dedique 5 minutos para organizar seu ambiente antes de começar.',
      icon: 'target'
    }
  ];

  useEffect(() => {
    checkAuth();
    loadDailyTip();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/auth");
    } else {
      setUser(user);
      setLoading(false);
    }
  };

  const loadDailyTip = () => {
    // Seleciona uma dica baseada no dia do ano
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const tipIndex = dayOfYear % tips.length;
    setDailyTip(tips[tipIndex]);
    setAllTips(tips);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const getUserName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name.split(' ')[0];
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return "Usuário";
  };

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      'zap': Zap,
      'clock': Clock,
      'sparkles': Sparkles,
      'heart': Heart,
      'brain': Brain,
      'target': Target,
      'trending-up': TrendingUp,
      'coffee': Coffee
    };
    const IconComponent = icons[iconName] || Lightbulb;
    return <IconComponent className="w-6 h-6" />;
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'produtividade': 'from-blue-500 to-blue-600',
      'foco': 'from-purple-500 to-purple-600',
      'motivacao': 'from-orange-500 to-orange-600',
      'saude': 'from-green-500 to-green-600',
      'mindset': 'from-pink-500 to-pink-600'
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[oklch(0.45_0.15_265)]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-gray-200 shadow-sm">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[oklch(0.45_0.15_265)] to-[oklch(0.40_0.18_280)] flex items-center justify-center">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[oklch(0.45_0.15_265)] to-[oklch(0.40_0.18_280)] bg-clip-text text-transparent">
              Sequencia
            </h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <Button
            onClick={() => router.push("/dashboard")}
            variant="ghost"
            className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <Flame className="w-5 h-5 mr-3" />
            Meus Hábitos
          </Button>
          <Button
            onClick={() => router.push("/tips")}
            variant="ghost"
            className="w-full justify-start bg-[oklch(0.45_0.15_265)]/10 text-[oklch(0.45_0.15_265)] hover:bg-[oklch(0.45_0.15_265)]/20"
          >
            <Lightbulb className="w-5 h-5 mr-3" />
            Dicas Diárias
          </Button>
          <Button
            onClick={() => router.push("/community")}
            variant="ghost"
            className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <Users className="w-5 h-5 mr-3" />
            Comunidade
          </Button>
          <Button
            onClick={() => router.push("/profile")}
            variant="ghost"
            className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <User className="w-5 h-5 mr-3" />
            Perfil
          </Button>
          <Button
            onClick={() => router.push("/settings")}
            variant="ghost"
            className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <Settings className="w-5 h-5 mr-3" />
            Configurações
          </Button>
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-gray-200">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Sidebar Mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-xl">
            {/* Logo */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[oklch(0.45_0.15_265)] to-[oklch(0.40_0.18_280)] flex items-center justify-center">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[oklch(0.45_0.15_265)] to-[oklch(0.40_0.18_280)] bg-clip-text text-transparent">
                  Sequencia
                </h1>
              </div>
              <Button
                onClick={() => setSidebarOpen(false)}
                variant="ghost"
                size="icon"
                className="text-gray-600"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              <Button
                onClick={() => {
                  router.push("/dashboard");
                  setSidebarOpen(false);
                }}
                variant="ghost"
                className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <Flame className="w-5 h-5 mr-3" />
                Meus Hábitos
              </Button>
              <Button
                onClick={() => {
                  router.push("/tips");
                  setSidebarOpen(false);
                }}
                variant="ghost"
                className="w-full justify-start bg-[oklch(0.45_0.15_265)]/10 text-[oklch(0.45_0.15_265)] hover:bg-[oklch(0.45_0.15_265)]/20"
              >
                <Lightbulb className="w-5 h-5 mr-3" />
                Dicas Diárias
              </Button>
              <Button
                onClick={() => {
                  router.push("/community");
                  setSidebarOpen(false);
                }}
                variant="ghost"
                className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <Users className="w-5 h-5 mr-3" />
                Comunidade
              </Button>
              <Button
                onClick={() => {
                  router.push("/profile");
                  setSidebarOpen(false);
                }}
                variant="ghost"
                className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <User className="w-5 h-5 mr-3" />
                Perfil
              </Button>
              <Button
                onClick={() => {
                  router.push("/settings");
                  setSidebarOpen(false);
                }}
                variant="ghost"
                className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <Settings className="w-5 h-5 mr-3" />
                Configurações
              </Button>
            </nav>

            {/* User Info */}
            <div className="p-4 border-t border-gray-200">
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Sair
              </Button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header Mobile */}
        <header className="lg:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm">
          <div className="px-4 h-16 flex items-center justify-between">
            <Button
              onClick={() => setSidebarOpen(true)}
              variant="ghost"
              size="icon"
              className="text-gray-600"
            >
              <Menu className="w-6 h-6" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[oklch(0.45_0.15_265)] to-[oklch(0.40_0.18_280)] flex items-center justify-center">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-[oklch(0.45_0.15_265)] to-[oklch(0.40_0.18_280)] bg-clip-text text-transparent">
                Sequencia
              </h1>
            </div>
            <div className="w-10" />
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 sm:px-6 py-8 max-w-4xl space-y-8">
            {/* Welcome */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Dicas Diárias 💡
              </h2>
              <p className="text-gray-600">
                Inspire-se com dicas personalizadas para seus hábitos
              </p>
            </div>

            {/* Daily Tip - Destaque */}
            {dailyTip && (
              <Card className={`bg-gradient-to-br ${getCategoryColor(dailyTip.category)} border-0 shadow-2xl`}>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                      {getIconComponent(dailyTip.icon)}
                    </div>
                    <div>
                      <p className="text-white/80 text-sm font-medium uppercase tracking-wide">
                        Dica do Dia
                      </p>
                      <CardTitle className="text-white text-2xl">
                        {dailyTip.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-white/90 text-lg leading-relaxed">
                    {dailyTip.content}
                  </p>
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <p className="text-white/70 text-sm">
                      💡 Esta dica foi selecionada especialmente para você hoje
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* All Tips Grid */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Todas as Dicas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allTips.map((tip) => (
                  <Card key={tip.id} className="bg-white border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getCategoryColor(tip.category)} flex items-center justify-center text-white flex-shrink-0`}>
                          {getIconComponent(tip.icon)}
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-1">
                            {tip.category}
                          </p>
                          <CardTitle className="text-gray-900 text-lg">
                            {tip.title}
                          </CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 leading-relaxed">
                        {tip.content}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Notification Info */}
            <Card className="bg-gradient-to-br from-[oklch(0.65_0.20_145)]/10 to-[oklch(0.65_0.20_145)]/5 border-[oklch(0.65_0.20_145)]/20">
              <CardContent className="py-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[oklch(0.65_0.20_145)] flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-gray-900 font-semibold mb-1">
                      Receba dicas pela manhã
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Ative as notificações nas Configurações para receber uma dica motivacional 
                      personalizada todos os dias pela manhã, baseada nos seus hábitos.
                    </p>
                    <Button
                      onClick={() => router.push("/settings")}
                      className="mt-3 bg-[oklch(0.65_0.20_145)] hover:bg-[oklch(0.60_0.22_155)] text-white"
                      size="sm"
                    >
                      Ir para Configurações
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
