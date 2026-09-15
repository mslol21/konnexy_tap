"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  AlertCircle,
  Check,
  Copy,
  Download,
  ExternalLink,
  Loader2,
  Plus,
  QrCode,
  Radio,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { generateDeviceCode, validateDestinationUrl } from "@/lib/security";
import type { DeviceStatus } from "@/lib/types";

interface BusinessSummary {
  name: string;
  slug: string;
  category: string;
  city?: string | null;
  state?: string | null;
}

interface PlateRecord {
  id: string;
  business_id: string;
  code: string;
  name: string;
  type: string;
  location: string;
  active: boolean;
  status: DeviceStatus;
  destination_url?: string | null;
  destination_type: string;
  created_at: string;
  businesses?: BusinessSummary | null;
}

interface CreatePlateResponse {
  success: true;
  business: BusinessSummary & { id: string };
  plate: PlateRecord;
  urls: {
    nfc: string;
    qr: string;
    test: string;
  };
}

function getErrorMessage(payload: unknown, fallback: string) {
  if (payload && typeof payload === "object" && "error" in payload) {
    const error = (payload as { error?: unknown }).error;
    if (typeof error === "string") return error;
  }
  return fallback;
}

export default function AdminPlacasPage() {
  const [plates, setPlates] = useState<PlateRecord[]>([]);
  const [selectedPlate, setSelectedPlate] = useState<PlateRecord | null>(null);
  const [createdUrls, setCreatedUrls] = useState<CreatePlateResponse["urls"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [publicBase, setPublicBase] = useState(process.env.NEXT_PUBLIC_APP_URL || "");

  const [leadId, setLeadId] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState("Comércio local");
  const [city, setCity] = useState("");
  const [state, setState] = useState("SP");
  const [location, setLocation] = useState("Balcão principal");
  const [code, setCode] = useState(() => generateDeviceCode("OM"));
  const [googleUrl, setGoogleUrl] = useState("");
  const [status, setStatus] = useState<"pending" | "active">("active");

  const loadPlates = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/plates", { cache: "no-store" });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setPlates([]);
        setSelectedPlate(null);
        setError(getErrorMessage(payload, "Não foi possível carregar as placas."));
        return;
      }

      const nextPlates = Array.isArray(payload.plates) ? (payload.plates as PlateRecord[]) : [];
      setPlates(nextPlates);
      setSelectedPlate((current) => current ?? nextPlates[0] ?? null);
    } catch {
      setError("Falha de conexão ao carregar as placas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!publicBase && typeof window !== "undefined") {
      setPublicBase(window.location.origin);
    }

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const queryLeadId = params.get("lead_id");
      const queryBusiness = params.get("business_name");
      const queryCategory = params.get("category");
      const queryCity = params.get("city");

      if (queryLeadId) setLeadId(queryLeadId);
      if (queryBusiness) setBusinessName(queryBusiness);
      if (queryCategory) setCategory(queryCategory);
      if (queryCity) setCity(queryCity);
    }

    void loadPlates();
  }, [loadPlates, publicBase]);

  const previewBase = (publicBase || "https://seu-dominio.com").replace(/\/$/, "");
  const previewNfc = `${previewBase}/t/${code}?src=nfc`;
  const previewQr = `${previewBase}/t/${code}?src=qr`;

  const selectedUrls = useMemo(() => {
    if (!selectedPlate) return null;
    if (createdUrls && createdUrls.nfc.includes(selectedPlate.code)) return createdUrls;
    return {
      nfc: `${previewBase}/t/${selectedPlate.code}?src=nfc`,
      qr: `${previewBase}/t/${selectedPlate.code}?src=qr`,
      test: `${previewBase}/t/${selectedPlate.code}?src=direct`,
    };
  }, [createdUrls, previewBase, selectedPlate]);

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      window.setTimeout(() => setCopied(null), 1800);
    } catch {
      setError("Não foi possível copiar automaticamente. Selecione o link manualmente.");
    }
  };

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const validation = validateDestinationUrl(googleUrl, "google_review");
    if (!validation.isValid) {
      setError(validation.error || "Link de avaliação do Google inválido.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/admin/plates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead_id: leadId,
          business_name: businessName,
          category,
          city: city || null,
          state: state || null,
          location,
          code,
          google_url: validation.sanitizedUrl,
          status,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(getErrorMessage(payload, "Não foi possível cadastrar a placa."));
        return;
      }

      const result = payload as CreatePlateResponse;
      const newPlate: PlateRecord = {
        ...result.plate,
        businesses: result.business,
      };

      setPlates((current) => [newPlate, ...current.filter((item) => item.id !== newPlate.id)]);
      setSelectedPlate(newPlate);
      setCreatedUrls(result.urls);
      setSuccess(`Placa ${newPlate.code} cadastrada e vinculada a ${result.business.name}.`);
      setLeadId(null);
      setBusinessName("");
      setCategory("Comércio local");
      setCity("");
      setLocation("Balcão principal");
      setGoogleUrl("");
      setStatus("active");
      setCode(generateDeviceCode("OM"));
    } catch {
      setError("Falha de conexão ao cadastrar a placa.");
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = async (plate: PlateRecord, nextStatus: DeviceStatus) => {
    setError(null);
    const response = await fetch("/api/admin/plates", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: plate.id, status: nextStatus }),
    });
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      setError(getErrorMessage(payload, "Não foi possível alterar o status."));
      return;
    }

    const nextPlate = {
      ...plate,
      status: nextStatus,
      active: nextStatus === "active",
    };
    setPlates((current) => current.map((item) => (item.id === plate.id ? nextPlate : item)));
    setSelectedPlate((current) => (current?.id === plate.id ? nextPlate : current));
  };

  const downloadQrCodePng = (plate: PlateRecord) => {
    const svg = document.getElementById(`qr-svg-${plate.code}`);
    if (!svg || !selectedUrls) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const image = new Image();

    image.onload = () => {
      canvas.width = 1200;
      canvas.height = 1400;
      if (!context) return;

      context.fillStyle = "#FFFFFF";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.strokeStyle = "#CBD5E1";
      context.lineWidth = 4;
      context.strokeRect(60, 60, 1080, 1280);
      context.textAlign = "center";
      context.fillStyle = "#20252A";
      context.font = "bold 44px sans-serif";
      context.fillText("AVALIE NOSSA EMPRESA NO GOOGLE", 600, 160);
      context.fillStyle = "#6D7277";
      context.font = "24px sans-serif";
      context.fillText("Aproxime o celular ou leia o QR Code", 600, 210);
      context.drawImage(image, 200, 260, 800, 800);
      context.fillStyle = "#20252A";
      context.font = "bold 30px sans-serif";
      context.fillText(plate.businesses?.name || plate.name, 600, 1140);
      context.fillStyle = "#6D7277";
      context.font = "22px monospace";
      context.fillText(plate.code, 600, 1190);
      context.fillStyle = "#9A6236";
      context.font = "bold 20px sans-serif";
      context.fillText("OTIMIZA MEU NEGÓCIO • PLACA INTELIGENTE", 600, 1240);

      const anchor = document.createElement("a");
      anchor.download = `otimiza-placa-${plate.code}.png`;
      anchor.href = canvas.toDataURL("image/png");
      anchor.click();
    };

    image.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`;
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/80 p-6 rounded-3xl border border-slate-700">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Operação real do MVP</span>
          <h1 className="text-2xl font-black text-white mt-1">Cadastrar e ativar placas</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            O cadastro agora grava estabelecimento e placa no Supabase. Sem banco configurado, a tela informa a pendência em vez de simular sucesso.
          </p>
        </div>
        <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-gold-400">
          {loading ? "Carregando..." : `${plates.length} placa${plates.length === 1 ? "" : "s"}`}
        </div>
      </header>

      {leadId && (
        <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-100 text-xs">
          Conversão iniciada a partir de um lead. Ao cadastrar a placa, o vínculo será salvo automaticamente.
        </div>
      )}

      {error && (
        <div role="alert" className="p-4 rounded-2xl border border-rose-500/40 bg-rose-500/10 text-rose-100 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-100 text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <section className="xl:col-span-6 bg-slate-800/80 p-6 rounded-3xl border border-slate-700">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-gold-400" /> Nova placa
            </h2>
            <button
              type="button"
              onClick={() => setCode(generateDeviceCode("OM"))}
              className="text-[11px] text-gold-400 hover:text-gold-300 flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Gerar novo código
            </button>
          </div>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Empresa *</label>
              <input required value={businessName} onChange={(event) => setBusinessName(event.target.value)} placeholder="Ex: Barbearia Dom Pedro" className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-gold-500" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Segmento *</label>
                <input required value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Barbearia, restaurante..." className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-gold-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Cidade</label>
                <input value={city} onChange={(event) => setCity(event.target.value)} placeholder="São Paulo" className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-gold-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">UF</label>
                <input maxLength={2} value={state} onChange={(event) => setState(event.target.value.toUpperCase())} className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-900 border border-slate-700 text-white uppercase focus:outline-none focus:ring-2 focus:ring-gold-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Código *</label>
                <input required value={code} onChange={(event) => setCode(event.target.value.toUpperCase())} className="w-full px-3.5 py-2.5 text-sm font-mono font-bold rounded-xl bg-slate-900 border border-slate-700 text-gold-300 uppercase focus:outline-none focus:ring-2 focus:ring-gold-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Status inicial</label>
                <select value={status} onChange={(event) => setStatus(event.target.value as "pending" | "active")} className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-gold-500">
                  <option value="active">Ativa</option>
                  <option value="pending">Pendente</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Local físico da placa</label>
              <input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Balcão principal" className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-gold-500" />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Link oficial para pedir avaliação no Google *</label>
              <input type="url" required value={googleUrl} onChange={(event) => setGoogleUrl(event.target.value)} placeholder="https://g.page/r/.../review" className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-gold-500" />
              <p className="text-[10px] text-slate-400 mt-1">Use o link gerado no Perfil da Empresa no Google em “Pedir avaliações”.</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 space-y-2">
              <div className="text-[10px] uppercase font-bold text-slate-400">Prévia dos links gravados na placa</div>
              <div className="font-mono text-[11px] text-gold-300 break-all">NFC: {previewNfc}</div>
              <div className="font-mono text-[11px] text-gold-300 break-all">QR: {previewQr}</div>
            </div>

            <button type="submit" disabled={submitting} className="w-full py-3 bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-navy-950 font-black text-sm rounded-xl flex items-center justify-center gap-2">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              {submitting ? "Cadastrando no Supabase..." : "Cadastrar estabelecimento e ativar placa"}
            </button>
          </form>
        </section>

        <section className="xl:col-span-6 bg-slate-800/80 p-6 rounded-3xl border border-slate-700 min-h-[420px]">
          {selectedPlate && selectedUrls ? (
            <div className="space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[10px] uppercase text-slate-400 font-bold">Placa selecionada</div>
                  <h2 className="text-lg font-black text-white">{selectedPlate.businesses?.name || selectedPlate.name}</h2>
                  <p className="text-xs text-slate-400">{selectedPlate.code} • {selectedPlate.location}</p>
                </div>
                <select value={selectedPlate.status} onChange={(event) => void updateStatus(selectedPlate, event.target.value as DeviceStatus)} className="px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white">
                  <option value="active">Ativa</option>
                  <option value="pending">Pendente</option>
                  <option value="inactive">Inativa</option>
                  <option value="suspended">Suspensa</option>
                </select>
              </div>

              <div className="bg-white rounded-2xl p-6 flex flex-col items-center">
                <QRCodeSVG id={`qr-svg-${selectedPlate.code}`} value={selectedUrls.qr} size={200} level="H" />
                <div className="mt-3 text-xs font-black text-slate-900 font-mono">{selectedPlate.code}</div>
                <div className="text-[10px] text-slate-500">{selectedPlate.businesses?.name || selectedPlate.name}</div>
              </div>

              <div className="space-y-2">
                {[{ label: "NFC", value: selectedUrls.nfc }, { label: "QR", value: selectedUrls.qr }].map((item) => (
                  <div key={item.label} className="p-3 rounded-xl bg-slate-900 border border-slate-700 flex items-center gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] uppercase font-bold text-slate-400">Link {item.label}</div>
                      <div className="text-[11px] font-mono text-slate-200 truncate">{item.value}</div>
                    </div>
                    <button onClick={() => void handleCopy(item.value, item.label)} className="p-2 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700" title={`Copiar ${item.label}`}>
                      {copied === item.label ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <a href={selectedUrls.test} target="_blank" rel="noopener noreferrer" className="py-2.5 px-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold flex items-center justify-center gap-2">
                  <ExternalLink className="w-4 h-4" /> Testar redirecionamento
                </a>
                <button onClick={() => downloadQrCodePng(selectedPlate)} className="py-2.5 px-4 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 text-xs font-bold flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" /> Baixar QR para produção
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[360px] flex flex-col items-center justify-center text-center px-6">
              {loading ? (
                <Loader2 className="w-8 h-8 text-gold-400 animate-spin" />
              ) : (
                <>
                  <QrCode className="w-10 h-10 text-slate-500 mb-3" />
                  <h2 className="text-base font-bold text-white">Nenhuma placa cadastrada</h2>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm">Quando o Supabase estiver configurado, use o formulário ao lado para criar a primeira placa real.</p>
                </>
              )}
            </div>
          )}
        </section>
      </div>

      <section className="bg-slate-800/80 rounded-3xl border border-slate-700 overflow-hidden">
        <div className="p-5 border-b border-slate-700 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2"><Radio className="w-4 h-4 text-emerald-400" /> Placas cadastradas</h2>
          <button onClick={() => void loadPlates()} className="text-xs text-gold-400 hover:text-gold-300 flex items-center gap-1"><RefreshCw className="w-3.5 h-3.5" /> Atualizar</button>
        </div>
        {plates.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">Nenhum registro real disponível.</div>
        ) : (
          <div className="divide-y divide-slate-700/70">
            {plates.map((plate) => (
              <button key={plate.id} type="button" onClick={() => { setSelectedPlate(plate); setCreatedUrls(null); }} className="w-full p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left hover:bg-slate-700/40 transition-colors">
                <div>
                  <div className="text-sm font-bold text-white">{plate.businesses?.name || plate.name}</div>
                  <div className="text-[11px] text-slate-400"><span className="font-mono text-gold-400">{plate.code}</span> • {plate.location}</div>
                </div>
                <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full ${plate.status === "active" ? "bg-emerald-500/20 text-emerald-300" : plate.status === "pending" ? "bg-amber-500/20 text-amber-300" : "bg-slate-700 text-slate-300"}`}>{plate.status}</span>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
