import React from "react";
import { Store, Smartphone, Star, RefreshCw } from "lucide-react";
import { KonnexyWaveIcon } from "@/components/brand/Logo";

export default function FlowSection() {
  const steps = [
    {
      num: "01",
      title: "Coloque a placa no balcão",
      subtitle: "Posicione a placa física na recepção, balcão de atendimento ou mesas.",
      icon: <Store className="w-7 h-7 text-cyan-400" />,
      detail: "Enviamos configurada e pronta para o seu negócio.",
    },
    {
      num: "02",
      title: "O cliente aproxima o celular ou lê o QR Code",
      subtitle: "Compatível nativamente com iPhones e Androids, sem precisar baixar aplicativo.",
      icon: <Smartphone className="w-7 h-7 text-emerald-400" />,
      detail: "Basta encostar no chip NFC ou apontar a câmera.",
    },
    {
      num: "03",
      title: "O destino inteligente é aberto na hora",
      subtitle: "A tela oficial de avaliação do Google, WhatsApp ou cardápio abre em 1 segundo.",
      icon: <Star className="w-7 h-7 text-amber-400 fill-amber-400" />,
      detail: "Sem o cliente precisar pesquisar sua empresa no mapa.",
    },
  ];

  return (
    <section id="como-funciona" className="py-24 bg-[#060B17] text-white relative overflow-hidden border-t border-white/5">
      <div className="max-w-[1520px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs sm:text-sm uppercase font-extrabold text-cyan-400 tracking-wider bg-cyan-950/90 border border-cyan-500/30 px-4 py-1.5 rounded-full inline-flex items-center gap-2">
            <KonnexyWaveIcon className="w-4 h-4" />
            <span>Simplicidade no Balcão</span>
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight">
            Como funciona em 3 passos
          </h2>
          <p className="text-slate-300 text-base sm:text-xl leading-relaxed">
            Elimine as 5 etapas manuais que faziam o cliente desistir de avaliar ou entrar em contato.
          </p>
        </div>

        {/* 3 Passos (+25% no tamanho das letras e cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-b from-[#0C152E] to-[#080E21] rounded-[32px] p-8 border border-white/10 flex flex-col justify-between relative group hover:border-cyan-500/40 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-200"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                    {step.icon}
                  </div>
                  <span className="text-4xl sm:text-5xl font-black text-slate-700 group-hover:text-cyan-400 transition-colors">
                    {step.num}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-black text-white mb-2.5">
                  {step.title}
                </h3>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
                  {step.subtitle}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 text-xs sm:text-sm font-bold text-cyan-300">
                ✓ {step.detail}
              </div>
            </div>
          ))}
        </div>

        {/* Destaque Link Permanente do Flyer */}
        <div className="mt-14 p-8 rounded-[32px] bg-gradient-to-r from-[#0C1736] via-[#0E1A3C] to-[#0C1736] border border-cyan-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-5 text-center md:text-left">
            <div className="w-14 h-14 rounded-3xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
              <RefreshCw className="w-7 h-7 animate-spin" style={{ animationDuration: "12s" }} />
            </div>
            <div>
              <div className="text-lg sm:text-2xl font-black text-white">
                Mude o destino sem trocar a placa física
              </div>
              <div className="text-sm sm:text-base text-slate-300 mt-1">
                Mudou de link ou quer direcionar para o WhatsApp numa data especial? A placa física aponta para um link permanente gerenciado que você atualiza em segundos.
              </div>
            </div>
          </div>
          <span className="text-xs sm:text-sm font-mono font-black text-cyan-300 bg-cyan-950/90 border border-cyan-500/40 px-4 py-2.5 rounded-xl shrink-0">
            Link Permanente Ativo
          </span>
        </div>
      </div>
    </section>
  );
}
