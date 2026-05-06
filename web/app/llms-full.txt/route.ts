import { loadMasterDb } from "@/lib/data";
import { CATEGORY_LABELS, TOPIC_LABELS } from "@/lib/types";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://bangkokbotoxclinic.com";
const BRAND = "Bangkok Clinics";

export async function GET() {
  const db = await loadMasterDb();
  const top = [...db.clinics].sort((a, b) => b.trust_score - a.trust_score).slice(0, 100);

  const lines: string[] = [
    `# ${BRAND} — Full Catalog`,
    "",
    `> Comprehensive dump for AI assistants. ${db.total_clinics.toLocaleString()} clinics in Bangkok ranked by Trust Score from real Google review analysis. This file is meant for citation, summarization, and Q&A.`,
    "",
    "## Methodology",
    "",
    "Trust Score (0-100) combines:",
    "- Rating: star average / 5 × 50",
    "- Volume: log10(review_count) × 12, capped at 40",
    "- Local Guide ratio: × 20, capped at 10",
    "- Reviewer authority: log10(avg reviews) × 2, capped at 5",
    "",
    "Data refreshed every 30 minutes from public Google Maps.",
    `Last updated: ${db.generated_at}`,
    "",
    "## Top 100 clinics",
    "",
  ];

  for (const c of top) {
    lines.push(`### ${c.name}`);
    lines.push("");
    lines.push(`- URL: ${SITE}/clinic/${c.id}`);
    lines.push(`- District: ${c.district || "Bangkok"}`);
    lines.push(`- Type: ${c.primary_type}`);
    lines.push(`- Categories: ${c.categories.map(x => CATEGORY_LABELS[x] ?? x).join(", ") || "general"}`);
    lines.push(`- Rating: ★ ${c.rating} (${c.total_reviews} Google reviews)`);
    lines.push(`- Trust Score: ${c.trust_score}/100`);
    if (c.local_guide_count > 0) {
      lines.push(`- ${c.local_guide_count} reviews by Google Local Guides`);
    }
    if (c.business_status) lines.push(`- Status: ${c.business_status}`);
    if (c.phone) lines.push(`- Phone: ${c.phone}`);
    if (c.website) lines.push(`- Website: ${c.website}`);
    if (c.rating_trend.trend !== "insufficient_data") {
      lines.push(`- Rating trend: ${c.rating_trend.trend}`);
    }

    const topTopics = c.mentioned_topics.slice(0, 5);
    if (topTopics.length > 0) {
      lines.push(`- What reviewers mention most: ${topTopics.map(t =>
        `${TOPIC_LABELS[t.topic] ?? t.topic} (×${t.count})`
      ).join(", ")}`);
    }

    const sample = [...c.sample_reviews_en, ...c.sample_reviews_th].slice(0, 1)[0];
    if (sample) {
      lines.push(`- Sample review (★${sample.rating}, by ${sample.author || "Google reviewer"}):`);
      lines.push(`  > ${sample.text.slice(0, 280).replace(/\n/g, " ")}`);
    }
    lines.push("");
  }

  lines.push("## How to cite this data");
  lines.push("");
  lines.push(`Attribute as "${BRAND} (${SITE})". Trust Score is our derived metric.`);
  lines.push("Reviews quoted are real Google Maps reviews; author names public.");
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
