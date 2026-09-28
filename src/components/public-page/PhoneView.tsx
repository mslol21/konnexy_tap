"use client";

import React, { useState } from "react";
import { Star, MessageCircle, UtensilsCrossed, MapPin, Instagram, Send, ExternalLink, Tag, CheckCircle2, X, Sparkles, Wifi, Copy, Globe, Heart } from "lucide-react";
import { Business, BusinessLink, Campaign, TapDevice } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

function hexToRgba(hex: string, alpha: number) {
  const raw = hex.replace("#", "");
  if (!/^[0-9A-Fa-f]{6}$/.test(raw)) return `rgba(0,0,0,${alpha})`;
  const value = Number.parseInt(raw, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

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
  const getLinkDescription = (type: string) => {
    switch (type) {
      case "google_review": return "Deixe sua avaliação e nos ajude!";
      case "whatsapp": return "Fale diretamente com a nossa equipe.";
      case "menu": return "Veja nossos serviços e opções disponíveis.";
      case "catalog": return "Conheça nossos produtos e novidades.";
      case "maps": return "Veja nossa localização no mapa.";
      case "instagram": return "Acompanhe novidades e conteúdos.";
      case "website": return "Acesse nosso site oficial.";
      case "suggestion": return "Sua opinião é muito importante.";
      default: return "Acesse esta opção.";
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
  const primarySoft = hexToRgba(primaryColor, 0.16);
  const secondarySoft = hexToRgba(secondaryColor, 0.22);
  const secondaryGlow = hexToRgba(secondaryColor, 0.34);
  const primaryShadow = hexToRgba(primaryColor, 0.18);

  return (
    <div
      className="w-full max-w-[420px] mx-auto min-h-full relative overflow-hidden pb-8"
      style={{
        background: `
          radial-gradient(circle at 14% 10%, ${secondaryGlow} 0%, transparent 25%),
          radial-gradient(circle at 90% 28%, ${primarySoft} 0%, transparent 30%),
          radial-gradient(circle at 22% 76%, ${secondarySoft} 0%, transparent 24%),
          linear-gradient(180deg, ${backgroundColor} 0%, ${hexToRgba(secondaryColor, 0.12)} 42%, ${backgroundColor} 100%)
        `,
      }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.055] bg-[radial-gradient(#000_0.8px,transparent_0.8px)] [background-size:18px_18px]" />
      <div className="pointer-events-none absolute -top-20 -left-16 h-60 w-60 rounded-full blur-3xl" style={{ backgroundColor: secondaryGlow }} />
      <div className="pointer-events-none absolute top-[30%] -right-24 h-72 w-72 rounded-full blur-3xl" style={{ backgroundColor: primarySoft }} />
      <div className="pointer-events-none absolute top-[38%] left-[-22%] w-[150%] h-28 rotate-[-8deg] rounded-[50%] border" style={{ borderColor: hexToRgba(secondaryColor, 0.28) }} />
      <div className="pointer-events-none absolute top-[41%] left-[-18%] w-[140%] h-32 rotate-[7deg] rounded-[50%] border" style={{ borderColor: hexToRgba(primaryColor, 0.12) }} />
      {/* HERO / CAPA */}
      <div className="relative h-[214px] w-full overflow-hidden">
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }} />
        {business.cover_url ? (
          <img
            src={business.cover_url}
            alt="Capa do estabelecimento"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: coverPosition === "top" ? "center top" : coverPosition === "bottom" ? "center bottom" : "center center" }}
          />
        ) : (
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:18px_18px]" />
        )}
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, rgba(0,0,0,.02) 0%, ${primaryColor}16 56%, ${backgroundColor} 100%)` }} />
        <div className="absolute -left-12 top-10 h-44 w-44 rounded-full border" style={{ borderColor: hexToRgba(secondaryColor, 0.34) }} />
        <div className="absolute -right-16 top-24 h-52 w-52 rounded-full border" style={{ borderColor: hexToRgba(secondaryColor, 0.22) }} />
        <div className="absolute inset-x-0 bottom-0 h-24" style={{ background: `linear-gradient(180deg, transparent 0%, ${hexToRgba(backgroundColor, 0.58)} 58%, ${backgroundColor} 100%)` }} />
      </div>

      {/* IDENTIDADE */}
      <div className="relative z-10 -mt-14 px-5 flex flex-col items-center text-center">
        <div
          className="w-[108px] h-[108px] rounded-[32px] bg-white/95 p-1.5 overflow-hidden backdrop-blur-xl"
          style={{
            border: `1px solid ${secondaryColor}55`,
            boxShadow: `0 18px 42px ${primaryShadow}, 0 0 0 5px rgba(255,255,255,.72), 0 0 26px ${secondarySoft}`,
          }}
        >
          {business.logo_url ? (
            <img src={business.logo_url} alt={business.name} className="w-full h-full object-cover rounded-[24px]" />
          ) : (
            <div className="w-full h-full rounded-[24px] flex items-center justify-center text-white text-2xl font-black" style={{ background: `linear-gradient(135deg,${primaryColor},${secondaryColor})` }}>
              {business.name.substring(0,2).toUpperCase()}
            </div>
          )}
        </div>

        <div className="mt-4">
          <h1 className="text-[28px] leading-none font-black tracking-[-0.03em]" style={{ color: textColor }}>{business.name}</h1>
          <div className="mt-2 flex items-center justify-center gap-2">
            <span className="h-px w-8" style={{ backgroundColor: `${secondaryColor}70` }} />
            <span className="text-[10px] font-bold tracking-[0.22em] uppercase" style={{ color: secondaryColor }}>{business.category}</span>
            <span className="h-px w-8" style={{ backgroundColor: `${secondaryColor}70` }} />
          </div>
          <p className="mt-3 text-[12px] leading-relaxed max-w-[320px]" style={{ color: `${textColor}A6` }}>
            {business.description || "Tudo do nosso negócio em um só toque."}
          </p>
        </div>

        {device && (
          <div
            className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] font-semibold"
            style={{
              color: textColor,
              background: `linear-gradient(180deg,${surfaceColor} 0%,${secondaryColor}10 100%)`,
              border: `1px solid ${secondaryColor}32`,
              boxShadow: `0 8px 22px ${primaryColor}0B`,
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#22C55E" }} />
            Conectado pela placa • {device.location}
          </div>
        )}

        {/* AÇÕES PRINCIPAIS */}
        <section
          className="w-full mt-7 p-3.5 rounded-[32px] backdrop-blur-xl"
          style={{
            background: `linear-gradient(160deg,${hexToRgba(surfaceColor, 0.96)} 0%,${hexToRgba(secondaryColor, 0.16)} 100%)`,
            border: `1px solid ${hexToRgba(secondaryColor, 0.30)}`,
            boxShadow: `0 24px 70px ${primaryShadow}, inset 0 1px 0 rgba(255,255,255,.82)`,
          }}
        >
          <div className="space-y-2.5">
            {activeLinks.map((link) => {
              const isWhatsapp = link.type === "whatsapp";
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkAction(link)}
                  className="group w-full min-h-[72px] px-3.5 py-3 rounded-[22px] flex items-center justify-between gap-3 text-left transition-transform active:scale-[0.985]"
                  style={{
                    background: isWhatsapp ? "linear-gradient(135deg,#22C55E,#16A34A)" : surfaceColor,
                    border: isWhatsapp ? "1px solid #22C55E" : `1px solid ${secondaryColor}20`,
                    boxShadow: isWhatsapp ? "0 10px 26px rgba(34,197,94,.20)" : `0 8px 22px ${primaryColor}0B`,
                  }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: isWhatsapp ? "rgba(255,255,255,.18)" : hexToRgba(secondaryColor, 0.14), boxShadow: isWhatsapp ? "inset 0 0 0 1px rgba(255,255,255,.10)" : `inset 0 0 0 1px ${hexToRgba(secondaryColor, 0.12)}` }}
                    >
                      {getIcon(link.type)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[14px] font-black truncate" style={{ color: isWhatsapp ? "#FFFFFF" : textColor }}>{link.title}</div>
                      <div className="text-[11px] mt-1 leading-snug truncate" style={{ color: isWhatsapp ? "rgba(255,255,255,.82)" : `${textColor}78` }}>{getLinkDescription(link.type)}</div>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: isWhatsapp ? "rgba(255,255,255,.14)" : hexToRgba(secondaryColor, 0.12), boxShadow: `0 6px 18px ${hexToRgba(primaryColor, 0.08)}` }}>
                    <ExternalLink className="w-4 h-4" style={{ color: isWhatsapp ? "#FFFFFF" : secondaryColor }} />
                  </div>
                </button>
              );
            })}

            {wifiEnabled && (
              <button
                onClick={() => setShowWifiModal(true)}
                className="w-full min-h-[72px] px-3.5 py-3 rounded-[22px] flex items-center justify-between gap-3 text-left active:scale-[0.985]"
                style={{ background: surfaceColor, border: `1px solid ${secondaryColor}20`, boxShadow: `0 8px 22px ${primaryColor}0B` }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${secondaryColor}12` }}>
                    <Wifi className="w-5 h-5" style={{ color: primaryColor }} />
                  </div>
                  <div>
                    <div className="text-[13px] font-black" style={{ color: textColor }}>Wi‑Fi para clientes</div>
                    <div className="text-[10.5px] mt-0.5" style={{ color: `${textColor}78` }}>Veja a rede disponível e copie a senha.</div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4" style={{ color: secondaryColor }} />
              </button>
            )}

            {(experience?.feedback_enabled ?? true) && !activeLinks.some((l) => l.type === "suggestion") && (
              <button
                onClick={() => setShowFeedbackModal(true)}
                className="w-full min-h-[72px] px-3.5 py-3 rounded-[22px] flex items-center justify-between gap-3 text-left active:scale-[0.985]"
                style={{ background: surfaceColor, border: `1px solid ${secondaryColor}20`, boxShadow: `0 8px 22px ${primaryColor}0B` }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${secondaryColor}12` }}>
                    <Send className="w-5 h-5" style={{ color: primaryColor }} />
                  </div>
                  <div>
                    <div className="text-[13px] font-black" style={{ color: textColor }}>Enviar feedback</div>
                    <div className="text-[10.5px] mt-0.5" style={{ color: `${textColor}78` }}>Sua opinião é muito importante.</div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4" style={{ color: secondaryColor }} />
              </button>
            )}
          </div>
        </section>

        {campaign && campaign.is_active && (
          <div
            className="w-full mt-5 p-4 rounded-[26px] text-left"
            style={{
              background: `linear-gradient(135deg,${primaryColor},${secondaryColor})`,
              color: "#FFFFFF",
              boxShadow: `0 16px 36px ${primaryColor}20`,
            }}
          >
            <div className="text-[10px] font-bold uppercase flex items-center gap-1 text-white/80"><Tag className="w-3 h-3" /> Oferta especial</div>
            <div className="text-sm font-black mt-2">{campaign.title}</div>
            <p className="text-xs mt-1 text-white/75">{campaign.description}</p>
            <div className="mt-3 flex items-baseline gap-2">
              {campaign.original_price && <span className="text-xs line-through text-white/55">{formatCurrency(campaign.original_price)}</span>}
              <span className="text-lg font-black">{formatCurrency(campaign.current_price)}</span>
            </div>
            {campaign.button_url && (
              <button
                onClick={() => !isMockup && window.open(campaign.button_url, "_blank", "noopener,noreferrer")}
                className="mt-3 w-full py-2.5 px-3 font-black text-xs rounded-xl bg-white"
                style={{ color: primaryColor }}
              >
                {campaign.button_text || "Quero aproveitar"}
              </button>
            )}
          </div>
        )}

        {/* AGRADECIMENTO */}
        <div className="w-full mt-7 px-4">
          <div className="relative py-8 px-5 text-center rounded-[28px] overflow-hidden" style={{ background: `linear-gradient(160deg,${hexToRgba(secondaryColor, 0.18)} 0%,${hexToRgba(surfaceColor, 0.94)} 100%)`, border: `1px solid ${hexToRgba(secondaryColor, 0.24)}`, boxShadow: `0 18px 44px ${hexToRgba(primaryColor, 0.10)}` }}>
            <div className="absolute left-0 top-1/2 h-px w-10" style={{ backgroundColor: `${secondaryColor}45` }} />
            <div className="absolute right-0 top-1/2 h-px w-10" style={{ backgroundColor: `${secondaryColor}45` }} />
            <div className="mx-auto mb-3 w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${secondaryColor}16` }}><Heart className="w-5 h-5" style={{ color: secondaryColor }} /></div>
            <p className="text-[12px] leading-relaxed" style={{ color: `${textColor}90` }}>Agradecemos por fazer parte da história da</p>
            <div className="mt-1 text-[18px] font-black" style={{ color: primaryColor }}>{business.name}.</div>
          </div>
        </div>

        <div className="mt-1 pt-4 w-full text-[10px]" style={{ borderTop: `1px solid ${secondaryColor}20`, color: `${textColor}64` }}>
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
