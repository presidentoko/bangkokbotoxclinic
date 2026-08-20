// lib/reportData.ts — portable version (hair site)
// Pure synchronous helper. No async, no Next.js imports.

import type { Clinic } from "./types";

export type ReportData = {
  clinic: Clinic;
  trustPercentile: number;  // 1–100 (higher = better). e.g. 92 → "Top 8%"
  districtRank: number;     // always 0 — no district data in hair DB
  districtTotal: number;    // always 0
  districtService: string;
  negativeCount: number;    // reviews_sample with rating ≤ 2
  intlPct: number;          // always 0 — no language breakdown in hair DB
  reportUrl: string;
  demoUrl: string;
};

export function buildReportData(
  clinic: Clinic,
  allClinics: Clinic[],
  baseUrl: string,
): ReportData {
  const cityPeers = allClinics.filter((c) => c.city === clinic.city);
  const sorted = [...cityPeers].sort((a, b) => b.trust_score - a.trust_score);
  const rank = sorted.findIndex((c) => c.id === clinic.id);
  const trustPercentile =
    rank === -1 || sorted.length === 0
      ? 50
      : Math.round(((sorted.length - rank) / sorted.length) * 100);

  const negativeCount = clinic.reviews_sample.filter(
    (r) => r.rating !== null && r.rating <= 2,
  ).length;

  return {
    clinic,
    trustPercentile,
    districtRank: 0,
    districtTotal: 0,
    districtService: "hair",
    negativeCount,
    intlPct: 0,
    // 2026-08-20: next.config 의 trailingSlash:true 때문에 슬래시 없는 이 URL 들은
    // 매번 308 을 한 번 거친다. 아웃리치 메일에 그대로 박히는 링크라 리다이렉트
    // 홉이 붙으면 링크 검사기가 걸고 클릭 추적도 어긋난다 — 최종 형태로 적는다.
    reportUrl: `${baseUrl}/report/${clinic.id}/`,
    demoUrl: `${baseUrl}/dashboard/${clinic.id}/`,
  };
}
