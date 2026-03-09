"use client";

import { useEffect } from "react";

export default function HideShell() {
  useEffect(() => {
    document.body.classList.add("hide-shell");
    return () => document.body.classList.remove("hide-shell");
  }, []);
  return null;
}
