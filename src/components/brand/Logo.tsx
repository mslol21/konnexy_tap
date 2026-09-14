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
 * OtimizaIcon — Replicação fiel do símbolo oficial da Otimiza Meu Negócio:
 * Pin de localização em bronze/ouro + seta ascendente em grafite escuro.
 */
export function OtimizaIcon({ className = "w-8 h-8", theme = "light" }: { className?: string; theme?: "light" | "dark" }) {
  const arrowColor = theme === "dark" ? "#FFFFFF" : "#20252A";

  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="pinGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D8A66C" />
          <stop offset="60%" stopColor="#C78D4E" />
          <stop offset="100%" stopColor="#B8793A" />
        </linearGradient>
      </defs>

      {/* Anel externo do pin — elipse dourada */}
      <ellipse
        cx="54"
        cy="48"
        rx="32"
        ry="32"
        fill="url(#pinGold)"
      />

      {/* Buraco interno do anel (recorte) */}
      <ellipse
        cx="54"
        cy="48"
        rx="20"
        ry="20"
        fill="white"
      />

      {/* Ponta inferior do pin */}
      <path
        d="M 40 72 L 54 100 L 68 72 Q 54 80 40 72 Z"
        fill="url(#pinGold)"
      />

      {/* Seta ascendente em grafite escuro — corpo diagonal */}
      <path
        d="M 36 72 L 80 28"
        stroke={arrowColor}
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Ponta da seta — horizontal */}
      <path
        d="M 64 28 L 80 28"
        stroke={arrowColor}
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Ponta da seta — vertical */}
      <path
        d="M 80 28 L 80 44"
        stroke={arrowColor}
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
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
  const sizeConfig = {
    sm: {
      icon: "w-8 h-8",
      title: "text-sm font-black tracking-tight leading-none",
      subtitle: "text-[8px] tracking-[0.12em] font-bold",
      tagline: "text-[7px] tracking-[0.08em]",
      gap: "gap-2",
    },
    md: {
      icon: "w-10 h-10",
      title: "text-lg font-black tracking-tight leading-none",
      subtitle: "text-[10px] tracking-[0.15em] font-bold",
      tagline: "text-[8.5px] tracking-[0.1em]",
      gap: "gap-2.5",
    },
    lg: {
      icon: "w-14 h-14",
      title: "text-2xl font-black tracking-tight leading-none",
      subtitle: "text-xs tracking-[0.18em] font-bold",
      tagline: "text-[10px] tracking-[0.1em]",
      gap: "gap-3",
    },
  }[size];

  const content = (
    <div className={`inline-flex items-center ${sizeConfig.gap} group select-none ${className}`}>
      {/* Símbolo */}
      <div className="shrink-0">
        <OtimizaIcon className={sizeConfig.icon} theme={theme} />
      </div>

      {/* Tipografia */}
      <div className="flex flex-col justify-center text-left">
        {/* Linha 1: OTIMIZA + badge opcional */}
        <div className="flex items-center gap-2">
          <span
            className={`${sizeConfig.title} ${
              theme === "dark" ? "text-white" : "text-[#20252A]"
            }`}
          >
            OTIMIZA
          </span>

          {badge && (
            <span
              className={`font-bold uppercase rounded-full px-2 py-0.5 text-[9px] ${
                theme === "dark"
                  ? "bg-[#C78D4E]/20 text-[#D8A66C] border border-[#C78D4E]/40"
                  : "bg-[#C78D4E]/10 text-[#C78D4E] border border-[#C78D4E]/30"
              }`}
            >
              {badge}
            </span>
          )}
        </div>

        {/* Linha 2: MEU NEGÓCIO em bronze */}
        <span
          className={`${sizeConfig.subtitle} uppercase ${
            theme === "dark" ? "text-[#D8A66C]" : "text-[#C78D4E]"
          } mt-0.5`}
        >
          MEU NEGÓCIO
        </span>

        {/* Linha 3: Tagline opcional */}
        {showTagline && (
          <span
            className={`${sizeConfig.tagline} uppercase mt-1 ${
              theme === "dark" ? "text-[#9BA3AB]" : "text-[#6D7277]"
            }`}
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
