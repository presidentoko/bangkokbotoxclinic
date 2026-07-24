import type { Lang } from "./site";

// Grid search picks up anything within the search radius, not just
// massage/spa businesses — these are unrelated categories (transport,
// retail, repair, pet services, etc.) that leak in as noise and look
// broken next to real listings. Filtered at display time only — the
// underlying data/JSON is untouched.
const EXCLUDED_TYPES = new Set([
  "Dog park",
  "Ferry terminal",
  "Car wash",
  "Restaurant",
  "Apartment building",
  "Cruise line company",
  "Swimming pool supply store",
  "Shoe repair shop",
  "Luggage repair service",
  "Sanitary ware manufacturer and supplier",
  "Retail space rental agency",
  "Repair service",
  "Environmental health service",
  "Public health department",
  "Educational institution",
  "Shopping mall",
  "Pet sitter",
  "Pet groomer",
  "Cosmetic products manufacturer",
]);

export function isRelevantCategory(primaryType: string): boolean {
  return !EXCLUDED_TYPES.has(primaryType);
}

const LABELS: Record<string, Record<Lang, string>> = {
  "Massage spa": { en: "Massage spa", th: "สปานวด", ko: "마사지 스파" },
  Spa: { en: "Spa", th: "สปา", ko: "스파" },
  "Day spa": { en: "Day spa", th: "เดย์สปา", ko: "데이 스파" },
  "Thai massage therapist": { en: "Thai massage", th: "นวดไทย", ko: "타이 마사지" },
  "Thai massage shop": { en: "Thai massage", th: "ร้านนวดไทย", ko: "타이 마사지샵" },
  "Massage therapist": { en: "Massage therapist", th: "หมอนวด", ko: "마사지 테라피스트" },
  "Wellness center": { en: "Wellness center", th: "ศูนย์เวลเนส", ko: "웰니스 센터" },
  "Facial spa": { en: "Facial spa", th: "สปาหน้า", ko: "페이셜 스파" },
  "Beauty salon": { en: "Beauty salon", th: "ร้านเสริมสวย", ko: "뷰티살롱" },
  "Nail salon": { en: "Nail salon", th: "ร้านทำเล็บ", ko: "네일샵" },
  "Health spa": { en: "Health spa", th: "เฮลท์สปา", ko: "헬스 스파" },
  "Medical spa": { en: "Medical spa", th: "เมดิคอลสปา", ko: "메디컬 스파" },
  "Spa and health club": { en: "Spa & health club", th: "สปาและคลับสุขภาพ", ko: "스파 & 헬스클럽" },
  "Sports massage therapist": { en: "Sports massage", th: "นวดกีฬา", ko: "스포츠 마사지" },
  "Foot massage parlor": { en: "Foot massage", th: "นวดเท้า", ko: "발마사지" },
  Reflexologist: { en: "Reflexology", th: "นวดกดจุด", ko: "반사요법" },
  Sauna: { en: "Sauna", th: "ซาวน่า", ko: "사우나" },
};

export function categoryBadgeLabel(primaryType: string, lang: Lang): string | null {
  if (!primaryType) return null;
  return LABELS[primaryType]?.[lang] ?? primaryType;
}
