"use client";

import { useEffect, useState, useCallback } from "react";
import Cookies from "js-cookie";
import styles from "./CookieBanner.module.css";

// Tipos para GTM dataLayer
type DataLayerItem = Record<string, unknown>;
type GtagFunction = (...args: unknown[]) => void;

const getDataLayer = (): DataLayerItem[] => {
  if (typeof window !== "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).dataLayer = (window as any).dataLayer || [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (window as any).dataLayer;
  }
  return [];
};

const getGtag = (): GtagFunction | null => {
  if (typeof window !== "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (window as any).gtag || null;
  }
  return null;
};

type ConsentData = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
  version: string;
};

const CONSENT_VERSION = "1.0"; // Incrementar quando houver mudanças na política
const COOKIE_NAME = "cookieConsent";

// Função para atualizar o consentimento no GTM (Consent Mode v2)
function updateGTMConsent(analytics: boolean, marketing: boolean) {
  const dataLayer = getDataLayer();

  // Push consent update para o dataLayer
  dataLayer.push({
    event: "consent_update",
    consent: {
      analytics_storage: analytics ? "granted" : "denied",
      ad_storage: marketing ? "granted" : "denied",
      ad_user_data: marketing ? "granted" : "denied",
      ad_personalization: marketing ? "granted" : "denied",
      functionality_storage: "granted",
      personalization_storage: analytics ? "granted" : "denied",
      security_storage: "granted",
    },
  });

  // Atualizar via gtag se disponível
  const gtag = getGtag();
  if (gtag) {
    gtag("consent", "update", {
      analytics_storage: analytics ? "granted" : "denied",
      ad_storage: marketing ? "granted" : "denied",
      ad_user_data: marketing ? "granted" : "denied",
      ad_personalization: marketing ? "granted" : "denied",
    });
  }
}

// Função para definir consentimento default (antes do utilizador escolher)
function setDefaultConsent() {
  const dataLayer = getDataLayer();

  dataLayer.push({
    event: "consent_default",
    consent: {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      functionality_storage: "granted",
      personalization_storage: "denied",
      security_storage: "granted",
      wait_for_update: 500,
    },
  });
}

export default function CookieBanner() {
  const [open, setOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const consent = Cookies.get(COOKIE_NAME);

    if (!consent) {
      // Definir consentimento default (tudo negado)
      setDefaultConsent();
      setOpen(true);
      return;
    }

    try {
      const data: ConsentData = JSON.parse(consent);
      // Reabrir se a versão mudou (política atualizada)
      if (data.version !== CONSENT_VERSION) {
        setDefaultConsent();
        setOpen(true);
        return;
      }
      // Aplicar consentimento guardado
      updateGTMConsent(data.analytics, data.marketing);
      if (data.analytics) loadAnalytics();
      if (data.marketing) loadMarketing();
    } catch {
      setDefaultConsent();
      setOpen(true);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, mounted]);

  const loadAnalytics = useCallback(() => {
    // Push evento para GTM ativar tags de analytics
    const dataLayer = getDataLayer();
    dataLayer.push({ event: "analytics_consent_granted" });
    console.log("[Cookies] Analytics ativados");
  }, []);

  const loadMarketing = useCallback(() => {
    // Push evento para GTM ativar tags de marketing
    const dataLayer = getDataLayer();
    dataLayer.push({ event: "marketing_consent_granted" });
    console.log("[Cookies] Marketing ativados");
  }, []);

  const saveConsent = (type: "all" | "none" | "custom") => {
    const consentData: ConsentData = {
      necessary: true, // Sempre true
      analytics: type === "all" ? true : type === "custom" ? analytics : false,
      marketing: type === "all" ? true : type === "custom" ? marketing : false,
      timestamp: new Date().toISOString(),
      version: CONSENT_VERSION,
    };

    // Guardar consentimento por 180 dias (6 meses - máximo recomendado pelo RGPD)
    Cookies.set(COOKIE_NAME, JSON.stringify(consentData), {
      expires: 180,
      sameSite: "Lax",
      secure: window.location.protocol === "https:",
    });

    // Atualizar consentimento no GTM
    updateGTMConsent(consentData.analytics, consentData.marketing);

    // Carregar scripts conforme consentimento
    if (consentData.analytics) loadAnalytics();
    if (consentData.marketing) loadMarketing();

    setOpen(false);
  };

  // Função global para reabrir preferências (acessível via window)
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as Window & { openCookieSettings?: () => void }).openCookieSettings = () => {
        const consent = Cookies.get(COOKIE_NAME);
        if (consent) {
          try {
            const data: ConsentData = JSON.parse(consent);
            setAnalytics(data.analytics);
            setMarketing(data.marketing);
          } catch {
            // ignorar
          }
        }
        setShowDetails(true);
        setOpen(true);
      };
    }
  }, []);

  if (!mounted || !open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.backdrop} />

      <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="cookie-title">
        <h2 id="cookie-title" className={styles.title}>
          Utilizamos Cookies
        </h2>

        <p className={styles.description}>
          Este website utiliza cookies para melhorar a sua experiência. Os cookies necessários
          são essenciais para o funcionamento do site. Com o seu consentimento, também utilizamos
          cookies analíticos e de marketing.{" "}
          <a href="/politica-de-cookies" className={styles.link}>
            Saiba mais na nossa Política de Cookies
          </a>
        </p>

        {showDetails ? (
          <div className={styles.options}>
            <div className={styles.option}>
              <div className={styles.optionInfo}>
                <span className={styles.optionLabel}>Cookies Necessários</span>
                <span className={styles.optionNote}>
                  Essenciais para o funcionamento básico do site. Não podem ser desativados.
                </span>
              </div>
              <input
                type="checkbox"
                checked
                disabled
                className={styles.checkbox}
                aria-label="Cookies necessários (sempre ativos)"
              />
            </div>

            <div className={styles.option}>
              <div className={styles.optionInfo}>
                <span className={styles.optionLabel}>Cookies Analíticos</span>
                <span className={styles.optionNote}>
                  Permitem-nos compreender como utiliza o site para melhorar a experiência.
                </span>
              </div>
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
                className={styles.checkbox}
                aria-label="Cookies analíticos"
              />
            </div>

            <div className={styles.option}>
              <div className={styles.optionInfo}>
                <span className={styles.optionLabel}>Cookies de Marketing</span>
                <span className={styles.optionNote}>
                  Utilizados para mostrar publicidade relevante com base nos seus interesses.
                </span>
              </div>
              <input
                type="checkbox"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
                className={styles.checkbox}
                aria-label="Cookies de marketing"
              />
            </div>

            <div className={styles.buttonsDetail}>
              <button
                onClick={() => saveConsent("custom")}
                className={`${styles.btn} ${styles.btnPrimary}`}
              >
                Guardar Preferências
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.buttons}>
            <button
              onClick={() => saveConsent("all")}
              className={`${styles.btn} ${styles.btnPrimary}`}
            >
              Aceitar Todos
            </button>
            <button
              onClick={() => setShowDetails(true)}
              className={`${styles.btn} ${styles.btnOutline}`}
            >
              Personalizar
            </button>
            <button
              onClick={() => saveConsent("none")}
              className={`${styles.btn} ${styles.btnOutline}`}
            >
              Rejeitar Todos
            </button>
          </div>
        )}

        <p className={styles.legal}>
          Ao clicar em &quot;Aceitar Todos&quot;, concorda com o armazenamento de cookies no seu
          dispositivo. Pode alterar as suas preferências a qualquer momento.
        </p>
      </div>
    </div>
  );
}
