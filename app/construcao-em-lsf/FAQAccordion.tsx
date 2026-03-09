"use client";

import { useState } from "react";
import styles from "./construcao-lsf.module.css";

const FAQ_ITEMS = [
  {
    question: "O que é construção em Light Steel Frame (LSF)?",
    answer:
      "É um método de construção que utiliza perfis de aço galvanizado para formar a estrutura da habitação. Este sistema permite uma construção precisa, leve e eficiente, com excelente desempenho estrutural.",
  },
  {
    question: "Quais são as vantagens de construir em LSF?",
    answer:
      "Algumas vantagens incluem a rapidez da construção, eficiência energética, menor desperdício de materiais, facilidade de transporte e montagem, resistência a terremotos e flexibilidade no design.",
  },
  {
    question: "Como funciona o processo de construção?",
    answer:
      "O processo envolve a fabricação de painéis e estruturas de aço em uma fábrica, que são então montados no local. Isso permite uma construção mais rápida e precisa em comparação com métodos tradicionais.",
  },
  {
    question: "Qual é a durabilidade das casas em LSF?",
    answer:
      "O aço galvanizado tem elevada resistência à corrosão e ao desgaste, o que garante uma estrutura estável e com longa vida útil, desde que mantida corretamente.",
  },
  {
    question: "Preciso de licença para construir?",
    answer:
      "Sim. Como qualquer construção permanente, as casas em LSF estão sujeitas a licenciamento municipal.",
  },
  {
    question: "Como é o isolamento térmico e acústico?",
    answer:
      "O sistema inclui lã mineral e várias camadas de revestimento que proporcionam excelente isolamento, tanto em termos de temperatura como de ruído.",
  },
  {
    question: "As casas em LSF são seguras contra incêndios?",
    answer:
      "Sim, as casas em LSF podem ser projetadas com materiais resistentes ao fogo, e os componentes de aço têm um ponto de fusão muito alto, o que contribui para a segurança contra incêndios.",
  },
  {
    question: "Quais são as opções de design em casas de LSF?",
    answer:
      "As casas em LSF oferecem flexibilidade de design, permitindo uma variedade de estilos arquitetônicos e layouts personalizados.",
  },
  {
    question: "Como é a manutenção das casas em LSF?",
    answer:
      "As casas em LSF requerem manutenção semelhante a outras casas, como cuidados com telhados, janelas e sistemas de encanamento e elétricos.",
  },
  {
    question: "Existem restrições urbanísticas?",
    answer:
      "As regras de construção dependem do município, tal como com outros métodos construtivos. Consulte sempre a câmara municipal local.",
  },
];

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={styles.faqSection}>
      <div className={styles.faqContainer}>
        <h2 className={styles.faqTitle}>Perguntas mais frequentes</h2>

        <div className={styles.faqList}>
          {FAQ_ITEMS.map((item, index) => (
            <div
              key={index}
              className={`${styles.faqItem} ${openIndex === index ? styles.faqItemOpen : ""}`}
            >
              <button
                className={styles.faqButton}
                onClick={() => toggleItem(index)}
                aria-expanded={openIndex === index}
              >
                <span className={styles.faqArrow}>▸</span>
                <span className={styles.faqQuestion}>{item.question}</span>
                <span className={styles.faqPlus}>{openIndex === index ? "−" : "+"}</span>
              </button>
              <div className={styles.faqAnswerWrap}>
                <p className={styles.faqAnswer}>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
