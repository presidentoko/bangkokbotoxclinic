// Generate 301 redirects from every PRE-normalization district slug to its canonical slug,
// written into a marked block in public/_redirects (manual entries preserved).
import { readFile, writeFile } from "node:fs/promises";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const REDIRECTS = path.join(ROOT, "public", "_redirects");
const BEGIN = "# BEGIN district-redirects (generated)";
const END = "# END district-redirects (generated)";

// The canonical mapping lives in lib/districts.ts; run it through tsx to dump raw->canonical.
const dump = execSync("npx --yes tsx scripts/dump_district_map.mts", {
  cwd: ROOT,
  encoding: "utf-8",
});
const pairs = JSON.parse(dump); // [{ from: "sriracha", to: "si-racha-district" }, ...]

const lines = [BEGIN];
const seen = new Set();
for (const { from, to } of pairs) {
  if (from === to || seen.has(from)) continue;
  seen.add(from);
  lines.push(`/d/${from} /d/${to} 301`);
}
lines.push(END);

let content = await readFile(REDIRECTS, "utf-8");
if (content.includes(BEGIN)) {
  content = content.replace(new RegExp(`${BEGIN}[\\s\\S]*?${END}`), lines.join("\n"));
} else {
  content = content.trimEnd() + "\n\n" + lines.join("\n") + "\n";
}
await writeFile(REDIRECTS, content);
console.log(`gen_district_redirects: wrote ${seen.size} redirects`);
