"use client";

import { useEffect, useState, type ReactNode } from "react";
import styles from "./campanha.module.css";

const ALVO = "candidatura";

function irParaFormulario(e: React.MouseEvent) {
  const alvo = document.getElementById(ALVO);
  if (!alvo) return;
  e.preventDefault();
  alvo.scrollIntoView({ behavior: "smooth", block: "start" });
  // No desktop o formulário já está à vista: o clique põe o cursor na primeira pergunta.
  if (window.matchMedia("(min-width: 1024px)").matches) {
    alvo.querySelector<HTMLElement>("input, [role=radio]")?.focus({ preventScroll: true });
  }
}

/** Botão «QUERO SABER MAIS» da abertura: leva ao formulário (âncora na própria página). */
export function BotaoFormulario({ children }: { children: ReactNode }) {
  return (
    <a href={`#${ALVO}`} className={styles.botao} onClick={irParaFormulario}>
      {children}
    </a>
  );
}

/**
 * Telemóvel: barra fixa no fundo com o mesmo botão. Esconde-se quando o formulário está
 * no ecrã (para não tapar o «Seguinte») e fica por baixo do aviso de cookies (z-index).
 */
export function BarraFixa({ children }: { children: ReactNode }) {
  const [formVisivel, setFormVisivel] = useState(false);

  useEffect(() => {
    const alvo = document.getElementById(ALVO);
    if (!alvo || typeof IntersectionObserver === "undefined") return;
    // Só conta como «à vista» quando o formulário entra nos 65% de cima do ecrã: enquanto
    // apenas espreita no fundo, a barra continua lá; quando o «Seguinte» aparece, já saiu.
    const obs = new IntersectionObserver(([entrada]) => setFormVisivel(entrada.isIntersecting), {
      rootMargin: "0px 0px -35% 0px",
    });
    obs.observe(alvo);
    return () => obs.disconnect();
  }, []);

  return (
    <div className={`${styles.barra} ${formVisivel ? styles.barraEscondida : ""}`} aria-hidden={formVisivel}>
      <a href={`#${ALVO}`} className={styles.barraBotao} onClick={irParaFormulario} tabIndex={formVisivel ? -1 : 0}>
        {children}
      </a>
    </div>
  );
}
