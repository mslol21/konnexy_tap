import React from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Radio,
  Users,
  LayoutDashboard,
  ArrowLeft,
  QrCode,
  Sparkles,
  RadioTower,
} from "lucide-react";
import Logo from "@/components/brand/Logo";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Top Header Admin */}
      <header className="bg-navy-950 border-b border-slate-800 sticky top-0 z-40 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Voltar ao site público"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <Logo theme="dark" size="sm" badge="Admin" showTagline={false} />
          </div>

          <nav className="w-full sm:w-auto flex items-center gap-1.5 text-xs font-bold overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            <Link
              href="/admin"
              className="shrink-0 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Visão Geral
            </Link>
            <Link
              href="/admin/leads"
              className="shrink-0 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5 text-gold-400" />
              <span>Reservas & Leads</span>
            </Link>
            <Link
              href="/admin/placas"
              className="shrink-0 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <QrCode className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cadastrar Placas (&lt; 1 min)</span>
            </Link>
            <Link
              href="/admin/acessos"
              className="shrink-0 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <RadioTower className="w-3.5 h-3.5 text-cyan-400" />
              <span>Acessos NFC/QR</span>
            </Link>
            <Link
              href="/admin/clientes"
              className="shrink-0 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span>Experiências</span>
            </Link>
            <Link
              href="/dashboard"
              className="shrink-0 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold transition-colors sm:ml-2"
            >
              Painel do Comerciante
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
