"use client";

import { useEffect, useRef } from "react";
import styles from "./Hero.module.css";
import { tc } from "../lib/copy";

function SplitWords({ text }: { text: string }) {
  const words = text.split(" ");

  return (
    <span className={styles.words} aria-label={text} role="text">
      {words.map((w, i) => (
        <span
          key={`${w}-${i}`}
          className={styles.word}
          style={{ ["--i" as any]: i }}
          aria-hidden="true"
        >
          {w}&nbsp;
        </span>
      ))}
    </span>
  );
}

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const bg = bgRef.current;
    const content = contentRef.current;

    if (!hero || !bg || !content) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const heroHeight = hero.offsetHeight;
          const progress = Math.min(scrollY / heroHeight, 1);

          // Parallax na imagem (move devagar - efeito quase fixo)
          bg.style.transform = `translateY(${scrollY * 0.5}px)`;

          // Conteúdo sobe e desaparece
          content.style.transform = `translateY(${-scrollY * 0.15}px)`;
          content.style.opacity = `${1 - progress * 1.5}`;

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section ref={heroRef} className={styles.hero}>
      {/* Imagem de fundo com parallax */}
      <div
        ref={bgRef}
        className={styles.heroBg}
        style={{ backgroundImage: "url('/banner.webp')" }}
      />

      {/* REVEAL DA IMAGEM (SLIDE UP) */}
      <div className={styles.imageReveal} aria-hidden="true" />

      {/* overlay */}
      <div className={styles.overlay} />

      <div ref={contentRef} className={styles.inner}>
        <div className={styles.container}>
          <p className={styles.kicker}>{tc("home.hero.kicker")}</p>

          <h1 className={styles.title}>
            <SplitWords text={tc("home.hero.titulo")} />
          </h1>

          <div className={styles.blocksWrap}>
            <div className={styles.blocks}>
              <div className={styles.block}>
                <p className={styles.blockLine}>{tc("home.hero.b1a")}</p>
                <p className={styles.blockLine}>{tc("home.hero.b1b")}</p>
              </div>

              <div className={styles.block}>
                <p className={styles.blockLine}>{tc("home.hero.b2a")}</p>
                <p className={styles.blockLine}>{tc("home.hero.b2b")}</p>
              </div>

              <div className={styles.block}>
                <p className={styles.blockLine}>{tc("home.hero.b3a")}</p>
                <p className={styles.blockLine}>{tc("home.hero.b3b")}</p>
              </div>
            </div>

            <div className={styles.ctaWrap}>
              <a href="/casas-lsf-madeira/" className={styles.cta}>
                {tc("home.hero.cta")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
