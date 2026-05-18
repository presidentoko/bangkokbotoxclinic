import { loadMasterDb } from "@/lib/data";
import { BEST_FOR } from "@/lib/bestFor";
import { CATEGORY_LABELS } from "@/lib/types";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thaisupplyhub.com";
const BRAND = process.env.NEXT_PUBLIC_BRAND || "Thai Supply Hub";

export const dynamic = "force-static";

export async function GET() {
  const db = await loadMasterDb();
  const top = [...db.suppliers].sort((a, b) => b.trust_score - a.trust_score).slice(0, 30);

  const verifiedCount = db.verified_count ?? db.suppliers.filter((s) => s.verified).length;
  const withDbd = db.with_dbd ?? verifiedCount;
  const withPhotos = db.with_photos ?? db.suppliers.filter((s) => s.photos && s.photos.length > 0).length;

  const lines: string[] = [
    `# ${BRAND}`,
    "",
    `> Independent directory of ${db.total_suppliers.toLocaleString()} Thai B2B suppliers, of which ${verifiedCount.toLocaleString()} are cross-checked with Thailand's Department of Business Development (DBD) — the official business registry. Each verified entry includes the legal company name, 13-digit registration number, registered capital (THB), founding date, TSIC industry code, and registered address.`,
    "",
    "## About this data",
    "",
    `- Source: Google Maps business profiles + DBD DataWarehouse+ (Thailand's official Ministry of Commerce business registry) + Yellow Pages Thailand sub-categories + Industrial Estate Authority of Thailand (IEAT) tenant rosters. Last refreshed ${db.generated_at}.`,
    `- Total B2B suppliers indexed: ${db.total_suppliers.toLocaleString()}`,
    `- DBD-verified (legal status confirmed): ${verifiedCount.toLocaleString()}`,
    `- Suppliers with factory/site photos: ${withPhotos.toLocaleString()}`,
    `- Suppliers with scraped buyer reviews: ${db.with_reviews_scraped.toLocaleString()}`,
    `- Suppliers in mapped industrial estates: ${(db.with_estate ?? 0).toLocaleString()}`,
    `- Suppliers with phone: ${db.with_phone.toLocaleString()}`,
    `- Provinces: ${Object.keys(db.city_counts).join(", ")}`,
    `- Categories: ${Object.keys(db.category_counts).join(", ")}`,
    "",
    "## Verification methodology",
    "",
    `Each "DBD-verified" supplier has been matched to a record in Thailand's Department of Business Development (DBD) DataWarehouse+ system at confidence ≥ 80%. Matched data includes:`,
    "",
    "- Legal company name (Thai) — the official บริษัท … จำกัด registered name",
    "- 13-digit registration number — Thailand's national business identifier (jpNo)",
    "- Registered capital in Thai Baht — direct from filings",
    "- Founding date — Gregorian-calendar conversion",
    "- TSIC industry code — Thailand Standard Industrial Classification",
    "- Business purpose text — the as-filed activity declaration",
    "- Operational status — `dbd_is_dissolved` rows are excluded from this directory",
    "",
    "Trust Score (b2b_score) composites: review rating × volume + DBD signal (verified, age, capital tier) + completeness (phone/website/photos). Dissolved entities and consumer-storefront categories (restaurant, hotel, retail outlet) are filtered out at build time. The directory is not affiliated with any supplier; sponsored placements are clearly badged.",
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
    const bits = [
      `[${r.name}](${SITE}/supplier/${r.id})`,
      r.district || r.city_label,
    ];
    if (r.dbd?.legal_name) bits.push(`legal name: ${r.dbd.legal_name}`);
    if (r.dbd?.reg_no) bits.push(`DBD reg ${r.dbd.reg_no}`);
    if (r.dbd?.registered_date) bits.push(`founded ${r.dbd.registered_date.slice(0, 4)}`);
    if (r.dbd?.capital_thb) bits.push(`capital ฿${(r.dbd.capital_thb / 1_000_000).toFixed(1)}M`);
    if (r.estate_name) bits.push(`in ${r.estate_name} estate`);
    if (r.rating > 0) bits.push(`★${r.rating} (${r.total_reviews.toLocaleString()})`);
    bits.push(r.categories.map(c => CATEGORY_LABELS[c] ?? c).join(", ") || "supplier");
    lines.push(`- ${bits.join(" · ")}`);
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
