import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Otimiza Meu Negócio",
    short_name: "Otimiza",
    description: "Gestão de placas inteligentes, avaliações e presença digital para negócios locais.",
    start_url: "/login",
    display: "standalone",
    background_color: "#20252A",
    theme_color: "#20252A",
    orientation: "portrait",
    icons: [
      { src: "/brand/icon.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/icon.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
