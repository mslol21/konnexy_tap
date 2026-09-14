"use client";

import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Download, QrCode, Sparkles, Printer, Check, Copy } from "lucide-react";
import { DEMO_DEVICES } from "@/lib/mock-data";
import { TapDevice } from "@/lib/types";

export default function QrCodePage() {
  const [selectedDevice, setSelectedDevice] = useState<TapDevice>(DEMO_DEVICES[0]);
  const [fgColor, setFgColor] = useState("#0F2744");
  const [copied, setCopied] = useState(false);

  const publicUrl = `https://tap.konnexy.com.br/t/${selectedDevice.code}?src=qr`;

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadHighResPng = () => {
    const svg = document.getElementById("qr-canvas-preview");
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

        // Moldura elegante
        ctx.strokeStyle = "#E2E8F0";
        ctx.lineWidth = 4;
        ctx.strokeRect(60, 60, 1080, 1280);

        // Header
        ctx.font = "bold 46px sans-serif";
        ctx.fillStyle = fgColor;
        ctx.textAlign = "center";
        ctx.fillText("APROXIME SEU CELULAR OU LEIA O QR CODE", 600, 160);

        // QR Code
        ctx.drawImage(img, 200, 240, 800, 800);

        // Informações da placa
        ctx.font = "bold 32px sans-serif";
        ctx.fillStyle = "#0F2744";
        ctx.fillText(`Konnexy Tap • ${selectedDevice.location}`, 600, 1120);

        ctx.font = "24px sans-serif";
        ctx.fillStyle = "#64748B";
        ctx.fillText(`Código NFC: ${selectedDevice.code} • tap.konnexy.com.br/t/${selectedDevice.code}`, 600, 1170);

        ctx.font = "italic 22px sans-serif";
        ctx.fillStyle = "#D4AF37";
        ctx.fillText("Um toque conecta seu cliente ao seu negócio.", 600, 1240);

        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `display-konnexy-${selectedDevice.code}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };

    img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <span className="text-xs font-bold text-navy-800 uppercase tracking-wider bg-navy-50 px-2.5 py-1 rounded-md border border-navy-200">
            Material Gráfico & Impressão
          </span>
          <h1 className="text-2xl font-black text-navy-950 mt-1">
            Central de QR Codes para Balcão e Mesas
          </h1>
          <p className="text-xs text-slate-500">
            Gere o QR Code em altíssima definição (1200x1400px) com o layout pronto para enviar à sua gráfica ou imprimir na sua loja.
          </p>
        </div>

        <button
          onClick={downloadHighResPng}
          className="px-5 py-2.5 bg-navy-950 hover:bg-navy-900 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-95"
        >
          <Download className="w-4 h-4 text-gold-400" />
          <span>Baixar Arquivo para Impressão (PNG)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controles do QR Code */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Selecione a Placa / Localização
            </label>
            <select
              value={selectedDevice.id}
              onChange={(e) => {
                const found = DEMO_DEVICES.find((d) => d.id === e.target.value);
                if (found) setSelectedDevice(found);
              }}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-800 focus:outline-none bg-white font-medium"
            >
              {DEMO_DEVICES.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.location}) — Código: {d.code}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Cor dos Módulos do QR Code
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="w-10 h-10 rounded-xl cursor-pointer border-0"
              />
              <span className="font-mono text-xs font-bold text-slate-700">
                {fgColor} (Recomendado: cores escuras para contraste máximo)
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              URL Vinculada
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={publicUrl}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 font-mono text-slate-700"
              />
              <button
                onClick={handleCopy}
                className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copiado!" : "Copiar"}</span>
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1.5">
            <div className="font-bold flex items-center gap-1.5">
              <Printer className="w-4 h-4 text-amber-600" />
              Dicas para o Comerciante:
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              • Posicione a placa física ou display na altura dos olhos do cliente próximo à máquina de cartão ou no centro da mesa.
              <br />
              • O QR Code impresso é uma garantia de 100% de compatibilidade para celulares sem NFC ou com o sensor desativado.
            </p>
          </div>
        </div>

        {/* Display do Poster / Display de Mesa */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="bg-white p-8 rounded-3xl border-2 border-slate-200 shadow-xl w-full max-w-sm flex flex-col items-center text-center">
            <div className="text-[11px] font-black uppercase tracking-widest text-navy-950 mb-1">
              Aproxime seu celular ou leia o QR Code
            </div>
            <div className="text-[10px] text-gold-600 font-bold mb-5">
              Conecte-se em 1 toque ao nosso balcão
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 shadow-2xs">
              <QRCodeSVG
                id="qr-canvas-preview"
                value={publicUrl}
                size={220}
                level="H"
                fgColor={fgColor}
                includeMargin={false}
              />
            </div>

            <div className="mt-5 space-y-1">
              <div className="text-sm font-black text-navy-950">
                {selectedDevice.location}
              </div>
              <div className="text-[11px] font-mono text-slate-500">
                Placa: {selectedDevice.code}
              </div>
              <div className="text-[10px] text-slate-400">
                Powered by Otimiza Meu Negócio
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
