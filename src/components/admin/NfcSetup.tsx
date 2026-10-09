"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Radio, ScanLine } from "lucide-react";
import { nfcErrorMessage, nfcReaderConstructor, verifyNfcUrl, writeNfcUrl } from "@/lib/web-nfc";

export default function NfcSetup({ url }: { url: string }) {
  const [supported, setSupported] = useState(false);
  const [busy, setBusy] = useState(false);
  const [overwrite, setOverwrite] = useState(false);
  const [message, setMessage] = useState("Cadastre a placa, grave o link na tag e depois confira a gravação.");
  const [error, setError] = useState(false);
  const operation = useRef<AbortController | null>(null);

  useEffect(() => {
    setSupported(Boolean(nfcReaderConstructor()));
    return () => { operation.current?.abort(); operation.current = null; };
  }, []);

  const run = async (mode: "write" | "verify") => {
    if (operation.current) return;
    const Reader = nfcReaderConstructor();
    if (!Reader) return;
    const controller = new AbortController();
    operation.current = controller;
    setBusy(true);
    setError(false);
    setMessage(mode === "write" ? "Aproxime a tag e mantenha-a encostada até confirmar a gravação." : "Afaste e aproxime a tag para conferir o link gravado.");
    let timedOut = false;
    const timeout = window.setTimeout(() => { timedOut = true; controller.abort(); }, 45000);
    try {
      const reader = new Reader();
      if (mode === "write") {
        await writeNfcUrl(reader, url, controller.signal, overwrite);
        if (operation.current === controller) setMessage("Link gravado. Agora clique em Conferir tag para validar o conteúdo.");
      } else {
        const serial = await verifyNfcUrl(reader, url, controller.signal);
        if (operation.current === controller) setMessage(`Tag conferida: o link corresponde a esta placa.${serial ? ` Número lido: ${serial}.` : ""} Use Testar para verificar o destino.`);
      }
    } catch (cause) {
      if (operation.current === controller) {
        setError(!controller.signal.aborted || timedOut);
        setMessage(controller.signal.aborted ? (timedOut ? "Tempo esgotado. Aproxime a tag e tente novamente." : "Operação cancelada.") : nfcErrorMessage(cause));
      }
    } finally {
      window.clearTimeout(timeout);
      controller.abort();
      if (operation.current === controller) { operation.current = null; setBusy(false); }
    }
  };

  return (
    <section className="p-4 rounded-2xl bg-slate-900 border border-slate-700 space-y-3" aria-label="Configuração da tag NFC">
      <h3 className="text-sm font-bold text-white flex items-center gap-2"><Radio className="w-4 h-4 text-gold-400" /> Configurar tag NFC</h3>
      <p className="text-xs text-slate-300">No Chrome para Android, ative o NFC e abra este painel por HTTPS. Use uma tag NDEF gravável.</p>
      {supported ? (
        <>
          <label className="flex items-start gap-2 text-xs text-slate-300"><input type="checkbox" checked={overwrite} disabled={busy} onChange={(event) => setOverwrite(event.target.checked)} className="mt-0.5" /> Substituir o conteúdo existente da tag ao gravar. Deixe desmarcado para proteger tags já utilizadas.</label>
          <div className="flex flex-wrap gap-2">
            <button type="button" disabled={busy} onClick={() => void run("write")} className="min-h-11 px-4 rounded-xl bg-gold-500 text-navy-950 text-xs font-bold disabled:opacity-50 flex items-center gap-2"><Radio className="w-4 h-4" /> Gravar NFC</button>
            <button type="button" disabled={busy} onClick={() => void run("verify")} className="min-h-11 px-4 rounded-xl bg-slate-700 text-white text-xs font-bold disabled:opacity-50 flex items-center gap-2"><ScanLine className="w-4 h-4" /> Conferir tag</button>
            {busy ? <button type="button" onClick={() => operation.current?.abort()} className="min-h-11 px-4 rounded-xl border border-slate-600 text-white text-xs font-bold">Cancelar</button> : null}
          </div>
          <p role={error ? "alert" : "status"} className={`text-xs break-words ${error ? "text-rose-300" : "text-slate-200"}`}>{busy ? <Loader2 className="inline w-4 h-4 animate-spin mr-2" /> : null}{message}</p>
        </>
      ) : <p className="text-xs text-amber-200">A gravação NFC não está disponível neste navegador. Abra o painel no Chrome para Android com NFC ou copie o Link NFC acima e grave-o como URL usando um aplicativo de gravação. No iPhone e no computador, use a alternativa externa.</p>}
      <p className="text-[11px] text-slate-400">A conferência é local e não cadastra o número do chip no banco. Gravar a tag não altera o status da placa.</p>
    </section>
  );
}
