import { copyMap } from "../data/copy.generated";
import { CF } from "../data/copyFields";

/**
 * Texto editável. Devolve o valor guardado no backoffice (se existir),
 * senão o fallback. Síncrono — server E client components.
 */
export function t(key: string, fallback: string): string {
  const v = copyMap[key];
  return v != null && v !== "" ? v : fallback;
}

/**
 * Como t(), mas vai buscar o valor por omissão ao catálogo CF
 * (app/data/copyFields.ts) — assim o default vive num só sítio.
 */
export function tc(key: string): string {
  return t(key, CF[key]?.def ?? "");
}
