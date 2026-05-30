// Emit [{from, to}] for every raw district slug -> canonical slug, from raw master_db.
import { readFile } from "node:fs/promises";
import { normalizeDistrict, districtSlug } from "../lib/districts.ts";

const raw = JSON.parse(await readFile("data/master_db.json", "utf-8"));
const out: { from: string; to: string }[] = [];
const seen = new Set<string>();
for (const s of raw.suppliers) {
  if (!s.district) continue;
  const from = districtSlug(s.district);
  if (!from || seen.has(from)) continue;
  seen.add(from);
  const canon = normalizeDistrict(s.city, s.district);
  if (!canon) continue;
  if (canon.slug !== from) out.push({ from, to: canon.slug });
}
process.stdout.write(JSON.stringify(out));
