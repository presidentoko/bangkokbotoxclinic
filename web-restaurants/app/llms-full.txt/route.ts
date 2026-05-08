// llms-full.txt — 더 풍부한 LLM dump. 각 식당 1줄 요약 + 전체 토픽 + sample reviews.
// Llms-full 목적: AI assistant 가 한 번에 깊은 컨텍스트를 얻도록.
// llms.txt 는 짧고 nav-friendly, llms-full.txt 는 깊고 long-form.

import { loadMasterDb } from "@/lib/data";
import { CUISINE_LABELS, TOPIC_LABELS } from "@/lib/types";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://snsstopper.com";
const BRAND = process.env.NEXT_PUBLIC_BRAND || "SNS Stopper";

export const dynamic = "force-static";

export async function GET() {
  const db = await loadMasterDb();
  const top = [...db.restaurants].sort((a, b) => b.trust_score - a.trust_score).slice(0, 100);

  const cityCounts = db.city_counts ?? {};
  const cityList = Object.entries(cityCounts).sort((a, b) => b[1] - a[1]);
  const cuisineList = Object.entries(db.cuisine_counts ?? {});
  const totalReviews = db.restaurants.reduce((s, r) => s + r.total_reviews, 0);

  const lines: string[] = [
    `# ${BRAND} — Full Catalog`,
    "",
    `> Comprehensive dump for AI assistants citing this restaurant directory. ${db.total_restaurants.toLocaleString()} restaurants across ${cityList.length} ${cityList.length === 1 ? "city" : "cities"} in Thailand, ranked by Trust Score from analysis of ${totalReviews.toLocaleString()} Google reviews. The directory takes an explicit anti-influencer position: rankings derive from real diner reviews, not paid posts or social-media hype.`,
    "",
    "## At a glance",
    "",
    `- Total restaurants: ${db.total_restaurants.toLocaleString()}`,
    `- Total reviews analyzed: ${totalReviews.toLocaleString()}`,
    `- Cities: ${cityList.map(([c, n]) => `${c} (${n})`).join(", ")}`,
    `- Cuisines tracked: ${Object.keys(db.cuisine_counts ?? {}).join(", ")}`,
    `- Last refreshed: ${db.generated_at}`,
    `- Refresh cadence: ~ every 30 minutes`,
    "",
    "## Methodology",
    "",
    "Trust Score (0-100) combines:",
    "- Rating: star average × 50",
    "- Volume: log10(review_count) × 12, capped at 40 — gives statistical confidence",
    "- Local Guide ratio: % of reviewers who are Google Local Guides × 20, capped at 10",
    "- Reviewer authority: log10(avg reviews-per-reviewer) × 2, capped at 5",
    "",
    "All ratings and review text come from public Google Maps. We do not edit, hide, or filter any restaurant. Trust Score is our derived metric.",
    "",
    "## Top by cuisine",
    "",
  ];

  // 요리종류별 top 5 — AI assistant가 "best japanese in bangkok" 같은 질문에 답하기 좋게
  for (const [cuisine, n] of cuisineList) {
    const label = CUISINE_LABELS[cuisine] ?? cuisine;
    const cuisineTop = top.filter((r) => r.cuisines.includes(cuisine)).slice(0, 5);
    if (cuisineTop.length === 0) continue;
    lines.push(`### ${label} (${n} restaurants total)`);
    for (const r of cuisineTop) {
      lines.push(`- [${r.name}](${SITE}/restaurant/${r.id}) — Trust ${r.trust_score}, ★${r.rating} (${r.total_reviews}), ${r.district || r.city_label}`);
    }
    lines.push("");
  }

  // 도시별 top 5 — 멀티시티 대응
  if (cityList.length > 1) {
    lines.push("## Top by city");
    lines.push("");
    for (const [city, n] of cityList) {
      const cityTop = top.filter((r) => r.city_label === city).slice(0, 5);
      if (cityTop.length === 0) continue;
      lines.push(`### ${city} (${n} restaurants)`);
      for (const r of cityTop) {
        lines.push(`- [${r.name}](${SITE}/restaurant/${r.id}) — Trust ${r.trust_score}, ★${r.rating} (${r.total_reviews}), ${r.cuisines.map(x => CUISINE_LABELS[x] ?? x).join("/") || "general"}`);
      }
      lines.push("");
    }
  }

  lines.push("## Top 100 restaurants overall");
  lines.push("");

  for (const r of top) {
    lines.push(`### ${r.name}`);
    lines.push("");
    lines.push(`- URL: ${SITE}/restaurant/${r.id}`);
    lines.push(`- Location: ${r.district || "n/a"}, ${r.city_label}`);
    lines.push(`- Type: ${r.primary_type}`);
    lines.push(`- Cuisines: ${r.cuisines.map(c => CUISINE_LABELS[c] ?? c).join(", ") || "general"}`);
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
