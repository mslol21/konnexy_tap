"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export default function FAQSection() {
  const faqs = [
    {
      q: "Preciso pagar mensalidade?",
      a: "Não. A placa Konnexy Tap possui pagamento único de R$ 79,90 no primeiro lote físico. O link permanente continua funcionando para sempre sem obrigatoriedade de assinatura.",
    },
    {
      q: "Preciso instalar aplicativo?",
      a: "Não. Nem você nem o seu cliente precisam baixar nada. Ao aproximar o celular da placa ou apontar a câmera para o QR Code, a página inteligente ou o link oficial abre instantaneamente no navegador do aparelho.",
    },
    {
      q: "Funciona em qualquer celular?",
      a: "A tecnologia NFC funciona nativamente na imensa maioria dos smartphones modernos (iPhones e Androids). Como alternativa 100% universal para qualquer modelo de câmera, a placa também conta com o QR Code impresso em alta definição.",
    },
    {
      q: "Posso mudar o destino depois se eu mudar de endereço ou WhatsApp?",
      a: "Sim! Como a placa física aponta para um link permanente gerenciado pela Konnexy Tap, você pode atualizar o link do Google, WhatsApp, Instagram ou Cardápio a qualquer momento sem precisar substituir a placa física.",
    },
    {
      q: "Preciso reprogramar o chip NFC?",
      a: "Não. Toda alteração de link é realizada diretamente pelo sistema, refletindo na hora no próximo toque do cliente.",
    },
    {
      q: "Como a placa ajuda nas avaliações do Google?",
      a: "Ela elimina todo o atrito: em vez do cliente ter que abrir o Google Maps, digitar o nome da sua empresa, encontrar a ficha correta e procurar o botão de avaliar, ele apenas encosta o celular na placa física e a tela de avaliação já abre na hora.",
    },
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 bg-[#0A1128] text-white relative border-t border-white/5">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/90 text-cyan-300 text-xs sm:text-sm font-bold uppercase tracking-wider border border-cyan-500/30">
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            Tire suas dúvidas
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight">
            Perguntas Frequentes
          </h2>
          <p className="text-slate-300 text-base sm:text-xl leading-relaxed">
            Tudo o que você precisa saber sobre a placa Konnexy Tap antes de garantir a sua.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-gradient-to-b from-[#0E1A3C] to-[#0A122C] rounded-3xl border border-white/10 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full px-7 py-5 text-left flex items-center justify-between gap-5 font-black text-white hover:text-cyan-300 transition-colors text-sm sm:text-base cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-cyan-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? "rotate-180 text-cyan-300" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-7 pb-6 pt-2 text-sm sm:text-base text-slate-300 leading-relaxed border-t border-white/10 animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
