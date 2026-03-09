"use client";

import { useEffect } from "react";

export default function BackofficeShell({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Load Poppins font
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    // Force Poppins on all backoffice elements
    const style = document.createElement("style");
    style.textContent = `
      [data-backoffice] * {
        font-family: 'Poppins', system-ui, sans-serif !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div
      data-backoffice
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
  );
}
