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
      const cleanNumber = "5511987654321"; // Número comercial da Konnexy Tap
      const message = `Olá! Vi a Konnexy Tap Reviews e gostaria de reservar uma placa para meu negócio (${businessName}). Meu nome é ${name}.`;
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
          className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto animate-bounce" />
            <h3 className="text-xl font-black text-navy-950">
              Reserva Registrada com Sucesso! 🎉
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
              Sua solicitação para o primeiro lote foi recebida. Estamos abrindo seu WhatsApp para confirmar o modelo da placa e o link do Google da sua empresa.
            </p>
            <div className="pt-3">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-navy-950 text-white rounded-xl text-xs font-bold"
              >
                Concluir
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gold-50 text-gold-800 border border-gold-200 text-[10px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-gold-500" />
                Primeiro Lote Chegando • R$ 79,90 Pagamento Único
              </div>
              <h2 className="text-xl font-black text-navy-950 tracking-tight">
                Reservar Minha Placa Konnexy Tap Reviews
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Garanta sua placa física no primeiro lote. Nossa equipe configurará o link oficial do Google da sua empresa.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Seu Nome Completo *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Carlos Eduardo Silva"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Nome do Estabelecimento Comercial *
              </label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Ex: Barbearia Dom Pedro"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  WhatsApp com DDD *
                </label>
                <input
                  type="tel"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Cidade / UF *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="São Paulo - SP"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Segmento Comercial
              </label>
              <select
                value={segment}
                onChange={(e) => setSegment(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white"
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
                  className="mt-0.5 rounded border-slate-300 text-navy-900 focus:ring-navy-900"
                />
                <span className="text-[11px] text-slate-500 leading-tight">
                  Concordo em ser contatado via WhatsApp para confirmar a reserva da placa e envio das informações do Google da empresa.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !consent}
              className="w-full py-3.5 px-4 bg-navy-950 hover:bg-navy-900 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Gravando reserva...</span>
              ) : (
                <>
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Confirmar Reserva e Falar no WhatsApp</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gold-400" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
