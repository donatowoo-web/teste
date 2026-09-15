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
