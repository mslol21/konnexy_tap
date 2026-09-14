"use client";

import React, { useState } from "react";
import {
  Users,
  Download,
  Search,
  ShieldCheck,
  Trash2,
  Phone,
  Calendar,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { DEMO_CUSTOMERS } from "@/lib/mock-data";
import { Customer, CustomerConsent } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function ClientesPage() {
  const [customers, setCustomers] = useState<(Customer & { consent: CustomerConsent })[]>(DEMO_CUSTOMERS);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm)
  );

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Excluir ${name} da base conforme solicitado pelo titular (LGPD)?`)) {
      setCustomers(customers.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>LGPD Compliance • Consentimento Explícito</span>
          </div>
          <h1 className="text-2xl font-black text-navy-950 mt-1">
            Clube de Clientes VIP
          </h1>
          <p className="text-xs text-slate-500">
            Contatos capturados diretamente pela placa física NFC ou QR Code no seu balcão com autorização registrada.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/api/customers/export"
            download
            className="px-4 py-2.5 bg-navy-950 hover:bg-navy-900 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Download className="w-4 h-4 text-gold-400" />
            <span>Exportar Lista (CSV)</span>
          </a>
        </div>
      </div>

      {/* Caixa de Esclarecimento LGPD */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gold-500/20 text-gold-400 flex items-center justify-center shrink-0 font-bold">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">
              Isolamento Total & Privacidade dos Seus Clientes
            </div>
            <div className="text-[11px] text-slate-400">
              Estes dados pertencem exclusivamente ao seu estabelecimento. Eles nunca são compartilhados ou comercializados com terceiros.
            </div>
          </div>
        </div>
        <span className="text-[10px] font-mono text-gold-400 bg-slate-800 px-2.5 py-1 rounded-lg">
          Art. 7º, I da Lei 13.709/2018 (Consentimento)
        </span>
      </div>

      {/* Barra de Busca e Tabela */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar cliente por nome ou telefone..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-800 focus:outline-none bg-white"
            />
          </div>

          <span className="text-xs font-bold text-slate-500">
            Total: {filteredCustomers.length} contatos
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Nome do Cliente</th>
                <th className="py-3 px-4">WhatsApp</th>
                <th className="py-3 px-4">Nascimento</th>
                <th className="py-3 px-4">Consentimento LGPD</th>
                <th className="py-3 px-4">Origem</th>
                <th className="py-3 px-4">Data Opt-in</th>
                <th className="py-3 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-navy-950">
                    {c.name}
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                    <a
                      href={`https://wa.me/55${c.phone.replace(/\D/g, "")}`}
                      target="_blank"
                      className="hover:text-emerald-600 hover:underline flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3 text-emerald-600" />
                      {c.phone}
                    </a>
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    {c.birth_date ? c.birth_date : "Não informado"}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" />
                      Autorizado
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-600">
                    {c.consent.source === "nfc_tap" ? "Placa NFC" : "QR Code"}
                  </td>
                  <td className="py-3 px-4 text-slate-500 text-[11px]">
                    {formatDate(c.consent.consent_at)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleDelete(c.id, c.name)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Excluir dados conforme LGPD"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
