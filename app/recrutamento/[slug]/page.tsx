import { client } from "@/sanity/lib/client";
import { notFound } from "next/navigation";
import CandidaturaPopup from "@/app/components/CandidaturaPopup";
import styles from "../recrutamento.module.css";

// dynamicParams desativado quando não há vagas

export async function generateStaticParams() {
  const slugs: string[] = await client.fetch(`
    *[
      _type == "job" &&
      isActive == true &&
      defined(slug.current)
    ].slug.current
  `);

  // Se não houver vagas, retorna array vazio (não gera páginas)
  if (!slugs || slugs.length === 0) {
    return [];
  }

  return slugs.map((slug) => ({ slug }));
}

type Job = {
  title: string;
  location?: string;
  type?: string;
  description?: string;
  requirements?: string[];
  proposal?: string[];
  publishedAt?: string;
};

const jobQuery = `
*[
  _type == "job" &&
  slug.current == $slug &&
  isActive == true
][0]{
  title,
  location,
  type,
  description,
  requirements,
  proposal,
  publishedAt
}
`;

export default async function JobPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  if (!decodedSlug) return notFound();

  const job = await client.fetch<Job | null>(jobQuery, { slug: decodedSlug });
  if (!job) return notFound();

  const typeLabels: Record<string, string> = {
    "full-time": "Full-time",
    "part-time": "Part-time",
    "internship": "Estágio",
    "freelance": "Freelance",
  };

  return (
    <main className={styles.detailMain}>
      <div className={styles.detailContainer}>
        <a href="/recrutamento" className={styles.backLink}>
          ← Voltar às Vagas
        </a>

        <header className={styles.detailHeader}>
          <h1 className={styles.detailTitle}>{job.title}</h1>

          <div className={styles.detailMeta}>
            {job.location && (
              <span className={styles.tag}>{job.location}</span>
            )}
            {job.type && (
              <span className={styles.tag}>
                {typeLabels[job.type] || job.type}
              </span>
            )}
            {job.publishedAt && (
              <span className={styles.tag}>
                Publicado a {new Date(job.publishedAt).toLocaleDateString("pt-PT")}
              </span>
            )}
          </div>
        </header>

        {job.description && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Descrição</h2>
            <p className={styles.descriptionText}>{job.description}</p>
          </section>
        )}

        {job.requirements && job.requirements.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Requisitos</h2>
            <ul className={styles.list}>
              {job.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </section>
        )}

        {job.proposal && job.proposal.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>O que Oferecemos</h2>
            <ul className={styles.list}>
              {job.proposal.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        <section className={styles.applySection}>
          <h2 className={styles.applyTitle}>Interessado nesta vaga?</h2>
          <p className={styles.applyText}>
            Preenche o formulário e entra em contacto connosco.
          </p>
          <CandidaturaPopup jobTitle={job.title} />
        </section>
      </div>
    </main>
  );
}
