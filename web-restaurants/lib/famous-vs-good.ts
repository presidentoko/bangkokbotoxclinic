// lib/famous-vs-good.ts
// Loader, matcher, types, and ingester for the "Instagram Famous vs Actually Good" feature.

import { promises as fs } from "node:fs";
import path from "node:path";
import type { Restaurant } from "@/lib/types";
import { loadMasterDb } from "@/lib/data";

// ── Guardrail constants ───────────────────────────────────────────────────────
// A restaurant with trust_score >= GUARD_MIN is NEVER classified as 'big_gap'.
// Labeling a genuinely good place as a let-down is both unfair and defamatory.
const GUARD_MIN = 80;

// Static fallbacks used when the matched set is too small to percentile-rank (<3).
export const GAP_THRESHOLD_LOW = 75;
export const GAP_THRESHOLD_HIGH = 85;

// ── Types ─────────────────────────────────────────────────────────────────────
export type IgSeedEntry = {
  name: string;
  ig_signal: string | null;
  tag_count: number | null;
  place_id: string | null;
  district: string | null;
  city: string;
  category: string;
};

export type FamousVsGoodEntry = {
  seed: IgSeedEntry;
  restaurant: Restaurant | null;
  localGuideRatio: number | null;
  gap: "big_gap" | "holds_up" | "decent" | "hidden_gem" | "unmatched";
};

export type CollectionThresholds = {
  bigGapThreshold: number;
  holdsUpThreshold: number;
};

export type FamousVsGoodCollection = {
  entries: FamousVsGoodEntry[];
  thresholds: CollectionThresholds;
};

// ── Seed loader ───────────────────────────────────────────────────────────────
let _seedCache: IgSeedEntry[] | null = null;

export async function loadIgSeed(): Promise<IgSeedEntry[]> {
  if (_seedCache) return _seedCache;
  const raw = await fs.readFile(
    path.join(process.cwd(), "data", "ig-seed.json"),
    "utf-8"
  );
  _seedCache = JSON.parse(raw) as IgSeedEntry[];
  return _seedCache;
}

// ── Fuzzy name matcher ────────────────────────────────────────────────────────
function normalizeName(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9฀-๿]/g, "").trim();
}

function matchRestaurant(
  seed: IgSeedEntry,
  restaurants: Restaurant[]
): Restaurant | null {
  if (seed.place_id) {
    const byId = restaurants.find((r) => r.place_id === seed.place_id);
    if (byId) return byId;
  }
  const seedName = normalizeName(seed.name);
  const cityMatches = restaurants.filter((r) => r.city === seed.city);
  const byName = cityMatches.find((r) => normalizeName(r.name) === seedName);
  if (byName) return byName;
  if (seed.district) {
    const byNameDistrict = restaurants.find(
      (r) =>
        normalizeName(r.name) === seedName && r.district === seed.district
    );
    if (byNameDistrict) return byNameDistrict;
  }
  return null;
}

// ── Percentile-based threshold computation (Fix 1) ────────────────────────────
// Thresholds are derived from the actual matched trust_score distribution
// so each tab has a meaningful population regardless of how scores cluster.
// Hard guardrails override percentiles — truth over drama.
export function computeThresholds(scores: number[]): CollectionThresholds {
  if (scores.length < 3) {
    return { bigGapThreshold: GAP_THRESHOLD_LOW, holdsUpThreshold: GAP_THRESHOLD_HIGH };
  }
  const sorted = [...scores].sort((a, b) => a - b);
  const p = (pct: number) => {
    const idx = Math.floor((pct / 100) * (sorted.length - 1));
    return sorted[Math.max(0, Math.min(sorted.length - 1, idx))];
  };
  // Clamp so guardrail always wins over percentile math
  const bigGapThreshold = Math.min(p(33), GUARD_MIN);
  const holdsUpThreshold = Math.max(p(67), GUARD_MIN);
  return { bigGapThreshold, holdsUpThreshold };
}

// ── Gap classifier ────────────────────────────────────────────────────────────
function classifyGap(
  restaurant: Restaurant | null,
  thresholds: CollectionThresholds
): FamousVsGoodEntry["gap"] {
  if (!restaurant) return "unmatched";
  const s = restaurant.trust_score;
  // Guardrail: >= GUARD_MIN is NEVER big_gap; < GUARD_MIN is NEVER holds_up
  if (s >= thresholds.holdsUpThreshold && s >= GUARD_MIN) return "holds_up";
  if (s < thresholds.bigGapThreshold && s < GUARD_MIN) return "big_gap";
  return "decent";
}

// ── Main collection loader ────────────────────────────────────────────────────
export async function loadFamousVsGoodCollection(
  slug: string
): Promise<FamousVsGoodCollection> {
  const [seeds, db] = await Promise.all([loadIgSeed(), loadMasterDb()]);
  const filtered = seeds.filter((s) => s.category === slug);

  // First pass: resolve all matches
  const raw: { seed: IgSeedEntry; restaurant: Restaurant | null }[] = [];
  for (const seed of filtered) {
    const restaurant = matchRestaurant(seed, db.restaurants);
    if (!restaurant) console.log(`[famous-vs-good] unmatched: "${seed.name}"`);
    raw.push({ seed, restaurant });
  }

  // Compute thresholds from the matched set's trust_score distribution
  const matchedScores = raw
    .filter((m) => m.restaurant !== null)
    .map((m) => m.restaurant!.trust_score);
  const thresholds = computeThresholds(matchedScores);

  // Second pass: classify with dynamic thresholds
  const entries: FamousVsGoodEntry[] = raw.map(({ seed, restaurant }) => ({
    seed,
    restaurant,
    localGuideRatio:
      restaurant && restaurant.scraped_review_count > 0
        ? restaurant.local_guide_count / restaurant.scraped_review_count
        : null,
    gap: classifyGap(restaurant, thresholds),
  }));

  return { entries, thresholds };
}

// ── All unique category slugs ──────────────────────────────────────────────────
export async function loadAllSlugs(): Promise<string[]> {
  const seeds = await loadIgSeed();
  return Array.from(new Set(seeds.map((s) => s.category)));
}

// ── Hidden gems ────────────────────────────────────────────────────────────────
export async function loadHiddenGems(
  slug: string,
  limit = 6
): Promise<Restaurant[]> {
  const [seeds, db] = await Promise.all([loadIgSeed(), loadMasterDb()]);
  const inSeed = new Set(
    seeds.filter((s) => s.category === slug).map((s) => s.place_id).filter(Boolean)
  );
  const city = seeds.find((s) => s.category === slug)?.city ?? "bangkok";
  return db.restaurants
    .filter(
      (r) =>
        r.city === city &&
        r.trust_score >= GAP_THRESHOLD_HIGH &&
        !inSeed.has(r.place_id) &&
        (r.cuisines.includes("cafe") ||
          r.cuisines.includes("bakery") ||
          r.cuisines.includes("dessert"))
    )
    .sort((a, b) => b.trust_score - a.trust_score)
    .slice(0, limit);
}

// ── Outscraper CSV ingester (Fix 3) ───────────────────────────────────────────
// Run offline: npm run fvg:ingest -- path/to/outscraper-export.csv [category-slug]
// Column mapping is configurable — update DEFAULT_COLUMN_MAP to match your export.
export type OutscraperColumnMap = {
  name: string;
  place_id?: string;
  district?: string;
  city?: string;
  tag_count?: string;      // numeric tagged-post count column
  ig_signal_text?: string; // optional free-text signal column
};

const DEFAULT_COLUMN_MAP: OutscraperColumnMap = {
  name: "name",
  place_id: "place_id",
  district: "district",
  city: "city",
  tag_count: "tagged_posts",
  ig_signal_text: "hashtag",
};

export function parseOutscraperCSV(
  csvText: string,
  category: string,
  columnMap: OutscraperColumnMap = DEFAULT_COLUMN_MAP
): IgSeedEntry[] {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];

  // Minimal CSV split — handles quoted fields with commas
  function splitCsvLine(line: string): string[] {
    const result: string[] = [];
    let field = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === "," && !inQuotes) {
        result.push(field.trim());
        field = "";
      } else {
        field += ch;
      }
    }
    result.push(field.trim());
    return result;
  }

  const headers = splitCsvLine(lines[0]).map((h) => h.toLowerCase().replace(/^"|"$/g, ""));

  if (!headers.includes(columnMap.name.toLowerCase())) {
    throw new Error(
      `[fvg-ingest] Required column "${columnMap.name}" not found in CSV.\n` +
        `Detected headers: ${headers.join(", ")}\n` +
        `Update DEFAULT_COLUMN_MAP in lib/famous-vs-good.ts to match your export.`
    );
  }

  const col = (row: string[], key: string | undefined): string | null => {
    if (!key) return null;
    const idx = headers.indexOf(key.toLowerCase());
    if (idx === -1) return null;
    return (row[idx] ?? "").trim().replace(/^"|"$/g, "") || null;
  };

  const results: IgSeedEntry[] = [];
  for (const line of lines.slice(1)) {
    const row = splitCsvLine(line);
    const name = col(row, columnMap.name);
    if (!name) continue;

    const tagRaw = col(row, columnMap.tag_count);
    const tagCount = tagRaw ? parseInt(tagRaw.replace(/[^0-9]/g, ""), 10) || null : null;
    const igSignal = tagCount !== null
      ? `${tagCount.toLocaleString()} tagged posts`
      : "Frequently tagged on social";

    results.push({
      name,
      ig_signal: igSignal,
      tag_count: tagCount,
      place_id: col(row, columnMap.place_id),
      district: col(row, columnMap.district),
      city: col(row, columnMap.city) ?? "bangkok",
      category,
    });
  }
  return results;
}

// Merge incoming entries into existing seed — dedupe by place_id then name+district.
// Preserves all existing manual entries.
export function mergeIntoSeed(
  existing: IgSeedEntry[],
  incoming: IgSeedEntry[]
): IgSeedEntry[] {
  const byPlaceId = new Set(existing.filter((e) => e.place_id).map((e) => e.place_id!));
  const byNameDistrict = new Set(
    existing.map((e) => `${e.name.toLowerCase()}|${e.district ?? ""}`)
  );
  const added: IgSeedEntry[] = [];
  for (const entry of incoming) {
    if (entry.place_id && byPlaceId.has(entry.place_id)) continue;
    const key = `${entry.name.toLowerCase()}|${entry.district ?? ""}`;
    if (byNameDistrict.has(key)) continue;
    added.push(entry);
    if (entry.place_id) byPlaceId.add(entry.place_id);
    byNameDistrict.add(key);
  }
  return [...existing, ...added];
}
