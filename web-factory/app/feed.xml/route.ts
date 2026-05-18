import { loadMasterDb } from "@/lib/data";
import { GUIDES } from "@/lib/guides";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thaisupplyhub.com";
const BRAND = process.env.NEXT_PUBLIC_BRAND || "Thai Supply Hub";

export const dynamic = "force-static";

function escape(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

export async function GET() {
  const db = await loadMasterDb();
  const top = [...db.suppliers].sort((a, b) => b.trust_score - a.trust_score).slice(0, 50);
  const updated = new Date(db.generated_at).toUTCString();

  // 가이드를 먼저 (콘텐츠 톱), 그 다음 supplier top 50.
  const guideItems = GUIDES.map((g) => `
    <item>
      <title>${escape(g.title)}</title>
      <link>${SITE}/guide/${g.slug}</link>
      <guid isPermaLink="true">${SITE}/guide/${g.slug}</guid>
      <description>${escape(g.metaDescription)}</description>
      <pubDate>${new Date(g.updated).toUTCString()}</pubDate>
      <category>Buyer Guide</category>
    </item>
  `).join("");

  const supplierItems = top.map((r) => `
    <item>
      <title>${escape(r.name)} — Trust ${r.trust_score} · ★${r.rating} (${r.total_reviews} reviews)</title>
      <link>${SITE}/supplier/${r.id}</link>
      <guid isPermaLink="true">${SITE}/supplier/${r.id}</guid>
      <description>${escape(`${r.primary_type}${r.district ? ` in ${r.district}` : ""}, ${r.city_label}. ${r.categories.join(", ")}.`)}</description>
      <pubDate>${updated}</pubDate>
      <category>${escape(r.district || r.city_label)}</category>
    </item>
  `).join("");

  const items = guideItems + supplierItems;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${BRAND} — Top by Trust Score</title>
    <link>${SITE}</link>
    <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Top Thai manufacturers, industrial estates, warehouses, and logistics operators ranked by Trust Score from real Google review analysis. Refreshed continuously.</description>
    <language>en-US</language>
    <lastBuildDate>${updated}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=1800, s-maxage=1800",
    },
  });
}
