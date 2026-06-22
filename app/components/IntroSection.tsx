"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./IntroSection.module.css";
import { tc } from "../lib/copy";

gsap.registerPlugin(ScrollTrigger);

export default function IntroSection() {
  const root = useRef<HTMLElement | null>(null);
  const leftRef = useRef<HTMLDivElement | null>(null);
  const rightRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!root.current) return;

    const ctx = gsap.context(() => {
      // PARALLAX - elementos sobem ao fazer scroll
      if (leftRef.current) {
        gsap.to(leftRef.current, {
          y: -80,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top 80%",
            end: "bottom 20%",
            scrub: true,
          },
        });
      }

      if (rightRef.current) {
        gsap.to(rightRef.current, {
          y: -100,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top 80%",
            end: "bottom 20%",
            scrub: true,
          },
        });
      }

      // TÍTULO - reveal linha a linha com clip-path
      const titleLines = gsap.utils.toArray<HTMLElement>("[data-title-line]");

      titleLines.forEach((line, i) => {
        gsap.fromTo(
          line,
          {
            clipPath: "inset(0 100% 0 0)",
            opacity: 0,
          },
          {
            clipPath: "inset(0 0% 0 0)",
            opacity: 1,
            duration: 0.6,
            delay: i * 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: line,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      // TEXT REVEAL
      const reveals = gsap.utils.toArray<HTMLElement>("[data-reveal]");

      reveals.forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 20 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      
      // IMAGE: “corta e aparece” (wipe) + parallax interno
      const imgWrap = document.querySelector<HTMLElement>("[data-imgwrap]");
      const imgEl = document.querySelector<HTMLElement>("[data-img]");

      if (imgWrap && imgEl) {
        // Wipe (revela por recorte)
        gsap.fromTo(
          imgWrap,
          { clipPath: "inset(0 100% 0 0)" }, // tudo cortado à direita
          {
            clipPath: "inset(0 0% 0 0)", // totalmente visível
            ease: "power4.out",
            scrollTrigger: {
              trigger: imgWrap,
              start: "top 80%",
              end: "top 50%",
              scrub: 0.7,
            },
          }
        );

        // Parallax dentro da imagem (a imagem mexe, o recorte mantém-se)
        gsap.fromTo(
          imgEl,
          { y: 0, scale: 1.08 },
          {
            y: 0,
            scale: 1.08,
            ease: "none",
            scrollTrigger: {
              trigger: imgWrap,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.section} ref={root}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* ESQUERDA (TÍTULO) */}
          <div className={styles.left} ref={leftRef}>
            <h2 className={styles.title}>
              <span className={styles.line} data-title-line>{tc("home.intro.t1")}</span>
              <span className={styles.line} data-title-line>{tc("home.intro.t2")}</span>
              <span className={styles.line} data-title-line>{tc("home.intro.t3")}</span>
            </h2>

            <div className={styles.ctaWrap}>
              <a href="/sobre-nos/" className={styles.cta} data-reveal>
                {tc("home.intro.cta")}
              </a>
            </div>
          </div>

          {/* DIREITA (IMAGEM + TEXTO) */}
          <div className={styles.right} ref={rightRef}>
            <div className={styles.imageWrap} data-imgwrap>
              <img
                className={styles.image}
                data-img
                src="imagem_intro.jpg"
                alt="Projeto Evaplace"
              />
            </div>

            <div className={styles.text}>
              <p data-reveal>{tc("home.intro.p1")}</p>

              <p className={styles.paragraph} data-reveal>
                Trabalhamos com os sistemas construtivos mais avançados{" "}
                <a href="/construcao-em-lsf" className={styles.greenLink}>aço leve</a>
                {" "}ou{" "}
                <a href="/construcao-em-madeira" className={styles.greenLink}>madeira</a>
                , garantindo soluções práticas, inovação, no conforto e
                na durabilidade.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
