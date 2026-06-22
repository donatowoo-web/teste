import { Metadata } from "next";
import Hero from "./components/Hero";
import IntroSection from "./components/IntroSection";
import ProjectsGrid from "./components/ProjectsGrid";
import MethodsSection from "./components/MethodsSection";
import LocationsSection from "./components/LocationsSection";
import FeaturesSection from "./components/FeaturesSection";
import GalleryCarousel from "./components/GalleryCarousel";
import FAQSection from "./components/FAQSection";
import MultiStepForm from "./components/MultiStepForm";

const BASE_URL = "https://www.evaplace.pt";

export const metadata: Metadata = {
  title: "Evaplace | Construção em Aço Leve LSF e Madeira em Portugal",
  description: "Especialistas em construção em aço leve (LSF - Light Steel Frame) e madeira em Portugal. Casas com estrutura metálica galvanizada, design contemporâneo e máxima eficiência energética.",
  keywords: "construção aço leve, LSF, Light Steel Frame, casas LSF, estrutura metálica, construção em madeira, Portugal, Maia",
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: "Evaplace | Construção em Aço Leve LSF",
    description: "Especialistas em construção em aço leve (LSF) e madeira em Portugal. Estrutura metálica galvanizada e design contemporâneo.",
    images: ["/banner.webp"],
  },
};

export default function Home() {
  return (
    <main>
      <Hero />
      <IntroSection />
      <ProjectsGrid />
      <MethodsSection />
      <LocationsSection />
      <FeaturesSection />
      <GalleryCarousel />
      <FAQSection />
      <section id="formulario" style={{ background: "#000", padding: "80px 16px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <MultiStepForm />
        </div>
      </section>

      {/* Tiny Houses CTA */}
      <section style={{
        background: "#000",
        padding: "60px 16px",
        borderTop: "1px solid rgba(255,255,255,0.1)"
      }}>
        <div style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "24px"
        }} className="tinyHousesCta">
          <h2 style={{
            color: "#fff",
            fontSize: "clamp(24px, 4vw, 36px)",
            fontWeight: 600,
            margin: 0
          }}>
            Conheça as nossas Tiny Houses
          </h2>
          <a
            href="https://evatinyhouse.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              padding: "14px 32px",
              background: "#fff",
              color: "#000",
              fontSize: "16px",
              fontWeight: 600,
              textDecoration: "none",
              borderRadius: "0",
              transition: "opacity 0.2s"
            }}
          >
            Ver Tiny Houses
          </a>
        </div>
      </section>

    </main>
  );
}
