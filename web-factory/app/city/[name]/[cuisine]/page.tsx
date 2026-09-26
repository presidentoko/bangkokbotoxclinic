import { notFound } from "next/navigation";
import { loadMasterDb } from "@/lib/data";
import { SupplierCard } from "@/components/SupplierCard";
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/lib/types";
import { BreadcrumbJsonLd, ItemListJsonLd, CollectionPageJsonLd } from "@/components/JsonLd";
import { sortWithSponsored } from "@/lib/sponsored";
import { AdSlot } from "@/components/AffiliateSlot";
import { DbdRegistryTable } from "@/components/DbdRegistryTable";
import { computeTrustScore } from "@/lib/trustScore";
import { cityCategoryPairs, suppliersInCityCategory } from "@/lib/cityCategory";
import { MIN_COMBO_SUPPLIERS, districtCategoryCombos, districtsForCity } from "@/lib/districts";
import { TH_CATEGORY_VALID, TH_CITY_VALID } from "@/lib/thBuildSets";
import { provinceTh } from "@/lib/thaiNames";
import type { Metadata } from "next";

export const dynamicParams = false;

export async function generateStaticParams() {
  const db = await loadMasterDb();
  return cityCategoryPairs(db).map((p) => ({ name: p.citySlug, cuisine: p.category }));
}

async function load(name: string, cuisine: string) {
  const db = await loadMasterDb();
  const pair = cityCategoryPairs(db).find((p) => p.citySlug === name && p.category === cuisine);
  if (!pair) return null;
  return { db, pair, suppliers: sortWithSponsored(suppliersInCityCategory(db, name, cuisine)) };
}

export async function generateMetadata(
  { params }: { params: Promise<{ name: string; cuisine: string }> },
): Promise<Metadata> {
  const { name, cuisine } = await params;
  const data = await load(name, cuisine);
  if (!data) return {};
  const { pair, suppliers } = data;
  const label = CATEGORY_LABELS[cuisine] ?? cuisine;
  const verified = suppliers.filter((s) => s.verified).length;
  const th = provinceTh(name);
  const hasTh = TH_CITY_VALID.has(name) && TH_CATEGORY_VALID.has(cuisine);
  return {
    // 검색어 그대로의 표현 — "warehouse chonburi", "food manufacturer rayong".
    title: `${label}s in ${pair.cityLabel}, Thailand — ${pair.count} Verified Suppliers`,
    description:
      `${pair.count} ${label.toLowerCase()} companies in ${pair.cityLabel}, Thailand` +
      `${verified > 0 ? `, ${verified} DBD-verified` : ""}. ` +
      `Direct phone and website for each — no sourcing-agent middleman.` +
      `${th ? ` (${label} ${th})` : ""}`,
    alternates: {
      canonical: `/city/${name}/${cuisine}`,
      languages: {
        "en-US": `/city/${name}/${cuisine}`,
        ...(hasTh ? { "th-TH": `/th/city/${name}/${cuisine}` } : {}),
        "x-default": `/city/${name}/${cuisine}`,
      },
    },
  };
}

export default async function CityCategoryPage(
  { params }: { params: Promise<{ name: string; cuisine: string }> },
) {
  const { name, cuisine } = await params;
  const data = await load(name, cuisine);
  if (!data) notFound();
  const { db, pair, suppliers } = data;

  const label = CATEGORY_LABELS[cuisine] ?? cuisine;
  const icon = CATEGORY_ICONS[cuisine] ?? "🏭";
  const verified = suppliers.filter((s) => s.verified).length;
  const withWebsite = suppliers.filter((s) => s.website).length;
  const avgTrust = suppliers.length
    ? Math.round(suppliers.reduce((s, c) => s + computeTrustScore(c).overall, 0) / suppliers.length)
    : 0;

  // 이 도 안에서 같은 업종이 몰린 구 — 구 단위 페이지로 내려보낸다.
  //
  // 건수는 districtCategoryCombos() 에서 가져온다. 직접 세면 /c/[cat]/[district]
  // 가 실제로 굽는 목록과 어긋나 없는 페이지로 링크가 나간다 (실측: si-mahosot,
  // nakhon-luang 등). 그 함수가 링크·사이트맵·prerender 의 공통 기준이다.
  const combos = districtCategoryCombos(db);
  const byDistrict = districtsForCity(db, name)
    .map((g) => ({ ...g, n: combos.get(`${cuisine}::${g.slug}`) ?? 0 }))
    .filter((g) => g.n >= MIN_COMBO_SUPPLIERS)
    .sort((a, b) => b.n - a.n)
    .slice(0, 12);

  // 같은 도의 다른 업종 — 존재하는 페이지만 건다.
  const siblings = cityCategoryPairs(db)
    .filter((p) => p.citySlug === name && p.category !== cuisine)
    .slice(0, 12);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <a href={`/city/${name}`} className="hover:text-[var(--fg)]">{pair.cityLabel}</a>
        <span className="mx-2">›</span>
        <span>{label}</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 flex items-center gap-3">
        <span aria-hidden>{icon}</span>
        <span>{label}s in {pair.cityLabel}</span>
      </h1>
      <p className="text-[var(--muted)] mb-2 leading-relaxed">
        {pair.count.toLocaleString()} {label.toLowerCase()} companies listed in {pair.cityLabel}, Thailand
        {verified > 0 ? `, ${verified.toLocaleString()} of them verified against the DBD company registry` : ""}.
        Average Trust Score {avgTrust}/100, and {withWebsite.toLocaleString()} publish their own website.
      </p>
      <p className="text-[var(--muted)] mb-6 text-sm">
        Every listing shows the phone number and website from the company&apos;s own public profile — contact them
        directly.{" "}
        <a href={`/city/${name}`} className="underline hover:text-[var(--fg)]">
          All supplier categories in {pair.cityLabel} →
        </a>
      </p>

      {byDistrict.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
            {label}s by district in {pair.cityLabel}
          </h2>
          <div className="flex flex-wrap gap-2">
            {byDistrict.map((g) => (
              <a
                key={g.slug}
                href={`/c/${cuisine}/${g.slug}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-amber-400 hover:bg-amber-50 transition"
              >
                {g.display}
                <span className="text-[var(--muted)] tabular-nums">{g.n}</span>
              </a>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-xl font-bold mb-4">
          Top {Math.min(suppliers.length, 100)} {label.toLowerCase()} companies in {pair.cityLabel}
        </h2>
        <div className="grid gap-3">
          {suppliers.slice(0, 10).map((r, i) => <SupplierCard key={r.id} r={r} rank={i + 1} />)}
        </div>
        <AdSlot slot="city-category-mid" />
        <div className="grid gap-3 mt-3">
          {suppliers.slice(10, 100).map((r, i) => <SupplierCard key={r.id} r={r} rank={i + 11} />)}
        </div>
      </section>

      <DbdRegistryTable suppliers={suppliers} label={`${label} · ${pair.cityLabel}`} locale="en" />

      {siblings.length > 0 && (
        <section className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
            Other supplier categories in {pair.cityLabel}
          </h2>
          <div className="flex flex-wrap gap-2">
            {siblings.map((p) => (
              <a
                key={p.category}
                href={`/city/${name}/${p.category}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 transition"
              >
                <span aria-hidden>{CATEGORY_ICONS[p.category] ?? "🏭"}</span>
                {CATEGORY_LABELS[p.category] ?? p.category}
                <span className="text-[var(--muted)] tabular-nums">{p.count}</span>
              </a>
            ))}
          </div>
        </section>
      )}

      <div className="mt-8 flex flex-wrap gap-3 text-sm">
        <a
          href={`/c/${cuisine}`}
          className="px-3 py-1.5 rounded-full border border-[var(--border)] bg-white hover:border-amber-400 transition"
        >
          {label}s across Thailand →
        </a>
        <a
          href="/quote"
          className="px-3 py-1.5 rounded-full border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100 transition"
        >
          Request quotes →
        </a>
      </div>

      <CollectionPageJsonLd
        name={`${label}s in ${pair.cityLabel}, Thailand`}
        description={`${pair.count} ${label.toLowerCase()} companies in ${pair.cityLabel}, Thailand.`}
        url={`/city/${name}/${cuisine}`}
        lang="en"
        numberOfItems={suppliers.length}
      />
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: pair.cityLabel, url: `/city/${name}` },
        { name: `${label}s`, url: `/city/${name}/${cuisine}` },
      ]} />
      <ItemListJsonLd
        name={`${label}s in ${pair.cityLabel}`}
        items={suppliers.slice(0, 20).map((r) => ({ name: r.name, url: `/supplier/${r.id}` }))}
      />
    </div>
  );
}
