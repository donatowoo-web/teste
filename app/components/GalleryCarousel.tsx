"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import styles from "./GalleryCarousel.module.css";

const images = [
  "/gallery/eva_galeria_1.webp",
  "/gallery/eva_galeria_2.webp",
  "/gallery/eva_galeria_3.webp",
  "/gallery/eva_galeria_4.webp",
  "/gallery/eva_galeria_5.webp",
  "/gallery/eva_galeria_6.webp",
];

export default function GalleryCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    skipSnaps: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [scrollProgress, setScrollProgress] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  const onScroll = useCallback(() => {
    if (!emblaApi) return;
    const progress = Math.max(0, Math.min(1, emblaApi.scrollProgress()));
    setScrollProgress(progress * 100);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect();
    onScroll();
    emblaApi.on("select", onSelect);
    emblaApi.on("scroll", onScroll);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect, onScroll]);

  const prev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const next = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const goTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  return (
    <section className={styles.section}>
      {/* Título */}
      <div className={styles.header}>
        <h2 className={styles.title}>Galeria</h2>
        <p className={styles.subtitle}>Os nossos projetos em destaque</p>
      </div>

      <div className={styles.carouselWrap}>
        {/* viewport */}
        <div ref={emblaRef} className={styles.viewport}>
          <div className={styles.track}>
            {images.map((src, index) => (
              <div
                key={src}
                className={`${styles.slide} ${index === selectedIndex ? styles.slideActive : ''}`}
              >
                <div className={styles.card}>
                  <div
                    className={styles.cardImage}
                    style={{ backgroundImage: `url('${src}')` }}
                  />
                  <div className={styles.cardOverlay} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Setas modernas */}
        <button
          onClick={prev}
          className={`${styles.arrow} ${styles.arrowLeft}`}
          aria-label="Anterior"
          type="button"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <button
          onClick={next}
          className={`${styles.arrow} ${styles.arrowRight}`}
          aria-label="Seguinte"
          type="button"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Progress bar */}
      <div className={styles.progressWrap}>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${((selectedIndex + 1) / images.length) * 100}%` }}
          />
        </div>
        <span className={styles.counter}>
          {String(selectedIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
        </span>
      </div>
    </section>
  );
}
