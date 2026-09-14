"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Phone,
  Filter,
  CheckCircle2,
  Clock,
  DollarSign,
  TrendingUp,
  MessageCircle,
  ExternalLink,
  Edit2,
  Save,
  Tag,
  ArrowRight,
} from "lucide-react";
import { DEMO_LEADS } from "@/lib/mock-data";
import { Lead, LeadStatus } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(DEMO_LEADS);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState("");

  useEffect(() => {
    fetch("/api/leads")
      .then((res) => res.json())
      .then((data) => {
        if (data.leads) setLeads(data.leads);
      })
      .catch(() => {});
  }, []);

  const updateLeadStatus = async (id: string, newStatus: LeadStatus) => {
    setLeads(leads.map((l) => (l.id === id ? { ...l, status: newStatus } : l)));
    try {
      await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
    } catch {
      // Ignore
    }
  };

  const saveNotes = async (id: string) => {
    setLeads(leads.map((l) => (l.id === id ? { ...l, notes: tempNotes } : l)));
    setEditingNotesId(null);
    try {
      await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, notes: tempNotes }),
      });
    } catch {
      // Ignore
    }
  };

  // Funil
  const total = leads.length;
  const contacted = leads.filter((l) => l.status === "contacted").length;
  const interested = leads.filter((l) => l.status === "interested").length;
  const reserved = leads.filter((l) => l.status === "reserved").length;
  const sold = leads.filter((l) => l.status === "sold").length;
  const conversionRate = total > 0 ? ((sold / total) * 100).toFixed(1) : "0.0";

  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.business_name.toLowerCase().includes(search.toLowerCase()) ||
      l.whatsapp.includes(search) ||
      (l.city && l.city.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = selectedStatus === "all" || l.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/80 p-6 rounded-3xl border border-slate-700 shadow-xs">
        <div>
          <span className="text-xs font-bold text-gold-400 uppercase tracking-wider">
            Funil Comercial do Primeiro Lote
          </span>
          <h1 className="text-2xl font-black text-white mt-0.5">
            Gestão de Reservas & Leads
          </h1>
          <p className="text-xs text-slate-300">
            Acompanhe lojistas interessados, confirme reservas da placa Konnexy Tap Reviews e converta em vendas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 text-xs font-bold text-slate-300 border border-slate-700">
            Taxa de Conversão: <span className="text-emerald-400">{conversionRate}%</span>
          </div>
        </div>
      </div>

      {/* Funil Visual de Vendas */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div
          onClick={() => setSelectedStatus("all")}
          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
            selectedStatus === "all"
              ? "bg-slate-700 border-gold-400 text-white"
              : "bg-slate-800/80 border-slate-700 text-slate-400 hover:border-slate-600"
          }`}
        >
          <div className="text-[10px] uppercase font-bold text-slate-400">1. Total Leads</div>
          <div className="text-xl font-black text-white mt-1">{total}</div>
        </div>

        <div
          onClick={() => setSelectedStatus("contacted")}
          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
            selectedStatus === "contacted"
              ? "bg-slate-700 border-blue-400 text-white"
              : "bg-slate-800/80 border-slate-700 text-slate-400 hover:border-slate-600"
          }`}
        >
          <div className="text-[10px] uppercase font-bold text-blue-400">2. Contatados</div>
          <div className="text-xl font-black text-white mt-1">{contacted}</div>
        </div>

        <div
          onClick={() => setSelectedStatus("interested")}
          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
            selectedStatus === "interested"
              ? "bg-slate-700 border-purple-400 text-white"
              : "bg-slate-800/80 border-slate-700 text-slate-400 hover:border-slate-600"
          }`}
        >
          <div className="text-[10px] uppercase font-bold text-purple-400">3. Interessados</div>
          <div className="text-xl font-black text-white mt-1">{interested}</div>
        </div>

        <div
          onClick={() => setSelectedStatus("reserved")}
          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
            selectedStatus === "reserved"
              ? "bg-slate-700 border-amber-400 text-white"
              : "bg-slate-800/80 border-slate-700 text-slate-400 hover:border-slate-600"
          }`}
        >
          <div className="text-[10px] uppercase font-bold text-amber-400">4. Reservados ⭐</div>
          <div className="text-xl font-black text-amber-400 mt-1">{reserved}</div>
        </div>

        <div
          onClick={() => setSelectedStatus("sold")}
          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
            selectedStatus === "sold"
              ? "bg-slate-700 border-emerald-400 text-white"
              : "bg-slate-800/80 border-slate-700 text-slate-400 hover:border-slate-600"
          }`}
        >
          <div className="text-[10px] uppercase font-bold text-emerald-400">5. Vendidos 💰</div>
          <div className="text-xl font-black text-emerald-400 mt-1">{sold}</div>
        </div>
      </div>

      {/* Busca e Tabela */}
      <div className="bg-slate-800/80 rounded-3xl border border-slate-700 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-700 bg-slate-900/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por empresa, nome, WhatsApp ou cidade..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-800 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span>Exibindo: <strong>{filteredLeads.length}</strong></span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/70 text-[10px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-700">
              <tr>
                <th className="py-3 px-4">Empresa / Contato</th>
                <th className="py-3 px-4">Segmento & Cidade</th>
                <th className="py-3 px-4">WhatsApp Direto</th>
                <th className="py-3 px-4">Status no Funil</th>
                <th className="py-3 px-4">Anotações Operacionais</th>
                <th className="py-3 px-4 text-right">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {filteredLeads.map((lead) => {
                const cleanPhone = lead.whatsapp.replace(/\D/g, "");
                const waUrl = `https://wa.me/55${cleanPhone}?text=Ol%C3%A1%20${encodeURIComponent(
                  lead.name
                )}!%20Sou%20da%20Konnexy%20Tap%20Reviews.%20Vi%20sua%20reserva%20para%20a%20${encodeURIComponent(
                  lead.business_name
                )}.`;

                return (
                  <tr key={lead.id} className="hover:bg-slate-700/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-white text-sm">
                        {lead.business_name}
                      </div>
                      <div className="text-[11px] text-slate-400">{lead.name}</div>
                      {lead.instagram && (
                        <div className="text-[10px] text-pink-400">{lead.instagram}</div>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <div className="text-slate-200 font-semibold">{lead.segment || "Geral"}</div>
                      <div className="text-[11px] text-slate-400">{lead.city || "Não informada"}</div>
                    </td>

                    <td className="py-3 px-4">
                      <a
                        href={waUrl}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 font-mono text-xs font-bold transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>{lead.whatsapp}</span>
                      </a>
                    </td>

                    <td className="py-3 px-4">
                      <select
                        value={lead.status}
                        onChange={(e) => updateLeadStatus(lead.id, e.target.value as LeadStatus)}
                        className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-800 border border-slate-600 text-white focus:outline-none focus:ring-1 focus:ring-gold-500 cursor-pointer"
                      >
                        <option value="new">Novo Lead</option>
                        <option value="contacted">Contatado</option>
                        <option value="interested">Interessado</option>
                        <option value="reserved">Reservado (Lote 1)</option>
                        <option value="sold">Vendido (Pago)</option>
                        <option value="lost">Perdido / Desistiu</option>
                      </select>
                    </td>

                    <td className="py-3 px-4">
                      {editingNotesId === lead.id ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={tempNotes}
                            onChange={(e) => setTempNotes(e.target.value)}
                            className="px-2 py-1 text-xs rounded bg-slate-900 border border-slate-600 text-white w-48"
                          />
                          <button
                            onClick={() => saveNotes(lead.id)}
                            className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-500"
                          >
                            <Save className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => {
                            setEditingNotesId(lead.id);
                            setTempNotes(lead.notes || "");
                          }}
                          className="cursor-pointer group flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200"
                        >
                          <span className="truncate max-w-[200px]">
                            {lead.notes || "Clique para adicionar anotação..."}
                          </span>
                          <Edit2 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right text-[11px] text-slate-400 whitespace-nowrap">
                      {formatDate(lead.created_at)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
