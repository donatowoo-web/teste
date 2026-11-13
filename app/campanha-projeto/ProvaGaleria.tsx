"use client";

import { useEffect, useState } from "react";
import styles from "./campanha.module.css";

export type FotoProva = { nome: string; pequena: string; grande: string };

/** As 3 fotos da prova: sem link; ao clicar abrem em grande na própria página. */
export default function ProvaGaleria({ fotos }: { fotos: FotoProva[] }) {
  const [aberta, setAberta] = useState<number | null>(null);
  const foto = aberta === null ? null : fotos[aberta];

  useEffect(() => {
    if (aberta === null) return;
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAberta(null);
      if (e.key === "ArrowRight") setAberta((i) => (i === null ? i : (i + 1) % fotos.length));
      if (e.key === "ArrowLeft") setAberta((i) => (i === null ? i : (i + fotos.length - 1) % fotos.length));
    };
    document.addEventListener("keydown", aoTeclar);
    const antes = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", aoTeclar);
      document.body.style.overflow = antes;
    };
  }, [aberta, fotos.length]);

  return (
    <>
      <ul className={styles.fotos}>
        {fotos.map((f, i) => (
          <li key={f.nome}>
            <button
              type="button"
              className={styles.fotoBtn}
              onClick={() => setAberta(i)}
              aria-label={`Ver a foto da ${f.nome} em grande`}
            >
              <img src={f.pequena} alt={f.nome} loading="lazy" className={styles.fotoImg} />
            </button>
            <p className={styles.fotoNome}>{f.nome}</p>
          </li>
        ))}
      </ul>

      {foto && (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label={foto.nome}
          data-lenis-prevent
          onClick={() => setAberta(null)}
        >
          <button type="button" className={styles.lightboxFechar} aria-label="Fechar" autoFocus>
            ✕
          </button>
          <figure className={styles.lightboxFigura} onClick={(e) => e.stopPropagation()}>
            <img src={foto.grande} alt={foto.nome} className={styles.lightboxImg} />
            <figcaption className={styles.lightboxNome}>{foto.nome}</figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
