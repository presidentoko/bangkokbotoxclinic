// Photo data loader — reads data/photos/{clinicId}.json at SSG/SSR time.
// 헤어 사이트는 hair-project 스크랩본에서 460개 클리닉 사진 매핑 완료.
// 다른 사이트는 Places API 통합 시까지 빈 결과 반환.

import { promises as fs } from "node:fs";
import path from "node:path";

export type ClinicPhoto = {
  idx: number;
  thumb: string;
  large: string;
};

export type ClinicPhotos = {
  place_id: string;
  source: string;
  supplier_name?: string;
  photos: ClinicPhoto[];
};

const PHOTOS_DIR = path.join(process.cwd(), "data", "photos");

const _cache = new Map<string, ClinicPhotos | null>();

export async function loadPhotos(clinicId: string): Promise<ClinicPhotos | null> {
  if (_cache.has(clinicId)) return _cache.get(clinicId) ?? null;
  const variants = [clinicId, clinicId.replace(/:/g, "_")];
  for (const variant of variants) {
    const file = path.join(PHOTOS_DIR, `${variant}.json`);
    try {
      const raw = await fs.readFile(file, "utf-8");
      const parsed = JSON.parse(raw) as ClinicPhotos;
      if (Array.isArray(parsed.photos) && parsed.photos.length > 0) {
        _cache.set(clinicId, parsed);
        return parsed;
      }
    } catch {
      // 다음 variant 시도
    }
  }
  _cache.set(clinicId, null);
  return null;
}
