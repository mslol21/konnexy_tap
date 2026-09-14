/**
 * Utilitários de segurança para redirecionamento, validação e integridade
 * Konnexy Tap Reviews
 */

const TRUSTED_GOOGLE_DOMAINS = [
  "search.google.com",
  "maps.google.com",
  "maps.app.goo.gl",
  "g.page",
  "goo.gl",
  "google.com",
  "google.com.br",
  "business.google.com",
];

const FORBIDDEN_HOSTS = [
  "localhost",
  "127.0.0.1",
  "::1",
  "0.0.0.0",
];

export interface UrlValidationResult {
  isValid: boolean;
  sanitizedUrl: string;
  error?: string;
}

/**
 * Valida rigorosamente uma URL de destino contra Open Redirect e ataques maliciosos
 */
export function validateDestinationUrl(
  inputUrl: string | null | undefined,
  destinationType: "google_review" | "custom" = "google_review"
): UrlValidationResult {
  if (!inputUrl || typeof inputUrl !== "string") {
    return { isValid: false, sanitizedUrl: "", error: "URL de destino vazia ou inválida." };
  }

  const trimmed = inputUrl.trim();

  // Bloqueio de esquemas perigosos
  if (
    trimmed.toLowerCase().startsWith("javascript:") ||
    trimmed.toLowerCase().startsWith("data:") ||
    trimmed.toLowerCase().startsWith("file:") ||
    trimmed.toLowerCase().startsWith("ftp:") ||
    trimmed.toLowerCase().startsWith("vbscript:")
  ) {
    return { isValid: false, sanitizedUrl: "", error: "Esquema de URL não permitido." };
  }

  // Apenas HTTPS é permitido
  if (!trimmed.startsWith("https://")) {
    return { isValid: false, sanitizedUrl: "", error: "Apenas destinos seguros com HTTPS são permitidos." };
  }

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.toLowerCase();

    // Bloqueia hosts locais
    if (FORBIDDEN_HOSTS.includes(host)) {
      return { isValid: false, sanitizedUrl: "", error: "Destinos locais não são permitidos." };
    }

    // Bloqueia IPs privados (10.x, 192.168.x, 172.16-31.x, 169.254.x)
    if (
      /^10\./.test(host) ||
      /^192\.168\./.test(host) ||
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(host) ||
      /^169\.254\./.test(host)
    ) {
      return { isValid: false, sanitizedUrl: "", error: "Faixas de IP privadas não são permitidas." };
    }

    // Validação específica para Google Reviews
    if (destinationType === "google_review") {
      const isTrustedGoogle = TRUSTED_GOOGLE_DOMAINS.some(
        (domain) => host === domain || host.endsWith(`.${domain}`)
      );

      if (!isTrustedGoogle) {
        return {
          isValid: false,
          sanitizedUrl: "",
          error: "O link informado não pertence aos domínios oficiais de avaliações do Google.",
        };
      }
    }

    return {
      isValid: true,
      sanitizedUrl: parsed.toString(),
    };
  } catch {
    return { isValid: false, sanitizedUrl: "", error: "Formato de URL inválido." };
  }
}

/**
 * Higieniza o parâmetro de origem do acesso físico (NFC vs QR Code)
 * Aceita somente 'nfc', 'qr' ou 'direct'
 */
export function sanitizeSource(src: string | null | undefined): "nfc" | "qr" | "direct" {
  if (!src) return "direct";
  const normalized = src.toLowerCase().trim();
  if (normalized === "nfc") return "nfc";
  if (normalized === "qr") return "qr";
  return "direct";
}

/**
 * Gera um código de placa imprevisível no padrão KX-XXXXX
 * Exclui caracteres visualmente ambíguos (0, O, 1, I)
 */
export function generateDeviceCode(prefix = "KX"): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}-${result}`;
}

/**
 * Valida o formato estrutural do código da placa
 */
export function isValidDeviceCodeFormat(code: string): boolean {
  if (!code || typeof code !== "string") return false;
  return /^[A-Z0-9_-]{3,16}$/i.test(code.trim());
}
