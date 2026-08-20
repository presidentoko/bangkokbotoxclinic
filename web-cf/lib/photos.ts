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

// Google Maps 사진 URL(lh3.googleusercontent.com/gps-cs-s/...)은 서명된 임시
// 링크라 일정 시간이 지나면 영구적으로 403을 반환한다 — 브라우저 UA와 Referer를
// 붙여도 0바이트다. 2026-08-06 기준 매니페스트 2,004개 중 1,387개(69%)의
// photos[0]이 이미 만료된 구글 링크이고, 그중 434개는 photos[1] 이후에 멀쩡한
// R2 사본을 이미 갖고 있으면서도 죽은 링크를 대표 사진으로 내보내고 있었다.
// (카드/갤러리는 photos[0]을 대표로 쓴다.) R2 사본을 앞으로 당기면 재스크래핑
// 없이 그 434개가 즉시 복구된다. 정렬은 안정 정렬이라 R2끼리·구글끼리의 원래
// 순서는 그대로 유지되고, idx는 원본 사진 번호라서 재부여하지 않는다.
function isExpiringHotlink(p: ClinicPhoto): boolean {
  const u = p.large || p.thumb || "";
  return u.startsWith(IMAGE_CDN_ORIGIN) || u.startsWith(LOCAL_IMAGE_PREFIX) ? false : true;
}

function r2First(photos: ClinicPhoto[]): ClinicPhoto[] {
  const hosted = photos.filter((p) => !isExpiringHotlink(p));
  // 전부 구글 링크면 순서를 바꿔봐야 의미가 없으므로 원본을 그대로 돌려준다.
  if (hosted.length === 0 || hosted.length === photos.length) return photos;
  return [...hosted, ...photos.filter(isExpiringHotlink)];
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
        parsed.photos = r2First(
          parsed.photos.map((p) => ({ ...p, thumb: toCdnUrl(p.thumb), large: toCdnUrl(p.large) })),
        );
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
