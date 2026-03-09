import FadeInOnScroll from "./FadeInOnScroll";
import styles from "./AboutCardsSection.module.css";

const cards = [
  {
    img: "/sobre-nos/projetosfeitosamedida.webp",
    title: "Projetos feitos à sua medida",
    text:
      "Todos os projetos são totalmente personalizáveis, da planta aos acabamentos. Adaptamos cada detalhe ao seu gosto e às necessidades da sua família. Se pretende algo único, criamos um projeto novo feito à sua medida, desenvolvido de raiz para transformar a sua ideia na realidade.",
  },
  {
    img: "/sobre-nos/qualidadedesdeorigem.webp",
    title: "Qualidade desde a origem",
    text:
      "Criamos espaços modernos e esteticamente marcantes, sempre com acabamentos de excelência e um isolamento superior que garante conforto e eficiência. Fabricamos as estruturas em aço leve e madeira diretamente na nossa fábrica, garantindo precisão e qualidade desde a origem.",
  },
  {
    img: "/sobre-nos/servicocompleto.webp",
    title: "Acompanhamento completo",
    text:
      "Acompanhamos todo o processo — arquitetura, especialidades, licenciamento e obra — com uma equipa próxima e dedicada. Garantimos um serviço transparente, rigoroso e contínuo, para que tenha total confiança do início ao fim.",
  },
  {
    img: "/sobre-nos/portugalcontinental.webp",
    title: "Construções em todo Portugal",
    text:
      "Trabalhamos em todo o território continental, levando a mesma exigência e qualidade a qualquer região. A nossa operação está preparada para executar projetos com eficiência e consistência, independentemente da localização.",
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
                    <p className={styles.text}>{c.text}</p>
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
