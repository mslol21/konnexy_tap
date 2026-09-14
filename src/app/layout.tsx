import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Otimiza Meu Negócio | Avaliações e Presença no Google",
  description: "Transforme bons atendimentos em avaliações no Google. Placa inteligente NFC + QR Code configurada para sua empresa, sem mensalidade obrigatória.",
  keywords: ["Otimiza Meu Negócio", "Placa de Avaliação Google", "NFC Google Reviews", "Avaliações no Google", "Presença Digital Negócios Locais", "Placa Inteligente"],
  authors: [{ name: "Otimiza Meu Negócio" }],
  openGraph: {
    title: "Otimiza Meu Negócio | Avaliações e Presença no Google",
    description: "Facilite as avaliações dos seus clientes com nossa placa inteligente NFC + QR Code configurada para sua empresa.",
    type: "website",
    locale: "pt_BR",
    siteName: "Otimiza Meu Negócio",
  },
  themeColor: "#30363D",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-[#F7F5F2] text-[#20252A] font-sans selection:bg-[#C78D4E] selection:text-white">
        {children}
      </body>
    </html>
  );
}
