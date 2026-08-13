import type { Lang } from "./site";

// Grid search picks up anything within the search radius, not just
// massage/spa businesses. A denylist here only ever catches categories
// someone happened to notice -- the real Bangkok+Pattaya dataset has 221
// distinct primaryType values (cosmetics stores, a cannabis dispensary, a
// frozen yogurt shop, a water park, car dealers, ...), so a denylist of
// ~20 names lets the other ~190 through as noise. Flipped to an allowlist:
// only categories that are actually a massage/spa/wellness/beauty service
// a visitor would book render as a real listing. Filtered at display time
// only -- the underlying data/JSON is untouched.
//
// Erotic/adult massage categories (Erotic massage, Soapy massage, Gay
// sauna, ...) are included deliberately, not an oversight -- they're real
// grid-scraped Google listings and the site's decision is to surface them
// as-is (category badge shows the raw label) rather than curate them out.
const RELEVANT_TYPES = new Set([
  // core massage & spa
  "Massage spa",
  "Spa",
  "Day spa",
  "Health spa",
  "Medical spa",
  "Spa and health club",
  "Thai massage therapist",
  "Thai massage shop",
  "Massage therapist",
  "Massage service",
  "Foot massage parlor",
  "Sports massage therapist",
  "Reflexologist",
  "Reiki therapist",
  // sauna / bathing
  "Sauna",
  "Sauna club",
  "Gay sauna",
  "Public sauna",
  "Onsen",
  "Day-use onsen",
  "Public bath",
  "Outdoor bath",
  "Hot bedstone spa",
  // adult massage (see note above)
  "Erotic massage",
  "Erotic Massage",
  "Erotic Massage Parlour",
  "Soapy massage",
  // facial / skin / beauty
  "Facial spa",
  "Skin care clinic",
  "Skin care",
  "Esthetics service",
  "Beauty salon",
  "Beautician",
  "Nail salon",
  "Hair salon",
  "Hairdresser",
  "Barber shop",
  // wellness / bodywork / traditional medicine
  "Wellness center",
  "Aromatherapy service",
  "Alternative medicine practitioner",
  "Acupuncture clinic",
  "Acupuncturist",
  "Chinese medicine clinic",
  "Oriental medicine clinic",
  "Ayurvedic clinic",
  "Physical therapist",
  "Physical therapy clinic",
  "Chiropractor",
  "Osteopath",
  "Rehabilitation center",
  "Hair removal service",
  "Laser hair removal service",
  "Waxing hair removal service",
  "Weight loss service",
  "Yoga studio",
  "Pilates studio",
]);

// A real fraction of the dataset (84 of 2,556 Bangkok rows) has no
// primaryType at all -- not noise, real spa businesses Google didn't
// categorize (e.g. "HISO Bangkok Massage 2", "KLAI Thai Spa"). Excluding
// blank types would drop genuine listings, so they pass through same as
// before this allowlist existed.
export function isRelevantCategory(primaryType: string): boolean {
  if (!primaryType) return true;
  return RELEVANT_TYPES.has(primaryType);
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
