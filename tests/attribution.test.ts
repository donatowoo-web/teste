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
