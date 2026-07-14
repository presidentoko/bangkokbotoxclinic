import { notFound } from "next/navigation";
import { loadMasterDb, filterByCity } from "@/lib/data";
import { citySlugFromDisplay } from "@/lib/cityNorm";
import { districtsForCity } from "@/lib/districts";
import { SupplierCard } from "@/components/SupplierCard";
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/lib/types";
import { BreadcrumbJsonLd, FaqJsonLd, ItemListJsonLd, CollectionPageJsonLd } from "@/components/JsonLd";
import { CITY_FAQS } from "@/lib/faq";
import { findGuide } from "@/lib/guides";
import { computeTrustScore } from "@/lib/trustScore";

// 도시 → 가장 관련 깊은 가이드.
const CITY_TO_GUIDE: Record<string, string> = {
  chon_buri: "eastern-seaboard-industrial-estates-compared",
  chonburi: "eastern-seaboard-industrial-estates-compared",
  si_racha: "laem-chabang-warehouse-logistics",
  map_ta_phut: "map-ta-phut-petrochemical-cluster",
  rayong: "map-ta-phut-petrochemical-cluster",
  pathum_thani: "thai-electronics-manufacturer-hdd-ems",
  samut_sakhon: "thai-food-manufacturer-haccp-export",
  samut_prakan: "thai-textile-apparel-oem-guide",
  ayutthaya: "eastern-seaboard-industrial-estates-compared",
  phra_nakhon_si_ayutthaya: "eastern-seaboard-industrial-estates-compared",
  bangkok: "sourcing-thai-suppliers-direct",
  songkhla: "thai-rubber-products-sourcing-guide",
  nonthaburi: "sourcing-thai-suppliers-direct",
  chachoengsao: "eastern-seaboard-industrial-estates-compared",
  nakhon_ratchasima: "sourcing-thai-suppliers-direct",
  chiang_mai: "sourcing-thai-suppliers-direct",
  pattaya: "laem-chabang-warehouse-logistics",
  prachin_buri: "eastern-seaboard-industrial-estates-compared",
};
import { sortWithSponsored } from "@/lib/sponsored";
import { AdSlot } from "@/components/AffiliateSlot";
import { SupplierAlertSignup } from "@/components/SupplierAlertSignup";
import { TH_CITY_VALID } from "@/lib/thBuildSets";
import type { Metadata } from "next";

function citySlug(label: string): string {
  return label.toLowerCase().replace(/\s+/g, "_");
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const db = await loadMasterDb();
  const seen = new Set<string>();
  return Object.keys(db.city_counts)
    .map((label) => citySlugFromDisplay(label))
    .filter((slug) => {
      if (!slug || seen.has(slug)) return false;
      seen.add(slug);
      return true;
    })
    .map((slug) => ({ name: slug }));
}

// City context — English buyer facts for AEO / meta descriptions.
const CITY_NOTES: Record<string, { hook: string; long: string }> = {
  chon_buri: {
    hook: "Eastern Seaboard hub — Toyota, Honda, Mitsubishi, Isuzu main plants + Tier 1/2 supplier clusters.",
    long: "Chon Buri is the core of Thailand's automotive and electronics manufacturing. Major industrial estates — Pinthong, Amata City Chonburi, WHA Chonburi — are concentrated here. Sriracha and Laem Chabang container port make it the optimal export logistics base for Eastern Seaboard manufacturers.",
  },
  rayong: {
    hook: "Map Ta Phut petrochemical complex — PTT, IRPC, PTTGC, SCG Chemicals headquarters.",
    long: "Rayong hosts Southeast Asia's largest petrochemical cluster at Map Ta Phut. Amata City Rayong and Hemaraj Eastern Seaboard industrial estates anchor the area. Toyota and Ford vehicle plants, plus a dense network of Japanese automotive Tier 1 suppliers, operate throughout the province.",
  },
  pathum_thani: {
    hook: "Bangkok's northern industrial belt — electronics, food processing, and HDD cluster.",
    long: "Pathum Thani sits 30 km north of Bangkok and hosts Bangkadi Industrial Park. Western Digital, Seagate (HDD assembly), and food processing manufacturers are major industrial operators. Good highway and logistics links to central Bangkok.",
  },
  samut_sakhon: {
    hook: "Bangkok southwest — processed food, frozen seafood, and plastic OEM hub.",
    long: "Samut Sakhon is Thailand's #1 cluster for processed food, especially frozen seafood (shrimp, squid, fish). Plastic, packaging, and textile OEM manufacturers are also heavily concentrated here, benefiting from proximity to Bangkok's distribution network.",
  },
  samut_prakan: {
    hook: "Adjacent to Suvarnabhumi Airport — air cargo logistics, electronics, and apparel OEM.",
    long: "Samut Prakan's proximity to Suvarnabhumi International Airport makes it Thailand's primary air freight logistics hub. Bangpoo Industrial Estate is located here with electronics and apparel OEM manufacturers. Fast customs processing and airside access are key advantages.",
  },
  bangkok: {
    hook: "Corporate HQ and R&D hub — manufacturer offices rather than production plants.",
    long: "Bangkok concentrates corporate headquarters, R&D centers, and commercial offices of major Thai and multinational manufacturers — rather than production plants, which sit in Eastern Seaboard or suburban industrial estates. Lat Krabang Industrial Estate within Bangkok hosts some manufacturing capacity.",
  },
  ayutthaya: {
    hook: "Rojana Hi-Tech industrial estates — Honda, Sony, Sharp and Japanese supplier clusters.",
    long: "Ayutthaya hosts Rojana Industrial Park, Hi-Tech Industrial Estate, and Saha Rattana Nakorn — all predominantly Japanese-led tenant bases. Honda vehicles, Sony, and Sharp electronics are flagship operators. Excellent highway access to Bangkok and Eastern Seaboard.",
  },
  phra_nakhon_si_ayutthaya: {
    hook: "Rojana Hi-Tech industrial estates — Honda, Sony, Sharp and Japanese supplier clusters.",
    long: "Phra Nakhon Si Ayutthaya (Ayutthaya) hosts Rojana Industrial Park, Hi-Tech Industrial Estate, and Saha Rattana Nakorn — all predominantly Japanese-led tenant bases. Honda vehicles, Sony, and Sharp electronics are flagship operators. Excellent highway access to Bangkok and Eastern Seaboard.",
  },
  songkhla: {
    hook: "Southern hub — natural rubber processing, seafood, and halal food manufacturing.",
    long: "Songkhla (Hat Yai area) is Thailand's top natural rubber processing cluster and a major seafood / halal food OEM base. The province handles a significant share of Thailand's natural rubber exports and serves as the commercial gateway for southern Thailand and the Malaysia border trade corridor.",
  },
  nonthaburi: {
    hook: "Bangkok northwest — pharmaceuticals, cosmetics, and food OEM cluster.",
    long: "Nonthaburi sits northwest of Bangkok. The Bangkhen and Pak Kret areas concentrate pharmaceutical, cosmetics, and processed food OEM factories — industries benefiting from proximity to Bangkok's regulatory bodies and distribution network, with connectivity to the Pathum Thani industrial belt.",
  },
  chachoengsao: {
    hook: "Eastern gateway to Bangkok — logistics hub and industrial estates on the Eastern Seaboard.",
    long: "Chachoengsao sits 80 km east of Bangkok — the entry gateway to the Eastern Seaboard. Amata Nakhon Industrial Estate and WHA Industrial Estate Chachoengsao are major anchors. Automotive parts, electronics, and logistics warehouses concentrate here, benefiting from proximity to both Bangkok and Laem Chabang port.",
  },
  nakhon_ratchasima: {
    hook: "Largest northeastern city — automotive parts, electronics, and agri-food OEM.",
    long: "Nakhon Ratchasima (Korat) is the largest industrial city in Northeast Thailand. Suranaree and Nakhon Ratchasima Industrial Estates host Honda and Mitsubishi supplier networks alongside food processing manufacturers serving the Isan agricultural base.",
  },
  khon_kaen: {
    hook: "Northeast Thailand hub — agri-food processing, warehousing, and regional logistics center.",
    long: "Khon Kaen is the economic hub of Northeast Thailand (Isan region). Key industries include agri-food processing (tapioca starch, sugarcane, poultry), logistics warehousing, and some automotive component manufacturing. The Khon Kaen Special Economic Zone is attracting new foreign direct investment.",
  },
  chiang_rai: {
    hook: "Northern border gateway — GMS trade route, coffee, tea, and agri-food OEM.",
    long: "Chiang Rai is Thailand's northernmost major city and the gateway to the Greater Mekong Subregion (GMS) trade corridor connecting Myanmar, Laos, and southern China. Coffee, tea, tropical fruit, and herbal agri-food OEM manufacturers are concentrated here alongside inland logistics warehouses.",
  },
  si_racha: {
    hook: "Closest city to Laem Chabang port — Tier 2/3 automotive parts and export logistics hub.",
    long: "Si Racha sits 20–30 minutes from Laem Chabang container port — Thailand's largest international container terminal. Pinthong Industrial Estates 1–5 and other key export-oriented estates are clustered here, making it ideal for automotive Tier 2/3 parts, packaging, plastic OEM, and export logistics operators.",
  },
  chonburi: {
    hook: "Chon Buri province core — Thailand's densest industrial estate concentration.",
    long: "Chonburi (the broader administrative area of Chon Buri province) hosts Amata City Chonburi, Pinthong, WHA Chonburi, and many smaller estates — Thailand's highest concentration of industrial estates by number and total leased area. Automotive parts, electronics, plastics, and packaging OEM are dominant industries.",
  },
  map_ta_phut: {
    hook: "Southeast Asia's largest petrochemical complex — PTT, IRPC, PTTGC headquarters.",
    long: "Map Ta Phut is a special industrial zone within Rayong. PTT, IRPC, PTTGC, and SCG Chemicals operate integrated petrochemical complexes here with dedicated deep-sea port and pipeline infrastructure. It is the primary sourcing base in Thailand for bulk polymer, aromatic, and specialty chemical raw materials.",
  },
  pattaya: {
    hook: "Eastern Seaboard south — automotive parts, manufacturing, and logistics cluster.",
    long: "Beyond its tourism profile, Pattaya hosts manufacturing and logistics infrastructure on the southern end of the Eastern Seaboard. Proximity to Chon Buri and Rayong industrial estates makes it a strategic base for automotive parts, logistics, and service businesses supporting the manufacturing corridor.",
  },
  chiang_mai: {
    hook: "Northern economic hub — agri-food OEM, traditional crafts, and small-batch manufacturing.",
    long: "Chiang Mai is the largest city in Northern Thailand. Key manufacturing sectors: agri-food OEM (coffee, herbs, health foods), traditional crafts (lacquerware, ceramics, hand-woven textiles), and precision small-batch manufacturing. Chiang Mai Industrial Estate anchors the local formal manufacturing cluster.",
  },
  prachin_buri: {
    hook: "304 Industrial Park — Japanese and Korean auto parts, electronics, and food processing.",
    long: "Prachin Buri sits just north of Chachoengsao on the inland edge of the Eastern Seaboard corridor. 304 Industrial Park (Phases 1–3) is the province's main anchor, hosting Japanese and Korean automotive parts, electronics, and food processing manufacturers who want Eastern Seaboard logistics access without Chon Buri/Rayong land costs.",
  },
};

export async function generateMetadata(
  { params }: { params: Promise<{ name: string }> }
): Promise<Metadata> {
  const { name } = await params;
  const db = await loadMasterDb();
  const display =
    Object.keys(db.city_counts).find((k) => citySlug(k) === name) ??
    name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const note = CITY_NOTES[name];
  return {
    title: `${display} Suppliers — Verified B2B Directory & Trust Scores`,
    description: note?.hook
      ? `${display} suppliers — ${note.hook} Trust Scores from real Google reviews.`
      : `Verified Thai suppliers in ${display}: manufacturers, warehouses, industrial estates. Trust Scores from real Google reviews.`,
    alternates: {
      canonical: `/city/${name}`,
      languages: {
        "en-US": `/city/${name}`,
        "ko-KR": `/ko/city/${name}`,
        // /th/city/[name] only prerenders TH_CITY_VALID (dynamicParams=false) —
        // emitting this for every city would hreflang-link to a 404 for most.
        ...(TH_CITY_VALID.has(name) ? { "th-TH": `/th/city/${name}` } : {}),
        "x-default": `/city/${name}`,
      },
    },
  };
}

export default async function CityPage(
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const db = await loadMasterDb();

  const filtered = sortWithSponsored(filterByCity(db.suppliers, name));
  if (filtered.length === 0) notFound();

  const display = filtered[0]?.city_label ?? name.replace(/_/g, " ");
  const note = CITY_NOTES[name];

  // Categories in this city
  const catMap = new Map<string, number>();
  for (const r of filtered) {
    for (const c of r.categories) catMap.set(c, (catMap.get(c) ?? 0) + 1);
  }
  const categories = [...catMap.entries()].sort((a, b) => b[1] - a[1]);

  // Canonical districts in this city (Mueang/Muang 등 병합, supplier 5+ 만).
  const districts = districtsForCity(db, name);

  const withWebsite = filtered.filter((r) => r.website).length;
  const verifiedCount = filtered.filter((r) => r.verified).length;
  const avgTrust =
    filtered.length > 0
      ? Math.round(filtered.reduce((s, c) => s + computeTrustScore(c).overall, 0) / filtered.length)
      : 0;

  // Estate breakdown for this city
  const estateMap = new Map<string, { slug: string; count: number }>();
  for (const r of filtered) {
    if (r.estate_name && r.estate_slug) {
      const e = estateMap.get(r.estate_name) ?? { slug: r.estate_slug, count: 0 };
      e.count++;
      estateMap.set(r.estate_name, e);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span>{display}</span>
      </nav>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
        {display} Suppliers
      </h1>
      {note?.hook && (
        <p className="text-[var(--muted)] mb-2 leading-relaxed text-balance">
          {note.hook}
        </p>
      )}
      <p className="text-[var(--muted)] mb-6">
        {filtered.length.toLocaleString()} verified suppliers in {display}, ranked by Trust Score from public Google reviews.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 text-center">
        <div className="rounded-xl border border-[var(--border)] bg-white p-3">
          <div className="text-2xl font-bold tabular-nums">{filtered.length.toLocaleString()}</div>
          <div className="text-xs text-[var(--muted)]">Suppliers</div>
        </div>
        {verifiedCount > 0 && (
          <div className="rounded-xl border border-[var(--gold-light)] bg-[var(--gold-bg)] p-3">
            <div className="text-2xl font-bold tabular-nums text-[var(--gold-deep)]">✓ {verifiedCount.toLocaleString()}</div>
            <div className="text-xs text-[var(--gold-deep)]">DBD-verified</div>
          </div>
        )}
        <div className="rounded-xl border border-[var(--border)] bg-white p-3">
          <div className="text-2xl font-bold tabular-nums">{avgTrust}</div>
          <div className="text-xs text-[var(--muted)]">Avg Trust Score</div>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-white p-3">
          <div className="text-2xl font-bold tabular-nums">{withWebsite.toLocaleString()}</div>
          <div className="text-xs text-[var(--muted)]">With website</div>
        </div>
      </div>

      {estateMap.size > 0 && (
        <section className="mb-8 border border-[var(--gold-light)] rounded-2xl bg-[var(--gold-bg)]/30 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--gold-deep)] mb-3">
            🏘 Industrial Estates in {display}
          </h2>
          <div className="flex flex-wrap gap-2">
            {Array.from(estateMap.entries())
              .sort((a, b) => b[1].count - a[1].count)
              .map(([name, { slug, count }]) => (
                <a
                  key={slug}
                  href={`/estate/${slug}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--gold-light)] bg-white text-sm hover:border-[var(--gold)] hover:bg-[var(--gold-bg)] hover:text-[var(--gold-deep)] transition font-medium"
                >
                  {name} <span className="text-[var(--gold)] tabular-nums">{count}</span>
                </a>
              ))}
          </div>
        </section>
      )}

      {(() => {
        const guideSlug = CITY_TO_GUIDE[name];
        const guide = guideSlug ? findGuide(guideSlug) : null;
        if (!guide) return null;
        return (
          <a
            href={`/guide/${guide.slug}`}
            className="block mb-8 p-5 bg-[var(--gold-bg)]/40 border border-[var(--gold-light)] rounded-xl hover:border-[var(--gold)] hover:shadow-md transition group"
          >
            <div className="flex items-start gap-4">
              <div className="text-2xl shrink-0">📖</div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold uppercase tracking-widest text-[var(--gold-deep)] mb-1">
                  Buyer guide for {display}
                </div>
                <h2 className="font-bold text-lg leading-snug mb-1 group-hover:text-[var(--gold-deep)] transition">
                  {guide.title}
                </h2>
                <p className="text-sm text-[var(--muted)] line-clamp-2">{guide.metaDescription}</p>
              </div>
              <span className="text-[var(--gold-deep)] group-hover:translate-x-1 transition shrink-0 self-center text-xl">→</span>
            </div>
          </a>
        );
      })()}

      {categories.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">By Type</h2>
          <div className="flex flex-wrap gap-2">
            {categories.slice(0, 16).map(([c, n]) => (
              <a
                key={c}
                href={`/c/${c}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-[var(--gold-light)] hover:bg-[var(--gold-bg)] hover:text-[var(--gold-deep)] transition"
              >
                <span aria-hidden>{CATEGORY_ICONS[c] ?? "🏭"}</span>
                {CATEGORY_LABELS[c] ?? c}
                <span className="text-[var(--muted)] tabular-nums">{n}</span>
              </a>
            ))}
          </div>
        </section>
      )}

      {districts.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">By District</h2>
          <div className="flex flex-wrap gap-2">
            {districts.map((g) => (
              <a
                key={g.slug}
                href={`/d/${g.slug}`}
                className="px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-[var(--gold-light)] hover:bg-[var(--gold-bg)] hover:text-[var(--gold-deep)] transition"
              >
                📍 {g.display} <span className="text-[var(--muted)]">{g.count}</span>
              </a>
            ))}
          </div>
        </section>
      )}

      <AdSlot slot="city-mid" />

      <div className="mb-8">
        <SupplierAlertSignup city={display} />
      </div>

      <section>
        <h2 className="text-xl font-bold mb-4">Top {Math.min(filtered.length, 100)}</h2>
        <div className="grid gap-3">
          {filtered.slice(0, 100).map((r, i) => (
            <SupplierCard key={r.id} r={r} rank={i + 1} />
          ))}
        </div>
      </section>

      {note?.long && (
        <section className="mt-12 bg-white border border-[var(--border)] rounded-xl p-6">
          <h2 className="text-lg font-bold mb-3">About {display}</h2>
          <p className="text-sm text-[var(--muted)] leading-relaxed">{note.long}</p>
        </section>
      )}

      <div className="mt-10 flex flex-wrap gap-3 text-sm">
        <a href="/best" className="px-3 py-1.5 rounded-full border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100 transition">🏆 Curated lists →</a>
        <a href="/guide" className="px-3 py-1.5 rounded-full border border-[var(--border)] bg-white hover:border-[var(--gold-light)] hover:text-[var(--gold-deep)] transition">Buyer guides →</a>
      </div>

      {(CITY_FAQS[name] ?? []).length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold mb-4">{display} — FAQ</h2>
          <div className="space-y-3">
            {(CITY_FAQS[name] ?? []).map((f, i) => (
              <details key={i} className="bg-white border border-[var(--border)] rounded-lg p-4 group">
                <summary className="font-medium cursor-pointer flex items-center justify-between gap-3">
                  <span>{f.q}</span>
                  <span className="text-[var(--muted)] group-open:rotate-180 transition">⌄</span>
                </summary>
                <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      <CollectionPageJsonLd
        name={`${display} Suppliers Directory`}
        description={note?.hook ?? `Verified Thai suppliers in ${display}: manufacturers, warehouses, industrial estates.`}
        url={`/city/${name}`}
        numberOfItems={filtered.length}
      />
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: display, url: `/city/${name}` },
      ]} />
      <FaqJsonLd faqs={CITY_FAQS[name] ?? []} />
      <ItemListJsonLd
        name={`Top ${display} suppliers`}
        description={note?.long}
        items={filtered.slice(0, 20).map((r) => ({ name: r.name, url: `/supplier/${r.id}` }))}
      />
    </div>
  );
}
