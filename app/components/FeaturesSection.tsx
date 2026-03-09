"use client";

import { useEffect, useRef, useState, useLayoutEffect } from "react";
import FadeInOnScroll from "./FadeInOnScroll";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./FeaturesSection.module.css";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    title: "Construção rápida",
    text:
      "Construção rápida e eficiente é nossa prioridade, utilizamos métodos inovadores para garantir projetos ágeis e eficazes.",
  },
  {
    title: "Design Inovador",
    text:
      "Destacamo-nos por oferecer um design exclusivo e inovador. Cada projeto é meticulosamente criado para refletir o estilo distinto dos nossos clientes, que resulta em espaços únicos e inspiradores.",
  },
  {
    title: "Sustentável",
    text:
      "Abraçamos a sustentabilidade em cada construção, adotando práticas e materiais ecológicos que criam casas mais conscientes e amigas do ambiente.",
  },
  {
    title: "Qualidade garantida",
    text:
      "Na procura pela excelência, asseguramos qualidade inabalável em cada construção. O nosso compromisso com a qualidade garante que cada casa seja uma expressão de durabilidade, segurança e satisfação.",
  },
];

export default function FeaturesSection() {
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
      // Parallax na imagem com escala
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

      // Parallax nos pontos (velocidade diferente)
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
      className={`${styles.section} ${isLight ? styles.light : ""}`}
    >
      <div className={styles.container}>
        <div className={styles.layout}>
          {/* ESQUERDA - Pontos */}
          <div className={styles.left} ref={leftRef}>
            <div className={styles.grid}>
              {features.map((f, i) => (
                <FadeInOnScroll key={f.title} y={30} blur={8} delayMs={i * 120} durationMs={700}>
                  <div className={styles.item}>
                    <h3 className={styles.title}>{f.title}</h3>
                    <div className={styles.line} />
                    <p className={styles.text}>{f.text}</p>
                  </div>
                </FadeInOnScroll>
              ))}
            </div>
          </div>

          {/* DIREITA - Imagem */}
          <div className={styles.right}>
            <div className={styles.imageWrap}>
              <img
                ref={imageRef}
                src="/features-lsf.png"
                alt="Estrutura metálica LSF (Light Steel Frame) - sistema construtivo em aço leve galvanizado para casas modulares"
                className={styles.image}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
