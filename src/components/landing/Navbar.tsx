"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight, Sparkles } from "lucide-react";
import Logo from "@/components/brand/Logo";

interface NavbarProps {
  onOpenReserve?: () => void;
}

export default function Navbar({ onOpenReserve }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E5E1D8] transition-all">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-12 h-20 sm:h-24 flex items-center justify-between">
        {/* Logo Oficial Ampliada com Escrita 3D Idêntica à Referência */}
        <div className="flex items-center py-2">
          <Logo theme="light" size="md" />
        </div>

        {/* Links Desktop */}
        <nav className="hidden md:flex items-center gap-6 text-[14px] font-semibold text-[#242A30]">
          <a href="#como-funciona" className="hover:text-[#BD7B48] transition-colors">
            Como funciona
          </a>
          <a href="#para-quem-e" className="hover:text-[#BD7B48] transition-colors">
            Para quem é
          </a>
          <a href="#beneficios" className="hover:text-[#BD7B48] transition-colors">
            Benefícios
          </a>
          <a href="#diferencial" className="hover:text-[#BD7B48] transition-colors">
            Diferencial
          </a>
          <a href="#preco" className="hover:text-[#BD7B48] transition-colors">
            Preço
          </a>
          <a href="#duvidas" className="hover:text-[#BD7B48] transition-colors">
            Dúvidas
          </a>
          <Link
            href="/demo"
            className="text-[#BD7B48] hover:text-[#D9945F] transition-colors flex items-center gap-1.5 font-bold text-xs bg-[#F5F3EF] px-3 py-1.5 rounded-full border border-[#E5E1D8]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ver Demonstração</span>
          </Link>
        </nav>

        {/* Ações Desktop */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-xs font-bold text-[#666E7A] hover:text-[#242A30] px-3 py-2 transition-colors"
          >
            Área do Cliente
          </Link>
          <button
            onClick={onOpenReserve}
            className="text-xs font-bold bg-[#242A30] hover:bg-[#363E48] text-white px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer border border-[#242A30] active:scale-95"
          >
            <span>Quero minha placa</span>
            <ArrowRight className="w-4 h-4 text-[#BD7B48]" />
          </button>
        </div>

        {/* Botão Mobile */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-[#30363D] hover:text-[#20252A] rounded-lg focus:outline-none"
          aria-label="Abrir menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Menu Mobile */}
      {mobileOpen && (
        <div className="md:hidden bg-[#FFFFFF] border-b border-[#E8E3DD] px-5 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200 shadow-xl">
          <nav className="flex flex-col space-y-2 text-sm font-medium text-[#30363D]">
            <a
              href="#como-funciona"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2.5 rounded-lg hover:bg-[#F7F5F2] hover:text-[#C78D4E]"
            >
              Como funciona
            </a>
            <a
              href="#para-quem-e"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2.5 rounded-lg hover:bg-[#F7F5F2] hover:text-[#C78D4E]"
            >
              Para quem é
            </a>
            <a
              href="#beneficios"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2.5 rounded-lg hover:bg-[#F7F5F2] hover:text-[#C78D4E]"
            >
              Benefícios da Placa
            </a>
            <a
              href="#diferencial"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2.5 rounded-lg hover:bg-[#F7F5F2] hover:text-[#C78D4E]"
            >
              Diferencial da Placa
            </a>
            <a
              href="#preco"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2.5 rounded-lg hover:bg-[#F7F5F2] hover:text-[#C78D4E]"
            >
              Preço e Reserva
            </a>
            <a
              href="#duvidas"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2.5 rounded-lg hover:bg-[#F7F5F2] hover:text-[#C78D4E]"
            >
              Dúvidas Frequentes
            </a>
            <Link
              href="/demo"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2.5 rounded-lg hover:bg-[#F7F5F2] text-[#C78D4E] font-semibold flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ver Demonstração</span>
            </Link>
          </nav>
          <div className="pt-3 border-t border-[#E8E3DD] flex flex-col gap-2.5">
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="w-full text-center py-2.5 text-sm font-semibold text-[#30363D] border border-[#E8E3DD] rounded-xl hover:bg-[#F7F5F2]"
            >
              Área do Cliente
            </Link>
            <button
              onClick={() => {
                setMobileOpen(false);
                if (onOpenReserve) onOpenReserve();
              }}
              className="w-full text-center py-3 text-sm font-semibold bg-[#20252A] text-white rounded-xl shadow-sm flex items-center justify-center gap-2"
            >
              <span>Quero minha placa • R$ 79,90</span>
              <ArrowRight className="w-4 h-4 text-[#C78D4E]" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
