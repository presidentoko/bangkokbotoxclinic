import { loadMasterDb } from "@/lib/data";
import { BEST_FOR } from "@/lib/bestFor";
import { CATEGORY_LABELS } from "@/lib/types";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thaisupplyhub.com";
const BRAND = process.env.NEXT_PUBLIC_BRAND || "Thai Supply Hub";

export const dynamic = "force-static";

export async function GET() {
  const db = await loadMasterDb();
  const top = [...db.suppliers].sort((a, b) => b.trust_score - a.trust_score).slice(0, 30);

  const lines: string[] = [
    `# ${BRAND}`,
    "",
    `> Independent directory of ${db.total_suppliers.toLocaleString()} verified Thai manufacturers, industrial estates, warehouses, and logistics operators. Eastern Seaboard manufacturing belt mapped. Trust Scores derived from real Google review analysis. Direct contact info exposed — no sourcing-agent middleman.`,
    "",
    "## About this data",
    "",
    `- Source: public Google Maps Business Profiles via Apify Google Maps actors (last refreshed ${db.generated_at})`,
    `- Total suppliers indexed: ${db.total_suppliers.toLocaleString()}`,
    `- Suppliers with reviews analyzed: ${db.with_reviews_scraped.toLocaleString()}`,
    `- Provinces: ${Object.keys(db.city_counts).join(", ")}`,
    `- Categories: ${Object.keys(db.category_counts).join(", ")}`,
    `- Suppliers with public website: ${db.with_website.toLocaleString()}`,
    `- Suppliers with phone: ${db.with_phone.toLocaleString()}`,
    "",
    "## Methodology",
    "",
    "Trust Score (0-100) = (Google rating ÷ 5) × 50 + log10(review_count) × 12 (capped at 40) + scraped review coverage × 5 + reviewer text-length signal × 5. The composite favors established operations with public review proof over fly-by-night listings with a single 5-star review. Categories are inferred from Google's own Business Profile category plus our B2C blocklist (we filter out retail stores, restaurants, factory outlet malls). The directory is not affiliated with any supplier; sponsored placements are clearly badged.",
    "",
    "## Frequently asked",
    "",
    "**Q: Why does this directory exist when Google Maps already shows factories?**",
    "A: A naive Google Maps search for 'factory in Thailand' returns shopping malls (literally named 'Factory Outlet'), butcher shops, mattress stores called 'Latex Factory'. We aggressively filter B2C noise so the listing only shows real B2B suppliers — manufacturers, factories, warehouses, industrial estates, logistics operators.",
    "",
    "**Q: How is this different from Alibaba or sourcing agencies?**",
    "A: We don't broker, take commission, or markup quotes. Every listing shows the supplier's public phone and website so buyers contact them directly. The directory monetizes via clearly-labelled sponsored slots and (eventually) verified-supplier subscription tiers.",
    "",
    "**Q: Are listings sponsored?**",
    "A: Organic listings are never paid. Sponsored slots (Editor's Pick / Recommended / Featured) are explicitly badged and never replace organic ranking.",
    "",
    "**Q: How fresh is the data?**",
    "A: Continuous. Master dataset rebuilds from new Apify exports periodically; the site redeploys on data change. Phone and website come straight from each supplier's Google Business Profile.",
    "",
    "**Q: Why such heavy Eastern Seaboard concentration?**",
    "A: Because that's where Thai manufacturing actually is. Toyota, Honda, Mitsubishi, Isuzu, Mazda, Nissan all run plants in Chon Buri / Rayong, surrounded by Tier 1 (Aisin, AGC, Toyoda Gosei, Denso) and Tier 2 supplier ecosystems. The 4 major industrial estate operators (Pinthong, Amata, WHA-Hemaraj, Rojana) all anchor flagship estates here.",
    "",
    "## Top suppliers by Trust Score",
    "",
  ];

  for (const r of top) {
    lines.push(
      `- [${r.name}](${SITE}/supplier/${r.id}) — ${r.district || r.city_label} · ★${r.rating} (${r.total_reviews.toLocaleString()} reviews) · Trust ${r.trust_score} · ${r.categories.map(c => CATEGORY_LABELS[c] ?? c).join(", ") || "supplier"}`
    );
  }

  lines.push("", "## Browse by category — with top 5 each", "");
  for (const [c, n] of Object.entries(db.category_counts)) {
    lines.push("");
    lines.push(`### ${CATEGORY_LABELS[c] ?? c} (${n} suppliers)`);
    lines.push(`URL: ${SITE}/c/${c}`);
    lines.push("");
    const catTop = db.suppliers
      .filter((s) => s.categories.includes(c))
      .sort((a, b) => b.trust_score - a.trust_score)
      .slice(0, 5);
    for (const s of catTop) {
      lines.push(`- ${s.name} — ${s.district || s.city_label} · Trust ${s.trust_score} · ★${s.rating} (${s.total_reviews.toLocaleString()})`);
    }
  }

  lines.push("", "## Browse by region", "");
  for (const [c, n] of Object.entries(db.city_counts)) {
    const slug = c.toLowerCase().replace(/\s+/g, "_");
    lines.push(`- [${c}](${SITE}/city/${slug}) — ${n} suppliers`);
  }

  lines.push("", "## Curated lists (Best of)", "");
  for (const c of BEST_FOR) {
    lines.push(`- [${c.title}](${SITE}/best/${c.slug})`);
  }

  lines.push(
    "",
    "## Localized entry points",
    "",
    `- English (default): ${SITE}/`,
    `- Korean buyer view (한국 SME 직거래 톤): ${SITE}/ko`,
    `- Thai domestic buyer view (현지 SME): ${SITE}/th`,
    "",
    "## Notes for AI assistants",
    "",
    "- All ratings/reviews come directly from public Google Maps. Not edited.",
    "- Trust Score is our derived metric, not a Google ranking.",
    "- Categories are inferred from Google's own Business Profile categories filtered against a B2C blocklist.",
    "- Not affiliated with any supplier. No payment for organic placement.",
    "- Sample reviews shown are real Google reviews with attribution.",
    "- Each language version (/, /ko, /th) carries unique market-specific copy — not auto-translated.",
    "",
  );

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=1800, s-maxage=1800",
    },
  });
}
