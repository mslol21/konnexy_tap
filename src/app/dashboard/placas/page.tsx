"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { Download, ExternalLink, Loader2, MapPin, QrCode, Radio } from "lucide-react";

type Device = {
  id: string;
  business_id: string;
  code: string;
  name: string;
  type: string;
  location: string;
  active: boolean;
  status: "pending" | "active" | "inactive" | "suspended";
  destination_url?: string | null;
  destination_type: string;
  experience_mode?: "direct_review" | "smart_page";
  created_at: string;
};

type AccountPayload = {
  business: { id: string; name: string };
  devices: Device[];
};

const statusLabel: Record<Device["status"], string> = {
  active: "Ativa",
  pending: "Pendente",
  inactive: "Inativa",
  suspended: "Suspensa",
};

export default function MerchantPlatesPage() {
  const [data, setData] = useState<AccountPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
    fetch("/api/dashboard/account", { cache: "no-store" })
      .then(async (response) => {
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload.error || "Não foi possível carregar as placas.");
        return payload as AccountPayload;
      })
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const devices = useMemo(() => data?.devices ?? [], [data]);

  const downloadQrCode = (device: Device) => {
    const svg = document.getElementById("merchant-qr-" + device.code);
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const image = new Image();

    image.onload = () => {
      canvas.width = 1000;
      canvas.height = 1120;
      if (!context) return;
      context.fillStyle = "#FFFFFF";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 100, 80, 800, 800);
      context.fillStyle = "#20252A";
      context.textAlign = "center";
      context.font = "bold 30px sans-serif";
      context.fillText(data?.business.name || "Otimiza Meu Negócio", 500, 960);
      context.font = "22px monospace";
      context.fillText(device.code, 500, 1005);
      context.font = "bold 18px sans-serif";
      context.fillStyle = "#C78D4E";
      context.fillText("OTIMIZA MEU NEGÓCIO", 500, 1050);

      const link = document.createElement("a");
      link.download = "otimiza-qr-" + device.code + ".png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };

    image.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  if (loading) {
    return <div className="py-20 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#C78D4E]" /></div>;
  }

  return (
    <div className="space-y-5">
      <section className="bg-white p-4 sm:p-6 rounded-3xl border border-[#E8E3DD] shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-[#6D7277] uppercase tracking-wider">
          <Radio className="w-4 h-4 text-[#C78D4E]" />
          Hardware vinculado
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#20252A] mt-2">Minhas placas NFC & QR Code</h1>
        <p className="text-xs text-[#6D7277] mt-1 max-w-2xl">
          Consulte seus códigos e QR Codes. Alterações de cadastro, ativação ou destino são controladas com segurança pela equipe.
        </p>
      </section>

      {devices.length === 0 ? (
        <section className="bg-white p-8 rounded-3xl border border-[#E8E3DD] text-center">
          <QrCode className="w-9 h-9 text-[#C78D4E] mx-auto mb-3" />
          <h2 className="font-bold text-[#20252A]">Nenhuma placa vinculada</h2>
          <p className="text-xs text-[#6D7277] mt-1">Assim que sua placa for configurada, ela aparecerá automaticamente aqui.</p>
        </section>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {devices.map((device) => {
            const base = origin || "https://otimizameunegocio.vercel.app";
            const publicUrl = base + "/t/" + device.code + "?src=qr";

            return (
              <article key={device.id} className="bg-white rounded-3xl border border-[#E8E3DD] p-4 sm:p-5 shadow-sm min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[10px] uppercase font-bold text-[#6D7277]">Placa</div>
                    <h2 className="font-black text-[#20252A] truncate">{device.name}</h2>
                    <div className="font-mono text-sm font-bold text-[#C78D4E] mt-1">{device.code}</div>
                  </div>
                  <span className={"shrink-0 px-2.5 py-1 rounded-full text-[10px] font-black " +
                    (device.status === "active" ? "bg-emerald-100 text-emerald-800" :
                    device.status === "suspended" ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-800")}>
                    {statusLabel[device.status]}
                  </span>
                </div>

                <div className="mt-3 flex items-start gap-2 text-xs text-[#6D7277]">
                  <MapPin className="w-4 h-4 text-[#C78D4E] shrink-0 mt-0.5" />
                  <span>{device.location}</span>
                </div>

                <div className="mt-4 rounded-2xl bg-[#F7F5F2] border border-[#E8E3DD] p-4 flex flex-col items-center">
                  <div className="bg-white p-3 rounded-xl border border-[#E8E3DD]">
                    <QRCodeSVG id={"merchant-qr-" + device.code} value={publicUrl} size={150} level="H" includeMargin={false} />
                  </div>
                  <div className="mt-2 text-[10px] text-[#6D7277] font-mono break-all text-center">{publicUrl}</div>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Link
                    href={"/t/" + device.code + "?src=direct"}
                    target="_blank"
                    className="min-h-11 px-3 py-2.5 rounded-xl bg-[#F5F3EF] border border-[#E8E3DD] text-[#20252A] text-xs font-bold flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4 text-[#C78D4E]" />
                    Testar
                  </Link>
                  <button
                    type="button"
                    onClick={() => downloadQrCode(device)}
                    className="min-h-11 px-3 py-2.5 rounded-xl bg-[#20252A] text-white text-xs font-bold flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4 text-[#D8A66C]" />
                    Baixar QR
                  </button>
                </div>

                <div className="mt-3 text-[10px] text-[#6D7277]">
                  Modo: <strong>{device.experience_mode === "smart_page" ? "Página inteligente" : "Avaliação Google direta"}</strong>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
