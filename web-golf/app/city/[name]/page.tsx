import { notFound } from "next/navigation";
import { loadMasterDb, filterByCity } from "@/lib/data";
import { RestaurantCard } from "@/components/RestaurantCard";
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/lib/types";
import { BreadcrumbJsonLd, ItemListJsonLd } from "@/components/JsonLd";
import { sortWithSponsored } from "@/lib/sponsored";
import { AdSlot } from "@/components/AffiliateSlot";
import type { Metadata } from "next";

function citySlug(label: string): string {
  return label.toLowerCase().replace(/\s+/g, "_");
}

export async function generateStaticParams() {
  const db = await loadMasterDb();
  return Object.keys(db.city_counts).map((label) => ({ name: citySlug(label) }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ name: string }> }
): Promise<Metadata> {
  const { name } = await params;
  const db = await loadMasterDb();
  const display =
    Object.keys(db.city_counts).find((k) => citySlug(k) === name) ??
    name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `${display} Golf Courses — Verified Reviews & Trust Scores`,
    description: `All ${display} golf courses, country clubs, and driving ranges ranked by Trust Score from real Google reviews. Caddy quality, course conditions, English/Korean support — verified.`,
    alternates: { canonical: `/city/${name}` },
  };
}

export default async function CityPage(
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const db = await loadMasterDb();

  const filtered = sortWithSponsored(filterByCity(db.restaurants, name));
  if (filtered.length === 0) notFound();

  const display = filtered[0]?.city_label ?? name.replace(/_/g, " ");

  // Categories in this city
  const catMap = new Map<string, number>();
  for (const r of filtered) {
    for (const c of r.categories) catMap.set(c, (catMap.get(c) ?? 0) + 1);
  }
  const categories = [...catMap.entries()].sort((a, b) => b[1] - a[1]);

  // Districts in this city
  const districtMap = new Map<string, number>();
  for (const r of filtered) if (r.district) districtMap.set(r.district, (districtMap.get(r.district) ?? 0) + 1);
  const districts = [...districtMap.entries()].sort((a, b) => b[1] - a[1]);

  const koCount = filtered.filter((c) => (c.language_breakdown?.ko ?? 0) > 0).length;
  const avgTrust =
    filtered.length > 0
      ? Math.round(filtered.reduce((s, c) => s + c.trust_score, 0) / filtered.length)
      : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span>{display}</span>
      </nav>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
        {display} Golf Courses
      </h1>
      <p className="text-[var(--muted)] mb-6">
        {filtered.length} courses in {display}, ranked by Trust Score from real Google reviews.
      </p>

      <div className="grid grid-cols-3 gap-3 mb-8 text-center">
        <div className="rounded-xl border border-[var(--border)] bg-white p-3">
          <div className="text-2xl font-bold tabular-nums">{filtered.length}</div>
          <div className="text-xs text-[var(--muted)]">Courses</div>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-white p-3">
          <div className="text-2xl font-bold tabular-nums">{avgTrust}</div>
          <div className="text-xs text-[var(--muted)]">Avg Trust</div>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-white p-3">
          <div className="text-2xl font-bold tabular-nums">{koCount}</div>
          <div className="text-xs text-[var(--muted)]">Korean ✓</div>
        </div>
      </div>

      {categories.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">By Type</h2>
          <div className="flex flex-wrap gap-2">
            {categories.slice(0, 16).map(([c, n]) => (
              <a
                key={c}
                href={`/c/${c}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
              >
                <span aria-hidden>{CATEGORY_ICONS[c] ?? "⛳"}</span>
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
            {districts.map(([d, n]) => (
              <a
                key={d}
                href={`/d/${d.toLowerCase().replace(/\s+/g, "-")}`}
                className="px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
              >
                📍 {d} <span className="text-[var(--muted)]">{n}</span>
              </a>
            ))}
          </div>
        </section>
      )}

      <AdSlot slot="city-mid" />

      <section>
        <h2 className="text-xl font-bold mb-4">Top {Math.min(filtered.length, 100)}</h2>
        <div className="grid gap-3">
          {filtered.slice(0, 100).map((r, i) => (
            <RestaurantCard key={r.id} r={r} rank={i + 1} />
          ))}
        </div>
      </section>

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: display, url: `/city/${name}` },
      ]} />
      <ItemListJsonLd
        name={`Top ${display} golf courses`}
        items={filtered.slice(0, 20).map((r) => ({ name: r.name, url: `/course/${r.id}` }))}
      />
    </div>
  );
}
