import Image from "next/image";
import { getCasas } from "../lib/getCasas";
import FadeInOnScroll from "../components/FadeInOnScroll";
import styles from "./casas.module.css";

const BASE_URL = "https://www.evaplace.pt";

export const metadata = {
  title: "Casas em Aço Leve LSF | EVAPLACE",
  description:
    "Explore os nossos modelos de casas em aço leve (LSF - Light Steel Frame). Estrutura metálica galvanizada, arquitetura moderna e máxima eficiência energética em Portugal.",
  alternates: {
    canonical: `${BASE_URL}/casas-lsf-madeira`,
  },
};

export default async function CasasLSFPage() {
  const casas = await getCasas();
  return (
    <main className={styles.wrapper}>
      {/* espaço equivalente ao antigo h1 */}
      <div className={styles.topSpacer} />

      <section className={styles.grid}>
        {casas.map((casa, i) => (
          <FadeInOnScroll key={casa.slug} y={30} blur={8} delayMs={i * 20} durationMs={250}>
            <a
              href={`/produto/${casa.slug}`}
              className={styles.card}
            >
              <div className={styles.media}>
                {casa.thumbnail && (
                  <Image
                    src={casa.thumbnail}
                    alt={`Casa ${casa.nomeProjeto} em LSF e madeira`}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                )}

                <div className={styles.overlay} />

                <div className={styles.caption}>
                  <h2 className={styles.title}>{casa.nomeProjeto}</h2>
                  <div className={styles.meta}>
                    {casa.tipologia} • {casa.areaTotal}m²
                  </div>
                </div>
              </div>
            </a>
          </FadeInOnScroll>
        ))}
      </section>
    </main>
  );
}
