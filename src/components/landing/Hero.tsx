"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Star,
  MessageCircle,
  Instagram,
  Utensils,
  Globe,
  Tag,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Users,
  Store,
  ArrowRight,
  QrCode,
} from "lucide-react";
import Logo, { KonnexyWaveIcon } from "@/components/brand/Logo";

interface HeroProps {
  onOpenReserve?: () => void;
}

type DestinationKey = "nfc" | "reviews" | "whatsapp" | "instagram" | "menu" | "site" | "promo";

interface DestinationItem {
  id: DestinationKey;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  badgeBg: string;
  activeBorder: string;
}

export default function Hero({ onOpenReserve }: HeroProps) {
  const [activeDestination, setActiveDestination] = useState<DestinationKey>("reviews");
  const [simulatedTap, setSimulatedTap] = useState(false);

  const destinations: DestinationItem[] = [
    {
      id: "nfc",
      title: "NFC + QR Code",
      subtitle: "Dois acessos na placa",
      icon: <KonnexyWaveIcon className="w-5 h-5" />,
      color: "text-cyan-400",
      badgeBg: "bg-cyan-950/90",
      activeBorder: "border-cyan-400 shadow-cyan-500/20",
    },
    {
      id: "reviews",
      title: "Avaliações",
      subtitle: "Google 5 estrelas",
      icon: <Star className="w-4 h-4 fill-amber-400 text-amber-400" />,
      color: "text-amber-400",
      badgeBg: "bg-amber-950/90",
      activeBorder: "border-amber-400 shadow-amber-500/20",
    },
    {
      id: "whatsapp",
      title: "WhatsApp",
      subtitle: "Atendimento expresso",
      icon: <MessageCircle className="w-4 h-4 text-emerald-400 fill-emerald-400/30" />,
      color: "text-emerald-400",
      badgeBg: "bg-emerald-950/90",
      activeBorder: "border-emerald-400 shadow-emerald-500/20",
    },
    {
      id: "instagram",
      title: "Instagram",
      subtitle: "Conecte seguidores",
      icon: <Instagram className="w-4 h-4 text-pink-400" />,
      color: "text-pink-400",
      badgeBg: "bg-pink-950/90",
      activeBorder: "border-pink-400 shadow-pink-500/20",
    },
    {
      id: "menu",
      title: "Cardápio",
      subtitle: "Digital & pedidos",
      icon: <Utensils className="w-4 h-4 text-amber-300" />,
      color: "text-amber-300",
      badgeBg: "bg-amber-950/90",
      activeBorder: "border-amber-300 shadow-amber-500/20",
    },
    {
      id: "site",
      title: "Site",
      subtitle: "Conheça a marca",
      icon: <Globe className="w-4 h-4 text-blue-400" />,
      color: "text-blue-400",
      badgeBg: "bg-blue-950/90",
      activeBorder: "border-blue-400 shadow-blue-500/20",
    },
    {
      id: "promo",
      title: "Promoções",
      subtitle: "Ofertas especiais",
      icon: <Tag className="w-4 h-4 text-teal-300" />,
      color: "text-teal-300",
      badgeBg: "bg-teal-950/90",
      activeBorder: "border-teal-300 shadow-teal-500/20",
    },
  ];

  const triggerTapSimulation = () => {
    setSimulatedTap(true);
    setTimeout(() => setSimulatedTap(false), 2400);
  };

  return (
    <section className="relative pt-6 pb-16 lg:pt-8 lg:pb-20 overflow-hidden bg-[#060B17] text-white">
      {/* Luzes Suaves de Fundo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[550px] pointer-events-none">
        <div className="absolute top-8 left-1/4 w-[450px] h-[300px] bg-cyan-600/12 rounded-full blur-[120px]" />
        <div className="absolute top-16 right-1/4 w-[400px] h-[320px] bg-blue-600/12 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8 lg:space-y-10">
        {/* ================================================================= */}
        {/* CABEÇALHO DO FLYER: "Uma placa. Várias possibilidades." */}
        {/* ================================================================= */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          {/* Tagline Elegante (Sem duplicar o logo da Navbar) */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs sm:text-sm font-extrabold uppercase tracking-wider shadow-sm">
            <span>✦ SEU NEGÓCIO CONECTADO</span>
          </div>

          {/* Título Principal com Proporção Equilibrada */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12]">
            Uma placa. <br />
            <span className="bg-gradient-to-r from-[#00D2FF] via-[#00B4D8] to-[#0066FF] bg-clip-text text-transparent">
              Várias possibilidades.
            </span>
          </h1>

          {/* Subtítulo Oficial */}
          <p className="text-sm sm:text-base lg:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto pt-1">
            Aproxime o celular e leve seu cliente para avaliações, WhatsApp, Instagram, cardápio ou promoções.
          </p>
        </div>

        {/* ================================================================= */}
        {/* BARRA DAS 7 POSSIBILIDADES (Compacta, sem barra branca de scroll) */}
        {/* ================================================================= */}
        <div id="possibilidades" className="relative">
          <div className="flex items-center justify-start lg:justify-center gap-2.5 sm:gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar px-1">
            {destinations.map((item) => {
              const isActive = activeDestination === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveDestination(item.id)}
                  className={`shrink-0 flex items-center gap-2.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl border transition-all duration-200 text-left cursor-pointer ${
                    isActive
                      ? `${item.badgeBg} ${item.activeBorder} shadow-lg scale-102 ring-1 ring-white/20`
                      : "bg-[#0B132B]/80 border-white/10 hover:border-white/25 hover:bg-[#0F1A36]"
                  }`}
                >
                  <div className={`p-1.5 rounded-lg bg-white/5 ${item.color}`}>
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                      <span>{item.title}</span>
                      {item.id === "nfc" && (
                        <span className="text-[9px] bg-cyan-500/20 text-cyan-300 px-1 py-0.2 rounded font-black">
                          TAG
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 leading-tight">
                      {item.subtitle}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ================================================================= */}
        {/* CENTRO: COMPOSIÇÃO COM A PLACA FÍSICA + CELULAR + CARD FLUTUANTE */}
        {/* ================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-6 items-center">
          {/* LADO ESQUERDO: Mockup Realista da Placa de Acrílico no Balcão */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-[330px]">
              {/* Iluminação de Mesa */}
              <div className="absolute -inset-2 bg-gradient-to-t from-cyan-500/10 via-transparent to-transparent rounded-3xl blur-xl" />

              {/* Placa Acrílica L-Stand */}
              <div className="relative rounded-3xl bg-gradient-to-b from-[#0A0F1D] to-[#040711] border-2 border-slate-700/80 p-6 shadow-2xl text-center space-y-4">
                {/* Reflexo de Vidro Acrílico */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-white/10 to-transparent rounded-tr-3xl pointer-events-none" />

                {/* Topo da Placa com a Logo Oficial */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <Logo theme="dark" size="sm" showTagline={false} />
                  <span className="text-[9px] uppercase tracking-widest text-cyan-300 font-bold bg-cyan-950/90 border border-cyan-500/30 px-2.5 py-0.5 rounded-full">
                    NFC + QR
                  </span>
                </div>

                {/* Ícone de Aproximação & QR Code */}
                <div className="py-1 space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-[#0D1629] border border-cyan-500/30 flex items-center justify-center shadow-inner group">
                    <KonnexyWaveIcon className="w-9 h-9" />
                  </div>

                  <div className="space-y-0.5">
                    <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
                      Aproxime seu celular
                    </h3>
                    <p className="text-[11px] text-cyan-300 font-medium">
                      ou escaneie o QR Code abaixo
                    </p>
                  </div>

                  {/* QR Code de Alta Resolução da Placa */}
                  <div className="bg-white p-3 rounded-2xl w-36 h-36 mx-auto flex flex-col items-center justify-center shadow-lg border border-slate-200">
                    <QrCode className="w-26 h-26 text-slate-900" />
                    <span className="text-[8px] font-mono text-slate-500 font-bold mt-1">
                      tap.konnexy.com.br/t/KX-A7K92
                    </span>
                  </div>
                </div>

                {/* Frase Emocional no Rodapé da Placa */}
                <div className="pt-2 border-t border-white/10 space-y-0.5">
                  <p className="text-[11px] text-slate-300 italic font-serif">
                    “Bons momentos geram grandes histórias.”
                  </p>
                  <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">
                    Konnexy Tap • Link Permanente
                  </p>
                </div>
              </div>

              {/* Base Transparente do Display de Acrílico (Efeito L-Stand) */}
              <div className="h-4 w-11/12 mx-auto bg-gradient-to-b from-slate-600/30 to-transparent rounded-b-xl blur-[1px]" />
            </div>
          </div>

          {/* CENTRO: Smartphone Interativo com a Tela Aberta */}
          <div className="lg:col-span-3 flex justify-center">
            <div className="relative w-[265px] sm:w-[275px]">
              {/* Celular Estilizado (iPhone Frame) */}
              <div className="relative rounded-[38px] bg-[#02050A] p-3 border-4 border-slate-700 shadow-2xl shadow-cyan-900/30">
                {/* Dynamic Island / Notch */}
                <div className="w-20 h-4 bg-black rounded-full mx-auto mb-2 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-slate-900 mr-2" />
                  <div className="w-2 h-2 rounded-full bg-blue-900/60" />
                </div>

                {/* Tela do Celular */}
                <div className="rounded-[28px] bg-gradient-to-b from-[#0B132B] to-[#070D1E] p-4 text-center space-y-3 border border-white/10 relative overflow-hidden min-h-[370px] flex flex-col justify-between">
                  {/* Feedback de Toque NFC Animado */}
                  {simulatedTap && (
                    <div className="absolute inset-0 bg-cyan-950/95 backdrop-blur-md z-30 flex flex-col items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
                      <div className="w-12 h-12 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center mb-2 animate-bounce">
                        <KonnexyWaveIcon className="w-8 h-8" />
                      </div>
                      <div className="text-xs font-black text-white">
                        Leitura NFC Concluída!
                      </div>
                      <div className="text-[10px] text-cyan-300 mt-0.5">
                        Abrindo página instantânea...
                      </div>
                    </div>
                  )}

                  {/* Topo da Tela do Cliente */}
                  <div>
                    <div className="w-9 h-9 rounded-xl bg-white/10 mx-auto flex items-center justify-center mb-1 border border-white/10 shadow-inner">
                      <KonnexyWaveIcon className="w-5 h-5" />
                    </div>
                    <div className="text-xs font-black text-white tracking-tight">
                      Café & Bistrô Modelo
                    </div>
                    <div className="text-[10px] text-cyan-300 font-bold">
                      Obrigado por nos visitar!
                    </div>
                  </div>

                  {/* Botões Dinâmicos no Celular */}
                  <div className="space-y-2 text-left">
                    {/* Botão 1: Avaliar no Google */}
                    <div
                      className={`p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                        activeDestination === "reviews"
                          ? "bg-amber-500 text-navy-950 font-black border-amber-300 shadow-md scale-102"
                          : "bg-white/10 text-white border-white/10 hover:bg-white/15"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Star className={`w-4 h-4 ${activeDestination === "reviews" ? "fill-navy-950 text-navy-950" : "fill-amber-400 text-amber-400"}`} />
                        <span className="text-[11px] font-bold">Avaliar no Google</span>
                      </div>
                      <div className="flex text-amber-300 text-[9px]">★★★★★</div>
                    </div>

                    {/* Botão 2: WhatsApp */}
                    <div
                      className={`p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                        activeDestination === "whatsapp"
                          ? "bg-emerald-500 text-white font-bold border-emerald-300 shadow-md scale-102"
                          : "bg-white/10 text-white border-white/10 hover:bg-white/15"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-emerald-400" />
                        <span className="text-[11px] font-bold">Falar no WhatsApp</span>
                      </div>
                      <ArrowRight className="w-3 h-3 text-slate-300" />
                    </div>

                    {/* Botão 3: Instagram */}
                    <div
                      className={`p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                        activeDestination === "instagram"
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold border-pink-400 shadow-md scale-102"
                          : "bg-white/10 text-white border-white/10 hover:bg-white/15"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Instagram className="w-4 h-4 text-pink-400" />
                        <span className="text-[11px] font-bold">Seguir no Instagram</span>
                      </div>
                      <ArrowRight className="w-3 h-3 text-slate-300" />
                    </div>

                    {/* Botão 4: Cardápio / Site */}
                    <div
                      className={`p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                        activeDestination === "menu" || activeDestination === "site"
                          ? "bg-cyan-500 text-navy-950 font-bold border-cyan-300 shadow-md scale-102"
                          : "bg-white/10 text-white border-white/10 hover:bg-white/15"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Utensils className="w-4 h-4 text-amber-300" />
                        <span className="text-[11px] font-bold">Ver Cardápio & Preços</span>
                      </div>
                      <ArrowRight className="w-3 h-3 text-slate-300" />
                    </div>
                  </div>

                  {/* Gatilho de Simulação */}
                  <button
                    onClick={triggerTapSimulation}
                    className="w-full py-2 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-[11px] font-bold border border-cyan-500/40 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <KonnexyWaveIcon className="w-3.5 h-3.5" />
                    <span>Simular Toque com Celular</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* LADO DIREITO: Card Flutuante com Checklist e Preço R$ 79,90 */}
          <div className="lg:col-span-4 flex flex-col justify-center space-y-4">
            <div className="p-6 rounded-3xl bg-gradient-to-b from-[#0A1128] to-[#060B17] border border-cyan-500/40 shadow-2xl relative overflow-hidden space-y-5">
              {/* Badge Superior: "Mude o destino sem trocar a placa" */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold shadow-md">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" style={{ animationDuration: "8s" }} />
                <span>Mude o destino sem trocar a placa</span>
              </div>

              {/* Lista de Vantagens com Checks Verdes */}
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-200">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-semibold">Configuração rápida em 2 minutos</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-semibold">Link dinâmico e permanente</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-semibold">Estatísticas de acessos em tempo real</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-semibold">Ideal para restaurantes, salões e comércio</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-semibold">Pronto para colocar no balcão e usar</span>
                </li>
              </ul>

              {/* Bloco de Preço R$ 79,90 */}
              <div className="pt-3 border-t border-white/10 space-y-1">
                <div className="text-xs text-slate-400 font-medium">
                  Placa a partir de:
                </div>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                    R$ 79,90
                  </span>
                  <span className="text-xs text-emerald-300 font-bold uppercase bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                    Pagamento Único
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Sem mensalidade obrigatória • Primeiro lote limitado
                </div>
              </div>

              {/* CTA do Card */}
              <button
                onClick={onOpenReserve}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
              >
                <span>Garantir Placa do 1º Lote</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* BARRA INFERIOR DE AÇÃO E CONVERSÃO (Flyer Rodapé) */}
        {/* ================================================================= */}
        <div className="rounded-3xl bg-gradient-to-r from-[#0A122C] via-[#0E1A3C] to-[#0A122C] border border-cyan-500/35 p-5 sm:p-6 shadow-2xl space-y-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Esquerda: "Peça sua proposta" + Botão WhatsApp Oficial */}
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left w-full lg:w-auto">
              <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 shrink-0">
                <Store className="w-7 h-7" />
              </div>
              <div className="space-y-0.5">
                <div className="text-base sm:text-lg font-black text-white tracking-tight">
                  Peça sua proposta para sua empresa
                </div>
                <div className="text-xs text-slate-300">
                  Fale com nossa equipe comercial e receba em seu comércio
                </div>
              </div>

              {/* Botão Oficial de WhatsApp */}
              <button
                onClick={onOpenReserve}
                className="sm:ml-3 w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-sm tracking-wide shadow-xl shadow-emerald-500/30 transition-all flex items-center justify-center gap-2.5 active:scale-95 border border-emerald-300/40 shrink-0 cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>Fale pelo WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Direita: 3 Indicadores de Crescimento (Flyer) */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 border-t lg:border-t-0 lg:border-l border-white/10 pt-4 lg:pt-0 lg:pl-6 w-full lg:w-auto text-center">
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-1 text-cyan-400 font-black text-xs sm:text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>+ CLIENTES</span>
                </div>
                <div className="text-[10px] text-slate-400 font-medium">Mais fluxo</div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-center gap-1 text-emerald-400 font-black text-xs sm:text-sm">
                  <Users className="w-4 h-4" />
                  <span>FIDELIZAÇÃO</span>
                </div>
                <div className="text-[10px] text-slate-400 font-medium">Retorno rápido</div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-center gap-1 text-amber-400 font-black text-xs sm:text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>+ VENDAS</span>
                </div>
                <div className="text-[10px] text-slate-400 font-medium">Conversão fácil</div>
              </div>
            </div>
          </div>

          {/* Slogan Final da Barra */}
          <div className="text-center pt-2 border-t border-white/5 text-[11px] text-slate-400 font-medium">
            Mais praticidade para seu negócio vender, divulgar e atender melhor.
          </div>
        </div>
      </div>
    </section>
  );
}
