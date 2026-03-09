"use client";

import { useMemo, useState } from "react";
import styles from "./MultiStepForm.module.css";

type FormData = {
  terreno: "Sim" | "Não" | "";
  concelho: string;
  area: string;
  tipologia: string;
  tipoProjeto: string;
  nome: string;
  email: string;
  contacto: string;
  privacidade: boolean;
};

const WEBHOOK = "https://hook.eu1.make.com/9rebqkacjw8djh3zsah7gft9etsu7kbk";

export default function MultiStepForm() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<FormData>({
    terreno: "",
    concelho: "",
    area: "",
    tipologia: "",
    tipoProjeto: "",
    nome: "",
    email: "",
    contacto: "",
    privacidade: false,
  });

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  // Validação de email
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // validação simples por passo
  const canGoNext = useMemo(() => {
    if (step === 1) {
      if (!form.terreno) return false;
      if (form.terreno === "Sim" && !form.concelho.trim()) return false;
      return true;
    }
    if (step === 2) {
      // aqui podes exigir campos, se quiseres
      return true;
    }
    if (step === 3) {
      if (!form.nome.trim()) return false;
      if (!form.email.trim() || !isValidEmail(form.email)) return false;
      if (!form.contacto.trim()) return false;
      if (!form.privacidade) return false;
      return true;
    }
    return false;
  }, [form, step]);

  async function submit() {
    setLoading(true);
    setError(null);

    try {
      const now = new Date();
      const pad2 = (n: number) => String(n).padStart(2, "0");
      const datePT = `${pad2(now.getDate())}/${pad2(now.getMonth() + 1)}/${now.getFullYear()}`;

      // FormData - cada campo separado (igual ao Elementor)
      const formData = new URLSearchParams();
      formData.append("Possuí Terreno?", form.terreno || "");
      formData.append("Concelho do terreno", form.concelho || "");
      formData.append("Área de construção", form.area || "");
      formData.append("Tipologia", form.tipologia || "");
      formData.append("Tipo de projeto", form.tipoProjeto || "");
      formData.append("Nome", form.nome || "");
      formData.append("Email", form.email || "");
      formData.append("Contacto", form.contacto || "");
      formData.append("Privacidade", form.privacidade ? "on" : "");
      formData.append("Date", datePT);

      const res = await fetch(WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });

      if (!res.ok) {
        throw new Error("Falha ao enviar. Tente novamente.");
      }

      window.location.href = "/obrigado";
    } catch (e: any) {
      setError(e?.message ?? "Erro ao enviar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className={styles.wrapper}>
      <div className={styles.box}>
        <h2 className={styles.title}>Vamos Falar!</h2>

        {step === 1 && (
          <>
            <label className={styles.label}>
              Possui Terreno? <span className={styles.req}>*</span>
            </label>

            <div className={styles.radio}>
              <label>
                <input
                  type="radio"
                  name="terreno"
                  checked={form.terreno === "Sim"}
                  onChange={() => update("terreno", "Sim")}
                />{" "}
                Sim
              </label>

              <label>
                <input
                  type="radio"
                  name="terreno"
                  checked={form.terreno === "Não"}
                  onChange={() => update("terreno", "Não")}
                />{" "}
                Não
              </label>
            </div>

            {form.terreno === "Sim" && (
              <div className={styles.fieldWrap}>
                <label className={styles.label}>
                  Concelho do terreno <span className={styles.req}>*</span>
                </label>
                <input
                  className={styles.input}
                  value={form.concelho}
                  onChange={(e) => update("concelho", e.target.value)}
                  placeholder="Ex: Maia"
                />
              </div>
            )}

            <div className={styles.actions} style={{ gridTemplateColumns: "1fr" }}>
              <button
                className={styles.btnNext}
                onClick={() => setStep(2)}
                disabled={!canGoNext}
              >
                Seguinte
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <label className={styles.label}>Área de construção</label>
            <div className={styles.row}>
              <input
                type="checkbox"
                checked={form.area === "Até 70 m²"}
                onChange={(e) => update("area", e.target.checked ? "Até 70 m²" : "")}
              />
              <span>Até 70 m²</span>
            </div>
            <div className={styles.row}>
              <input
                type="checkbox"
                checked={form.area === "71–100 m²"}
                onChange={(e) => update("area", e.target.checked ? "71–100 m²" : "")}
              />
              <span>71–100 m²</span>
            </div>
            <div className={styles.row}>
              <input
                type="checkbox"
                checked={form.area === "101–130 m²"}
                onChange={(e) => update("area", e.target.checked ? "101–130 m²" : "")}
              />
              <span>101–130 m²</span>
            </div>
            <div className={styles.row}>
              <input
                type="checkbox"
                checked={form.area === "131–200 m²"}
                onChange={(e) => update("area", e.target.checked ? "131–200 m²" : "")}
              />
              <span>131–200 m²</span>
            </div>
            <div className={styles.row}>
              <input
                type="checkbox"
                checked={form.area === "+200 m²"}
                onChange={(e) => update("area", e.target.checked ? "+200 m²" : "")}
              />
              <span>+200 m²</span>
            </div>

            <label className={styles.label}>Tipologia</label>
            <select
              className={styles.select}
              value={form.tipologia}
              onChange={(e) => update("tipologia", e.target.value)}
            >
              <option value="">Selecionar</option>
              <option value="T1">T1</option>
              <option value="T2">T2</option>
              <option value="T3">T3</option>
              <option value="T4+">T4+</option>
            </select>

            <label className={styles.label}>Tipo de projeto</label>
            <select
              className={styles.select}
              value={form.tipoProjeto}
              onChange={(e) => update("tipoProjeto", e.target.value)}
            >
              <option value="">Selecionar</option>
              <option value="Habitação Permanente">Habitação Permanente</option>
              <option value="Turismo">Turismo</option>
              <option value="Desenvolvimento Imobiliário">Desenvolvimento Imobiliário</option>
            </select>

            <div className={styles.actions}>
              <button className={styles.btnGhost} onClick={() => setStep(1)}>
                Anterior
              </button>
              <button className={styles.btnNext} onClick={() => setStep(3)}>
                Seguinte
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <label className={styles.label}>
              Nome <span className={styles.req}>*</span>
            </label>
            <input
              className={styles.input}
              value={form.nome}
              onChange={(e) => update("nome", e.target.value)}
            />

            <label className={styles.label}>
              Email <span className={styles.req}>*</span>
            </label>
            <input
              type="email"
              className={styles.input}
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="exemplo@email.com"
            />
            {form.email && !isValidEmail(form.email) && (
              <p style={{ color: "#ff6b6b", fontSize: "0.85rem", marginTop: "0.3rem" }}>
                Por favor insira um email válido
              </p>
            )}

            <label className={styles.label}>
              Contacto <span className={styles.req}>*</span>
            </label>
            <input
              className={styles.input}
              value={form.contacto}
              onChange={(e) => update("contacto", e.target.value)}
            />

            <label className={styles.label} style={{ marginTop: "1rem" }}>
              <input
                type="checkbox"
                checked={form.privacidade}
                onChange={(e) => update("privacidade", e.target.checked)}
              />{" "}
              Concordo com a Política de Privacidade e Cookies
            </label>

            {error && (
              <p style={{ marginTop: "0.8rem", color: "#ff6b6b" }}>{error}</p>
            )}

            <div className={styles.actions}>
              <button className={styles.btnGhost} onClick={() => setStep(2)}>
                Anterior
              </button>
              <button
                className={styles.btnNext}
                onClick={submit}
                disabled={!canGoNext || loading}
              >
                {loading ? "A enviar..." : "Enviar"}
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
