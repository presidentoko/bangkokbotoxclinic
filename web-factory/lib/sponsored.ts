// Sponsored slots — tier 별 배지.
// env vars:
//   SPONSORED_EDITORS_PICK="id1,id2"  → "Editor's Pick" 노란 배지
//   SPONSORED_RECOMMENDED="id3,id4"   → "Recommended" 파란 배지
//   SPONSORED_FEATURED="id5,id6"      → "Featured" 일반 배지

import type { Supplier } from "./types";
import { computeTrustScore } from "./trustScore";

//
// ⚠️ 환경변수는 반드시 NEXT_PUBLIC_ 접두사로 설정할 것.
// 이 목록을 읽는 SupplierCard / Badges 는 "use client" 컴포넌트다. Next 는
// NEXT_PUBLIC_ 이 붙은 값만 클라이언트 번들에 인라인하므로, 접두사 없는 변수는
// 브라우저에서 undefined 가 된다 — 서버가 그린 배지가 하이드레이션 직후
// 사라진다("1등인데 배지가 없다"). 접두사 없는 이름도 아래에서 함께 읽지만
// 그건 서버 렌더/정렬 전용 폴백이다.

export type SponsoredTier = "editors_pick" | "recommended" | "featured";

const TIERS: Record<SponsoredTier, string[]> = {
  editors_pick: parseList((process.env.NEXT_PUBLIC_SPONSORED_EDITORS_PICK || process.env.SPONSORED_EDITORS_PICK)),
  recommended: parseList((process.env.NEXT_PUBLIC_SPONSORED_RECOMMENDED || process.env.SPONSORED_RECOMMENDED)),
  featured: parseList((process.env.NEXT_PUBLIC_SPONSORED_FEATURED || process.env.SPONSORED_FEATURED) || (process.env.NEXT_PUBLIC_SPONSORED_IDS || process.env.SPONSORED_IDS)),
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
