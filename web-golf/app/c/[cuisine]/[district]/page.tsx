import { notFound } from "next/navigation";
import { loadMasterDb, filterByCuisine, filterByDistrict } from "@/lib/data";
import { RestaurantCard } from "@/components/RestaurantCard";
import { CATEGORY_LABELS } from "@/lib/types";
import { BreadcrumbJsonLd, ItemListJsonLd } from "@/components/JsonLd";
import { AffiliateInline, AdSlot } from "@/components/AffiliateSlot";
import { sortWithSponsored } from "@/lib/sponsored";
import { indexableCategoryDistricts, allDistricts } from "@/lib/crawlGate";
import type { Metadata } from "next";

const VALID_CUISINES = new Set(Object.keys(CATEGORY_LABELS));

function districtFromSlug(slug: string, all: string[]): string | null {
  const target = slug.toLowerCase();
  return all.find((d) => d.toLowerCase().replace(/\s+/g, "-") === target) ?? null;
}

// 이전엔 category × district 전량(304개)을 pre-build 했는데 그중 203개가 코스 1개짜리였고,
// 구글은 그걸 전부 "Crawled - currently not indexed"로 버렸다. 이제 lib/crawlGate 의
// 임계치를 넘는 조합만 발행한다 — sitemap 과 /c/[cuisine] 의 지역 링크도 같은 함수를 쓴다.
export async function generateStaticParams() {
  const db = await (await import("@/lib/data")).loadMasterDb();
  return indexableCategoryDistricts(
    db.restaurants,
    Array.from(VALID_CUISINES),
    allDistricts(db.district_counts),
  ).map((c) => ({ cuisine: c.category, district: c.slug }));
}

// 위에서 발행 대상을 전부 열거하므로 나머지는 봇/스캐너이거나 게이트에 걸린 얇은 조합이다.
// false = 즉시 404, on-demand 렌더도 ISR write 도 없음.
export const dynamicParams = false;

export async function generateMetadata(
  { params }: { params: Promise<{ cuisine: string; district: string }> }
): Promise<Metadata> {
  const { cuisine, district } = await params;
  const label = CATEGORY_LABELS[cuisine] ?? cuisine;
  const db = await loadMasterDb();
  const allDistricts = Array.from(new Set(
    Object.keys(db.district_counts).map((k) => k.split("/")[1])
  ));
  const districtName = districtFromSlug(district, allDistricts) ?? district;
  return {
    title: `${label}s in ${districtName}, Thailand`,
    description: `${label}s in ${districtName}. Verified Trust Scores from real Google review analysis. Caddy quality and course conditions.`,
    alternates: { canonical: `/c/${cuisine}/${district}` },
  };
}

export default async function CategoryDistrictPage(
  { params }: { params: Promise<{ cuisine: string; district: string }> }
) {
  const { cuisine, district } = await params;
  if (!VALID_CUISINES.has(cuisine)) notFound();

  const db = await loadMasterDb();
  const allDistricts = Array.from(new Set(
    Object.keys(db.district_counts).map((k) => k.split("/")[1])
  ));
  const districtName = districtFromSlug(district, allDistricts);
  if (!districtName) notFound();

  const filtered = sortWithSponsored(filterByDistrict(filterByCuisine(db.restaurants, cuisine), districtName));
  const label = CATEGORY_LABELS[cuisine] ?? cuisine;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <a href={`/c/${cuisine}`} className="hover:text-[var(--fg)]">{label}</a>
        <span className="mx-2">›</span>
        <span>{districtName}</span>
      </nav>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
        {label}s in {districtName}
      </h1>
      <p className="text-[var(--muted)] mb-8">
        {filtered.length} {label.toLowerCase()}s in {districtName} — sorted by Trust Score.
      </p>

      {filtered.length === 0 ? (
        <p className="text-[var(--muted)]">No matches in this district yet. Try a broader category or different district.</p>
      ) : (
        <>
          <div className="grid gap-3">
            {filtered.slice(0, 5).map((r, i) => (
              <RestaurantCard key={r.id} r={r} rank={i + 1} />
            ))}
          </div>
          <AffiliateInline category={label} district={districtName} />
          <AdSlot slot="cuisine-district-mid" />
          <div className="grid gap-3 mt-3">
            {filtered.slice(5).map((r, i) => (
              <RestaurantCard key={r.id} r={r} rank={i + 6} />
            ))}
          </div>
        </>
      )}

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: label, url: `/c/${cuisine}` },
        { name: districtName, url: `/c/${cuisine}/${district}` },
      ]} />
      <ItemListJsonLd
        name={`${label}s in ${districtName}`}
        items={filtered.slice(0, 20).map((r) => ({ name: r.name, url: `/course/${r.id}` }))}
      />
    </div>
  );
}
