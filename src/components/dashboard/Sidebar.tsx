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
} from "lucide-react";
import { DEMO_BUSINESS, DEMO_DEVICE } from "@/lib/mock-data";
import Logo from "@/components/brand/Logo";

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: "Minha Placa & Acessos", href: "/dashboard", icon: LayoutDashboard },
    { label: "Gerenciar Placa", href: "/dashboard/placas", icon: Radio },
  ];

  return (
    <>
      {/* Barra mobile */}
      <div className="lg:hidden bg-[#20252A] text-white px-4 py-3.5 flex items-center justify-between border-b border-white/10 sticky top-0 z-40">
        <Logo theme="dark" size="sm" showTagline={false} />
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 rounded-lg bg-[#2D343B] text-[#9BA3AB] hover:text-white"
          aria-label="Menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Desktop e Drawer Mobile */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#20252A] text-[#9BA3AB] flex flex-col justify-between border-r border-white/10 transition-transform duration-200 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          {/* Logo */}
          <div className="p-5 border-b border-white/10">
            <Logo theme="dark" size="sm" showTagline={false} />

            {/* Estabelecimento Atual */}
            <div className="mt-4 p-2.5 rounded-xl bg-[#2D343B] border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-7 h-7 rounded-lg bg-[#C78D4E]/20 text-[#D8A66C] flex items-center justify-center font-bold text-xs shrink-0">
                  {DEMO_BUSINESS.name.substring(0, 1)}
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold text-white truncate">
                    {DEMO_BUSINESS.name}
                  </div>
                  <div className="text-[10px] text-[#C78D4E] font-medium">
                    Placa {DEMO_DEVICE.code} • Ativa
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navegação */}
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
                      ? "bg-[#C78D4E] text-white font-bold shadow-sm"
                      : "text-[#9BA3AB] hover:text-white hover:bg-[#2D343B]"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-[#6D7277]"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div className="pt-3 pb-1 px-3">
              <span className="text-[10px] uppercase font-bold text-[#6D7277] tracking-wider">
                Suporte & Administração
              </span>
            </div>

            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#6D7277] hover:text-[#D8A66C] hover:bg-[#2D343B] transition-colors"
            >
              <ShieldAlert className="w-4 h-4 text-[#C78D4E]" />
              <span>Painel Admin (Lote 1)</span>
            </Link>

            <a
              href="https://wa.me/5511987654321?text=Ol%C3%A1!%20Gostaria%20de%20suporte%20para%20minha%20placa%20da%20Otimiza%20Meu%20Neg%C3%B3cio."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#6D7277] hover:text-white hover:bg-[#2D343B] transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#C78D4E]" />
              <span>Suporte no WhatsApp</span>
            </a>
          </nav>
        </div>

        {/* Rodapé da Sidebar */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            href={`/t/${DEMO_DEVICE.code}`}
            target="_blank"
            className="w-full py-2 px-3 rounded-xl bg-[#2D343B] hover:bg-[#353D46] text-[#9BA3AB] hover:text-white text-xs font-semibold flex items-center justify-between border border-white/10 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-[#C78D4E]" />
              Testar Redirecionamento
            </span>
            <span className="text-[10px] bg-[#20252A] px-1.5 py-0.5 rounded text-[#D8A66C] font-mono border border-white/10">
              {DEMO_DEVICE.code}
            </span>
          </Link>

          <Link
            href="/login"
            className="w-full py-2 px-3 rounded-xl text-[#6D7277] hover:text-red-400 text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sair da conta</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
