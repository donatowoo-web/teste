import { Metadata } from "next";
import FadeInOnScroll from "../components/FadeInOnScroll";
import styles from "./servicos.module.css";
import { tc } from "../lib/copy";

const BASE_URL = "https://www.evaplace.pt";

export const metadata: Metadata = {
  title: "Serviços | EVAPLACE - Construção em Aço Leve LSF",
  description: "Serviços completos de construção em aço leve (LSF), arquitetura e engenharia. Casas com estrutura metálica galvanizada, soluções chave na mão em Portugal.",
  alternates: {
    canonical: `${BASE_URL}/servicos`,
  },
};

export const dynamic = "error";

const SERVICOS = [
  { title: tc("servicos.s1.tit"), desc: tc("servicos.s1.txt") },
  { title: tc("servicos.s2.tit"), desc: tc("servicos.s2.txt") },
  { title: tc("servicos.s3.tit"), desc: tc("servicos.s3.txt") },
  { title: tc("servicos.s4.tit"), desc: tc("servicos.s4.txt") },
  { title: tc("servicos.s5.tit"), desc: tc("servicos.s5.txt") },
];

export default function ServicosPage() {
  return (
    <main className={styles.page}>
      <section className={styles.container}>
        <div className={styles.grid}>
          {SERVICOS.map((s, i) => (
            <FadeInOnScroll
              key={s.title}
              y={20}
              blur={8}
              delayMs={i * 100}
              durationMs={400}
              once
            >
              <article className={styles.card}>
                <h2 className={styles.title}>{s.title}</h2>
                <div className={styles.line} />
                <p className={styles.desc}>{s.desc}</p>
              </article>
            </FadeInOnScroll>
          ))}
        </div>
      </section>
    </main>
  );
}
