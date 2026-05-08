import { notFound } from "next/navigation";
import { loadMasterDb, filterByCategory } from "@/lib/data";
import { ClinicCard } from "@/components/ClinicCard";
import { CATEGORY_LABELS } from "@/lib/types";
import { BreadcrumbJsonLd, FaqJsonLd, ItemListJsonLd, CollectionPageJsonLd } from "@/components/JsonLd";
import { CATEGORY_FAQS } from "@/lib/faq";
import { AffiliateInline } from "@/components/AffiliateSlot";
import { BookingForm } from "@/components/BookingForm";
import { StatsBar } from "@/components/StatsBar";
import { CategoryIcon } from "@/components/CategoryIcon";
import type { Metadata } from "next";

const VALID = new Set(["botox", "filler", "hifu", "facial", "laser", "dental", "hair_transplant", "eye"]);

export async function generateStaticParams() {
  return Array.from(VALID).map((service) => ({ service }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ service: string }> }
): Promise<Metadata> {
  const { service } = await params;
  const label = CATEGORY_LABELS[service] ?? service;
  const db = await loadMasterDb();
  const count = db.clinics.filter((c) => c.categories.includes(service)).length;
  const totalReviews = db.clinics
    .filter((c) => c.categories.includes(service))
    .reduce((s, c) => s + c.total_reviews, 0);
  return {
    title: `${count} Best ${label} Clinics in Bangkok — Trust Score Ranking`,
    description: `${count} verified ${label.toLowerCase()} clinics in Bangkok analyzed across ${totalReviews.toLocaleString()} Google reviews. Compare trust scores, reviewer credibility, and district options.`,
    alternates: { canonical: `/c/${service}` },
    openGraph: {
      title: `${count} Best ${label} Clinics in Bangkok`,
      description: `Independent ranking — ${totalReviews.toLocaleString()} reviews analyzed.`,
      url: `/c/${service}`,
    },
  };
}

export default async function ServicePage(
  { params }: { params: Promise<{ service: string }> }
) {
  const { service } = await params;
  if (!VALID.has(service)) notFound();

  const db = await loadMasterDb();
  const filtered = filterByCategory(db.clinics, service)
    .sort((a, b) => b.trust_score - a.trust_score);
  const label = CATEGORY_LABELS[service] ?? service;

  // 지역별 group: 최소 3 클리닉 있는 지역만
  const byDistrict = new Map<string, number>();
  for (const c of filtered) {
    if (!c.district) continue;
    byDistrict.set(c.district, (byDistrict.get(c.district) ?? 0) + 1);
  }
  const districts = Array.from(byDistrict.entries())
    .filter(([, n]) => n >= 3)
    .sort((a, b) => b[1] - a[1]);

  const totalReviews = filtered.reduce((s, c) => s + c.total_reviews, 0);
  const withScraped = filtered.filter((c) => c.scraped_review_count > 0).length;

  return (
    <>
      <StatsBar
        generatedAt={db.generated_at}
        totalClinics={filtered.length}
        totalReviews={totalReviews}
        withScraped={withScraped}
        entityLabel="Clinics"
      />
    <div className="max-w-5xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span>{label}</span>
      </nav>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 flex items-center gap-3">
        <CategoryIcon category={service} size={32} />
        {label} Clinics in Bangkok
      </h1>
      <p className="text-[var(--muted)] mb-8">
        {filtered.length} clinics ranked by Trust Score. Categorisation derived from Google review text and clinic listing data.
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
                href={`/c/${service}/${d.toLowerCase().replace(/\s+/g, "-")}`}
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
          {filtered.slice(0, 10).map((c, i) => (
            <ClinicCard key={c.id} clinic={c} rank={i + 1} />
          ))}
        </div>

        <AffiliateInline category={label} />

        <div className="grid gap-3 mt-3">
          {filtered.slice(10, 100).map((c, i) => (
            <ClinicCard key={c.id} clinic={c} rank={i + 11} />
          ))}
        </div>

        {filtered.length > 100 && (
          <p className="mt-6 text-sm text-[var(--muted)]">
            {filtered.length - 100} more clinics available — visit district pages to explore.
          </p>
        )}
      </section>

      <div className="my-8">
        <BookingForm defaultService={service} />
      </div>

      {(CATEGORY_FAQS[service] ?? []).length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold mb-4">{label} in Bangkok — FAQ</h2>
          <div className="space-y-4">
            {(CATEGORY_FAQS[service] ?? []).map((f, i) => (
              <details key={i} className="bg-white border border-[var(--border)] rounded-lg p-4">
                <summary className="font-medium cursor-pointer">{f.q}</summary>
                <p className="mt-2 text-sm text-[var(--muted)]">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: label, url: `/c/${service}` },
      ]} />
      <FaqJsonLd faqs={CATEGORY_FAQS[service] ?? []} />
      <CollectionPageJsonLd
        name={`Top ${label} Clinics in Bangkok`}
        description={`${filtered.length} verified ${label.toLowerCase()} clinics in Bangkok ranked by Trust Score from Google review analysis.`}
        url={`/c/${service}`}
        items={filtered}
      />
    </div>
    </>
  );
}
