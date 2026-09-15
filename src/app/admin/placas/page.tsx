"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  AlertCircle,
  BarChart3,
  Building2,
  Check,
  Copy,
  Download,
  ExternalLink,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  QrCode,
  Radio,
  RefreshCw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { generateDeviceCode, validateDestinationUrl } from "@/lib/security";
import type { DeviceStatus } from "@/lib/types";

interface BusinessSummary {
  id?: string;
  name: string;
  slug: string;
  category: string;
  city?: string | null;
  state?: string | null;
  google_review_url?: string | null;
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
  access_count?: number;
  businesses?: BusinessSummary | null;
}

interface CreatePlateResponse {
  success: true;
  business: BusinessSummary & { id: string };
  plate: PlateRecord;
  urls: { nfc: string; qr: string; test: string };
}

function getErrorMessage(payload: unknown, fallback: string) {
  if (payload && typeof payload === "object" && "error" in payload) {
    const error = (payload as { error?: unknown }).error;
    if (typeof error === "string") return error;
  }
  return fallback;
}

const statusLabel: Record<DeviceStatus, string> = {
  active: "Ativa",
  pending: "Pendente",
  inactive: "Inativa",
  suspended: "Suspensa",
};

const statusClass: Record<DeviceStatus, string> = {
  active: "bg-emerald-500/15 text-emerald-300 border-emerald-500/25",
  pending: "bg-amber-500/15 text-amber-300 border-amber-500/25",
  inactive: "bg-slate-500/15 text-slate-300 border-slate-500/25",
  suspended: "bg-rose-500/15 text-rose-300 border-rose-500/25",
};

export default function AdminPlacasPage() {
  const [plates, setPlates] = useState<PlateRecord[]>([]);
  const [selectedPlate, setSelectedPlate] = useState<PlateRecord | null>(null);
  const [createdUrls, setCreatedUrls] = useState<CreatePlateResponse["urls"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [publicBase, setPublicBase] = useState(process.env.NEXT_PUBLIC_APP_URL || "");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | DeviceStatus>("all");
  const [editing, setEditing] = useState(false);

  const [leadId, setLeadId] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState("Comércio local");
  const [city, setCity] = useState("");
  const [state, setState] = useState("SP");
  const [location, setLocation] = useState("Balcão principal");
  const [code, setCode] = useState(() => generateDeviceCode("OM"));
  const [googleUrl, setGoogleUrl] = useState("");
  const [status, setStatus] = useState<"pending" | "active">("active");

  const [editBusinessName, setEditBusinessName] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editState, setEditState] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editGoogleUrl, setEditGoogleUrl] = useState("");
  const [editStatus, setEditStatus] = useState<DeviceStatus>("active");

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
      setSelectedPlate((current) => {
        if (!current) return nextPlates[0] ?? null;
        return nextPlates.find((item) => item.id === current.id) ?? nextPlates[0] ?? null;
      });
    } catch {
      setError("Falha de conexão ao carregar as placas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!publicBase && typeof window !== "undefined") setPublicBase(window.location.origin);
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

  const filteredPlates = useMemo(() => {
    const query = search.trim().toLowerCase();
    return plates.filter((plate) => {
      const business = plate.businesses;
      const matchesStatus = statusFilter === "all" || plate.status === statusFilter;
      const matchesSearch =
        !query ||
        plate.code.toLowerCase().includes(query) ||
        plate.location.toLowerCase().includes(query) ||
        (business?.name || plate.name).toLowerCase().includes(query) ||
        (business?.city || "").toLowerCase().includes(query);
      return matchesStatus && matchesSearch;
    });
  }, [plates, search, statusFilter]);

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
      const newPlate: PlateRecord = { ...result.plate, businesses: result.business, access_count: 0 };
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

  const startEditing = (plate: PlateRecord) => {
    setSelectedPlate(plate);
    setEditBusinessName(plate.businesses?.name || plate.name.replace(/^Placa\s+/i, ""));
    setEditCategory(plate.businesses?.category || "Comércio local");
    setEditCity(plate.businesses?.city || "");
    setEditState(plate.businesses?.state || "");
    setEditLocation(plate.location);
    setEditGoogleUrl(plate.destination_url || plate.businesses?.google_review_url || "");
    setEditStatus(plate.status);
    setEditing(true);
    setError(null);
    setSuccess(null);
  };

  const handleSaveEdit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedPlate) return;
    const validation = validateDestinationUrl(editGoogleUrl, "google_review");
    if (!validation.isValid) {
      setError(validation.error || "Link de avaliação do Google inválido.");
      return;
    }

    setSavingEdit(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/plates", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedPlate.id,
          business_name: editBusinessName,
          category: editCategory,
          city: editCity || null,
          state: editState || null,
          location: editLocation,
          destination_url: validation.sanitizedUrl,
          status: editStatus,
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(getErrorMessage(payload, "Não foi possível salvar as alterações."));
        return;
      }
      const updated = payload.plate as PlateRecord;
      const nextPlate = { ...updated, access_count: selectedPlate.access_count ?? 0 };
      setPlates((current) => current.map((item) => (item.id === nextPlate.id ? nextPlate : item)));
      setSelectedPlate(nextPlate);
      setEditing(false);
      setCreatedUrls(null);
      setSuccess(`Alterações da placa ${nextPlate.code} salvas com sucesso.`);
    } catch {
      setError("Falha de conexão ao salvar as alterações.");
    } finally {
      setSavingEdit(false);
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
    const updated = payload.plate as PlateRecord;
    const nextPlate = { ...updated, access_count: plate.access_count ?? 0 };
    setPlates((current) => current.map((item) => (item.id === plate.id ? nextPlate : item)));
    setSelectedPlate((current) => (current?.id === plate.id ? nextPlate : current));
    setSuccess(`Status da placa ${plate.code} alterado para ${statusLabel[nextStatus]}.`);
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
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-800/80 p-6 rounded-3xl border border-slate-700">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Central de operação</span>
          <h1 className="text-2xl font-black text-white mt-1">Gestão de placas</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">Cadastre, localize, edite, pause, teste e gere o QR das placas sem precisar alterar o banco manualmente.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-gold-400">{loading ? "Carregando..." : `${plates.length} placa${plates.length === 1 ? "" : "s"}`}</div>
          <button onClick={() => void loadPlates()} className="p-2.5 rounded-xl bg-slate-700 text-white hover:bg-slate-600" title="Atualizar"><RefreshCw className="w-4 h-4" /></button>
        </div>
      </header>

      {leadId && <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-100 text-xs">Conversão iniciada a partir de um lead. Ao cadastrar a placa, o vínculo será salvo automaticamente.</div>}
      {error && <div role="alert" className="p-4 rounded-2xl border border-rose-500/40 bg-rose-500/10 text-rose-100 text-xs flex items-start gap-2"><AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /><span>{error}</span></div>}
      {success && <div className="p-4 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-100 text-xs flex items-center gap-2"><Check className="w-4 h-4" /><span>{success}</span></div>}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <section className="xl:col-span-5 bg-slate-800/80 p-6 rounded-3xl border border-slate-700">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold text-white flex items-center gap-2"><Plus className="w-4 h-4 text-gold-400" /> Nova placa</h2>
            <button type="button" onClick={() => setCode(generateDeviceCode("OM"))} className="text-[11px] text-gold-400 hover:text-gold-300 flex items-center gap-1"><RefreshCw className="w-3 h-3" /> Novo código</button>
          </div>
          <form onSubmit={handleCreate} className="space-y-4">
            <div><label className="block text-xs font-bold text-slate-300 mb-1">Empresa *</label><input required value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Ex: Barbearia Dom Pedro" className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-gold-500" /></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div><label className="block text-xs font-bold text-slate-300 mb-1">Segmento *</label><input required value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-900 border border-slate-700 text-white" /></div>
              <div><label className="block text-xs font-bold text-slate-300 mb-1">Cidade</label><input value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-900 border border-slate-700 text-white" /></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div><label className="block text-xs font-bold text-slate-300 mb-1">UF</label><input maxLength={2} value={state} onChange={(e) => setState(e.target.value.toUpperCase())} className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-900 border border-slate-700 text-white uppercase" /></div>
              <div><label className="block text-xs font-bold text-slate-300 mb-1">Código *</label><input required value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} className="w-full px-3.5 py-2.5 text-sm font-mono font-bold rounded-xl bg-slate-900 border border-slate-700 text-gold-300 uppercase" /></div>
              <div><label className="block text-xs font-bold text-slate-300 mb-1">Status inicial</label><select value={status} onChange={(e) => setStatus(e.target.value as "pending" | "active")} className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-900 border border-slate-700 text-white"><option value="active">Ativa</option><option value="pending">Pendente</option></select></div>
            </div>
            <div><label className="block text-xs font-bold text-slate-300 mb-1">Local físico</label><input value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-900 border border-slate-700 text-white" /></div>
            <div><label className="block text-xs font-bold text-slate-300 mb-1">Link oficial de avaliação Google *</label><input type="url" required value={googleUrl} onChange={(e) => setGoogleUrl(e.target.value)} placeholder="https://g.page/r/.../review" className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl bg-slate-900 border border-slate-700 text-white" /><p className="text-[10px] text-slate-400 mt-1">Use o link de “Pedir avaliações” do Perfil da Empresa no Google.</p></div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 space-y-2"><div className="text-[10px] uppercase font-bold text-slate-400">Links permanentes</div><div className="font-mono text-[11px] text-gold-300 break-all">NFC: {previewNfc}</div><div className="font-mono text-[11px] text-gold-300 break-all">QR: {previewQr}</div></div>
            <button type="submit" disabled={submitting} className="w-full py-3 bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-navy-950 font-black text-sm rounded-xl flex items-center justify-center gap-2">{submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}{submitting ? "Cadastrando..." : "Cadastrar estabelecimento e placa"}</button>
          </form>
        </section>

        <section className="xl:col-span-7 bg-slate-800/80 p-6 rounded-3xl border border-slate-700 min-h-[420px]">
          {selectedPlate && selectedUrls ? (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="text-[10px] uppercase text-slate-400 font-bold">Placa selecionada</div>
                  <h2 className="text-lg font-black text-white">{selectedPlate.businesses?.name || selectedPlate.name}</h2>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" /> {selectedPlate.location} • <span className="font-mono text-gold-400">{selectedPlate.code}</span></p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => startEditing(selectedPlate)} className="px-3 py-2 rounded-xl bg-gold-500 text-navy-950 text-xs font-black flex items-center gap-1.5"><Pencil className="w-3.5 h-3.5" /> Editar</button>
                  <select value={selectedPlate.status} onChange={(e) => void updateStatus(selectedPlate, e.target.value as DeviceStatus)} className="px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white"><option value="active">Ativa</option><option value="pending">Pendente</option><option value="inactive">Inativa</option><option value="suspended">Suspensa</option></select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-700"><div className="text-[10px] uppercase text-slate-400">Segmento</div><div className="text-sm font-bold text-white mt-1">{selectedPlate.businesses?.category || "—"}</div></div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-700"><div className="text-[10px] uppercase text-slate-400">Cidade</div><div className="text-sm font-bold text-white mt-1">{[selectedPlate.businesses?.city, selectedPlate.businesses?.state].filter(Boolean).join(" / ") || "—"}</div></div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-700"><div className="text-[10px] uppercase text-slate-400 flex items-center gap-1"><BarChart3 className="w-3 h-3" /> Acessos</div><div className="text-sm font-bold text-white mt-1">{selectedPlate.access_count ?? 0}</div></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-4">
                <div className="bg-white rounded-2xl p-5 flex flex-col items-center justify-center"><QRCodeSVG id={`qr-svg-${selectedPlate.code}`} value={selectedUrls.qr} size={170} level="H" /><div className="mt-3 text-xs font-black text-slate-900 font-mono">{selectedPlate.code}</div><div className="text-[10px] text-slate-500 text-center">{selectedPlate.businesses?.name || selectedPlate.name}</div></div>
                <div className="space-y-2">
                  {[{ label: "NFC", value: selectedUrls.nfc }, { label: "QR", value: selectedUrls.qr }].map((item) => <div key={item.label} className="p-3 rounded-xl bg-slate-900 border border-slate-700 flex items-center gap-2"><div className="min-w-0 flex-1"><div className="text-[10px] uppercase font-bold text-slate-400">Link {item.label}</div><div className="text-[11px] font-mono text-slate-200 truncate">{item.value}</div></div><button onClick={() => void handleCopy(item.value, item.label)} className="p-2 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700">{copied === item.label ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}</button></div>)}
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-700"><div className="text-[10px] uppercase font-bold text-slate-400">Destino Google</div><div className="text-[11px] font-mono text-slate-200 break-all mt-1">{selectedPlate.destination_url || "Não configurado"}</div></div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2"><a href={selectedUrls.test} target="_blank" rel="noopener noreferrer" className="py-2.5 px-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold flex items-center justify-center gap-2"><ExternalLink className="w-4 h-4" /> Testar redirecionamento</a><button onClick={() => downloadQrCodePng(selectedPlate)} className="py-2.5 px-4 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 text-xs font-bold flex items-center justify-center gap-2"><Download className="w-4 h-4" /> Baixar QR para produção</button></div>
            </div>
          ) : <div className="h-full min-h-[360px] flex flex-col items-center justify-center text-center px-6">{loading ? <Loader2 className="w-8 h-8 text-gold-400 animate-spin" /> : <><QrCode className="w-10 h-10 text-slate-500 mb-3" /><h2 className="text-base font-bold text-white">Nenhuma placa cadastrada</h2><p className="text-xs text-slate-400 mt-1 max-w-sm">Cadastre a primeira placa para começar a operação.</p></>}</div>}
        </section>
      </div>

      <section className="bg-slate-800/80 rounded-3xl border border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-700 bg-slate-900/30 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-bold text-white"><Radio className="w-4 h-4 text-emerald-400" /> Placas cadastradas</div>
          <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
            <div className="relative min-w-[260px]"><Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar empresa, código, cidade..." className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-600 text-white" /></div>
            <div className="relative"><SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" /><select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as "all" | DeviceStatus)} className="pl-8 pr-8 py-2 text-xs rounded-xl bg-slate-800 border border-slate-600 text-white"><option value="all">Todos os status</option><option value="active">Ativas</option><option value="pending">Pendentes</option><option value="inactive">Inativas</option><option value="suspended">Suspensas</option></select></div>
          </div>
        </div>
        {filteredPlates.length === 0 ? <div className="p-8 text-center text-xs text-slate-400">Nenhuma placa encontrada para os filtros atuais.</div> : <div className="overflow-x-auto"><table className="w-full text-left text-xs text-slate-300"><thead className="bg-slate-900/50 text-[10px] uppercase text-slate-400"><tr><th className="px-4 py-3">Empresa</th><th className="px-4 py-3">Código</th><th className="px-4 py-3">Local</th><th className="px-4 py-3">Cidade</th><th className="px-4 py-3">Acessos</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Ações</th></tr></thead><tbody className="divide-y divide-slate-700/70">{filteredPlates.map((plate) => <tr key={plate.id} className={`hover:bg-slate-700/30 ${selectedPlate?.id === plate.id ? "bg-slate-700/20" : ""}`}><td className="px-4 py-3"><button onClick={() => { setSelectedPlate(plate); setCreatedUrls(null); }} className="font-bold text-white hover:text-gold-300 text-left">{plate.businesses?.name || plate.name}</button><div className="text-[10px] text-slate-500">{plate.businesses?.category || "—"}</div></td><td className="px-4 py-3 font-mono text-gold-400">{plate.code}</td><td className="px-4 py-3">{plate.location}</td><td className="px-4 py-3">{[plate.businesses?.city, plate.businesses?.state].filter(Boolean).join(" / ") || "—"}</td><td className="px-4 py-3 font-bold text-white">{plate.access_count ?? 0}</td><td className="px-4 py-3"><span className={`inline-flex px-2 py-1 rounded-full border text-[10px] font-bold ${statusClass[plate.status]}`}>{statusLabel[plate.status]}</span></td><td className="px-4 py-3"><div className="flex justify-end gap-1.5"><button onClick={() => startEditing(plate)} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white" title="Editar"><Pencil className="w-3.5 h-3.5" /></button><a href={`${previewBase}/t/${plate.code}?src=direct`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white" title="Testar"><ExternalLink className="w-3.5 h-3.5" /></a></div></td></tr>)}</tbody></table></div>}
      </section>

      {editing && selectedPlate && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex justify-end" onMouseDown={(e) => { if (e.currentTarget === e.target) setEditing(false); }}>
          <aside className="w-full max-w-xl h-full overflow-y-auto bg-slate-900 border-l border-slate-700 shadow-2xl p-6">
            <div className="flex items-start justify-between gap-4 mb-6"><div><div className="text-[10px] uppercase font-bold text-gold-400">Editar placa</div><h2 className="text-xl font-black text-white mt-1">{selectedPlate.code}</h2><p className="text-xs text-slate-400 mt-1">Altere os dados sem regravar o NFC ou trocar o QR.</p></div><button onClick={() => setEditing(false)} className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"><X className="w-4 h-4" /></button></div>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div><label className="block text-xs font-bold text-slate-300 mb-1">Empresa</label><div className="relative"><Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" /><input required value={editBusinessName} onChange={(e) => setEditBusinessName(e.target.value)} className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl bg-slate-800 border border-slate-700 text-white" /></div></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><div><label className="block text-xs font-bold text-slate-300 mb-1">Segmento</label><input required value={editCategory} onChange={(e) => setEditCategory(e.target.value)} className="w-full px-3 py-2.5 text-sm rounded-xl bg-slate-800 border border-slate-700 text-white" /></div><div><label className="block text-xs font-bold text-slate-300 mb-1">Local da placa</label><input required value={editLocation} onChange={(e) => setEditLocation(e.target.value)} className="w-full px-3 py-2.5 text-sm rounded-xl bg-slate-800 border border-slate-700 text-white" /></div></div>
              <div className="grid grid-cols-[1fr_90px] gap-3"><div><label className="block text-xs font-bold text-slate-300 mb-1">Cidade</label><input value={editCity} onChange={(e) => setEditCity(e.target.value)} className="w-full px-3 py-2.5 text-sm rounded-xl bg-slate-800 border border-slate-700 text-white" /></div><div><label className="block text-xs font-bold text-slate-300 mb-1">UF</label><input maxLength={2} value={editState} onChange={(e) => setEditState(e.target.value.toUpperCase())} className="w-full px-3 py-2.5 text-sm rounded-xl bg-slate-800 border border-slate-700 text-white uppercase" /></div></div>
              <div><label className="block text-xs font-bold text-slate-300 mb-1">Link de avaliação Google</label><input type="url" required value={editGoogleUrl} onChange={(e) => setEditGoogleUrl(e.target.value)} className="w-full px-3 py-2.5 text-xs font-mono rounded-xl bg-slate-800 border border-slate-700 text-white" /><p className="text-[10px] text-emerald-300 mt-1">Você pode trocar este link sem alterar a placa física.</p></div>
              <div><label className="block text-xs font-bold text-slate-300 mb-1">Status</label><select value={editStatus} onChange={(e) => setEditStatus(e.target.value as DeviceStatus)} className="w-full px-3 py-2.5 text-sm rounded-xl bg-slate-800 border border-slate-700 text-white"><option value="active">Ativa</option><option value="pending">Pendente</option><option value="inactive">Inativa</option><option value="suspended">Suspensa</option></select></div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-700 text-[11px] text-slate-400"><strong className="text-white">Código permanente:</strong> <span className="font-mono text-gold-400">{selectedPlate.code}</span><br />O código e os links NFC/QR não mudam ao editar os dados.</div>
              <div className="grid grid-cols-2 gap-2 pt-2"><button type="button" onClick={() => setEditing(false)} className="py-2.5 rounded-xl bg-slate-700 text-white text-xs font-bold">Cancelar</button><button type="submit" disabled={savingEdit} className="py-2.5 rounded-xl bg-gold-500 text-navy-950 text-xs font-black flex items-center justify-center gap-2 disabled:opacity-50">{savingEdit ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}{savingEdit ? "Salvando..." : "Salvar alterações"}</button></div>
            </form>
          </aside>
        </div>
      )}
    </div>
  );
}
