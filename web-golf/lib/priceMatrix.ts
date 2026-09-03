// web-golf/lib/priceMatrix.ts
//
// Compatibility facade over lib/providers.ts. The old price_matrix.json is
// gone — it carried a weekend fee invented as weekday × 1.30 and constant
// caddy/cart figures. Every value here now comes from a scraped provider
// offer; anything a provider does not publish is null.

import { loadMasterDb } from "./data";
import {
  offersForCourse, cheapestWeekday, cheapestWeekend, pricedCourseIds,
  type ProviderOffer,
} from "./providers";
import type { PriceEntry, PriceSlot } from "./types";

let _cache: PriceEntry[] | null = null;

/** One entry per course that has at least one scraped offer. */
export async function loadPriceMatrix(): Promise<PriceEntry[]> {
  if (_cache) return _cache;
  const db = await loadMasterDb();
  const priced = pricedCourseIds();
  const out: PriceEntry[] = [];
  for (const c of db.restaurants) {
    if (!priced.has(c.id)) continue;
    const offers = offersForCourse(c.id);
    const wd = cheapestWeekday(c.id);
    const we = cheapestWeekend(c.id);
    const best = wd?.offer ?? we?.offer ?? offers[0];
    out.push({
      course_id: c.id,
      scraped_at: offers.map((o) => o.scrapedAt).sort().at(-1) ?? "",
      source_agency: best.providerLabel,
      source_url: best.url,
      sources: offers.length,
      weekday: wd ? { greenfee: wd.price, caddy: wd.offer.caddy, cart: wd.offer.cart } : null,
      weekend: we ? { greenfee: we.price, caddy: we.offer.caddy, cart: we.offer.cart } : null,
      offers,
    });
  }
  _cache = out;
  return out;
}

/** Green fee + caddy + cart, only when all three were scraped. */
export function totalBaht(slot: PriceSlot | null): number | null {
  if (!slot || slot.greenfee === null || slot.caddy === null || slot.cart === null) return null;
  return slot.greenfee + slot.caddy + slot.cart;
}

export type PriceRow = {
  course_id: string;
  source_agency: string;
  source_url: string;
  /** Cheapest scraped weekday green fee across providers, or null. */
  weekday_greenfee: number | null;
  /** Cheapest scraped weekend green fee across providers, or null. */
  weekend_greenfee: number | null;
  /** Caddy / cart as listed by the provider behind the cheapest weekday fee, or null. */
  caddy: number | null;
  cart: number | null;
  sources: number;
  offers: ProviderOffer[];
  scraped_at: string;
};

export function toPriceRows(matrix: PriceEntry[]): PriceRow[] {
  return matrix.map((e) => ({
    course_id: e.course_id,
    source_agency: e.source_agency,
    source_url: e.source_url,
    weekday_greenfee: e.weekday?.greenfee ?? null,
    weekend_greenfee: e.weekend?.greenfee ?? null,
    caddy: e.weekday?.caddy ?? e.weekend?.caddy ?? null,
    cart: e.weekday?.cart ?? e.weekend?.cart ?? null,
    sources: e.sources,
    offers: e.offers,
    scraped_at: e.scraped_at,
  }));
}

/** Cheapest known weekday first; courses with only a weekend fee next; unknown last. */
export function sortRowsByCheapest(rows: PriceRow[]): PriceRow[] {
  return [...rows].sort((a, b) => {
    const ka = a.weekday_greenfee ?? (a.weekend_greenfee !== null ? a.weekend_greenfee + 1e6 : Infinity);
    const kb = b.weekday_greenfee ?? (b.weekend_greenfee !== null ? b.weekend_greenfee + 1e6 : Infinity);
    return ka - kb;
  });
}

/** Median weekend premium over weekday, in percent, across rows that publish both. Null when fewer than 3 rows. */
export function medianWeekendPremiumPct(rows: PriceRow[]): { pct: number; n: number } | null {
  const ratios = rows
    .filter((r) => r.weekday_greenfee !== null && r.weekend_greenfee !== null && r.weekday_greenfee! > 0)
    .map((r) => (r.weekend_greenfee! - r.weekday_greenfee!) / r.weekday_greenfee!)
    .sort((a, b) => a - b);
  if (ratios.length < 3) return null;
  const mid = Math.floor(ratios.length / 2);
  const med = ratios.length % 2 ? ratios[mid] : (ratios[mid - 1] + ratios[mid]) / 2;
  return { pct: Math.round(med * 100), n: ratios.length };
}
