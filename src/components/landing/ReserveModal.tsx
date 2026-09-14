"use client";

import React, { useState } from "react";
import { X, CheckCircle2, MessageCircle, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

interface ReserveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReserveModal({ isOpen, onClose }: ReserveModalProps) {
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [city, setCity] = useState("");
  const [segment, setSegment] = useState("Restaurante / Lanchonete");
  const [consent, setConsent] = useState(true);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          business_name: businessName,
          whatsapp,
          city,
          segment,
          source: "site",
        }),
      });
    } catch {
      // Continua
    } finally {
      setLoading(false);
      setSubmitted(true);

      // Abrir WhatsApp com mensagem automática sugerida
      const cleanNumber = "5511987654321"; // Número comercial da Otimiza Meu Negócio
      const message = `Olá! Vi a placa de avaliações da Otimiza Meu Negócio e gostaria de reservar uma unidade para minha empresa (${businessName}). Meu nome é ${name}.`;
      const waUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;

      setTimeout(() => {
        window.open(waUrl, "_blank", "noopener,noreferrer");
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white text-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-[#6D7277] hover:text-[#20252A] hover:bg-[#F7F5F2] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-14 h-14 text-[#C78D4E] mx-auto animate-bounce" />
            <h3 className="text-xl font-extrabold text-[#20252A]">
              Reserva Registrada! 🎉
            </h3>
            <p className="text-xs text-[#6D7277] leading-relaxed max-w-xs mx-auto">
              Sua solicitação foi recebida. Estamos abrindo o WhatsApp para confirmar os detalhes e o link do Google da sua empresa.
            </p>
            <div className="pt-3">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-[#20252A] hover:bg-[#30363D] text-white rounded-xl text-xs font-bold transition-all"
              >
                Concluir
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F7F5F2] text-[#C78D4E] border border-[#E8E3DD] text-[10px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                Primeiro Lote Chegando • R$ 79,90 Pagamento Único
              </div>
              <h2 className="text-xl font-extrabold text-[#20252A] tracking-tight">
                Reservar Minha Placa Inteligente
              </h2>
              <p className="text-xs text-[#6D7277] leading-relaxed">
                Garanta sua placa no primeiro lote. Nossa equipe configurará o link oficial do Google da sua empresa.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#30363D] uppercase mb-1">
                Seu Nome Completo *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Carlos Eduardo Silva"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#E8E3DD] focus:outline-none focus:ring-2 focus:ring-[#C78D4E] bg-[#F7F5F2]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#30363D] uppercase mb-1">
                Nome do Estabelecimento *
              </label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Ex: Barbearia Dom Pedro"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#E8E3DD] focus:outline-none focus:ring-2 focus:ring-[#C78D4E] bg-[#F7F5F2]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#30363D] uppercase mb-1">
                  WhatsApp com DDD *
                </label>
                <input
                  type="tel"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#E8E3DD] focus:outline-none focus:ring-2 focus:ring-[#C78D4E] bg-[#F7F5F2]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#30363D] uppercase mb-1">
                  Cidade / UF *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="São Paulo - SP"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#E8E3DD] focus:outline-none focus:ring-2 focus:ring-[#C78D4E] bg-[#F7F5F2]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#30363D] uppercase mb-1">
                Segmento Comercial
              </label>
              <select
                value={segment}
                onChange={(e) => setSegment(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#E8E3DD] focus:outline-none focus:ring-2 focus:ring-[#C78D4E] bg-[#F7F5F2]"
              >
                <option>Restaurante / Lanchonete / Bar</option>
                <option>Barbearia / Salão de Beleza</option>
                <option>Clínica Médica / Odontológica</option>
                <option>Petshop / Clínica Veterinária</option>
                <option>Loja / Varejo</option>
                <option>Oficina Mecânica / Estética Automotiva</option>
                <option>Outros serviços</option>
              </select>
            </div>

            <div className="pt-1">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 rounded border-[#E8E3DD] text-[#C78D4E] focus:ring-[#C78D4E]"
                />
                <span className="text-[11px] text-[#6D7277] leading-tight">
                  Concordo em ser contatado via WhatsApp para confirmar a reserva da placa e envio das informações do Google da empresa.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !consent}
              className="w-full py-3.5 px-4 bg-[#20252A] hover:bg-[#30363D] disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <span>Registrando reserva...</span>
              ) : (
                <>
                  <MessageCircle className="w-4 h-4 text-[#C78D4E]" />
                  <span>Confirmar Reserva e Falar no WhatsApp</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C78D4E]" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
