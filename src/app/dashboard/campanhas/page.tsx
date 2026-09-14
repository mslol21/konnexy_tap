"use client";

import React, { useState } from "react";
import {
  Tag,
  Plus,
  Calendar,
  Sparkles,
  CheckCircle2,
  Trash2,
  Edit2,
  DollarSign,
  ArrowRight,
} from "lucide-react";
import { DEMO_CAMPAIGN } from "@/lib/mock-data";
import { Campaign } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export default function CampanhasPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    DEMO_CAMPAIGN,
    {
      id: "cmp-happy-hour",
      business_id: "biz-cafe-ana",
      title: "Happy Hour do Café ☕🧁",
      description: "Café gelado aromatizado + fatia de bolo artesanal do dia.",
      original_price: 24.00,
      current_price: 18.90,
      button_text: "Pedir no Balcão",
      button_url: "https://wa.me/5511987654321?text=Ol%C3%A1!%20Vim%20pelo%20Happy%20Hour",
      start_date: "2026-09-10",
      end_date: "2026-10-15",
      is_active: false,
      created_at: new Date().toISOString(),
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [originalPrice, setOriginalPrice] = useState<string>("");
  const [currentPrice, setCurrentPrice] = useState<string>("");
  const [buttonText, setButtonText] = useState("Quero aproveitar");
  const [buttonUrl, setButtonUrl] = useState("");

  const handleOpenAdd = () => {
    setEditingCampaign(null);
    setTitle("");
    setDescription("");
    setOriginalPrice("");
    setCurrentPrice("");
    setButtonText("Quero aproveitar");
    setButtonUrl("");
    setShowModal(true);
  };

  const handleOpenEdit = (c: Campaign) => {
    setEditingCampaign(c);
    setTitle(c.title);
    setDescription(c.description);
    setOriginalPrice(c.original_price?.toString() || "");
    setCurrentPrice(c.current_price.toString());
    setButtonText(c.button_text);
    setButtonUrl(c.button_url || "");
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingCampaign) {
      setCampaigns(
        campaigns.map((c) =>
          c.id === editingCampaign.id
            ? {
                ...c,
                title,
                description,
                original_price: originalPrice ? parseFloat(originalPrice) : undefined,
                current_price: parseFloat(currentPrice) || 0,
                button_text: buttonText,
                button_url: buttonUrl,
              }
            : c
        )
      );
    } else {
      const newCamp: Campaign = {
        id: `cmp-${Date.now()}`,
        business_id: "biz-cafe-ana",
        title,
        description,
        original_price: originalPrice ? parseFloat(originalPrice) : undefined,
        current_price: parseFloat(currentPrice) || 0,
        button_text: buttonText,
        button_url: buttonUrl,
        is_active: true,
        created_at: new Date().toISOString(),
      };
      setCampaigns([newCamp, ...campaigns]);
    }

    setShowModal(false);
  };

  const toggleActive = (id: string) => {
    setCampaigns(
      campaigns.map((c) => (c.id === id ? { ...c, is_active: !c.is_active } : c))
    );
  };

  const handleDelete = (id: string) => {
    if (confirm("Remover esta campanha?")) {
      setCampaigns(campaigns.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <span className="text-xs font-bold text-navy-800 uppercase tracking-wider bg-navy-50 px-2.5 py-1 rounded-md border border-navy-200">
            Aumento de Ticket Médio
          </span>
          <h1 className="text-2xl font-black text-navy-950 mt-1">
            Campanhas & Promoções no Balcão
          </h1>
          <p className="text-xs text-slate-500">
            Publique combos e ofertas especiais que aparecem em destaque imediato na tela do cliente quando ele encostar o celular na placa.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-navy-950 hover:bg-navy-900 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 active:scale-95"
        >
          <Plus className="w-4 h-4 text-gold-400" />
          <span>Criar Nova Promoção</span>
        </button>
      </div>

      {/* Grid de Campanhas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {campaigns.map((camp) => (
          <div
            key={camp.id}
            className={`rounded-3xl p-6 border transition-all flex flex-col justify-between ${
              camp.is_active
                ? "bg-gradient-to-br from-navy-950 to-navy-900 text-white border-gold-400/30 shadow-lg"
                : "bg-white text-slate-900 border-slate-200 shadow-xs opacity-75"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    camp.is_active
                      ? "bg-gold-500/20 text-gold-300 border border-gold-400/40"
                      : "bg-slate-100 text-slate-600 border border-slate-200"
                  }`}
                >
                  {camp.is_active ? "Destaque Ativo na Placa" : "Campanha Pausada"}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleActive(camp.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                      camp.is_active
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {camp.is_active ? "Ativada" : "Inativa"}
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-black">{camp.title}</h3>
              <p
                className={`text-xs mt-2 leading-relaxed ${
                  camp.is_active ? "text-slate-300" : "text-slate-600"
                }`}
              >
                {camp.description}
              </p>

              <div className="mt-4 flex items-baseline gap-2.5">
                {camp.original_price && (
                  <span className="text-xs line-through text-slate-400 font-semibold">
                    {formatCurrency(camp.original_price)}
                  </span>
                )}
                <span className="text-2xl font-black text-gold-400">
                  {formatCurrency(camp.current_price)}
                </span>
              </div>
            </div>

            <div
              className={`mt-6 pt-4 flex items-center justify-between border-t ${
                camp.is_active ? "border-navy-800" : "border-slate-100"
              }`}
            >
              <div className="text-[11px] text-slate-400">
                Botão: <strong>{camp.button_text}</strong>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(camp)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300"
                  title="Editar"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(camp.id)}
                  className="p-1.5 rounded-lg hover:bg-rose-500/20 text-rose-400"
                  title="Excluir"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Criar/Editar */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 p-6 text-slate-900">
            <h3 className="text-lg font-bold text-navy-950 mb-1">
              {editingCampaign ? "Editar Promoção" : "Criar Nova Promoção"}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Configure os detalhes e os preços do combo ou oferta especial.
            </p>

            <form onSubmit={handleSave} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Título da Promoção
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Combo da Semana (Café + Bolo)"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Descrição dos Itens
                </label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: Café coado 150ml + pão de queijo da canastra quentinho recheado."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-800 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Preço Original (De)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    placeholder="16.90"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Preço Especial (Por) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={currentPrice}
                    onChange={(e) => setCurrentPrice(e.target.value)}
                    placeholder="12.90"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-800 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Texto do Botão
                </label>
                <input
                  type="text"
                  required
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value)}
                  placeholder="Quero aproveitar"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Link de Redirecionamento (ex: WhatsApp com pedido)
                </label>
                <input
                  type="text"
                  value={buttonUrl}
                  onChange={(e) => setButtonUrl(e.target.value)}
                  placeholder="https://wa.me/5511...?text=Quero%20aproveitar"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-800 focus:outline-none font-mono"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-navy-950"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-navy-950 hover:bg-navy-900 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Salvar Promoção
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
