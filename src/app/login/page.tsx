"use client";

import { Suspense, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/custom/logo";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2, PartyPopper } from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isPremium = searchParams.get("premium") === "true";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Pre-preencher email se vier da URL
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Por favor, preencha todos os campos");
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Redirecionar para dashboard
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Erro ao fazer login:", error);
      alert(error.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Premium Welcome Banner */}
        {isPremium && (
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6 rounded-2xl mb-6 text-center shadow-lg">
            <PartyPopper className="w-12 h-12 mx-auto mb-3" />
            <h2 className="text-2xl font-bold mb-2">Bem-vindo à Comunidade Sequencia! 🎉</h2>
            <p className="text-indigo-100">Sua assinatura premium foi ativada com sucesso</p>
          </div>
        )}

        {/* Login Card */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
          <div className="text-center mb-8">
            <Logo />
            <h1 className="text-2xl font-bold text-gray-900 mt-4 mb-2">
              {isPremium ? "Acessar Minha Comunidade" : "Entrar"}
            </h1>
            {isPremium && (
              <p className="text-gray-600">
                Faça login com o email usado no checkout
              </p>
            )}
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2"
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white h-12"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Não tem conta?{" "}
              <button
                onClick={() => router.push("/auth")}
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Criar conta
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}