// lib/reportData.ts
// Pure synchronous helper — no async, no Next.js imports.
// Takes already-loaded clinic + full clinic array + site config.

import type { Clinic } from "./types";
import type { SiteConfig } from "./site";

export type ReportData = {
  clinic: Clinic;
  trustPercentile: number;   // 1–100 (higher = better). e.g. 92 → "Top 8%"
  districtRank: number;      // 1-based rank in district by trust_score. 0 = no district data (check districtTotal === 0)
  districtTotal: number;     // total clinics in same district (same focus filter)
  districtService: string;   // human label e.g. "botox" | "dental"
  negativeCount: number;     // sample_reviews_negative.length
  intlPct: number;           // 0–100, rounded
  reportUrl: string;         // full URL to /report/<id>
  demoUrl: string;           // full URL to /dashboard/demo?as=<id>
};

export function buildReportData(
  clinic: Clinic,
  allClinics: Clinic[],
  cfg: SiteConfig,
  baseUrl: string,
): ReportData {
  const cityPeers = allClinics.filter(
    (c) => c.city_label === clinic.city_label,
  );
  const sorted = [...cityPeers].sort((a, b) => b.trust_score - a.trust_score);
  const rank = sorted.findIndex((c) => c.id === clinic.id);
  const trustPercentile =
    rank === -1 || sorted.length === 0
      ? 50
      : Math.round(((sorted.length - rank) / sorted.length) * 100);

  // District peers filtered by site focus (same logic as service pages)
  const districtPeers =
    clinic.district
      ? allClinics.filter(
          (c) =>
            c.district === clinic.district &&
            (cfg.focus === "all" || c.categories.includes(cfg.focus)),
        )
      : [];

  const districtSorted = [...districtPeers].sort(
    (a, b) => b.trust_score - a.trust_score,
  );
  const districtRankIdx = districtSorted.findIndex((c) => c.id === clinic.id);
  const districtRank = districtRankIdx === -1 ? 0 : districtRankIdx + 1;
  const districtTotal = districtPeers.length;

  const lb = clinic.language_breakdown ?? { th: 0, en: 0, ko: 0, ja: 0, other: 0 };
  const total = (lb.th ?? 0) + (lb.en ?? 0) + (lb.ko ?? 0) + (lb.ja ?? 0) + (lb.other ?? 0);
  const intl = total - (lb.th ?? 0);
  const intlPct = total === 0 ? 0 : Math.round((intl / total) * 100);

  const negativeCount = clinic.sample_reviews_negative?.length ?? 0;

  return {
    clinic,
    trustPercentile,
    districtRank,
    districtTotal,
    districtService: cfg.focus === "all" ? "aesthetic" : cfg.focus,
    negativeCount,
    intlPct,
    reportUrl: `${baseUrl}/report/${clinic.id}`,
    demoUrl: `${baseUrl}/dashboard/demo?as=${clinic.id}`,
  };
}
