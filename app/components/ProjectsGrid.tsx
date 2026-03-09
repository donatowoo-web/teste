import FadeInOnScroll from "./FadeInOnScroll";
import styles from "./ProjectsGrid.module.css";

const projects = [
  {
    title: "Portland",
    subtitle: "Arquitetura, Design e Construção",
    meta: "V3 • 228m²",
    href: "/produto/portland-v3",
    image: "/projects/portland.webp",
  },
  {
    title: "Phoenix",
    subtitle: "Arquitetura, Design e Construção",
    meta: "V2 • 177m²",
    href: "/produto/phoenix",
    image: "/projects/phoenix.webp",
  },
  {
    title: "San Diego",
    subtitle: "Arquitetura, Design e Construção",
    meta: "V3 • 161m²",
    href: "/produto/san-diego-v3",
    image: "/projects/san-diego.webp",
  },
  {
    title: "Glasgow",
    subtitle: "Arquitetura, Design e Construção",
    meta: "V0 • 27m²",
    href: "/produto/glasgow",
    image: "/projects/glasgow.webp",
  },
];

export default function ProjectsGrid() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {projects.map((p, i) => (
            <FadeInOnScroll key={p.href} y={30} blur={8} delayMs={i * 120} durationMs={700} className={styles.cardWrapper}>
              <a
                href={p.href}
                className={styles.card}
              >
                {/* imagem de fundo */}
                <div
                  className={styles.bg}
                  style={{ backgroundImage: `url('${p.image}')` }}
                />

                {/* overlay em gradiente */}
                <div className={styles.overlay} />

                {/* conteúdo */}
                <div className={styles.content}>
                  <h3 className={styles.title}>{p.title}</h3>
                  <p className={styles.subtitle}>{p.subtitle}</p>
                  <p className={styles.meta}>{p.meta}</p>
                </div>
              </a>
            </FadeInOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
