import { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import styles from "./recrutamento.module.css";

const BASE_URL = "https://www.evaplace.pt";

export const metadata: Metadata = {
  title: "Recrutamento | EVAPLACE - Carreiras em Construção LSF",
  description: "Junta-te à equipa EVAPLACE. Oportunidades de carreira em construção em aço leve (LSF), engenharia e produção. Trabalha connosco em Portugal.",
  alternates: {
    canonical: `${BASE_URL}/recrutamento`,
  },
};

type Job = {
  title: string;
  slug: { current: string };
  location?: string;
  type?: string;
  description?: string;
  publishedAt?: string;
};

export default async function RecrutamentoPage() {
  const jobs = await client.fetch<Job[]>(`
    *[
      _type == "job" &&
      isActive == true &&
      defined(slug.current)
    ] | order(publishedAt desc){
      title,
      slug,
      location,
      type,
      description,
      publishedAt
    }
  `);

  const typeLabels: Record<string, string> = {
    "full-time": "Full-time",
    "part-time": "Part-time",
    "internship": "Estágio",
    "freelance": "Freelance",
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Junta-te à Nossa Equipa</h1>
          <p className={styles.subtitle}>
            Procuramos profissionais motivados para crescer connosco.
            Conhece as nossas oportunidades.
          </p>
        </header>

        {jobs.length === 0 ? (
          <div className={styles.empty}>
            <p>De momento não existem vagas disponíveis.</p>
            <p>Volta em breve ou envia o teu CV para geral@evaplace.pt</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {jobs.map((job) => (
              <a
                key={job.slug.current}
                href={`/recrutamento/${job.slug.current}`}
                className={styles.card}
              >
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>{job.title}</h2>
                  <span className={styles.arrow}>→</span>
                </div>

                <div className={styles.tags}>
                  {job.location && (
                    <span className={styles.tag}>{job.location}</span>
                  )}
                  {job.type && (
                    <span className={styles.tag}>
                      {typeLabels[job.type] || job.type}
                    </span>
                  )}
                </div>

                {job.description && (
                  <p className={styles.cardDescription}>
                    {job.description.length > 150
                      ? job.description.substring(0, 150) + "..."
                      : job.description}
                  </p>
                )}

                {job.publishedAt && (
                  <p className={styles.date}>
                    Publicado a {new Date(job.publishedAt).toLocaleDateString("pt-PT")}
                  </p>
                )}
              </a>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
