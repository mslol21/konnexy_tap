/**
 * Utilitários de segurança para redirecionamento, validação e integridade.
 * Produto: Otimiza Meu Negócio — Placa Inteligente de Avaliações.
 */

const TRUSTED_GOOGLE_DOMAINS = [
  "search.google.com",
  "maps.google.com",
  "maps.app.goo.gl",
  "g.page",
  "google.com",
  "google.com.br",
  "business.google.com",
];

const FORBIDDEN_HOSTS = ["localhost", "127.0.0.1", "::1", "0.0.0.0"];

export interface UrlValidationResult {
  isValid: boolean;
  sanitizedUrl: string;
  error?: string;
}

export function validateDestinationUrl(
  inputUrl: string | null | undefined,
  destinationType: "google_review" | "custom" = "google_review"
): UrlValidationResult {
  if (!inputUrl || typeof inputUrl !== "string") {
    return { isValid: false, sanitizedUrl: "", error: "URL de destino vazia ou inválida." };
  }

  const trimmed = inputUrl.trim();
  const normalized = trimmed.toLowerCase();

  if (
    normalized.startsWith("javascript:") ||
    normalized.startsWith("data:") ||
    normalized.startsWith("file:") ||
    normalized.startsWith("ftp:") ||
    normalized.startsWith("vbscript:")
  ) {
    return { isValid: false, sanitizedUrl: "", error: "Esquema de URL não permitido." };
  }

  if (!normalized.startsWith("https://")) {
    return { isValid: false, sanitizedUrl: "", error: "Apenas destinos seguros com HTTPS são permitidos." };
  }

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.toLowerCase();

    if (FORBIDDEN_HOSTS.includes(host)) {
      return { isValid: false, sanitizedUrl: "", error: "Destinos locais não são permitidos." };
    }

    if (
      /^10\./.test(host) ||
      /^192\.168\./.test(host) ||
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(host) ||
      /^169\.254\./.test(host)
    ) {
      return { isValid: false, sanitizedUrl: "", error: "Faixas de IP privadas não são permitidas." };
    }

    if (destinationType === "google_review") {
      const isTrustedGoogle = TRUSTED_GOOGLE_DOMAINS.some(
        (domain) => host === domain || host.endsWith(`.${domain}`)
      );

      if (!isTrustedGoogle) {
        return {
          isValid: false,
          sanitizedUrl: "",
          error: "O link informado não pertence aos domínios oficiais aceitos do Google.",
        };
      }
    }

    return { isValid: true, sanitizedUrl: parsed.toString() };
  } catch {
    return { isValid: false, sanitizedUrl: "", error: "Formato de URL inválido." };
  }
}

export function sanitizeSource(src: string | null | undefined): "nfc" | "qr" | "direct" {
  if (!src) return "direct";
  const normalized = src.toLowerCase().trim();
  if (normalized === "nfc") return "nfc";
  if (normalized === "qr") return "qr";
  return "direct";
}

/**
 * Gera código público não sequencial no padrão PREFIXO-XXXXX.
 * Usa Web Crypto quando disponível e exclui caracteres ambíguos (0, O, 1, I).
 */
export function generateDeviceCode(prefix = "OM"): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(5);

  if (globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }

  let result = "";
  for (const byte of bytes) {
    result += chars[byte % chars.length];
  }

  return `${prefix}-${result}`;
}

export function isValidDeviceCodeFormat(code: string): boolean {
  if (!code || typeof code !== "string") return false;
  return /^[A-Z0-9_-]{3,16}$/i.test(code.trim());
}
