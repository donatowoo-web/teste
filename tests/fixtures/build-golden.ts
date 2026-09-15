// Regressão dos conversores do backoffice com os artigos reais (leitura pública do Sanity).
// Gerado UMA vez com o comportamento antigo: node tests/fixtures/build-golden.ts
import { writeFileSync } from "node:fs";
import { setupDom, stripKeys } from "../helpers.ts";
import { portableTextToHtml, htmlToPortableText } from "../../app/backoffice/portableTextHtml.ts";

setupDom();

const query = `*[_type == "post" && !(_id in path("drafts.**"))] | order(slug.current asc){
  "slug": slug.current,
  "content": content[]{ ..., _type == "image" => { ..., "asset": { "_ref": asset._ref, "url": asset->url } } }
}`;
const url = `https://onxd36ek.api.sanity.io/v2024-01-01/data/query/production?query=${encodeURIComponent(query)}`;
const { result } = await (await fetch(url)).json();

const posts = result.map((p: any) => ({ slug: p.slug, content: p.content || [] }));
const golden = posts.map((p: any) => {
  const html = portableTextToHtml(p.content);
  return { slug: p.slug, html, blocks: stripKeys(htmlToPortableText(html)) };
});

writeFileSync(new URL("./posts.json", import.meta.url), JSON.stringify(posts));
writeFileSync(new URL("./golden.json", import.meta.url), JSON.stringify(golden));
console.log(`${posts.length} artigos`);
