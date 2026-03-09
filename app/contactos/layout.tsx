import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contactos | EVAPLACE - Construção em Aço Leve LSF",
  description: "Entre em contacto com a EVAPLACE para o seu projeto de construção em aço leve (LSF). Orçamentos gratuitos, assistência comercial e informações em Portugal.",
};

export default function ContactosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
