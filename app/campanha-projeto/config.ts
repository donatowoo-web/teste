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

/** Imagem do topo: interior de cozinha (2000 px de largura), escurecida por trás do título. */
export const IMAGEM_TOPO = "/campanha/cozinha.webp";

/** Logótipos Evaplace × Esquadro: a imagem única do cabeçalho do email (829x141, fundo preto). */
export const LOGOS = "/campanha/logos-evaplace-esquadro.png";

/**
 * As 3 casas da prova, com fotos dos próprios projetos no Sanity.
 * Gondim e Arouca usam as mesmas fotos do email; Caminha usa a miniatura do projeto.
 */
const CDN = "https://cdn.sanity.io/images/onxd36ek/production";
export const CASAS_PROVA = [
  { nome: "Casa Gondim", foto: `${CDN}/b5e6509218427ae3de9d52ae1e723dedbd87bcb8-2048x1536.jpg` },
  { nome: "Casa Arouca", foto: `${CDN}/20980c47fbb6bd417affab30fcfae17c7ac90a24-6000x4000.jpg` },
  { nome: "Casa Caminha", foto: "/projetos/caminha/caminha_1.webp" },
];

/** Imagens do CDN do Sanity redimensionadas; as locais (/projetos/…) ficam como estão. */
export function imagem(url: string, largura: number): string {
  if (!url.includes("cdn.sanity.io")) return url;
  return `${url}?w=${largura}&fit=max&auto=format&q=75`;
}
