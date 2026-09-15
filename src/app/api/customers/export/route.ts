import { NextResponse } from "next/server";

/**
 * Exportação de clientes pertence à Fase 2 e fica indisponível no MVP.
 * Evita expor dados fictícios como se fossem dados reais e reduz a superfície pública.
 */
export async function GET() {
  return NextResponse.json(
    { error: "Recurso ainda não disponível." },
    { status: 404 }
  );
}
