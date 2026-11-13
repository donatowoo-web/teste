import type { Metadata } from "next";
import { LEAD_CONFIG } from "../lib/leadQualificacao";
import CampanhaForm from "./CampanhaForm";
import CampanhaGate from "./CampanhaGate";
import ProvaGaleria, { type FotoProva } from "./ProvaGaleria";
import { CASAS_PROVA, FECHO_TEXTO, FECHO_TITULO, FECHO_UTC_MS, IMAGEM_TOPO, LOGOS, imagem } from "./config";
import styles from "./campanha.module.css";

// Landing page da campanha «Evaplace × Esquadro». Sem pontos de fuga: o menu, o rodapé do
// site e os botões flutuantes são escondidos nesta rota (ver "LP DE CAMPANHA" em globals.css).
// Fora do menu e do sitemap; noindex porque tem prazo.

export const metadata: Metadata = {
  title: "Evaplace × Esquadro | Projeto descontado na obra",
  description:
    "Até 16 de dezembro, quem fizer o projeto com a Esquadro e construir com a Evaplace tem até 100% do valor do projeto descontado na obra.",
  robots: { index: false, follow: false },
  // O rodapé tem os telefones em texto, sem link: impede o iOS de os transformar em links.
  formatDetection: { telephone: false, address: false, email: false },
};

type Grupo = { distrito: string; concelhos: string[] };

const ordenar = (nomes: string[]) => [...nomes].sort((a, b) => a.localeCompare(b, "pt"));

/** Aço leve = zona 1. Madeira = zona 1 + zona 2 (igual a /zonas-de-atuacao/). */
function gruposDeConcelhos(): { acoLeve: Grupo[]; madeira: Grupo[] } {
  const { zona_1, zona_2 } = LEAD_CONFIG.concelhos;
  const acoLeve = Object.entries(zona_1).map(([distrito, c]) => ({ distrito, concelhos: ordenar(c) }));
  const distritos = [...new Set([...Object.keys(zona_1), ...Object.keys(zona_2)])];
  const madeira = distritos.map((distrito) => ({
    distrito,
    concelhos: ordenar([...(zona_1[distrito] ?? []), ...(zona_2[distrito] ?? [])]),
  }));
  return { acoLeve, madeira };
}

function ListaConcelhos({ titulo, grupos }: { titulo: string; grupos: Grupo[] }) {
  return (
    <div className={styles.sistema}>
      <h3 className={styles.sistemaTitulo}>{titulo}</h3>
      {grupos.map((g) => (
        <p key={g.distrito} className={styles.distrito}>
          <span className={styles.distritoNome}>{g.distrito}</span>
          {g.concelhos.join(", ")}
        </p>
      ))}
    </div>
  );
}

function Logos() {
  return (
    <img
      src={LOGOS}
      alt="Evaplace Casas × Esquadro Arquitetura & Engenharia"
      width={829}
      height={141}
      className={styles.logos}
    />
  );
}

export default function CampanhaProjetoPage() {
  const fotos: FotoProva[] = CASAS_PROVA.map(({ nome, foto }) => ({
    nome,
    pequena: imagem(foto, 900),
    grande: imagem(foto, 2000),
  }));
  const { acoLeve, madeira } = gruposDeConcelhos();

  const fechada = (
    <section className={styles.fecho}>
      <h1 className={styles.h1}>{FECHO_TITULO}</h1>
      <div className={styles.linha} />
      <p className={styles.texto}>{FECHO_TEXTO}</p>
    </section>
  );

  return (
    <div className={styles.page} data-lp-campanha>
      {/* Depois do fecho, esconde o conteúdo da campanha antes de o React arrancar (sem piscar). */}
      <script
        dangerouslySetInnerHTML={{
          __html: `if(Date.now()>${FECHO_UTC_MS})document.documentElement.setAttribute("data-campanha-fechada","")`,
        }}
      />

      <div className={styles.topo}>
        <Logos />
      </div>

      <CampanhaGate fechada={fechada}>
        <div className={styles.heroImagem}>
          <img src={IMAGEM_TOPO} alt="Estrutura em aço leve" width={1024} height={576} fetchPriority="high" />
        </div>

        <section className={`${styles.seccao} ${styles.abertura}`}>
          <h1 className={styles.h1}>Quem desenha a sua casa sabe como ela vai ser construída.</h1>
          <div className={styles.linha} />
          <p className={styles.texto}>
            A Esquadro, empresa de arquitetura da Evaplace, faz o projeto de arquitetura e especialidades da sua casa.
            A Evaplace constrói em aço leve e em madeira.
          </p>
          <p className={styles.texto}>
            Até 16 de dezembro, quem fizer o projeto com a Esquadro e construir com a Evaplace tem até 100% do valor
            do projeto descontado na obra. Se construir com outra empresa, fica com o projeto.
          </p>
          <a href="#candidatura" className={styles.botao}>
            QUERO SABER MAIS
          </a>
        </section>

        <section className={styles.seccao}>
          <h2 className={styles.h2}>Como funciona o desconto</h2>
          <div className={styles.linha} />
          <ol className={styles.passos}>
            <li>
              <span className={styles.passoNumero}>01</span>
              <span>Paga o projeto à Esquadro.</span>
            </li>
            <li>
              <span className={styles.passoNumero}>02</span>
              <span>Adjudica a construção à Evaplace.</span>
            </li>
            <li>
              <span className={styles.passoNumero}>03</span>
              <span>O valor do projeto é descontado na construção. A condição fica no contrato.</span>
            </li>
          </ol>
          <div className={styles.blocos}>
            <div className={styles.bloco}>
              <p className={styles.blocoValor}>50%</p>
              <p className={styles.blocoTexto}>do valor do projeto em casas até 100 m²</p>
            </div>
            <div className={`${styles.bloco} ${styles.blocoVerde}`}>
              <p className={styles.blocoValor}>100%</p>
              <p className={styles.blocoTexto}>do valor do projeto em casas com mais de 100 m²</p>
            </div>
          </div>
        </section>

        <section className={styles.seccao}>
          <h2 className={styles.h2}>Condições para usufruir da campanha</h2>
          <div className={styles.linha} />
          <p className={styles.condicao}>Possuir terreno na zona onde construímos</p>
          <p className={styles.condicao}>Adjudicar a empreitada à Evaplace</p>
          <details className={styles.concelhos}>
            <summary className={styles.concelhosBtn}>Ver concelhos</summary>
            <div className={styles.concelhosLista}>
              <ListaConcelhos titulo="Aço leve" grupos={acoLeve} />
              <ListaConcelhos titulo="Madeira" grupos={madeira} />
            </div>
          </details>
        </section>

        <section className={styles.seccao}>
          <p className={styles.provaNumero}>+10</p>
          <p className={styles.etiqueta}>CASAS ENTREGUES PELA EVAPLACE</p>
          <ProvaGaleria fotos={fotos} />
          <p className={styles.textoSuave}>Antes de decidir, pode visitar uma casa Evaplace em fim de obra.</p>
        </section>

        <div id="candidatura" className={styles.candidatura}>
          <CampanhaForm />
        </div>
      </CampanhaGate>

      <footer className={styles.rodape}>
        <p>Evaplace Casas · Rua Rio 15, 4475-493 Nogueira, Maia · 229 610 296 · 963 770 939</p>
        <p className={styles.rodapeLinks}>
          <a href="/politica-de-privacidade/" target="_blank" rel="noopener noreferrer">
            Política de Privacidade
          </a>
          <span aria-hidden="true">·</span>
          <a href="https://www.livroreclamacoes.pt/inicio/" target="_blank" rel="noopener noreferrer">
            Livro de Reclamações
          </a>
        </p>
      </footer>
    </div>
  );
}
