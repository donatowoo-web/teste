import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getProjetos } from "../lib/getProjetos";
import styles from "./projetos-eva.module.css";

const BASE_URL = "https://www.evaplace.pt";

export const metadata: Metadata = {
  title: "Projetos EVA | EVAPLACE - Construção em Aço Leve e Madeira",
  description:
    "Explore os nossos projetos de construção em aço leve (LSF) e madeira. Casas, alojamentos e estruturas com design contemporâneo e qualidade garantida.",
  alternates: {
    canonical: `${BASE_URL}/projetos-eva`,
  },
};

export default async function ProjetosEvaPage() {
  const projetos = await getProjetos();
  return (
    <main className={styles.main}>
      <div className={styles.topSpacer} />
      <div className={styles.wrapper}>
        <h1 className={styles.h1}>Projetos EVA</h1>
        <div className={styles.grid}>
          {projetos.map((projeto) => (
            <Link
              key={projeto.slug}
              href={`/projetos/${projeto.slug}`}
              className={styles.card}
            >
              <div className={styles.media}>
                {projeto.thumbnail && (
                  <Image
                    src={projeto.thumbnail}
                    alt={projeto.titulo}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                )}
                <div className={styles.overlay} />
                <div className={styles.caption}>
                  <h2 className={styles.title}>{projeto.titulo}</h2>
                  <div className={styles.meta}>
                    <span>{projeto.localizacao}</span>
                    <span>{projeto.area}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
