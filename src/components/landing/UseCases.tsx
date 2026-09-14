import React from "react";
import {
  Utensils,
  Stethoscope,
  Scissors,
  Dumbbell,
  ShoppingBag,
  Dog,
  Wrench,
  Pill,
  Hotel,
  Briefcase,
  Store,
  Sparkles,
} from "lucide-react";

export default function UseCases() {
  const segments = [
    {
      name: "Restaurantes, bares e cafeterias",
      tip: "Nas mesas ou junto ao fechamento da conta",
      icon: <Utensils className="w-5 h-5 text-[#C78D4E]" />,
    },
    {
      name: "Clínicas, consultórios e odontologia",
      tip: "No balcão de saída e recepção dos pacientes",
      icon: <Stethoscope className="w-5 h-5 text-[#C78D4E]" />,
    },
    {
      name: "Barbearias, salões de beleza e estética",
      tip: "Na bancada de atendimento ou caixa",
      icon: <Scissors className="w-5 h-5 text-[#C78D4E]" />,
    },
    {
      name: "Academias, estúdios e crossfit",
      tip: "Na catraca de entrada/saída ou recepção",
      icon: <Dumbbell className="w-5 h-5 text-[#C78D4E]" />,
    },
    {
      name: "Lojas de roupas, calçados e óticas",
      tip: "No balcão de embalagem e pagamento",
      icon: <ShoppingBag className="w-5 h-5 text-[#C78D4E]" />,
    },
    {
      name: "Pet shops e clínicas veterinárias",
      tip: "No caixa após o atendimento ou banho e tosa",
      icon: <Dog className="w-5 h-5 text-[#C78D4E]" />,
    },
    {
      name: "Oficinas mecânicas e centros automotivos",
      tip: "Na entrega das chaves do veículo revisado",
      icon: <Wrench className="w-5 h-5 text-[#C78D4E]" />,
    },
    {
      name: "Farmácias, drogarias e manipulação",
      tip: "No balcão de retirada de medicamentos",
      icon: <Pill className="w-5 h-5 text-[#C78D4E]" />,
    },
    {
      name: "Hotéis, pousadas e hospedagens",
      tip: "No balcão do check-out e recepção",
      icon: <Hotel className="w-5 h-5 text-[#C78D4E]" />,
    },
    {
      name: "Escritórios contábeis, jurídicos e imobiliárias",
      tip: "Na sala de reuniões ou recepção de clientes",
      icon: <Briefcase className="w-5 h-5 text-[#C78D4E]" />,
    },
    {
      name: "Mercados de bairro, padarias e empórios",
      tip: "Junto à esteira do caixa ou balcão de pães",
      icon: <Store className="w-5 h-5 text-[#C78D4E]" />,
    },
    {
      name: "Lavanderias, sapatarias e serviços locais",
      tip: "No balcão de entrega e conferência do serviço",
      icon: <Sparkles className="w-5 h-5 text-[#C78D4E]" />,
    },
  ];

  return (
    <section id="para-quem-e" className="py-14 lg:py-20 bg-[#FFFFFF] border-t border-[#E8E3DD]">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-12">
        
        {/* Cabeçalho */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#C78D4E] bg-[#F7F5F2] border border-[#E8E3DD] px-3 py-1 rounded-full inline-block mb-3">
            Segmentos Atendidos
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#20252A] tracking-tight">
            Feita para negócios que atendem pessoas todos os dias.
          </h2>
          <p className="text-[#6D7277] text-sm sm:text-base mt-2.5 leading-relaxed">
            Se o seu cliente passa pelo seu balcão, caixa ou recepção, a placa funciona para você.
          </p>
        </div>

        {/* 12 Segmentos em Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {segments.map((seg, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#F7F5F2] border border-[#E8E3DD] hover:border-[#C78D4E]/50 hover:bg-white hover:shadow-sm transition-all flex items-start gap-4 group"
            >
              <div className="w-11 h-11 rounded-xl bg-white border border-[#E8E3DD] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                {seg.icon}
              </div>
              <div>
                <h3 className="text-base font-bold text-[#20252A] leading-snug">
                  {seg.name}
                </h3>
                <p className="text-xs text-[#6D7277] mt-1">
                  {seg.tip}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
