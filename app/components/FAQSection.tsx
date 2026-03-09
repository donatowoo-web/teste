"use client";

import { useState } from "react";
import styles from "./FAQSection.module.css";

const faqs = [
  {
    q: "O método de alvenaria tradicional não é melhor?",
    a: "Ao contrário do que muitos imaginam, os métodos adotados pela Evaplace, como woodframe, aço leve e viga macheda, apresentam benefícios substanciais relativamente à alvenaria tradicional. Contrariando a conceção comum, estas abordagens não só oferecem eficiência construtiva e durabilidade, mas também se destacam como opções mais versáteis e sustentáveis. A desmistificação destes métodos revela uma solução construtiva moderna e superior, desafiando perceções convencionais e estabelecendo um novo paradigma na indústria da construção.",
  },
  {
    q: "As casas construídas com estes métodos são duráveis?",
    a: "Sim, as construções em aço leve e madeira possuem alta durabilidade. Estas edificações seguem normas técnicas rigorosas e passam pelo mesmo processo de licenciamento que as construções em alvenaria, garantindo segurança e longevidade. Além disso, os materiais utilizados são tratados para resistir a fatores como humidade, pragas e corrosão, e as estruturas são projetadas para suportar cargas de forma eficiente. Quando bem executadas e mantidas, estas construções podem ter a mesma ou mais vida útil do que uma casa de alvenaria tradicional.",
  },
  {
    q: "Estas casas são mais suscetíveis a incêndios?",
    a: "Não. As construções em aço leve e madeira seguem normas rigorosas de segurança contra incêndios. O aço leve não é combustível e mantém a sua integridade estrutural quando combinado com materiais de revestimento resistentes ao fogo. Já a madeira utilizada é tratada para retardar a combustão, atendendo aos requisitos técnicos exigidos. Além disso, estas edificações cumprem todos os regulamentos de segurança contra incêndios, garantindo um nível de proteção equivalente ao das construções em alvenaria.",
  },
  {
    q: "Qual é o tempo estimado para construção de uma casa com a Evaplace?",
    a: "O tempo estimado para a construção de uma casa com a Evaplace varia entre 4 a 8 meses, dependendo do tipo de habitação, dimensões da habitação e do método construtivo escolhido. Esta flexibilidade permite adaptar o cronograma às necessidades específicas de cada projeto. A Evaplace acompanha ativamente todo o processo de licenciamento e aprovações necessárias, garantindo que todas as etapas, desde o planeamento até à entrega final, sejam rigorosamente cumpridas.",
  },
  {
    q: "Como posso proceder em relação às licenças necessárias?",
    a: "Na Evaplace, podemos acompanhar todo o processo de licenciamento e burocracia, sempre com o apoio de especialistas dedicados que orientam e asseguram o cumprimento de todas as exigências legais para o seu projeto.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Dúvidas Frequentes!</h2>

        <div className={styles.list}>
          {faqs.map((item, i) => {
            const isOpen = openIndex === i;

            return (
              <div key={item.q} className={styles.item}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className={styles.button}
                  aria-expanded={isOpen}
                >
                  <span className={styles.left}>
                    <span
                      className={`${styles.caret} ${isOpen ? styles.caretOpen : ""}`}
                      aria-hidden="true"
                    >
                      ▶
                    </span>
                    <span className={styles.question}>{item.q}</span>
                  </span>

                  <span className={styles.symbol} aria-hidden="true">
                    {isOpen ? "–" : "+"}
                  </span>
                </button>

                <div className={`${styles.panel} ${isOpen ? styles.panelOpen : ""}`}>
                  <p className={styles.answer}>{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
