import Image from "next/image";
import { notFound } from "next/navigation";
import FadeInOnScroll from "../../components/FadeInOnScroll";

import BotaoDesenvolverProjeto from "../../components/BotaoDesenvolverProjeto";

import { casas } from "../../data/casas";
import { getRandomCasas } from "../../lib/getRandomCasas";

import styles from "./casa.module.css";

export function generateStaticParams() {
  return casas.map((casa) => ({ slug: casa.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const casa = casas.find((c) => c.slug === slug);

  if (!casa) return { title: "Casa | EVAPLACE" };

  return {
    title: `${casa.nomeProjeto} | EVAPLACE`,
    description: casa.descricao,
  };
}

export default async function CasaDetalhePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const casa = casas.find((c) => c.slug === slug);
  if (!casa) return notFound();

  const outrasCasas = getRandomCasas(casas, casa.slug, 3);

  const imagens =
    casa.galeria && casa.galeria.length > 0 ? casa.galeria : [casa.thumbnail];

  const CardContent = (
    <>
      <div className={styles.badge}>Projeto Personalizável</div>
      <h1 className={styles.title}>{casa.nomeProjeto}</h1>

      <div className={styles.grid}>
        <div className={styles.metric}>
          <div className={styles.label}>Tipologia</div>
          <div className={styles.valueGreen}>{casa.tipologia || "-"}</div>
        </div>

        <div className={styles.metric}>
          <div className={styles.label}>Área Total</div>
          <div className={styles.value}>
            {casa.areaTotal ? `${casa.areaTotal}m²` : "-"}
          </div>
        </div>

        <div className={styles.metric}>
          <div className={styles.label}>WC</div>
          <div className={styles.value}>{casa.wc || "-"}</div>
        </div>
      </div>

      {/* BOTÃO QUE ABRE O POPUP */}
      <div className={styles.ctaRow}>
        <BotaoDesenvolverProjeto />
      </div>

      {casa.descricao && <p className={styles.desc}>{casa.descricao}</p>}
    </>
  );

  return (
    <main className={styles.wrapper}>
      <section className={styles.galleryWrap}>
        {/* DESKTOP sticky */}
        <div className={styles.desktopOnly}>
          <div className={styles.stickyLayer}>
            <div className={styles.stickyInner}>
              <FadeInOnScroll
                className={styles.infoCard}
                y={18}
                blur={14}
                amount={0.2}
              >
                {CardContent}
              </FadeInOnScroll>
            </div>
          </div>
        </div>

        {/* IMAGENS */}
        {imagens.map((src, idx) => {
          const isPlanta = src.startsWith("/plantas/");
          return (
          <div key={`${src}-${idx}`}>
            <FadeInOnScroll
              as="section"
              className={styles.screen}
              y={18}
              blur={12}
              amount={0.15}
              durationMs={750}
              delayMs={0}
              once
            >
              <div className={`${styles.screenMedia} ${isPlanta ? styles.plantaMedia : ""}`}>
                <Image
                  src={src}
                  alt={`${casa.nomeProjeto} - ${isPlanta ? "planta" : `imagem ${idx + 1}`}`}
                  fill
                  priority={idx === 0}
                  sizes="100vw"
                  className={`${styles.screenImg} ${isPlanta ? styles.plantaImg : ""}`}
                />
                <div className={styles.screenOverlay} />
              </div>
            </FadeInOnScroll>

            {/* mantém o card 1x no mobile, após a 1ª imagem */}
            {idx === 0 && (
              <div className={styles.mobileOnly}>
                <FadeInOnScroll
                  className={styles.infoCard}
                  y={10}
                  blur={10}
                  amount={0.2}
                  durationMs={650}
                  once
                >
                  {CardContent}
                </FadeInOnScroll>
              </div>
            )}
          </div>
        );
        })}
      </section>

      <section className={styles.outrasSection}>
        <div className={styles.outrasContainer}>
          <h2 className={styles.h2}>Outros Projetos</h2>

          <div className={styles.outrasGrid}>
            {outrasCasas.map((c, i) => (
              <FadeInOnScroll key={c.slug} y={16} blur={10} delayMs={i * 60}>
                <a
                  href={`/produto/${c.slug}`}
                  className={styles.outraCard}
                >
                  <div className={styles.outraImgWrap}>
                    <Image
                      src={c.thumbnail}
                      alt={c.nomeProjeto}
                      fill
                      sizes="(max-width: 900px) 100vw, 33vw"
                      className={styles.outraImg}
                    />
                  </div>
                </a>
              </FadeInOnScroll>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
