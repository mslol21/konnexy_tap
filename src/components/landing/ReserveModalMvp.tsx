"use client";

import React, { useState } from "react";
import { ArrowRight, CheckCircle2, MessageCircle, X } from "lucide-react";

interface ReserveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReserveModalMvp({ isOpen, onClose }: ReserveModalProps) {
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [city, setCity] = useState("");
  const [segment, setSegment] = useState("Restaurante / Lanchonete");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const resetAndClose = () => {
    setError("");
    onClose();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!consent || loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/leads", {
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

      if (!response.ok) {
        throw new Error("Não foi possível registrar sua reserva agora.");
      }

      setSubmitted(true);

      const commercialNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/\D/g, "");
      if (commercialNumber.length >= 10) {
        const message = `Olá! Registrei uma reserva da placa de avaliações da Otimiza Meu Negócio para ${businessName}. Meu nome é ${name}.`;
        const waUrl = `https://wa.me/${commercialNumber}?text=${encodeURIComponent(message)}`;
        window.open(waUrl, "_blank", "noopener,noreferrer");
      }
    } catch {
      setError("Não conseguimos registrar a reserva. Tente novamente ou entre em contato pelo WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="reserve-title">
      <div className="relative w-full max-w-md max-h-[92vh] overflow-y-auto rounded-3xl bg-white border border-[#E8E3DD] shadow-2xl p-6 sm:p-8">
        <button
          type="button"
          onClick={resetAndClose}
          aria-label="Fechar"
          className="absolute top-4 right-4 p-2 rounded-full text-[#6D7277] hover:text-[#20252A] hover:bg-[#F7F5F2]"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center">
            <CheckCircle2 className="w-14 h-14 text-[#C78D4E] mx-auto" />
            <h2 id="reserve-title" className="text-xl font-extrabold text-[#20252A] mt-4">Reserva registrada</h2>
            <p className="text-sm text-[#6D7277] mt-2 leading-relaxed">
              Recebemos seus dados. A equipe entrará em contato para confirmar a unidade e configurar o link de avaliação da empresa.
            </p>
            <button
              type="button"
              onClick={resetAndClose}
              className="mt-6 px-6 py-2.5 rounded-xl bg-[#20252A] text-white text-sm font-bold"
            >
              Concluir
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="pr-8">
              <span className="inline-flex px-2.5 py-1 rounded-full bg-[#F7F5F2] border border-[#E8E3DD] text-[10px] font-bold uppercase tracking-wider text-[#9A6236]">
                Primeiro lote • R$ 79,90
              </span>
              <h2 id="reserve-title" className="text-xl font-extrabold text-[#20252A] mt-3">Reserve sua placa</h2>
              <p className="text-xs text-[#6D7277] mt-1 leading-relaxed">
                Preencha os dados do estabelecimento. A reserva não gera cobrança automática.
              </p>
            </div>

            {error && (
              <div role="alert" className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="reserve-name" className="block text-xs font-bold text-[#30363D] mb-1">Seu nome *</label>
              <input
                id="reserve-name"
                required
                minLength={2}
                maxLength={100}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E3DD] bg-[#F7F5F2] text-sm focus:outline-none focus:ring-2 focus:ring-[#C78D4E]"
              />
            </div>

            <div>
              <label htmlFor="reserve-business" className="block text-xs font-bold text-[#30363D] mb-1">Estabelecimento *</label>
              <input
                id="reserve-business"
                required
                minLength={2}
                maxLength={140}
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E3DD] bg-[#F7F5F2] text-sm focus:outline-none focus:ring-2 focus:ring-[#C78D4E]"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="reserve-whatsapp" className="block text-xs font-bold text-[#30363D] mb-1">WhatsApp com DDD *</label>
                <input
                  id="reserve-whatsapp"
                  type="tel"
                  required
                  minLength={8}
                  maxLength={24}
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E3DD] bg-[#F7F5F2] text-sm focus:outline-none focus:ring-2 focus:ring-[#C78D4E]"
                />
              </div>
              <div>
                <label htmlFor="reserve-city" className="block text-xs font-bold text-[#30363D] mb-1">Cidade / UF *</label>
                <input
                  id="reserve-city"
                  required
                  maxLength={120}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="São Paulo - SP"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E3DD] bg-[#F7F5F2] text-sm focus:outline-none focus:ring-2 focus:ring-[#C78D4E]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reserve-segment" className="block text-xs font-bold text-[#30363D] mb-1">Segmento</label>
              <select
                id="reserve-segment"
                value={segment}
                onChange={(e) => setSegment(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E3DD] bg-[#F7F5F2] text-sm focus:outline-none focus:ring-2 focus:ring-[#C78D4E]"
              >
                <option>Restaurante / Lanchonete</option>
                <option>Barbearia / Salão</option>
                <option>Clínica / Consultório</option>
                <option>Petshop / Veterinária</option>
                <option>Loja / Varejo</option>
                <option>Oficina / Estética Automotiva</option>
                <option>Outro</option>
              </select>
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer p-3 rounded-xl bg-[#F7F5F2] border border-[#E8E3DD]">
              <input
                type="checkbox"
                required
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5"
              />
              <span className="text-[11px] text-[#6D7277] leading-relaxed">
                Autorizo o contato pelo WhatsApp exclusivamente para tratar desta reserva e da configuração da placa.
              </span>
            </label>

            <button
              type="submit"
              disabled={loading || !consent}
              className="w-full py-3.5 px-4 rounded-xl bg-[#20252A] hover:bg-[#30363D] disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-[#C78D4E]" />
              <span>{loading ? "Registrando..." : "Confirmar reserva"}</span>
              {!loading && <ArrowRight className="w-4 h-4 text-[#C78D4E]" />}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
