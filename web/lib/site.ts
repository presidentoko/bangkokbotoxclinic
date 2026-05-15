// 도메인별 사이트 포커스 설정. env var SITE_FOCUS 로 분기.
// 같은 코드베이스 → Vercel 프로젝트별 env 만 다르게 → 5개 specialty 도메인 운영.

import type { Clinic } from "./types";
import { isClinicLike } from "./clinicFilter";

export type SiteFocus =
  | "all"        // 메인 허브 (전체 클리닉)
  | "botox"
  | "filler"
  | "hifu"
  | "facial"
  | "laser"
  | "dental";

export type SiteConfig = {
  focus: SiteFocus;
  brand: string;          // 헤더에 표시
  domain: string;
  title: string;          // SEO title 베이스
  description: string;    // meta description
  hero: string;           // 홈페이지 H1
  heroSub: string;        // 홈페이지 sub
  themeAccent: string;    // CSS color
  // 클리닉 필터: focus 카테고리 mention >= threshold OR primary_type 매칭
  mentionThreshold: number;
};

const CONFIGS: Record<SiteFocus, SiteConfig> = {
  all: {
    focus: "all",
    brand: "Bangkok Clinics",
    domain: "bkkclinics.com",
    title: "Bangkok Clinics — Verified Reviews & Trust Scores",
    description:
      "Independent directory of Bangkok aesthetic and medical clinics with Google review analysis and Trust Scores.",
    hero: "Bangkok Clinics — Verified by Reviews",
    heroSub: "Aesthetic and medical clinics across Bangkok, ranked by Trust Score from real Google reviews.",
    themeAccent: "#2563eb",
    mentionThreshold: 0,
  },
  botox: {
    focus: "botox",
    brand: "Bangkok Botox Clinic",
    domain: "bangkokbotoxclinic.com",
    title: "Best Botox Clinics in Bangkok — Verified Reviews 2026",
    description:
      "Bangkok botox specialists ranked by Trust Score. Genuine brand verification, English-speaking staff, district-by-district guide. From real Google review analysis.",
    hero: "Bangkok Botox Specialists — Verified",
    heroSub: "Top botox clinics in Bangkok, ranked by Trust Score from review analysis. Genuine Allergan, Dysport, Botulax, Xeomin tracked.",
    themeAccent: "#7c3aed",
    mentionThreshold: 3,
  },
  filler: {
    focus: "filler",
    brand: "Bangkok Fillers",
    domain: "bangkokfillers.com",
    title: "Top Filler Clinics in Bangkok — HA, Juvederm, Restylane",
    description:
      "Bangkok dermal filler specialists. HA fillers, Juvederm, Restylane, Belotero. Trust Scores from verified Google review analysis. Lip, cheek, jawline, under-eye.",
    hero: "Bangkok Filler Specialists",
    heroSub: "HA, Juvederm, Restylane and Belotero specialists ranked by review-verified Trust Score.",
    themeAccent: "#ec4899",
    mentionThreshold: 3,
  },
  hifu: {
    focus: "hifu",
    brand: "HIFU Bangkok",
    domain: "haifacialclinic.com",
    title: "HIFU & Ultherapy in Bangkok — Verified Specialists",
    description:
      "Bangkok HIFU specialists — Ultherapy, Thermage, Ultraformer. Compare Trust Scores, machine brands, and session pricing across districts.",
    hero: "HIFU & Skin Lifting in Bangkok",
    heroSub: "Verified Ultherapy, Thermage, Ultraformer providers ranked by Trust Score.",
    themeAccent: "#06b6d4",
    mentionThreshold: 2,
  },
  facial: {
    focus: "facial",
    brand: "Bangkok Facial",
    domain: "bangkokfacial.com",
    title: "Bangkok Facial Treatments — Top Clinics & Reviews",
    description:
      "Bangkok facial and skincare clinics. HydraFacial, deep cleansing, LED therapy, brightening treatments. Trust Scores from real Google reviews.",
    hero: "Bangkok Facial Treatments",
    heroSub: "HydraFacial, LED, oxygen and chemical peel specialists ranked by Trust Score.",
    themeAccent: "#0ea5e9",
    mentionThreshold: 3,
  },
  laser: {
    focus: "laser",
    brand: "Bangkok Laser Clinic",
    domain: "bangkoklaserclinic.com",
    title: "Bangkok Laser Clinics — Pico, CO2, IPL Specialists",
    description:
      "Bangkok laser specialists — Pico laser, CO2 fractional, IPL, laser hair removal. Trust Scores from verified Google review analysis.",
    hero: "Bangkok Laser Specialists",
    heroSub: "Pico, CO2 fractional, IPL and hair-removal laser experts ranked by Trust Score.",
    themeAccent: "#f59e0b",
    mentionThreshold: 3,
  },
  dental: {
    focus: "dental",
    brand: "Bangkok Best Clinic",
    domain: "bangkokbestclinic.com",
    title: "Best Dental Clinics in Bangkok — Verified Reviews & Trust Scores",
    description:
      "Bangkok dental specialists ranked by Trust Score from real Google review analysis. Implants, veneers, whitening, orthodontics, all-on-4. English & Korean speaking clinics for medical tourists.",
    hero: "Bangkok Dental — Verified by Reviews",
    heroSub: "Top dental clinics in Bangkok and Pattaya ranked by Trust Score. Implants, veneers, ortho, whitening — from real Google review analysis.",
    themeAccent: "#10b981",
    mentionThreshold: 2,
  },
};

export function getSiteConfig(): SiteConfig {
  const focus = (process.env.NEXT_PUBLIC_SITE_FOCUS || "all") as SiteFocus;
  return CONFIGS[focus] ?? CONFIGS.all;
}

export function applySiteFilter(clinics: Clinic[], cfg: SiteConfig): Clinic[] {
  // 모든 사이트에서 non-clinic 먼저 제거
  const clinical = clinics.filter(isClinicLike);
  if (cfg.focus === "all") return clinical;
  const focus = cfg.focus;
  return clinical.filter((c) => {
    if (c.categories.includes(focus)) return true;
    if ((c.service_mentions[focus] ?? 0) >= cfg.mentionThreshold) return true;
    return false;
  });
}
