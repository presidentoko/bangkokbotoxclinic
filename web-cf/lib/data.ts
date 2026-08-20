// master_db.json 로딩 + 필터링 헬퍼.
// SSG 시 빌드 타임에 import — 파일 시스템 직접 읽음.

import { promises as fs } from "node:fs";
import path from "node:path";
import type { Clinic, MasterDb } from "./types";

const DATA_PATH = path.join(process.cwd(), "data", "master_db.json");
const EXTRA_PATH = path.join(process.cwd(), "data", "extra_clinics.json");

// Cloudflare Workers 에는 파일시스템이 없다 (2026-08-08 실측: fs.readFile 로
// master_db.json 을 읽던 /api/partner-signup 이 CF 에서 500, Vercel 에서 404).
// 런타임이 Worker 면 Worker 전용 자산(cdn-cgi/db/)에서 가져오고, 그 외
// (빌드타임 SSG · Vercel · 로컬)에서는 기존 fs 경로를 그대로 쓴다.
// 자산 복사는 scripts/copy-db-assets.mjs 가 배포 전에 수행한다.
type AssetsBinding = { fetch(url: string): Promise<Response> };
let _assets: AssetsBinding | null | undefined;

async function cfAssets(): Promise<AssetsBinding | null> {
  if (_assets !== undefined) return _assets;
  try {
    const mod = await import("@opennextjs/cloudflare");
    const env = mod.getCloudflareContext().env as unknown as { ASSETS?: AssetsBinding };
    _assets = env.ASSETS ?? null;
  } catch {
    // Cloudflare 컨텍스트가 아니다 — fs 로 간다.
    _assets = null;
  }
  return _assets;
}

/** data/ 파일 하나를 읽는다. Worker 면 ASSETS, 아니면 fs.
 *  Worker 에서 자산을 못 찾으면 fs 로 폴백하지 않고 그대로 던진다 —
 *  폴백해봐야 파일시스템이 없어 실패하고, 진짜 원인(자산 미복사)만 가려진다. */
async function readDataFile(fsPath: string, assetName: string): Promise<string> {
  const assets = await cfAssets();
  if (assets) {
    const res = await assets.fetch(`http://assets.local/cdn-cgi/db/${assetName}`);
    if (!res.ok) {
      await res.body?.cancel();
      throw new Error(
        `[readDataFile] ASSETS 에 cdn-cgi/db/${assetName} 없음 (HTTP ${res.status}). ` +
          `배포 전 scripts/copy-db-assets.mjs 를 돌렸는지 확인할 것.`
      );
    }
    return res.text();
  }
  return fs.readFile(fsPath, "utf-8");
}

let _cache: MasterDb | null = null;

export async function loadMasterDb(): Promise<MasterDb> {
  if (_cache) return _cache;
  let parsed: MasterDb;
  try {
    const raw = await readDataFile(DATA_PATH, "master_db.json");
    parsed = JSON.parse(raw) as MasterDb;
  } catch (err) {
    console.error(`[loadMasterDb] failed to read/parse ${DATA_PATH}:`, err);
    throw err;
  }
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
    const extraRaw = await readDataFile(EXTRA_PATH, "extra_clinics.json");
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

// getClinicById/getDoctorByCompositeSlug 는 페이지당 여러 번(generateMetadata +
// page body) O(n) 스캔을 반복해 빌드 시간을 갉아먹었음 — db.clinics 원본
// 배열(레퍼런스 동일)로 조회할 때만 Map 캐시 사용, 그 외(필터링된 subset)는
// 기존 O(n) 스캔으로 폴백해 동작은 100% 그대로 유지 (2026-07-17 감사).
let _clinicByIdSrc: Clinic[] | null = null;
let _clinicByIdMap: Map<string, Clinic> | null = null;
let _doctorSlugSrc: Clinic[] | null = null;
let _doctorSlugMap: Map<string, DoctorWithClinic> | null = null;

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
  if (clinics === _clinicByIdSrc && _clinicByIdMap) {
    return _clinicByIdMap.get(id);
  }
  if (clinics.length > 200) {
    // db.clinics 전체(수천 개) 규모일 때만 Map 구축 비용이 남는 장사 —
    // 작은 subset 은 그냥 스캔이 더 쌈.
    _clinicByIdSrc = clinics;
    _clinicByIdMap = new Map(clinics.map((c) => [c.id, c]));
    return _clinicByIdMap.get(id);
  }
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

/** 클리닉 place_id 축약 — scripts/build_master_db.py의 composite_doctor_slug와
 * 동일 로직(마지막 12 hex 문자). 2026-07-31 이전엔 클리닉 이름을 슬러그로
 * 써서 구글맵 상호명이 바뀔 때마다 그 클리닉의 의사 URL이 전부 영구
 * 고아가 됐음 — place_id는 안정적이라 대신 사용. */
function clinicSlugForUrl(c: Clinic): string {
  const shortId = c.id.replace(/[^0-9a-fA-F]/g, "").slice(-12).toLowerCase();
  return shortId || slugify(c.name).slice(0, 50);
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
  // App Router 전달값이 percent-encoded로 남는 케이스가 있어 (태국어 slug),
  // 디코드된 값과 원본 값 둘 다 비교 — 둘 중 하나라도 일치하면 매치.
  let decoded = slug;
  try { decoded = decodeURIComponent(slug); } catch { /* malformed — raw slug만 비교 */ }

  // db.clinics 전체(레퍼런스 동일)일 때만 Map 캐시 — O(clinics×doctors) 스캔을
  // 페이지 렌더마다 반복하던 걸 1회 구축 후 O(1) 조회로 (2026-07-17 감사).
  if (clinics.length > 200) {
    if (clinics !== _doctorSlugSrc || !_doctorSlugMap) {
      _doctorSlugSrc = clinics;
      _doctorSlugMap = new Map();
      for (const c of clinics) {
        for (const d of c.doctor_stats ?? []) {
          const composite = makeCompositeDoctorSlug(d, c);
          _doctorSlugMap.set(composite, { ...d, composite_slug: composite, clinic: c });
        }
      }
    }
    return _doctorSlugMap.get(slug) ?? _doctorSlugMap.get(decoded);
  }

  for (const c of clinics) {
    for (const d of c.doctor_stats ?? []) {
      const composite = makeCompositeDoctorSlug(d, c);
      if (composite === slug || composite === decoded) {
        return { ...d, composite_slug: composite, clinic: c };
      }
    }
  }
  return undefined;
}
