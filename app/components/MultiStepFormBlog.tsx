"use client";

import { useMemo, useState } from "react";
import s from "./MultiStepFormBlog.module.css";

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

export default function MultiStepFormBlog() {
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

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const canGoNext = useMemo(() => {
    if (step === 1) {
      if (!form.terreno) return false;
      if (form.terreno === "Sim" && !form.concelho.trim()) return false;
      return true;
    }
    if (step === 2) return true;
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

      if (!res.ok) throw new Error("Falha ao enviar. Tente novamente.");
      window.location.href = "/obrigado";
    } catch (e: any) {
      setError(e?.message ?? "Erro ao enviar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className={s.wrapper}>
      <div className={s.box}>
        <h2 className={s.title}>Interessado? Fale connosco!</h2>

        {/* Progress */}
        <div className={s.progress}>
          <div className={`${s.dot} ${step >= 1 ? s.dotActive : ""}`} />
          <div className={`${s.dot} ${step >= 2 ? s.dotActive : ""}`} />
          <div className={`${s.dot} ${step >= 3 ? s.dotActive : ""}`} />
        </div>

        {step === 1 && (
          <>
            <label className={s.label}>
              Possui Terreno? <span className={s.req}>*</span>
            </label>
            <div className={s.radio}>
              <label>
                <input type="radio" name="terreno-blog" checked={form.terreno === "Sim"} onChange={() => update("terreno", "Sim")} /> Sim
              </label>
              <label>
                <input type="radio" name="terreno-blog" checked={form.terreno === "Não"} onChange={() => update("terreno", "Não")} /> Não
              </label>
            </div>
            {form.terreno === "Sim" && (
              <>
                <label className={s.label}>Concelho do terreno <span className={s.req}>*</span></label>
                <input className={s.input} value={form.concelho} onChange={(e) => update("concelho", e.target.value)} placeholder="Ex: Maia" />
              </>
            )}
            <div className={s.actions} style={{ gridTemplateColumns: "1fr" }}>
              <button className={s.btnNext} onClick={() => setStep(2)} disabled={!canGoNext}>Seguinte</button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <label className={s.label}>Área de construção</label>
            {["Até 70 m²", "71–100 m²", "101–130 m²", "131–200 m²", "+200 m²"].map((v) => (
              <div className={s.row} key={v}>
                <input type="checkbox" checked={form.area === v} onChange={(e) => update("area", e.target.checked ? v : "")} />
                <span>{v}</span>
              </div>
            ))}

            <label className={s.label}>Tipologia</label>
            <select className={s.select} value={form.tipologia} onChange={(e) => update("tipologia", e.target.value)}>
              <option value="">Selecionar</option>
              <option value="T1">T1</option>
              <option value="T2">T2</option>
              <option value="T3">T3</option>
              <option value="T4+">T4+</option>
            </select>

            <label className={s.label}>Tipo de projeto</label>
            <select className={s.select} value={form.tipoProjeto} onChange={(e) => update("tipoProjeto", e.target.value)}>
              <option value="">Selecionar</option>
              <option value="Habitação Permanente">Habitação Permanente</option>
              <option value="Turismo">Turismo</option>
              <option value="Desenvolvimento Imobiliário">Desenvolvimento Imobiliário</option>
            </select>

            <div className={s.actions}>
              <button className={s.btnGhost} onClick={() => setStep(1)}>Anterior</button>
              <button className={s.btnNext} onClick={() => setStep(3)}>Seguinte</button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <label className={s.label}>Nome <span className={s.req}>*</span></label>
            <input className={s.input} value={form.nome} onChange={(e) => update("nome", e.target.value)} />

            <label className={s.label}>Email <span className={s.req}>*</span></label>
            <input type="email" className={s.input} value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="exemplo@email.com" />
            {form.email && !isValidEmail(form.email) && (
              <p className={s.error}>Por favor insira um email válido</p>
            )}

            <label className={s.label}>Contacto <span className={s.req}>*</span></label>
            <input className={s.input} value={form.contacto} onChange={(e) => update("contacto", e.target.value)} />

            <label className={s.label} style={{ marginTop: "1rem" }}>
              <input type="checkbox" checked={form.privacidade} onChange={(e) => update("privacidade", e.target.checked)} />{" "}
              Concordo com a Pol&iacute;tica de Privacidade e Cookies
            </label>

            {error && <p className={s.error}>{error}</p>}

            <div className={s.actions}>
              <button className={s.btnGhost} onClick={() => setStep(2)}>Anterior</button>
              <button className={s.btnNext} onClick={submit} disabled={!canGoNext || loading}>
                {loading ? "A enviar..." : "Enviar"}
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
