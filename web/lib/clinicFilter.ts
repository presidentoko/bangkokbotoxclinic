// 비-클리닉 primary_type 차단 — 디렉터리 리스팅에서 노이즈 제거.
// node:fs 의존성 없음 → Edge runtime 에서도 import 안전.

import type { Clinic } from "./types";

const NON_CLINIC_TYPES = new Set([
  "Shopping mall", "Shopping Centre", "Department store",
  "Fresh food market", "Supermarket", "Convenience store", "Grocery store",
  "Animal hospital", "Veterinarian", "Pet supply store",
  "Cannabis store", "Cannabis dispensary",
  "Day spa", "Massage spa", "Massage therapist", "Foot massage",
  "Hair salon", "Nail salon", "Eyebrow bar",
  "Restaurant", "Cafe", "Hotel", "Pharmacy", "Drug store",
  "School", "University", "Office",
  "Bank", "ATM", "Gas station", "Parking",
]);

export function isClinicLike(c: Clinic): boolean {
  if (NON_CLINIC_TYPES.has(c.primary_type)) return false;
  if (!c.primary_type && c.categories.length === 0) return false;
  return true;
}
