"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { captureAttribution, persistPendingAttribution } from "../lib/attribution";

function AttributionTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Lê do URL real (caminho com barra final, como o servidor o serve)
    captureAttribution(new URLSearchParams(window.location.search), window.location.pathname);
  }, [pathname, searchParams]);

  useEffect(() => {
    // Se a pessoa aceitar os cookies depois de aterrar, grava antes de sair da página,
    // para o gclid/UTMs não se perderem ao mudar de página.
    window.addEventListener("pagehide", persistPendingAttribution);
    return () => window.removeEventListener("pagehide", persistPendingAttribution);
  }, []);

  return null;
}

export default function AttributionCapture() {
  return (
    <Suspense fallback={null}>
      <AttributionTracker />
    </Suspense>
  );
}
