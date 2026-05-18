import { notFound } from "next/navigation";
import { loadMasterDb, filterByCategory } from "@/lib/data";
import { SupplierCard } from "@/components/SupplierCard";
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/lib/types";
import { BreadcrumbJsonLd, FaqJsonLd, ItemListJsonLd, CollectionPageJsonLd } from "@/components/JsonLd";
import { CUISINE_FAQS } from "@/lib/faq";
import { CATEGORY_INTROS, CATEGORY_TO_GUIDE } from "@/lib/categoryIntros";
import { findGuide } from "@/lib/guides";
import { AffiliateInline, AdSlot } from "@/components/AffiliateSlot";
import { sortWithSponsored } from "@/lib/sponsored";
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
    alternates: {
      canonical: `/c/${cuisine}`,
      languages: {
        "en-US": `/c/${cuisine}`,
        "ko-KR": `/ko/c/${cuisine}`,
        "th-TH": `/th/c/${cuisine}`,
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

  // City-level breakdown
  const byCity = new Map<string, number>();
  for (const r of filtered) byCity.set(r.city_label, (byCity.get(r.city_label) ?? 0) + 1);
  const cities = Array.from(byCity.entries()).sort((a, b) => b[1] - a[1]);

  // District breakdown
  const byDistrict = new Map<string, number>();
  for (const r of filtered) {
    if (!r.district) continue;
    byDistrict.set(r.district, (byDistrict.get(r.district) ?? 0) + 1);
  }
  const districts = Array.from(byDistrict.entries())
    .filter(([, n]) => n >= 2)
    .sort((a, b) => b[1] - a[1]);

  const totalReviews = filtered.reduce((s, r) => s + r.total_reviews, 0);
  const withWebsite = filtered.filter((r) => r.website).length;

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
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full font-medium tabular-nums">
            {filtered.length.toLocaleString()} suppliers
          </span>
          <span className="bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full font-medium tabular-nums">
            {totalReviews.toLocaleString()} reviews analyzed
          </span>
          <span className="bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full font-medium tabular-nums">
            {withWebsite.toLocaleString()} with direct website
          </span>
        </div>
      </header>

      {(() => {
        const guideSlug = CATEGORY_TO_GUIDE[cuisine];
        const guide = guideSlug ? findGuide(guideSlug) : null;
        if (!guide) return null;
        return (
          <a
            href={`/guide/${guide.slug}`}
            className="block mb-8 p-5 bg-emerald-50/40 border border-emerald-200 rounded-xl hover:border-emerald-400 hover:shadow-md transition group"
          >
            <div className="flex items-start gap-4">
              <div className="text-2xl shrink-0">📖</div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold uppercase tracking-widest text-emerald-700 mb-1">
                  Read the buyer guide
                </div>
                <h2 className="font-bold text-lg leading-snug mb-1 group-hover:text-emerald-700 transition">
                  {guide.title}
                </h2>
                <p className="text-sm text-[var(--muted)] line-clamp-2">{guide.metaDescription}</p>
              </div>
              <span className="text-emerald-700 group-hover:translate-x-1 transition shrink-0 self-center text-xl">→</span>
            </div>
          </a>
        );
      })()}

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
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border)] text-sm bg-white hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 transition font-medium"
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
                className="px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 transition"
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
            <SupplierCard key={r.id} r={r} rank={i + 1} />
          ))}
        </div>

        <AffiliateInline category={label} />
        <AdSlot slot="category-mid" />

        <div className="grid gap-3 mt-3">
          {filtered.slice(10, 100).map((r, i) => (
            <SupplierCard key={r.id} r={r} rank={i + 11} />
          ))}
        </div>

        {filtered.length > 100 && (
          <p className="mt-6 text-sm text-[var(--muted)]">
            {filtered.length - 100} more {label.toLowerCase()} suppliers — narrow by region or district above.
          </p>
        )}
      </section>

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
