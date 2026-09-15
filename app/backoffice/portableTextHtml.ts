// Conteúdo dos artigos: editor do backoffice (HTML) <-> Sanity (Portable Text).
// Extraído de app/backoffice/page.tsx para poder ser testado (tests/portableTextHtml.*.test.ts).

export function portableTextToHtml(blocks: any[]): string {
  if (!blocks || !Array.isArray(blocks)) return "<p><br></p>";

  function renderInline(block: any): string {
    return (block.children || [])
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
  }

  const out: string[] = [];
  let i = 0;
  while (i < blocks.length) {
    const block = blocks[i];

    if (block?._type === "image") {
      const url = block.asset?.url || "";
      const ref = block.asset?._ref || "";
      if (url) {
        out.push(`<div data-image-block="true"><img src="${url}" alt="${block.alt || ""}" data-sanity-asset="${ref}" style="max-width:100%;height:auto;border-radius:4px"></div>`);
      }
      i++;
      continue;
    }

    if (block?._type !== "block") { i++; continue; }

    // Group consecutive list items of the same kind into a real <ul>/<ol>
    if (block.listItem === "bullet" || block.listItem === "number") {
      const listType = block.listItem;
      const tag = listType === "bullet" ? "ul" : "ol";
      const items: string[] = [];
      while (
        i < blocks.length &&
        blocks[i]?._type === "block" &&
        blocks[i]?.listItem === listType
      ) {
        items.push(`<li>${renderInline(blocks[i])}</li>`);
        i++;
      }
      out.push(`<${tag}>${items.join("")}</${tag}>`);
      continue;
    }

    const style = block.style || "normal";

    // Raw HTML blocks (style, table, etc.) — output as-is
    if (style === "html") {
      const raw = (block.children || []).map((c: any) => c.text || "").join("");
      out.push(raw);
      i++;
      continue;
    }

    const children = renderInline(block);

    if (style === "h2") out.push(`<h2>${children}</h2>`);
    else if (style === "h3") out.push(`<h3>${children}</h3>`);
    else if (style === "h4") out.push(`<h4>${children}</h4>`);
    else if (style === "blockquote") out.push(`<blockquote>${children}</blockquote>`);
    else out.push(`<p>${children || "<br>"}</p>`);

    i++;
  }

  return out.join("\n");
}

export function htmlToPortableText(html: string): any[] {
  const div = document.createElement("div");
  div.innerHTML = html;
  const blocks: any[] = [];
  let listItems: any[] = [];

  function flushList() {
    blocks.push(...listItems);
    listItems = [];
  }

  // Build a Sanity image block, or fall back to a raw-HTML block so external
  // images (no data-sanity-asset) aren't silently dropped on save.
  function makeImageBlock(img: Element): any | null {
    const alt = img.getAttribute("alt") || "";
    const assetRef =
      img.getAttribute("data-sanity-asset") ||
      (img as HTMLElement).dataset?.sanityAsset ||
      "";
    if (assetRef) {
      return {
        _type: "image",
        _key: rand(),
        alt,
        asset: { _type: "reference", _ref: assetRef },
      };
    }
    if (img.getAttribute("src")) {
      return {
        _type: "block",
        _key: rand(),
        style: "html",
        children: [{ _type: "span", _key: rand(), marks: [], text: img.outerHTML }],
        markDefs: [],
      };
    }
    return null;
  }

  // Find all <img> tags inside an element (at any depth)
  function extractImages(el: Element): any[] {
    const images: any[] = [];
    const imgs = el.querySelectorAll("img");
    imgs.forEach((img) => {
      const block = makeImageBlock(img);
      if (block) images.push(block);
    });
    return images;
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

      // Skip img tags inside blocks - they are handled separately
      if (tag === "img") return;

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

  function processNodes(nodeList: ArrayLike<ChildNode>) {
    for (const node of Array.from(nodeList)) {
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

      // Preserve <style>, <table>, or divs containing them as raw HTML blocks
      if (
        tag === "style" ||
        tag === "table" ||
        (tag === "div" && el.querySelector("table, style"))
      ) {
        flushList();
        blocks.push({
          _type: "block",
          _key: rand(),
          style: "html",
          children: [{ _type: "span", _key: rand(), marks: [], text: el.outerHTML }],
          markDefs: [],
        });
        continue;
      }

      // Recurse into generic <div> wrappers so inner <p>, <h2>, <ul>, <img>
      // etc. keep their structure instead of collapsing into plain text.
      // Covers the image-block div as well (its <img> child is handled below).
      if (tag === "div") {
        processNodes(el.childNodes);
        continue;
      }

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

      // Handle standalone <img> tags
      if (tag === "img") {
        const imgBlock = makeImageBlock(el);
        if (imgBlock) blocks.push(imgBlock);
        continue;
      }

      // For block elements (p, h2, etc.) — extract any nested images first
      const nestedImages = extractImages(el);

      // If the block ONLY contains an image (e.g. <p><img></p>), just add the image
      const textContent = (el.textContent || "").trim();
      if (nestedImages.length > 0 && !textContent) {
        blocks.push(...nestedImages);
        continue;
      }

      // Parse the text content of the block
      let style = "normal";
      if (tag === "h2") style = "h2";
      else if (tag === "h3") style = "h3";
      else if (tag === "h4") style = "h4";
      else if (tag === "blockquote") style = "blockquote";

      const [children, markDefs] = parseChildren(el);

      // Only add text block if it has real content
      const hasText = children.some((c: any) => c.text && c.text.trim());
      if (hasText) {
        blocks.push({
          _type: "block",
          _key: rand(),
          style,
          children,
          markDefs,
        });
      }

      // Add nested images after the text block
      if (nestedImages.length > 0 && textContent) {
        blocks.push(...nestedImages);
      }
    }
  }

  processNodes(div.childNodes);
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

export function rand(): string {
  return Math.random().toString(36).substring(2, 10);
}
