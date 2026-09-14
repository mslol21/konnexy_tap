"use client";

import React, { useState } from "react";
import {
  Plus,
  Star,
  MessageCircle,
  UtensilsCrossed,
  MapPin,
  Instagram,
  Send,
  ExternalLink,
  MoveUp,
  MoveDown,
  Trash2,
  Edit2,
  CheckCircle2,
  Check,
} from "lucide-react";
import { DEMO_LINKS } from "@/lib/mock-data";
import { BusinessLink, LinkType } from "@/lib/types";

export default function LinksManagerPage() {
  const [links, setLinks] = useState<BusinessLink[]>(DEMO_LINKS);
  const [showModal, setShowModal] = useState(false);
  const [editingLink, setEditingLink] = useState<BusinessLink | null>(null);

  const [title, setTitle] = useState("");
  const [type, setType] = useState<LinkType>("google_review");
  const [url, setUrl] = useState("");

  const handleOpenAdd = () => {
    setEditingLink(null);
    setTitle("");
    setType("whatsapp");
    setUrl("");
    setShowModal(true);
  };

  const handleOpenEdit = (link: BusinessLink) => {
    setEditingLink(link);
    setTitle(link.title);
    setType(link.type);
    setUrl(link.url);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingLink) {
      setLinks(
        links.map((l) =>
          l.id === editingLink.id
            ? { ...l, title, type, url }
            : l
        )
      );
    } else {
      const newLnk: BusinessLink = {
        id: `lnk-${Date.now()}`,
        business_id: "biz-cafe-ana",
        title,
        type,
        url,
        order_index: links.length + 1,
        is_active: true,
        created_at: new Date().toISOString(),
      };
      setLinks([...links, newLnk]);
    }

    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja remover este link?")) {
      setLinks(links.filter((l) => l.id !== id));
    }
  };

  const toggleActive = (id: string) => {
    setLinks(
      links.map((l) => (l.id === id ? { ...l, is_active: !l.is_active } : l))
    );
  };

  const move = (idx: number, direction: "up" | "down") => {
    const newL = [...links];
    const target = direction === "up" ? idx - 1 : idx + 1;
    if (target < 0 || target >= newL.length) return;

    const tmp = newL[idx];
    newL[idx] = newL[target];
    newL[target] = tmp;

    newL.forEach((l, i) => {
      l.order_index = i + 1;
    });

    setLinks(newL);
  };

  const getIcon = (t: LinkType) => {
    switch (t) {
      case "google_review":
        return <Star className="w-4 h-4 text-amber-500 fill-amber-400" />;
      case "whatsapp":
        return <MessageCircle className="w-4 h-4 text-emerald-600" />;
      case "menu":
      case "catalog":
        return <UtensilsCrossed className="w-4 h-4 text-orange-600" />;
      case "maps":
        return <MapPin className="w-4 h-4 text-rose-600" />;
      case "instagram":
        return <Instagram className="w-4 h-4 text-pink-600" />;
      case "suggestion":
        return <Send className="w-4 h-4 text-navy-700" />;
      default:
        return <ExternalLink className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <span className="text-xs font-bold text-navy-800 uppercase tracking-wider bg-navy-50 px-2.5 py-1 rounded-md border border-navy-200">
            Ações do Balcão
          </span>
          <h1 className="text-2xl font-black text-navy-950 mt-1">
            Gerenciador de Links e Botões
          </h1>
          <p className="text-xs text-slate-500">
            Configure quais botões aparecem para os clientes que tocarem na sua placa física NFC.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-navy-950 hover:bg-navy-900 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 active:scale-95"
        >
          <Plus className="w-4 h-4 text-gold-400" />
          <span>Adicionar Novo Botão</span>
        </button>
      </div>

      {/* Lista de Links */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center justify-between">
          <span>Botões Configurados ({links.length})</span>
          <span>Ordem & Status</span>
        </div>

        <div className="divide-y divide-slate-100">
          {links.map((link, idx) => (
            <div
              key={link.id}
              className={`p-4 flex items-center justify-between gap-4 transition-colors ${
                link.is_active ? "hover:bg-slate-50/80" : "bg-slate-50/50 opacity-60"
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                  {getIcon(link.type)}
                </div>
                <div className="truncate">
                  <div className="text-sm font-bold text-navy-950 flex items-center gap-2">
                    {link.title}
                    {link.type === "google_review" && (
                      <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold">
                        ⭐ Avaliação Google
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 truncate font-mono mt-0.5">
                    {link.url}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Toggle Ativo */}
                <button
                  onClick={() => toggleActive(link.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                    link.is_active
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {link.is_active ? "Visível" : "Oculto"}
                </button>

                {/* Seta Cima/Baixo */}
                <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
                  <button
                    onClick={() => move(idx, "up")}
                    disabled={idx === 0}
                    className="p-1 text-slate-600 hover:text-navy-950 disabled:opacity-20"
                  >
                    <MoveUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => move(idx, "down")}
                    disabled={idx === links.length - 1}
                    className="p-1 text-slate-600 hover:text-navy-950 disabled:opacity-20"
                  >
                    <MoveDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Editar */}
                <button
                  onClick={() => handleOpenEdit(link)}
                  className="p-1.5 text-slate-600 hover:text-navy-950 hover:bg-slate-100 rounded-lg"
                  title="Editar Link"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                {/* Deletar */}
                <button
                  onClick={() => handleDelete(link.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                  title="Excluir Link"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Adicionar/Editar */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 p-6 text-slate-900">
            <h3 className="text-lg font-bold text-navy-950 mb-1">
              {editingLink ? "Editar Botão" : "Adicionar Novo Botão"}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Defina o nome, o destino e o tipo do botão.
            </p>

            <form onSubmit={handleSave} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Tipo de Ação
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as LinkType)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-800 focus:outline-none bg-white font-medium"
                >
                  <option value="google_review">⭐ Avaliação no Google (Google Reviews)</option>
                  <option value="whatsapp">💬 Conversa no WhatsApp</option>
                  <option value="menu">📋 Cardápio do dia</option>
                  <option value="catalog">📦 Catálogo de Produtos</option>
                  <option value="booking">📅 Agendamento de Horários</option>
                  <option value="maps">📍 Localização / Google Maps</option>
                  <option value="instagram">📸 Perfil do Instagram</option>
                  <option value="website">🌐 Site Oficial</option>
                  <option value="suggestion">💡 Sugestão / Feedback à Gerência</option>
                  <option value="custom">🔗 Link Personalizado</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Texto Exibido no Botão
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Falar no WhatsApp com o Gerente"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  URL / Destino
                </label>
                <input
                  type="text"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://..."
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
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
