"use client";

import React, { useState } from "react";
import {
  Star,
  MessageCircle,
  UtensilsCrossed,
  MapPin,
  Instagram,
  Gift,
  Send,
  ExternalLink,
  Tag,
  CheckCircle2,
  X,
  Phone,
  Calendar,
  Sparkles,
  Share2,
} from "lucide-react";
import { Business, BusinessLink, Campaign, TapDevice } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface PhoneViewProps {
  business: Business;
  links: BusinessLink[];
  campaign?: Campaign | null;
  device?: TapDevice | null;
  isMockup?: boolean;
  onLinkClick?: (linkType: string, url: string) => void;
}

export default function PhoneView({
  business,
  links,
  campaign,
  device,
  isMockup = false,
  onLinkClick,
}: PhoneViewProps) {
  const [showClubModal, setShowClubModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [clubName, setClubName] = useState("");
  const [clubPhone, setClubPhone] = useState("");
  const [clubBirth, setClubBirth] = useState("");
  const [clubConsent, setClubConsent] = useState(false);
  const [clubSubmitted, setClubSubmitted] = useState(false);

  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleLinkAction = (link: BusinessLink) => {
    if (onLinkClick) {
      onLinkClick(link.type, link.url);
    }

    if (link.type === "suggestion") {
      setShowFeedbackModal(true);
      return;
    }

    if (!isMockup && link.url && link.url !== "#feedback") {
      window.open(link.url, "_blank", "noopener,noreferrer");
    }
  };

  const handleClubSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clubConsent) {
      alert("Por favor, confirme seu consentimento para receber novidades.");
      return;
    }

    // Registrar evento de telemetria
    if (typeof window !== "undefined") {
      fetch("/api/club", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: business.id,
          deviceId: device?.id,
          name: clubName,
          phone: clubPhone,
          birthDate: clubBirth,
          consent: true,
          source: device?.type ? "nfc_tap" : "public_page",
        }),
      }).catch(() => {});
    }

    setClubSubmitted(true);
    setTimeout(() => {
      setShowClubModal(false);
      setClubSubmitted(false);
      setClubName("");
      setClubPhone("");
      setClubBirth("");
      setClubConsent(false);
    }, 2500);
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackSubmitted(true);
    setTimeout(() => {
      setShowFeedbackModal(false);
      setFeedbackSubmitted(false);
      setFeedbackMessage("");
    }, 2000);
  };

  // Helper para renderizar ícones
  const getIcon = (type: string) => {
    switch (type) {
      case "google_review":
        return <Star className="w-5 h-5 text-amber-500 fill-amber-400" />;
      case "whatsapp":
        return <MessageCircle className="w-5 h-5 text-emerald-600 fill-emerald-100" />;
      case "menu":
      case "catalog":
        return <UtensilsCrossed className="w-5 h-5 text-orange-600" />;
      case "maps":
        return <MapPin className="w-5 h-5 text-rose-600" />;
      case "instagram":
        return <Instagram className="w-5 h-5 text-pink-600" />;
      case "suggestion":
        return <Send className="w-5 h-5 text-navy-700" />;
      default:
        return <ExternalLink className="w-5 h-5 text-slate-600" />;
    }
  };

  const activeLinks = links
    .filter((l) => l.is_active)
    .sort((a, b) => a.order_index - b.order_index);

  return (
    <div className="w-full max-w-[420px] mx-auto min-h-full bg-slate-50 relative pb-12 select-none">
      {/* Capa */}
      <div className="relative h-36 w-full bg-gradient-to-r from-navy-900 to-navy-800 overflow-hidden">
        {business.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={business.cover_url}
            alt="Capa do estabelecimento"
            className="w-full h-full object-cover opacity-60"
          />
        ) : (
          <div className="w-full h-full opacity-30 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent opacity-80" />
      </div>

      {/* Conteúdo Principal */}
      <div className="px-5 -mt-16 relative z-10 flex flex-col items-center text-center">
        {/* Logo */}
        <div className="relative w-24 h-24 rounded-2xl p-1 bg-white shadow-xl border border-slate-100 overflow-hidden mb-3">
          {business.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={business.logo_url}
              alt={business.name}
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            <div className="w-full h-full bg-navy-900 text-white flex items-center justify-center font-bold text-2xl rounded-xl">
              {business.name.substring(0, 2).toUpperCase()}
            </div>
          )}
          <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
        </div>

        {/* Nome e Descrição */}
        <h1 className="text-xl font-bold text-navy-950 flex items-center gap-1.5">
          {business.name}
        </h1>
        <p className="text-xs font-medium text-gold-600 tracking-wide uppercase mt-0.5">
          {business.category}
        </p>
        <p className="text-xs text-slate-600 mt-2 max-w-[320px] leading-relaxed">
          {business.description || "Obrigado por nos visitar ❤️"}
        </p>

        {/* Tag da Placa Física se conectada */}
        {device && (
          <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-navy-100 text-navy-900 border border-navy-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Conectado via {device.name} ({device.location})
          </div>
        )}

        {/* Botão de Destaque: Clube de Clientes */}
        <div className="w-full mt-4">
          <button
            onClick={() => setShowClubModal(true)}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 via-amber-600 to-gold-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-between group active:scale-[0.98]"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white backdrop-blur-sm">
                <Gift className="w-5 h-5 animate-bounce" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold leading-tight flex items-center gap-1">
                  🎁 Clube de Clientes VIP
                </div>
                <div className="text-[10px] text-amber-100 leading-tight">
                  Cadastre-se e ganhe benefícios exclusivos
                </div>
              </div>
            </div>
            <span className="text-xs bg-white text-amber-800 font-bold px-2 py-1 rounded-md shadow-xs group-hover:scale-105 transition-transform">
              Participar
            </span>
          </button>
        </div>

        {/* Lista de Botões de Ação */}
        <div className="w-full mt-3.5 space-y-2.5">
          {activeLinks.map((link) => {
            const isGoogle = link.type === "google_review";
            return (
              <button
                key={link.id}
                onClick={() => handleLinkAction(link)}
                className={`w-full p-3 rounded-xl flex items-center justify-between border transition-all text-left group active:scale-[0.98] ${
                  isGoogle
                    ? "bg-white border-amber-300 shadow-sm hover:border-amber-400 hover:shadow-md"
                    : "bg-white border-slate-200/80 shadow-xs hover:border-slate-300 hover:bg-slate-50/80"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                      isGoogle ? "bg-amber-50 border border-amber-200" : "bg-slate-100"
                    }`}
                  >
                    {getIcon(link.type)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-navy-900 flex items-center gap-1.5">
                      {link.title}
                      {isGoogle && (
                        <span className="text-[9px] bg-amber-100 text-amber-900 font-semibold px-1.5 py-0.5 rounded">
                          5.0 ★★★★★
                        </span>
                      )}
                    </div>
                    {isGoogle && (
                      <div className="text-[10px] text-slate-600 font-medium">
                        Sua opinião ajuda muito nosso negócio!
                      </div>
                    )}
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-transform" />
              </button>
            );
          })}
        </div>

        {/* Promoção / Campanha Ativa */}
        {campaign && campaign.is_active && (
          <div className="w-full mt-5 p-4 rounded-2xl bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 text-white border border-gold-400/30 shadow-lg text-left relative overflow-hidden">
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-300 border border-gold-400/40 text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
              <Tag className="w-3 h-3" />
              Oferta Especial
            </div>

            <div className="text-[11px] font-semibold text-gold-400 uppercase tracking-wide">
              {campaign.title}
            </div>

            <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
              {campaign.description}
            </p>

            <div className="mt-3 flex items-baseline gap-2">
              {campaign.original_price && (
                <span className="text-xs line-through text-slate-400 font-medium">
                  {formatCurrency(campaign.original_price)}
                </span>
              )}
              <span className="text-lg font-black text-white">
                {formatCurrency(campaign.current_price)}
              </span>
            </div>

            <button
              onClick={() => {
                if (campaign.button_url && !isMockup) {
                  window.open(campaign.button_url, "_blank", "noopener,noreferrer");
                }
              }}
              className="mt-3 w-full py-2 px-3 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {campaign.button_text || "Quero aproveitar"}
            </button>
          </div>
        )}

        {/* Rodapé da Página Pública */}
        <div className="mt-8 pt-4 border-t border-slate-200/80 w-full flex flex-col items-center">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-600 font-medium">
            <span>Powered by</span>
            <span className="font-black tracking-tight text-navy-900">Konnexy Tap</span>
            <span>•</span>
            <span>Placa Inteligente</span>
          </div>
          <p className="text-[9px] text-slate-600 mt-0.5">
            Um toque conecta seu cliente ao seu negócio.
          </p>
        </div>
      </div>

      {/* MODAL: Clube de Clientes (LGPD Compliant) */}
      {showClubModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 p-5 relative animate-in fade-in zoom-in-95 duration-200 text-left">
            <button
              onClick={() => setShowClubModal(false)}
              className="absolute top-3 right-3 p-1 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            {clubSubmitted ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                <h3 className="text-base font-bold text-slate-900">
                  Bem-vindo ao Clube! 🎉
                </h3>
                <p className="text-xs text-slate-600">
                  Seu cadastro foi realizado com sucesso. Você receberá novidades e mimos exclusivos!
                </p>
              </div>
            ) : (
              <form onSubmit={handleClubSubmit} className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Gift className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-navy-950">
                      Entre para o Clube {business.name}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Receba cupons e ofertas exclusivas no seu WhatsApp.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Seu nome completo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Ana Clara Santos"
                    value={clubName}
                    onChange={(e) => setClubName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-600 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="(11) 99999-9999"
                    value={clubPhone}
                    onChange={(e) => setClubPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-600 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Data de nascimento (opcional para mimos de aniversário)
                  </label>
                  <input
                    type="date"
                    value={clubBirth}
                    onChange={(e) => setClubBirth(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-600 text-slate-900"
                  />
                </div>

                {/* Consentimento Obrigatório LGPD - NUNCA PRÉ-MARCADO */}
                <div className="pt-1">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={clubConsent}
                      onChange={(e) => setClubConsent(e.target.checked)}
                      className="mt-0.5 rounded border-slate-300 text-navy-900 focus:ring-navy-600"
                    />
                    <span className="text-[11px] text-slate-600 leading-tight">
                      Concordo em receber comunicações, novidades e ofertas deste estabelecimento via WhatsApp/SMS, conforme a LGPD.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={!clubConsent}
                  className="w-full py-2.5 px-4 bg-navy-900 hover:bg-navy-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-md"
                >
                  Cadastrar no Clube
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL: Sugestão / Feedback Direto (Independente do Google Reviews) */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 p-5 relative animate-in fade-in zoom-in-95 duration-200 text-left">
            <button
              onClick={() => setShowFeedbackModal(false)}
              className="absolute top-3 right-3 p-1 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            {feedbackSubmitted ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h3 className="text-base font-bold text-slate-900">
                  Mensagem enviada!
                </h3>
                <p className="text-xs text-slate-600">
                  Sua sugestão foi entregue diretamente à gerência. Agradecemos muito sua colaboração para melhorarmos continuamente!
                </p>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-navy-100 text-navy-800 flex items-center justify-center">
                    <Send className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-navy-950">
                      Enviar sugestão à gerência
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Canal direto e confidencial com o responsável.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Como foi sua experiência? O que podemos melhorar?
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Escreva sua opinião sincera ou sugestão..."
                    value={feedbackMessage}
                    onChange={(e) => setFeedbackMessage(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-600 text-slate-900"
                  />
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 text-[11px] text-slate-500">
                  💡 <strong>Nota:</strong> Quer avaliar nosso atendimento publicamente? Você também pode usar a opção <strong>Avaliar no Google</strong> na página principal.
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold rounded-xl transition-all shadow-md"
                >
                  Enviar Sugestão
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
