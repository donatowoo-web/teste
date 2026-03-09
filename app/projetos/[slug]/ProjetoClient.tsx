"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useEffect, useState } from "react";
import { Projeto } from "../../data/projetos";
import Modal from "../../components/Modal";
import MultiStepForm from "../../components/MultiStepForm";
import styles from "./projeto.module.css";

export default function ProjetoClient({ projeto }: { projeto: Projeto }) {
  const [formOpen, setFormOpen] = useState(false);

  useLayoutEffect(() => {
    // Force scroll to top immediately before paint
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  // Desativar Lenis nesta página
  useEffect(() => {
    // Parar o Lenis adicionando classe que desativa
    document.documentElement.classList.add("lenis-stopped");
    document.documentElement.classList.remove("lenis-smooth");

    return () => {
      document.documentElement.classList.remove("lenis-stopped");
      document.documentElement.classList.add("lenis-smooth");
    };
  }, []);

  return (
    <main className={styles.main}>
      {/* Hero com imagem principal */}
      <section className={styles.hero}>
        <div className={styles.heroImage}>
          <Image
            src={projeto.imagens[0]}
            alt={projeto.titulo}
            fill
            style={{ objectFit: "cover" }}
            priority
          />
          <div className={styles.heroOverlay} />
        </div>
        <div className={styles.heroContent}>
          <Link href="/projetos-eva" className={styles.backLink}>
            ← Voltar aos projetos
          </Link>
          <h1 className={styles.heroTitle}>{projeto.titulo}</h1>
        </div>
      </section>

      {/* Informações do projeto */}
      <section className={styles.infoSection}>
        <div className={styles.container}>
          <div className={styles.infoGrid}>
            <div className={styles.description}>
              <h2 className={styles.sectionTitle}>Sobre o Projeto</h2>
              <p className={styles.descriptionText}>{projeto.descricao}</p>
            </div>
            <div className={styles.details}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Localização</span>
                <span className={styles.detailValue}>{projeto.localizacao}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Sistema Construtivo</span>
                <span className={styles.detailValue}>{projeto.sistema}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Área</span>
                <span className={styles.detailValue}>{projeto.area}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Ano</span>
                <span className={styles.detailValue}>{projeto.ano}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Finalidade</span>
                <span className={styles.detailValue}>{projeto.finalidade}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Imagens em stack */}
      <section className={styles.imagesSection}>
        <div className={styles.imagesStack}>
          {projeto.imagens.slice(1).map((img, index) => (
            <div key={img} className={styles.imageWrapper}>
              <Image
                src={img}
                alt={`${projeto.titulo} - Imagem ${index + 2}`}
                width={1920}
                height={1080}
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <h2 className={styles.ctaTitle}>Quer um projeto semelhante?</h2>
          <p className={styles.ctaText}>
            Entre em contacto connosco para discutir o seu projeto
          </p>
          <button onClick={() => setFormOpen(true)} className={styles.ctaButton}>
            Fale Connosco
          </button>
        </div>
      </section>

      <Modal open={formOpen} onClose={() => setFormOpen(false)}>
        <MultiStepForm />
      </Modal>
    </main>
  );
}
