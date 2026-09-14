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
    <section className="relative overflow-hidden pt-6 pb-12 lg:pt-10 lg:pb-16">
      {/* Background sutil */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 right-1/4 w-96 h-96 bg-[#C78D4E]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-20 w-80 h-80 bg-[#30363D]/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Coluna da Esquerda: Proposta de Valor */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Badge de Posicionamento */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#E8E3DD] shadow-xs mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C78D4E] animate-pulse" />
              <span className="text-[11px] font-bold tracking-wider text-[#30363D] uppercase">
                Presença Digital para Negócios Locais
              </span>
            </div>

            {/* Título Principal */}
            <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-extrabold text-[#20252A] leading-[1.24] tracking-tight mb-4">
              Transforme bons atendimentos em{" "}
              <span className="text-[#C78D4E] underline decoration-[#C78D4E]/30 underline-offset-4">
                mais presença no Google
              </span>
              .
            </h1>

            {/* Subtítulo */}
            <p className="text-sm sm:text-base text-[#6D7277] leading-relaxed max-w-xl mb-6">
              Com nossa placa inteligente NFC + QR Code, seu cliente aproxima o celular e vai direto para a página de avaliação da sua empresa. Sem baixar aplicativo, sem complicação.
            </p>

            {/* Caixa de Preço e Urgência Comercial */}
            <div className="w-full sm:w-auto p-3.5 sm:p-4 rounded-xl bg-white border border-[#E8E3DD] shadow-xs mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl sm:text-2xl font-extrabold text-[#20252A]">
                    R$ 79,90
                  </span>
                  <span className="text-[11px] font-semibold text-[#6D7277] uppercase tracking-wide">
                    Pagamento único
                  </span>
                </div>
                <p className="text-[11px] text-[#6D7277] mt-0.5">
                  Sem mensalidade obrigatória • Placa física configurada
                </p>
              </div>

              <div className="sm:border-l sm:border-[#E8E3DD] sm:pl-4">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F7F5F2] border border-[#E8E3DD] text-[10px] font-bold text-[#C78D4E]">
                  ✦ Primeiro lote chegando • Reservas abertas
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto mb-6">
              <button
                onClick={onOpenReserve}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-[#20252A] hover:bg-[#30363D] text-white shadow-sm hover:shadow transition-all border border-[#20252A] active:scale-95 cursor-pointer"
              >
                <span>Quero reservar minha placa</span>
                <ArrowRight className="w-4 h-4 text-[#C78D4E]" />
              </button>

              <a
                href="#como-funciona"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-[#30363D] bg-white hover:bg-[#F7F5F2] border border-[#E8E3DD] transition-all"
              >
                <span>Ver como funciona</span>
              </a>
            </div>

            {/* Selo de Garantia e Confiança */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-[#6D7277]">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C78D4E]" />
                Pronta para colocar no balcão
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C78D4E]" />
                Link definitivo gerenciado
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-[#C78D4E]" />
                Funciona em iPhone e Android
              </span>
            </div>
          </div>

          {/* Coluna da Direita: Mockup Realista da Placa e Smartphone */}
          <div className="lg:col-span-5 relative">
            
            {/* Card Principal da Placa Física */}
            <div className="relative mx-auto max-w-[420px] rounded-3xl overflow-hidden bg-white shadow-xl border border-[#E5E1D8]">
              {/* Foto Realista 3D da Placa Oficial */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/brand/placa-oficial.jpg"
                  alt="Placa Inteligente Otimiza Meu Negócio"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#181C21]/80 via-transparent to-transparent flex items-end p-4">
                  <div className="flex items-center justify-between w-full">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#242A30]/90 backdrop-blur-md border border-[#BD7B48]/40 text-[11px] font-bold text-white shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-[#BD7B48] animate-pulse" />
                      Acrílico Premium • NFC + QR Code
                    </span>
                    <span className="text-xs font-extrabold text-[#D9945F]">
                      R$ 79,90
                    </span>
                  </div>
                </div>
              </div>

              {/* Informações e Teste Interativo */}
              <div className="p-4 bg-white border-t border-[#E5E1D8]">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div>
                    <h4 className="text-xs font-bold text-[#242A30]">
                      Placa Inteligente de Avaliações
                    </h4>
                    <p className="text-[11px] text-[#666E7A]">
                      Configurada para o Google da sua empresa
                    </p>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-[#BD7B48] text-[#BD7B48]" />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3 text-[11px] text-[#666E7A]">
                  <div className="p-2 rounded-lg bg-[#F5F3EF] border border-[#E5E1D8] flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#BD7B48]" />
                    <span>Aproximação NFC</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#F5F3EF] border border-[#E5E1D8] flex items-center gap-1.5">
                    <QrCode className="w-3.5 h-3.5 text-[#BD7B48]" />
                    <span>QR Code Câmera</span>
                  </div>
                </div>

                {/* Botão de Teste Interativo */}
                <button
                  onClick={triggerSimulation}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#242A30] hover:bg-[#363E48] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#D9945F]" />
                  <span>Simular toque do celular do cliente</span>
                </button>
              </div>

              {/* Base de Apoio */}
              <div className="px-4 py-2 bg-[#F5F3EF] border-t border-[#E5E1D8] flex items-center justify-between text-[10px] text-[#666E7A]">
                <span>Acrílico espelhado de alta resistência</span>
                <span className="text-[#BD7B48] font-bold">1º Lote Comercial</span>
              </div>
            </div>

            {/* Simulação Flutuante de Notificação no Celular */}
            {simulatedTap && (
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-11/12 max-w-xs bg-white text-[#242A30] rounded-2xl p-4 shadow-2xl border-2 border-[#BD7B48] animate-in zoom-in-95 duration-200 z-20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F5F3EF] border border-[#E5E1D8] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-[#BD7B48]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#BD7B48]">
                      Google Avaliações
                    </p>
                    <p className="text-xs font-semibold truncate text-[#242A30]">
                      Sua Empresa no Google
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-3 h-3 fill-[#BD7B48] text-[#BD7B48]" />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-2.5 pt-2 border-t border-[#E5E1D8] flex justify-between items-center text-[10px] text-[#666E7A]">
                  <span>Página aberta em 1 segundo</span>
                  <span className="font-bold text-[#BD7B48]">Avaliar agora →</span>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* SEÇÃO 3: FAIXA DE PROVA DE VALOR (4 Pilares) */}
        <div className="mt-12 pt-8 border-t border-[#E5E1D8]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white border border-[#E5E1D8] shadow-xs">
              <div className="w-9 h-9 rounded-lg bg-[#F5F3EF] flex items-center justify-center shrink-0 border border-[#E5E1D8]">
                <Zap className="w-4.5 h-4.5 text-[#BD7B48]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#242A30]">NFC + QR Code</h4>
                <p className="text-[11px] text-[#666E7A] mt-0.5">
                  Dupla tecnologia para funcionar em qualquer celular moderno.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white border border-[#E5E1D8] shadow-xs">
              <div className="w-9 h-9 rounded-lg bg-[#F5F3EF] flex items-center justify-center shrink-0 border border-[#E5E1D8]">
                <ShieldCheck className="w-4.5 h-4.5 text-[#BD7B48]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#242A30]">Configurada para sua empresa</h4>
                <p className="text-[11px] text-[#666E7A] mt-0.5">
                  A placa chega pronta. É só tirar da caixa e colocar no balcão.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white border border-[#E5E1D8] shadow-xs">
              <div className="w-9 h-9 rounded-lg bg-[#F5F3EF] flex items-center justify-center shrink-0 border border-[#E5E1D8]">
                <Smartphone className="w-4.5 h-4.5 text-[#BD7B48]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#242A30]">Sem aplicativo</h4>
                <p className="text-[11px] text-[#666E7A] mt-0.5">
                  Funciona direto no navegador nativo do smartphone do cliente.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white border border-[#E5E1D8] shadow-xs">
              <div className="w-9 h-9 rounded-lg bg-[#F5F3EF] flex items-center justify-center shrink-0 border border-[#E5E1D8]">
                <CheckCircle2 className="w-4.5 h-4.5 text-[#BD7B48]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#242A30]">Pagamento único</h4>
                <p className="text-[11px] text-[#666E7A] mt-0.5">
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
