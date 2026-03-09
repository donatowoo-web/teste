"use client";

import React from "react";

export default function WhatsAppButton() {
  const phone = "351963770939";
  const message = "Olá! Gostaria de obter mais informações.";
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  const handleClick = () => {
    // Envia evento para o GTM/GA4
    if (typeof window !== "undefined" && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: "whatsapp_click",
        event_category: "engagement",
        event_label: "WhatsApp Button",
      });
    }
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      aria-label="Enviar mensagem no WhatsApp"
      onClick={handleClick}
      style={{
        position: "fixed",
        right: 20,
        bottom: 20,
        width: 56,
        height: 56,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#25D366",
        boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
        zIndex: 9999,
        textDecoration: "none",
      }}
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="white" aria-hidden="true">
        <path d="M20.52 3.48A11.94 11.94 0 0 0 12.03 0C5.43 0 .06 5.37.06 11.97c0 2.11.55 4.17 1.6 6L0 24l6.2-1.62a11.94 11.94 0 0 0 5.83 1.49h.01c6.6 0 11.97-5.37 11.97-11.97 0-3.2-1.25-6.2-3.49-8.42zM12.03 21.9h-.01a9.93 9.93 0 0 1-5.07-1.39l-.36-.21-3.68.96.98-3.59-.23-.37A9.9 9.9 0 0 1 2.06 12C2.06 6.5 6.53 2.03 12.03 2.03c2.65 0 5.14 1.03 7.01 2.9a9.86 9.86 0 0 1 2.9 7.01c0 5.5-4.47 9.96-9.91 9.96zm5.75-7.45c-.31-.16-1.84-.91-2.13-1.01-.29-.11-.5-.16-.71.16-.21.31-.82 1.01-1 1.22-.19.21-.37.23-.68.08-.31-.16-1.31-.48-2.49-1.54-.92-.82-1.54-1.84-1.72-2.15-.19-.31-.02-.48.14-.64.14-.14.31-.37.47-.55.16-.19.21-.31.31-.52.11-.21.05-.39-.03-.55-.08-.16-.71-1.71-.98-2.34-.26-.63-.53-.55-.71-.56h-.6c-.21 0-.55.08-.84.39-.29.31-1.1 1.08-1.1 2.63s1.13 3.05 1.28 3.26c.16.21 2.23 3.41 5.4 4.78.75.32 1.34.51 1.8.65.76.24 1.45.21 2 .13.61-.09 1.84-.75 2.1-1.48.26-.73.26-1.36.18-1.48-.08-.13-.29-.21-.6-.37z" />
      </svg>
    </a>
  );
}
