import { notFound } from "next/navigation";
import { loadMasterDb, filterByCategory } from "@/lib/data";
import { SupplierCard } from "@/components/SupplierCard";
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/lib/types";
import { BreadcrumbJsonLd, ItemListJsonLd, CollectionPageJsonLd } from "@/components/JsonLd";
import { CATEGORY_INTROS_TH } from "@/lib/categoryIntros_th";
import { CATEGORY_TO_GUIDE } from "@/lib/categoryIntros";
import { findGuideTh } from "@/lib/guides_th";
import { AdSlot } from "@/components/AffiliateSlot";
import { sortWithSponsored } from "@/lib/sponsored";
import { DbdRegistryTable } from "@/components/DbdRegistryTable";
import { citySlugFromDisplay } from "@/lib/cityNorm";
import { TH_CATEGORY_VALID as TH_VALID, TH_CITY_VALID } from "@/lib/thBuildSets";
import type { Metadata } from "next";

export const dynamicParams = false;

export async function generateStaticParams() {
  return Array.from(TH_VALID).map((cuisine) => ({ cuisine }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ cuisine: string }> }
): Promise<Metadata> {
  const { cuisine } = await params;
  const intro = CATEGORY_INTROS_TH[cuisine];
  const label = CATEGORY_LABELS[cuisine] ?? cuisine;
  return {
    title: intro?.metaTitle ?? `${label} ในประเทศไทย`,
    description: intro?.metaDescription ?? `ไดเรกทอรีผู้ผลิต ${label.toLowerCase()} ในประเทศไทย`,
    alternates: {
      canonical: `/th/c/${cuisine}`,
      languages: {
        "th-TH": `/th/c/${cuisine}`,
        "en-US": `/c/${cuisine}`,
        "ko-KR": `/ko/c/${cuisine}`,
        "x-default": `/c/${cuisine}`,
      },
    },
    openGraph: { locale: "th_TH" },
  };
}

export default async function ThCategoryPage(
  { params }: { params: Promise<{ cuisine: string }> }
) {
  const { cuisine } = await params;
  if (!TH_VALID.has(cuisine)) notFound();

  const db = await loadMasterDb();
  const filtered = sortWithSponsored(filterByCategory(db.suppliers, cuisine));
  const label = CATEGORY_LABELS[cuisine] ?? cuisine;
  const icon = CATEGORY_ICONS[cuisine] ?? "🏭";
  const intro = CATEGORY_INTROS_TH[cuisine];

  // Only cities with a generated /th/city/{slug} page (a small subset of the
  // full EN city list) — avoids a dead-link pill.
  const byCity = new Map<string, number>();
  for (const r of filtered) {
    if (!TH_CITY_VALID.has(citySlugFromDisplay(r.city_label))) continue;
    byCity.set(r.city_label, (byCity.get(r.city_label) ?? 0) + 1);
  }
  const cities = Array.from(byCity.entries()).sort((a, b) => b[1] - a[1]);

  const totalReviews = filtered.reduce((s, r) => s + r.total_reviews, 0);
  const withWebsite = filtered.filter((r) => r.website).length;

  const guideSlug = CATEGORY_TO_GUIDE[cuisine];
  const thGuide = guideSlug ? findGuideTh(guideSlug) : null;

  const CAT_TO_BEST: Record<string, string> = {
    manufacturer: "manufacturers", auto_parts: "auto-parts",
    industrial_estate: "industrial-estates", warehouse: "warehouses",
    food_mfg: "food-manufacturers",
  };
  const bestSlug = CAT_TO_BEST[cuisine];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/th" className="hover:text-[var(--fg)]">หน้าแรก</a>
        <span className="mx-2">›</span>
        <span>{label}</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 flex items-center gap-3">
          <span aria-hidden>{icon}</span>
          <span>{intro?.title ?? label}</span>
        </h1>
        <p className="text-[var(--muted)] leading-relaxed mb-4 text-balance">
          {intro?.intro ?? `ไดเรกทอรีผู้ผลิต ${label.toLowerCase()} ที่ตรวจสอบแล้ว ${filtered.length.toLocaleString()} ราย.`}
        </p>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full font-medium tabular-nums">
            {filtered.length.toLocaleString()} ราย
          </span>
          <span className="bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full font-medium tabular-nums">
            {totalReviews.toLocaleString()} รีวิว
          </span>
          <span className="bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full font-medium tabular-nums">
            {withWebsite.toLocaleString()} มีเว็บไซต์
          </span>
          {bestSlug && (
            <a href={`/best/${bestSlug}`}
               className="bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full font-medium hover:bg-amber-100 transition">
              🏆 ดูอันดับ →
            </a>
          )}
        </div>
      </header>

      {thGuide && (
        <a
          href={`/th/guide/${thGuide.slug}`}
          className="block mb-8 p-5 bg-emerald-50/40 border border-emerald-200 rounded-xl hover:border-emerald-400 hover:shadow-md transition group"
        >
          <div className="flex items-start gap-4">
            <div className="text-2xl shrink-0">📖</div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold uppercase tracking-widest text-emerald-700 mb-1">คู่มือผู้ซื้อ</div>
              <h2 className="font-bold text-lg leading-snug mb-1 group-hover:text-emerald-700 transition">{thGuide.title}</h2>
              <p className="text-sm text-[var(--muted)] line-clamp-2">{thGuide.metaDescription}</p>
            </div>
            <span className="text-emerald-700 group-hover:translate-x-1 transition shrink-0 self-center text-xl">→</span>
          </div>
        </a>
      )}

      {cities.length > 1 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">ตามจังหวัด</h2>
          <div className="flex flex-wrap gap-2">
            {cities.map(([city, n]) => (
              <a
                key={city}
                href={`/th/city/${citySlugFromDisplay(city)}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border)] text-sm bg-white hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 transition font-medium"
              >
                {city}
                <span className="text-[var(--muted)] tabular-nums">{n}</span>
              </a>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-xl font-bold mb-4">{Math.min(filtered.length, 100)} อันดับแรก ตามคะแนนความน่าเชื่อถือ</h2>
        <div className="grid gap-3">
          {filtered.slice(0, 10).map((r, i) => (
            <SupplierCard key={r.id} r={r} rank={i + 1} />
          ))}
        </div>
        <AdSlot slot="th-category-mid" />
        <div className="grid gap-3 mt-3">
          {filtered.slice(10, 100).map((r, i) => (
            <SupplierCard key={r.id} r={r} rank={i + 11} />
          ))}
        </div>
      </section>

      <DbdRegistryTable suppliers={filtered} label={label} locale="th" />

      <CollectionPageJsonLd
        name={intro?.metaTitle ?? label}
        description={intro?.metaDescription ?? `${label} ในประเทศไทย`}
        url={`/th/c/${cuisine}`}
        lang="th"
        numberOfItems={filtered.length}
      />
      <BreadcrumbJsonLd items={[
        { name: "หน้าแรก", url: "/th" },
        { name: label, url: `/th/c/${cuisine}` },
      ]} />
      <ItemListJsonLd
        name={`Top ${label} in Thailand`}
        items={filtered.slice(0, 20).map((r) => ({ name: r.name, url: `/supplier/${r.id}` }))}
      />
    </div>
  );
}
