// scripts/build-data.mjs
// Reads C:\dbd-scraper\hair\thaihairguide_master.csv → public/data/clinics.json
// Runs at pre-build time. All filtering / sort happens client-side at runtime.
import fs from "node:fs";
import path from "node:path";

const LOCAL_CSV = path.join(process.cwd(), "data", "master.csv");
// New location: the dbd-scraper folder is now bundled in the deliverable tree.
const DELIVERABLE_CSV = path.join(process.cwd(), "..", "dbd-scraper", "hair", "thaihairguide_master.csv");
const SOURCE_CSV =
  process.env.HAIR_MASTER_CSV ||
  (fs.existsSync(LOCAL_CSV) ? LOCAL_CSV
    : fs.existsSync(DELIVERABLE_CSV) ? DELIVERABLE_CSV
    : "C:\\dbd-scraper\\hair\\thaihairguide_master.csv");
const OUT_DIR = path.join(process.cwd(), "public", "data");
const OUT_FILE = path.join(OUT_DIR, "clinics.json");

if (!fs.existsSync(SOURCE_CSV)) {
  console.warn(`[build-data] master CSV not found: ${SOURCE_CSV}`);
  if (fs.existsSync(OUT_FILE)) {
    console.warn(`[build-data] keeping existing ${OUT_FILE} (no regen).`);
    process.exit(0);
  }
  console.error("[build-data] no existing clinics.json either — writing empty stub.");
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify({ generated_at: new Date().toISOString(), clinics: [] }, null, 2));
  process.exit(0);
}

// Opt-out blocklist — clinics that requested removal
const OPT_OUT_FILE = path.join(process.cwd(), "..", "data", "opt_out.json");
const optOutSet = new Set();
if (fs.existsSync(OPT_OUT_FILE)) {
  try {
    const { blocked } = JSON.parse(fs.readFileSync(OPT_OUT_FILE, "utf-8"));
    for (const { id, slug } of blocked) {
      if (id) optOutSet.add(id.toLowerCase());
      if (slug) optOutSet.add(slug.toLowerCase());
    }
    console.log(`[build-data] opt-out list: ${optOutSet.size} entries`);
  } catch (err) {
    console.warn(`[build-data] failed to parse ${OPT_OUT_FILE}, ignoring opt-out list:`, err.message);
  }
}

const { parse } = await import("csv-parse/sync");
const raw = fs.readFileSync(SOURCE_CSV, "utf-8").replace(/^﻿/, "");
const rows = parse(raw, { columns: true, skip_empty_lines: true });
console.log(`[build-data] loaded ${rows.length} rows`);

function safeJson(v, fallback) {
  if (typeof v !== "string" || !v.trim().startsWith("[")) return fallback;
  try { return JSON.parse(v); } catch { return fallback; }
}

function num(v, fallback = 0) {
  const n = parseFloat(String(v ?? "").replace(/,/g, ""));
  return Number.isFinite(n) ? n : fallback;
}

function slugify(s) {
  // ASCII-only — 태국어/한글을 slug에 보존하면 URL에서 percent-encoded로 깨져 보이고
  // 공유/백링크에 불리함. place_id suffix(6자)가 이미 유일성을 보장하므로
  // 비ASCII 문자는 그냥 제거해도 충돌 위험 없음.
  return String(s || "")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

// Trust Score (0-100). Different formula from raw hair_score — weighted for
// "real users vs viral marketing". Heavily favors review SOURCE DIVERSITY.
function trustScore(c) {
  const g = num(c.reviews_scraped_count);
  const photos = num(c.photos_count);
  const videos = num(c.videos_count);
  const r = num(c.rating);
  const rc = num(c.review_count);
  const hasWebsite = !!(c.website_main_content && String(c.website_main_content).length > 200);
  const hasBookimed = !!c.bookimed_slug;

  // Source diversity bonus (≤25 pts)
  const sources = [
    g > 0,
    photos > 0,
    videos > 0,
    hasWebsite,
    hasBookimed,
  ].filter(Boolean).length;
  const diversity = (sources / 5) * 25;

  // Volume + quality (≤45 pts)
  const ratingScore = r > 0 ? Math.min(r / 5, 1) * 15 : 0;
  const reviewVolume = Math.min(Math.log10(rc + 1) / Math.log10(500), 1) * 15;
  const photoVolume = Math.min(photos / 8, 1) * 10;
  const videoVolume = Math.min(videos / 5, 1) * 5;

  // Procedure breadth (≤10 pts)
  const procCount = String(c.procedures || "").split(",").filter(Boolean).length;
  const procScore = Math.min(procCount / 4, 1) * 10;

  // Hair-relevance (≤20 pts)
  const relevance = c.is_hair_relevant === "True" ? 20 : 0;

  return Math.round(diversity + ratingScore + reviewVolume + photoVolume + videoVolume + procScore + relevance);
}

// "Suspected viral / ad" heuristic: rating high + reviews low + no diversity + no website
// (i.e., looks like astroturfed listings.)
function isSuspectedViral(c) {
  const r = num(c.rating);
  const rc = num(c.review_count);
  const sources = [
    num(c.reviews_scraped_count) > 0,
    num(c.photos_count) > 0,
    num(c.videos_count) > 0,
    !!c.website_main_content,
    !!c.bookimed_slug,
  ].filter(Boolean).length;
  // Red flags: perfect rating but low volume + only 1 source signal
  const suspectedAdRating = r >= 4.9 && rc < 8;
  const lowDiversity = sources <= 1;
  return suspectedAdRating && lowDiversity;
}

// Garbage name patterns — upstream is_hair_relevant tagging includes false-positives
// like detox resorts, rehab centers, women-only clinics, cell-therapy centers, raw "Procedure:" entries.
const BAD_NAME_PATTERNS = [
  /^procedure:/i,
  /^visit\s/i,
  /detox resort/i,
  /rehabilitation/i,
  /cell therapy/i,
  /center for women/i,
  /women['']s? (only|clinic|center)/i,
  /natural resort/i,
  /yoga retreat/i,
  /wellness resort/i,
  /methylation/i,
];

function isBadName(name) {
  const n = String(name || "").trim();
  if (!n || n.length < 3) return true;
  return BAD_NAME_PATTERNS.some((re) => re.test(n));
}

// For Bookimed-only entries (no Google place_id), require hair keywords in name or procedures.
// Bookimed category alone is unreliable — wellness clinics get miscategorized as "Hair Transplant".
const HAIR_KEYWORDS = /hair|transplant|ผม|โกร|hair loss|fue|fut|prp|hairline|scalp|ศีรษะล้าน|ปลูกผม/i;
function isHairRelevantStrict(r) {
  if (!r.place_id.startsWith("bm_")) return true; // Google Maps data — trust existing flag
  const text = `${r.name} ${r.procedures || ""}`;
  return HAIR_KEYWORDS.test(text);
}

function normalizeCity(city, address) {
  const c = String(city || "").trim();
  if (c && c.toLowerCase() !== "nan" && c.toLowerCase() !== "null") return c;
  const a = String(address || "");
  const map = [
    ["Bangkok", /Bangkok|กรุงเทพ|กทม/i],
    ["Chiang Mai", /Chiang Mai|เชียงใหม่/i],
    ["Phuket", /Phuket|ภูเก็ต/i],
    ["Pattaya", /Pattaya|พัทยา/i],
    ["Khon Kaen", /Khon Kaen|ขอนแก่น/i],
    ["Udon Thani", /Udon Thani|อุดร/i],
    ["Hua Hin", /Hua Hin|หัวหิน/i],
    ["Koh Samui", /Koh Samui|Samui|เกาะสมุย|สมุย/i],
  ];
  for (const [label, re] of map) if (re.test(a)) return label;
  return "Bangkok"; // default — most data is BKK
}

const clinics = rows
  .filter((r) => r.name && r.place_id)
  .filter((r) => !isBadName(r.name))
  .filter((r) => !optOutSet.has(String(r.place_id || "").toLowerCase()) &&
                 !optOutSet.has(String(r.bookimed_slug || "").toLowerCase()))
  .map((r, i) => {
    const reviews = safeJson(r.reviews_json, []);
    const photos = safeJson(r.photo_urls_json, []);
    const videos = safeJson(r.videos_json, []);
    return {
      // Identity
      id: r.place_id,
      slug: slugify(`${r.name}-${r.place_id.slice(-6)}`),
      name: r.name,
      // Geo
      address: (r.address || "").trim(),
      city: normalizeCity(r.city, r.address),
      // Google
      rating: num(r.rating) || null,
      review_count: num(r.review_count) || null,
      phone: r.phone || "",
      website: r.website || "",
      category: r.category || "",
      google_maps_url: r.google_maps_url || "",
      // Bookimed (affiliate)
      bookimed_slug: r.bookimed_slug || "",
      bookimed_url: r.bookimed_url || "",
      bookimed_price_from: r.bookimed_price_from || "",
      // Reviews (truncated for JSON weight)
      reviews_scraped_count: num(r.reviews_scraped_count) || 0,
      avg_scraped_rating: num(r.avg_scraped_rating) || null,
      top_review_text: (r.top_review_text || "").slice(0, 600),
      top_review_source: r.top_review_source || "",
      reviews_sample: reviews.slice(0, 6).map((rv) => ({
        source: rv.source || "google",
        reviewer: (rv.reviewer || "").slice(0, 60),
        rating: num(rv.rating, null),
        date: (rv.date || "").slice(0, 20),
        text: (rv.text || "").slice(0, 400),
      })),
      // Photos
      photos_count: photos.length,
      top_photo_url: r.top_photo_url || photos[0] || "",
      photos_sample: photos.slice(0, 8),
      // Videos
      videos_count: videos.length,
      top_video_id: r.top_video_id || (videos[0] && videos[0].video_id) || "",
      top_video_title: r.top_video_title || "",
      videos_sample: videos.slice(0, 3).map((v) => ({
        video_id: v.video_id,
        title: (v.title || "").slice(0, 200),
        channel: v.channel || "",
      })),
      // Website
      website_email: r.website_email || "",
      website_facebook: r.website_facebook || "",
      website_instagram: r.website_instagram || "",
      website_line_id: r.website_line_id || "",
      // Signals
      procedures: String(r.procedures || "").split(",").filter(Boolean),
      languages: {
        ko: r.is_korean_friendly === "True",
        en: r.is_english_friendly === "True",
        zh: r.is_chinese_friendly === "True",
        ar: r.is_arabic_friendly === "True",
      },
      is_hair_relevant: r.is_hair_relevant === "True",
      _hair_strict: isHairRelevantStrict(r),
      // Source counts (badge data)
      source_badges: {
        google_reviews: num(r.reviews_scraped_count) || 0,
        photos: num(r.photos_count) || 0,
        videos: num(r.videos_count) || 0,
        bookimed: r.bookimed_slug ? 1 : 0,
        website: r.website_main_content ? 1 : 0,
      },
      // Computed
      trust_score: trustScore(r),
      is_suspected_viral: isSuspectedViral(r),
      // Partnership slot (mock — flip to true for paying customers)
      is_partner: false,
    };
  })
  .filter((c) => c.is_hair_relevant && c._hair_strict)
  .map(({ _hair_strict, ...c }) => c)
  .sort((a, b) => b.trust_score - a.trust_score);

// Mark top 3 as partners for demo (B2B monetization slot)
clinics.slice(0, 3).forEach((c) => (c.is_partner = true));

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(
  OUT_FILE,
  JSON.stringify(
    {
      generated_at: new Date().toISOString(),
      total: clinics.length,
      avg_trust: clinics.length > 0 ? Math.round(clinics.reduce((s, c) => s + c.trust_score, 0) / clinics.length) : 0,
      clinics,
    },
    null,
    0
  ),
  "utf-8"
);
console.log(`[build-data] wrote ${clinics.length} clinics → ${OUT_FILE}`);
console.log(`[build-data] suspected viral: ${clinics.filter((c) => c.is_suspected_viral).length}`);
console.log(`[build-data] partners: ${clinics.filter((c) => c.is_partner).length}`);

// slug_history.json 유지 — append-only. 2026-07-31 이전엔 이 파일을 읽는 코드가
// 어디에도 없었고(완전한 dead code), 애초에 이걸 쓰는 스크립트도 없어서 145개
// 항목이 전부 "지금 이 순간의 스냅샷"이었음 — 데이터 갱신마다 클리닉이
// 빠지거나 이름이 바뀌면 그 URL을 기록할 데가 없어 조용히 고아가 됐고,
// 구글은 여전히 그 옛 URL로 사람을 보내(예: "warodom clinic reviews" 159
// 노출) 항상 404였음. 이제 매 빌드마다: ① 현재 살아있는 클리닉은 슬러그를
// 계속 누적(절대 지우지 않음) ② 더 이상 안 보이는 클리닉은 active:false로
// 표시만(항목 자체는 유지) — next.config.mjs의 redirects()가 이 파일을 읽어
// 옛 슬러그 → 새 슬러그(살아있으면) 또는 도시 페이지(문 닫았으면)로 301.
const SLUG_HISTORY_FILE = path.join(process.cwd(), "data", "slug_history.json");
let slugHistory = {};
if (fs.existsSync(SLUG_HISTORY_FILE)) {
  try {
    slugHistory = JSON.parse(fs.readFileSync(SLUG_HISTORY_FILE, "utf-8"));
  } catch (err) {
    console.warn(`[build-data] failed to parse ${SLUG_HISTORY_FILE}, starting fresh:`, err.message);
  }
}
const liveIds = new Set();
for (const c of clinics) {
  liveIds.add(c.id);
  const entry = slugHistory[c.id];
  if (!entry) {
    slugHistory[c.id] = { slugs: [c.slug], city: c.city, active: true };
  } else {
    entry.active = true;
    entry.city = c.city;
    if (!entry.slugs.includes(c.slug)) entry.slugs.push(c.slug);
  }
}
for (const [id, entry] of Object.entries(slugHistory)) {
  if (!liveIds.has(id)) entry.active = false;
}
fs.mkdirSync(path.dirname(SLUG_HISTORY_FILE), { recursive: true });
fs.writeFileSync(SLUG_HISTORY_FILE, JSON.stringify(slugHistory), "utf-8");
const newlyGone = Object.values(slugHistory).filter((e) => !e.active).length;
console.log(`[build-data] slug_history: ${Object.keys(slugHistory).length} tracked, ${newlyGone} inactive`);
