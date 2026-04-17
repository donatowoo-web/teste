"use client";

import { useEffect, useRef, useState, useLayoutEffect } from "react";
import FadeInOnScroll from "../components/FadeInOnScroll";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import featureStyles from "../components/FeaturesSection.module.css";
import madeiraStyles from "./construcao-madeira.module.css";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    title: "Durabilidade e resistência",
    text: "Madeira de pinho nórdico certificado, com elevada estabilidade estrutural e longevidade comprovada.",
  },
  {
    title: "Segurança",
    text: "Vigas tratadas com comportamento resistente ao fogo e elevado desempenho técnico.",
  },
  {
    title: "Execução eficiente",
    text: "Processo construtivo otimizado que reduz prazos e mantém controlo sobre a obra.",
  },
  {
    title: "Sustentabilidade",
    text: "Menor pegada de carbono, utilização responsável de recursos e enquadramento natural.",
  },
  {
    title: "Conforto",
    text: "Excelente isolamento térmico e acústico. Ambientes eficientes e silenciosos.",
  },
];

export default function MadeiraFeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsLight(entry.isIntersecting);
        });
      },
      {
        threshold: 0.5,
        rootMargin: "-15% 0px -15% 0px",
      }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { y: 150, scale: 0.9, rotate: 2 },
          {
            y: -150,
            scale: 1,
            rotate: 0,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
            },
          }
        );
      }

      if (leftRef.current) {
        gsap.fromTo(
          leftRef.current,
          { y: 80 },
          {
            y: -80,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.5,
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`${featureStyles.section} ${isLight ? featureStyles.light : ""}`}
    >
      <div className={featureStyles.container}>
        <div className={featureStyles.layout}>
          <div className={featureStyles.left} ref={leftRef}>
            <div className={featureStyles.grid}>
              {features.map((f, i) => (
                <FadeInOnScroll key={f.title} y={30} blur={8} delayMs={i * 120} durationMs={700}>
                  <div className={featureStyles.item}>
                    <h3 className={featureStyles.title}>{f.title}</h3>
                    <div className={featureStyles.line} />
                    <p className={featureStyles.text}>{f.text}</p>
                  </div>
                </FadeInOnScroll>
              ))}
            </div>
          </div>

          <div className={featureStyles.right}>
            <div className={`${featureStyles.imageWrap} ${madeiraStyles.madeiraImageWrap}`}>
              <img
                ref={imageRef}
                src="/projetos/casa-valenca/3_1920X1080.webp"
                alt="Casa em madeira Evaplace - projeto turístico"
                className={`${featureStyles.image} ${madeiraStyles.madeiraImage}`}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
