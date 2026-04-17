"use client";

import { useEffect } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import styles from "./RichTextEditor.module.css";

export type RichTextVariant = "full" | "inline";

type Props = {
  value: string;
  onChange: (html: string) => void;
  variant?: RichTextVariant;
  placeholder?: string;
  compact?: boolean;
};

/**
 * Tiptap-based rich text editor.
 *
 * - variant="full"   → all formatting (headings, lists, alignment, quote, code, link, undo/redo)
 * - variant="inline" → inline-only (bold/italic/underline/strike/link + undo/redo) suited to
 *                      single-line fields such as headings and button labels.
 */
export default function RichTextEditor({
  value,
  onChange,
  variant = "full",
  placeholder,
  compact,
}: Props) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: variant === "full" ? { levels: [1, 2, 3] } : false,
        bulletList: variant === "full" ? {} : false,
        orderedList: variant === "full" ? {} : false,
        blockquote: variant === "full" ? {} : false,
        codeBlock: false,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: "noopener noreferrer" },
      }),
      ...(variant === "full"
        ? [TextAlign.configure({ types: ["heading", "paragraph"] })]
        : []),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class: `${styles.editor} ${compact ? styles.compact : ""}`.trim(),
        ...(placeholder ? { "data-placeholder": placeholder } : {}),
      },
    },
    onUpdate: ({ editor }) => {
      let html = editor.getHTML();
      if (html === "<p></p>") {
        onChange("");
        return;
      }
      // Inline variant: strip the single outer <p> wrapper so the caller can
      // safely inject the value into <h1>/<button>/etc. without nested blocks.
      if (variant === "inline") {
        const match = html.match(/^<p>([\s\S]*)<\/p>$/);
        if (match && !match[1].includes("<p")) html = match[1];
      }
      onChange(html);
    },
  });

  // Sync external value changes (e.g. when switching between sections)
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    const next = value || "<p></p>";
    if (current !== next && current !== value) {
      editor.commands.setContent(next, { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.toolbar} />
        <div className={`${styles.editor} ${compact ? styles.compact : ""}`} />
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <Toolbar editor={editor} variant={variant} />
      <EditorContent editor={editor} />
    </div>
  );
}

function Toolbar({ editor, variant }: { editor: Editor; variant: RichTextVariant }) {
  const Btn = ({
    onClick,
    active,
    disabled,
    title,
    children,
  }: {
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
    title: string;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      className={`${styles.btn} ${active ? styles.active : ""}`}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      {children}
    </button>
  );

  const promptLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL do link (deixa vazio para remover):", prev || "");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  };

  return (
    <div className={styles.toolbar}>
      <Btn
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive("bold")}
        title="Negrito (Ctrl+B)"
      >
        <b>B</b>
      </Btn>
      <Btn
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive("italic")}
        title="Itálico (Ctrl+I)"
      >
        <i>I</i>
      </Btn>
      <Btn
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        active={editor.isActive("underline")}
        title="Sublinhado (Ctrl+U)"
      >
        <u>U</u>
      </Btn>
      <Btn
        onClick={() => editor.chain().focus().toggleStrike().run()}
        active={editor.isActive("strike")}
        title="Rasurado"
      >
        <s>S</s>
      </Btn>
      <Btn
        onClick={() => editor.chain().focus().toggleCode().run()}
        active={editor.isActive("code")}
        title="Código inline"
      >
        {"<>"}
      </Btn>

      {variant === "full" && (
        <>
          <span className={styles.sep} />
          <select
            className={styles.select}
            value={
              editor.isActive("heading", { level: 1 })
                ? "h1"
                : editor.isActive("heading", { level: 2 })
                ? "h2"
                : editor.isActive("heading", { level: 3 })
                ? "h3"
                : "p"
            }
            onChange={(e) => {
              const v = e.target.value;
              if (v === "p") editor.chain().focus().setParagraph().run();
              else {
                const level = parseInt(v.slice(1), 10) as 1 | 2 | 3;
                editor.chain().focus().toggleHeading({ level }).run();
              }
            }}
            title="Estilo do bloco"
          >
            <option value="p">Parágrafo</option>
            <option value="h1">H1</option>
            <option value="h2">H2</option>
            <option value="h3">H3</option>
          </select>

          <span className={styles.sep} />
          <Btn
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive("bulletList")}
            title="Lista"
          >
            •
          </Btn>
          <Btn
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive("orderedList")}
            title="Lista numerada"
          >
            1.
          </Btn>
          <Btn
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive("blockquote")}
            title="Citação"
          >
            ❝
          </Btn>

          <span className={styles.sep} />
          <Btn
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            active={editor.isActive({ textAlign: "left" })}
            title="Alinhar à esquerda"
          >
            ⬅
          </Btn>
          <Btn
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            active={editor.isActive({ textAlign: "center" })}
            title="Centrar"
          >
            ⬍
          </Btn>
          <Btn
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            active={editor.isActive({ textAlign: "right" })}
            title="Alinhar à direita"
          >
            ➡
          </Btn>
          <Btn
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            active={editor.isActive({ textAlign: "justify" })}
            title="Justificar"
          >
            ☰
          </Btn>
        </>
      )}

      <span className={styles.sep} />
      <Btn
        onClick={promptLink}
        active={editor.isActive("link")}
        title="Inserir/editar link"
      >
        🔗
      </Btn>

      <span className={styles.sep} />
      <Btn
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        title="Anular (Ctrl+Z)"
      >
        ↶
      </Btn>
      <Btn
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        title="Refazer (Ctrl+Shift+Z)"
      >
        ↷
      </Btn>
    </div>
  );
}
