import { Metadata } from "next";

const BASE_URL = "https://www.evaplace.pt";

export const metadata: Metadata = {
  title: "Contactos | EVAPLACE - Construção em Aço Leve LSF",
  description: "Entre em contacto com a EVAPLACE para o seu projeto de construção em aço leve (LSF). Orçamentos gratuitos, assistência comercial e informações em Portugal.",
  alternates: {
    canonical: `${BASE_URL}/contactos`,
  },
};

export default function ContactosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
