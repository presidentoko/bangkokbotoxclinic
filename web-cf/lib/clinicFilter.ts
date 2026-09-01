// 비-클리닉 primary_type 차단 — 디렉터리 리스팅에서 노이즈 제거.
// node:fs 의존성 없음 → Edge runtime 에서도 import 안전.

import type { Clinic } from "./types";

const NON_CLINIC_TYPES = new Set([
  // Spas / wellness — NOT clinics
  "Day spa", "Medical spa", "Facial spa", "Health spa", "Spa", "Massage spa",
  "Wellness center", "Wellness Centre", "Wellness Programme",
  "Massage therapist", "Thai massage therapist", "Foot massage", "Erotic massage", "Massage school",
  // Beauty / salons — not medical even if doing some skincare
  "Beauty salon", "Beauty Salon", "Hair salon", "Nail salon", "Eyelash salon",
  "Eyebrow bar", "Beauty products wholesaler", "Beauty therapy college",
  "Health and beauty shop",
  // Physical therapy — not aesthetic; excluded from botox/filler/facial feeds
  "Physiotherapist", "Physical therapist", "Massage therapist",
  "Occupational therapist", "Acupuncturist", "Chiropractor",
  "Traditional medicine practitioner",
  // Pet care — 2026-09-02: 실데이터에 있던 유형을 전부 넣었다(Veterinary care 11건 등).
  "Animal hospital", "Veterinarian", "Pet supply store",
  "Veterinary care", "Veterinary pharmacy", "Pet store", "Pet groomer", "Dog trainer",
  // Retail / shopping / food — strongest non-medical signals
  "Shopping mall", "Shopping Centre", "Department store",
  "Fresh food market", "Fruit market", "Produce market",
  "Market", "Wholesale market", "Night market",
  "Supermarket", "Convenience store", "Grocery store",
  "Food court", "Food market",
  "Cannabis store", "Cannabis dispensary",
  "Pharmacy", "Drug store",
  "Retail space rental agency",
  // Food & drink
  "Restaurant", "Fast food restaurant", "Korean restaurant", "Japanese restaurant",
  "Thai restaurant", "Chinese restaurant",
  "Cafe", "Coffee shop", "Bakery", "Bar", "Pub",
  // Accommodation / services
  "Hotel", "Guest house", "Resort", "Hostel",
  "School", "University", "Office",
  "Bank", "ATM", "Gas station", "Parking",
  // Fitness (unless explicitly medical)
  "Gym", "Fitness center", "Yoga studio", "Muay Thai gym",
]);

// 이름에 명백한 비-클리닉 시그널
const NAME_BLOCKLIST_PATTERNS: RegExp[] = [
  /\bspa\b/i, /\bmassage\b/i, /\bsalon\b/i, /\bcafe\b/i, /\brestaurant\b/i,
  // 2026-09-02: 동물병원. 이름 허용목록(clinic/dental/medical…)이 primary_type
  // 차단을 이기는 구조라 "Pet Dental Center"(Animal hospital)가 덴탈 사이트에
  // 실렸고, "Family Pet Clinic" 같은 104곳이 clinical 통과했다. "이름이 가장 강한
  // 신호"라는 원칙은 유지하되 수의 신호를 의료 신호보다 먼저 본다.
  // 실측 162곳 전수 확인 — 사람 대상 클리닉 오탐 0.
  /\b(veterinary|veterinarian|vet)\b/i, /\banimal\b/i, /\bpets?\b/i, /สัตว/,
];

// 이름에 강한 클리닉 시그널 — Google이 primary_type 잘못 매겨도 이건 클리닉
const NAME_ALLOWLIST_PATTERNS: RegExp[] = [
  /\bclinic\b/i, /\bdental\b/i, /\bmedical\b/i, /\baesthetic\b/i,
  /\bdermatology\b/i, /\bplastic\b/i, /\bsurgery\b/i, /\bhospital\b/i,
  /\b(hair transplant|trichology|FUE|DHI|SMP|scalp micropigment)\b/i,
];

export function isClinicLike(c: Clinic): boolean {
  // 1) 이름에 spa/massage/salon 있으면 무조건 차단 (이름이 가장 강한 시그널)
  for (const re of NAME_BLOCKLIST_PATTERNS) {
    if (re.test(c.name)) return false;
  }
  // 2) 이름에 clinic/dental/medical 명확하면 primary_type 무시하고 통과
  const hasMedicalName = NAME_ALLOWLIST_PATTERNS.some((re) => re.test(c.name));
  if (hasMedicalName) return true;
  // 3) primary_type 으로 비-클리닉 차단
  if (NON_CLINIC_TYPES.has(c.primary_type)) return false;
  if (!c.primary_type && c.categories.length === 0) return false;
  return true;
}
