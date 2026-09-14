"use client";

import React, { useState } from "react";
import {
  CreditCard,
  Check,
  Zap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import SolutionsUpsell from "@/components/landing/SolutionsUpsell";

export default function PlanoPage() {
  const [upgraded, setUpgraded] = useState(false);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <span className="text-xs font-bold text-navy-800 uppercase tracking-wider bg-navy-50 px-2.5 py-1 rounded-md border border-navy-200">
            Gerenciamento de Assinatura
          </span>
          <h1 className="text-2xl font-black text-navy-950 mt-1">
            Plano da sua Placa Konnexy Tap
          </h1>
          <p className="text-xs text-slate-500">
            Sua placa física conta com plano gratuito perpétuo. Você pode assinar o Tap Pro opcionalmente a qualquer momento.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            {upgraded ? "Plano Tap PRO Ativo" : "Plano Gratuito Perpétuo Ativo"}
          </span>
        </div>
      </div>

      {/* Comparativo de Planos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Plano Gratuito */}
        <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Plano Incluído na Placa
              </span>
              <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                Plano Atual
              </span>
            </div>
            <h3 className="text-xl font-black text-navy-950">Básico Perpétuo</h3>
            <p className="text-xs text-slate-500 mt-1">
              Perfeito para manter sua presença física e digital no balcão sem nenhum custo mensal.
            </p>

            <div className="mt-4 mb-4">
              <span className="text-3xl font-black text-navy-950">R$ 0,00</span>
              <span className="text-xs font-semibold text-slate-500"> / vitalício</span>
            </div>

            <div className="space-y-2.5 border-t border-slate-100 pt-4 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Página pública personalizada</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Avaliações oficiais no Google</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp, Instagram e Como Chegar</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Até 5 links principais</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>1 Placa NFC cadastrada</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs font-bold text-slate-500">
            Ativo para sempre
          </div>
        </div>

        {/* Plano Pro */}
        <div className="bg-gradient-to-br from-navy-950 to-navy-900 text-white rounded-3xl p-6 border-2 border-gold-400/40 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-gold-500 text-navy-950 text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-wider">
            Recomendado
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gold-400">
                Aceleração Comercial
              </span>
            </div>
            <h3 className="text-xl font-black text-white">Konnexy Tap PRO</h3>
            <p className="text-xs text-slate-300 mt-1">
              Transforme seu balcão em uma máquina de captação de clientes fiéis e promoções ativas.
            </p>

            <div className="mt-4 mb-4">
              <span className="text-3xl font-black text-gold-400">R$ 29,90</span>
              <span className="text-xs font-semibold text-slate-400"> / mês (sem fidelidade)</span>
            </div>

            <div className="space-y-2.5 border-t border-navy-800 pt-4 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-gold-400" />
                <span>Clube de clientes VIP com captura LGPD</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-gold-400" />
                <span>Módulo de campanhas & cupons de desconto</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-gold-400" />
                <span>Analytics completo de acessos e cliques</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-gold-400" />
                <span>Exportação de contatos em CSV para WhatsApp</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-gold-400" />
                <span>Múltiplas placas (Balcão, Mesas e Caixa)</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-navy-800">
            <button
              onClick={() => setUpgraded(!upgraded)}
              className="w-full py-3 px-4 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              {upgraded ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Plano Tap PRO Ativado com Sucesso</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Assinar Tap PRO por R$ 29,90/mês</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Upsell: Soluções Konnexy */}
      <div className="rounded-3xl overflow-hidden border border-slate-200">
        <SolutionsUpsell />
      </div>
    </div>
  );
}
