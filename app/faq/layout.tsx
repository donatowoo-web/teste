import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | EVAPLACE - Perguntas sobre Construção em Aço Leve LSF",
  description: "Perguntas frequentes sobre construção em aço leve (LSF - Light Steel Frame). Tire todas as suas dúvidas sobre estruturas metálicas, durabilidade, custos e vantagens.",
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
