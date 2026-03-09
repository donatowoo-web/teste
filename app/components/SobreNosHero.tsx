"use client";

import { useEffect, useRef } from "react";
import styles from "./SobreNosHero.module.css";

export default function SobreNosHero() {
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
        style={{ backgroundImage: "url('/sobre-nos/sobre_nos_header.webp')" }}
      />

      {/* REVEAL DA IMAGEM (SLIDE UP) */}
      <div className={styles.imageReveal} aria-hidden="true" />

      {/* overlay escuro + gradiente para leitura */}
      <div className={styles.overlay} />
      <div className={styles.overlayBottom} />

      <div ref={contentRef} className={styles.inner}>
        <div className={styles.container}>
          <h1 className={styles.title}>
            Histórias que
            <br />
            nasceram na Maia.
          </h1>
        </div>
      </div>
    </section>
  );
}
