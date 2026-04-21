import { Metadata } from "next";

const BASE_URL = "https://www.evaplace.pt";

export const metadata: Metadata = {
  title: "FAQ | EVAPLACE - Perguntas sobre Construção em Aço Leve LSF",
  description: "Perguntas frequentes sobre construção em aço leve (LSF - Light Steel Frame). Tire todas as suas dúvidas sobre estruturas metálicas, durabilidade, custos e vantagens.",
  alternates: {
    canonical: `${BASE_URL}/faq`,
  },
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
