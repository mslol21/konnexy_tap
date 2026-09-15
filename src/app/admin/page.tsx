"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  Clock,
  DollarSign,
  Loader2,
  Pencil,
  Plus,
  Radio,
  RefreshCw,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";

interface OverviewPayload {
  metrics: {
    totalLeads: number;
    newLeads: number;
    reserved: number;
    sold: number;
    conversionRate: number;
    activeDevices: number;
    pendingDevices: number;
    inactiveDevices: number;
    accessesToday: number;
    accesses7d: number;
  };
  recentLeads: Array<{
    id: string;
    name: string;
    business_name: string;
    whatsapp: string;
    city?: string | null;
    status: string;
    created_at: string;
    converted_device_id?: string | null;
  }>;
  recentDevices: Array<{
    id: string;
    code: string;
    name: string;
    location: string;
    status: string;
    active: boolean;
    created_at: string;
    businesses?: { name?: string } | null;
  }>;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<OverviewPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOverview = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/overview", { cache: "no-store" });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setData(null);
        setError(typeof payload.error === "string" ? payload.error : "Não foi possível carregar o painel.");
        return;
      }
      setData(payload as OverviewPayload);
    } catch {
      setData(null);
      setError("Falha de conexão ao carregar o painel operacional.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadOverview();
  }, []);

  const metrics = data?.metrics ?? {
    totalLeads: 0,
    newLeads: 0,
    reserved: 0,
    sold: 0,
    conversionRate: 0,
    activeDevices: 0,
    pendingDevices: 0,
    inactiveDevices: 0,
    accessesToday: 0,
    accesses7d: 0,
  };

  const cards = [
    { label: "Leads novos", value: metrics.newLeads, helper: "Aguardando contato", icon: UserPlus, className: "text-cyan-300" },
    { label: "Reservas", value: metrics.reserved, helper: "Leads reservados", icon: Clock, className: "text-amber-400" },
    { label: "Vendas", value: metrics.sold, helper: `${metrics.conversionRate}% de conversão`, icon: DollarSign, className: "text-emerald-400" },
    { label: "Placas ativas", value: metrics.activeDevices, helper: "Redirecionando", icon: Radio, className: "text-blue-400" },
    { label: "Pendentes", value: metrics.pendingDevices, helper: "Aguardando ativação", icon: Clock, className: "text-purple-400" },
    { label: "Inativas", value: metrics.inactiveDevices, helper: "Inativas ou suspensas", icon: Radio, className: "text-rose-300" },
    { label: "Acessos hoje", value: metrics.accessesToday, helper: "Redirecionamentos", icon: TrendingUp, className: "text-gold-400" },
    { label: "Acessos 7 dias", value: metrics.accesses7d, helper: "Últimos 7 dias", icon: TrendingUp, className: "text-emerald-300" },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-800/80 p-6 rounded-3xl border border-slate-700">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gold-500/15 text-gold-300 text-xs font-bold border border-gold-400/20">MVP comercial • dados reais</div>
          <h1 className="text-2xl font-black text-white mt-2">Painel Operacional — Otimiza Meu Negócio</h1>
          <p className="text-xs text-slate-300 mt-1">Controle leads, placas, status e acessos sem depender do SQL Editor.</p>
        </div>
        <button onClick={() => void loadOverview()} className="px-3 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold flex items-center gap-2 self-start lg:self-auto"><RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Atualizar dados</button>
      </header>

      {error && <div role="alert" className="p-4 rounded-2xl border border-amber-500/40 bg-amber-500/10 text-amber-100 text-xs flex items-start gap-2"><AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /><div><div className="font-bold">Não foi possível carregar a visão geral.</div><div className="mt-0.5">{error}</div></div></div>}

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <Link href="/admin/placas" className="group p-4 rounded-2xl bg-gold-500 text-navy-950 hover:bg-gold-400 transition-colors"><div className="flex items-center justify-between"><div><div className="text-[10px] uppercase font-black opacity-70">Ação rápida</div><div className="font-black mt-1">Cadastrar placa</div></div><Plus className="w-5 h-5" /></div></Link>
        <Link href="/admin/leads" className="group p-4 rounded-2xl bg-slate-800 border border-slate-700 text-white hover:border-gold-400/60"><div className="flex items-center justify-between"><div><div className="text-[10px] uppercase font-bold text-slate-400">Ação rápida</div><div className="font-black mt-1">Ver e editar leads</div></div><Users className="w-5 h-5 text-gold-400" /></div></Link>
        <Link href="/admin/placas" className="group p-4 rounded-2xl bg-slate-800 border border-slate-700 text-white hover:border-gold-400/60"><div className="flex items-center justify-between"><div><div className="text-[10px] uppercase font-bold text-slate-400">Ação rápida</div><div className="font-black mt-1">Editar placas</div></div><Pencil className="w-5 h-5 text-gold-400" /></div></Link>
        <Link href="/admin/placas" className="group p-4 rounded-2xl bg-slate-800 border border-slate-700 text-white hover:border-gold-400/60"><div className="flex items-center justify-between"><div><div className="text-[10px] uppercase font-bold text-slate-400">Operação</div><div className="font-black mt-1">Testar NFC / QR</div></div><Radio className="w-5 h-5 text-emerald-400" /></div></Link>
      </section>

      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return <div key={card.label} className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700"><div className="flex items-center justify-between mb-2"><span className={`text-[9px] uppercase font-bold ${card.className}`}>{card.label}</span><Icon className={`w-4 h-4 ${card.className}`} /></div><div className="text-2xl font-black text-white">{loading ? "—" : card.value}</div><div className="text-[10px] text-slate-400 mt-1 leading-tight">{card.helper}</div></div>;
        })}
      </div>

      {loading ? <div className="p-12 flex items-center justify-center"><Loader2 className="w-8 h-8 text-gold-400 animate-spin" /></div> : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700">
            <div className="flex items-center justify-between mb-4"><h2 className="text-sm font-bold text-white flex items-center gap-2"><Users className="w-4 h-4 text-gold-400" /> Últimos leads</h2><Link href="/admin/leads" className="text-xs font-bold text-gold-400 hover:text-gold-300 flex items-center gap-1">Ver todos <ArrowRight className="w-3 h-3" /></Link></div>
            {data?.recentLeads.length ? <div className="divide-y divide-slate-700/70">{data.recentLeads.map((lead) => <div key={lead.id} className="py-3 flex items-center justify-between gap-3"><div className="min-w-0"><div className="text-xs font-bold text-white truncate">{lead.business_name}</div><div className="text-[11px] text-slate-400 truncate">{lead.name}{lead.city ? ` • ${lead.city}` : ""} • {lead.whatsapp}</div></div>{lead.converted_device_id ? <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-300">Placa criada</span> : <Link href={`/admin/placas?lead_id=${encodeURIComponent(lead.id)}&business_name=${encodeURIComponent(lead.business_name)}&city=${encodeURIComponent(lead.city || "")}`} className="text-[10px] font-black px-2.5 py-1.5 rounded-lg bg-gold-500 text-navy-950 shrink-0">Criar placa</Link>}</div>)}</div> : <div className="py-10 text-center text-xs text-slate-400">Nenhum lead real registrado ainda.</div>}
          </section>

          <section className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700">
            <div className="flex items-center justify-between mb-4"><h2 className="text-sm font-bold text-white flex items-center gap-2"><Radio className="w-4 h-4 text-emerald-400" /> Últimas placas</h2><Link href="/admin/placas" className="text-xs font-bold text-gold-400 hover:text-gold-300 flex items-center gap-1">Gerenciar <ArrowRight className="w-3 h-3" /></Link></div>
            {data?.recentDevices.length ? <div className="divide-y divide-slate-700/70">{data.recentDevices.map((device) => <div key={device.id} className="py-3 flex items-center justify-between gap-3"><div className="min-w-0"><div className="text-xs font-bold text-white truncate">{device.businesses?.name || device.name}</div><div className="text-[11px] text-slate-400"><span className="font-mono text-gold-400">{device.code}</span> • {device.location}</div></div><div className="flex items-center gap-2"><span className={`text-[10px] font-bold px-2 py-1 rounded-full ${device.status === "active" ? "bg-emerald-500/15 text-emerald-300" : device.status === "suspended" ? "bg-rose-500/15 text-rose-300" : "bg-amber-500/15 text-amber-300"}`}>{device.status}</span><Link href="/admin/placas" className="text-[10px] px-2 py-1 rounded bg-slate-700 text-slate-200">Gerenciar</Link></div></div>)}</div> : <div className="py-10 text-center text-xs text-slate-400">Nenhuma placa real cadastrada ainda.</div>}
          </section>
        </div>
      )}
    </div>
  );
}
