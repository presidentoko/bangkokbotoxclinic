import { notFound } from "next/navigation";
import { loadMasterDb, isClinicLike } from "@/lib/data";
import { ClinicCard } from "@/components/ClinicCard";
import { ClinicCardCompact } from "@/components/ClinicCardCompact";
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/components/JsonLd";
import { AffiliateInline } from "@/components/AffiliateSlot";
import { CATEGORY_LABELS } from "@/lib/types";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const db = await loadMasterDb();
  return Object.keys(db.city_counts).map((label) => {
    const clinic = db.clinics.find((c) => c.city_label === label);
    return { city: clinic?.city_slug ?? label.toLowerCase().replace(/\s+/g, "-") };
  });
}

export async function generateMetadata(
  { params }: { params: Promise<{ city: string }> }
): Promise<Metadata> {
  const { city } = await params;
  const db = await loadMasterDb();
  const list = db.clinics.filter((c) => c.city_slug === city);
  const clinic = list[0];
  const cityLabel = clinic?.city_label ?? city;
  const count = list.length;
  const totalReviews = list.reduce((s, c) => s + c.total_reviews, 0);
  const title = `${count} Clinics in ${cityLabel} — Verified by Reviews`;
  const description = `${count} verified clinics in ${cityLabel}, Thailand analyzed across ${totalReviews.toLocaleString()} Google reviews. Trust Score, reviewer credibility, district options.`;
  const robots = count < 5 ? { index: false, follow: true } : undefined;
  return {
    title,
    description,
    alternates: { canonical: `/city/${city}` },
    ...(robots && { robots }),
    openGraph: { title, description, url: `/city/${city}` },
  };
}

export default async function CityPage(
  { params }: { params: Promise<{ city: string }> }
) {
  const { city } = await params;
  const db = await loadMasterDb();

  const filtered = db.clinics
    .filter((c) => c.city_slug === city && isClinicLike(c))
    .sort((a, b) => b.trust_score - a.trust_score);

  if (filtered.length === 0) notFound();
  const cityLabel = filtered[0].city_label;

  // 도시 안에서 카테고리 분포
  const categoryMap = new Map<string, number>();
  for (const c of filtered) {
    for (const cat of c.categories) categoryMap.set(cat, (categoryMap.get(cat) ?? 0) + 1);
  }
  const topCategories = [...categoryMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);

  // 지역별 분포 (3개 이상 클리닉 있는 district만)
  const districtMap = new Map<string, { count: number; slug: string }>();
  for (const c of filtered) {
    if (!c.district) continue;
    const slug = c.district.toLowerCase().replace(/\s+/g, "-");
    const prev = districtMap.get(c.district) ?? { count: 0, slug };
    districtMap.set(c.district, { count: prev.count + 1, slug });
  }
  const topDistricts = [...districtMap.entries()]
    .filter(([, v]) => v.count >= 3)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 12);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span>{cityLabel}</span>
      </nav>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
        Clinics in {cityLabel}
      </h1>
      <p className="text-[var(--muted)] mb-8">
        {filtered.length} verified clinics across {topCategories.length} services in {cityLabel}, Thailand.
      </p>

      {topCategories.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">Popular services in {cityLabel}</h2>
          <div className="flex flex-wrap gap-2">
            {topCategories.map(([cat, n]) => (
              <a
                key={cat}
                href={`/c/${cat}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
              >
                {CATEGORY_LABELS[cat] ?? cat}
                <span className="text-[var(--muted)] tabular-nums">{n}</span>
              </a>
            ))}
          </div>
        </section>
      )}

      {topDistricts.length > 0 && (
        <section className="mb-8 p-4 rounded-xl border border-[var(--border)] bg-white">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">Browse by district</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {topDistricts.map(([district, { count: n, slug }]) => (
              <a
                key={district}
                href={`/d/${slug}`}
                className="flex items-center justify-between px-3 py-2 rounded-lg border border-[var(--border)] text-sm bg-[var(--bg)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
              >
                <span className="truncate">📍 {district}</span>
                <span className="ml-2 shrink-0 tabular-nums text-xs text-[var(--muted)]">{n}</span>
              </a>
            ))}
          </div>
        </section>
      )}

      <div className="grid gap-3">
        {filtered.slice(0, 10).map((c, i) => (
          <ClinicCard key={c.id} clinic={c} rank={i + 1} />
        ))}
      </div>
      <AffiliateInline />
      {filtered.length > 10 && (
        <div className="mt-8">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--muted)] mb-3">
            #11 – #{Math.min(filtered.length, 50)} · runner-up rankings
          </h3>
          <div className="grid gap-1.5">
            {filtered.slice(10, 50).map((c, i) => (
              <ClinicCardCompact key={c.id} clinic={c} rank={i + 11} />
            ))}
          </div>
        </div>
      )}

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: cityLabel, url: `/city/${city}` },
      ]} />
      <CollectionPageJsonLd
        name={`Clinics in ${cityLabel}`}
        description={`${filtered.length} verified clinics in ${cityLabel}, Thailand ranked by Trust Score.`}
        url={`/city/${city}`}
        items={filtered}
      />
    </div>
  );
}
