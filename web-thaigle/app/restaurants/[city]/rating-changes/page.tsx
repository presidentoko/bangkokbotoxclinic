import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { loadMasterDb } from "@/lib/data";
import { getSlugMap, restaurantUrl, slugifySegment } from "@/lib/restaurants";
import {
  CHANGE,
  earlierLabel,
  pct,
  ratingChangeFaqs,
  ratingChangeReport,
  hasRatingChangePage,
  type Mover,
} from "@/lib/ratingChange";
import type { Restaurant } from "@/lib/types";
import { BreadcrumbJsonLd, FaqJsonLd, ItemListJsonLd } from "@/components/JsonLd";

export const dynamic = "force-static";
export const dynamicParams = false;

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.thaigle.com";

/** Rows printed per direction. The counts above the tables are the full totals. */
const SHOW = 25;

function cityLabel(city: string) {
  return city.charAt(0).toUpperCase() + city.slice(1);
}

function collectedOn(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

export async function generateStaticParams() {
  const db = await loadMasterDb();
  const cities = [...new Set(db.restaurants.map((r) => r.city))];
  return cities.filter((city) => hasRatingChangePage(db.restaurants, city)).map((city) => ({ city }));
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params;
  const db = await loadMasterDb();
  const rep = ratingChangeReport(db.restaurants, city);
  const label = cityLabel(city);
  const title = `${label} restaurants whose rating has moved — ${rep.down.length} falling, ${rep.up.length} rising`;
  const description = `Last three months of Google reviews against earlier ones for ${rep.eligible} ${label} restaurants: ${rep.down.length} fell by ${CHANGE.minDelta}★ or more, ${rep.up.length} rose, ${pct(rep.flat, rep.eligible)} held steady.`;
  return {
    title,
    description: description.slice(0, 158),
    alternates: { canonical: `/restaurants/${city}/rating-changes` },
    openGraph: { title, description, url: `/restaurants/${city}/rating-changes` },
  };
}

function MoverTable({
  rows,
  slugMap,
  caption,
}: {
  rows: Mover<Restaurant>[];
  slugMap: Awaited<ReturnType<typeof getSlugMap>>;
  caption: string;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-white">
      <table className="w-full text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="text-left text-xs uppercase tracking-wide text-[var(--muted)] border-b border-[var(--border)]">
          <tr>
            <th className="p-3 font-bold">Restaurant</th>
            <th className="p-3 font-bold text-right">Last 3 months</th>
            <th className="p-3 font-bold text-right">Earlier</th>
            <th className="p-3 font-bold text-right">Change</th>
            <th className="p-3 font-bold text-right hidden sm:table-cell">Google overall</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ r, change }) => {
            const entry = slugMap[r.id];
            return (
              <tr key={r.id} className="border-b border-[var(--border)] last:border-0 align-top">
                <td className="p-3">
                  {entry ? (
                    <a href={restaurantUrl(entry)} className="font-bold hover:underline">{r.name}</a>
                  ) : (
                    <span className="font-bold">{r.name}</span>
                  )}
                  {r.district && <div className="text-xs text-[var(--muted)]">{r.district}</div>}
                </td>
                <td className="p-3 text-right whitespace-nowrap">
                  ★{change.recent.avg.toFixed(2)}
                  <div className="text-xs text-[var(--muted)]">{change.recent.count} reviews</div>
                </td>
                <td className="p-3 text-right whitespace-nowrap">
                  ★{change.earlier.avg.toFixed(2)}
                  <div className="text-xs text-[var(--muted)]">
                    {change.earlier.count} · {change.earlier.bucket === "old" ? "1+ yr" : "3–12 mo"}
                  </div>
                </td>
                <td className={`p-3 text-right font-black whitespace-nowrap ${change.delta < 0 ? "text-orange-700" : "text-green-700"}`}>
                  {change.delta > 0 ? "+" : "−"}
                  {Math.abs(change.delta).toFixed(2)}
                </td>
                <td className="p-3 text-right whitespace-nowrap hidden sm:table-cell">
                  ★{r.rating.toFixed(1)}
                  <div className="text-xs text-[var(--muted)]">{r.total_reviews.toLocaleString()}</div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default async function RatingChangesPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const [db, slugMap] = await Promise.all([loadMasterDb(), getSlugMap()]);
  const rep = ratingChangeReport(db.restaurants, city);
  if (!hasRatingChangePage(db.restaurants, city)) notFound();

  const label = cityLabel(city);
  const collected = collectedOn(db.generated_at);
  const faqs = ratingChangeFaqs(rep, label, collected);
  const url = `/restaurants/${city}/rating-changes`;
  const steady = pct(rep.flat, rep.eligible);
  const worst = rep.down[0];
  const best = rep.up[0];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <BreadcrumbJsonLd
        items={[
          { name: "Thaigle", url: "/" },
          { name: "Restaurants", url: "/restaurants" },
          { name: label, url: `/restaurants/${city}` },
          { name: "Rating changes", url },
        ]}
      />
      <FaqJsonLd faqs={faqs} />
      <ItemListJsonLd
        name={`${label} restaurants whose Google rating fell`}
        items={rep.down.slice(0, SHOW).flatMap(({ r }) => {
          const e = slugMap[r.id];
          return e ? [{ name: r.name, url: restaurantUrl(e) }] : [];
        })}
      />

      <nav className="text-sm text-[var(--muted)] mb-4 flex items-center gap-2 flex-wrap">
        <a href="/restaurants" className="hover:text-black">Restaurants</a>
        <span>›</span>
        <a href={`/restaurants/${city}`} className="hover:text-black">{label}</a>
        <span>›</span>
        <span className="text-[var(--fg)]">Rating changes</span>
      </nav>

      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight">
          {label} restaurants whose Google rating has moved
        </h1>
        <p className="text-sm text-[var(--muted)] mt-2 max-w-2xl leading-relaxed">
          A restaurant&apos;s star rating averages every review it has ever had. This page compares only the last
          three months of reviews with earlier ones, so a place that has slipped — or turned itself around — shows up
          before its headline number catches up.
        </p>
      </header>

      {/* Short answer */}
      <section className="mb-6 rounded-2xl border border-[var(--border)] bg-white p-4 md:p-5" aria-labelledby="answer-heading">
        <h2 id="answer-heading" className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-2">The short answer</h2>
        <p className="leading-relaxed">
          Of <strong>{rep.eligible.toLocaleString()}</strong> open {label} restaurants with at least {CHANGE.minRecent} recent
          and {CHANGE.minEarlier} earlier reviews in our sample, <strong>{steady}</strong> held their average within{" "}
          {CHANGE.minDelta} stars. <strong>{rep.down.length}</strong> fell by {CHANGE.minDelta}★ or more and{" "}
          <strong>{rep.up.length}</strong> rose by as much.
          {worst && (
            <>
              {" "}The biggest fall was {worst.r.name}, from ★{worst.change.earlier.avg.toFixed(2)} to ★
              {worst.change.recent.avg.toFixed(2)}.
            </>
          )}
          {best && (
            <>
              {" "}The biggest rise was {best.r.name}, from ★{best.change.earlier.avg.toFixed(2)} to ★
              {best.change.recent.avg.toFixed(2)}.
            </>
          )}
        </p>
        <p className="text-xs text-[var(--muted)] mt-3">
          The other {(rep.total - rep.eligible).toLocaleString()} open {label} restaurants we list do not have enough dated
          reviews on both sides to say either way, so they are left out rather than guessed at.
        </p>
      </section>

      <section className="mb-8" aria-labelledby="down-heading">
        <h2 id="down-heading" className="text-lg font-black mb-1">Falling: {rep.down.length} restaurants</h2>
        <p className="text-sm text-[var(--muted)] mb-3">
          Recent reviews average at least {CHANGE.minDelta} stars below earlier ones. Largest fall first
          {rep.down.length > SHOW ? `; the ${SHOW} largest are shown` : ""}.
        </p>
        <MoverTable rows={rep.down.slice(0, SHOW)} slugMap={slugMap} caption={`${label} restaurants whose recent rating fell`} />
      </section>

      <section className="mb-8" aria-labelledby="up-heading">
        <h2 id="up-heading" className="text-lg font-black mb-1">Rising: {rep.up.length} restaurants</h2>
        <p className="text-sm text-[var(--muted)] mb-3">
          Recent reviews average at least {CHANGE.minDelta} stars above earlier ones. Largest rise first
          {rep.up.length > SHOW ? `; the ${SHOW} largest are shown` : ""}.
        </p>
        <MoverTable rows={rep.up.slice(0, SHOW)} slugMap={slugMap} caption={`${label} restaurants whose recent rating rose`} />
      </section>

      {rep.districts.length > 0 && (
        <section className="mb-8" aria-labelledby="district-heading">
          <h2 id="district-heading" className="text-lg font-black mb-1">By district</h2>
          <p className="text-sm text-[var(--muted)] mb-3">
            Districts with enough comparable restaurants to count. &ldquo;Comparable&rdquo; means the sample has at
            least {CHANGE.minRecent} reviews on each side.
          </p>
          <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-white">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wide text-[var(--muted)] border-b border-[var(--border)]">
                <tr>
                  <th className="p-3 font-bold">District</th>
                  <th className="p-3 font-bold text-right">Comparable</th>
                  <th className="p-3 font-bold text-right">Falling</th>
                  <th className="p-3 font-bold text-right">Rising</th>
                  <th className="p-3 font-bold text-right">Steady</th>
                </tr>
              </thead>
              <tbody>
                {rep.districts.map((d) => (
                  <tr key={d.district} className="border-b border-[var(--border)] last:border-0">
                    <td className="p-3">
                      <a href={`/restaurants/${city}/${slugifySegment(d.district)}`} className="font-bold hover:underline">{d.district}</a>
                    </td>
                    <td className="p-3 text-right">{d.eligible}</td>
                    <td className="p-3 text-right">{d.down}</td>
                    <td className="p-3 text-right">{d.up}</td>
                    <td className="p-3 text-right">{pct(d.eligible - d.down - d.up, d.eligible)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className="mb-6 rounded-2xl border border-[var(--border)] bg-white p-4 md:p-5" aria-labelledby="limits-heading">
        <h2 id="limits-heading" className="text-lg font-black mb-2">How this is worked out, and what it can&apos;t tell you</h2>
        <div className="space-y-2 text-sm leading-relaxed text-[var(--muted)]">
          <p>
            <strong className="text-[var(--fg)]">Source.</strong> For each restaurant we collected a sample of its
            Google Maps reviews (a median of {rep.medianSample} per restaurant on this page, not every review) with the age Google shows on each one
            {collected ? `; this data was compiled ${collected}` : ""}. &ldquo;Last 3 months&rdquo; is reviews dated up
            to three months before collection. &ldquo;Earlier&rdquo; is reviews from {earlierLabel("old")} when there
            are at least {CHANGE.minEarlier} of them, otherwise from {earlierLabel("midterm")}.
          </p>
          <p>
            <strong className="text-[var(--fg)]">The rule.</strong> A restaurant is listed only when both sides have at
            least {CHANGE.minRecent} reviews and the averages differ by {CHANGE.minDelta} stars or more. This is a
            threshold, not a statistical test: on {CHANGE.minRecent} reviews one or two unusual ones still move the
            average, which is why smaller samples are left out entirely.
          </p>
          <p>
            <strong className="text-[var(--fg)]">Limits.</strong> The numbers show that recent reviewers rate a place
            differently, not why — a new owner, a price rise, a viral moment that brought a different crowd, or simply
            who chose to write a review. A sudden climb to near-perfect scores is also what a paid or incentivised
            review push looks like, so a big rise deserves the same reading as a big fall. Google&apos;s review ages are approximate (&ldquo;a year ago&rdquo;), and
            restaurants Google lists as closed are excluded. Read a place&apos;s latest reviews before deciding.{" "}
            <a href="/methodology" className="underline">How Thaigle scores restaurants</a>.
          </p>
        </div>
      </section>

      <section className="mb-8" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-lg font-black mb-3">Questions people ask</h2>
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div key={i}>
              <h3 className="font-bold text-[15px]">{f.q}</h3>
              <p className="text-sm leading-relaxed text-[var(--muted)] mt-1">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <p className="text-sm">
        <a href={`/restaurants/${city}`} className="font-bold text-orange-700 hover:underline">All {label} restaurants →</a>
      </p>
    </div>
  );
}
