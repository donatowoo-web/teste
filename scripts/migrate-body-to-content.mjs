const TOKEN = 'skWJsnmyBzOJdg9WKmpF2bcmE01krZGkASWlLqKFH1hRy2gu5Uwd0zju3kRY5toF04MCtfe476SbnZQp6qYFBPl7lZ2fVQF7JGi0Ne414PWrwJyA4KJk0Mf1LyfDhR53lTZzwh8N4kR61LrSXdncboqyiFuQ1YLC1BeLn2vMuZoRQaI5Itwz';
const PROJECT = 'onxd36ek';
const DATASET = 'production';
const API = `https://${PROJECT}.api.sanity.io/v2024-01-01`;

async function run() {
  const q = encodeURIComponent('*[_type=="post" && defined(body)] { _id, title, body }');
  const res = await fetch(`${API}/data/query/${DATASET}?query=${q}`, {
    headers: { Authorization: `Bearer ${TOKEN}` }
  });
  const data = await res.json();
  const posts = data.result || [];
  console.log(`Posts with body field: ${posts.length}`);

  if (posts.length === 0) {
    console.log('Nothing to migrate.');
    return;
  }

  const mutations = [];
  for (const post of posts) {
    mutations.push({
      patch: {
        id: post._id,
        set: { content: post.body },
        unset: ['body']
      }
    });
    console.log(`  - ${post.title}`);
  }

  const mutRes = await fetch(`${API}/data/mutate/${DATASET}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`
    },
    body: JSON.stringify({ mutations })
  });

  if (mutRes.ok) {
    console.log(`\nDone! ${posts.length} posts migrated: body -> content`);
  } else {
    const err = await mutRes.json();
    console.log('FAILED:', JSON.stringify(err, null, 2));
  }
}

run();
