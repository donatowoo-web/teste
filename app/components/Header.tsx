"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";
import Modal from "./Modal";
import MultiStepForm from "./MultiStepForm";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const pathname = usePathname();
  const knownRoutes = ["/", "/blog", "/sobre-nos", "/servicos", "/faq", "/contactos", "/casas-lsf-madeira", "/construcao-em-lsf", "/construcao-em-madeira", "/clientes", "/projetos", "/projetos-eva", "/recrutamento", "/produto", "/paginas", "/inicie-o-seu-projeto", "/inicio-de-projeto", "/obrigado", "/politica-de-cookies", "/politica-de-privacidade", "/backoffice"];
  const isKnownRoute = knownRoutes.some((r) => pathname === r || (r !== "/" && pathname?.startsWith(r + "/")));
  const isBlog = pathname?.startsWith("/blog") || (!isKnownRoute && pathname !== "/");
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const navRef = useRef<HTMLElement | null>(null);

  const close = () => setOpen(false);
  const toggle = () => setOpen((v) => !v);

  // Detectar scroll
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fecha com ESC
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  // Clicar fora fecha
  useEffect(() => {
    const overlay = overlayRef.current;
    const nav = navRef.current;
    if (!overlay || !nav) return;

    const onClick = (e: MouseEvent) => {
      if (!nav.contains(e.target as Node)) setOpen(false);
    };

    overlay.addEventListener("click", onClick);
    return () => overlay.removeEventListener("click", onClick);
  }, []);

  // Bloquear scroll
  useEffect(() => {
    if (!open) return;

    const body = document.body;
    const html = document.documentElement;
    const smoothWrapper = document.getElementById("smooth-wrapper");
    const smoothContent = document.getElementById("smooth-content");

    // Guardar valores anteriores
    const prevBodyOverflow = body.style.overflow;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyPosition = body.style.position;
    const prevBodyTop = body.style.top;
    const prevBodyWidth = body.style.width;
    const scrollY = window.scrollY;

    // Bloquear scroll
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    html.style.overflow = "hidden";
    if (smoothWrapper) smoothWrapper.style.overflow = "hidden";
    if (smoothContent) {
      smoothContent.style.pointerEvents = "none";
      smoothContent.style.transform = "scale(0.95)";
      smoothContent.style.filter = "blur(4px)";
      smoothContent.style.transition = "transform 0.4s ease, filter 0.4s ease";
    }

    return () => {
      body.style.overflow = prevBodyOverflow;
      body.style.position = prevBodyPosition;
      body.style.top = prevBodyTop;
      body.style.width = prevBodyWidth;
      html.style.overflow = prevHtmlOverflow;
      if (smoothWrapper) smoothWrapper.style.overflow = "";
      if (smoothContent) {
        smoothContent.style.pointerEvents = "";
        smoothContent.style.transform = "";
        smoothContent.style.filter = "";
      }
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  return (
    <>
      <header className={`${styles.header} ${isBlog ? styles.headerBlog : ""} ${scrolled ? styles.headerScrolled : ""}`}>
        <div className={styles.container}>
          <div className={styles.grid}>
            {/* ESQUERDA (DESKTOP) */}
            <nav className={`${styles.nav} ${styles.desktopNav} ${styles.navLeft}`}>
              <a href="/sobre-nos/">Sobre Nós</a>
              <a href="/casas-lsf-madeira/">Casas</a>
              <a href="/servicos/">Serviços</a>
              <a href="/faq/">FAQ</a>
              <a href="/projetos-eva/">Projetos</a>
            </nav>

            {/* LOGO (CENTRO) */}
            <div className={styles.logo}>
              <a href="/" aria-label="Ir para a página inicial">
                <img
                  src="/header/logo.webp"
                  alt="Evaplace Casas"
                  width={160}
                  height={40}
                  className={styles.logoImg}
                />
              </a>
            </div>

            {/* DIREITA (DESKTOP) */}
            <nav className={`${styles.nav} ${styles.desktopNav} ${styles.navRight}`}>
              <a href="/blog/">Blog</a>
              <a href="/recrutamento/">Recrutamento</a>
              <a href="/contactos/">Contactos</a>
              <button onClick={() => setFormOpen(true)} className={styles.ctaBtn}>Desenvolver Projeto</button>
            </nav>

            {/* BOTÃO MOBILE */}
            <button
              type="button"
              className={`${styles.menuBtn} ${open ? styles.menuBtnOpen : ""}`}
              onClick={toggle}
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              aria-expanded={open}
            >
              <span className={`${styles.burger} ${open ? styles.burgerOpen : ""}`} />
            </button>
          </div>
        </div>
      </header>

      {/* BOTÃO MOBILE FIXO */}
      <button onClick={() => setFormOpen(true)} className={styles.ctaBtnMobile}>Desenvolver Projeto</button>

      {/* POPUP FORMULÁRIO */}
      <Modal open={formOpen} onClose={() => setFormOpen(false)}>
        <MultiStepForm />
      </Modal>

      {/* OVERLAY ESTILIZADO */}
      <div ref={overlayRef} className={`menu-overlay ${open ? "open" : ""}`}>
        {/* BOTÃO FECHAR */}
        <button
          type="button"
          className="overlay-close"
          onClick={close}
          aria-label="Fechar menu"
        >
          <span></span>
          <span></span>
        </button>

        <nav ref={navRef} className="overlay-content">
          <ul>
            <li>
              <a href="/sobre-nos/">Sobre Nós</a>
            </li>
            <li>
              <a href="/casas-lsf-madeira/">Casas</a>
            </li>
            <li>
              <a href="/servicos/">Serviços</a>
            </li>
            <li>
              <a href="/faq/">FAQ</a>
            </li>
            <li>
              <a href="/projetos-eva/">Projetos</a>
            </li>
            <li>
              <a href="/blog/">Blog</a>
            </li>
            <li>
              <a href="/recrutamento/">Recrutamento</a>
            </li>
            <li>
              <a href="/contactos/">Contactos</a>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
