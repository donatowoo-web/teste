import FadeInOnScroll from "./FadeInOnScroll";
import styles from "./AboutSplitSection.module.css";

export default function AboutSplitSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>

          <FadeInOnScroll y={30} blur={8} delayMs={0} durationMs={700}>
            <div className={styles.left}>
              <h2 className={styles.title}>
                A Transformar a
                <br />
                Construção
              </h2>

              <a href="/casas-lsf-madeira/" className={styles.cta}>
                Ver todas as casas
              </a>
            </div>
          </FadeInOnScroll>

          <FadeInOnScroll y={30} blur={8} delayMs={150} durationMs={700}>
            <div className={styles.right}>
              <p>
                A Evaplace nasceu com a missão de transformar o mercado da
                construção, apostando no aço leve e na madeira para criar casas
                mais rápidas, eficientes e com qualidade superior. Acreditamos que
                a inovação é o caminho para construir melhor, com precisão,
                responsabilidade, eficiência e um verdadeiro compromisso com o
                futuro.
              </p>
            </div>
          </FadeInOnScroll>

        </div>
      </div>
    </section>
  );
}
