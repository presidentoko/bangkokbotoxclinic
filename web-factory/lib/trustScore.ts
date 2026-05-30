// Single source of truth for the supplier Trust Score (0–100 composite).
// Extracted from app/supplier/[id]/page.tsx so cards, list sorting, and the detail
// page all produce the SAME number. Pure + deterministic (pass currentYear in tests).

import type { Supplier } from "./types";

export type TrustSub = { key: string; label: string; score: number; weight: string };
export type TrustResult = { overall: number; subs: TrustSub[]; tier: string; color: string };

const clamp = (n: number) => Math.max(0, Math.min(100, n));

export function trustTier(overall: number): { tier: string; color: string } {
  if (overall >= 75) return { tier: "Excellent", color: "#16a34a" };
  if (overall >= 60) return { tier: "Strong", color: "#059669" };
  if (overall >= 40) return { tier: "Fair", color: "#ca8a04" };
  return { tier: "Limited", color: "#94a3b8" };
}

export function computeTrustScore(
  s: Supplier,
  currentYear: number = new Date().getFullYear(),
): TrustResult {
  const cap = s.dbd?.capital_thb || 0;
  const capital = cap > 0 ? clamp((Math.log10(cap) - 5) * 25) : 0;

  const foundedYear = s.dbd?.registered_date ? parseInt(s.dbd.registered_date.slice(0, 4)) : null;
  const years = s.years_in_business || (foundedYear ? currentYear - foundedYear : 0);
  const longevity = years ? clamp(years * 4) : 0;

  const reviews = clamp(Math.log10(Math.max(1, s.total_reviews || 0)) * 25 + (s.rating || 0) * 10);

  const verifyCount =
    (s.verified ? 1 : 0) +
    (s.halal_certified ? 1 : 0) +
    (s.estate_name ? 1 : 0) +
    (s.dbd?.tsic_code ? 1 : 0);
  const verifications = (verifyCount / 4) * 100;

  const photos = clamp((s.photos?.length || 0) * 12.5);

  const subs: TrustSub[] = [
    { key: "capital", label: "Capital", score: capital, weight: "Registered capital (DBD)" },
    { key: "longevity", label: "Longevity", score: longevity, weight: "Years in business" },
    { key: "reviews", label: "Reviews", score: reviews, weight: "Google review volume × rating" },
    { key: "verifications", label: "Verifications", score: verifications, weight: "DBD / Halal / Estate / TSIC" },
    { key: "photos", label: "Photos", score: photos, weight: "Site-evidence photos" },
  ];

  const overall = Math.round((capital + longevity + reviews + verifications + photos) / 5);
  const { tier, color } = trustTier(overall);
  return { overall, subs, tier, color };
}
