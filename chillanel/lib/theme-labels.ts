import type { Lang } from "./site";

// Translates the 15 fixed English labels that scripts/extract-themes.mjs
// (Phase 0) can produce — 8 SERVICE_THEMES + 7 MOOD_KEYWORDS keys, verbatim
// strings, not derived — into th/ko for display. Reviews are 99.8% English
// (Phase 0 finding), so the underlying extraction stays English-only; this
// is the single translation point every UI consumer must go through instead
// of rendering a raw `.label` from the data.
const LABELS: Record<string, Record<Lang, string>> = {
  "Foot massage": { en: "Foot massage", th: "นวดเท้า", ko: "발마사지" },
  "Oil massage": { en: "Oil massage", th: "นวดน้ำมัน", ko: "오일 마사지" },
  "Thai massage": { en: "Thai massage", th: "นวดไทย", ko: "타이 마사지" },
  Aromatherapy: { en: "Aromatherapy", th: "อโรมาเทอราพี", ko: "아로마테라피" },
  "Deep tissue": { en: "Deep tissue", th: "นวดลึก", ko: "딥티슈 마사지" },
  "Hot stone": { en: "Hot stone", th: "หินร้อน", ko: "핫스톤 마사지" },
  Facial: { en: "Facial", th: "ทรีทเมนต์หน้า", ko: "페이셜" },
  "Body scrub": { en: "Body scrub", th: "สครับผิว", ko: "바디 스크럽" },
  Clean: { en: "Clean", th: "สะอาด", ko: "청결함" },
  "Quiet & relaxing": { en: "Quiet & relaxing", th: "เงียบสงบ ผ่อนคลาย", ko: "조용하고 편안함" },
  "Strong pressure": { en: "Strong pressure", th: "นวดแรง", ko: "강한 압력" },
  Gentle: { en: "Gentle", th: "นวดเบามือ", ko: "부드러운 손길" },
  "Friendly staff": { en: "Friendly staff", th: "พนักงานเป็นกันเอง", ko: "친절한 직원" },
  "Good value": { en: "Good value", th: "คุ้มค่า", ko: "가성비 좋음" },
  "Walk-in friendly": { en: "Walk-in friendly", th: "walk-in ได้", ko: "워크인 가능" },
};

export function themeLabel(rawLabel: string, lang: Lang): string {
  return LABELS[rawLabel]?.[lang] ?? rawLabel;
}

export function slugifyTheme(rawLabel: string): string {
  return rawLabel
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
