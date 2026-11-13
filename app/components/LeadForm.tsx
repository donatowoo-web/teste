"use client";

// Formulário geral de leads (popup "Desenvolver Projeto", páginas e blog).
// Qualifica a lead com a mesma lógica do formulário do Meta (app/lib/leadQualificacao.ts),
// envia tudo para o webhook do Make e, só depois do envio bem-sucedido, faz um push
// "evaplace_lead" no dataLayer. A classificação nunca é mostrada à pessoa.

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { appendAttribution } from "../lib/attribution";
import {
  LEAD_CONFIG,
  OUTRO_CONCELHO,
  RESPOSTAS_VAZIAS,
  contactosValidos,
  emailValido,
  eventoDataLayer,
  intervalosPara,
  normalizar,
  passoRespondido,
  payloadDaLead,
  pesquisarConcelhos,
  responder,
  sequenciaDePassos,
  telefoneValido,
  zonaDoConcelho,
  type Contactos,
  type PassoId,
  type Respostas,
} from "../lib/leadQualificacao";

const WEBHOOK = "https://hook.eu1.make.com/9rebqkacjw8djh3zsah7gft9etsu7kbk";
const T = LEAD_CONFIG.textos;

type Styles = Record<string, string>;

type Opcao = { id: string; label: string };

function novoLeadId(): string {
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  } catch {
    // sem crypto.randomUUID (browser antigo / http)
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Push no dataLayer e espera que o GTM o processe (máx. 2 s) antes de seguir. */
function pushEsperar(evento: Record<string, unknown>): Promise<void> {
  return new Promise((resolve) => {
    let feito = false;
    const seguir = () => {
      if (feito) return;
      feito = true;
      resolve();
    };
    try {
      const w = window as unknown as { dataLayer?: unknown[] };
      w.dataLayer = w.dataLayer || [];
      w.dataLayer.push({ ...evento, eventCallback: seguir, eventTimeout: 2000 });
    } catch {
      // sem dataLayer: segue na mesma
    }
    // Rede de segurança: se o GTM estiver bloqueado (adblocker), o eventTimeout nunca corre.
    setTimeout(seguir, 2300);
  });
}

function Opcoes({
  s,
  nome,
  opcoes,
  valor,
  onEscolher,
  colunas,
}: {
  s: Styles;
  nome: string;
  opcoes: Opcao[];
  valor: string;
  onEscolher: (id: string) => void;
  colunas?: number;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={nome}
      className={s.options}
      style={colunas ? { gridTemplateColumns: `repeat(${colunas}, minmax(0, 1fr))` } : undefined}
    >
      {opcoes.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={valor === o.id}
          className={`${s.option} ${valor === o.id ? s.optionActive : ""}`}
          onClick={() => onEscolher(o.id)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function ConcelhoPicker({
  s,
  inputId,
  valor,
  outro,
  onEscolher,
  onOutro,
}: {
  s: Styles;
  inputId: string;
  valor: string;
  outro: string;
  onEscolher: (concelho: string, textoOutro: string) => void;
  onOutro: (texto: string) => void;
}) {
  const id = useId();
  const [texto, setTexto] = useState(valor === OUTRO_CONCELHO ? OUTRO_CONCELHO : valor);
  const [aberto, setAberto] = useState(false);
  const [ativo, setAtivo] = useState(0);
  const listaRef = useRef<HTMLUListElement>(null);

  const resultados = useMemo(() => pesquisarConcelhos(texto === OUTRO_CONCELHO ? "" : texto), [texto]);
  const itens: { nome: string; detalhe: string }[] = [
    ...resultados.map((c) => ({ nome: c.nome, detalhe: c.distrito })),
    { nome: OUTRO_CONCELHO, detalhe: "" },
  ];

  useEffect(() => {
    const el = listaRef.current?.children[ativo] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [ativo]);

  function escolher(nome: string) {
    const semMatch = resultados.length === 0 ? texto.trim() : "";
    setTexto(nome);
    setAberto(false);
    onEscolher(nome, nome === OUTRO_CONCELHO ? semMatch || outro : "");
  }

  return (
    <div className={s.combo}>
      <input
        id={inputId}
        className={s.input}
        role="combobox"
        aria-expanded={aberto}
        aria-controls={`${id}-lista`}
        aria-autocomplete="list"
        autoComplete="off"
        placeholder={T.concelhoPlaceholder}
        value={texto}
        onFocus={(e) => {
          setAberto(true);
          if (texto === valor) e.currentTarget.select();
        }}
        onBlur={() => {
          setTimeout(() => setAberto(false), 150);
          // Escreveu o nome exato e saiu sem clicar na lista: conta como escolhido
          if (!valor) {
            const exato = resultados.find((c) => normalizar(c.nome) === normalizar(texto));
            if (exato) escolher(exato.nome);
          }
        }}
        onChange={(e) => {
          setTexto(e.target.value);
          setAtivo(0);
          setAberto(true);
          if (valor) onEscolher("", "");
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setAberto(true);
            setAtivo((a) => Math.min(a + 1, itens.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setAtivo((a) => Math.max(a - 1, 0));
          } else if (e.key === "Enter" && aberto) {
            e.preventDefault();
            escolher(itens[ativo]?.nome ?? OUTRO_CONCELHO);
          } else if (e.key === "Escape") {
            setAberto(false);
          }
        }}
      />
      {aberto && (
        <ul id={`${id}-lista`} role="listbox" ref={listaRef} className={s.comboList}>
          {resultados.length === 0 && texto.trim() && (
            <li className={s.comboEmpty} role="presentation">
              {T.concelhoSemResultados}
            </li>
          )}
          {itens.map((it, i) => (
            <li
              key={it.nome}
              role="option"
              aria-selected={i === ativo}
              className={`${s.comboItem} ${i === ativo ? s.comboItemActive : ""}`}
              onMouseDown={(e) => {
                e.preventDefault();
                escolher(it.nome);
              }}
              onMouseEnter={() => setAtivo(i)}
            >
              <span>{it.nome}</span>
              {it.detalhe && <small className={s.comboHint}>{it.detalhe}</small>}
            </li>
          ))}
        </ul>
      )}
      {valor === OUTRO_CONCELHO && (
        <>
          <label className={s.labelSmall} htmlFor={`${id}-outro`}>
            {T.concelhoOutroQual}
          </label>
          <input
            id={`${id}-outro`}
            className={s.input}
            value={outro}
            onChange={(e) => onOutro(e.target.value)}
            placeholder="Ex.: Lisboa"
          />
        </>
      )}
    </div>
  );
}

export default function LeadForm({
  styles: s,
  formId,
  titulo,
  progresso = true,
  subtitulo,
  campanha = "",
  textoEnviar = T.enviar,
  notaEnvio,
}: {
  styles: Styles;
  formId: string;
  titulo: string;
  progresso?: boolean;
  /** Texto por baixo do título (landing pages de campanha). */
  subtitulo?: string;
  /** Vai no campo "campanha" do envio; vazio no resto do site. */
  campanha?: string;
  /** Texto do botão do último passo. */
  textoEnviar?: string;
  /** Linha por baixo do botão do último passo. */
  notaEnvio?: string;
}) {
  const uid = useId();
  const [r, setR] = useState<Respostas>(RESPOSTAS_VAZIAS);
  const [concelhoOutro, setConcelhoOutro] = useState("");
  const [c, setC] = useState<Contactos>({ nome: "", telefone: "", email: "", rgpd: false });
  const [tocados, setTocados] = useState<Record<string, boolean>>({});
  const [passo, setPasso] = useState<PassoId>("concelho");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [enviado, setEnviado] = useState(false);
  const enviadoRef = useRef(false);
  const avancoRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const passos = sequenciaDePassos(r);
  const indice = Math.max(0, passos.indexOf(passo));
  const podeSeguir = passoRespondido(passo, r);

  useEffect(() => () => {
    if (avancoRef.current) clearTimeout(avancoRef.current);
  }, []);

  function irPara(p: PassoId | undefined) {
    if (!p) return;
    if (avancoRef.current) clearTimeout(avancoRef.current);
    setErro(null);
    setPasso(p);
    // No telemóvel o topo da caixa pode ficar fora do ecrã ao mudar de passo
    const box = boxRef.current;
    if (box && box.getBoundingClientRect().top < 0) box.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function seguinte(respostas = r) {
    const seq = sequenciaDePassos(respostas);
    irPara(seq[seq.indexOf(passo) + 1]);
  }

  function anterior() {
    irPara(passos[indice - 1]);
  }

  /** Responde e, nas perguntas de escolha única, avança sozinho. */
  function escolher<K extends keyof Respostas>(campo: K, valor: Respostas[K], avancar = true) {
    const novo = responder(r, campo, valor);
    setR(novo);
    if (avancar && passoRespondido(passo, novo)) {
      if (avancoRef.current) clearTimeout(avancoRef.current);
      avancoRef.current = setTimeout(() => seguinte(novo), 220);
    }
  }

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setTocados({ nome: true, telefone: true, email: true, rgpd: true });
    if (!contactosValidos(c) || loading || enviadoRef.current) return;
    setLoading(true);
    setErro(null);
    const leadId = novoLeadId();
    try {
      const body = payloadDaLead({
        respostas: r,
        concelhoOutro,
        contactos: c,
        formId,
        leadId,
        pageUrl: window.location.href,
        agora: new Date(),
        campanha,
      });
      appendAttribution(body);
      const res = await fetch(WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      // Um push por lead, só depois do envio bem-sucedido.
      enviadoRef.current = true;
      setEnviado(true);
      await pushEsperar(eventoDataLayer(r, formId, leadId));
      window.location.href = "/obrigado/";
    } catch {
      setErro(T.erroEnvio);
      setLoading(false);
    }
  }

  const zona = zonaDoConcelho(r.concelho);
  const erroCampo = (k: keyof Contactos, invalido: boolean) => tocados[k] && invalido;

  return (
    <section className={s.wrapper}>
      <div className={s.box} ref={boxRef}>
        <h2 className={s.title}>{titulo}</h2>
        {subtitulo && <p className={s.subtitle}>{subtitulo}</p>}

        {progresso && !enviado && (
          <div
            className={s.progress}
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={passos.length}
            aria-valuenow={indice + 1}
            aria-label={`Passo ${indice + 1} de ${passos.length}`}
          >
            {passos.map((p, i) => (
              <div key={p} className={`${s.dot} ${i <= indice ? s.dotActive : ""}`} />
            ))}
          </div>
        )}

        {enviado ? (
          <p className={s.success} role="status">
            {T.enviado}
          </p>
        ) : (
          <>
            {passo === "concelho" && (
              <>
                <label className={s.label} htmlFor={`${uid}-concelho`}>
                  {T.concelho} <span className={s.req}>*</span>
                </label>
                <ConcelhoPicker
                  s={s}
                  inputId={`${uid}-concelho`}
                  valor={r.concelho}
                  outro={concelhoOutro}
                  onEscolher={(nome, textoOutro) => {
                    setR(responder(r, "concelho", nome));
                    setConcelhoOutro(textoOutro);
                  }}
                  onOutro={setConcelhoOutro}
                />
                {zona === "zona_2" && (
                  <>
                    <p className={s.label}>
                      {T.zona2Madeira} <span className={s.req}>*</span>
                    </p>
                    <Opcoes
                      s={s}
                      nome={T.zona2Madeira}
                      colunas={2}
                      opcoes={[
                        { id: "sim", label: "Sim" },
                        { id: "nao", label: "Não" },
                      ]}
                      valor={r.interesseMadeira}
                      onEscolher={(v) => escolher("interesseMadeira", v as "sim" | "nao")}
                    />
                  </>
                )}
              </>
            )}

            {passo === "estrutura" && (
              <>
                <p className={s.label}>
                  {T.estrutura} <span className={s.req}>*</span>
                </p>
                <Opcoes
                  s={s}
                  nome={T.estrutura}
                  colunas={2}
                  opcoes={LEAD_CONFIG.estruturas}
                  valor={r.estrutura}
                  onEscolher={(v) => escolher("estrutura", v as Respostas["estrutura"])}
                />
              </>
            )}

            {passo === "terreno" && (
              <>
                <p className={s.label}>
                  {T.terreno} <span className={s.req}>*</span>
                </p>
                <Opcoes
                  s={s}
                  nome={T.terreno}
                  colunas={2}
                  opcoes={[
                    { id: "sim", label: "Sim" },
                    { id: "nao", label: "Não" },
                  ]}
                  valor={r.terreno}
                  onEscolher={(v) => escolher("terreno", v as "sim" | "nao")}
                />
              </>
            )}

            {passo === "viabilidade" && (
              <>
                <p className={s.label}>
                  {T.viabilidade} <span className={s.req}>*</span>
                </p>
                <Opcoes
                  s={s}
                  nome={T.viabilidade}
                  colunas={3}
                  opcoes={LEAD_CONFIG.viabilidades}
                  valor={r.viabilidade}
                  onEscolher={(v) => escolher("viabilidade", v as Respostas["viabilidade"])}
                />
              </>
            )}

            {passo === "tipologia" && (
              <>
                <p className={s.label}>
                  {T.tipologia} <span className={s.req}>*</span>
                </p>
                <Opcoes
                  s={s}
                  nome={T.tipologia}
                  colunas={2}
                  opcoes={LEAD_CONFIG.tipologias}
                  valor={r.tipologia}
                  onEscolher={(v) => escolher("tipologia", v as Respostas["tipologia"])}
                />
              </>
            )}

            {passo === "orcamento" && (
              <>
                <p className={s.label}>
                  {T.orcamento} <span className={s.req}>*</span>
                </p>
                <Opcoes
                  s={s}
                  nome={T.orcamento}
                  opcoes={intervalosPara(r.estrutura)}
                  valor={r.orcamento}
                  onEscolher={(v) => escolher("orcamento", v)}
                />
              </>
            )}

            {passo === "contactos" && (
              <form onSubmit={enviar} noValidate>
                <p className={s.intro}>{T.contactos}</p>

                <label className={s.label} htmlFor={`${uid}-nome`}>
                  {T.nome} <span className={s.req}>*</span>
                </label>
                <input
                  id={`${uid}-nome`}
                  className={s.input}
                  autoComplete="name"
                  value={c.nome}
                  onChange={(e) => setC({ ...c, nome: e.target.value })}
                  onBlur={() => setTocados((t) => ({ ...t, nome: true }))}
                  aria-invalid={erroCampo("nome", c.nome.trim().length < 2) || undefined}
                />

                <label className={s.label} htmlFor={`${uid}-tel`}>
                  {T.telefone} <span className={s.req}>*</span>
                </label>
                <input
                  id={`${uid}-tel`}
                  className={s.input}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="912 345 678"
                  value={c.telefone}
                  onChange={(e) => setC({ ...c, telefone: e.target.value })}
                  onBlur={() => setTocados((t) => ({ ...t, telefone: true }))}
                  aria-invalid={erroCampo("telefone", !telefoneValido(c.telefone)) || undefined}
                />
                {erroCampo("telefone", !telefoneValido(c.telefone)) && <p className={s.error}>{T.telefoneInvalido}</p>}

                <label className={s.label} htmlFor={`${uid}-email`}>
                  {T.email} <span className={s.req}>*</span>
                </label>
                <input
                  id={`${uid}-email`}
                  className={s.input}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="exemplo@email.com"
                  value={c.email}
                  onChange={(e) => setC({ ...c, email: e.target.value })}
                  onBlur={() => setTocados((t) => ({ ...t, email: true }))}
                  aria-invalid={erroCampo("email", !emailValido(c.email)) || undefined}
                />
                {erroCampo("email", !emailValido(c.email)) && <p className={s.error}>{T.emailInvalido}</p>}

                <label className={s.check}>
                  <input
                    type="checkbox"
                    checked={c.rgpd}
                    onChange={(e) => setC({ ...c, rgpd: e.target.checked })}
                  />
                  <span>
                    {T.rgpdAntes}
                    <a href="/politica-de-privacidade/" target="_blank" rel="noopener">
                      {T.rgpdLink}
                    </a>
                    {T.rgpdDepois} <span className={s.req}>*</span>
                  </span>
                </label>

                {erro && (
                  <p className={s.error} role="alert">
                    {erro}
                  </p>
                )}

                <div className={s.actions}>
                  <button type="button" className={s.btnGhost} onClick={anterior} disabled={loading}>
                    {T.anterior}
                  </button>
                  <button type="submit" className={s.btnNext} disabled={!contactosValidos(c) || loading}>
                    {loading ? T.aEnviar : textoEnviar}
                  </button>
                </div>
                {notaEnvio && <p className={s.note}>{notaEnvio}</p>}
              </form>
            )}

            {passo !== "contactos" && (
              <div className={s.actions} style={indice === 0 ? { gridTemplateColumns: "1fr" } : undefined}>
                {indice > 0 && (
                  <button type="button" className={s.btnGhost} onClick={anterior}>
                    {T.anterior}
                  </button>
                )}
                <button type="button" className={s.btnNext} onClick={() => seguinte()} disabled={!podeSeguir}>
                  {T.seguinte}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
