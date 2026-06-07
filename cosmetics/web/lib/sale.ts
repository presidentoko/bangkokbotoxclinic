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
