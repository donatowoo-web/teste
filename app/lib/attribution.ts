// Atribuição de leads: guarda UTMs/gclid quando a pessoa aterra no site e junta-os a
// todos os envios para o Make (spec 2026-09-15-atribuicao-leads-e-form-blog-design.md).

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

/** Chamado em cada página: só escreve quando o URL traz parâmetros (e aí substitui tudo). */
export function captureAttribution(search: URLSearchParams, pathname: string): void {
  const found = parseAttribution(search, pathname);
  if (!found) return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(found));
  } catch {
    // storage bloqueado: a lead segue sem atribuição
  }
}

/** Acrescenta os 12 campos ao payload do formulário. Nunca lança. */
export function appendAttribution(params: URLSearchParams): void {
  let stored: Record<string, unknown> = {};
  try {
    const parsed = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}");
    if (parsed && typeof parsed === "object") stored = parsed;
  } catch {
    // storage bloqueado ou JSON inválido
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
