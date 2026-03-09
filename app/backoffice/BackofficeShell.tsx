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
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#0a0a0a",
        overflowY: "scroll",
        WebkitOverflowScrolling: "touch",
      }}
    >
      {children}
    </div>
  );
}
