import Image from "next/image";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import styles from "./construcao-lsf.module.css";
import FAQAccordion from "./FAQAccordion";
import { Metadata } from "next";

const BASE_URL = "https://www.evaplace.pt";

export const metadata: Metadata = {
  title: "Construção em Aço Leve LSF | EVAPLACE",
  description: "Construção em aço leve (LSF - Light Steel Frame). Estrutura metálica galvanizada, construção rápida, eficiente e sustentável em Portugal.",
  alternates: {
    canonical: `${BASE_URL}/construcao-em-lsf`,
  },
};

type Post = {
  title: string;
  slug: { current: string };
  mainImage?: {
    asset?: {
      url: string;
    };
    alt?: string;
  };
  publishedAt?: string;
};

const FEATURES = [
  "Construção rápida",
  "Resistência Estrutural",
  "Sustentável",
  "Custo controlado",
];

export default async function ConstrucaoLSFPage() {
  // Buscar artigos relacionados com LSF
  const posts = await client.fetch<Post[]>(`
    *[_type == "post"] | order(publishedAt desc)[0...3] {
      title,
      slug,
      mainImage {
        asset-> { url },
        alt
      },
      publishedAt
    }
  `);

  return (
    <main>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.imageReveal} aria-hidden="true" />
        <div className={styles.overlay} />

        <div className={styles.inner}>
          <div className={styles.container}>
            <h1 className={styles.title}>Casas em Light Steel Frame (LSF)</h1>

            <p className={styles.description}>
              A construção em aço leve tem vindo a transformar o setor em
              Portugal. Cada vez mais pessoas optam por este sistema para
              construir moradias com mais rapidez, eficiência e menor impacto
              ambiental.
            </p>

            <ul className={styles.features}>
              {FEATURES.map((feature) => (
                <li key={feature} className={styles.featureItem}>
                  <svg
                    className={styles.checkIcon}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <div className={styles.ctaWrap}>
              <a href="/contactos" className={styles.cta}>
                Fale Connosco!
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Secção Sobre LSF */}
      <section className={styles.aboutSection}>
        <div className={styles.aboutContainer}>
          <div className={styles.aboutLeft}>
            <h2 className={styles.aboutTitle}>
              Uma solução moderna para construir com precisão e eficiência.
            </h2>
          </div>

          <div className={styles.aboutRight}>
            <p className={styles.aboutText}>
              A construção em LSF (Light Steel Frame) é um sistema técnico e
              preciso que utiliza perfis de aço galvanizado para montar a
              estrutura da casa com rapidez, menos desperdício e maior controlo.
            </p>
            <p className={styles.aboutText}>
              Não se trata apenas de construir mais depressa mas sim trata-se de
              construir com mais previsibilidade, qualidade e segurança desde o
              início.
            </p>
          </div>
        </div>
      </section>

      {/* Secção com imagem de fundo */}
      <section className={styles.imageSection}>
        <div className={styles.imageSectionOverlay} />
        <div className={styles.imageSectionContent}>
          <h2 className={styles.imageSectionTitle}>
            Uma solução moderna para
            <br />
            construir com precisão e eficiência
          </h2>
          <p className={styles.imageSectionText}>
            A construção em LSF (Light Steel Frame) é um sistema técnico e preciso que utiliza perfis
            de aço galvanizado para montar a estrutura da casa com rapidez, menos desperdício e
            maior controlo. Não se trata apenas de construir mais depressa mas sim trata-se de
            construir com mais previsibilidade, qualidade e segurança desde o início.
          </p>
        </div>
      </section>

      {/* Secção Paredes Aço Leve */}
      <section className={styles.wallsSection}>
        <div className={styles.wallsContainer}>
          <div className={styles.wallsContent}>
            <h2 className={styles.wallsTitle}>Paredes Aço Leve (LSF)</h2>

            <div className={styles.wallsList}>
              <div className={styles.wallsItem}>
                <h3 className={styles.wallsItemTitle}>Estrutura em Aço Leve</h3>
                <p className={styles.wallsItemText}>
                  Utilizamos perfis de aço leve para criar a estrutura, garantindo
                  robustez e durabilidade.
                </p>
              </div>

              <div className={styles.wallsItem}>
                <h3 className={styles.wallsItemTitle}>Isolamento Térmico</h3>
                <p className={styles.wallsItemText}>
                  O isolamento é feito com lã mineral, aplicada entre os perfis,
                  contribuindo para uma melhor eficiência energética e conforto
                  no interior da habitação.
                </p>
              </div>

              <div className={styles.wallsItem}>
                <h3 className={styles.wallsItemTitle}>Acabamento Interior</h3>
                <p className={styles.wallsItemText}>
                  As paredes são revestidas com placas de gesso cartonado
                  (Pladur), que proporcionam uma superfície lisa, uniforme e
                  pronta para acabamento final.
                </p>
              </div>

              <div className={styles.wallsItem}>
                <h3 className={styles.wallsItemTitle}>Revestimento com Painéis OSB</h3>
                <p className={styles.wallsItemText}>
                  Ambos os lados das paredes são reforçados com painéis OSB3
                  de 15 mm, aumentando a rigidez e preparando a estrutura
                  para os acabamentos exteriores e interiores.
                </p>
              </div>

              <div className={styles.wallsItem}>
                <h3 className={styles.wallsItemTitle}>Controlo de Humidade</h3>
                <p className={styles.wallsItemText}>
                  Para proteger a estrutura da humidade, aplicamos telas
                  antivapor. Estas barreiras evitam a condensação no interior das
                  paredes, garantindo maior durabilidade ao longo do tempo.
                </p>
              </div>
            </div>
          </div>

          <div className={styles.wallsImageWrap}>
            <Image
              src="/lsf/estrutura.png"
              alt="Estrutura em aço leve LSF"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
      </section>

      {/* Secção Vantagens */}
      <section className={styles.advantagesSection}>
        <div className={styles.advantagesContainer}>
          <h2 className={styles.advantagesTitle}>
            As maiores vantagens de construção em Aço leve
          </h2>

          <div className={styles.advantagesGrid}>
            <div className={styles.advantageItem}>
              <span className={styles.advantageArrow}>›</span>
              <div>
                <h3 className={styles.advantageItemTitle}>Durabilidade e Resistência</h3>
                <p className={styles.advantageItemText}>
                  O aço leve confere uma estrutura sólida, com elevada resistência ao
                  tempo e ao uso.
                </p>
              </div>
            </div>

            <div className={styles.advantageItem}>
              <span className={styles.advantageArrow}>›</span>
              <div>
                <h3 className={styles.advantageItemTitle}>Custo Acessível</h3>
                <p className={styles.advantageItemText}>
                  É uma solução económica que mantém a qualidade construtiva, com
                  melhor controlo de custos.
                </p>
              </div>
            </div>

            <div className={styles.advantageItem}>
              <span className={styles.advantageArrow}>›</span>
              <div>
                <h3 className={styles.advantageItemTitle}>Adaptação Arquitetônica</h3>
                <p className={styles.advantageItemText}>
                  Permite uma flexibilidade de design, adaptando-se facilmente às
                  necessidades específicas dos clientes.
                </p>
              </div>
            </div>

            <div className={styles.advantageItem}>
              <span className={styles.advantageArrow}>›</span>
              <div>
                <h3 className={styles.advantageItemTitle}>Materiais Sustentáveis</h3>
                <p className={styles.advantageItemText}>
                  A utilização de aço leve promove um uso eficiente dos recursos,
                  contribuindo para práticas mais sustentáveis.
                </p>
              </div>
            </div>

            <div className={styles.advantageItem}>
              <span className={styles.advantageArrow}>›</span>
              <div>
                <h3 className={styles.advantageItemTitle}>Rapidez na Construção</h3>
                <p className={styles.advantageItemText}>
                  Este método acelera o processo construtivo, permitindo reduzir
                  significativamente o tempo de obra.
                </p>
              </div>
            </div>

            <div className={styles.advantageItem}>
              <span className={styles.advantageArrow}>›</span>
              <div>
                <h3 className={styles.advantageItemTitle}>Isolamento Térmico e Acústico Excelentes</h3>
                <p className={styles.advantageItemText}>
                  As propriedades naturais do sistema garantem um excelente
                  desempenho tanto em isolamento térmico como acústico.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Secção Artigos do Blog */}
      {posts.length > 0 && (
        <section className={styles.blogSection}>
          <div className={styles.blogContainer}>
            <div className={styles.blogHeader}>
              <h2 className={styles.blogTitle}>Artigos Relacionados</h2>
              <p className={styles.blogSubtitle}>
                Saiba mais sobre construção em aço leve e LSF
              </p>
            </div>

            <div className={styles.blogGrid}>
              {posts.map((post) => (
                <Link
                  key={post.slug.current}
                  href={`/${post.slug.current}`}
                  className={styles.blogCard}
                >
                  {post.mainImage?.asset?.url && (
                    <div className={styles.blogImageWrap}>
                      <Image
                        src={post.mainImage.asset.url}
                        alt={post.mainImage.alt || post.title}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  )}
                  <div className={styles.blogCardContent}>
                    <h3 className={styles.blogCardTitle}>{post.title}</h3>
                    {post.publishedAt && (
                      <time className={styles.blogCardDate}>
                        {new Date(post.publishedAt).toLocaleDateString("pt-PT", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </time>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            <div className={styles.blogCta}>
              <Link href="/blog" className={styles.blogCtaLink}>
                Ver todos os artigos
              </Link>
            </div>
          </div>
        </section>
      )}

      <FAQAccordion />
    </main>
  );
}
