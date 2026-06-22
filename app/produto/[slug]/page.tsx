import Image from "next/image";
import { notFound } from "next/navigation";
import FadeInOnScroll from "../../components/FadeInOnScroll";
import GaleriaCasa from "../../components/GaleriaCasa";

import BotaoDesenvolverProjeto from "../../components/BotaoDesenvolverProjeto";

import { getCasas } from "../../lib/getCasas";
import { getRandomCasas } from "../../lib/getRandomCasas";

import styles from "./casa.module.css";

const BASE_URL = "https://www.evaplace.pt";

export async function generateStaticParams() {
  const casas = await getCasas();
  return casas.map((casa) => ({ slug: casa.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const casas = await getCasas();
  const casa = casas.find((c) => c.slug === slug);

  if (!casa) return { title: "Casa | EVAPLACE" };

  return {
    title: `${casa.nomeProjeto} | EVAPLACE`,
    description: casa.descricao,
    alternates: {
      canonical: `${BASE_URL}/produto/${slug}`,
    },
  };
}

export default async function CasaDetalhePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const casas = await getCasas();
  const casa = casas.find((c) => c.slug === slug);
  if (!casa) return notFound();

  const outrasCasas = getRandomCasas(casas, casa.slug, 3);

  // Filtrar plantas da galeria de imagens (e ignorar vazios)
  const imagens = (casa.galeria && casa.galeria.length > 0 ? casa.galeria : [casa.thumbnail])
    .filter((src): src is string => Boolean(src) && !src.startsWith("/plantas/"));

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
      {/* HERO */}
      <section className={styles.heroWrap}>
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

        {/* IMAGEM PRINCIPAL */}
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
          <div className={styles.screenMedia}>
            {(imagens[0] || casa.thumbnail) && (
              <Image
                src={imagens[0] || casa.thumbnail}
                alt={`${casa.nomeProjeto} - imagem principal`}
                fill
                priority
                sizes="100vw"
                className={styles.screenImg}
              />
            )}
            <div className={styles.screenOverlay} />
          </div>
        </FadeInOnScroll>

        {/* MOBILE card */}
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
      </section>

      {/* GALERIA COM TABS */}
      <FadeInOnScroll
        className={styles.galleryTitle}
        as="h2"
        y={20}
        blur={10}
        durationMs={800}
      >
        {casa.nomeProjeto}
      </FadeInOnScroll>

      <GaleriaCasa
        images={imagens}
        planta={casa.planta}
        nomeProjeto={casa.nomeProjeto}
        descricao={casa.descricao}
      />

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
                    {c.thumbnail && (
                      <Image
                        src={c.thumbnail}
                        alt={c.nomeProjeto}
                        fill
                        sizes="(max-width: 900px) 100vw, 33vw"
                        className={styles.outraImg}
                      />
                    )}
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
