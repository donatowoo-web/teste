// Atribuição de leads: guarda UTMs/gclid quando a pessoa aterra no site e junta-os a
// todos os envios para o Make (spec 2026-09-15-atribuicao-leads-e-form-blog-design.md).
// Desde 2026-11-10 só grava em storage com consentimento de marketing (ver abaixo).

export const URL_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "matchtype",
  "gclid",
  "gbraid",
  "wbraid",
  "fbclid",
] as const;

export const FIELD_KEYS = [...URL_KEYS, "landing_page", "referrer"] as const;

export type AttributionFields = Record<(typeof FIELD_KEYS)[number], string>;

const STORAGE_KEY = "attr";

/** Chaves com valor no URL + landing_page, ou null se o URL não traz nenhuma. */
export function parseAttribution(search: URLSearchParams, pathname: string): Record<string, string> | null {
  const found: Record<string, string> = {};
  for (const k of URL_KEYS) {
    const v = search.get(k);
    if (v) found[k] = v;
  }
  if (Object.keys(found).length === 0) return null;
  return { ...found, landing_page: pathname };
}

/** Cookie _gcl_aw do GTM ("GCL.<timestamp>.<gclid>") -> gclid. */
export function gclidFromGclAw(cookieHeader: string): string {
  const entry = cookieHeader.split(/;\s*/).find((c) => c.startsWith("_gcl_aw="));
  if (!entry) return "";
  const parts = decodeURIComponent(entry.slice("_gcl_aw=".length)).split(".");
  return parts.length >= 3 ? parts.slice(2).join(".") : "";
}

/** Os 12 campos, sempre presentes e por ordem; "" quando não há valor. */
export function buildAttributionFields(
  stored: Record<string, unknown>,
  cookieHeader: string,
  referrer: string
): AttributionFields {
  const fields = {} as AttributionFields;
  for (const k of FIELD_KEYS) {
    const v = stored[k];
    fields[k] = typeof v === "string" ? v : "";
  }
  if (!fields.gclid) fields.gclid = gclidFromGclAw(cookieHeader);
  fields.referrer = referrer;
  return fields;
}

// Consent Mode v2: só guardamos no sessionStorage com consentimento de marketing
// (cookie "cookieConsent" do CookieBanner). Sem ele, os valores ficam apenas em memória
// enquanto a página está aberta (navegação interna do Next), e perdem-se ao recarregar.
const CONSENT_COOKIE = "cookieConsent";
let pending: Record<string, string> | null = null;

/** Lê o cookie do CookieBanner: true só quando a pessoa aceitou marketing. */
export function marketingConsentGranted(cookieHeader?: string): boolean {
  try {
    const header = cookieHeader ?? document.cookie;
    const entry = header.split(/;\s*/).find((c) => c.startsWith(`${CONSENT_COOKIE}=`));
    if (!entry) return false;
    const data = JSON.parse(decodeURIComponent(entry.slice(CONSENT_COOKIE.length + 1)));
    return data?.marketing === true;
  } catch {
    return false;
  }
}

/** Grava o que está em memória, se o consentimento já o permitir. */
export function persistPendingAttribution(): void {
  if (!pending || !marketingConsentGranted()) return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(pending));
  } catch {
    // storage bloqueado: fica só em memória
  }
}

/** Só para testes. */
export function resetAttributionMemory(): void {
  pending = null;
}

/** Chamado em cada página: só escreve quando o URL traz parâmetros (e aí substitui tudo). */
export function captureAttribution(search: URLSearchParams, pathname: string): void {
  const found = parseAttribution(search, pathname);
  if (found) pending = found;
  persistPendingAttribution();
}

/** Acrescenta os 12 campos ao payload do formulário. Nunca lança. */
export function appendAttribution(params: URLSearchParams): void {
  let stored: Record<string, unknown> = {};
  if (pending) {
    stored = pending;
  } else if (marketingConsentGranted()) {
    try {
      const parsed = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}");
      if (parsed && typeof parsed === "object") stored = parsed;
    } catch {
      // storage bloqueado ou JSON inválido
    }
  }
  let cookieHeader = "";
  let referrer = "";
  try {
    cookieHeader = document.cookie;
    referrer = document.referrer;
  } catch {
    // sem document (não acontece no browser)
  }
  const fields = buildAttributionFields(stored, cookieHeader, referrer);
  for (const k of FIELD_KEYS) params.append(k, fields[k]);
}
