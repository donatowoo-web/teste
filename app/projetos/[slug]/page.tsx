import { Metadata } from "next";
import { getProjetos } from "../../lib/getProjetos";
import ProjetoClient from "./ProjetoClient";

export async function generateStaticParams() {
  const projetos = await getProjetos();
  return projetos.map((projeto) => ({
    slug: projeto.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const projetos = await getProjetos();
  const projeto = projetos.find((p) => p.slug === slug);

  if (!projeto) {
    return {
      title: "Projeto não encontrado | EVAPLACE",
    };
  }

  return {
    title: `${projeto.titulo} | EVAPLACE`,
    description: projeto.descricao,
    alternates: { canonical: `https://www.evaplace.pt/projetos/${slug}/` },
  };
}

export default async function ProjetoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const projetos = await getProjetos();
  const projeto = projetos.find((p) => p.slug === slug);

  if (!projeto) {
    return null;
  }

  return <ProjetoClient projeto={projeto} />;
}
