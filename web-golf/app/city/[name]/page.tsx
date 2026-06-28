import { notFound } from "next/navigation";
import { loadMasterDb, filterByCity } from "@/lib/data";
import { RestaurantCard } from "@/components/RestaurantCard";
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/lib/types";
import { BreadcrumbJsonLd, ItemListJsonLd, FaqJsonLd } from "@/components/JsonLd";
import { sortWithSponsored } from "@/lib/sponsored";
import { AdSlot } from "@/components/AffiliateSlot";
import { TravelStackAffiliate } from "@/components/TravelStackAffiliate";
import { getCityContent } from "@/lib/cityContent";
import { BEST_FOR } from "@/lib/bestFor";
import type { Metadata } from "next";

export const dynamic = "force-static";

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
  const displayKey = Object.keys(db.city_counts).find((k) => citySlug(k) === name);
  const display = displayKey ?? name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const count = displayKey ? db.city_counts[displayKey] : 0;
  return {
    title: `Best Golf Courses in ${display} 2026${count ? ` — ${count} Ranked` : ""} | Thailand Golf Guide`,
    description: `The best ${display} golf courses ranked by Trust Score from real Google reviews. Compare caddy quality, green fees & conditions — country clubs, driving ranges & resorts verified.`,
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
  const koreanFriendly = filtered.filter((c) => c.is_korean_friendly).length;
  const avgTrust =
    filtered.length > 0
      ? Math.round(filtered.reduce((s, c) => s + c.trust_score, 0) / filtered.length)
      : 0;
  const content = getCityContent(name, display);

  // Cross-link best-of curations that have ≥3 matches in this city
  const bestForCity = BEST_FOR
    .map((b) => {
      const matches = filtered.filter((r) => !b.filterFn || b.filterFn(r));
      return { cfg: b, count: matches.length };
    })
    .filter((x) => x.count >= 3)
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

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
      <p className="text-[var(--muted)] mb-4">
        {filtered.length} courses in {display}, ranked by Trust Score from real Google reviews.
      </p>
      <p className="text-base leading-relaxed text-[var(--fg)] mb-6 max-w-3xl">
        {content.intro}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 text-center">
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
          <div className="text-xs text-[var(--muted)]">Korean reviews</div>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-white p-3">
          <div className="text-2xl font-bold tabular-nums">{koreanFriendly}</div>
          <div className="text-xs text-[var(--muted)]">🇰🇷 caddy verified</div>
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

      {bestForCity.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
            Best {display} courses by criterion
          </h2>
          <div className="grid sm:grid-cols-2 gap-2">
            {bestForCity.map(({ cfg, count }) => (
              <a
                key={cfg.slug}
                href={`/best/${cfg.slug}`}
                className="block px-4 py-3 rounded-xl border border-[var(--border)] text-sm bg-white hover:border-[var(--accent)] hover:bg-emerald-50 transition"
              >
                <div className="font-medium">
                  {cfg.title.replace(/^Best |^Most /, "").replace(/ in Thailand$/, "")}
                </div>
                <div className="text-xs text-[var(--muted)] mt-0.5">
                  {count} {display} courses match · view ranking
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      <TravelStackAffiliate city={name} cityLabel={display} context="city" />

      <AdSlot slot="city-mid" />

      <section>
        <h2 className="text-xl font-bold mb-4">Top {Math.min(filtered.length, 100)}</h2>
        <div className="grid gap-3">
          {filtered.slice(0, 100).map((r, i) => (
            <RestaurantCard key={r.id} r={r} rank={i + 1} />
          ))}
        </div>
      </section>

      {content.faqs.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Frequently asked — {display} golf</h2>
          <div className="space-y-3">
            {content.faqs.map((f, i) => (
              <details key={i} className="bg-white border border-[var(--border)] rounded-lg p-4 group">
                <summary className="font-medium cursor-pointer flex items-center justify-between gap-3">
                  <span>{f.q}</span>
                  <span className="text-[var(--muted)] group-open:rotate-180 transition">⌄</span>
                </summary>
                <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed whitespace-pre-line">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: display, url: `/city/${name}` },
      ]} />
      <ItemListJsonLd
        name={`Top ${display} golf courses`}
        items={filtered.slice(0, 20).map((r) => ({ name: r.name, url: `/course/${r.id}` }))}
      />
      <FaqJsonLd faqs={content.faqs} />
    </div>
  );
}
