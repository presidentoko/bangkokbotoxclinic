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
  // watchdog.py's parse_log_timestamp only recognizes "YYYY-MM-DD HH:MM:SS"
  // (local time) or bare "HH:MM:SS" — ISO-8601 with T/Z doesn't match either
  // pattern, so every line here was unparseable and progress_stale() fell
  // through to "always stale" after the grace period, crash-looping this
  // service every ~2.5min despite it running fine.
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const ts = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  console.log(`[${ts}] ${msg}`);
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
  } else {
    // Heartbeat so the watchdog's progress_pattern keeps matching during idle
    // polling — without this, 25min of no CSV change looks like a hang.
    log("변경 없음");
  }
  await new Promise((r) => setTimeout(r, INTERVAL_MS));
}
