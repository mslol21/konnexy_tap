"use client";

import React, { useState } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import {
  Radio,
  Plus,
  QrCode,
  Download,
  ExternalLink,
  MapPin,
  CheckCircle2,
  Trash2,
  Sparkles,
} from "lucide-react";
import { DEMO_DEVICES } from "@/lib/mock-data";
import { TapDevice } from "@/lib/types";

export default function PlacasPage() {
  const [devices, setDevices] = useState<TapDevice[]>(DEMO_DEVICES);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCode, setNewCode] = useState("");
  const [newLocation, setNewLocation] = useState("Balcão");
  const [newType, setNewType] = useState<"nfc_plate" | "nfc_sticker" | "qr_stand">("nfc_plate");

  const [selectedDeviceForQr, setSelectedDeviceForQr] = useState<TapDevice | null>(devices[0]);

  const handleAddDevice = (e: React.FormEvent) => {
    e.preventDefault();
    const createdDevice: TapDevice = {
      id: `dev-${Date.now()}`,
      business_id: "biz-cafe-ana",
      code: newCode.toUpperCase() || `KX-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newName || "Nova Placa NFC",
      type: newType,
      location: newLocation,
      active: true,
      status: "active",
      destination_url: "https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4",
      destination_type: "google_review",
      created_at: new Date().toISOString(),
    };

    setDevices([...devices, createdDevice]);
    setShowAddModal(false);
    setNewName("");
    setNewCode("");
  };

  const toggleDeviceActive = (id: string) => {
    setDevices(
      devices.map((d) => (d.id === id ? { ...d, active: !d.active } : d))
    );
  };

  const downloadQrCode = (device: TapDevice) => {
    const svg = document.getElementById(`qr-svg-${device.code}`);
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = 1000;
      canvas.height = 1000;
      if (ctx) {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 100, 100, 800, 800);

        // Adicionar texto abaixo para gráfica
        ctx.font = "bold 32px sans-serif";
        ctx.fillStyle = "#0F2744";
        ctx.textAlign = "center";
        ctx.fillText(`Konnexy Tap • Placa ${device.code} (${device.location})`, 500, 950);

        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `konnexy-tap-${device.code}.png`;
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
            Hardware Físico Conectado
          </span>
          <h1 className="text-2xl font-black text-navy-950 mt-1">
            Minhas Placas NFC & QR Codes
          </h1>
          <p className="text-xs text-slate-500">
            Cada placa física possui um código único e pode ser posicionada em locais estratégicos como balcão, mesas ou caixa.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-navy-950 hover:bg-navy-900 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="w-4 h-4 text-gold-400" />
            <span>Cadastrar Nova Placa</span>
          </button>
        </div>
      </div>

      {/* Grid de Placas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devices.map((dev) => {
          const publicUrl = `https://tap.konnexy.com.br/t/${dev.code}`;

          return (
            <div
              key={dev.id}
              className={`bg-white rounded-3xl border p-6 shadow-xs flex flex-col justify-between transition-all ${
                dev.active ? "border-slate-200 hover:border-slate-300" : "border-slate-200 opacity-60 bg-slate-50"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-navy-900 text-gold-400 flex items-center justify-center font-bold">
                    <Radio className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        dev.active
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {dev.active ? "Ativa no Balcão" : "Desativada"}
                    </span>
                    <input
                      type="checkbox"
                      checked={dev.active}
                      onChange={() => toggleDeviceActive(dev.id)}
                      className="rounded text-navy-950 focus:ring-navy-800"
                    />
                  </div>
                </div>

                <h3 className="text-base font-bold text-navy-950">{dev.name}</h3>

                <div className="mt-2 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>Localização: <strong>{dev.location}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-navy-700" />
                    <span>Código da Placa: <strong className="font-mono text-navy-900">{dev.code}</strong></span>
                  </div>
                </div>

                {/* QR Code Preview */}
                <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col items-center">
                  <div className="bg-white p-2.5 rounded-xl shadow-xs border border-slate-200">
                    <QRCodeSVG
                      id={`qr-svg-${dev.code}`}
                      value={publicUrl}
                      size={130}
                      level="H"
                      includeMargin={false}
                    />
                  </div>
                  <span className="text-[10px] text-slate-600 font-mono mt-2 truncate max-w-full">
                    {publicUrl}
                  </span>
                </div>
              </div>

              {/* Ações da Placa */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <Link
                  href={`/t/${dev.code}`}
                  target="_blank"
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-navy-950 text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Testar URL</span>
                </Link>

                <button
                  onClick={() => downloadQrCode(dev)}
                  className="px-3 py-1.5 rounded-lg bg-navy-950 hover:bg-navy-900 text-white text-xs font-bold transition-all flex items-center gap-1"
                >
                  <Download className="w-3 h-3 text-gold-400" />
                  <span>Baixar PNG</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Cadastro de Nova Placa */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 p-6 text-slate-900">
            <h3 className="text-lg font-bold text-navy-950 mb-1">
              Cadastrar Nova Placa ou Adesivo NFC
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Vincule uma nova placa física já fornecida pela Konnexy Tap ou reserve um código.
            </p>

            <form onSubmit={handleAddDevice} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Nome Identificador
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ex: Placa Mesa 03"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Código da Placa (Gravado no Chip NFC)
                </label>
                <input
                  type="text"
                  required
                  maxLength={10}
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="Ex: A7K92"
                  className="w-full px-3.5 py-2 text-xs font-mono font-bold uppercase rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Localização Física
                </label>
                <select
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-800 focus:outline-none bg-white"
                >
                  <option>Balcão de Atendimento</option>
                  <option>Mesa 1</option>
                  <option>Mesa 2</option>
                  <option>Mesa 3</option>
                  <option>Caixa / Checkout</option>
                  <option>Recepção</option>
                  <option>Salão Externo</option>
                  <option>Porta de Saída</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Tipo de Hardware
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-800 focus:outline-none bg-white"
                >
                  <option value="nfc_plate">Placa Acrílica NFC com Suporte</option>
                  <option value="nfc_sticker">Adesivo Resinada NFC</option>
                  <option value="qr_stand">Display de Mesa com QR Code</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-navy-950"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-navy-950 hover:bg-navy-900 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Salvar Placa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
