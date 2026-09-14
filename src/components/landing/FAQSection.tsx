"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export default function FAQSection() {
  const faqs = [
    {
      q: "Preciso pagar mensalidade?",
      a: "Não. A placa tem pagamento único de R$ 79,90. Não há mensalidade obrigatória para que ela continue funcionando. O link gerenciado permanece ativo e direcionando seus clientes para o Google normalmente.",
    },
    {
      q: "Meu cliente precisa instalar algum aplicativo?",
      a: "Não. Nenhum aplicativo precisa ser instalado. O cliente aproxima o celular (NFC) ou aponta a câmera para o QR Code, e a página de avaliação abre diretamente no navegador — nativo, sem redirecionamentos desnecessários.",
    },
    {
      q: "Funciona com qualquer celular?",
      a: "O NFC funciona nativamente na grande maioria dos smartphones modernos, incluindo iPhones e Androids. Para celulares mais antigos ou em casos onde o NFC não esteja habilitado, o QR Code impresso na placa cobre 100% dos casos.",
    },
    {
      q: "E se o link do meu Google mudar? Preciso trocar de placa?",
      a: "Não. A placa física aponta para um link intermediário permanente gerenciado pela Otimiza Meu Negócio. Caso o link do seu perfil Google mude, nós atualizamos o redirecionamento sem custo adicional e sem você precisar substituir a placa.",
    },
    {
      q: "Preciso ter acesso ao painel Google Meu Negócio para isso funcionar?",
      a: "Não precisamos de acesso ao seu painel. Basta nos fornecer o link público do seu perfil no Google (o endereço que aparece quando você busca sua empresa no Google Maps). A partir daí configuramos a placa.",
    },
    {
      q: "A placa pode ser usada para outras coisas além de avaliações?",
      a: "A placa deste primeiro lote é voltada especificamente para avaliações no Google, que é o foco comercial do momento. No futuro, poderemos oferecer funcionalidades adicionais como redirecionamento para WhatsApp, cardápio digital ou Instagram.",
    },
    {
      q: "A Otimiza Meu Negócio tem alguma relação oficial com o Google?",
      a: "Não. A Otimiza Meu Negócio é uma empresa independente que não tem vínculo, parceria ou endosso do Google LLC. A placa direciona para a página pública de avaliações do Google, que é de acesso aberto a qualquer usuário.",
    },
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="duvidas" className="py-20 lg:py-28 bg-[#FFFFFF] border-t border-[#E8E3DD]">
      <div className="max-w-3xl mx-auto px-6 sm:px-10 lg:px-12">
        
        {/* Cabeçalho */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F7F5F2] border border-[#E8E3DD] text-[#C78D4E] text-xs font-bold uppercase tracking-widest mb-4">
            <HelpCircle className="w-4 h-4" />
            Tire suas dúvidas
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#20252A] tracking-tight">
            Perguntas Frequentes
          </h2>
          <p className="text-[#6D7277] text-base sm:text-lg mt-4 leading-relaxed">
            Tudo o que você precisa saber antes de garantir sua placa.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all ${
                  isOpen
                    ? "border-[#C78D4E]/50 shadow-sm"
                    : "border-[#E8E3DD]"
                } overflow-hidden bg-white`}
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-semibold text-[#20252A] hover:text-[#C78D4E] transition-colors text-sm sm:text-base cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#C78D4E] transition-transform duration-200 shrink-0 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-2 text-sm sm:text-base text-[#6D7277] leading-relaxed border-t border-[#E8E3DD] animate-in fade-in duration-150">
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
