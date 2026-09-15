import { NextResponse } from "next/server";

/**
 * Recurso de Fase 2. Mantido como rota reservada, porém indisponível no MVP
 * para evitar coleta de dados pessoais antes da validação comercial.
 */
export async function POST() {
  return NextResponse.json(
    { error: "Recurso ainda não disponível." },
    { status: 404 }
  );
}
