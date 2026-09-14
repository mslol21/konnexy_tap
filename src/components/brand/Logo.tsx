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

export function OtimizaIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="otmIconGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D8A66C" />
          <stop offset="100%" stopColor="#C78D4E" />
        </linearGradient>
      </defs>
      {/* Base de Localização em Grafite */}
      <path
        d="M 50 12 C 34 12 22 24 22 40 C 22 62 48 86 50 88 C 52 86 78 62 78 40 C 78 24 66 12 50 12 Z"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Checkmark e Seta de Crescimento Ascendente em Dourado/Bronze */}
      <path
        d="M 36 44 L 46 54 L 64 34"
        stroke="url(#otmIconGold)"
        strokeWidth="7.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M 56 34 L 64 34 L 64 42"
        stroke="url(#otmIconGold)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
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
}: LogoProps) {
  const sizeConfig = {
    sm: {
      iconBox: "w-8 h-8 rounded-lg",
      icon: "w-5 h-5",
      title: "text-base tracking-tight leading-none",
      subtitle: "text-[9px] tracking-[0.18em]",
      badge: "text-[9px] px-2 py-0.5",
    },
    md: {
      iconBox: "w-10 h-10 rounded-xl",
      icon: "w-6 h-6",
      title: "text-lg tracking-tight leading-none",
      subtitle: "text-[10px] tracking-[0.2em]",
      badge: "text-[10px] px-2.5 py-0.5",
    },
    lg: {
      iconBox: "w-12 h-12 rounded-2xl",
      icon: "w-7 h-7",
      title: "text-2xl tracking-tight leading-none",
      subtitle: "text-xs tracking-[0.22em]",
      badge: "text-xs px-3 py-1",
    },
  }[size];

  const content = (
    <div className={`inline-flex items-center gap-2.5 group select-none ${className}`}>
      {/* Símbolo com fundo contrastante suave */}
      <div
        className={`${sizeConfig.iconBox} ${
          theme === "dark"
            ? "bg-[#20252A] border border-white/10 text-white"
            : "bg-[#F7F5F2] border border-[#E8E3DD] text-[#30363D]"
        } flex items-center justify-center shrink-0 shadow-xs group-hover:border-[#C78D4E]/50 transition-colors`}
      >
        <OtimizaIcon className={sizeConfig.icon} />
      </div>

      {/* Tipografia */}
      <div className="flex flex-col justify-center text-left">
        <div className="flex items-center gap-2">
          <span
            className={`font-black ${sizeConfig.title} ${
              theme === "dark" ? "text-white" : "text-[#20252A]"
            }`}
          >
            OTIMIZA
          </span>

          {badge && (
            <span
              className={`font-bold uppercase rounded-full ${sizeConfig.badge} ${
                theme === "dark"
                  ? "bg-[#C78D4E]/20 text-[#D8A66C] border border-[#C78D4E]/40"
                  : "bg-[#C78D4E]/10 text-[#C78D4E] border border-[#C78D4E]/30"
              }`}
            >
              {badge}
            </span>
          )}
        </div>
        <span
          className={`font-extrabold uppercase ${sizeConfig.subtitle} ${
            theme === "dark" ? "text-[#D8A66C]" : "text-[#C78D4E]"
          } mt-0.5`}
        >
          MEU NEGÓCIO
        </span>
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
