"use client";

import React, { useState } from "react";
import { Star, MessageCircle, UtensilsCrossed, MapPin, Instagram, Send, ExternalLink, Tag, CheckCircle2, X, Sparkles, Wifi, Copy, Globe } from "lucide-react";
import { Business, BusinessLink, Campaign, TapDevice } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface ExperienceConfig {
  google_enabled?: boolean;
  whatsapp_enabled?: boolean;
  services_enabled?: boolean;
  maps_enabled?: boolean;
  wifi_enabled?: boolean;
  feedback_enabled?: boolean;
  promotions_enabled?: boolean;
  instagram_enabled?: boolean;
  website_enabled?: boolean;
  wifi_ssid?: string | null;
  wifi_password?: string | null;
}

interface PhoneViewProps {
  business: Business;
  links: BusinessLink[];
  campaign?: Campaign | null;
  device?: TapDevice | null;
  experience?: ExperienceConfig | null;
  isMockup?: boolean;
  onLinkClick?: (linkType: string, url: string) => void;
}

export default function PhoneView({ business, links, campaign, device, experience, isMockup = false, onLinkClick }: PhoneViewProps) {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showWifiModal, setShowWifiModal] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackError, setFeedbackError] = useState("");
  const [sending, setSending] = useState(false);

  const handleLinkAction = (link: BusinessLink) => {
    onLinkClick?.(link.type, link.url);
    if (link.type === "suggestion") { setShowFeedbackModal(true); return; }
    if (!isMockup && link.url && link.url !== "#feedback") window.open(link.url, "_blank", "noopener,noreferrer");
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setFeedbackError("");
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId: business.id, deviceId: device?.id, rating: feedbackRating, message: feedbackMessage }),
      });
      if (!response.ok) throw new Error("Falha ao enviar");
      setFeedbackSubmitted(true);
      setFeedbackMessage("");
    } catch {
      setFeedbackError("Não foi possível enviar agora. Tente novamente.");
    } finally { setSending(false); }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "google_review": return <Star className="w-5 h-5 text-amber-500 fill-amber-400" />;
      case "whatsapp": return <MessageCircle className="w-5 h-5 text-emerald-600" />;
      case "menu": case "catalog": return <UtensilsCrossed className="w-5 h-5 text-orange-600" />;
      case "maps": return <MapPin className="w-5 h-5 text-rose-600" />;
      case "instagram": return <Instagram className="w-5 h-5 text-pink-600" />;
      case "website": return <Globe className="w-5 h-5 text-sky-700" />;
      case "suggestion": return <Send className="w-5 h-5 text-slate-700" />;
      default: return <ExternalLink className="w-5 h-5 text-slate-600" />;
    }
  };

  const activeLinks = links.filter((l) => l.is_active).sort((a, b) => a.order_index - b.order_index);
  const wifiEnabled = experience?.wifi_enabled && experience?.wifi_ssid;

  return (
    <div className="w-full max-w-[420px] mx-auto min-h-full bg-slate-50 relative pb-12">
      <div className="relative h-36 w-full bg-gradient-to-r from-slate-950 to-slate-800 overflow-hidden">
        {business.cover_url ? <img src={business.cover_url} alt="Capa do estabelecimento" className="w-full h-full object-cover opacity-60" /> : <div className="w-full h-full opacity-30 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px]" />}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent opacity-80" />
      </div>

      <div className="px-5 -mt-16 relative z-10 flex flex-col items-center text-center">
        <div className="relative w-24 h-24 rounded-2xl p-1 bg-white shadow-xl border border-slate-100 overflow-hidden mb-3">
          {business.logo_url ? <img src={business.logo_url} alt={business.name} className="w-full h-full object-cover rounded-xl" /> : <div className="w-full h-full bg-slate-900 text-white flex items-center justify-center font-bold text-2xl rounded-xl">{business.name.substring(0, 2).toUpperCase()}</div>}
        </div>
        <h1 className="text-xl font-bold text-slate-950">{business.name}</h1>
        <p className="text-xs font-medium text-amber-700 tracking-wide uppercase mt-0.5">{business.category}</p>
        <p className="text-xs text-slate-600 mt-2 max-w-[320px] leading-relaxed">{business.description || "Tudo do nosso negócio em um só toque."}</p>
        {device && <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />Conectado pela placa • {device.location}</div>}

        <div className="w-full mt-5 space-y-2.5">
          {activeLinks.map((link) => (
            <button key={link.id} onClick={() => handleLinkAction(link)} className="w-full p-3 rounded-xl flex items-center justify-between border bg-white border-slate-200 shadow-sm hover:border-amber-300 transition-all text-left active:scale-[0.98]">
              <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-100">{getIcon(link.type)}</div><div className="text-xs font-bold text-slate-900">{link.title}</div></div>
              <ExternalLink className="w-4 h-4 text-slate-500" />
            </button>
          ))}

          {wifiEnabled && (
            <button onClick={() => setShowWifiModal(true)} className="w-full p-3 rounded-xl flex items-center justify-between border bg-white border-slate-200 shadow-sm hover:border-amber-300 transition-all text-left active:scale-[0.98]">
              <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl flex items-center justify-center bg-sky-50"><Wifi className="w-5 h-5 text-sky-700" /></div><div><div className="text-xs font-bold text-slate-900">Wi-Fi para clientes</div><div className="text-[10px] text-slate-500">Veja a rede e copie a senha</div></div></div>
              <ExternalLink className="w-4 h-4 text-slate-500" />
            </button>
          )}

          {(experience?.feedback_enabled ?? true) && !activeLinks.some((l) => l.type === "suggestion") && (
            <button onClick={() => setShowFeedbackModal(true)} className="w-full p-3 rounded-xl flex items-center justify-between border bg-white border-slate-200 shadow-sm hover:border-amber-300 transition-all text-left active:scale-[0.98]">
              <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-100"><Send className="w-5 h-5 text-slate-700" /></div><div><div className="text-xs font-bold text-slate-900">Enviar feedback</div><div className="text-[10px] text-slate-500">Canal privado com o estabelecimento</div></div></div>
              <ExternalLink className="w-4 h-4 text-slate-500" />
            </button>
          )}
        </div>

        {campaign && campaign.is_active && (
          <div className="w-full mt-5 p-4 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white border border-amber-400/30 shadow-lg text-left">
            <div className="text-[10px] text-amber-300 font-bold uppercase flex items-center gap-1"><Tag className="w-3 h-3" /> Oferta especial</div>
            <div className="text-sm font-bold mt-2">{campaign.title}</div>
            <p className="text-xs text-slate-300 mt-1">{campaign.description}</p>
            <div className="mt-3 flex items-baseline gap-2">{campaign.original_price && <span className="text-xs line-through text-slate-400">{formatCurrency(campaign.original_price)}</span>}<span className="text-lg font-black">{formatCurrency(campaign.current_price)}</span></div>
            {campaign.button_url && <button onClick={() => !isMockup && window.open(campaign.button_url, "_blank", "noopener,noreferrer")} className="mt-3 w-full py-2 px-3 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"><Sparkles className="w-3.5 h-3.5" />{campaign.button_text || "Quero aproveitar"}</button>}
          </div>
        )}

        <div className="mt-8 pt-4 border-t border-slate-200 w-full text-[10px] text-slate-500">Powered by <strong className="text-slate-900">Otimiza Meu Negócio</strong> • Ponto digital inteligente</div>
      </div>

      {showWifiModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-5 relative text-left">
            <button onClick={() => setShowWifiModal(false)} className="absolute top-3 right-3 p-1 rounded-full text-slate-600 hover:bg-slate-100"><X className="w-5 h-5" /></button>
            <Wifi className="w-8 h-8 text-sky-700 mb-3" /><h3 className="font-bold text-slate-950">Wi-Fi para clientes</h3>
            <div className="mt-4 p-3 rounded-xl bg-slate-50 border"><div className="text-[10px] uppercase text-slate-500">Rede</div><div className="font-bold text-sm text-slate-900">{experience?.wifi_ssid}</div></div>
            {experience?.wifi_password && <div className="mt-2 p-3 rounded-xl bg-slate-50 border flex items-center justify-between gap-3"><div><div className="text-[10px] uppercase text-slate-500">Senha</div><div className="font-mono font-bold text-sm text-slate-900">{experience.wifi_password}</div></div><button onClick={() => navigator.clipboard.writeText(experience.wifi_password || "")} className="p-2 rounded-lg bg-slate-900 text-white"><Copy className="w-4 h-4" /></button></div>}
          </div>
        </div>
      )}

      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-5 relative text-left">
            <button onClick={() => setShowFeedbackModal(false)} className="absolute top-3 right-3 p-1 rounded-full text-slate-600 hover:bg-slate-100"><X className="w-5 h-5" /></button>
            {feedbackSubmitted ? <div className="py-6 text-center"><CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" /><h3 className="font-bold mt-2">Feedback enviado!</h3><p className="text-xs text-slate-600 mt-1">Obrigado por ajudar este negócio a melhorar.</p></div> : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <div><h3 className="font-bold text-slate-950">Como foi sua experiência?</h3><p className="text-[11px] text-slate-500">Este feedback é privado e independente da avaliação no Google.</p></div>
                <div className="flex gap-1">{[1,2,3,4,5].map((value) => <button key={value} type="button" onClick={() => setFeedbackRating(value)} aria-label={`${value} estrelas`}><Star className={`w-7 h-7 ${value <= feedbackRating ? "text-amber-500 fill-amber-400" : "text-slate-300"}`} /></button>)}</div>
                <textarea rows={4} maxLength={1500} placeholder="Conte o que foi bom ou o que pode melhorar (opcional)" value={feedbackMessage} onChange={(e) => setFeedbackMessage(e.target.value)} className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 text-slate-900" />
                {feedbackError && <p className="text-xs text-red-600">{feedbackError}</p>}
                <button type="submit" disabled={sending} className="w-full py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl disabled:opacity-50">{sending ? "Enviando..." : "Enviar feedback"}</button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
