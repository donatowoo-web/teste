# Atribuição de leads + formulário no blog — plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Todos os envios de leads do evaplace.pt levam os UTMs/gclid da página de entrada; a CSP deixa de bloquear os tags do GTM; o botão «Form» do editor de artigos passa a pôr o formulário real nos artigos.

**Architecture:** Lógica pura em `app/lib/attribution.ts` (captura em `sessionStorage["attr"]`, 12 campos no envio) ligada ao router por `AttributionCapture` no layout. Os conversores HTML⇄Portable Text do backoffice saem para `app/backoffice/portableTextHtml.ts`, protegidos por um teste de regressão com os 28 artigos reais, e ganham o cartão do formulário (marcador canónico no Sanity). Deploy como hoje: `master` → workflow `deploy.yml` → FTPS.

**Tech Stack:** Next.js 16.1.1 (`output: "export"`), React 19, TypeScript, Sanity (projeto `onxd36ek`, dataset `production`), Apache `.htaccess`, testes com `node --test` (Node 24, TS nativo) + `jsdom` 26.1.0.

**Spec:** `docs/superpowers/specs/2026-09-15-atribuicao-leads-e-form-blog-design.md`

## Global Constraints

- Repo `C:/Users/pc/meu-site`, ramo de trabalho `feat/atribuicao-leads-form-blog`. O site só muda quando `master` é enviado para `origin` (repo **público** `donatowoo-web/teste`) e o workflow `deploy.yml` corre em `master` (é o que o botão Publicar faz via `public/api/trigger-deploy.php`).
- **OK explícito do utilizador antes de:** `git push`, correr o workflow de deploy, gravar no Sanity.
- Envio dos formulários: continua `application/x-www-form-urlencoded`; os campos atuais (`Possuí Terreno?`, `Concelho do terreno`, `Área de construção`, `Tipologia`, `Tipo de projeto`, `Nome`, `Email`, `Contacto`, `Privacidade`, `Date`) não mudam de nome, valor nem ordem.
- 12 campos novos, sempre presentes, `""` sem valor, por esta ordem: `utm_source, utm_medium, utm_campaign, utm_content, utm_term, matchtype, gclid, gbraid, wbraid, fbclid, landing_page, referrer`.
- Chave de storage: `sessionStorage["attr"]`. Fallback do gclid: cookie `_gcl_aw` (`GCL.<timestamp>.<gclid>`).
- Marcador canónico guardado no Sanity: bloco `style: "html"` com o texto exato `<div data-multistep-form="true"></div>`.
- Não mexer em GTM, Consent Mode, eventos de conversão, `CandidaturaPopup`, page builder (`/paginas/`).
- CSP: só acrescentar origens.
- Nunca criar leads reais nos testes: o `fetch` para `hook.eu1.make.com` é intercetado no browser.
- Nunca escrever tokens em commits, logs ou mensagens.
- Ficheiros existentes usam CRLF (git `autocrlf`); não converter ficheiros inteiros.

---

## Mapa de ficheiros

| Ficheiro | Ação | Responsabilidade |
|---|---|---|
| `app/lib/attribution.ts` | criar | captura e montagem dos 12 campos |
| `app/components/AttributionCapture.tsx` | criar | chama `captureAttribution` em cada navegação |
| `app/layout.tsx` | modificar | monta `AttributionCapture` |
| `app/components/MultiStepForm.tsx`, `MultiStepFormBlog.tsx` | modificar | `appendAttribution(formData)` depois de `Date` |
| `app/backoffice/portableTextHtml.ts` | criar (extração) | conversores + cartão do formulário + inserção no editor |
| `app/backoffice/page.tsx` | modificar | importa do módulo; botão «Form» usa `insertFormCard` |
| `public/.htaccess` | modificar | CSP |
| `tests/helpers.ts` | criar | jsdom nos globais; `stripKeys` |
| `tests/attribution.test.ts` | criar | captura/envio + testes 1, 3, 4 do briefing |
| `tests/fixtures/build-golden.ts`, `posts.json`, `golden.json` | criar | regressão dos conversores com os 28 artigos reais |
| `tests/portableTextHtml.golden.test.ts` | criar | nada muda nos artigos existentes |
| `tests/portableTextHtml.form.test.ts` | criar | cartão ⇄ marcador |
| `tests/insertFormCard.test.ts` | criar | inserção no editor por contexto do cursor |
| `package.json`, `package-lock.json`, `tsconfig.json` | modificar | script `test`, devDependency `jsdom`, excluir `tests` do build |

---

### Task 1: Módulo de atribuição

**Files:**
- Create: `app/lib/attribution.ts`
- Create: `tests/helpers.ts`, `tests/attribution.test.ts`
- Modify: `package.json` (script `test`, devDependency `jsdom`), `tsconfig.json` (`exclude`)

**Interfaces:**
- Produces:
  - `URL_KEYS: readonly ["utm_source", …, "fbclid"]`, `FIELD_KEYS` (URL_KEYS + `"landing_page"`, `"referrer"`)
  - `parseAttribution(search: URLSearchParams, pathname: string): Record<string, string> | null`
  - `gclidFromGclAw(cookieHeader: string): string`
  - `buildAttributionFields(stored: Record<string, unknown>, cookieHeader: string, referrer: string): AttributionFields`
  - `captureAttribution(search: URLSearchParams, pathname: string): void`
  - `appendAttribution(params: URLSearchParams): void`
  - `tests/helpers.ts`: `setupDom(html?: string, url?: string): JSDOM`

- [ ] **Step 1: Preparar o runner de testes**

```bash
cd C:/Users/pc/meu-site
npm install -D jsdom@26.1.0 --legacy-peer-deps
```

Em `package.json`, dentro de `"scripts"`, acrescentar depois de `"lint": "eslint"`:

```json
    "lint": "eslint",
    "test": "node --test tests/*.test.ts"
```

Em `tsconfig.json`, trocar `"exclude": ["node_modules"]` por:

```json
  "exclude": ["node_modules", "tests"]
```

(os testes importam com extensão `.ts`, o que o `next build` rejeitaria.)

- [ ] **Step 2: Escrever `tests/helpers.ts`**

```ts
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
```

- [ ] **Step 3: Escrever os testes que falham — `tests/attribution.test.ts`**

```ts
import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { setupDom } from "./helpers.ts";
import {
  FIELD_KEYS,
  parseAttribution,
  gclidFromGclAw,
  buildAttributionFields,
  captureAttribution,
  appendAttribution,
} from "../app/lib/attribution.ts";

const q = (s: string) => new URLSearchParams(s);
const payload = () => {
  const p = new URLSearchParams();
  appendAttribution(p);
  return p;
};

beforeEach(() => {
  setupDom();
});

test("sem parâmetros de campanha não há nada para guardar", () => {
  assert.equal(parseAttribution(q("?foo=1"), "/"), null);
  assert.equal(parseAttribution(q("?utm_source="), "/"), null);
});

test("guarda só as chaves com valor e a página de entrada", () => {
  assert.deepEqual(parseAttribution(q("?utm_source=google&utm_medium=&gclid=abc&x=1"), "/contactos/"), {
    utm_source: "google",
    gclid: "abc",
    landing_page: "/contactos/",
  });
});

test("gclid do cookie _gcl_aw: tudo depois do 2.º ponto", () => {
  assert.equal(gclidFromGclAw("a=1; _gcl_aw=GCL.1700000000.Cj0KCQ-abc; b=2"), "Cj0KCQ-abc");
  assert.equal(gclidFromGclAw("a=1"), "");
  assert.equal(gclidFromGclAw("_gcl_aw=GCL.123"), "");
});

test("12 campos sempre presentes, pela ordem da tabela", () => {
  const f = buildAttributionFields({}, "", "");
  assert.deepEqual(Object.keys(f), [...FIELD_KEYS]);
  assert.ok(Object.values(f).every((v) => v === ""));
});

test("gclid guardado ganha ao cookie; o cookie só entra quando falta", () => {
  assert.equal(buildAttributionFields({ gclid: "url" }, "_gcl_aw=GCL.1.cookie", "").gclid, "url");
  assert.equal(buildAttributionFields({}, "_gcl_aw=GCL.1.cookie", "").gclid, "cookie");
});

test("briefing 1: entra com UTMs na homepage, navega 2 páginas e envia", () => {
  captureAttribution(q("?utm_source=teste&utm_campaign=teste&gclid=TESTE123"), "/");
  captureAttribution(q(""), "/casas-lsf-madeira/");
  captureAttribution(q(""), "/contactos/");
  const p = payload();
  assert.equal(p.get("utm_source"), "teste");
  assert.equal(p.get("utm_campaign"), "teste");
  assert.equal(p.get("gclid"), "TESTE123");
  assert.equal(p.get("landing_page"), "/");
});

test("briefing 3: sem parâmetros vão os 12 campos vazios", () => {
  const p = payload();
  assert.deepEqual([...p.keys()], [...FIELD_KEYS]);
  assert.ok([...p.values()].every((v) => v === ""));
});

test("briefing 4: novo clique substitui tudo (não funde)", () => {
  captureAttribution(q("?utm_source=a&utm_campaign=x"), "/");
  captureAttribution(q("?utm_source=b"), "/sobre-nos/");
  const p = payload();
  assert.equal(p.get("utm_source"), "b");
  assert.equal(p.get("utm_campaign"), "");
  assert.equal(p.get("landing_page"), "/sobre-nos/");
});

test("gclid vem do cookie quando a pessoa volta noutro separador", () => {
  document.cookie = "_gcl_aw=GCL.1700000000.COOKIE123";
  assert.equal(payload().get("gclid"), "COOKIE123");
});

test("campos atuais do formulário ficam intactos e primeiro", () => {
  const p = new URLSearchParams();
  p.append("Nome", "Teste");
  p.append("Date", "15/09/2026");
  appendAttribution(p);
  assert.deepEqual([...p.keys()].slice(0, 2), ["Nome", "Date"]);
  assert.equal(p.get("Nome"), "Teste");
  assert.equal([...p.keys()].length, 14);
});

test("storage bloqueado nunca parte a página nem o envio", () => {
  const boom = () => {
    throw new Error("bloqueado");
  };
  (globalThis as any).sessionStorage = { getItem: boom, setItem: boom };
  assert.doesNotThrow(() => captureAttribution(q("?utm_source=x"), "/"));
  assert.equal([...payload().keys()].length, 12);
});
```

- [ ] **Step 4: Confirmar que falha**

Run: `npm test`
Expected: FAIL — `Cannot find module '.../app/lib/attribution.ts'`

- [ ] **Step 5: Implementar `app/lib/attribution.ts`**

```ts
// Atribuição de leads: guarda UTMs/gclid quando a pessoa aterra no site e junta-os a
// todos os envios para o Make (spec 2026-09-15-atribuicao-leads-e-form-blog-design.md).

export const URL_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "matchtype",
  "gclid",
  "gbraid",
  "wbraid",
  "fbclid",
] as const;

export const FIELD_KEYS = [...URL_KEYS, "landing_page", "referrer"] as const;

export type AttributionFields = Record<(typeof FIELD_KEYS)[number], string>;

const STORAGE_KEY = "attr";

/** Chaves com valor no URL + landing_page, ou null se o URL não traz nenhuma. */
export function parseAttribution(search: URLSearchParams, pathname: string): Record<string, string> | null {
  const found: Record<string, string> = {};
  for (const k of URL_KEYS) {
    const v = search.get(k);
    if (v) found[k] = v;
  }
  if (Object.keys(found).length === 0) return null;
  return { ...found, landing_page: pathname };
}

/** Cookie _gcl_aw do GTM ("GCL.<timestamp>.<gclid>") -> gclid. */
export function gclidFromGclAw(cookieHeader: string): string {
  const entry = cookieHeader.split(/;\s*/).find((c) => c.startsWith("_gcl_aw="));
  if (!entry) return "";
  const parts = decodeURIComponent(entry.slice("_gcl_aw=".length)).split(".");
  return parts.length >= 3 ? parts.slice(2).join(".") : "";
}

/** Os 12 campos, sempre presentes e por ordem; "" quando não há valor. */
export function buildAttributionFields(
  stored: Record<string, unknown>,
  cookieHeader: string,
  referrer: string
): AttributionFields {
  const fields = {} as AttributionFields;
  for (const k of FIELD_KEYS) {
    const v = stored[k];
    fields[k] = typeof v === "string" ? v : "";
  }
  if (!fields.gclid) fields.gclid = gclidFromGclAw(cookieHeader);
  fields.referrer = referrer;
  return fields;
}

/** Chamado em cada página: só escreve quando o URL traz parâmetros (e aí substitui tudo). */
export function captureAttribution(search: URLSearchParams, pathname: string): void {
  const found = parseAttribution(search, pathname);
  if (!found) return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(found));
  } catch {
    // storage bloqueado: a lead segue sem atribuição
  }
}

/** Acrescenta os 12 campos ao payload do formulário. Nunca lança. */
export function appendAttribution(params: URLSearchParams): void {
  let stored: Record<string, unknown> = {};
  try {
    const parsed = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}");
    if (parsed && typeof parsed === "object") stored = parsed;
  } catch {
    // storage bloqueado ou JSON inválido
  }
  let cookieHeader = "";
  let referrer = "";
  try {
    cookieHeader = document.cookie;
    referrer = document.referrer;
  } catch {
    // sem document (não acontece no browser)
  }
  const fields = buildAttributionFields(stored, cookieHeader, referrer);
  for (const k of FIELD_KEYS) params.append(k, fields[k]);
}
```

- [ ] **Step 6: Confirmar que passa**

Run: `npm test`
Expected: `ℹ pass 11`, `ℹ fail 0`

- [ ] **Step 7: Commit**

```bash
git add app/lib/attribution.ts tests/helpers.ts tests/attribution.test.ts package.json package-lock.json tsconfig.json
git commit -m "Atribuicao: modulo de captura de UTMs/gclid + testes"
```

---

### Task 2: Ligar a captura ao site e aos formulários

**Files:**
- Create: `app/components/AttributionCapture.tsx`
- Modify: `app/layout.tsx`, `app/components/MultiStepForm.tsx`, `app/components/MultiStepFormBlog.tsx`

**Interfaces:**
- Consumes: `captureAttribution`, `appendAttribution` (Task 1)
- Produces: payload dos 2 formulários = campos atuais + 12 campos

- [ ] **Step 1: Baseline de tipos**

Run: `npx tsc --noEmit 2>&1 | grep -c "error TS"`
Expected: um número (anotar; os passos seguintes não o podem aumentar).

- [ ] **Step 2: Criar `app/components/AttributionCapture.tsx`**

```tsx
"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { captureAttribution } from "../lib/attribution";

function AttributionTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Lê do URL real (caminho com barra final, como o servidor o serve)
    captureAttribution(new URLSearchParams(window.location.search), window.location.pathname);
  }, [pathname, searchParams]);

  return null;
}

export default function AttributionCapture() {
  return (
    <Suspense fallback={null}>
      <AttributionTracker />
    </Suspense>
  );
}
```

- [ ] **Step 3: Montar no `app/layout.tsx`**

Depois de `import GTMPageView from "./components/GTMPageView";` acrescentar:

```tsx
import AttributionCapture from "./components/AttributionCapture";
```

E trocar `        <GTMPageView />` por:

```tsx
        <GTMPageView />
        <AttributionCapture />
```

- [ ] **Step 4: Juntar os campos nos 2 formulários**

Em `app/components/MultiStepForm.tsx` e em `app/components/MultiStepFormBlog.tsx`, acrescentar a seguir ao import do CSS module:

```tsx
import { appendAttribution } from "../lib/attribution";
```

E em ambos trocar `      formData.append("Date", datePT);` por:

```tsx
      formData.append("Date", datePT);
      // UTMs/gclid da página de entrada (12 campos, sempre presentes)
      appendAttribution(formData);
```

- [ ] **Step 5: Verificar**

Run: `npm test` → `ℹ fail 0`
Run: `npx tsc --noEmit 2>&1 | grep -c "error TS"` → igual ao baseline
Run: `grep -n "appendAttribution" app/components/MultiStepForm.tsx app/components/MultiStepFormBlog.tsx` → 2 linhas de import + 2 chamadas

- [ ] **Step 6: Commit**

```bash
git add app/components/AttributionCapture.tsx app/layout.tsx app/components/MultiStepForm.tsx app/components/MultiStepFormBlog.tsx
git commit -m "Atribuicao: captura no layout + 12 campos nos formularios de leads"
```

---

### Task 3: Extrair os conversores do backoffice + rede de regressão

**Files:**
- Create: `app/backoffice/portableTextHtml.ts` (extração verbatim)
- Modify: `app/backoffice/page.tsx` (remove ~330 linhas, acrescenta 1 import)
- Modify: `tests/helpers.ts` (acrescenta `stripKeys`)
- Create: `tests/fixtures/build-golden.ts`, `tests/fixtures/posts.json`, `tests/fixtures/golden.json`, `tests/portableTextHtml.golden.test.ts`

**Interfaces:**
- Produces: `portableTextToHtml(blocks: any[]): string`, `htmlToPortableText(html: string): any[]`, `rand(): string` exportados de `app/backoffice/portableTextHtml.ts`; `stripKeys<T>(value: T): T` em `tests/helpers.ts`

- [ ] **Step 1: Extrair com script (não vai para o repo)**

Guardar em `<scratchpad>/extract-converters.cjs`:

```js
const fs = require("fs");
const root = "C:/Users/pc/meu-site/";
const pagePath = root + "app/backoffice/page.tsx";
const src = fs.readFileSync(pagePath, "utf8");
const eol = src.includes("\r\n") ? "\r\n" : "\n";
const lines = src.split(eol);
const start = lines.indexOf("function portableTextToHtml(blocks: any[]): string {");
const randStart = lines.indexOf("function rand(): string {");
if (start < 0 || randStart < start) throw new Error("marcos não encontrados");
if (lines[randStart + 2] !== "}") throw new Error("fim de rand() inesperado");
const moved = lines.slice(start, randStart + 3);
const tops = moved.filter((l) => l.startsWith("function "));
if (tops.length !== 3) throw new Error("esperava 3 funções de topo, encontrei " + tops.length);
const header = [
  "// Conteúdo dos artigos: editor do backoffice (HTML) <-> Sanity (Portable Text).",
  "// Extraído de app/backoffice/page.tsx para poder ser testado (tests/portableTextHtml.*.test.ts).",
  "",
];
const body = moved.map((l) => (l.startsWith("function ") ? "export " + l : l));
fs.writeFileSync(root + "app/backoffice/portableTextHtml.ts", header.concat(body).join("\n") + "\n");
const anchor = lines.indexOf('import { CF, COPY_PAGES } from "../data/copyFields";');
if (anchor < 0) throw new Error("import âncora não encontrado");
const rest = [...lines.slice(0, start), ...lines.slice(randStart + 3)];
rest.splice(anchor + 1, 0, 'import { portableTextToHtml, htmlToPortableText, rand } from "./portableTextHtml";');
fs.writeFileSync(pagePath, rest.join(eol));
console.log(`movidas ${moved.length} linhas (${start + 1}-${randStart + 3})`);
```

Run: `node <scratchpad>/extract-converters.cjs`
Expected: `movidas 331 linhas (125-455)` (±2)

- [ ] **Step 2: Verificar a extração**

Run: `git diff --stat` → `page.tsx` com ~330 remoções e 1 inserção
Run: `npx tsc --noEmit 2>&1 | grep -c "error TS"` → igual ao baseline da Task 2

- [ ] **Step 3: Acrescentar `stripKeys` a `tests/helpers.ts`**

```ts
/** Remove os _key aleatórios para comparar blocos do Sanity. */
export function stripKeys<T>(value: T): T {
  return JSON.parse(JSON.stringify(value, (k, v) => (k === "_key" ? undefined : v)));
}
```

- [ ] **Step 4: Gerar os fixtures com o código ainda sem alterações — `tests/fixtures/build-golden.ts`**

```ts
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
```

Run: `node tests/fixtures/build-golden.ts`
Expected: `28 artigos`

- [ ] **Step 5: Teste de regressão — `tests/portableTextHtml.golden.test.ts`**

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { setupDom, stripKeys } from "./helpers.ts";
import { portableTextToHtml, htmlToPortableText } from "../app/backoffice/portableTextHtml.ts";

setupDom();
const posts = JSON.parse(readFileSync(new URL("./fixtures/posts.json", import.meta.url), "utf8"));
const golden = JSON.parse(readFileSync(new URL("./fixtures/golden.json", import.meta.url), "utf8"));

for (const [i, post] of posts.entries()) {
  test(`artigo real sem alterações: ${post.slug}`, () => {
    const html = portableTextToHtml(post.content);
    assert.equal(html, golden[i].html);
    assert.deepEqual(stripKeys(htmlToPortableText(html)), golden[i].blocks);
  });
}
```

Run: `npm test`
Expected: `ℹ pass 39` (11 + 28), `ℹ fail 0`

- [ ] **Step 6: Commit**

```bash
git add app/backoffice/portableTextHtml.ts app/backoffice/page.tsx tests/helpers.ts tests/fixtures tests/portableTextHtml.golden.test.ts
git commit -m "Backoffice: conversores do editor em modulo proprio + regressao com os 28 artigos"
```

---

### Task 4: Cartão do formulário nos conversores

**Files:**
- Modify: `app/backoffice/portableTextHtml.ts`
- Test: `tests/portableTextHtml.form.test.ts`

**Interfaces:**
- Consumes: `rand` (Task 3)
- Produces: `FORM_MARKER_HTML: string`, `formCardHtml(): string`, `formMarkerBlock(): any`

- [ ] **Step 1: Testes que falham — `tests/portableTextHtml.form.test.ts`**

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { setupDom, stripKeys } from "./helpers.ts";
import {
  portableTextToHtml,
  htmlToPortableText,
  formCardHtml,
  FORM_MARKER_HTML,
} from "../app/backoffice/portableTextHtml.ts";

setupDom();

const marker = {
  _type: "block",
  style: "html",
  markDefs: [],
  children: [{ _type: "span", marks: [], text: FORM_MARKER_HTML }],
};
const para = (text: string) => ({
  _type: "block",
  style: "normal",
  markDefs: [],
  children: [{ _type: "span", marks: [], text }],
});
const save = (html: string) => stripKeys(htmlToPortableText(html));

test("marcador canónico é exatamente o que o site procura", () => {
  assert.equal(FORM_MARKER_HTML, '<div data-multistep-form="true"></div>');
});

test("cartão do editor é guardado como marcador limpo, na posição", () => {
  assert.deepEqual(save(`<p>Antes</p>${formCardHtml()}<p>Depois</p>`), [para("Antes"), marker, para("Depois")]);
});

test("marcador guardado volta ao editor como cartão", () => {
  assert.equal(portableTextToHtml([marker]), formCardHtml());
});

test("ida e volta mantém o formulário sem guardar texto da pré-visualização", () => {
  const blocks = save(portableTextToHtml([para("A"), marker, para("B")]));
  assert.deepEqual(blocks, [para("A"), marker, para("B")]);
  assert.ok(!JSON.stringify(blocks).includes("Interessado"));
});

test("cartão preso num item de lista sai a seguir à lista", () => {
  assert.deepEqual(save(`<ul><li>item${formCardHtml()}</li></ul><p>Depois</p>`), [
    { ...para("item"), listItem: "bullet", level: 1 },
    marker,
    para("Depois"),
  ]);
});

test("cartão preso num título sai a seguir ao título", () => {
  assert.deepEqual(save(`<h2>Título${formCardHtml()}</h2>`), [{ ...para("Título"), style: "h2" }, marker]);
});

test("div genérico mantém o formulário na posição", () => {
  assert.deepEqual(save(`<div><p>A</p>${formCardHtml()}<p>B</p></div>`), [para("A"), marker, para("B")]);
});

test("div com tabela: tabela intacta e sem cartão, formulário a seguir", () => {
  const blocks = save(`<div><table><tr><td>x</td></tr></table>${formCardHtml()}</div>`);
  assert.equal(blocks.length, 2);
  assert.equal(blocks[0].style, "html");
  assert.ok(blocks[0].children[0].text.includes("<table"));
  assert.ok(!blocks[0].children[0].text.includes("data-multistep-form"));
  assert.deepEqual(blocks[1], marker);
});
```

Run: `npm test`
Expected: FAIL — `formCardHtml is not a function` / export em falta

- [ ] **Step 2: Confirmar as cores do formulário real**

Run: `grep -n -A8 "^\.btnNext {\|^\.req {\|^\.label {" app/components/MultiStepFormBlog.module.css`
Se `.btnNext` usar outra cor de fundo que não `#86a941`, ou `.req` outra cor que não `#dc2626`, usar esses valores no Step 3.

- [ ] **Step 3: Implementar em `app/backoffice/portableTextHtml.ts`**

Acrescentar depois do cabeçalho do ficheiro:

```ts
// ─── Formulário de contacto nos artigos ───
// No Sanity fica só o marcador; o site troca-o por <MultiStepFormBlog /> (app/[slug]/page.tsx).
export const FORM_MARKER_HTML = '<div data-multistep-form="true"></div>';
const FORM_SELECTOR = "[data-multistep-form]";

export function formMarkerBlock(): any {
  return {
    _type: "block",
    _key: rand(),
    style: "html",
    markDefs: [],
    children: [{ _type: "span", _key: rand(), marks: [], text: FORM_MARKER_HTML }],
  };
}

/** Cartão do editor: não editável, com o aspeto do MultiStepFormBlog. */
export function formCardHtml(): string {
  return (
    '<div data-multistep-form="true" contenteditable="false" style="max-width:600px;margin:32px auto;background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;padding:32px 32px 20px;user-select:none;cursor:default">' +
    '<p style="text-align:center;margin:0 0 16px;font-size:1.6rem;line-height:1.2;font-weight:600;color:#0f172a">Interessado? Fale connosco!</p>' +
    '<div style="display:flex;gap:8px;justify-content:center;margin:0 0 24px"><span style="width:32px;height:4px;border-radius:4px;background:#86a941"></span><span style="width:32px;height:4px;border-radius:4px;background:#e2e8f0"></span><span style="width:32px;height:4px;border-radius:4px;background:#e2e8f0"></span></div>' +
    '<p style="margin:0 0 8px;font-weight:500;color:#0f172a">Possui Terreno? <span style="color:#dc2626">*</span></p>' +
    '<p style="margin:0 0 20px;color:#334155">◯ Sim &nbsp;&nbsp; ◯ Não</p>' +
    '<p style="margin:0 0 16px"><span style="display:block;text-align:center;background:#86a941;color:#fff;border-radius:8px;padding:12px;font-weight:600">Seguinte</span></p>' +
    '<p style="text-align:center;margin:0;font-size:0.8rem;color:#64748b">Pré-visualização — o formulário real aparece no artigo publicado.</p>' +
    "</div>"
  );
}
```

Em `portableTextToHtml`, trocar:

```ts
      const raw = (block.children || []).map((c: any) => c.text || "").join("");
      out.push(raw);
```

por:

```ts
      const raw = (block.children || []).map((c: any) => c.text || "").join("");
      out.push(raw.includes("data-multistep-form") ? formCardHtml() : raw);
```

Em `htmlToPortableText`, dentro de `processNodes`, logo a seguir à linha `const tag = el.tagName.toLowerCase();` que precede o comentário `// Preserve <style>, <table>, or divs containing them as raw HTML blocks` (NÃO a de `walk`, dentro de `parseChildren`), acrescentar:

```ts
      // Formulário: o cartão do editor vira sempre o marcador canónico
      if (el.matches(FORM_SELECTOR)) {
        flushList();
        blocks.push(formMarkerBlock());
        continue;
      }
      // Cartão preso dentro de outro bloco (título, lista, div com tabela): tirar e pôr a seguir.
      // Um div genérico não precisa: a recursão abaixo encontra o cartão na posição certa.
      const isWrapperDiv = tag === "div" && !el.querySelector("table, style");
      if (!isWrapperDiv && el.querySelector(FORM_SELECTOR)) {
        const cards = Array.from(el.querySelectorAll(FORM_SELECTOR));
        cards.forEach((c) => c.remove());
        processNodes([el]);
        flushList();
        cards.forEach(() => blocks.push(formMarkerBlock()));
        continue;
      }
```

- [ ] **Step 4: Confirmar que passa (e que a regressão continua verde)**

Run: `npm test`
Expected: `ℹ pass 47` (11 + 28 + 8), `ℹ fail 0`
Run: `npx tsc --noEmit 2>&1 | grep -c "error TS"` → igual ao baseline

- [ ] **Step 5: Commit**

```bash
git add app/backoffice/portableTextHtml.ts tests/portableTextHtml.form.test.ts
git commit -m "Blog: o formulario inserido no editor passa a ser guardado (marcador) e reaparece ao editar"
```

---

### Task 5: Inserir o cartão no editor

**Files:**
- Modify: `app/backoffice/portableTextHtml.ts`, `app/backoffice/page.tsx` (import + botão «Form» no `ContentEditor`)
- Test: `tests/insertFormCard.test.ts`

**Interfaces:**
- Consumes: `formCardHtml()`, `htmlToPortableText` (Task 4)
- Produces: `insertFormCard(editor: HTMLElement): void`

- [ ] **Step 1: Testes que falham — `tests/insertFormCard.test.ts`**

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { setupDom } from "./helpers.ts";
import { insertFormCard, htmlToPortableText, FORM_MARKER_HTML } from "../app/backoffice/portableTextHtml.ts";

function editorWith(html: string) {
  const dom = setupDom(`<div id="ed" contenteditable="true">${html}</div>`);
  const ed = dom.window.document.getElementById("ed")!;
  return { dom, ed };
}

function caretAtEnd(dom: any, node: any) {
  const r = dom.window.document.createRange();
  r.selectNodeContents(node);
  r.collapse(false);
  const s = dom.window.getSelection();
  s.removeAllRanges();
  s.addRange(r);
}

const shape = (ed: any) =>
  [...ed.childNodes].map((n: any) =>
    n.nodeType === 1 ? n.nodeName + (n.hasAttribute("data-multistep-form") ? "[form]" : "") : "#text"
  );

test("cursor num parágrafo vazio: o cartão substitui-o", () => {
  const { dom, ed } = editorWith(`<p>Antes</p><p id="t"><br></p>`);
  caretAtEnd(dom, ed.querySelector("#t"));
  insertFormCard(ed);
  assert.deepEqual(shape(ed), ["P", "DIV[form]", "P"]);
  assert.equal(ed.querySelector("#t"), null);
});

test("cursor num parágrafo com texto: o cartão entra a seguir", () => {
  const { dom, ed } = editorWith(`<p id="t">texto</p><p>Depois</p>`);
  caretAtEnd(dom, ed.querySelector("#t"));
  insertFormCard(ed);
  assert.deepEqual(shape(ed), ["P", "DIV[form]", "P", "P"]);
  assert.equal(ed.firstChild.textContent, "texto");
});

test("cursor num título: o título fica intacto", () => {
  const { dom, ed } = editorWith(`<h2 id="t">Título</h2>`);
  caretAtEnd(dom, ed.querySelector("#t"));
  insertFormCard(ed);
  assert.deepEqual(shape(ed), ["H2", "DIV[form]", "P"]);
  assert.equal(ed.querySelector("h2").textContent, "Título");
});

test("cursor numa lista: o cartão entra a seguir à lista", () => {
  const { dom, ed } = editorWith(`<ul><li id="t">item</li></ul>`);
  caretAtEnd(dom, ed.querySelector("#t"));
  insertFormCard(ed);
  assert.deepEqual(shape(ed), ["UL", "DIV[form]", "P"]);
  assert.equal(ed.querySelector("li [data-multistep-form]"), null);
});

test("sem cursor no editor: o cartão entra no fim", () => {
  const { dom, ed } = editorWith(`<p>A</p>`);
  dom.window.getSelection().removeAllRanges();
  insertFormCard(ed);
  assert.deepEqual(shape(ed), ["P", "DIV[form]", "P"]);
});

test("o cursor fica no parágrafo novo para continuar a escrever", () => {
  const { dom, ed } = editorWith(`<h2 id="t">Título</h2>`);
  caretAtEnd(dom, ed.querySelector("#t"));
  insertFormCard(ed);
  assert.equal(dom.window.getSelection().anchorNode, ed.lastChild);
});

test("depois de inserir, guardar dá exatamente 1 marcador e nenhum texto provisório", () => {
  const { dom, ed } = editorWith(`<h2 id="t">Título</h2><p>fim</p>`);
  caretAtEnd(dom, ed.querySelector("#t"));
  insertFormCard(ed);
  const json = JSON.stringify(htmlToPortableText(ed.innerHTML));
  assert.equal(json.split(JSON.stringify(FORM_MARKER_HTML).slice(1, -1)).length - 1, 1);
  assert.ok(!json.includes("Interessado"));
});
```

Run: `npm test`
Expected: FAIL — `insertFormCard is not a function`

- [ ] **Step 2: Implementar `insertFormCard` em `app/backoffice/portableTextHtml.ts`** (a seguir a `formCardHtml`)

```ts
function isEmptyBlock(node: Node): boolean {
  if (node.nodeName !== "P" && node.nodeName !== "DIV") return false;
  const el = node as Element;
  return !(el.textContent || "").trim() && !el.querySelector("img, table, [data-multistep-form]");
}

/** Insere o cartão como bloco de topo do editor — nunca dentro de título, parágrafo ou lista. */
export function insertFormCard(editor: HTMLElement): void {
  const doc = editor.ownerDocument;
  const tpl = doc.createElement("div");
  tpl.innerHTML = formCardHtml();
  const card = tpl.firstElementChild as HTMLElement;
  const after = doc.createElement("p");
  after.appendChild(doc.createElement("br"));

  const sel = doc.getSelection();
  const range = sel && sel.rangeCount > 0 ? sel.getRangeAt(0) : null;

  if (!range || !editor.contains(range.startContainer)) {
    editor.append(card, after);
  } else if (range.startContainer === editor) {
    const prev = editor.childNodes[range.startOffset - 1];
    if (prev) prev.after(card, after);
    else editor.prepend(card, after);
  } else {
    let top: Node = range.startContainer;
    while (top.parentNode && top.parentNode !== editor) top = top.parentNode;
    if (isEmptyBlock(top)) {
      editor.replaceChild(card, top);
      card.after(after);
    } else {
      (top as ChildNode).after(card, after);
    }
  }

  const caret = doc.createRange();
  caret.setStart(after, 0);
  caret.collapse(true);
  sel?.removeAllRanges();
  sel?.addRange(caret);
}
```

Run: `npm test`
Expected: `ℹ pass 54`, `ℹ fail 0`

- [ ] **Step 3: Ligar o botão «Form» no `app/backoffice/page.tsx`**

Trocar o import criado na Task 3 por:

```tsx
import { portableTextToHtml, htmlToPortableText, rand, insertFormCard, formCardHtml } from "./portableTextHtml";
```

Ler as linhas do botão (procurar `title="Inserir Formulário de Contacto"`) e substituir o bloco inteiro, desde `<button className={styles.toolbarBtn} onClick={() => {` cuja linha seguinte começa por `const formHtml =` até `}} title="Inserir Formulário de Contacto">`, por:

```tsx
            <button className={styles.toolbarBtn} onClick={() => {
              if (mode === "visual" && editorRef.current) {
                insertFormCard(editorRef.current);
                editorRef.current.focus();
              } else {
                setHtmlCode(htmlCode + "\n" + formCardHtml());
              }
            }} title="Inserir Formulário de Contacto">
```

- [ ] **Step 4: Verificar**

Run: `grep -n "insertHTML\|const formHtml" app/backoffice/page.tsx` → nenhuma linha do formulário
Run: `npx tsc --noEmit 2>&1 | grep -c "error TS"` → igual ao baseline
Run: `npm test` → `ℹ fail 0`

- [ ] **Step 5: Commit**

```bash
git add app/backoffice/portableTextHtml.ts app/backoffice/page.tsx tests/insertFormCard.test.ts
git commit -m "Blog: botao Form insere o cartao do formulario fora de titulos e listas"
```

---

### Task 6: CSP + verificação no build local

**Files:**
- Modify: `public/.htaccess` (linha `Header set Content-Security-Policy`)

- [ ] **Step 1: Atualizar a CSP**

Substituir a linha inteira `  Header set Content-Security-Policy "…"` por:

```apache
  Header set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://ssl.google-analytics.com https://tagmanager.google.com https://connect.facebook.net https://translate.google.com https://translate.googleapis.com https://capi-automation.s3.us-east-2.amazonaws.com https://www.clarity.ms https://*.clarity.ms https://analytics.ahrefs.com; connect-src 'self' https://onxd36ek.api.sanity.io https://onxd36ek.apicdn.sanity.io https://api.github.com https://www.google-analytics.com https://region1.google-analytics.com https://analytics.google.com https://www.googletagmanager.com https://hook.eu1.make.com https://www.facebook.com https://translate.googleapis.com https://translate-pa.googleapis.com https://*.clarity.ms https://analytics.ahrefs.com; img-src 'self' data: blob: https://www.google-analytics.com https://www.googletagmanager.com https://ssl.gstatic.com https://www.gstatic.com https://cdn.sanity.io https://www.facebook.com https://fonts.gstatic.com https://*.clarity.ms https://c.bing.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://tagmanager.google.com https://www.gstatic.com; font-src 'self' https://fonts.gstatic.com data:; frame-src https://www.googletagmanager.com;"
```

- [ ] **Step 2: Build local**

Run: `npm run build`
Expected: termina sem erros e gera `out/`.
Run: `git status --short` — se `app/data/copy.generated.ts` aparecer modificado pelo `prebuild`, repor com `git checkout -- app/data/copy.generated.ts`.

- [ ] **Step 3: Servir `out/` com o mesmo cabeçalho CSP**

Guardar em `<scratchpad>/serve-json.cjs` e correr com `node`:

```js
const fs = require("fs");
const ht = fs.readFileSync("C:/Users/pc/meu-site/public/.htaccess", "utf8");
const csp = ht.match(/Header set Content-Security-Policy "([^"]+)"/)[1];
fs.writeFileSync(
  "C:/Users/pc/meu-site/out/serve.json",
  JSON.stringify({ trailingSlash: true, headers: [{ source: "**", headers: [{ key: "Content-Security-Policy", value: csp }] }] })
);
console.log("serve.json ok");
```

Abrir no painel Browser um servidor `npx serve out -l 3001` (configuração de preview, nunca via Bash) e confirmar no browser que `fetch("/", {method: "HEAD"})` devolve `content-security-policy` com `capi-automation`.

- [ ] **Step 4: Testes do briefing no browser (fetch intercetado)**

Antes de cada envio, na página do formulário, correr (inspeção):

```js
const orig = window.fetch;
window.fetch = async (url, opts) => {
  if (String(url).includes("hook.eu1.make.com")) {
    localStorage.setItem("__payload", String(opts.body));
    return new Response("Accepted", { status: 200 });
  }
  return orig(url, opts);
};
```

Preencher o formulário (Não → Seguinte → Seguinte → Nome/Email/Contacto/Privacidade → Enviar) e, já em `/obrigado/`, ler `Object.fromEntries(new URLSearchParams(localStorage.getItem("__payload")))`.

| # | Passos | Esperado no payload |
|---|---|---|
| 1 | `/?utm_source=teste&utm_campaign=teste&gclid=TESTE123` → clicar menu para 2 páginas → formulário | `utm_source=teste`, `utm_campaign=teste`, `gclid=TESTE123`, `landing_page=/`, campos atuais intactos |
| 2 | separador novo: `/contactos/?utm_source=teste&utm_campaign=teste&gclid=TESTE123` → enviar | igual ao 1 com `landing_page=/contactos/` |
| 3 | separador novo: `/contactos/` → enviar | 12 campos presentes e vazios |
| 4 | `/?utm_source=a` → mesmo separador `/sobre-nos/?utm_source=b` → enviar | `utm_source=b` |

- [ ] **Step 5: Consola**

Na homepage local, sem interagir com o banner de cookies: `read_console_messages` com `onlyErrors` → nenhum erro de CSP para capi-automation, clarity, ahrefs, translate, fonts.gstatic. Se aparecer outra origem **destes mesmos serviços**, acrescentá-la à diretiva indicada no erro e repetir Steps 1–5. Origens de outros serviços: perguntar.

- [ ] **Step 6: Limpar e commit**

Run: `rm out/serve.json`

```bash
git add public/.htaccess
git commit -m "CSP: autorizar CAPI Meta, Google Translate, Clarity e Ahrefs carregados pelo GTM"
```

---

### Task 7: Reparar os 2 artigos no Sanity (produção — pedir OK)

**Files:** nenhum no repo. Script em `<scratchpad>/repair-form-blocks.mjs`.

- [ ] **Step 1: Escrever o script**

```js
// Uso: node repair-form-blocks.mjs          (mostra o que ia mudar)
//      node repair-form-blocks.mjs --apply  (grava no Sanity, produção)
import { readFileSync } from "node:fs";

const SLUGS = [
  "a-tua-casa-em-aco-leve-vai-ter-bom-isolamento-a-lei-ja-responde-a-isso-desde-2006",
  "arranha-ceus-madeira-europa-construcao-sustentavel",
];
const API = "https://onxd36ek.api.sanity.io/v2024-01-01/data";
const MARKER_TEXT = '<div data-multistep-form="true"></div>';
const PLACEHOLDER = /^(Formulário de Contacto)?\s*(Este bloco será substituído pelo formulário interativo no site publicado\.)?$/;
const apply = process.argv.includes("--apply");

function readToken() {
  if (process.env.SANITY_WRITE_TOKEN) return process.env.SANITY_WRITE_TOKEN;
  try {
    const env = readFileSync("C:/Users/pc/meu-site/.env.local", "utf8");
    const m = env.match(/^(?:NEXT_PUBLIC_)?SANITY_WRITE_TOKEN=(.+)$/m);
    return m ? m[1].trim() : "";
  } catch {
    return "";
  }
}

const rand = () => Math.random().toString(36).substring(2, 10);
const isPlaceholderSpan = (c) => typeof c.text === "string" && c.text.trim() !== "" && PLACEHOLDER.test(c.text.trim());
const marker = (key = rand()) => ({
  _type: "block",
  _key: key,
  style: "html",
  markDefs: [],
  children: [{ _type: "span", _key: rand(), marks: [], text: MARKER_TEXT }],
});

const token = readToken();
const auth = token ? { Authorization: `Bearer ${token}` } : {};
const query = encodeURIComponent('*[_type == "post" && slug.current in $slugs]{_id, _rev, "slug": slug.current, content}');
const params = `&%24slugs=${encodeURIComponent(JSON.stringify(SLUGS))}`;
const docs = (await (await fetch(`${API}/query/production?query=${query}${params}`, { headers: auth })).json()).result;

const mutations = [];
for (const doc of docs) {
  if (doc._id.startsWith("drafts.")) {
    console.log(`⚠ existe rascunho ${doc._id} — parar e perguntar`);
    process.exitCode = 1;
    continue;
  }
  const hits = doc.content.filter((b) => b._type === "block" && (b.children || []).some(isPlaceholderSpan));
  if (hits.length !== 1) {
    console.log(`⚠ ${doc.slug}: esperava 1 bloco com texto provisório, encontrei ${hits.length}`);
    process.exitCode = 1;
    continue;
  }
  const block = hits[0];
  const path = `content[_key=="${block._key}"]`;
  const kept = block.children.filter((c) => !isPlaceholderSpan(c));
  if (kept.every((c) => !(c.text || "").trim())) {
    mutations.push({ patch: { id: doc._id, ifRevisionID: doc._rev, set: { [path]: marker(block._key) } } });
    console.log(`${doc.slug}: bloco ${block._key} (${block.style}) -> marcador do formulário`);
  } else {
    mutations.push({
      patch: { id: doc._id, ifRevisionID: doc._rev, set: { [`${path}.children`]: kept }, insert: { after: path, items: [marker()] } },
    });
    console.log(`${doc.slug}: bloco ${block._key} perde ${block.children.length - kept.length} spans provisórios; marcador entra a seguir`);
  }
}

console.log(JSON.stringify(mutations, null, 2));
if (docs.length !== SLUGS.length) {
  console.log(`⚠ encontrados ${docs.length} documentos para ${SLUGS.length} slugs`);
  process.exitCode = 1;
}
if (!apply || process.exitCode) {
  console.log(apply ? "Abortado — nada gravado." : "Dry-run — nada gravado.");
  process.exit();
}
if (!token) {
  console.log("Sem SANITY_WRITE_TOKEN no .env.local — nada gravado.");
  process.exit(1);
}

const w = await fetch(`${API}/mutate/production?returnIds=true`, {
  method: "POST",
  headers: { "Content-Type": "application/json", ...auth },
  body: JSON.stringify({ mutations }),
});
console.log("mutate", w.status, JSON.stringify(await w.json()));

const check = (await (await fetch(`${API}/query/production?query=${query}${params}`, { headers: auth })).json()).result;
for (const d of check) {
  const markers = d.content.filter((b) => b.style === "html" && (b.children || []).some((c) => c.text === MARKER_TEXT)).length;
  const left = d.content.filter((b) => (b.children || []).some(isPlaceholderSpan)).length;
  console.log(`${d.slug}: marcadores=${markers} texto provisório=${left}`);
}
```

- [ ] **Step 2: Dry-run e mostrar ao utilizador**

Run: `node <scratchpad>/repair-form-blocks.mjs`
Expected: 2 linhas de resumo (`a-tua-casa…: bloco vbpqnopa (h2) -> marcador`, `arranha-ceus…: bloco … perde 2 spans provisórios; marcador entra a seguir`) + JSON das mutações; `Dry-run — nada gravado.`
Mostrar o resumo ao utilizador e **pedir OK**.

- [ ] **Step 3: Token**

Se não houver `SANITY_WRITE_TOKEN` no `.env.local`, pedir ao utilizador para acrescentar ele próprio a linha `SANITY_WRITE_TOKEN=…` ao ficheiro (nunca por mensagem), ou em alternativa refazer os 2 blocos no backoffice depois do deploy.

- [ ] **Step 4: Aplicar (só com OK)**

Run: `node <scratchpad>/repair-form-blocks.mjs --apply`
Expected: `mutate 200 …` e `marcadores=1 texto provisório=0` nos 2 artigos.

- [ ] **Step 5: Verificar no build local**

Run: `npm run build` (repor `app/data/copy.generated.ts` se mudar), servir `out/` como na Task 6.
Abrir os 2 artigos → o formulário "Interessado? Fale connosco!" aparece no sítio do antigo texto cinzento. Com `/<artigo>/?utm_source=blog-teste`, intercetar o fetch e enviar → payload com os campos atuais + `utm_source=blog-teste` + `landing_page=/<artigo>/`.

---

### Task 8: Publicar (pedir OK para push + deploy)

- [ ] **Step 1: Tudo verde**

Run: `npm test` → `ℹ fail 0`
Run: `git status --short` → só os `out_*.zip` antigos por seguir

- [ ] **Step 2: Juntar ao `master`**

```bash
git fetch origin
git checkout master
git merge --ff-only origin/master
git merge --ff-only feat/atribuicao-leads-form-blog
```

Se o último merge não for fast-forward (alguém publicou entretanto): `git checkout feat/atribuicao-leads-form-blog && git rebase master`, repetir `npm test` e voltar ao início do Step 2.

- [ ] **Step 3: Push e deploy (só com OK)**

```bash
git push origin master
gh workflow run deploy.yml -R donatowoo-web/teste --ref master
gh run list -R donatowoo-web/teste --workflow deploy.yml -L 1 --json databaseId,status -q ".[0].databaseId"
gh run watch <databaseId> -R donatowoo-web/teste --exit-status
```

Confirmar que o run listado tem `createdAt` posterior ao dispatch (se não, repetir o `gh run list` passados uns segundos).
Expected: run `completed success` (é o mesmo que o botão Publicar).

- [ ] **Step 4: Verificar no site publicado**

No painel Browser, em `https://www.evaplace.pt/`:
- `(await fetch("/", {method: "HEAD"})).headers.get("content-security-policy")` contém `capi-automation` e `clarity.ms`
- os chunks `/_next/` que contêm `hook.eu1.make.com` contêm também `landing_page`
- consola sem erros de CSP (sem mexer no banner de cookies)
- os 2 artigos reparados mostram o formulário
- teste 1 do briefing com o fetch intercetado (nenhuma lead real criada)

---

### Task 9: Entrega

- [ ] **Step 1:** Atualizar a memória `evaplace-site-meu-site` (estado: atribuição e formulário do blog publicados, data).
- [ ] **Step 2:** Mensagem ao utilizador com: confirmação; lista de pontos de captura (spec, "Onde fica aplicado"); payload de exemplo capturado; pedidos do lado da Evaplace — «Redetermine data structure» no webhook do Make, envio real para ver o payload no Make/Pipedrive, teste 5 num iPhone real, teste visual do botão «Form» no backoffice; lembrete da tarefa separada do token Sanity exposto.
