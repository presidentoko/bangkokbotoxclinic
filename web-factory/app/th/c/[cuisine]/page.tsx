import { notFound } from "next/navigation";
import { loadMasterDb, filterByCategory } from "@/lib/data";
import { SupplierCard } from "@/components/SupplierCard";
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/lib/types";
import { BreadcrumbJsonLd, ItemListJsonLd, CollectionPageJsonLd } from "@/components/JsonLd";
import { CATEGORY_INTROS_TH } from "@/lib/categoryIntros_th";
import { AdSlot } from "@/components/AffiliateSlot";
import { sortWithSponsored } from "@/lib/sponsored";
import type { Metadata } from "next";

// 태국어 페이지는 분량 절감 위해 핵심 카테고리만 prerender.
const TH_VALID = new Set([
  "manufacturer", "auto_parts", "industrial_estate", "warehouse",
  "logistics", "packaging", "food_mfg",
]);

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

  const byCity = new Map<string, number>();
  for (const r of filtered) byCity.set(r.city_label, (byCity.get(r.city_label) ?? 0) + 1);
  const cities = Array.from(byCity.entries()).sort((a, b) => b[1] - a[1]);

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
      </header>

      {cities.length > 1 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">ตามจังหวัด</h2>
          <div className="flex flex-wrap gap-2">
            {cities.map(([city, n]) => (
              <a
                key={city}
                href={`/th/city/${city.toLowerCase().replace(/\s+/g, "_")}`}
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
        <h2 className="text-xl font-bold mb-4">Top {Math.min(filtered.length, 100)} ตามคะแนน</h2>
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
