import FadeInOnScroll from "./FadeInOnScroll";
import styles from "./AboutSplitSection.module.css";
import { tc } from "../lib/copy";

export default function AboutSplitSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>

          <FadeInOnScroll y={30} blur={8} delayMs={0} durationMs={700}>
            <div className={styles.left}>
              <h2 className={styles.title}>
                {tc("sobre.split.tit1")}
                <br />
                {tc("sobre.split.tit2")}
              </h2>

              <a href="/casas-lsf-madeira/" className={styles.cta}>
                {tc("sobre.split.cta")}
              </a>
            </div>
          </FadeInOnScroll>

          <FadeInOnScroll y={30} blur={8} delayMs={150} durationMs={700}>
            <div className={styles.right}>
              <p>{tc("sobre.split.texto")}</p>
            </div>
          </FadeInOnScroll>

        </div>
      </div>
    </section>
  );
}
