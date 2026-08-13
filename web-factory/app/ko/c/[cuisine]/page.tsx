import { notFound } from "next/navigation";
import { loadMasterDb, filterByCategory } from "@/lib/data";
import { SupplierCard } from "@/components/SupplierCard";
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/lib/types";
import { BreadcrumbJsonLd, ItemListJsonLd, CollectionPageJsonLd } from "@/components/JsonLd";
import { CATEGORY_INTROS_KO } from "@/lib/categoryIntros_ko";
import { CATEGORY_TO_GUIDE } from "@/lib/categoryIntros";
import { findGuideKo } from "@/lib/guides_ko";
import { AdSlot } from "@/components/AffiliateSlot";
import { sortWithSponsored } from "@/lib/sponsored";
import { DbdRegistryTable } from "@/components/DbdRegistryTable";
import { citySlugFromDisplay } from "@/lib/cityNorm";
import { TH_CATEGORY_VALID } from "@/lib/thBuildSets";
import type { Metadata } from "next";

const VALID = new Set(Object.keys(CATEGORY_LABELS));

export const dynamicParams = false;

export async function generateStaticParams() {
  return Array.from(VALID).map((cuisine) => ({ cuisine }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ cuisine: string }> }
): Promise<Metadata> {
  const { cuisine } = await params;
  const intro = CATEGORY_INTROS_KO[cuisine];
  const label = CATEGORY_LABELS[cuisine] ?? cuisine;
  return {
    title: intro?.metaTitle ?? `태국 ${label} — 검증된 B2B 디렉토리`,
    description: intro?.metaDescription ??
      `태국 ${label.toLowerCase()} 공급사 디렉토리. 신뢰도 점수 + 직접 연락처 — 소싱 에이전트 마진 빼고.`,
    alternates: {
      canonical: `/ko/c/${cuisine}`,
      languages: {
        "ko-KR": `/ko/c/${cuisine}`,
        "en-US": `/c/${cuisine}`,
        // hreflang 는 상호 참조여야 한다. /c/* 와 /th/c/* 는 이 페이지를 가리키는데
        // 여기서 태국어판을 안 걸어주면 클러스터가 비대칭이 되고, 구글은 그런 세트를
        // 통째로 무시한다. /th/c 가 실제로 빌드하는 카테고리일 때만 건다.
        ...(TH_CATEGORY_VALID.has(cuisine) ? { "th-TH": `/th/c/${cuisine}` } : {}),
        "x-default": `/c/${cuisine}`,
      },
    },
    openGraph: { locale: "ko_KR" },
  };
}

export default async function KoCategoryPage(
  { params }: { params: Promise<{ cuisine: string }> }
) {
  const { cuisine } = await params;
  if (!VALID.has(cuisine)) notFound();

  const db = await loadMasterDb();
  const filtered = sortWithSponsored(filterByCategory(db.suppliers, cuisine));
  const label = CATEGORY_LABELS[cuisine] ?? cuisine;
  const icon = CATEGORY_ICONS[cuisine] ?? "🏭";
  const intro = CATEGORY_INTROS_KO[cuisine];

  // Only cities with a generated /city/{slug} page — avoids a dead-link pill.
  const validCities = new Set(Object.keys(db.city_counts));
  const byCity = new Map<string, number>();
  for (const r of filtered) {
    if (!validCities.has(r.city_label)) continue;
    byCity.set(r.city_label, (byCity.get(r.city_label) ?? 0) + 1);
  }
  const cities = Array.from(byCity.entries()).sort((a, b) => b[1] - a[1]);

  const totalReviews = filtered.reduce((s, r) => s + r.total_reviews, 0);
  const withWebsite = filtered.filter((r) => r.website).length;
  const verifiedCount = filtered.filter((r) => r.verified).length;
  const avgTrust =
    filtered.length > 0
      ? Math.round(filtered.reduce((s, r) => s + (r.trust_score ?? 0), 0) / filtered.length)
      : 0;

  const guideSlug = CATEGORY_TO_GUIDE[cuisine];
  const koGuide = guideSlug ? findGuideKo(guideSlug) : null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/ko" className="hover:text-[var(--fg)]">홈</a>
        <span className="mx-2">›</span>
        <span>{label}</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 flex items-center gap-3">
          <span aria-hidden>{icon}</span>
          <span>{intro?.title ?? `태국 ${label}`}</span>
        </h1>
        <p className="text-[var(--muted)] leading-relaxed mb-4 text-balance">
          {intro?.intro ??
            `태국 ${label.toLowerCase()} 공급사 ${filtered.length.toLocaleString()}곳. 신뢰도 점수로 정렬 — 공개 Google 리뷰 분석 기반.`}
        </p>
        {cities.length > 0 && (
          <p className="text-[var(--muted)] leading-relaxed mb-4 text-sm">
            태국 전체에 {label.toLowerCase()} 공급사 {filtered.length.toLocaleString()}곳이 등록되어 있으며 평균 신뢰도 점수는 {avgTrust}/100
            {verifiedCount > 0 ? `, 그 중 ${verifiedCount.toLocaleString()}곳이 DBD 검증` : ""}입니다.
            가장 밀집된 지역은 {cities[0][0]} ({cities[0][1].toLocaleString()}곳)
            {cities[1] ? `이며, 그 다음은 ${cities[1][0]} (${cities[1][1].toLocaleString()}곳)` : ""}입니다.
          </p>
        )}
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full font-medium tabular-nums">
            {filtered.length.toLocaleString()}곳 공급사
          </span>
          <span className="bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full font-medium tabular-nums">
            {totalReviews.toLocaleString()}개 리뷰 분석
          </span>
          <span className="bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full font-medium tabular-nums">
            {withWebsite.toLocaleString()}곳 웹사이트 공개
          </span>
          {(() => {
            const CAT_TO_BEST: Record<string, string> = {
              manufacturer: "manufacturers", auto_parts: "auto-parts",
              industrial_estate: "industrial-estates", warehouse: "warehouses",
              food_mfg: "food-manufacturers", electronics: "electronics-manufacturers",
            };
            const bestSlug = CAT_TO_BEST[cuisine];
            if (!bestSlug) return null;
            return (
              <a href={`/best/${bestSlug}`}
                 className="bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full font-medium hover:bg-amber-100 transition">
                🏆 순위 목록 →
              </a>
            );
          })()}
        </div>
      </header>

      {koGuide && (
        <a
          href={`/ko/guide/${koGuide.slug}`}
          className="block mb-8 p-5 bg-emerald-50/40 border border-emerald-200 rounded-xl hover:border-emerald-400 hover:shadow-md transition group"
        >
          <div className="flex items-start gap-4">
            <div className="text-2xl shrink-0">📖</div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold uppercase tracking-widest text-emerald-700 mb-1">
                한국 buyer 가이드
              </div>
              <h2 className="font-bold text-lg leading-snug mb-1 group-hover:text-emerald-700 transition">
                {koGuide.title}
              </h2>
              <p className="text-sm text-[var(--muted)] line-clamp-2">{koGuide.metaDescription}</p>
            </div>
            <span className="text-emerald-700 group-hover:translate-x-1 transition shrink-0 self-center text-xl">→</span>
          </div>
        </a>
      )}

      {cities.length > 1 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
            지역별
          </h2>
          <div className="flex flex-wrap gap-2">
            {cities.map(([city, n]) => (
              <a
                key={city}
                href={`/ko/city/${citySlugFromDisplay(city)}`}
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
        <h2 className="text-xl font-bold mb-4">신뢰도 Top {Math.min(filtered.length, 100)}</h2>
        <div className="grid gap-3">
          {filtered.slice(0, 10).map((r, i) => (
            <SupplierCard key={r.id} r={r} rank={i + 1} />
          ))}
        </div>
        <AdSlot slot="ko-category-mid" />
        <div className="grid gap-3 mt-3">
          {filtered.slice(10, 100).map((r, i) => (
            <SupplierCard key={r.id} r={r} rank={i + 11} />
          ))}
        </div>
        {filtered.length > 100 && (
          <p className="mt-6 text-sm text-[var(--muted)]">
            전체 {filtered.length.toLocaleString()}곳 중 Top 100. 지역으로 좁혀 보기.
          </p>
        )}
      </section>

      <DbdRegistryTable suppliers={filtered} label={label} locale="ko" />

      {intro?.longContext && (
        <section className="mt-12 bg-white border border-[var(--border)] rounded-xl p-6">
          <h2 className="text-lg font-bold mb-3">이 디렉토리에 대해</h2>
          <p className="text-sm text-[var(--muted)] leading-relaxed">{intro.longContext}</p>
        </section>
      )}

      <CollectionPageJsonLd
        name={intro?.metaTitle ?? `태국 ${label}`}
        description={intro?.metaDescription ?? `태국 ${label.toLowerCase()} 공급사 디렉토리.`}
        url={`/ko/c/${cuisine}`}
        lang="ko"
        numberOfItems={filtered.length}
      />
      <BreadcrumbJsonLd items={[
        { name: "홈", url: "/ko" },
        { name: label, url: `/ko/c/${cuisine}` },
      ]} />
      <ItemListJsonLd
        name={`태국 ${label} Top`}
        description={intro?.intro}
        items={filtered.slice(0, 20).map((r) => ({ name: r.name, url: `/supplier/${r.id}` }))}
      />
    </div>
  );
}
