"use client";

import { useEffect, useRef } from "react";
import FadeInOnScroll from "@/app/components/FadeInOnScroll";
import styles from "./pagina.module.css";

type PageSection = {
  _key: string;
  type: string;
  content?: string;
  heading?: string;
  headingLevel?: "h1" | "h2" | "h3";
  imageUrl?: string;
  imageAlt?: string;
  height?: number;
  leftContent?: string;
  rightContent?: string;
  videoUrl?: string;
  buttonText?: string;
  buttonUrl?: string;
  buttonStyle?: "primary" | "secondary" | "outline";
  textAlign?: "left" | "center" | "right";
  fullWidth?: boolean;
};

function HeroSection({ section }: { section: PageSection }) {
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const bg = bgRef.current;
    const content = contentRef.current;
    if (!hero || !bg || !content) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const rect = hero.getBoundingClientRect();
          const heroH = hero.offsetHeight;
          const scrollInHero = -rect.top;
          if (rect.bottom > 0 && rect.top < window.innerHeight) {
            const progress = Math.min(Math.max(scrollInHero / heroH, 0), 1);
            bg.style.transform = `translateY(${scrollInHero * 0.4}px)`;
            content.style.transform = `translateY(${-scrollInHero * 0.12}px)`;
            content.style.opacity = `${1 - progress * 1.2}`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={heroRef} className={styles.heroImage} style={{ minHeight: `${section.height || 70}vh` }}>
      {section.imageUrl && (
        <div ref={bgRef} className={styles.heroImageBg} style={{ backgroundImage: `url(${section.imageUrl})` }} />
      )}
      <div className={styles.heroOverlay} />
      <div className={styles.heroGradient} />
      <div ref={contentRef} className={styles.heroInner} style={{ textAlign: section.textAlign || "left" }}>
        <FadeInOnScroll y={30} blur={8} durationMs={800} delayMs={200}>
          <h1 className={styles.heroTitle} style={{ whiteSpace: "pre-line" }}>
            {section.heading || ""}
          </h1>
        </FadeInOnScroll>
      </div>
    </div>
  );
}

function renderSection(section: PageSection) {
  switch (section.type) {
    case "heading": {
      const Tag = section.headingLevel || "h2";
      return (
        <Tag className={styles[`heading${(section.headingLevel || "h2").toUpperCase()}`]} style={{ textAlign: section.textAlign || "left" }}>
          {section.heading}
        </Tag>
      );
    }
    case "text":
      return (
        <div
          className={styles.textBlock}
          dangerouslySetInnerHTML={{ __html: section.content || "" }}
          style={{ textAlign: section.textAlign || "left" }}
        />
      );
    case "image":
      return section.imageUrl ? (
        <div className={styles.imageBlock}>
          <img
            src={section.imageUrl}
            alt={section.imageAlt || ""}
            className={section.fullWidth ? styles.imageFull : styles.imageContained}
          />
          {section.imageAlt && (
            <p className={styles.imageCaption}>{section.imageAlt}</p>
          )}
        </div>
      ) : null;
    case "spacer":
      return <div style={{ height: section.height || 60 }} />;
    case "two-columns":
      return (
        <div className={styles.twoColumns}>
          <FadeInOnScroll y={20} blur={6} durationMs={600}>
            <div className={styles.textBlock} dangerouslySetInnerHTML={{ __html: section.leftContent || "" }} />
          </FadeInOnScroll>
          <FadeInOnScroll y={20} blur={6} durationMs={600} delayMs={150}>
            <div className={styles.textBlock} dangerouslySetInnerHTML={{ __html: section.rightContent || "" }} />
          </FadeInOnScroll>
        </div>
      );
    case "video": {
      const id = section.videoUrl?.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1];
      return id ? (
        <div className={styles.videoBlock}>
          <iframe
            src={`https://www.youtube.com/embed/${id}`}
            className={styles.videoIframe}
            allowFullScreen
          />
        </div>
      ) : null;
    }
    case "button":
      return (
        <div className={styles.buttonBlock} style={{ textAlign: section.textAlign || "center" }}>
          <a
            href={section.buttonUrl || "#"}
            className={`${styles.pageButton} ${styles[`btn${(section.buttonStyle || "primary").charAt(0).toUpperCase() + (section.buttonStyle || "primary").slice(1)}`]}`}
          >
            {section.buttonText || "Botão"}
          </a>
        </div>
      );
    case "html":
      return (
        <div
          className={styles.htmlBlock}
          dangerouslySetInnerHTML={{ __html: section.content || "" }}
        />
      );
    default:
      return null;
  }
}

export default function PageSections({ sections }: { sections: PageSection[] }) {
  return (
    <>
      {sections.map((section, i) => {
        if (section.type === "hero-image") {
          return <HeroSection key={section._key} section={section} />;
        }

        // Wrap non-hero sections in FadeInOnScroll + pageContent
        return (
          <FadeInOnScroll
            key={section._key}
            y={24}
            blur={6}
            durationMs={500}
            delayMs={0}
          >
            <div className={styles.pageContent}>
              {renderSection(section)}
            </div>
          </FadeInOnScroll>
        );
      })}
    </>
  );
}
