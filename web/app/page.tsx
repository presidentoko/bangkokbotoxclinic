import { loadMasterDb, topByTrust } from "@/lib/data";
import { ClinicCard } from "@/components/ClinicCard";
import { CATEGORY_LABELS } from "@/lib/types";
import { FaqJsonLd, ItemListJsonLd } from "@/components/JsonLd";
import { HOME_FAQS, CATEGORY_FAQS } from "@/lib/faq";
import { AffiliateInline } from "@/components/AffiliateSlot";
import { BookingForm } from "@/components/BookingForm";
import { HeroSearch } from "@/components/HeroSearch";
import { StatsBar } from "@/components/StatsBar";
import { CategoryIcon } from "@/components/CategoryIcon";
import { SponsoredHero } from "@/components/SponsoredHero";
import { sortWithSponsored, sponsoredTier } from "@/lib/sponsored";
import { getSiteConfig, applySiteFilter } from "@/lib/site";

export const dynamic = "force-static";

export default async function HomePage() {
  const cfg = getSiteConfig();
  const db = await loadMasterDb();
  const focused = applySiteFilter(db.clinics, cfg);
  const top = sortWithSponsored(topByTrust(focused, 50));

  const totalReviews = focused.reduce((s, c) => s + c.total_reviews, 0);
  const withScraped = focused.filter((c) => c.scraped_review_count > 0).length;

  const districtMap = new Map<string, number>();
  for (const c of focused) {
    if (c.district) districtMap.set(c.district, (districtMap.get(c.district) ?? 0) + 1);
  }
  const districts = [...districtMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12);

  const categoryMap = new Map<string, number>();
  for (const c of focused) {
    for (const cat of c.categories) categoryMap.set(cat, (categoryMap.get(cat) ?? 0) + 1);
  }
  const categories = [...categoryMap.entries()].sort((a, b) => b[1] - a[1]);

  const homeFaqs = cfg.focus !== "all" && CATEGORY_FAQS[cfg.focus]
    ? [...CATEGORY_FAQS[cfg.focus], ...HOME_FAQS]
    : HOME_FAQS;

  // 인기 검색 — 포커스 카테고리 + 상위 지역 조합
  const popularSearches = [
    ...(cfg.focus !== "all"
      ? districts.slice(0, 3).map(([d]) => ({
          label: `${cfg.focus} in ${d}`,
          href: `/c/${cfg.focus}/${d.toLowerCase().replace(/\s+/g, "-")}`,
        }))
      : categories.slice(0, 4).map(([cat]) => ({
          label: CATEGORY_LABELS[cat] ?? cat,
          href: `/c/${cat}`,
        }))),
  ];

  // 검색바용 가벼운 클리닉 리스트
  const searchIndex = focused.map((c) => ({
    id: c.id,
    name: c.name,
    district: c.district,
    rating: c.rating,
    trust_score: c.trust_score,
  }));

  return (
    <>
      <HeroSearch
        clinics={searchIndex}
        hero={cfg.hero}
        heroSub={`${focused.length.toLocaleString()} clinics · ${totalReviews.toLocaleString()} Google reviews analyzed.`}
        popularSearches={popularSearches}
      />

      <StatsBar
        generatedAt={db.generated_at}
        totalClinics={focused.length}
        totalReviews={totalReviews}
        withScraped={withScraped}
        label="Verified by reviews"
      />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {(() => {
          const hero = top.find((c) => sponsoredTier(c.id));
          return hero ? <SponsoredHero c={hero} /> : null;
        })()}

        {/* Featured top 3 — 큰 카드 */}
        {top.length >= 3 && (
          <section className="mb-10">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-4">
              Featured this week
            </h2>
            <div className="grid md:grid-cols-3 gap-3">
              {top.slice(0, 3).map((c, i) => (
                <a
                  key={c.id}
                  href={`/clinic/${c.id}`}
                  className="group block border border-[var(--border)] rounded-xl p-5 bg-white hover:shadow-md hover:border-gray-300 transition relative"
                >
                  <div className="text-xs font-bold tabular-nums text-[var(--muted)] mb-2">
                    #{i + 1}
                  </div>
                  <h3 className="font-bold text-base group-hover:text-[var(--accent)] transition">
                    {c.name}
                  </h3>
                  <p className="text-sm text-[var(--muted)] mt-0.5">{c.district}</p>
                  <div className="flex items-baseline gap-3 mt-3">
                    <span className="text-2xl font-bold tabular-nums" style={{
                      color: c.trust_score >= 75 ? "#16a34a" : c.trust_score >= 60 ? "#059669" : "#ca8a04"
                    }}>
                      {c.trust_score.toFixed(0)}
                    </span>
                    <span className="text-xs text-[var(--muted)] uppercase tracking-wide">Trust</span>
                    <span className="text-xs text-[var(--muted)] ml-auto">★ {c.rating.toFixed(1)}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {c.categories.slice(0, 2).map((cat) => (
                      <span key={cat} className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                        <CategoryIcon category={cat} size={11} />
                        {CATEGORY_LABELS[cat] ?? cat}
                      </span>
                    ))}
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {categories.length > 0 && (
          <section className="mb-10">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
              By Service
            </h2>
            <div className="flex flex-wrap gap-2">
              {categories.map(([cat, count]) => (
                <a
                  key={cat}
                  href={`/c/${cat}`}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
                >
                  <CategoryIcon category={cat} size={14} />
                  {CATEGORY_LABELS[cat] ?? cat}
                  <span className="text-[var(--muted)] tabular-nums">{count}</span>
                </a>
              ))}
            </div>
          </section>
        )}

        <section className="mb-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">By District</h2>
          <div className="flex flex-wrap gap-2">
            {districts.map(([d, count]) => (
              <a
                key={d}
                href={`/d/${encodeURIComponent(d.toLowerCase().replace(/\s+/g, "-"))}`}
                className="px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
              >
                📍 {d} <span className="text-[var(--muted)] tabular-nums">{count}</span>
              </a>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">Top {Math.min(top.length, 50)} by Trust Score</h2>
          <div className="grid gap-3">
            {top.slice(0, 10).map((c, i) => (
              <ClinicCard key={c.id} clinic={c} rank={i + 1} />
            ))}
          </div>

          <AffiliateInline />

          <div className="grid gap-3 mt-3">
            {top.slice(10).map((c, i) => (
              <ClinicCard key={c.id} clinic={c} rank={i + 11} />
            ))}
          </div>
        </section>

        <section className="mt-12">
          <BookingForm />
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-bold mb-4">Frequently asked</h2>
          <div className="space-y-3">
            {homeFaqs.map((f, i) => (
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

        <FaqJsonLd faqs={homeFaqs} />
        <ItemListJsonLd
          name={`Top ${cfg.brand} by Trust Score`}
          items={top.slice(0, 20).map((c) => ({
            name: c.name,
            url: `/clinic/${c.id}`,
          }))}
        />
      </div>
    </>
  );
}
