// Campanha «Evaplace × Esquadro» (landing page /campanha-projeto/).
// Tudo o que é provisório ou tem prazo está aqui.

/** Valor do campo "campanha" enviado ao Make só por esta página. */
export const CAMPANHA_ID = "black-friday-esquadro";

/**
 * Fecho: 23:59:59 de 16 de dezembro de 2026 em Lisboa.
 * Em dezembro Lisboa está em hora de inverno (UTC+0), por isso o instante é o mesmo em UTC.
 * Depois deste instante a página mostra o agradecimento em vez do formulário.
 */
export const FECHO_UTC_MS = Date.UTC(2026, 11, 16, 23, 59, 59);

export function campanhaFechada(agoraMs: number): boolean {
  return agoraMs > FECHO_UTC_MS;
}

/** POR CONFIRMAR: texto da página de agradecimento depois do fecho (provisório). */
export const FECHO_TITULO = "A campanha terminou a 16 de dezembro.";
export const FECHO_TEXTO = "Obrigado pelo interesse.";

/**
 * POR CONFIRMAR: imagem larga do topo (o ficheiro da campanha não foi entregue).
 * Provisória: estrutura em aço leve da Casa Gondim, já no Sanity.
 */
export const IMAGEM_TOPO =
  "https://cdn.sanity.io/images/onxd36ek/production/b5e6509218427ae3de9d52ae1e723dedbd87bcb8-2048x1536.jpg";

/**
 * As 3 casas da prova: a foto é a miniatura de cada projeto no Sanity.
 * "reserva" é essa mesma miniatura à data de 13/11/2026, usada só se o Sanity falhar
 * durante o build (o getProjetos cai então nos projetos locais, que não têm Gondim nem Arouca).
 */
const CDN = "https://cdn.sanity.io/images/onxd36ek/production";
export const CASAS_PROVA = [
  { slug: "casa-gondim", nome: "Casa Gondim", reserva: `${CDN}/7462dec97ba64ce15292365e0b9f191bd806246e-1536x2048.jpg` },
  { slug: "casa-arouca", nome: "Casa Arouca", reserva: `${CDN}/6c32134ba0f021cb7b39f08cd8a448e7e43d64b2-6000x4000.jpg` },
  { slug: "casa-caminha", nome: "Casa Caminha", reserva: "/projetos/caminha/caminha_1.webp" },
];

/** Imagens do CDN do Sanity redimensionadas; as locais (/projetos/…) ficam como estão. */
export function imagem(url: string, largura: number): string {
  if (!url.includes("cdn.sanity.io")) return url;
  return `${url}?w=${largura}&fit=max&auto=format&q=75`;
}
