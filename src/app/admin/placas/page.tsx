"use client";

import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Radio,
  Plus,
  QrCode,
  Download,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { DEMO_DEVICES } from "@/lib/mock-data";
import { TapDevice, DeviceStatus } from "@/lib/types";
import { generateDeviceCode, validateDestinationUrl } from "@/lib/security";

export default function AdminPlacasPage() {
  const [devices, setDevices] = useState<TapDevice[]>(DEMO_DEVICES);
  const [selectedDevice, setSelectedDevice] = useState<TapDevice>(devices[0]);

  // Formulário de Cadastro Rápido (< 1 minuto)
  const [businessName, setBusinessName] = useState("");
  const [location, setLocation] = useState("Balcão Principal");
  const [code, setCode] = useState(generateDeviceCode());
  const [googleUrl, setGoogleUrl] = useState("");
  const [status, setStatus] = useState<DeviceStatus>("active");
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [createdSuccess, setCreatedSuccess] = useState(false);

  const nfcUrl = `https://tap.konnexy.com.br/t/${code}?src=nfc`;
  const qrUrl = `https://tap.konnexy.com.br/t/${code}?src=qr`;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(label);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleRegenerateCode = () => {
    setCode(generateDeviceCode());
  };

  const handleCreatePlate = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validação da URL do Google Reviews
    const validation = validateDestinationUrl(googleUrl, "google_review");
    if (!validation.isValid) {
      setValidationError(validation.error || "URL de avaliação do Google inválida.");
      return;
    }

    const newDev: TapDevice = {
      id: `dev-${Date.now()}`,
      business_id: "biz-cafe-ana",
      code: code.toUpperCase().trim(),
      name: `Placa ${businessName || "Comércio"}`,
      type: "nfc_plate",
      location,
      active: status === "active",
      status,
      destination_url: validation.sanitizedUrl,
      destination_type: "google_review",
      created_at: new Date().toISOString(),
    };

    setDevices([newDev, ...devices]);
    setSelectedDevice(newDev);
    setCreatedSuccess(true);
    setTimeout(() => setCreatedSuccess(false), 3000);

    // Prepara próximo código
    setCode(generateDeviceCode());
    setBusinessName("");
    setGoogleUrl("");
  };

  const downloadQrCodePng = (dev: TapDevice) => {
    const svg = document.getElementById(`qr-svg-${dev.code}`);
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = 1200;
      canvas.height = 1400;
      if (ctx) {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Moldura limpa
        ctx.strokeStyle = "#CBD5E1";
        ctx.lineWidth = 4;
        ctx.strokeRect(60, 60, 1080, 1280);

        // Header
        ctx.font = "bold 44px sans-serif";
        ctx.fillStyle = "#0F2744";
        ctx.textAlign = "center";
        ctx.fillText("AVALIE NOSSA EMPRESA NO GOOGLE", 600, 160);

        ctx.font = "24px sans-serif";
        ctx.fillStyle = "#64748B";
        ctx.fillText("Aproxime seu celular da placa ou leia o QR Code", 600, 210);

        // QR Code
        ctx.drawImage(img, 200, 260, 800, 800);

        // Footer
        ctx.font = "bold 32px sans-serif";
        ctx.fillStyle = "#0F2744";
        ctx.fillText(`${dev.name} • ${dev.location}`, 600, 1140);

        ctx.font = "mono 24px sans-serif";
        ctx.fillStyle = "#64748B";
        ctx.fillText(`tap.konnexy.com.br/t/${dev.code}?src=qr`, 600, 1190);

        ctx.font = "bold 20px sans-serif";
        ctx.fillStyle = "#94A3B8";
        ctx.fillText("Konnexy Tap • CONEXÕES QUE GERAM RESULTADOS", 600, 1235);

        const pngFile = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.download = `placa-konnexy-${dev.code}.png`;
        a.href = pngFile;
        a.click();
      }
    };

    img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/80 p-6 rounded-3xl border border-slate-700 shadow-xs">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            Operação de Ativação Rápida
          </span>
          <h1 className="text-2xl font-black text-white mt-0.5">
            Configuração de Placas (&lt; 1 Minuto)
          </h1>
          <p className="text-xs text-slate-300">
            Cadastre o código NFC, informe o link oficial do Google Reviews do comércio e gere os links e QR Code imediatamente.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-gold-400">
            Total no Lote: {devices.length} placas
          </span>
        </div>
      </div>

      {createdSuccess && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Placa cadastrada com sucesso! Links gerados e prontos para gravação no chip NFC e impressão do QR Code.</span>
        </div>
      )}

      {/* Grid: Formulário Rápido à Esquerda + Visualizador de Placa à Direita */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Formulário de Cadastro Rápido (< 1 min) */}
        <div className="lg:col-span-6 bg-slate-800/80 p-6 rounded-3xl border border-slate-700 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-700">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-gold-400" />
              Cadastrar Nova Placa
            </h2>
            <span className="text-[10px] text-slate-400">Tempo estimado: 45s</span>
          </div>

          {validationError && (
            <div className="p-3 bg-rose-500/20 border border-rose-500/40 text-rose-200 rounded-xl text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          <form onSubmit={handleCreatePlate} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Nome da Empresa / Cliente *
              </label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Ex: Barbearia Dom Pedro"
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-300 uppercase">
                    Código da Placa *
                  </label>
                  <button
                    type="button"
                    onClick={handleRegenerateCode}
                    className="text-[10px] text-gold-400 hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-2.5 h-2.5" />
                    Gerar Outro
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2 text-xs font-mono font-black rounded-xl bg-slate-900 border border-slate-700 text-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-500 uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Localização Física
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                >
                  <option>Balcão Principal</option>
                  <option>Caixa / Checkout</option>
                  <option>Recepção</option>
                  <option>Mesa 1</option>
                  <option>Mesa 2</option>
                  <option>Porta de Saída</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Link de Avaliação Google (Perfil da Empresa) *
              </label>
              <input
                type="url"
                required
                value={googleUrl}
                onChange={(e) => setGoogleUrl(e.target.value)}
                placeholder="https://search.google.com/local/writereview?placeid=..."
                className="w-full px-3.5 py-2 text-xs font-mono rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Copie do Perfil da Empresa no Google $\rightarrow$ “Pedir avaliações”. Deve pertencer aos domínios oficiais do Google.
              </p>
            </div>

            {/* Prévia das URLs que serão geradas */}
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400">URL para gravar no chip NFC:</span>
                <span className="text-[10px] text-emerald-400 font-bold">Nunca grava Google direto</span>
              </div>
              <div className="font-mono text-[11px] text-gold-300 break-all">
                {nfcUrl}
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400">URL para imprimir no QR Code:</span>
              </div>
              <div className="font-mono text-[11px] text-gold-300 break-all">
                {qrUrl}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gold-500 hover:bg-gold-400 text-navy-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Validar Destino e Ativar Placa</span>
            </button>
          </form>
        </div>

        {/* Visualizador & Ações da Placa Selecionada */}
        <div className="lg:col-span-6 bg-slate-800/80 p-6 rounded-3xl border border-slate-700 space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-700">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Placa Selecionada:</span>
              <h2 className="text-base font-black text-white">{selectedDevice.name}</h2>
            </div>
            <span
              className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                selectedDevice.status === "active" || selectedDevice.active
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
              }`}
            >
              {selectedDevice.status || "Ativa"}
            </span>
          </div>

          {/* QR Code Canvas */}
          <div className="p-6 bg-white rounded-2xl flex flex-col items-center justify-center text-slate-900 shadow-md">
            <QRCodeSVG
              id={`qr-svg-${selectedDevice.code}`}
              value={`https://tap.konnexy.com.br/t/${selectedDevice.code}?src=qr`}
              size={180}
              level="H"
            />
            <div className="mt-3 text-center">
              <div className="text-xs font-black text-navy-950 font-mono">
                {selectedDevice.code}
              </div>
              <div className="text-[10px] text-slate-500">
                {selectedDevice.location}
              </div>
            </div>
          </div>

          {/* Ações de Cópia & Teste */}
          <div className="space-y-2">
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 flex items-center justify-between gap-2">
              <div className="truncate">
                <div className="text-[10px] font-bold uppercase text-slate-400">Link para Gravação NFC:</div>
                <div className="font-mono text-xs text-white truncate">
                  https://tap.konnexy.com.br/t/{selectedDevice.code}?src=nfc
                </div>
              </div>
              <button
                onClick={() =>
                  handleCopy(
                    `https://tap.konnexy.com.br/t/${selectedDevice.code}?src=nfc`,
                    "nfc"
                  )
                }
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-lg text-slate-200 flex items-center gap-1 shrink-0"
              >
                {copiedUrl === "nfc" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedUrl === "nfc" ? "Copiado!" : "Copiar"}</span>
              </button>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <a
                href={`/t/${selectedDevice.code}?src=nfc`}
                target="_blank"
                className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Testar Redirecionamento</span>
              </a>

              <button
                onClick={() => downloadQrCodePng(selectedDevice)}
                className="flex-1 py-2.5 bg-gold-500 hover:bg-gold-400 text-navy-950 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Baixar QR Code PNG</span>
              </button>
            </div>
          </div>

          {/* Lista de Placas Cadastradas para Alternar */}
          <div className="pt-2 border-t border-slate-700">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-2">
              Trocar de placa para visualizar:
            </span>
            <div className="flex flex-wrap gap-2">
              {devices.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDevice(d)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                    selectedDevice.id === d.id
                      ? "bg-gold-500 text-navy-950"
                      : "bg-slate-900 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  {d.code}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
