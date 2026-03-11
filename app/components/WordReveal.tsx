"use client";

import { useEffect, useRef, useState } from "react";

export default function WordReveal({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Start revealing when element enters viewport, finish when center
      const start = vh * 1.0;
      const end = vh * 0.3;
      const raw = (start - rect.top) / (start - end);
      setProgress(Math.max(0, Math.min(1, raw)));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const words = text.split(" ");

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => {
        const wordProgress = i / words.length;
        const opacity = progress > wordProgress ? 1 : 0.15;

        return (
          <span
            key={i}
            style={{
              opacity,
              transition: "opacity 0.15s ease-out",
              display: "inline",
            }}
          >
            {word}{i < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </p>
  );
}
