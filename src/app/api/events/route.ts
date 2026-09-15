import { NextResponse } from "next/server";

/**
 * Desativado no MVP.
 * A telemetria legítima da placa é registrada exclusivamente no servidor
 * pelo fluxo /t/[code], evitando que clientes fabriquem eventos arbitrários.
 */
export async function POST() {
  return NextResponse.json(
    { error: "Endpoint desativado no MVP." },
    { status: 410 }
  );
}
