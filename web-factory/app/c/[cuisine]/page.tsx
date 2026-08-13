import { notFound } from "next/navigation";
import { loadMasterDb, filterByCategory } from "@/lib/data";
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/lib/types";
import { BreadcrumbJsonLd, FaqJsonLd, ItemListJsonLd, CollectionPageJsonLd } from "@/components/JsonLd";
import { CUISINE_FAQS } from "@/lib/faq";
import { CATEGORY_INTROS, CATEGORY_TO_GUIDE } from "@/lib/categoryIntros";
import { findGuide } from "@/lib/guides";
import { districtCategoryCombos, districtBySlug, MIN_COMBO_SUPPLIERS } from "@/lib/districts";
import { AdSlot } from "@/components/AffiliateSlot";
import { sortWithSponsored } from "@/lib/sponsored";
import { DbdRegistryTable } from "@/components/DbdRegistryTable";
import { computeTrustScore } from "@/lib/trustScore";
import { SupplierListWithFilter, type FilterableSupplier } from "@/components/SupplierListWithFilter";
import { SupplierAlertSignup } from "@/components/SupplierAlertSignup";
import { citySlugFromDisplay } from "@/lib/cityNorm";
import { TH_CATEGORY_VALID } from "@/lib/thBuildSets";
import type { Metadata } from "next";

const VALID = new Set(Object.keys(CATEGORY_LABELS));

export const dynamicParams = false;

export async function generateStaticParams() {
  return Array.from(VALID).map((cuisine) => ({ cuisine }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ cuisine: string }> }
): Promise<Metadata> {
  const { cuisine } = await params;
  const intro = CATEGORY_INTROS[cuisine];
  const label = CATEGORY_LABELS[cuisine] ?? cuisine;
  return {
    title: intro?.metaTitle ?? `${label} in Thailand — Verified B2B Directory`,
    description: intro?.metaDescription ??
      `Verified Thai ${label.toLowerCase()} suppliers ranked by Trust Score from real Google reviews. Direct contact, no sourcing-agent markup.`,
    keywords: [
      `${label} Thailand`,
      `Thai ${label.toLowerCase()}`,
      `${label.toLowerCase()} suppliers Thailand`,
      "B2B supplier directory Thailand",
      "DBD verified",
      "direct contact no agent",
    ],
    alternates: {
      canonical: `/c/${cuisine}`,
      languages: {
        "en-US": `/c/${cuisine}`,
        "ko-KR": `/ko/c/${cuisine}`,
        // /th/c/[cuisine] only prerenders TH_CATEGORY_VALID (dynamicParams=false) —
        // emitting this for every category would hreflang-link to a 404 for most.
        ...(TH_CATEGORY_VALID.has(cuisine) ? { "th-TH": `/th/c/${cuisine}` } : {}),
        "x-default": `/c/${cuisine}`,
      },
    },
  };
}

export default async function CategoryPage(
  { params }: { params: Promise<{ cuisine: string }> }
) {
  const { cuisine } = await params;
  if (!VALID.has(cuisine)) notFound();

  const db = await loadMasterDb();
  const filtered = sortWithSponsored(filterByCategory(db.suppliers, cuisine));
  const label = CATEGORY_LABELS[cuisine] ?? cuisine;
  const icon = CATEGORY_ICONS[cuisine] ?? "🏭";
  const intro = CATEGORY_INTROS[cuisine];

  // Cities that actually have a generated /city/{slug} page — some suppliers
  // carry a city_label that was never aggregated into db.city_counts (the
  // source generateStaticParams uses for /city/[name]), so filtering here
  // avoids dead links both in the "By Region" pills and the filter dropdown.
  const validCities = new Set(Object.keys(db.city_counts));

  // City-level breakdown
  const byCity = new Map<string, number>();
  for (const r of filtered) {
    if (!validCities.has(r.city_label)) continue;
    byCity.set(r.city_label, (byCity.get(r.city_label) ?? 0) + 1);
  }
  const cities = Array.from(byCity.entries()).sort((a, b) => b[1] - a[1]);

  // District breakdown — only districts with an actually-built /c/<cat>/<district> page.
  const combos = districtCategoryCombos(db);
  const districts = Array.from(combos.entries())
    .filter(([k, n]) => k.startsWith(`${cuisine}::`) && n >= MIN_COMBO_SUPPLIERS)
    .map(([k, n]) => {
      const slug = k.slice(cuisine.length + 2);
      const group = districtBySlug(db, slug);
      return group ? { slug, display: group.display, count: n } : null;
    })
    .filter((d): d is { slug: string; display: string; count: number } => d !== null)
    .sort((a, b) => b.count - a.count);

  const totalReviews = filtered.reduce((s, r) => s + r.total_reviews, 0);
  const withWebsite = filtered.filter((r) => r.website).length;
  const verifiedCount = filtered.filter((r) => r.verified).length;
  const avgTrust =
    filtered.length > 0
      ? Math.round(filtered.reduce((s, r) => s + (r.trust_score ?? 0), 0) / filtered.length)
      : 0;

  // 필터 컴포넌트용 초기 데이터 — 상위 100건만. 나머지는 컴포넌트가
  // browse-index.json 에서 받아 lockedCategory 로 다시 좁힌다.
  // trust_score 는 computeTrustScore 로 계산 — 원래 raw s.trust_score 를 썼는데
  // 홈/browse-index 는 composite 를 쓰고 있어서 같은 업체가 페이지마다 다른
  // 점수로 보이던 불일치가 있었다.
  const filterableSuppliers: FilterableSupplier[] = filtered.slice(0, 100).map((s) => ({
    id: s.id,
    name: s.name,
    city_label: s.city_label,
    district: s.district ?? null,
    categories: s.categories,
    dbd: !!s.dbd,
    trust_score: computeTrustScore(s).overall,
  }));
  const cityOptions = Array.from(
    new Set(filtered.map((s) => s.city_label).filter((c) => c && validCities.has(c))),
  ).sort();

  // For industrial_estate: group by estate
  const byEstate = new Map<string, { slug: string; count: number }>();
  if (cuisine === "industrial_estate") {
    for (const r of filtered) {
      if (r.estate_name && r.estate_slug) {
        const entry = byEstate.get(r.estate_name) ?? { slug: r.estate_slug, count: 0 };
        entry.count++;
        byEstate.set(r.estate_name, entry);
      }
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span>{label}</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 flex items-center gap-3">
          <span aria-hidden>{icon}</span>
          <span>{intro?.title ?? `${label} in Thailand`}</span>
        </h1>
        <p className="text-[var(--muted)] leading-relaxed mb-4 text-balance">
          {intro?.intro ??
            `${filtered.length.toLocaleString()} verified ${label.toLowerCase()} suppliers across Thailand. Ranked by Trust Score from public Google review analysis.`}
        </p>
        {cities.length > 0 && (
          <p className="text-[var(--muted)] leading-relaxed mb-4 text-sm">
            Thailand has {filtered.length.toLocaleString()} listed {label.toLowerCase()} suppliers with an average Trust Score of {avgTrust}/100
            {verifiedCount > 0 ? `, ${verifiedCount.toLocaleString()} of which are DBD-verified` : ""}.
            The largest concentration is in {cities[0][0]} ({cities[0][1].toLocaleString()} suppliers)
            {cities[1] ? `, followed by ${cities[1][0]} (${cities[1][1].toLocaleString()})` : ""}.
          </p>
        )}
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="bg-[var(--gold-bg)] text-[var(--gold-deep)] px-2.5 py-1 rounded-full font-medium tabular-nums">
            {filtered.length.toLocaleString()} suppliers
          </span>
          {verifiedCount > 0 && (
            <span className="bg-[var(--gold)] text-white px-2.5 py-1 rounded-full font-medium tabular-nums">
              ✓ {verifiedCount.toLocaleString()} DBD-verified
            </span>
          )}
          <span className="bg-[var(--gold-bg)] text-[var(--gold-deep)] px-2.5 py-1 rounded-full font-medium tabular-nums">
            {totalReviews.toLocaleString()} reviews analyzed
          </span>
          <span className="bg-[var(--gold-bg)] text-[var(--gold-deep)] px-2.5 py-1 rounded-full font-medium tabular-nums">
            {withWebsite.toLocaleString()} with direct website
          </span>
          {intro?.bestForSlug && (
            <a href={`/best/${intro.bestForSlug}`}
               className="bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full font-medium hover:bg-amber-100 transition">
              🏆 See ranked list →
            </a>
          )}
        </div>
      </header>

      {(() => {
        const guideSlug = CATEGORY_TO_GUIDE[cuisine];
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
                  Read the buyer guide
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

      {byEstate.size > 0 && (
        <section className="mb-8 border border-[var(--gold-light)] rounded-2xl bg-[var(--gold-bg)]/30 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--gold-deep)] mb-3">
            🏘 Browse by Estate
          </h2>
          <div className="flex flex-wrap gap-2">
            {Array.from(byEstate.entries())
              .sort((a, b) => b[1].count - a[1].count)
              .map(([name, { slug, count }]) => (
                <a
                  key={slug}
                  href={`/estate/${slug}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--gold-light)] bg-white text-sm hover:border-[var(--gold)] hover:bg-[var(--gold-bg)] hover:text-[var(--gold-deep)] transition font-medium"
                >
                  {name}
                  <span className="text-[var(--gold)] tabular-nums">{count}</span>
                </a>
              ))}
          </div>
        </section>
      )}

      {cities.length > 1 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
            By Region
          </h2>
          <div className="flex flex-wrap gap-2">
            {cities.map(([city, n]) => (
              <a
                key={city}
                href={`/city/${citySlugFromDisplay(city)}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border)] text-sm bg-white hover:border-[var(--gold-light)] hover:bg-[var(--gold-bg)] hover:text-[var(--gold-deep)] transition font-medium"
              >
                {city}
                <span className="text-[var(--muted)] tabular-nums">{n}</span>
              </a>
            ))}
          </div>
        </section>
      )}

      {districts.length > 0 && (
        <section className="mb-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
            {label} by District
          </h2>
          <div className="flex flex-wrap gap-2">
            {districts.map((d) => (
              <a
                key={d.slug}
                href={`/c/${cuisine}/${d.slug}`}
                className="px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-[var(--gold-light)] hover:bg-[var(--gold-bg)] hover:text-[var(--gold-deep)] transition"
              >
                {label} in {d.display} <span className="text-[var(--muted)]">{d.count}</span>
              </a>
            ))}
          </div>
        </section>
      )}

      <AdSlot slot="category-mid" />

      <div className="mb-8">
        <SupplierAlertSignup category={label} />
      </div>

      <section>
        <h2 className="text-xl font-bold mb-4">Top {label} by Trust Score</h2>
        <SupplierListWithFilter
          initialSuppliers={filterableSuppliers}
          lockedCategory={cuisine}
          categoryOptions={[]}
          cityOptions={cityOptions}
          totalSuppliers={filtered.length}
          viewAllHref={`/c/${cuisine}`}
        />
      </section>

      <DbdRegistryTable suppliers={filtered} label={label} locale="en" />

      {intro?.longContext && (
        <section className="mt-12 bg-white border border-[var(--border)] rounded-xl p-6">
          <h2 className="text-lg font-bold mb-3">About this directory</h2>
          <p className="text-sm text-[var(--muted)] leading-relaxed">{intro.longContext}</p>
        </section>
      )}

      {(CUISINE_FAQS[cuisine] ?? []).length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold mb-4">{label} — FAQ</h2>
          <div className="space-y-3">
            {(CUISINE_FAQS[cuisine] ?? []).map((f, i) => (
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
        name={intro?.metaTitle ?? `${label} in Thailand`}
        description={intro?.metaDescription ??
          `Verified Thai ${label.toLowerCase()} suppliers ranked by Trust Score from real Google reviews.`}
        url={`/c/${cuisine}`}
        numberOfItems={filtered.length}
      />
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: label, url: `/c/${cuisine}` },
      ]} />
      <FaqJsonLd faqs={CUISINE_FAQS[cuisine] ?? []} />
      <ItemListJsonLd
        name={`Top ${label} in Thailand`}
        description={intro?.intro}
        items={filtered.slice(0, 20).map((r) => ({ name: r.name, url: `/supplier/${r.id}` }))}
      />
    </div>
  );
}
