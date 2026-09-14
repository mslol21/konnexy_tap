"use client";

import React, { useState } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import {
  Radio,
  ArrowLeft,
  Sparkles,
  Smartphone,
  CheckCircle2,
  ExternalLink,
  QrCode,
  Star,
  Zap,
} from "lucide-react";
import { DEMO_DEVICE } from "@/lib/mock-data";

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState<"nfc" | "qr">("nfc");
  const [simulating, setSimulating] = useState(false);
  const [simulatedSuccess, setSimulatedSuccess] = useState(false);

  const testNfcUrl = `/t/${DEMO_DEVICE.code}?src=nfc`;
  const testQrUrl = `/t/${DEMO_DEVICE.code}?src=qr`;

  const handleSimulateTap = () => {
    setSimulating(true);
    setTimeout(() => {
      setSimulating(false);
      setSimulatedSuccess(true);
      // Abre o redirecionamento real
      window.open(testNfcUrl, "_blank", "noopener,noreferrer");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Barra Superior do Vendedor */}
      <header className="bg-navy-950/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Voltar"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[10px] font-black uppercase tracking-wider text-gold-400">
                  Modo de Demonstração Comercial
                </span>
              </div>
              <h1 className="text-xs sm:text-sm font-bold text-white">
                Konnexy Tap Reviews • Apresentação Presencial
              </h1>
            </div>
          </div>

          <Link
            href="/"
            className="px-3 py-1.5 bg-gold-500 hover:bg-gold-400 text-navy-950 text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1 shrink-0"
          >
            <span>Reservar Placa</span>
            <Sparkles className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Dica para o Vendedor */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2.5 text-center text-xs text-amber-200">
        💡 <strong>Roteiro de 15 segundos para o comerciante:</strong> Mostre esta tela, aperte <em>&quot;Simular Aproximação&quot;</em> e veja a tela oficial do Google Reviews abrindo instantaneamente!
      </div>

      {/* Conteúdo Principal */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-sm space-y-5">
          {/* Identificação da Empresa Fictícia */}
          <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 text-center space-y-1">
            <div className="text-[10px] uppercase font-bold text-gold-400 tracking-wider">
              Empresa Modelo de Demonstração
            </div>
            <div className="text-base font-black text-white">
              Café Exemplo (Demonstração Comercial)
            </div>
            <div className="text-xs text-slate-400">
              Placa Balcão • Código: <span className="font-mono text-gold-300 font-bold">{DEMO_DEVICE.code}</span>
            </div>
          </div>

          {/* Abas NFC vs QR */}
          <div className="flex bg-slate-900 rounded-2xl p-1 border border-slate-800">
            <button
              onClick={() => setActiveTab("nfc")}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "nfc"
                  ? "bg-gold-500 text-navy-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Simular NFC</span>
            </button>
            <button
              onClick={() => setActiveTab("qr")}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "qr"
                  ? "bg-gold-500 text-navy-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Ver QR Code</span>
            </button>
          </div>

          {/* Card da Demonstração */}
          {activeTab === "nfc" ? (
            <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 text-center space-y-5 shadow-2xl">
              {/* Placa Simulação */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-navy-950 to-slate-900 border-2 border-slate-700 text-white space-y-3 relative overflow-hidden">
                <div className="w-12 h-12 rounded-2xl bg-gold-500/20 text-gold-400 flex items-center justify-center mx-auto">
                  <Radio className="w-6 h-6 animate-pulse" />
                </div>
                <div className="flex justify-center gap-1 text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <div className="text-sm font-black text-white">
                  Avalie no Google
                </div>
                <div className="text-[11px] text-slate-300">
                  Aproxime o celular da placa
                </div>
                <div className="text-[9px] font-mono text-slate-500">
                  {DEMO_DEVICE.code}
                </div>
              </div>

              {/* Botão de Disparo */}
              <button
                onClick={handleSimulateTap}
                disabled={simulating}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                {simulating ? (
                  <span>Conectando ao Google Reviews...</span>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-gold-300" />
                    <span>Simular Aproximação do Celular</span>
                  </>
                )}
              </button>

              {simulatedSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold rounded-xl animate-in fade-in">
                  ✓ A tela de 5 estrelas do Google foi aberta em nova aba!
                </div>
              )}

              <div className="text-[11px] text-slate-400 leading-relaxed text-left space-y-1 pt-1">
                <div>• O cliente não instala nenhum app.</div>
                <div>• Vai direto para o formulário oficial do Google.</div>
                <div>• Registra o acesso server-side sem intermediários visuais.</div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 text-center space-y-4 shadow-2xl">
              <div className="p-6 bg-white rounded-2xl flex flex-col items-center justify-center text-navy-950">
                <QRCodeSVG
                  value={`https://tap.konnexy.com.br/t/${DEMO_DEVICE.code}?src=qr`}
                  size={190}
                  level="H"
                />
                <span className="text-[10px] font-mono font-bold text-slate-500 mt-2">
                  tap.konnexy.com.br/t/{DEMO_DEVICE.code}?src=qr
                </span>
              </div>

              <div className="text-xs text-slate-300">
                Aponte a câmera do seu celular para testar a leitura rápida do QR Code físico.
              </div>

              <a
                href={testQrUrl}
                target="_blank"
                className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Abrir Destino do QR Code</span>
              </a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
