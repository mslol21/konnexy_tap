import React from "react";
import Link from "next/link";

export interface LogoProps {
  theme?: "light" | "dark";
  size?: "sm" | "md" | "lg" | "xl";
  badge?: string;
  href?: string;
  className?: string;
  showTagline?: boolean;
}

/**
 * Símbolo vetorial para casos onde SVG puro é necessário
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
        <linearGradient id="otmCopperGrad" x1="15%" y1="15%" x2="85%" y2="85%">
          <stop offset="0%" stopColor="#D9945F" />
          <stop offset="45%" stopColor="#BD7B48" />
          <stop offset="100%" stopColor="#8C4E24" />
        </linearGradient>
        <mask id="pinHoleMask">
          <rect width="100" height="100" fill="white" />
          <circle cx="44" cy="42" r="15" fill="black" />
        </mask>
      </defs>

      <g mask="url(#pinHoleMask)">
        <path
          d="M 44 88 C 44 88 15 58 15 42 C 15 25.98 27.98 13 44 13 C 60.02 13 73 25.98 73 42 C 73 58 44 88 44 88 Z"
          fill="url(#otmCopperGrad)"
        />
        <path
          d="M 44 88 C 50 78 73 54 73 42 C 73 39 72.5 36 71.5 33 L 44 60 Z"
          fill={facetFill}
          opacity="0.9"
        />
      </g>

      <path
        d="M 85 15 L 61 21 L 67 27 L 33 61 L 39 67 L 73 33 L 79 39 Z"
        fill={arrowFill}
      />
      <path
        d="M 85 15 L 79 39 L 73 33 L 39 67 L 36 64 L 70 30 Z"
        fill="black"
        opacity={isDark ? "0.15" : "0.22"}
      />
    </svg>
  );
}

/**
 * Logo Oficial da Otimiza Meu Negócio:
 * Utiliza a imagem oficial completa de alta resolução (símbolo 3D + escrita OTIMIZA MEU NEGÓCIO chanfrada em aço grafite metálico com sombra e acabamento idêntico à imagem de referência).
 */
export default function Logo({
  theme = "light",
  size = "md",
  badge,
  href = "/",
  className = "",
}: LogoProps) {
  const isDark = theme === "dark";

  // Dimensões aumentadas e calibradas com aspect ratio 2.07:1
  const sizeClasses = {
    sm: "h-10 sm:h-11 w-auto",
    md: "h-14 sm:h-16 md:h-18 w-auto", // VISIVELMENTE MAIOR E DESTACADA!
    lg: "h-20 sm:h-24 w-auto",
    xl: "h-28 sm:h-32 w-auto",
  }[size];

  const content = (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {isDark ? (
        <div className="p-2 sm:p-2.5 rounded-2xl bg-white/95 backdrop-blur-md shadow-xs border border-white/20 inline-flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/logo.png"
            alt="Otimiza Meu Negócio"
            className={`${sizeClasses} object-contain`}
            loading="eager"
          />
        </div>
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src="/brand/logo.png"
          alt="Otimiza Meu Negócio"
          className={`${sizeClasses} object-contain transition-transform duration-200 group-hover:scale-[1.02]`}
          loading="eager"
        />
      )}

      {badge && (
        <span
          className={`font-bold uppercase rounded-md px-2 py-0.5 text-[10px] ${
            isDark
              ? "bg-[#BD7B48]/20 text-[#D9945F] border border-[#BD7B48]/40"
              : "bg-[#BD7B48]/10 text-[#BD7B48] border border-[#BD7B48]/30"
          }`}
        >
          {badge}
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center focus:outline-none group">
        {content}
      </Link>
    );
  }

  return content;
}

// Backward compatibility alias
export const KonnexyWaveIcon = OtimizaIcon;
