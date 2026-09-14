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
      subtitle: "Dois acessos na mesma placa",
      icon: <KonnexyWaveIcon className="w-6 h-6" />,
      color: "text-cyan-400",
      badgeBg: "bg-cyan-950/90",
      activeBorder: "border-cyan-400 shadow-cyan-500/25",
    },
    {
      id: "reviews",
      title: "Avaliações",
      subtitle: "Google 5 estrelas",
      icon: <Star className="w-5 h-5 fill-amber-400 text-amber-400" />,
      color: "text-amber-400",
      badgeBg: "bg-amber-950/90",
      activeBorder: "border-amber-400 shadow-amber-500/25",
    },
    {
      id: "whatsapp",
      title: "WhatsApp",
      subtitle: "Atendimento Expresso",
      icon: <MessageCircle className="w-5 h-5 text-emerald-400 fill-emerald-400/30" />,
      color: "text-emerald-400",
      badgeBg: "bg-emerald-950/90",
      activeBorder: "border-emerald-400 shadow-emerald-500/25",
    },
    {
      id: "instagram",
      title: "Instagram",
      subtitle: "Conecte mais seguidores",
      icon: <Instagram className="w-5 h-5 text-pink-400" />,
      color: "text-pink-400",
      badgeBg: "bg-pink-950/90",
      activeBorder: "border-pink-400 shadow-pink-500/25",
    },
    {
      id: "menu",
      title: "Cardápio",
      subtitle: "Digital & Pedidos",
      icon: <Utensils className="w-5 h-5 text-amber-300" />,
      color: "text-amber-300",
      badgeBg: "bg-amber-950/90",
      activeBorder: "border-amber-300 shadow-amber-500/25",
    },
    {
      id: "site",
      title: "Site",
      subtitle: "Conheça mais da marca",
      icon: <Globe className="w-5 h-5 text-blue-400" />,
      color: "text-blue-400",
      badgeBg: "bg-blue-950/90",
      activeBorder: "border-blue-400 shadow-blue-500/25",
    },
    {
      id: "promo",
      title: "Promoções",
      subtitle: "Ofertas especiais",
      icon: <Tag className="w-5 h-5 text-teal-300" />,
      color: "text-teal-300",
      badgeBg: "bg-teal-950/90",
      activeBorder: "border-teal-300 shadow-teal-500/25",
    },
  ];

  const triggerTapSimulation = () => {
    setSimulatedTap(true);
    setTimeout(() => setSimulatedTap(false), 2400);
  };

  return (
    <section className="relative pt-8 pb-20 lg:pt-14 lg:pb-28 overflow-hidden bg-[#060B17] text-white">
      {/* Luzes e Efeitos de Fundo Ampliados */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1600px] h-[750px] pointer-events-none">
        <div className="absolute top-10 left-1/5 w-[650px] h-[450px] bg-cyan-600/15 rounded-full blur-[140px]" />
        <div className="absolute top-20 right-1/5 w-[600px] h-[480px] bg-blue-600/15 rounded-full blur-[160px]" />
      </div>

      {/* Container Ampliado para preencher a tela confortavelmente */}
      <div className="max-w-[1520px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 relative z-10 space-y-12 lg:space-y-16">
        {/* ================================================================= */}
        {/* CABEÇALHO DO FLYER: "Uma placa. Várias possibilidades." */}
        {/* ================================================================= */}
        <div className="text-center max-w-4xl mx-auto space-y-5">
          {/* Logo Central & Tagline */}
          <div className="inline-flex flex-col items-center">
            <Logo theme="dark" size="lg" showTagline={true} />
            <div className="mt-3 text-sm sm:text-base font-semibold text-cyan-400 flex items-center gap-2 italic tracking-wide">
              <span>✦ Seu negócio conectado</span>
            </div>
          </div>

          {/* Grande Título em 2 Linhas (+25% de tamanho) */}
          <div className="pt-2">
            <h1 className="text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tight leading-[1.08]">
              Uma placa. <br />
              <span className="bg-gradient-to-r from-[#00D2FF] via-[#00B4D8] to-[#0066FF] bg-clip-text text-transparent drop-shadow-md">
                Várias possibilidades.
              </span>
            </h1>
          </div>

          {/* Subtítulo Oficial (+25% de tamanho) */}
          <p className="text-lg sm:text-xl lg:text-2xl text-slate-200 font-normal leading-relaxed max-w-3xl mx-auto">
            Aproxime o celular e leve seu cliente para avaliações, WhatsApp, Instagram, cardápio ou promoções.
          </p>
        </div>

        {/* ================================================================= */}
        {/* BARRA DAS 7 POSSIBILIDADES (Ampliada +25%) */}
        {/* ================================================================= */}
        <div id="possibilidades" className="relative">
          <div className="flex items-center justify-start xl:justify-center gap-3 sm:gap-4 overflow-x-auto pb-4 pt-1 no-scrollbar px-2">
            {destinations.map((item) => {
              const isActive = activeDestination === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveDestination(item.id)}
                  className={`shrink-0 flex items-center gap-3 px-5 py-3 sm:px-6 sm:py-3.5 rounded-2xl border transition-all duration-200 text-left cursor-pointer ${
                    isActive
                      ? `${item.badgeBg} ${item.activeBorder} shadow-xl scale-105 ring-2 ring-white/20`
                      : "bg-[#0B132B]/80 border-white/10 hover:border-white/30 hover:bg-[#0F1A36]"
                  }`}
                >
                  <div className={`p-2 rounded-xl bg-white/5 ${item.color}`}>
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-sm sm:text-base font-black text-white tracking-tight flex items-center gap-1.5">
                      <span>{item.title}</span>
                      {item.id === "nfc" && (
                        <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded-md font-black">
                          TAG
                        </span>
                      )}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-300 leading-tight mt-0.5">
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center pt-4">
          {/* LADO ESQUERDO: Mockup Realista da Placa de Acrílico no Balcão */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-[400px]">
              {/* Iluminação de Mesa / Superfície */}
              <div className="absolute -inset-4 bg-gradient-to-t from-cyan-500/15 via-transparent to-transparent rounded-3xl blur-2xl" />

              {/* Placa Acrílica L-Stand */}
              <div className="relative rounded-[32px] bg-gradient-to-b from-[#0A0F1D] to-[#040711] border-2 border-slate-700/90 p-7 sm:p-8 shadow-2xl text-center space-y-5">
                {/* Reflexo de Vidro Acrílico */}
                <div className="absolute top-0 right-0 w-52 h-52 bg-gradient-to-bl from-white/10 to-transparent rounded-tr-[32px] pointer-events-none" />

                {/* Topo da Placa com a Logo Oficial */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <Logo theme="dark" size="sm" showTagline={false} />
                  <span className="text-[10px] uppercase tracking-widest text-cyan-300 font-black bg-cyan-950/90 border border-cyan-500/40 px-3 py-1 rounded-full">
                    NFC + QR CODE
                  </span>
                </div>

                {/* Ícone de Aproximação & QR Code */}
                <div className="py-2 space-y-4">
                  <div className="w-20 h-20 mx-auto rounded-3xl bg-[#0D1629] border border-cyan-500/30 flex items-center justify-center shadow-inner group">
                    <KonnexyWaveIcon className="w-12 h-12" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">
                      Aproxime seu celular
                    </h3>
                    <p className="text-xs sm:text-sm text-cyan-300 font-bold">
                      ou escaneie o QR Code abaixo
                    </p>
                  </div>

                  {/* QR Code de Alta Resolução da Placa */}
                  <div className="bg-white p-4 rounded-3xl w-48 h-48 mx-auto flex flex-col items-center justify-center shadow-2xl border border-slate-200">
                    <QrCode className="w-36 h-36 text-slate-900" />
                    <span className="text-[10px] font-mono text-slate-600 font-extrabold mt-1.5">
                      tap.konnexy.com.br/t/KX-A7K92
                    </span>
                  </div>
                </div>

                {/* Frase Emocional no Rodapé da Placa */}
                <div className="pt-3 border-t border-white/10 space-y-1">
                  <p className="text-xs sm:text-sm text-slate-200 italic font-serif">
                    “Bons momentos geram grandes histórias.”
                  </p>
                  <p className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-widest font-bold">
                    Konnexy Tap • Link Permanente
                  </p>
                </div>
              </div>

              {/* Base Transparente do Display de Acrílico (Efeito L-Stand) */}
              <div className="h-5 w-11/12 mx-auto bg-gradient-to-b from-slate-600/40 to-transparent rounded-b-2xl blur-[1px]" />
            </div>
          </div>

          {/* CENTRO: Smartphone Interativo com a Tela Aberta */}
          <div className="lg:col-span-3 flex justify-center">
            <div className="relative w-[310px] sm:w-[325px]">
              {/* Celular Estilizado (iPhone Frame) */}
              <div className="relative rounded-[46px] bg-[#02050A] p-3.5 border-4 border-slate-700 shadow-2xl shadow-cyan-900/40">
                {/* Dynamic Island / Notch */}
                <div className="w-24 h-5 bg-black rounded-full mx-auto mb-3 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-900 mr-2.5" />
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-900/70" />
                </div>

                {/* Tela do Celular */}
                <div className="rounded-[36px] bg-gradient-to-b from-[#0B132B] to-[#070D1E] p-5 text-center space-y-4 border border-white/10 relative overflow-hidden min-h-[440px] flex flex-col justify-between">
                  {/* Feedback de Toque NFC Animado */}
                  {simulatedTap && (
                    <div className="absolute inset-0 bg-cyan-950/95 backdrop-blur-md z-30 flex flex-col items-center justify-center p-5 animate-in fade-in zoom-in-95 duration-200">
                      <div className="w-16 h-16 rounded-full bg-cyan-500/25 text-cyan-300 flex items-center justify-center mb-3 animate-bounce">
                        <KonnexyWaveIcon className="w-10 h-10" />
                      </div>
                      <div className="text-sm font-black text-white">
                        Leitura NFC Concluída!
                      </div>
                      <div className="text-xs text-cyan-300 mt-1">
                        Abrindo página instantânea...
                      </div>
                    </div>
                  )}

                  {/* Topo da Tela do Cliente */}
                  <div>
                    <div className="w-11 h-11 rounded-2xl bg-white/10 mx-auto flex items-center justify-center mb-2 border border-white/15 shadow-inner">
                      <KonnexyWaveIcon className="w-6 h-6" />
                    </div>
                    <div className="text-sm font-black text-white tracking-tight">
                      Café & Bistrô Modelo
                    </div>
                    <div className="text-xs text-cyan-300 font-bold mt-0.5">
                      Obrigado por nos visitar!
                    </div>
                  </div>

                  {/* Botões Dinâmicos no Celular (+25% de legibilidade) */}
                  <div className="space-y-2.5 text-left">
                    {/* Botão 1: Avaliar no Google */}
                    <div
                      className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                        activeDestination === "reviews"
                          ? "bg-amber-500 text-navy-950 font-black border-amber-300 shadow-lg scale-102"
                          : "bg-white/10 text-white border-white/10 hover:bg-white/15"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Star className={`w-5 h-5 ${activeDestination === "reviews" ? "fill-navy-950 text-navy-950" : "fill-amber-400 text-amber-400"}`} />
                        <span className="text-xs sm:text-sm font-bold">Avaliar no Google</span>
                      </div>
                      <div className="flex text-amber-300 text-[10px]">★★★★★</div>
                    </div>

                    {/* Botão 2: WhatsApp */}
                    <div
                      className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                        activeDestination === "whatsapp"
                          ? "bg-emerald-500 text-white font-bold border-emerald-300 shadow-lg scale-102"
                          : "bg-white/10 text-white border-white/10 hover:bg-white/15"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <MessageCircle className="w-5 h-5 text-emerald-400" />
                        <span className="text-xs sm:text-sm font-bold">Falar no WhatsApp</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                    </div>

                    {/* Botão 3: Instagram */}
                    <div
                      className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                        activeDestination === "instagram"
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold border-pink-400 shadow-lg scale-102"
                          : "bg-white/10 text-white border-white/10 hover:bg-white/15"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Instagram className="w-5 h-5 text-pink-400" />
                        <span className="text-xs sm:text-sm font-bold">Seguir no Instagram</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                    </div>

                    {/* Botão 4: Cardápio / Site */}
                    <div
                      className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                        activeDestination === "menu" || activeDestination === "site"
                          ? "bg-cyan-500 text-navy-950 font-bold border-cyan-300 shadow-lg scale-102"
                          : "bg-white/10 text-white border-white/10 hover:bg-white/15"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Utensils className="w-5 h-5 text-amber-300" />
                        <span className="text-xs sm:text-sm font-bold">Ver Cardápio & Preços</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                    </div>
                  </div>

                  {/* Gatilho de Simulação */}
                  <button
                    onClick={triggerTapSimulation}
                    className="w-full py-2.5 px-4 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-bold border border-cyan-500/40 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <KonnexyWaveIcon className="w-4 h-4" />
                    <span>Simular Toque com Celular</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* LADO DIREITO: Card Flutuante com Checklist e Preço R$ 79,90 */}
          <div className="lg:col-span-4 flex flex-col justify-center space-y-5">
            <div className="p-7 sm:p-8 rounded-[32px] bg-gradient-to-b from-[#0A1128] to-[#060B17] border border-cyan-500/40 shadow-2xl relative overflow-hidden space-y-6">
              {/* Badge Superior: "Mude o destino sem trocar a placa" */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-bold shadow-md">
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" style={{ animationDuration: "8s" }} />
                <span>Mude o destino sem trocar a placa</span>
              </div>

              {/* Lista de Vantagens com Checks Verdes (+25% de tamanho) */}
              <ul className="space-y-3.5 text-sm sm:text-base text-slate-100">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="font-semibold">Configuração rápida em 2 minutos</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="font-semibold">Link dinâmico e permanente</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="font-semibold">Estatísticas de acessos em tempo real</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="font-semibold">Ideal para restaurantes, salões e comércio</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="font-semibold">Pronto para colocar no balcão e usar</span>
                </li>
              </ul>

              {/* Bloco de Preço R$ 79,90 (+25% de tamanho) */}
              <div className="pt-4 border-t border-white/15 space-y-1.5">
                <div className="text-xs sm:text-sm text-slate-300 font-medium">
                  Placa a partir de:
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight">
                    R$ 79,90
                  </span>
                  <span className="text-xs sm:text-sm text-emerald-300 font-bold uppercase bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 rounded-full">
                    Pagamento Único
                  </span>
                </div>
                <div className="text-xs sm:text-sm text-slate-400">
                  Sem mensalidade obrigatória • Primeiro lote limitado
                </div>
              </div>

              {/* CTA do Card */}
              <button
                onClick={onOpenReserve}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-sm sm:text-base uppercase tracking-wider shadow-xl shadow-cyan-500/30 transition-all flex items-center justify-center gap-2.5 active:scale-98 cursor-pointer"
              >
                <span>Garantir Placa do 1º Lote</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* BARRA INFERIOR DE AÇÃO E CONVERSÃO (Flyer Rodapé) (+25% de escala) */}
        {/* ================================================================= */}
        <div className="rounded-[32px] bg-gradient-to-r from-[#0A122C] via-[#0E1A3C] to-[#0A122C] border border-cyan-500/35 p-6 sm:p-8 shadow-2xl space-y-5">
          <div className="flex flex-col xl:flex-row items-center justify-between gap-8">
            {/* Esquerda: "Peça sua proposta" + Botão WhatsApp Oficial */}
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left w-full xl:w-auto">
              <div className="p-4 rounded-3xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 shrink-0">
                <Store className="w-8 h-8 sm:w-9 sm:h-9" />
              </div>
              <div className="space-y-1">
                <div className="text-lg sm:text-2xl font-black text-white tracking-tight">
                  Peça sua proposta para sua empresa
                </div>
                <div className="text-sm sm:text-base text-slate-300">
                  Fale com nossa equipe comercial e receba em seu comércio
                </div>
              </div>

              {/* Botão Oficial de WhatsApp (+25% de tamanho) */}
              <button
                onClick={onOpenReserve}
                className="sm:ml-4 w-full sm:w-auto py-4 px-8 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-base sm:text-lg tracking-wide shadow-2xl shadow-emerald-500/35 transition-all flex items-center justify-center gap-3 active:scale-95 border border-emerald-300/40 shrink-0 cursor-pointer"
              >
                <MessageCircle className="w-6 h-6 fill-white" />
                <span>Fale pelo WhatsApp</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Direita: 3 Indicadores de Crescimento (Flyer) */}
            <div className="grid grid-cols-3 gap-6 sm:gap-8 border-t xl:border-t-0 xl:border-l border-white/15 pt-6 xl:pt-0 xl:pl-8 w-full xl:w-auto text-center">
              <div className="space-y-1.5">
                <div className="flex items-center justify-center gap-1.5 text-cyan-400 font-black text-sm sm:text-base lg:text-lg">
                  <TrendingUp className="w-5 h-5" />
                  <span>+ CLIENTES</span>
                </div>
                <div className="text-xs sm:text-sm text-slate-300 font-medium">Mais fluxo</div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-black text-sm sm:text-base lg:text-lg">
                  <Users className="w-5 h-5" />
                  <span>FIDELIZAÇÃO</span>
                </div>
                <div className="text-xs sm:text-sm text-slate-300 font-medium">Retorno rápido</div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-center gap-1.5 text-amber-400 font-black text-sm sm:text-base lg:text-lg">
                  <Sparkles className="w-5 h-5" />
                  <span>+ VENDAS</span>
                </div>
                <div className="text-xs sm:text-sm text-slate-300 font-medium">Conversão fácil</div>
              </div>
            </div>
          </div>

          {/* Slogan Final da Barra */}
          <div className="text-center pt-3 border-t border-white/10 text-xs sm:text-sm text-slate-300 font-medium">
            Mais praticidade para seu negócio vender, divulgar e atender melhor.
          </div>
        </div>
      </div>
    </section>
  );
}
