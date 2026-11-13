"use client";

import { useEffect, useState, type ReactNode } from "react";
import { campanhaFechada } from "./config";

/**
 * O site é exportação estática: a troca para o agradecimento no fecho da campanha
 * faz-se aqui, no browser. Também troca se a página estiver aberta à hora do fecho.
 * Enquanto está aberta, marca o <body> para o CSS global esconder menu, rodapé do site
 * e botões flutuantes (reforço do seletor :has() em globals.css).
 */
export default function CampanhaGate({ children, fechada }: { children: ReactNode; fechada: ReactNode }) {
  const [fechou, setFechou] = useState(false);

  useEffect(() => {
    document.body.classList.add("lp-campanha");
    return () => document.body.classList.remove("lp-campanha");
  }, []);

  useEffect(() => {
    if (campanhaFechada(Date.now())) {
      setFechou(true);
      return;
    }
    // Intervalo em vez de um setTimeout até ao fecho: prazos acima de ~24 dias rebentam o setTimeout.
    const id = setInterval(() => {
      if (campanhaFechada(Date.now())) {
        setFechou(true);
        clearInterval(id);
      }
    }, 15_000);
    return () => clearInterval(id);
  }, []);

  return <>{fechou ? fechada : <div data-campanha-aberta>{children}</div>}</>;
}
