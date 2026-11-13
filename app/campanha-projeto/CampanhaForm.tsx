"use client";

import { useEffect, useRef } from "react";
import base from "../components/MultiStepForm.module.css";
import LeadForm from "../components/LeadForm";
import { CAMPANHA_ID } from "./config";
import styles from "./campanha.module.css";

const PRAZO = "CANDIDATURAS ATÉ 16 DE DEZEMBRO";

// O formulário geral do site com o aspeto desta página (mais compacto, para caber ao lado).
const estilos = {
  ...base,
  wrapper: styles.formWrapper,
  box: styles.formBox,
  progress: `${base.progress} ${styles.formProgress}`,
  label: `${base.label} ${styles.formLabel}`,
  intro: `${base.intro} ${styles.formIntro}`,
  input: `${base.input} ${styles.formInput}`,
  error: `${base.error} ${styles.formError}`,
  options: `${base.options} ${styles.formOptions}`,
  option: `${base.option} ${styles.formOption}`,
  check: `${base.check} ${styles.formCheck}`,
  actions: `${base.actions} ${styles.formActions}`,
  btnNext: `${base.btnNext} ${styles.formBtn}`,
  btnGhost: `${base.btnGhost} ${styles.formBtnGhost}`,
  note: styles.formNote,
};

/**
 * Caixa do formulário: faixa do prazo + formulário geral com o campo "campanha".
 * No desktop fica fixa ao lado. Normalmente não corta nada (a lista de concelhos abre por
 * cima da página); só quando um passo é mais alto do que o ecrã é que a caixa passa a ter
 * scroll interno. Nesse caso leva data-lenis-prevent, para a roda do rato rolar a caixa.
 */
export default function CampanhaForm() {
  const caixa = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = caixa.current;
    const conteudo = el?.firstElementChild as HTMLElement | null;
    if (!el || !conteudo || typeof ResizeObserver === "undefined") return;
    const desktop = window.matchMedia("(min-width: 1024px)");
    const medir = () => {
      // 32 px = 1rem de folga em cima e em baixo (o mesmo do sticky)
      const naoCabe = desktop.matches && conteudo.offsetHeight + 2 > window.innerHeight - 32;
      el.classList.toggle(styles.cartaoScroll, naoCabe);
      if (naoCabe) el.setAttribute("data-lenis-prevent", "");
      else el.removeAttribute("data-lenis-prevent");
    };
    const obs = new ResizeObserver(medir);
    obs.observe(conteudo);
    window.addEventListener("resize", medir);
    medir();
    return () => {
      obs.disconnect();
      window.removeEventListener("resize", medir);
    };
  }, []);

  return (
    <div className={styles.cartao} ref={caixa}>
      <div>
        <p className={styles.prazo}>{PRAZO}</p>
        <LeadForm
          styles={estilos}
          formId="lead_geral"
          campanha={CAMPANHA_ID}
          textoEnviar="CANDIDATAR-ME"
          notaEnvio={PRAZO}
        />
      </div>
    </div>
  );
}
