"use client";

import { useEffect } from "react";

export default function BackofficeShell({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    document.documentElement.classList.add("lenis-stopped");
    return () => {
      document.documentElement.classList.remove("lenis-stopped");
    };
  }, []);

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');`}</style>
      <div
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
