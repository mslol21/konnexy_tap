"use client";

import React, { useState } from "react";
import {
  Save,
  Sparkles,
  ExternalLink,
  Palette,
  LayoutGrid,
  Tag,
  CheckCircle2,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Eye,
} from "lucide-react";
import PhoneView from "@/components/public-page/PhoneView";
import { DEMO_BUSINESS, DEMO_LINKS, DEMO_CAMPAIGN, DEMO_DEVICE } from "@/lib/mock-data";
import { Business, BusinessLink, Campaign } from "@/lib/types";

export default function MinhaPaginaEditorPage() {
  const [business, setBusiness] = useState<Business>(DEMO_BUSINESS);
  const [links, setLinks] = useState<BusinessLink[]>(DEMO_LINKS);
  const [campaign, setCampaign] = useState<Campaign | null>(DEMO_CAMPAIGN);
  const [activeTab, setActiveTab] = useState<"info" | "design" | "links" | "promo">("info");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Link form helpers
  const toggleLinkActive = (id: string) => {
    setLinks(
      links.map((lnk) =>
        lnk.id === id ? { ...lnk, is_active: !lnk.is_active } : lnk
      )
    );
  };

  const moveLink = (index: number, direction: "up" | "down") => {
    const newLinks = [...links];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newLinks.length) return;

    const temp = newLinks[index];
    newLinks[index] = newLinks[targetIndex];
    newLinks[targetIndex] = temp;

    // Atualizar order_index
    newLinks.forEach((lnk, i) => {
      lnk.order_index = i + 1;
    });

    setLinks(newLinks);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <span className="text-xs font-bold text-gold-600 uppercase tracking-wider">
            Editor Visual em Tempo Real
          </span>
          <h1 className="text-2xl font-black text-navy-950 mt-0.5">
            Minha Página Inteligente
          </h1>
          <p className="text-xs text-slate-500">
            Edite o conteúdo na coluna esquerda e veja o resultado no celular à direita.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`/t/${DEMO_DEVICE.code}`}
            target="_blank"
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:text-navy-950 hover:bg-slate-50 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Ver no Celular</span>
          </a>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-navy-950 hover:bg-navy-900 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Save className="w-3.5 h-3.5 text-gold-400" />
            <span>Salvar Alterações</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Alterações salvas com sucesso! Sua placa física já está com o conteúdo atualizado.</span>
        </div>
      )}

      {/* Layout Split-Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Coluna Esquerda: Configurações & Formulários (7 colunas) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Tabs do Editor */}
          <div className="flex border-b border-slate-200 bg-slate-50/70 p-2 gap-1.5 overflow-x-auto">
            <button
              onClick={() => setActiveTab("info")}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                activeTab === "info"
                  ? "bg-white text-navy-950 shadow-xs border border-slate-200"
                  : "text-slate-600 hover:text-navy-950"
              }`}
            >
              Informações Gerais
            </button>
            <button
              onClick={() => setActiveTab("design")}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                activeTab === "design"
                  ? "bg-white text-navy-950 shadow-xs border border-slate-200"
                  : "text-slate-600 hover:text-navy-950"
              }`}
            >
              Cores & Capa
            </button>
            <button
              onClick={() => setActiveTab("links")}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                activeTab === "links"
                  ? "bg-white text-navy-950 shadow-xs border border-slate-200"
                  : "text-slate-600 hover:text-navy-950"
              }`}
            >
              Botões de Ação ({links.length})
            </button>
            <button
              onClick={() => setActiveTab("promo")}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                activeTab === "promo"
                  ? "bg-white text-navy-950 shadow-xs border border-slate-200"
                  : "text-slate-600 hover:text-navy-950"
              }`}
            >
              Promoção Ativa
            </button>
          </div>

          <div className="p-6">
            {/* TAB: Informações Gerais */}
            {activeTab === "info" && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Nome do Estabelecimento
                  </label>
                  <input
                    type="text"
                    value={business.name}
                    onChange={(e) => setBusiness({ ...business, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Frase de Boas-Vindas / Descrição
                  </label>
                  <textarea
                    rows={3}
                    value={business.description || ""}
                    onChange={(e) => setBusiness({ ...business, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-800 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Categoria Comercial
                    </label>
                    <input
                      type="text"
                      value={business.category}
                      onChange={(e) => setBusiness({ ...business, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-800 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      WhatsApp com DDD
                    </label>
                    <input
                      type="text"
                      value={business.whatsapp || ""}
                      onChange={(e) => setBusiness({ ...business, whatsapp: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-800 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Endereço Completo
                  </label>
                  <input
                    type="text"
                    value={business.address || ""}
                    onChange={(e) => setBusiness({ ...business, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-800 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* TAB: Cores & Capa */}
            {activeTab === "design" && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    URL da Logomarca
                  </label>
                  <input
                    type="url"
                    value={business.logo_url || ""}
                    onChange={(e) => setBusiness({ ...business, logo_url: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    URL da Imagem de Capa
                  </label>
                  <input
                    type="url"
                    value={business.cover_url || ""}
                    onChange={(e) => setBusiness({ ...business, cover_url: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-800 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      Cor Primária
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={business.primary_color}
                        onChange={(e) =>
                          setBusiness({ ...business, primary_color: e.target.value })
                        }
                        className="w-10 h-10 rounded-xl cursor-pointer border-0"
                      />
                      <span className="font-mono text-xs font-bold text-slate-700">
                        {business.primary_color}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      Cor Secundária (Dourado/Acento)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={business.secondary_color}
                        onChange={(e) =>
                          setBusiness({ ...business, secondary_color: e.target.value })
                        }
                        className="w-10 h-10 rounded-xl cursor-pointer border-0"
                      />
                      <span className="font-mono text-xs font-bold text-slate-700">
                        {business.secondary_color}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Botões & Ações */}
            {activeTab === "links" && (
              <div className="space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-600 uppercase">
                    Organize ou oculte os botões da placa
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Arrume a ordem com as setas
                  </span>
                </div>

                <div className="space-y-2">
                  {links.map((link, idx) => (
                    <div
                      key={link.id}
                      className="p-3 rounded-2xl border border-slate-200 bg-slate-50/80 flex items-center justify-between gap-3 hover:bg-white transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <input
                          type="checkbox"
                          checked={link.is_active}
                          onChange={() => toggleLinkActive(link.id)}
                          className="rounded text-navy-950 focus:ring-navy-800"
                        />
                        <div className="truncate">
                          <div className="text-xs font-bold text-navy-950 truncate">
                            {link.title}
                          </div>
                          <div className="text-[10px] text-slate-600 truncate font-mono">
                            {link.url}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => moveLink(idx, "up")}
                          disabled={idx === 0}
                          className="p-1 text-slate-600 hover:text-slate-900 disabled:opacity-30 rounded hover:bg-slate-100"
                          title="Mover para cima"
                        >
                          <MoveUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveLink(idx, "down")}
                          disabled={idx === links.length - 1}
                          className="p-1 text-slate-600 hover:text-slate-900 disabled:opacity-30 rounded hover:bg-slate-100"
                          title="Mover para baixo"
                        >
                          <MoveDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: Promoção Ativa */}
            {activeTab === "promo" && campaign && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-200">
                  <div>
                    <div className="text-xs font-bold text-navy-950">
                      Exibir promoção na página pública
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Quando ativada, a promoção ganha destaque automático na tela do cliente.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={campaign.is_active}
                    onChange={(e) =>
                      setCampaign({ ...campaign, is_active: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-navy-950 focus:ring-navy-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Título da Promoção
                  </label>
                  <input
                    type="text"
                    value={campaign.title}
                    onChange={(e) =>
                      setCampaign({ ...campaign, title: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Descrição dos Itens do Combo
                  </label>
                  <textarea
                    rows={2}
                    value={campaign.description}
                    onChange={(e) =>
                      setCampaign({ ...campaign, description: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-800 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Preço Anterior (De)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={campaign.original_price || ""}
                      onChange={(e) =>
                        setCampaign({
                          ...campaign,
                          original_price: parseFloat(e.target.value) || undefined,
                        })
                      }
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-800 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Preço Promocional (Por) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={campaign.current_price}
                      onChange={(e) =>
                        setCampaign({
                          ...campaign,
                          current_price: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-800 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Texto do Botão de Compra
                  </label>
                  <input
                    type="text"
                    value={campaign.button_text}
                    onChange={(e) =>
                      setCampaign({ ...campaign, button_text: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-800 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Coluna Direita: Preview do Smartphone em Tempo Real (5 colunas) */}
        <div className="lg:col-span-5 flex flex-col items-center sticky top-6">
          <div className="mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Preview em Tempo Real (375x667)
          </div>

          <div className="relative w-full max-w-[340px] border-[10px] border-slate-900 rounded-[44px] shadow-2xl overflow-hidden bg-slate-900 ring-1 ring-slate-800">
            {/* Ilha Superior */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-4 bg-black rounded-full z-30 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900/80 mr-4" />
              <div className="w-2 h-2 rounded-full bg-emerald-500/80" />
            </div>

            {/* Tela */}
            <div className="h-[580px] overflow-y-auto bg-slate-50 pt-8">
              <PhoneView
                business={business}
                links={links}
                campaign={campaign}
                device={DEMO_DEVICE}
                isMockup={true}
              />
            </div>

            {/* Home Indicator */}
            <div className="h-4 bg-slate-900 w-full flex items-center justify-center">
              <div className="w-24 h-1 bg-slate-600 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
