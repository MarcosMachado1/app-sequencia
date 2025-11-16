"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Target, 
  Flame, 
  TrendingUp,
  MoreVertical,
  Trash2,
  Edit,
  BarChart3
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

type HabitCardProps = {
  habit: {
    id: string;
    title: string;
    description?: string;
    icon?: string;
    color?: string;
    current_streak: number;
    completed_today: boolean;
    total_completions: number;
  };
  onToggle: (habitId: string, completed: boolean) => void;
  onRefresh: () => void;
};

export function HabitCard({ habit, onToggle, onRefresh }: HabitCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir este hábito?")) return;

    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from("habits")
        .update({ is_active: false })
        .eq("id", habit.id);

      if (error) throw error;

      toast.success("Hábito excluído com sucesso!");
      onRefresh();
    } catch (error: any) {
      console.error("Erro ao excluir hábito:", error);
      toast.error("Erro ao excluir hábito");
    } finally {
      setIsDeleting(false);
    }
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return "from-purple-500 to-pink-500";
    if (streak >= 14) return "from-orange-500 to-red-500";
    if (streak >= 7) return "from-yellow-500 to-orange-500";
    return "from-green-500 to-emerald-500";
  };

  return (
    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4 flex-1">
          {/* Icon */}
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ 
              background: habit.color || "#6366f1",
              boxShadow: `0 8px 24px ${habit.color || "#6366f1"}40`
            }}
          >
            <Target className="w-6 h-6 text-white" />
          </div>

          {/* Info */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-1">
              {habit.title}
            </h3>
            {habit.description && (
              <p className="text-sm text-white/60">{habit.description}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-white/60 hover:text-white hover:bg-white/5"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#1A1A2E] border-white/10">
            <DropdownMenuItem
              onClick={() => router.push(`/habit/${habit.id}`)}
              className="text-white/80 hover:text-white focus:text-white focus:bg-white/5"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Ver Estatísticas
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push(`/habit/${habit.id}/edit`)}
              className="text-white/80 hover:text-white focus:text-white focus:bg-white/5"
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-red-400 hover:text-red-300 focus:text-red-300 focus:bg-red-500/10"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-6 mb-4">
        {/* Streak */}
        <div className="flex items-center gap-2">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getStreakColor(habit.current_streak)} flex items-center justify-center`}>
            <Flame className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">
              {habit.current_streak}
            </p>
            <p className="text-xs text-white/60">dias seguidos</p>
          </div>
        </div>

        {/* Total */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">
              {habit.total_completions}
            </p>
            <p className="text-xs text-white/60">vezes completo</p>
          </div>
        </div>
      </div>

      {/* Checkbox */}
      <div className="flex items-center gap-3 pt-4 border-t border-white/5">
        <Checkbox
          id={`habit-${habit.id}`}
          checked={habit.completed_today}
          onCheckedChange={() => onToggle(habit.id, habit.completed_today)}
          className="w-6 h-6 border-2 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
        />
        <label
          htmlFor={`habit-${habit.id}`}
          className="text-sm text-white/80 cursor-pointer select-none"
        >
          {habit.completed_today ? "✅ Completado hoje!" : "Marcar como completo"}
        </label>
      </div>
    </div>
  );
}
