"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Radio,
  QrCode,
  ExternalLink,
  MessageCircle,
  TrendingUp,
  CheckCircle2,
  Calendar,
  Clock,
  Edit2,
  Save,
  Check,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { DEMO_BUSINESS, DEMO_DEVICE, DEMO_METRICS } from "@/lib/mock-data";
import { validateDestinationUrl } from "@/lib/security";

export default function MerchantDashboardPage() {
  const [device, setDevice] = useState(DEMO_DEVICE);
  const [editingUrl, setEditingUrl] = useState(false);
  const [customUrl, setCustomUrl] = useState(device.destination_url || "");
  const [urlSaved, setUrlSaved] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);

  // Métricas do MVP conforme Seção 8 do briefing
  const [metrics] = useState({
    today: 37,
    last7Days: 245,
    last30Days: 980,
    total: 1225,
    nfcPercentage: 68,
    qrPercentage: 32,
  });

  const handleSaveDestination = (e: React.FormEvent) => {
    e.preventDefault();
    setUrlError(null);

    const validation = validateDestinationUrl(customUrl, "google_review");
    if (!validation.isValid) {
      setUrlError(validation.error || "URL de avaliação do Google inválida.");
      return;
    }

    setDevice({ ...device, destination_url: validation.sanitizedUrl });
    setEditingUrl(false);
    setUrlSaved(true);
    setTimeout(() => setUrlSaved(false), 3000);
  };

  const cleanWaNumber = "5511987654321";
  const requestChangeWaUrl = `https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(
    `Olá! Sou do ${DEMO_BUSINESS.name} (Placa ${device.code}) e gostaria de atualizar meu link de avaliação do Google.`
  )}`;

  return (
    <div className="space-y-6">
      {/* Header do Comerciante */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Placa Física Conectada ao Google Reviews
            </span>
          </div>
          <h1 className="text-2xl font-black text-navy-950 mt-1">
            {DEMO_BUSINESS.name}
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Acompanhe em tempo real os acessos dos clientes que aproximam o celular ou leem o QR Code da placa no seu balcão.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/t/${device.code}`}
            target="_blank"
            className="px-4 py-2 bg-navy-950 hover:bg-navy-900 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5 text-gold-400" />
            <span>Testar Redirecionamento</span>
          </Link>
        </div>
      </div>

      {urlSaved && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Destino atualizado com sucesso! Os próximos toques na placa física já abrirão o novo link.</span>
        </div>
      )}

      {/* Cartão de Identificação da Placa Física */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold-500/20 text-gold-700 flex items-center justify-center font-bold">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase">Minha Placa Física</div>
              <div className="text-base font-black text-navy-950 flex items-center gap-2">
                <span>Código: <strong className="font-mono text-gold-600">{device.code}</strong></span>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  Status: Ativa no Balcão
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={requestChangeWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Solicitar Alteração pelo WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Destino Configurado */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase">
              Destino do Redirecionamento (Google Reviews Oficial):
            </span>
            <button
              onClick={() => setEditingUrl(!editingUrl)}
              className="text-xs font-bold text-navy-900 hover:text-gold-600 transition-colors flex items-center gap-1"
            >
              <Edit2 className="w-3 h-3" />
              <span>{editingUrl ? "Cancelar" : "Alterar Destino"}</span>
            </button>
          </div>

          {editingUrl ? (
            <form onSubmit={handleSaveDestination} className="space-y-2 pt-1">
              {urlError && (
                <div className="p-2 bg-rose-50 text-rose-700 text-xs rounded-lg border border-rose-200">
                  {urlError}
                </div>
              )}
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  required
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://search.google.com/local/writereview?placeid=..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-800 font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-navy-950 hover:bg-navy-900 text-white rounded-xl text-xs font-bold shrink-0"
                >
                  Salvar
                </button>
              </div>
              <p className="text-[10px] text-slate-500">
                O link deve pertencer aos domínios oficiais do Google e iniciar com https://.
              </p>
            </form>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <div className="font-mono text-xs text-slate-800 break-all">
                {device.destination_url || "https://search.google.com/local/writereview"}
              </div>
              <a
                href={device.destination_url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-navy-900 hover:underline flex items-center gap-1 shrink-0"
              >
                <span>Ver Link</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Cards de Métricas Reais do MVP (Sem false claims de 'avaliações conquistadas') */}
      <div>
        <div className="mb-3">
          <h2 className="text-sm font-bold text-navy-950 uppercase tracking-wider">
            Métricas de Acessos para Avaliação
          </h2>
          <p className="text-xs text-slate-500">
            Contabilização precisa dos toques NFC e leituras de QR Code no seu balcão.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Acessos Hoje */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-[11px] font-bold text-slate-500 uppercase mb-1">
              Hoje
            </div>
            <div className="text-3xl font-black text-navy-950">
              {metrics.today}
            </div>
            <div className="text-[11px] font-medium text-slate-500 mt-1">
              acessos para avaliação
            </div>
          </div>

          {/* Últimos 7 dias */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-[11px] font-bold text-slate-500 uppercase mb-1">
              Últimos 7 dias
            </div>
            <div className="text-3xl font-black text-navy-950">
              {metrics.last7Days}
            </div>
            <div className="text-[11px] font-medium text-slate-500 mt-1">
              acessos para avaliação
            </div>
          </div>

          {/* Últimos 30 dias */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-[11px] font-bold text-slate-500 uppercase mb-1">
              Últimos 30 dias
            </div>
            <div className="text-3xl font-black text-navy-950">
              {metrics.last30Days}
            </div>
            <div className="text-[11px] font-medium text-slate-500 mt-1">
              acessos para avaliação
            </div>
          </div>

          {/* Total Acumulado */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-[11px] font-bold text-gold-600 uppercase mb-1">
              Total Geral
            </div>
            <div className="text-3xl font-black text-navy-950">
              {metrics.total}
            </div>
            <div className="text-[11px] font-medium text-slate-500 mt-1">
              toques e leituras
            </div>
          </div>
        </div>
      </div>

      {/* Proporção NFC vs QR Code */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <h3 className="text-sm font-bold text-navy-950 mb-1">
          Distribuição por Canal Físico
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Como os clientes estão acessando a avaliação no seu balcão:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-navy-50 border border-navy-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-navy-950 text-white flex items-center justify-center">
                <Radio className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-navy-950">Aproximação NFC</div>
                <div className="text-[11px] text-slate-500">Mais rápido e direto</div>
              </div>
            </div>
            <div className="text-2xl font-black text-navy-950">
              {metrics.nfcPercentage}%
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gold-50 border border-gold-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold-500 text-navy-950 flex items-center justify-center">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-gold-950">Leitura de QR Code</div>
                <div className="text-[11px] text-slate-500">Backup para qualquer câmera</div>
              </div>
            </div>
            <div className="text-2xl font-black text-gold-900">
              {metrics.qrPercentage}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
