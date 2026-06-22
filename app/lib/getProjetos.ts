import { cache } from "react";
import { client } from "@/sanity/lib/client";
import { projetos as projetosLocais, type Projeto } from "../data/projetos";

export type { Projeto };

/**
 * Devolve os projetos. Preferência: Sanity (editável no backoffice).
 * Fallback: ficheiro local app/data/projetos.ts (o site nunca fica sem projetos).
 * Em React cache() para não chamar o Sanity dezenas de vezes por build.
 */
export const getProjetos = cache(async function getProjetos(): Promise<Projeto[]> {
  try {
    const docs = await client.fetch<any[]>(`
      *[_type == "projeto" && defined(slug.current) && !(_id in path("drafts.**"))]
        | order(coalesce(ordem, 9999) asc, titulo asc){
        "slug": slug.current,
        titulo, descricao, localizacao, sistema, area, ano, finalidade,
        thumbnail, "imagens": coalesce(imagens, [])
      }
    `);

    if (Array.isArray(docs) && docs.length > 0) {
      return docs.map((d) => ({
        slug: d.slug,
        titulo: d.titulo || "",
        descricao: d.descricao || "",
        localizacao: d.localizacao || "",
        sistema: d.sistema || "",
        area: d.area || "",
        ano: d.ano || "",
        finalidade: d.finalidade || "",
        thumbnail: d.thumbnail || "",
        imagens: Array.isArray(d.imagens) ? d.imagens.filter(Boolean) : [],
      }));
    }
  } catch {
    // cai para o fallback
  }
  return projetosLocais;
});
