import React from "react";
import { XCircle, CheckCircle2, ArrowRight } from "lucide-react";

export default function ProblemSection() {
  const oldSteps = [
    "Pedir verbalmente ('Avalia a gente no Google?')",
    "Cliente precisa lembrar quando chegar em casa",
    "Abrir o aplicativo do Google ou Maps manualmente",
    "Digitar o nome exato da empresa na busca",
    "Procurar o perfil correto entre vários resultados parecidos",
  ];

  const newSteps = [
    "O cliente aproxima o celular ou aponta a câmera para a placa",
    "A tela oficial de avaliação da sua empresa abre direto em 1 segundo",
  ];

  return (
    <section className="py-14 lg:py-20 bg-[#FFFFFF] border-t border-[#E8E3DD]">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-12">
        
        {/* Cabeçalho */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#C78D4E] bg-[#F7F5F2] border border-[#E8E3DD] px-3 py-1 rounded-full inline-block mb-3">
            A Raiz da Baixa Conversão
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#20252A] tracking-tight">
            Seu cliente quer avaliar. O problema é o caminho.
          </h2>
          <p className="text-[#6D7277] text-sm sm:text-base mt-2.5 leading-relaxed">
            A maioria dos clientes satisfeitos não avalia porque o processo tradicional é demorado, cansativo e cheio de obstáculos.
          </p>
        </div>

        {/* Grid Comparativo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Lado Esquerdo: Jeito Antigo */}
          <div className="rounded-3xl p-8 sm:p-10 bg-[#F7F5F2] border border-[#E8E3DD] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#E8E3DD] flex items-center justify-center text-[#6D7277]">
                  <XCircle className="w-6 h-6 text-[#6D7277]" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#30363D]">
                    Como a maioria tenta fazer hoje
                  </h3>
                  <p className="text-xs text-[#6D7277]">5 etapas manuais e muita fricção</p>
                </div>
              </div>

              <div className="space-y-4 my-8">
                {oldSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3.5">
                    <span className="w-6 h-6 rounded-full bg-[#E8E3DD] text-[#6D7277] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-sm sm:text-base text-[#6D7277] leading-relaxed">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-[#E8E3DD]">
              <div className="p-4 rounded-xl bg-white border border-[#E8E3DD] text-xs sm:text-sm font-semibold text-[#6D7277] flex items-center gap-2">
                <span className="text-red-500 font-bold">Resultado comum:</span>
                <span>Apenas 2% a 5% dos clientes satisfeitos chegam ao final.</span>
              </div>
            </div>
          </div>

          {/* Lado Direito: Com a Placa da Otimiza Meu Negócio */}
          <div className="rounded-3xl p-8 sm:p-10 bg-white border-2 border-[#C78D4E] shadow-lg flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#C78D4E] text-white text-[11px] font-bold px-4 py-1 rounded-bl-xl uppercase tracking-wider">
              Solução Otimiza
            </div>

            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#F7F5F2] border border-[#C78D4E]/30 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-[#C78D4E]" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#20252A]">
                    Com a Placa Inteligente
                  </h3>
                  <p className="text-xs text-[#C78D4E] font-medium">Apenas 2 etapas imediatas no balcão</p>
                </div>
              </div>

              <div className="space-y-6 my-8">
                {newSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-[#F7F5F2] border border-[#E8E3DD]">
                    <span className="w-7 h-7 rounded-full bg-[#20252A] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-sm sm:text-base font-semibold text-[#20252A] leading-relaxed">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-[#E8E3DD]">
              <div className="p-4 rounded-xl bg-[#F7F5F2] border border-[#C78D4E]/30 text-xs sm:text-sm font-semibold text-[#20252A] flex items-start sm:items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#C78D4E] shrink-0" />
                <span>
                  <strong>Multiplicação real de avaliações:</strong> O cliente avalia no momento auge da experiência positiva, enquanto espera o café ou a finalização da conta.
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
