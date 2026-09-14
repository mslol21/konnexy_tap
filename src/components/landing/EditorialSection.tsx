import React from "react";
import { Sparkles, ShieldCheck } from "lucide-react";

export default function EditorialSection() {
  return (
    <section className="py-20 lg:py-28 bg-[#F7F5F2] border-t border-[#E8E3DD]">
      <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 text-left">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E8E3DD] shadow-sm mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#C78D4E]" />
          <span className="text-xs font-bold tracking-wider text-[#30363D] uppercase">
            Visão da Agência
          </span>
        </div>

        {/* Título Principal */}
        <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#20252A] leading-tight tracking-tight mb-8">
          Sua reputação digital começa no atendimento presencial.
        </h2>

        {/* Parágrafos Editoriais */}
        <div className="space-y-6 text-base sm:text-lg text-[#6D7277] leading-relaxed">
          <p>
            Todo dia, dezenas de clientes saem satisfeitos do seu estabelecimento. Eles elogiam a comida, o corte de cabelo, a consulta ou o serviço prestado. Mas quando chegam em casa, a rotina consome o dia — e aquele elogio genuíno nunca se transforma em uma avaliação pública no Google.
          </p>

          <p>
            O Google é o primeiro lugar onde novos clientes pesquisam quando precisam do que você vende. Negócios com dezenas de avaliações recentes transmitem segurança e credibilidade imediatas. Negócios sem avaliações geram dúvida — mesmo quando prestam um serviço de altíssimo nível.
          </p>

          <p>
            A Placa Inteligente da <strong className="text-[#20252A] font-bold">Otimiza Meu Negócio</strong> não cria avaliações artificiais nem promete atalhos questionáveis. Ela simplesmente remove o atrito entre o cliente que gostou do seu serviço e a página onde essa satisfação precisa ficar registrada.
          </p>
        </div>

        {/* Citação em Destaque com Borda Bronze */}
        <div className="mt-10 p-6 sm:p-8 rounded-2xl bg-white border-l-4 border-l-[#C78D4E] border border-[#E8E3DD] shadow-sm">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-[#C78D4E] shrink-0 mt-1" />
            <p className="text-base sm:text-lg font-bold text-[#20252A] leading-snug">
              &ldquo;Não vendemos robôs de avaliação nem truques de algoritmo. Entregamos a ponte mais curta entre o seu balcão e a sua presença oficial no Google.&rdquo;
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
