"use client";

import Image from "next/image";
import { useState } from "react";
import FadeInOnScroll from "./FadeInOnScroll";
import styles from "../produto/[slug]/casa.module.css";

type Tab = "imagens" | "planta";

export default function GaleriaCasa({
  images,
  planta,
  nomeProjeto,
  descricao,
}: {
  images: string[];
  planta: string;
  nomeProjeto: string;
  descricao?: string;
}) {
  const [tab, setTab] = useState<Tab>("imagens");

  // Layout pattern: wide, left+right, desc, bleed, then repeat
  const layoutClasses = [
    styles.galleryWide,
    styles.galleryLeft,
    styles.galleryRight,
    styles.galleryBleed,
  ];

  return (
    <>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === "imagens" ? styles.tabActive : ""}`}
          onClick={() => setTab("imagens")}
        >
          Imagens
        </button>
        <button
          className={`${styles.tab} ${tab === "planta" ? styles.tabActive : ""}`}
          onClick={() => setTab("planta")}
        >
          Planta
        </button>
      </div>

      {tab === "imagens" && (
        <section className={styles.gallery}>
          {images.map((src, idx) => {
            const layoutClass = layoutClasses[idx % layoutClasses.length];

            return (
              <FadeInOnScroll
                key={`${src}-${idx}`}
                className={`${styles.galleryItem} ${layoutClass}`}
                y={40}
                blur={10}
                durationMs={750}
              >
                <Image
                  src={src}
                  alt={`${nomeProjeto} - imagem ${idx + 1}`}
                  fill
                  loading="lazy"
                  sizes="(max-width: 900px) 100vw, 85vw"
                  className={styles.galleryImg}
                />
              </FadeInOnScroll>
            );
          })}

          {descricao && (
            <p className={styles.galleryDesc}>{descricao}</p>
          )}
        </section>
      )}

      {tab === "planta" && (
        <section className={styles.plantaSection}>
          <div className={styles.plantaViewer}>
            <Image
              src={planta}
              alt={`${nomeProjeto} - planta`}
              width={1200}
              height={800}
              className={styles.plantaImage}
              style={{ objectFit: "contain" }}
            />
          </div>
        </section>
      )}
    </>
  );
}
