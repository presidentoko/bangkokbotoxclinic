import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { loadMasterDb } from "@/lib/data";
import { applySiteFilter, getSiteConfig, getSiteUrl } from "@/lib/site";
import { groupBrands, findBrand } from "@/lib/brands";
import { ClinicCard } from "@/components/ClinicCard";
import { BreadcrumbJsonLd, ItemListJsonLd } from "@/components/JsonLd";
import { BookingForm } from "@/components/BookingForm";

// 2026-09-02: 멀티지점 브랜드 허브.
//
// 검증 검색의 사각지대였다 — 인플루언서는 "Apex Clinic" 이라고 말하지
// "Apex Clinic 라차요틴점" 이라고 하지 않는다. 그 검색어에는 우리 지점 페이지
// 13개가 서로 경쟁해 전부 순위가 낮았다. 허브 하나가 그 검색을 받는다.
//
// 형제 허브와 같은 캐시 정책: 내용은 master_db 가 바뀔 때만 달라지고 그때는
// 재배포로 캐시가 통째로 갈린다.
export const revalidate = 2592000;
export const dynamicParams = false;

export async function generateStaticParams() {
  const db = await loadMasterDb();
  const scoped = applySiteFilter(db.clinics, getSiteConfig());
  return groupBrands(scoped).map((b) => ({ slug: b.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const db = await loadMasterDb();
  const cfg = getSiteConfig();
  const brand = findBrand(applySiteFilter(db.clinics, cfg), slug);
  if (!brand) return { title: "Brand not found" };
  const n = brand.clinics.length;
  const title = brand.avgRating
    ? `${brand.name} — All ${n} Branches Reviewed ★${brand.avgRating} (${brand.totalReviews.toLocaleString()})`
    : `${brand.name} — All ${n} Branches Compared`;
  return {
    title,
    description:
      `${brand.name}: compare all ${n} Bangkok branches side by side. ` +
      `${brand.totalReviews.toLocaleString()} Google reviews analysed — ratings, districts and Trust Scores per branch.`,
    alternates: { canonical: `/brand/${brand.slug}` },
    openGraph: {
      // 2026-09-02: 페이지가 openGraph 를 정의하면 루트의 siteName 이 사라진다.
      siteName: cfg.brand,
      title,
      url: `${getSiteUrl()}/brand/${brand.slug}`,
      type: "website",
    },
  };
}

export default async function BrandPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const db = await loadMasterDb();
  const cfg = getSiteConfig();
  const brand = findBrand(applySiteFilter(db.clinics, cfg), slug);
  if (!brand) notFound();

  const districts = Array.from(
    new Set(brand.clinics.map((c) => c.district).filter(Boolean))
  ) as string[];
  const best = brand.clinics[0];

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: brand.name, url: `/brand/${brand.slug}` },
        ]}
      />
      <ItemListJsonLd
        name={`${brand.name} branches`}
        items={brand.clinics.map((c) => ({
          name: c.name,
          url: `${getSiteUrl()}/clinic/${c.id}`,
        }))}
      />

      <h1 className="text-3xl font-bold tracking-tight">
        {brand.name} — {brand.clinics.length} branches
      </h1>
      <p className="mt-3 text-neutral-600 dark:text-neutral-300">
        {brand.avgRating ? (
          <>
            Weighted average <strong>★{brand.avgRating}</strong> across{" "}
            {brand.totalReviews.toLocaleString()} Google reviews.{" "}
          </>
        ) : null}
        {districts.length > 0 ? <>Branches in {districts.join(", ")}.</> : null}
      </p>

      {best ? (
        <p className="mt-4 rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-sm dark:border-neutral-800 dark:bg-neutral-900">
          Highest Trust Score:{" "}
          <Link href={`/clinic/${best.id}`} className="font-medium underline">
            {best.name}
          </Link>
          {best.district ? ` (${best.district})` : ""} — ★{best.rating} from{" "}
          {best.total_reviews.toLocaleString()} reviews.
        </p>
      ) : null}

      <div className="mt-8 grid gap-4">
        {brand.clinics.map((c) => (
          <ClinicCard key={c.id} clinic={c} />
        ))}
      </div>

      <div className="mt-12">
        <BookingForm />
      </div>
    </main>
  );
}
