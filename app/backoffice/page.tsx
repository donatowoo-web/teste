"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./backoffice.module.css";

// ─── Sanity Config ───
const PROJECT_ID = "onxd36ek";
const DATASET = "production";
const API_VERSION = "2024-01-01";
const TOKEN = process.env.NEXT_PUBLIC_SANITY_WRITE_TOKEN || "";
const BACKOFFICE_PW = process.env.NEXT_PUBLIC_BACKOFFICE_PASSWORD || "";

const SANITY_API = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}`;
const GH_DEPLOY_TOKEN = process.env.NEXT_PUBLIC_GH_DEPLOY_TOKEN || "";
const GH_REPO = process.env.NEXT_PUBLIC_GH_REPO || "";

// ─── Types ───
type SanityImage = {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
};

type Post = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  publishedAt?: string;
  mainImage?: { asset?: { _ref?: string; url?: string } };
  content?: any[];
};

type View = "login" | "list" | "editor";

// ─── Sanity Helpers ───
async function sanityFetch(query: string) {
  const url = `${SANITY_API}/data/query/${DATASET}?query=${encodeURIComponent(query)}&tag=backoffice`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${TOKEN}` },
    mode: "cors",
  });
  if (!res.ok) {
    // Fallback: try with CDN (no auth needed for reads)
    const cdnUrl = `https://${PROJECT_ID}.apicdn.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${encodeURIComponent(query)}`;
    const cdnRes = await fetch(cdnUrl);
    const cdnData = await cdnRes.json();
    return cdnData.result;
  }
  const data = await res.json();
  return data.result;
}

async function sanityMutate(mutations: any[]) {
  const res = await fetch(`${SANITY_API}/data/mutate/${DATASET}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ mutations }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.description || "Erro ao guardar");
  }
  return res.json();
}

async function uploadImage(file: File): Promise<string> {
  const res = await fetch(
    `${SANITY_API}/assets/images/${DATASET}?filename=${encodeURIComponent(file.name)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": file.type,
        Authorization: `Bearer ${TOKEN}`,
      },
      body: file,
    }
  );
  if (!res.ok) throw new Error("Erro ao enviar imagem");
  const data = await res.json();
  return data.document._id;
}

// ─── Portable Text ↔ HTML ───
function portableTextToHtml(blocks: any[]): string {
  if (!blocks || !Array.isArray(blocks)) return "<p><br></p>";
  return blocks
    .map((block) => {
      if (block._type === "image") {
        const url = block.asset?.url || "";
        return url ? `<img src="${url}" alt="${block.alt || ""}">` : "";
      }
      if (block._type !== "block") return "";

      const children = (block.children || [])
        .map((child: any) => {
          let text = child.text || "";
          text = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
          if (child.marks?.includes("strong")) text = `<strong>${text}</strong>`;
          if (child.marks?.includes("em")) text = `<em>${text}</em>`;
          if (child.marks?.includes("underline")) text = `<u>${text}</u>`;
          const linkMark = child.marks?.find(
            (m: string) =>
              block.markDefs?.find((d: any) => d._key === m && d._type === "link")
          );
          if (linkMark) {
            const def = block.markDefs.find((d: any) => d._key === linkMark);
            if (def) text = `<a href="${def.href}">${text}</a>`;
          }
          return text;
        })
        .join("");

      const style = block.style || "normal";
      if (block.listItem === "bullet") return `<li>${children}</li>`;
      if (block.listItem === "number") return `<li>${children}</li>`;
      if (style === "h2") return `<h2>${children}</h2>`;
      if (style === "h3") return `<h3>${children}</h3>`;
      if (style === "h4") return `<h4>${children}</h4>`;
      if (style === "blockquote") return `<blockquote>${children}</blockquote>`;
      return `<p>${children || "<br>"}</p>`;
    })
    .join("\n");
}

function htmlToPortableText(html: string): any[] {
  const div = document.createElement("div");
  div.innerHTML = html;
  const blocks: any[] = [];
  let listItems: any[] = [];

  function flushList() {
    blocks.push(...listItems);
    listItems = [];
  }

  function parseChildren(el: Element): any[] {
    const children: any[] = [];
    const markDefs: any[] = [];

    function walk(node: Node, marks: string[]) {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent || "";
        if (text) {
          children.push({
            _type: "span",
            _key: rand(),
            marks: [...marks],
            text,
          });
        }
        return;
      }
      if (node.nodeType !== Node.ELEMENT_NODE) return;
      const el = node as Element;
      const tag = el.tagName.toLowerCase();

      let newMarks = [...marks];
      if (tag === "strong" || tag === "b") newMarks.push("strong");
      else if (tag === "em" || tag === "i") newMarks.push("em");
      else if (tag === "u") newMarks.push("underline");
      else if (tag === "a") {
        const key = rand();
        markDefs.push({
          _key: key,
          _type: "link",
          href: el.getAttribute("href") || "",
        });
        newMarks.push(key);
      }

      for (const child of Array.from(el.childNodes)) {
        walk(child, newMarks);
      }
    }

    for (const child of Array.from(el.childNodes)) {
      walk(child, []);
    }

    if (children.length === 0) {
      children.push({ _type: "span", _key: rand(), marks: [], text: "" });
    }

    return [children, markDefs] as any;
  }

  for (const node of Array.from(div.childNodes)) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = (node.textContent || "").trim();
      if (text) {
        flushList();
        blocks.push({
          _type: "block",
          _key: rand(),
          style: "normal",
          children: [{ _type: "span", _key: rand(), marks: [], text }],
          markDefs: [],
        });
      }
      continue;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) continue;
    const el = node as Element;
    const tag = el.tagName.toLowerCase();

    if (tag === "ul" || tag === "ol") {
      flushList();
      for (const li of Array.from(el.children)) {
        if (li.tagName.toLowerCase() === "li") {
          const [children, markDefs] = parseChildren(li);
          listItems.push({
            _type: "block",
            _key: rand(),
            style: "normal",
            listItem: tag === "ul" ? "bullet" : "number",
            level: 1,
            children,
            markDefs,
          });
        }
      }
      flushList();
      continue;
    }

    if (tag === "li") {
      const [children, markDefs] = parseChildren(el);
      listItems.push({
        _type: "block",
        _key: rand(),
        style: "normal",
        listItem: "bullet",
        level: 1,
        children,
        markDefs,
      });
      continue;
    }

    flushList();

    if (tag === "img") {
      // Skip images in content for now - handle separately
      continue;
    }

    let style = "normal";
    if (tag === "h2") style = "h2";
    else if (tag === "h3") style = "h3";
    else if (tag === "h4") style = "h4";
    else if (tag === "blockquote") style = "blockquote";

    const [children, markDefs] = parseChildren(el);
    blocks.push({
      _type: "block",
      _key: rand(),
      style,
      children,
      markDefs,
    });
  }

  flushList();

  if (blocks.length === 0) {
    blocks.push({
      _type: "block",
      _key: rand(),
      style: "normal",
      children: [{ _type: "span", _key: rand(), marks: [], text: "" }],
      markDefs: [],
    });
  }

  return blocks;
}

function rand(): string {
  return Math.random().toString(36).substring(2, 10);
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 96);
}

// ─── Components ───

function StatusMessage({
  msg,
  isError,
}: {
  msg: string;
  isError?: boolean;
}) {
  if (!msg) return null;
  return (
    <div className={`${styles.statusMsg} ${isError ? styles.statusMsgError : ""}`}>
      {msg}
    </div>
  );
}

function ConfirmModal({
  title,
  message,
  onConfirm,
  onCancel,
}: {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className={styles.modalActions}>
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={onCancel}>
            Cancelar
          </button>
          <button className={`${styles.btn} ${styles.btnDanger}`} onClick={onConfirm}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Rich Text Editor ───
function RichEditor({
  initialHtml,
  editorRef,
}: {
  initialHtml: string;
  editorRef: React.RefObject<HTMLDivElement | null>;
}) {
  const exec = (cmd: string, value?: string) => {
    document.execCommand(cmd, false, value);
    editorRef.current?.focus();
  };

  const insertLink = () => {
    const url = prompt("URL do link:");
    if (url) exec("createLink", url);
  };

  const insertImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const assetId = await uploadImage(file);
        // Inserte a placeholder - will be handled on save
        const img = document.createElement("img");
        img.src = URL.createObjectURL(file);
        img.dataset.sanityAsset = assetId;
        img.style.maxWidth = "100%";
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
          const range = sel.getRangeAt(0);
          range.deleteContents();
          range.insertNode(img);
          range.collapse(false);
        }
      } catch {
        alert("Erro ao enviar imagem");
      }
    };
    input.click();
  };

  return (
    <div>
      <div className={styles.toolbar}>
        <button className={styles.toolbarBtn} onClick={() => exec("bold")} title="Negrito">
          <strong>B</strong>
        </button>
        <button className={styles.toolbarBtn} onClick={() => exec("italic")} title="Italico">
          <em>I</em>
        </button>
        <button className={styles.toolbarBtn} onClick={() => exec("underline")} title="Sublinhado">
          <u>U</u>
        </button>
        <div className={styles.toolbarSep} />
        <button
          className={styles.toolbarBtn}
          onClick={() => exec("formatBlock", "h2")}
          title="Titulo H2"
        >
          H2
        </button>
        <button
          className={styles.toolbarBtn}
          onClick={() => exec("formatBlock", "h3")}
          title="Titulo H3"
        >
          H3
        </button>
        <button
          className={styles.toolbarBtn}
          onClick={() => exec("formatBlock", "p")}
          title="Paragrafo"
        >
          P
        </button>
        <div className={styles.toolbarSep} />
        <button
          className={styles.toolbarBtn}
          onClick={() => exec("insertUnorderedList")}
          title="Lista"
        >
          &bull; Lista
        </button>
        <button
          className={styles.toolbarBtn}
          onClick={() => exec("insertOrderedList")}
          title="Lista numerada"
        >
          1. Lista
        </button>
        <div className={styles.toolbarSep} />
        <button
          className={styles.toolbarBtn}
          onClick={() => exec("formatBlock", "blockquote")}
          title="Citacao"
        >
          &ldquo; Citacao
        </button>
        <button className={styles.toolbarBtn} onClick={insertLink} title="Link">
          Link
        </button>
        <button className={styles.toolbarBtn} onClick={insertImage} title="Imagem no texto">
          Imagem
        </button>
      </div>
      <div
        ref={editorRef}
        className={styles.editorArea}
        contentEditable
        suppressContentEditableWarning
        dangerouslySetInnerHTML={{ __html: initialHtml }}
      />
    </div>
  );
}

// ─── Main Backoffice ───
export default function BackofficePage() {
  const [view, setView] = useState<View>("login");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [statusError, setStatusError] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Post | null>(null);

  // Editor state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [existingImageRef, setExistingImageRef] = useState("");
  const [saving, setSaving] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const [editorHtml, setEditorHtml] = useState("<p><br></p>");

  const showStatus = useCallback((msg: string, isError = false) => {
    setStatus(msg);
    setStatusError(isError);
    setTimeout(() => setStatus(""), 3000);
  }, []);

  // Check saved session
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("backoffice_auth");
      if (saved === "true") {
        setView("list");
      }
    }
  }, []);

  // Fetch posts
  useEffect(() => {
    if (view === "list") loadPosts();
  }, [view]);

  async function loadPosts() {
    setLoading(true);
    try {
      const data = await sanityFetch(`
        *[_type == "post" && !(_id in path("drafts.**"))] | order(publishedAt desc) {
          _id, title, slug, excerpt, publishedAt,
          mainImage { asset->{ _ref, url } },
          content
        }
      `);
      setPosts(data || []);
    } catch (e) {
      showStatus("Erro ao carregar artigos", true);
    }
    setLoading(false);
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === BACKOFFICE_PW) {
      sessionStorage.setItem("backoffice_auth", "true");
      setView("list");
      setLoginError("");
    } else {
      setLoginError("Password incorreta");
    }
  }

  const [deploying, setDeploying] = useState(false);

  async function handleDeploy() {
    if (deploying) return;
    setDeploying(true);
    showStatus("A iniciar deploy...");
    try {
      // Trigger GitHub Actions workflow
      const res = await fetch(
        `https://api.github.com/repos/${GH_REPO}/actions/workflows/deploy.yml/dispatches`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${GH_DEPLOY_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ref: "main" }),
        }
      );
      if (res.status === 204 || res.ok) {
        showStatus("Deploy iniciado! O site sera atualizado em 2-3 minutos.");
      } else {
        const data = await res.json().catch(() => ({}));
        showStatus(data.message || `Erro no deploy (${res.status})`, true);
      }
    } catch (e: any) {
      showStatus("Erro ao iniciar deploy: " + (e.message || ""), true);
    }
    setDeploying(false);
  }

  function handleLogout() {
    sessionStorage.removeItem("backoffice_auth");
    setView("login");
    setPassword("");
  }

  function openNewPost() {
    setEditingPost(null);
    setTitle("");
    setSlug("");
    setExcerpt("");
    setImageFile(null);
    setImagePreview("");
    setExistingImageRef("");
    setEditorHtml("<p><br></p>");
    setView("editor");
  }

  function openEditPost(post: Post) {
    setEditingPost(post);
    setTitle(post.title);
    setSlug(post.slug.current);
    setExcerpt(post.excerpt || "");
    setImageFile(null);
    setImagePreview(post.mainImage?.asset?.url || "");
    setExistingImageRef(post.mainImage?.asset?._ref || "");
    setEditorHtml(portableTextToHtml(post.content || []));
    setView("editor");
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setExistingImageRef("");
    }
  }

  async function handleSave() {
    if (!title.trim()) {
      showStatus("O titulo e obrigatorio", true);
      return;
    }

    const finalSlug = slug || slugify(title);

    setSaving(true);
    try {
      // Upload image if new
      let imageRef = existingImageRef;
      if (imageFile) {
        imageRef = await uploadImage(imageFile);
      }

      if (!imageRef) {
        showStatus("A imagem e obrigatoria", true);
        setSaving(false);
        return;
      }

      // Parse content from editor
      const html = editorRef.current?.innerHTML || "";
      const content = htmlToPortableText(html);

      // Also extract inline images from content
      const inlineImages = editorRef.current?.querySelectorAll("img[data-sanity-asset]");
      if (inlineImages) {
        inlineImages.forEach((img) => {
          const assetId = (img as HTMLImageElement).dataset.sanityAsset;
          if (assetId) {
            content.push({
              _type: "image",
              _key: rand(),
              asset: { _type: "reference", _ref: assetId },
            });
          }
        });
      }

      const doc: any = {
        _type: "post",
        title: title.trim(),
        slug: { _type: "slug", current: finalSlug },
        excerpt: excerpt.trim() || undefined,
        publishedAt: editingPost
          ? undefined
          : new Date().toISOString(),
        mainImage: {
          _type: "image",
          asset: { _type: "reference", _ref: imageRef },
        },
        content,
      };

      // Remove undefined fields
      Object.keys(doc).forEach((k) => doc[k] === undefined && delete doc[k]);

      if (editingPost) {
        await sanityMutate([
          {
            patch: {
              id: editingPost._id,
              set: doc,
            },
          },
        ]);
        showStatus("Artigo atualizado!");
      } else {
        await sanityMutate([
          {
            create: {
              ...doc,
              _id: `post-${rand()}`,
            },
          },
        ]);
        showStatus("Artigo criado!");
      }

      setView("list");
    } catch (e: any) {
      showStatus(e.message || "Erro ao guardar", true);
    }
    setSaving(false);
  }

  async function handleDelete(post: Post) {
    setConfirmDelete(null);
    setLoading(true);
    try {
      await sanityMutate([{ delete: { id: post._id } }]);
      showStatus("Artigo eliminado");
      loadPosts();
    } catch (e: any) {
      showStatus(e.message || "Erro ao eliminar", true);
    }
    setLoading(false);
  }

  // ─── Render ───

  if (view === "login") {
    return (
      <div className={styles.container}>
        <div className={styles.loginWrapper}>
          <form className={styles.loginBox} onSubmit={handleLogin}>
            <h1>Backoffice</h1>
            <p>EVAPLACE - Gestao de conteudos</p>
            {loginError && <div className={styles.loginError}>{loginError}</div>}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} style={{ width: "100%" }}>
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (view === "editor") {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>{editingPost ? "Editar Artigo" : "Novo Artigo"}</h1>
          <div className={styles.headerActions}>
            <button
              className={`${styles.btn} ${styles.btnSecondary}`}
              onClick={() => setView("list")}
            >
              Cancelar
            </button>
            <button
              className={`${styles.btn} ${styles.btnPrimary}`}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "A guardar..." : "Guardar"}
            </button>
          </div>
        </div>

        <div className={styles.editor}>
          <div className={styles.field}>
            <label>Titulo</label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!editingPost) setSlug(slugify(e.target.value));
              }}
              placeholder="Titulo do artigo"
            />
          </div>

          <div className={styles.field}>
            <label>Slug (URL)</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="url-do-artigo"
            />
          </div>

          <div className={styles.field}>
            <label>Resumo</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Breve resumo para a listagem do blog"
              rows={3}
            />
          </div>

          <div className={styles.field}>
            <label>Imagem de capa</label>
            {imagePreview ? (
              <div className={styles.imagePreview}>
                <img src={imagePreview} alt="Preview" />
                <button
                  className={styles.removeImage}
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview("");
                    setExistingImageRef("");
                  }}
                >
                  X
                </button>
              </div>
            ) : (
              <div className={styles.imageUpload}>
                <input type="file" accept="image/*" onChange={handleImageChange} />
                <p>Clique para escolher uma imagem</p>
              </div>
            )}
          </div>

          <div className={styles.field}>
            <label>Conteudo</label>
            <RichEditor initialHtml={editorHtml} editorRef={editorRef} />
          </div>
        </div>

        <StatusMessage msg={status} isError={statusError} />
      </div>
    );
  }

  // LIST VIEW
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Backoffice EVAPLACE</h1>
        <div className={styles.headerActions}>
          <button
            className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSmall}`}
            onClick={handleDeploy}
            disabled={deploying}
          >
            {deploying ? "A publicar..." : "Publicar Site"}
          </button>
          <button className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSmall}`} onClick={handleLogout}>
            Sair
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.listHeader}>
          <h2>Artigos ({posts.length})</h2>
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={openNewPost}>
            Novo Artigo
          </button>
        </div>

        {loading ? (
          <div className={styles.loading}>
            <span className={styles.spinner} />
            A carregar...
          </div>
        ) : posts.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Ainda nao existem artigos.</p>
            <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={openNewPost}>
              Criar primeiro artigo
            </button>
          </div>
        ) : (
          <div className={styles.postList}>
            {posts.map((post) => (
              <div key={post._id} className={styles.postItem} onClick={() => openEditPost(post)}>
                <div className={styles.postThumb}>
                  {post.mainImage?.asset?.url && (
                    <img src={post.mainImage.asset.url} alt="" />
                  )}
                </div>
                <div className={styles.postInfo}>
                  <h3>{post.title}</h3>
                  <span>
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString("pt-PT")
                      : "Sem data"}
                  </span>
                </div>
                <div className={styles.postActions}>
                  <button
                    className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSmall}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditPost(post);
                    }}
                  >
                    Editar
                  </button>
                  <button
                    className={`${styles.btn} ${styles.btnDanger} ${styles.btnSmall}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmDelete(post);
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {confirmDelete && (
        <ConfirmModal
          title="Eliminar artigo"
          message={`Tem a certeza que quer eliminar "${confirmDelete.title}"? Esta acao nao pode ser revertida.`}
          onConfirm={() => handleDelete(confirmDelete)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      <StatusMessage msg={status} isError={statusError} />
    </div>
  );
}
