import { Metadata } from "next";
import SobreNosHero from "../components/SobreNosHero";
import HighlightsSection from "../components/HighlightsSection";
import AboutSplitSection from "../components/AboutSplitSection";
import AboutCardsSection from "../components/AboutCardsSection";
import MultiStepForm from "../components/MultiStepForm";

export const metadata: Metadata = {
  title: "Sobre Nós | EVAPLACE - Especialistas em Construção LSF",
  description: "Conheça a EVAPLACE, empresa especializada em construção em aço leve (LSF - Light Steel Frame) em Portugal. Estruturas metálicas de alta qualidade, inovação e compromisso com a excelência.",
};

export default function SobreNosPage() {
  return (
    <>
      <SobreNosHero />
      <AboutSplitSection />
      <AboutCardsSection />
      <MultiStepForm />
      {/* resto */}
    </>
  );
}