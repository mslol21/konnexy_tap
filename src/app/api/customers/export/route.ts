import { NextResponse } from "next/server";
import { DEMO_CUSTOMERS } from "@/lib/mock-data";

export async function GET() {
  // Gera arquivo CSV formatado para download compatível com Excel / Google Sheets
  const headers = ["Nome", "WhatsApp", "Data de Nascimento", "Consentimento LGPD", "Data de Consentimento", "Origem"];
  
  const rows = DEMO_CUSTOMERS.map((c) => [
    `"${c.name}"`,
    `"${c.phone}"`,
    `"${c.birth_date || 'Não informado'}"`,
    `"Sim (Consentimento Explícito)"`,
    `"${new Date(c.consent.consent_at).toLocaleDateString('pt-BR')}"`,
    `"${c.consent.source === 'nfc_tap' ? 'Aproximação NFC' : 'QR Code Balcão'}"`
  ]);

  const csvContent = [headers.join(";"), ...rows.map(r => r.join(";"))].join("\n");

  return new NextResponse(csvContent, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="clientes-konnexy-tap-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
