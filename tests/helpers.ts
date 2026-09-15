import jsdom from "jsdom";

/** DOM de browser (jsdom) nos globais que o código do site usa. */
export function setupDom(html = "", url = "https://www.evaplace.pt/") {
  const dom = new jsdom.JSDOM(html, { url });
  const g = globalThis as any;
  g.document = dom.window.document;
  g.Node = dom.window.Node;
  g.sessionStorage = dom.window.sessionStorage;
  return dom;
}

/**
 * Torna blocos do Sanity comparáveis: remove os _key aleatórios e troca as chaves
 * dos links (markDefs[]._key e as referências em children[].marks) por m0, m1…
 */
export function stripKeys<T>(value: T): T {
  const normalize = (v: any): any => {
    if (Array.isArray(v)) return v.map(normalize);
    if (!v || typeof v !== "object") return v;
    const linkIds = new Map<string, string>();
    if (Array.isArray(v.markDefs)) v.markDefs.forEach((d: any, i: number) => linkIds.set(d._key, `m${i}`));
    const out: any = {};
    for (const [k, val] of Object.entries(v)) {
      if (k === "_key") continue;
      if (k === "markDefs" && Array.isArray(val)) {
        out[k] = val.map((d: any) => ({ ...normalize(d), _key: linkIds.get(d._key) }));
      } else if (k === "children" && Array.isArray(val) && linkIds.size > 0) {
        out[k] = val.map((c: any) => ({ ...normalize(c), marks: (c.marks || []).map((m: string) => linkIds.get(m) ?? m) }));
      } else {
        out[k] = normalize(val);
      }
    }
    return out;
  };
  return normalize(JSON.parse(JSON.stringify(value)));
}
