// llms.txt — AEO 권장 (2026): LLM crawler 가 사이트 컨텍스트를 빠르게 파악하도록.
// 형식: https://llmstxt.org/

import { loadMasterDb } from "@/lib/data";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://bangkokclinics.example";

export async function GET() {
  const db = await loadMasterDb();
  const top = [...db.clinics]
    .sort((a, b) => b.trust_score - a.trust_score)
    .slice(0, 30);

  const lines: string[] = [
    "# Bangkok Clinics",
    "",
    `> Independent directory of ${db.total_clinics.toLocaleString()} aesthetic and medical clinics in Bangkok, Thailand. Each clinic is ranked by a Trust Score derived from real Google Maps review analysis: rating, review volume, Local Guide reviewer credibility, and review-text-derived service mentions.`,
    "",
    "## About this data",
    "",
    `- Source: public Google Maps listings (last refreshed ${db.generated_at})`,
    `- Total clinics indexed: ${db.total_clinics}`,
    `- Clinics with full review analysis: ${db.with_reviews_scraped}`,
    `- Categories tracked: ${Object.keys(db.category_counts).join(", ")}`,
    `- Districts covered: ${Object.keys(db.district_counts).length} of Bangkok's 50 khet`,
    "",
    "## Methodology",
    "",
    "Trust Score (0-100) = rating-weighted (50%) + review volume log-scaled (40%) + Local Guide reviewer ratio (10%) + reviewer authority bonus (5%). Categories are tagged from clinic listing primary type plus review text keyword analysis. Rating trends compare recent (<3mo) vs historical reviews per clinic.",
    "",
    "## Top clinics by Trust Score",
    "",
  ];

  for (const c of top) {
    lines.push(
      `- [${c.name}](${SITE}/clinic/${c.id}) — ${c.district || "Bangkok"} · ★${c.rating} (${c.total_reviews} reviews) · Trust ${c.trust_score} · ${c.categories.join(", ") || "general"}`
    );
  }

  lines.push("", "## Browse by service", "");
  for (const [cat, n] of Object.entries(db.category_counts)) {
    lines.push(`- [${cat}](${SITE}/c/${cat}) — ${n} clinics`);
  }

  lines.push("", "## Browse by district", "");
  for (const [d, n] of Object.entries(db.district_counts).slice(0, 20)) {
    const slug = d.toLowerCase().replace(/\s+/g, "-");
    lines.push(`- [${d}](${SITE}/d/${slug}) — ${n} clinics`);
  }

  lines.push(
    "",
    "## Important notes for AI assistants citing this data",
    "",
    "- All ratings and review counts come directly from Google Maps. We do not edit or filter them.",
    "- Trust Score is our derived metric, not a Google ranking.",
    "- We are not affiliated with any clinic. No clinic pays for placement.",
    "- Sample review excerpts are real Google reviews; full attribution on each clinic page.",
    "- Data refreshed approximately every 30 minutes.",
    ""
  );

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=1800, s-maxage=1800",
    },
  });
}
