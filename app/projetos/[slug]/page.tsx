import { Metadata } from "next";
import { projetos } from "../../data/projetos";
import ProjetoClient from "./ProjetoClient";

export function generateStaticParams() {
  return projetos.map((projeto) => ({
    slug: projeto.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const projeto = projetos.find((p) => p.slug === slug);

  if (!projeto) {
    return {
      title: "Projeto não encontrado | EVAPLACE",
    };
  }

  return {
    title: `${projeto.titulo} | EVAPLACE`,
    description: projeto.descricao,
  };
}

export default async function ProjetoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const projeto = projetos.find((p) => p.slug === slug);

  if (!projeto) {
    return null;
  }

  return <ProjetoClient projeto={projeto} />;
}
