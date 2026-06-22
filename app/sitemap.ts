import { MetadataRoute } from "next";

export const dynamic = "force-static";
import { client } from "@/sanity/lib/client";
import { getCasas } from "./lib/getCasas";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.evaplace.pt";
  const casas = await getCasas();

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

  // Páginas de cidade (SEO local) — tipo "page" no Sanity
  const cityPages = await client.fetch<{ slug: string; updatedAt: string }[]>(`
    *[_type == "page" && published == true && defined(slug.current) && !(_id in path("drafts.**"))] {
      "slug": slug.current,
      "updatedAt": _updatedAt
    }
  `);

  const cityUrls = cityPages.map((p) => ({
    url: `${baseUrl}/paginas/${p.slug}`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Projetos
  const projetos = await client.fetch<{ slug: string; updatedAt: string }[]>(`
    *[_type == "projeto" && defined(slug.current) && !(_id in path("drafts.**"))] {
      "slug": slug.current,
      "updatedAt": _updatedAt
    }
  `);

  const projetoUrls = projetos.map((p) => ({
    url: `${baseUrl}/projetos/${p.slug}`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticUrls, ...productUrls, ...postUrls, ...jobUrls, ...cityUrls, ...projetoUrls];
}
