"use client";

import React, { useState } from "react";
import {
  Star,
  ArrowRight,
  Sparkles,
  QrCode,
  Smartphone,
  CheckCircle2,
  ShieldCheck,
  Zap,
  MapPin,
} from "lucide-react";
import Logo from "@/components/brand/Logo";

interface HeroProps {
  onOpenReserve?: () => void;
}

export default function Hero({ onOpenReserve }: HeroProps) {
  const [activeTab, setActiveTab] = useState<"nfc" | "qr">("nfc");
  const [simulatedTap, setSimulatedTap] = useState(false);

  const triggerSimulation = () => {
    setSimulatedTap(true);
    setTimeout(() => setSimulatedTap(false), 3000);
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Background sutil */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 right-1/4 w-96 h-96 bg-[#C78D4E]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-20 w-80 h-80 bg-[#30363D]/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Coluna da Esquerda: Proposta de Valor */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Badge de Posicionamento */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFFFF] border border-[#E8E3DD] shadow-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-[#C78D4E] animate-pulse" />
              <span className="text-xs font-semibold tracking-wider text-[#30363D] uppercase">
                Presença Digital para Negócios Locais
              </span>
            </div>

            {/* Título Principal */}
            <h1 className="text-3xl sm:text-4xl lg:text-[50px] font-extrabold text-[#20252A] leading-[1.18] tracking-tight mb-6">
              Transforme bons atendimentos em{" "}
              <span className="text-[#C78D4E] underline decoration-[#C78D4E]/30 underline-offset-8">
                mais presença no Google
              </span>
              .
            </h1>

            {/* Subtítulo */}
            <p className="text-base sm:text-lg text-[#6D7277] leading-relaxed max-w-2xl mb-8">
              Com nossa placa inteligente NFC + QR Code, seu cliente aproxima o celular e vai direto para a página de avaliação da sua empresa. Sem baixar aplicativo, sem complicação.
            </p>

            {/* Caixa de Preço e Urgência Comercial */}
            <div className="w-full sm:w-auto p-4 sm:p-5 rounded-2xl bg-white border border-[#E8E3DD] shadow-sm mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#20252A]">
                    R$ 79,90
                  </span>
                  <span className="text-xs font-semibold text-[#6D7277] uppercase tracking-wide">
                    Pagamento único
                  </span>
                </div>
                <p className="text-xs text-[#6D7277] mt-0.5">
                  Sem mensalidade obrigatória • Placa física configurada
                </p>
              </div>

              <div className="sm:border-l sm:border-[#E8E3DD] sm:pl-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#F7F5F2] border border-[#E8E3DD] text-[11px] font-semibold text-[#C78D4E]">
                  ✦ Primeiro lote chegando • Reservas abertas
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-8">
              <button
                onClick={onOpenReserve}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl text-base font-bold bg-[#20252A] hover:bg-[#30363D] text-white shadow-md hover:shadow-lg transition-all border border-[#20252A] active:scale-95 cursor-pointer"
              >
                <span>Quero reservar minha placa</span>
                <ArrowRight className="w-5 h-5 text-[#C78D4E]" />
              </button>

              <a
                href="#como-funciona"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-semibold text-[#30363D] bg-white hover:bg-[#F7F5F2] border border-[#E8E3DD] transition-all"
              >
                <span>Ver como funciona</span>
              </a>
            </div>

            {/* Selo de Garantia e Confiança */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-[#6D7277]">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#C78D4E]" />
                Pronta para colocar no balcão
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#C78D4E]" />
                Link definitivo gerenciado
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-[#C78D4E]" />
                Funciona em iPhone e Android
              </span>
            </div>
          </div>

          {/* Coluna da Direita: Mockup Realista da Placa e Smartphone */}
          <div className="lg:col-span-5 relative">
            
            {/* Card Principal da Placa Física */}
            <div className="relative mx-auto max-w-[430px] rounded-3xl p-6 bg-gradient-to-b from-[#252B31] to-[#1A1E23] text-white shadow-2xl border border-[#3A414A]">
              
              {/* Acabamento de Acrílico nobre */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#C78D4E]" />
                  <span className="text-[11px] font-semibold text-white/70 uppercase tracking-widest">
                    Placa Inteligente
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[#D8A66C] text-xs font-semibold">
                  <span>OTIMIZA MEU NEGÓCIO</span>
                </div>
              </div>

              {/* Corpo da Placa de Balcão */}
              <div className="py-6 flex flex-col items-center text-center">
                
                {/* 5 Estrelas Douradas */}
                <div className="flex items-center gap-1.5 mb-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-5 h-5 fill-[#C78D4E] text-[#C78D4E]" />
                  ))}
                </div>

                <h3 className="text-xl font-extrabold text-white mb-1">
                  Avalie nossa empresa no Google
                </h3>
                <p className="text-xs text-slate-300 max-w-xs mb-6">
                  Sua opinião ajuda nossa equipe e fortalece nossa presença local.
                </p>

                {/* Área de Aproximação / QR Code */}
                <div className="w-full bg-[#20252A] rounded-2xl p-5 border border-white/10 flex flex-col items-center">
                  
                  {/* Seletor NFC ou QR */}
                  <div className="flex gap-2 p-1 bg-[#15191C] rounded-xl border border-white/5 mb-4 text-xs font-semibold">
                    <button
                      onClick={() => setActiveTab("nfc")}
                      className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                        activeTab === "nfc"
                          ? "bg-[#C78D4E] text-white shadow-sm"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5" />
                      Aproximação NFC
                    </button>
                    <button
                      onClick={() => setActiveTab("qr")}
                      className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                        activeTab === "qr"
                          ? "bg-[#C78D4E] text-white shadow-sm"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      QR Code Câmera
                    </button>
                  </div>

                  {/* Conteúdo Dinâmico da Placa */}
                  {activeTab === "nfc" ? (
                    <div className="flex flex-col items-center py-3">
                      <div className="relative w-20 h-20 rounded-full bg-[#1A1E23] border-2 border-[#C78D4E]/40 flex items-center justify-center mb-3">
                        <div className="absolute inset-0 rounded-full border border-[#C78D4E]/20 animate-ping" />
                        <Zap className="w-9 h-9 text-[#C78D4E]" />
                      </div>
                      <span className="text-xs font-bold text-white tracking-wide">
                        APROXIME SEU CELULAR AQUI
                      </span>
                      <span className="text-[11px] text-slate-400 mt-1">
                        Chip NFC integrado de alta sensibilidade
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-2">
                      <div className="p-3 bg-white rounded-xl shadow-inner mb-2">
                        <QrCode className="w-24 h-24 text-[#20252A]" />
                      </div>
                      <span className="text-xs font-bold text-white">
                        APONTE A CÂMERA DO CELULAR
                      </span>
                      <span className="text-[11px] text-slate-400 mt-1">
                        Acesso instantâneo sem baixar app
                      </span>
                    </div>
                  )}
                </div>

                {/* Botão de Teste Interativo */}
                <button
                  onClick={triggerSimulation}
                  className="mt-4 text-xs text-[#D8A66C] hover:text-white underline underline-offset-4 flex items-center gap-1.5 font-medium cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#C78D4E]" />
                  Simular toque do celular do cliente
                </button>
              </div>

              {/* Base de Apoio */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
                <span>Material: Acrílico de alta durabilidade</span>
                <span className="text-[#D8A66C] font-semibold">Tamanho balcão</span>
              </div>
            </div>

            {/* Simulação Flutuante de Notificação no Celular */}
            {simulatedTap && (
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-11/12 max-w-xs bg-white text-[#20252A] rounded-2xl p-4 shadow-2xl border-2 border-[#C78D4E] animate-in zoom-in-95 duration-200 z-20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F7F5F2] border border-[#E8E3DD] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-[#C78D4E]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#C78D4E]">
                      Google Avaliações
                    </p>
                    <p className="text-xs font-semibold truncate text-[#20252A]">
                      Sua Empresa no Google
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-3 h-3 fill-[#C78D4E] text-[#C78D4E]" />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-2.5 pt-2 border-t border-[#E8E3DD] flex justify-between items-center text-[10px] text-[#6D7277]">
                  <span>Página aberta em 1 segundo</span>
                  <span className="font-bold text-[#C78D4E]">Avaliar agora →</span>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* SEÇÃO 3: FAIXA DE PROVA DE VALOR (4 Pilares) */}
        <div className="mt-16 pt-10 border-t border-[#E8E3DD]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-[#E8E3DD] shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#F7F5F2] flex items-center justify-center shrink-0 border border-[#E8E3DD]">
                <Zap className="w-5 h-5 text-[#C78D4E]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#20252A]">NFC + QR Code</h4>
                <p className="text-xs text-[#6D7277] mt-0.5">
                  Dupla tecnologia para funcionar em qualquer celular moderno.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-[#E8E3DD] shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#F7F5F2] flex items-center justify-center shrink-0 border border-[#E8E3DD]">
                <ShieldCheck className="w-5 h-5 text-[#C78D4E]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#20252A]">Configurada para sua empresa</h4>
                <p className="text-xs text-[#6D7277] mt-0.5">
                  A placa chega pronta. É só tirar da caixa e colocar no balcão.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-[#E8E3DD] shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#F7F5F2] flex items-center justify-center shrink-0 border border-[#E8E3DD]">
                <Smartphone className="w-5 h-5 text-[#C78D4E]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#20252A]">Sem aplicativo</h4>
                <p className="text-xs text-[#6D7277] mt-0.5">
                  Funciona direto no navegador nativo do smartphone do cliente.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-[#E8E3DD] shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#F7F5F2] flex items-center justify-center shrink-0 border border-[#E8E3DD]">
                <CheckCircle2 className="w-5 h-5 text-[#C78D4E]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#20252A]">Pagamento único</h4>
                <p className="text-xs text-[#6D7277] mt-0.5">
                  R$ 79,90 por placa. Sem mensalidade obrigatória ou surpresas.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
