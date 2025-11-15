"use client";

import { useEffect, useState } from "react";
import { supabase, type Habit, type HabitLog } from "@/lib/supabase";
import { Logo } from "@/components/custom/logo";
import { Button } from "@/components/ui/button";
import { Plus, LogOut, Flame, TrendingUp, Calendar, Check } from "lucide-react";
import { toast } from "sonner";
import { format, startOfWeek, addDays, isToday, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
    loadHabits();
    loadLogs();
  }, []);

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = "/auth";
      return;
    }
    setUser(user);
    setLoading(false);
  };

  const loadHabits = async () => {
    const { data, error } = await supabase
      .from("habits")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Erro ao carregar hábitos");
      return;
    }
    setHabits(data || []);
  };

  const loadLogs = async () => {
    const { data, error } = await supabase
      .from("habit_logs")
      .select("*")
      .order("completed_at", { ascending: false });

    if (error) {
      toast.error("Erro ao carregar logs");
      return;
    }
    setLogs(data || []);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const toggleHabit = async (habitId: string) => {
    const today = new Date().toISOString();
    const existingLog = logs.find(
      (log) =>
        log.habit_id === habitId &&
        isSameDay(new Date(log.completed_at), new Date())
    );

    if (existingLog) {
      toast.info("Você já completou este hábito hoje!");
      return;
    }

    const { error } = await supabase.from("habit_logs").insert({
      habit_id: habitId,
      user_id: user.id,
      completed_at: today,
    });

    if (error) {
      toast.error("Erro ao registrar hábito");
      return;
    }

    toast.success("Hábito completado! 🔥");
    loadLogs();
  };

  const getStreak = (habitId: string) => {
    const habitLogs = logs
      .filter((log) => log.habit_id === habitId)
      .sort(
        (a, b) =>
          new Date(b.completed_at).getTime() -
          new Date(a.completed_at).getTime()
      );

    let streak = 0;
    let currentDate = new Date();

    for (const log of habitLogs) {
      const logDate = new Date(log.completed_at);
      if (
        isSameDay(logDate, currentDate) ||
        isSameDay(logDate, addDays(currentDate, -1))
      ) {
        streak++;
        currentDate = addDays(currentDate, -1);
      } else {
        break;
      }
    }

    return streak;
  };

  const isCompletedToday = (habitId: string) => {
    return logs.some(
      (log) =>
        log.habit_id === habitId &&
        isSameDay(new Date(log.completed_at), new Date())
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#0A0A0A] flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#0A0A0A]">
      {/* Header */}
      <header className="border-b border-white/5 backdrop-blur-xl bg-black/30">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Logo />
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="text-white/70 hover:text-white hover:bg-white/5"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {habits.length > 0 ? Math.max(...habits.map(h => getStreak(h.id))) : 0}
                </div>
                <div className="text-xs text-white/60">Maior Sequência</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{habits.length}</div>
                <div className="text-xs text-white/60">Hábitos Ativos</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {habits.filter(h => isCompletedToday(h.id)).length}
                </div>
                <div className="text-xs text-white/60">Hoje</div>
              </div>
            </div>
          </div>
        </div>

        {/* Habits List */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Seus Hábitos</h2>
          <Button
            onClick={() => toast.info("Funcionalidade em desenvolvimento")}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Hábito
          </Button>
        </div>

        {habits.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4">
              <Plus className="w-10 h-10 text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Nenhum hábito ainda
            </h3>
            <p className="text-white/60 mb-6">
              Crie seu primeiro hábito e comece sua jornada!
            </p>
            <Button
              onClick={() => toast.info("Funcionalidade em desenvolvimento")}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
            >
              Criar Primeiro Hábito
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {habits.map((habit) => {
              const streak = getStreak(habit.id);
              const completed = isCompletedToday(habit.id);

              return (
                <div
                  key={habit.id}
                  className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg"
                        style={{
                          background: `linear-gradient(135deg, ${habit.color}, ${habit.color}dd)`,
                        }}
                      >
                        {habit.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {habit.name}
                        </h3>
                        {habit.description && (
                          <p className="text-sm text-white/60">
                            {habit.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1 text-orange-400">
                            <Flame className="w-4 h-4" />
                            <span className="text-sm font-semibold">
                              {streak} dias
                            </span>
                          </div>
                          <span className="text-xs text-white/40">
                            {habit.frequency === "daily" ? "Diário" : "Semanal"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={() => toggleHabit(habit.id)}
                      disabled={completed}
                      className={`w-12 h-12 rounded-xl ${
                        completed
                          ? "bg-green-500/20 border-2 border-green-500"
                          : "bg-white/5 hover:bg-white/10 border-2 border-white/10"
                      }`}
                    >
                      {completed && <Check className="w-6 h-6 text-green-400" />}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
