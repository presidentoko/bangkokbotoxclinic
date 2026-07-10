import { NextResponse } from "next/server";
import { loadMasterDb } from "@/lib/data";
import { getSiteConfig, applySiteFilter, getSiteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

const SITE = getSiteUrl();
const PRIORITY_COUNT = 200;

// Top-200 priority clinics — submitted first to GSC for fast crawl-budget seeding.
// /sitemap-clinics.xml handles the remaining clinics.
export async function GET() {
  const db = await loadMasterDb();
  const cfg = getSiteConfig();
  const updated = db.generated_at;

  // trust_score 게이트 제거 — 롱테일 클리닉이 사이트맵 자체에서 빠져 색인이
  // 안 되는 문제였음 (2026-07-10 감사). 우선순위는 slice(0,200)/<priority> 값으로
  // 이미 티어링되므로 게이트는 그냥 손실이었음.
  const clinics = applySiteFilter(db.clinics, cfg);
  clinics.sort(
    (a, b) => b.trust_score - a.trust_score || b.scraped_review_count - a.scraped_review_count,
  );
  const priority = clinics.slice(0, PRIORITY_COUNT);

  const urls = priority
    .map((c) => {
      return `  <url><loc>${SITE}/clinic/${c.id}</loc><lastmod>${updated.slice(0, 10)}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
