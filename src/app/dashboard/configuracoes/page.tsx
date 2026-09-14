"use client";

import React, { useState } from "react";
import {
  Settings,
  Building,
  Users,
  Shield,
  Save,
  CheckCircle2,
  Lock,
  Plus,
  Trash2,
} from "lucide-react";
import { DEMO_BUSINESS } from "@/lib/mock-data";

export default function ConfiguracoesPage() {
  const [businessName, setBusinessName] = useState(DEMO_BUSINESS.name);
  const [slug, setSlug] = useState(DEMO_BUSINESS.slug);
  const [email, setEmail] = useState("contato@cafedaana.com.br");
  const [phone, setPhone] = useState(DEMO_BUSINESS.phone || "");
  const [saved, setSaved] = useState(false);

  const [members, setMembers] = useState([
    { id: "m1", name: "Ana Clara Silva", email: "ana@cafedaana.com.br", role: "Proprietária (Owner)" },
    { id: "m2", name: "Lucas Rocha", email: "lucas@cafedaana.com.br", role: "Gerente (Admin)" },
  ]);

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
            Administração da Conta
          </span>
          <h1 className="text-2xl font-black text-navy-950 mt-1">
            Configurações Gerais & Equipe
          </h1>
          <p className="text-xs text-slate-500">
            Gerencie as credenciais do estabelecimento, permissões de membros e dados de segurança.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-navy-950 hover:bg-navy-900 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-95"
        >
          <Save className="w-4 h-4 text-gold-400" />
          <span>Salvar Configurações</span>
        </button>
      </div>

      {saved && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Configurações salvas com sucesso!</span>
        </div>
      )}

      {/* Dados do Estabelecimento */}
      <form onSubmit={handleSave} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-navy-950 flex items-center gap-2">
          <Building className="w-4 h-4 text-navy-800" />
          Identificação do Comércio
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Nome Comercial
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-800 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Identificador da URL (Slug)
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-800 focus:outline-none bg-slate-50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              E-mail de Notificações
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-800 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Telefone Principal
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-800 focus:outline-none"
            />
          </div>
        </div>
      </form>

      {/* Gestão de Membros / Multi-tenant */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-navy-950 flex items-center gap-2">
              <Users className="w-4 h-4 text-navy-800" />
              Membros da Equipe & Permissões (Multi-tenant)
            </h2>
            <p className="text-xs text-slate-500">
              Controle quem tem acesso de administração a este estabelecimento.
            </p>
          </div>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Convidar Membro</span>
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {members.map((m) => (
            <div key={m.id} className="py-3 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-navy-950">{m.name}</div>
                <div className="text-[11px] text-slate-500">{m.email}</div>
              </div>
              <span className="text-[11px] font-bold text-navy-900 bg-navy-50 border border-navy-200 px-2.5 py-1 rounded-lg">
                {m.role}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
