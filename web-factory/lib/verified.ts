// Verified Supplier 시스템 — 사용자가 supplier 에게 청구 가능한 monetization tier.
// Sponsored 와는 별개 의미: sponsored = 광고 (자리 구매), verified = 운영 검증 + 자료 제출 후 수여.
//
// 운영: env var VERIFIED_SUPPLIERS 에 CSV 형식으로 supplier ID 등록.
//   기본 (등급 일반): VERIFIED_SUPPLIERS="id1,id2"
//   프리미엄:        VERIFIED_PREMIUM_SUPPLIERS="id3,id4"
//   엔터프라이즈:    VERIFIED_ENTERPRISE_SUPPLIERS="id5"
//
// 등급 차이:
//   verified            → 사업자등록증 + 공장 사진 검증
//   verified_premium    → + 인증서 (ISO 9001 / IATF 16949 / HACCP) 검증
//   verified_enterprise → + 본사 실사 + reference call

//
// ⚠️ 환경변수는 반드시 NEXT_PUBLIC_ 접두사로 설정할 것.
// 이 목록을 읽는 SupplierCard / Badges 는 "use client" 컴포넌트다. Next 는
// NEXT_PUBLIC_ 이 붙은 값만 클라이언트 번들에 인라인하므로, 접두사 없는 변수는
// 브라우저에서 undefined 가 된다 — 서버가 그린 배지가 하이드레이션 직후
// 사라진다("1등인데 배지가 없다"). 접두사 없는 이름도 아래에서 함께 읽지만
// 그건 서버 렌더/정렬 전용 폴백이다.

export type VerifiedTier = "verified" | "verified_premium" | "verified_enterprise";

const TIERS: Record<VerifiedTier, string[]> = {
  verified:            parseList((process.env.NEXT_PUBLIC_VERIFIED_SUPPLIERS || process.env.VERIFIED_SUPPLIERS)),
  verified_premium:    parseList((process.env.NEXT_PUBLIC_VERIFIED_PREMIUM_SUPPLIERS || process.env.VERIFIED_PREMIUM_SUPPLIERS)),
  verified_enterprise: parseList((process.env.NEXT_PUBLIC_VERIFIED_ENTERPRISE_SUPPLIERS || process.env.VERIFIED_ENTERPRISE_SUPPLIERS)),
};

function parseList(s: string | undefined): string[] {
  return (s || "").split(",").map((x) => x.trim()).filter(Boolean);
}

export function verifiedTier(id: string): VerifiedTier | null {
  if (TIERS.verified_enterprise.includes(id)) return "verified_enterprise";
  if (TIERS.verified_premium.includes(id)) return "verified_premium";
  if (TIERS.verified.includes(id)) return "verified";
  return null;
}

export function isVerified(id: string): boolean {
  return verifiedTier(id) !== null;
}

export const VERIFIED_BADGE: Record<VerifiedTier, {
  label: string; shortLabel: string; bg: string; fg: string; icon: string; description: string;
}> = {
  verified: {
    label: "Verified Supplier",
    shortLabel: "Verified",
    bg: "#dbeafe", fg: "#1e40af", icon: "✓",
    description: "Business registration and factory photo verified by Thai Supply Hub.",
  },
  verified_premium: {
    label: "Verified Premium",
    shortLabel: "Premium",
    bg: "#dcfce7", fg: "#166534", icon: "✓✓",
    description: "Business registration + ISO 9001 / IATF 16949 / HACCP / equivalent quality certification verified.",
  },
  verified_enterprise: {
    label: "Verified Enterprise",
    shortLabel: "Enterprise",
    bg: "#fef3c7", fg: "#854d0e", icon: "✓✓✓",
    description: "Full verification — business registration, certifications, on-site headquarter audit, and customer reference calls.",
  },
};
