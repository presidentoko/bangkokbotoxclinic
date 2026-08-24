import { notFound } from "next/navigation";
import { loadMasterDb, filterByCategory, filterByDistrict } from "@/lib/data";
import { ClinicCard } from "@/components/ClinicCard";
import { ClinicCardCompact } from "@/components/ClinicCardCompact";
import { CATEGORY_LABELS } from "@/lib/types";
import { BreadcrumbJsonLd, ItemListJsonLd } from "@/components/JsonLd";
import { AffiliateInline } from "@/components/AffiliateSlot";
import { BookingForm } from "@/components/BookingForm";
import { applySiteFilter, getSiteConfig, FOCUS_VALID } from "@/lib/site";
import type { Metadata } from "next";

const VALID_SERVICES = new Set(["botox", "filler", "hifu", "facial", "laser", "dental", "hair_transplant", "eye"]);

function districtFromSlug(slug: string, all: string[]): string | null {
  const target = slug.toLowerCase();
  return all.find((d) => d.toLowerCase().replace(/\s+/g, "-") === target) ?? null;
}

// 봇 쓰레기 param(/d/wp-login.php 등)의 온디맨드 렌더+캐시 write 차단
// (Hobby ISR Writes 한도 누수, 2026-07-11 감사). GSP가 링크 공간 전체 커버.
export const dynamicParams = false;

export async function generateStaticParams() {
  const db = await (await import("@/lib/data")).loadMasterDb();
  const cfg = getSiteConfig();
  const focusValid = FOCUS_VALID[cfg.focus];
  const services = focusValid ? [...VALID_SERVICES].filter((s) => focusValid.has(s)) : [...VALID_SERVICES];
  const districts = Object.keys(db.district_counts);
  const params: { service: string; district: string }[] = [];
  for (const service of services) {
    for (const d of districts) {
      params.push({
        service,
        district: d.toLowerCase().replace(/\s+/g, "-"),
      });
    }
  }
  return params;
}

export async function generateMetadata(
  { params }: { params: Promise<{ service: string; district: string }> }
): Promise<Metadata> {
  const { service, district } = await params;
  const label = CATEGORY_LABELS[service] ?? service;
  const cfg = getSiteConfig();
  const db = await loadMasterDb();
  const scoped = applySiteFilter(db.clinics, cfg);
  const districtName = districtFromSlug(district, Object.keys(db.district_counts)) ?? district;
  const count = filterByDistrict(filterByCategory(scoped, service), districtName).length;
  const robots = count < 3 ? { index: false, follow: true } : undefined;
  // 브랜드 접미사 제거 + 60자/155자 한계 준수 (2026-07-31 감사, /c/[service]와 동일 이유).
  return {
    title: { absolute: `${label} in ${districtName}, Bangkok — Verified Reviews` },
    description: `${count} verified ${label.toLowerCase()} clinics in ${districtName}, Bangkok ranked by Trust Score. Compare reviews and pick with confidence.`,
    // 2026-08-24: 시술이 하나뿐인 사이트에서는 이 페이지가 /d/{district} 의
    // 근접중복이다. 덴탈 사이트는 소관이 이미 치과라 "치과 필터"가 아무것도
    // 거르지 못한다 — 실측에서 두 페이지의 클리닉이 100% 동일하고 본문 유사도가
    // 73~79% 였다. 페이지는 남기되(기존 링크·색인 URL 이 죽지 않게) 순위 신호를
    // /d/ 로 모은다. /d/ 쪽이 태국어판(/th/d)과 FAQ 를 갖고 있어 더 두껍다.
    // 보톡스 사이트는 시술이 6개라 이 조합이 실제로 구분되므로 그대로 둔다.
    alternates: {
      canonical:
        (FOCUS_VALID[cfg.focus]?.size ?? 0) === 1
          ? `/d/${district}`
          : `/c/${service}/${district}`,
    },
    ...(robots && { robots }),
  };
}

export default async function ServiceDistrictPage(
  { params }: { params: Promise<{ service: string; district: string }> }
) {
  const { service, district } = await params;
  if (!VALID_SERVICES.has(service)) notFound();

  const cfg = getSiteConfig();
  const focusValid = FOCUS_VALID[cfg.focus];
  if (focusValid && !focusValid.has(service)) notFound();

  const db = await loadMasterDb();
  const scoped = applySiteFilter(db.clinics, cfg);
  const districtName = districtFromSlug(district, Object.keys(db.district_counts));
  if (!districtName) notFound();

  const filtered = filterByDistrict(filterByCategory(scoped, service), districtName)
    .sort((a, b) => b.trust_score - a.trust_score);

  const label = CATEGORY_LABELS[service] ?? service;

  // 같은 서비스의 다른 지역들 (클리닉 2개 이상, 현재 district 제외, 상위 8개)
  const allForService = filterByCategory(scoped, service);
  const districtCountMap = new Map<string, number>();
  for (const c of allForService) {
    if (!c.district || c.district === districtName) continue;
    districtCountMap.set(c.district, (districtCountMap.get(c.district) ?? 0) + 1);
  }
  const otherDistricts = [...districtCountMap.entries()]
    .filter(([, n]) => n >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  // Compare top 2 CTA
  const compareLink = filtered.length >= 2
    ? `/compare/${filtered[0].id}/${filtered[1].id}`
    : null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <a href={`/c/${service}`} className="hover:text-[var(--fg)]">{label}</a>
        <span className="mx-2">›</span>
        <span>{districtName}</span>
      </nav>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
        {label} Clinics in {districtName}
      </h1>
      <p className="text-[var(--muted)] mb-8">
        {filtered.length} {label.toLowerCase()} clinics in {districtName} — sorted by Trust Score.
      </p>

      {filtered.length === 0 ? (
        <div>
          <p className="text-[var(--muted)] mb-6">No clinics matched this filter. Try a nearby district:</p>
          {otherDistricts.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {otherDistricts.map(([d, n]) => (
                <a key={d} href={`/c/${service}/${d.toLowerCase().replace(/\s+/g, "-")}`}
                  className="px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition">
                  {label} in {d} <span className="text-[var(--muted)]">{n}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {compareLink && (
            <a href={compareLink} rel="nofollow"
              className="mb-6 flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--border)] bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition text-sm font-medium w-fit">
              ⚖️ Compare #{1} vs #{2}: {filtered[0].name} vs {filtered[1].name} →
            </a>
          )}
          <div className="grid gap-3">
            {filtered.slice(0, 5).map((c, i) => (
              <ClinicCard key={c.id} clinic={c} rank={i + 1} />
            ))}
          </div>
          <AffiliateInline category={label} district={districtName} />
          {filtered.length > 5 && (
            <div className="mt-8">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--muted)] mb-3">
                #6 – #{filtered.length} · runner-up rankings
              </h3>
              <div className="grid gap-1.5">
                {filtered.slice(5).map((c, i) => (
                  <ClinicCardCompact key={c.id} clinic={c} rank={i + 6} />
                ))}
              </div>
            </div>
          )}
          <div className="my-6">
            <BookingForm defaultService={service} />
          </div>
          {otherDistricts.length > 0 && (
            <section className="mt-8 pt-6 border-t border-[var(--border)]">
              <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--muted)] mb-3">
                {label} in other districts
              </h2>
              <div className="flex flex-wrap gap-2">
                {otherDistricts.map(([d, n]) => (
                  <a key={d} href={`/c/${service}/${d.toLowerCase().replace(/\s+/g, "-")}`}
                    className="px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition">
                    {d} <span className="text-[var(--muted)] tabular-nums">{n}</span>
                  </a>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: label, url: `/c/${service}` },
        { name: districtName, url: `/c/${service}/${district}` },
      ]} />
      <ItemListJsonLd
        name={`${label} clinics in ${districtName}`}
        items={filtered.slice(0, 20).map((c) => ({
          name: c.name,
          url: `/clinic/${c.id}`,
        }))}
      />
    </div>
  );
}
