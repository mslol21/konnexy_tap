"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Mail, Sparkles, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Logo from "@/components/brand/Logo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Se as credenciais do Supabase não estiverem ativas ou for login de demonstração
        if (email.includes("demo") || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
          router.push("/dashboard");
          return;
        }
        setErrorMsg(error.message || "Erro ao efetuar login. Verifique seus dados.");
      } else if (data.session) {
        router.push("/dashboard");
      }
    } catch {
      // Fallback gracioso para modo de demonstração
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAccess = () => {
    setEmail("demo@konnexytap.com.br");
    setPassword("demo123456");
    setLoading(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Luzes de fundo */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-navy-800/40 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="flex justify-center mb-6">
          <Logo theme="dark" size="lg" showTagline={true} />
        </div>

        <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Acesse seu painel
        </h2>
        <p className="mt-2 text-center text-xs sm:text-sm text-slate-400">
          Gerencie sua placa NFC, QR Code, links e promoções em tempo real.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-slate-200">
          {/* Acesso Rápido de Demonstração */}
          <div className="mb-6 p-3 rounded-2xl bg-amber-50 border border-amber-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-navy-950">
                <Sparkles className="w-4 h-4 text-gold-500" />
                <span>Testar Demonstração do Balcão</span>
              </div>
              <button
                onClick={handleDemoAccess}
                type="button"
                className="px-3 py-1 bg-navy-950 hover:bg-navy-800 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
              >
                Entrar como Café da Ana
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
              {errorMsg}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                E-mail
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@comercio.com.br"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-600 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Senha
                </label>
                <Link
                  href="/recuperar-senha"
                  className="text-xs font-semibold text-navy-800 hover:underline"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-600 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-navy-950 hover:bg-navy-900 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {loading ? "Entrando..." : "Acessar Plataforma"}
                <ArrowRight className="w-4 h-4 text-gold-400" />
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-600">
            Ainda não tem sua placa ou conta?{" "}
            <Link href="/cadastro" className="font-bold text-navy-950 hover:underline">
              Cadastre seu estabelecimento
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
