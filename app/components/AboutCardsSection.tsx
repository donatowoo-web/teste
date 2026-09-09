import FadeInOnScroll from "./FadeInOnScroll";
import styles from "./AboutCardsSection.module.css";
import { tc } from "../lib/copy";

type Card = {
  img: string;
  title: string;
  text: string;
  link?: { href: string; label: string };
};

const cards: Card[] = [
  {
    img: "/sobre-nos/projetosfeitosamedida.webp",
    title: tc("sobre.card1.tit"),
    text: tc("sobre.card1.txt"),
  },
  {
    img: "/sobre-nos/qualidadedesdeorigem.webp",
    title: tc("sobre.card2.tit"),
    text: tc("sobre.card2.txt"),
  },
  {
    img: "/sobre-nos/servicocompleto.webp",
    title: tc("sobre.card3.tit"),
    text: tc("sobre.card3.txt"),
  },
  {
    img: "/sobre-nos/portugalcontinental.webp",
    title: tc("sobre.card4.tit"),
    text: tc("sobre.card4.txt"),
    link: { href: "/zonas-de-atuacao/", label: tc("sobre.card4.link") },
  },
];

export default function AboutCardsSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {cards.map((c, i) => {
            const offset =
              i === 1 ? styles.offsetDown : i === 2 ? styles.offsetUp : "";

            return (
              <FadeInOnScroll key={c.title} y={30} blur={8} delayMs={i * 120} durationMs={700}>
                <article className={`${styles.card} ${offset}`}>
                  <div
                    className={styles.image}
                    style={{ backgroundImage: `url('${c.img}')` }}
                    role="img"
                    aria-label={c.title}
                  />
                  <div className={styles.content}>
                    <h3 className={styles.title}>{c.title}</h3>
                    {/* Linha em branco no texto = novo parágrafo. */}
                    {c.text.split(/\n\s*\n/).map((paragrafo, p) => (
                      <p key={p} className={styles.text}>
                        {paragrafo}
                      </p>
                    ))}
                    {c.link && (
                      <a className={styles.link} href={c.link.href}>
                        {c.link.label}
                      </a>
                    )}
                  </div>
                </article>
              </FadeInOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
