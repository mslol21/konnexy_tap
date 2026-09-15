"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  Edit2,
  Loader2,
  MessageCircle,
  Plus,
  Save,
  Search,
  Users,
  X,
} from "lucide-react";
import type { Lead, LeadSource, LeadStatus } from "@/lib/types";
import { formatDate } from "@/lib/utils";

function plateHref(lead: Lead) {
  const params = new URLSearchParams({
    lead_id: lead.id,
    business_name: lead.business_name,
    category: lead.segment || "Comércio local",
    city: lead.city || "",
  });
  return `/admin/placas?${params.toString()}`;
}

const sourceLabels: Record<LeadSource, string> = {
  instagram: "Instagram",
  whatsapp: "WhatsApp",
  facebook: "Facebook",
  presencial: "Presencial",
  indicacao: "Indicação",
  site: "Site",
  outro: "Outro",
};

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedSource, setSelectedSource] = useState<string>("all");
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState("");
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const loadLeads = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/leads", { cache: "no-store" });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setLeads([]);
        setError(typeof payload.error === "string" ? payload.error : "Não foi possível carregar os leads.");
        return;
      }
      setLeads(Array.isArray(payload.leads) ? payload.leads : []);
    } catch {
      setError("Falha de conexão ao carregar os leads.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadLeads();
  }, []);

  const updateLead = async (id: string, patch: Partial<Omit<Lead, "id" | "created_at">>) => {
    setError(null);
    setSuccess(null);
    const response = await fetch("/api/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...patch }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(typeof payload.error === "string" ? payload.error : "Não foi possível atualizar o lead.");
      return false;
    }
    const updated = payload.lead as Lead | undefined;
    setLeads((current) => current.map((lead) => (lead.id === id ? (updated || { ...lead, ...patch }) : lead)));
    return true;
  };

  const saveNotes = async (id: string) => {
    const ok = await updateLead(id, { notes: tempNotes || null });
    if (ok) {
      setEditingNotesId(null);
      setSuccess("Anotação salva.");
    }
  };

  const saveLeadEdit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editingLead) return;
    setSavingEdit(true);
    const ok = await updateLead(editingLead.id, {
      name: editingLead.name,
      business_name: editingLead.business_name,
      whatsapp: editingLead.whatsapp,
      instagram: editingLead.instagram || null,
      segment: editingLead.segment || null,
      city: editingLead.city || null,
      source: editingLead.source,
      status: editingLead.status,
      notes: editingLead.notes || null,
    });
    setSavingEdit(false);
    if (ok) {
      setSuccess("Lead atualizado com sucesso.");
      setEditingLead(null);
    }
  };

  const metrics = useMemo(() => {
    const total = leads.length;
    const contacted = leads.filter((lead) => lead.status === "contacted").length;
    const interested = leads.filter((lead) => lead.status === "interested").length;
    const reserved = leads.filter((lead) => lead.status === "reserved").length;
    const sold = leads.filter((lead) => lead.status === "sold").length;
    return { total, contacted, interested, reserved, sold };
  }, [leads]);

  const filteredLeads = useMemo(() => {
    const query = search.trim().toLowerCase();
    return leads.filter((lead) => {
      const matchesStatus = selectedStatus === "all" || lead.status === selectedStatus;
      const matchesSource = selectedSource === "all" || lead.source === selectedSource;
      const matchesSearch =
        !query ||
        lead.name.toLowerCase().includes(query) ||
        lead.business_name.toLowerCase().includes(query) ||
        lead.whatsapp.toLowerCase().includes(query) ||
        (lead.city || "").toLowerCase().includes(query);
      return matchesStatus && matchesSource && matchesSearch;
    });
  }, [leads, search, selectedSource, selectedStatus]);

  const statusCards = [
    ["all", "Total", metrics.total],
    ["contacted", "Contatados", metrics.contacted],
    ["interested", "Interessados", metrics.interested],
    ["reserved", "Reservados", metrics.reserved],
    ["sold", "Vendidos", metrics.sold],
  ] as const;

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/80 p-6 rounded-3xl border border-slate-700">
        <div>
          <span className="text-xs font-bold text-gold-400 uppercase tracking-wider">Funil comercial real</span>
          <h1 className="text-2xl font-black text-white mt-1">Reservas e leads</h1>
          <p className="text-xs text-slate-300 mt-1">Edite dados, registre observações, acompanhe status e converta o lead em placa sem redigitar informações.</p>
        </div>
        <button onClick={() => void loadLeads()} className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold">Atualizar</button>
      </header>

      {error && <div role="alert" className="p-4 rounded-2xl border border-rose-500/40 bg-rose-500/10 text-rose-100 text-xs flex items-start gap-2"><AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /><span>{error}</span></div>}
      {success && <div className="p-4 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-100 text-xs flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /><span>{success}</span></div>}

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {statusCards.map(([value, label, count]) => <button key={value} onClick={() => setSelectedStatus(value)} className={`p-4 rounded-2xl border text-left transition-colors ${selectedStatus === value ? "bg-slate-700 border-gold-400" : "bg-slate-800/80 border-slate-700 hover:border-slate-600"}`}><div className="text-[10px] uppercase font-bold text-slate-400">{label}</div><div className="text-2xl font-black text-white mt-1">{count}</div></button>)}
      </div>

      <section className="bg-slate-800/80 rounded-3xl border border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-700 bg-slate-900/40 flex flex-col lg:flex-row items-center justify-between gap-3">
          <div className="relative w-full lg:max-w-md"><Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar empresa, contato, WhatsApp ou cidade..." className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-slate-800 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-gold-500" /></div>
          <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
            <select value={selectedSource} onChange={(e) => setSelectedSource(e.target.value)} className="px-3 py-2.5 text-xs rounded-xl bg-slate-800 border border-slate-600 text-white"><option value="all">Todas as origens</option>{Object.entries(sourceLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
            <div className="px-3 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-700 text-slate-400">{filteredLeads.length} resultado{filteredLeads.length === 1 ? "" : "s"}</div>
          </div>
        </div>

        {loading ? <div className="p-10 flex items-center justify-center"><Loader2 className="w-7 h-7 text-gold-400 animate-spin" /></div> : filteredLeads.length === 0 ? <div className="p-10 text-center"><Users className="w-8 h-8 text-slate-500 mx-auto mb-2" /><p className="text-sm font-bold text-white">Nenhum lead encontrado</p><p className="text-xs text-slate-400 mt-1">Novas reservas do site aparecerão aqui automaticamente.</p></div> : (
          <div className="overflow-x-auto"><table className="w-full text-left text-xs text-slate-300"><thead className="bg-slate-900/60 text-[10px] uppercase tracking-wider text-slate-400"><tr><th className="py-3 px-4">Empresa / contato</th><th className="py-3 px-4">Origem</th><th className="py-3 px-4">WhatsApp</th><th className="py-3 px-4">Status</th><th className="py-3 px-4">Operação</th><th className="py-3 px-4">Anotações</th><th className="py-3 px-4 text-right">Ações</th></tr></thead><tbody className="divide-y divide-slate-700/70">{filteredLeads.map((lead) => {
            const cleanPhone = lead.whatsapp.replace(/\D/g, "");
            const phone = cleanPhone.startsWith("55") ? cleanPhone : `55${cleanPhone}`;
            const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(`Olá, ${lead.name}! Sou da Otimiza Meu Negócio. Vi seu interesse na placa inteligente para ${lead.business_name}.`)}`;
            const converted = Boolean(lead.converted_device_id);
            return <tr key={lead.id} className="hover:bg-slate-700/30"><td className="py-3 px-4"><div className="font-bold text-white text-sm">{lead.business_name}</div><div className="text-[11px] text-slate-400">{lead.name} • {lead.segment || "Geral"}{lead.city ? ` • ${lead.city}` : ""}</div><div className="text-[10px] text-slate-500 mt-0.5">{formatDate(lead.created_at)}</div></td><td className="py-3 px-4"><span className="px-2 py-1 rounded-full bg-slate-700 text-[10px] font-bold text-slate-200">{sourceLabels[lead.source]}</span></td><td className="py-3 px-4"><a href={waUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 font-semibold"><MessageCircle className="w-3.5 h-3.5" /> {lead.whatsapp}</a></td><td className="py-3 px-4"><select value={lead.status} onChange={(e) => void updateLead(lead.id, { status: e.target.value as LeadStatus })} className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-600 text-white text-xs"><option value="new">Novo</option><option value="contacted">Contatado</option><option value="interested">Interessado</option><option value="reserved">Reservado</option><option value="sold">Vendido</option><option value="lost">Perdido</option></select></td><td className="py-3 px-4">{converted ? <Link href="/admin/placas" className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 font-bold"><CheckCircle2 className="w-3.5 h-3.5" /> Ver placas</Link> : <Link href={plateHref(lead)} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gold-500 text-navy-950 font-black hover:bg-gold-400"><Plus className="w-3.5 h-3.5" /> Criar placa</Link>}</td><td className="py-3 px-4 min-w-[230px]">{editingNotesId === lead.id ? <div className="flex items-center gap-1.5"><input value={tempNotes} onChange={(e) => setTempNotes(e.target.value)} className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-600 text-white text-xs" /><button onClick={() => void saveNotes(lead.id)} className="p-1.5 rounded-lg bg-emerald-600 text-white"><Save className="w-3.5 h-3.5" /></button></div> : <button onClick={() => { setEditingNotesId(lead.id); setTempNotes(lead.notes || ""); }} className="group flex items-center gap-1 text-left text-[11px] text-slate-400 hover:text-slate-200"><span className="max-w-[220px] truncate">{lead.notes || "Adicionar anotação..."}</span><Edit2 className="w-3 h-3 opacity-0 group-hover:opacity-100" /></button>}</td><td className="py-3 px-4"><div className="flex justify-end"><button onClick={() => setEditingLead({ ...lead })} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white" title="Editar lead"><Edit2 className="w-3.5 h-3.5" /></button></div></td></tr>;
          })}</tbody></table></div>
        )}
      </section>

      {editingLead && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex justify-end" onMouseDown={(e) => { if (e.currentTarget === e.target) setEditingLead(null); }}>
          <aside className="w-full max-w-xl h-full overflow-y-auto bg-slate-900 border-l border-slate-700 shadow-2xl p-6">
            <div className="flex items-start justify-between gap-4 mb-6"><div><div className="text-[10px] uppercase font-bold text-gold-400">Editar lead</div><h2 className="text-xl font-black text-white mt-1">{editingLead.business_name}</h2><p className="text-xs text-slate-400 mt-1">Corrija dados comerciais sem precisar usar o SQL Editor.</p></div><button onClick={() => setEditingLead(null)} className="p-2 rounded-lg bg-slate-800 text-slate-300"><X className="w-4 h-4" /></button></div>
            <form onSubmit={saveLeadEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><div><label className="block text-xs font-bold text-slate-300 mb-1">Contato</label><input required value={editingLead.name} onChange={(e) => setEditingLead({ ...editingLead, name: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm" /></div><div><label className="block text-xs font-bold text-slate-300 mb-1">Empresa</label><input required value={editingLead.business_name} onChange={(e) => setEditingLead({ ...editingLead, business_name: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm" /></div></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><div><label className="block text-xs font-bold text-slate-300 mb-1">WhatsApp</label><input required value={editingLead.whatsapp} onChange={(e) => setEditingLead({ ...editingLead, whatsapp: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm" /></div><div><label className="block text-xs font-bold text-slate-300 mb-1">Instagram</label><input value={editingLead.instagram || ""} onChange={(e) => setEditingLead({ ...editingLead, instagram: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm" /></div></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><div><label className="block text-xs font-bold text-slate-300 mb-1">Segmento</label><input value={editingLead.segment || ""} onChange={(e) => setEditingLead({ ...editingLead, segment: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm" /></div><div><label className="block text-xs font-bold text-slate-300 mb-1">Cidade</label><input value={editingLead.city || ""} onChange={(e) => setEditingLead({ ...editingLead, city: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm" /></div></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><div><label className="block text-xs font-bold text-slate-300 mb-1">Origem</label><select value={editingLead.source} onChange={(e) => setEditingLead({ ...editingLead, source: e.target.value as LeadSource })} className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm">{Object.entries(sourceLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div><div><label className="block text-xs font-bold text-slate-300 mb-1">Status</label><select value={editingLead.status} onChange={(e) => setEditingLead({ ...editingLead, status: e.target.value as LeadStatus })} className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm"><option value="new">Novo</option><option value="contacted">Contatado</option><option value="interested">Interessado</option><option value="reserved">Reservado</option><option value="sold">Vendido</option><option value="lost">Perdido</option></select></div></div>
              <div><label className="block text-xs font-bold text-slate-300 mb-1">Anotações</label><textarea rows={5} value={editingLead.notes || ""} onChange={(e) => setEditingLead({ ...editingLead, notes: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm resize-none" /></div>
              <div className="grid grid-cols-2 gap-2 pt-2"><button type="button" onClick={() => setEditingLead(null)} className="py-2.5 rounded-xl bg-slate-700 text-white text-xs font-bold">Cancelar</button><button type="submit" disabled={savingEdit} className="py-2.5 rounded-xl bg-gold-500 text-navy-950 text-xs font-black flex items-center justify-center gap-2 disabled:opacity-50">{savingEdit ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}{savingEdit ? "Salvando..." : "Salvar alterações"}</button></div>
            </form>
          </aside>
        </div>
      )}
    </div>
  );
}
