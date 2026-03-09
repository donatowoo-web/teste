import { client } from "@/sanity/lib/client";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import styles from "./pagina.module.css";
import PageSections from "./PageSections";

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

  let sections: any[] = [];
  try {
    sections = page.sectionsData ? JSON.parse(page.sectionsData) : [];
  } catch {
    sections = [];
  }

  return (
    <main className={styles.pageMain}>
      <PageSections sections={sections} />
    </main>
  );
}
