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
  // city_label 허용 목록 (설정 시 해당 도시만 포함, null/빈값은 통과)
  allowedCities?: string[];
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
    title: "Best Botox Clinics in Bangkok 2026 — From ฿80/unit, Verified Reviews",
    description:
      "Compare 120+ Bangkok botox clinics ranked by Trust Score. Allergan · Dysport · Botulax · Xeomin authenticity verified. English-speaking clinics in Sukhumvit, Siam & Ari from ฿80/unit. Ranked from 500,000+ real Google reviews.",
    hero: "Bangkok Botox Specialists — Verified",
    heroSub: "120+ botox clinics ranked by Trust Score. Allergan, Dysport, Botulax, Xeomin authenticity tracked. Sukhumvit · Siam · Ari specialists from ฿80/unit.",
    themeAccent: "#7c3aed",
    mentionThreshold: 3,
    // 치앙마이/코사무이/후아힌 추가 (2026-07-10) — DB의 21%가 이 4개 도시
    // allowedCities 밖이라 어느 사이트에도 안 나오고 있었음.
    allowedCities: ["Bangkok", "Nonthaburi", "Samut Prakan", "Pathum Thani", "Chiang Mai", "Koh Samui", "Hua Hin"],
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
    allowedCities: ["Bangkok", "Nonthaburi", "Samut Prakan", "Pathum Thani", "Chiang Mai", "Koh Samui", "Hua Hin"],
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
    allowedCities: ["Bangkok", "Nonthaburi", "Samut Prakan", "Pathum Thani", "Chiang Mai", "Koh Samui", "Hua Hin"],
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
    allowedCities: ["Bangkok", "Nonthaburi", "Samut Prakan", "Pathum Thani", "Chiang Mai", "Koh Samui", "Hua Hin"],
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
    allowedCities: ["Bangkok", "Nonthaburi", "Samut Prakan", "Pathum Thani", "Chiang Mai", "Koh Samui", "Hua Hin"],
  },
  dental: {
    focus: "dental",
    brand: "Bangkok Best Clinic",
    domain: "www.bangkokbestclinic.com",
    title: "Best Dental Clinics in Bangkok 2026 — Implants from ฿35,000, Verified",
    description:
      "200+ Bangkok dental clinics ranked by Trust Score. Implants from ฿35,000 · Veneers from ฿12,000/tooth · Whitening from ฿4,000. Save 60% vs US prices. English & Korean speaking. Ranked from 200,000+ Google reviews.",
    hero: "Bangkok Dental Clinics — Verified by Reviews",
    heroSub: "200+ dental clinics in Bangkok & Pattaya ranked by Trust Score. Implants · Veneers · Invisalign · All-on-4. Save up to 70% vs Western prices.",
    themeAccent: "#10b981",
    mentionThreshold: 2,
    // 치앙마이/코사무이/후아힌 추가 (2026-07-10) — botox와 동일 이유
    allowedCities: ["Bangkok", "Nonthaburi", "Samut Prakan", "Pathum Thani", "Pattaya", "Chonburi", "Chiang Mai", "Koh Samui", "Hua Hin"],
  },
  hair: {
    focus: "hair",
    brand: "Bangkok Men's & Hair Clinic",
    domain: "thaifacialclinic.com",
    title: "Best Men's & Hair Clinics in Bangkok — Hair Transplant, Wellness, Anti-Aging",
    description:
      "Bangkok men's health and hair clinics ranked by Trust Score. Hair transplant (FUE/DHI), SMP, scalp care, men's anti-aging, hormone & wellness, men-only aesthetics. English, Korean, Chinese and Arabic-speaking medical tourism options across Bangkok, Phuket, and Chiang Mai.",
    hero: "Men's & Hair Specialists in Bangkok",
    heroSub: "Hair transplant, SMP, men's anti-aging, hormone wellness and men-only aesthetics — top clinics across Bangkok ranked by Trust Score from real reviews.",
    themeAccent: "#b45309",
    mentionThreshold: 2,
  },
};

export function getSiteConfig(): SiteConfig {
  const focus = (process.env.NEXT_PUBLIC_SITE_FOCUS || "all") as SiteFocus;
  return CONFIGS[focus] ?? CONFIGS.all;
}

// 단일 소스 사이트 URL. 예전엔 ~20개 파일이 각자
// `process.env.NEXT_PUBLIC_SITE_URL || "https://www.bangkokbotoxclinic.com"` 를
// 하드코딩해서, NEXT_PUBLIC_SITE_URL 이 비었을 때 덴탈 등 다른 프로젝트가
// 전부 botox canonical/사이트맵/OG 를 뱉는 사고 위험이 있었음 (2026-07-10 감사).
// 폴백을 SITE_FOCUS 기반으로 바꿔 최소한 "엉뚱한 사이트로 폴백"은 안 나게 함.
// 클리닉/의사가 현재 사이트 소관이 아닐 때 진짜 소유 도메인 — 크롤러가 두
// 도메인에서 같은 페이지를 동시 색인하는 걸 막기 위한 절대 캐노니컬 타겟.
// clinic/[id] 와 doctor/[slug] 둘 다 이 함수로 통일 (2026-07-10: doctor 라우트만
// 이 가드가 없어서 보톡스·덴탈 도메인에 같은 의사 페이지 2,000+개가 각자
// self-canonical 로 중복 색인되던 버그 발견).
const AESTHETIC_CATS = new Set(["botox", "filler", "hifu", "facial", "laser", "eye"]);
export function resolveOwnerUrl(categories: string[]): string | null {
  if (categories.includes("dental")) return `https://www.${CONFIGS.dental.domain.replace(/^www\./, "")}`;
  if (categories.includes("hair_transplant")) return `https://www.${CONFIGS.hair.domain.replace(/^www\./, "")}`;
  if (categories.some((cat) => AESTHETIC_CATS.has(cat))) return `https://www.${CONFIGS.botox.domain.replace(/^www\./, "")}`;
  return null;
}

// encodeURIComponent throws URIError on a lone UTF-16 surrogate — happens when
// scraped clinic names get .slice()'d mid-surrogate-pair (Thai/emoji chars).
// One bad clinic ID (0x30e2990d6f6fd079_...) crashed the ENTIRE build once
// clinic/[id] switched to full pre-render (2026-07-11), taking both live
// sites down. Strip lone surrogates before encoding instead of trusting input.
export function safeEncodeURIComponent(s: string): string {
  const cleaned = s.replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g, "");
  try {
    return encodeURIComponent(cleaned);
  } catch {
    return encodeURIComponent(cleaned.replace(/[^\x00-\x7F]/g, ""));
  }
}

export function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl) return envUrl.replace(/\/$/, "");
  const cfg = getSiteConfig();
  const host = cfg.domain.replace(/^www\./, "");
  return `https://www.${host}`;
}

// focus별 허용 서비스 — 다른 사이트 서비스 페이지 노출 방지.
// app/c/[service]/page.tsx 와 app/sitemap.ts 둘 다 이 테이블을 참조해야
// 사이트맵에 없는 사이트의 서비스가 실려서 404 나는 걸 방지.
export const FOCUS_VALID: Partial<Record<SiteFocus, Set<string>>> = {
  dental: new Set(["dental"]),
  hair:   new Set(["hair_transplant"]),
  botox:  new Set(["botox", "filler", "hifu", "facial", "laser", "eye"]),
  filler: new Set(["botox", "filler", "hifu", "facial", "laser", "eye"]),
  hifu:   new Set(["botox", "filler", "hifu", "facial", "laser", "eye"]),
  facial: new Set(["botox", "filler", "hifu", "facial", "laser", "eye"]),
  laser:  new Set(["botox", "filler", "hifu", "facial", "laser", "eye"]),
};

// 치과 사이트 — 진짜 치과만 (피부과/성형외과의 dental 옵션 제외)
const DENTAL_PRIMARY_TYPES = new Set([
  "Dental clinic", "Dentist", "Orthodontist", "Pediatric dentist",
  "Dental school", "Dental implants periodontist", "Dental hygienist",
  "Oral surgeon",
]);

export function applySiteFilter(clinics: Clinic[], cfg: SiteConfig): Clinic[] {
  // 모든 사이트에서 non-clinic 먼저 제거
  let clinical = clinics.filter(isClinicLike);
  if (cfg.focus === "all") return clinical;

  // 도시 필터 — city_label 없는 클리닉은 통과 (데이터 미비 방어)
  if (cfg.allowedCities && cfg.allowedCities.length > 0) {
    const citySet = new Set(cfg.allowedCities.map((c) => c.toLowerCase()));
    clinical = clinical.filter((c) => !c.city_label || citySet.has(c.city_label.toLowerCase()));
  }

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

  // 남성/헤어 사이트 필터: hair_transplant 카테고리 + 이름의 hair/transplant 시그널 +
  // 명시적 men's clinic 시그널 (남성 전용 키워드만, women's wellness 등 false positive 배제).
  if (focus === "hair") {
    return clinical.filter((c) => {
      if (c.categories.includes("hair_transplant")) return true;
      const hasHairName = /\b(hair|transplant|trichology|FUE|DHI|SMP|micropigment|모발|ปลูกผม|ผม)\b/i.test(c.name);
      if (hasHairName) return true;
      if ((c.service_mentions.hair_transplant ?? 0) >= 3) return true;
      // Men's clinic 시그널 — 남성 전용 명시 키워드만 (성별 모호한 wellness/grooming 제외)
      const hasMensName = /\b(men's|mens(?!truation)|men only|gentlemen|HE Clinic|Homme|barbershop medical|남성|ผู้ชาย|บุรุษ)\b/i.test(c.name);
      if (hasMensName) return true;
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
