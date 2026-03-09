export type Projeto = {
  slug: string;
  titulo: string;
  descricao: string;
  localizacao: string;
  sistema: string;
  area: string;
  ano: string;
  finalidade: string;
  thumbnail: string;
  imagens: string[];
};

export const projetos: Projeto[] = [
  {
    slug: "casa-caminha",
    titulo: "Casa Caminha",
    descricao:
      "Esta habitação unifamiliar V5 foi construída em madeira, com foco na eficiência térmica, conforto e integração com o ambiente envolvente. Pensada para habitação permanente, combina rapidez de execução com materiais de alta qualidade, garantindo um espaço funcional, durável e adaptado ao clima da região Norte.",
    localizacao: "Caminha",
    sistema: "Madeira",
    area: "138 m²",
    ano: "2025",
    finalidade: "Habitação permanente",
    thumbnail: "/projetos/caminha/caminha_1.webp",
    imagens: [
      "/projetos/caminha/caminha_1.webp",
      "/projetos/caminha/caminha_2.webp",
      "/projetos/caminha/caminha_3.webp",
      "/projetos/caminha/caminha_4.webp",
      "/projetos/caminha/caminha_5.webp",
      "/projetos/caminha/caminha_6.webp",
      "/projetos/caminha/caminha_7.webp",
      "/projetos/caminha/caminha_8.webp",
      "/projetos/caminha/caminha_9.webp",
      "/projetos/caminha/caminha_10.webp",
      "/projetos/caminha/caminha_11.webp",
    ],
  },
  {
    slug: "casa-geres",
    titulo: "Habitação unifamiliar em Madeira",
    descricao:
      "Construída para se adaptar ao ritmo do lugar, esta casa de madeira foi pensada para garantir conforto, durabilidade e ligação direta com o exterior. A escolha dos materiais, a disposição dos volumes e a relação com a paisagem refletem o objetivo principal do projeto: integrar-se no Gerês sem o descaracterizar.",
    localizacao: "Gerês, Portugal",
    sistema: "Madeira, pinho nórdico certificado",
    area: "75 m²",
    ano: "2023",
    finalidade: "Alojamento Local para a empresa Ohana Gerês",
    thumbnail: "/projetos/casa-geres/Geres_1.webp",
    imagens: [
      "/projetos/casa-geres/Geres_1.webp",
      "/projetos/casa-geres/Geres_7.webp",
      "/projetos/casa-geres/Geres_2.webp",
      "/projetos/casa-geres/Geres_3.webp",
      "/projetos/casa-geres/Geres_4.webp",
      "/projetos/casa-geres/Geres_5.webp",
      "/projetos/casa-geres/Geres_6.webp",
    ],
  },
  {
    slug: "casa-valenca",
    titulo: "Casa Valença",
    descricao:
      "Esta casa em madeira foi desenhada para garantir conforto térmico, durabilidade e integração com o ambiente envolvente. A disposição dos vãos, a orientação solar e os materiais aplicados foram definidos em função das necessidades do cliente e da localização.",
    localizacao: "Valença",
    sistema: "Madeira",
    area: "85 m²",
    ano: "2022",
    finalidade: "Habitação permanente",
    thumbnail: "/projetos/casa-valenca/1_1920X1080.webp",
    imagens: [
      "/projetos/casa-valenca/1_1920X1080.webp",
      "/projetos/casa-valenca/2.webp",
      "/projetos/casa-valenca/3_1920X1080.webp",
      "/projetos/casa-valenca/4_1920x1080.webp",
      "/projetos/casa-valenca/5.webp",
      "/projetos/casa-valenca/final.webp",
      "/projetos/casa-valenca/valenca3.webp",
    ],
  },
  {
    slug: "casa-pacos-gaiolo",
    titulo: "Casa Paços de Gaiolo",
    descricao:
      "Projeto residencial em sistema LSF com acabamentos de alta qualidade. A construção em aço leve permite uma execução rápida mantendo os mais elevados padrões de conforto e eficiência energética.",
    localizacao: "Paços de Gaiolo",
    sistema: "Aço Leve (LSF)",
    area: "180 m²",
    ano: "2024",
    finalidade: "Habitação permanente",
    thumbnail: "/projetos/casa-pacos-gaiolo/6.webp",
    imagens: [
      "/projetos/casa-pacos-gaiolo/6.webp",
      "/projetos/casa-pacos-gaiolo/1.webp",
      "/projetos/casa-pacos-gaiolo/2.webp",
      "/projetos/casa-pacos-gaiolo/3.webp",
      "/projetos/casa-pacos-gaiolo/5-1.webp",
    ],
  },
  {
    slug: "casa-arvore",
    titulo: "Casa da Árvore",
    descricao:
      "Um projeto único que combina a beleza natural da madeira com design inovador. Construída em altura, esta casa da árvore oferece uma experiência de alojamento diferenciada em plena natureza.",
    localizacao: "Portugal",
    sistema: "Madeira",
    area: "35 m²",
    ano: "2024",
    finalidade: "Alojamento local",
    thumbnail: "/projetos/casa-arvore/casa_de_arvore_1.webp",
    imagens: [
      "/projetos/casa-arvore/casa_de_arvore_1.webp",
      "/projetos/casa-arvore/casa_de_arvore_2.webp",
      "/projetos/casa-arvore/casa_de_arvore_3.webp",
      "/projetos/casa-arvore/1.webp",
      "/projetos/casa-arvore/post_1-e1752228809358.webp",
    ],
  },
  {
    slug: "camping-pod",
    titulo: "Camping Pod",
    descricao:
      "Solução compacta e funcional para turismo de natureza. Os camping pods são estruturas em madeira que oferecem conforto e abrigo, perfeitas para parques de campismo e espaços de glamping.",
    localizacao: "Portugal",
    sistema: "Madeira",
    area: "15 m²",
    ano: "2024",
    finalidade: "Alojamento turístico",
    thumbnail: "/projetos/camping-pod/20240307_135404-scaled.webp",
    imagens: [
      "/projetos/camping-pod/20240307_135404-scaled.webp",
      "/projetos/camping-pod/20240305_095036-scaled.webp",
      "/projetos/camping-pod/20240305_111612-scaled.webp",
      "/projetos/camping-pod/20240305_123638-scaled.webp",
      "/projetos/camping-pod/20240305_152324-scaled.webp",
      "/projetos/camping-pod/20240305_171812-scaled.webp",
      "/projetos/camping-pod/20240305_171816-scaled.webp",
      "/projetos/camping-pod/20240305_171832-scaled.webp",
      "/projetos/camping-pod/20240305_171918-scaled.webp",
      "/projetos/camping-pod/20240306_102246-scaled.webp",
      "/projetos/camping-pod/20240306_182003-scaled.webp",
    ],
  },
];
