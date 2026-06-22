// Migra os projetos de app/data/projetos.ts para o Sanity (tipo "projeto").
// Idempotente: _id fixo por slug (projeto-<slug>).
// Uso: SANITY_WRITE_TOKEN=xxxxx node scripts/migrate-projetos-to-sanity.mjs

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

const tsPath = join(__dirname, "..", "app", "data", "projetos.ts");
const src = readFileSync(tsPath, "utf8");
const start = src.indexOf("[", src.indexOf("export const projetos"));
const end = src.lastIndexOf("];");
const projetos = eval(src.slice(start, end + 1));
console.log(`Encontrados ${projetos.length} projetos no ficheiro local.`);

const mutations = projetos.map((p, i) => ({
  createOrReplace: {
    _id: `projeto-${p.slug}`,
    _type: "projeto",
    titulo: p.titulo,
    slug: { _type: "slug", current: p.slug },
    descricao: p.descricao || "",
    localizacao: p.localizacao || "",
    sistema: p.sistema || "",
    area: p.area || "",
    ano: p.ano || "",
    finalidade: p.finalidade || "",
    thumbnail: p.thumbnail || "",
    imagens: Array.isArray(p.imagens) ? p.imagens : [],
    ordem: i,
  },
}));

const res = await fetch(
  `https://${PROJECT_ID}.api.sanity.io/v${API}/data/mutate/${DATASET}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${TOKEN}` },
    body: JSON.stringify({ mutations }),
  }
);

const data = await res.json();
if (!res.ok) {
  console.error("Erro:", JSON.stringify(data, null, 2));
  process.exit(1);
}
console.log(`OK — ${mutations.length} projetos escritos no Sanity.`);
