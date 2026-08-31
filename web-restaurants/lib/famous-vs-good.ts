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
  /** Short chip label. Must stay short — it renders inside a rounded pill. */
  ig_signal: string | null;
  /**
   * Count of Instagram posts tagged at the venue. Null for every entry we did
   * not get from a tagged-post export, which is all of them — do not reuse this
   * for any other kind of count. It renders literally as "N tagged posts", so a
   * review-mention count parked here would be published as a false statistic.
   */
  tag_count: number | null;
  /**
   * A reviewer's own sentence, quoted verbatim, for entries derived from the
   * review corpus (scripts/fvg-derive.mjs). This is what makes the "the feed
   * says" claim checkable instead of asserted.
   */
  evidence_quote?: string | null;
  /** How many reviews of this venue mention social media or the hype. */
  mention_count?: number | null;
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

// Ratio of the shared leading substring over the shorter name — catches
// branch-suffix variants ("After You Dessert Cafe" vs "...Cafe Thonglor")
// and abbreviation variants ("Rocket Coffeebar S.12" vs "...at Lumphini")
// that an exact-equality match misses.
function commonPrefixRatio(a: string, b: string): number {
  const max = Math.min(a.length, b.length);
  let i = 0;
  while (i < max && a[i] === b[i]) i++;
  return max === 0 ? 0 : i / max;
}

function fuzzyNameMatch(seedName: string, candidateName: string): boolean {
  if (seedName.length < 6 || candidateName.length < 6) return false;
  return commonPrefixRatio(seedName, candidateName) >= 0.65;
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
  const exact = cityMatches.find((r) => normalizeName(r.name) === seedName);
  if (exact) return exact;

  const fuzzyCandidates = cityMatches.filter((r) =>
    fuzzyNameMatch(seedName, normalizeName(r.name))
  );
  if (fuzzyCandidates.length === 0) return null;
  if (seed.district) {
    const sameDistrict = fuzzyCandidates.find((r) => r.district === seed.district);
    if (sameDistrict) return sameDistrict;
  }
  return fuzzyCandidates[0];
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

// ── Per-category copy ─────────────────────────────────────────────────────────
//
// The page used to build its heading by title-casing the slug, which works for
// "bangkok-cafes" and produces nonsense for anything else ("Social Famous
// Ranked by Real Data"). It also hard-coded café wording into the FAQ. Both
// break the moment a category isn't a café list, so each category states its
// own copy — including how its venues were chosen, which differs by category
// and is the part a reader is most entitled to know.

export type CategoryMeta = {
  /** Noun phrase that reads correctly inside a sentence. */
  label: string;
  title: string;
  description: string;
  /** Answer to "how did these places get on this list?" */
  selection: string;
};

const FALLBACK_SELECTION =
  "A manually curated seed list of venues that appear frequently in Bangkok café content on Instagram. We never invent engagement numbers — we only report what we can verify.";

export const CATEGORY_META: Record<string, CategoryMeta> = {
  "bangkok-cafes": {
    label: "Bangkok cafés",
    title: "Instagram Famous vs Actually Good: Bangkok Cafés Ranked by Real Data",
    description:
      "The Bangkok cafés that fill your feed, ranked by Trust Score from verified Google reviews. Which ones hold up, and which are a backdrop with a coffee menu.",
    selection: FALLBACK_SELECTION,
  },
  "social-famous": {
    label: "restaurants people found through Instagram and TikTok",
    title: "Found It on TikTok? Here's What the Reviews Actually Say",
    description:
      "Restaurants whose own reviewers say they came because of Instagram or TikTok — scored against the Google reviews they earned after everyone arrived.",
    selection:
      "These are venues where reviewers say, in their own words, that Instagram or TikTok is why they came, or that the place is somewhere you go to photograph. Every entry shows the sentence it came from. Reviewer self-promotion and the restaurants' own social-media offers are filtered out, and no venue is listed on a count we cannot show you.",
  },
  "hype-check": {
    label: "restaurants reviewers call overrated",
    title: "Overrated? What the Reviews Say About Bangkok & Pattaya's Hyped Restaurants",
    description:
      "Restaurants whose reviewers use the word overrated — checked against the Trust Score their full review history actually supports. Sometimes the crowd is wrong about the crowd.",
    selection:
      "These are venues where reviewers themselves say the reputation outran the restaurant — \"not worth the hype\", \"overrated\". Every entry shows the sentence it came from. A minority opinion is not a verdict, which is why each venue is still scored on its whole review history rather than on the complaint.",
  },
};

export function getCategoryMeta(slug: string): CategoryMeta {
  const known = CATEGORY_META[slug];
  if (known) return known;
  const label = slug.replace(/-/g, " ");
  return {
    label,
    title: `Instagram Famous vs Actually Good: ${label} Ranked by Real Data`,
    description: `${label} that trend on social media, ranked by Trust Score from verified Google reviews.`,
    selection: FALLBACK_SELECTION,
  };
}

// ── Hidden gems ────────────────────────────────────────────────────────────────
export async function loadHiddenGems(
  slug: string,
  limit = 6
): Promise<Restaurant[]> {
  const [seeds, db] = await Promise.all([loadIgSeed(), loadMasterDb()]);
  const categorySeeds = seeds.filter((s) => s.category === slug);
  // Exclude by the actually-resolved restaurant id, not just seed.place_id —
  // seeds with no place_id that still resolve via name matching must not be
  // eligible to reappear here as a "hidden gem the feed ignores".
  const matchedIds = new Set(
    categorySeeds
      .map((s) => matchRestaurant(s, db.restaurants))
      .filter((r): r is Restaurant => r !== null)
      .map((r) => r.id)
  );
  const city = categorySeeds[0]?.city ?? "bangkok";
  return db.restaurants
    .filter(
      (r) =>
        r.city === city &&
        r.trust_score >= GAP_THRESHOLD_HIGH &&
        !matchedIds.has(r.id) &&
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
