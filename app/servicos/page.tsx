import { Metadata } from "next";
import FadeInOnScroll from "../components/FadeInOnScroll";
import styles from "./servicos.module.css";

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
  {
    title: "Construção de Casas",
    desc: "Planeamos e executamos cada etapa com métodos de construção atuais, construção em madeira e LSF garantindo conforto e qualidade sem ultrapassar o orçamento e chave na mão.",
  },
  {
    title: "Assentamento",
    desc: "Uma base instável pode comprometer toda a estrutura. Implementamos soluções de assentamento fiáveis, aplicando técnicas e materiais adequados para assegurar durabilidade e segurança.",
  },
  {
    title: "Arquitetura e Engenharia",
    desc: "Conciliar forma e função num projeto pode ser um desafio. Elaboramos cada detalhe arquitetónico e estrutural de forma integrada, criando espaços personalizados e funcionais.",
  },
  {
    title: "Muros e vedações",
    desc: "Precisa de segurança e privacidade sem descurar a estética? Desenvolvemos muros e vedações, com design adequado ao ambiente e materiais de qualidade, para delimitar o seu espaço de forma prática e agradável.",
  },
  {
    title: "Pré instalação de eletricidade e pichelaria",
    desc: "Instalações mal planeadas podem causar transtornos e despesas adicionais. Garantimos um planeamento cuidadoso, assegurando que cada detalhe elétrico e hidráulico é definido desde o início, preparando a sua casa para um funcionamento eficiente.",
  },
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
