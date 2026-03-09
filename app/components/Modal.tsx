"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./Modal.module.css";

type Props = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  closeOnBackdrop?: boolean; // opcional
};

export default function Modal({
  open,
  onClose,
  children,
  closeOnBackdrop = true,
}: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className={styles.overlay}
      onMouseDown={closeOnBackdrop ? onClose : undefined}
    >
      <div
        className={styles.sheet}
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button className={styles.close} onClick={onClose} aria-label="Fechar">
          ✕
        </button>

        <div className={styles.content}>{children}</div>
      </div>
    </div>,
    document.body
  );
}
