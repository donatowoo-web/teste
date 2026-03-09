import Image from "next/image";
import MultiStepForm from "../components/MultiStepForm";
import FadeInOnScroll from "../components/FadeInOnScroll";
import BgSlideshow from "./BgSlideshow";
import FaqSection from "./FaqSection";
import styles from "./inicie.module.css";

export const metadata = {
  title: "Inicie o Seu Projeto | EVAPLACE - Construção em Aço Leve LSF",
  description:
    "Comece o seu projeto de construção em aço leve (LSF). Preencha o formulário para orçamento gratuito e inicie a sua casa com estrutura metálica.",
};

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

const ETAPAS = [
  {
    numero: "1º",
    titulo: "Definição do Conceito",
    desc: "É aqui que começa a definir o conceito da sua casa e as opções do projeto.",
  },
  {
    numero: "2º",
    titulo: "Licenciamento",
    desc: "Projetos de arquitetura e especialidades.",
  },
  {
    numero: "3º",
    titulo: "Adjudicação",
    desc: "Aproximadamente 1 mês e meio em fábrica.",
  },
  {
    numero: "4º",
    titulo: "Transporte",
    desc: "Transporte para o local.",
  },
  {
    numero: "5º",
    titulo: "Montagem",
    desc: "De 2 meses a 4 meses de acordo com o modelo escolhido.",
  },
];

type Post = {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage?: {
    asset?: {
      _id: string;
      url: string;
    };
    alt?: string;
  };
};

async function getBlogPosts(): Promise<Post[]> {
  try {
    const { client } = await import("../../sanity/lib/client");
    const posts = await client.fetch<Post[]>(
      `*[_type == "post" && defined(slug.current) && !(_id in path("drafts.**"))] | order(publishedAt desc)[0...4] {
        _id,
        title,
        slug,
        mainImage{
          asset->{
            _id,
            url
          },
          alt
        }
      }`
    );
    return posts;
  } catch {
    return [];
  }
}

export default async function InicieSeuProjetoPage() {
  const blogPosts = await getBlogPosts();

  return (
    <main className={styles.page}>
      {/* Hero com slideshow + formulário centrado */}
      <section className={styles.heroSlideshow}>
        <BgSlideshow />
        <div className={styles.heroFormWrap}>
          <MultiStepForm />
        </div>
      </section>

      {/* Serviços */}
      <section className={styles.servicosSection}>
        <div className={styles.container}>
          <FadeInOnScroll y={30} blur={8} durationMs={700}>
            <h2 className={styles.sectionTitle}>Serviços</h2>
          </FadeInOnScroll>
          <div className={styles.servicosGrid}>
            {SERVICOS.map((s, i) => (
              <FadeInOnScroll
                key={s.title}
                y={20}
                blur={8}
                delayMs={i * 100}
                durationMs={400}
                once
              >
                <article className={styles.servicoCard}>
                  <h3 className={styles.servicoTitle}>{s.title}</h3>
                  <div className={styles.servicoLine} />
                  <p className={styles.servicoDesc}>{s.desc}</p>
                </article>
              </FadeInOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Blog */}
      {blogPosts.length > 0 && (
        <section className={styles.blogSection}>
          <div className={styles.container}>
            <FadeInOnScroll y={30} blur={8} durationMs={700}>
              <h2 className={styles.sectionTitle}>Últimos artigos do Blog</h2>
            </FadeInOnScroll>

            <div className={styles.blogGrid}>
              {blogPosts.map((post, i) => (
                <FadeInOnScroll
                  key={post._id}
                  y={30}
                  blur={8}
                  delayMs={i * 100}
                  durationMs={700}
                  once
                >
                  <a
                    href={`/${post.slug.current}`}
                    className={styles.blogCard}
                  >
                    <div className={styles.blogImgWrap}>
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
                    <div className={styles.blogCardContent}>
                      <h3 className={styles.blogCardTitle}>{post.title}</h3>
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
      )}

      {/* FAQ */}
      <FaqSection />

      {/* CTA */}
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
