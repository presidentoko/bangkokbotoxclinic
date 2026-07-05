// Next.js static export (output: "export") writes an RSC prefetch payload
// (`__next*.txt`, or a `<page>.txt` sibling next to `<page>.html`) alongside
// every rendered page, for client-side <Link> prefetching. On a large
// directory site this multiplies file count ~9x (46,870 of 52,990 files in
// one build) and blows past Cloudflare Pages' 20,000-files-per-deployment
// limit. These payloads are prefetch-only optimizations — deleting them
// only means an internal link click falls back to a normal full navigation
// instead of an RSC transition; the .html pages themselves are unaffected,
// and search engines only ever read the .html.
//
// Deletion rule: remove a `.txt` file if its path contains "__next" OR if
// a `.html` file exists at the same base path (its sibling flattened RSC
// payload). Real content files like robots.txt/llms.txt/llms-full.txt have
// no .html sibling and no "__next" in their path, so they're untouched.
import { readdir, unlink, stat } from "node:fs/promises";
import path from "node:path";

const OUT_DIR = path.resolve(import.meta.dirname, "..", "out");

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else {
      yield full;
    }
  }
}

async function main() {
  let removed = 0;
  let kept = 0;
  for await (const file of walk(OUT_DIR)) {
    if (!file.endsWith(".txt")) continue;
    const isRscInternal = file.includes("__next");
    const htmlSibling = file.slice(0, -".txt".length) + ".html";
    const hasHtmlSibling = await stat(htmlSibling).then(() => true).catch(() => false);
    if (isRscInternal || hasHtmlSibling) {
      await unlink(file);
      removed++;
    } else {
      kept++;
    }
  }
  console.log(`[strip-rsc-payloads] removed ${removed} RSC payload files, kept ${kept} real .txt files (robots.txt/llms.txt/etc)`);
}

main();
