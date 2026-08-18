import { promises as fs } from "node:fs";
import path from "node:path";
import type { MasterDb, Course } from "./types";
import {
  findDestination, belongsToDestination, claimedByDestination,
  type CityDestination,
} from "./cityAliases";

const DATA_PATH = path.join(process.cwd(), "data", "master_db.json");
const PHOTOS_PATH = path.join(process.cwd(), "data", "course_photos.json");

let _cache: MasterDb | null = null;

export async function loadMasterDb(): Promise<MasterDb> {
  if (_cache) return _cache;
  const raw = await fs.readFile(DATA_PATH, "utf-8");
  const db = JSON.parse(raw) as MasterDb;

  // Merge scraped course photos (sidecar — survives master_db rebuilds)
  let photos: Record<string, string> = {};
  try {
    const pRaw = await fs.readFile(PHOTOS_PATH, "utf-8");
    photos = JSON.parse(pRaw);
  } catch {
    // sidecar optional
  }

  const courses = db.courses ?? db.restaurants ?? [];
  for (const c of courses) {
    if (photos[c.id]) c.hero_image = photos[c.id];
  }

  // alias — 기존 식당 코드 import 호환
  if (!db.restaurants) db.restaurants = courses;
  if (db.total_restaurants === undefined) db.total_restaurants = db.total_courses;
  if (!db.cuisine_counts) db.cuisine_counts = db.category_counts;

  // Normalize raw city display names to canonical English title-case.
  // Handles: ALL-CAPS duplicates ("CHIANG MAI"), raw Thai script ("นครพนม").
  const CITY_NORM: Record<string, string> = {
    "CHIANG MAI": "Chiang Mai",
    "นครพนม": "Nakhon Phanom",
    "HUA HIN": "Hua Hin",
    "PHUKET": "Phuket",
    "BANGKOK": "Bangkok",
    "PATTAYA": "Pattaya",
    "CHON BURI": "Chon Buri",
  };
  const normCity = (s: string) => CITY_NORM[s] ?? s;

  // Normalize city_counts keys (merge counts for dupes that share a canonical name)
  const normCityCounts: Record<string, number> = {};
  for (const [k, v] of Object.entries(db.city_counts)) {
    const canon = normCity(k);
    normCityCounts[canon] = (normCityCounts[canon] ?? 0) + (v as number);
  }
  db.city_counts = normCityCounts;

  // Normalize city_label on each course
  for (const c of courses) {
    if (CITY_NORM[c.city_label]) c.city_label = CITY_NORM[c.city_label];
  }

  _cache = db;
  return _cache;
}

export function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9฀-๿]+/g, "-").replace(/^-+|-+$/g, "");
}

export function filterByCategory(courses: Course[], cat: string): Course[] {
  return courses.filter((c) => c.categories.includes(cat));
}

export function filterByCuisine(courses: Course[], cat: string): Course[] {
  return filterByCategory(courses, cat);
}

export function filterByDistrict(courses: Course[], district: string, city?: string): Course[] {
  return courses.filter((c) => c.district === district && (!city || c.city === city));
}

export function filterByCity(courses: Course[], city: string): Course[] {
  return courses.filter((c) => c.city === city);
}

/**
 * 골프 본연의 시설만 남긴다. master_db 에는 미니골프·골프연습장 부대시설·골프용품점처럼
 * "green fee" 개념이 없는 항목도 섞여 있어서, 가격 비교 같은 화면에서 걸러내야 한다.
 */
export function golfOnly(courses: Course[]): Course[] {
  return courses.filter((c) => {
    if (c.is_golf_filtered === false) return false;
    const cats = c.categories ?? [];
    if (cats.length && !cats.some((k) => GOLF_CATEGORIES.has(k))) return false;
    return !NON_GOLF_NAME.test(c.name ?? "");
  });
}

const GOLF_CATEGORIES = new Set(["course", "club", "resort", "driving_range", "indoor"]);
const NON_GOLF_NAME = /\b(mini[\s-]?golf|foot[\s-]?golf|golf\s*(shop|store|shack)|pro\s*shop)\b/i;

/**
 * 슬러그가 목적지 별칭인지 해석한다.
 * 별칭이면 CityDestination, 아니면 undefined — 호출부는 진리값으로 써도 된다.
 */
export function resolveCityAlias(slug: string): CityDestination | undefined {
  return findDestination(slug);
}

/**
 * 도시 슬러그로 코스를 고르되, 목적지 별칭을 함께 해석한다.
 *
 *  · 목적지 슬러그(hua_hin 등)  → 그 목적지에 속하는 코스 전부 (상위 도에서 흡수한 것 포함)
 *  · 그 밖의 도시 슬러그        → 그 도시의 코스 중 더 구체적인 목적지에 빼앗기지 않은 것만
 *
 * 두 번째 규칙이 배타성을 만든다. 이게 없으면 /city/hua_hin 과
 * /city/prachuap_khiri_khan 이 거의 같은 목록이 되어 중복 콘텐츠가 된다.
 */
export function filterByCityOrAlias(courses: Course[], slug: string): Course[] {
  const dest = findDestination(slug);
  if (dest) return courses.filter((c) => belongsToDestination(c, dest));
  return courses.filter((c) => c.city === slug && !claimedByDestination(c));
}

export function topByTrust(courses: Course[], n: number): Course[] {
  return [...courses].sort((a, b) => b.trust_score - a.trust_score).slice(0, n);
}

export function getCourseById(courses: Course[], id: string): Course | undefined {
  return courses.find((c) => c.id === id);
}

export const getRestaurantById = getCourseById;
