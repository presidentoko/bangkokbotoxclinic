import "server-only";
import fs from "node:fs";
import path from "node:path";
import type { ClinicsBundle, Clinic } from "./types";

// Categories that indicate non-medical hair businesses (barbers, wig shops, retail)
const BLOCKED_CATEGORIES = new Set([
  "wig shop",
  "health and beauty shop",
  "barber shop",
  "hair salon",
  "beauty supply store",
]);

// Name patterns for non-medical hair businesses
const BLOCKED_NAME_PATTERNS = [
  /barber/i,
  /wig\s/i,
  /hair\s+system/i,
];

function isHairClinicLike(c: Clinic): boolean {
  const cat = (c.category ?? "").toLowerCase();
  if (BLOCKED_CATEGORIES.has(cat)) return false;
  const name = (c.name ?? "").toLowerCase();
  if (BLOCKED_NAME_PATTERNS.some((p) => p.test(name))) return false;
  return true;
}

// 2026-10-26: 태국 모발이식 가이드인데 145곳 중 52곳이 인도·터키·독일·파키스탄 등
// 해외 클리닉이었다(구글 검색이 "DHI"·"hair transplant" 로 전 세계 지점을 끌어옴).
// 지도 좌표(!3d lat !4d lng)가 145곳 모두 있고 주소 판정과 100% 일치 — 좌표 우선,
// 없으면 +66 전화번호로 판정. 데이터 재빌드가 덮어써도 유지되게 로드 시점에 거른다.
const TH_BBOX = { latMin: 5.5, latMax: 20.6, lngMin: 97.3, lngMax: 105.7 };
function isInThailand(c: Clinic): boolean {
  const m = /!3d(-?[\d.]+)!4d(-?[\d.]+)/.exec(c.google_maps_url ?? "");
  if (m) {
    const lat = Number(m[1]);
    const lng = Number(m[2]);
    return lat > TH_BBOX.latMin && lat < TH_BBOX.latMax && lng > TH_BBOX.lngMin && lng < TH_BBOX.lngMax;
  }
  return (c.phone ?? "").replace(/\s/g, "").startsWith("+66");
}

let cache: ClinicsBundle | null = null;

export function loadClinics(): ClinicsBundle {
  if (cache) return cache;
  const p = path.join(process.cwd(), "public", "data", "clinics.json");
  if (!fs.existsSync(p)) {
    cache = { generated_at: new Date().toISOString(), total: 0, avg_trust: 0, clinics: [] };
    return cache;
  }
  const raw = fs.readFileSync(p, "utf-8");
  const raw_bundle = JSON.parse(raw) as ClinicsBundle;
  const filtered = raw_bundle.clinics.filter((c) => isHairClinicLike(c) && isInThailand(c));
  cache = {
    ...raw_bundle,
    clinics: filtered,
    total: filtered.length,
    avg_trust: filtered.length > 0
      ? Math.round(filtered.reduce((s, c) => s + (c.trust_score ?? 0), 0) / filtered.length)
      : 0,
  };
  return cache;
}

export function getClinicBySlug(slug: string): Clinic | undefined {
  return loadClinics().clinics.find((c) => c.slug === slug);
}

export function getClinicById(id: string): Clinic | undefined {
  return loadClinics().clinics.find((c) => c.id === id);
}
