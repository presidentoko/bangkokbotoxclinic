// web-golf/app/green-fees/[city]/page.tsx
import { notFound } from "next/navigation";
import { loadMasterDb, filterByCityOrAlias, resolveCityAlias, golfOnly, getCourseById } from "@/lib/data";
import { loadPriceMatrix, toPriceRows, sortRowsByCheapest, medianWeekendPremiumPct } from "@/lib/priceMatrix";
import { providerNames, formatScrapeDate } from "@/lib/providers";
import { indexableCities } from "@/lib/crawlGate";
import { BreadcrumbJsonLd, ItemListJsonLd, FaqJsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.thailandgolfguide.com";

export const dynamic = "force-static";
export const revalidate = 604800; // 7 days — green fee data doesn't change hourly

function citySlug(label: string): string {
  return label.toLowerCase().replace(/\s+/g, "_");
}

// Cities (incl. the Hua Hin alias) that have at least one golf course with
// published price data — mirrors app/city/[name]/page.tsx's static param
// generation, but additionally requires a priced course so we never build an
// empty green-fees page.
// 도시 목록은 반드시 lib/crawlGate 의 indexableCities 를 거쳐야 한다 — 그게
// /city/[name] 과 sitemap 이 쓰는 것과 같은 목록이고, 목적지 별칭(hua_hin, pattaya,
// koh_samui, hat_yai)을 전부 포함한다. 여기서 별칭을 따로 하드코딩하면 sitemap 에는
// 있는데 발행되지 않는 URL 이 생겨 404 가 된다.
export async function generateStaticParams() {
  const [db, matrix] = await Promise.all([loadMasterDb(), loadPriceMatrix()]);
  const pricedCourseIds = new Set(
    toPriceRows(matrix)
      .filter((r) => r.weekday_greenfee !== null || r.weekend_greenfee !== null)
      .map((r) => r.course_id)
  );
  const courses = golfOnly(db.restaurants);

  return indexableCities(db.restaurants, Object.keys(db.city_counts))
    .filter((slug) => filterByCityOrAlias(courses, slug).some((c) => pricedCourseIds.has(c.id)))
    .map((city) => ({ city }));
}

// force-static alone doesn't stop Next from on-demand-generating unlisted
// params — explicit false is needed to make bot/scanner probes 404 instantly
// instead of writing a fresh ISR cache entry.
export const dynamicParams = false;

export async function generateMetadata(
  { params }: { params: Promise<{ city: string }> }
): Promise<Metadata> {
  const { city: rawName } = await params;
  const name = decodeURIComponent(rawName);
  const db = await loadMasterDb();
  const displayKey = resolveCityAlias(name)?.label
    ?? Object.keys(db.city_counts).find((k) => citySlug(k) === name);
  const display = displayKey ?? name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `Golf Green Fees in ${display} 2026 — Price Comparison`,
    description: `Weekday and weekend green fees for golf courses in ${display}, Thailand, compared across the booking sites that publish them. Scraped rates only — no estimates.`,
    alternates: { canonical: `/green-fees/${name}` },
    openGraph: {
      title: `Golf Green Fees in ${display} 2026 — Price Comparison`,
      description: `Weekday and weekend green fees for golf courses in ${display}, compared across booking sites.`,
      url: `${SITE}/green-fees/${name}`,
    },
  };
}

export default async function GreenFeesCityPage(
  { params }: { params: Promise<{ city: string }> }
) {
  const { city: rawName } = await params;
  const name = decodeURIComponent(rawName);
  const [db, matrix] = await Promise.all([loadMasterDb(), loadPriceMatrix()]);

  const courses = filterByCityOrAlias(golfOnly(db.restaurants), name);
  if (courses.length === 0) notFound();

  const display = resolveCityAlias(name)?.label ?? courses[0]?.city_label ?? name.replace(/_/g, " ");

  const priceRows = toPriceRows(matrix);
  const courseIds = new Set(courses.map((c) => c.id));
  const rows = priceRows.filter(
    (r) => courseIds.has(r.course_id) && (r.weekday_greenfee !== null || r.weekend_greenfee !== null)
  );
  if (rows.length === 0) notFound();

  const sorted = sortRowsByCheapest(rows);
  const premium = medianWeekendPremiumPct(rows);
  const multi = rows.filter((r) => r.sources >= 2).length;

  const latestScrape = matrix.find((m) => courseIds.has(m.course_id))?.scraped_at;
  const scraped_at = formatScrapeDate(latestScrape ?? null);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <a href={`/city/${name}`} className="hover:text-[var(--fg)]">{display}</a>
        <span className="mx-2">›</span>
        <span>Green Fees</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
          Golf Green Fees in {display} — Compared
        </h1>
        <p className="text-base text-[var(--muted)] max-w-2xl">
          Green fees for {sorted.length} {display} golf course{sorted.length === 1 ? "" : "s"} with a
          published rate, cheapest weekday first, compared across {providerNames()}. Only figures the
          booking sites state — a dash means that number is not published.
          {multi > 0 ? ` ${multi} of them are listed by more than one site.` : ""}
        </p>
        {scraped_at && (
          <p className="text-xs text-[var(--muted)] mt-2">Rates checked {scraped_at}. Confirm on the booking site before you travel.</p>
        )}
      </header>

      <div className="overflow-x-auto rounded-2xl border border-[var(--border)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-emerald-50 text-left">
              <th className="px-4 py-3 font-bold">#</th>
              <th className="px-4 py-3 font-bold">Course</th>
              <th className="px-4 py-3 font-bold text-right bg-emerald-100">Weekday ฿</th>
              <th className="px-4 py-3 font-bold text-right">Weekend ฿</th>
              <th className="px-4 py-3 font-bold text-center">Sources</th>
              <th className="px-4 py-3 font-bold">Cheapest link</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => {
              const course = getCourseById(db.restaurants, row.course_id);
              return (
                <tr key={row.course_id} className="border-t border-[var(--border)] hover:bg-emerald-50/30 transition">
                  <td className="px-4 py-3 text-[var(--muted)] tabular-nums">{i + 1}</td>
                  <td className="px-4 py-3">
                    <a href={`/course/${row.course_id}`} className="font-medium hover:text-emerald-700 hover:underline">
                      {course?.name ?? row.course_id}
                    </a>
                    <div className="text-xs text-[var(--muted)]">{course?.district || course?.city_label}</div>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums font-black text-emerald-700 bg-emerald-50">
                    {row.weekday_greenfee !== null ? row.weekday_greenfee.toLocaleString() : "—"}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {row.weekend_greenfee !== null ? row.weekend_greenfee.toLocaleString() : "—"}
                  </td>
                  <td className="px-4 py-3 text-center tabular-nums">{row.sources}</td>
                  <td className="px-4 py-3">
                    <a
                      href={row.source_url}
                      target="_blank"
                      rel="noopener noreferrer nofollow sponsored"
                      className="text-xs text-emerald-700 hover:underline font-medium"
                    >
                      {row.source_agency} →
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-[var(--muted)] mt-6">
        See the full <a href="/price-compare" className="text-emerald-700 hover:underline">Thailand-wide price comparison</a>{" "}
        or browse all <a href={`/city/${name}`} className="text-emerald-700 hover:underline">{display} golf courses</a>.
      </p>

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: display, url: `/city/${name}` },
        { name: "Green Fees", url: `/green-fees/${name}` },
      ]} />
      <ItemListJsonLd
        name={`${display} golf green fees`}
        items={sorted.map((r) => {
          const c = getCourseById(db.restaurants, r.course_id);
          return { name: c?.name ?? r.course_id, url: `/course/${r.course_id}` };
        })}
      />
      <FaqJsonLd faqs={[
        {
          q: `What is included in a ${display} golf green fee?`,
          a: "The green fee covers the round and course access. Caddy fee, caddy tip, cart and club rental are usually extra. Where a booking site states those figures we show them on the course page; where it does not, we leave them blank rather than guess.",
        },
        {
          q: `How much more do ${display} courses charge at the weekend?`,
          a: premium
            ? `Across the ${premium.n} ${display} courses that publish both, the weekend green fee is a median ${premium.pct}% above the weekday rate.`
            : "Too few courses here publish both a weekday and a weekend rate to state a reliable difference.",
        },
        {
          q: `Which booking sites are compared for ${display}?`,
          a: `${providerNames()}. Each figure is copied from that site's own course page, with the date it was checked shown above the table.`,
        },
      ]} />
    </div>
  );
}
