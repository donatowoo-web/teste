"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { captureAttribution } from "../lib/attribution";

function AttributionTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Lê do URL real (caminho com barra final, como o servidor o serve)
    captureAttribution(new URLSearchParams(window.location.search), window.location.pathname);
  }, [pathname, searchParams]);

  return null;
}

export default function AttributionCapture() {
  return (
    <Suspense fallback={null}>
      <AttributionTracker />
    </Suspense>
  );
}
