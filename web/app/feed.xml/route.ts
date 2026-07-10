// RSS feed — top trust score 클리닉 + 최근 변화. AEO/syndication 보너스.

import { loadMasterDb } from "@/lib/data";
import { applySiteFilter, getSiteConfig, getSiteUrl } from "@/lib/site";

const SITE = getSiteUrl();

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const db = await loadMasterDb();
  const cfg = getSiteConfig();
  const top = [...applySiteFilter(db.clinics, cfg)]
    .sort((a, b) => b.trust_score - a.trust_score)
    .slice(0, 50);

  const updated = new Date(db.generated_at).toUTCString();

  const items = top.map((c) => `
    <item>
      <title>${escape(c.name)} — Trust ${c.trust_score} · ★${c.rating} (${c.total_reviews} reviews)</title>
      <link>${SITE}/clinic/${c.id}</link>
      <guid isPermaLink="true">${SITE}/clinic/${c.id}</guid>
      <description>${escape(`${c.primary_type}${c.district ? ` in ${c.district}` : ""}. ${c.categories.join(", ")}.`)}</description>
      <pubDate>${updated}</pubDate>
      <category>${escape(c.district || "Bangkok")}</category>
    </item>
  `).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Bangkok Clinics — Top by Trust Score</title>
    <link>${SITE}</link>
    <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Top Bangkok aesthetic and medical clinics ranked by Trust Score from real Google review analysis. Refreshed every 30 minutes.</description>
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
