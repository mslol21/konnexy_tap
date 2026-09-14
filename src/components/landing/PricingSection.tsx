"use client";

import React from "react";
import { Check, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";

interface PricingSectionProps {
  onOpenReserve?: () => void;
}

export default function PricingSection({ onOpenReserve }: PricingSectionProps) {
  const inclusions = [
    "1 placa física de acrílico com acabamento premium",
    "Chip NFC embutido, configurado para sua empresa",
    "QR Code permanente impresso na placa",
    "Link gerenciado pela Otimiza Meu Negócio",
    "Direcionamento para o perfil do Google da sua empresa",
    "Funciona em iPhone, Android e qualquer celular com câmera",
    "Entrega configurada — pronta para o balcão",
    "Suporte para ajustes no redirecionamento do link",
  ];

  const whatsappLink =
    "https://wa.me/5500000000000?text=Ol%C3%A1%21+Vi+a+placa+de+avalia%C3%A7%C3%B5es+da+Otimiza+Meu+Neg%C3%B3cio+e+gostaria+de+reservar+uma+unidade+para+minha+empresa.";

  return (
    <section id="preco" className="py-14 lg:py-20 bg-[#F7F5F2] border-t border-[#E8E3DD]">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-12">
        
        {/* Cabeçalho */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#C78D4E] bg-white border border-[#E8E3DD] px-3 py-1 rounded-full inline-block mb-3 shadow-xs">
            Investimento Transparente
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#20252A] tracking-tight">
            Um preço. Uma placa. Sem surpresas.
          </h2>
          <p className="text-[#6D7277] text-sm sm:text-base mt-2.5 leading-relaxed">
            Sem planos confusos ou mensalidades escondidas. Você paga uma vez e usa a placa no seu balcão.
          </p>
        </div>

        {/* Card de Oferta Central */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl p-8 sm:p-10 border-2 border-[#C78D4E] shadow-lg relative overflow-hidden">
            
            {/* Badge Topo */}
            <div className="absolute top-0 right-0 bg-[#C78D4E] text-white text-[11px] font-bold px-5 py-1.5 rounded-bl-2xl uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Primeiro Lote
            </div>

            {/* Cabeçalho do Card */}
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-widest text-[#6D7277] mb-1">
                Placa Inteligente de Avaliações
              </p>
              <h3 className="text-2xl font-extrabold text-[#20252A]">
                NFC + QR Code • Configurada para sua empresa
              </h3>
            </div>

            {/* Preço */}
            <div className="mb-6 pb-6 border-b border-[#E8E3DD]">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl sm:text-5xl font-extrabold text-[#20252A]">
                  R$ 79,90
                </span>
                <span className="text-sm font-semibold text-[#6D7277] uppercase tracking-wide">
                  Pagamento único
                </span>
              </div>
              <div className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-[#20252A] bg-[#F7F5F2] border border-[#E8E3DD] px-3 py-1.5 rounded-lg">
                <ShieldCheck className="w-4 h-4 text-[#C78D4E]" />
                Sem mensalidade obrigatória
              </div>
            </div>

            {/* O que está incluso */}
            <div className="mb-8">
              <p className="text-xs font-bold uppercase tracking-widest text-[#30363D] mb-4">
                O que acompanha a sua placa:
              </p>
              <ul className="space-y-3">
                {inclusions.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="w-4.5 h-4.5 text-[#C78D4E] shrink-0 mt-0.5" />
                    <span className="text-sm text-[#30363D] leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3">
              {onOpenReserve ? (
                <button
                  onClick={onOpenReserve}
                  className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-xl bg-[#20252A] hover:bg-[#30363D] text-white text-base font-bold shadow-md transition-all border border-[#20252A] active:scale-95 cursor-pointer"
                >
                  <span>Quero reservar minha placa</span>
                  <ArrowRight className="w-5 h-5 text-[#C78D4E]" />
                </button>
              ) : null}

              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl bg-[#F7F5F2] hover:bg-white text-[#20252A] text-sm font-semibold border border-[#E8E3DD] transition-all"
              >
                <span>Tirar dúvidas pelo WhatsApp</span>
                <ArrowRight className="w-4 h-4 text-[#6D7277]" />
              </a>
            </div>

            {/* Nota de Transparência */}
            <p className="text-[11px] text-[#6D7277] text-center mt-6 leading-relaxed">
              O produto é físico e será enviado após a confirmação do pedido. O prazo de entrega varia conforme a localização. Não há cobrança de mensalidade para o funcionamento básico da placa.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
