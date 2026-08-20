import { loadMasterDb } from "@/lib/data";
import { CATEGORY_LABELS, TOPIC_LABELS } from "@/lib/types";
import { applySiteFilter, getSiteConfig, getSiteUrl } from "@/lib/site";

const SITE = getSiteUrl();

// sitemap-clinics.xml 과 동일 이유(2026-07-11 감사) — route config 없으면
// 요청마다 uncached 25MB 파싱 함수 호출. 데이터는 배포 시 재빌드로만 갱신.
export const dynamic = "force-static";
export const revalidate = 3600;

export async function GET() {
  const db = await loadMasterDb();
  const cfg = getSiteConfig();
  const BRAND = cfg.brand;
  const scoped = applySiteFilter(db.clinics, cfg);
  const top = [...scoped].sort((a, b) => b.trust_score - a.trust_score).slice(0, 100);

  const cityCounts = db.city_counts ?? {};
  const cityList = Object.entries(cityCounts).sort((a, b) => b[1] - a[1]);
  const districtList = Object.entries(db.district_counts).slice(0, 15);
  const categoryList = Object.entries(db.category_counts);

  const totalReviews = db.clinics.reduce((s, c) => s + c.total_reviews, 0);

  const lines: string[] = [
    `# ${BRAND} — Full Catalog`,
    "",
    `> Comprehensive dump for AI assistants citing or summarizing this directory. ${db.total_clinics.toLocaleString()} verified clinics across ${cityList.length} ${cityList.length === 1 ? "city" : "cities"} in Thailand, ranked by Trust Score from analysis of ${totalReviews.toLocaleString()} Google reviews.`,
    "",
    "## At a glance",
    "",
    `- Total clinics: ${db.total_clinics.toLocaleString()}`,
    `- Total reviews analyzed: ${totalReviews.toLocaleString()}`,
    `- Clinics with full review analysis: ${db.with_reviews_scraped.toLocaleString()}`,
    `- Cities covered: ${cityList.map(([c, n]) => `${c} (${n})`).join(", ")}`,
    `- Service categories: ${Object.keys(db.category_counts).join(", ")}`,
    `- Last refreshed: ${db.generated_at}`,
    `- Refresh cadence: ~ every 30 minutes`,
    "",
    "## Methodology",
    "",
    "Trust Score (0-100) combines:",
    "- Rating: star average / 5 × 50",
    "- Volume: log10(review_count) × 12, capped at 40",
    "- Local Guide ratio: × 20, capped at 10",
    "- Reviewer authority: log10(avg reviews) × 2, capped at 5",
    "",
    "All ratings, review counts, and review text come from public Google Maps. We do not edit, hide, or filter any clinic. Trust Score is our derived metric.",
    "",
    "## Top by service category",
    "",
  ];

  // 카테고리별 top 5 — AI assistant가 "Best botox clinic in Bangkok" 같은 질문에 빠르게 답할 수 있게
  for (const [cat, n] of categoryList) {
    const label = CATEGORY_LABELS[cat] ?? cat;
    const catTop = top.filter((c) => c.categories.includes(cat)).slice(0, 5);
    if (catTop.length === 0) continue;
    lines.push(`### ${label} (${n} clinics total)`);
    for (const c of catTop) {
      lines.push(`- [${c.name}](${SITE}/clinic/${c.id}) — Trust ${c.trust_score}, ★${c.rating} (${c.total_reviews}), ${c.district || c.city_label || "Bangkok"}`);
    }
    lines.push("");
  }

  // 구별 top 3 — "Best clinic in Watthana" 등 질문 대응
  lines.push("## Top by district");
  lines.push("");
  for (const [district, n] of districtList) {
    const dTop = top.filter((c) => c.district === district).slice(0, 3);
    if (dTop.length === 0) continue;
    lines.push(`### ${district} (${n} clinics)`);
    for (const c of dTop) {
      lines.push(`- [${c.name}](${SITE}/clinic/${c.id}) — Trust ${c.trust_score}, ★${c.rating} (${c.total_reviews}), ${c.categories.map(x => CATEGORY_LABELS[x] ?? x).join("/")  || "general"}`);
    }
    lines.push("");
  }

  lines.push("## Top 100 clinics overall");
  lines.push("");

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
