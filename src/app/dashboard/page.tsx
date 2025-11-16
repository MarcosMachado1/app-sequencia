"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Flame, 
  TrendingUp, 
  Settings, 
  Users,
  LogOut,
  Loader2,
  Check,
  Sparkles,
  Lightbulb,
  User,
  Menu,
  X
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CreateHabitDialog } from "@/components/dashboard/create-habit-dialog";
import { HabitCard } from "@/components/dashboard/habit-card";

type Habit = {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  icon?: string;
  color?: string;
  frequency?: string;
  is_active: boolean;
  created_at: string;
};

type HabitLog = {
  id: string;
  habit_id: string;
  completed_at: string;
};

type HabitWithStats = Habit & {
  current_streak: number;
  completed_today: boolean;
  total_completions: number;
};

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [habits, setHabits] = useState<HabitWithStats[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [confettiElements, setConfettiElements] = useState<number[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    checkAuth();
    loadHabits();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/auth");
    } else {
      setUser(user);
    }
  };

  const loadHabits = async () => {
    try {
      setLoading(true);
      
      // Buscar hábitos
      const { data: habitsData, error: habitsError } = await supabase
        .from("habits")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (habitsError) throw habitsError;

      // Buscar logs de hoje
      const today = new Date().toISOString().split("T")[0];
      const { data: logsData, error: logsError } = await supabase
        .from("habit_logs")
        .select("*")
        .gte("completed_at", `${today}T00:00:00`)
        .lte("completed_at", `${today}T23:59:59`);

      if (logsError) throw logsError;

      // Buscar todos os logs para calcular streaks
      const { data: allLogsData, error: allLogsError } = await supabase
        .from("habit_logs")
        .select("*")
        .order("completed_at", { ascending: false });

      if (allLogsError) throw allLogsError;

      // Combinar dados
      const habitsWithStats: HabitWithStats[] = (habitsData || []).map((habit) => {
        const completedToday = logsData?.some(log => log.habit_id === habit.id) || false;
        const habitLogs = allLogsData?.filter(log => log.habit_id === habit.id) || [];
        const streak = calculateStreak(habitLogs);
        
        return {
          ...habit,
          current_streak: streak,
          completed_today: completedToday,
          total_completions: habitLogs.length
        };
      });

      setHabits(habitsWithStats);
    } catch (error: any) {
      console.error("Erro ao carregar hábitos:", error);
      toast.error("Erro ao carregar hábitos");
    } finally {
      setLoading(false);
    }
  };

  const calculateStreak = (logs: HabitLog[]): number => {
    if (logs.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Ordenar logs por data decrescente
    const sortedLogs = [...logs].sort((a, b) => 
      new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
    );

    let currentDate = new Date(today);
    
    for (const log of sortedLogs) {
      const logDate = new Date(log.completed_at);
      logDate.setHours(0, 0, 0, 0);
      
      const diffDays = Math.floor((currentDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0 || diffDays === 1) {
        streak++;
        currentDate = new Date(logDate);
      } else {
        break;
      }
    }

    return streak;
  };

  const triggerConfetti = () => {
    const newConfetti = Array.from({ length: 12 }, (_, i) => i);
    setConfettiElements(newConfetti);
    setTimeout(() => setConfettiElements([]), 1000);
  };

  const handleToggleHabit = async (habitId: string, completed: boolean) => {
    try {
      if (completed) {
        // Remover log de hoje
        const today = new Date().toISOString().split("T")[0];
        const { error } = await supabase
          .from("habit_logs")
          .delete()
          .eq("habit_id", habitId)
          .gte("completed_at", `${today}T00:00:00`)
          .lte("completed_at", `${today}T23:59:59`);

        if (error) throw error;
        toast.success("Hábito desmarcado");
      } else {
        // Adicionar log de hoje
        const { error } = await supabase
          .from("habit_logs")
          .insert({
            habit_id: habitId,
            user_id: user.id,
            completed_at: new Date().toISOString()
          });

        if (error) throw error;
        
        // Animação de confete sutil
        triggerConfetti();
        toast.success("✨ Parabéns! Hábito completado", {
          duration: 2000,
        });
      }

      loadHabits();
    } catch (error: any) {
      console.error("Erro ao atualizar hábito:", error);
      toast.error("Erro ao atualizar hábito");
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[oklch(0.45_0.15_265)] animate-spin" />
      </div>
    );
  }

  const totalStreak = Math.max(...habits.map(h => h.current_streak), 0);
  const completedToday = habits.filter(h => h.completed_today).length;
  const completionRate = habits.length > 0 ? Math.round((completedToday / habits.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* Confetti Animation */}
      {confettiElements.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {confettiElements.map((i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '50%',
                animationDelay: `${Math.random() * 0.3}s`,
              }}
            >
              <Sparkles className="w-4 h-4 text-[oklch(0.65_0.20_145)]" />
            </div>
          ))}
        </div>
      )}

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
            className="w-full justify-start bg-[oklch(0.45_0.15_265)]/10 text-[oklch(0.45_0.15_265)] hover:bg-[oklch(0.45_0.15_265)]/20"
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
                className="w-full justify-start bg-[oklch(0.45_0.15_265)]/10 text-[oklch(0.45_0.15_265)] hover:bg-[oklch(0.45_0.15_265)]/20"
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
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-4xl">
            {/* Welcome Message */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Olá {getUserName()}, bem-vindo de volta! 👋
              </h2>
              <p className="text-gray-600">
                Continue construindo seus hábitos vencedores
              </p>
            </div>

            {/* Stats Overview - Destaque para Streak */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {/* Maior Sequência - DESTAQUE PRINCIPAL */}
              <div className="sm:col-span-2 bg-gradient-to-br from-[oklch(0.45_0.15_265)] to-[oklch(0.40_0.18_280)] rounded-3xl p-6 sm:p-8 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm font-medium mb-2">Maior Sequência</p>
                    <div className="flex items-baseline gap-3">
                      <p className="text-5xl sm:text-6xl font-bold text-white">
                        {totalStreak}
                      </p>
                      <span className="text-2xl text-white/80">dias</span>
                    </div>
                    <p className="text-white/60 text-sm mt-2">Continue assim! 🔥</p>
                  </div>
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <Flame className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>
                </div>
              </div>

              {/* Progresso de Hoje */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="w-12 h-12 rounded-xl bg-[oklch(0.65_0.20_145)] flex items-center justify-center mb-3">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-gray-600 text-sm mb-1">Hoje</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {completedToday}/{habits.length}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                    <div 
                      className="bg-[oklch(0.65_0.20_145)] h-2 rounded-full transition-all duration-500"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Habits List - UX Otimizada */}
            <div className="space-y-3">
              {habits.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl shadow-lg border border-gray-200">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[oklch(0.45_0.15_265)]/10 to-[oklch(0.40_0.18_280)]/10 flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-10 h-10 text-[oklch(0.45_0.15_265)]" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Nenhum hábito ainda
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Comece criando seu primeiro hábito!
                  </p>
                  <Button
                    onClick={() => setShowCreateDialog(true)}
                    className="bg-[oklch(0.45_0.15_265)] hover:bg-[oklch(0.40_0.18_280)] text-white shadow-lg"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Primeiro Hábito
                  </Button>
                </div>
              ) : (
                <>
                  {habits.map((habit) => (
                    <HabitCard
                      key={habit.id}
                      habit={habit}
                      onToggle={handleToggleHabit}
                      onRefresh={loadHabits}
                    />
                  ))}
                </>
              )}
            </div>

            {/* Floating Action Button - Acesso Rápido */}
            {habits.length > 0 && (
              <Button
                onClick={() => setShowCreateDialog(true)}
                className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[oklch(0.45_0.15_265)] hover:bg-[oklch(0.40_0.18_280)] text-white shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300"
                size="icon"
              >
                <Plus className="w-6 h-6 sm:w-7 sm:h-7" />
              </Button>
            )}
          </div>
        </main>
      </div>

      {/* Create Habit Dialog */}
      <CreateHabitDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={loadHabits}
      />
    </div>
  );
}
