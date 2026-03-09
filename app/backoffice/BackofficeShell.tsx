"use client";

import { useEffect, useRef } from "react";

export default function BackofficeShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const shellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Stop Lenis
    document.documentElement.classList.add("lenis-stopped");
    document.documentElement.classList.remove("lenis-smooth");
    document.documentElement.classList.remove("lenis-scrolling");

    // Hide html/body scroll
    const html = document.documentElement;
    const body = document.body;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    // Force native wheel scroll on the backoffice container
    const el = shellRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.stopPropagation();
      el.scrollTop += e.deltaY;
    };

    el.addEventListener("wheel", onWheel, { passive: true });

    return () => {
      el.removeEventListener("wheel", onWheel);
      document.documentElement.classList.remove("lenis-stopped");
      html.style.overflow = "";
      body.style.overflow = "";
    };
  }, []);

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');`}</style>
      <div
        ref={shellRef}
        data-lenis-prevent
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          background: "#f5f5f5",
          overflowY: "auto",
          fontFamily: "'Poppins', system-ui, sans-serif",
        }}
      >
        {children}
      </div>
    </>
  );
}
