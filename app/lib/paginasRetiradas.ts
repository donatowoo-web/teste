// Landing pages locais (/paginas/) retiradas do ar.
//
// Cada slug desta lista TEM de ter o 301 correspondente em public/.htaccess —
// é o redirect que substitui a página. A lista mantém o site coerente com esse
// 301 mesmo que o documento continue publicado no Sanity: a página sai da
// grelha da homepage, do build e do sitemap. O documento não se apaga, para
// não perder o conteúdo.
export const PAGINAS_RETIRADAS: string[] = [
  // set/2026 — deixou de haver construção em aço leve em Marco de Canaveses
  "construcao-de-casas-em-aco-leve-em-marco-de-canaveses",
];
