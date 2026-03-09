import styles from "./HighlightsSection.module.css";

export default function HighlightsSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          
          <div className={styles.item}>
            <span className={styles.icon}>◎</span>
            <p>Construções em todo Portugal</p>
          </div>

          <div className={styles.item}>
            <span className={styles.icon}>✎</span>
            <p>Projetos 100% Personalizáveis</p>
          </div>

          <div className={styles.item}>
            <span className={styles.icon}>♡</span>
            <p>Acompanhamento Completo</p>
          </div>

        </div>
      </div>
    </section>
  );
}
