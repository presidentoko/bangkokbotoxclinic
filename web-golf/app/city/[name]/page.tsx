import { notFound } from "next/navigation";
import { loadMasterDb, filterByCityOrAlias, resolveCityAlias, golfOnly } from "@/lib/data";
import { loadPriceMatrix, toPriceRows } from "@/lib/priceMatrix";
import { indexableCities, indexableDistricts, allDistricts } from "@/lib/crawlGate";
import { RestaurantCard } from "@/components/RestaurantCard";
import { CompactCourseList } from "@/components/CompactCourseList";
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/lib/types";
import { BreadcrumbJsonLd, ItemListJsonLd, FaqJsonLd } from "@/components/JsonLd";
import { sortWithSponsored } from "@/lib/sponsored";
import { AdSlot } from "@/components/AffiliateSlot";
import { TravelStackAffiliate } from "@/components/TravelStackAffiliate";
import { getCityContent } from "@/lib/cityContent";
import { BEST_FOR } from "@/lib/bestFor";
import type { Metadata } from "next";

export const dynamic = "force-static";

// 카드로 렌더할 개수. 나머지는 경량 목록으로 링크만 유지한다.
const CARD_COUNT = 24;

function citySlug(label: string): string {
  return label.toLowerCase().replace(/\s+/g, "_");
}

// 목적지 별칭(hua_hin 등)을 포함하고, 별칭에 코스를 다 빼앗겨 비어버린 도(道)는 제외한다.
// city_counts 를 그대로 쓰면 /city/songkhla 처럼 코스 0개인 빈 페이지가 발행된다.
export async function generateStaticParams() {
  const db = await loadMasterDb();
  return indexableCities(db.restaurants, Object.keys(db.city_counts)).map((name) => ({ name }));
}

// force-static 만으로는 Next 가 미열거 param 을 on-demand 생성하는 걸 못 막는다 —
// 명시적 false 가 필요. city_counts 가 sitemap 과 같은 소스라 죽는 URL 은 없다.
export const dynamicParams = false;

export async function generateMetadata(
  { params }: { params: Promise<{ name: string }> }
): Promise<Metadata> {
  const { name } = await params;
  const db = await loadMasterDb();
  // 별칭 도시(hua_hin 등)는 city_counts 에 없거나 실제와 다른 수를 갖는다 — 실측한다.
  const dest = resolveCityAlias(name);
  const matched = filterByCityOrAlias(db.restaurants, name);
  const displayKey = dest?.label ?? Object.keys(db.city_counts).find((k) => citySlug(k) === name);
  const display = displayKey ?? name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const count = matched.length;
  return {
    // 브랜드명은 app/layout.tsx 의 title.template 이 붙인다 — 여기서 또 붙이면
    // "… | Thailand Golf Guide | Thailand Golf Guide" 가 되어 SERP 에서 잘린다.
    title: `Best Golf Courses in ${display} 2026${count ? ` — ${count} Ranked` : ""}`,
    description: `The best ${display} golf courses ranked by Trust Score from real Google reviews. Compare caddy quality, green fees & conditions — country clubs, driving ranges & resorts verified.`,
    alternates: { canonical: `/city/${name}` },
  };
}

export default async function CityPage(
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const db = await loadMasterDb();

  const filtered = sortWithSponsored(filterByCityOrAlias(db.restaurants, name));
  if (filtered.length === 0) notFound();

  // 별칭 도시는 city_label 이 상위 도(道) 이름이라 그대로 쓰면 안 된다
  // (/city/hua_hin 이 "Prachuap Khiri Khan Golf Courses" 로 표시되는 문제).
  const dest = resolveCityAlias(name);
  const display = dest?.label ?? filtered[0]?.city_label ?? name.replace(/_/g, " ");

  // Categories in this city
  const catMap = new Map<string, number>();
  for (const r of filtered) {
    for (const c of r.categories) catMap.set(c, (catMap.get(c) ?? 0) + 1);
  }
  const categories = [...catMap.entries()].sort((a, b) => b[1] - a[1]);

  // Districts in this city — 실제로 발행되는 /d/ 페이지만 링크한다.
  // 게이트를 무시하면 코스 1개짜리 지역 링크가 404를 가리키게 된다.
  const publishable = new Set(
    indexableDistricts(db.restaurants, allDistricts(db.district_counts)).map((d) => d.district),
  );
  const districtMap = new Map<string, number>();
  for (const r of filtered) {
    if (r.district && publishable.has(r.district)) {
      districtMap.set(r.district, (districtMap.get(r.district) ?? 0) + 1);
    }
  }
  const districts = [...districtMap.entries()].sort((a, b) => b[1] - a[1]);

  const koCount = filtered.filter((c) => (c.language_breakdown?.ko ?? 0) > 0).length;
  const koreanFriendly = filtered.filter((c) => c.is_korean_friendly).length;
  const avgTrust =
    filtered.length > 0
      ? Math.round(filtered.reduce((s, c) => s + c.trust_score, 0) / filtered.length)
      : 0;
  const content = getCityContent(name, display);

  // /green-fees/[city] 가 이 도시에 대해 실제로 발행되는지 — 그 라우트의
  // generateStaticParams 와 같은 조건(골프 시설 + 가격 보유)을 본다.
  const pricedIds = new Set(
    toPriceRows(await loadPriceMatrix())
      .filter((r) => r.weekday_greenfee !== null || r.weekend_greenfee !== null)
      .map((r) => r.course_id),
  );
  const hasGreenFees = filterByCityOrAlias(golfOnly(db.restaurants), name)
    .some((c) => pricedIds.has(c.id));

  // Cross-link best-of curations that have ≥3 matches in this city
  const bestForCity = BEST_FOR
    .map((b) => {
      const matches = filtered.filter((r) => !b.filterFn || b.filterFn(r));
      return { cfg: b, count: matches.length };
    })
    .filter((x) => x.count >= 3)
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span>{display}</span>
      </nav>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
        {display} Golf Courses
      </h1>
      <p className="text-[var(--muted)] mb-4">
        {filtered.length} courses in {display}, ranked by Trust Score from real Google reviews.
      </p>
      <p className="text-base leading-relaxed text-[var(--fg)] mb-6 max-w-3xl">
        {content.intro}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 text-center">
        <div className="rounded-xl border border-[var(--border)] bg-white p-3">
          <div className="text-2xl font-bold tabular-nums">{filtered.length}</div>
          <div className="text-xs text-[var(--muted)]">Courses</div>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-white p-3">
          <div className="text-2xl font-bold tabular-nums">{avgTrust}</div>
          <div className="text-xs text-[var(--muted)]">Avg Trust</div>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-white p-3">
          <div className="text-2xl font-bold tabular-nums">{koCount}</div>
          <div className="text-xs text-[var(--muted)]">Korean reviews</div>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-white p-3">
          <div className="text-2xl font-bold tabular-nums">{koreanFriendly}</div>
          <div className="text-xs text-[var(--muted)]">🇰🇷 caddy verified</div>
        </div>
      </div>

      {categories.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">By Type</h2>
          <div className="flex flex-wrap gap-2">
            {categories.slice(0, 16).map(([c, n]) => (
              <a
                key={c}
                href={`/c/${c}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
              >
                <span aria-hidden>{CATEGORY_ICONS[c] ?? "⛳"}</span>
                {CATEGORY_LABELS[c] ?? c}
                <span className="text-[var(--muted)] tabular-nums">{n}</span>
              </a>
            ))}
          </div>
        </section>
      )}

      {districts.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">By District</h2>
          <div className="flex flex-wrap gap-2">
            {districts.map(([d, n]) => (
              <a
                key={d}
                href={`/d/${d.toLowerCase().replace(/\s+/g, "-")}`}
                className="px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
              >
                📍 {d} <span className="text-[var(--muted)]">{n}</span>
              </a>
            ))}
          </div>
        </section>
      )}

      {bestForCity.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
            Best {display} courses by criterion
          </h2>
          <div className="grid sm:grid-cols-2 gap-2">
            {bestForCity.map(({ cfg, count }) => (
              <a
                key={cfg.slug}
                href={`/best/${cfg.slug}`}
                className="block px-4 py-3 rounded-xl border border-[var(--border)] text-sm bg-white hover:border-[var(--accent)] hover:bg-emerald-50 transition"
              >
                <div className="font-medium">
                  {cfg.title.replace(/^Best |^Most /, "").replace(/ in Thailand$/, "")}
                </div>
                <div className="text-xs text-[var(--muted)] mt-0.5">
                  {count} {display} courses match · view ranking
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* 상업적 의도 쿼리("hua hin golf green fees")용 페이지로 보내는 내부링크.
          sitemap 등재만으로는 크롤 우선순위가 낮다. 가격이 실린 코스가 있을 때만 링크한다 —
          없으면 그 라우트가 발행되지 않아 404가 된다. */}
      {hasGreenFees && (
        <section className="mb-8">
          <a
            href={`/green-fees/${name}`}
            className="block px-4 py-3 rounded-xl border border-emerald-200 bg-emerald-50/50 text-sm hover:border-[var(--accent)] transition"
          >
            <div className="font-medium">💰 {display} green fees — all-in price comparison</div>
            <div className="text-xs text-[var(--muted)] mt-0.5">
              Green fee + caddy + cart totals, weekday vs weekend, cheapest first.
            </div>
          </a>
        </section>
      )}

      <TravelStackAffiliate city={name} cityLabel={display} context="city" />

      <AdSlot slot="city-mid" />

      {/* 카드 24장 + 나머지는 경량 목록. 100장을 깔았더니 /city/bangkok 이 972KB 였다. */}
      <section>
        <h2 className="text-xl font-bold mb-4">
          Top {Math.min(filtered.length, CARD_COUNT)} in {display}
        </h2>
        <div className="grid gap-3">
          {filtered.slice(0, CARD_COUNT).map((r, i) => (
            <RestaurantCard key={r.id} r={r} rank={i + 1} />
          ))}
        </div>
        {filtered.length > CARD_COUNT && (
          <div className="mt-10">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-1">
              Every other course in {display}
            </h3>
            <p className="text-xs text-[var(--muted)] mb-2">
              {filtered.length - CARD_COUNT} more, same Trust Score ranking.
            </p>
            <CompactCourseList courses={filtered.slice(CARD_COUNT)} startRank={CARD_COUNT + 1} />
          </div>
        )}
      </section>

      {content.faqs.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Frequently asked — {display} golf</h2>
          <div className="space-y-3">
            {content.faqs.map((f, i) => (
              <details key={i} className="bg-white border border-[var(--border)] rounded-lg p-4 group">
                <summary className="font-medium cursor-pointer flex items-center justify-between gap-3">
                  <span>{f.q}</span>
                  <span className="text-[var(--muted)] group-open:rotate-180 transition">⌄</span>
                </summary>
                <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed whitespace-pre-line">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: display, url: `/city/${name}` },
      ]} />
      <ItemListJsonLd
        name={`Top ${display} golf courses`}
        items={filtered.slice(0, 20).map((r) => ({ name: r.name, url: `/course/${r.id}` }))}
      />
      <FaqJsonLd faqs={content.faqs} />
    </div>
  );
}
