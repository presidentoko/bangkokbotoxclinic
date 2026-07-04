import { NextResponse } from "next/server";
import { loadMasterDb } from "@/lib/data";
import { getSiteConfig, applySiteFilter } from "@/lib/site";

export const dynamic = "force-dynamic";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bangkokbotoxclinic.com";
const PRIORITY_COUNT = 200;

// Remaining clinics after top-200 priority list in /sitemap.xml
export async function GET() {
  const db = await loadMasterDb();
  const cfg = getSiteConfig();
  const updated = db.generated_at;

  const clinics = applySiteFilter(db.clinics, cfg).filter((c) => c.trust_score >= 40);
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
