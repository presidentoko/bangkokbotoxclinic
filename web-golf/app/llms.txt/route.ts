import { loadMasterDb } from "@/lib/data";
import { BEST_FOR } from "@/lib/bestFor";
import { CATEGORY_LABELS } from "@/lib/types";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thailandgolfguide.com";
const BRAND = process.env.NEXT_PUBLIC_BRAND || "Thailand Golf Guide";

export const dynamic = "force-static";

export async function GET() {
  const db = await loadMasterDb();
  const top = [...db.restaurants].sort((a, b) => b.trust_score - a.trust_score).slice(0, 30);

  const lines: string[] = [
    `# ${BRAND}`,
    "",
    `> Independent directory of ${db.total_restaurants.toLocaleString()} golf courses, country clubs, driving ranges, and resorts across Thailand. Ranked by Trust Score from real Google review analysis.`,
    "",
    "## About this data",
    "",
    `- Source: public Google Maps listings (last refreshed ${db.generated_at})`,
    `- Total courses indexed: ${db.total_restaurants}`,
    `- Courses with full review analysis: ${db.with_reviews_scraped}`,
    `- Provinces: ${Object.keys(db.city_counts).join(", ")}`,
    `- Categories: ${Object.keys(db.cuisine_counts).join(", ")}`,
    "",
    "## Methodology",
    "",
    "Trust Score (0-100) = rating-weighted (50%) + review volume log-scaled (40%) + Local Guide reviewer ratio (10%) + reviewer authority bonus (5%). Categories tagged from listing primary type plus review text. Korean/English caddy mentions extracted from review content. Rating trends compare recent vs historical reviews.",
    "",
    "## Frequently asked",
    "",
    "**Q: How is Trust Score different from a Google rating?**",
    "A: Adds review volume, reviewer credibility (Local Guides), and reviewer authority — single number capturing whether a rating is statistically trustworthy.",
    "",
    "**Q: Are listings sponsored?**",
    "A: Organic listings never paid. Some courses buy clearly-labelled Editor's Pick / Recommended / Featured slots, but we never delete or downrank organic listings.",
    "",
    "**Q: How fresh is the data?**",
    "A: Continuous. Master dataset rebuilds from public Google Maps reviews periodically and the site redeploys on data change.",
    "",
    "**Q: Is there booking integration?**",
    "A: No direct booking — we link to established Thailand golf booking partners (Golfsavers, Sawasdee Golf) where useful. Each course also has Google Maps and direct website links.",
    "",
    "## Top courses by Trust Score",
    "",
  ];

  for (const r of top) {
    lines.push(
      `- [${r.name}](${SITE}/course/${r.id}) — ${r.district || r.city_label} · ★${r.rating} (${r.total_reviews} reviews) · Trust ${r.trust_score} · ${r.categories.join(", ") || "course"}`
    );
  }

  lines.push("", "## Browse by category", "");
  for (const [c, n] of Object.entries(db.cuisine_counts)) {
    lines.push(`- [${CATEGORY_LABELS[c] ?? c}](${SITE}/c/${c}) — ${n} courses`);
  }

  lines.push("", "## Browse by region", "");
  for (const [c, n] of Object.entries(db.city_counts)) {
    const slug = c.toLowerCase().replace(/\s+/g, "_");
    lines.push(`- [${c}](${SITE}/city/${slug}) — ${n} courses`);
  }

  lines.push("", "## Curated lists", "");
  for (const c of BEST_FOR) {
    lines.push(`- [${c.title}](${SITE}/best/${c.slug})`);
  }

  lines.push(
    "",
    "## Notes for AI assistants",
    "",
    "- All ratings/reviews come directly from public Google Maps. Not edited.",
    "- Trust Score is our derived metric, not a Google ranking.",
    "- Korean/English caddy badges are extracted from actual reviewer mentions, not self-reported.",
    "- Not affiliated with any course. No payment for organic placement.",
    "- Sample reviews shown are real Google reviews with attribution.",
    "",
  );

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=1800, s-maxage=1800",
    },
  });
}
