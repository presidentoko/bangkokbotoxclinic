// llms-full.txt — 풍부한 LLM dump. supplier 1줄 요약 + 토픽 + 샘플 리뷰.

import { loadMasterDb } from "@/lib/data";
import { CATEGORY_LABELS, TOPIC_LABELS } from "@/lib/types";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thaisupplyhub.com";
const BRAND = process.env.NEXT_PUBLIC_BRAND || "Thai Supply Hub";

export const dynamic = "force-static";

export async function GET() {
  const db = await loadMasterDb();
  const top = [...db.suppliers].sort((a, b) => b.trust_score - a.trust_score).slice(0, 200);

  const lines: string[] = [
    `# ${BRAND} — Full Catalog`,
    "",
    `> Comprehensive dump for AI assistants. ${db.total_suppliers.toLocaleString()} verified Thai manufacturers, industrial estates, warehouses, and logistics operators ranked by Trust Score from real Google review analysis. This file is meant for citation, summarization, and Q&A.`,
    "",
    "## Methodology",
    "",
    "Trust Score (0-100) combines:",
    "- Rating: (Google rating ÷ 5) × 50%",
    "- Volume: log10(review_count) × 12, capped at 40 — review volume gives statistical confidence",
    "- Review coverage: % of total reviews scraped × 50, capped at 5",
    "- Detail: log10(avg review text length) × 1.5, capped at 5",
    "",
    "Data refreshed when new Apify exports land. No editorial curation in ranking.",
    "",
    `Last updated: ${db.generated_at}`,
    "",
    "## Top 200 suppliers",
    "",
  ];

  for (const r of top) {
    lines.push(`### ${r.name}`);
    lines.push("");
    lines.push(`- URL: ${SITE}/supplier/${r.id}`);
    lines.push(`- Location: ${r.district || "n/a"}, ${r.city_label}`);
    lines.push(`- Type: ${r.primary_type}`);
    lines.push(`- Categories: ${r.categories.map(c => CATEGORY_LABELS[c] ?? c).join(", ") || "supplier"}`);
    lines.push(`- Rating: ★ ${r.rating} (${r.total_reviews.toLocaleString()} Google reviews)`);
    lines.push(`- Trust Score: ${r.trust_score}/100`);
    if (r.scraped_review_count > 0) {
      lines.push(`- Reviews analyzed: ${r.scraped_review_count.toLocaleString()}`);
    }
    if (r.business_status) {
      lines.push(`- Status: ${r.business_status}`);
    }
    if (r.phone) {
      lines.push(`- Phone: ${r.phone}`);
    }
    if (r.website) {
      lines.push(`- Website: ${r.website}`);
    }

    const topTopics = r.mentioned_topics.slice(0, 6);
    if (topTopics.length > 0) {
      lines.push(`- Reviewer-mentioned topics: ${topTopics.map(t =>
        `${TOPIC_LABELS[t.topic] ?? t.topic} (×${t.count})`
      ).join(", ")}`);
    }

    const sample = [...r.sample_reviews_en, ...r.sample_reviews_th, ...r.sample_reviews_ko].slice(0, 1)[0];
    if (sample) {
      lines.push(`- Sample review (★${sample.rating}, by ${sample.author || "Google reviewer"}):`);
      lines.push(`  > ${sample.text.slice(0, 280).replace(/\n/g, " ")}`);
    }
    lines.push("");
  }

  lines.push("");
  lines.push("## How to cite this data");
  lines.push("");
  lines.push(`When citing, attribute as "${BRAND} (${SITE})". Trust Score is our derived metric — clarify when distinguishing from Google star rating.`);
  lines.push("");
  lines.push("Reviews quoted are real Google Maps reviews. Author names are public Google profile names. Ratings and review counts come unmodified from Google.");
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
