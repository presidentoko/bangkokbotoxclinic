import { notFound } from "next/navigation";
import { loadMasterDb, filterByDistrict } from "@/lib/data";
import { RestaurantCard } from "@/components/RestaurantCard";
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/components/JsonLd";
import { AdSlot } from "@/components/AffiliateSlot";
import { sortWithSponsored } from "@/lib/sponsored";
import { DISTRICT_HUB_COPY } from "@/lib/hubI18n";
import type { Metadata } from "next";

function districtFromSlug(slug: string, all: string[]): string | null {
  const target = slug.toLowerCase();
  return all.find((d) => d.toLowerCase().replace(/\s+/g, "-") === target) ?? null;
}

export async function districtStaticParams() {
  const db = await loadMasterDb();
  const districts = Array.from(new Set(
    Object.keys(db.district_counts).map((k) => k.split("/")[1])
  ));
  return districts.map((d) => ({ district: d.toLowerCase().replace(/\s+/g, "-") }));
}

export async function districtMetadata(
  { params }: { params: Promise<{ district: string }> },
  locale: "th" | "ko"
): Promise<Metadata> {
  const { district } = await params;
  const db = await loadMasterDb();
  const allDistricts = Array.from(new Set(
    Object.keys(db.district_counts).map((k) => k.split("/")[1])
  ));
  const districtName = districtFromSlug(district, allDistricts) ?? district;
  const count = db.restaurants.filter((r) => r.district === districtName).length;

  const title = locale === "th"
    ? `ร้านอาหาร ${count} แห่งย่าน ${districtName} — รีวิวจริง ไม่ใช่กระแส SNS`
    : `${districtName} 맛집 ${count}곳 — 진짜 리뷰, SNS 과대광고 아님`;
  const description = locale === "th"
    ? `ร้านอาหาร ${count} แห่งย่าน ${districtName} จัดอันดับด้วย Trust Score จากรีวิว Google จริง`
    : `${districtName} 지역 맛집 ${count}곳을 실제 구글 리뷰 기반 Trust Score로 랭킹.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/d/${district}`,
      languages: {
        en: `/d/${district}`,
        th: `/th/d/${district}`,
        ko: `/ko/d/${district}`,
        "x-default": `/d/${district}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `/${locale}/d/${district}`,
      locale: locale === "th" ? "th_TH" : "ko_KR",
    },
  };
}

export async function DistrictHubContent(
  { params }: { params: Promise<{ district: string }> },
  locale: "th" | "ko"
) {
  const { district } = await params;
  const db = await loadMasterDb();
  const allDistricts = Array.from(new Set(
    Object.keys(db.district_counts).map((k) => k.split("/")[1])
  ));
  const districtName = districtFromSlug(district, allDistricts);
  if (!districtName) notFound();

  const filtered = sortWithSponsored(filterByDistrict(db.restaurants, districtName));
  const copy = DISTRICT_HUB_COPY[locale];

  return (
    <div lang={locale} className="max-w-5xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href={`/${locale}`} className="hover:text-[var(--fg)]">{copy.home}</a>
        <span className="mx-2">›</span>
        <span>{districtName}</span>
      </nav>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
        {copy.heading(districtName)}
      </h1>
      <p className="text-[var(--muted)] mb-8">{copy.intro(filtered.length, districtName)}</p>

      <div className="grid gap-3">
        {filtered.slice(0, 10).map((r, i) => (
          <RestaurantCard key={r.id} r={r} rank={i + 1} />
        ))}
      </div>
      <AdSlot slot="district-mid" />
      <div className="grid gap-3 mt-3">
        {filtered.slice(10, 36).map((r, i) => (
          <RestaurantCard key={r.id} r={r} rank={i + 11} />
        ))}
      </div>
      {filtered.length > 36 && (
        <p className="mt-6 text-sm text-[var(--muted)]">{copy.showingTop(filtered.length)}</p>
      )}

      <BreadcrumbJsonLd items={[
        { name: "Home", url: `/${locale}` },
        { name: districtName, url: `/${locale}/d/${district}` },
      ]} />
      <CollectionPageJsonLd
        name={`Restaurants in ${districtName}`}
        description={`${filtered.length} restaurants in ${districtName} ranked by Trust Score from Google review analysis.`}
        url={`/${locale}/d/${district}`}
        items={filtered}
      />
    </div>
  );
}
