import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Konnexy Tap | Um toque conecta seu cliente ao seu negócio",
  description: "Transforme seu balcão em um ponto digital para avaliações no Google, WhatsApp, promoções, cardápio e fidelização de clientes com placa física NFC + QR Code.",
  keywords: ["NFC", "QR Code", "Google Reviews", "Fidelização", "Cardápio Digital", "Konnexy Tap", "Comércio Local"],
  authors: [{ name: "Konnexy Tap" }],
  openGraph: {
    title: "Konnexy Tap | Um toque conecta seu cliente ao seu negócio",
    description: "Placa NFC + QR Code inteligente para pequenos e médios estabelecimentos comerciais.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-gold-200 selection:text-navy-950">
        {children}
      </body>
    </html>
  );
}
