import { notFound } from "next/navigation";
import { loadMasterDb } from "@/lib/data";
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/lib/types";
import { BreadcrumbJsonLd, ItemListJsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

export const dynamicParams = false;

export async function generateStaticParams() {
  const db = await loadMasterDb();
  const slugs = new Set<string>();
  for (const s of db.suppliers) {
    if (s.estate_slug) slugs.add(s.estate_slug);
  }
  return Array.from(slugs).map((slug) => ({ slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const db = await loadMasterDb();
  const matches = db.suppliers.filter((s) => s.estate_slug === slug);
  if (matches.length === 0) return { title: "Estate not found" };
  const name = matches[0].estate_name || slug;
  return {
    title: `Suppliers in ${name} Industrial Estate — Thai Supply Hub`,
    description: `${matches.length} verified Thai manufacturers and B2B suppliers based in ${name} industrial estate. Capital, registered date, TSIC codes — sourced from official DBD registry.`,
    alternates: { canonical: `/estate/${slug}` },
    robots: matches.length < 3 ? { index: false, follow: true } : { index: true, follow: true },
  };
}

function formatCapital(thb: number | null | undefined): string {
  if (!thb) return "";
  if (thb >= 1_000_000_000) return `฿${(thb / 1_000_000_000).toFixed(1)}B`;
  if (thb >= 1_000_000) return `฿${(thb / 1_000_000).toFixed(1)}M`;
  if (thb >= 1_000) return `฿${(thb / 1_000).toFixed(0)}K`;
  return `฿${thb.toFixed(0)}`;
}

export default async function EstatePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const db = await loadMasterDb();
  const tenants = db.suppliers.filter((s) => s.estate_slug === slug);
  if (tenants.length === 0) notFound();

  const name = tenants[0].estate_name || slug;
  const verifiedTenants = tenants.filter((s) => s.verified);

  // 카테고리 분포
  const catCounts = new Map<string, number>();
  for (const t of tenants) {
    for (const c of t.categories) catCounts.set(c, (catCounts.get(c) ?? 0) + 1);
  }
  const topCats = Array.from(catCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5);

  // 도시 분포
  const cities = new Map<string, number>();
  for (const t of tenants) if (t.city_label) cities.set(t.city_label, (cities.get(t.city_label) ?? 0) + 1);
  const topCity = Array.from(cities.entries()).sort((a, b) => b[1] - a[1])[0];

  // 정렬 — verified 우선, b2b_score 차순
  const sorted = [...tenants].sort((a, b) => {
    if ((b.verified ? 1 : 0) !== (a.verified ? 1 : 0)) return (b.verified ? 1 : 0) - (a.verified ? 1 : 0);
    return (b.b2b_score ?? b.trust_score) - (a.b2b_score ?? a.trust_score);
  });

  return (
    <article className="max-w-6xl mx-auto px-4 py-8 bg-white">
      <nav className="text-sm text-[var(--muted)] mb-4" aria-label="Breadcrumb">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span className="text-[var(--fg)] font-medium">{name} Industrial Estate</span>
      </nav>

      <header className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-3">
          🏘 Industrial estate
        </div>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">{name}</h1>
        <p className="text-base md:text-lg text-stone-600">
          {tenants.length} B2B tenant{tenants.length === 1 ? "" : "s"}
          {verifiedTenants.length > 0 && (
            <> · <span className="font-bold text-emerald-700">{verifiedTenants.length} DBD-verified</span></>
          )}
          {topCity && <> · primarily in {topCity[0]}</>}
        </p>
      </header>

      {/* 카테고리 칩 */}
      {topCats.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {topCats.map(([c, n]) => (
            <a key={c} href={`/c/${c}`}
               className="inline-flex items-center gap-1.5 bg-stone-100 text-stone-800 px-3 py-1.5 rounded-full text-sm hover:bg-stone-200 font-medium">
              <span aria-hidden>{CATEGORY_ICONS[c] ?? "🏭"}</span>
              {CATEGORY_LABELS[c] ?? c} <span className="text-stone-500">({n})</span>
            </a>
          ))}
        </div>
      )}

      {/* tenants grid */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-stone-900">Tenants ({tenants.length})</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((s) => (
            <a key={s.id} href={`/supplier/${s.id}`}
               className="group block bg-white border border-stone-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-emerald-300 hover:-translate-y-0.5 transition">
              {s.hero_image && (
                <div className="relative w-full bg-stone-100 overflow-hidden" style={{ aspectRatio: "16/9" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.hero_image} alt={s.name} loading="lazy" referrerPolicy="no-referrer"
                       className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  {s.verified && (
                    <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider">
                      ✓ Verified
                    </span>
                  )}
                </div>
              )}
              <div className="p-4">
                {!s.hero_image && s.verified && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                    ✓ DBD Verified
                  </span>
                )}
                <h3 className="font-bold text-base text-stone-900 group-hover:text-emerald-700 line-clamp-2">{s.name}</h3>
                {s.dbd?.legal_name && (
                  <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">{s.dbd.legal_name}</p>
                )}
                <div className="mt-3 flex items-center gap-3 text-xs text-stone-600 flex-wrap">
                  {s.categories[0] && (
                    <span>{CATEGORY_ICONS[s.categories[0]] ?? "🏭"} {CATEGORY_LABELS[s.categories[0]] ?? s.categories[0]}</span>
                  )}
                  {s.years_in_business ? <span>{s.years_in_business}y</span> : null}
                  {s.dbd?.capital_thb ? <span>{formatCapital(s.dbd.capital_thb)} cap.</span> : null}
                  {s.rating > 0 && <span>★ {s.rating.toFixed(1)}</span>}
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* AEO context */}
      <section className="mt-12 bg-stone-50 border border-stone-200 rounded-2xl p-6">
        <h2 className="text-lg font-bold mb-2 text-stone-900">About {name}</h2>
        <p className="text-sm text-stone-700 leading-relaxed">
          {name} hosts {tenants.length} B2B suppliers we&apos;ve identified — including {verifiedTenants.length} cross-checked
          with the Thai government&apos;s Department of Business Development registry. Tenants span{" "}
          {topCats.slice(0, 3).map(([c]) => CATEGORY_LABELS[c] ?? c).join(", ")}.
          Industrial estates in Thailand operate under the Industrial Estate Authority of Thailand (IEAT) and offer
          tax incentives, customs facilities, and pre-vetted infrastructure — making them a preferred location for
          export-oriented manufacturers serving Korea, Japan, China, and the EU.
        </p>
      </section>

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: `${name} Industrial Estate`, url: `/estate/${slug}` },
      ]} />
      <ItemListJsonLd
        name={`Suppliers in ${name} industrial estate`}
        items={sorted.slice(0, 20).map((s) => ({ name: s.name, url: `/supplier/${s.id}` }))}
      />
    </article>
  );
}
