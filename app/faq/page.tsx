"use client";

import { useState } from "react";
import styles from "./faq.module.css";

const FAQ_LSF = [
  {
    question: "O que é construção em Light Steel Frame (LSF)?",
    answer:
      "A construção em Light Steel Frame (LSF) é um método de construção que utiliza perfis de aço leve para criar a estrutura da casa, substituindo os tradicionais materiais de alvenaria ou concreto.",
  },
  {
    question: "Quais são as vantagens de construir em LSF?",
    answer:
      "Algumas vantagens incluem a rapidez da construção, eficiência energética, menor desperdício de materiais, facilidade de transporte e montagem, resistência a terremotos e flexibilidade no design.",
  },
  {
    question: "Como funciona o processo de construção em LSF?",
    answer:
      "O processo envolve a fabricação de painéis e estruturas de aço em uma fábrica, que são então montados no local. Isso permite uma construção mais rápida e precisa em comparação com métodos tradicionais.",
  },
  {
    question: "Qual é a durabilidade das casas em LSF?",
    answer:
      "As casas em LSF são projetadas para serem duráveis e resistentes, desde que sejam construídas corretamente e recebam a manutenção adequada ao longo do tempo.",
  },
  {
    question: "Estas casas necessitam de licenciamento?",
    answer:
      "Sim, as nossas casas são construções certificadas que sempre necessitaram de licenciamento, no entanto com a legislação em vigor todas as construções inclusivamente as casas móveis requerem licenciamento.",
  },
  {
    question: "Como é o isolamento térmico e acústico em casas de LSF?",
    answer:
      "As casas em LSF podem ter excelente isolamento térmico e acústico, pois as cavidades entre os painéis de aço podem ser preenchidas com materiais isolantes de alta qualidade.",
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
];

const FAQ_MADEIRA = [
  {
    question:
      "Quais são as vantagens de construir uma casa de madeira de pinho nórdico certificado?",
    answer:
      "As casas de madeira de pinho nórdico certificado oferecem as vantagens da sustentabilidade ambiental, qualidade da madeira, isolamento térmico eficaz e a garantia de que a madeira foi obtida de fontes responsáveis.",
  },
  {
    question: "A Casa de Madeira necessitará de muita manutenção?",
    answer:
      'A Evaplace trabalha com Pinho Nórdico Certificado que tem uma alta resistência ao apodrecimento e a "ganhar bicho". A nível estrutural não necessita de manutenção, no entanto aconselhamos a passagem de uma velatura (espécie de verniz) de 5 em 5 anos ou de 3 em 3 caso esteja numa zona de grande exposição solar ou próximo do mar, com o objetivo de proteger da erosão do vento ao longo dos anos. Nos países nórdicos existem casas em pinho nórdico.',
  },
  {
    question:
      "A Casa de Madeira pode ter licença de habitabilidade ou de turismo?",
    answer:
      "O sistema construtivo da Evaplace é Certificado e poderá licenciar a casa tanto para habitação tanto para turismo.",
  },
  {
    question: "Estas casas necessitam de licenciamento?",
    answer:
      "Sim, as nossas casas são construções certificadas que sempre necessitaram de licenciamento, no entanto com a legislação em vigor todas as construções inclusivamente as casas móveis requerem licenciamento.",
  },
  {
    question: "Qual a durabilidade de uma casa de madeira?",
    answer:
      "Duração de uma estrutura de madeira ultrapassa os cem anos, aplicando os conselhos de manutenção e sem grandes cuidados especiais. Há casos, nos países nórdicos, em que as casas duram há mais de 600 anos.",
  },
  {
    question:
      "Só existem as cores para a madeira que estão no vosso catálogo?",
    answer:
      "Temos um catálogo de velaturas com mais de 100 cores à disposição, e no entanto poderá ainda pintar a casa com uma tinta de madeira especializada a cor que quiser.",
  },
  {
    question: "O que está incluído no preço de catálogo?",
    answer:
      "Está incluído no nosso preço de catálogo: PAREDES – Tábuas de madeira maciça em Pinho Nórdico com ~44 mm de espessura com sistema de encaixe macho-fêmea; PAVIMENTO – Soalho de Tábuas de madeira maciça em Pinho Nórdico com ~20 mm de espessura com sistema de encaixe macho-fêmea. No caso de ter alpendre levará um Deck termotratado de alta durabilidade; COBERTURA INTERIOR – Forro de Tábuas de madeira maciça em Pinho Nórdico com sistema de encaixe macho-fêmea; VIGAMENTO – Vigas de madeira maciça em Pinho Nórdico; CAIXILHARIA – Janelas e Portas exteriores em madeira maciça em Pinho Nórdico. Nas casas, as janelas são de vidro duplo. Portas interiores em madeira maciça em Pinho Nórdico; TELHA SANDWICH – Painel isotérmico imitação telha ~40/80mm de poliuretano, os respetivos cumes e acabamentos; TRANSPORTE – Transporte efetuado por camião; MONTAGEM – A nossa equipa irá fazer toda a assemblagem da casa no local; PRÉ-INSTALAÇÃO DE ELETRICIDADE – Instalação elétrica, por divisão, 3 tomadas, um ponto de luz e um interruptor; PRÉ-INSTALAÇÃO DE ÁGUA E SANEAMENTO – Rede de água em PPR20, máximo 8 saídas.",
  },
  {
    question: "É possível instalar fonte de aquecimento e/ou lareira?",
    answer:
      "Sim pode ser instalado salamandras, recuperador de calor, entre outros, no entanto requerá uma proteção extra com cerâmica ou pedra para evitar contato de fogo com madeira.",
  },
];

function FAQItem({
  question,
  answer,
  isOpen,
  onClick,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div className={`${styles.faqItem} ${isOpen ? styles.faqItemOpen : ""}`}>
      <button className={styles.faqButton} onClick={onClick} aria-expanded={isOpen}>
        <span className={styles.faqArrow}>▸</span>
        <span className={styles.faqQuestion}>{question}</span>
        <span className={styles.faqPlus}>{isOpen ? "−" : "+"}</span>
      </button>
      <div className={styles.faqAnswerWrap}>
        <p className={styles.faqAnswer}>{answer}</p>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Perguntas Frequentes</h1>
        <p className={styles.subtitle}>
          Encontre respostas às questões mais comuns sobre os nossos métodos de construção.
        </p>

        {/* Casas em Aço Leve */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Casas em Aço Leve (LSF)</h2>
          <div className={styles.faqList}>
            {FAQ_LSF.map((item, index) => (
              <FAQItem
                key={`lsf-${index}`}
                question={item.question}
                answer={item.answer}
                isOpen={openIndex === `lsf-${index}`}
                onClick={() => toggleItem(`lsf-${index}`)}
              />
            ))}
          </div>
        </section>

        {/* Casas de Madeira */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Casas de Madeira</h2>
          <div className={styles.faqList}>
            {FAQ_MADEIRA.map((item, index) => (
              <FAQItem
                key={`madeira-${index}`}
                question={item.question}
                answer={item.answer}
                isOpen={openIndex === `madeira-${index}`}
                onClick={() => toggleItem(`madeira-${index}`)}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
