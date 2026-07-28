import { notFound } from "next/navigation";
import { loadMasterDb, filterByCategory } from "@/lib/data";
import { ClinicCard } from "@/components/ClinicCard";
import { ClinicCardCompact } from "@/components/ClinicCardCompact";
import { CATEGORY_LABELS } from "@/lib/types";
import { BreadcrumbJsonLd, FaqJsonLd, ItemListJsonLd, CollectionPageJsonLd } from "@/components/JsonLd";
import { CATEGORY_FAQS } from "@/lib/faq";
import { AffiliateInline } from "@/components/AffiliateSlot";
import { BookingForm } from "@/components/BookingForm";
import { StatsBar } from "@/components/StatsBar";
import { CategoryIcon } from "@/components/CategoryIcon";
import { GUIDES } from "@/lib/guides";
import { applySiteFilter, getSiteConfig, getSiteUrl, FOCUS_VALID } from "@/lib/site";
import type { Metadata } from "next";

const VALID = new Set(["botox", "filler", "hifu", "facial", "laser", "dental", "hair_transplant", "eye"]);

export const dynamic = "force-static";

// 봇 쓰레기 param(/d/wp-login.php 등)의 온디맨드 렌더+캐시 write 차단
// (Hobby ISR Writes 한도 누수, 2026-07-11 감사). GSP가 링크 공간 전체 커버.
export const dynamicParams = false;

export async function generateStaticParams() {
  return Array.from(VALID).map((service) => ({ service }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ service: string }> }
): Promise<Metadata> {
  const { service } = await params;
  const label = CATEGORY_LABELS[service] ?? service;
  const cfg = getSiteConfig();
  const db = await loadMasterDb();
  const scoped = applySiteFilter(db.clinics, cfg);
  const count = scoped.filter((c) => c.categories.includes(service)).length;
  const totalReviews = scoped
    .filter((c) => c.categories.includes(service))
    .reduce((s, c) => s + c.total_reviews, 0);
  // thin content — fewer than 5 clinics → noindex to avoid thin SEO pages
  const robots = count < 5 ? { index: false, follow: true } : undefined;
  const PRICE_HINTS: Partial<Record<string, string>> = {
    botox: "From ฿80/unit · Allergan, Dysport, Botulax",
    dental: "Implants from ฿35,000 · Veneers ฿12,000/tooth",
    filler: "From ฿8,000/syringe · Juvederm, Restylane",
    hifu: "From ฿8,000/session · Ultherapy, Thermage, Ultraformer",
    laser: "Pico from ฿3,000 · CO2 from ฿8,000",
    hair_transplant: "FUE from ฿65,000 (2,000 grafts)",
  };
  const priceHint = PRICE_HINTS[service];
  return {
    title: `${count} Best ${label} Clinics in Bangkok 2026 — Verified Reviews${priceHint ? `, ${priceHint.split("·")[0].trim()}` : ""}`,
    description: `${count} verified ${label.toLowerCase()} clinics in Bangkok ranked by Trust Score from ${totalReviews.toLocaleString()} Google reviews.${priceHint ? ` ${priceHint}.` : ""} Compare credibility, district, and patient satisfaction. Save up to 70% vs Western prices.`,
    alternates: { canonical: `/c/${service}` },
    ...(robots && { robots }),
    openGraph: {
      title: `${count} Best ${label} Clinics in Bangkok`,
      description: `Independent ranking — ${totalReviews.toLocaleString()} reviews analyzed.`,
      url: `/c/${service}`,
      images: [{
        url: `${getSiteUrl()}/api/og?title=${encodeURIComponent(`${count} Best ${label} Clinics in Bangkok`)}&sub=${encodeURIComponent(`${totalReviews.toLocaleString()} Google reviews analyzed · Trust Score ranking`)}&count=${count}`,
        width: 1200,
        height: 630,
        alt: `${label} Clinics Bangkok`,
      }],
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function ServicePage(
  { params }: { params: Promise<{ service: string }> }
) {
  const { service } = await params;
  if (!VALID.has(service)) notFound();

  const cfg = getSiteConfig();
  const focusValid = FOCUS_VALID[cfg.focus];
  if (focusValid && !focusValid.has(service)) notFound();

  const db = await loadMasterDb();
  const filtered = filterByCategory(applySiteFilter(db.clinics, cfg), service)
    .sort((a, b) => b.trust_score - a.trust_score);
  const label = CATEGORY_LABELS[service] ?? service;

  // 지역별 group: 최소 3 클리닉 있는 지역만
  const byDistrict = new Map<string, number>();
  for (const c of filtered) {
    if (!c.district) continue;
    byDistrict.set(c.district, (byDistrict.get(c.district) ?? 0) + 1);
  }
  const districts = Array.from(byDistrict.entries())
    .filter(([, n]) => n >= 3)
    .sort((a, b) => b[1] - a[1]);

  const totalReviews = filtered.reduce((s, c) => s + c.total_reviews, 0);
  const withScraped = filtered.filter((c) => c.scraped_review_count > 0).length;
  const guide = GUIDES.find((g) => g.focusTags?.includes(service as "botox" | "filler" | "hifu" | "facial" | "laser" | "dental" | "hair"));

  return (
    <>
      <StatsBar
        generatedAt={db.generated_at}
        totalClinics={filtered.length}
        totalReviews={totalReviews}
        withScraped={withScraped}
        entityLabel="Clinics"
      />
    <div className="max-w-5xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span>{label}</span>
      </nav>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 flex items-center gap-3">
        <CategoryIcon category={service} size={32} />
        {label} Clinics in Bangkok
      </h1>
      <p className="text-[var(--muted)] mb-8">
        {filtered.length} clinics ranked by Trust Score. Categorisation derived from Google review text and clinic listing data.
      </p>

      {districts.length > 0 && (
        <section className="mb-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
            {label} by District
          </h2>
          <div className="flex flex-wrap gap-2">
            {districts.map(([d, n]) => (
              <a
                key={d}
                href={`/c/${service}/${d.toLowerCase().replace(/\s+/g, "-")}`}
                className="inline-flex items-center px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
              >
                {label} in {d} <span className="text-[var(--muted)]">{n}</span>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* 도시별 섹션 분리 — Bangkok 최상단, 그 다음 외국인 인기 순서. */}
      {(() => {
        const cityOrder = ["Bangkok", "Pattaya", "Phuket", "Chiang Mai", "Koh Samui", "Krabi", "Hua Hin"];
        const byCity = new Map<string, typeof filtered>();
        for (const c of filtered) {
          const k = c.city_label || "Bangkok";
          if (!byCity.has(k)) byCity.set(k, []);
          byCity.get(k)!.push(c);
        }
        const sortedCities = cityOrder.filter((c) => byCity.has(c))
          .concat([...byCity.keys()].filter((c) => !cityOrder.includes(c)));

        let globalRank = 1;
        return sortedCities.map((city, idx) => {
          const cityList = byCity.get(city) ?? [];
          if (cityList.length === 0) return null;
          const citySlug = cityList[0].city_slug || city.toLowerCase().replace(/\s+/g, "-");
          const visible = cityList.slice(0, 50);
          const more = cityList.length - visible.length;
          const isMain = city === "Bangkok";
          return (
            <section key={city} className={isMain ? "" : "mt-12 pt-8 border-t border-[var(--border)]"}>
              <div className="flex items-baseline justify-between gap-4 mb-4 flex-wrap">
                <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                  {label} in {city}
                  <span className="text-[var(--muted)] font-normal text-base ml-2">
                    {cityList.length} clinic{cityList.length === 1 ? "" : "s"}
                  </span>
                </h2>
                <a
                  href={`/city/${citySlug}`}
                  className="text-sm font-bold hover:underline"
                  style={{ color: "var(--accent)" }}
                >
                  All {city} clinics →
                </a>
              </div>
              <div className="grid gap-3">
                {visible.slice(0, 10).map((c) => {
                  const r = globalRank++;
                  return <ClinicCard key={c.id} clinic={c} rank={r} />;
                })}
              </div>
              {idx === 0 && <AffiliateInline category={label} />}
              {visible.length > 10 && (
                <div className="mt-6">
                  <div className="grid gap-1.5">
                    {visible.slice(10).map((c) => {
                      const r = globalRank++;
                      return <ClinicCardCompact key={c.id} clinic={c} rank={r} />;
                    })}
                  </div>
                </div>
              )}
              {more > 0 && (
                <p className="mt-4 text-sm text-[var(--muted)]">
                  <a href={`/city/${citySlug}`} className="hover:underline" style={{ color: "var(--accent)" }}>
                    +{more} more {label.toLowerCase()} clinic{more === 1 ? "" : "s"} in {city} →
                  </a>
                </p>
              )}
            </section>
          );
        });
      })()}

      <div className="my-8">
        <BookingForm defaultService={service} />
      </div>

      {filtered.length >= 2 && (() => {
        const top = filtered.slice(0, 5);
        const pairs: [typeof top[0], typeof top[0]][] = [];
        if (top[0] && top[1]) pairs.push([top[0], top[1]]);
        if (top[2] && top[3]) pairs.push([top[2], top[3]]);
        if (top[1] && top[4]) pairs.push([top[1], top[4]]);
        if (pairs.length === 0) return null;
        return (
          <section className="mt-10 mb-10">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--muted)] mb-4">
              Popular comparisons
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {pairs.map(([x, y]) => (
                <a key={`${x.id}-${y.id}`} href={`/compare/${x.id}/${y.id}`} rel="nofollow"
                  className="group flex items-center gap-4 p-4 rounded-xl border border-[var(--border)] bg-white hover:border-[var(--accent)] transition">
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold bg-blue-50 text-blue-600 rounded px-1.5 py-0.5 shrink-0">#{filtered.indexOf(x) + 1}</span>
                      <span className="text-xs font-medium truncate">{x.name}</span>
                    </div>
                    <div className="text-[10px] font-bold text-[var(--muted)] ml-1">vs</div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold bg-purple-50 text-purple-600 rounded px-1.5 py-0.5 shrink-0">#{filtered.indexOf(y) + 1}</span>
                      <span className="text-xs font-medium truncate">{y.name}</span>
                    </div>
                  </div>
                  <span className="text-[var(--muted)] group-hover:text-[var(--accent)] shrink-0 transition">⚖️</span>
                </a>
              ))}
            </div>
          </section>
        );
      })()}

      {(CATEGORY_FAQS[service] ?? []).length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold mb-4">{label} in Bangkok — FAQ</h2>
          <div className="space-y-4">
            {(CATEGORY_FAQS[service] ?? []).map((f, i) => (
              <details key={i} className="bg-white border border-[var(--border)] rounded-lg p-4">
                <summary className="font-medium cursor-pointer">{f.q}</summary>
                <p className="mt-2 text-sm text-[var(--muted)]">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {guide && (
        <article className="mt-16 prose prose-sm max-w-none">
          <h2 className="text-2xl font-bold tracking-tight mb-3 not-prose">{guide.title}</h2>
          <p className="text-[var(--muted)] mb-8 not-prose">{guide.intro}</p>
          <div className="space-y-8 not-prose">
            {guide.sections.map((s) => (
              <section key={s.heading}>
                <h3 className="text-lg font-bold mb-2">{s.heading}</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">{s.body}</p>
              </section>
            ))}
          </div>
          {guide.faqs.length > 0 && (
            <div className="mt-10 not-prose">
              <h3 className="text-lg font-bold mb-4">{label} — More questions answered</h3>
              <div className="space-y-3">
                {guide.faqs.map((f, i) => (
                  <details key={i} className="bg-white border border-[var(--border)] rounded-lg p-4">
                    <summary className="font-medium cursor-pointer">{f.q}</summary>
                    <p className="mt-2 text-sm text-[var(--muted)]">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          )}
          <p className="mt-6 text-xs text-[var(--muted)] not-prose">
            Last updated: {guide.updated} · <a href={`/guide/${guide.slug}`} className="hover:underline" style={{ color: "var(--accent)" }}>Read full guide →</a>
          </p>
        </article>
      )}

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: label, url: `/c/${service}` },
      ]} />
      <FaqJsonLd faqs={CATEGORY_FAQS[service] ?? []} />
      <CollectionPageJsonLd
        name={`Top ${label} Clinics in Bangkok`}
        description={`${filtered.length} verified ${label.toLowerCase()} clinics in Bangkok ranked by Trust Score from Google review analysis.`}
        url={`/c/${service}`}
        items={filtered}
      />
    </div>
    </>
  );
}
