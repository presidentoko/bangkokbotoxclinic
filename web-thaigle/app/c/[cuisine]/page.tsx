import { notFound } from "next/navigation";
import { loadMasterDb, filterByCuisine } from "@/lib/data";
import { getSlugMap } from "@/lib/restaurants";
import { RestaurantCard } from "@/components/RestaurantCard";
import { CUISINE_LABELS, CUISINE_ICONS } from "@/lib/types";
import { BreadcrumbJsonLd, FaqJsonLd, CollectionPageJsonLd } from "@/components/JsonLd";
import { CUISINE_FAQS } from "@/lib/faq";
import { AffiliateInline, AdSlot } from "@/components/AffiliateSlot";
import { StatsBar } from "@/components/StatsBar";
import { sortWithSponsored } from "@/lib/sponsored";
import type { Metadata } from "next";

const VALID = new Set(Object.keys(CUISINE_LABELS));

export async function generateStaticParams() {
  return Array.from(VALID).map((cuisine) => ({ cuisine }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ cuisine: string }> }
): Promise<Metadata> {
  const { cuisine } = await params;
  const label = CUISINE_LABELS[cuisine] ?? cuisine;
  const db = await loadMasterDb();
  const list = filterByCuisine(db.restaurants, cuisine);
  const count = list.length;
  const totalReviews = list.reduce((s, r) => s + r.total_reviews, 0);
  return {
    title: `${count} Best ${label} Restaurants in Bangkok — Real Reviews, Not SNS Hype`,
    description: `${count} verified ${label.toLowerCase()} restaurants in Bangkok and Pattaya analyzed across ${totalReviews.toLocaleString()} Google reviews. No paid influencer rankings — just real diner data.`,
    alternates: { canonical: `/c/${cuisine}` },
    openGraph: {
      title: `${count} Best ${label} Restaurants in Bangkok`,
      description: `Independent ranking — ${totalReviews.toLocaleString()} reviews analyzed.`,
      url: `/c/${cuisine}`,
    },
  };
}

export default async function CuisinePage(
  { params }: { params: Promise<{ cuisine: string }> }
) {
  const { cuisine } = await params;
  if (!VALID.has(cuisine)) notFound();

  const [db, slugMap] = await Promise.all([loadMasterDb(), getSlugMap()]);
  const filtered = sortWithSponsored(filterByCuisine(db.restaurants, cuisine));
  const label = CUISINE_LABELS[cuisine] ?? cuisine;
  const icon = CUISINE_ICONS[cuisine] ?? "🍴";

  // 도시별 group
  const byCity = new Map<string, number>();
  for (const r of filtered) byCity.set(r.city_label, (byCity.get(r.city_label) ?? 0) + 1);

  // 지역별 group (방콕 위주)
  const byDistrict = new Map<string, number>();
  for (const r of filtered) {
    if (!r.district) continue;
    byDistrict.set(r.district, (byDistrict.get(r.district) ?? 0) + 1);
  }
  const districts = Array.from(byDistrict.entries())
    .filter(([, n]) => n >= 3)
    .sort((a, b) => b[1] - a[1]);

  const totalReviews = filtered.reduce((s, r) => s + r.total_reviews, 0);
  const withScraped = filtered.filter((r) => r.scraped_review_count > 0).length;

  return (
    <>
      <StatsBar
        generatedAt={db.generated_at}
        totalClinics={filtered.length}
        totalReviews={totalReviews}
        withScraped={withScraped}
        entityLabel="Restaurants"
      />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <nav className="text-sm text-[var(--muted)] mb-4">
          <a href="/" className="hover:text-[var(--fg)]">Home</a>
          <span className="mx-2">›</span>
          <span>{label}</span>
        </nav>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 flex items-center gap-3">
          <span>{icon}</span>
          {label} Restaurants
        </h1>
        <p className="text-[var(--muted)] mb-8">
          {filtered.length} restaurants in Bangkok and Pattaya, ranked by Trust Score from real Google reviews.
        </p>

        {districts.length > 0 && (
          <section className="mb-10">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
              {label} by District
            </h2>
            <div className="flex flex-wrap gap-2">
              {districts.map(([d, n]) => (
                <a
                  key={d}
                  href={`/c/${cuisine}/${d.toLowerCase().replace(/\s+/g, "-")}`}
                  className="px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
                >
                  {label} in {d} <span className="text-[var(--muted)]">{n}</span>
                </a>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-xl font-bold mb-4">Top {Math.min(filtered.length, 100)}</h2>
          <div className="grid gap-3">
            {filtered.slice(0, 10).map((r, i) => (
              <RestaurantCard key={r.id} r={r} rank={i + 1} slugMap={slugMap} />
            ))}
          </div>

          <AffiliateInline category={label} />
          <AdSlot slot="cuisine-mid" />

          <div className="grid gap-3 mt-3">
            {filtered.slice(10, 100).map((r, i) => (
              <RestaurantCard key={r.id} r={r} rank={i + 11} slugMap={slugMap} />
            ))}
          </div>

          {filtered.length > 100 && (
            <p className="mt-6 text-sm text-[var(--muted)]">
              {filtered.length - 100} more restaurants — visit district pages to explore.
            </p>
          )}
        </section>

        {(CUISINE_FAQS[cuisine] ?? []).length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold mb-4">{label} restaurants — FAQ</h2>
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

        <BreadcrumbJsonLd items={[
          { name: "Home", url: "/" },
          { name: label, url: `/c/${cuisine}` },
        ]} />
        <FaqJsonLd faqs={CUISINE_FAQS[cuisine] ?? []} />
        <CollectionPageJsonLd
          name={`Top ${label} Restaurants in Bangkok`}
          description={`${filtered.length} verified ${label.toLowerCase()} restaurants ranked by Trust Score from Google review analysis.`}
          url={`/c/${cuisine}`}
          items={filtered}
          slugMap={slugMap}
        />
      </div>
    </>
  );
}
