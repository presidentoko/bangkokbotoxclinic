// master_db.json 로딩 + 필터링 헬퍼.
// SSG 시 빌드 타임에 import — 파일 시스템 직접 읽음.

import { promises as fs } from "node:fs";
import path from "node:path";
import type { Clinic, MasterDb } from "./types";

const DATA_PATH = path.join(process.cwd(), "data", "master_db.json");

let _cache: MasterDb | null = null;

export async function loadMasterDb(): Promise<MasterDb> {
  if (_cache) return _cache;
  const raw = await fs.readFile(DATA_PATH, "utf-8");
  _cache = JSON.parse(raw) as MasterDb;
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

export function filterByCategory(clinics: Clinic[], category: string): Clinic[] {
  return clinics.filter((c) => c.categories.includes(category));
}

export function filterByDistrict(clinics: Clinic[], district: string): Clinic[] {
  return clinics.filter((c) => c.district === district);
}

export function topByTrust(clinics: Clinic[], n: number): Clinic[] {
  return [...clinics].sort((a, b) => b.trust_score - a.trust_score).slice(0, n);
}

export function getClinicById(clinics: Clinic[], id: string): Clinic | undefined {
  return clinics.find((c) => c.id === id);
}

// 카테고리별 specialist subset (review 에서 시술명 5+ mention)
export function specialistSubset(clinics: Clinic[], category: string,
                                  threshold = 5): Clinic[] {
  return clinics.filter((c) => (c.service_mentions[category] ?? 0) >= threshold);
}
