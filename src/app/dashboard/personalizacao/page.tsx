"use client";

import React, { useState } from "react";
import { Palette, Save, CheckCircle2, Sparkles, Image as ImageIcon } from "lucide-react";
import { DEMO_BUSINESS } from "@/lib/mock-data";

export default function PersonalizacaoPage() {
  const [primaryColor, setPrimaryColor] = useState(DEMO_BUSINESS.primary_color);
  const [secondaryColor, setSecondaryColor] = useState(DEMO_BUSINESS.secondary_color);
  const [logoUrl, setLogoUrl] = useState(DEMO_BUSINESS.logo_url || "");
  const [coverUrl, setCoverUrl] = useState(DEMO_BUSINESS.cover_url || "");
  const [saved, setSaved] = useState(false);

  const presets = [
    { name: "Navy & Ouro Suave (Padrão)", primary: "#0F2744", secondary: "#D4AF37" },
    { name: "Esmeralda & Champagne", primary: "#064E3B", secondary: "#F59E0B" },
    { name: "Vinho Nobre & Rose", primary: "#881337", secondary: "#FB7185" },
    { name: "Grafite Moderno & Azul Elétrico", primary: "#0F172A", secondary: "#38BDF8" },
    { name: "Café Especial & Caramelo", primary: "#3E2723", secondary: "#D7CCC8" },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <span className="text-xs font-bold text-navy-800 uppercase tracking-wider bg-navy-50 px-2.5 py-1 rounded-md border border-navy-200">
            Identidade Visual
          </span>
          <h1 className="text-2xl font-black text-navy-950 mt-1">
            Personalização & Tema da Página
          </h1>
          <p className="text-xs text-slate-500">
            Adapte as cores, tipografia e imagens para refletir com exatidão a marca do seu negócio.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-navy-950 hover:bg-navy-900 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-95"
        >
          <Save className="w-4 h-4 text-gold-400" />
          <span>Salvar Tema</span>
        </button>
      </div>

      {saved && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Cores e imagens atualizadas com sucesso!</span>
        </div>
      )}

      {/* Paletas Pré-definidas */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <h2 className="text-sm font-bold text-navy-950 mb-1">
          Paletas de Cores Recomendadas
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          Selecione uma combinação profissional ou escolha cores manuais abaixo.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {presets.map((p, idx) => (
            <div
              key={idx}
              onClick={() => {
                setPrimaryColor(p.primary);
                setSecondaryColor(p.secondary);
              }}
              className="p-3.5 rounded-2xl border border-slate-200 hover:border-slate-400 cursor-pointer transition-all flex items-center justify-between"
            >
              <div className="text-xs font-bold text-navy-950">{p.name}</div>
              <div className="flex items-center gap-1.5">
                <div
                  className="w-5 h-5 rounded-full border border-slate-200"
                  style={{ backgroundColor: p.primary }}
                />
                <div
                  className="w-5 h-5 rounded-full border border-slate-200"
                  style={{ backgroundColor: p.secondary }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Formulário Manual */}
      <form onSubmit={handleSave} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
              Cor Primária (Fundo dos headers e botões)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-12 h-12 rounded-xl cursor-pointer border-0"
              />
              <span className="font-mono text-xs font-bold text-slate-800">
                {primaryColor}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
              Cor Secundária (Destaques e selos)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="w-12 h-12 rounded-xl cursor-pointer border-0"
              />
              <span className="font-mono text-xs font-bold text-slate-800">
                {secondaryColor}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              URL da Logomarca (PNG ou SVG transparente)
            </label>
            <input
              type="url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-800 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              URL da Imagem de Capa do Estabelecimento
            </label>
            <input
              type="url"
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-800 focus:outline-none"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
