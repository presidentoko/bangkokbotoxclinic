// Sponsored slots — tier 별 배지.
// env vars:
//   SPONSORED_EDITORS_PICK="id1,id2"  → "Editor's Pick" 노란 배지
//   SPONSORED_RECOMMENDED="id3,id4"   → "Recommended" 파란 배지
//   SPONSORED_FEATURED="id5,id6"      → "Featured" 일반 배지

export type SponsoredTier = "editors_pick" | "recommended" | "featured";

const TIERS: Record<SponsoredTier, string[]> = {
  editors_pick: parseList(process.env.SPONSORED_EDITORS_PICK),
  recommended: parseList(process.env.SPONSORED_RECOMMENDED),
  featured: parseList(process.env.SPONSORED_FEATURED || process.env.SPONSORED_IDS),
};

function parseList(s: string | undefined): string[] {
  return (s || "").split(",").map((x) => x.trim()).filter(Boolean);
}

export function sponsoredTier(clinicId: string): SponsoredTier | null {
  if (TIERS.editors_pick.includes(clinicId)) return "editors_pick";
  if (TIERS.recommended.includes(clinicId)) return "recommended";
  if (TIERS.featured.includes(clinicId)) return "featured";
  return null;
}

export function isSponsored(clinicId: string): boolean {
  return sponsoredTier(clinicId) !== null;
}

export const SPONSORED_BADGE: Record<SponsoredTier, { label: string; bg: string; fg: string; icon: string }> = {
  editors_pick: { label: "Editor's Pick", bg: "#fef3c7", fg: "#92400e", icon: "★" },
  recommended: { label: "Recommended", bg: "#dbeafe", fg: "#1e40af", icon: "✓" },
  featured: { label: "Featured", bg: "#f3e8ff", fg: "#6b21a8", icon: "◆" },
};

// 페이지 상단 노출 정렬: editors_pick → recommended → trust_score 내림차순
export function sortWithSponsored<T extends { id: string; trust_score: number }>(items: T[]): T[] {
  const score = (t: T) => {
    const tier = sponsoredTier(t.id);
    if (tier === "editors_pick") return 1_000_000;
    if (tier === "recommended") return 500_000;
    if (tier === "featured") return 100_000;
    return 0;
  };
  return [...items].sort((a, b) => {
    const sa = score(a);
    const sb = score(b);
    if (sa !== sb) return sb - sa;
    return b.trust_score - a.trust_score;
  });
}
