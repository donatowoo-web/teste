"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;

  /** tag HTML (div, section, etc). string para evitar JSX namespace */
  as?: keyof HTMLElementTagNameMap;

  once?: boolean;
  amount?: number; // 0..1
  y?: number; // px
  blur?: number; // px
  durationMs?: number;
  delayMs?: number;

  /** começa a animar antes de entrar (recomendado p/ mobile) */
  rootMargin?: string;

  /** se quiser visível logo de início */
  initiallyVisible?: boolean;
};

export default function FadeInOnScroll({
  children,
  className,
  as = "div",
  once = true,
  amount = 0.18,
  y = 12,
  blur = 6,
  durationMs = 350,
  delayMs = 0,
  rootMargin = "0px 0px -12% 0px",
  initiallyVisible = false,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(initiallyVisible);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false
    );
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion) {
      setVisible(true);
      return;
    }

    const t = Math.max(0, Math.min(1, amount));

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) obs.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      {
        root: null,
        threshold: t,
        rootMargin,
      }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [amount, once, rootMargin, prefersReducedMotion]);

  const style: React.CSSProperties = prefersReducedMotion
    ? {}
    : {
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translate3d(0,0,0)"
          : `translate3d(0,${y}px,0)`,
        filter: visible ? "blur(0px)" : `blur(${blur}px)`,
        transitionProperty: "opacity, transform, filter",
        transitionDuration: `${durationMs}ms`,
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        transitionDelay: `${delayMs}ms`,
        willChange: "opacity, transform, filter",
        backfaceVisibility: "hidden",
      };

  const Tag = as as any;

  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  );
}
