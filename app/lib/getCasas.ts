import { cache } from "react";
import { client } from "@/sanity/lib/client";
import { casas as casasLocais, type Casa } from "../data/casas";

export type { Casa };

/**
 * Devolve os modelos de casa.
 * Preferência: Sanity (editável no backoffice). Se o Sanity estiver vazio
 * ou indisponível, usa o ficheiro local app/data/casas.ts (rede de
 * segurança — o site nunca fica sem casas).
 *
 * Embrulhado em React cache() para não chamar o Sanity dezenas de vezes
 * durante o build (a página /produto chama-o por cada modelo).
 */
export const getCasas = cache(async function getCasas(): Promise<Casa[]> {
  try {
    const docs = await client.fetch<any[]>(`
      *[_type == "casa" && defined(slug.current) && !(_id in path("drafts.**"))]
        | order(coalesce(ordem, 9999) asc, nomeProjeto asc){
        "slug": slug.current,
        nomeProjeto,
        thumbnail,
        tipologia,
        areaTotal,
        wc,
        descricao,
        "galeria": coalesce(galeria, []),
        planta
      }
    `);

    if (Array.isArray(docs) && docs.length > 0) {
      // Normaliza para o tipo Casa (garante campos)
      return docs.map((d) => ({
        slug: d.slug,
        nomeProjeto: d.nomeProjeto || "",
        thumbnail: d.thumbnail || "",
        tipologia: d.tipologia || "",
        areaTotal: typeof d.areaTotal === "number" ? d.areaTotal : 0,
        wc: typeof d.wc === "number" ? d.wc : 0,
        descricao: d.descricao || "",
        galeria: Array.isArray(d.galeria) ? d.galeria.filter(Boolean) : [],
        planta: d.planta || "",
      }));
    }
  } catch {
    // cai para o fallback
  }
  return casasLocais;
});
