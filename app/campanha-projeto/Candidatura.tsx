"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./campanha.module.css";

/** Disparado pelo botão da caixa de fecho para abrir o formulário em popup. */
export const EVENTO_ABRIR = "campanha:abrir-formulario";

/**
 * Caixa do formulário. Fica no sítio dela na página; quando o botão da caixa de fecho é
 * clicado, o MESMO formulário (com o que já foi respondido) passa a popup ao centro do ecrã.
 */
export default function Candidatura({ children }: { children: ReactNode }) {
  const [aberto, setAberto] = useState(false);
  const [altura, setAltura] = useState(0);
  const caixa = useRef<HTMLDivElement>(null);

  const fechar = useCallback(() => setAberto(false), []);

  useEffect(() => {
    const abrir = () => {
      // Guarda a altura para a página não saltar quando a caixa sai do sítio.
      setAltura(caixa.current?.offsetHeight ?? 0);
      setAberto(true);
    };
    window.addEventListener(EVENTO_ABRIR, abrir);
    return () => window.removeEventListener(EVENTO_ABRIR, abrir);
  }, []);

  useEffect(() => {
    if (!aberto) return;
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") fechar();
    };
    document.addEventListener("keydown", tecla);
    const antes = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    caixa.current?.querySelector<HTMLElement>("input, [role=radio]")?.focus({ preventScroll: true });
    return () => {
      document.removeEventListener("keydown", tecla);
      document.body.style.overflow = antes;
    };
  }, [aberto, fechar]);

  return (
    <div
      id="candidatura"
      className={`${styles.candidatura} ${aberto ? styles.candidaturaAberta : ""}`}
      style={aberto ? { minHeight: altura } : undefined}
    >
      {aberto && <div className={styles.popupFundo} onClick={fechar} />}
      <div
        ref={caixa}
        className={aberto ? styles.popup : undefined}
        role={aberto ? "dialog" : undefined}
        aria-modal={aberto ? true : undefined}
        aria-label={aberto ? "Candidatura" : undefined}
        // O popup ocupa o ecrã todo (para a lista de concelhos ter espaço): clicar fora da caixa fecha.
        onClick={aberto ? (e) => e.target === e.currentTarget && fechar() : undefined}
      >
        <div className={aberto ? styles.popupCaixa : undefined}>
          {aberto && (
            <button type="button" className={styles.popupFechar} aria-label="Fechar" onClick={fechar}>
              ×
            </button>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
