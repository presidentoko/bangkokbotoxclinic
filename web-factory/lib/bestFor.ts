// "Best for X" — supplier directory edition. Long-tail SEO + 차별화 정렬.

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
  {
    slug: "competitive-price",
    title: "Most Competitively Priced Thai Suppliers",
    metaTitle: "Competitively Priced Thai Suppliers — Buyer-Verified Pricing",
    metaDescription:
      "Thai manufacturers flagged by buyers as competitively priced. Sourced from real Google review sentiment — no marketing claims.",
    intro:
      "Suppliers where buyers explicitly mention competitive pricing in their reviews. Ranked by pricing signal strength — useful when margin or MOQ is your primary filter.",
    scoreFn: (r) => {
      const t = r.mentioned_topics?.find((x) => x.topic === "competitive_price");
      return (t?.count ?? 0) * 5 + (r.b2b_score ?? r.trust_score);
    },
    filterFn: (r) =>
      (r.mentioned_topics?.find((x) => x.topic === "competitive_price")?.count ?? 0) >= 1,
  },
  {
    slug: "on-time-delivery",
    title: "Thai Suppliers with Best On-Time Delivery",
    metaTitle: "Best On-Time Delivery Thai Manufacturers — Buyer-Verified",
    metaDescription:
      "Thai suppliers consistently praised for on-time delivery in buyer reviews. Critical signal for JIT supply chains and export deadlines.",
    intro:
      "Suppliers repeatedly praised for on-time delivery in buyer reviews. Key signal for buyers building JIT supply chains or working with tight shipping windows.",
    scoreFn: (r) => {
      const on = r.mentioned_topics?.find((x) => x.topic === "on_time")?.count ?? 0;
      const del = r.mentioned_topics?.find((x) => x.topic === "delayed")?.count ?? 0;
      return (on - del) * 6 + (r.b2b_score ?? r.trust_score);
    },
    filterFn: (r) =>
      (r.mentioned_topics?.find((x) => x.topic === "on_time")?.count ?? 0) >= 1,
  },
  {
    slug: "food-manufacturers",
    title: "Top Food Manufacturers in Thailand",
    metaTitle: "Top Thai Food Manufacturers — Export, OEM, HACCP",
    metaDescription:
      "Thailand's top food manufacturers — ready-to-eat, frozen, condiments, snacks. OEM / private label for export markets. Ranked by buyer trust signals.",
    intro:
      "Thailand is Southeast Asia's largest food exporter. These are the top-rated food manufacturers — covering frozen food, condiments, snacks, and specialty processing — ranked by buyer trust signals and certification mentions.",
    scoreFn: (r) => {
      const foodScore = (r.mentioned_topics?.find((x) => x.topic === "food_safety")?.count ?? 0) * 4;
      return foodScore + (r.b2b_score ?? r.trust_score) + (r.verified ? 3 : 0);
    },
    filterFn: (r) => r.categories.includes("food_mfg"),
  },
  {
    slug: "electronics-manufacturers",
    title: "Top Electronics Manufacturers in Thailand",
    metaTitle: "Top Thai Electronics Manufacturers — PCB, EMS, Components",
    metaDescription:
      "Thailand's top electronics manufacturers — PCB assembly, EMS, semiconductors, components. Eastern Seaboard cluster. Ranked by buyer trust score.",
    intro:
      "Thailand ranks among Asia's top electronics manufacturing hubs. These are the highest-trust electronics manufacturers — covering PCB, EMS, components, and related services — concentrated in Chon Buri, Pathum Thani, and Samut Prakan.",
    scoreFn: (r) => (r.b2b_score ?? r.trust_score) * 1.4 + (r.verified ? 4 : 0),
    filterFn: (r) => r.categories.includes("electronics"),
  },
  {
    slug: "export-ready",
    title: "Export-Ready Thai Suppliers",
    metaTitle: "Export-Ready Thai Manufacturers — International B2B",
    metaDescription:
      "Thai suppliers flagged by buyers as export-capable — international shipping experience, English support, and documented export processes.",
    intro:
      "Suppliers explicitly mentioned as export-ready by buyers. Includes companies with international shipping experience, English-speaking sales contacts, and the documentation processes required for overseas buyers.",
    scoreFn: (r) => {
      const exp = r.mentioned_topics?.find((x) => x.topic === "export_ready")?.count ?? 0;
      return exp * 6 + (r.b2b_score ?? r.trust_score) + (r.categories.includes("exporter") ? 5 : 0);
    },
    filterFn: (r) =>
      (r.mentioned_topics?.find((x) => x.topic === "export_ready")?.count ?? 0) >= 1 ||
      r.categories.includes("exporter"),
  },
  {
    slug: "boi-eligible",
    title: "BOI-Eligible Thai Manufacturers",
    metaTitle: "BOI-Eligible Thai Manufacturers — Tax Incentives & Export Zones",
    metaDescription:
      "Thai manufacturers in BOI-promoted industries — electronics, automotive, food processing, chemicals. Located in industrial estates with tax incentive access.",
    intro:
      "Manufacturers operating in industries commonly promoted by Thailand's Board of Investment (BOI) — electronics, automotive parts, food processing, chemicals, and plastics. Many are inside industrial estates that offer BOI tax incentives and export facilitation.",
    scoreFn: (r) =>
      (r.boi_candidate ? 8 : 0) + (r.estate_slug ? 6 : 0) + (r.b2b_score ?? r.trust_score) + (r.verified ? 3 : 0),
    filterFn: (r) => r.boi_candidate === true || !!r.estate_slug,
  },
];

export function findBestFor(slug: string): Criterion | null {
  return BEST_FOR.find((c) => c.slug === slug) ?? null;
}
