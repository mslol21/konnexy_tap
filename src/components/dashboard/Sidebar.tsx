"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Radio,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ShieldAlert,
  MessageCircle,
  HelpCircle,
} from "lucide-react";
import { DEMO_BUSINESS, DEMO_DEVICE } from "@/lib/mock-data";
import Logo from "@/components/brand/Logo";

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: "Minha Placa & Acessos", href: "/dashboard", icon: LayoutDashboard },
    { label: "Gerenciar Placa NFC", href: "/dashboard/placas", icon: Radio },
  ];

  return (
    <>
      {/* Barra mobile */}
      <div className="lg:hidden bg-navy-950 text-white px-4 py-3 flex items-center justify-between border-b border-navy-900 sticky top-0 z-40">
        <Logo theme="dark" size="sm" badge="Reviews" showTagline={false} />
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 rounded-lg bg-navy-900 text-slate-300"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Desktop e Drawer Mobile */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-navy-950 text-slate-300 flex flex-col justify-between border-r border-navy-900 transition-transform duration-200 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          {/* Logo */}
          <div className="p-5 border-b border-navy-900">
            <Logo theme="dark" size="sm" showTagline={true} badge="Reviews" />

            {/* Estabelecimento Atual */}
            <div className="mt-4 p-2.5 rounded-xl bg-navy-900/90 border border-navy-800 flex items-center justify-between">
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-7 h-7 rounded-lg bg-gold-500/20 text-gold-300 flex items-center justify-center font-bold text-xs shrink-0">
                  {DEMO_BUSINESS.name.substring(0, 1)}
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold text-white truncate">
                    {DEMO_BUSINESS.name}
                  </div>
                  <div className="text-[10px] text-emerald-400 font-medium">
                    Placa {DEMO_DEVICE.code} • Ativa
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navegação Essencial do MVP */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-gold-500 text-navy-950 font-bold shadow-md"
                      : "text-slate-300 hover:text-white hover:bg-navy-900"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-navy-950" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div className="pt-3 pb-1 px-3">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Suporte & Administração
              </span>
            </div>

            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-gold-300 hover:bg-navy-900 transition-colors"
            >
              <ShieldAlert className="w-4 h-4 text-gold-400" />
              <span>Painel Admin (Lote 1)</span>
            </Link>

            <a
              href="https://wa.me/5511987654321?text=Ol%C3%A1!%20Gostaria%20de%20suporte%20para%20minha%20placa%20Konnexy%20Tap."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-emerald-400 hover:bg-navy-900 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Suporte no WhatsApp</span>
            </a>
          </nav>
        </div>

        {/* Rodapé da Sidebar */}
        <div className="p-4 border-t border-navy-900 space-y-2">
          <Link
            href={`/t/${DEMO_DEVICE.code}`}
            target="_blank"
            className="w-full py-2 px-3 rounded-xl bg-navy-900 hover:bg-navy-850 text-slate-200 text-xs font-bold flex items-center justify-between border border-navy-800 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-gold-400" />
              Testar Redirecionamento
            </span>
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-gold-400 font-mono">
              {DEMO_DEVICE.code}
            </span>
          </Link>

          <Link
            href="/login"
            className="w-full py-2 px-3 rounded-xl text-slate-400 hover:text-rose-400 text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sair da conta</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
