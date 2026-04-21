const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'onxd36ek',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

client.fetch(`*[_type == 'post'] | order(publishedAt asc) { title, 'slug': slug.current, publishedAt }`)
  .then(posts => {
    console.log('\\n=== ARTIGOS NO SANITY (do mais antigo ao mais recente) ===\\n');
    posts.forEach((p, i) => {
      console.log((i+1) + '. ' + p.title);
      console.log('   Slug atual: ' + (p.slug || 'SEM SLUG'));
      console.log('');
    });
  });
