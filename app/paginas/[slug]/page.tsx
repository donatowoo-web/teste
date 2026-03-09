import { client } from "@/sanity/lib/client";
import { notFound } from "next/navigation";
import { Metadata } from "next";

type PageSection = {
  _key: string;
  type: string;
  content?: string;
  heading?: string;
  headingLevel?: "h1" | "h2" | "h3";
  imageUrl?: string;
  imageAlt?: string;
  height?: number;
  leftContent?: string;
  rightContent?: string;
  videoUrl?: string;
  buttonText?: string;
  buttonUrl?: string;
  buttonStyle?: "primary" | "secondary" | "outline";
  textAlign?: "left" | "center" | "right";
  fullWidth?: boolean;
};

type PageDoc = {
  title: string;
  sectionsData?: string;
};

export async function generateStaticParams() {
  const slugs: string[] = await client.fetch(
    `*[_type == "page" && published == true && defined(slug.current) && !(_id in path("drafts.**"))].slug.current`
  );

  if (!slugs || slugs.length === 0) {
    return [];
  }

  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page: PageDoc | null = await client.fetch(
    `*[_type == "page" && slug.current == $slug && published == true && !(_id in path("drafts.**"))][0]{ title }`,
    { slug }
  );
  return { title: page?.title || "Página" };
}

export default async function CustomPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const page: PageDoc | null = await client.fetch(
    `*[_type == "page" && slug.current == $slug && published == true && !(_id in path("drafts.**"))][0]{ title, sectionsData }`,
    { slug }
  );

  if (!page) return notFound();

  let sections: PageSection[] = [];
  try {
    sections = page.sectionsData ? JSON.parse(page.sectionsData) : [];
  } catch {
    sections = [];
  }

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 20px" }}>
      {sections.map((section) => {
        switch (section.type) {
          case "heading": {
            const Tag = section.headingLevel || "h2";
            return (
              <Tag key={section._key} style={{ textAlign: section.textAlign || "left", marginBottom: 16 }}>
                {section.heading}
              </Tag>
            );
          }
          case "text":
            return (
              <div
                key={section._key}
                dangerouslySetInnerHTML={{ __html: section.content || "" }}
                style={{ textAlign: section.textAlign || "left", lineHeight: 1.8, marginBottom: 24, fontSize: 16 }}
              />
            );
          case "image":
            return section.imageUrl ? (
              <div key={section._key} style={{ textAlign: "center", marginBottom: 24 }}>
                <img
                  src={section.imageUrl}
                  alt={section.imageAlt || ""}
                  style={{ maxWidth: section.fullWidth ? "100%" : "80%", height: "auto", borderRadius: 4 }}
                />
                {section.imageAlt && (
                  <p style={{ fontSize: 14, color: "#888", marginTop: 8 }}>{section.imageAlt}</p>
                )}
              </div>
            ) : null;
          case "spacer":
            return <div key={section._key} style={{ height: section.height || 60 }} />;
          case "two-columns":
            return (
              <div key={section._key} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginBottom: 24 }}>
                <div dangerouslySetInnerHTML={{ __html: section.leftContent || "" }} style={{ lineHeight: 1.8 }} />
                <div dangerouslySetInnerHTML={{ __html: section.rightContent || "" }} style={{ lineHeight: 1.8 }} />
              </div>
            );
          case "video": {
            const id = section.videoUrl?.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1];
            return id ? (
              <div key={section._key} style={{ position: "relative", paddingBottom: "56.25%", height: 0, marginBottom: 24 }}>
                <iframe
                  src={`https://www.youtube.com/embed/${id}`}
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none", borderRadius: 4 }}
                  allowFullScreen
                />
              </div>
            ) : null;
          }
          case "button":
            return (
              <div key={section._key} style={{ textAlign: section.textAlign || "center", marginBottom: 24 }}>
                <a
                  href={section.buttonUrl || "#"}
                  style={{
                    display: "inline-block",
                    padding: "14px 36px",
                    background: section.buttonStyle === "outline" ? "transparent" : section.buttonStyle === "secondary" ? "#f0f0f0" : "#111",
                    color: section.buttonStyle === "outline" ? "#111" : section.buttonStyle === "secondary" ? "#333" : "#fff",
                    border: section.buttonStyle === "outline" ? "2px solid #111" : "none",
                    borderRadius: 4,
                    fontSize: 16,
                    fontWeight: 500,
                    textDecoration: "none",
                  }}
                >
                  {section.buttonText || "Botão"}
                </a>
              </div>
            );
          default:
            return null;
        }
      })}
    </main>
  );
}
