// Watches spa_output/**/clinics.csv mtimes; on change, rebuilds data + redeploys.
// Mirrors web-thaigle/scripts/refresh_thaigle.py's polling approach.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(import.meta.dirname, "..", "..");
const WATCH_FILES = ["spa_output/bangkok/clinics.csv"];
const INTERVAL_MS = 5 * 60 * 1000;

function latestMtime() {
  let latest = 0;
  for (const rel of WATCH_FILES) {
    const p = path.join(ROOT, rel);
    if (fs.existsSync(p)) latest = Math.max(latest, fs.statSync(p).mtimeMs);
  }
  return latest;
}

function log(msg) {
  console.log(`[${new Date().toISOString()}] ${msg}`);
}

function deploy() {
  log("변경 감지 — build-data 재실행");
  execFileSync(process.execPath, ["scripts/build-data.mjs"], { cwd: import.meta.dirname + "/..", stdio: "inherit" });
  log("vercel --prod 배포 시작");
  execFileSync("vercel", ["--prod", "--yes"], { cwd: import.meta.dirname + "/..", stdio: "inherit" });
  log("배포 완료");
}

let lastSeen = latestMtime();
log(`감시 시작 — 초기 mtime=${lastSeen}`);

while (true) {
  const current = latestMtime();
  if (current > lastSeen) {
    lastSeen = current;
    try {
      deploy();
    } catch (e) {
      log(`배포 실패: ${e.message}`);
    }
  }
  await new Promise((r) => setTimeout(r, INTERVAL_MS));
}
