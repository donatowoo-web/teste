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

/** Botão «CANDIDATAR-ME» da caixa de fecho: leva ao formulário (âncora na própria página). */
export function BotaoFormulario({ children }: { children: ReactNode }) {
  return (
    <a href={`#${ALVO}`} className={styles.botao} onClick={irParaFormulario}>
      {children}
    </a>
  );
}

/**
 * Telemóvel: barra fixa no fundo com o mesmo botão. Esconde-se quando o formulário está
 * no ecrã (para não tapar o «Seguinte») ou quando a caixa de fecho, que tem o mesmo botão,
 * está à vista. Fica por baixo do aviso de cookies (z-index).
 */
export function BarraFixa({ children }: { children: ReactNode }) {
  const [formVisivel, setFormVisivel] = useState(false);

  useEffect(() => {
    const alvos = [document.getElementById(ALVO), document.querySelector("[data-chamada]")].filter(
      (el): el is HTMLElement => el instanceof HTMLElement,
    );
    if (!alvos.length || typeof IntersectionObserver === "undefined") return;
    // Só conta como «à vista» quando já há 160 px acima do fundo do ecrã: enquanto apenas
    // espreita, a barra continua lá; quando o «Seguinte» aparece, a barra já saiu.
    const aVista = new Set<Element>();
    const obs = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) aVista.add(e.target);
          else aVista.delete(e.target);
        }
        setFormVisivel(aVista.size > 0);
      },
      { rootMargin: "0px 0px -160px 0px" },
    );
    alvos.forEach((el) => obs.observe(el));
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
