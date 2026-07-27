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

// Locally-scraped photos (as opposed to lh3.googleusercontent.com hotlinks)
// used to be served from web/public/clinic-images/ on Vercel's own edge,
// which counted against Vercel's bandwidth quota. They're now uploaded to
// an R2 bucket bound to this custom domain instead (2026-07-27) -- rewrite
// happens here, once, rather than touching every data/photos/*.json file.
const LOCAL_IMAGE_PREFIX = "/clinic-images/";
const IMAGE_CDN_ORIGIN = "https://img.bangkokbestclinic.com";

function toCdnUrl(url: string): string {
  return url.startsWith(LOCAL_IMAGE_PREFIX) ? `${IMAGE_CDN_ORIGIN}${url}` : url;
}

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
        parsed.photos = parsed.photos.map((p) => ({ ...p, thumb: toCdnUrl(p.thumb), large: toCdnUrl(p.large) }));
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
