// scripts/download-photos.mjs
// Google CDN 사진 → public/clinic-images/ 로 다운로드.
// 실행: node scripts/download-photos.mjs
// 이미 다운로드된 파일은 건너뜀 (멱등성).

import { promises as fs } from "node:fs";
import path from "node:path";
import { createWriteStream } from "node:fs";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { spawn } from "node:child_process";

const PHOTOS_DIR = path.join(process.cwd(), "data", "photos");
const OUT_DIR = path.join(process.cwd(), "public", "clinic-images");
const CONCURRENCY = 8;
const TIMEOUT_MS = 10_000;
const R2_BUCKET = "bangkok-clinic-images";

// Locally-downloaded photos are served from Cloudflare R2 (see
// scripts/upload-images-to-r2.mjs, 2026-07-27), not from Vercel's own edge
// -- so any newly-downloaded file also has to land in the bucket, or its
// rewritten CDN URL (see lib/photos.ts) 404s until someone notices.
// See scripts/upload-images-to-r2.mjs for why every arg needs manual
// quoting here (Windows shell:true does not quote array entries itself).
function q(arg) {
  return `"${String(arg).replace(/"/g, '\\"')}"`;
}

// 2026-07-28 감사: 이전엔 uploadToR2의 성공/실패를 버리고 JSON을 무조건
// 로컬 경로로 덮어썼음 — wrangler가 일시적으로 실패(인증 만료, 네트워크,
// 레이트리밋)하면 존재하지 않는 R2 키를 가리키는 영구 404가 데이터에 박히고,
// 로컬 파일이 이미 있으니 다음 실행도 재시도 안 함. stderr도 버려서 원인도
// 안 남았음. 이제: 실패 시 stderr 로그 + false 반환, JSON은 업로드 성공한
// 것만 갱신, 실패는 exit code로 드러남.
function uploadToR2(localPath, filename) {
  return new Promise((resolve) => {
    const cmd = [
      "npx", "wrangler", "r2", "object", "put", q(`${R2_BUCKET}/clinic-images/${filename}`),
      "--file", q(localPath),
      "--content-type", q("image/jpeg"),
      "--cache-control", q("public, max-age=31536000, immutable"),
      "--remote",
    ].join(" ");
    const proc = spawn(cmd, { shell: true, stdio: ["ignore", "pipe", "pipe"] });
    let stderr = "";
    proc.stderr.on("data", (d) => (stderr += d));
    proc.on("close", (code) => {
      if (code !== 0) console.error(`[R2 FAIL] ${filename}: ${stderr.trim().slice(0, 200)}`);
      resolve(code === 0);
    });
    proc.on("error", (err) => {
      console.error(`[R2 FAIL] ${filename}: ${err.message}`);
      resolve(false);
    });
  });
}

await fs.mkdir(OUT_DIR, { recursive: true });

const files = (await fs.readdir(PHOTOS_DIR)).filter((f) => f.endsWith(".json"));
console.log(`[download-photos] ${files.length} clinic photo files found`);

let downloaded = 0, skipped = 0, failed = 0, uploadFailed = 0;

// Returns true if the file exists on disk after this call (whether it was
// already there or just got downloaded), false on a download failure.
async function ensureLocal(url, dest) {
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
      const filename = `${safeId}_${j}.jpg`;
      const localUrl = `/clinic-images/${filename}`;
      // 이미 지난 실행에서 업로드까지 성공해 JSON이 로컬 경로를 가리키면
      // 완전히 끝난 것 — 재시도 불필요.
      if (photo.thumb === localUrl) continue;
      const dest = path.join(OUT_DIR, filename);
      const onDisk = await ensureLocal(photo.thumb, dest);
      if (!onDisk) continue;
      // 파일은 있는데 JSON이 아직 원격 URL을 가리킨다 = 지난 실행에서
      // 업로드가 실패했다는 뜻 — 다시 시도한다 (skip으로 영구 방치 안 함).
      const uploaded = await uploadToR2(dest, filename);
      if (uploaded) {
        localPaths.push({ idx: j, local: localUrl });
      } else {
        uploadFailed++;
      }
    }

    // Rewrite JSON to prefer local paths — 업로드 성공한 것만.
    if (localPaths.length > 0) {
      const updated = { ...data, photos: data.photos.map((p, idx) => {
        const local = localPaths.find((l) => l.idx === idx);
        return local ? { ...p, thumb: local.local, large: local.local } : p;
      })};
      await fs.writeFile(jsonPath, JSON.stringify(updated, null, 2));
    }
  }));

  if ((i / CONCURRENCY) % 20 === 0) {
    console.log(`  ${i + batch.length}/${files.length} processed | dl:${downloaded} skip:${skipped} fail:${failed} uploadFail:${uploadFailed}`);
  }
}

console.log(`[download-photos] done. downloaded:${downloaded} skipped:${skipped} downloadFail:${failed} uploadFail:${uploadFailed}`);
if (uploadFailed > 0) process.exitCode = 1;
