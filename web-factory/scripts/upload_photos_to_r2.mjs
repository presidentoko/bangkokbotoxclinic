/**
 * Upload public/photos/ → CF R2 via S3-compatible API
 *
 * 준비:
 *   CF Dashboard → R2 → Manage R2 API Tokens → Create API token
 *   → Object Read & Write, tsh-photos 버킷
 *   → Access Key ID, Secret Access Key 복사
 *
 * 실행:
 *   R2_ACCESS_KEY_ID=xxx R2_SECRET_ACCESS_KEY=yyy node scripts/upload_photos_to_r2.mjs
 *   (Windows PowerShell: $env:R2_ACCESS_KEY_ID="xxx"; $env:R2_SECRET_ACCESS_KEY="yyy"; node ...)
 */

import { S3Client, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { readdirSync, statSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PHOTOS_DIR = path.resolve(__dirname, "../public/photos");
const BUCKET = "tsh-photos";
const ACCOUNT_ID = "7380e2d02d0ec7e69aff829cc6fb6195";
const CONCURRENCY = 20;

const keyId = process.env.R2_ACCESS_KEY_ID;
const secret = process.env.R2_SECRET_ACCESS_KEY;

if (!keyId || !secret) {
  console.error("❌ 환경변수 설정 필요:");
  console.error("   $env:R2_ACCESS_KEY_ID='xxxx'");
  console.error("   $env:R2_SECRET_ACCESS_KEY='xxxx'");
  console.error("   node scripts/upload_photos_to_r2.mjs");
  process.exit(1);
}

const client = new S3Client({
  region: "auto",
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: keyId, secretAccessKey: secret },
});

function walk(dir) {
  const entries = [];
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) entries.push(...walk(full));
    else if (/\.(jpg|jpeg|png|webp)$/i.test(name)) entries.push(full);
  }
  return entries;
}

async function uploadOne(file) {
  const rel = file.replace(PHOTOS_DIR, "").replace(/\\/g, "/");
  const key = `photos${rel}`;
  const body = readFileSync(file);
  await client.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: body,
    ContentType: "image/jpeg",
    CacheControl: "public, max-age=31536000, immutable",
  }));
  return key;
}

async function pool(items, fn, concurrency) {
  let i = 0;
  let done = 0;
  let errors = 0;
  const total = items.length;

  async function worker() {
    while (i < items.length) {
      const idx = i++;
      try {
        await fn(items[idx]);
        done++;
      } catch (e) {
        errors++;
        console.error(`\n  ✗ ${items[idx]}: ${e.message}`);
      }
      if ((done + errors) % 100 === 0 || (done + errors) === total) {
        process.stdout.write(`\r  ${done + errors}/${total} (✓${done} ✗${errors})   `);
      }
    }
  }

  await Promise.all(Array.from({ length: concurrency }, worker));
  return { done, errors };
}

const files = walk(PHOTOS_DIR);
console.log(`\n📤 Uploading ${files.length} photos → R2 "${BUCKET}" (${CONCURRENCY} parallel)\n`);

const start = Date.now();
const { done, errors } = await pool(files, uploadOne, CONCURRENCY);
const secs = ((Date.now() - start) / 1000).toFixed(1);

console.log(`\n\n${errors === 0 ? "✅" : "⚠️"} Done — ${done}/${files.length} uploaded in ${secs}s (${errors} errors)\n`);

if (errors === 0) {
  console.log("다음 단계:");
  console.log("  1. CF Dashboard → R2 → tsh-photos → Settings → Public access 활성화");
  console.log("     (r2.dev 서브도메인 활성화 클릭)");
  console.log("  2. 표시된 Public URL 복사 (예: https://pub-xxxx.r2.dev)");
  console.log("  3. CF Pages 환경변수 추가:");
  console.log("     NEXT_PUBLIC_PHOTOS_BASE = https://pub-xxxx.r2.dev");
  console.log("  4. git push 로 재배포");
}
