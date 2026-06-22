// Catálogo dos textos editáveis no backoffice (separador "Textos").
// Fonte única dos valores por omissão (= o texto atual do site).
// Cada chave é usada nas páginas via tc("chave").

export type CopyField = {
  label: string;       // nome amigável no backoffice
  def: string;         // valor por omissão (texto atual)
  page: string;        // agrupamento no backoffice
  multiline?: boolean; // caixa de texto grande?
};

export const CF: Record<string, CopyField> = {
  // ─── Contactos ───
  "contactos.morada.l1": { label: "Morada — linha 1", def: "Rua Rio 15,", page: "Contactos" },
  "contactos.morada.l2": { label: "Morada — linha 2", def: "4475-493 Maia", page: "Contactos" },
  "contactos.email.info": { label: "Email — Orçamentos/Informações", def: "info@evaplace.pt", page: "Contactos" },
  "contactos.email.compras": { label: "Email — Fornecedores/Compras", def: "compras@evaplace.pt", page: "Contactos" },
  "contactos.email.rh": { label: "Email — Recrutamento", def: "recursoshumanos@evaplace.pt", page: "Contactos" },
  "contactos.tel.central": { label: "Telefone — Central", def: "229 610 296", page: "Contactos" },
  "contactos.tel.comercial": { label: "Telefone — Assistente Comercial", def: "963 770 939", page: "Contactos" },
  "contactos.tel.compras": { label: "Telefone — Fornecedores/Compras", def: "961 143 825", page: "Contactos" },

  // ─── Sobre Nós ───
  "sobre.hero.l1": { label: "Título topo — linha 1", def: "Histórias que", page: "Sobre Nós" },
  "sobre.hero.l2": { label: "Título topo — linha 2", def: "nasceram na Maia.", page: "Sobre Nós" },
  "sobre.split.tit1": { label: "Título secção — linha 1", def: "A Transformar a", page: "Sobre Nós" },
  "sobre.split.tit2": { label: "Título secção — linha 2", def: "Construção", page: "Sobre Nós" },
  "sobre.split.cta": { label: "Botão", def: "Ver todas as casas", page: "Sobre Nós" },
  "sobre.split.texto": { label: "Parágrafo de missão", def: "A Evaplace nasceu com a missão de transformar o mercado da construção, apostando no aço leve e na madeira para criar casas mais rápidas, eficientes e com qualidade superior. Acreditamos que a inovação é o caminho para construir melhor, com precisão, responsabilidade, eficiência e um verdadeiro compromisso com o futuro.", page: "Sobre Nós", multiline: true },
  "sobre.card1.tit": { label: "Cartão 1 — título", def: "Projetos feitos à sua medida", page: "Sobre Nós" },
  "sobre.card1.txt": { label: "Cartão 1 — texto", def: "Todos os projetos são totalmente personalizáveis, da planta aos acabamentos. Adaptamos cada detalhe ao seu gosto e às necessidades da sua família. Se pretende algo único, criamos um projeto novo feito à sua medida, desenvolvido de raiz para transformar a sua ideia na realidade.", page: "Sobre Nós", multiline: true },
  "sobre.card2.tit": { label: "Cartão 2 — título", def: "Qualidade desde a origem", page: "Sobre Nós" },
  "sobre.card2.txt": { label: "Cartão 2 — texto", def: "Criamos espaços modernos e esteticamente marcantes, sempre com acabamentos de excelência e um isolamento superior que garante conforto e eficiência. Fabricamos as estruturas em aço leve e madeira diretamente na nossa fábrica, garantindo precisão e qualidade desde a origem.", page: "Sobre Nós", multiline: true },
  "sobre.card3.tit": { label: "Cartão 3 — título", def: "Acompanhamento completo", page: "Sobre Nós" },
  "sobre.card3.txt": { label: "Cartão 3 — texto", def: "Acompanhamos todo o processo — arquitetura, especialidades, licenciamento e obra — com uma equipa próxima e dedicada. Garantimos um serviço transparente, rigoroso e contínuo, para que tenha total confiança do início ao fim.", page: "Sobre Nós", multiline: true },
  "sobre.card4.tit": { label: "Cartão 4 — título", def: "Construções em todo Portugal", page: "Sobre Nós" },
  "sobre.card4.txt": { label: "Cartão 4 — texto", def: "Trabalhamos em todo o território continental, levando a mesma exigência e qualidade a qualquer região. A nossa operação está preparada para executar projetos com eficiência e consistência, independentemente da localização.", page: "Sobre Nós", multiline: true },

  // ─── Serviços ───
  "servicos.s1.tit": { label: "Serviço 1 — título", def: "Construção de Casas", page: "Serviços" },
  "servicos.s1.txt": { label: "Serviço 1 — texto", def: "Planeamos e executamos cada etapa com métodos de construção atuais, construção em madeira e LSF garantindo conforto e qualidade sem ultrapassar o orçamento e chave na mão.", page: "Serviços", multiline: true },
  "servicos.s2.tit": { label: "Serviço 2 — título", def: "Assentamento", page: "Serviços" },
  "servicos.s2.txt": { label: "Serviço 2 — texto", def: "Uma base instável pode comprometer toda a estrutura. Implementamos soluções de assentamento fiáveis, aplicando técnicas e materiais adequados para assegurar durabilidade e segurança.", page: "Serviços", multiline: true },
  "servicos.s3.tit": { label: "Serviço 3 — título", def: "Arquitetura e Engenharia", page: "Serviços" },
  "servicos.s3.txt": { label: "Serviço 3 — texto", def: "Conciliar forma e função num projeto pode ser um desafio. Elaboramos cada detalhe arquitetónico e estrutural de forma integrada, criando espaços personalizados e funcionais.", page: "Serviços", multiline: true },
  "servicos.s4.tit": { label: "Serviço 4 — título", def: "Muros e vedações", page: "Serviços" },
  "servicos.s4.txt": { label: "Serviço 4 — texto", def: "Precisa de segurança e privacidade sem descurar a estética? Desenvolvemos muros e vedações, com design adequado ao ambiente e materiais de qualidade, para delimitar o seu espaço de forma prática e agradável.", page: "Serviços", multiline: true },
  "servicos.s5.tit": { label: "Serviço 5 — título", def: "Pré instalação de eletricidade e pichelaria", page: "Serviços" },
  "servicos.s5.txt": { label: "Serviço 5 — texto", def: "Instalações mal planeadas podem causar transtornos e despesas adicionais. Garantimos um planeamento cuidadoso, assegurando que cada detalhe elétrico e hidráulico é definido desde o início, preparando a sua casa para um funcionamento eficiente.", page: "Serviços", multiline: true },

  // ─── Início (homepage) ───
  "home.hero.kicker": { label: "Topo — etiqueta", def: "CASAS EM AÇO LEVE E MADEIRA", page: "Início" },
  "home.hero.titulo": { label: "Topo — título grande", def: "Espaços de Partilha", page: "Início" },
  "home.hero.b1a": { label: "Bloco 1 — linha 1", def: "Design", page: "Início" },
  "home.hero.b1b": { label: "Bloco 1 — linha 2", def: "Contemporâneo", page: "Início" },
  "home.hero.b2a": { label: "Bloco 2 — linha 1", def: "Espaços", page: "Início" },
  "home.hero.b2b": { label: "Bloco 2 — linha 2", def: "Personalizáveis", page: "Início" },
  "home.hero.b3a": { label: "Bloco 3 — linha 1", def: "Qualidade", page: "Início" },
  "home.hero.b3b": { label: "Bloco 3 — linha 2", def: "Excecional", page: "Início" },
  "home.hero.cta": { label: "Topo — botão", def: "Ver Casas", page: "Início" },
  "home.intro.t1": { label: "Introdução — título linha 1", def: "Elevamos a", page: "Início" },
  "home.intro.t2": { label: "Introdução — título linha 2", def: "construção a um", page: "Início" },
  "home.intro.t3": { label: "Introdução — título linha 3", def: "novo padrão.", page: "Início" },
  "home.intro.cta": { label: "Introdução — botão", def: "Sobre nós", page: "Início" },
  "home.intro.p1": { label: "Introdução — parágrafo", def: "Na Evaplace, criamos projetos que se distinguem pela estética contemporânea e pela funcionalidade inteligente, com a exigência e o saber-fazer que nos definem, verdadeiramente distintos em todo o Portugal.", page: "Início", multiline: true },
};

// Lista de páginas (ordem no backoffice)
export const COPY_PAGES = ["Contactos", "Sobre Nós", "Serviços", "Início"];
