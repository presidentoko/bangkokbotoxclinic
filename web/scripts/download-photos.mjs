// scripts/download-photos.mjs
// Google CDN 사진 → public/clinic-images/ 로 다운로드.
// 실행: node scripts/download-photos.mjs
// 이미 다운로드된 파일은 건너뜀 (멱등성).

import { promises as fs } from "node:fs";
import path from "node:path";
import { createWriteStream } from "node:fs";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";

const PHOTOS_DIR = path.join(process.cwd(), "data", "photos");
const OUT_DIR = path.join(process.cwd(), "public", "clinic-images");
const CONCURRENCY = 8;
const TIMEOUT_MS = 10_000;

await fs.mkdir(OUT_DIR, { recursive: true });

const files = (await fs.readdir(PHOTOS_DIR)).filter((f) => f.endsWith(".json"));
console.log(`[download-photos] ${files.length} clinic photo files found`);

let downloaded = 0, skipped = 0, failed = 0;

async function downloadOne(url, dest) {
  if (await fs.access(dest).then(() => true).catch(() => false)) {
    skipped++;
    return true;
  }
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    const res = await fetch(url, { signal: controller.signal, headers: { "User-Agent": "Mozilla/5.0" } });
    clearTimeout(timer);
    if (!res.ok || !res.body) { failed++; return false; }
    await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
    downloaded++;
    return true;
  } catch {
    failed++;
    return false;
  }
}

// Process in batches of CONCURRENCY
for (let i = 0; i < files.length; i += CONCURRENCY) {
  const batch = files.slice(i, i + CONCURRENCY);
  await Promise.all(batch.map(async (file) => {
    const clinicId = file.replace(/\.json$/, "");
    const safeId = clinicId.replace(/:/g, "_");
    const jsonPath = path.join(PHOTOS_DIR, file);
    let data;
    try { data = JSON.parse(await fs.readFile(jsonPath, "utf-8")); } catch { return; }
    if (!Array.isArray(data.photos) || data.photos.length === 0) return;

    const localPaths = [];
    for (let j = 0; j < Math.min(data.photos.length, 3); j++) {
      const photo = data.photos[j];
      if (!photo?.thumb) continue;
      const dest = path.join(OUT_DIR, `${safeId}_${j}.jpg`);
      const ok = await downloadOne(photo.thumb, dest);
      if (ok) localPaths.push({ idx: j, local: `/clinic-images/${safeId}_${j}.jpg` });
    }

    // Rewrite JSON to prefer local paths when available
    if (localPaths.length > 0) {
      const updated = { ...data, photos: data.photos.map((p, idx) => {
        const local = localPaths.find((l) => l.idx === idx);
        return local ? { ...p, thumb: local.local, large: local.local } : p;
      })};
      await fs.writeFile(jsonPath, JSON.stringify(updated, null, 2));
    }
  }));

  if ((i / CONCURRENCY) % 20 === 0) {
    console.log(`  ${i + batch.length}/${files.length} processed | dl:${downloaded} skip:${skipped} fail:${failed}`);
  }
}

console.log(`[download-photos] done. downloaded:${downloaded} skipped:${skipped} failed:${failed}`);
