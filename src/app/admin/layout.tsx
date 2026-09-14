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
} from "lucide-react";
import Logo from "@/components/brand/Logo";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Top Header Admin */}
      <header className="bg-navy-950 border-b border-slate-800 sticky top-0 z-40 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
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

          <nav className="flex items-center gap-2 text-xs font-bold">
            <Link
              href="/admin"
              className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Visão Geral
            </Link>
            <Link
              href="/admin/leads"
              className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5 text-gold-400" />
              <span>Reservas & Leads</span>
            </Link>
            <Link
              href="/admin/placas"
              className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <QrCode className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cadastrar Placas (&lt; 1 min)</span>
            </Link>
            <Link
              href="/dashboard"
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold transition-colors ml-2"
            >
              Painel do Comerciante
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
