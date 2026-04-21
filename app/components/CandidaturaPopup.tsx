"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./CandidaturaPopup.module.css";

type Props = {
  jobTitle: string;
};

const WEBHOOK = "https://hook.eu1.make.com/d895wnow1v8kbmnqs7ihcn372xoo7axz/";

export default function CandidaturaPopup({ jobTitle }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    mensagem: "",
    privacidade: false,
  });

  // Bloquear scroll
  useEffect(() => {
    if (!open) return;

    const scrollY = window.scrollY;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.documentElement.style.overflow = "";
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  // Fechar com ESC
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) close();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileName(file ? file.name : null);
  };

  // Validação de email
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar email antes de enviar
    if (!isValidEmail(form.email)) {
      setError("Por favor insira um email válido.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const now = new Date();
      const pad2 = (n: number) => String(n).padStart(2, "0");
      const datePT = `${pad2(now.getDate())}/${pad2(now.getMonth() + 1)}/${now.getFullYear()}`;

      const formData = new FormData();
      formData.append("Nome", form.nome);
      formData.append("Email", form.email);
      formData.append("Telefone", form.telefone);
      formData.append("Mensagem", form.mensagem);
      formData.append("Vaga", jobTitle);
      formData.append("Tipo", "candidatura");
      formData.append("Privacidade", form.privacidade ? "on" : "");
      formData.append("Date", datePT);

      const file = fileRef.current?.files?.[0];
      if (file) {
        formData.append("Curriculo", file);
      }

      const res = await fetch(WEBHOOK, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Erro ao enviar");

      setSuccess(true);
    } catch {
      setError("Erro ao enviar. Tenta novamente.");
    } finally {
      setLoading(false);
    }
  };

  const close = () => {
    setOpen(false);
    setSuccess(false);
    setError(null);
    setFileName(null);
    setForm({ nome: "", email: "", telefone: "", mensagem: "", privacidade: false });
    if (fileRef.current) fileRef.current.value = "";
  };

  if (!open) {
    return (
      <button className={styles.applyButton} onClick={() => setOpen(true)}>
        Candidatar-me
      </button>
    );
  }

  return (
    <>
      <button className={styles.applyButton} onClick={() => setOpen(true)}>
        Candidatar-me
      </button>

      <div className={styles.overlay} onClick={close}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <button className={styles.closeBtn} onClick={close} aria-label="Fechar">
            <span></span>
            <span></span>
          </button>

          <div className={styles.content}>
            {success ? (
              <div className={styles.success}>
                <div className={styles.successIcon}>✓</div>
                <h2>Candidatura Enviada!</h2>
                <p>Entraremos em contacto brevemente.</p>
                <button className={styles.closeButton} onClick={close}>
                  Fechar
                </button>
              </div>
            ) : (
              <>
                <h2 className={styles.title}>Candidatura: {jobTitle}</h2>
                <p className={styles.subtitle}>
                  Preenche os dados abaixo e anexa o teu CV.
                </p>

                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.field}>
                    <label>Nome completo *</label>
                    <input
                      type="text"
                      required
                      value={form.nome}
                      onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    />
                  </div>

                  <div className={styles.field}>
                    <label>Email *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="exemplo@email.com"
                    />
                    {form.email && !isValidEmail(form.email) && (
                      <p style={{ color: "#ff6b6b", fontSize: "0.85rem", marginTop: "0.3rem" }}>
                        Por favor insira um email válido
                      </p>
                    )}
                  </div>

                  <div className={styles.field}>
                    <label>Telefone *</label>
                    <input
                      type="tel"
                      required
                      value={form.telefone}
                      onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                    />
                  </div>

                  <div className={styles.field}>
                    <label>Currículo (PDF, DOC, DOCX)</label>
                    <input
                      type="file"
                      ref={fileRef}
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className={styles.fileInput}
                      id="cv-upload"
                    />
                    <label htmlFor="cv-upload" className={styles.fileLabel}>
                      📎 {fileName ? "Alterar ficheiro" : "Anexar CV"}
                    </label>
                    {fileName && <p className={styles.fileName}>✓ {fileName}</p>}
                  </div>

                  <div className={styles.field}>
                    <label>Mensagem / Apresentação</label>
                    <textarea
                      rows={4}
                      value={form.mensagem}
                      onChange={(e) => setForm({ ...form, mensagem: e.target.value })}
                      placeholder="Fala-nos um pouco sobre ti..."
                    />
                  </div>

                  <div className={styles.checkbox}>
                    <input
                      type="checkbox"
                      id="privacidade-check"
                      required
                      checked={form.privacidade}
                      onChange={(e) => setForm({ ...form, privacidade: e.target.checked })}
                    />
                    <label htmlFor="privacidade-check">
                      Concordo com a Política de Privacidade
                    </label>
                  </div>

                  {error && <p className={styles.error}>{error}</p>}

                  <button type="submit" className={styles.submitBtn} disabled={loading}>
                    {loading ? "A enviar..." : "Enviar Candidatura"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
