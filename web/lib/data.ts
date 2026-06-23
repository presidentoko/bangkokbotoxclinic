// master_db.json 로딩 + 필터링 헬퍼.
// SSG 시 빌드 타임에 import — 파일 시스템 직접 읽음.

import { promises as fs } from "node:fs";
import path from "node:path";
import type { Clinic, MasterDb } from "./types";

const DATA_PATH = path.join(process.cwd(), "data", "master_db.json");
const EXTRA_PATH = path.join(process.cwd(), "data", "extra_clinics.json");

let _cache: MasterDb | null = null;

export async function loadMasterDb(): Promise<MasterDb> {
  if (_cache) return _cache;
  const raw = await fs.readFile(DATA_PATH, "utf-8");
  const parsed = JSON.parse(raw) as MasterDb;
  const DEFAULT_TREND = { recent: { count: 0, avg: null }, midterm: { count: 0, avg: null }, old: { count: 0, avg: null }, trend: "insufficient_data" as const };
  for (const c of parsed.clinics) {
    if (c.trust_score > 100) c.trust_score = 100;
    if (c.trust_score < 0) c.trust_score = 0;
    if (!c.rating_trend) c.rating_trend = DEFAULT_TREND;
  }

  // 추가 stub 클리닉 (outreach import 결과) 머지. master_db에 이미 있으면 skip
  // → watchdog Bangkok grid가 풍부화하면 stub 자동 무시됨.
  // extra_clinics 의 id 는 Google place_id 원본 (`0xA:0xB`) 형식.
  // master_db 컨벤션 (`0xA_0xB`) 으로 정규화 — Windows 파일명에 `:` 불가 +
  // URL 에서 `:` 가 reserved 라 라우팅 곤란.
  try {
    const extraRaw = await fs.readFile(EXTRA_PATH, "utf-8");
    const extra = JSON.parse(extraRaw) as { clinics: Clinic[] };
    const existing = new Set(parsed.clinics.map((c) => c.place_id));
    let added = 0;
    for (const c of extra.clinics ?? []) {
      if (existing.has(c.place_id)) continue;
      parsed.clinics.push({
        ...c,
        id: (c.id ?? "").replace(/:/g, "_"),
      });
      added++;
    }
    if (added > 0) {
      parsed.total_clinics = parsed.clinics.length;
    }
  } catch {
    // 파일 없거나 잘못된 형식 → 조용히 무시
  }

  _cache = parsed;
  return _cache;
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9฀-๿]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function unslugifyDistrict(slug: string, allDistricts: string[]): string | null {
  const target = slug.toLowerCase();
  return allDistricts.find((d) => slugify(d) === target) ?? null;
}

export { isClinicLike } from "./clinicFilter";
import { isClinicLike } from "./clinicFilter";

export function filterByCategory(clinics: Clinic[], category: string): Clinic[] {
  return clinics.filter((c) => isClinicLike(c) && c.categories.includes(category));
}

export function filterByDistrict(clinics: Clinic[], district: string): Clinic[] {
  return clinics.filter((c) => isClinicLike(c) && c.district === district);
}

export function topByTrust(clinics: Clinic[], n: number): Clinic[] {
  return [...clinics].sort((a, b) => b.trust_score - a.trust_score).slice(0, n);
}

/** Focus-aware 랭킹 — focus 사이트(botox/dental/hair 등)에서
 *  '진짜 특화' 신호 (해당 카테고리 명시 + 충분한 service mentions) 가 강한 클리닉을 상위로.
 *  대형 일반 클리닉이 1-2 mention만 가지고 #1 차지하는 케이스 방지.
 *
 *  Score = trust_score + min(20, mentions * 2) + (categories.includes(focus) ? 5 : 0)
 *  → 최대 +25 보너스. trust_score 차이 25 이내면 specialty가 앞.
 */
export function topByFocusRelevance(
  clinics: Clinic[],
  focus: string,
  n: number,
): Clinic[] {
  if (focus === "all" || !focus) return topByTrust(clinics, n);
  function score(c: Clinic): number {
    const mentions = c.service_mentions[focus] ?? 0;
    const mentionBonus = Math.min(20, mentions * 2);
    const categoryBonus = c.categories.includes(focus) ? 5 : 0;
    return c.trust_score + mentionBonus + categoryBonus;
  }
  return [...clinics].sort((a, b) => score(b) - score(a)).slice(0, n);
}

export function getClinicById(clinics: Clinic[], id: string): Clinic | undefined {
  return clinics.find((c) => c.id === id);
}

// 카테고리별 specialist subset (review 에서 시술명 5+ mention)
export function specialistSubset(clinics: Clinic[], category: string,
                                  threshold = 5): Clinic[] {
  return clinics.filter((c) => (c.service_mentions[category] ?? 0) >= threshold);
}

// ── Doctor helpers ──────────────────────────────────────────

import type { DoctorStat } from "./types";

export type DoctorWithClinic = DoctorStat & {
  composite_slug: string;     // URL slug — globally unique
  clinic: Clinic;
};

/** clinic_name slugified, 짧게 자르기 — SEO friendly suffix */
function clinicSlugForUrl(c: Clinic): string {
  const base = slugify(c.name).slice(0, 50);
  return base || c.id.slice(0, 16);
}

/** doctor + clinic 조합으로 globally unique slug 생성.
 *  build_master_db.py 가 미리 계산해서 d.composite_slug 에 저장하므로 그걸 우선 사용.
 *  fallback 으로 TS 측에서 동일 로직 재계산 (구버전 master_db 호환). */
export function makeCompositeDoctorSlug(d: DoctorStat, c: Clinic): string {
  return d.composite_slug || `${d.slug}-at-${clinicSlugForUrl(c)}`;
}

export function getAllDoctors(clinics: Clinic[]): DoctorWithClinic[] {
  const out: DoctorWithClinic[] = [];
  for (const c of clinics) {
    for (const d of c.doctor_stats ?? []) {
      out.push({
        ...d,
        composite_slug: makeCompositeDoctorSlug(d, c),
        clinic: c,
      });
    }
  }
  return out;
}

export function getDoctorByCompositeSlug(clinics: Clinic[], slug: string): DoctorWithClinic | undefined {
  for (const c of clinics) {
    for (const d of c.doctor_stats ?? []) {
      if (makeCompositeDoctorSlug(d, c) === slug) {
        return { ...d, composite_slug: slug, clinic: c };
      }
    }
  }
  return undefined;
}
