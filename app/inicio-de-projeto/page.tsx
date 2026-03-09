import Image from "next/image";
import { client } from "@/sanity/lib/client";
import FadeInOnScroll from "../components/FadeInOnScroll";
import styles from "./inicio.module.css";

export const metadata = {
  title: "Início de Projeto | EVAPLACE - Construção em Aço Leve LSF",
  description: "Início de projeto. Conheça o método e os prazos de construção da Evaplace.",
};

const etapas = [
  {
    numero: "1º",
    title: "Definição do Conceito",
    text: "É aqui que começa a definir o conceito da sua casa e as opções do projeto.",
  },
  {
    numero: "2º",
    title: "Licenciamento",
    text: "Projetos de arquitetura e especialidades.",
  },
  {
    numero: "3º",
    title: "Adjudicação",
    text: "Aproximadamente 1 mês e meio em fábrica.",
  },
  {
    numero: "4º",
    title: "Transporte",
    text: "Transporte para o local.",
  },
  {
    numero: "5º",
    title: "Montagem",
    text: "De 2 meses a 4 meses de acordo com o modelo escolhido.",
  },
];

type Post = {
  title: string;
  slug: { current: string };
  mainImage?: {
    asset?: {
      _id: string;
      url: string;
    };
    alt?: string;
  };
  publishedAt?: string;
};

export default async function InicioDeProjetoPage() {
  const posts = await client.fetch<Post[]>(`
    *[
      _type == "post" &&
      defined(slug.current) &&
      !(_id in path("drafts.**"))
    ] | order(publishedAt desc)[0...4]{
      title,
      slug,
      publishedAt,
      mainImage{
        asset->{
          _id,
          url
        },
        alt
      }
    }
  `);

  return (
    <main className={styles.wrapper}>
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <FadeInOnScroll y={30} blur={8} durationMs={700}>
            <h1 className={styles.title}>Vamos começar o processo!</h1>
          </FadeInOnScroll>
        </div>
      </section>

      <section className={styles.metodoSection}>
        <div className={styles.container}>
          <FadeInOnScroll y={30} blur={8} durationMs={700}>
            <h2 className={styles.sectionTitle}>Prazos e método de construção</h2>
            <p className={styles.sectionText}>
              O prazo de construção pode variar consoante a dimensão e a complexidade de cada projeto.
              Disponibilizamos vários projetos desenvolvidos pela Evaplace que podem servir de inspiração e ponto de partida.
            </p>
            <p className={styles.sectionText}>
              Em média, o licenciamento decorre entre 4 a 6 meses e a fase de construção entre 4 a 12 meses.
              Ainda assim, poderão ocorrer ajustes ao cronograma devido a fatores externos, como atrasos no
              pagamento de tranches, constrangimentos de fornecedores ou condições climatéricas adversas.
              Nestes casos, a gestão é feita de forma transparente e planeada, salvaguardando sempre a qualidade da obra.
            </p>
          </FadeInOnScroll>
        </div>
      </section>

      <section className={styles.etapasSection}>
        <div className={styles.container}>
          <div className={styles.etapasGrid}>
            {etapas.map((etapa, i) => (
              <FadeInOnScroll key={etapa.title} y={30} blur={8} delayMs={i * 100} durationMs={700}>
                <div className={styles.etapaItem}>
                  <span className={styles.etapaNumero}>{etapa.numero} Etapa</span>
                  <h3 className={styles.etapaTitle}>{etapa.title}</h3>
                  <div className={styles.etapaLine} />
                  <p className={styles.etapaText}>{etapa.text}</p>
                </div>
              </FadeInOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.blogSection}>
        <div className={styles.container}>
          <FadeInOnScroll y={30} blur={8} durationMs={700}>
            <h2 className={styles.sectionTitle}>Últimos artigos do Blog</h2>
          </FadeInOnScroll>

          <div className={styles.blogGrid}>
            {posts.map((post, i) => (
              <FadeInOnScroll key={post.slug.current} y={30} blur={8} delayMs={i * 100} durationMs={700}>
                <a href={`/${post.slug.current}`} className={styles.blogCard}>
                  <div className={styles.blogImage}>
                    {post.mainImage?.asset?.url ? (
                      <Image
                        src={post.mainImage.asset.url}
                        alt={post.mainImage?.alt || post.title}
                        fill
                        sizes="(max-width: 900px) 100vw, 50vw"
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <div className={styles.blogPlaceholder} />
                    )}
                  </div>
                  <div className={styles.blogContent}>
                    <h3 className={styles.blogTitle}>{post.title}</h3>
                    {post.publishedAt && (
                      <p className={styles.blogDate}>
                        {new Date(post.publishedAt).toLocaleDateString("pt-PT")}
                      </p>
                    )}
                  </div>
                </a>
              </FadeInOnScroll>
            ))}
          </div>

          <FadeInOnScroll y={30} blur={8} durationMs={700}>
            <div className={styles.blogCta}>
              <a href="/blog" className={styles.btnOutline}>
                Ver todos os artigos
              </a>
            </div>
          </FadeInOnScroll>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <FadeInOnScroll y={30} blur={8} durationMs={700}>
            <a href="/casas-lsf-madeira" className={styles.btn}>
              Ver todos os projetos
            </a>
          </FadeInOnScroll>
        </div>
      </section>
    </main>
  );
}
