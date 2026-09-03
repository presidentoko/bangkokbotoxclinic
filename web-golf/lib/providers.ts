// Booking-provider data layer.
//
// Every number that reaches a page from here was copied off a provider's own
// course page by scripts/golf_providers/*. There are no defaults, multipliers
// or "typical" values: a field the provider does not state is null and the UI
// renders it as "—". The registry (course id -> provider slug) is built by
// scripts/golf_providers/build_registry.py with a strict matcher plus the
// manual overrides in data/provider_overrides.json.

import { readFileSync } from "node:fs";
import path from "node:path";
import { trackingParams } from "./affiliate";

export type ProviderKey = "golfdigg" | "thaigolfbooking";

export const PROVIDER_LABEL: Record<ProviderKey, string> = {
  golfdigg: "Golfdigg",
  thaigolfbooking: "ThaiGolfBooking",
};

export const PROVIDER_HOME: Record<ProviderKey, string> = {
  golfdigg: "https://golfdigg.com",
  thaigolfbooking: "https://www.thaigolfbooking.com",
};

export type ProviderOffer = {
  provider: ProviderKey;
  providerLabel: string;
  /** Outbound booking URL with our tracking params appended. */
  url: string;
  weekday: number | null;
  weekend: number | null;
  caddy: number | null;
  cart: number | null;
  /** Plain-text bullets copied from the provider ("Included Golf Carts and Caddy"). */
  inclusions: string[];
  /** Provider's own headline package price, when it publishes one (ThaiGolfBooking "from ฿X per person"). */
  bookingPrice: number | null;
  scrapedAt: string;
};

export type CourseFacts = {
  holes: number | null;
  par: number | null;
  length_yd: number | null;
  designer: string | null;
  opening_hours: string | null;
};

type GolfdiggCourse = {
  slug: string; url: string; name: string | null;
  weekday_greenfee: number | null; weekend_greenfee: number | null;
  holes: number | null; par: number | null; length_yd: number | null; slope: number | null;
  opening_hours: string | null; inclusions: string[];
  website: string | null; phone: string | null; lat: number | null; lng: number | null;
  address: string | null; city_label: string | null; price_range_text: string | null;
};

type TgbCourse = {
  slug: string; url: string; name: string | null;
  weekday_greenfee: number | null; weekend_greenfee: number | null;
  caddy_fee: number | null; cart_fee: number | null; golf_set_fee: number | null;
  holes: number | null; par: number | null; yards: number | null;
  designer: string | null; website: string | null; phone: string | null; address: string | null;
  lat: number | null; lng: number | null; booking_price: number | null;
};

type ProviderFile<T> = { generated_at: string; provider: ProviderKey; courses: T[] };
type Registry = Record<string, Partial<Record<ProviderKey, string>>>;

type Loaded = {
  registry: Registry;
  golfdigg: { generatedAt: string; bySlug: Map<string, GolfdiggCourse> };
  thaigolfbooking: { generatedAt: string; bySlug: Map<string, TgbCourse> };
};

let _loaded: Loaded | null = null;

function readJson<T>(rel: string, fallback: T): T {
  try {
    return JSON.parse(readFileSync(path.join(process.cwd(), "data", rel), "utf-8")) as T;
  } catch {
    return fallback;
  }
}

function load(): Loaded {
  if (_loaded) return _loaded;
  const registry = readJson<Registry>("provider_registry.json", {});
  const gd = readJson<ProviderFile<GolfdiggCourse>>("providers/golfdigg.json", { generated_at: "", provider: "golfdigg", courses: [] });
  const tgb = readJson<ProviderFile<TgbCourse>>("providers/thaigolfbooking.json", { generated_at: "", provider: "thaigolfbooking", courses: [] });
  _loaded = {
    registry,
    golfdigg: { generatedAt: gd.generated_at, bySlug: new Map(gd.courses.map((c) => [c.slug, c])) },
    thaigolfbooking: { generatedAt: tgb.generated_at, bySlug: new Map(tgb.courses.map((c) => [c.slug, c])) },
  };
  return _loaded;
}

/** Append utm params to an outbound booking link. */
export function withTracking(url: string, medium = "compare"): string {
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}${trackingParams("thailandgolf", medium)}`;
}

function offerFromGolfdigg(c: GolfdiggCourse, scrapedAt: string): ProviderOffer {
  return {
    provider: "golfdigg",
    providerLabel: PROVIDER_LABEL.golfdigg,
    url: withTracking(c.url),
    weekday: c.weekday_greenfee,
    weekend: c.weekend_greenfee,
    caddy: null,
    cart: null,
    inclusions: c.inclusions ?? [],
    bookingPrice: null,
    scrapedAt,
  };
}

function offerFromTgb(c: TgbCourse, scrapedAt: string): ProviderOffer {
  return {
    provider: "thaigolfbooking",
    providerLabel: PROVIDER_LABEL.thaigolfbooking,
    url: withTracking(c.url),
    weekday: c.weekday_greenfee,
    weekend: c.weekend_greenfee,
    caddy: c.caddy_fee,
    cart: c.cart_fee,
    inclusions: c.golf_set_fee ? [`Club set rental ฿${c.golf_set_fee.toLocaleString()}`] : [],
    bookingPrice: c.booking_price,
    scrapedAt,
  };
}

function sortOffers(offers: ProviderOffer[]): ProviderOffer[] {
  return [...offers].sort((a, b) => {
    const wa = a.weekday ?? a.weekend ?? Infinity;
    const wb = b.weekday ?? b.weekend ?? Infinity;
    if (wa !== wb) return wa - wb;
    return a.providerLabel.localeCompare(b.providerLabel);
  });
}

/** All scraped offers for a course, cheapest known weekday first (unknown last). */
export function offersForCourse(id: string): ProviderOffer[] {
  const { registry, golfdigg, thaigolfbooking } = load();
  const m = registry[id];
  if (!m) return [];
  const out: ProviderOffer[] = [];
  if (m.golfdigg) {
    const c = golfdigg.bySlug.get(m.golfdigg);
    if (c && (c.weekday_greenfee !== null || c.weekend_greenfee !== null)) out.push(offerFromGolfdigg(c, golfdigg.generatedAt));
  }
  if (m.thaigolfbooking) {
    const c = thaigolfbooking.bySlug.get(m.thaigolfbooking);
    if (c && (c.weekday_greenfee !== null || c.weekend_greenfee !== null)) out.push(offerFromTgb(c, thaigolfbooking.generatedAt));
  }
  return sortOffers(out);
}

export function cheapestWeekday(id: string): { price: number; offer: ProviderOffer } | null {
  let best: { price: number; offer: ProviderOffer } | null = null;
  for (const o of offersForCourse(id)) {
    if (o.weekday === null) continue;
    if (!best || o.weekday < best.price) best = { price: o.weekday, offer: o };
  }
  return best;
}

export function cheapestWeekend(id: string): { price: number; offer: ProviderOffer } | null {
  let best: { price: number; offer: ProviderOffer } | null = null;
  for (const o of offersForCourse(id)) {
    if (o.weekend === null) continue;
    if (!best || o.weekend < best.price) best = { price: o.weekend, offer: o };
  }
  return best;
}

/** Course ids that have at least one offer with a weekday or weekend fee. */
export function pricedCourseIds(): Set<string> {
  const { registry } = load();
  const out = new Set<string>();
  for (const id of Object.keys(registry)) {
    if (offersForCourse(id).length > 0) out.add(id);
  }
  return out;
}

/** holes / par / length / designer merged from providers. Golfdigg wins for the
 *  card numbers, ThaiGolfBooking is the only source that names a designer. */
export function courseFacts(id: string): CourseFacts | null {
  const { registry, golfdigg, thaigolfbooking } = load();
  const m = registry[id];
  if (!m) return null;
  const gd = m.golfdigg ? golfdigg.bySlug.get(m.golfdigg) : undefined;
  const tg = m.thaigolfbooking ? thaigolfbooking.bySlug.get(m.thaigolfbooking) : undefined;
  if (!gd && !tg) return null;
  const facts: CourseFacts = {
    holes: gd?.holes ?? tg?.holes ?? null,
    par: gd?.par ?? tg?.par ?? null,
    length_yd: gd?.length_yd ?? tg?.yards ?? null,
    designer: tg?.designer ?? null,
    opening_hours: gd?.opening_hours ?? null,
  };
  if (facts.holes === null && facts.par === null && facts.length_yd === null && facts.designer === null && facts.opening_hours === null) return null;
  return facts;
}

export type ProviderStats = {
  providers: { key: ProviderKey; label: string; home: string; courses: number; priced: number; matched: number; generatedAt: string }[];
  coursesWithOffers: number;
  coursesWithTwoOrMore: number;
  latestScrape: string | null;
};

export function providerStats(): ProviderStats {
  const { registry, golfdigg, thaigolfbooking } = load();
  const matched = (k: ProviderKey) => Object.values(registry).filter((m) => m[k]).length;
  const priced = <T extends { weekday_greenfee: number | null; weekend_greenfee: number | null }>(m: Map<string, T>) =>
    [...m.values()].filter((c) => c.weekday_greenfee !== null || c.weekend_greenfee !== null).length;
  let withOffers = 0, withTwo = 0;
  for (const id of Object.keys(registry)) {
    const n = offersForCourse(id).length;
    if (n > 0) withOffers++;
    if (n >= 2) withTwo++;
  }
  const dates = [golfdigg.generatedAt, thaigolfbooking.generatedAt].filter(Boolean).sort();
  return {
    providers: [
      { key: "golfdigg", label: PROVIDER_LABEL.golfdigg, home: PROVIDER_HOME.golfdigg, courses: golfdigg.bySlug.size, priced: priced(golfdigg.bySlug), matched: matched("golfdigg"), generatedAt: golfdigg.generatedAt },
      { key: "thaigolfbooking", label: PROVIDER_LABEL.thaigolfbooking, home: PROVIDER_HOME.thaigolfbooking, courses: thaigolfbooking.bySlug.size, priced: priced(thaigolfbooking.bySlug), matched: matched("thaigolfbooking"), generatedAt: thaigolfbooking.generatedAt },
    ],
    coursesWithOffers: withOffers,
    coursesWithTwoOrMore: withTwo,
    latestScrape: dates.length ? dates[dates.length - 1] : null,
  };
}

/** "Golfdigg and ThaiGolfBooking" — for prose that names the compared sources. */
export function providerNames(): string {
  const labels = providerStats().providers.map((p) => p.label);
  if (labels.length <= 1) return labels.join("");
  return `${labels.slice(0, -1).join(", ")} and ${labels[labels.length - 1]}`;
}

export function formatScrapeDate(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", { timeZone: "Asia/Bangkok", year: "numeric", month: "long", day: "numeric" });
}
