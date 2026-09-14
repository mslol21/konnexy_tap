import React from "react";
import Link from "next/link";
import { AlertCircle, Clock, ShieldAlert, ArrowLeft, HelpCircle } from "lucide-react";
import Logo from "@/components/brand/Logo";

interface StatusPageProps {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ reason?: string }>;
}

export default async function PlateStatusPage({ params, searchParams }: StatusPageProps) {
  const { code } = await params;
  const { reason } = await searchParams;

  const normalizedCode = (code || "").toUpperCase();

  const getStatusInfo = () => {
    switch (reason) {
      case "pending":
        return {
          icon: <Clock className="w-12 h-12 text-amber-500 mx-auto animate-pulse" />,
          badge: "Em Configuração",
          badgeColor: "bg-amber-100 text-amber-900 border-amber-200",
          title: "Placa em Processo de Ativação",
          desc: `A placa ${normalizedCode} foi cadastrada e está sendo vinculada ao Perfil de Avaliações no Google da empresa. Em breve estará ativa para uso no balcão.`,
        };
      case "inactive":
        return {
          icon: <AlertCircle className="w-12 h-12 text-slate-400 mx-auto" />,
          badge: "Temporariamente Desativada",
          badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
          title: "Placa Desativada",
          desc: `Esta placa física (${normalizedCode}) está temporariamente inativa pelo responsável do estabelecimento.`,
        };
      case "suspended":
        return {
          icon: <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />,
          badge: "Acesso Suspenso",
          badgeColor: "bg-rose-100 text-rose-900 border-rose-200",
          title: "Placa Suspensa Administrativamente",
          desc: `O redirecionamento da placa ${normalizedCode} foi pausado pela administração.`,
        };
      case "invalid_destination":
        return {
          icon: <AlertCircle className="w-12 h-12 text-amber-600 mx-auto" />,
          badge: "Destino Não Configurado",
          badgeColor: "bg-amber-100 text-amber-900 border-amber-200",
          title: "Link de Avaliação Não Localizado",
          desc: `O link oficial de avaliações do Google desta placa ainda não foi informado ou não passou nos critérios de validação de segurança.`,
        };
      case "not_found":
      default:
        return {
          icon: <HelpCircle className="w-12 h-12 text-slate-400 mx-auto" />,
          badge: "Não Identificada",
          badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
          title: "Placa Não Encontrada",
          desc: `O código informado (${normalizedCode}) não foi localizado no sistema da Otimiza Meu Negócio. Verifique o código impresso na placa.`,
        };
    }
  };

  const info = getStatusInfo();

  return (
    <main className="min-h-screen bg-[#F7F5F2] flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white text-[#20252A] rounded-3xl p-8 shadow-md border border-[#E8E3DD] text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Logo */}
        <div className="flex justify-center mb-2">
          <Logo theme="light" size="md" showTagline={false} />
        </div>

        {/* Ícone e Badge */}
        <div>
          {info.icon}
          <div className="mt-4">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${info.badgeColor}`}>
              {info.badge}
            </span>
          </div>
        </div>

        {/* Título e Explicação */}
        <div className="space-y-2">
          <h1 className="text-xl font-extrabold text-[#20252A] tracking-tight">
            {info.title}
          </h1>
          <p className="text-xs text-[#6D7277] leading-relaxed max-w-xs mx-auto">
            {info.desc}
          </p>
        </div>

        {/* Informação do Código */}
        <div className="p-3 bg-[#F7F5F2] rounded-xl border border-[#E8E3DD] text-xs font-mono font-bold text-[#30363D]">
          Código da Placa: {normalizedCode}
        </div>

        {/* Ação */}
        <div className="pt-2 border-t border-[#E8E3DD]">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C78D4E] hover:text-[#D8A66C]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Conhecer a Otimiza Meu Negócio</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
