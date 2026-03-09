"use client";

import { useEffect, useRef } from "react";
import styles from "./contactos.module.css";
import MultiStepForm from "../components/MultiStepForm";

export default function ContactosPage() {
  const formSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = formSectionRef.current;
    if (!section) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const rect = section.getBoundingClientRect();
          const windowHeight = window.innerHeight;

          // Só aplica quando a secção está visível
          if (rect.top < windowHeight && rect.bottom > 0) {
            const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
            const translateY = (1 - progress) * 60; // Move até 60px

            section.style.transform = `translateY(${translateY}px)`;
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Executar no início

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* HERO (COM IMAGEM) */}
      <section className={styles.hero}>
        <div className={styles.overlay} />

        <div className={styles.container}>
          <div className={styles.grid}>
            {/* ESQUERDA - Morada e Emails */}
            <div className={`${styles.block} ${styles.box}`}>
              <p className={styles.green}>Morada</p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Rua+Rio+15,+4475-493+Maia,+Portugal"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <h2 className={styles.huge}>
                  Rua Rio 15,
                  <br />
                  4475-493 Maia
                </h2>
              </a>

              <div className={styles.spacerLg} />

              <p className={styles.green}>Email</p>

              <p className={styles.smallGreen}>Orçamentos e Informações</p>
              <a className={styles.bigLink} href="mailto:info@evaplace.pt">
                info@evaplace.pt
              </a>

              <p className={styles.smallGreen}>Fornecedores e Compras</p>
              <a className={styles.bigLink} href="mailto:compras@evaplace.pt">
                compras@evaplace.pt
              </a>

              <p className={styles.smallGreen}>Recrutamento</p>
              <a
                className={styles.bigLink}
                href="mailto:recursoshumanos@evaplace.pt"
              >
                recursoshumanos@evaplace.pt
              </a>
            </div>

            {/* DIREITA - Contactos */}
            <div className={`${styles.block} ${styles.box}`}>
              <p className={styles.green}>Contacto</p>

              <p className={styles.smallGreen}>Central</p>
              <a className={styles.phone} href="tel:+351229610296">
                229 610 296
              </a>
              <p className={styles.note}>(Chamada para telefone fixo)</p>

              <div className={styles.spacerLg} />

              <p className={styles.smallGreen}>Assistente Comercial</p>
              <a className={styles.phone} href="tel:+351963770939">
                963 770 939
              </a>
              <p className={styles.note}>(Chamada para rede móvel)</p>

              <div className={styles.spacerLg} />

              <p className={styles.smallGreen}>Fornecedores e Compras</p>
              <a className={styles.phone} href="tel:+351961143825">
                961 143 825
              </a>
              <p className={styles.note}>(Chamada para rede móvel)</p>
            </div>
          </div>
        </div>
      </section>

      {/* FORMULÁRIO (FUNDO PRETO, SEM IMAGEM) */}
      <section ref={formSectionRef} className={styles.formSection}>
        <div className={styles.formContainer}>
          <MultiStepForm />
        </div>
      </section>
    </>
  );
}
