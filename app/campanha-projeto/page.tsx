import type { Metadata } from "next";
import CampanhaForm from "./CampanhaForm";
import CampanhaGate from "./CampanhaGate";
import { BarraFixa, BotaoFormulario } from "./IrParaFormulario";
import ProvaGaleria, { type FotoProva } from "./ProvaGaleria";
import { CASAS_PROVA, FECHO_TEXTO, FECHO_TITULO, FECHO_UTC_MS, IMAGEM_TOPO, LOGOS, imagem } from "./config";
import styles from "./campanha.module.css";

// Landing page da campanha «Evaplace × Esquadro». Sem pontos de fuga nem links: o menu, o rodapé do
// site e os botões flutuantes são escondidos nesta rota (ver "LP DE CAMPANHA" em globals.css).
// Fora do menu e do sitemap; noindex porque tem prazo.

export const metadata: Metadata = {
  title: "Evaplace × Esquadro | Projeto descontado na obra",
  description:
    "Se construir com a Evaplace, oferecemos até 100% do projeto de arquitetura e especialidades. Candidaturas até 16 de dezembro.",
  robots: { index: false, follow: false },
  // O rodapé tem os telefones em texto, sem link: impede o iOS de os transformar em links.
  formatDetection: { telephone: false, address: false, email: false },
};

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

  const fechada = (
    <section className={styles.fecho}>
      <div className={styles.fechoLogos}>
        <Logos />
      </div>
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

      <CampanhaGate fechada={fechada}>
        {/* Início: imagem escurecida com a oferta ao centro; a caixa do formulário
            fica por cima do fim da imagem. */}
        <section className={styles.hero} style={{ backgroundImage: `url(${IMAGEM_TOPO})` }}>
          <div className={styles.heroConteudo}>
            <Logos />
            <p className={styles.selo}>BLACK FRIDAY</p>
            <h1 className={styles.heroTitulo}>Se construir com a Evaplace, oferecemos até 100% do projeto.</h1>
            <p className={styles.heroTexto}>
              Projeto de arquitetura e especialidades. Candidaturas até 16 de dezembro.
            </p>
          </div>
        </section>

        <div id="candidatura" className={styles.candidatura}>
          <CampanhaForm />
        </div>

          <div className={styles.resto}>
        <section className={styles.seccao}>
          <h2 className={styles.h2}>Projeto e construção na mesma equipa</h2>
          <div className={styles.linha} />
          <p className={styles.texto}>
            A Evaplace junta-se à Esquadro Arquitetura numa campanha de Black Friday que inclui o projeto de
            arquitetura e os projetos de especialidades da sua casa.
          </p>
          <p className={styles.texto}>Se construir com outra empresa, o projeto fica consigo.</p>
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
          <p className={styles.zonas}>
            Aço leve: distrito do Porto, eixo de Braga e norte de Aveiro. Madeira: também Viana do Castelo, Vila
            Real, interior de Braga e restante distrito de Aveiro.
          </p>
        </section>

        <section className={styles.seccao}>
          <p className={styles.provaNumero}>+10</p>
          <p className={styles.etiqueta}>CASAS ENTREGUES PELA EVAPLACE</p>
          <ProvaGaleria fotos={fotos} />
          <p className={styles.textoSuave}>Antes de decidir, pode visitar uma casa Evaplace em fim de obra.</p>
        </section>

        {/* Fecho da página: repete a oferta e leva ao formulário. */}
        <section className={styles.chamada} data-chamada>
          <h2 className={styles.chamadaTitulo}>Se construir com a Evaplace, oferecemos até 100% do projeto.</h2>
          <BotaoFormulario>CANDIDATAR-ME</BotaoFormulario>
          <p className={styles.chamadaPrazo}>CANDIDATURAS ATÉ 16 DE DEZEMBRO</p>
        </section>

          </div>

        <BarraFixa>CANDIDATAR-ME</BarraFixa>
      </CampanhaGate>

      <footer className={styles.rodape}>
        <p>Evaplace Casas · Rua Rio 15, 4475-493 Nogueira, Maia · 229 610 296 · 963 770 939</p>
      </footer>
    </div>
  );
}
