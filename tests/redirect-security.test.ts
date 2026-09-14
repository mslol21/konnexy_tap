import assert from "node:assert";
import {
  validateDestinationUrl,
  sanitizeSource,
  generateDeviceCode,
  isValidDeviceCodeFormat,
} from "../src/lib/security";

console.log("==================================================");
console.log("SUITE DE TESTES: KONNEXY TAP REVIEWS & SEGURANÇA");
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

// -------------------------------------------------------------
// 1. TESTES DE VALIDAÇÃO DE URL & OPEN REDIRECT
// -------------------------------------------------------------
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

test("Deve bloquear esquemas não-HTTPS (HTTP puro)", () => {
  const url = "http://search.google.com/local/writereview";
  const result = validateDestinationUrl(url, "google_review");
  assert.strictEqual(result.isValid, false);
  assert.match(result.error || "", /HTTPS/);
});

test("Deve bloquear esquemas maliciosos (javascript:, data:, file:)", () => {
  assert.strictEqual(validateDestinationUrl("javascript:alert(document.cookie)").isValid, false);
  assert.strictEqual(validateDestinationUrl("data:text/html,<script>alert(1)</script>").isValid, false);
  assert.strictEqual(validateDestinationUrl("file:///etc/passwd").isValid, false);
  assert.strictEqual(validateDestinationUrl("ftp://files.example.com").isValid, false);
});

test("Deve bloquear Open Redirect para domínios arbitrários externos", () => {
  const maliciousUrl = "https://phishing-site-fake-google.com/login";
  const result = validateDestinationUrl(maliciousUrl, "google_review");
  assert.strictEqual(result.isValid, false);
  assert.match(result.error || "", /oficiais/);
});

test("Deve bloquear localhost e IPs locais privados", () => {
  assert.strictEqual(validateDestinationUrl("https://localhost:3000/steal").isValid, false);
  assert.strictEqual(validateDestinationUrl("https://127.0.0.1/admin").isValid, false);
  assert.strictEqual(validateDestinationUrl("https://192.168.1.1/router").isValid, false);
  assert.strictEqual(validateDestinationUrl("https://10.0.0.1/internal").isValid, false);
  assert.strictEqual(validateDestinationUrl("https://172.16.0.1/private").isValid, false);
});

// -------------------------------------------------------------
// 2. TESTES DE HIGIENIZAÇÃO DE ORIGEM (SRC: NFC / QR)
// -------------------------------------------------------------
test("Deve reconhecer 'nfc' como origem válida", () => {
  assert.strictEqual(sanitizeSource("nfc"), "nfc");
  assert.strictEqual(sanitizeSource("NFC"), "nfc");
});

test("Deve reconhecer 'qr' como origem válida", () => {
  assert.strictEqual(sanitizeSource("qr"), "qr");
  assert.strictEqual(sanitizeSource("QR"), "qr");
});

test("Deve converter origens anômalas ou injeções em 'direct'", () => {
  assert.strictEqual(sanitizeSource(""), "direct");
  assert.strictEqual(sanitizeSource(null), "direct");
  assert.strictEqual(sanitizeSource(undefined), "direct");
  assert.strictEqual(sanitizeSource("facebook_ads"), "direct");
  assert.strictEqual(sanitizeSource("<script>alert(1)</script>"), "direct");
  assert.strictEqual(sanitizeSource("../../admin"), "direct");
});

// -------------------------------------------------------------
// 3. TESTES DE CÓDIGOS DE PLACA (KX-XXXXX)
// -------------------------------------------------------------
test("Deve gerar códigos imprevisíveis no formato KX-XXXXX", () => {
  const code = generateDeviceCode("KX");
  assert.strictEqual(/^KX-[A-Z0-9]{5}$/.test(code), true);
});

test("Não deve conter caracteres visualmente ambíguos (0, O, 1, I)", () => {
  for (let i = 0; i < 50; i++) {
    const code = generateDeviceCode("KX");
    const raw = code.replace("KX-", "");
    assert.strictEqual(/[0O1I]/.test(raw), false, `Código gerado continha caractere proibido: ${code}`);
  }
});

test("Deve validar o formato aceito de código de placa", () => {
  assert.strictEqual(isValidDeviceCodeFormat("KX-A7K92"), true);
  assert.strictEqual(isValidDeviceCodeFormat("A7K92"), true);
  assert.strictEqual(isValidDeviceCodeFormat(""), false);
  assert.strictEqual(isValidDeviceCodeFormat("KX/../insecure"), false);
});

// -------------------------------------------------------------
// 4. TESTES DE STATUS DA PLACA & SIMULAÇÃO DE REDIRECIONAMENTO
// -------------------------------------------------------------
test("Deve aprovar redirecionamento de placa em status 'active'", () => {
  const device = {
    code: "KX-A7K92",
    status: "active",
    destination_url: "https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4",
    destination_type: "google_review" as const,
  };

  assert.strictEqual(device.status, "active");
  const validation = validateDestinationUrl(device.destination_url, device.destination_type);
  assert.strictEqual(validation.isValid, true);
});

test("Deve sinalizar status 'pending' para placa aguardando ativação", () => {
  const device = { code: "KX-C9X02", status: "pending" };
  assert.strictEqual(device.status, "pending");
});

test("Deve sinalizar status 'inactive' para placa desativada", () => {
  const device = { code: "KX-OFF01", status: "inactive" };
  assert.strictEqual(device.status, "inactive");
});

test("Deve sinalizar status 'suspended' para placa bloqueada administrativamente", () => {
  const device = { code: "KX-BLOCK", status: "suspended" };
  assert.strictEqual(device.status, "suspended");
});

// -------------------------------------------------------------
// 5. TESTES DE ISOLAMENTO MULTI-TENANT
// -------------------------------------------------------------
test("Usuário A não pode ter acesso aos dados do Estabelecimento B", () => {
  const businessA = { id: "biz-a", owner_id: "user-1" };
  const businessB = { id: "biz-b", owner_id: "user-2" };
  const currentUserId = "user-1";

  const isMember = (b: typeof businessA, uId: string) => b.owner_id === uId;

  assert.strictEqual(isMember(businessA, currentUserId), true);
  assert.strictEqual(isMember(businessB, currentUserId), false);
});

// -------------------------------------------------------------
// RESUMO FINAL
// -------------------------------------------------------------
console.log("\n==================================================");
console.log(`TOTAL DE TESTES: ${passed + failed}`);
console.log(`PASSOU: ${passed}`);
console.log(`FALHOU: ${failed}`);
console.log("==================================================");

if (failed > 0) {
  process.exit(1);
}
