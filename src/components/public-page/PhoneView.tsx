"use client";

import React, { useState } from "react";
import { Star, MessageCircle, UtensilsCrossed, MapPin, Instagram, Send, ExternalLink, Tag, CheckCircle2, X, Sparkles, Wifi, Copy, Globe, Heart } from "lucide-react";
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
  const primaryColor = business.primary_color || "#20252A";
  const secondaryColor = business.secondary_color || "#C78D4E";
  const backgroundColor = business.background_color || "#F8FAFC";
  const surfaceColor = business.surface_color || "#FFFFFF";
  const textColor = business.text_color || primaryColor;
  const coverPosition = business.cover_position || "center";

  return (
    <div
      className="w-full max-w-[420px] mx-auto min-h-full relative overflow-hidden pb-10"
      style={{
        background: `linear-gradient(180deg, ${backgroundColor} 0%, ${secondaryColor}0D 52%, ${backgroundColor} 100%)`,
      }}
    >
      <div className="relative h-36 w-full overflow-hidden" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}>
        {business.cover_url ? (
          <img src={business.cover_url} alt="Capa do estabelecimento" className="w-full h-full object-cover" style={{ objectPosition: coverPosition === "top" ? "center top" : coverPosition === "bottom" ? "center bottom" : "center center" }} />
        ) : (
          <div className="w-full h-full opacity-30 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
        )}
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 0%, ${backgroundColor} 100%)`, opacity: 0.72 }} />
      </div>

      <div className="px-5 -mt-14 relative z-10 flex flex-col items-center text-center">
        <div className="relative w-24 h-24 rounded-3xl p-1 bg-white shadow-[0_12px_30px_rgba(0,0,0,0.10)] overflow-hidden mb-3" style={{ border: `2px solid ${secondaryColor}66` }}>
          {business.logo_url ? (
            <img src={business.logo_url} alt={business.name} className="w-full h-full object-cover rounded-[20px]" />
          ) : (
            <div className="w-full h-full text-white flex items-center justify-center font-black text-2xl rounded-[20px]" style={{ backgroundColor: primaryColor }}>
              {business.name.substring(0, 2).toUpperCase()}
            </div>
          )}
        </div>

        <h1 className="text-[22px] font-black tracking-tight" style={{ color: textColor }}>{business.name}</h1>
        <p className="text-[11px] font-semibold tracking-[0.14em] uppercase mt-0.5" style={{ color: secondaryColor }}>{business.category}</p>
        <p className="text-xs mt-2 max-w-[320px] leading-relaxed" style={{ color: `${textColor}B5` }}>
          {business.description || "Tudo do nosso negócio em um só toque."}
        </p>

        {device && (
          <div
            className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold"
            style={{ backgroundColor: `${secondaryColor}12`, color: primaryColor, border: `1px solid ${secondaryColor}3D` }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: secondaryColor }} />
            Conectado pela placa • {device.location}
          </div>
        )}

        <section
          className="w-full mt-6 rounded-[30px] p-4 text-left"
          style={{
            background: `linear-gradient(180deg, ${surfaceColor}F5 0%, ${secondaryColor}0C 100%)`,
            border: `1px solid ${secondaryColor}2F`,
            boxShadow: `0 18px 50px ${primaryColor}12`,
          }}
        >
          <div className="flex items-center gap-3 pb-4" style={{ borderBottom: `1px solid ${secondaryColor}24` }}>
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${secondaryColor}16`, color: primaryColor }}>
              <MapPin className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-black leading-tight" style={{ color: textColor }}>Atendimento</h2>
              <p className="text-[11px] mt-0.5" style={{ color: `${textColor}8F` }}>Estamos te esperando!</p>
            </div>
          </div>

          <div className="pt-4">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="w-4 h-4" style={{ color: secondaryColor }} />
              <span className="text-sm font-black" style={{ color: textColor }}>Fale conosco</span>
            </div>

            <div className="space-y-2.5">
              {activeLinks.map((link) => {
                const isWhatsapp = link.type === "whatsapp";
                return (
                  <button
                    key={link.id}
                    onClick={() => handleLinkAction(link)}
                    className="w-full p-3.5 rounded-2xl flex items-center justify-between border transition-all text-left active:scale-[0.985]"
                    style={{
                      background: isWhatsapp
                        ? "linear-gradient(135deg,#22C55E,#16A34A)"
                        : `linear-gradient(180deg,#ffffff 0%, ${secondaryColor}08 100%)`,
                      borderColor: isWhatsapp ? "#22C55E" : `${secondaryColor}2E`,
                      boxShadow: isWhatsapp ? "0 8px 22px rgba(34,197,94,0.18)" : `0 6px 18px ${primaryColor}0D`,
                    }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: isWhatsapp ? "rgba(255,255,255,0.16)" : `${secondaryColor}14` }}
                      >
                        {getIcon(link.type)}
                      </div>
                      <div className="text-xs font-black truncate" style={{ color: isWhatsapp ? "#FFFFFF" : textColor }}>{link.title}</div>
                    </div>
                    <ExternalLink className="w-4 h-4 shrink-0" style={{ color: isWhatsapp ? "#FFFFFF" : secondaryColor }} />
                  </button>
                );
              })}

              {wifiEnabled && (
                <button
                  onClick={() => setShowWifiModal(true)}
                  className="w-full p-3.5 rounded-2xl flex items-center justify-between border transition-all text-left active:scale-[0.985]"
                  style={{ background: `linear-gradient(180deg,${surfaceColor} 0%, ${secondaryColor}08 100%)`, borderColor: `${secondaryColor}2E` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${secondaryColor}14` }}>
                      <Wifi className="w-5 h-5" style={{ color: primaryColor }} />
                    </div>
                    <div>
                      <div className="text-xs font-black" style={{ color: textColor }}>Wi-Fi para clientes</div>
                      <div className="text-[10px]" style={{ color: `${primaryColor}80` }}>Veja a rede e copie a senha</div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4" style={{ color: secondaryColor }} />
                </button>
              )}
            </div>

            {(experience?.feedback_enabled ?? true) && !activeLinks.some((l) => l.type === "suggestion") && (
              <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${secondaryColor}24` }}>
                <button
                  onClick={() => setShowFeedbackModal(true)}
                  className="w-full p-3.5 rounded-2xl flex items-center justify-between border text-left active:scale-[0.985]"
                  style={{ background: `${secondaryColor}0C`, borderColor: `${secondaryColor}30` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${secondaryColor}16` }}>
                      <Send className="w-5 h-5" style={{ color: primaryColor }} />
                    </div>
                    <div>
                      <div className="text-xs font-black" style={{ color: textColor }}>Enviar feedback</div>
                      <div className="text-[10px]" style={{ color: `${primaryColor}80` }}>Canal privado com o estabelecimento</div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4" style={{ color: secondaryColor }} />
                </button>
              </div>
            )}
          </div>
        </section>

        {campaign && campaign.is_active && (
          <div
            className="w-full mt-5 p-4 rounded-[26px] text-left"
            style={{
              background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 140%)`,
              color: "#FFFFFF",
              boxShadow: `0 16px 36px ${primaryColor}20`,
            }}
          >
            <div className="text-[10px] font-bold uppercase flex items-center gap-1" style={{ color: "#FFFFFFCC" }}>
              <Tag className="w-3 h-3" /> Oferta especial
            </div>
            <div className="text-sm font-black mt-2">{campaign.title}</div>
            <p className="text-xs mt-1 text-white/75">{campaign.description}</p>
            <div className="mt-3 flex items-baseline gap-2">
              {campaign.original_price && <span className="text-xs line-through text-white/55">{formatCurrency(campaign.original_price)}</span>}
              <span className="text-lg font-black">{formatCurrency(campaign.current_price)}</span>
            </div>
            {campaign.button_url && (
              <button
                onClick={() => !isMockup && window.open(campaign.button_url, "_blank", "noopener,noreferrer")}
                className="mt-3 w-full py-2.5 px-3 font-black text-xs rounded-xl flex items-center justify-center gap-1.5"
                style={{ backgroundColor: "#FFFFFF", color: primaryColor }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                {campaign.button_text || "Quero aproveitar"}
              </button>
            )}
          </div>
        )}

        <div className="mt-8 pt-4 w-full text-[10px]" style={{ borderTop: `1px solid ${secondaryColor}28`, color: `${primaryColor}80` }}>
          Powered by <strong style={{ color: primaryColor }}>Otimiza Meu Negócio</strong> • Ponto digital inteligente
        </div>
      </div>

      {showWifiModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl shadow-2xl p-5 relative text-left bg-white" style={{ border: `1px solid ${secondaryColor}3D` }}>
            <button onClick={() => setShowWifiModal(false)} className="absolute top-3 right-3 p-1 rounded-full text-slate-600 hover:bg-slate-100"><X className="w-5 h-5" /></button>
            <Wifi className="w-8 h-8 mb-3" style={{ color: primaryColor }} />
            <h3 className="font-black" style={{ color: primaryColor }}>Wi-Fi para clientes</h3>
            <div className="mt-4 p-3 rounded-xl border" style={{ backgroundColor: `${secondaryColor}0A`, borderColor: `${secondaryColor}2A` }}>
              <div className="text-[10px] uppercase text-slate-500">Rede</div>
              <div className="font-bold text-sm" style={{ color: primaryColor }}>{experience?.wifi_ssid}</div>
            </div>
            {experience?.wifi_password && (
              <div className="mt-2 p-3 rounded-xl border flex items-center justify-between gap-3" style={{ backgroundColor: `${secondaryColor}0A`, borderColor: `${secondaryColor}2A` }}>
                <div>
                  <div className="text-[10px] uppercase text-slate-500">Senha</div>
                  <div className="font-mono font-bold text-sm" style={{ color: primaryColor }}>{experience.wifi_password}</div>
                </div>
                <button onClick={() => navigator.clipboard.writeText(experience.wifi_password || "")} className="p-2 rounded-lg text-white" style={{ backgroundColor: primaryColor }}><Copy className="w-4 h-4" /></button>
              </div>
            )}
          </div>
        </div>
      )}

      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-5 relative text-left" style={{ border: `1px solid ${secondaryColor}3D` }}>
            <button onClick={() => setShowFeedbackModal(false)} className="absolute top-3 right-3 p-1 rounded-full text-slate-600 hover:bg-slate-100"><X className="w-5 h-5" /></button>
            {feedbackSubmitted ? (
              <div className="py-6 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h3 className="font-black mt-2" style={{ color: primaryColor }}>Feedback enviado!</h3>
                <p className="text-xs text-slate-600 mt-1">Obrigado por ajudar este negócio a melhorar.</p>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <div>
                  <h3 className="font-black" style={{ color: primaryColor }}>Como foi sua experiência?</h3>
                  <p className="text-[11px] text-slate-500">Este feedback é privado e independente da avaliação no Google.</p>
                </div>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map((value) => (
                    <button key={value} type="button" onClick={() => setFeedbackRating(value)} aria-label={`${value} estrelas`}>
                      <Star className={`w-7 h-7 ${value <= feedbackRating ? "text-amber-500 fill-amber-400" : "text-slate-300"}`} />
                    </button>
                  ))}
                </div>
                <textarea rows={4} maxLength={1500} placeholder="Conte o que foi bom ou o que pode melhorar (opcional)" value={feedbackMessage} onChange={(e) => setFeedbackMessage(e.target.value)} className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 text-slate-900" />
                {feedbackError && <p className="text-xs text-red-600">{feedbackError}</p>}
                <button type="submit" disabled={sending} className="w-full py-2.5 text-white text-xs font-black rounded-xl disabled:opacity-50" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}>
                  {sending ? "Enviando..." : "Enviar feedback"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
