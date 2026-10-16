import type { Product } from "./types";

/**
 * How old a row's price is, and whether a claim may still be made about it.
 *
 * The sale pages already do this: lib/sale.ts computes `asOf` and
 * /sale/[event] prints "prices were collected from <retailer> on <date> and may
 * have changed since". The product pages — 878 products x 2 locales, nearly the
 * whole site — never got it, so they print a price with no date at all.
 *
 * That matters more than it looks. Measured 2026-10-16 over the live
 * master_db.json: 947 of 1,003 published products carry `fetched_at` between
 * 2026-06-01 and 2026-06-05. The site has been publishing June prices in
 * October as current, and computing budget filters, "cheaper alternative"
 * savings and -X% discount badges from them.
 *
 * A price can be published honestly by dating it. A discount cannot: "-40%"
 * is a claim about what the shop is doing right now, and a four-month-old one
 * is simply wrong. So `priceAsOf` dates the number and `hasLiveDiscount` drops
 * the comparative claim once the row is stale.
 *
 * These pages are statically prerendered, so "now" is build time. That is
 * accurate for the as-of date (an absolute date stays true) and approximate for
 * staleness (a page keeps whatever verdict it was built with until the next
 * deploy) — the same compromise lib/sale.ts makes.
 */

export const PRICE_FRESH_DAYS = 45;

/** "2026-06-03", or null when the row carries no scrape timestamp. */
export function priceAsOf(p: Pick<Product, "fetched_at">): string | null {
  const iso = String(p.fetched_at ?? "").slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(iso) ? iso : null;
}

export function priceAgeDays(
  p: Pick<Product, "fetched_at">,
  now: number = Date.now()
): number | null {
  const iso = priceAsOf(p);
  if (!iso) return null;
  const t = Date.parse(`${iso}T00:00:00Z`);
  if (Number.isNaN(t)) return null;
  return Math.floor((now - t) / 86_400_000);
}

/** Unknown dates count as stale: an undated price is the thing being fixed. */
export function isPriceStale(
  p: Pick<Product, "fetched_at">,
  now: number = Date.now()
): boolean {
  const age = priceAgeDays(p, now);
  return age === null || age > PRICE_FRESH_DAYS;
}

export function hasLiveDiscount(
  p: Pick<Product, "fetched_at" | "discount_pct">,
  now: number = Date.now()
): boolean {
  return (p.discount_pct ?? 0) > 0 && !isPriceStale(p, now);
}

const TH_MONTHS = [
  "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
  "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
];
const EN_MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** "ราคา ณ 3 มิ.ย. 2026" / "Price as of 3 Jun 2026". Null when undated. */
export function priceAsOfLabel(
  p: Pick<Product, "fetched_at">,
  locale: string
): string | null {
  const iso = priceAsOf(p);
  if (!iso) return null;
  const [y, m, d] = iso.split("-").map(Number);
  const day = String(d);
  return locale === "th"
    ? `ราคา ณ ${day} ${TH_MONTHS[m - 1]} ${y}`
    : `Price as of ${day} ${EN_MONTHS[m - 1]} ${y}`;
}
