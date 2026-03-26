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
    (block) =>
      block._type === "block" &&
      block.style === "normal" &&
      block.children?.some((c: any) => c.text?.trim().length > 20)
  );

  if (!firstBlock || !firstBlock.children) return "";

  const text = firstBlock.children
    .filter((child: any) => child._type === "span")
    .map((child: any) => child.text)
    .join("");

  return text.length > 160 ? text.substring(0, 157) + "..." : text;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const post = await client.fetch<Post | null>(postQuery, {
    slug: decodedSlug,
  });

  if (!post) {
    return { title: "Artigo não encontrado | EVAPLACE" };
  }

  const description = getFirstParagraph(post.body);

  return {
    title: `${post.title} | EVAPLACE`,
    description:
      description || `Leia o artigo "${post.title}" no blog da EVAPLACE.`,
    openGraph: {
      title: post.title,
      description:
        description || `Leia o artigo "${post.title}" no blog da EVAPLACE.`,
      type: "article",
      publishedTime: post.publishedAt,
      siteName: "EVAPLACE",
    },
  };
}

/**
 * Pre-processes Portable Text blocks before rendering.
 * Converts blocks with raw CSS or HTML-as-text into html-style blocks.
 */
function preprocessBlocks(blocks: any[], title: string): any[] {
  if (!blocks || blocks.length === 0) return blocks;

  return blocks.map((block) => {
    if (block._type !== "block" || block.style !== "normal") return block;

    const spans = block.children || [];
    const raw = spans.map((c: any) => c.text || "").join("");
    const trimmed = raw.trim();

    // Block is raw CSS
    if (trimmed.startsWith(":root") || trimmed.startsWith("*{")) {
      return {
        ...block,
        style: "html",
        children: [{ _type: "span", _key: "css", marks: [], text: `<style>${trimmed}</style>` }],
      };
    }

    // Block has many spans from parsed HTML (original HTML structure was flattened)
    if (spans.length > 10) {
      const html = reconstructHtml(spans, title);
      return {
        ...block,
        style: "html",
        children: [{ _type: "span", _key: "html", marks: [], text: html }],
      };
    }

    // Block contains HTML tags
    if (trimmed.includes("<table") || trimmed.includes("<style") || trimmed.includes("<div")) {
      return {
        ...block,
        style: "html",
        children: [{ _type: "span", _key: "raw", marks: [], text: trimmed }],
      };
    }

    return block;
  });
}

/**
 * Reconstructs HTML from a block whose children are flattened spans
 * originally parsed from HTML (headings, lists, tables lost as plain text).
 */
function reconstructHtml(spans: any[], title: string): string {
  // Collect meaningful text lines (skip whitespace-only spans)
  const lines: string[] = [];
  for (const span of spans) {
    const text = (span.text || "").replace(/^\n+/, "").replace(/\n+$/, "").trim();
    if (text) lines.push(text);
  }

  // Known headings
  const headings = new Set([
    "A confusão que ainda existe",
    "O que é, afinal, uma casa pré-fabricada?",
    "E o que é uma casa modular?",
    "Onde está a diferença?",
    "Comparação simplificada",
    "O erro mais comum em 2026",
    "Conclusão: decidir com clareza",
  ]);

  // Table structure: header row + data rows
  const tableHeaders = ["Sistema", "Produção", "Transporte", "Flexibilidade arquitetónica", "Logística", "Terrenos inclinados ou complexos"];
  const tableRows = [
    ["Pré-fabricada", "Elementos", "Painéis e componentes", "Elevada", "Mais flexível", "Maior capacidade de adaptação"],
    ["Modular", "Volumes completos", "Blocos tridimensionais", "Condicionada à dimensão e lógica do módulo", "Pode exigir transporte especial e acessos adequados", "Pode exigir soluções adicionais"],
  ];
  const allTableCells = new Set([...tableHeaders, ...tableRows.flat()]);

  // List items (short lines that are part of known lists)
  const listItems = new Set([
    "Painéis estruturais", "Estruturas em aço leve (LSF)", "Estruturas em madeira",
    "Painéis de betão", "Elementos de cobertura produzidos em fábrica",
    "Estrutura", "Instalações elétricas", "Canalizações", "Revestimentos",
    "Muitas vezes cozinha e casa de banho instaladas",
    "Transporte", "Flexibilidade arquitetónica", "Adaptação ao terreno",
    "Logística", "Integração das especialidades",
    "Acessos ao terreno", "Largura das vias", "Existência de cabos de média tensão",
    "Inclinação", "Limitações de manobra para transporte pesado", "Regulamentos municipais",
  ]);

  const parts: string[] = [];
  let inList = false;
  let tableInserted = false;
  let i = 0;

  // Skip the duplicate title at the start
  if (lines[0]?.includes("Casas pré-fabricadas vs casas modulares")) i = 1;
  if (lines[1]?.includes("O que são e o que realmente difere")) i = 2;

  while (i < lines.length) {
    const line = lines[i];

    // Skip table cells — we'll insert the table at the right place
    if (allTableCells.has(line)) {
      if (!tableInserted && line === "Sistema") {
        if (inList) { parts.push("</ul>"); inList = false; }
        parts.push('<div class="table-wrap"><table>');
        parts.push("<thead><tr>" + tableHeaders.map(h => `<th>${h}</th>`).join("") + "</tr></thead>");
        parts.push("<tbody>");
        for (const row of tableRows) {
          parts.push("<tr>" + row.map(c => `<td>${c}</td>`).join("") + "</tr>");
        }
        parts.push("</tbody></table></div>");
        tableInserted = true;
      }
      i++;
      continue;
    }

    // Heading
    if (headings.has(line)) {
      if (inList) { parts.push("</ul>"); inList = false; }
      parts.push(`<h2>${line}</h2>`);
      i++;
      continue;
    }

    // List item
    if (listItems.has(line)) {
      if (!inList) { parts.push("<ul>"); inList = true; }
      parts.push(`<li>${line}</li>`);
      i++;
      continue;
    }

    // Regular paragraph
    if (inList) { parts.push("</ul>"); inList = false; }
    parts.push(`<p>${line}</p>`);
    i++;
  }

  if (inList) parts.push("</ul>");

  return parts.join("\n");
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
    // Raw HTML blocks (style tags, tables, etc.) — render as HTML
    html: ({ children, value }) => {
      const raw = value.children
        ?.map((c: any) => c.text || "")
        .join("");
      if (!raw) return null;
      return <div dangerouslySetInnerHTML={{ __html: raw }} />;
    },
    h1: ({ children }) => (
      <h1 style={{ marginTop: "40px", marginBottom: "16px" }}>{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 style={{ marginTop: "36px", marginBottom: "14px" }}>{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 style={{ marginTop: "28px", marginBottom: "12px" }}>{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 style={{ marginTop: "24px", marginBottom: "10px" }}>{children}</h4>
    ),
    normal: ({ children }) => (
      <p style={{ marginBottom: "16px", lineHeight: 1.7 }}>{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote
        style={{
          borderLeft: "4px solid #444",
          paddingLeft: "20px",
          margin: "24px 0",
          fontStyle: "italic",
          opacity: 0.9,
        }}
      >
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul style={{ marginBottom: "16px", paddingLeft: "24px" }}>{children}</ul>
    ),
    number: ({ children }) => (
      <ol style={{ marginBottom: "16px", paddingLeft: "24px" }}>{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li style={{ marginBottom: "8px", lineHeight: 1.6 }}>{children}</li>
    ),
    number: ({ children }) => (
      <li style={{ marginBottom: "8px", lineHeight: 1.6 }}>{children}</li>
    ),
  },
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ children, value }) => (
      <a
        href={value?.href}
        style={{ color: "#b4d429", textDecoration: "underline" }}
      >
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

  const post = await client.fetch<Post | null>(postQuery, {
    slug: decodedSlug,
  });
  if (!post) return notFound();

  const blocks = preprocessBlocks(post.body ?? [], post.title);

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

        <PortableText value={blocks} components={components} />
      </article>
    </main>
  );
}
