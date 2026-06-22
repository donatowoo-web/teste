// Migra os modelos de casa de app/data/casas.ts para o Sanity (tipo "casa").
// Idempotente: usa _id fixo por slug (casa-<slug>), por isso correr 2x não duplica.
// Uso: SANITY_WRITE_TOKEN=xxxxx node scripts/migrate-casas-to-sanity.mjs

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ID = "onxd36ek";
const DATASET = "production";
const API = "2024-01-01";
const TOKEN = process.env.SANITY_WRITE_TOKEN;

if (!TOKEN) {
  console.error("Falta SANITY_WRITE_TOKEN no ambiente.");
  process.exit(1);
}

// Extrai o array `casas` do ficheiro TS sem o compilar:
// isola o literal entre "export const casas: Casa[] = [" e o "];" final.
const tsPath = join(__dirname, "..", "app", "data", "casas.ts");
const src = readFileSync(tsPath, "utf8");
const start = src.indexOf("[", src.indexOf("export const casas"));
const end = src.lastIndexOf("];");
const arrLiteral = src.slice(start, end + 1);

// Avalia o literal JS (é um array de objetos com aspas — seguro o suficiente aqui).
const casas = eval(arrLiteral);
console.log(`Encontradas ${casas.length} casas no ficheiro local.`);

const mutations = casas.map((c, i) => ({
  createOrReplace: {
    _id: `casa-${c.slug}`,
    _type: "casa",
    nomeProjeto: c.nomeProjeto,
    slug: { _type: "slug", current: c.slug },
    tipologia: c.tipologia || "",
    areaTotal: typeof c.areaTotal === "number" ? c.areaTotal : 0,
    wc: typeof c.wc === "number" ? c.wc : 0,
    descricao: c.descricao || "",
    thumbnail: c.thumbnail || "",
    galeria: Array.isArray(c.galeria) ? c.galeria : [],
    planta: c.planta || "",
    ordem: i,
  },
}));

const res = await fetch(
  `https://${PROJECT_ID}.api.sanity.io/v${API}/data/mutate/${DATASET}`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ mutations }),
  }
);

const data = await res.json();
if (!res.ok) {
  console.error("Erro:", JSON.stringify(data, null, 2));
  process.exit(1);
}
console.log(`OK — ${mutations.length} casas escritas no Sanity.`);
