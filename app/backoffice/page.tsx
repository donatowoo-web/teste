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

type View = "login" | "list" | "editor" | "pages" | "page-builder";

// ─── Page Builder Types ───
type SectionType = "heading" | "text" | "image" | "spacer" | "two-columns" | "video" | "button";

type PageSection = {
  _key: string;
  type: SectionType;
  content?: string;
  heading?: string;
  headingLevel?: "h1" | "h2" | "h3";
  imageUrl?: string;
  imageRef?: string;
  imageAlt?: string;
  height?: number;
  leftContent?: string;
  rightContent?: string;
  videoUrl?: string;
  buttonText?: string;
  buttonUrl?: string;
  buttonStyle?: "primary" | "secondary" | "outline";
  backgroundColor?: string;
  textAlign?: "left" | "center" | "right";
  fullWidth?: boolean;
};

type PageDoc = {
  _id: string;
  title: string;
  slug: { current: string };
  published?: boolean;
  sectionsData?: string;
};

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

// ─── Content Editor (Visual + HTML + Preview) ───
function ContentEditor({
  initialHtml,
  editorRef,
  htmlCode,
  setHtmlCode,
}: {
  initialHtml: string;
  editorRef: React.RefObject<HTMLDivElement | null>;
  htmlCode: string;
  setHtmlCode: (v: string) => void;
}) {
  const [mode, setMode] = useState<"visual" | "html" | "preview">("visual");

  useEffect(() => {
    setHtmlCode(initialHtml);
  }, [initialHtml]);

  // Sync between modes
  function switchMode(newMode: "visual" | "html" | "preview") {
    if (mode === "visual" && editorRef.current) {
      setHtmlCode(editorRef.current.innerHTML);
    }
    if (mode === "html" && newMode === "visual" && editorRef.current) {
      // will be set via dangerouslySetInnerHTML on re-render
    }
    setMode(newMode);
  }

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
        {/* Mode tabs */}
        <button
          className={`${styles.toolbarBtn} ${mode === "visual" ? styles.toolbarBtnActive : ""}`}
          onClick={() => switchMode("visual")}
        >
          Visual
        </button>
        <button
          className={`${styles.toolbarBtn} ${mode === "html" ? styles.toolbarBtnActive : ""}`}
          onClick={() => switchMode("html")}
        >
          &lt;/&gt; HTML
        </button>
        <button
          className={`${styles.toolbarBtn} ${mode === "preview" ? styles.toolbarBtnActive : ""}`}
          onClick={() => switchMode("preview")}
        >
          Preview
        </button>
        {mode === "visual" && (
          <>
            <div className={styles.toolbarSep} />
            <button className={styles.toolbarBtn} onClick={() => exec("bold")} title="Negrito">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>
            </button>
            <button className={styles.toolbarBtn} onClick={() => exec("italic")} title="Itálico">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>
            </button>
            <button className={styles.toolbarBtn} onClick={() => exec("underline")} title="Sublinhado">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/><line x1="4" y1="21" x2="20" y2="21"/></svg>
            </button>
            <div className={styles.toolbarSep} />
            <button className={styles.toolbarBtn} onClick={() => exec("formatBlock", "h2")} title="Título H2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><text x="0" y="17" fontSize="14" fontWeight="bold" fontFamily="sans-serif">H2</text></svg>
            </button>
            <button className={styles.toolbarBtn} onClick={() => exec("formatBlock", "h3")} title="Título H3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><text x="0" y="17" fontSize="14" fontWeight="bold" fontFamily="sans-serif">H3</text></svg>
            </button>
            <button className={styles.toolbarBtn} onClick={() => exec("formatBlock", "p")} title="Parágrafo">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 4v16"/><path d="M17 4v16"/><path d="M13 4H9a4 4 0 0 0 0 8h4"/></svg>
            </button>
            <div className={styles.toolbarSep} />
            <button className={styles.toolbarBtn} onClick={() => exec("insertUnorderedList")} title="Lista">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1.5" fill="currentColor"/><circle cx="4" cy="12" r="1.5" fill="currentColor"/><circle cx="4" cy="18" r="1.5" fill="currentColor"/></svg>
            </button>
            <button className={styles.toolbarBtn} onClick={() => exec("insertOrderedList")} title="Lista numerada">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="10" y1="6" x2="20" y2="6"/><line x1="10" y1="12" x2="20" y2="12"/><line x1="10" y1="18" x2="20" y2="18"/><text x="2" y="9" fontSize="8" fill="currentColor" stroke="none" fontFamily="sans-serif">1</text><text x="2" y="15" fontSize="8" fill="currentColor" stroke="none" fontFamily="sans-serif">2</text><text x="2" y="21" fontSize="8" fill="currentColor" stroke="none" fontFamily="sans-serif">3</text></svg>
            </button>
            <div className={styles.toolbarSep} />
            <button className={styles.toolbarBtn} onClick={() => exec("formatBlock", "blockquote")} title="Citação">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>
            </button>
            <button className={styles.toolbarBtn} onClick={insertLink} title="Link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            </button>
            <button className={styles.toolbarBtn} onClick={insertImage} title="Imagem">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            </button>
          </>
        )}
      </div>
      {mode === "visual" && (
        <div
          ref={editorRef}
          className={styles.editorArea}
          contentEditable
          suppressContentEditableWarning
          dangerouslySetInnerHTML={{ __html: htmlCode }}
        />
      )}
      {mode === "html" && (
        <textarea
          className={styles.htmlArea}
          value={htmlCode}
          onChange={(e) => setHtmlCode(e.target.value)}
          spellCheck={false}
        />
      )}
      {mode === "preview" && (
        <div
          className={styles.editorArea}
          dangerouslySetInnerHTML={{ __html: htmlCode }}
        />
      )}
    </div>
  );
}

// ─── Section Widget Definitions ───
const SECTION_WIDGETS: { type: SectionType; label: string; icon: string; desc: string }[] = [
  { type: "heading", label: "Título", icon: "T", desc: "Título de secção" },
  { type: "text", label: "Texto", icon: "¶", desc: "Bloco de texto rico" },
  { type: "image", label: "Imagem", icon: "🖼", desc: "Imagem com legenda" },
  { type: "spacer", label: "Espaçador", icon: "↕", desc: "Espaço vertical" },
  { type: "two-columns", label: "2 Colunas", icon: "▥", desc: "Texto em duas colunas" },
  { type: "video", label: "Vídeo", icon: "▶", desc: "Vídeo do YouTube" },
  { type: "button", label: "Botão", icon: "⬛", desc: "Botão com link" },
];

function createSection(type: SectionType): PageSection {
  const base = { _key: rand(), type };
  switch (type) {
    case "heading": return { ...base, heading: "Novo Título", headingLevel: "h2", textAlign: "left" };
    case "text": return { ...base, content: "<p>Escreva aqui o seu texto...</p>", textAlign: "left" };
    case "image": return { ...base, imageUrl: "", imageRef: "", imageAlt: "", fullWidth: false };
    case "spacer": return { ...base, height: 60 };
    case "two-columns": return { ...base, leftContent: "<p>Coluna esquerda</p>", rightContent: "<p>Coluna direita</p>" };
    case "video": return { ...base, videoUrl: "" };
    case "button": return { ...base, buttonText: "Clique aqui", buttonUrl: "#", buttonStyle: "primary" };
    default: return base;
  }
}

// ─── Section Editor ───
function SectionEditor({
  section,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: {
  section: PageSection;
  onChange: (s: PageSection) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  const widget = SECTION_WIDGETS.find((w) => w.type === section.type);

  function renderPreview() {
    switch (section.type) {
      case "heading":
        return (
          <div style={{ textAlign: section.textAlign || "left" }}>
            {section.headingLevel === "h1" && <h1 style={{ margin: 0, fontSize: 28 }}>{section.heading}</h1>}
            {section.headingLevel === "h2" && <h2 style={{ margin: 0, fontSize: 24 }}>{section.heading}</h2>}
            {section.headingLevel === "h3" && <h3 style={{ margin: 0, fontSize: 20 }}>{section.heading}</h3>}
          </div>
        );
      case "text":
        return <div dangerouslySetInnerHTML={{ __html: section.content || "" }} style={{ textAlign: section.textAlign || "left", lineHeight: 1.7 }} />;
      case "image":
        return section.imageUrl ? (
          <div style={{ textAlign: "center" }}>
            <img src={section.imageUrl} alt={section.imageAlt || ""} style={{ maxWidth: section.fullWidth ? "100%" : "80%", height: "auto", borderRadius: 4 }} />
            {section.imageAlt && <p style={{ fontSize: 13, color: "#999", marginTop: 8 }}>{section.imageAlt}</p>}
          </div>
        ) : (
          <div style={{ padding: 40, textAlign: "center", background: "#f0f0f0", borderRadius: 4, color: "#999" }}>Clique para adicionar imagem</div>
        );
      case "spacer":
        return <div style={{ height: section.height || 60, background: "repeating-linear-gradient(45deg, transparent, transparent 5px, #f0f0f0 5px, #f0f0f0 10px)", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", color: "#ccc", fontSize: 12 }}>{section.height || 60}px</div>;
      case "two-columns":
        return (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div dangerouslySetInnerHTML={{ __html: section.leftContent || "" }} style={{ lineHeight: 1.7 }} />
            <div dangerouslySetInnerHTML={{ __html: section.rightContent || "" }} style={{ lineHeight: 1.7 }} />
          </div>
        );
      case "video":
        if (section.videoUrl) {
          const id = section.videoUrl.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1];
          return id ? (
            <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
              <iframe src={`https://www.youtube.com/embed/${id}`} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none", borderRadius: 4 }} allowFullScreen />
            </div>
          ) : <p style={{ color: "#999" }}>URL de vídeo inválido</p>;
        }
        return <div style={{ padding: 40, textAlign: "center", background: "#f0f0f0", borderRadius: 4, color: "#999" }}>Adicionar URL do YouTube</div>;
      case "button":
        return (
          <div style={{ textAlign: section.textAlign || "center" }}>
            <span style={{
              display: "inline-block",
              padding: "12px 32px",
              background: section.buttonStyle === "outline" ? "transparent" : section.buttonStyle === "secondary" ? "#f0f0f0" : "#111",
              color: section.buttonStyle === "outline" ? "#111" : section.buttonStyle === "secondary" ? "#333" : "#fff",
              border: section.buttonStyle === "outline" ? "2px solid #111" : "none",
              borderRadius: 4,
              fontSize: 15,
              fontWeight: 500,
            }}>{section.buttonText || "Botão"}</span>
          </div>
        );
      default:
        return <p>Secção desconhecida</p>;
    }
  }

  function renderEditor() {
    switch (section.type) {
      case "heading":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input
              type="text"
              value={section.heading || ""}
              onChange={(e) => onChange({ ...section, heading: e.target.value })}
              style={{ padding: "10px 14px", border: "1px solid #ddd", borderRadius: 4, fontSize: 16, fontWeight: 600 }}
              placeholder="Texto do título"
            />
            <div style={{ display: "flex", gap: 8 }}>
              {(["h1", "h2", "h3"] as const).map((h) => (
                <button
                  key={h}
                  onClick={() => onChange({ ...section, headingLevel: h })}
                  style={{ padding: "6px 14px", background: section.headingLevel === h ? "#111" : "#f0f0f0", color: section.headingLevel === h ? "#fff" : "#333", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 13 }}
                >
                  {h.toUpperCase()}
                </button>
              ))}
              <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
                {(["left", "center", "right"] as const).map((a) => (
                  <button
                    key={a}
                    onClick={() => onChange({ ...section, textAlign: a })}
                    style={{ padding: "6px 10px", background: section.textAlign === a ? "#111" : "#f0f0f0", color: section.textAlign === a ? "#fff" : "#333", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12 }}
                  >
                    {a === "left" ? "⬅" : a === "center" ? "⬌" : "➡"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case "text":
        return (
          <div>
            <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
              {(["left", "center", "right"] as const).map((a) => (
                <button
                  key={a}
                  onClick={() => onChange({ ...section, textAlign: a })}
                  style={{ padding: "4px 10px", background: section.textAlign === a ? "#111" : "#f0f0f0", color: section.textAlign === a ? "#fff" : "#333", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12 }}
                >
                  {a === "left" ? "⬅" : a === "center" ? "⬌" : "➡"}
                </button>
              ))}
            </div>
            <div
              ref={textRef}
              contentEditable
              suppressContentEditableWarning
              dangerouslySetInnerHTML={{ __html: section.content || "" }}
              onBlur={() => {
                if (textRef.current) onChange({ ...section, content: textRef.current.innerHTML });
              }}
              style={{ minHeight: 120, padding: 16, border: "1px solid #ddd", borderRadius: 4, outline: "none", lineHeight: 1.7, fontSize: 15 }}
            />
          </div>
        );
      case "image":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {section.imageUrl && (
              <img src={section.imageUrl} alt="" style={{ maxWidth: "100%", maxHeight: 300, objectFit: "contain", borderRadius: 4 }} />
            )}
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={async () => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/*";
                  input.onchange = async () => {
                    const file = input.files?.[0];
                    if (!file) return;
                    try {
                      const assetId = await uploadImage(file);
                      const url = URL.createObjectURL(file);
                      onChange({ ...section, imageUrl: url, imageRef: assetId });
                    } catch {
                      alert("Erro ao enviar imagem");
                    }
                  };
                  input.click();
                }}
                style={{ padding: "8px 16px", background: "#111", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 13 }}
              >
                {section.imageUrl ? "Trocar imagem" : "Escolher imagem"}
              </button>
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#666" }}>
                <input
                  type="checkbox"
                  checked={section.fullWidth || false}
                  onChange={(e) => onChange({ ...section, fullWidth: e.target.checked })}
                />
                Largura total
              </label>
            </div>
            <input
              type="text"
              value={section.imageAlt || ""}
              onChange={(e) => onChange({ ...section, imageAlt: e.target.value })}
              placeholder="Texto alternativo (alt)"
              style={{ padding: "8px 12px", border: "1px solid #ddd", borderRadius: 4, fontSize: 13 }}
            />
          </div>
        );
      case "spacer":
        return (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <label style={{ fontSize: 13, color: "#666" }}>Altura:</label>
            <input
              type="range"
              min={20}
              max={200}
              value={section.height || 60}
              onChange={(e) => onChange({ ...section, height: parseInt(e.target.value) })}
              style={{ flex: 1 }}
            />
            <span style={{ fontSize: 13, color: "#666", minWidth: 40 }}>{section.height || 60}px</span>
          </div>
        );
      case "two-columns": {
        return (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, color: "#999", marginBottom: 4, display: "block" }}>Coluna esquerda</label>
              <div
                ref={leftRef}
                contentEditable
                suppressContentEditableWarning
                dangerouslySetInnerHTML={{ __html: section.leftContent || "" }}
                onBlur={() => { if (leftRef.current) onChange({ ...section, leftContent: leftRef.current.innerHTML }); }}
                style={{ minHeight: 100, padding: 12, border: "1px solid #ddd", borderRadius: 4, outline: "none", lineHeight: 1.6, fontSize: 14 }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "#999", marginBottom: 4, display: "block" }}>Coluna direita</label>
              <div
                ref={rightRef}
                contentEditable
                suppressContentEditableWarning
                dangerouslySetInnerHTML={{ __html: section.rightContent || "" }}
                onBlur={() => { if (rightRef.current) onChange({ ...section, rightContent: rightRef.current.innerHTML }); }}
                style={{ minHeight: 100, padding: 12, border: "1px solid #ddd", borderRadius: 4, outline: "none", lineHeight: 1.6, fontSize: 14 }}
              />
            </div>
          </div>
        );
      }
      case "video":
        return (
          <div>
            <input
              type="text"
              value={section.videoUrl || ""}
              onChange={(e) => onChange({ ...section, videoUrl: e.target.value })}
              placeholder="URL do YouTube (ex: https://youtube.com/watch?v=...)"
              style={{ width: "100%", padding: "10px 14px", border: "1px solid #ddd", borderRadius: 4, fontSize: 14, boxSizing: "border-box" }}
            />
          </div>
        );
      case "button":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <input
              type="text"
              value={section.buttonText || ""}
              onChange={(e) => onChange({ ...section, buttonText: e.target.value })}
              placeholder="Texto do botão"
              style={{ padding: "8px 12px", border: "1px solid #ddd", borderRadius: 4, fontSize: 14 }}
            />
            <input
              type="text"
              value={section.buttonUrl || ""}
              onChange={(e) => onChange({ ...section, buttonUrl: e.target.value })}
              placeholder="URL de destino"
              style={{ padding: "8px 12px", border: "1px solid #ddd", borderRadius: 4, fontSize: 14 }}
            />
            <div style={{ display: "flex", gap: 8 }}>
              {(["primary", "secondary", "outline"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => onChange({ ...section, buttonStyle: s })}
                  style={{ padding: "6px 14px", background: section.buttonStyle === s ? "#111" : "#f0f0f0", color: section.buttonStyle === s ? "#fff" : "#333", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, textTransform: "capitalize" }}
                >
                  {s}
                </button>
              ))}
              <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
                {(["left", "center", "right"] as const).map((a) => (
                  <button
                    key={a}
                    onClick={() => onChange({ ...section, textAlign: a })}
                    style={{ padding: "6px 10px", background: section.textAlign === a ? "#111" : "#f0f0f0", color: section.textAlign === a ? "#fff" : "#333", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12 }}
                  >
                    {a === "left" ? "⬅" : a === "center" ? "⬌" : "➡"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className={styles.pbSection}>
      <div className={styles.pbSectionHeader}>
        <span className={styles.pbSectionIcon}>{widget?.icon}</span>
        <span className={styles.pbSectionLabel}>{widget?.label}</span>
        <div className={styles.pbSectionActions}>
          <button onClick={() => setEditing(!editing)} className={styles.pbSectionBtn} title={editing ? "Fechar" : "Editar"}>
            {editing ? "✓" : "✎"}
          </button>
          <button onClick={onMoveUp} className={styles.pbSectionBtn} disabled={isFirst} title="Mover para cima">↑</button>
          <button onClick={onMoveDown} className={styles.pbSectionBtn} disabled={isLast} title="Mover para baixo">↓</button>
          <button onClick={onDelete} className={`${styles.pbSectionBtn} ${styles.pbSectionBtnDanger}`} title="Eliminar">✕</button>
        </div>
      </div>
      <div className={styles.pbSectionContent}>
        {editing ? renderEditor() : renderPreview()}
      </div>
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
  const [htmlCode, setHtmlCode] = useState("<p><br></p>");
  const [editorKey, setEditorKey] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  // Page builder state
  const [pages, setPages] = useState<PageDoc[]>([]);
  const [editingPage, setEditingPage] = useState<PageDoc | null>(null);
  const [pageTitle, setPageTitle] = useState("");
  const [pageSlug, setPageSlug] = useState("");
  const [pagePublished, setPagePublished] = useState(false);
  const [pageSections, setPageSections] = useState<PageSection[]>([]);
  const [confirmDeletePage, setConfirmDeletePage] = useState<PageDoc | null>(null);
  const [showPagePreview, setShowPagePreview] = useState(false);

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
          mainImage { "ref": asset._ref, "url": asset->url },
          "content": coalesce(body, content)
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
          body: JSON.stringify({ ref: "master" }),
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
    const empty = "<p></p>";
    setEditorHtml(empty);
    setHtmlCode(empty);
    setEditorKey((k) => k + 1);
    setView("editor");
  }

  function openEditPost(post: Post) {
    setEditingPost(post);
    setTitle(post.title);
    setSlug(post.slug.current);
    setExcerpt(post.excerpt || "");
    setImageFile(null);
    const imgUrl = (post.mainImage as any)?.url || post.mainImage?.asset?.url || "";
    const imgRef = (post.mainImage as any)?.ref || post.mainImage?.asset?._ref || "";
    setImagePreview(imgUrl);
    setExistingImageRef(imgRef);
    const html = portableTextToHtml(post.content || []);
    setEditorHtml(html);
    setHtmlCode(html);
    setEditorKey((k) => k + 1);
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

      // Sync from visual editor if active
      const finalHtml = editorRef.current?.isContentEditable
        ? editorRef.current.innerHTML
        : htmlCode;
      const content = htmlToPortableText(finalHtml);

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
        body: content,
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

  // ─── Page Builder Functions ───
  async function loadPages() {
    setLoading(true);
    try {
      const data = await sanityFetch(`
        *[_type == "page" && !(_id in path("drafts.**"))] | order(title asc) {
          _id, title, slug, published, sectionsData
        }
      `);
      setPages(data || []);
    } catch {
      showStatus("Erro ao carregar páginas", true);
    }
    setLoading(false);
  }

  function openNewPage() {
    setEditingPage(null);
    setPageTitle("");
    setPageSlug("");
    setPagePublished(false);
    setPageSections([]);
    setView("page-builder");
  }

  function openEditPage(page: PageDoc) {
    setEditingPage(page);
    setPageTitle(page.title);
    setPageSlug(page.slug.current);
    setPagePublished(page.published || false);
    try {
      setPageSections(page.sectionsData ? JSON.parse(page.sectionsData) : []);
    } catch {
      setPageSections([]);
    }
    setView("page-builder");
  }

  function addSection(type: SectionType) {
    setPageSections((prev) => [...prev, createSection(type)]);
  }

  function updateSection(key: string, updated: PageSection) {
    setPageSections((prev) => prev.map((s) => (s._key === key ? updated : s)));
  }

  function deleteSection(key: string) {
    setPageSections((prev) => prev.filter((s) => s._key !== key));
  }

  function moveSection(key: string, dir: -1 | 1) {
    setPageSections((prev) => {
      const idx = prev.findIndex((s) => s._key === key);
      if (idx < 0) return prev;
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      const arr = [...prev];
      [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
      return arr;
    });
  }

  async function handleSavePage() {
    if (!pageTitle.trim()) {
      showStatus("O título é obrigatório", true);
      return;
    }
    const finalSlug = pageSlug || slugify(pageTitle);
    setSaving(true);
    try {
      const doc: any = {
        _type: "page",
        title: pageTitle.trim(),
        slug: { _type: "slug", current: finalSlug },
        published: pagePublished,
        sectionsData: JSON.stringify(pageSections),
      };

      if (editingPage) {
        await sanityMutate([{ patch: { id: editingPage._id, set: doc } }]);
        showStatus("Página atualizada!");
      } else {
        await sanityMutate([{ create: { ...doc, _id: `page-${rand()}` } }]);
        showStatus("Página criada!");
      }
      setView("pages");
      loadPages();
    } catch (e: any) {
      showStatus(e.message || "Erro ao guardar", true);
    }
    setSaving(false);
  }

  async function handleDeletePage(page: PageDoc) {
    setConfirmDeletePage(null);
    setLoading(true);
    try {
      await sanityMutate([{ delete: { id: page._id } }]);
      showStatus("Página eliminada");
      loadPages();
    } catch (e: any) {
      showStatus(e.message || "Erro ao eliminar", true);
    }
    setLoading(false);
  }

  // Load pages when switching to pages view
  useEffect(() => {
    if (view === "pages") loadPages();
  }, [view]);

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
          <button
            className={`${styles.btn} ${styles.btnBack}`}
            onClick={() => setView("list")}
            title="Voltar"
          >
            &#8592; Voltar
          </button>
          <h1>{editingPost ? "Editar Artigo" : "Novo Artigo"}</h1>
          <div className={styles.headerActions}>
            <button
              className={`${styles.btn} ${styles.btnSecondary}`}
              onClick={() => setShowPreview(true)}
            >
              Pre-visualizar
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
            <ContentEditor
              key={editorKey}
              initialHtml={editorHtml}
              editorRef={editorRef}
              htmlCode={htmlCode}
              setHtmlCode={setHtmlCode}
            />
          </div>
        </div>

        {showPreview && (
          <div className={styles.overlay} onClick={() => setShowPreview(false)}>
            <div className={styles.previewModal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.previewHeader}>
                <h2>Pre-visualizacao</h2>
                <button
                  className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSmall}`}
                  onClick={() => setShowPreview(false)}
                >
                  Fechar
                </button>
              </div>
              <div className={styles.previewContent}>
                {imagePreview && (
                  <img src={imagePreview} alt="" className={styles.previewCover} />
                )}
                <h1 className={styles.previewTitle}>{title || "Sem titulo"}</h1>
                {excerpt && <p className={styles.previewExcerpt}>{excerpt}</p>}
                <div
                  className={styles.previewBody}
                  dangerouslySetInnerHTML={{ __html: htmlCode }}
                />
              </div>
            </div>
          </div>
        )}

        <StatusMessage msg={status} isError={statusError} />
      </div>
    );
  }

  // PAGE BUILDER VIEW
  if (view === "page-builder") {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <button className={`${styles.btn} ${styles.btnBack}`} onClick={() => setView("pages")} title="Voltar">
            &#8592; Voltar
          </button>
          <h1>{editingPage ? "Editar Página" : "Nova Página"}</h1>
          <div className={styles.headerActions}>
            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#666" }}>
              <input type="checkbox" checked={pagePublished} onChange={(e) => setPagePublished(e.target.checked)} />
              Publicada
            </label>
            <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => setShowPagePreview(true)}>
              Pre-visualizar
            </button>
            <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleSavePage} disabled={saving}>
              {saving ? "A guardar..." : "Guardar"}
            </button>
          </div>
        </div>

        <div className={styles.pbLayout}>
          {/* Left sidebar */}
          <div className={styles.pbSidebar}>
            <h3 className={styles.pbSidebarTitle}>Adicionar secção</h3>
            {SECTION_WIDGETS.map((w) => (
              <button key={w.type} className={styles.pbWidget} onClick={() => addSection(w.type)}>
                <span className={styles.pbWidgetIcon}>{w.icon}</span>
                <div>
                  <div className={styles.pbWidgetLabel}>{w.label}</div>
                  <div className={styles.pbWidgetDesc}>{w.desc}</div>
                </div>
              </button>
            ))}

            <div style={{ borderTop: "1px solid #e0e0e0", marginTop: 16, paddingTop: 16 }}>
              <div className={styles.field} style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 11 }}>Título da página</label>
                <input
                  type="text"
                  value={pageTitle}
                  onChange={(e) => {
                    setPageTitle(e.target.value);
                    if (!editingPage) setPageSlug(slugify(e.target.value));
                  }}
                  placeholder="Título"
                  style={{ padding: "8px 10px", fontSize: 13 }}
                />
              </div>
              <div className={styles.field} style={{ marginBottom: 0 }}>
                <label style={{ fontSize: 11 }}>Slug (URL)</label>
                <input
                  type="text"
                  value={pageSlug}
                  onChange={(e) => setPageSlug(e.target.value)}
                  placeholder="url-da-pagina"
                  style={{ padding: "8px 10px", fontSize: 13 }}
                />
              </div>
            </div>
          </div>

          {/* Main canvas */}
          <div className={styles.pbCanvas}>
            {pageSections.length === 0 ? (
              <div className={styles.pbEmpty}>
                <p>Comece por adicionar secções a partir da barra lateral</p>
              </div>
            ) : (
              pageSections.map((section, idx) => (
                <SectionEditor
                  key={section._key}
                  section={section}
                  onChange={(s) => updateSection(section._key, s)}
                  onDelete={() => deleteSection(section._key)}
                  onMoveUp={() => moveSection(section._key, -1)}
                  onMoveDown={() => moveSection(section._key, 1)}
                  isFirst={idx === 0}
                  isLast={idx === pageSections.length - 1}
                />
              ))
            )}
          </div>
        </div>

        {showPagePreview && (
          <div className={styles.overlay} onClick={() => setShowPagePreview(false)}>
            <div className={styles.pagePreviewModal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.previewHeader}>
                <h2>Pre-visualização da página</h2>
                <button
                  className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSmall}`}
                  onClick={() => setShowPagePreview(false)}
                >
                  Fechar
                </button>
              </div>
              <div className={styles.pagePreviewContent}>
                {pageSections.map((section) => {
                  switch (section.type) {
                    case "heading": {
                      const Tag = section.headingLevel || "h2";
                      return (
                        <Tag key={section._key} className={styles.ppHeading} style={{ textAlign: section.textAlign || "left" }}>
                          {section.heading}
                        </Tag>
                      );
                    }
                    case "text":
                      return (
                        <div
                          key={section._key}
                          className={styles.ppText}
                          dangerouslySetInnerHTML={{ __html: section.content || "" }}
                          style={{ textAlign: section.textAlign || "left" }}
                        />
                      );
                    case "image":
                      return section.imageUrl ? (
                        <div key={section._key} style={{ textAlign: "center", margin: "32px 0" }}>
                          <img src={section.imageUrl} alt={section.imageAlt || ""} style={{ maxWidth: section.fullWidth ? "100%" : "80%", height: "auto", borderRadius: 8 }} />
                          {section.imageAlt && <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginTop: 10 }}>{section.imageAlt}</p>}
                        </div>
                      ) : null;
                    case "spacer":
                      return <div key={section._key} style={{ height: section.height || 60 }} />;
                    case "two-columns":
                      return (
                        <div key={section._key} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, marginBottom: 32 }}>
                          <div className={styles.ppText} dangerouslySetInnerHTML={{ __html: section.leftContent || "" }} />
                          <div className={styles.ppText} dangerouslySetInnerHTML={{ __html: section.rightContent || "" }} />
                        </div>
                      );
                    case "video": {
                      const id = section.videoUrl?.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1];
                      return id ? (
                        <div key={section._key} style={{ position: "relative", paddingBottom: "56.25%", height: 0, margin: "32px 0", borderRadius: 8, overflow: "hidden" }}>
                          <iframe src={`https://www.youtube.com/embed/${id}`} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }} allowFullScreen />
                        </div>
                      ) : null;
                    }
                    case "button":
                      return (
                        <div key={section._key} style={{ textAlign: section.textAlign || "center", margin: "32px 0" }}>
                          <span style={{
                            display: "inline-block",
                            padding: "14px 36px",
                            background: section.buttonStyle === "outline" ? "transparent" : "rgba(0,0,0,0.15)",
                            color: "#fff",
                            border: section.buttonStyle === "outline" ? "2px solid #fff" : "1px solid rgba(136,177,75,0.6)",
                            boxShadow: section.buttonStyle === "outline" ? "none" : "0 0 12px rgba(136,177,75,0.3)",
                            borderRadius: 4,
                            fontSize: 16,
                            fontWeight: 500,
                          }}>{section.buttonText || "Botão"}</span>
                        </div>
                      );
                    default:
                      return null;
                  }
                })}
              </div>
            </div>
          </div>
        )}

        <StatusMessage msg={status} isError={statusError} />
      </div>
    );
  }

  // PAGES LIST VIEW
  if (view === "pages") {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Backoffice EVAPLACE</h1>
          <div className={styles.headerActions}>
            <div className={styles.navTabs}>
              <button className={styles.navTab} onClick={() => setView("list")}>Blog</button>
              <button className={`${styles.navTab} ${styles.navTabActive}`}>Páginas</button>
            </div>
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
            <h2>Páginas ({pages.length})</h2>
            <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={openNewPage}>
              Nova Página
            </button>
          </div>

          {loading ? (
            <div className={styles.loading}>
              <span className={styles.spinner} /> A carregar...
            </div>
          ) : pages.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Ainda não existem páginas.</p>
              <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={openNewPage}>
                Criar primeira página
              </button>
            </div>
          ) : (
            <div className={styles.postList}>
              {pages.map((page) => (
                <div key={page._id} className={styles.postItem} onClick={() => openEditPage(page)}>
                  <div className={styles.postInfo}>
                    <h3>{page.title}</h3>
                    <span style={{ color: page.published ? "#2e7d32" : "#999" }}>
                      {page.published ? "Publicada" : "Rascunho"} · /paginas/{page.slug.current}
                    </span>
                  </div>
                  <div className={styles.postActions}>
                    <button
                      className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSmall}`}
                      onClick={(e) => { e.stopPropagation(); openEditPage(page); }}
                    >
                      Editar
                    </button>
                    <button
                      className={`${styles.btn} ${styles.btnDanger} ${styles.btnSmall}`}
                      onClick={(e) => { e.stopPropagation(); setConfirmDeletePage(page); }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {confirmDeletePage && (
          <ConfirmModal
            title="Eliminar página"
            message={`Tem a certeza que quer eliminar "${confirmDeletePage.title}"? Esta ação não pode ser revertida.`}
            onConfirm={() => handleDeletePage(confirmDeletePage)}
            onCancel={() => setConfirmDeletePage(null)}
          />
        )}

        <StatusMessage msg={status} isError={statusError} />
      </div>
    );
  }

  // LIST VIEW (Articles)
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Backoffice EVAPLACE</h1>
        <div className={styles.headerActions}>
          <div className={styles.navTabs}>
            <button className={`${styles.navTab} ${styles.navTabActive}`}>Blog</button>
            <button className={styles.navTab} onClick={() => setView("pages")}>Páginas</button>
          </div>
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
                  {((post.mainImage as any)?.url || post.mainImage?.asset?.url) && (
                    <img src={(post.mainImage as any)?.url || post.mainImage?.asset?.url} alt="" />
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
