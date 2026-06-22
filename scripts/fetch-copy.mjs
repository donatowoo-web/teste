// Corre ANTES do build (npm "prebuild"). Vai buscar os textos editados no
// backoffice (documento Sanity siteCopy) e escreve app/data/copy.generated.ts.
// Leitura pública (sem token). Se falhar, deixa o ficheiro como está — o site
// usa os textos por omissão do código. Nunca falha o build.

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "app", "data", "copy.generated.ts");
const PROJECT_ID = "onxd36ek";
const DATASET = "production";
const API = "2024-01-01";

const HEADER = `// GERADO AUTOMATICAMENTE antes do build (scripts/fetch-copy.mjs).
// Guarda APENAS os textos alterados no backoffice. Se estiver vazio, as
// páginas usam os textos por omissão definidos no próprio código.
// Não editar à mão — é sobreposto a cada publicação.
export const copyMap: Record<string, string> = `;

try {
  const query = encodeURIComponent('*[_id == "siteCopy"][0]{json}');
  // endpoint SEM cache (api, não apicdn) para apanhar edições mesmo acabadas de guardar
  const url = `https://${PROJECT_ID}.api.sanity.io/v${API}/data/query/${DATASET}?query=${query}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("HTTP " + res.status);
  const data = await res.json();
  const raw = data?.result?.json;
  let map = {};
  if (raw) {
    map = typeof raw === "string" ? JSON.parse(raw) : raw;
  }
  // Mantém só strings (segurança)
  const clean = {};
  for (const [k, v] of Object.entries(map)) {
    if (typeof v === "string") clean[k] = v;
  }
  writeFileSync(OUT, `${HEADER}${JSON.stringify(clean, null, 2)};\n`, "utf8");
  console.log(`[fetch-copy] ${Object.keys(clean).length} textos escritos.`);
} catch (e) {
  console.warn("[fetch-copy] aviso:", e.message, "— uso os textos por omissão.");
  process.exit(0); // nunca falha o build
}
