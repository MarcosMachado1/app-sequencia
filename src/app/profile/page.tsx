"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { 
  Flame, 
  Users, 
  Lightbulb, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  TrendingUp,
  Calendar,
  Award,
  Target
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalHabits: 0,
    activeStreak: 0,
    totalCompletions: 0,
    bestStreak: 0
  });

  useEffect(() => {
    checkAuth();
    loadStats();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/auth");
    } else {
      setUser(user);
    }
  };

  const loadStats = async () => {
    try {
      // Buscar hábitos
      const { data: habits, error: habitsError } = await supabase
        .from("habits")
        .select("*")
        .eq("is_active", true);

      if (habitsError) throw habitsError;

      // Buscar logs
      const { data: logs, error: logsError } = await supabase
        .from("habit_logs")
        .select("*")
        .order("completed_at", { ascending: false });

      if (logsError) throw logsError;

      // Calcular estatísticas
      const totalHabits = habits?.length || 0;
      const totalCompletions = logs?.length || 0;

      // Calcular streak atual (simplificado)
      const today = new Date().toISOString().split("T")[0];
      const todayLogs = logs?.filter(log => 
        log.completed_at.startsWith(today)
      ) || [];
      
      setStats({
        totalHabits,
        activeStreak: todayLogs.length,
        totalCompletions,
        bestStreak: Math.max(todayLogs.length, 0)
      });
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const getUserName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return "Usuário";
  };

  const getUserInitials = () => {
    const name = getUserName();
    return name.substring(0, 2).toUpperCase();
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
            className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100"
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
            className="w-full justify-start bg-[oklch(0.45_0.15_265)]/10 text-[oklch(0.45_0.15_265)] hover:bg-[oklch(0.45_0.15_265)]/20"
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
                className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100"
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
                className="w-full justify-start bg-[oklch(0.45_0.15_265)]/10 text-[oklch(0.45_0.15_265)] hover:bg-[oklch(0.45_0.15_265)]/20"
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
            {/* Profile Header */}
            <div className="bg-gradient-to-br from-[oklch(0.45_0.15_265)] to-[oklch(0.40_0.18_280)] rounded-3xl p-8 shadow-2xl">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">
                    {getUserInitials()}
                  </span>
                </div>
                <div className="text-center sm:text-left flex-1">
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {getUserName()}
                  </h2>
                  <p className="text-white/80">
                    {user?.email}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 justify-center sm:justify-start">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                      🔥 Membro desde {new Date(user?.created_at).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-white border-gray-200 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[oklch(0.45_0.15_265)] to-[oklch(0.40_0.18_280)] flex items-center justify-center mb-3">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mb-1">
                      {stats.totalHabits}
                    </p>
                    <p className="text-gray-600 text-sm">Hábitos Ativos</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[oklch(0.65_0.20_145)] to-[oklch(0.60_0.22_155)] flex items-center justify-center mb-3">
                      <Flame className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mb-1">
                      {stats.activeStreak}
                    </p>
                    <p className="text-gray-600 text-sm">Sequência Atual</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-3">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mb-1">
                      {stats.totalCompletions}
                    </p>
                    <p className="text-gray-600 text-sm">Total Completo</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-3">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mb-1">
                      {stats.bestStreak}
                    </p>
                    <p className="text-gray-600 text-sm">Melhor Sequência</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Achievements */}
            <Card className="bg-white border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-[oklch(0.45_0.15_265)]" />
                  Conquistas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="text-3xl mb-2">🎯</span>
                    <p className="text-gray-900 font-medium text-sm text-center">Primeiro Hábito</p>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="text-3xl mb-2">🔥</span>
                    <p className="text-gray-900 font-medium text-sm text-center">7 Dias Seguidos</p>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="text-3xl mb-2">⭐</span>
                    <p className="text-gray-900 font-medium text-sm text-center">30 Dias Seguidos</p>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl border border-gray-200 opacity-50">
                    <span className="text-3xl mb-2">🏆</span>
                    <p className="text-gray-500 font-medium text-sm text-center">100 Completados</p>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl border border-gray-200 opacity-50">
                    <span className="text-3xl mb-2">💎</span>
                    <p className="text-gray-500 font-medium text-sm text-center">365 Dias</p>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl border border-gray-200 opacity-50">
                    <span className="text-3xl mb-2">👑</span>
                    <p className="text-gray-500 font-medium text-sm text-center">Mestre dos Hábitos</p>
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
