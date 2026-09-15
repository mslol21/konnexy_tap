"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Lock, Mail, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Logo from "@/components/brand/Logo";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
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
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error || !data.session) {
        setErrorMsg("E-mail ou senha inválidos. Verifique seus dados e tente novamente.");
        return;
      }

      const requestedNext = searchParams.get("next");
      const safeNext = requestedNext?.startsWith("/") && !requestedNext.startsWith("//")
        ? requestedNext
        : "/dashboard";

      router.replace(safeNext);
      router.refresh();
    } catch {
      setErrorMsg("Não foi possível entrar agora. Tente novamente em instantes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F5F3EF]">
      <aside className="hidden lg:flex lg:w-1/2 xl:w-5/12 flex-col justify-between p-12 xl:p-16 bg-[#242A30] text-white">
        <Logo theme="dark" size="md" />

        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2D343B] border border-[#BD7B48]/30 text-[#D9945F] text-xs font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#BD7B48]" />
            Área do Cliente
          </div>
          <h2 className="text-3xl xl:text-4xl font-extrabold leading-tight tracking-tight">
            Gerencie suas placas e acompanhe os acessos do seu negócio.
          </h2>
          <p className="text-[#B7BDC3] text-base leading-relaxed">
            Acesse sua conta para acompanhar a operação das placas inteligentes e manter o destino de avaliação atualizado.
          </p>
        </div>

        <div className="space-y-4">
          {[
            "Acesso protegido por autenticação",
            "Métricas de NFC e QR Code",
            "Configuração centralizada do destino",
          ].map((item) => (
            <div key={item} className="flex items-center gap-3 text-sm text-[#B7BDC3]">
              <CheckCircle2 className="w-4 h-4 text-[#C78D4E] shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-white/10 text-xs text-[#8D949B]">
          © {new Date().getFullYear()} Otimiza Meu Negócio.
        </div>
      </aside>

      <main className="flex-1 flex items-center justify-center px-6 py-12 sm:px-10 lg:px-16 xl:px-24">
        <div className="w-full max-w-[400px]">
          <div className="lg:hidden mb-10">
            <Logo theme="light" size="sm" />
          </div>

          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#20252A] tracking-tight">
              Acesse seu painel
            </h1>
            <p className="text-sm text-[#6D7277] mt-2">
              Entre com o e-mail cadastrado para gerenciar sua placa.
            </p>
          </div>

          {errorMsg && (
            <div role="alert" className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-[#30363D] uppercase tracking-wide mb-1.5">
                E-mail
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6D7277]" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-[#E8E3DD] bg-white focus:outline-none focus:ring-2 focus:ring-[#C78D4E] focus:border-[#C78D4E] text-[#20252A]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-[#30363D] uppercase tracking-wide mb-1.5">
                Senha
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6D7277]" />
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-[#E8E3DD] bg-white focus:outline-none focus:ring-2 focus:ring-[#C78D4E] focus:border-[#C78D4E] text-[#20252A]"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Link href="/recuperar-senha" className="text-xs font-semibold text-[#9A6236] hover:text-[#BD7B48]">
                Esqueci minha senha
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-[#20252A] hover:bg-[#30363D] disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <span>{loading ? "Acessando..." : "Entrar no painel"}</span>
              {!loading && <ArrowRight className="w-4 h-4 text-[#C78D4E]" />}
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-[#6D7277]">
            Ainda não tem uma placa?{" "}
            <Link href="/#preco" className="text-[#9A6236] hover:text-[#BD7B48] font-semibold">
              Ver oferta
            </Link>
          </div>

          <div className="mt-10 pt-6 border-t border-[#E8E3DD] text-center">
            <Link href="/" className="text-xs text-[#6D7277] hover:text-[#9A6236]">
              ← Voltar para o site
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
