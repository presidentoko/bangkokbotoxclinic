import { promises as fs } from "node:fs";
import path from "node:path";

export const NICHES = [
  { slug: "muay-thai",    label: "Muay Thai",       icon: "🥊", desc: "Muay Thai gyms & training camps in Thailand",         planType: "gym"      },
  { slug: "spa",          label: "Spa & Massage",    icon: "💆", desc: "Thai massage, spa & wellness retreats",               planType: "wellness" },
  { slug: "wellness",     label: "Wellness",          icon: "🌿", desc: "Wellness centers, meditation & health retreats",      planType: "wellness" },
  { slug: "yoga-pilates", label: "Yoga & Pilates",   icon: "🧘", desc: "Yoga studios & Pilates classes",                     planType: "wellness" },
  { slug: "cooking",      label: "Cooking Classes",  icon: "👨‍🍳", desc: "Thai cooking classes & food experiences",            planType: "wellness" },
  { slug: "coworking",    label: "Coworking",         icon: "💻", desc: "Coworking spaces & digital nomad cafés",             planType: "wellness" },
  { slug: "diving",       label: "Diving",            icon: "🤿", desc: "Scuba diving, freediving & snorkeling experiences",  planType: "gym"      },
] as const;

export type NicheSlug = (typeof NICHES)[number]["slug"];

export type NicheAffiliate = {
  klook: string;
  viator: string;
  getyourguide: string;
  agoda: string;
  tripcom: string;
  bookimed: string;
};

export type NicheLanguages = {
  en: boolean;
  ko: boolean;
  th: boolean;
  zh: boolean;
  ja: boolean;
  ar: boolean;
};

export type NichePlace = {
  id: string;
  slug: string;
  niche: string;
  name: string;
  address: string;
  city: string;
  rating: number | null;
  review_count: number | null;
  phone: string;
  website: string;
  category: string;
  google_maps_url: string;
  top_review_text: string | null;
  top_photo_url: string | null;
  photos_sample: string[];
  price_min_thb: number;
  price_max_thb: number;
  price_unit: string;
  price_band: string;
  trust_score: number;
  is_beginner_friendly: boolean;
  is_advanced_oriented: boolean;
  is_open_24h: boolean;
  is_suspected_viral: boolean;
  /**
   * Set by scripts/enrich_from_apify.py when Google reports the venue as
   * permanently closed. Such venues are dropped from every listing and stop
   * generating a page. Temporarily closed venues are deliberately NOT flagged —
   * they reopen, and retiring the URL costs its indexing.
   */
  permanently_closed?: boolean;
  is_partner: boolean;
  beginner_score: number;
  languages: NicheLanguages;
  affiliate: NicheAffiliate;
  opening_hours_json: string;
  reviews_sample: { source: string; reviewer: string; rating: number | null; date: string; text: string }[];
};

export type NicheDb = {
  generated_at: string;
  niche: string;
  total: number;
  places: NichePlace[];
};

export type KlookProduct = {
  title: string;
  price_thb: number | null;
  rating: number;
  review_count: number;
  product_url: string;
  photo_url: string;
  position: number;
};

export type KlookEntry = {
  search_url: string;
  products: KlookProduct[];
};

type KlookMap = Record<string, KlookEntry>;

export type CommunityPost = {
  kind: string;
  title: string;
  url: string;
  snippet: string;
  score: number;
  comments: number;
  author: string;
  subreddit?: string;
  date: string;
};

export type CommunityDb = {
  generated_at: string;
  niche: string;
  counts: { reddit: number; pantip: number; naver: number };
  top_reddit: CommunityPost[];
  top_pantip: CommunityPost[];
  top_naver: CommunityPost[];
};

let _klookCache: KlookMap | null = null;
const _nicheCache = new Map<string, NicheDb>();
const _communityCache = new Map<string, CommunityDb>();

async function loadKlook(): Promise<KlookMap> {
  if (_klookCache) return _klookCache;
  try {
    const raw = await fs.readFile(path.join(process.cwd(), "data", "per_place_klook.json"), "utf-8");
    _klookCache = JSON.parse(raw) as KlookMap;
  } catch {
    _klookCache = {};
  }
  return _klookCache;
}

/**
 * Places the scrape filed under "Bangkok" whose own address says otherwise.
 *
 * The niche scrapes ran from Bangkok search centres and stamped every result
 * `city: "Bangkok"`, so a Koh Tao dive shop came back as a Bangkok venue.
 * Measured 2026-09-16: 12 Koh Tao and 3 Phang Nga diving centres, Chiang Mai
 * muay thai and coworking venues, a Phuket gym, Koh Phangan wellness — each
 * listed on a Bangkok hub and described as "in Bangkok" on its own page.
 *
 * Conservative on purpose. It only moves a place whose address names one of
 * these localities AND does not mention Bangkok at all. Nonthaburi, Samut
 * Prakan and Pathum Thani stay: they are the Bangkok metro area someone
 * searching "spa bangkok" would still accept, and moving them would drain the
 * Bangkok hubs without making anything more accurate.
 *
 * Fixed at load rather than in the JSON so a re-scrape cannot quietly bring
 * it back. Venue URLs carry no city, so no URL moves.
 */
const MISFILED_LOCALITIES: [RegExp, string][] = [
  [/\bKoh? Tao\b/i, "Koh Tao"],
  [/\bKoh? Pha-?ngan\b|\bKoh Phanghan\b/i, "Koh Phangan"],
  [/\bKoh? Samui\b/i, "Koh Samui"],
  [/\bPhang Nga\b/i, "Phang Nga"],
  [/\bKrabi\b/i, "Krabi"],
  [/\bChiang Mai\b/i, "Chiang Mai"],
  [/\bPhuket\b/i, "Phuket"],
  [/\bPattaya\b|\bBang Lamung\b/i, "Pattaya"],
  [/\bHua Hin\b/i, "Hua Hin"],
];

function correctedCity(p: NichePlace): string {
  if (p.city !== "Bangkok" || !p.address) return p.city;
  if (/Bangkok|Krung Thep|กรุงเทพ/i.test(p.address)) return p.city;
  for (const [pattern, city] of MISFILED_LOCALITIES) {
    if (pattern.test(p.address)) return city;
  }
  return p.city;
}

export async function loadNicheDb(niche: NicheSlug): Promise<NicheDb> {
  if (_nicheCache.has(niche)) return _nicheCache.get(niche)!;
  const raw = await fs.readFile(path.join(process.cwd(), "data", "by-niche", `${niche}.json`), "utf-8");
  const db = JSON.parse(raw) as NicheDb;
  for (const p of db.places) {
    p.trust_score = Math.max(0, Math.min(100, p.trust_score));
    p.city = correctedCity(p);
  }
  _nicheCache.set(niche, db);
  return db;
}

export async function loadCommunityDb(niche: NicheSlug): Promise<CommunityDb | null> {
  if (_communityCache.has(niche)) return _communityCache.get(niche)!;
  try {
    const raw = await fs.readFile(path.join(process.cwd(), "data", "community", `${niche}.json`), "utf-8");
    const db = JSON.parse(raw) as CommunityDb;
    _communityCache.set(niche, db);
    return db;
  } catch {
    return null;
  }
}

/**
 * Ranking only — does NOT guarantee a detail page exists for what it returns.
 *
 * Callers that render links to /activities/{niche}/{slug} must use
 * qualifyingNichePlaces() instead: that one applies the same gate as
 * generateStaticParams(), so its results always have a built page. Using this
 * function for a listing shipped 58 dead /activities/spa/* links to production.
 *
 * @internal — prefer qualifyingNichePlaces() everywhere outside this module.
 */
export function topNichePlaces(places: NichePlace[], n: number): NichePlace[] {
  const open = places.filter((p) => !p.permanently_closed);
  const rated = [...open]
    .filter((p) => p.trust_score > 0 && !!p.rating && !!p.review_count && p.review_count > 0)
    .sort((a, b) => b.trust_score - a.trust_score);
  if (rated.length > 0) return rated.slice(0, n);

  // Some scraped datasets (e.g. spa, yoga-pilates) ship with rating/review_count
  // entirely null across the board — fall back to trust_score-only ranking
  // instead of returning an empty list for the whole niche.
  return [...open]
    .filter((p) => p.trust_score > 0)
    .sort((a, b) => b.trust_score - a.trust_score)
    .slice(0, n);
}

// spa ships with rating/review_count null across the board, so
// topNichePlaces() alone lets through ~2,000 pages with almost nothing to
// show. Any page that LISTS or LINKS to venue detail pages (niche hub, city
// landing, etc.) should filter through this first, matching the same gate
// generateStaticParams uses in app/activities/[niche]/[slug]/page.tsx —
// otherwise a listing page links to slugs that were never actually built.
/**
 * Niches that shipped with no rated venues at all and were backfilled later.
 *
 * While a niche has zero rated venues, topNichePlaces() serves its unrated
 * fallback, so every venue in it gets a page. The moment a backfill gives some
 * of them real ratings that fallback closes, and every venue the backfill
 * didn't reach silently loses the URL it already had — 40 pages for spa, 266
 * for yoga. Both were caught in verification, and both would have been live
 * 404s. For these niches the unrated remainder is kept, ranked below the rated
 * venues.
 *
 * A niche that has always had ratings (muay-thai, cooking, …) is not listed:
 * its unrated venues have never had pages, and giving them one now would be
 * publishing a name with nothing attached to it.
 */
const BACKFILLED_NICHES = new Set(["spa", "yoga-pilates"]);

export function qualifyingNichePlaces(nicheSlug: string, places: NichePlace[]): NichePlace[] {
  const top = topNichePlaces(places, Infinity);
  if (!BACKFILLED_NICHES.has(nicheSlug)) return top;

  const ranked = new Set(top.map((p) => p.id));
  const unrated = places
    .filter((p) => !ranked.has(p.id) && p.trust_score > 0 && !p.permanently_closed)
    .sort((a, b) => b.trust_score - a.trust_score);
  const all = [...top, ...unrated];

  // spa alone still needs a content gate: 1,942 of its venues carry a name and
  // a maps link and nothing else, which is thin enough that publishing them
  // was what put the niche in "Discovered - currently not indexed". yoga's
  // unrated remainder all have photos, so they clear this anyway.
  if (nicheSlug !== "spa") return all;
  return all.filter(
    (p) => p.price_min_thb > 0 || !!p.top_review_text || p.reviews_sample.length > 0 || !!p.top_photo_url
  );
}

// Shared between the niche/[niche]/city/[city] landing pages and the niche
// hub page's "browse by city" links — see app/activities/[niche]/city/[city]
// for why this only splits by `city` (district/address is 0% populated in
// the scraped data, city is reliably populated).
export const NICHE_CITY_SLUGS: Record<string, string> = {
  Bangkok: "bangkok",
  Phuket: "phuket",
  "Chiang Mai": "chiang-mai",
  Pattaya: "pattaya",
};
export const NICHE_CITY_MIN_VENUES = 15;

export function nicheCityCounts(nicheSlug: string, places: NichePlace[]): { city: string; slug: string; count: number }[] {
  const qualifying = qualifyingNichePlaces(nicheSlug, places);
  const counts = new Map<string, number>();
  for (const p of qualifying) {
    if (NICHE_CITY_SLUGS[p.city]) counts.set(p.city, (counts.get(p.city) ?? 0) + 1);
  }
  return [...counts.entries()]
    .filter(([, count]) => count >= NICHE_CITY_MIN_VENUES)
    .map(([city, count]) => ({ city, slug: NICHE_CITY_SLUGS[city], count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * True when /activities/{niche}/city/{city} would be a copy of the niche hub.
 *
 * The hub titles itself with cityScopeLabel(): a niche that is 60%+ Bangkok is
 * "Best X in Bangkok". Its Bangkok city page then carries the same title for
 * the same query — on 2026-09-16 wellness, coworking and diving had identical
 * titles and venue counts on both URLs, and muay-thai differed only in the
 * count. In three months of GSC data the hubs drew impressions and not one of
 * these city pages drew any.
 *
 * The page keeps existing (URLs Google already knows must not 404) but its
 * canonical points at the hub, and it is left out of the sitemap and out of
 * the hub's "Browse by city" links.
 */
export function cityPageDuplicatesHub(nicheSlug: string, places: NichePlace[], city: string): boolean {
  return cityScopeLabel(qualifyingNichePlaces(nicheSlug, places)) === city;
}

// Several niches (spa, cooking, yoga-pilates) are majority non-Bangkok in
// the actual ranked data — labeling those "in Bangkok" is both inaccurate
// and gives up head-term SEO for Chiang Mai/Phuket/Pattaya searches.
export function cityScopeLabel(places: NichePlace[]): string {
  if (places.length === 0) return "Bangkok";
  const counts = new Map<string, number>();
  for (const p of places) counts.set(p.city, (counts.get(p.city) ?? 0) + 1);
  const bangkokShare = (counts.get("Bangkok") ?? 0) / places.length;
  return bangkokShare >= 0.6 ? "Bangkok" : "Thailand";
}

export function findBySlug(places: NichePlace[], slug: string): NichePlace | null {
  return places.find((p) => p.slug === slug) ?? null;
}

export async function getKlookForPlace(id: string): Promise<KlookEntry | null> {
  const klook = await loadKlook();
  return klook[id] ?? null;
}

export async function buildKlookIndex(ids: string[]): Promise<Map<string, KlookEntry>> {
  const klook = await loadKlook();
  const map = new Map<string, KlookEntry>();
  for (const id of ids) {
    if (klook[id]) map.set(id, klook[id]);
  }
  return map;
}

export function nicheInfo(slug: NicheSlug) {
  return NICHES.find((n) => n.slug === slug)!;
}
