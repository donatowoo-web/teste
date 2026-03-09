"use client";

import { useState } from "react";
import Modal from "./Modal";
import MultiStepForm from "./MultiStepForm";

export default function MultiStepFormPopup() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          padding: "10px 14px",
          borderRadius: 12,
          border: "1px solid #222",
          background: "#222",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        Abrir formulário
      </button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <MultiStepForm />
      </Modal>
    </>
  );
}
