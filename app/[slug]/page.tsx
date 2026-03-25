import { client } from "@/sanity/lib/client";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Metadata } from "next";
import styles from "../artigo.module.css";

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs: string[] = await client.fetch(`
    *[
      _type == "post" &&
      defined(slug.current) &&
      !(_id in path("drafts.**"))
    ].slug.current
  `);

  return slugs.map((slug) => ({ slug }));
}

type Post = {
  title: string;
  publishedAt?: string;
  body?: any;
  mainImage?: { asset?: { url: string } };
};

const postQuery = `
*[
  _type == "post" &&
  slug.current == $slug &&
  !(_id in path("drafts.**"))
][0]{
  title,
  publishedAt,
  mainImage { asset-> { url } },
  "body": coalesce(content, body)[]{
    ...,
    _type == "image" => {
      _type,
      _key,
      alt,
      asset->{
        _id,
        url
      }
    }
  }
}
`;

// Extrair texto do primeiro parágrafo do Portable Text
function getFirstParagraph(body: any[]): string {
  if (!body || !Array.isArray(body)) return "";

  const firstBlock = body.find(
    (block) => block._type === "block" && block.style === "normal"
  );

  if (!firstBlock || !firstBlock.children) return "";

  const text = firstBlock.children
    .filter((child: any) => child._type === "span")
    .map((child: any) => child.text)
    .join("");

  // Limitar a 160 caracteres para meta description
  return text.length > 160 ? text.substring(0, 157) + "..." : text;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const post = await client.fetch<Post | null>(postQuery, { slug: decodedSlug });

  if (!post) {
    return { title: "Artigo não encontrado | EVAPLACE" };
  }

  const description = getFirstParagraph(post.body);

  return {
    title: `${post.title} | EVAPLACE`,
    description: description || `Leia o artigo "${post.title}" no blog da EVAPLACE.`,
    openGraph: {
      title: post.title,
      description: description || `Leia o artigo "${post.title}" no blog da EVAPLACE.`,
      type: "article",
      publishedTime: post.publishedAt,
      siteName: "EVAPLACE",
    },
  };
}

// Componentes para renderizar o Portable Text
const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset?.url) return null;

      return (
        <div style={{ margin: "32px 0" }}>
          <Image
            src={value.asset.url}
            alt={value.alt || ""}
            width={900}
            height={600}
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "8px",
            }}
          />
        </div>
      );
    },
  },
  block: {
    h1: ({ children }) => <h1 style={{ marginTop: "40px", marginBottom: "16px" }}>{children}</h1>,
    h2: ({ children }) => <h2 style={{ marginTop: "36px", marginBottom: "14px" }}>{children}</h2>,
    h3: ({ children }) => <h3 style={{ marginTop: "28px", marginBottom: "12px" }}>{children}</h3>,
    h4: ({ children }) => <h4 style={{ marginTop: "24px", marginBottom: "10px" }}>{children}</h4>,
    normal: ({ children }) => <p style={{ marginBottom: "16px", lineHeight: 1.7 }}>{children}</p>,
    blockquote: ({ children }) => (
      <blockquote style={{
        borderLeft: "4px solid #444",
        paddingLeft: "20px",
        margin: "24px 0",
        fontStyle: "italic",
        opacity: 0.9
      }}>
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul style={{ marginBottom: "16px", paddingLeft: "24px" }}>{children}</ul>,
    number: ({ children }) => <ol style={{ marginBottom: "16px", paddingLeft: "24px" }}>{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li style={{ marginBottom: "8px", lineHeight: 1.6 }}>{children}</li>,
    number: ({ children }) => <li style={{ marginBottom: "8px", lineHeight: 1.6 }}>{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ children, value }) => (
      <a href={value?.href} style={{ color: "#b4d429", textDecoration: "underline" }}>
        {children}
      </a>
    ),
  },
};

export default async function ArtigoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  if (!decodedSlug) return notFound();

  const post = await client.fetch<Post | null>(postQuery, { slug: decodedSlug });
  if (!post) return notFound();

  const richText = post.body ?? [];

  return (
    <main className={styles.blogMain}>
      <article className={styles.blogArticle}>
        <h1>{post.title}</h1>

        {post.publishedAt && (
          <p style={{ opacity: 0.6, margin: "0 0 28px" }}>
            {new Date(post.publishedAt).toLocaleDateString("pt-PT")}
          </p>
        )}

        {post.mainImage?.asset?.url && (
          <div style={{ margin: "0 0 32px" }}>
            <Image
              src={post.mainImage.asset.url}
              alt={post.title}
              width={900}
              height={500}
              style={{ width: "100%", height: "auto", borderRadius: "8px" }}
              priority
            />
          </div>
        )}

        <PortableText value={richText} components={components} />
      </article>
    </main>
  );
}
