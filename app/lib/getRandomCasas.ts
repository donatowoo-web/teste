import { Casa } from "@/app/data/casas";

// Função hash simples para gerar número determinístico a partir de string
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export function getRandomCasas(
  casas: Casa[],
  currentSlug: string,
  count = 3
) {
  const filtered = casas.filter((c) => c.slug !== currentSlug);
  const seed = hashString(currentSlug);

  // Ordenação determinística baseada no slug atual
  const sorted = [...filtered].sort((a, b) => {
    const hashA = hashString(a.slug + currentSlug) % 1000;
    const hashB = hashString(b.slug + currentSlug) % 1000;
    return hashA - hashB;
  });

  return sorted.slice(0, count);
}