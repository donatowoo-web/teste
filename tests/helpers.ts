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
