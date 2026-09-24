import { allProducts } from "./data";
import type { Product } from "./types";

export const SALE_EVENTS = [
  { slug: "7-7",   labelTh: "7.7",   labelEn: "7.7 Sale",   month: 7,  day: 7  },
  { slug: "8-8",   labelTh: "8.8",   labelEn: "8.8 Sale",   month: 8,  day: 8  },
  { slug: "9-9",   labelTh: "9.9",   labelEn: "9.9 Sale",   month: 9,  day: 9  },
  { slug: "10-10", labelTh: "10.10", labelEn: "10.10 Sale",  month: 10, day: 10 },
  { slug: "11-11", labelTh: "11.11", labelEn: "11.11 Sale",  month: 11, day: 11 },
  { slug: "12-12", labelTh: "12.12", labelEn: "12.12 Sale",  month: 12, day: 12 },
] as const;

export type SaleEventSlug = typeof SALE_EVENTS[number]["slug"];

export function getSaleEvent(slug: string) {
  return SALE_EVENTS.find((e) => e.slug === slug) ?? null;
}

// The event happening today, else the next upcoming one this year, else
// wrap around to next year's first event. Used so nav links to /sale/*
// never point at a date that's already passed.
export function currentSaleEvent(now: Date = new Date()) {
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const today = SALE_EVENTS.find((e) => e.month === month && e.day === day);
  if (today) return today;
  const upcoming = SALE_EVENTS.find(
    (e) => e.month > month || (e.month === month && e.day > day)
  );
  return upcoming ?? SALE_EVENTS[0];
}

export type SaleProduct = Product & { _saleScore: number };

export function getSaleRanking(limit = 60): SaleProduct[] {
  return allProducts()
    .filter((p) => p.discount_pct > 0 && p.price_thb > 0)
    .map((p) => {
      const scoreVals = Object.values(p.total_score ?? {});
      const avgScore = scoreVals.length
        ? scoreVals.reduce((a, b) => a + b, 0) / scoreVals.length
        : 0;
      return { ...p, _saleScore: (p.discount_pct / 100) * avgScore };
    })
    .sort((a, b) => b._saleScore - a._saleScore)
    .slice(0, limit);
}

/**
 * The calendar date of an event, as a Date in UTC. Uses this year while the
 * date is still ahead, next year once it has passed.
 *
 * Entirely in UTC, both sides of the comparison. Reading "today" from the local
 * getters while building the event date with Date.UTC made the two disagree by
 * the offset: at 18:00 UTC on 10 October — 01:00 on the 11th in Bangkok — the
 * event date was judged already past and the page dated 10.10 to 2027, on the
 * day of the sale.
 */
export function saleEventDate(ev: { month: number; day: number }, now: Date = new Date()): Date {
  const year = now.getUTCFullYear();
  const thisYear = new Date(Date.UTC(year, ev.month - 1, ev.day));
  const todayUTC = new Date(Date.UTC(year, now.getUTCMonth(), now.getUTCDate()));
  return thisYear >= todayUTC ? thisYear : new Date(Date.UTC(year + 1, ev.month - 1, ev.day));
}

export type SaleStats = {
  discounted: number;
  total: number;
  medianPct: number;
  maxPct: number;
  halfOffCount: number;
  medianSavingThb: number;
  retailer: string | null;
  asOf: string | null;
};

const median = (xs: number[]) => {
  if (xs.length === 0) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2);
};

/**
 * What the catalogue actually says about discounting, for the sale pages.
 *
 * Every number here is counted from master_db.json at build time. Nothing about
 * a *future* event can be known — there is no price history in this dataset
 * (see the 2026-08-13 audit) — so the pages describe the snapshot and say when
 * it was taken rather than implying the figures are today's shelf prices.
 */
export function saleStats(): SaleStats {
  const all = allProducts();
  const discounted = all.filter((p) => p.discount_pct > 0 && p.price_thb > 0);
  const savings = discounted
    .filter((p) => p.list_price_thb > p.price_thb)
    .map((p) => p.list_price_thb - p.price_thb);
  const hosts = new Set(
    discounted
      .map((p) => {
        try {
          return new URL(p.url).hostname.replace(/^www\./, "");
        } catch {
          return "";
        }
      })
      .filter(Boolean)
  );
  const dates = all.map((p) => String(p.fetched_at ?? "").slice(0, 10)).filter(Boolean);
  return {
    discounted: discounted.length,
    total: all.length,
    medianPct: median(discounted.map((p) => p.discount_pct)),
    maxPct: discounted.reduce((m, p) => Math.max(m, p.discount_pct), 0),
    halfOffCount: discounted.filter((p) => p.discount_pct >= 50).length,
    medianSavingThb: median(savings),
    // Named only when the whole snapshot came from one place, which it does
    // today (Konvy); otherwise the pages say "retailers" rather than guess.
    retailer: hosts.size === 1 ? [...hosts][0] : null,
    asOf: dates.length ? dates.sort()[dates.length - 1] : null,
  };
}
