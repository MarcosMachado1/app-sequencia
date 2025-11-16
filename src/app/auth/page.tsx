"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/custom/logo";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Login realizado com sucesso!");
        window.location.href = "/dashboard";
      } else {
        // Cadastro
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: username || email.split("@")[0],
            }
          }
        });
        
        if (signUpError) throw signUpError;
        
        if (authData.user) {
          // Inserir perfil manualmente na tabela profiles
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: authData.user.id,
              email: authData.user.email,
              full_name: username || email.split("@")[0],
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

          if (profileError) {
            console.error("Erro ao criar perfil:", profileError);
            // Não bloqueia o cadastro se o perfil já existir
            if (profileError.code !== '23505') { // 23505 = duplicate key
              throw profileError;
            }
          }

          toast.success("Conta criada com sucesso! Redirecionando...");
          
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 1500);
        }
      }
    } catch (error: any) {
      console.error("Erro de autenticação:", error);
      toast.error(error.message || "Erro ao autenticar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo className="h-12" />
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 text-center">
            {isLogin ? "Bem-vindo de volta" : "Crie sua conta"}
          </h2>
          <p className="text-gray-600 text-center mb-8">
            {isLogin
              ? "Entre para continuar sua sequência"
              : "Comece sua jornada de hábitos"}
          </p>

          <form onSubmit={handleAuth} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-700 font-medium">
                  Nome de usuário
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-indigo-500 h-12 transition-all"
                  placeholder="seu_usuario"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-indigo-500 h-12 transition-all"
                placeholder="seu@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-indigo-500 h-12 transition-all"
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isLogin ? (
                "Entrar"
              ) : (
                "Criar Conta"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-gray-600 hover:text-indigo-600 transition-colors text-sm font-medium"
            >
              {isLogin
                ? "Não tem conta? Criar agora"
                : "Já tem conta? Fazer login"}
            </button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Design minimalista e premium</p>
        </div>
      </div>
    </div>
  );
}
