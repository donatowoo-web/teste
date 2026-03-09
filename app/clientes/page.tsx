"use client";

import { useEffect, useRef, useState, useCallback, ReactNode } from "react";
import styles from "./clientes.module.css";

/* ── Typewriter title ── */
function TypewriterTitle({
  lines,
  active,
  skip,
  speed = 30,
  onDone,
}: {
  lines: string[];
  active: boolean;
  skip: boolean;
  speed?: number;
  onDone: () => void;
}) {
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [done, setDone] = useState<number[]>([]);
  const [started, setStarted] = useState(false);
  const calledDone = useRef(false);

  useEffect(() => {
    if (skip && !calledDone.current) {
      calledDone.current = true;
      setDone(lines.map((_, i) => i));
      setCurrentLine(lines.length);
      onDone();
    }
  }, [skip, lines, onDone]);

  useEffect(() => {
    if (skip || !active) {
      setStarted(false);
      return;
    }
    const timer = setTimeout(() => setStarted(true), 900);
    return () => clearTimeout(timer);
  }, [active, skip]);

  useEffect(() => {
    if (skip) return;
    if (!started || currentLine >= lines.length) {
      if (started && currentLine >= lines.length && !calledDone.current) {
        calledDone.current = true;
        onDone();
      }
      return;
    }
    const text = lines[currentLine];
    if (currentChar < text.length) {
      const s = text[currentChar] === "," || text[currentChar] === "." ? 80 : speed;
      const timer = setTimeout(() => setCurrentChar((c) => c + 1), s);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => {
      setDone((d) => [...d, currentLine]);
      setCurrentLine((l) => l + 1);
      setCurrentChar(0);
    }, 300);
    return () => clearTimeout(timer);
  }, [skip, started, currentLine, currentChar, lines, speed, onDone]);

  return (
    <div className={styles.twTitleBlock}>
      {lines.map((line, i) => {
        const isTyping = started && !skip && i === currentLine;
        const isDone = done.includes(i);
        return (
          <p key={i} className={styles.twTitle}>
            <span>{isDone ? line : isTyping ? line.slice(0, currentChar) : ""}</span>
            {isTyping && <span className={styles.cursor}>|</span>}
          </p>
        );
      })}
    </div>
  );
}

const bgImages = [
  null,
  "/projetos/casa-pacos-gaiolo/1.webp",
  "/projetos/casa-pacos-gaiolo/2.webp",
  "/projetos/casa-pacos-gaiolo/3.webp",
  "/projetos/casa-pacos-gaiolo/5-1.webp",
  "/projetos/casa-pacos-gaiolo/6.webp",
];

/* ── Section ── */
function Section({
  titleLines,
  children,
  speed,
  className,
  active,
  skip,
  bgImage,
  slideState,
  onAnimDone,
}: {
  titleLines: string[];
  children?: ReactNode;
  speed?: number;
  className?: string;
  active: boolean;
  skip: boolean;
  bgImage?: string | null;
  slideState: "active" | "past" | "next";
  onAnimDone: () => void;
}) {
  const [typeDone, setTypeDone] = useState(skip);
  const [showBody, setShowBody] = useState(skip);

  useEffect(() => {
    if (typeDone && !showBody) {
      const t = setTimeout(() => {
        setShowBody(true);
        if (!skip) setTimeout(onAnimDone, 600);
      }, skip ? 0 : 200);
      return () => clearTimeout(t);
    }
  }, [typeDone, showBody, onAnimDone, skip]);

  return (
    <section className={`${styles.section} ${className || ""}`}>
      {bgImage && (
        <div
          className={`${styles.sectionBg} ${
            slideState === "active" ? styles.sectionBgActive :
            slideState === "past" ? styles.sectionBgPast : ""
          }`}
          style={{ backgroundImage: `url(${bgImage})` }}
        />
      )}
      <div className={styles.sectionInner}>
        <TypewriterTitle
          lines={titleLines}
          active={active}
          skip={skip}
          speed={speed}
          onDone={() => setTypeDone(true)}
        />
        {children && (
          <div className={`${styles.twBody} ${showBody ? styles.twBodyVisible : ""}`}>
            {children}
          </div>
        )}
      </div>
    </section>
  );
}

/* ── Dados ── */
const sections = [
  {
    titleLines: [
      "Esta casa começou com uma decisão.",
      "E ganhou forma com tempo,",
      "cuidado e confiança.",
    ],
    className: "heroSection",
  },
  { titleLines: ["PAÇOS GAIOLO"], speed: 60, className: "nameStyle" },
  { titleLines: ["Cada dia contou. Cada passo teve intenção."] },
  { titleLines: ["Espaço para a vida acontecer,", "sem excessos, sem faltas."] },
  { titleLines: ["Uma casa que se sente,", "antes mesmo de se explicar."] },
  {
    titleLines: [
      "Esta casa está pronta para ser vivida.",
      "Para criar rotinas, memórias",
      "e silêncio quando for preciso.",
    ],
  },
];

/* ── Página — slide vertical ── */
export default function ClientesPage() {
  const [current, setCurrent] = useState(0);
  const [locked, setLocked] = useState(true);
  const [visited, setVisited] = useState<Set<number>>(new Set([0]));
  const isScrolling = useRef(false);
  const total = sections.length;

  const goTo = useCallback(
    (index: number) => {
      if (index < 0 || index >= total || isScrolling.current) return;
      isScrolling.current = true;
      const alreadyVisited = visited.has(index);
      setCurrent(index);
      setVisited((prev) => new Set(prev).add(index));

      if (alreadyVisited) {
        // Secção já visitada — não bloquear, só esperar transição
        setLocked(true);
        setTimeout(() => {
          setLocked(false);
          isScrolling.current = false;
        }, 1000);
      } else {
        setLocked(true);
        setTimeout(() => {
          isScrolling.current = false;
        }, 800);
      }
    },
    [total, visited]
  );

  const handleAnimDone = useCallback(() => {
    setLocked(false);
  }, []);

  // Scroll wheel → muda de slide
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (locked || isScrolling.current) return;
      goTo(current + (e.deltaY > 0 ? 1 : -1));
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [locked, current, goTo]);

  // Touch swipe
  useEffect(() => {
    let startY = 0;
    const onStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };
    const onMove = (e: TouchEvent) => {
      e.preventDefault();
    };
    const onEnd = (e: TouchEvent) => {
      if (locked || isScrolling.current) return;
      const diff = startY - e.changedTouches[0].clientY;
      if (Math.abs(diff) > 50) {
        goTo(current + (diff > 0 ? 1 : -1));
      }
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
    };
  }, [locked, current, goTo]);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (locked || isScrolling.current) return;
      if (e.key === "ArrowDown" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        goTo(current + 1);
      }
      if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        goTo(current - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [locked, current, goTo]);

  const bodyContent = (i: number) => {
    switch (i) {
      case 0:
        return (
          <>
            <p className={styles.subText}>
              Hoje, está pronta! Não como um fim, mas como um começo.
            </p>
            <div className={styles.scrollHintInline}>
              <div className={styles.mouse}>
                <div className={styles.wheel} />
              </div>
            </div>
          </>
        );
      case 1:
        return (
          <p className={styles.subText}>
            Um lugar escolhido para viver,
            <br />
            parar e regressar.
          </p>
        );
      case 2:
        return (
          <div className={styles.details}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Início da construção:</span>
              <span className={styles.detailValue}>xx/xx/xxxx</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Conclusão:</span>
              <span className={styles.detailValue}>xx/xx/xxxx</span>
            </div>
          </div>
        );
      case 3:
        return (
          <div className={styles.details}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Área total:</span>
              <span className={styles.detailValue}>____ m²</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Número de pisos:</span>
              <span className={styles.detailValue}>____</span>
            </div>
          </div>
        );
      case 4:
        return (
          <div className={styles.details}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Isolamento:</span>
              <span className={styles.detailValue}>____</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Eficiência energética:</span>
              <span className={styles.detailValue}>____</span>
            </div>
          </div>
        );
      case 5:
        return (
          <>
            <p className={styles.welcomeText}>Bem-vindo(a) a casa.</p>
            <div className={styles.signature}>
              <p>Construída por Evaplace</p>
              <p>Com respeito, cuidado</p>
              <p>e tempo.</p>
            </div>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.shareLink}
            >
              <img src="/instagram.png" alt="Instagram" className={styles.shareIcon} />
              <span>Partilhe no Instagram</span>
            </a>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.slider}>
      {sections.map((sec, i) => {
        let state = "";
        if (i < current) state = styles.slidePast;
        else if (i === current) state = styles.slideActive;
        else state = styles.slideNext;

        return (
          <div key={i} className={`${styles.slide} ${state}`} style={{ zIndex: i }}>
            <Section
              titleLines={sec.titleLines}
              speed={sec.speed}
              className={sec.className ? styles[sec.className as keyof typeof styles] : undefined}
              active={current === i}
              skip={visited.has(i) && current !== i}
              bgImage={bgImages[i]}
              slideState={i < current ? "past" : i === current ? "active" : "next"}
              onAnimDone={handleAnimDone}
            >
              {bodyContent(i)}
            </Section>
          </div>
        );
      })}
    </div>
  );
}
