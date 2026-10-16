import { describe, it, expect } from "vitest";
import {
  PRICE_FRESH_DAYS,
  priceAsOf,
  priceAgeDays,
  isPriceStale,
  hasLiveDiscount,
  priceAsOfLabel,
} from "../priceFreshness";
import { allProducts } from "../data";

const NOW = Date.parse("2026-10-16T00:00:00Z");
const row = (fetched_at?: string, discount_pct = 40) =>
  ({ fetched_at, discount_pct }) as Parameters<typeof hasLiveDiscount>[0];

describe("priceAsOf", () => {
  it("takes the date part of an ISO timestamp", () => {
    expect(priceAsOf(row("2026-06-03T11:22:33Z"))).toBe("2026-06-03");
    expect(priceAsOf(row("2026-06-03"))).toBe("2026-06-03");
  });

  it("returns null rather than a guess when the field is missing or junk", () => {
    expect(priceAsOf(row(undefined))).toBeNull();
    expect(priceAsOf(row(""))).toBeNull();
    expect(priceAsOf(row("sometime in June"))).toBeNull();
  });
});

describe("isPriceStale", () => {
  it("counts an undated price as stale — that is the case being fixed", () => {
    expect(isPriceStale(row(undefined), NOW)).toBe(true);
  });

  it("is exclusive at the boundary", () => {
    const d = new Date(NOW - PRICE_FRESH_DAYS * 86_400_000)
      .toISOString()
      .slice(0, 10);
    expect(priceAgeDays(row(d), NOW)).toBe(PRICE_FRESH_DAYS);
    expect(isPriceStale(row(d), NOW)).toBe(false);
    const older = new Date(NOW - (PRICE_FRESH_DAYS + 1) * 86_400_000)
      .toISOString()
      .slice(0, 10);
    expect(isPriceStale(row(older), NOW)).toBe(true);
  });
});

describe("hasLiveDiscount", () => {
  it("drops the -X% claim once the row goes stale", () => {
    expect(hasLiveDiscount(row("2026-06-03", 40), NOW)).toBe(false);
    expect(hasLiveDiscount(row("2026-10-10", 40), NOW)).toBe(true);
  });

  it("stays false when there is no discount to claim", () => {
    expect(hasLiveDiscount(row("2026-10-10", 0), NOW)).toBe(false);
  });
});

describe("priceAsOfLabel", () => {
  it("dates the price in the page's own language", () => {
    expect(priceAsOfLabel(row("2026-06-03"), "th")).toBe("ราคา ณ 3 มิ.ย. 2026");
    expect(priceAsOfLabel(row("2026-06-03"), "en")).toBe("Price as of 3 Jun 2026");
  });

  it("is null when undated, so the caller renders nothing", () => {
    expect(priceAsOfLabel(row(undefined), "th")).toBeNull();
  });
});

describe("the live catalogue", () => {
  // The reason this module exists: in October the site was publishing June
  // prices undated. If a future scrape refreshes them this assertion should be
  // relaxed, not deleted — it is here to keep the dating from being dropped
  // while the rows are still old.
  it("is mostly stale, so most pages must show a date", () => {
    const all = allProducts();
    const dated = all.filter((p) => priceAsOf(p) !== null);
    expect(dated.length).toBe(all.length);
    const stale = all.filter((p) => isPriceStale(p, NOW));
    expect(stale.length).toBeGreaterThan(all.length * 0.5);
  });
});
