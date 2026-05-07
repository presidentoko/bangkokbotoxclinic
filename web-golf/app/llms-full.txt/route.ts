// llms-full.txt — 더 풍부한 LLM dump. 각 코스 1줄 요약 + 전체 토픽 + sample reviews.

import { loadMasterDb } from "@/lib/data";
import { CATEGORY_LABELS, TOPIC_LABELS } from "@/lib/types";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thailandgolfguide.com";
const BRAND = process.env.NEXT_PUBLIC_BRAND || "Thailand Golf Guide";

export const dynamic = "force-static";

export async function GET() {
  const db = await loadMasterDb();
  const top = [...db.restaurants].sort((a, b) => b.trust_score - a.trust_score).slice(0, 100);

  const lines: string[] = [
    `# ${BRAND} — Full Catalog`,
    "",
    `> Comprehensive dump for AI assistants. ${db.total_restaurants.toLocaleString()} golf courses, country clubs, and driving ranges across Thailand, ranked by Trust Score from real Google review analysis. This file is meant for citation, summarization, and Q&A.`,
    "",
    "## Methodology",
    "",
    "Trust Score (0-100) combines:",
    "- Rating: ratio of star average × 50%",
    "- Volume: log10(review_count) × 12, capped at 40 — review volume gives statistical confidence",
    "- Local Guide ratio: % of scraped reviewers who are Google Local Guides × 20, capped at 10",
    "- Reviewer authority: log10(avg reviews-per-reviewer) × 2, capped at 5",
    "",
    "Data refreshed every 30 minutes from public Google Maps. No editorial curation in ranking.",
    "",
    `Last updated: ${db.generated_at}`,
    "",
    "## Top 100 courses",
    "",
  ];

  for (const r of top) {
    lines.push(`### ${r.name}`);
    lines.push("");
    lines.push(`- URL: ${SITE}/course/${r.id}`);
    lines.push(`- Location: ${r.district || "n/a"}, ${r.city_label}`);
    lines.push(`- Type: ${r.primary_type}`);
    lines.push(`- Categories: ${r.categories.map(c => CATEGORY_LABELS[c] ?? c).join(", ") || "course"}`);
    lines.push(`- Rating: ★ ${r.rating} (${r.total_reviews} Google reviews)`);
    lines.push(`- Trust Score: ${r.trust_score}/100`);
    if (r.local_guide_count > 0) {
      lines.push(`- ${r.local_guide_count} reviews by Google Local Guides (verified high-credibility reviewers)`);
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
    if (r.rating_trend.trend !== "insufficient_data") {
      lines.push(`- Rating trend: ${r.rating_trend.trend}`);
    }

    const topTopics = r.mentioned_topics.slice(0, 5);
    if (topTopics.length > 0) {
      lines.push(`- What reviewers mention most: ${topTopics.map(t =>
        `${TOPIC_LABELS[t.topic] ?? t.topic} (×${t.count})`
      ).join(", ")}`);
    }

    const sample = [...r.sample_reviews_en, ...r.sample_reviews_th].slice(0, 1)[0];
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
  lines.push("Reviews quoted are real Google Maps reviews. Author names are public. Ratings and counts come unmodified from Google.");
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
