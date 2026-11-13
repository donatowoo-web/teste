// Qualificação das leads do formulário geral do site (mesma lógica do formulário do Meta).
// Tudo o que a equipa pode querer mudar (concelhos, orçamentos, textos) está em LEAD_CONFIG;
// as funções abaixo só leem a configuração.

export type Zona = "zona_1" | "zona_2" | "fora";
export type Estrutura = "aco_leve" | "madeira";
export type SimNao = "sim" | "nao";
export type Viabilidade = "sim" | "nao" | "nao_sei";
export type Tipologia = "T1" | "T2" | "T3" | "T4+";
export type LeadStatus =
  | "qualificada"
  | "nao_qualificada_terreno"
  | "nao_qualificada_orcamento"
  | "fora_zona";

export type IntervaloOrcamento = { id: string; label: string; limiteInferior: number };

export const OUTRO_CONCELHO = "Outro concelho";

export const LEAD_CONFIG = {
  concelhos: {
    zona_1: {
      Porto: [
        "Amarante", "Felgueiras", "Gondomar", "Lousada", "Maia", "Matosinhos", "Paços de Ferreira",
        "Paredes", "Penafiel", "Porto", "Póvoa de Varzim", "Santo Tirso", "Trofa", "Valongo",
        "Vila do Conde", "Vila Nova de Gaia",
      ],
      Braga: ["Barcelos", "Braga", "Esposende", "Fafe", "Guimarães", "Vila Nova de Famalicão", "Vizela"],
      Aveiro: ["Espinho", "Santa Maria da Feira"],
    },
    zona_2: {
      Porto: ["Baião", "Marco de Canaveses"],
      Braga: [
        "Amares", "Cabeceiras de Basto", "Celorico de Basto", "Póvoa de Lanhoso", "Terras de Bouro",
        "Vieira do Minho", "Vila Verde",
      ],
      "Viana do Castelo": [
        "Arcos de Valdevez", "Caminha", "Paredes de Coura", "Ponte da Barca", "Ponte de Lima", "Valença",
        "Viana do Castelo", "Vila Nova de Cerveira",
      ],
      "Vila Real": [
        "Mesão Frio", "Mondim de Basto", "Peso da Régua", "Ribeira de Pena", "Santa Marta de Penaguião",
        "Vila Pouca de Aguiar", "Vila Real",
      ],
      Aveiro: [
        "Arouca", "Aveiro", "Castelo de Paiva", "Estarreja", "Murtosa", "Oliveira de Azeméis", "Ovar",
        "São João da Madeira", "Vale de Cambra",
      ],
    },
  } as Record<"zona_1" | "zona_2", Record<string, string[]>>,

  /** Passo A: orçamento mínimo (sem IVA) por tipologia e estrutura. */
  minimoTipologia: {
    aco_leve: { T1: 75000, T2: 108000, T3: 139000, "T4+": 162000 },
    madeira: { T1: 62000, T2: 84000, T3: 107000, "T4+": 125000 },
  } as Record<Estrutura, Record<Tipologia, number>>,
  /** Sem tipologia o orçamento falha sempre. */
  minimoSemResposta: 999999,

  /** Passo B: intervalos do passo 6 e o valor usado na comparação (limite inferior). */
  intervalos: {
    aco_leve: [
      { id: "0_75000", label: "Menos de 75.000 €", limiteInferior: 0 },
      { id: "75000_108000", label: "75.000 a 108.000 €", limiteInferior: 75000 },
      { id: "108000_139000", label: "108.000 a 139.000 €", limiteInferior: 108000 },
      { id: "139000_162000", label: "139.000 a 162.000 €", limiteInferior: 139000 },
      { id: "162000_220000", label: "162.000 a 220.000 €", limiteInferior: 162000 },
      { id: "220000_mais", label: "Mais de 220.000 €", limiteInferior: 220000 },
    ],
    madeira: [
      { id: "0_62000", label: "Menos de 62.000 €", limiteInferior: 0 },
      { id: "62000_84000", label: "62.000 a 84.000 €", limiteInferior: 62000 },
      { id: "84000_107000", label: "84.000 a 107.000 €", limiteInferior: 84000 },
      { id: "107000_125000", label: "107.000 a 125.000 €", limiteInferior: 107000 },
      { id: "125000_180000", label: "125.000 a 180.000 €", limiteInferior: 125000 },
      { id: "180000_mais", label: "Mais de 180.000 €", limiteInferior: 180000 },
    ],
  } as Record<Estrutura, IntervaloOrcamento[]>,

  estruturas: [
    { id: "aco_leve", label: "Aço leve (LSF)" },
    { id: "madeira", label: "Madeira" },
  ] as { id: Estrutura; label: string }[],

  tipologias: [
    { id: "T1", label: "T1" },
    { id: "T2", label: "T2" },
    { id: "T3", label: "T3" },
    { id: "T4+", label: "T4 ou superior" },
  ] as { id: Tipologia; label: string }[],

  viabilidades: [
    { id: "sim", label: "Sim" },
    { id: "nao", label: "Não" },
    { id: "nao_sei", label: "Não sei" },
  ] as { id: Viabilidade; label: string }[],

  textos: {
    tituloGeral: "Vamos Falar!",
    tituloBlog: "Interessado? Fale connosco!",
    concelho: "Onde vai construir?",
    concelhoPlaceholder: "Escreva o concelho (ex.: Maia)",
    concelhoSemResultados: "Não encontrámos esse concelho na lista.",
    concelhoOutroQual: "Qual é o concelho? (opcional)",
    zona2Madeira: "Nesta zona só construímos em madeira. Tem interesse em madeira?",
    estrutura: "Que tipo de estrutura pretende?",
    terreno: "Tem terreno?",
    viabilidade: "Tem viabilidade confirmada?",
    tipologia: "Que tipologia pretende?",
    orcamento: "Que orçamento tem previsto? (sem IVA)",
    contactos: "Deixe os seus contactos para darmos seguimento ao seu pedido.",
    nome: "Nome",
    telefone: "Telefone",
    email: "Email",
    emailInvalido: "Indique um email válido.",
    telefoneInvalido: "Indique um telefone válido.",
    rgpdAntes: "Li e aceito a ",
    rgpdLink: "Política de Privacidade",
    rgpdDepois: " e autorizo o contacto da Evaplace sobre este pedido.",
    anterior: "Anterior",
    seguinte: "Seguinte",
    enviar: "Enviar",
    aEnviar: "A enviar...",
    erroEnvio: "Não foi possível enviar o pedido. Verifique a ligação e tente novamente.",
    enviado: "Pedido recebido. A Evaplace vai entrar em contacto consigo.",
  },
};

/** Minúsculas e sem acentos, para pesquisar "povoa" e encontrar "Póvoa de Varzim". */
export function normalizar(texto: string): string {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

export type ConcelhoInfo = { nome: string; distrito: string; zona: "zona_1" | "zona_2" };

/** Os 58 concelhos, por ordem alfabética. */
export const CONCELHOS: ConcelhoInfo[] = (["zona_1", "zona_2"] as const)
  .flatMap((zona) =>
    Object.entries(LEAD_CONFIG.concelhos[zona]).flatMap(([distrito, nomes]) =>
      nomes.map((nome) => ({ nome, distrito, zona }))
    )
  )
  .sort((a, b) => a.nome.localeCompare(b.nome, "pt"));

/** Zona do concelho escolhido; "Outro concelho" ou desconhecido = fora. */
export function zonaDoConcelho(concelho: string): Zona {
  const n = normalizar(concelho);
  return CONCELHOS.find((c) => normalizar(c.nome) === n)?.zona ?? "fora";
}

/** Concelhos cujo nome contém o texto; o que começa pelo texto vem primeiro. */
export function pesquisarConcelhos(texto: string): ConcelhoInfo[] {
  const q = normalizar(texto);
  if (!q) return CONCELHOS;
  const hits = CONCELHOS.filter((c) => normalizar(c.nome).includes(q));
  const comeca = hits.filter((c) => normalizar(c.nome).startsWith(q));
  return [...comeca, ...hits.filter((c) => !comeca.includes(c))];
}

export type Respostas = {
  concelho: string; // nome do concelho ou OUTRO_CONCELHO
  interesseMadeira: SimNao | ""; // só na Zona 2
  estrutura: Estrutura | "";
  terreno: SimNao | "";
  viabilidade: Viabilidade | ""; // só com terreno
  tipologia: Tipologia | "";
  orcamento: string; // id do intervalo
};

export const RESPOSTAS_VAZIAS: Respostas = {
  concelho: "",
  interesseMadeira: "",
  estrutura: "",
  terreno: "",
  viabilidade: "",
  tipologia: "",
  orcamento: "",
};

/** Zona 2 com interesse em madeira: a estrutura fica fixada e o passo 2 não aparece. */
export function estruturaFixada(r: Respostas): boolean {
  return zonaDoConcelho(r.concelho) === "zona_2" && r.interesseMadeira === "sim";
}

export function intervalosPara(estrutura: Estrutura | ""): IntervaloOrcamento[] {
  return estrutura ? LEAD_CONFIG.intervalos[estrutura] : [];
}

export function intervaloEscolhido(r: Respostas): IntervaloOrcamento | undefined {
  return intervalosPara(r.estrutura).find((i) => i.id === r.orcamento);
}

/** Passo C: limite_inferior >= minimo_tipologia. */
export function orcamentoValido(r: Respostas): boolean {
  if (!r.estrutura) return false;
  const minimo = r.tipologia ? LEAD_CONFIG.minimoTipologia[r.estrutura][r.tipologia] : LEAD_CONFIG.minimoSemResposta;
  const intervalo = intervaloEscolhido(r);
  if (!intervalo) return false;
  return intervalo.limiteInferior >= minimo;
}

/** Zona válida para a estrutura escolhida. */
export function zonaValida(r: Respostas): boolean {
  const zona = zonaDoConcelho(r.concelho);
  if (zona === "zona_1") return true;
  if (zona === "zona_2") return r.interesseMadeira === "sim" && r.estrutura === "madeira";
  return false;
}

/** Primeiro critério que falha, por esta ordem: zona, terreno, orçamento. */
export function calcularLeadStatus(r: Respostas): LeadStatus {
  if (!zonaValida(r)) return "fora_zona";
  if (r.terreno !== "sim") return "nao_qualificada_terreno";
  if (!orcamentoValido(r)) return "nao_qualificada_orcamento";
  return "qualificada";
}

export type PassoId =
  | "concelho"
  | "estrutura"
  | "terreno"
  | "viabilidade"
  | "tipologia"
  | "orcamento"
  | "contactos";

/** Passos que esta pessoa vê, conforme as respostas até agora. */
export function sequenciaDePassos(r: Respostas): PassoId[] {
  const passos: PassoId[] = ["concelho"];
  if (!estruturaFixada(r)) passos.push("estrutura");
  passos.push("terreno");
  if (r.terreno !== "nao") passos.push("viabilidade");
  passos.push("tipologia", "orcamento", "contactos");
  return passos;
}

/** O passo já tem a resposta obrigatória? */
export function passoRespondido(passo: PassoId, r: Respostas): boolean {
  switch (passo) {
    case "concelho":
      if (!r.concelho) return false;
      return zonaDoConcelho(r.concelho) !== "zona_2" || r.interesseMadeira !== "";
    case "estrutura":
      return r.estrutura !== "";
    case "terreno":
      return r.terreno !== "";
    case "viabilidade":
      return r.viabilidade !== "";
    case "tipologia":
      return r.tipologia !== "";
    case "orcamento":
      return !!intervaloEscolhido(r);
    case "contactos":
      return true;
  }
}

/**
 * Aplica uma resposta e limpa o que deixou de fazer sentido
 * (ex.: mudar de estrutura apaga o orçamento, porque os intervalos são outros).
 */
export function responder<K extends keyof Respostas>(r: Respostas, campo: K, valor: Respostas[K]): Respostas {
  const novo: Respostas = { ...r, [campo]: valor };
  if (campo === "concelho") {
    const zonaAntes = zonaDoConcelho(r.concelho);
    const zonaDepois = zonaDoConcelho(novo.concelho);
    if (zonaDepois !== "zona_2") novo.interesseMadeira = "";
    if (zonaAntes !== zonaDepois && estruturaFixada(r)) novo.estrutura = "";
  }
  if (campo === "interesseMadeira") {
    if (valor === "sim") novo.estrutura = "madeira";
    else if (estruturaFixada(r)) novo.estrutura = "";
  }
  if (novo.estrutura !== r.estrutura) novo.orcamento = "";
  if (campo === "terreno" && valor === "nao") novo.viabilidade = "";
  return novo;
}

export type Contactos = { nome: string; telefone: string; email: string; rgpd: boolean };

export function emailValido(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

/** 9 a 15 dígitos, aceitando +, espaços, pontos, hífenes e parênteses. */
export function telefoneValido(telefone: string): boolean {
  const t = telefone.trim();
  if (!/^\+?[\d\s().-]+$/.test(t)) return false;
  const digitos = t.replace(/\D/g, "").length;
  return digitos >= 9 && digitos <= 15;
}

export function contactosValidos(c: Contactos): boolean {
  return c.nome.trim().length >= 2 && telefoneValido(c.telefone) && emailValido(c.email) && c.rgpd;
}

const LABEL_SIM_NAO: Record<string, string> = { sim: "Sim", nao: "Não", nao_sei: "Não sei" };

/** Evento do dataLayer: sem dados pessoais. */
export function eventoDataLayer(r: Respostas, formId: string, leadId: string) {
  const zona = zonaDoConcelho(r.concelho);
  return {
    event: "evaplace_lead",
    lead_status: calcularLeadStatus(r),
    zona,
    estrutura: r.estrutura,
    tipologia: r.tipologia,
    orcamento_intervalo: r.orcamento,
    terreno: r.terreno,
    viabilidade: r.viabilidade,
    form_id: formId,
    lead_id: leadId,
  };
}

/**
 * Corpo enviado ao Make. Mantém as chaves antigas (o cenário atual lê-as) e acrescenta as novas.
 * Os campos de origem (UTMs/gclid/…) são juntados depois por appendAttribution.
 */
export function payloadDaLead(args: {
  respostas: Respostas;
  concelhoOutro: string;
  contactos: Contactos;
  formId: string;
  leadId: string;
  pageUrl: string;
  agora: Date;
  /** Identificador da campanha (só nas landing pages de campanha); vazio no resto do site. */
  campanha?: string;
}): URLSearchParams {
  const { respostas: r, concelhoOutro, contactos: c, formId, leadId, pageUrl, agora, campanha = "" } = args;
  const pad2 = (n: number) => String(n).padStart(2, "0");
  const datePT = `${pad2(agora.getDate())}/${pad2(agora.getMonth() + 1)}/${agora.getFullYear()}`;
  const outro = r.concelho === OUTRO_CONCELHO ? concelhoOutro.trim() : "";
  const concelhoTexto = outro ? `${OUTRO_CONCELHO}: ${outro}` : r.concelho;
  const estruturaLabel = LEAD_CONFIG.estruturas.find((e) => e.id === r.estrutura)?.label ?? "";

  const p = new URLSearchParams();
  // Chaves antigas (mesmos nomes de sempre)
  p.append("Possuí Terreno?", LABEL_SIM_NAO[r.terreno] ?? "");
  p.append("Concelho do terreno", concelhoTexto);
  p.append("Área de construção", "");
  p.append("Tipologia", r.tipologia);
  p.append("Tipo de projeto", "");
  p.append("Nome", c.nome.trim());
  p.append("Email", c.email.trim());
  p.append("Contacto", c.telefone.trim());
  p.append("Privacidade", c.rgpd ? "on" : "");
  p.append("Date", datePT);
  // Qualificação
  const ev = eventoDataLayer(r, formId, leadId);
  p.append("lead_status", ev.lead_status);
  p.append("lead_id", leadId);
  p.append("form_id", formId);
  p.append("concelho", r.concelho);
  p.append("concelho_outro", outro);
  p.append("zona", ev.zona);
  p.append("interesse_madeira", r.interesseMadeira);
  p.append("estrutura", r.estrutura);
  p.append("estrutura_label", estruturaLabel);
  p.append("terreno", r.terreno);
  p.append("viabilidade", r.viabilidade);
  p.append("tipologia", r.tipologia);
  p.append("orcamento_intervalo", r.orcamento);
  p.append("orcamento_label", intervaloEscolhido(r)?.label ?? "");
  p.append("page_url", pageUrl);
  p.append("campanha", campanha);
  return p;
}
