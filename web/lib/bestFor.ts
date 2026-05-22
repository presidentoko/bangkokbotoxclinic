// "Best for X" 카테고리 — long-tail SEO + 차별화 정렬.
// 각 criterion 은 점수 함수 + label + 설명.

import type { Clinic } from "./types";

export type Criterion = {
  slug: string;
  title: string;          // SEO H1
  metaTitle: string;
  metaDescription: string;
  intro: string;          // 페이지 상단 introduction
  scoreFn: (c: Clinic) => number;  // 정렬 기준 점수 (높을수록 상위)
  filterFn?: (c: Clinic) => boolean;  // 노출 자격 (해당 시그널 있는 클리닉만)
};

const topicHits = (c: Clinic, topic: string) => {
  const t = c.mentioned_topics.find((x) => x.topic === topic);
  return t ? t.count : 0;
};

export const BEST_FOR: Criterion[] = [
  {
    slug: "english-speaking",
    title: "Best Bangkok Clinics for English-Speaking Staff",
    metaTitle: "Best Bangkok Clinics for English-Speaking Staff (2026)",
    metaDescription:
      "Bangkok clinics ranked by reviewer mentions of English-speaking staff. Verified from real Google review analysis — ideal for tourists and expats.",
    intro:
      "Bangkok clinics where the most reviewers explicitly mention English-speaking staff. Sorted by mention count weighted by Trust Score. All listings verified from public Google reviews.",
    scoreFn: (c) => topicHits(c, "english_speaking") * 10 + c.trust_score,
    filterFn: (c) => topicHits(c, "english_speaking") >= 1,
  },
  {
    slug: "genuine-brand",
    title: "Bangkok Clinics with Verified Genuine Brand Reviews",
    metaTitle: "Bangkok Clinics — Genuine Brand Verified (Botox / Filler)",
    metaDescription:
      "Bangkok clinics where reviewers explicitly mention authentic, genuine, or original brand products. Critical for botox and filler safety.",
    intro:
      "Bangkok clinics where reviewers explicitly call out authentic / genuine brand products. This is the single strongest signal for botox and filler safety in Bangkok where counterfeit injectables circulate.",
    scoreFn: (c) => topicHits(c, "genuine_brand") * 12 + c.trust_score,
    filterFn: (c) => topicHits(c, "genuine_brand") >= 1,
  },
  {
    slug: "affordable",
    title: "Most Affordable Bangkok Aesthetic Clinics",
    metaTitle: "Affordable Bangkok Clinics — Verified Reviews",
    metaDescription:
      "Bangkok clinics most often described as affordable, reasonably priced, or good value in real Google reviews.",
    intro:
      "Bangkok clinics where reviewers most often use words like affordable, cheap, reasonable price, or good value. Note: low price ≠ low quality — Trust Score is also factored in.",
    scoreFn: (c) => topicHits(c, "affordable") * 8 + c.trust_score,
    filterFn: (c) => topicHits(c, "affordable") >= 1,
  },
  {
    slug: "premium",
    title: "Bangkok Premium Aesthetic Clinics",
    metaTitle: "Premium Bangkok Clinics — Luxury & High-end",
    metaDescription:
      "Bangkok aesthetic clinics described as premium, luxury, or high-end by real Google reviewers.",
    intro:
      "Bangkok aesthetic clinics described as premium, luxury, or high-end in reviews. These typically have higher prices and more boutique facilities.",
    scoreFn: (c) => topicHits(c, "premium") * 8 + c.trust_score,
    filterFn: (c) => topicHits(c, "premium") >= 1,
  },
  {
    slug: "no-pain",
    title: "Painless Bangkok Aesthetic Treatments",
    metaTitle: "Painless Bangkok Clinics — Botox, Filler, HIFU",
    metaDescription:
      "Bangkok clinics where reviewers most often describe treatments as painless or comfortable.",
    intro:
      "Bangkok aesthetic clinics where reviewers most often mention treatments being painless or comfortable. Strong protocol for numbing cream and gentle technique.",
    scoreFn: (c) => topicHits(c, "no_pain") * 10 + c.trust_score,
    filterFn: (c) => topicHits(c, "no_pain") >= 1,
  },
  {
    slug: "professional",
    title: "Most Professional Bangkok Clinics",
    metaTitle: "Professional Bangkok Aesthetic Clinics",
    metaDescription:
      "Bangkok clinics where reviewers consistently describe staff and doctors as professional and experienced.",
    intro:
      "Bangkok clinics where reviewers most often praise staff or doctors as professional, experienced, or skilled.",
    scoreFn: (c) => topicHits(c, "professional") * 8 + c.trust_score,
    filterFn: (c) => topicHits(c, "professional") >= 1,
  },
  {
    slug: "korean-doctor",
    title: "Bangkok Clinics with Korean-Trained Doctors",
    metaTitle: "Korean-Trained Doctors in Bangkok — Aesthetic Clinics",
    metaDescription:
      "Bangkok aesthetic clinics where reviewers mention Korean-trained doctors or Korean technique.",
    intro:
      "Bangkok aesthetic clinics where reviewers explicitly mention Korean-trained doctors or Korean-style technique. Popular with Korean medical tourists.",
    scoreFn: (c) => topicHits(c, "korean_doctor") * 15 + c.trust_score,
    filterFn: (c) => topicHits(c, "korean_doctor") >= 1,
  },
  {
    slug: "highly-recommended",
    title: "Most Highly Recommended Bangkok Clinics",
    metaTitle: "Highly Recommended Bangkok Aesthetic Clinics",
    metaDescription:
      "Bangkok clinics most explicitly recommended by reviewers — high return-visit intent.",
    intro:
      "Bangkok aesthetic clinics where reviewers most often say they would recommend the clinic or come back. Strongest signal of customer satisfaction.",
    scoreFn: (c) => topicHits(c, "recommend") * 10 + c.trust_score,
    filterFn: (c) => topicHits(c, "recommend") >= 1,
  },
  // ─── Men's & Hair 사이트 전용 큐레이션 (long-tail SEO + AEO) ─────────────
  {
    slug: "mens-clinic",
    title: "Best Men-Only & Men's Wellness Clinics in Bangkok",
    metaTitle: "Best Men's Clinics in Bangkok — TRT, Anti-aging, Grooming",
    metaDescription:
      "Bangkok men-only and men's wellness clinics for TRT, hair restoration, anti-aging, and male-pattern grooming. Verified Trust Score ranking from real Google reviews.",
    intro:
      "Bangkok clinics that explicitly serve male patients — men-only practices (HE Clinic for Men, Homme, Crimson Men's Art), male wellness centers (VitalLife, BDMS Wellness, Addlife), and male-grooming aesthetic clinics. Ranked by Trust Score.",
    scoreFn: (c) => {
      const nameHit = /\b(men's|mens|men only|gentlemen|HE Clinic|Homme|barbershop|남성)\b/i.test(c.name) ? 1 : 0;
      return nameHit * 30 + c.trust_score;
    },
    filterFn: (c) =>
      /\b(men's|mens|men only|gentlemen|HE Clinic|Homme|barbershop|남성|ผู้ชาย|บุรุษ)\b/i.test(c.name) ||
      (c.service_mentions?.mens_wellness ?? 0) >= 2,
  },
  {
    slug: "hair-transplant",
    title: "Best Hair Transplant Clinics in Bangkok — FUE, DHI, SMP",
    metaTitle: "Best Bangkok Hair Transplant Clinics (2026) — FUE/DHI/SMP",
    metaDescription:
      "Bangkok hair transplant specialists ranked by Trust Score. FUE, DHI (Choi pen), SMP, beard/eyebrow restoration. Bookimed-verified medical tourism for Korean, English, Chinese and Arabic-speaking patients.",
    intro:
      "Bangkok clinics specializing in hair restoration — FUE, DHI Choi-pen, scalp micropigmentation (SMP), beard/eyebrow transplant. Includes DHT Clinic (世界모발이식학회장), Absolute Hair, Million Hair, and Bookimed-verified centers for medical tourism. Ranked by Trust Score.",
    scoreFn: (c) => {
      const catHit = c.categories.includes("hair_transplant") ? 1 : 0;
      const nameHit = /\b(hair|transplant|FUE|DHI|SMP|trichology|모발|ปลูกผม)\b/i.test(c.name) ? 1 : 0;
      return catHit * 40 + nameHit * 20 + c.trust_score;
    },
    filterFn: (c) =>
      c.categories.includes("hair_transplant") ||
      /\b(hair|transplant|FUE|DHI|SMP|trichology|모발|ปลูกผม|ผม)\b/i.test(c.name) ||
      (c.service_mentions?.hair_transplant ?? 0) >= 3,
  },
];

export function findBestFor(slug: string): Criterion | null {
  return BEST_FOR.find((c) => c.slug === slug) ?? null;
}
