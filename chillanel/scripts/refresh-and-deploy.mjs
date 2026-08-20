// Watches spa_output/*/clinics.csv mtimes for every city (not just bangkok —
// other cities' massage/spa scrapers are wired into watchdog.py but stay
// .disabled until their VPN slot opens up; whenever one is enabled and
// produces data, this picks it up automatically without a code change).
// On any city's change, rebuilds data for ALL cities (cheap — a handful of
// CSVs) so data/clinics.*.json and public/places-index.json stay in sync,
// then redeploys once. Mirrors web-thaigle/scripts/refresh_thaigle.py's
// polling approach.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { discoverCities } from "./discover-cities.mjs";

const ROOT = path.join(import.meta.dirname, "..", "..");
const SPA_OUTPUT_DIR = path.join(ROOT, "spa_output");
const INTERVAL_MS = 5 * 60 * 1000;
const VERCEL_SCOPE = "vamoss2";
// Deploying on every CSV change (old behavior) meant a deploy almost every
// single 5-min poll during active scraping, since review scrapers append to
// clinics.csv on every successful collection — 523 deploys in 13 days
// (2026-08-06 usage check), each rebuilding all ~7,952 static pages, blew
// through the Vercel plan's ISR-write/CPU/transfer budget. Now: wait for
// data to go quiet for QUIET_MS before deploying (so a scraping burst
// collapses into one deploy instead of one per poll), but never let real
// data sit undeployed longer than MAX_INTERVAL_MS even if scraping never
// pauses.
const QUIET_MS = 30 * 60 * 1000;
// Was 2h — during continuous scraping (QUIET_MS never reached) that forces up
// to 12 deploys/day, each re-touching every prerendered page (~7,400) plus
// invalidating every on-demand place page, which Googlebot then re-fills one
// ISR write at a time. 12/day projects to ~2.6M ISR writes/mo against the
// Hobby plan's 200K cap (see 2026-08-14 audit). 24h caps it at ~65K/mo while
// still deploying same-day for anything that actually goes quiet.
const MAX_INTERVAL_MS = 24 * 60 * 60 * 1000;

// watchdog launches this with env_extra={}, so it only inherits whatever env
// watchdog.py itself started with — no persistent `vercel login` session and
// no VERCEL_TOKEN guaranteed. Read the token straight from the repo's
// gitignored root .env instead of relying on ambient environment.
function loadVercelToken() {
  if (process.env.VERCEL_TOKEN) return process.env.VERCEL_TOKEN;
  const envPath = path.join(ROOT, ".env");
  if (!fs.existsSync(envPath)) return undefined;
  const match = fs.readFileSync(envPath, "utf-8").match(/^VERCEL_TOKEN=(.+)$/m);
  return match ? match[1].trim() : undefined;
}

function latestMtime(cities) {
  let latest = 0;
  for (const city of cities) {
    const p = path.join(SPA_OUTPUT_DIR, city, "clinics.csv");
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

function deploy(cities) {
  log(`변경 감지 — build-data 재실행 (${cities.join(", ")})`);
  for (const city of cities) {
    execFileSync(process.execPath, ["scripts/build-data.mjs", "--city", city], {
      cwd: import.meta.dirname + "/..",
      stdio: "inherit",
    });
  }
  log("vercel --prod 배포 시작");
  const token = loadVercelToken();
  const args = ["deploy", "--prod", "--yes", "--scope", VERCEL_SCOPE];
  if (token) args.push("--token", token);
  // Node refuses to spawn .cmd/.bat via execFile without shell:true since the
  // CVE-2024-27980 fix — on Windows `vercel` resolves to vercel.cmd, so this
  // threw ENOENT on every single deploy attempt (silently caught by the
  // caller's try/catch below, logged, and never retried — see lastSeen fix).
  execFileSync("vercel", args, {
    cwd: import.meta.dirname + "/..",
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  log("배포 완료");
}

let cities = discoverCities();
// lastSeenMtime: latest clinics.csv mtime observed (any city).
// lastChangeAt: wall-clock time lastSeenMtime last increased — resets the
//   quiet-period timer on every new write, so a continuously-active scraper
//   keeps pushing the deploy off until it actually pauses.
// lastDeployedMtime / lastDeployedAt: what we last actually shipped, and
//   when — lets us tell "new data waiting" apart from "already deployed"
//   and enforce the MAX_INTERVAL_MS backstop independent of quiet time.
// 2026-08-20: lastDeployedMtime 을 파일로 영속화한다.
// 예전엔 기동 시 `lastDeployedMtime = lastSeenMtime` 이었다. 즉 아직 배포되지
// 않은 데이터를 "이미 배포한 것"으로 간주하고 시작했다. 이 서비스는 watchdog
// 이 progress 정체로 자주 재시작시키는데(2026-08-20 하루 206회), 재시작마다
// 워터마크가 현재 시각으로 밀려서 pending 이 영원히 false 가 됐다 — 그 결과
// 6일간 배포 0회, 수집한 데이터의 절반이 미공개 상태로 남았다.
// 파일에 남겨두면 재시작해도 "무엇까지 실제로 내보냈는지"가 보존된다.
const WATERMARK = import.meta.dirname + "/../.last-deployed";
function readWatermark() {
  try {
    const v = Number(fs.readFileSync(WATERMARK, "utf8").trim());
    return Number.isFinite(v) ? v : 0;
  } catch {
    return 0;
  }
}
function writeWatermark(v) {
  try {
    fs.writeFileSync(WATERMARK, String(v));
  } catch (e) {
    log(`워터마크 저장 실패(무시): ${e.message}`);
  }
}

let lastSeenMtime = latestMtime(cities);
let lastChangeAt = Date.now();
// 0 이면(최초 실행) 현재를 기준으로 잡아 첫 기동에 불필요한 배포를 하지 않는다.
let lastDeployedMtime = readWatermark() || lastSeenMtime;
let lastDeployedAt = Date.now();
log(
  `감시 시작 — 도시 ${cities.length}개 (${cities.join(", ") || "없음"}), ` +
  `초기 mtime=${lastSeenMtime}, 배포워터마크=${lastDeployedMtime}` +
  (lastSeenMtime > lastDeployedMtime ? " (미배포 데이터 있음)" : ""),
);

while (true) {
  // Re-discover every poll so a city that just got enabled in watchdog.py
  // (its .disabled marker removed) and produced its first clinics.csv is
  // picked up without restarting this service.
  cities = discoverCities();
  const current = latestMtime(cities);
  const now = Date.now();
  if (current > lastSeenMtime) {
    lastSeenMtime = current;
    lastChangeAt = now;
  }

  const pending = lastSeenMtime > lastDeployedMtime;
  const quiet = now - lastChangeAt >= QUIET_MS;
  const overdue = pending && now - lastDeployedAt >= MAX_INTERVAL_MS;

  if (pending && (quiet || overdue)) {
    try {
      deploy(cities);
      // Only advance the watermark once deploy() actually returns — advancing
      // it unconditionally meant a single transient failure (network, Vercel
      // 5xx, the ENOENT above) permanently dropped that data revision, since
      // the next poll would see current === lastSeen and log "변경 없음" forever.
      lastDeployedMtime = lastSeenMtime;
      lastDeployedAt = now;
      // 재시작해도 "여기까지 실제로 배포했다" 가 남도록 디스크에 기록.
      writeWatermark(lastDeployedMtime);
    } catch (e) {
      log(`배포 실패, 다음 주기 재시도: ${e.message}`);
    }
  } else if (pending) {
    log(`변경 대기 중 (안정화까지 ${Math.ceil((QUIET_MS - (now - lastChangeAt)) / 60000)}분 또는 최대 ${Math.ceil((MAX_INTERVAL_MS - (now - lastDeployedAt)) / 60000)}분 내 강제 배포)`);
  } else {
    // Heartbeat so the watchdog's progress_pattern keeps matching during idle
    // polling — without this, 25min of no CSV change looks like a hang.
    log("변경 없음");
  }
  await new Promise((r) => setTimeout(r, INTERVAL_MS));
}
