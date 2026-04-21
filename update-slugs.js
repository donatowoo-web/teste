const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'onxd36ek',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_TOKEN, // Precisa de token para escrita
});

const slugUpdates = [
  {
    oldSlug: 'o-que-e-o-lsf-entenda-o-sistema-de-estrutura-em-aco-leve',
    newSlug: 'o-que-e-lsf'
  },
  {
    oldSlug: 'casas-de-madeira-vs-lsf-guia-completo-2025-como-escolher-a-melhor-solucao-para-si',
    newSlug: 'guia-casas-madeira-lsf'
  },
  {
    oldSlug: 'arranha-ceus-de-madeira-o-que-a-europa-esta-a-provar',
    newSlug: 'arranha-ceus-madeira-europa-construcao-sustentavel'
  },
  {
    oldSlug: 'construcao-com-consciencia-como-o-aco-leve-esta-a-redefinir-a-sustentabilidade-nas-casas',
    newSlug: 'construcao-sustentavel-aco-leve'
  },
  {
    oldSlug: 'a-casa-que-cresce-consigo-o-novo-standard-para-quem-planeia-o-futuro',
    newSlug: 'a-casa-que-cresce-consigo'
  },
  {
    oldSlug: 'empresa-de-construcao-credivel-como-escolher-em-portugal-em-2026',
    newSlug: 'empresa-de-construcao-credivel-como-escolher'
  },
  {
    oldSlug: 'quanto-custa-uma-casa-em-lsf-em-2025',
    newSlug: 'esta-a-pensar-construir-em-lsf-descubra-porque-o-preco-da-casa-e-apenas-uma-parte-do-orcamento'
  }
];

async function updateSlugs() {
  console.log('\\n=== A atualizar slugs no Sanity ===\\n');

  for (const update of slugUpdates) {
    try {
      // Encontrar o documento pelo slug atual
      const doc = await client.fetch(
        `*[_type == 'post' && slug.current == $slug][0]{ _id, title }`,
        { slug: update.oldSlug }
      );

      if (!doc) {
        console.log(`❌ Não encontrado: ${update.oldSlug}`);
        continue;
      }

      // Atualizar o slug
      await client
        .patch(doc._id)
        .set({ 'slug.current': update.newSlug })
        .commit();

      console.log(`✓ ${doc.title}`);
      console.log(`  ${update.oldSlug} → ${update.newSlug}\\n`);

    } catch (err) {
      console.log(`❌ Erro ao atualizar ${update.oldSlug}: ${err.message}`);
    }
  }

  console.log('\\n=== Concluído ===\\n');
}

updateSlugs();
