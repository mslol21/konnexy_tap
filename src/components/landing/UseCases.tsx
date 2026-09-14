import React from "react";
import {
  Scissors,
  Sparkles,
  Stethoscope,
  Dog,
  Utensils,
  Coffee,
  ShoppingBag,
  Wrench,
  Car,
} from "lucide-react";

export default function UseCases() {
  const segments = [
    { name: "Barbearias", icon: <Scissors className="w-6 h-6 text-cyan-400" />, tip: "Na bancada de atendimento" },
    { name: "Salões de Beleza", icon: <Sparkles className="w-6 h-6 text-pink-400" />, tip: "No lavatório ou recepção" },
    { name: "Clínicas & Consultórios", icon: <Stethoscope className="w-6 h-6 text-teal-400" />, tip: "No balcão de saída" },
    { name: "Petshops & Veterinárias", icon: <Dog className="w-6 h-6 text-emerald-400" />, tip: "No caixa pós banho & tosa" },
    { name: "Restaurantes & Bares", icon: <Utensils className="w-6 h-6 text-amber-400" />, tip: "Nas mesas ou balcão de pagamento" },
    { name: "Lanchonetes & Cafés", icon: <Coffee className="w-6 h-6 text-orange-400" />, tip: "Junto à máquina de cartão" },
    { name: "Lojas & Boutiques", icon: <ShoppingBag className="w-6 h-6 text-purple-400" />, tip: "No balcão de embalagem" },
    { name: "Oficinas Mecânicas", icon: <Wrench className="w-6 h-6 text-slate-300" />, tip: "Na entrega das chaves do veículo" },
    { name: "Estética Automotiva", icon: <Car className="w-6 h-6 text-blue-400" />, tip: "No pós-serviço e entrega" },
  ];

  return (
    <section id="segmentos" className="py-24 bg-[#060B17] text-white relative border-t border-white/5">
      <div className="max-w-[1520px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs sm:text-sm uppercase font-extrabold text-cyan-400 tracking-wider bg-cyan-950/90 border border-cyan-500/30 px-4 py-1.5 rounded-full">
            Comércios Locais
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight">
            Ideal para qualquer balcão ou recepção
          </h2>
          <p className="text-slate-300 text-base sm:text-xl leading-relaxed">
            A mesma placa física inteligente com acabamento premium, configurada com o link oficial da sua empresa.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {segments.map((seg, idx) => (
            <div
              key={idx}
              className="p-5 sm:p-6 rounded-[28px] bg-gradient-to-b from-[#0C152E] to-[#080E21] border border-white/10 hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-500/10 transition-all flex items-center gap-5 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                {seg.icon}
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-white tracking-tight">{seg.name}</h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">{seg.tip}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
