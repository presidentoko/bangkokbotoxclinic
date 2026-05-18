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
    metaTitle: "Most Highly Recommended Thai Manufacturers — DBD-Verified",
    metaDescription:
      "Top DBD-verified Thai manufacturers. Capital, founding date, TSIC industry code — sourced directly from Thailand's official business registry.",
    intro:
      "DBD-verified Thai B2B suppliers — cross-checked with the official Department of Business Development registry. Sorted by review strength and supplier completeness.",
    scoreFn: (r) => (r.b2b_score ?? r.trust_score) + (r.verified ? 5 : 0),
    filterFn: (r) => r.verified === true,
  },
  {
    slug: "industrial-estates",
    title: "Best Industrial Estates in Thailand",
    metaTitle: "Best Industrial Estates in Thailand — Pinthong, Amata, WHA",
    metaDescription:
      "Top industrial estates across Thailand's Eastern Seaboard. Pinthong, Amata, WHA Logistics, Rojana — ranked by tenant count and verified status.",
    intro:
      "Major industrial estates and parks across Thailand's Eastern Seaboard manufacturing belt. Curated estate-categorized suppliers + verified estate operators.",
    scoreFn: (r) => (r.b2b_score ?? r.trust_score) * 1.5,
    filterFn: (r) => r.categories.includes("industrial_estate") || !!r.estate_slug,
  },
  {
    slug: "auto-parts",
    title: "Best Auto Parts Manufacturers in Thailand",
    metaTitle: "Best Auto Parts Manufacturers in Thailand — DBD-Verified Tier 1 OEM",
    metaDescription:
      "Top DBD-verified Thai auto parts manufacturers — capital, founding date, TSIC code surfaced. Tier 1 OEM suppliers serving Toyota, Honda, Isuzu plants.",
    intro:
      "Thailand is one of the world's top automotive manufacturing hubs. These are the top-rated Tier 1 and Tier 2 auto parts manufacturers — most of them inside Eastern Seaboard estates.",
    scoreFn: (r) => (r.b2b_score ?? r.trust_score) * 1.3 + (r.verified ? 4 : 0),
    filterFn: (r) => r.categories.includes("auto_parts"),
  },
  {
    slug: "warehouses",
    title: "Best Warehouses in Thailand",
    metaTitle: "Best Warehouses in Thailand — Eastern Seaboard Logistics",
    metaDescription:
      "Top warehouses for B2B sourcing and logistics across Thailand's Eastern Seaboard. Storage, fulfillment, and distribution facilities.",
    intro:
      "Major warehouse operations in and around Thailand's industrial belt. Logistics, storage, and distribution facilities ranked by buyer signals.",
    scoreFn: (r) => (r.b2b_score ?? r.trust_score) * 1.2,
    filterFn: (r) => r.categories.includes("warehouse") || r.categories.includes("logistics"),
  },
  {
    slug: "manufacturers",
    title: "Top Manufacturers in Thailand",
    metaTitle: "Top Manufacturers in Thailand — OEM, Auto, Electronics, Food",
    metaDescription:
      "Top Thai manufacturers across automotive, electronics, food, plastics, chemicals, and more. Eastern Seaboard manufacturing hub directory.",
    intro:
      "Verified Thai manufacturers across all key sectors — automotive, electronics, food, chemicals, plastics, packaging — ranked by buyer signals.",
    scoreFn: (r) => (r.b2b_score ?? r.trust_score) + (r.verified ? 3 : 0),
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
    scoreFn: (r) => (r.b2b_score ?? r.trust_score) + (r.website ? 3 : 0),
    filterFn: (r) => Boolean(r.website),
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
      const portBoost = ["sriracha", "laem chabang", "bowin", "si racha"].some((k) => d.includes(k)) ? 10 : 0;
      return portBoost + (r.b2b_score ?? r.trust_score);
    },
    filterFn: (r) => {
      const d = (r.district || "").toLowerCase();
      return ["sriracha", "laem chabang", "bowin", "si racha", "bang lamung"].some((k) => d.includes(k));
    },
  },
  {
    slug: "dbd-verified-by-capital",
    title: "Top DBD-Verified Suppliers by Registered Capital",
    metaTitle: "Largest DBD-Verified Thai Suppliers by Capital",
    metaDescription:
      "DBD-verified Thai manufacturers ranked by registered capital — a signal of operational scale, balance-sheet depth, and government-license tier.",
    intro:
      "Largest DBD-verified Thai B2B suppliers by registered capital. High capital correlates with operational scale, BOI promotion eligibility, and the ability to underwrite large export contracts.",
    scoreFn: (r) => (r.dbd?.capital_thb ?? 0),
    filterFn: (r) => r.verified === true && !!r.dbd?.capital_thb,
  },
];

export function findBestFor(slug: string): Criterion | null {
  return BEST_FOR.find((c) => c.slug === slug) ?? null;
}
