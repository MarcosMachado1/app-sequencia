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

  return (
    <div 
      className={`
        bg-white rounded-2xl p-5 shadow-lg border-2 transition-all duration-300 cursor-pointer
        ${habit.completed_today 
          ? 'border-[oklch(0.65_0.20_145)] bg-gradient-to-br from-[oklch(0.65_0.20_145)]/5 to-white' 
          : 'border-gray-200 hover:border-[oklch(0.45_0.15_265)] hover:shadow-xl'
        }
      `}
      onClick={() => onToggle(habit.id, habit.completed_today)}
    >
      <div className="flex items-center justify-between">
        {/* Left: Checkbox + Info */}
        <div className="flex items-center gap-4 flex-1">
          {/* Checkbox Grande e Visível */}
          <div 
            className={`
              w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300
              ${habit.completed_today 
                ? 'bg-[oklch(0.65_0.20_145)] shadow-lg shadow-[oklch(0.65_0.20_145)]/30' 
                : 'bg-gray-100 hover:bg-[oklch(0.45_0.15_265)]/10'
              }
            `}
            onClick={(e) => {
              e.stopPropagation();
              onToggle(habit.id, habit.completed_today);
            }}
          >
            {habit.completed_today ? (
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <div className="w-7 h-7 rounded-lg border-3 border-gray-300" />
            )}
          </div>

          {/* Habit Info */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-0.5">
              {habit.title}
            </h3>
            {habit.description && (
              <p className="text-sm text-gray-500">{habit.description}</p>
            )}
          </div>
        </div>

        {/* Right: Streak + Actions */}
        <div className="flex items-center gap-3">
          {/* Streak Badge - DESTAQUE VISUAL */}
          {habit.current_streak > 0 && (
            <div className="flex items-center gap-2 bg-gradient-to-br from-[oklch(0.65_0.20_145)] to-[oklch(0.60_0.22_155)] rounded-xl px-3 py-2 shadow-md">
              <Flame className="w-5 h-5 text-white" />
              <div className="text-center">
                <p className="text-xl font-bold text-white leading-none">
                  {habit.current_streak}
                </p>
                <p className="text-[10px] text-white/80 leading-none mt-0.5">dias</p>
              </div>
            </div>
          )}

          {/* Menu Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-gray-900 hover:bg-gray-100"
              >
                <MoreVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white border-gray-200">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/habit/${habit.id}`);
                }}
                className="text-gray-700 hover:text-gray-900 focus:text-gray-900 focus:bg-gray-100"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Ver Estatísticas
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/habit/${habit.id}/edit`);
                }}
                className="text-gray-700 hover:text-gray-900 focus:text-gray-900 focus:bg-gray-100"
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                disabled={isDeleting}
                className="text-red-600 hover:text-red-700 focus:text-red-700 focus:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Stats Footer - Minimalista */}
      {habit.total_completions > 0 && (
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-gray-500">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">{habit.total_completions} vezes</span>
          </div>
          {habit.completed_today && (
            <div className="flex items-center gap-1.5 text-[oklch(0.65_0.20_145)]">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Completado hoje!</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
