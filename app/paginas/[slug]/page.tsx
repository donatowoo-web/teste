import { client } from "@/sanity/lib/client";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import styles from "./pagina.module.css";

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
  return { title: page ? `${page.title} | EVAPLACE` : "Página" };
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
    <main className={styles.pageMain}>
      <div className={styles.pageContent}>
        {sections.map((section) => {
          switch (section.type) {
            case "heading": {
              const Tag = section.headingLevel || "h2";
              return (
                <Tag key={section._key} className={styles[`heading${(section.headingLevel || "h2").toUpperCase()}`]} style={{ textAlign: section.textAlign || "left" }}>
                  {section.heading}
                </Tag>
              );
            }
            case "text":
              return (
                <div
                  key={section._key}
                  className={styles.textBlock}
                  dangerouslySetInnerHTML={{ __html: section.content || "" }}
                  style={{ textAlign: section.textAlign || "left" }}
                />
              );
            case "image":
              return section.imageUrl ? (
                <div key={section._key} className={styles.imageBlock}>
                  <img
                    src={section.imageUrl}
                    alt={section.imageAlt || ""}
                    className={section.fullWidth ? styles.imageFull : styles.imageContained}
                  />
                  {section.imageAlt && (
                    <p className={styles.imageCaption}>{section.imageAlt}</p>
                  )}
                </div>
              ) : null;
            case "spacer":
              return <div key={section._key} style={{ height: section.height || 60 }} />;
            case "two-columns":
              return (
                <div key={section._key} className={styles.twoColumns}>
                  <div className={styles.textBlock} dangerouslySetInnerHTML={{ __html: section.leftContent || "" }} />
                  <div className={styles.textBlock} dangerouslySetInnerHTML={{ __html: section.rightContent || "" }} />
                </div>
              );
            case "video": {
              const id = section.videoUrl?.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1];
              return id ? (
                <div key={section._key} className={styles.videoBlock}>
                  <iframe
                    src={`https://www.youtube.com/embed/${id}`}
                    className={styles.videoIframe}
                    allowFullScreen
                  />
                </div>
              ) : null;
            }
            case "button":
              return (
                <div key={section._key} className={styles.buttonBlock} style={{ textAlign: section.textAlign || "center" }}>
                  <a
                    href={section.buttonUrl || "#"}
                    className={`${styles.pageButton} ${styles[`btn${(section.buttonStyle || "primary").charAt(0).toUpperCase() + (section.buttonStyle || "primary").slice(1)}`]}`}
                  >
                    {section.buttonText || "Botão"}
                  </a>
                </div>
              );
            default:
              return null;
          }
        })}
      </div>
    </main>
  );
}
