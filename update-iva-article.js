const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'onxd36ek',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_TOKEN
});

const body = [
  {
    _type: 'block',
    _key: 'a1',
    style: 'normal',
    children: [
      { _type: 'span', _key: 'a1a', marks: [], text: 'Se está a planear construir a sua casa em 2026, há uma boa notícia: a taxa de IVA reduzida de 6% na construção de habitação já está em vigor. Esta medida, que entrou em vigor no início de 2026, representa uma poupança significativa face à taxa normal de 23%. Mas atenção: existem regras e condições específicas que precisa de conhecer para beneficiar desta vantagem fiscal.' }
    ],
    markDefs: []
  },
  {
    _type: 'block',
    _key: 'a2',
    style: 'h2',
    children: [{ _type: 'span', _key: 'a2a', marks: [], text: 'O que é o IVA a 6% na construção?' }],
    markDefs: []
  },
  {
    _type: 'block',
    _key: 'a3',
    style: 'normal',
    children: [
      { _type: 'span', _key: 'a3a', marks: [], text: 'A taxa reduzida de IVA a 6% aplica-se às empreitadas de construção ou reabilitação de imóveis destinados a habitação. Em vez de pagar 23% de IVA sobre os custos de construção, paga apenas 6% — uma diferença de 17 pontos percentuais que pode representar dezenas de milhares de euros de poupança.' }
    ],
    markDefs: []
  },
  {
    _type: 'block',
    _key: 'a4',
    style: 'h2',
    children: [{ _type: 'span', _key: 'a4a', marks: [], text: 'Quem pode beneficiar?' }],
    markDefs: []
  },
  {
    _type: 'block',
    _key: 'a5',
    style: 'normal',
    children: [{ _type: 'span', _key: 'a5a', marks: [], text: 'A taxa reduzida de 6% aplica-se a:' }],
    markDefs: []
  },
  {
    _type: 'block',
    _key: 'a6',
    style: 'normal',
    listItem: 'bullet',
    level: 1,
    children: [
      { _type: 'span', _key: 'a6a', marks: ['strong'], text: 'Construção de habitação própria e permanente' },
      { _type: 'span', _key: 'a6b', marks: [], text: ', até ao valor máximo de 648.022 euros' }
    ],
    markDefs: []
  },
  {
    _type: 'block',
    _key: 'a7',
    style: 'normal',
    listItem: 'bullet',
    level: 1,
    children: [
      { _type: 'span', _key: 'a7a', marks: ['strong'], text: 'Arrendamento habitacional' },
      { _type: 'span', _key: 'a7b', marks: [], text: ', com rendas até 2.300 euros mensais' }
    ],
    markDefs: []
  },
  {
    _type: 'block',
    _key: 'a8',
    style: 'normal',
    listItem: 'bullet',
    level: 1,
    children: [
      { _type: 'span', _key: 'a8a', marks: ['strong'], text: 'Venda para habitação própria e permanente' },
      { _type: 'span', _key: 'a8b', marks: [], text: ' do adquirente, desde que a venda ocorra no prazo máximo de 24 meses após a licença de utilização' }
    ],
    markDefs: []
  },
  {
    _type: 'block',
    _key: 'a9',
    style: 'h2',
    children: [{ _type: 'span', _key: 'a9a', marks: [], text: 'Qual o limite de valor?' }],
    markDefs: []
  },
  {
    _type: 'block',
    _key: 'a10',
    style: 'normal',
    children: [
      { _type: 'span', _key: 'a10a', marks: [], text: 'O IVA a 6% aplica-se a casas com valor até ' },
      { _type: 'span', _key: 'a10b', marks: ['strong'], text: '648.022 euros' },
      { _type: 'span', _key: 'a10c', marks: [], text: '. Se ultrapassar este valor, o construtor terá de regularizar a diferença do imposto — ou seja, pagar os 17% que ficaram por liquidar (diferença entre 23% e 6%).' }
    ],
    markDefs: []
  },
  {
    _type: 'block',
    _key: 'a11',
    style: 'h2',
    children: [{ _type: 'span', _key: 'a11a', marks: [], text: 'Prazos e condições importantes' }],
    markDefs: []
  },
  {
    _type: 'block',
    _key: 'a12',
    style: 'normal',
    children: [
      { _type: 'span', _key: 'a12a', marks: [], text: 'A medida é ' },
      { _type: 'span', _key: 'a12b', marks: ['strong'], text: 'temporária' },
      { _type: 'span', _key: 'a12c', marks: [], text: ' e aplica-se a:' }
    ],
    markDefs: []
  },
  {
    _type: 'block',
    _key: 'a13',
    style: 'normal',
    listItem: 'bullet',
    level: 1,
    children: [{ _type: 'span', _key: 'a13a', marks: [], text: 'Operações urbanísticas iniciadas entre 23 de setembro de 2025 e 31 de dezembro de 2029' }],
    markDefs: []
  },
  {
    _type: 'block',
    _key: 'a14',
    style: 'normal',
    listItem: 'bullet',
    level: 1,
    children: [{ _type: 'span', _key: 'a14a', marks: [], text: 'Exigibilidade do imposto a partir de 1 de janeiro de 2026' }],
    markDefs: []
  },
  {
    _type: 'block',
    _key: 'a15',
    style: 'normal',
    listItem: 'bullet',
    level: 1,
    children: [{ _type: 'span', _key: 'a15a', marks: [], text: 'Regime válido até 2029, podendo ser reavaliado' }],
    markDefs: []
  },
  {
    _type: 'block',
    _key: 'a16',
    style: 'h2',
    children: [{ _type: 'span', _key: 'a16a', marks: [], text: 'Autoconstrução: como funciona a restituição?' }],
    markDefs: []
  },
  {
    _type: 'block',
    _key: 'a17',
    style: 'normal',
    children: [{ _type: 'span', _key: 'a17a', marks: [], text: 'Se está a construir a sua própria casa (autoconstrução), pode beneficiar da restituição parcial do IVA. A Autoridade Tributária devolve a diferença entre a taxa normal de 23% e a taxa reduzida de 6%.' }],
    markDefs: []
  },
  {
    _type: 'block',
    _key: 'a18',
    style: 'normal',
    children: [
      { _type: 'span', _key: 'a18a', marks: [], text: 'Para isso, deve apresentar o pedido de restituição à AT no prazo máximo de ' },
      { _type: 'span', _key: 'a18b', marks: ['strong'], text: '12 meses após a emissão da licença de utilização' },
      { _type: 'span', _key: 'a18c', marks: [], text: '. A devolução deve ocorrer no prazo de 150 dias após a receção do pedido.' }
    ],
    markDefs: []
  },
  {
    _type: 'block',
    _key: 'a19',
    style: 'h2',
    children: [{ _type: 'span', _key: 'a19a', marks: [], text: 'O que acontece se não cumprir os requisitos?' }],
    markDefs: []
  },
  {
    _type: 'block',
    _key: 'a20',
    style: 'normal',
    children: [{ _type: 'span', _key: 'a20a', marks: [], text: 'Se beneficiou do IVA a 6% durante a construção, mas no final a casa não se destina a habitação própria e permanente, ou ultrapassa o valor limite, terá de regularizar a diferença do imposto. Ou seja, pagar os 17% que ficaram por liquidar.' }],
    markDefs: []
  },
  {
    _type: 'block',
    _key: 'a21',
    style: 'h2',
    children: [{ _type: 'span', _key: 'a21a', marks: [], text: 'Quanto pode poupar na prática?' }],
    markDefs: []
  },
  {
    _type: 'block',
    _key: 'a22',
    style: 'normal',
    children: [{ _type: 'span', _key: 'a22a', marks: [], text: 'Vejamos um exemplo concreto: numa construção de 200.000 euros em custos de empreitada:' }],
    markDefs: []
  },
  {
    _type: 'block',
    _key: 'a23',
    style: 'normal',
    listItem: 'bullet',
    level: 1,
    children: [{ _type: 'span', _key: 'a23a', marks: [], text: 'IVA a 23%: 46.000 euros' }],
    markDefs: []
  },
  {
    _type: 'block',
    _key: 'a24',
    style: 'normal',
    listItem: 'bullet',
    level: 1,
    children: [{ _type: 'span', _key: 'a24a', marks: [], text: 'IVA a 6%: 12.000 euros' }],
    markDefs: []
  },
  {
    _type: 'block',
    _key: 'a25',
    style: 'normal',
    listItem: 'bullet',
    level: 1,
    children: [
      { _type: 'span', _key: 'a25a', marks: [], text: 'Poupança: ' },
      { _type: 'span', _key: 'a25b', marks: ['strong'], text: '34.000 euros' }
    ],
    markDefs: []
  },
  {
    _type: 'block',
    _key: 'a26',
    style: 'normal',
    children: [{ _type: 'span', _key: 'a26a', marks: [], text: 'Esta poupança pode fazer a diferença no orçamento total da sua construção, permitindo investir em melhores acabamentos ou materiais de qualidade superior.' }],
    markDefs: []
  },
  {
    _type: 'block',
    _key: 'a27',
    style: 'h2',
    children: [{ _type: 'span', _key: 'a27a', marks: [], text: 'Conclusão' }],
    markDefs: []
  },
  {
    _type: 'block',
    _key: 'a28',
    style: 'normal',
    children: [{ _type: 'span', _key: 'a28a', marks: [], text: 'O IVA a 6% na construção é uma oportunidade real para quem quer construir casa em Portugal. Se cumprir os requisitos — habitação própria e permanente, valor até 648 mil euros, e prazos definidos — pode poupar milhares de euros. A medida está em vigor até 2029, por isso este é o momento certo para avançar com o seu projeto.' }],
    markDefs: []
  },
  {
    _type: 'block',
    _key: 'a29',
    style: 'normal',
    children: [{ _type: 'span', _key: 'a29a', marks: [], text: 'Precisa de ajuda para planear a sua construção? Contacte-nos para uma consulta gratuita e descubra como podemos ajudá-lo a concretizar o seu projeto com as melhores condições fiscais.' }],
    markDefs: []
  }
];

client.patch('8a2b3745-d7eb-45aa-86f8-29a557e80362')
  .set({ body: body })
  .commit()
  .then(updatedPost => {
    console.log('Artigo corrigido com sucesso!');
  })
  .catch(err => {
    console.error('Erro:', err.message);
  });
