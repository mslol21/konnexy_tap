"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Mail, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Logo from "@/components/brand/Logo";

export default function AdminLoginPage() {
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
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error || !data.user) throw new Error("auth");

      const { data: admin } = await supabase.from("app_admins").select("user_id").eq("user_id", data.user.id).maybeSingle();
      if (!admin) {
        await supabase.auth.signOut();
        setErrorMsg("Esta conta não possui acesso administrativo.");
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setErrorMsg("E-mail ou senha de administrador inválidos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#171B1F] flex items-center justify-center p-5">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center"><Logo theme="dark" size="md" badge="Admin" showTagline={false} /></div>
        <section className="rounded-3xl border border-slate-700 bg-[#20252A] p-6 sm:p-8 shadow-2xl">
          <div className="w-11 h-11 rounded-2xl bg-[#C78D4E]/15 border border-[#C78D4E]/30 flex items-center justify-center mb-5"><ShieldCheck className="w-5 h-5 text-[#D8A66C]" /></div>
          <h1 className="text-2xl font-black text-white">Painel administrativo</h1>
          <p className="text-sm text-slate-400 mt-2">Acesso exclusivo para operação da Otimiza Meu Negócio.</p>

          {errorMsg && <div className="mt-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 text-xs">{errorMsg}</div>}

          <form onSubmit={handleLogin} className="space-y-4 mt-6">
            <div><label className="text-xs font-bold text-slate-300">E-mail</label><div className="relative mt-1.5"><Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" /><input type="email" required autoComplete="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C78D4E]" placeholder="admin@..." /></div></div>
            <div><label className="text-xs font-bold text-slate-300">Senha</label><div className="relative mt-1.5"><Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" /><input type="password" required autoComplete="current-password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C78D4E]" placeholder="••••••••" /></div></div>
            <button disabled={loading} className="w-full py-3.5 rounded-xl bg-[#C78D4E] hover:bg-[#D8A66C] text-[#20252A] font-black text-sm flex items-center justify-center gap-2 disabled:opacity-50">{loading ? "Verificando..." : "Entrar como administrador"}{!loading && <ArrowRight className="w-4 h-4" />}</button>
          </form>
          <p className="mt-6 text-[11px] text-slate-500 text-center">Clientes devem utilizar a Área do Cliente, não este acesso.</p>
        </section>
      </div>
    </main>
  );
}
