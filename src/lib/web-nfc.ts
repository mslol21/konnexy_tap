export interface NfcReadingEvent extends Event {
  serialNumber: string;
  message: { records: Array<{ recordType: string; data?: DataView }> };
}

export interface NfcReader extends EventTarget {
  write(message: { records: Array<{ recordType: "url"; data: string }> }, options: { signal: AbortSignal; overwrite: boolean }): Promise<void>;
  scan(options: { signal: AbortSignal }): Promise<void>;
}

export type NfcReaderConstructor = new () => NfcReader;

export function nfcReaderConstructor(): NfcReaderConstructor | null {
  if (typeof window === "undefined" || !window.isSecureContext) return null;
  return (window as Window & { NDEFReader?: NfcReaderConstructor }).NDEFReader ?? null;
}

export async function writeNfcUrl(reader: NfcReader, url: string, signal: AbortSignal, overwrite = false) {
  const destination = new URL(url);
  if (destination.protocol !== "https:" || !/^\/t\/[A-Z0-9_-]{3,16}$/i.test(destination.pathname) || destination.searchParams.get("src") !== "nfc") {
    throw new Error("Use o link NFC permanente de uma placa cadastrada, em HTTPS.");
  }
  await reader.write({ records: [{ recordType: "url", data: destination.toString() }] }, { signal, overwrite });
}

export function verifyNfcUrl(reader: NfcReader, expectedUrl: string, signal: AbortSignal): Promise<string> {
  return new Promise((resolve, reject) => {
    const cleanup = () => {
      reader.removeEventListener("reading", onReading);
      reader.removeEventListener("readingerror", onReadingError);
      signal.removeEventListener("abort", onAbort);
    };
    const fail = (error: unknown) => { cleanup(); reject(error); };
    const onAbort = () => fail(new DOMException("Operação cancelada.", "AbortError"));
    const onReadingError = () => fail(new Error("Não foi possível ler esta tag. Aproxime uma tag compatível com NDEF."));
    const onReading = (event: Event) => {
      const reading = event as NfcReadingEvent;
      const records = reading.message.records;
      const record = records[0];
      if (records.length !== 1 || record?.recordType !== "url" || !record.data || new TextDecoder().decode(record.data) !== expectedUrl) {
        fail(new Error("Esta tag não contém somente o link NFC desta placa. Confira a tag selecionada ou grave o link correto."));
        return;
      }
      cleanup();
      resolve(reading.serialNumber || "");
    };
    if (signal.aborted) { onAbort(); return; }
    reader.addEventListener("reading", onReading);
    reader.addEventListener("readingerror", onReadingError);
    signal.addEventListener("abort", onAbort, { once: true });
    reader.scan({ signal }).catch(fail);
  });
}

export function nfcErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    if (error.name === "NotAllowedError" || error.name === "SecurityError") return "Permita o acesso ao NFC e abra o painel diretamente no Chrome para Android, por HTTPS.";
    if (error.name === "NotSupportedError") return "Este aparelho ou esta tag não suporta a operação. Use uma tag NDEF gravável e um celular com NFC.";
    if (error.name === "NotReadableError" || error.name === "NetworkError") return "Falha ao acessar a tag. Ative o NFC, mantenha a tag próxima e confira se ela está bloqueada ou já contém dados.";
    return error.message;
  }
  return "Não foi possível concluir a operação NFC. Tente novamente.";
}
