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
  // Pet care
  "Animal hospital", "Veterinarian", "Pet supply store",
  // Retail / shopping
  "Shopping mall", "Shopping Centre", "Department store",
  "Fresh food market", "Supermarket", "Convenience store", "Grocery store",
  "Cannabis store", "Cannabis dispensary",
  "Pharmacy", "Drug store",
  "Retail space rental agency",
  // Non-medical services
  "Restaurant", "Cafe", "Hotel",
  "School", "University", "Office",
  "Bank", "ATM", "Gas station", "Parking",
]);

// 이름에 명백한 비-클리닉 시그널
const NAME_BLOCKLIST_PATTERNS: RegExp[] = [
  /\bspa\b/i, /\bmassage\b/i, /\bsalon\b/i, /\bcafe\b/i, /\brestaurant\b/i,
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
