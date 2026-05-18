// "Best for X" — supplier directory edition. Long-tail SEO + 차별화 정렬.
// 리뷰 텍스트 기반 토픽 분석은 비활성 (Apify export에 review text 없음).
// 카테고리 + 위치 + trust_score 기반으로만 선정.

import type { Supplier } from "./types";

export type Criterion = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  scoreFn: (r: Supplier) => number;
  filterFn?: (r: Supplier) => boolean;
};

export const BEST_FOR: Criterion[] = [
  {
    slug: "highly-recommended",
    title: "Most Highly Recommended Thai Suppliers",
    metaTitle: "Most Highly Recommended Thai Manufacturers & Suppliers",
    metaDescription:
      "Top Thai manufacturers, factories, and industrial estates with the strongest combined Trust Score and reviewer enthusiasm.",
    intro:
      "Thai suppliers with the strongest combination of Trust Score, review volume, and overall consensus from public Google reviews.",
    scoreFn: (r) => r.trust_score * 1.2,
    filterFn: (r) => r.trust_score >= 50,
  },
  {
    slug: "industrial-estates",
    title: "Best Industrial Estates in Thailand",
    metaTitle: "Best Industrial Estates in Thailand — Pinthong, Amata, WHA",
    metaDescription:
      "Top industrial estates across Thailand's Eastern Seaboard. Pinthong, Amata, WHA Logistics, Rojana — ranked by Trust Score.",
    intro:
      "Major industrial estates and parks across Thailand's Eastern Seaboard manufacturing belt. The biggest, most established estates by reviewer consensus.",
    scoreFn: (r) => r.trust_score * 1.5,
    filterFn: (r) => r.categories.includes("industrial_estate"),
  },
  {
    slug: "auto-parts",
    title: "Best Auto Parts Manufacturers in Thailand",
    metaTitle: "Best Auto Parts Manufacturers in Thailand — Tier 1 OEM",
    metaDescription:
      "Top Thai auto parts manufacturers — Aisin, AGC, Toyoda Gosei, Summit, and more. Tier 1 OEM suppliers ranked by Trust Score.",
    intro:
      "Thailand is one of the world's top automotive manufacturing hubs. These are the top-rated Tier 1 and Tier 2 auto parts manufacturers — most of them inside Eastern Seaboard estates.",
    scoreFn: (r) => r.trust_score * 1.3,
    filterFn: (r) => r.categories.includes("auto_parts"),
  },
  {
    slug: "warehouses",
    title: "Best Warehouses in Thailand",
    metaTitle: "Best Warehouses in Thailand — Eastern Seaboard Logistics",
    metaDescription:
      "Top warehouses for B2B sourcing and logistics across Thailand's Eastern Seaboard. Storage, fulfillment, and distribution facilities.",
    intro:
      "Major warehouse operations in and around Thailand's industrial belt. Logistics, storage, and distribution facilities ranked by reviewer Trust Score.",
    scoreFn: (r) => r.trust_score * 1.2,
    filterFn: (r) => r.categories.includes("warehouse") || r.categories.includes("logistics"),
  },
  {
    slug: "manufacturers",
    title: "Top Manufacturers in Thailand",
    metaTitle: "Top Manufacturers in Thailand — OEM, Auto, Electronics, Food",
    metaDescription:
      "Top Thai manufacturers across automotive, electronics, food, plastics, chemicals, and more. Eastern Seaboard manufacturing hub directory.",
    intro:
      "Verified Thai manufacturers across all key sectors — automotive, electronics, food, chemicals, plastics, packaging — ranked by Trust Score.",
    scoreFn: (r) => r.trust_score,
    filterFn: (r) => r.categories.includes("manufacturer"),
  },
  {
    slug: "with-website",
    title: "Thai Suppliers with Public Websites",
    metaTitle: "Thai Suppliers with Verified Websites — Direct Contact",
    metaDescription:
      "Thai manufacturers and suppliers with public websites — verified for direct B2B contact without sourcing-agent middlemen.",
    intro:
      "Thai suppliers with their own public websites. Direct contact channel for buyers wanting to skip sourcing-agent markups.",
    scoreFn: (r) => r.trust_score + (r.website ? 5 : 0),
    filterFn: (r) => Boolean(r.website) && r.trust_score >= 40,
  },
  {
    slug: "near-laem-chabang",
    title: "Best Suppliers Near Laem Chabang Port",
    metaTitle: "Suppliers Near Laem Chabang Port — Export-Ready Thai Manufacturers",
    metaDescription:
      "Thai suppliers in the Laem Chabang / Sriracha / Bowin corridor — closest to Thailand's largest export port.",
    intro:
      "Suppliers concentrated in the Sriracha / Laem Chabang / Bowin corridor — Thailand's main container export gateway. Best logistics for export-heavy buyers.",
    scoreFn: (r) => {
      const d = (r.district || "").toLowerCase();
      const portBoost = ["sriracha", "laem chabang", "bowin", "si racha"].some((k) => d.includes(k)) ? 25 : 0;
      return portBoost + r.trust_score;
    },
    filterFn: (r) => {
      const d = (r.district || "").toLowerCase();
      return ["sriracha", "laem chabang", "bowin", "si racha", "bang lamung"].some((k) => d.includes(k));
    },
  },
];

export function findBestFor(slug: string): Criterion | null {
  return BEST_FOR.find((c) => c.slug === slug) ?? null;
}
