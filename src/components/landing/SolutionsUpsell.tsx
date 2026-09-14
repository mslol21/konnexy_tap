import React from "react";
import {
  Globe,
  MapPin,
  Utensils,
  BookOpen,
  CalendarCheck,
  Bot,
  LayoutDashboard,
  ArrowUpRight,
} from "lucide-react";

export default function SolutionsUpsell() {
  const solutions = [
    {
      title: "Otimização de Perfil Google",
      desc: "Posicione seu negócio no topo das buscas do Google Maps da sua região.",
      icon: <MapPin className="w-5 h-5 text-amber-500" />,
      tag: "Tráfego Local",
    },
    {
      title: "Site Profissional & Landing Page",
      desc: "Presença web com alta taxa de conversão e domínio próprio.",
      icon: <Globe className="w-5 h-5 text-blue-500" />,
      tag: "Presença Digital",
    },
    {
      title: "Cardápio Digital Interativo",
      desc: "Cardápio com fotos de alta qualidade, categorias e pedidos via balcão.",
      icon: <Utensils className="w-5 h-5 text-orange-500" />,
      tag: "Gastronomia",
    },
    {
      title: "Catálogo Online de Produtos",
      desc: "Vitrine digital para divulgar estoques e coleções.",
      icon: <BookOpen className="w-5 h-5 text-purple-500" />,
      tag: "Varejo",
    },
    {
      title: "Agendamento Online 24h",
      desc: "Permita que o cliente marque horários sem trocar dezenas de mensagens.",
      icon: <CalendarCheck className="w-5 h-5 text-emerald-500" />,
      tag: "Serviços",
    },
    {
      title: "Automação de WhatsApp",
      desc: "Robô de atendimento inicial e disparos automáticos para o Clube de Clientes.",
      icon: <Bot className="w-5 h-5 text-teal-500" />,
      tag: "Automação",
    },
    {
      title: "Sistema de Gestão & CRM",
      desc: "Controle integrado de vendas, clientes e relacionamento.",
      icon: <LayoutDashboard className="w-5 h-5 text-indigo-500" />,
      tag: "Gestão",
    },
  ];

  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <span className="text-xs uppercase font-bold text-gold-400 tracking-wider bg-gold-500/10 border border-gold-500/30 px-3 py-1 rounded-full">
            Evolução Contínua
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Soluções Konnexy para o seu crescimento
          </h2>
          <p className="text-slate-300 text-sm sm:text-base">
            A placa NFC é apenas a porta de entrada. Conforme seu negócio escala, ative serviços digitais complementares sob medida.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {solutions.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 hover:border-gold-400/50 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-700 px-2 py-0.5 rounded">
                    {item.tag}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-gold-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-gold-400 font-semibold">
                <span>Disponível como Upsell</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
