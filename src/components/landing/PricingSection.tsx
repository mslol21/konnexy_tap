"use client";

import React from "react";
import Link from "next/link";
import { Check, Sparkles, ArrowRight, ShieldCheck, Zap } from "lucide-react";

export default function PricingSection() {
  return (
    <section id="precos" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="text-xs uppercase font-bold text-navy-800 tracking-wider bg-navy-50 border border-navy-200 px-3 py-1 rounded-full">
            Investimento Acessível e Transparente
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight">
            Comece com uma placa física. Sem taxas escondidas.
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Sua placa NFC continua funcionando para sempre com as funções essenciais gratuitas.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-5xl mx-auto">
          {/* Card Destaque: Placa Física NFC + Plano Básico Perpétuo */}
          <div className="lg:col-span-6 rounded-3xl p-8 bg-slate-50 border-2 border-navy-900 shadow-xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-navy-900 text-gold-400 text-[11px] font-black px-4 py-1.5 rounded-bl-2xl uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Mais Vendido
            </div>

            <div>
              <div className="text-sm font-bold uppercase tracking-wider text-navy-800">
                Produto Físico + Software
              </div>
              <h3 className="text-2xl font-black text-navy-950 mt-1">
                Placa Konnexy Tap NFC
              </h3>
              <p className="text-xs text-slate-600 mt-2">
                Placa física elegante de alta durabilidade com chip NFC embutido e QR Code permanente para balcão ou mesas.
              </p>

              {/* Preço */}
              <div className="mt-6 mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl sm:text-5xl font-black text-navy-950">
                    R$ 79,90
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    / pagamento único
                  </span>
                </div>
                <div className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100/90 px-2.5 py-0.5 rounded-md">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Sem mensalidade obrigatória. Uso gratuito perpétuo.
                </div>
              </div>

              {/* O que está incluso */}
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  O que acompanha a sua placa:
                </div>

                <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>1 Placa física NFC</strong> personalizada e codificada</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>QR Code permanente</strong> impresso na placa</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>Página digital inteligente</strong> ultrarrápida (mobile-first)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>URL permanente</strong> (nunca precisa reprogramar a placa)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Botão de avaliação oficial do <strong>Google Reviews</strong></span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Botões de <strong>WhatsApp, Instagram e Como Chegar</strong></span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Painel administrativo para alterar links a qualquer momento</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-4">
              <Link
                href="/cadastro"
                className="w-full py-4 px-6 bg-navy-950 hover:bg-navy-900 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                Garantir minha placa física agora
                <ArrowRight className="w-4 h-4 text-gold-400" />
              </Link>
            </div>
          </div>

          {/* Card Upgrade Futuro: Konnexy Tap PRO */}
          <div className="lg:col-span-6 rounded-3xl p-8 bg-white border border-slate-200 shadow-md flex flex-col justify-between relative">
            <div>
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold uppercase tracking-wider text-gold-600">
                  Assinatura Opcional
                </div>
                <span className="text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-full">
                  Recurso Avançado
                </span>
              </div>
              <h3 className="text-2xl font-black text-navy-950 mt-1">
                Konnexy Tap PRO
              </h3>
              <p className="text-xs text-slate-600 mt-2">
                Evolua seu balcão para uma central ativa de fidelização, captação de clientes e promoções dinâmicas.
              </p>

              {/* Preço Pro */}
              <div className="mt-6 mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl sm:text-5xl font-black text-navy-950">
                    R$ 29,90
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    / mês (opcional)
                  </span>
                </div>
                <div className="mt-1 text-xs text-slate-600">
                  Cancele a qualquer momento sem fidelidade.
                </div>
              </div>

              {/* Recursos Pro */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-gold-500" />
                  Tudo do Gratuito, mais:
                </div>

                <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-gold-600 shrink-0" />
                    <span><strong>Clube de Clientes VIP</strong> com captura LGPD</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-gold-600 shrink-0" />
                    <span><strong>Módulo de Campanhas e Cupons</strong> de desconto ativos</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-gold-600 shrink-0" />
                    <span><strong>Analytics detalhado</strong> (acessos, cliques e conversões)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-gold-600 shrink-0" />
                    <span><strong>Exportação de contatos</strong> em CSV para campanhas no WhatsApp</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-gold-600 shrink-0" />
                    <span><strong>Gestão de múltiplas placas</strong> (Balcão, Mesa 1, Mesa 2, Caixa)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-gold-600 shrink-0" />
                    <span><strong>Personalização avançada de cores</strong> e posicionamento livre</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-4">
              <Link
                href="/cadastro"
                className="w-full py-4 px-6 bg-slate-100 hover:bg-slate-200 text-navy-950 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
              >
                Conhecer recursos Pro no Painel
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
