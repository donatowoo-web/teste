import { Metadata } from "next";
import MultiStepForm from "../components/MultiStepForm";
import styles from "./zonas.module.css";

const BASE_URL = "https://www.evaplace.pt";

export const metadata: Metadata = {
  title: "Zonas de Atuação | EVAPLACE",
  description:
    "Onde a Evaplace constrói. Consulte os concelhos abrangidos pela construção em aço leve (LSF) e pela construção em madeira.",
  alternates: {
    canonical: `${BASE_URL}/zonas-de-atuacao/`,
  },
};

// Nomes de concelho em lista simples, de propósito: as expressões-alvo do tipo
// "construção de casas em aço leve em [concelho]" pertencem às landing pages
// locais em /paginas/. Repeti-las aqui canibalizava-as.
const LSF: { distrito: string; concelhos: string[] }[] = [
  {
    distrito: "Porto",
    concelhos: [
      "Amarante",
      "Felgueiras",
      "Gondomar",
      "Lousada",
      "Maia",
      "Matosinhos",
      "Paços de Ferreira",
      "Paredes",
      "Penafiel",
      "Porto",
      "Póvoa de Varzim",
      "Santo Tirso",
      "Trofa",
      "Valongo",
      "Vila do Conde",
      "Vila Nova de Gaia",
    ],
  },
  {
    distrito: "Braga",
    concelhos: [
      "Barcelos",
      "Braga",
      "Esposende",
      "Fafe",
      "Guimarães",
      "Vila Nova de Famalicão",
      "Vizela",
    ],
  },
  {
    distrito: "Aveiro",
    concelhos: ["Espinho", "Santa Maria da Feira"],
  },
];

const MADEIRA: { distrito: string; concelhos: string[] }[] = [
  {
    distrito: "Porto",
    concelhos: ["Baião", "Marco de Canaveses"],
  },
  {
    distrito: "Braga",
    concelhos: [
      "Amares",
      "Cabeceiras de Basto",
      "Celorico de Basto",
      "Póvoa de Lanhoso",
      "Terras de Bouro",
      "Vieira do Minho",
      "Vila Verde",
    ],
  },
  {
    distrito: "Viana do Castelo",
    concelhos: [
      "Arcos de Valdevez",
      "Caminha",
      "Paredes de Coura",
      "Ponte da Barca",
      "Ponte de Lima",
      "Valença",
      "Viana do Castelo",
      "Vila Nova de Cerveira",
    ],
  },
  {
    distrito: "Vila Real",
    concelhos: [
      "Mesão Frio",
      "Mondim de Basto",
      "Peso da Régua",
      "Ribeira de Pena",
      "Santa Marta de Penaguião",
      "Vila Pouca de Aguiar",
      "Vila Real",
    ],
  },
  {
    distrito: "Aveiro",
    concelhos: [
      "Arouca",
      "Aveiro",
      "Castelo de Paiva",
      "Estarreja",
      "Murtosa",
      "Oliveira de Azeméis",
      "Ovar",
      "São João da Madeira",
      "Vale de Cambra",
    ],
  },
];

function Distritos({ grupos }: { grupos: { distrito: string; concelhos: string[] }[] }) {
  return (
    <div className={styles.districts}>
      {grupos.map((g) => (
        <div key={g.distrito}>
          <h3 className={styles.districtTitle}>{g.distrito}</h3>
          <ul className={styles.list}>
            {g.concelhos.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default function ZonasDeAtuacaoPage() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Zonas de atuação</h1>

        <p className={styles.intro}>
          Construímos no Norte do país. Esta é uma opção deliberada: obra perto da
          fábrica significa equipa própria no terreno, prazos controlados e
          acompanhamento presente do princípio ao fim. As zonas variam consoante o
          sistema construtivo. A construção em madeira cobre uma área mais alargada
          do que o aço leve.
        </p>

        <section className={styles.system}>
          <h2 className={styles.systemTitle}>Construção em aço leve (LSF)</h2>
          <p className={styles.systemIntro}>
            Distritos do Porto, Braga e norte de Aveiro.
          </p>
          <Distritos grupos={LSF} />
        </section>

        <section className={styles.system}>
          <h2 className={styles.systemTitle}>Construção em madeira</h2>
          <p className={styles.systemIntro}>
            Em madeira cobrimos todos os concelhos acima, mais os seguintes.
          </p>
          <Distritos grupos={MADEIRA} />
        </section>

        <section className={styles.outro}>
          <p className={styles.outroText}>
            O seu concelho não está na lista? Fale connosco na mesma. Analisamos
            caso a caso e, se não conseguirmos avançar, dizemo-lo com clareza logo
            no primeiro contacto.
          </p>
        </section>
      </div>

      <MultiStepForm />
    </main>
  );
}
