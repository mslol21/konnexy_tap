import React from "react";
import Link from "next/link";

export interface LogoProps {
  theme?: "light" | "dark";
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  badge?: string;
  href?: string;
  className?: string;
}

export function KonnexyWaveIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="kxWaveGradLocal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00D2FF" />
          <stop offset="100%" stopColor="#0066FF" />
        </linearGradient>
      </defs>
      {/* Onda Superior */}
      <path
        d="M 23 40 A 38 38 0 0 1 77 40"
        stroke="url(#kxWaveGradLocal)"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />
      {/* Onda Média */}
      <path
        d="M 33 52 A 25 25 0 0 1 67 52"
        stroke="url(#kxWaveGradLocal)"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />
      {/* Onda Inferior */}
      <path
        d="M 43 64 A 12 12 0 0 1 57 64"
        stroke="url(#kxWaveGradLocal)"
        strokeWidth="6.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Ponto Central */}
      <circle
        cx="50"
        cy="75"
        r="4"
        fill="url(#kxWaveGradLocal)"
      />
    </svg>
  );
}

export default function Logo({
  theme = "light",
  size = "md",
  showTagline = false,
  badge,
  href = "/",
  className = "",
}: LogoProps) {
  // Configurações de dimensão (+25% de escala)
  const sizeConfig = {
    sm: {
      iconBox: "w-9 h-9 rounded-xl",
      icon: "w-5 h-5",
      title: "text-lg tracking-tight",
      badge: "text-[10px] px-2 py-0.5",
      tagline: "text-[8.5px] tracking-[0.2em] -mt-0.5",
    },
    md: {
      iconBox: "w-12 h-12 rounded-2xl",
      icon: "w-7 h-7",
      title: "text-xl sm:text-2xl tracking-tight",
      badge: "text-xs px-2.5 py-0.5",
      tagline: "text-[10px] tracking-[0.22em] -mt-0.5",
    },
    lg: {
      iconBox: "w-16 h-16 rounded-2xl",
      icon: "w-9 h-9",
      title: "text-3xl sm:text-4xl tracking-tight",
      badge: "text-sm px-3 py-1",
      tagline: "text-xs tracking-[0.25em] mt-0.5",
    },
    xl: {
      iconBox: "w-20 h-20 rounded-3xl",
      icon: "w-12 h-12",
      title: "text-4xl sm:text-5xl tracking-tight",
      badge: "text-base px-3.5 py-1",
      tagline: "text-sm tracking-[0.28em] mt-1",
    },
  }[size];

  const content = (
    <div className={`flex items-center gap-3 group select-none ${className}`}>
      {/* Ícone Squircle Escuro com Ondas Ciano/Azul */}
      <div
        className={`${sizeConfig.iconBox} bg-gradient-to-b from-[#0e1628] to-[#050811] border border-white/10 shadow-md flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200`}
      >
        <KonnexyWaveIcon className={sizeConfig.icon} />
      </div>

      {/* Tipografia da Marca */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span
            className={`font-black ${sizeConfig.title} ${
              theme === "dark" ? "text-white" : "text-[#0F172A]"
            }`}
          >
            Konnexy
            <span className="italic bg-gradient-to-r from-[#00D2FF] to-[#0066FF] bg-clip-text text-transparent font-black ml-0.5">
              Tap
            </span>
          </span>

          {badge && (
            <span
              className={`font-extrabold uppercase rounded-full ${sizeConfig.badge} ${
                badge.toLowerCase() === "reviews"
                  ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20"
                  : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
              }`}
            >
              {badge}
            </span>
          )}
        </div>

        {showTagline && (
          <span
            className={`font-bold uppercase ${sizeConfig.tagline} ${
              theme === "dark" ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Conexões que geram resultados
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
