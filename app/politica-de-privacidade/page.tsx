// app/politica-de-privacidade/page.jsx
import PoliticaPrivacidade from "../components/PoliticaPrivacidade";

const BASE_URL = "https://www.evaplace.pt";

export const metadata = {
  title: "Política de Privacidade | Evaplace",
  description: "A Política de Privacidade da Evaplace descreve como tratamos os seus dados pessoais.",
  alternates: {
    canonical: `${BASE_URL}/politica-de-privacidade`,
  },
};

export default function PoliticaDePrivacidadePage() {
  return <PoliticaPrivacidade />;
}