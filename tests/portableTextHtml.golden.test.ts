import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { setupDom, stripKeys } from "./helpers.ts";
import { portableTextToHtml, htmlToPortableText } from "../app/backoffice/portableTextHtml.ts";

setupDom();
const posts = JSON.parse(readFileSync(new URL("./fixtures/posts.json", import.meta.url), "utf8"));
const golden = JSON.parse(readFileSync(new URL("./fixtures/golden.json", import.meta.url), "utf8"));

for (const [i, post] of posts.entries()) {
  test(`artigo real sem alterações: ${post.slug}`, () => {
    const html = portableTextToHtml(post.content);
    assert.equal(html, golden[i].html);
    assert.deepEqual(stripKeys(htmlToPortableText(html)), golden[i].blocks);
  });
}
