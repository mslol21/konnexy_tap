import React from "react";
import {
  Star,
  MapPin,
  ShieldCheck,
  Zap,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";

export default function BenefitsSection() {
  const benefits = [
    {
      title: "Mais avaliações reais e espontâneas",
      desc: "Seus clientes satisfeitos avaliam com muito mais frequência porque o caminho até a tela de avaliação ficou imediato.",
      icon: <Star className="w-6 h-6 text-[#C78D4E] fill-[#C78D4E]" />,
    },
    {
      title: "Mais relevância no Google e Google Maps",
      desc: "Empresas com fluxo constante de avaliações e comentários tendem a ganhar mais destaque quando pessoas pesquisam na sua região.",
      icon: <MapPin className="w-6 h-6 text-[#C78D4E]" />,
    },
    {
      title: "Mais confiança para novos clientes",
      desc: "Quem encontra sua empresa pela primeira vez pesquisa as avaliações antes de decidir. Uma nota alta e comentários recentes geram decisão imediata.",
      icon: <ShieldCheck className="w-6 h-6 text-[#C78D4E]" />,
    },
    {
      title: "Zero fricção para quem avalia",
      desc: "Sem baixar app, sem escanear múltiplos links, sem login extra se o cliente já usa Google no celular. Dois segundos e pronto.",
      icon: <Zap className="w-6 h-6 text-[#C78D4E]" />,
    },
    {
      title: "Link permanente gerenciado",
      desc: "A placa aponta para um endereço que a Otimiza Meu Negócio gerencia. Se o Google mudar o link da sua empresa, nós atualizamos sem você precisar trocar de placa.",
      icon: <RefreshCw className="w-6 h-6 text-[#C78D4E]" />,
    },
    {
      title: "Sem custo recorrente obrigatório",
      desc: "Você compra a placa por R$ 79,90 uma única vez. Não há mensalidade obrigatória para mantê-la funcionando no seu balcão.",
      icon: <CheckCircle2 className="w-6 h-6 text-[#C78D4E]" />,
    },
  ];

  return (
    <section id="beneficios" className="py-14 lg:py-20 bg-[#F7F5F2] border-t border-[#E8E3DD]">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-12">
        
        {/* Cabeçalho */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#C78D4E] bg-white border border-[#E8E3DD] px-3 py-1 rounded-full inline-block mb-3 shadow-xs">
            Vantagens Comerciais
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#20252A] tracking-tight">
            Por que usar a placa?
          </h2>
          <p className="text-[#6D7277] text-sm sm:text-base mt-2.5 leading-relaxed">
            Mais do que um objeto bonito no balcão: uma ferramenta ativa de reputação local.
          </p>
        </div>

        {/* 6 Cards de Benefícios em Grid 3x2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((b, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-white border border-[#E8E3DD] shadow-sm hover:shadow-md hover:border-[#C78D4E]/50 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#F7F5F2] border border-[#E8E3DD] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                  {b.icon}
                </div>
                <h3 className="text-lg font-bold text-[#20252A] mb-3 leading-snug">
                  {b.title}
                </h3>
                <p className="text-sm text-[#6D7277] leading-relaxed">
                  {b.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
