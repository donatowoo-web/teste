import { test } from "node:test";
import assert from "node:assert/strict";
import {
  CONCELHOS,
  LEAD_CONFIG,
  OUTRO_CONCELHO,
  RESPOSTAS_VAZIAS,
  calcularLeadStatus,
  eventoDataLayer,
  payloadDaLead,
  pesquisarConcelhos,
  responder,
  sequenciaDePassos,
  telefoneValido,
  zonaDoConcelho,
  type Respostas,
} from "../app/lib/leadQualificacao.ts";

/** Responde pela ordem, como a pessoa faria no formulário. */
function preencher(passos: [keyof Respostas, string][]): Respostas {
  return passos.reduce((r, [k, v]) => responder(r, k, v as never), RESPOSTAS_VAZIAS);
}

test("58 concelhos: 25 na Zona 1 e 33 na Zona 2, sem repetidos", () => {
  assert.equal(CONCELHOS.filter((c) => c.zona === "zona_1").length, 25);
  assert.equal(CONCELHOS.filter((c) => c.zona === "zona_2").length, 33);
  assert.equal(new Set(CONCELHOS.map((c) => c.nome)).size, 58);
});

test("o concelho define a zona; Outro concelho fica fora", () => {
  assert.equal(zonaDoConcelho("Maia"), "zona_1");
  assert.equal(zonaDoConcelho("Viana do Castelo"), "zona_2");
  assert.equal(zonaDoConcelho(OUTRO_CONCELHO), "fora");
  assert.equal(zonaDoConcelho("Lisboa"), "fora");
});

test("pesquisa sem acentos e por parte do nome", () => {
  assert.equal(pesquisarConcelhos("gaia")[0].nome, "Vila Nova de Gaia");
  assert.equal(pesquisarConcelhos("povoa")[0].nome, "Póvoa de Lanhoso");
  assert.ok(pesquisarConcelhos("feira").some((c) => c.nome === "Santa Maria da Feira"));
  assert.equal(pesquisarConcelhos("lisboa").length, 0);
});

// --- Os 9 casos pedidos (secção 9) ---

test("1. Maia, aço leve, terreno Sim, viab. Sim, T3, 139-162k → qualificada", () => {
  const r = preencher([["concelho", "Maia"], ["estrutura", "aco_leve"], ["terreno", "sim"], ["viabilidade", "sim"], ["tipologia", "T3"], ["orcamento", "139000_162000"]]);
  assert.equal(calcularLeadStatus(r), "qualificada");
});

test("2. Maia, aço leve, terreno Sim, T3, 108-139k → nao_qualificada_orcamento", () => {
  const r = preencher([["concelho", "Maia"], ["estrutura", "aco_leve"], ["terreno", "sim"], ["viabilidade", "sim"], ["tipologia", "T3"], ["orcamento", "108000_139000"]]);
  assert.equal(calcularLeadStatus(r), "nao_qualificada_orcamento");
});

test("3. Viana do Castelo, madeira Sim, terreno Sim, T2, 107-125k → qualificada sem passo 2", () => {
  const r = preencher([["concelho", "Viana do Castelo"], ["interesseMadeira", "sim"], ["terreno", "sim"], ["viabilidade", "sim"], ["tipologia", "T2"], ["orcamento", "107000_125000"]]);
  assert.equal(r.estrutura, "madeira");
  assert.ok(!sequenciaDePassos(r).includes("estrutura"));
  assert.equal(calcularLeadStatus(r), "qualificada");
});

test("4. Viana do Castelo, madeira Não, resto preenchido → fora_zona, faz todos os passos", () => {
  const r = preencher([["concelho", "Viana do Castelo"], ["interesseMadeira", "nao"], ["estrutura", "madeira"], ["terreno", "sim"], ["viabilidade", "sim"], ["tipologia", "T2"], ["orcamento", "180000_mais"]]);
  assert.deepEqual(sequenciaDePassos(r), ["concelho", "estrutura", "terreno", "viabilidade", "tipologia", "orcamento", "contactos"]);
  assert.equal(calcularLeadStatus(r), "fora_zona");
});

test("5. Outro concelho (Lisboa), resto preenchido → fora_zona", () => {
  const r = preencher([["concelho", OUTRO_CONCELHO], ["estrutura", "aco_leve"], ["terreno", "sim"], ["viabilidade", "sim"], ["tipologia", "T1"], ["orcamento", "220000_mais"]]);
  assert.ok(sequenciaDePassos(r).includes("contactos"));
  assert.equal(calcularLeadStatus(r), "fora_zona");
});

test("6. Braga, madeira, terreno Não, T2, 84-107k → nao_qualificada_terreno, sem viabilidade", () => {
  const r = preencher([["concelho", "Braga"], ["estrutura", "madeira"], ["terreno", "nao"], ["tipologia", "T2"], ["orcamento", "84000_107000"]]);
  assert.ok(!sequenciaDePassos(r).includes("viabilidade"));
  assert.equal(calcularLeadStatus(r), "nao_qualificada_terreno");
});

test("7. Gaia, aço leve, terreno Sim, viab. Não sei, T1, 75-108k → qualificada", () => {
  const r = preencher([["concelho", "Vila Nova de Gaia"], ["estrutura", "aco_leve"], ["terreno", "sim"], ["viabilidade", "nao_sei"], ["tipologia", "T1"], ["orcamento", "75000_108000"]]);
  assert.equal(calcularLeadStatus(r), "qualificada");
});

test("8. Madeira, T4, menos de 62k → nao_qualificada_orcamento", () => {
  const r = preencher([["concelho", "Porto"], ["estrutura", "madeira"], ["terreno", "sim"], ["viabilidade", "sim"], ["tipologia", "T4+"], ["orcamento", "0_62000"]]);
  assert.equal(calcularLeadStatus(r), "nao_qualificada_orcamento");
});

// --- Regras extra ---

test("ordem quando falham vários: zona antes de terreno antes de orçamento", () => {
  const r = preencher([["concelho", OUTRO_CONCELHO], ["estrutura", "aco_leve"], ["terreno", "nao"], ["tipologia", "T4+"], ["orcamento", "0_75000"]]);
  assert.equal(calcularLeadStatus(r), "fora_zona");
  const r2 = preencher([["concelho", "Maia"], ["estrutura", "aco_leve"], ["terreno", "nao"], ["tipologia", "T4+"], ["orcamento", "0_75000"]]);
  assert.equal(calcularLeadStatus(r2), "nao_qualificada_terreno");
});

test("Zona 2 só qualifica em madeira", () => {
  const r = preencher([["concelho", "Aveiro"], ["interesseMadeira", "sim"], ["terreno", "sim"], ["viabilidade", "sim"], ["tipologia", "T1"], ["orcamento", "180000_mais"]]);
  assert.equal(calcularLeadStatus(r), "qualificada");
  assert.equal(calcularLeadStatus({ ...r, estrutura: "aco_leve", orcamento: "220000_mais" }), "fora_zona");
});

test("os limites exatos contam como válidos em todas as tipologias", () => {
  for (const estrutura of ["aco_leve", "madeira"] as const) {
    for (const t of LEAD_CONFIG.tipologias) {
      const minimo = LEAD_CONFIG.minimoTipologia[estrutura][t.id];
      const intervalo = LEAD_CONFIG.intervalos[estrutura].find((i) => i.limiteInferior === minimo)!;
      const r = preencher([["concelho", "Maia"], ["estrutura", estrutura], ["terreno", "sim"], ["viabilidade", "sim"], ["tipologia", t.id], ["orcamento", intervalo.id]]);
      assert.equal(calcularLeadStatus(r), "qualificada", `${estrutura} ${t.id}`);
    }
  }
});

test("sem tipologia o orçamento falha sempre", () => {
  const r = preencher([["concelho", "Maia"], ["estrutura", "aco_leve"], ["terreno", "sim"], ["viabilidade", "sim"], ["orcamento", "220000_mais"]]);
  assert.equal(calcularLeadStatus(r), "nao_qualificada_orcamento");
});

test("mudar de estrutura apaga o orçamento (os intervalos são outros)", () => {
  const r = preencher([["concelho", "Maia"], ["estrutura", "aco_leve"], ["orcamento", "139000_162000"], ["estrutura", "madeira"]]);
  assert.equal(r.orcamento, "");
});

test("trocar de Zona 2 (madeira fixada) para Zona 1 volta a pedir a estrutura", () => {
  const r = preencher([["concelho", "Ovar"], ["interesseMadeira", "sim"], ["concelho", "Maia"]]);
  assert.equal(r.estrutura, "");
  assert.equal(r.interesseMadeira, "");
  assert.ok(sequenciaDePassos(r).includes("estrutura"));
});

test("terreno Não apaga a viabilidade já respondida", () => {
  const r = preencher([["terreno", "sim"], ["viabilidade", "sim"], ["terreno", "nao"]]);
  assert.equal(r.viabilidade, "");
});

test("telefone: aceita formatos comuns, recusa curtos ou com letras", () => {
  assert.ok(telefoneValido("912 345 678"));
  assert.ok(telefoneValido("+351 912345678"));
  assert.ok(!telefoneValido("12345"));
  assert.ok(!telefoneValido("91234567a"));
});

test("dataLayer sem dados pessoais e payload com chaves antigas + novas", () => {
  const r = preencher([["concelho", "Maia"], ["estrutura", "aco_leve"], ["terreno", "sim"], ["viabilidade", "sim"], ["tipologia", "T3"], ["orcamento", "139000_162000"]]);
  const ev = eventoDataLayer(r, "lead_geral", "id-1");
  assert.deepEqual(ev, {
    event: "evaplace_lead",
    lead_status: "qualificada",
    zona: "zona_1",
    estrutura: "aco_leve",
    tipologia: "T3",
    orcamento_intervalo: "139000_162000",
    terreno: "sim",
    viabilidade: "sim",
    form_id: "lead_geral",
    lead_id: "id-1",
  });
  const p = payloadDaLead({
    respostas: r,
    concelhoOutro: "",
    contactos: { nome: "Ana", telefone: "912345678", email: "ana@x.pt", rgpd: true },
    formId: "lead_geral",
    leadId: "id-1",
    pageUrl: "https://www.evaplace.pt/contactos/",
    agora: new Date(2026, 10, 10),
  });
  assert.equal(p.get("Possuí Terreno?"), "Sim");
  assert.equal(p.get("Concelho do terreno"), "Maia");
  assert.equal(p.get("Date"), "10/11/2026");
  assert.equal(p.get("lead_status"), "qualificada");
  assert.equal(p.get("orcamento_label"), "139.000 a 162.000 €");
  assert.equal(p.get("page_url"), "https://www.evaplace.pt/contactos/");
  // Fora das landing pages de campanha o campo existe e vai vazio
  assert.equal(p.get("campanha"), "");
});

test("payloadDaLead leva a campanha quando a página a indica", () => {
  const p = payloadDaLead({
    respostas: preencher([["concelho", "Maia"]]),
    concelhoOutro: "",
    contactos: { nome: "Ana", telefone: "912345678", email: "ana@x.pt", rgpd: true },
    formId: "lead_geral",
    leadId: "id-2",
    pageUrl: "https://www.evaplace.pt/campanha-projeto/",
    agora: new Date(2026, 10, 13),
    campanha: "black-friday-esquadro",
  });
  assert.equal(p.get("campanha"), "black-friday-esquadro");
});

test("Outro concelho escrito pela pessoa vai no payload", () => {
  const r = preencher([["concelho", OUTRO_CONCELHO], ["estrutura", "aco_leve"]]);
  const p = payloadDaLead({
    respostas: r,
    concelhoOutro: " Lisboa ",
    contactos: { nome: "A", telefone: "", email: "", rgpd: false },
    formId: "lead_geral",
    leadId: "x",
    pageUrl: "",
    agora: new Date(),
  });
  assert.equal(p.get("Concelho do terreno"), "Outro concelho: Lisboa");
  assert.equal(p.get("concelho_outro"), "Lisboa");
  assert.equal(p.get("zona"), "fora");
});
