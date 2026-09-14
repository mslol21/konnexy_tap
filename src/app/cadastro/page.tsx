"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, MessageCircle, CheckCircle2 } from "lucide-react";
import ReserveModal from "@/components/landing/ReserveModal";
import Logo from "@/components/brand/Logo";

export default function CadastroRestritoPage() {
  const [reserveModalOpen, setReserveModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden text-slate-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 text-center">
        <div className="flex justify-center mb-6">
          <Logo theme="dark" size="lg" showTagline={true} badge="Reviews" />
        </div>

        <div className="bg-white text-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-200 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-gold-50 text-gold-700 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6 text-gold-600" />
          </div>

          <div className="inline-block px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold uppercase tracking-wider">
            Primeiro Lote Exclusivo
          </div>

          <h2 className="text-xl font-black text-navy-950 tracking-tight">
            Cadastro Mediante Aquisição da Placa
          </h2>

          <p className="text-xs text-slate-600 leading-relaxed">
            Nesta primeira fase de lançamento, o cadastro de novos estabelecimentos é realizado diretamente pela nossa equipe técnica ao configurar a sua placa física com o link oficial do Google da sua empresa.
          </p>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 text-left space-y-1.5">
            <div className="font-bold text-navy-950">Como funciona para participar:</div>
            <div className="flex items-center gap-2 text-[11px] text-slate-600">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>1. Reserve sua placa física por R$ 79,90 (pagamento único)</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-600">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>2. Nossa equipe vincula o Perfil da sua Empresa no Google</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-600">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>3. Você recebe a placa física pronta para o balcão e seu acesso</span>
            </div>
          </div>

          <div className="pt-2 space-y-2">
            <button
              onClick={() => setReserveModalOpen(true)}
              className="w-full py-3 px-4 bg-navy-950 hover:bg-navy-900 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Reservar Minha Placa Agora</span>
            </button>

            <Link
              href="/login"
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1"
            >
              <span>Já possui placa? Acessar Login</span>
            </Link>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-navy-950"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar para a página inicial</span>
            </Link>
          </div>
        </div>
      </div>

      <ReserveModal
        isOpen={reserveModalOpen}
        onClose={() => setReserveModalOpen(false)}
      />
    </div>
  );
}
