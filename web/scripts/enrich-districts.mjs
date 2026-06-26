// scripts/enrich-districts.mjs
// district 없는 방콕 클리닉을 Nominatim(OpenStreetMap) 역지오코딩으로 보강.
// 실행: node scripts/enrich-districts.mjs
// 멱등성: 이미 district 있는 건 건너뜀.
// Nominatim 사용 정책: 1 req/s, User-Agent 필수.

import { promises as fs } from "node:fs";
import path from "node:path";

const DB_PATH = path.join(process.cwd(), "data", "master_db.json");
const ERRORS_PATH = path.join(process.cwd(), "data", "district_errors.json");
const DELAY_MS = 1100; // Nominatim: max 1 req/s
const UA = "BangkokClinicsDirectory/1.0 (contact@bangkokbotoxclinic.com)";

const raw = await fs.readFile(DB_PATH, "utf-8");
const db = JSON.parse(raw);

const targets = db.clinics.filter(
  (c) => !c.district && c.lat && c.lng && c.city_label === "Bangkok"
);
console.log(`[enrich-districts] ${targets.length}개 처리 예정 (Nominatim, ~${Math.ceil(targets.length / 60)}분 예상)`);

const errors = [];
let done = 0;

async function geocode(lat, lng) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=en`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    // Bangkok district (khet) in suburb or city_district or quarter
    const a = data.address ?? {};
    // Nominatim: suburb = tambon/khwaeng, city_district = khet (district)
    return a.city_district ?? a.suburb ?? a.quarter ?? a.county ?? null;
  } catch {
    return null;
  }
}

for (let i = 0; i < targets.length; i++) {
  const clinic = targets[i];
  const district = await geocode(clinic.lat, clinic.lng);
  if (district) {
    const idx = db.clinics.findIndex((c) => c.id === clinic.id);
    if (idx !== -1) db.clinics[idx].district = district;
    done++;
  } else {
    errors.push({ id: clinic.id, name: clinic.name, lat: clinic.lat, lng: clinic.lng });
  }
  if (i % 50 === 0) console.log(`  ${i + 1}/${targets.length} | done:${done} | fail:${errors.length}`);
  await new Promise((r) => setTimeout(r, DELAY_MS));
}

await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
await fs.writeFile(ERRORS_PATH, JSON.stringify(errors, null, 2));
console.log(`[enrich-districts] 완료. district 추가: ${done}, 실패: ${errors.length}`);
