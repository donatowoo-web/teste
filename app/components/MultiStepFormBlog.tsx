"use client";

import s from "./MultiStepFormBlog.module.css";
import LeadForm from "./LeadForm";
import { LEAD_CONFIG } from "../lib/leadQualificacao";

/** Mesmo formulário geral, com o visual claro dos artigos do blog. */
export default function MultiStepFormBlog() {
  return <LeadForm styles={s} formId="lead_blog" titulo={LEAD_CONFIG.textos.tituloBlog} />;
}
