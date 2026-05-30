// Sponsored slots — tier 별 배지.
// env vars:
//   SPONSORED_EDITORS_PICK="id1,id2"  → "Editor's Pick" 노란 배지
//   SPONSORED_RECOMMENDED="id3,id4"   → "Recommended" 파란 배지
//   SPONSORED_FEATURED="id5,id6"      → "Featured" 일반 배지

import type { Supplier } from "./types";
import { computeTrustScore } from "./trustScore";

export type SponsoredTier = "editors_pick" | "recommended" | "featured";

const TIERS: Record<SponsoredTier, string[]> = {
  editors_pick: parseList(process.env.SPONSORED_EDITORS_PICK),
  recommended: parseList(process.env.SPONSORED_RECOMMENDED),
  featured: parseList(process.env.SPONSORED_FEATURED || process.env.SPONSORED_IDS),
};

function parseList(s: string | undefined): string[] {
  return (s || "").split(",").map((x) => x.trim()).filter(Boolean);
}

export function sponsoredTier(id: string): SponsoredTier | null {
  if (TIERS.editors_pick.includes(id)) return "editors_pick";
  if (TIERS.recommended.includes(id)) return "recommended";
  if (TIERS.featured.includes(id)) return "featured";
  return null;
}

export function isSponsored(id: string): boolean {
  return sponsoredTier(id) !== null;
}

export const SPONSORED_BADGE: Record<SponsoredTier, { label: string; bg: string; fg: string; icon: string }> = {
  editors_pick: { label: "Editor's Pick", bg: "#fef3c7", fg: "#92400e", icon: "★" },
  recommended: { label: "Recommended", bg: "#dbeafe", fg: "#1e40af", icon: "✓" },
  featured: { label: "Featured", bg: "#f3e8ff", fg: "#6b21a8", icon: "◆" },
};

// 페이지 상단 노출 정렬: editors_pick → recommended → featured → Trust Score(composite) 내림차순.
export function sortWithSponsored(items: Supplier[]): Supplier[] {
  const overall = new Map<string, number>();
  for (const t of items) overall.set(t.id, computeTrustScore(t).overall);
  const slot = (t: Supplier) => {
    const tier = sponsoredTier(t.id);
    if (tier === "editors_pick") return 1_000_000;
    if (tier === "recommended") return 500_000;
    if (tier === "featured") return 100_000;
    return 0;
  };
  return [...items].sort((a, b) => {
    const sa = slot(a);
    const sb = slot(b);
    if (sa !== sb) return sb - sa;
    return (overall.get(b.id) ?? 0) - (overall.get(a.id) ?? 0);
  });
}
