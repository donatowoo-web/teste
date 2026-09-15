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
  const blocks = htmlToPortableText(ed.innerHTML);
  const markers = blocks.filter((b: any) => b.style === "html" && b.children?.[0]?.text === FORM_MARKER_HTML);
  assert.equal(markers.length, 1);
  assert.ok(!JSON.stringify(blocks).includes("Interessado"));
});
