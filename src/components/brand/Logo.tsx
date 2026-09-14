import React from "react";
import Link from "next/link";

export interface LogoProps {
  theme?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  badge?: string;
  href?: string;
  className?: string;
  showTagline?: boolean;
}

/**
 * OtimizaIcon — Replicação fiel em alta definição vetorial do símbolo oficial da Otimiza Meu Negócio:
 * - Pin de localização com loop superior em bronze/ouro metálico e faceta inferior em grafite escuro.
 * - Seta ascendente em grafite escuro (ou branca no dark) transpassando o anel e apontando para o topo direito (45°).
 * - Fundo do anel 100% transparente (sem círculos brancos artificiais).
 */
export function OtimizaIcon({
  className = "w-8 h-8",
  theme = "light",
}: {
  className?: string;
  theme?: "light" | "dark";
}) {
  const isDark = theme === "dark";
  const arrowFill = isDark ? "#FFFFFF" : "#242A30";
  const facetFill = isDark ? "#181C21" : "#242A30";

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Otimiza Meu Negócio"
    >
      <defs>
        {/* Gradiente cobre/bronze metálico idêntico à placa oficial */}
        <linearGradient id="otmCopperGrad" x1="15%" y1="15%" x2="85%" y2="85%">
          <stop offset="0%" stopColor="#D9945F" />
          <stop offset="45%" stopColor="#BD7B48" />
          <stop offset="100%" stopColor="#8C4E24" />
        </linearGradient>

        {/* Máscara de recorte do furo do pin */}
        <mask id="pinHoleMask">
          <rect width="100" height="100" fill="white" />
          <circle cx="44" cy="42" r="15" fill="black" />
        </mask>
      </defs>

      {/* Símbolo agrupado */}
      <g mask="url(#pinHoleMask)">
        {/* Corpo principal do pin em gradiente cobre/bronze */}
        <path
          d="M 44 88 C 44 88 15 58 15 42 C 15 25.98 27.98 13 44 13 C 60.02 13 73 25.98 73 42 C 73 58 44 88 44 88 Z"
          fill="url(#otmCopperGrad)"
        />

        {/* Faceta de sombra inferior direita em grafite metálico */}
        <path
          d="M 44 88 C 50 78 73 54 73 42 C 73 39 72.5 36 71.5 33 L 44 60 Z"
          fill={facetFill}
          opacity="0.9"
        />
      </g>

      {/* Seta Ascendente 3D em Grafite Escuro (apontando ↗ a 45°) */}
      <path
        d="M 85 15 L 61 21 L 67 27 L 33 61 L 39 67 L 73 33 L 79 39 Z"
        fill={arrowFill}
      />
      {/* Detalhe de vinco/chanfro sutil na seta para profundidade */}
      <path
        d="M 85 15 L 79 39 L 73 33 L 39 67 L 36 64 L 70 30 Z"
        fill="black"
        opacity={isDark ? "0.15" : "0.22"}
      />
    </svg>
  );
}

export default function Logo({
  theme = "light",
  size = "md",
  badge,
  href = "/",
  className = "",
  showTagline = false,
}: LogoProps) {
  const isDark = theme === "dark";

  const sizeConfig = {
    sm: {
      icon: "w-7 h-7",
      title: "text-sm font-extrabold tracking-tight leading-none",
      subtitle: "text-[9px] tracking-[0.14em] font-extrabold leading-none",
      tagline: "text-[7.5px] tracking-[0.08em] font-semibold",
      gap: "gap-2",
    },
    md: {
      icon: "w-9 h-9 sm:w-10 sm:h-10",
      title: "text-[17px] sm:text-[19px] font-extrabold tracking-tight leading-none",
      subtitle: "text-[10px] sm:text-[11px] tracking-[0.16em] font-extrabold leading-none",
      tagline: "text-[8.5px] sm:text-[9px] tracking-[0.1em] font-semibold",
      gap: "gap-2.5",
    },
    lg: {
      icon: "w-12 h-12",
      title: "text-2xl font-extrabold tracking-tight leading-none",
      subtitle: "text-xs tracking-[0.18em] font-extrabold leading-none",
      tagline: "text-[10px] tracking-[0.1em] font-semibold",
      gap: "gap-3",
    },
  }[size];

  const content = (
    <div className={`inline-flex items-center ${sizeConfig.gap} group select-none ${className}`}>
      {/* Símbolo de alta fidelidade */}
      <div className="shrink-0 flex items-center justify-center">
        <OtimizaIcon className={sizeConfig.icon} theme={theme} />
      </div>

      {/* Tipografia Oficial */}
      <div className="flex flex-col justify-center text-left">
        {/* Linha 1: OTIMIZA */}
        <div className="flex items-center gap-2">
          <span
            className={`${sizeConfig.title} ${
              isDark ? "text-white" : "text-[#20252A]"
            }`}
          >
            OTIMIZA
          </span>

          {badge && (
            <span
              className={`font-bold uppercase rounded-md px-1.5 py-0.5 text-[9px] ${
                isDark
                  ? "bg-[#C78D4E]/20 text-[#D8A66C] border border-[#C78D4E]/40"
                  : "bg-[#C78D4E]/10 text-[#C78D4E] border border-[#C78D4E]/30"
              }`}
            >
              {badge}
            </span>
          )}
        </div>

        {/* Linha 2: MEU NEGÓCIO (Grafite elegante como na logo original) */}
        <span
          className={`${sizeConfig.subtitle} uppercase ${
            isDark ? "text-slate-200" : "text-[#20252A]"
          } mt-1`}
        >
          MEU NEGÓCIO
        </span>

        {/* Linha 3: Tagline oficial (apenas quando solicitado e com espaço) */}
        {showTagline && (
          <span
            className={`${sizeConfig.tagline} uppercase text-[#C78D4E] mt-1 whitespace-nowrap`}
          >
            Agência Especialista em Alavancar Empresas no Google
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
}

// Backward compatibility alias
export const KonnexyWaveIcon = OtimizaIcon;
