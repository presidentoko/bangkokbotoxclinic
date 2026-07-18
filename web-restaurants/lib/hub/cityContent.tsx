import { notFound } from "next/navigation";
import { loadMasterDb, filterByCity } from "@/lib/data";
import { RestaurantCard } from "@/components/RestaurantCard";
import { CUISINE_ICONS } from "@/lib/types";
import { BreadcrumbJsonLd, ItemListJsonLd } from "@/components/JsonLd";
import { sortWithSponsored } from "@/lib/sponsored";
import { AdSlot } from "@/components/AffiliateSlot";
import { cuisineLabel, CITY_HUB_COPY } from "@/lib/hubI18n";
import type { Metadata } from "next";

export async function cityStaticParams() {
  const db = await loadMasterDb();
  return Object.keys(db.city_counts).map((name) => ({ name }));
}

export async function cityMetadata(
  { params }: { params: Promise<{ name: string }> },
  locale: "th" | "ko"
): Promise<Metadata> {
  const { name } = await params;
  const display = name.charAt(0).toUpperCase() + name.slice(1);

  const title = locale === "th"
    ? `ร้านอาหาร${display} — รีวิวจริงและ Trust Score`
    : `${display} 맛집 — 진짜 리뷰와 Trust Score`;
  const description = locale === "th"
    ? `ร้านอาหารทั้งหมดใน${display} จัดอันดับด้วย Trust Score จากรีวิว Google จริง`
    : `${display}의 모든 맛집을 실제 구글 리뷰 기반 Trust Score로 랭킹.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/city/${name}`,
      languages: {
        en: `/city/${name}`,
        th: `/th/city/${name}`,
        ko: `/ko/city/${name}`,
        "x-default": `/city/${name}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `/${locale}/city/${name}`,
      locale: locale === "th" ? "th_TH" : "ko_KR",
    },
  };
}

export async function CityHubContent(
  { params }: { params: Promise<{ name: string }> },
  locale: "th" | "ko"
) {
  const { name } = await params;
  const db = await loadMasterDb();
  if (!(name in db.city_counts)) notFound();
  const filtered = sortWithSponsored(filterByCity(db.restaurants, name));
  const display = filtered[0]?.city_label ?? (name.charAt(0).toUpperCase() + name.slice(1));
  const copy = CITY_HUB_COPY[locale];

  const cuisineMap = new Map<string, number>();
  for (const r of filtered) {
    for (const c of r.cuisines) cuisineMap.set(c, (cuisineMap.get(c) ?? 0) + 1);
  }
  const cuisines = [...cuisineMap.entries()].sort((a, b) => b[1] - a[1]);

  const districtMap = new Map<string, number>();
  for (const r of filtered) if (r.district) districtMap.set(r.district, (districtMap.get(r.district) ?? 0) + 1);
  const districts = [...districtMap.entries()].sort((a, b) => b[1] - a[1]);

  return (
    <div lang={locale} className="max-w-5xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href={`/${locale}`} className="hover:text-[var(--fg)]">{copy.home}</a>
        <span className="mx-2">›</span>
        <span>{display}</span>
      </nav>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{copy.heading(display)}</h1>
      <p className="text-[var(--muted)] mb-8">{copy.intro(filtered.length, display)}</p>

      {cuisines.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">{copy.byCuisine}</h2>
          <div className="flex flex-wrap gap-2">
            {cuisines.slice(0, 16).map(([c, n]) => (
              <a
                key={c}
                href={`/${locale}/c/${c}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
              >
                <span aria-hidden>{CUISINE_ICONS[c] ?? "🍴"}</span>
                {cuisineLabel(c, locale)}
                <span className="text-[var(--muted)] tabular-nums">{n}</span>
              </a>
            ))}
          </div>
        </section>
      )}

      {districts.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">{copy.byDistrict}</h2>
          <div className="flex flex-wrap gap-2">
            {districts.map(([d, n]) => (
              <a
                key={d}
                href={`/${locale}/d/${d.toLowerCase().replace(/\s+/g, "-")}`}
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
        <h2 className="text-xl font-bold mb-4">{copy.top(Math.min(filtered.length, 36))}</h2>
        <div className="grid gap-3">
          {filtered.slice(0, 36).map((r, i) => (
            <RestaurantCard key={r.id} r={r} rank={i + 1} />
          ))}
        </div>
      </section>

      <BreadcrumbJsonLd items={[
        { name: "Home", url: `/${locale}` },
        { name: display, url: `/${locale}/city/${name}` },
      ]} />
      <ItemListJsonLd
        name={`Top ${display} restaurants`}
        items={filtered.slice(0, 20).map((r) => ({ name: r.name, url: `/restaurant/${r.id}` }))}
      />
    </div>
  );
}
