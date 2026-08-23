import { notFound } from "next/navigation";
import { loadMasterDb, filterByDistrict } from "@/lib/data";
import { ClinicCard } from "@/components/ClinicCard";
import { ClinicCardCompact } from "@/components/ClinicCardCompact";
import { BreadcrumbJsonLd, ItemListJsonLd, CollectionPageJsonLd } from "@/components/JsonLd";
import { AffiliateInline } from "@/components/AffiliateSlot";
import { BookingForm } from "@/components/BookingForm";
import { CATEGORY_LABELS } from "@/lib/types";
import { CategoryIcon } from "@/components/CategoryIcon";
import { applySiteFilter, getSiteConfig, FOCUS_VALID } from "@/lib/site";
import type { Metadata } from "next";

function districtFromSlug(slug: string, all: string[]): string | null {
  const target = slug.toLowerCase();
  return all.find((d) => d.toLowerCase().replace(/\s+/g, "-") === target) ?? null;
}

// 봇 쓰레기 param(/d/wp-login.php 등)의 온디맨드 렌더+캐시 write 차단
// (Hobby ISR Writes 한도 누수, 2026-07-11 감사). GSP가 링크 공간 전체 커버.
export const dynamicParams = false;

export async function generateStaticParams() {
  const db = await (await import("@/lib/data")).loadMasterDb();
  return Object.keys(db.district_counts).map((d) => ({
    district: d.toLowerCase().replace(/\s+/g, "-"),
  }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ district: string }> }
): Promise<Metadata> {
  const { district } = await params;
  const db = await loadMasterDb();
  const cfg = getSiteConfig();
  const districtName = districtFromSlug(district, Object.keys(db.district_counts)) ?? district;
  // db.district_counts 는 전 도메인 합산 카운트 — 이 사이트 소관만 센 카운트를
  // 써야 noindex 기준(count<5)과 타이틀 숫자가 실제 표시되는 클리닉 수와
  // 일치함 (2026-07-17 감사: 안 그러면 겸업 카운트 때문에 사실상 텅 빈
  // 페이지가 색인되거나, 타이틀 숫자와 실제 목록 길이가 안 맞음).
  const scoped = applySiteFilter(db.clinics, cfg);
  const count = filterByDistrict(scoped, districtName).length;
  // 실제 도시 lookup — Pattaya/Phuket district가 Bangkok으로 잘못 표기되는 것 방지.
  const sample = db.clinics.find((c) => c.district === districtName && c.city_label);
  const cityLabel = sample?.city_label ?? "Bangkok";
  const robots = count < 5 ? { index: false, follow: true } : undefined;
  // 브랜드 접미사가 붙으면 구글 표시 한계(~60자)를 넘겨 잘림 — absolute로 꺼서
  // 방지 (2026-07-31 감사).
  return {
    title: { absolute: `${count} Clinics in ${districtName}, ${cityLabel} — Reviews` },
    description: `${count} clinics in ${districtName}, ${cityLabel} ranked by verified Google review analysis. Trust Score, reviewer credibility, service mentions for each.`,
    // 2026-08-23: /th/d/[district] 신설과 함께 hreflang 을 상호 선언한다.
    // 한쪽만 선언하면 클러스터가 성립하지 않아 구글이 통째로 무시한다 —
    // /c 에서 정확히 그 상태였다(2026-08-20 수정).
    alternates: {
      canonical: `/d/${district}`,
      languages: {
        "en-US": `/d/${district}`,
        "th-TH": `/th/d/${district}`,
        "x-default": `/d/${district}`,
      },
    },
    ...(robots && { robots }),
    openGraph: {
      title: `Clinics in ${districtName}, ${cityLabel}`,
      description: `${count} verified clinics. Trust Score ranking from real reviews.`,
      url: `/d/${district}`,
    },
  };
}

export default async function DistrictPage(
  { params }: { params: Promise<{ district: string }> }
) {
  const { district } = await params;
  const db = await loadMasterDb();
  const cfg = getSiteConfig();
  const districtName = districtFromSlug(district, Object.keys(db.district_counts));
  if (!districtName) notFound();

  // 이 사이트 소관 클리닉만 — 안 그러면 겸업 클리닉이 섞여 타 버티컬
  // 클리닉이 이 도메인 지역 페이지에 랭킹으로 뜸 (2026-07-17 감사).
  const scoped = applySiteFilter(db.clinics, cfg);
  const filtered = filterByDistrict(scoped, districtName)
    .sort((a, b) => b.trust_score - a.trust_score);
  const cityLabel = filtered.find((c) => c.city_label)?.city_label ?? "Bangkok";

  // 카테고리 분포 (3개 이상 클리닉만) — focus 밖 카테고리는 /c/{cat}/{district}
  // 가 404 나므로 제외.
  const focusValidCats = FOCUS_VALID[cfg.focus];
  const categoryMap = new Map<string, number>();
  for (const c of filtered) {
    for (const cat of c.categories) {
      if (focusValidCats && !focusValidCats.has(cat)) continue;
      categoryMap.set(cat, (categoryMap.get(cat) ?? 0) + 1);
    }
  }
  const topCats = [...categoryMap.entries()].filter(([, n]) => n >= 2).sort((a, b) => b[1] - a[1]);

  // 인근 지역: 같은 도시에서 클리닉 수 기준 상위 8개 (현재 district 제외)
  const citySlug = filtered[0]?.city_slug;
  const nearbyDistricts = Object.entries(db.district_counts)
    .filter(([d]) => {
      if (d === districtName) return false;
      const sample = db.clinics.find((c) => c.district === d);
      return citySlug ? sample?.city_slug === citySlug : (sample?.city_label ?? "Bangkok") === cityLabel;
    })
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span>{cityLabel}</span>
        <span className="mx-2">›</span>
        <span>{districtName}</span>
      </nav>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
        Clinics in {districtName}, {cityLabel}
      </h1>
      <p className="text-[var(--muted)] mb-6">
        {filtered.length} clinics across all categories in {districtName}, {cityLabel}.
      </p>

      {topCats.length > 0 && (
        <section className="mb-6">
          <div className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)] mb-2">Filter by service</div>
          <div className="flex flex-wrap gap-2">
            {topCats.map(([cat, n]) => (
              <a
                key={cat}
                href={`/c/${cat}/${districtName.toLowerCase().replace(/\s+/g, "-")}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
              >
                <CategoryIcon category={cat} size={13} />
                {CATEGORY_LABELS[cat] ?? cat}
                <span className="text-[var(--muted)] tabular-nums text-xs">{n}</span>
              </a>
            ))}
          </div>
        </section>
      )}

      <div className="grid gap-3">
        {filtered.slice(0, 10).map((c, i) => (
          <ClinicCard key={c.id} clinic={c} rank={i + 1} />
        ))}
      </div>
      <AffiliateInline district={districtName} />
      {filtered.length > 10 && (
        <div className="mt-8">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--muted)] mb-3">
            #11 – #{Math.min(filtered.length, 200)} · runner-up rankings
          </h3>
          <div className="grid gap-1.5">
            {filtered.slice(10, 200).map((c, i) => (
              <ClinicCardCompact key={c.id} clinic={c} rank={i + 11} />
            ))}
          </div>
        </div>
      )}
      {filtered.length > 200 && (
        <p className="mt-6 text-sm text-[var(--muted)]">
          Showing top 200 of {filtered.length}. Use service filters above to narrow results.
        </p>
      )}

      <div className="my-8">
        <BookingForm />
      </div>

      {nearbyDistricts.length > 0 && (
        <section className="mt-10 pt-8 border-t border-[var(--border)]">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--muted)] mb-3">
            Other districts in {cityLabel}
          </h2>
          <div className="flex flex-wrap gap-2">
            {nearbyDistricts.map(([d, n]) => (
              <a
                key={d}
                href={`/d/${d.toLowerCase().replace(/\s+/g, "-")}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
              >
                📍 {d}
                <span className="text-[var(--muted)] tabular-nums text-xs">{n}</span>
              </a>
            ))}
          </div>
        </section>
      )}

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: districtName, url: `/d/${district}` },
      ]} />
      <CollectionPageJsonLd
        name={`Clinics in ${districtName}, Bangkok`}
        description={`${filtered.length} clinics in ${districtName} ranked by Trust Score from Google review analysis.`}
        url={`/d/${district}`}
        items={filtered}
      />
    </div>
  );
}
