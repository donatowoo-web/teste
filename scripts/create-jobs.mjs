import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "onxd36ek",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_TOKEN,
});

const oferecemos = [
  "Remuneração atrativa com possibilidade de progressão de carreira",
  "Ambiente de trabalho dinâmico e colaborativo",
  "Oportunidade de crescimento e desenvolvimento profissional",
  "Participação em projetos desafiantes e inovadores",
];

const jobs = [
  {
    _type: "job",
    title: "Desenhador / Orçamentista",
    slug: { _type: "slug", current: "desenhador-orcamentista" },
    location: "Porto (Presencial)",
    type: "full-time",
    description: `O que irá fazer:
Irá apoiar o desenvolvimento técnico e económico dos projetos da Evaplace, assegurando a produção de desenhos técnicos e a elaboração de orçamentos detalhados. O seu trabalho será essencial para garantir planeamento rigoroso, controlo de custos e decisões bem fundamentadas antes do início da obra.

Detalhe da Oferta:
Integração numa equipa técnica multidisciplinar, com ligação direta entre projeto, orçamento e execução em obra.

Funções e Responsabilidades:
• Elaboração de desenhos técnicos e esquemas construtivos
• Preparação de orçamentos com base em projetos e medições
• Análise de custos, materiais e soluções construtivas
• Articulação com engenheiros, arquitetos e obra`,
    requirements: [
      "Formação técnica ou superior (Eng. Civil, Arquitetura, Design Técnico)",
      "Forte domínio de AutoCAD",
      "Leitura de projetos e medições",
      "Orçamentação (Excel / CCS / similar)",
      "Ligação entre projeto e custos",
    ],
    proposal: oferecemos,
    isActive: true,
    publishedAt: new Date().toISOString(),
  },
  {
    _type: "job",
    title: "Pedreiro",
    slug: { _type: "slug", current: "pedreiro" },
    location: "Porto (Presencial)",
    type: "full-time",
    description: `O que irá fazer:
Irá executar trabalhos de construção em obra, assegurando a correta aplicação de materiais e técnicas construtivas. Terá um papel direto na qualidade final da obra e no cumprimento dos prazos definidos.

Detalhe da Oferta:
Função operacional em contexto de obra, integrada numa equipa organizada e com acompanhamento técnico.

Funções e Responsabilidades:
• Execução de trabalhos de construção e acabamentos
• Cumprimento de projetos, prazos e orientações técnicas
• Respeito pelas normas de segurança e qualidade`,
    requirements: [
      "Experiência comprovada como pedreiro",
      "Conhecimento das técnicas construtivas tradicionais",
      "Capacidade de trabalhar de forma autónoma e em equipa",
      "Responsabilidade e atenção à qualidade do trabalho",
      "Cumprimento das normas de segurança",
    ],
    proposal: oferecemos,
    isActive: true,
    publishedAt: new Date().toISOString(),
  },
  {
    _type: "job",
    title: "Montador de Estruturas em LSF e Madeira",
    slug: { _type: "slug", current: "montador-de-estruturas-em-lsf-e-madeira" },
    location: "Porto (Presencial)",
    type: "full-time",
    description: `O que irá fazer:
Irá montar estruturas em Light Steel Frame e madeira, seguindo projetos técnicos e procedimentos definidos. O seu trabalho é determinante para a precisão, estabilidade e qualidade da construção.

Detalhe da Oferta:
Função técnica em obra, integrada em projetos de construção modernos e organizados.

Funções e Responsabilidades:
• Montagem de estruturas em LSF e madeira
• Leitura e interpretação de desenhos técnicos
• Cumprimento rigoroso de prazos e normas de segurança`,
    requirements: [
      "Experiência em montagem de estruturas em LSF e/ou madeira",
      "Capacidade de leitura e interpretação básica de desenhos técnicos",
      "Sentido de responsabilidade e rigor na execução",
      "Capacidade de trabalho em equipa",
      "Cumprimento das normas de segurança em obra",
    ],
    proposal: oferecemos,
    isActive: true,
    publishedAt: new Date().toISOString(),
  },
  {
    _type: "job",
    title: "Engenheiro Civil",
    slug: { _type: "slug", current: "engenheiro-civil" },
    location: "Porto (Presencial)",
    type: "full-time",
    description: `O que irá fazer:
Irá acompanhar e coordenar projetos de construção, garantindo o cumprimento técnico, legal e construtivo em todas as fases. Terá intervenção direta no planeamento, execução e controlo da obra.

Detalhe da Oferta:
Função técnica com responsabilidade transversal entre projeto e obra.

Funções e Responsabilidades:
• Acompanhamento e coordenação de obras
• Garantia de conformidade técnica e legal
• Articulação com projetistas, equipas de obra e fornecedores`,
    requirements: [
      "Formação superior em Engenharia Civil",
      "Inscrição válida na Ordem dos Engenheiros (ou elegibilidade)",
      "Experiência em acompanhamento e coordenação de obras",
      "Capacidade de planeamento, organização e controlo de execução",
      "Conhecimento das normas técnicas e legais aplicáveis",
      "Boa capacidade de comunicação com equipas técnicas e obra",
      "Sentido de responsabilidade e autonomia",
    ],
    proposal: oferecemos,
    isActive: true,
    publishedAt: new Date().toISOString(),
  },
  {
    _type: "job",
    title: "Cargo de Trolha",
    slug: { _type: "slug", current: "cargo-de-trolha" },
    location: "Porto (Presencial)",
    type: "full-time",
    description: `O que irá fazer:
Irá apoiar diretamente os trabalhos de obra, garantindo o fornecimento de materiais e apoio logístico às equipas no terreno.

Detalhe da Oferta:
Função operacional essencial ao bom ritmo e organização da obra.

Funções e Responsabilidades:
• Apoio no transporte e preparação de materiais
• Suporte às equipas de obra
• Manutenção da organização do estaleiro`,
    requirements: [
      "Experiência em trabalhos de obra",
      "Capacidade física para tarefas operacionais",
      "Autonomia na execução dos trabalhos",
      "Cumprimento das normas de segurança",
      "Capacidade de trabalho em equipa",
    ],
    proposal: oferecemos,
    isActive: true,
    publishedAt: new Date().toISOString(),
  },
  {
    _type: "job",
    title: "Arquiteto",
    slug: { _type: "slug", current: "arquiteto" },
    location: "Porto (Presencial)",
    type: "full-time",
    description: `O que irá fazer:
Irá desenvolver e acompanhar projetos de arquitetura, assegurando soluções funcionais, bem definidas tecnicamente e alinhadas com os métodos construtivos da Evaplace.

Detalhe da Oferta:
Integração numa equipa com ligação direta entre projeto e execução.

Funções e Responsabilidades:
• Desenvolvimento de projetos de arquitetura
• Apoio técnico às fases de obra
• Articulação com engenharia e coordenação`,
    requirements: [
      "Formação superior em Arquitetura",
      "Inscrição válida na Ordem dos Arquitetos (ou possibilidade de inscrição)",
      "Domínio de AutoCAD",
      "Conhecimentos de Revit / BIM (valorizado)",
      "Capacidade de desenvolver estudo prévio, licenciamento e execução",
      "Boa capacidade de comunicação com engenheiros, cliente e obra",
    ],
    proposal: oferecemos,
    isActive: true,
    publishedAt: new Date().toISOString(),
  },
  {
    _type: "job",
    title: "Ajudante de Trolha",
    slug: { _type: "slug", current: "ajudante-de-trolha" },
    location: "Porto (Presencial)",
    type: "full-time",
    description: `O que irá fazer:
Irá apoiar os trabalhos de construção em obra, colaborando com a equipa na execução das tarefas diárias e garantindo o bom andamento dos trabalhos.

Detalhe da Oferta:
Função de entrada em obra, com possibilidade de aprendizagem e evolução.

Funções e Responsabilidades:
• Apoio direto às equipas de construção
• Preparação de materiais e ferramentas
• Cumprimento das regras de segurança`,
    requirements: [
      "Vontade de aprender e trabalhar em obra",
      "Capacidade física para tarefas operacionais",
      "Sentido de responsabilidade e pontualidade",
      "Espírito de equipa e cumprimento de regras de segurança",
    ],
    proposal: oferecemos,
    isActive: true,
    publishedAt: new Date().toISOString(),
  },
  {
    _type: "job",
    title: "Picheleiro",
    slug: { _type: "slug", current: "picheleiro" },
    location: "Porto (Presencial)",
    type: "full-time",
    description: `O que irá fazer:
Irá executar trabalhos de canalização e redes hidráulicas, assegurando a correta instalação dos sistemas de água e esgotos em obra.

Detalhe da Oferta:
Função técnica especializada integrada em projetos de construção residencial.

Funções e Responsabilidades:
• Instalação de redes de água e esgotos
• Leitura de esquemas técnicos
• Cumprimento das normas técnicas e de segurança`,
    requirements: [
      "Experiência em instalação de redes de água e esgotos",
      "Capacidade de leitura de esquemas técnicos",
      "Autonomia na execução dos trabalhos",
      "Cumprimento das normas técnicas e de segurança",
      "Capacidade de trabalho em equipa",
    ],
    proposal: oferecemos,
    isActive: true,
    publishedAt: new Date().toISOString(),
  },
  {
    _type: "job",
    title: "Departamento de Compras",
    slug: { _type: "slug", current: "departamento-de-compras" },
    location: "Porto (Presencial)",
    type: "full-time",
    description: `O que irá fazer:
Irá gerir processos de compras, fornecedores e materiais, garantindo que a obra dispõe dos recursos certos, no momento certo e com controlo de custos.

Detalhe da Oferta:
Função estratégica de apoio à obra e à gestão interna.

Funções e Responsabilidades:
• Gestão de fornecedores e encomendas
• Controlo de custos e prazos de entrega
• Articulação com obra e equipa técnica`,
    requirements: [
      "Experiência em funções de compras ou apoio administrativo",
      "Capacidade de organização e controlo de encomendas",
      "Boa capacidade de comunicação com fornecedores e equipas internas",
      "Sentido de responsabilidade e atenção ao detalhe",
      "Conhecimentos de ferramentas informáticas na ótica do utilizador",
    ],
    proposal: oferecemos,
    isActive: true,
    publishedAt: new Date().toISOString(),
  },
];

async function createJobs() {
  console.log("A criar vagas no Sanity...\n");

  for (const job of jobs) {
    try {
      const result = await client.create(job);
      console.log(`✓ Criada: ${job.title} (ID: ${result._id})`);
    } catch (error) {
      console.error(`✗ Erro ao criar ${job.title}:`, error.message);
    }
  }

  console.log("\nConcluído!");
}

createJobs();
