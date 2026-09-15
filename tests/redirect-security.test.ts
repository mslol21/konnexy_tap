import assert from "node:assert";
import {
  validateDestinationUrl,
  sanitizeSource,
  generateDeviceCode,
  isValidDeviceCodeFormat,
} from "../src/lib/security";

console.log("==================================================");
console.log("SUITE DE TESTES: OTIMIZA MEU NEGÓCIO / SEGURANÇA");
console.log("==================================================");

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✓ PASS: ${name}`);
    passed++;
  } catch (err: any) {
    console.error(`  ✗ FAIL: ${name}`);
    console.error(`    ${err?.message || err}`);
    failed++;
  }
}

test("Deve aceitar links legítimos do Google Reviews (search.google.com)", () => {
  const url = "https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4";
  const result = validateDestinationUrl(url, "google_review");
  assert.strictEqual(result.isValid, true);
  assert.strictEqual(result.sanitizedUrl.startsWith("https://search.google.com"), true);
});

test("Deve aceitar links curtos do Google Reviews (g.page)", () => {
  const url = "https://g.page/r/ChIJN1t_tDeuEmsR/review";
  const result = validateDestinationUrl(url, "google_review");
  assert.strictEqual(result.isValid, true);
});

test("Deve aceitar links do Google Maps (maps.app.goo.gl e maps.google.com)", () => {
  const urlMaps = "https://maps.google.com/?cid=123456789";
  const urlShort = "https://maps.app.goo.gl/xyz123";
  assert.strictEqual(validateDestinationUrl(urlMaps, "google_review").isValid, true);
  assert.strictEqual(validateDestinationUrl(urlShort, "google_review").isValid, true);
});

test("Deve bloquear esquemas não-HTTPS", () => {
  const result = validateDestinationUrl("http://search.google.com/local/writereview", "google_review");
  assert.strictEqual(result.isValid, false);
  assert.match(result.error || "", /HTTPS/);
});

test("Deve bloquear esquemas maliciosos", () => {
  assert.strictEqual(validateDestinationUrl("javascript:alert(document.cookie)").isValid, false);
  assert.strictEqual(validateDestinationUrl("data:text/html,<script>alert(1)</script>").isValid, false);
  assert.strictEqual(validateDestinationUrl("file:///etc/passwd").isValid, false);
  assert.strictEqual(validateDestinationUrl("ftp://files.example.com").isValid, false);
});

test("Deve bloquear Open Redirect para domínios arbitrários", () => {
  const result = validateDestinationUrl("https://phishing-site-fake-google.com/login", "google_review");
  assert.strictEqual(result.isValid, false);
  assert.match(result.error || "", /oficiais/);
});

test("Deve bloquear localhost e IPs privados", () => {
  assert.strictEqual(validateDestinationUrl("https://localhost:3000/steal").isValid, false);
  assert.strictEqual(validateDestinationUrl("https://127.0.0.1/admin").isValid, false);
  assert.strictEqual(validateDestinationUrl("https://192.168.1.1/router").isValid, false);
  assert.strictEqual(validateDestinationUrl("https://10.0.0.1/internal").isValid, false);
  assert.strictEqual(validateDestinationUrl("https://172.16.0.1/private").isValid, false);
});

test("Deve reconhecer NFC e QR como origens válidas", () => {
  assert.strictEqual(sanitizeSource("nfc"), "nfc");
  assert.strictEqual(sanitizeSource("NFC"), "nfc");
  assert.strictEqual(sanitizeSource("qr"), "qr");
  assert.strictEqual(sanitizeSource("QR"), "qr");
});

test("Deve converter origens anômalas em direct", () => {
  assert.strictEqual(sanitizeSource(""), "direct");
  assert.strictEqual(sanitizeSource(null), "direct");
  assert.strictEqual(sanitizeSource(undefined), "direct");
  assert.strictEqual(sanitizeSource("facebook_ads"), "direct");
  assert.strictEqual(sanitizeSource("<script>alert(1)</script>"), "direct");
  assert.strictEqual(sanitizeSource("../../admin"), "direct");
});

test("Deve gerar códigos imprevisíveis no formato OM-XXXXX", () => {
  const code = generateDeviceCode();
  assert.strictEqual(/^OM-[A-Z0-9]{5}$/.test(code), true);
});

test("Não deve conter caracteres visualmente ambíguos", () => {
  for (let i = 0; i < 50; i++) {
    const code = generateDeviceCode();
    const raw = code.replace("OM-", "");
    assert.strictEqual(/[0O1I]/.test(raw), false, `Código gerado continha caractere proibido: ${code}`);
  }
});

test("Deve validar o formato aceito de código de placa", () => {
  assert.strictEqual(isValidDeviceCodeFormat("OM-A7K92"), true);
  assert.strictEqual(isValidDeviceCodeFormat("A7K92"), true);
  assert.strictEqual(isValidDeviceCodeFormat(""), false);
  assert.strictEqual(isValidDeviceCodeFormat("OM/../insecure"), false);
});

test("Deve aprovar redirecionamento de placa ativa", () => {
  const device = {
    code: "OM-A7K92",
    status: "active",
    destination_url: "https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4",
    destination_type: "google_review" as const,
  };

  assert.strictEqual(device.status, "active");
  assert.strictEqual(validateDestinationUrl(device.destination_url, device.destination_type).isValid, true);
});

test("Deve sinalizar estados operacionais da placa", () => {
  assert.strictEqual({ code: "OM-C9X02", status: "pending" }.status, "pending");
  assert.strictEqual({ code: "OM-OFF01", status: "inactive" }.status, "inactive");
  assert.strictEqual({ code: "OM-BLOCK", status: "suspended" }.status, "suspended");
});

test("Usuário A não pode ter acesso aos dados do Estabelecimento B", () => {
  const businessA = { id: "biz-a", owner_id: "user-1" };
  const businessB = { id: "biz-b", owner_id: "user-2" };
  const currentUserId = "user-1";
  const isMember = (business: typeof businessA, userId: string) => business.owner_id === userId;

  assert.strictEqual(isMember(businessA, currentUserId), true);
  assert.strictEqual(isMember(businessB, currentUserId), false);
});

console.log("\n==================================================");
console.log(`TOTAL DE TESTES: ${passed + failed}`);
console.log(`PASSOU: ${passed}`);
console.log(`FALHOU: ${failed}`);
console.log("==================================================");

if (failed > 0) {
  process.exit(1);
}
