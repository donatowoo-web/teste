import { createClient } from 'next-sanity';

const client = createClient({
  projectId: 'onxd36ek',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.NEXT_PUBLIC_SANITY_WRITE_TOKEN || process.env.SANITY_WRITE_TOKEN,
});

const slug = 'casas-pre-fabricadas-vs-casas-modulares-o-que-sao-e-o-que-realmente-difere-em-2026';

const post = await client.fetch(
  `*[_type=='post' && slug.current == $slug && !(_id in path('drafts.**'))][0]{_id, 'rawText': coalesce(content,body)[1].children[0].text}`,
  { slug }
);

const text = post.rawText;
const lines = text.split('\n').map(l => l.trim()).filter(l => l);

// Known headings from the article structure
const headings = new Set([
  'A confusão que ainda existe',
  'O que é, afinal, uma casa pré-fabricada?',
  'E o que é uma casa modular?',
  'Onde está a diferença?',
  'Comparação simplificada',
  'O erro mais comum em 2026',
  'Conclusão: decidir com clareza',
]);

// Table data
const tableHeader = ['Sistema', 'Produção', 'Transporte', 'Flexibilidade arquitetónica', 'Logística', 'Terrenos inclinados ou complexos'];
const tableRows = [
  ['Pré-fabricada', 'Elementos', 'Painéis e componentes', 'Elevada', 'Mais flexível', 'Maior capacidade de adaptação'],
  ['Modular', 'Volumes completos', 'Blocos tridimensionais', 'Condicionada à dimensão e lógica do módulo', 'Pode exigir transporte especial e acessos adequados', 'Pode exigir soluções adicionais'],
];

// List items from the article
const listSections = {
  'Esses componentes podem incluir:': [
    'Painéis estruturais',
    'Estruturas em aço leve (LSF)',
    'Estruturas em madeira',
    'Painéis de betão',
    'Elementos de cobertura produzidos em fábrica',
  ],
  'Inclui normalmente:': [
    'Estrutura',
    'Instalações elétricas',
    'Canalizações',
    'Revestimentos',
    'Muitas vezes cozinha e casa de banho instaladas',
  ],
  'como por exemplo:': [
    'Transporte',
    'Flexibilidade arquitetónica',
    'Adaptação ao terreno',
    'Logística',
    'Integração das especialidades',
  ],
  'Deve ser analisado à luz do contexto real:': [
    'Acessos ao terreno',
    'Largura das vias',
    'Existência de cabos de média tensão',
    'Inclinação',
    'Limitações de manobra para transporte pesado',
    'Regulamentos municipais',
  ],
};

// All list items as a flat set for skipping
const allListItems = new Set(Object.values(listSections).flat());

// Table cell values to skip
const tableCells = new Set([...tableHeader, ...tableRows.flat()]);

let keyCounter = 0;
function genKey() {
  return `fix${(keyCounter++).toString(36).padStart(4, '0')}`;
}

function makeBlock(text, style = 'normal') {
  return {
    _type: 'block',
    _key: genKey(),
    style,
    markDefs: [],
    children: [{ _type: 'span', _key: genKey(), marks: [], text }],
  };
}

function makeList(items) {
  return items.map(item => ({
    _type: 'block',
    _key: genKey(),
    style: 'normal',
    listItem: 'bullet',
    level: 1,
    markDefs: [],
    children: [{ _type: 'span', _key: genKey(), marks: [], text: item }],
  }));
}

const blocks = [];

// Skip the first line (it's the title, already in post.title)
let i = 1;
// Lead paragraph
blocks.push(makeBlock(lines[i], 'normal'));
i++;

while (i < lines.length) {
  const line = lines[i];

  // Skip table cells and list items (they're handled inline)
  if (tableCells.has(line) || allListItems.has(line)) {
    i++;
    continue;
  }

  // Check if it's a heading
  if (headings.has(line)) {
    blocks.push(makeBlock(line, 'h2'));
    i++;
    continue;
  }

  // Check if line introduces a list
  let isList = false;
  for (const [trigger, items] of Object.entries(listSections)) {
    if (line.includes(trigger) || line.endsWith(trigger)) {
      blocks.push(makeBlock(line, 'normal'));
      blocks.push(...makeList(items));
      isList = true;
      break;
    }
  }
  if (isList) { i++; continue; }

  // Check if this is the table section intro
  if (line === 'Comparação simplificada') {
    i++;
    continue;
  }

  // Regular paragraph
  blocks.push(makeBlock(line, 'normal'));
  i++;
}

// Determine which field to use
const fieldCheck = await client.fetch(
  `*[_type=='post' && slug.current == $slug && !(_id in path('drafts.**'))][0]{"hasContent": defined(content), "hasBody": defined(body)}`,
  { slug }
);

const field = fieldCheck.hasContent ? 'content' : 'body';

console.log(`Updating ${post._id} field "${field}" with ${blocks.length} blocks...`);

await client
  .patch(post._id)
  .set({ [field]: blocks })
  .commit();

console.log('Done!');
