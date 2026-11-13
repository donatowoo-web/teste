"use client";

import base from "../components/MultiStepForm.module.css";
import LeadForm from "../components/LeadForm";
import { CAMPANHA_ID } from "./config";
import styles from "./campanha.module.css";

// Mesmo aspeto do «Vamos Falar!», com os ajustes desta página.
const estilos = {
  ...base,
  wrapper: styles.formWrapper,
  box: `${base.box} ${styles.formBox}`,
  title: styles.formTitle,
  subtitle: styles.formSubtitle,
  progress: `${base.progress} ${styles.formProgress}`,
  input: `${base.input} ${styles.formInput}`,
  btnNext: `${base.btnNext} ${styles.formBtn}`,
  note: styles.formNote,
};

/** O formulário geral do site, com o campo "campanha" e os textos desta campanha. */
export default function CampanhaForm() {
  return (
    <LeadForm
      styles={estilos}
      formId="lead_geral"
      titulo="Faça o projeto com quem vai construir a sua casa."
      subtitulo="Se construir com a Evaplace, recupera até 100% do valor do projeto."
      campanha={CAMPANHA_ID}
      textoEnviar="CANDIDATAR-ME"
      notaEnvio="CANDIDATURAS ATÉ 16 DE DEZEMBRO"
    />
  );
}
