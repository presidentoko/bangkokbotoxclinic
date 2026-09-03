// web-golf/app/price-compare/page.tsx
//
// Every Thai course we have a scraped rate for, cheapest weekday first, with
// the number of booking sites behind each row. It used to sort on an "all-in"
// total that added a constant caddy and cart fee to a weekend price invented
// as weekday x 1.30, and it rendered Korean copy on a page served as lang="en".
import { loadMasterDb, getCourseById } from "@/lib/data";
import { loadPriceMatrix, toPriceRows, sortRowsByCheapest, medianWeekendPremiumPct } from "@/lib/priceMatrix";
import { providerStats, providerNames, formatScrapeDate } from "@/lib/providers";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Thailand Green Fee Comparison — Every Course, Every Booking Site",
  description:
    "Weekday and weekend green fees for Thai golf courses, compared across the booking sites that publish them. Scraped rates only — no estimates, no markups.",
  alternates: { canonical: "/price-compare" },
};

function baht(n: number | null): string {
  return n === null ? "—" : `฿${n.toLocaleString()}`;
}

export default async function PriceComparePage() {
  const [db, matrix] = await Promise.all([loadMasterDb(), loadPriceMatrix()]);
  const rows = sortRowsByCheapest(toPriceRows(matrix));
  const stats = providerStats();
  const checked = formatScrapeDate(stats.latestScrape);
  const premium = medianWeekendPremiumPct(rows);
  const multi = rows.filter((r) => r.sources >= 2).length;

  const faqs = [
    {
      q: "Which booking sites does this compare?",
      a: `${providerNames()}. We read each site's own course pages and copy the green fee it publishes. A course appears here once any of them lists a rate; ${multi} courses are listed by more than one site, so you can see where they disagree.`,
    },
    {
      q: "Why are some cells empty?",
      a: "A dash means that booking site does not publish that figure — a weekend rate, a caddy fee, a cart fee. We leave it blank rather than estimate it. An earlier version of this page filled those gaps with a fixed caddy fee, a fixed cart fee and a weekend price calculated as the weekday price plus 30%; those numbers were not real and have been removed.",
    },
    {
      q: "Is this the price I pay at the course?",
      a: "It is the green fee the booking site advertises for one player. Caddy fee, cart, club rental and insurance may be extra and are shown separately where the site states them. Rates move with the season, so confirm on the booking site before you travel.",
    },
    {
      q: "Is the cheapest listing always the best?",
      a: "Not necessarily. Some rates include the cart and caddy and some do not, which is why the inclusions each site states are shown on the course page. Compare what is bundled, not only the headline number.",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Green fee comparison", url: "/price-compare" },
        ]}
      />
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span>Green fee comparison</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          Thailand green fees, compared across booking sites
        </h1>
        <p className="text-base text-[var(--muted)] max-w-2xl">
          {rows.length} courses with a published rate, sorted by the cheapest weekday green fee we
          can find. Sources: {providerNames()}. Only scraped figures appear here — a dash means the
          site does not state that number.
        </p>
        <div className="flex flex-wrap gap-4 mt-4 text-sm">
          <span>
            <strong>{rows.length}</strong> courses priced
          </span>
          <span>
            <strong>{multi}</strong> listed by two sites
          </span>
          {premium && (
            <span>
              Weekend costs <strong>{premium.pct}%</strong> more than weekday (median of{" "}
              {premium.n} courses that publish both)
            </span>
          )}
          {checked && <span className="text-[var(--muted)]">Rates checked {checked}</span>}
        </div>
      </header>

      {rows.length === 0 ? (
        <div className="p-8 text-center border border-[var(--border)] rounded-2xl text-[var(--muted)]">
          No scraped rates on file. Run scripts/golf_providers/ to collect them.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[var(--border)]">
          <table className="w-full text-sm">
            <thead className="bg-[var(--bg-subtle,#f8f8f8)] text-left">
              <tr>
                <th className="px-3 py-2 font-semibold">Course</th>
                <th className="px-3 py-2 font-semibold text-right">Weekday</th>
                <th className="px-3 py-2 font-semibold text-right">Weekend</th>
                <th className="px-3 py-2 font-semibold text-right">Caddy</th>
                <th className="px-3 py-2 font-semibold text-right">Cart</th>
                <th className="px-3 py-2 font-semibold text-center">Sources</th>
                <th className="px-3 py-2 font-semibold">Book</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const c = getCourseById(db.restaurants, row.course_id);
                if (!c) return null;
                return (
                  <tr key={row.course_id} className="border-t border-[var(--border)]">
                    <td className="px-3 py-2">
                      <a href={`/course/${c.id}`} className="font-medium hover:text-[var(--accent)]">
                        {c.name}
                      </a>
                      <div className="text-xs text-[var(--muted)]">{c.city_label}</div>
                    </td>
                    <td className="px-3 py-2 text-right font-semibold tabular-nums">
                      {baht(row.weekday_greenfee)}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">{baht(row.weekend_greenfee)}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{baht(row.caddy)}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{baht(row.cart)}</td>
                    <td className="px-3 py-2 text-center tabular-nums">{row.sources}</td>
                    <td className="px-3 py-2">
                      <a
                        href={row.source_url}
                        target="_blank"
                        rel="noopener noreferrer nofollow sponsored"
                        className="text-[var(--accent)] hover:underline whitespace-nowrap"
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
      )}

      <section className="mt-10">
        <h2 className="text-xl font-bold mb-4">How this table is built</h2>
        <dl className="space-y-4 max-w-3xl">
          {faqs.map((f) => (
            <div key={f.q}>
              <dt className="font-semibold">{f.q}</dt>
              <dd className="text-sm text-[var(--muted)] mt-1 leading-relaxed">{f.a}</dd>
            </div>
          ))}
        </dl>
        <p className="text-sm text-[var(--muted)] mt-6">
          Looking for one destination? See{" "}
          <a href="/city/chon_buri" className="text-[var(--accent)] hover:underline">Pattaya and Chon Buri</a>,{" "}
          <a href="/city/bangkok" className="text-[var(--accent)] hover:underline">Bangkok</a>, or the{" "}
          <a href="/methodology" className="text-[var(--accent)] hover:underline">methodology</a>.
        </p>
      </section>
      <FaqJsonLd faqs={faqs} />
    </div>
  );
}
