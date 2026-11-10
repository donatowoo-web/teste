"use client";

import styles from "./MultiStepForm.module.css";
import LeadForm from "./LeadForm";
import { LEAD_CONFIG } from "../lib/leadQualificacao";

/** Formulário geral (popup "Desenvolver Projeto" e páginas). A lógica está em LeadForm. */
export default function MultiStepForm() {
  return <LeadForm styles={styles} formId="lead_geral" titulo={LEAD_CONFIG.textos.tituloGeral} />;
}
