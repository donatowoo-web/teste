"use client";

import { useEffect, useState } from "react";
import styles from "./LanguageSwitcher.module.css";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: any;
  }
}

export default function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState("pt");

  useEffect(() => {
    if (document.getElementById("google-translate-script")) return;

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "pt",
          includedLanguages: "en",
          autoDisplay: false,
        },
        "google_translate_hidden"
      );
    };

    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    // Esconder barra do Google
    const style = document.createElement("style");
    style.textContent = `
      .goog-te-banner-frame, .skiptranslate, #goog-gt-tt, .goog-te-balloon-frame {
        display: none !important;
      }
      body { top: 0 !important; }
    `;
    document.head.appendChild(style);
  }, []);

  const switchToEnglish = () => {
    const select = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (select) {
      select.value = "en";
      select.dispatchEvent(new Event("change"));
      setCurrentLang("en");
    }
  };

  const switchToPortuguese = () => {
    // Limpar cookie do Google Translate
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.reload();
  };

  return (
    <>
      <div id="google_translate_hidden" style={{ display: "none" }} />
      <div className={styles.wrapper}>
        <button
          className={`${styles.btn} ${currentLang === "pt" ? styles.active : ""}`}
          onClick={switchToPortuguese}
        >
          PT
        </button>
        <button
          className={`${styles.btn} ${currentLang === "en" ? styles.active : ""}`}
          onClick={switchToEnglish}
        >
          EN
        </button>
      </div>
    </>
  );
}
