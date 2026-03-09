"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll() {
  useEffect(() => {
    let lenis: Lenis | null = null;
    let rafId: number;

    function createLenis() {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        touchMultiplier: 2,
        infinite: false,
      });

      function raf(time: number) {
        lenis?.raf(time);
        rafId = requestAnimationFrame(raf);
      }

      rafId = requestAnimationFrame(raf);
    }

    function destroyLenis() {
      if (rafId) cancelAnimationFrame(rafId);
      if (lenis) {
        lenis.destroy();
        lenis = null;
      }
    }

    // Verificar estado inicial
    const isStopped = document.documentElement.classList.contains("lenis-stopped");
    if (!isStopped) {
      createLenis();
    }

    // Adicionar classe ao html
    document.documentElement.classList.add("lenis");

    // Observar mudanças na classe para destruir/recriar Lenis
    const observer = new MutationObserver(() => {
      const shouldStop = document.documentElement.classList.contains("lenis-stopped");
      if (shouldStop && lenis) {
        destroyLenis();
      } else if (!shouldStop && !lenis) {
        createLenis();
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
      destroyLenis();
      document.documentElement.classList.remove("lenis");
    };
  }, []);

  return null;
}
