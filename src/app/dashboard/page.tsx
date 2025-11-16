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
  Check
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
        toast.success("Hábito desmarcado!");
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
        toast.success("🎉 Hábito completado!");
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#0A0A0A] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#0A0A0A]">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/5">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Meus Hábitos
          </h1>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={() => router.push("/community")}
              variant="ghost"
              size="icon"
              className="text-white/70 hover:text-white hover:bg-white/5"
            >
              <Users className="w-5 h-5" />
            </Button>
            <Button
              onClick={() => router.push("/settings")}
              variant="ghost"
              size="icon"
              className="text-white/70 hover:text-white hover:bg-white/5"
            >
              <Settings className="w-5 h-5" />
            </Button>
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="icon"
              className="text-white/70 hover:text-white hover:bg-white/5"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Maior Sequência</p>
                <p className="text-2xl font-bold text-white">
                  {Math.max(...habits.map(h => h.current_streak), 0)} dias
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <Check className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Completados Hoje</p>
                <p className="text-2xl font-bold text-white">
                  {habits.filter(h => h.completed_today).length}/{habits.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Total de Hábitos</p>
                <p className="text-2xl font-bold text-white">{habits.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Habits List */}
        <div className="space-y-4">
          {habits.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4">
                <Plus className="w-10 h-10 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Nenhum hábito ainda
              </h3>
              <p className="text-white/60 mb-6">
                Comece criando seu primeiro hábito!
              </p>
              <Button
                onClick={() => setShowCreateDialog(true)}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
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

        {/* Floating Action Button */}
        {habits.length > 0 && (
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-2xl shadow-indigo-500/25"
            size="icon"
          >
            <Plus className="w-6 h-6" />
          </Button>
        )}
      </main>

      {/* Create Habit Dialog */}
      <CreateHabitDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={loadHabits}
      />
    </div>
  );
}
