import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "onxd36ek",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_TOKEN,
});

// Helper to create a text block
const block = (text, style = "normal") => ({
  _type: "block",
  _key: Math.random().toString(36).substr(2, 9),
  style,
  children: [{ _type: "span", _key: Math.random().toString(36).substr(2, 9), text }],
});

// Helper to create a bullet list
const bulletList = (items) => items.map(item => ({
  _type: "block",
  _key: Math.random().toString(36).substr(2, 9),
  style: "normal",
  listItem: "bullet",
  level: 1,
  children: [{ _type: "span", _key: Math.random().toString(36).substr(2, 9), text: item }],
}));

const body = [
  block("O que é realmente o IVA a 6% na construção (e o que não é)", "h2"),

  block("Desde 2025/2026 o Governo português introduziu um pacote fiscal para habitação que prevê, entre outras medidas, a redução da taxa de IVA de 23% para 6% nas empreitadas de construção e reabilitação de imóveis para fins habitacionais. Neste momento existem várias dúvidas no que toca ao que se pode ou não fazer."),

  block("Este artigo vai ajudar a perceber na íntegra como é que podemos aplicar a lei dos 6%, prazos e onde é aplicável."),

  block("Não é um \"desconto automático\" nem uma regra geral", "h3"),

  block("A taxa reduzida não se aplica por defeito ao ato de construir, mas sim a determinadas empreitadas, quando o destino final do imóvel e os respetivos prazos cumprem o que está previsto no Código do IVA (CIVA) e na legislação complementar aprovada no âmbito do pacote para a habitação (OE 2024-2026)."),

  block("O que mudou (ou ficou mais claro) em 2026", "h2"),

  block("O enquadramento do regime no CIVA e legislação complementar", "h3"),

  block("Neste momento a lei dos 6% já não é um chamariz para a nova construção mas sim uma lei que está integrada e consolidada no CIVA, através de uma nova verba da Lista I, que enquadra legalmente a aplicação da taxa reduzida às empreitadas de construção e reabilitação destinadas a habitação."),

  block("A consolidação do conceito de habitação própria e permanente", "h3"),

  block("Em 2026, ficou claro quando se fala de \"habitação própria e permanente\" não é um conceito subjetivo porque o Estado deixou de aceitar interpretações \"à vontade\"."),

  block("Porque é que o Estado é tão rígido nisto?", "h3"),

  block("Porque os benefícios fiscais (como o IVA reduzido) existem para apoiar quem vive na casa, não para:"),

  ...bulletList([
    "Investimento",
    "Especulação",
    "Rendimento turístico disfarçado"
  ]),

  block("A Autoridade Tributária olha para isto com uma lógica simples: Se o benefício é para habitação própria, então a casa tem de ser… própria e habitada."),

  block("A introdução prática de mecanismos de regularização do imposto", "h3"),

  block("Uma situação que ficou clara foi os mecanismos de proteção para o uso irregular do IVA a 6%, posteriormente, se verifique que as condições deixaram de estar cumpridas."),

  block("Isto significa que o IVA a 6% pode ser revertido, mesmo depois da obra concluída, se o destino do imóvel ou os prazos legais não forem respeitados."),

  block("Onde as pessoas perdem o IVA a 6% sem perceber", "h2"),

  block("Obras feitas \"às peças\" em vez de contrato de empreitada", "h3"),

  block("É aqui que muita gente vai perder uma oportunidade enorme, com o pensamento que vai poupar e aproveitar o 6% na construção mas esquecem que existem regras que podem deitar esse pensamento abaixo."),

  block("Normalmente vemos muita gente a contratar uma empresa para a estrutura, outra para isolamentos, outra para a parte elétrica. ISTO NÃO É UMA EMPREITADA mas sim uma contratação de serviços individuais. Só isso já faz com que perca os 6% da construção e passa a pagar ainda mais pois vai pagar por vários serviços maior parte deles a 23%."),

  block("Confusão entre habitação própria, segunda habitação e investimento", "h3"),

  block("Aqui voltamos ao tema inicial e assustador, fazer a 6% e depois ter uma fiscalização e ser verificado que não está a ser:"),

  ...bulletList([
    "Segunda habitação",
    "Estar vazio",
    "Ser colocado no mercado de arrendamento fora dos parâmetros previstos"
  ]),

  block("Pois, habitação própria permanente significa que é uma casa que a pessoa vive todos os dias, está fisicamente registada e não usa para mais nada."),

  block("Falhas na documentação e no enquadramento fiscal do imóvel", "h3"),

  block("O Estado acredita em tudo o que está em papel, o que não está simplesmente não existe. Não interessa quando a casa ficou pronta, quando a pessoa mudou-se para lá ou mesmo quando começou a viver lá, o que conta é a data que ficou registada oficialmente."),

  block("Outro documento super importante é a licença de habitação, sem isso para as Finanças, a casa ainda não é uma habitação válida."),

  block("Um passo também que passa despercebido é a comunicação de início de utilização, pois se não for comunicado os prazos legais podem começar a contar sem o proprietário saber."),
];

async function updateArticle() {
  console.log("A procurar o artigo...");

  // Find the article
  const article = await client.fetch(`*[_type == "post" && slug.current == "o-que-e-realmente-o-iva-a-6-na-construcao"][0]{ _id, title }`);

  if (!article) {
    console.log("Artigo não encontrado!");
    return;
  }

  console.log(`Encontrado: ${article.title} (${article._id})`);
  console.log("A atualizar conteúdo...");

  // Update the article
  await client
    .patch(article._id)
    .set({
      title: "O IVA a 6% na construção: tudo o que precisa de saber em 2026",
      body: body
    })
    .commit();

  console.log("✓ Artigo atualizado com sucesso!");
}

updateArticle();
