// Sponsored slots — Redis 우선 (admin 가 즉시 수정 가능), env var fallback.
// React cache() 로 request 당 1회만 Redis fetch.

import { cache } from "react";
import { listSponsored, type SponsoredMap, type SponsoredTier } from "./sponsoredStore";

export type { SponsoredTier, SponsoredMap };

const getSponsoredMap = cache(async (): Promise<SponsoredMap> => {
  return await listSponsored();
});

export async function sponsoredTier(clinicId: string): Promise<SponsoredTier | null> {
  const m = await getSponsoredMap();
  if (m.editors_pick.includes(clinicId)) return "editors_pick";
  if (m.recommended.includes(clinicId))  return "recommended";
  if (m.featured.includes(clinicId))     return "featured";
  return null;
}

export async function isSponsored(clinicId: string): Promise<boolean> {
  return (await sponsoredTier(clinicId)) !== null;
}

export const SPONSORED_BADGE: Record<SponsoredTier, { label: string; bg: string; fg: string; icon: string }> = {
  editors_pick: { label: "Editor's Pick", bg: "#fef3c7", fg: "#92400e", icon: "★" },
  recommended:  { label: "Recommended",   bg: "#dbeafe", fg: "#1e40af", icon: "✓" },
  featured:     { label: "Featured",      bg: "#f3e8ff", fg: "#6b21a8", icon: "◆" },
};

/** editors_pick → recommended → featured → trust_score 내림차순. */
export async function sortWithSponsored<T extends { id: string; trust_score: number }>(items: T[]): Promise<T[]> {
  const m = await getSponsoredMap();
  const score = (t: T): number => {
    if (m.editors_pick.includes(t.id)) return 1_000_000;
    if (m.recommended.includes(t.id))  return 500_000;
    if (m.featured.includes(t.id))     return 100_000;
    return 0;
  };
  return [...items].sort((a, b) => {
    const sa = score(a);
    const sb = score(b);
    if (sa !== sb) return sb - sa;
    return b.trust_score - a.trust_score;
  });
}
