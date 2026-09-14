import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

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
  icons: {
    icon: "/brand/icon.png",
    shortcut: "/brand/icon.png",
    apple: "/brand/icon.png",
  },
  themeColor: "#242A30",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={fontSans.className}>
      <body className={`${fontSans.className} min-h-screen bg-[#F7F5F2] text-[#20252A] font-sans antialiased selection:bg-[#C78D4E] selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
