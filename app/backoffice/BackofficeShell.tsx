"use client";

import { useEffect } from "react";

export default function BackofficeShell({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Kill Lenis completely on backoffice
    document.documentElement.classList.add("lenis-stopped");
    document.documentElement.classList.remove("lenis-smooth");
    document.documentElement.classList.remove("lenis-scrolling");

    // Force html/body to allow scroll
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    return () => {
      document.documentElement.classList.remove("lenis-stopped");
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
    };
  }, []);

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');`}</style>
      <div
        data-lenis-prevent
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          background: "#f5f5f5",
          overflowY: "scroll",
          WebkitOverflowScrolling: "touch",
          fontFamily: "'Poppins', system-ui, sans-serif",
        }}
      >
        {children}
      </div>
    </>
  );
}
