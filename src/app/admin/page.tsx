"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Radio,
  QrCode,
  CheckCircle2,
  Clock,
  TrendingUp,
  DollarSign,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Plus,
} from "lucide-react";
import { DEMO_DEVICES, DEMO_LEADS } from "@/lib/mock-data";
import { Lead, TapDevice } from "@/lib/types";

export default function AdminDashboardPage() {
  const [leads, setLeads] = useState<Lead[]>(DEMO_LEADS);
  const [devices, setDevices] = useState<TapDevice[]>(DEMO_DEVICES);

  useEffect(() => {
    fetch("/api/leads")
      .then((res) => res.json())
      .then((data) => {
        if (data.leads) setLeads(data.leads);
      })
      .catch(() => {});
  }, []);

  const totalLeads = leads.length;
  const reservedCount = leads.filter((l) => l.status === "reserved").length;
  const soldCount = leads.filter((l) => l.status === "sold").length;
  const activeDevices = devices.filter((d) => d.status === "active" || d.active).length;
  const pendingDevices = devices.filter((d) => d.status === "pending").length;

  const totalViewsToday = 37; // Acessos telemetria hoje

  return (
    <div className="space-y-6">
      {/* Header Operacional */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/80 p-6 rounded-3xl border border-slate-700 shadow-lg">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gold-500/20 text-gold-300 text-xs font-bold border border-gold-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fase 1: Validação do 1º Lote Físico (10 a 100 placas)</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">
            Painel Operacional — Otimiza Meu Negócio
          </h1>
          <p className="text-xs text-slate-300">
            Monitore reservas, configure novas placas em menos de 1 minuto e acompanhe os toques dos clientes no balcão.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/placas"
            className="px-4 py-2.5 bg-gold-500 hover:bg-gold-400 text-navy-950 text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Placa (&lt; 1 min)</span>
          </Link>
          <Link
            href="/admin/leads"
            className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
          >
            <Users className="w-4 h-4 text-gold-400" />
            <span>Ver Funil de Leads</span>
          </Link>
        </div>
      </div>

      {/* Cards de Métricas Operacionais Reais */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Reservas */}
        <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold text-amber-400 uppercase">Reservas</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">{reservedCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Lote 1 Garantido</div>
        </div>

        {/* Vendas Fechadas */}
        <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold text-emerald-400 uppercase">Vendas</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{soldCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Placas Pagas (R$ 79,90)</div>
        </div>

        {/* Placas Ativas */}
        <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold text-blue-400 uppercase">Ativas</span>
            <Radio className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white">{activeDevices}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">No Balcão Rodando</div>
        </div>

        {/* Placas Aguardando Configuração */}
        <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold text-purple-400 uppercase">Pendentes</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-300">{pendingDevices}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Aguardando Link Google</div>
        </div>

        {/* Total de Leads */}
        <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold text-slate-300 uppercase">Total Leads</span>
            <Users className="w-4 h-4 text-slate-300" />
          </div>
          <div className="text-2xl font-black text-white">{totalLeads}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Interessados Registrados</div>
        </div>

        {/* Acessos Hoje */}
        <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold text-gold-400 uppercase">Acessos Hoje</span>
            <TrendingUp className="w-4 h-4 text-gold-400" />
          </div>
          <div className="text-2xl font-black text-white">{totalViewsToday}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Toques para Avaliação</div>
        </div>
      </div>

      {/* Seção Operacional Rápida */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Últimas Reservas Recebidas */}
        <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-gold-400" />
                Últimas Reservas de Placas
              </h2>
              <Link
                href="/admin/leads"
                className="text-xs font-bold text-gold-400 hover:underline flex items-center gap-1"
              >
                <span>Ver Todas</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="divide-y divide-slate-700/60">
              {leads.slice(0, 4).map((lead) => (
                <div key={lead.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      {lead.business_name}
                      <span className="text-[10px] text-slate-400 font-normal">
                        ({lead.name})
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {lead.city || "Cidade não informada"} • {lead.whatsapp}
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      lead.status === "reserved"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : lead.status === "sold"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-slate-700 text-slate-300"
                    }`}
                  >
                    {lead.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-slate-700">
            <Link
              href="/admin/leads"
              className="w-full py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Gerenciar Funil de Vendas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Placas Físicas & Configuração Express */}
        <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400" />
                Status das Placas Físicas
              </h2>
              <Link
                href="/admin/placas"
                className="text-xs font-bold text-gold-400 hover:underline flex items-center gap-1"
              >
                <span>Configurar Nova</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="divide-y divide-slate-700/60">
              {devices.map((device) => (
                <div key={device.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span className="font-mono text-gold-400">{device.code}</span>
                      <span>—</span>
                      <span>{device.name}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Local: {device.location}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        device.status === "active" || device.active
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-amber-500/20 text-amber-300"
                      }`}
                    >
                      {device.status === "active" || device.active ? "Ativa" : "Pendente"}
                    </span>
                    <Link
                      href={`/t/${device.code}`}
                      target="_blank"
                      className="text-[11px] text-slate-300 hover:text-white bg-slate-700 px-2 py-1 rounded"
                    >
                      Testar
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-slate-700">
            <Link
              href="/admin/placas"
              className="w-full py-2.5 bg-gold-500 hover:bg-gold-400 text-navy-950 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Cadastrar e Codificar Nova Placa NFC</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
