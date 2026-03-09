"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll() {
  useEffect(() => {
    // Skip Lenis entirely on backoffice
    if (window.location.pathname.startsWith("/backoffice")) return;

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

    createLenis();
    document.documentElement.classList.add("lenis");

    return () => {
      destroyLenis();
      document.documentElement.classList.remove("lenis");
    };
  }, []);

  return null;
}
