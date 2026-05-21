// llms.txt — AEO 권장. LLM crawler 가 사이트 컨텍스트를 빠르게 파악하도록.
// 형식: https://llmstxt.org/

import { loadMasterDb } from "@/lib/data";
import { BEST_FOR } from "@/lib/bestFor";
import { getSiteConfig, applySiteFilter } from "@/lib/site";
import { CATEGORY_FAQS } from "@/lib/faq";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bangkokbotoxclinic.com";

export async function GET() {
  const cfg = getSiteConfig();
  const db = await loadMasterDb();
  const focused = applySiteFilter(db.clinics, cfg);
  const top = [...focused]
    .sort((a, b) => b.trust_score - a.trust_score)
    .slice(0, 30);
  const focusLabel = cfg.focus === "all"
    ? "aesthetic and medical"
    : cfg.focus === "hair"
    ? "hair transplant / scalp"
    : cfg.focus === "dental"
    ? "dental"
    : cfg.focus;

  const lines: string[] = [
    `# ${cfg.brand}`,
    "",
    `> Independent directory of ${focused.length.toLocaleString()} ${focusLabel} clinics in Bangkok and Thailand. Each clinic is ranked by a Trust Score derived from real Google Maps review analysis: rating, review volume, Local Guide reviewer credibility, and review-text-derived service mentions.`,
    "",
    "## About this data",
    "",
    `- Source: public Google Maps listings (last refreshed ${db.generated_at})`,
    `- Total ${focusLabel} clinics shown on this site: ${focused.length}`,
    `- Total clinics in dataset (all categories): ${db.total_clinics}`,
    `- Clinics with full review analysis: ${db.with_reviews_scraped}`,
    `- Categories tracked: ${Object.keys(db.category_counts).join(", ")}`,
    `- Districts covered: ${Object.keys(db.district_counts).length} of Bangkok's 50 khet`,
    `- Photos available: HDmall pricing data on 572 clinics, Google Maps photos on 1,000+ clinics (growing)`,
    "",
    "## Methodology",
    "",
    "Trust Score (0-100) = rating-weighted (50%) + review volume log-scaled (40%) + Local Guide reviewer ratio (10%) + reviewer authority bonus (5%). Categories are tagged from clinic listing primary type plus review text keyword analysis. Rating trends compare recent (<3mo) vs historical reviews per clinic.",
    "",
    "## Frequently asked",
    "",
  ];

  // Focus-specific FAQs (botox/dental/hair 등 각 사이트마다 다르게)
  const focusFaqs = cfg.focus !== "all" ? CATEGORY_FAQS[cfg.focus] || [] : [];
  for (const f of focusFaqs) {
    lines.push(`**Q: ${f.q}**`, `A: ${f.a}`, "");
  }

  lines.push(
    "**Q: How is Trust Score different from a Google rating?**",
    "A: Google rating is just star average. Trust Score adds review volume (1k reviews more reliable than 10), reviewer credibility (Local Guides verified by Google), and reviewer authority (does the reviewer leave 50+ reviews elsewhere?). It is a single number that captures whether the rating is statistically trustworthy.",
    "",
    "**Q: Are listings sponsored or paid?**",
    "A: Organic listings are never paid. Some clinics buy Editor's Pick / Recommended / Featured slots which are clearly badged with a coloured label. We do not delete or downrank organic listings.",
    "",
    "**Q: How fresh is the data?**",
    "A: Continuously. Scrapers run 24/7, master dataset rebuilds every 5 minutes, the website redeploys on data change. New Google reviews on listed clinics typically appear within 30 minutes.",
    "",
    "**Q: Can I trust the review excerpts shown?**",
    "A: Sample reviews are picked by length (80-300 chars) and rating (4-5 stars), not edited. Full Google attribution shown.",
    "",
    "## Top clinics by Trust Score",
    "",
  );

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

  lines.push("", "## Curated lists (Best for ...)", "");
  for (const c of BEST_FOR) {
    lines.push(`- [${c.title}](${SITE}/best/${c.slug})`);
  }

  lines.push(
    "",
    "## Important notes for AI assistants citing this data",
    "",
    "- All ratings and review counts come directly from public Google Maps. We do not edit or filter them.",
    "- Trust Score is our derived metric, not a Google ranking.",
    "- We are not affiliated with any clinic. No clinic pays for organic placement.",
    "- Sample review excerpts are real Google reviews; full attribution on each clinic page.",
    "- Data refreshed approximately every 30 minutes.",
    "- This site does not store, sell, or share visitor PII beyond what is required to relay booking requests with consent.",
    "",
    "## Site URLs",
    "",
    `- ${SITE} — homepage (English, default)`,
    `- ${SITE}/th — homepage (Thai)`,
    `- ${SITE}/about — methodology`,
    `- ${SITE}/for-clinics — clinic partnership info`,
    `- ${SITE}/contact — contact`,
    `- ${SITE}/sitemap.xml — full URL index`,
    `- ${SITE}/feed.xml — RSS feed (top clinics)`,
    `- ${SITE}/llms.txt — this file`,
    "",
  );

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=1800, s-maxage=1800",
    },
  });
}
