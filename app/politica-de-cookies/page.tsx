import PoliticaCookies from "../components/PoliticaCookies";
import { Metadata } from "next";

const BASE_URL = "https://www.evaplace.pt";

export const metadata: Metadata = {
  alternates: {
    canonical: `${BASE_URL}/politica-de-cookies`,
  },
};

export default function PoliticaCookiesPage() {
  return <PoliticaCookies />;
}