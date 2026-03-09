"use client";

import styles from "./Footer.module.css";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Footer() {
  const openCookieSettings = () => {
    if (
      typeof window !== "undefined" &&
      (window as Window & { openCookieSettings?: () => void }).openCookieSettings
    ) {
      (window as Window & { openCookieSettings?: () => void }).openCookieSettings?.();
    }
  };

  return (
    <footer className={styles.footer}>
      {/* Barra de logos com link para PDF */}
      <div className={styles.logosBar}>
        <a
          href="/EVAPLACE_FichaWeb_pdf.pdf"
          target="_blank"
          rel="noreferrer"
          aria-label="Ficha Técnica Evaplace"
        >
          <img
            src="/BARRA_LOGOS-02-1024x148__.webp"
            alt="Barra de logos Evaplace"
            className={styles.logosImage}
          />
        </a>
      </div>

      {/* Divider */}
      <div className={styles.container}>
        <div className={styles.divider} />
      </div>

      {/* Conteúdo */}
      <div className={`${styles.container} ${styles.content}`}>
        <div className={styles.grid}>
          {/* Redes Sociais */}
          <div>
            <h4 className={styles.title}>Redes Sociais</h4>
            <div className={styles.socials}>
              <a href="https://instagram.com/evaplace_casas" target="_blank" rel="noreferrer">Instagram</a>
              <a href="https://www.facebook.com/evaplacecasas" target="_blank" rel="noreferrer">Facebook</a>
              <a href="https://www.tiktok.com/@evaplace_oficial" target="_blank" rel="noreferrer">TikTok</a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className={styles.title}>Links</h4>
            <ul className={styles.list}>
              <li><a href="/casas-lsf-madeira/">Casas</a></li>
              <li><a href="/recrutamento">Recrutamento</a></li>
              <li><a href="/blog">Blog</a></li>
              <li><a href="/faq">FAQ</a></li>
              <li><a href="/contactos">Contactos</a></li>
              <li><a href="https://evatinyhouse.com/" target="_blank" rel="noreferrer">Eva Tiny Houses</a></li>
            </ul>
          </div>

          {/* Políticas */}
          <div>
            <h4 className={styles.title}>Políticas</h4>
            <ul className={styles.list}>
              <li><a href="/politica-de-privacidade">Política de Privacidade</a></li>
              <li><a href="/politica-de-cookies">Política de Cookies</a></li>
              <li>
                <button onClick={openCookieSettings} className={styles.cookieButton}>
                  Gerir Cookies
                </button>
              </li>
            </ul>

            <div className={styles.bookWrapper}>
              <a
                href="https://www.livroreclamacoes.pt/inicio/"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src="/logo-reclama.png"
                  alt="Livro de Reclamações"
                  className={styles.bookImage}
                />
              </a>
            </div>
          </div>

          {/* Contactos */}
          <div>
            <h4 className={styles.title}>Contactos</h4>
            <div className={styles.textBlock}>
              <div>
                <a href="tel:229610296">229 610 296</a>
                <p className={styles.muted}>(Chamada para telefone fixo)</p>
              </div>
              <div>
                <a href="tel:351963770939">963 770 939</a>
                <p className={styles.muted}>(Chamada para rede móvel)</p>
              </div>
            </div>
          </div>

          {/* Horário */}
          <div>
            <h4 className={styles.title}>Horário de Funcionamento</h4>
            <div className={styles.textBlock}>
              <p>Seg a Sexta 9h30 às 18h30</p>
              <a
                href="https://www.google.com/maps/search/Rua+Rio+15,+4475-493+Nogueira/"
                target="_blank"
                rel="noreferrer"
              >
                Rua Rio 15, 4475-493 Nogueira,<br />Maia
              </a>

              <div>
                <p className={styles.highlight}>Alvará</p>
                <p className={styles.highlightMuted}>111572 - PAR</p>
              </div>
            </div>
          </div>

          {/* Idioma */}
          <div>
            <h4 className={styles.title}>Idioma</h4>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </footer>
  );
}
