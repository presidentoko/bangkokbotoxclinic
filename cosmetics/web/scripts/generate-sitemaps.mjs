/**
 * Generates static sitemap XML files into public/ at build time.
 * Run via postbuild: "node scripts/generate-sitemaps.mjs"
 * Static files are served directly by Vercel — no serverless function timeout risk.
 *
 * Sitemap diet (2026-06): TH-only, top 300 products by review count.
 * Sitemap 0: core pages (home, concerns, filters, quiz, brand hub, etc.)
 * Sitemap 1: top 300 products sorted by konvy_review_count desc
 */
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PUBLIC = join(ROOT, "public");
const BASE = "https://bangkokfillers.com";
const NOW = new Date().toISOString();

const db = JSON.parse(readFileSync(join(ROOT, "data/master_db.json"), "utf8"));

function slugify(s) {
  return (s || "").toLowerCase().trim()
    .replace(/[()]/g, "")
    .replace(/[^a-z0-9฀-๿]+/gi, "-")
    .replace(/^-+|-+$/g, "");
}
function productSlug(p) { return `${slugify(p.brand)}-${p.product_id}`; }

const CONCERNS = ["acne", "whitening", "antiaging", "pores", "oilcontrol", "sensitive"];
const CONCERN_FILTERS = {
  acne:       ["salicylic-acid", "benzoyl-peroxide", "niacinamide", "under-300", "under-500"],
  whitening:  ["vitamin-c", "niacinamide", "alpha-arbutin", "under-300", "under-500"],
  antiaging:  ["retinol", "vitamin-c", "peptides", "under-500", "under-1000"],
  pores:      ["niacinamide", "salicylic-acid", "under-300", "under-500"],
  oilcontrol: ["niacinamide", "salicylic-acid", "under-300", "under-500"],
  sensitive:  ["ceramide", "hyaluronic-acid", "centella", "under-300", "under-500"],
};
const LOCALES = ["th", "en", "ko", "ar"];
const SALE_EVENTS = ["7-7", "8-8", "9-9", "10-10", "11-11", "12-12"];

const products = Object.values(db.products);

// ── XML helpers ──────────────────────────────────────────────────────────────
function xmlHeader() {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;
}
function xmlFooter() { return `</urlset>\n`; }

function urlEntry(loc, priority, changefreq, alts = {}) {
  let s = `<url>\n<loc>${loc}</loc>\n`;
  s += `<lastmod>${NOW}</lastmod>\n`;
  s += `<changefreq>${changefreq}</changefreq>\n`;
  s += `<priority>${priority}</priority>\n`;
  for (const [lang, href] of Object.entries(alts)) {
    s += `<xhtml:link rel="alternate" hreflang="${lang}" href="${href}"/>\n`;
  }
  s += `</url>\n`;
  return s;
}

// Build hreflang alternates for a locale-agnostic path segment.
// `slug` is the part after /locale/ (e.g. "acne/under-300" or "" for home).
function alts(slug) {
  const out = {};
  for (const l of LOCALES) {
    out[l] = slug ? `${BASE}/${l}/${slug}` : `${BASE}/${l}`;
  }
  out["x-default"] = out["th"];
  return out;
}

// ── Sitemap 0: core pages (TH only, hreflang for all locales) ────────────────
function genCore() {
  let xml = xmlHeader();

  // Home
  xml += urlEntry(`${BASE}/th`, 1.0, "daily", alts(""));

  // Concern pages + filter slugs
  for (const c of CONCERNS) {
    xml += urlEntry(`${BASE}/th/${c}`, 0.9, "daily", alts(c));
    for (const f of CONCERN_FILTERS[c] ?? []) {
      xml += urlEntry(`${BASE}/th/${c}/${f}`, 0.8, "weekly", alts(`${c}/${f}`));
    }
  }

  xml += urlEntry(`${BASE}/th/quiz`,        0.8, "monthly", alts("quiz"));
  xml += urlEntry(`${BASE}/th/brand`,       0.8, "weekly",  alts("brand"));
  xml += urlEntry(`${BASE}/th/methodology`, 0.6, "monthly", alts("methodology"));
  xml += urlEntry(`${BASE}/th/media-kit`,   0.5, "monthly", alts("media-kit"));

  for (const ev of SALE_EVENTS) {
    xml += urlEntry(`${BASE}/th/sale/${ev}`, 0.8, "daily", alts(`sale/${ev}`));
  }

  for (const r of ["under-300", "under-500", "under-1000"]) {
    xml += urlEntry(`${BASE}/th/budget/${r}`, 0.7, "weekly", alts(`budget/${r}`));
  }

  xml += xmlFooter();
  return xml;
}

// ── Sitemap 1: top 300 products by konvy_review_count (TH only) ──────────────
function genTopProducts() {
  const top300 = products
    .filter(p => (p.konvy_review_count ?? 0) > 0)
    .sort((a, b) => (b.konvy_review_count ?? 0) - (a.konvy_review_count ?? 0))
    .slice(0, 300);

  let xml = xmlHeader();
  for (const p of top300) {
    const slug = productSlug(p);
    xml += urlEntry(`${BASE}/th/product/${slug}`, 0.8, "weekly", alts(`product/${slug}`));
  }
  xml += xmlFooter();
  return xml;
}

// ── Write files ───────────────────────────────────────────────────────────────
mkdirSync(PUBLIC, { recursive: true });

const files = [
  ["sitemap-0.xml", genCore()],
  ["sitemap-1.xml", genTopProducts()],
];

for (const [name, xml] of files) {
  const path = join(PUBLIC, name);
  writeFileSync(path, xml, "utf8");
  const kb = Math.round(xml.length / 1024);
  const urls = (xml.match(/<url>/g) || []).length;
  console.log(`✓ ${name}  ${urls} URLs  ${kb} KB`);
}

console.log("Sitemaps generated.");
