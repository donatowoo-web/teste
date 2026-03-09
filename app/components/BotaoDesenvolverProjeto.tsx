"use client";

import { useState } from "react";
import Modal from "./Modal";
import MultiStepForm from "./MultiStepForm";

export default function BotaoDesenvolverProjeto() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          width: "50%",
          height: 48,
          borderRadius: 0,
          border: "1px solid rgba(255,255,255,0.14)",
          background: "rgba(255,255,255,0.08)",
          color: "#fff",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        Desenvolver Projeto
      </button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <MultiStepForm />
      </Modal>
    </>
  );
}
