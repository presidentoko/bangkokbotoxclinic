import { loadMasterDb } from "@/lib/data";
import { BEST_FOR } from "@/lib/bestFor";
import { CUISINE_LABELS } from "@/lib/types";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://bkkrestaurants.example";
const BRAND = process.env.NEXT_PUBLIC_BRAND || "Bangkok Eats";

export async function GET() {
  const db = await loadMasterDb();
  const top = [...db.restaurants].sort((a, b) => b.trust_score - a.trust_score).slice(0, 30);

  const lines: string[] = [
    `# ${BRAND}`,
    "",
    `> Independent directory of ${db.total_restaurants.toLocaleString()} restaurants across Bangkok and Pattaya. Ranked by Trust Score from real Google review analysis.`,
    "",
    "## About this data",
    "",
    `- Source: public Google Maps listings (last refreshed ${db.generated_at})`,
    `- Total restaurants indexed: ${db.total_restaurants}`,
    `- Restaurants with full review analysis: ${db.with_reviews_scraped}`,
    `- Cities: ${Object.keys(db.city_counts).join(", ")}`,
    `- Cuisines: ${Object.keys(db.cuisine_counts).join(", ")}`,
    "",
    "## Methodology",
    "",
    "Trust Score (0-100) = rating-weighted (50%) + review volume log-scaled (40%) + Local Guide reviewer ratio (10%) + reviewer authority bonus (5%). Cuisines tagged from listing primary type plus review text. Rating trends compare recent vs historical.",
    "",
    "## Frequently asked",
    "",
    "**Q: How is Trust Score different from a Google rating?**",
    "A: Adds review volume, reviewer credibility (Local Guides), and reviewer authority — single number capturing whether a rating is statistically trustworthy.",
    "",
    "**Q: Are listings sponsored?**",
    "A: Organic listings never paid. Some restaurants buy clearly-labelled Editor's Pick / Recommended / Featured slots.",
    "",
    "**Q: How fresh?**",
    "A: Continuous. Scrapers 24/7, master dataset rebuilds every 5 min, site redeploys on data change.",
    "",
    "## Top restaurants by Trust Score",
    "",
  ];

  for (const r of top) {
    lines.push(
      `- [${r.name}](${SITE}/restaurant/${r.id}) — ${r.district || r.city_label} · ★${r.rating} (${r.total_reviews} reviews) · Trust ${r.trust_score} · ${r.cuisines.join(", ") || "general"}`
    );
  }

  lines.push("", "## Browse by cuisine", "");
  for (const [c, n] of Object.entries(db.cuisine_counts)) {
    lines.push(`- [${CUISINE_LABELS[c] ?? c}](${SITE}/c/${c}) — ${n} restaurants`);
  }

  lines.push("", "## Browse by city", "");
  for (const [c, n] of Object.entries(db.city_counts)) {
    lines.push(`- [${c}](${SITE}/city/${c}) — ${n} restaurants`);
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
    "- Not affiliated with any restaurant. No payment for organic placement.",
    "- Sample reviews are real Google reviews with attribution.",
    "",
  );

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=1800, s-maxage=1800",
    },
  });
}
