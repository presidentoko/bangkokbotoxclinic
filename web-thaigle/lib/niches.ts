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

export async function loadNicheDb(niche: NicheSlug): Promise<NicheDb> {
  if (_nicheCache.has(niche)) return _nicheCache.get(niche)!;
  const raw = await fs.readFile(path.join(process.cwd(), "data", "by-niche", `${niche}.json`), "utf-8");
  const db = JSON.parse(raw) as NicheDb;
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

export function topNichePlaces(places: NichePlace[], n: number): NichePlace[] {
  return [...places]
    .filter((p) => p.trust_score > 0)
    .sort((a, b) => b.trust_score - a.trust_score)
    .slice(0, n);
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
