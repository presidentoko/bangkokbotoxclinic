// web-golf/app/green-fees/[city]/page.tsx
import { notFound } from "next/navigation";
import { loadMasterDb, filterByCityOrAlias, resolveCityAlias, golfOnly, getCourseById } from "@/lib/data";
import { loadPriceMatrix, toPriceRows } from "@/lib/priceMatrix";
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
      .filter((r) => r.weekday_morning_total !== null || r.weekend_morning_total !== null)
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
    description: `Compare real all-in green fee totals — weekday & weekend, including caddy + cart — for golf courses in ${display}, Thailand. Sorted cheapest first, no agency markup guesswork.`,
    alternates: { canonical: `/green-fees/${name}` },
    openGraph: {
      title: `Golf Green Fees in ${display} 2026 — Price Comparison`,
      description: `Compare real all-in green fee totals — weekday & weekend, including caddy + cart — for golf courses in ${display}, Thailand.`,
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
    (r) => courseIds.has(r.course_id) && (r.weekday_morning_total !== null || r.weekend_morning_total !== null)
  );
  if (rows.length === 0) notFound();

  const sorted = [...rows].sort((a, b) => {
    const ta = a.weekend_morning_total ?? a.weekday_morning_total ?? Infinity;
    const tb = b.weekend_morning_total ?? b.weekday_morning_total ?? Infinity;
    return ta - tb;
  });

  const latestScrape = matrix.find((m) => courseIds.has(m.course_id))?.scraped_at;
  const scraped_at = latestScrape
    ? new Date(latestScrape).toLocaleDateString("en-US", { timeZone: "Asia/Bangkok", year: "numeric", month: "long", day: "numeric" })
    : null;

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
          Real all-in totals — green fee + caddy + cart — for {sorted.length} {display} golf course{sorted.length === 1 ? "" : "s"} with published pricing, sorted cheapest first. No agency markup guesswork, just what actually leaves your wallet.
        </p>
        {scraped_at && (
          <p className="text-xs text-[var(--muted)] mt-2">Last updated: {scraped_at}</p>
        )}
      </header>

      <div className="overflow-x-auto rounded-2xl border border-[var(--border)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-emerald-50 text-left">
              <th className="px-4 py-3 font-bold">#</th>
              <th className="px-4 py-3 font-bold">Course</th>
              <th className="px-4 py-3 font-bold text-right">Weekday total ฿</th>
              <th className="px-4 py-3 font-bold text-right bg-emerald-100">Weekend total ฿</th>
              <th className="px-4 py-3 font-bold">Booking agency</th>
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
                  <td className="px-4 py-3 text-right tabular-nums">
                    {row.weekday_morning_total !== null ? row.weekday_morning_total.toLocaleString() : "—"}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums font-black text-emerald-700 bg-emerald-50">
                    {row.weekend_morning_total !== null ? row.weekend_morning_total.toLocaleString() : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={row.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
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
          q: `What's included in a ${display} golf green fee?`,
          a: "Green fee covers the round (18 holes) and course access only. Caddy fee (~฿400), caddy tip (฿400–600), cart fee (฿700–1,000), and club rental (฿700–2,500) are extra. The all-in totals on this page combine green fee + caddy + cart, so it's the real amount you'll pay at the counter.",
        },
        {
          q: `How much more do ${display} courses charge on weekends?`,
          a: "Weekend rates typically run 30–60% above weekday rates at popular courses. Some country clubs add a visitor surcharge of 10–30% on top of the standard weekend rate.",
        },
        {
          q: `What's the cheapest way to book ${display} golf?`,
          a: "Booking directly with the course (official website or phone) is usually cheapest on green fee alone, though you'll need to sort transport and equipment yourself. Agencies like GolfAsian or ThailandGolfCentre add convenience — transport, packages, English support — for a modest markup.",
        },
      ]} />
    </div>
  );
}
