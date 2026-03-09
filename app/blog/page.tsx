import { Metadata } from "next";
import Image from "next/image";
import { client } from "@/sanity/lib/client";

export const metadata: Metadata = {
  title: "Blog | EVAPLACE - Artigos sobre Construção em Aço Leve LSF",
  description: "Artigos e novidades sobre construção em aço leve (LSF - Light Steel Frame), estruturas metálicas, eficiência energética e tendências de construção em Portugal.",
};

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

export default async function BlogPage() {
  const posts = await client.fetch<Post[]>(`
    *[
      _type == "post" &&
      defined(slug.current) &&
      !(_id in path("drafts.**"))
    ] | order(publishedAt desc){
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
    <main
      style={{
        maxWidth: 1300,
        margin: "0 auto",
        padding: "140px 16px 80px",
        fontFamily:
          "Poppins, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
        color: "#fff",
      }}
    >
      <h1 style={{ marginBottom: 28 }}>Blog</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)", // ✅ 2 por 2
          gap: 32,
        }}
      >
        {posts.map((post) => (
          <a
            key={post.slug.current}
            href={`/${post.slug.current}`}
            style={{
              textDecoration: "none",
              color: "inherit",
              display: "block",

              // ✅ card reto, sem arredondados
              borderRadius: 0,
              overflow: "hidden",

              // ✅ tema escuro no card
              background: "#0f0f0f",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {/* ✅ IMAGEM (cover) */}
            <div
              style={{
                position: "relative",
                width: "100%",
                height: 360, // ✅ grande
                overflow: "hidden",
                background: "#111",
              }}
            >
              {post.mainImage?.asset?.url ? (
                <Image
                  src={post.mainImage.asset.url}
                  alt={post.mainImage?.alt || post.title}
                  fill
                  sizes="(max-width: 900px) 100vw, 50vw"
                  style={{ objectFit: "cover" }}
                  priority={false}
                />
              ) : (
                <div style={{ width: "100%", height: "100%", background: "#222" }} />
              )}
            </div>

            {/* ✅ TÍTULO EM BAIXO (BRANCO) */}
            <div
              style={{
                padding: "16px 18px 18px",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: 25,
                  lineHeight: 1.25,
                  fontWeight: 600,
                  color: "#fff",
                }}
              >
                {post.title}
              </h2>

              {post.publishedAt && (
                <p style={{ margin: "10px 0 0", opacity: 0.7, fontSize: 14 }}>
                  {new Date(post.publishedAt).toLocaleDateString("pt-PT")}
                </p>
              )}
            </div>
          </a>
        ))}
      </div>

      {/* ✅ responsivo: no telemóvel fica 1 coluna */}
      <style>{`
        @media (max-width: 900px) {
          main > div {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}
