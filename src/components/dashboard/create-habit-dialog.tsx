"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type CreateHabitDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
};

const COLORS = [
  { name: "Roxo", value: "#6366f1" },
  { name: "Azul", value: "#3b82f6" },
  { name: "Verde", value: "#10b981" },
  { name: "Amarelo", value: "#f59e0b" },
  { name: "Vermelho", value: "#ef4444" },
  { name: "Rosa", value: "#ec4899" },
  { name: "Laranja", value: "#f97316" },
  { name: "Ciano", value: "#06b6d4" },
];

const ICONS = [
  "target",
  "flame",
  "heart",
  "book",
  "dumbbell",
  "coffee",
  "moon",
  "sun",
];

export function CreateHabitDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateHabitDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "target",
    color: "#6366f1",
    frequency: "daily",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("Digite um nome para o hábito");
      return;
    }

    try {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { error } = await supabase.from("habits").insert({
        user_id: user.id,
        title: formData.title,
        description: formData.description || null,
        icon: formData.icon,
        color: formData.color,
        frequency: formData.frequency,
        is_active: true,
      });

      if (error) throw error;

      toast.success("Hábito criado com sucesso! 🎉");
      setFormData({
        title: "",
        description: "",
        icon: "target",
        color: "#6366f1",
        frequency: "daily",
      });
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      console.error("Erro ao criar hábito:", error);
      toast.error(error.message || "Erro ao criar hábito");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1A1A2E] border-white/10 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Criar Novo Hábito</DialogTitle>
          <DialogDescription className="text-white/60">
            Defina um novo hábito para acompanhar diariamente
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="title">Nome do Hábito *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Ex: Ler 30 minutos"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
              required
            />
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Adicione detalhes sobre seu hábito..."
              className="bg-white/5 border-white/10 text-white placeholder:text-white/40 resize-none"
              rows={3}
            />
          </div>

          {/* Cor */}
          <div className="space-y-2">
            <Label>Cor</Label>
            <div className="grid grid-cols-8 gap-2">
              {COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: color.value })}
                  className={`w-10 h-10 rounded-lg transition-all ${
                    formData.color === color.value
                      ? "ring-2 ring-white ring-offset-2 ring-offset-[#1A1A2E] scale-110"
                      : "hover:scale-105"
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Frequência */}
          <div className="space-y-2">
            <Label htmlFor="frequency">Frequência</Label>
            <Select
              value={formData.frequency}
              onValueChange={(value) =>
                setFormData({ ...formData, frequency: value })
              }
            >
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1A2E] border-white/10">
                <SelectItem value="daily" className="text-white">
                  Todos os dias
                </SelectItem>
                <SelectItem value="weekdays" className="text-white">
                  Segunda a Sexta
                </SelectItem>
                <SelectItem value="weekends" className="text-white">
                  Finais de semana
                </SelectItem>
                <SelectItem value="custom" className="text-white">
                  Personalizado
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-white/10 text-white hover:bg-white/5"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Criar Hábito"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
