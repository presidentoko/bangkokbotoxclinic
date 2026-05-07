import { loadMasterDb } from "@/lib/data";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thailandgolfguide.com";
const BRAND = process.env.NEXT_PUBLIC_BRAND || "Thailand Golf Guide";

export const dynamic = "force-static";

function escape(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

export async function GET() {
  const db = await loadMasterDb();
  const top = [...db.restaurants].sort((a, b) => b.trust_score - a.trust_score).slice(0, 50);
  const updated = new Date(db.generated_at).toUTCString();

  const items = top.map((r) => `
    <item>
      <title>${escape(r.name)} — Trust ${r.trust_score} · ★${r.rating} (${r.total_reviews} reviews)</title>
      <link>${SITE}/course/${r.id}</link>
      <guid isPermaLink="true">${SITE}/course/${r.id}</guid>
      <description>${escape(`${r.primary_type}${r.district ? ` in ${r.district}` : ""}, ${r.city_label}. ${r.categories.join(", ")}.`)}</description>
      <pubDate>${updated}</pubDate>
      <category>${escape(r.district || r.city_label)}</category>
    </item>
  `).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${BRAND} — Top by Trust Score</title>
    <link>${SITE}</link>
    <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Top Thailand golf courses ranked by Trust Score from real Google review analysis. Refreshed continuously.</description>
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
