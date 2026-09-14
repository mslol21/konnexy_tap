"use client";

import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Radio,
  QrCode,
  Star,
  MessageCircle,
  UtensilsCrossed,
  Gift,
  ArrowUpRight,
  Filter,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function MetricasPage() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("7d");

  const channelComparison = [
    { name: "Aproximação NFC", value: 68, color: "#0F2744" },
    { name: "Leitura QR Code", value: 32, color: "#D4AF37" },
  ];

  const actionBreakdown = [
    { action: "Avaliar Google", cliques: 142, icon: "⭐" },
    { action: "WhatsApp Direto", cliques: 89, icon: "💬" },
    { action: "Cardápio Digital", cliques: 76, icon: "📋" },
    { action: "Clube de Clientes", cliques: 48, icon: "🎁" },
    { action: "Instagram", cliques: 39, icon: "📸" },
    { action: "Como Chegar (Maps)", cliques: 31, icon: "📍" },
  ];

  const hourlyDistribution = [
    { hora: "08h", acessos: 8 },
    { hora: "10h", acessos: 22 },
    { hora: "12h", acessos: 54 },
    { hora: "14h", acessos: 41 },
    { hora: "16h", acessos: 33 },
    { hora: "18h", acessos: 49 },
    { hora: "20h", acessos: 38 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <span className="text-xs font-bold text-navy-800 uppercase tracking-wider bg-navy-50 px-2.5 py-1 rounded-md border border-navy-200">
            Inteligência de Balcão
          </span>
          <h1 className="text-2xl font-black text-navy-950 mt-1">
            Métricas & Análise de Comportamento
          </h1>
          <p className="text-xs text-slate-500">
            Descubra quais botões mais convertem, horários de pico e a distribuição entre aproximações por NFC e leituras por QR Code.
          </p>
        </div>

        <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
          <button
            onClick={() => setTimeRange("7d")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              timeRange === "7d"
                ? "bg-white text-navy-950 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Últimos 7 dias
          </button>
          <button
            onClick={() => setTimeRange("30d")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              timeRange === "30d"
                ? "bg-white text-navy-950 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            30 dias
          </button>
          <button
            onClick={() => setTimeRange("90d")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              timeRange === "90d"
                ? "bg-white text-navy-950 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            90 dias
          </button>
        </div>
      </div>

      {/* Gráficos Principais */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Gráfico de Barras: Cliques por Ação */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-navy-950">
                Engajamento por Tipo de Botão
              </h2>
              <p className="text-xs text-slate-500">
                Volume de cliques em cada destino da sua página pública
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              Taxa de conversão: 64.8%
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={actionBreakdown} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                <XAxis type="number" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis
                  dataKey="action"
                  type="category"
                  stroke="#475569"
                  fontSize={11}
                  tickLine={false}
                  width={130}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0F2744",
                    borderRadius: "12px",
                    color: "#FFFFFF",
                    fontSize: "12px",
                    border: "none",
                  }}
                  formatter={(value) => [`${value} cliques`, "Total"]}
                />
                <Bar dataKey="cliques" fill="#0F2744" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart: NFC vs QR Code */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-navy-950">
              Origem do Acesso Físico
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              NFC (Aproximação) vs QR Code (Câmera)
            </p>

            <div className="h-56 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={channelComparison}
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {channelComparison.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0F2744",
                      borderRadius: "12px",
                      color: "#FFFFFF",
                      fontSize: "12px",
                      border: "none",
                    }}
                    formatter={(val) => [`${val}%`, "Proporção"]}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-navy-950">68%</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase">Via NFC</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-center">
            <div className="p-2 rounded-xl bg-navy-50">
              <div className="text-xs font-bold text-navy-950">68% NFC</div>
              <div className="text-[10px] text-slate-500">Mais veloz</div>
            </div>
            <div className="p-2 rounded-xl bg-gold-50">
              <div className="text-xs font-bold text-gold-900">32% QR Code</div>
              <div className="text-[10px] text-slate-500">Backup universal</div>
            </div>
          </div>
        </div>
      </div>

      {/* Horários de Pico no Balcão */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <h2 className="text-sm font-bold text-navy-950 mb-1">
          Distribuição de Acessos por Faixa de Horário
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          Identifique os picos de fluxo presencial de clientes no seu estabelecimento.
        </p>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyDistribution}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="hora" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0F2744",
                  borderRadius: "12px",
                  color: "#FFFFFF",
                  fontSize: "12px",
                  border: "none",
                }}
              />
              <Bar dataKey="acessos" fill="#D4AF37" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
