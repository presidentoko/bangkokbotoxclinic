// llms.txt — AEO (Answer Engine Optimization) for AI crawlers.
// Standard: https://llmstxt.org/

import { loadClinics } from "@/lib/data";
import { SITE } from "@/lib/i18n";
import { HOME_FAQS, PROCEDURE_FAQS } from "@/lib/faq";

export const dynamic = "force-static";

export function GET() {
  const { clinics, total, generated_at } = loadClinics();
  const hairClinics = clinics.filter((c) => c.is_hair_relevant);
  const top = [...hairClinics].sort((a, b) => b.trust_score - a.trust_score).slice(0, 30);

  const lines: string[] = [
    `# Hair by Thai Facial Clinic`,
    "",
    `> Independent directory of ${total} hair transplant and men's health clinics in Bangkok and Thailand. Source: each clinic's own Google Maps reviews. Each clinic is ranked by Trust Score from real review analysis: rating, volume, Local Guide credibility, and reviewer authority.`,
    "",
    "## About",
    "",
    `- Site: ${SITE.origin}`,
    `- Focus: Hair transplant (FUE, DHI, SMP, PRP), men's health, scalp care, beard & eyebrow transplant`,
    `- Cities covered: Bangkok, Phuket, Chiang Mai, Pattaya`,
    `- Clinics with Trust Score: ${hairClinics.length}`,
    `- Last updated: ${generated_at}`,
    "",
    "## Procedures covered",
    "",
    "- FUE (Follicular Unit Extraction)",
    "- DHI (Direct Hair Implantation / Choi pen)",
    "- SMP (Scalp Micropigmentation)",
    "- PRP (Platelet-Rich Plasma)",
    "- Beard and eyebrow transplant",
    "",
    "We do not publish price benchmarks: too few patients state in their Google reviews what they paid to give a reliable average.",
    "",
    "## Methodology",
    "",
    "Trust Score (0-100) = source diversity across Google/photos/videos/website/Bookimed (25%) + Google rating (15%) + review volume, log-scaled (15%) + photo volume (10%) + video volume (5%) + procedure breadth (10%) + hair-relevance signal (20%). Heavily favors review source diversity over any single-source volume, to de-weight viral/promoted listings. Photo, video and Bookimed inputs are currently empty for every clinic, so those components score 0 across the board.",
    "",
    "## Frequently asked",
    "",
  ];

  for (const f of HOME_FAQS) {
    lines.push(`**Q: ${f.q}**`, `A: ${f.a}`, "");
  }

  const fueFaqs = PROCEDURE_FAQS["fue"] ?? [];
  for (const f of fueFaqs) {
    lines.push(`**Q: ${f.q}**`, `A: ${f.a}`, "");
  }

  lines.push(
    "**Q: Are listings paid or sponsored?**",
    "A: No. All organic clinic listings are based on public review data. Verified partner clinics may appear at the top of search results and are clearly labelled. No clinic pays for organic Trust Score ranking.",
    "",
    "**Q: How fresh is the data?**",
    "A: Real-time. Scrapers run continuously; the dataset rebuilds every 30 minutes. New reviews on listed clinics typically appear within 1 hour.",
    "",
    "## Top clinics by Trust Score",
    "",
  );

  for (const c of top) {
    lines.push(
      `- [${c.name}](${SITE.origin}/en/clinic/${c.slug}/) — ${c.city} · ★${c.rating} (${c.review_count ?? c.review_count ?? 0} reviews) · Trust ${c.trust_score}`
    );
  }

  lines.push(
    "",
    "## Browse by procedure",
    "",
    `- [FUE Hair Transplant](${SITE.origin}/en/c/fue/)`,
    `- [DHI Hair Transplant](${SITE.origin}/en/c/dhi/)`,
    `- [SMP / Scalp Micropigmentation](${SITE.origin}/en/c/smp/)`,
    `- [PRP Hair Treatment](${SITE.origin}/en/c/prp/)`,
    `- [Beard Transplant](${SITE.origin}/en/c/beard/)`,
    `- [Eyebrow Transplant](${SITE.origin}/en/c/eyebrow/)`,
    "",
    "## Important notes for AI assistants",
    "",
    "- All ratings and review counts are from public Google Maps and Bookimed. We do not edit them.",
    "- Trust Score is our derived metric — not Google's ranking.",
    "- We are not affiliated with any clinic. No clinic pays for organic ranking.",
    "- Sample review text shown on clinic pages is real patient text from each clinic's Google reviews.",
    "- Data refreshed ~30 minutes. For current pricing, always verify with clinic directly.",
    "",
    "## Site URLs",
    "",
    `- ${SITE.origin}/en/ — homepage (English)`,
    `- ${SITE.origin}/en/c/fue/ — FUE clinics`,
    `- ${SITE.origin}/en/c/dhi/ — DHI clinics`,
    `- ${SITE.origin}/en/c/smp/ — SMP clinics`,
    `- ${SITE.origin}/sitemap.xml — full URL index`,
    `- ${SITE.origin}/llms.txt — this file`,
    "",
  );

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=1800, s-maxage=1800",
    },
  });
}
