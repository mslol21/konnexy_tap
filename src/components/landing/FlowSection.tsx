import React from "react";
import { Store, Smartphone, Star, CheckCircle2 } from "lucide-react";

export default function FlowSection() {
  const steps = [
    {
      num: "01",
      title: "Coloque a placa no balcão",
      description:
        "A placa chega configurada com os dados da sua empresa. Basta posicionar na recepção, no caixa ou nas mesas.",
      highlight: "Pronta para uso imediato",
      icon: <Store className="w-6 h-6 text-[#C78D4E]" />,
    },
    {
      num: "02",
      title: "O cliente aproxima o celular",
      description:
        "Basta aproximar qualquer celular moderno (NFC) ou apontar a câmera para o QR Code. Não precisa baixar nenhum aplicativo.",
      highlight: "Sem fricção, sem espera",
      icon: <Smartphone className="w-6 h-6 text-[#C78D4E]" />,
    },
    {
      num: "03",
      title: "A página de avaliação abre na hora",
      description:
        "O cliente é direcionado direto para a tela de avaliação do Google da sua empresa. Um toque para avaliar e deixar um comentário.",
      highlight: "Avaliação em segundos",
      icon: <Star className="w-6 h-6 text-[#C78D4E] fill-[#C78D4E]" />,
    },
  ];

  return (
    <section id="como-funciona" className="py-14 lg:py-20 bg-[#F7F5F2] border-t border-[#E8E3DD]">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-12">
        
        {/* Cabeçalho da Seção */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#C78D4E] bg-white border border-[#E8E3DD] px-3 py-1 rounded-full inline-block mb-3 shadow-xs">
            Passo a Passo Descomplicado
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#20252A] tracking-tight">
            Simples para você. Fácil para seu cliente.
          </h2>
          <p className="text-[#6D7277] text-sm sm:text-base mt-2.5 leading-relaxed">
            Todo o processo foi pensado para não gerar atrito no balcão e não tomar tempo da sua equipe.
          </p>
        </div>

        {/* 3 Passos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-8 border border-[#E8E3DD] shadow-sm hover:shadow-md hover:border-[#C78D4E]/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-[#F7F5F2] border border-[#E8E3DD] flex items-center justify-center group-hover:scale-105 transition-transform">
                    {step.icon}
                  </div>
                  <span className="text-4xl sm:text-5xl font-extrabold text-[#D8D2C9] group-hover:text-[#C78D4E] transition-colors">
                    {step.num}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#20252A] mb-3 leading-snug">
                  {step.title}
                </h3>
                <p className="text-sm sm:text-base text-[#6D7277] leading-relaxed mb-6">
                  {step.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#E8E3DD] flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#C78D4E]">
                <CheckCircle2 className="w-4 h-4 text-[#C78D4E]" />
                <span>{step.highlight}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
