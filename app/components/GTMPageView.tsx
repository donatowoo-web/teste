"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, Suspense } from "react";

function GTMPageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstLoad = useRef(true);

  useEffect(() => {
    // Ignorar o primeiro carregamento (GTM já dispara)
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }

    if (pathname) {
      // Enviar pageview para o dataLayer apenas em navegações
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dataLayer = (window as any).dataLayer || [];

      dataLayer.push({
        event: "page_view",
        page_path: pathname,
        page_search: searchParams?.toString() || "",
        page_url: window.location.href,
        page_title: document.title,
      });
    }
  }, [pathname, searchParams]);

  return null;
}

export default function GTMPageView() {
  return (
    <Suspense fallback={null}>
      <GTMPageViewTracker />
    </Suspense>
  );
}
