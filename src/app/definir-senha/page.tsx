"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Eye, EyeOff, KeyRound, Loader2, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Logo from "@/components/brand/Logo";

type SetupState = "checking" | "ready" | "invalid" | "saving" | "done";

export default function SetPasswordPage() {
  const router = useRouter();
  const [mode, setMode] = useState("invite");

  const [state, setState] = useState<SetupState>("checking");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const title = useMemo(() => {
    if (mode === "recovery") return "Crie uma nova senha";
    return "Crie sua senha de acesso";
  }, [mode]);

  useEffect(() => {
    let mounted = true;

    const establishSession = async () => {
      const supabase = createClient();

      try {
        const currentUrl = new URL(window.location.href);
        const currentMode = currentUrl.searchParams.get("mode") || "invite";
        if (mounted) setMode(currentMode);
        const { data: existing } = await supabase.auth.getSession();
        if (existing.session) {
          if (mounted) setState("ready");
          return;
        }

        const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
        const accessToken = hash.get("access_token");
        const refreshToken = hash.get("refresh_token");

        if (accessToken && refreshToken) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (!sessionError) {
            window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
            if (mounted) setState("ready");
            return;
          }
        }

        const code = currentUrl.searchParams.get("code");
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (!exchangeError) {
            if (mounted) setState("ready");
            return;
          }
        }

        if (mounted) setState("invalid");
      } catch {
        if (mounted) setState("invalid");
      }
    };

    void establishSession();
    return () => {
      mounted = false;
    };
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("A senha precisa ter pelo menos 8 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setState("saving");
    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });

      if (updateError) {
        setError(updateError.message || "Não foi possível salvar a senha.");
        setState("ready");
        return;
      }

      setState("done");
      window.setTimeout(() => {
        router.replace("/dashboard");
        router.refresh();
      }, 1200);
    } catch {
      setError("Não foi possível salvar a senha agora. Tente novamente.");
      setState("ready");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F3EF] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-7">
          <Logo theme="light" size="md" />
        </div>

        <div className="rounded-3xl border border-[#E8E3DD] bg-white p-6 sm:p-8 shadow-xl">
          {state === "checking" && (
            <div className="py-10 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-[#C78D4E] mx-auto" />
              <h1 className="mt-4 text-lg font-extrabold text-[#20252A]">Validando seu acesso</h1>
              <p className="mt-2 text-sm text-[#6D7277]">Aguarde alguns segundos.</p>
            </div>
          )}

          {state === "invalid" && (
            <div className="py-5 text-center">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center">
                <KeyRound className="w-6 h-6 text-amber-600" />
              </div>
              <h1 className="mt-4 text-xl font-extrabold text-[#20252A]">Link inválido ou expirado</h1>
              <p className="mt-2 text-sm leading-relaxed text-[#6D7277]">
                Solicite um novo convite ao responsável pelo Otimiza Meu Negócio ou use a recuperação de senha.
              </p>
              <div className="mt-6 grid gap-2">
                <Link href="/recuperar-senha" className="w-full rounded-xl bg-[#20252A] px-4 py-3 text-sm font-bold text-white">
                  Recuperar acesso
                </Link>
                <Link href="/login" className="w-full rounded-xl border border-[#E8E3DD] px-4 py-3 text-sm font-bold text-[#30363D]">
                  Voltar ao login
                </Link>
              </div>
            </div>
          )}

          {(state === "ready" || state === "saving") && (
            <>
              <div className="text-center mb-6">
                <div className="mx-auto w-12 h-12 rounded-2xl bg-[#F7F5F2] border border-[#E8E3DD] flex items-center justify-center">
                  <Lock className="w-6 h-6 text-[#9A6236]" />
                </div>
                <h1 className="mt-4 text-2xl font-extrabold text-[#20252A]">{title}</h1>
                <p className="mt-2 text-sm text-[#6D7277]">
                  Essa senha será usada para entrar no painel do seu estabelecimento.
                </p>
              </div>

              {error && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-xs font-medium text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={submit} className="space-y-4">
                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-wide text-[#30363D]">Nova senha</span>
                  <div className="relative mt-1.5">
                    <input
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      minLength={8}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-[#E8E3DD] bg-white px-4 py-3 pr-11 text-sm text-[#20252A] outline-none focus:border-[#C78D4E] focus:ring-2 focus:ring-[#C78D4E]/20"
                      placeholder="Mínimo de 8 caracteres"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute inset-y-0 right-0 px-3 text-[#6D7277]"
                      aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </label>

                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-wide text-[#30363D]">Confirmar senha</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    minLength={8}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-[#E8E3DD] bg-white px-4 py-3 text-sm text-[#20252A] outline-none focus:border-[#C78D4E] focus:ring-2 focus:ring-[#C78D4E]/20"
                    placeholder="Digite novamente"
                  />
                </label>

                <div className="rounded-xl bg-[#F7F5F2] border border-[#E8E3DD] px-3.5 py-3 text-xs leading-relaxed text-[#6D7277]">
                  Use pelo menos 8 caracteres. Não compartilhe sua senha com terceiros.
                </div>

                <button
                  type="submit"
                  disabled={state === "saving"}
                  className="w-full rounded-xl bg-[#20252A] px-4 py-3.5 text-sm font-bold text-white disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {state === "saving" ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4 text-[#C78D4E]" />}
                  {state === "saving" ? "Salvando..." : "Criar minha senha"}
                </button>
              </form>
            </>
          )}

          {state === "done" && (
            <div className="py-8 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h1 className="mt-4 text-xl font-extrabold text-[#20252A]">Senha criada com sucesso</h1>
              <p className="mt-2 text-sm text-[#6D7277]">Abrindo seu painel...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
