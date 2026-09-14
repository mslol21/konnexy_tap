import React from "react";
import {
  CheckCircle2,
  Smartphone,
  ShieldCheck,
  RefreshCw,
  Zap,
  Store,
  Sparkles,
} from "lucide-react";
import { KonnexyWaveIcon } from "@/components/brand/Logo";

export default function BenefitsSection() {
  const benefits = [
    {
      title: "NFC + QR Code na Mesma Placa",
      desc: "Dois canais físicos integrados para garantir 100% de compatibilidade em qualquer modelo de smartphone.",
      icon: <KonnexyWaveIcon className="w-6 h-6" />,
      color: "text-cyan-400",
    },
    {
      title: "Pronta para o Balcão",
      desc: "Você recebe a placa física montada e configurada com o link oficial da sua empresa, pronta para usar.",
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-400" />,
      color: "text-emerald-400",
    },
    {
      title: "Sem Instalar Aplicativo",
      desc: "O cliente aproxima o celular e a tela abre direto no navegador nativo do aparelho em 1 segundo.",
      icon: <Smartphone className="w-6 h-6 text-blue-400" />,
      color: "text-blue-400",
    },
    {
      title: "Sem Mensalidade Obrigatória",
      desc: "Investimento único de R$ 79,90 no primeiro lote físico comercial. Sem surpresas ou mensalidades ocultas.",
      icon: <ShieldCheck className="w-6 h-6 text-teal-400" />,
      color: "text-teal-400",
    },
    {
      title: "Mude o Destino Facilmente",
      desc: "Se trocar de endereço, mudar de WhatsApp ou alterar o link do Google, a placa física continua funcionando.",
      icon: <RefreshCw className="w-6 h-6 text-purple-400" />,
      color: "text-purple-400",
    },
    {
      title: "Configuração Rápida em 2 Min",
      desc: "Basta cadastrar ou nos enviar o link do seu estabelecimento que realizamos a vinculação imediata.",
      icon: <Zap className="w-6 h-6 text-amber-400" />,
      color: "text-amber-400",
    },
    {
      title: "Design Acrílico Premium",
      desc: "Display resistente e elegante com acabamento moderno, desenvolvido para valorizar o balcão do seu negócio.",
      icon: <Store className="w-6 h-6 text-cyan-300" />,
      color: "text-cyan-300",
    },
    {
      title: "Mais Avaliações e Clientes",
      desc: "Facilite o gesto de quem já teve uma experiência positiva no seu espaço e impulsione a visibilidade local.",
      icon: <Sparkles className="w-6 h-6 text-amber-300" />,
      color: "text-amber-300",
    },
  ];

  return (
    <section id="beneficios" className="py-24 bg-[#0A1128] text-white relative border-t border-white/5">
      <div className="max-w-[1520px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs sm:text-sm uppercase font-extrabold text-cyan-400 tracking-wider bg-cyan-950/90 border border-cyan-500/30 px-4 py-1.5 rounded-full">
            Vantagens Comerciais
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight">
            Por que ter a placa no seu balcão?
          </h2>
          <p className="text-slate-300 text-base sm:text-xl leading-relaxed">
            Clientes satisfeitos querem apoiar empresas locais, mas desistem quando o processo é difícil. O Konnexy Tap reduz o caminho para um único toque.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b, idx) => (
            <div
              key={idx}
              className="p-7 rounded-[30px] bg-gradient-to-b from-[#0E1A3C] to-[#0A122C] border border-white/10 hover:border-cyan-500/40 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5 shadow-inner group-hover:scale-105 transition-transform">
                  {b.icon}
                </div>
                <h3 className="text-base sm:text-lg font-black text-white mb-2.5">
                  {b.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
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
