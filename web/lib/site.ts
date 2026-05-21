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
  | "dental"
  | "hair";

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
  hair: {
    focus: "hair",
    brand: "Thai Hair & Scalp Clinic",
    domain: "thaifacialclinic.com",
    title: "Best Hair Transplant Clinics in Thailand — FUE, SMP, Scalp Care",
    description:
      "Thailand hair transplant, scalp micropigmentation (SMP), and scalp care specialists ranked by Trust Score. FUE/DHI, beard restoration, eyebrow transplant, scar coverage. Bookimed-verified medical tourism options for English, Korean, Chinese and Arabic-speaking patients.",
    hero: "Hair Transplant & Scalp Specialists in Thailand",
    heroSub: "FUE, DHI, SMP, scar coverage — top hair restoration clinics in Bangkok, Phuket, and Chiang Mai ranked by Trust Score from real reviews.",
    themeAccent: "#b45309",
    mentionThreshold: 2,
  },
};

export function getSiteConfig(): SiteConfig {
  const focus = (process.env.NEXT_PUBLIC_SITE_FOCUS || "all") as SiteFocus;
  return CONFIGS[focus] ?? CONFIGS.all;
}

// 치과 사이트 — 진짜 치과만 (피부과/성형외과의 dental 옵션 제외)
const DENTAL_PRIMARY_TYPES = new Set([
  "Dental clinic", "Dentist", "Orthodontist", "Pediatric dentist",
  "Dental school", "Dental implants periodontist", "Dental hygienist",
  "Oral surgeon",
]);

export function applySiteFilter(clinics: Clinic[], cfg: SiteConfig): Clinic[] {
  // 모든 사이트에서 non-clinic 먼저 제거
  const clinical = clinics.filter(isClinicLike);
  if (cfg.focus === "all") return clinical;
  const focus = cfg.focus;

  // 치과 사이트는 엄격 필터: primary_type 이 치과 계열이어야 함
  // (피부과가 치과 카테고리 1-2개 끼어있는 false positive 방지)
  if (focus === "dental") {
    return clinical.filter((c) => {
      if (DENTAL_PRIMARY_TYPES.has(c.primary_type)) return true;
      // 이름에 명시적 치과 키워드 + dental mention 5+ 도 통과
      const hasDentalName = /\b(dental|dentist|ทันตกรรม|จัดฟัน|ฟัน)\b/i.test(c.name);
      if (hasDentalName && (c.service_mentions.dental ?? 0) >= 5) return true;
      return false;
    });
  }

  // 헤어 사이트도 엄격 필터: hair_transplant 카테고리 OR 이름에 명시적 hair/transplant
  // 시그널. 일반 피부과의 우연한 mention 1-2회는 배제 (false positive 방지).
  if (focus === "hair") {
    return clinical.filter((c) => {
      if (c.categories.includes("hair_transplant")) return true;
      const hasHairName = /\b(hair|transplant|trichology|FUE|DHI|SMP|micropigment|모발|ปลูกผม|ผม)\b/i.test(c.name);
      if (hasHairName) return true;
      // 일반 클리닉이라도 hair_transplant mention 3+ 면 통과
      if ((c.service_mentions.hair_transplant ?? 0) >= 3) return true;
      return false;
    });
  }

  // 다른 사이트 — 기존 로직
  return clinical.filter((c) => {
    if (c.categories.includes(focus)) return true;
    if ((c.service_mentions[focus] ?? 0) >= cfg.mentionThreshold) return true;
    return false;
  });
}
