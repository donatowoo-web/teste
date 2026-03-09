import styles from "./MethodsSection.module.css";

export default function MethodsSection() {
  return (
    <section className={styles.section}>
      {/* VÍDEO DE FUNDO */}
      <video
        className={styles.video}
        src="/video/metodos.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />

      {/* OVERLAY */}
      <div className={styles.overlay} />

      {/* CONTEÚDO */}
      <div className={styles.inner}>
        <div className={styles.container}>
          <div className={styles.grid}>
            {/* ESQUERDA */}
            <div>
              <h2 className={styles.title}>
                Métodos de<br />
                construção
              </h2>

              <a href="/construcao-em-lsf/" className={styles.cta}>
                Saber Mais
              </a>
            </div>

            {/* DIREITA */}
            <div className={styles.text}>
              <p>
                Construímos{" "}
                <strong className={styles.strong}>casas em madeira</strong> e em{" "}
                <strong className={styles.strong}>LSF (Light Steel Frame)</strong>, duas
                soluções que respondem a diferentes necessidades e estilos de vida.
              </p>

              <p className={styles.paragraph}>
                O sistema em <strong className={styles.strong}>aço leve</strong> garante uma
                estrutura resistente, duradoura e com design moderno. Já a{" "}
                <strong className={styles.strong}>construção em madeira</strong> valoriza a
                beleza natural do material, criando habitações mais quentes, acolhedoras e
                sustentáveis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
