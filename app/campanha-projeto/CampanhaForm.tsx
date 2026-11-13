"use client";

import base from "../components/MultiStepForm.module.css";
import LeadForm from "../components/LeadForm";
import { CAMPANHA_ID } from "./config";
import styles from "./campanha.module.css";

// O formulário geral do site com o aspeto desta página: caixa clara, pergunta grande ao centro.
const estilos = {
  ...base,
  wrapper: styles.formWrapper,
  box: styles.formBox,
  progress: `${base.progress} ${styles.formProgress}`,
  dot: `${base.dot} ${styles.formDot}`,
  dotActive: styles.formDotActive,
  label: `${base.label} ${styles.formLabel}`,
  labelSmall: `${base.labelSmall} ${styles.formLabelSmall}`,
  req: `${base.req} ${styles.formReq}`,
  intro: `${base.intro} ${styles.formIntro}`,
  input: `${base.input} ${styles.formInput}`,
  error: `${base.error} ${styles.formError}`,
  options: `${base.options} ${styles.formOptions}`,
  option: `${base.option} ${styles.formOption}`,
  check: `${base.check} ${styles.formCheck}`,
  actions: `${base.actions} ${styles.formActions}`,
  btnNext: `${base.btnNext} ${styles.formBtn}`,
  btnGhost: `${base.btnGhost} ${styles.formBtnGhost}`,
  success: `${base.success} ${styles.formSuccess}`,
  note: styles.formNote,
};

/** Caixa do formulário: o formulário geral com o campo "campanha" e o botão CANDIDATAR-ME. */
export default function CampanhaForm() {
  return (
    <div className={styles.cartao}>
      <LeadForm
        styles={estilos}
        formId="lead_geral"
        campanha={CAMPANHA_ID}
        textoEnviar="CANDIDATAR-ME"
        notaEnvio="CANDIDATURAS ATÉ 16 DE DEZEMBRO"
      />
    </div>
  );
}
