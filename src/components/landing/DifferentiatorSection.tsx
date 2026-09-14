import React from "react";
import { CheckCircle2, RefreshCw, ShieldCheck, Zap } from "lucide-react";

export default function DifferentiatorSection() {
  const features = [
    {
      title: "Link permanente gerenciado",
      desc: "A placa aponta para um endereço nosso, que redirecionamos para onde você quiser. Se o Google mudar o link do seu perfil, atualizamos sem custo.",
      icon: <RefreshCw className="w-5 h-5 text-[#D8A66C]" />,
    },
    {
      title: "Funciona em qualquer smartphone",
      desc: "NFC para iPhones e Androids recentes. QR Code para todos os demais celulares. Seu cliente nunca fica sem acesso.",
      icon: <Zap className="w-5 h-5 text-[#D8A66C]" />,
    },
    {
      title: "Sem dependência de aplicativo",
      desc: "A tela de avaliação abre direto no navegador nativo. O cliente não precisa instalar nada, criar conta ou fazer login extra.",
      icon: <ShieldCheck className="w-5 h-5 text-[#D8A66C]" />,
    },
    {
      title: "Acrílico de alta durabilidade",
      desc: "Desenvolvida para balcões, mesas e recepções de uso intenso. Material robusto, acabamento premium e visual discreto.",
      icon: <CheckCircle2 className="w-5 h-5 text-[#D8A66C]" />,
    },
  ];

  return (
    <section id="diferencial" className="py-14 lg:py-20 bg-[#20252A] text-white">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          
          {/* Esquerda: Texto Editorial */}
          <div className="flex flex-col items-start">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#C78D4E] bg-[#2D343B] border border-[#C78D4E]/30 px-3 py-1 rounded-full inline-block mb-4">
              Por que a Otimiza Meu Negócio?
            </span>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight mb-4">
              Mais que um QR Code{" "}
              <span className="text-[#D8A66C]">impresso numa folha de papel.</span>
            </h2>

            <p className="text-[#9BA3AB] text-sm sm:text-base leading-relaxed mb-4">
              Qualquer empresa pode gerar um QR Code estático e colar na parede. Quando o link mudar — e vai mudar — a imagem vira lixo e o cliente não chega a lugar nenhum.
            </p>

            <p className="text-[#9BA3AB] text-sm sm:text-base leading-relaxed mb-6">
              A Placa Inteligente da Otimiza Meu Negócio usa um link dinâmico permanente gerenciado por nós. Você recebe a placa configurada, coloca no balcão e nunca mais precisa se preocupar com isso.
            </p>

            {/* Destaque de Preço */}
            <div className="p-5 rounded-2xl bg-[#2D343B] border border-[#C78D4E]/30 w-full">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-xs text-[#9BA3AB] uppercase font-semibold tracking-wide mb-1">
                    Investimento único
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-white">R$ 79,90</span>
                    <span className="text-sm text-[#C78D4E] font-semibold">por placa</span>
                  </div>
                  <p className="text-xs text-[#6D7277] mt-1">Sem mensalidade obrigatória</p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C78D4E]/20 border border-[#C78D4E]/40 text-[#D8A66C] text-xs font-bold">
                  ✦ Primeiro lote — reservas abertas
                </span>
              </div>
            </div>
          </div>

          {/* Direita: Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((f, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#2D343B] border border-white/10 hover:border-[#C78D4E]/40 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-[#20252A] border border-white/10 flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="text-base font-bold text-white mb-2 leading-snug">
                  {f.title}
                </h3>
                <p className="text-sm text-[#9BA3AB] leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
