/**
 * Regenerate the canonical-district 301 block in public/_redirects.
 *
 * The site is a static export served by Cloudflare Pages, so redirects live in
 * the `_redirects` file (next.config `redirects()` does nothing under
 * `output: "export"`). District page slugs were deduplicated/normalized in
 * lib/districts.ts; this emits a 301 for every legacy variant slug so indexed
 * URLs keep their SEO equity.
 *
 * Run:  npx tsx scripts/gen_redirects.mts   (wired into scripts/auto_rebuild.py)
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { districtRedirects } from "../lib/districts.ts";
import type { MasterDb } from "../lib/types.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const REDIRECTS = path.join(ROOT, "public", "_redirects");
const START = "# >>> district-canonical (auto-generated — edit lib/districts.ts) >>>";
const END = "# <<< district-canonical <<<";

async function main() {
  const db: MasterDb = JSON.parse(
    await fs.readFile(path.join(ROOT, "data", "master_db.json"), "utf-8"),
  );
  const map = districtRedirects(db);

  const lines = [START];
  for (const [from, to] of map) {
    // /d/<variant> and /c/<any-category>/<variant> both fold to the canonical.
    lines.push(`/d/${from} /d/${to} 301`);
    lines.push(`/c/:cat/${from} /c/:cat/${to} 301`);
  }
  lines.push(END);
  const block = lines.join("\n");

  let current = "";
  try {
    current = await fs.readFile(REDIRECTS, "utf-8");
  } catch {
    current = "# Cloudflare Pages redirects.\n";
  }

  const startIdx = current.indexOf(START);
  let next: string;
  if (startIdx !== -1) {
    const endIdx = current.indexOf(END);
    const tail = endIdx !== -1 ? current.slice(endIdx + END.length) : "";
    next = current.slice(0, startIdx) + block + tail;
  } else {
    next = current.replace(/\s*$/, "") + "\n\n" + block + "\n";
  }

  await fs.writeFile(REDIRECTS, next.replace(/\n{3,}/g, "\n\n").replace(/\s*$/, "") + "\n");
  console.log(`gen_redirects: wrote ${map.size} district redirects (${map.size * 2} lines)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
