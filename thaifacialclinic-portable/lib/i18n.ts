import type { Lang } from "./types";

export const SUPPORTED_LANGS: Lang[] = ["en", "ko", "th", "zh", "ar"];
export const DEFAULT_LANG: Lang = "en";

export const SITE = {
  // www 필수 — 호스트가 apex→www 리다이렉트라 non-www canonical/사이트맵은
  // 전부 리다이렉트 URL이 되어 구글에 모순 신호를 보냄 (2026-07-10 라이브 감사)
  origin: "https://www.thaifacialclinic.com",
  name: "Thailand Hair Transplant Guide",
  shortName: "TH Hair Guide",
  parentName: "Thai Facial Clinic Group",
  parentSubtext: "Also covering botox · filler · HIFU at our group sites",
  tagline: {
    en: "Real reviews. Real photos. Real clinics. No paid viral.",
    ko: "진짜 후기. 진짜 사진. 진짜 클리닉. 광고 거품 없음.",
    th: "รีวิวจริง รูปจริง คลินิกจริง ไม่มีไวรัลแบบเสียเงิน",
    zh: "真实评价。真实照片。真实诊所。无付费水军。",
    ar: "تقييمات حقيقية. صور حقيقية. عيادات حقيقية. بدون دعاية مدفوعة.",
  },
} as const;

export const T = {
  // Directory
  filter_out_viral: {
    en: "Filter out suspected ad/viral clinics",
    ko: "광고/바이럴 의심 클리닉 제외",
    th: "กรองคลินิกที่มีพิรุธว่าเป็นโฆษณา/ไวรัล",
    zh: "过滤可疑广告/水军诊所",
    ar: "تصفية العيادات المشتبه بها كإعلانات/فيروسية",
  },
  trust_score: { en: "Trust Score", ko: "신뢰 점수", th: "คะแนนความน่าเชื่อถือ", zh: "信任分数", ar: "درجة الثقة" },
  verified_partners: {
    en: "Verified Partnership Clinics",
    ko: "공식 파트너 클리닉",
    th: "คลินิกพันธมิตรที่ได้รับการตรวจสอบ",
    zh: "认证合作诊所",
    ar: "العيادات الشريكة الموثقة",
  },
  all_clinics: { en: "All Clinics", ko: "전체 클리닉", th: "คลินิกทั้งหมด", zh: "全部诊所", ar: "جميع العيادات" },
  sort_by: { en: "Sort by", ko: "정렬", th: "เรียงตาม", zh: "排序", ar: "ترتيب حسب" },
  sort_trust: { en: "Trust Score", ko: "신뢰 점수", th: "คะแนนความน่าเชื่อถือ", zh: "信任分数", ar: "درجة الثقة" },
  sort_reviews: { en: "Most reviewed", ko: "리뷰 많은 순", th: "รีวิวมากที่สุด", zh: "评价最多", ar: "الأكثر تقييمًا" },
  sort_rating: { en: "Highest rated", ko: "별점 높은 순", th: "คะแนนสูงสุด", zh: "评分最高", ar: "الأعلى تقييمًا" },
  search_ph: {
    en: "Search clinics, procedures, cities…",
    ko: "클리닉·시술·도시 검색…",
    th: "ค้นหาคลินิก ขั้นตอน เมือง…",
    zh: "搜索诊所、项目、城市…",
    ar: "ابحث عن العيادات والإجراءات والمدن…",
  },
  cta_contact: { en: "Contact via LINE", ko: "라인으로 상담", th: "ติดต่อผ่าน LINE", zh: "通过 LINE 联系", ar: "تواصل عبر LINE" },
  cta_bookimed: { en: "Get Free Quote", ko: "무료 견적 받기", th: "ขอใบเสนอราคาฟรี", zh: "免费报价", ar: "احصل على عرض مجاني" },
  source_reddit: { en: "Reddit", ko: "Reddit", th: "Reddit", zh: "Reddit", ar: "Reddit" },
  source_naver: { en: "Naver", ko: "네이버", th: "Naver", zh: "Naver", ar: "Naver" },
  source_maps: { en: "Google Maps", ko: "구글 맵", th: "Google Maps", zh: "谷歌地图", ar: "خرائط جوجل" },
  source_photos: { en: "Photos", ko: "사진", th: "รูป", zh: "照片", ar: "صور" },
  source_videos: { en: "YouTube", ko: "유튜브", th: "YouTube", zh: "YouTube", ar: "YouTube" },
  // Clinic detail
  patient_voices: {
    en: "What real patients say",
    ko: "진짜 환자들의 후기",
    th: "ผู้ป่วยจริงพูดอะไรบ้าง",
    zh: "真实患者评价",
    ar: "ماذا يقول المرضى الحقيقيون",
  },
  procedures_offered: { en: "Procedures offered", ko: "제공 시술", th: "บริการที่มี", zh: "提供项目", ar: "الإجراءات المتاحة" },
  faq: { en: "Frequently asked", ko: "자주 묻는 질문", th: "คำถามที่พบบ่อย", zh: "常见问题", ar: "أسئلة شائعة" },
  // B2B
  market_share: { en: "Market Share & Competitor Intelligence", ko: "시장 점유율 & 경쟁사 분석", th: "ส่วนแบ่งตลาดและการวิเคราะห์คู่แข่ง", zh: "市场份额与竞品分析", ar: "حصة السوق والمنافسة" },
  lead_traffic: { en: "Lead Traffic Analytics", ko: "리드 트래픽 분석", th: "การวิเคราะห์ลูกค้าเป้าหมาย", zh: "潜在客户流量分析", ar: "تحليلات حركة العملاء" },
} as const;

export function t<K extends keyof typeof T>(key: K, lang: Lang): string {
  const node = T[key] as Record<string, string>;
  return node[lang] ?? node[DEFAULT_LANG];
}
