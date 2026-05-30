// Validate every internal href in the footer (app/layout.tsx) resolves to a generated
// route under out/. Run AFTER `npm run build`. Exits non-zero if any link 404s.
import { readFile, access } from "node:fs/promises";
import path from "node:path";

const layout = await readFile("app/layout.tsx", "utf-8");
const footer = layout.slice(layout.indexOf("<footer"));
const hrefs = [...footer.matchAll(/href="(\/[^"]*)"/g)].map((m) => m[1]);

async function exists(route) {
  // Map a clean route to its static output file.
  if (route === "/") return true; // index.html always emitted
  const clean = route.replace(/^\//, "").replace(/\/$/, "");
  for (const candidate of [`out/${clean}.html`, `out/${clean}/index.html`, `out/${clean}`]) {
    try { await access(path.normalize(candidate)); return true; } catch {}
  }
  return false;
}

const broken = [];
for (const h of [...new Set(hrefs)]) {
  // Skip dynamic/known-special routes served as files.
  if (h.startsWith("/sitemap")) continue;
  if (!(await exists(h))) broken.push(h);
}

if (broken.length) {
  console.error("BROKEN footer links:\n" + broken.map((b) => "  " + b).join("\n"));
  process.exit(1);
}
console.log(`check_footer_links: OK (${new Set(hrefs).size} links)`);
