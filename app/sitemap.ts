import { MetadataRoute } from "next";

export const dynamic = "force-static";
import { client } from "@/sanity/lib/client";
import { casas } from "./data/casas";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://evaplace.pt";

  // Páginas estáticas
  const staticPages = [
    "",
    "/sobre-nos",
    "/casas-lsf-madeira",
    "/construcao-em-lsf",
    "/servicos",
    "/contactos",
    "/blog",
    "/faq",
    "/recrutamento",
    "/inicie-o-seu-projeto",
    "/politica-de-privacidade",
    "/politica-de-cookies",
  ];

  const staticUrls = staticPages.map((page) => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: page === "" ? 1 : 0.8,
  }));

  // Produtos/Casas
  const productUrls = casas.map((casa) => ({
    url: `${baseUrl}/produto/${casa.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Artigos do blog (agora na raiz)
  const posts = await client.fetch<{ slug: string; updatedAt: string }[]>(`
    *[_type == "post" && defined(slug.current) && !(_id in path("drafts.**"))] {
      "slug": slug.current,
      "updatedAt": _updatedAt
    }
  `);

  const postUrls = posts.map((post) => ({
    url: `${baseUrl}/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // Vagas de recrutamento
  const jobs = await client.fetch<{ slug: string; updatedAt: string }[]>(`
    *[_type == "job" && isActive == true && defined(slug.current)] {
      "slug": slug.current,
      "updatedAt": _updatedAt
    }
  `);

  const jobUrls = jobs.map((job) => ({
    url: `${baseUrl}/recrutamento/${job.slug}`,
    lastModified: new Date(job.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  return [...staticUrls, ...productUrls, ...postUrls, ...jobUrls];
}
