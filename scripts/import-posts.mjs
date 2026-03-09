import { createClient } from "@sanity/client";
import csvParser from "csv-parser";
import { createReadStream } from "fs";
import { parse as parseHTML } from "node-html-parser";
import https from "https";
import http from "http";

// ============================================
// CONFIGURAÇÃO
// ============================================
const SANITY_TOKEN = "sk6vpz7R9TVYeNEgivNUuTR8l0h7y3BS9Fk6behAJI09zi4zDIAFrJwYtMitoUxYM8ke9XbXZe4aJQkLatcTQTWeffg0lFf5ztajEnIOrFAZ6yrnoat3Jah0fSthB9uL6SEQZJBAuuJGUmXrTHmKa2Z5TfO1m1kfCDcN4C6ZdXkiuISBfOPH";

const client = createClient({
  projectId: "onxd36ek",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: SANITY_TOKEN,
  useCdn: false,
});

const CSV_PATH = process.argv[2] || "C:\\Users\\pc\\Desktop\\Artigos-Export-2026-January-28-1112.csv";

// Cache de imagens já uploaded (evita duplicados)
const imageCache = new Map();

// Cache de slugs existentes (título -> slug)
const existingSlugs = new Map();

// Cache de imagens existentes no Sanity (url -> asset)
const existingImages = new Map();

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

// Buscar slugs e imagens existentes do Sanity
async function loadExistingData() {
  console.log("📋 A carregar dados existentes do Sanity...");

  // Buscar posts com slugs
  const posts = await client.fetch(`*[_type == "post"]{title, "slug": slug.current, "imageRef": mainImage.asset._ref}`);
  for (const post of posts) {
    if (post.title && post.slug) {
      existingSlugs.set(post.title, post.slug);
    }
  }
  console.log(`   ✓ ${existingSlugs.size} slugs carregados`);

  // Buscar todos os assets de imagem
  const assets = await client.fetch(`*[_type == "sanity.imageAsset"]{_id, originalFilename, url}`);
  for (const asset of assets) {
    if (asset.url) {
      // Guardar por URL e por filename
      existingImages.set(asset.url, asset);
      if (asset.originalFilename) {
        existingImages.set(asset.originalFilename, asset);
      }
    }
  }
  console.log(`   ✓ ${assets.length} imagens carregadas\n`);
}

function createSlug(title) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 96);
}

function generateKey() {
  return Math.random().toString(36).substr(2, 12);
}

// Download e upload de imagem para Sanity
async function uploadImageFromUrl(url) {
  if (!url || !url.startsWith("http")) return null;

  // Limpar URL
  url = url.split(" ")[0].trim();

  // Verificar cache local
  if (imageCache.has(url)) {
    return imageCache.get(url);
  }

  // Verificar se já existe no Sanity (por URL ou filename)
  const filename = url.split("/").pop().split("?")[0] || "image.jpg";
  if (existingImages.has(filename)) {
    const existing = existingImages.get(filename);
    console.log(`     ♻️  Reutilizando imagem existente: ${filename}`);
    imageCache.set(url, existing);
    return existing;
  }

  return new Promise((resolve) => {
    const protocol = url.startsWith("https") ? https : http;

    const request = protocol.get(url, { timeout: 30000 }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        uploadImageFromUrl(response.headers.location).then(resolve);
        return;
      }

      if (response.statusCode !== 200) {
        resolve(null);
        return;
      }

      const chunks = [];
      response.on("data", (chunk) => chunks.push(chunk));
      response.on("end", async () => {
        try {
          const buffer = Buffer.concat(chunks);
          if (buffer.length < 1000) {
            resolve(null);
            return;
          }

          const filename = url.split("/").pop().split("?")[0] || "image.jpg";
          const asset = await client.assets.upload("image", buffer, { filename });

          imageCache.set(url, asset);
          resolve(asset);
        } catch (err) {
          resolve(null);
        }
      });
      response.on("error", () => resolve(null));
    });

    request.on("error", () => resolve(null));
    request.on("timeout", () => {
      request.destroy();
      resolve(null);
    });
  });
}

// Converter HTML para Portable Text COM IMAGENS
async function htmlToPortableText(html) {
  if (!html) return [];

  const root = parseHTML(html);
  const blocks = [];

  // Função para processar texto e marcas inline
  function getTextSpans(element) {
    const spans = [];

    function processNode(node, marks = []) {
      if (node.nodeType === 3) {
        const text = node.text;
        if (text && text.trim()) {
          spans.push({
            _type: "span",
            _key: generateKey(),
            text: text,
            marks: [...marks],
          });
        }
        return;
      }

      if (node.nodeType !== 1) return;

      const tag = node.tagName?.toLowerCase();
      let newMarks = [...marks];

      if (tag === "strong" || tag === "b") newMarks.push("strong");
      if (tag === "em" || tag === "i") newMarks.push("em");

      for (const child of node.childNodes || []) {
        processNode(child, newMarks);
      }
    }

    processNode(element);
    return spans;
  }

  // Processar elementos recursivamente
  async function processElement(element) {
    if (!element || element.nodeType !== 1) return;

    const tag = element.tagName?.toLowerCase();

    // IMAGENS - fazer upload e criar bloco
    if (tag === "img") {
      const src = element.getAttribute("src");
      if (src && src.startsWith("http")) {
        const asset = await uploadImageFromUrl(src);
        if (asset) {
          blocks.push({
            _type: "image",
            _key: generateKey(),
            asset: {
              _type: "reference",
              _ref: asset._id,
            },
            alt: element.getAttribute("alt") || "",
          });
        }
      }
      return;
    }

    // Headers
    if (["h1", "h2", "h3", "h4"].includes(tag)) {
      const spans = getTextSpans(element);
      if (spans.length > 0) {
        blocks.push({
          _type: "block",
          _key: generateKey(),
          style: tag,
          children: spans,
          markDefs: [],
        });
      }
      return;
    }

    // Parágrafos
    if (tag === "p") {
      // Verificar se tem imagens dentro
      const images = element.querySelectorAll("img");
      for (const img of images) {
        await processElement(img);
      }

      const spans = getTextSpans(element);
      if (spans.length > 0) {
        blocks.push({
          _type: "block",
          _key: generateKey(),
          style: "normal",
          children: spans,
          markDefs: [],
        });
      }
      return;
    }

    // Listas
    if (tag === "ul" || tag === "ol") {
      const listItems = element.querySelectorAll("li");
      for (const li of listItems) {
        const spans = getTextSpans(li);
        if (spans.length > 0) {
          blocks.push({
            _type: "block",
            _key: generateKey(),
            style: "normal",
            listItem: "bullet",
            level: 1,
            children: spans,
            markDefs: [],
          });
        }
      }
      return;
    }

    // Divs e outros containers - processar filhos
    if (["div", "section", "article", "figure", "figcaption", "span", "a"].includes(tag)) {
      for (const child of element.childNodes || []) {
        if (child.nodeType === 1) {
          await processElement(child);
        } else if (child.nodeType === 3 && child.text.trim()) {
          // Texto solto
          blocks.push({
            _type: "block",
            _key: generateKey(),
            style: "normal",
            children: [{
              _type: "span",
              _key: generateKey(),
              text: child.text.trim(),
              marks: [],
            }],
            markDefs: [],
          });
        }
      }
      return;
    }

    // Outros elementos - processar filhos
    for (const child of element.childNodes || []) {
      if (child.nodeType === 1) {
        await processElement(child);
      }
    }
  }

  // Processar todos os elementos do root
  for (const child of root.childNodes) {
    if (child.nodeType === 1) {
      await processElement(child);
    }
  }

  // Se não houver blocos, criar um com o texto
  if (blocks.length === 0) {
    const text = root.text.trim();
    if (text) {
      blocks.push({
        _type: "block",
        _key: generateKey(),
        style: "normal",
        children: [{
          _type: "span",
          _key: generateKey(),
          text,
          marks: [],
        }],
        markDefs: [],
      });
    }
  }

  return blocks;
}

// Extrair primeira imagem válida
function getMainImageUrl(content, imageUrls) {
  if (imageUrls) {
    const firstUrl = imageUrls.split("|")[0];
    if (firstUrl && firstUrl.startsWith("http")) {
      return firstUrl.split(" ")[0].trim();
    }
  }

  const root = parseHTML(content || "");
  const img = root.querySelector("img");
  if (img) {
    const src = img.getAttribute("src");
    if (src && src.startsWith("http")) {
      return src.split(" ")[0].trim();
    }
  }

  return null;
}

// Apagar posts existentes
async function deleteExistingPosts() {
  console.log("🗑️  A apagar posts existentes...");

  const posts = await client.fetch(`*[_type == "post"]._id`);

  if (posts.length === 0) {
    console.log("   Nenhum post para apagar.\n");
    return;
  }

  for (const id of posts) {
    await client.delete(id);
  }

  console.log(`   Apagados ${posts.length} posts.\n`);
}

// ============================================
// FUNÇÃO PRINCIPAL
// ============================================

async function importPosts() {
  console.log("🚀 Iniciando importação de posts COM IMAGENS...\n");

  // Carregar dados existentes (slugs e imagens) ANTES de apagar
  await loadExistingData();

  // Apagar posts existentes (mas não as imagens!)
  await deleteExistingPosts();

  const posts = [];

  // Ler CSV
  await new Promise((resolve, reject) => {
    createReadStream(CSV_PATH, { encoding: "utf-8" })
      .pipe(csvParser())
      .on("data", (row) => posts.push(row))
      .on("end", resolve)
      .on("error", reject);
  });

  console.log(`📚 Encontrados ${posts.length} artigos\n`);

  let success = 0;
  let failed = 0;

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const title = post.Title || post.title;
    const content = post.Content || post.content;
    const imageUrls = post["Image URL"] || post.image_url || "";

    if (!title) {
      console.log(`⚠ Post ${i + 1}: Sem título, ignorado`);
      failed++;
      continue;
    }

    console.log(`\n[${i + 1}/${posts.length}] ${title.substring(0, 50)}...`);

    try {
      // 1. Upload da imagem principal
      const mainImageUrl = getMainImageUrl(content, imageUrls);
      let mainImageAsset = null;

      if (mainImageUrl) {
        console.log(`  📷 Imagem principal...`);
        mainImageAsset = await uploadImageFromUrl(mainImageUrl);
        if (mainImageAsset) {
          console.log(`     ✓ OK`);
        }
      }

      // 2. Converter conteúdo para Portable Text (com imagens)
      console.log(`  📝 A converter conteúdo e imagens...`);
      const body = await htmlToPortableText(content);
      console.log(`     ✓ ${body.length} blocos criados`);

      // 3. Criar o documento - usar slug existente se disponível
      const slug = existingSlugs.get(title) || createSlug(title);
      if (existingSlugs.has(title)) {
        console.log(`  🔗 Usando slug existente: ${slug}`);
      }

      const doc = {
        _type: "post",
        title,
        slug: { _type: "slug", current: slug },
        publishedAt: new Date().toISOString(),
        body,
      };

      if (mainImageAsset) {
        doc.mainImage = {
          _type: "image",
          asset: { _type: "reference", _ref: mainImageAsset._id },
          alt: title,
        };
      }

      // 4. Criar no Sanity
      console.log(`  💾 A criar post...`);
      const result = await client.create(doc);
      console.log(`  ✅ Criado: ${result._id}`);
      success++;

    } catch (err) {
      console.log(`  ❌ Erro: ${err.message}`);
      failed++;
    }

    // Pausa entre posts
    await new Promise((r) => setTimeout(r, 300));
  }

  console.log("\n" + "=".repeat(50));
  console.log(`✅ Importação concluída!`);
  console.log(`   Sucesso: ${success}`);
  console.log(`   Falhados: ${failed}`);
  console.log(`   Imagens em cache: ${imageCache.size}`);
  console.log("=".repeat(50));
}

importPosts().catch(console.error);
