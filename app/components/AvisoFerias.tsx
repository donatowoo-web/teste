"use client";

import { useEffect, useState, useCallback } from "react";
import Cookies from "js-cookie";
import styles from "./AvisoFerias.module.css";

/* ============================================================================
   CONFIGURAÇÃO DO AVISO

   Para reutilizar noutro período (Natal, Páscoa, ponte), muda estas três
   constantes e o texto no fim do ficheiro. Mais nada.

   Muda também o nome do cookie — senão quem já fechou o aviso anterior nunca
   chega a ver o novo.
   ============================================================================ */
const INICIO = "2026-08-14"; // primeiro dia em que aparece
const FIM = "2026-09-01"; // deixa de aparecer neste dia
const COOKIE = "avisoFerias2026";

/* ------------------------------------------------------------------------- */

// Cookie que o CookieBanner grava assim que o visitante responde ao RGPD.
// Só o lemos; o componente do consentimento não é tocado.
const COOKIE_CONSENTIMENTO = "cookieConsent";

// Espera entre o consentimento e a abertura, para o banner de cookies sair
// do ecrã antes de este entrar.
const ATRASO_MS = 600;

// De quanto em quanto tempo verificamos se já houve consentimento.
const INTERVALO_MS = 500;

// Ao fim disto desistimos. Quem ignorou o banner de cookies já está a ler a
// página, e não leva com um popup a saltar-lhe à cara a meio da leitura.
const DESISTIR_MS = 90_000;

function dentroDoPeriodo(agora: Date): boolean {
  return (
    agora >= new Date(`${INICIO}T00:00:00`) &&
    agora < new Date(`${FIM}T00:00:00`)
  );
}

export default function AvisoFerias() {
  const [aberto, setAberto] = useState(false);

  const fechar = useCallback(() => {
    // Fechar de qualquer maneira — botão, ✕, Escape ou clique no fundo —
    // conta como visto.
    Cookies.set(COOKIE, "1", {
      expires: new Date(`${FIM}T00:00:00`),
      sameSite: "Lax",
      secure: window.location.protocol === "https:",
    });
    setAberto(false);
  }, []);

  useEffect(() => {
    if (!dentroDoPeriodo(new Date())) return;
    if (Cookies.get(COOKIE)) return;

    let abertura: ReturnType<typeof setTimeout> | undefined;
    let vigia: ReturnType<typeof setInterval> | undefined;
    let desistencia: ReturnType<typeof setTimeout> | undefined;

    const abrirComAtraso = () => {
      abertura = setTimeout(() => setAberto(true), ATRASO_MS);
    };

    if (Cookies.get(COOKIE_CONSENTIMENTO)) {
      abrirComAtraso();
    } else {
      vigia = setInterval(() => {
        if (Cookies.get(COOKIE_CONSENTIMENTO)) {
          clearInterval(vigia);
          clearTimeout(desistencia);
          abrirComAtraso();
        }
      }, INTERVALO_MS);

      desistencia = setTimeout(() => clearInterval(vigia), DESISTIR_MS);
    }

    return () => {
      clearTimeout(abertura);
      clearInterval(vigia);
      clearTimeout(desistencia);
    };
  }, []);

  // Enquanto está aberto: Escape fecha e o fundo não faz scroll.
  useEffect(() => {
    if (!aberto) return;

    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") fechar();
    };
    document.addEventListener("keydown", aoTeclar);

    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", aoTeclar);
      document.body.style.overflow = overflowAnterior;
    };
  }, [aberto, fechar]);

  if (!aberto) return null;

  return (
    <div className={styles.overlay} onMouseDown={fechar}>
      <div className={styles.backdrop} />

      <div
        className={styles.modal}
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="aviso-ferias-titulo"
      >
        <button className={styles.fechar} onClick={fechar} aria-label="Fechar">
          ✕
        </button>

        <h2 id="aviso-ferias-titulo" className={styles.titulo}>
          Vamos estar de férias
        </h2>

        <p className={styles.texto}>
          De 17 a 31 de agosto. Regressamos a 1 de setembro.
        </p>

        <button className={styles.btn} onClick={fechar}>
          Compreendi
        </button>
      </div>
    </div>
  );
}
