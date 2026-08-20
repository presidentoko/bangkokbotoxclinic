import { NextResponse } from "next/server";
import { loadMasterDb } from "@/lib/data";
import { getSiteConfig, applySiteFilter, getSiteUrl } from "@/lib/site";

// force-dynamic 이던 것을 일 1회 ISR 로 — 요청마다 18MB master_db 를 파싱해
// Fluid CPU 를 태우고 있었음 (Hobby 4h 한도 초과의 한 축, 2026-07-11 감사).
// 데이터는 어차피 push 시 재빌드로 갱신됨.
export const dynamic = "force-static";
export const revalidate = 86400;

const SITE = getSiteUrl();
const PRIORITY_COUNT = 200;

// Remaining clinics after top-200 priority list in /sitemap.xml
export async function GET() {
  const db = await loadMasterDb();
  const cfg = getSiteConfig();
  const updated = db.generated_at;

  // trust_score 게이트 제거 — sitemap-priority.xml 과 동일 이유
  const clinics = applySiteFilter(db.clinics, cfg);
  clinics.sort(
    (a, b) => b.trust_score - a.trust_score || b.scraped_review_count - a.scraped_review_count,
  );
  const remaining = clinics.slice(PRIORITY_COUNT);

  const urls = remaining
    .map((c) => {
      const prio = c.trust_score >= 70 ? "0.8" : c.trust_score >= 50 ? "0.6" : "0.45";
      return `  <url><loc>${SITE}/clinic/${c.id}</loc><lastmod>${updated.slice(0, 10)}</lastmod><changefreq>weekly</changefreq><priority>${prio}</priority></url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
