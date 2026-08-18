import { notFound } from "next/navigation";
import { loadMasterDb, filterByCuisine } from "@/lib/data";
import { RestaurantCard } from "@/components/RestaurantCard";
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/lib/types";
import { BreadcrumbJsonLd, FaqJsonLd, ItemListJsonLd } from "@/components/JsonLd";
import { CUISINE_FAQS } from "@/lib/faq";
import { AffiliateInline, AdSlot } from "@/components/AffiliateSlot";
import { StatsBar } from "@/components/StatsBar";
import { sortWithSponsored } from "@/lib/sponsored";
import { indexableCategoryDistricts, allDistricts } from "@/lib/crawlGate";
import type { Metadata } from "next";

const VALID = new Set(Object.keys(CATEGORY_LABELS));

export async function generateStaticParams() {
  return Array.from(VALID).map((cuisine) => ({ cuisine }));
}

// CATEGORY_LABELS 는 고정 enum — 위에서 전부 열거된다. 나머지는 봇/스캐너 probe.
export const dynamicParams = false;

export async function generateMetadata(
  { params }: { params: Promise<{ cuisine: string }> }
): Promise<Metadata> {
  const { cuisine } = await params;
  const label = CATEGORY_LABELS[cuisine] ?? cuisine;
  const db2 = await loadMasterDb();
  const count2 = db2.cuisine_counts?.[cuisine] ?? 0;
  const isCourse = cuisine === "course";
  return {
    title: isCourse
      ? `Golf Courses in Thailand 2026 — ${count2 || "600"}+ Ranked by Real Reviews`
      : `Best ${label}s in Thailand 2026${count2 ? ` — ${count2} Ranked` : ""} | Thailand Golf Guide`,
    description: isCourse
      ? `Compare ${count2 || "600"}+ golf courses in Thailand ranked by real Google reviews. Bangkok, Pattaya, Hua Hin, Phuket — caddy quality, green fees & conditions verified by golfers.`
      : `Best ${label.toLowerCase()}s across Thailand ranked by Trust Score from real Google reviews. Caddy quality, course conditions, English/Korean support — verified.`,
    alternates: { canonical: `/c/${cuisine}` },
  };
}

export default async function CategoryPage(
  { params }: { params: Promise<{ cuisine: string }> }
) {
  const { cuisine } = await params;
  if (!VALID.has(cuisine)) notFound();

  const db = await loadMasterDb();
  const filtered = sortWithSponsored(filterByCuisine(db.restaurants, cuisine));
  const label = CATEGORY_LABELS[cuisine] ?? cuisine;
  const icon = CATEGORY_ICONS[cuisine] ?? "⛳";

  // City-level breakdown
  const byCity = new Map<string, number>();
  for (const r of filtered) byCity.set(r.city_label, (byCity.get(r.city_label) ?? 0) + 1);
  const cities = Array.from(byCity.entries()).sort((a, b) => b[1] - a[1]);

  // District breakdown (Bangkok 위주).
  // 게이트를 통과해 실제로 발행되는 조합만 링크한다 — 여기서 자체 임계치(예전엔 n >= 2)를
  // 쓰면 sitemap/generateStaticParams 와 어긋나 링크가 404를 가리키게 된다.
  const districts = indexableCategoryDistricts(
    db.restaurants,
    [cuisine],
    allDistricts(db.district_counts),
  )
    .map((c) => [c.district, c.count] as const)
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
        entityLabel="Courses"
      />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <nav className="text-sm text-[var(--muted)] mb-4">
          <a href="/" className="hover:text-[var(--fg)]">Home</a>
          <span className="mx-2">›</span>
          <span>{label}</span>
        </nav>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 flex items-center gap-3">
          <span>{icon}</span>
          {cuisine === "course" ? "Golf Courses in Thailand" : `${label}s in Thailand`}
        </h1>
        <p className="text-[var(--muted)] mb-8">
          {cuisine === "course"
            ? `${filtered.length} golf courses across Thailand — Bangkok, Pattaya, Hua Hin, Phuket, Chiang Mai — ranked by Trust Score from real Google reviews. Compare caddy quality, green fees & conditions.`
            : `${filtered.length} ${label.toLowerCase()}s nationwide, ranked by Trust Score from real Google reviews.`
          }
        </p>

        {cities.length > 1 && (
          <section className="mb-8">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
              By Region
            </h2>
            <div className="flex flex-wrap gap-2">
              {cities.map(([city, n]) => (
                <a
                  key={city}
                  href={`/city/${city.toLowerCase().replace(/\s+/g, "_")}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border)] text-sm bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition font-medium"
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
              <RestaurantCard key={r.id} r={r} rank={i + 1} />
            ))}
          </div>

          <AffiliateInline category={label} />
          <AdSlot slot="cuisine-mid" />

          <div className="grid gap-3 mt-3">
            {filtered.slice(10, 100).map((r, i) => (
              <RestaurantCard key={r.id} r={r} rank={i + 11} />
            ))}
          </div>

          {filtered.length > 100 && (
            <p className="mt-6 text-sm text-[var(--muted)]">
              {filtered.length - 100} more {label.toLowerCase()}s — visit region or district pages to explore.
            </p>
          )}
        </section>

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

        <BreadcrumbJsonLd items={[
          { name: "Home", url: "/" },
          { name: label, url: `/c/${cuisine}` },
        ]} />
        <FaqJsonLd faqs={CUISINE_FAQS[cuisine] ?? []} />
        <ItemListJsonLd
          name={`Top ${label}s in Thailand`}
          items={filtered.slice(0, 20).map((r) => ({ name: r.name, url: `/course/${r.id}` }))}
        />
      </div>
    </>
  );
}
