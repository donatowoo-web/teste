import Image from "next/image";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import styles from "./construcao-madeira.module.css";
import FeaturesSection from "./FeaturesSection";

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

export const metadata = {
  title: "Construção em Madeira para Projetos Turísticos | EVAPLACE",
  description:
    "Construção em madeira para projetos turísticos em Portugal. Soluções sólidas com materiais duráveis para alojamento local, glamping e turismo rural.",
  keywords:
    "construção em madeira, projetos turísticos, alojamento local, glamping, turismo rural, casas em madeira, Portugal",
  openGraph: {
    title: "Construção em Madeira para Projetos Turísticos | EVAPLACE",
    description:
      "Soluções de construção em madeira para projetos turísticos. Materiais duráveis, design contemporâneo e rentabilidade garantida.",
    images: ["/madeira/hero-madeira.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Construção em Madeira para Projetos Turísticos | EVAPLACE",
    description:
      "Soluções de construção em madeira para projetos turísticos. Materiais duráveis, design contemporâneo e rentabilidade garantida.",
    images: ["/madeira/hero-madeira.jpg"],
  },
};

const FEATURES = [
  "Materiais duráveis",
  "Design contemporâneo",
  "Alta rentabilidade",
  "Sustentável",
];

export default async function ConstrucaoMadeiraPage() {
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
            <h1 className={styles.title}>
              Madeira que Dá Vida
              <br />a Destinos Turísticos
            </h1>

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
              <a href="/contactos" className={styles.cta}>Fale Connosco!</a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className={styles.aboutSection}>
        <div className={styles.aboutContainer}>
          <div className={styles.aboutLeft}>
            <h2 className={styles.aboutTitle}>
              Um bom projeto turístico não vive apenas da estética
            </h2>
          </div>
          <div className={styles.aboutRight}>
            <p className={styles.aboutText}>
              Um projeto turístico verdadeiramente bem estruturado é concebido
              para potenciar a taxa de ocupação, simplificar a manutenção e
              assegurar a valorização contínua ao longo do tempo. Uma construção
              sólida, com materiais duráveis e soluções técnicas criteriosas, é o
              que sustenta uma rentabilidade consistente e duradoura.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <FeaturesSection />

      {/* Invest Section */}
      <section className={styles.investSection}>
        <div className={styles.investContainer}>
          <div className={styles.investHeader}>
            <h2 className={styles.investTitle}>
              Investir em madeira é investir com previsibilidade
            </h2>
            <p className={styles.investSubtitle}>
              Mais rapidez. Mais controlo. Mais rentabilidade.
            </p>
            <p className={styles.investIntro}>
              Cada vez mais investidores escolhem a construção em madeira não
              apenas pela estética, mas pela lógica financeira: custos
              previsíveis, prazos reduzidos e forte valorização do produto final.
            </p>
          </div>

          <div className={styles.investGrid}>
            <div className={styles.investCard}>
              <h3 className={styles.investCardTitle}>
                Controlo de custos desde o início
              </h3>
              <p className={styles.investCardText}>
                O planeamento rigoroso reduz imprevistos e aumenta a segurança do
                investimento.
              </p>
            </div>
            <div className={styles.investCard}>
              <h3 className={styles.investCardTitle}>Execução mais rápida</h3>
              <p className={styles.investCardText}>
                Menos tempo de obra significa começar a gerar receita mais cedo e
                libertar capital para novos projetos.
              </p>
            </div>
            <div className={styles.investCard}>
              <h3 className={styles.investCardTitle}>
                Elevada procura no mercado
              </h3>
              <p className={styles.investCardText}>
                A integração na natureza, o conforto, a eficiência energética e a
                imagem sustentável tornam estes ativos especialmente valorizados
                no turismo e na habitação.
              </p>
            </div>
          </div>

          <div className={styles.investCta}>
            <p className={styles.investCtaText}>
              Na Evaplace, cada projeto é pensado para transformar terreno em
              valor — com método, previsibilidade e foco no retorno.
            </p>
            <a href="/contactos" className={styles.investCtaLink}>
              Fale Connosco
            </a>
          </div>
        </div>
      </section>

      {/* Nordic Section */}
      <section className={styles.nordicSection}>
        <div className={styles.nordicContainer}>
          <div className={styles.nordicLeft}>
            <h2 className={styles.nordicTitle}>
              Construções inovadoras em madeira de pinho nórdico certificado
            </h2>
          </div>
          <div className={styles.nordicRight}>
            <p className={styles.nordicText}>
              A madeira proveniente de regiões nórdicas oferece benefícios
              significativos, incluindo sustentabilidade ambiental, elevado
              desempenho térmico e versatilidade arquitetónica. A pré-fabricação
              dos elementos estruturais contribui para reduzir custos de energia
              e acelerar o processo construtivo, enquanto a menor pegada de
              carbono reforça o seu posicionamento como solução moderna e
              eco-friendly na arquitetura sustentável em Portugal.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      {posts.length > 0 && (
        <section className={styles.blogSection}>
          <div className={styles.blogContainer}>
            <div className={styles.blogHeader}>
              <h2 className={styles.blogTitle}>Artigos Relacionados</h2>
              <p className={styles.blogSubtitle}>
                Saiba mais sobre construção em madeira
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
                        {new Date(post.publishedAt).toLocaleDateString(
                          "pt-PT",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
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
    </main>
  );
}
