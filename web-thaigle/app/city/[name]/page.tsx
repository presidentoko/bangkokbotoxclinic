import { notFound } from "next/navigation";
import { loadMasterDb, filterByCity } from "@/lib/data";
import { RestaurantCard } from "@/components/RestaurantCard";
import { CUISINE_LABELS, CUISINE_ICONS } from "@/lib/types";
import { BreadcrumbJsonLd, ItemListJsonLd } from "@/components/JsonLd";
import { sortWithSponsored } from "@/lib/sponsored";
import { AdSlot } from "@/components/AffiliateSlot";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const db = await (await import("@/lib/data")).loadMasterDb();
  return Object.keys(db.city_counts).map((name) => ({ name }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ name: string }> }
): Promise<Metadata> {
  const { name } = await params;
  const display = name.charAt(0).toUpperCase() + name.slice(1);
  return {
    title: `${display} Restaurants — Verified Reviews & Trust Scores`,
    description: `All ${display} restaurants ranked by Trust Score from real Google review analysis.`,
    alternates: { canonical: `/city/${name}` },
  };
}

export default async function CityPage(
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const db = await loadMasterDb();
  if (!(name in db.city_counts)) notFound();
  const filtered = sortWithSponsored(filterByCity(db.restaurants, name));
  const display = filtered[0]?.city_label ?? (name.charAt(0).toUpperCase() + name.slice(1));

  // Cuisines in this city
  const cuisineMap = new Map<string, number>();
  for (const r of filtered) {
    for (const c of r.cuisines) cuisineMap.set(c, (cuisineMap.get(c) ?? 0) + 1);
  }
  const cuisines = [...cuisineMap.entries()].sort((a, b) => b[1] - a[1]);

  // Districts in this city
  const districtMap = new Map<string, number>();
  for (const r of filtered) if (r.district) districtMap.set(r.district, (districtMap.get(r.district) ?? 0) + 1);
  const districts = [...districtMap.entries()].sort((a, b) => b[1] - a[1]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span>{display}</span>
      </nav>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
        {display} Restaurants
      </h1>
      <p className="text-[var(--muted)] mb-8">
        {filtered.length} restaurants in {display}, ranked by Trust Score.
      </p>

      {cuisines.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">By Cuisine</h2>
          <div className="flex flex-wrap gap-2">
            {cuisines.slice(0, 16).map(([c, n]) => (
              <a
                key={c}
                href={`/c/${c}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
              >
                <span aria-hidden>{CUISINE_ICONS[c] ?? "🍴"}</span>
                {CUISINE_LABELS[c] ?? c}
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
        name={`Top ${display} restaurants`}
        items={filtered.slice(0, 20).map((r) => ({ name: r.name, url: `/restaurant/${r.id}` }))}
      />
    </div>
  );
}
