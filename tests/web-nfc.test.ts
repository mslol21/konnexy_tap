import assert from "node:assert/strict";
import { verifyNfcUrl, writeNfcUrl, type NfcReader, type NfcReadingEvent } from "../src/lib/web-nfc";

class Reader extends EventTarget implements NfcReader {
  writes: unknown[] = [];
  scanError: Error | null = null;
  async write(message: unknown, options: unknown) { this.writes.push({ message, options }); }
  async scan() { if (this.scanError) throw this.scanError; }
  read(url: string, extra = false) {
    const bytes = new TextEncoder().encode(url);
    const event = new Event("reading") as NfcReadingEvent;
    event.serialNumber = "01:02:03";
    event.message = { records: [{ recordType: "url", data: new DataView(bytes.buffer) }, ...(extra ? [{ recordType: "text" }] : [])] };
    this.dispatchEvent(event);
  }
}

async function main() {
  const url = "https://otimizameunegocio.vercel.app/t/OM-ABCDE?src=nfc";
  const reader = new Reader();
  const controller = new AbortController();
  await writeNfcUrl(reader, url, controller.signal);
  assert.deepEqual(reader.writes[0], { message: { records: [{ recordType: "url", data: url }] }, options: { signal: controller.signal, overwrite: false } });
  await writeNfcUrl(reader, url, controller.signal, true);
  assert.equal((reader.writes[1] as { options: { overwrite: boolean } }).options.overwrite, true);
  for (const invalid of [url.replace("https:", "http:"), url.replace("src=nfc", "src=qr"), "https://g.page/r/example/review"]) {
    await assert.rejects(writeNfcUrl(reader, invalid, controller.signal));
  }
  const success = verifyNfcUrl(reader, url, controller.signal);
  reader.read(url);
  assert.equal(await success, "01:02:03");
  const mismatch = verifyNfcUrl(reader, url, controller.signal);
  reader.read(url.replace("OM-ABCDE", "OM-FGHIJ"));
  await assert.rejects(mismatch, /não contém/);
  const extraRecord = verifyNfcUrl(reader, url, controller.signal);
  reader.read(url, true);
  await assert.rejects(extraRecord, /não contém/);
  const cancelled = verifyNfcUrl(reader, url, controller.signal);
  controller.abort();
  await assert.rejects(cancelled, { name: "AbortError" });
  await assert.rejects(verifyNfcUrl(reader, url, controller.signal), { name: "AbortError" });
  const deniedReader = new Reader();
  deniedReader.scanError = new DOMException("Permission denied", "NotAllowedError");
  await assert.rejects(verifyNfcUrl(deniedReader, url, new AbortController().signal), { name: "NotAllowedError" });
  const unreadable = verifyNfcUrl(reader, url, new AbortController().signal);
  reader.dispatchEvent(new Event("readingerror"));
  await assert.rejects(unreadable, /Não foi possível ler/);
  console.log("NFC: gravação, proteção contra sobrescrita, URL incorreta, conferência, cancelamento e falhas de leitura aprovados.");
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
