"use client";

import React, { useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  MessageCircle,
  Sparkles,
  X,
} from "lucide-react";

interface ReserveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReserveModal({ isOpen, onClose }: ReserveModalProps) {
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [city, setCity] = useState("");
  const [segment, setSegment] = useState("Restaurante / Lanchonete / Bar");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const commercialNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/\D/g, "");

  const whatsappUrl = () => {
    if (!commercialNumber) return null;
    const message = `Olá! Vi a placa inteligente de avaliações da Otimiza Meu Negócio e gostaria de falar sobre uma unidade para ${businessName || "minha empresa"}. Meu nome é ${name || "cliente"}.`;
    return `https://wa.me/${commercialNumber}?text=${encodeURIComponent(message)}`;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!consent) return;

    setLoading(true);
    setError(null);

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

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(
          typeof payload.error === "string"
            ? payload.error
            : "Não foi possível registrar sua reserva agora. Tente novamente em instantes."
        );
        return;
      }

      setSubmitted(true);

      const url = whatsappUrl();
      if (url) {
        window.setTimeout(() => {
          window.open(url, "_blank", "noopener,noreferrer");
        }, 700);
      }
    } catch {
      setError("Falha de conexão. Sua reserva ainda não foi registrada.");
    } finally {
      setLoading(false);
    }
  };

  const closeAndReset = () => {
    setError(null);
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white text-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 relative">
        <button onClick={closeAndReset} className="absolute top-4 right-4 p-1 rounded-full text-[#6D7277] hover:text-[#20252A] hover:bg-[#F7F5F2]" aria-label="Fechar">
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-14 h-14 text-[#C78D4E] mx-auto" />
            <h3 className="text-xl font-extrabold text-[#20252A]">Reserva registrada</h3>
            <p className="text-xs text-[#6D7277] leading-relaxed max-w-xs mx-auto">
              Recebemos seus dados. {commercialNumber ? "O WhatsApp será aberto para você continuar o atendimento." : "Entraremos em contato pelo WhatsApp informado."}
            </p>
            <button onClick={closeAndReset} className="mt-3 px-6 py-2.5 bg-[#20252A] hover:bg-[#30363D] text-white rounded-xl text-xs font-bold">Concluir</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F7F5F2] text-[#9A6236] border border-[#E8E3DD] text-[10px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3" /> Primeiro lote • R$ 79,90 pagamento único
              </div>
              <h2 className="text-xl font-extrabold text-[#20252A] tracking-tight">Reservar minha placa inteligente</h2>
              <p className="text-xs text-[#6D7277] leading-relaxed">Preencha os dados para receber a placa configurada para o perfil da sua empresa no Google.</p>
            </div>

            {error && (
              <div role="alert" className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <div>{error}</div>
                  {commercialNumber && whatsappUrl() && (
                    <a href={whatsappUrl() || undefined} target="_blank" rel="noopener noreferrer" className="font-bold underline inline-block mt-1">Falar pelo WhatsApp mesmo assim</a>
                  )}
                </div>
              </div>
            )}

            <div>
              <label htmlFor="reserve-name" className="block text-xs font-bold text-[#30363D] uppercase mb-1">Seu nome *</label>
              <input id="reserve-name" type="text" required value={name} onChange={(event) => setName(event.target.value)} placeholder="Ex: Carlos Eduardo" className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#E8E3DD] focus:outline-none focus:ring-2 focus:ring-[#C78D4E] bg-[#F7F5F2]" />
            </div>

            <div>
              <label htmlFor="reserve-business" className="block text-xs font-bold text-[#30363D] uppercase mb-1">Estabelecimento *</label>
              <input id="reserve-business" type="text" required value={businessName} onChange={(event) => setBusinessName(event.target.value)} placeholder="Ex: Barbearia Dom Pedro" className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#E8E3DD] focus:outline-none focus:ring-2 focus:ring-[#C78D4E] bg-[#F7F5F2]" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="reserve-whatsapp" className="block text-xs font-bold text-[#30363D] uppercase mb-1">WhatsApp com DDD *</label>
                <input id="reserve-whatsapp" type="tel" required value={whatsapp} onChange={(event) => setWhatsapp(event.target.value)} placeholder="(11) 99999-9999" className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#E8E3DD] focus:outline-none focus:ring-2 focus:ring-[#C78D4E] bg-[#F7F5F2]" />
              </div>
              <div>
                <label htmlFor="reserve-city" className="block text-xs font-bold text-[#30363D] uppercase mb-1">Cidade / UF *</label>
                <input id="reserve-city" type="text" required value={city} onChange={(event) => setCity(event.target.value)} placeholder="São Paulo - SP" className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#E8E3DD] focus:outline-none focus:ring-2 focus:ring-[#C78D4E] bg-[#F7F5F2]" />
              </div>
            </div>

            <div>
              <label htmlFor="reserve-segment" className="block text-xs font-bold text-[#30363D] uppercase mb-1">Segmento</label>
              <select id="reserve-segment" value={segment} onChange={(event) => setSegment(event.target.value)} className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#E8E3DD] focus:outline-none focus:ring-2 focus:ring-[#C78D4E] bg-[#F7F5F2]">
                <option>Restaurante / Lanchonete / Bar</option>
                <option>Barbearia / Salão de Beleza</option>
                <option>Clínica Médica / Odontológica</option>
                <option>Petshop / Clínica Veterinária</option>
                <option>Loja / Varejo</option>
                <option>Oficina Mecânica / Estética Automotiva</option>
                <option>Outros serviços</option>
              </select>
            </div>

            <label className="flex items-start gap-2 cursor-pointer pt-1">
              <input type="checkbox" required checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-0.5 rounded border-[#E8E3DD] text-[#C78D4E] focus:ring-[#C78D4E]" />
              <span className="text-[11px] text-[#6D7277] leading-tight">Autorizo o contato pelo WhatsApp informado para tratar desta reserva e configuração da placa.</span>
            </label>

            <button type="submit" disabled={loading || !consent} className="w-full py-3.5 px-4 bg-[#20252A] hover:bg-[#30363D] disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2">
              <MessageCircle className="w-4 h-4 text-[#C78D4E]" />
              <span>{loading ? "Registrando reserva..." : "Registrar reserva"}</span>
              {!loading && <ArrowRight className="w-3.5 h-3.5 text-[#C78D4E]" />}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
