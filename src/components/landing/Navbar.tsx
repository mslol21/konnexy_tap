"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight, Sparkles, MessageCircle } from "lucide-react";
import Logo from "@/components/brand/Logo";

interface NavbarProps {
  onOpenReserve?: () => void;
}

export default function Navbar({ onOpenReserve }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#060B17]/95 backdrop-blur-md border-b border-white/10 transition-all">
      <div className="max-w-[1520px] mx-auto px-6 sm:px-10 lg:px-14 h-22 flex items-center justify-between">
        {/* Logo Oficial com Assinatura */}
        <div className="flex items-center gap-5">
          <Logo theme="dark" size="md" showTagline={true} badge="Reviews" />
          <span className="hidden xl:inline-block text-xs sm:text-sm font-medium text-cyan-400/90 border-l border-white/15 pl-4 italic tracking-wide">
            ✦ Seu negócio conectado
          </span>
        </div>

        {/* Links Desktop (+25% no tamanho das letras) */}
        <nav className="hidden md:flex items-center gap-8 text-sm lg:text-[15px] font-bold text-slate-200">
          <a href="#como-funciona" className="hover:text-cyan-400 transition-colors">
            Como funciona
          </a>
          <a href="#possibilidades" className="hover:text-cyan-400 transition-colors">
            Possibilidades
          </a>
          <a href="#beneficios" className="hover:text-cyan-400 transition-colors">
            A Placa Física
          </a>
          <a href="#segmentos" className="hover:text-cyan-400 transition-colors">
            Segmentos
          </a>
          <a href="#faq" className="hover:text-cyan-400 transition-colors">
            Dúvidas
          </a>
          <Link
            href="/demo"
            className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1.5 font-bold"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Testar Demo</span>
          </Link>
        </nav>

        {/* Ações Desktop */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-bold text-slate-300 hover:text-white px-3.5 py-2.5 transition-colors"
          >
            Área do Lojista
          </Link>
          <button
            onClick={onOpenReserve}
            className="text-sm lg:text-[15px] font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white px-5 py-3 rounded-2xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all flex items-center gap-2.5 active:scale-95 border border-emerald-400/30 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-white/20" />
            <span>Fale pelo WhatsApp</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Botão Mobile */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg focus:outline-none"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Menu Mobile */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0A1128] border-b border-white/10 px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200 shadow-2xl">
          <nav className="flex flex-col space-y-2 text-sm font-medium text-slate-200">
            <a
              href="#como-funciona"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-white/5 hover:text-cyan-300"
            >
              Como funciona
            </a>
            <a
              href="#possibilidades"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-white/5 hover:text-cyan-300"
            >
              Várias Possibilidades
            </a>
            <a
              href="#beneficios"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-white/5 hover:text-cyan-300"
            >
              Benefícios da Placa
            </a>
            <a
              href="#segmentos"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-white/5 hover:text-cyan-300"
            >
              Segmentos Atendidos
            </a>
            <a
              href="#faq"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-white/5 hover:text-cyan-300"
            >
              Dúvidas Frequentes
            </a>
            <Link
              href="/demo"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-white/5 text-cyan-400 font-bold flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Simulação Interativa de Vendas</span>
            </Link>
          </nav>
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="w-full text-center py-2.5 text-xs font-bold text-slate-300 border border-white/15 rounded-xl hover:bg-white/5"
            >
              Área do Lojista
            </Link>
            <button
              onClick={() => {
                setMobileOpen(false);
                if (onOpenReserve) onOpenReserve();
              }}
              className="w-full text-center py-3 text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 fill-white/20" />
              <span>Fale pelo WhatsApp • R$ 79,90</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
