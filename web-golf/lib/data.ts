import { promises as fs } from "node:fs";
import path from "node:path";
import type { MasterDb, Course } from "./types";

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

export function topByTrust(courses: Course[], n: number): Course[] {
  return [...courses].sort((a, b) => b.trust_score - a.trust_score).slice(0, n);
}

export function getCourseById(courses: Course[], id: string): Course | undefined {
  return courses.find((c) => c.id === id);
}

export const getRestaurantById = getCourseById;
