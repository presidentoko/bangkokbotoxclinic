import type { Metadata } from "next";
import { loadNicheDb, qualifyingNichePlaces } from "@/lib/niches";
import { FaqJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";
import { ShareButton } from "@/components/ShareButton";

export const dynamic = "force-static";
const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thaigle.com";

/**
 * A findings page built from the spa dataset, published to be cited.
 *
 * A directory with no backlinks cannot reach head terms ("spa bangkok") by
 * writing more listing pages — it needs other sites to link to it, and the
 * thing a Thai-media or travel desk will link to is a number they can quote.
 * This page is the one asset here that has a reason to be linked rather than
 * merely found.
 *
 * Every figure is computed from the live dataset at build time, never
 * hardcoded, so the page cannot drift away from what the site actually holds.
 * Price is deliberately absent: only 58 of 2,251 spas carry one (2.5%), and a
 * "Bangkok spas cost X" claim off that base would be invention. Rating and
 * review count are on 99%, which is what makes the rating story tellable at
 * all.
 */
const PERFECT = 5;

type Bucket = { label: string; min: number; max: number; n: number };

async function stats() {
  const db = await loadNicheDb("spa");
  const all = qualifyingNichePlaces("spa", db.places);
  const rated = all.filter((p) => !!p.rating && !!p.review_count);

  const buckets: Bucket[] = [
    { label: "4.9 – 5.0", min: 4.9, max: 5.01, n: 0 },
    { label: "4.7 – 4.8", min: 4.7, max: 4.9, n: 0 },
    { label: "4.5 – 4.6", min: 4.5, max: 4.7, n: 0 },
    { label: "4.0 – 4.4", min: 4.0, max: 4.5, n: 0 },
    { label: "Below 4.0", min: 0, max: 4.0, n: 0 },
  ];
  for (const p of rated) {
    const r = p.rating!;
    const b = buckets.find((x) => r >= x.min && r < x.max);
    if (b) b.n++;
  }

  const median = (xs: number[]) => {
    if (xs.length === 0) return 0;
    const s = [...xs].sort((a, b) => a - b);
    return s[Math.floor(s.length / 2)];
  };

  const perfect = rated.filter((p) => p.rating === PERFECT);
  const highRated = rated.filter((p) => p.rating! >= 4.5).length;

  const CITIES = ["Bangkok", "Chiang Mai", "Phuket", "Pattaya"];
  const cities = CITIES.map((city) => {
    const ps = rated.filter((p) => p.city === city);
    return {
      city,
      n: ps.length,
      medianReviews: median(ps.map((p) => p.review_count!)),
      medianRating: median(ps.map((p) => p.rating!)),
    };
  }).filter((c) => c.n >= 50);

  return {
    total: all.length,
    rated: rated.length,
    buckets,
    highRatedShare: Math.round((highRated / rated.length) * 100),
    topBucketShare: Math.round((buckets[0].n / rated.length) * 100),
    perfectCount: perfect.length,
    perfectMedianReviews: median(perfect.map((p) => p.review_count!)),
    medianReviews: median(rated.map((p) => p.review_count!)),
    thinShare: Math.round(
      (rated.filter((p) => p.review_count! < 100).length / rated.length) * 100,
    ),
    cities,
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const s = await stats();
  return {
    title: `Thailand Spa Rating Report 2026 — ${s.highRatedShare}% Score 4.5★ or Higher`,
    description: `An analysis of ${s.total.toLocaleString()} Thai spas and massage venues: ${s.highRatedShare}% rate 4.5 stars or above, ${s.perfectCount} sit at a perfect 5.0 on a median of just ${s.perfectMedianReviews} reviews. Why Google's star rating no longer separates them, and what does.`,
    alternates: { canonical: "/activities/spa/rating-report" },
    openGraph: {
      title: `Thailand Spa Rating Report 2026`,
      description: `${s.highRatedShare}% of ${s.total.toLocaleString()} Thai spas rate 4.5★ or higher. The star rating has stopped being a filter.`,
    },
  };
}

function Bar({ label, n, total }: { label: string; n: number; total: number }) {
  const pct = (n / total) * 100;
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-20 shrink-0 tabular-nums text-[var(--muted)]">{label}</span>
      <span className="flex-1 h-6 bg-[var(--border)]/40 rounded overflow-hidden">
        <span
          className="block h-full bg-orange-400 rounded"
          style={{ width: `${Math.max(pct, 0.6)}%` }}
        />
      </span>
      <span className="w-24 shrink-0 text-right tabular-nums font-bold">
        {n.toLocaleString()}
        <span className="text-[var(--muted)] font-normal"> · {pct.toFixed(1)}%</span>
      </span>
    </div>
  );
}

export default async function SpaRatingReportPage() {
  const s = await stats();
  const pageUrl = `${SITE}/activities/spa/rating-report`;
  const busiest = [...s.cities].sort((a, b) => b.medianReviews - a.medianReviews)[0];
  const quietest = [...s.cities].sort((a, b) => a.medianReviews - b.medianReviews)[0];

  const faqs = [
    {
      q: "What share of Thai spas rate 4.5 stars or higher on Google?",
      a: `${s.highRatedShare}% of the ${s.rated.toLocaleString()} rated spa and massage venues in this dataset score 4.5 or above, and ${s.topBucketShare}% score 4.9 or above. A filter that keeps three quarters of the market is not a filter.`,
    },
    {
      q: "How many Thai spas have a perfect 5.0 rating?",
      a: `${s.perfectCount} venues sit at exactly 5.0 — but their median review count is ${s.perfectMedianReviews}, against ${s.medianReviews} across all rated venues. A perfect score is usually a small-sample artefact rather than a stronger result.`,
    },
    {
      q: "Which Thai city has the most-reviewed spas?",
      a: `${busiest.city}, at a median of ${busiest.medianReviews.toLocaleString()} reviews per venue, against ${quietest.medianReviews.toLocaleString()} in ${quietest.city}. Median ratings across these cities sit within ${(Math.max(...s.cities.map((c) => c.medianRating)) - Math.min(...s.cities.map((c) => c.medianRating))).toFixed(1)} of one another, so review volume separates these markets where the star rating does not.`,
    },
    {
      q: "How was this measured?",
      a: `From ${s.total.toLocaleString()} spa and massage venues in Thailand that clear Thaigle's listing threshold, of which ${s.rated.toLocaleString()} carry both a Google rating and a review count. Ratings and review counts are public Google Maps data. Price is excluded on purpose: only a fraction of venues publish one, which is too few to describe a market.`,
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-5 flex flex-wrap items-center gap-1.5">
        <a href="/" className="hover:text-black">Home</a>
        <span>›</span>
        <a href="/activities" className="hover:text-black">Activities</a>
        <span>›</span>
        <a href="/activities/spa" className="hover:text-black">Spa &amp; Massage</a>
        <span>›</span>
        <span>Rating Report</span>
      </nav>

      <div className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold mb-3">
        Data report · {s.total.toLocaleString()} venues
      </div>
      <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-balance">
          {s.highRatedShare}% of Thai spas rate 4.5★ or higher
        </h1>
        <ShareButton
          title="Thailand Spa Rating Report 2026"
          text={`${s.highRatedShare}% of ${s.total.toLocaleString()} Thai spas rate 4.5★ or higher — the star rating has stopped separating them`}
          url={pageUrl}
          line
          whatsapp
        />
      </div>
      <p className="text-base text-[var(--muted)] leading-relaxed mb-8">
        We rank {s.total.toLocaleString()} spa and massage venues across Thailand, {s.rated.toLocaleString()} of
        them carrying a Google rating. Reading those ratings together shows why choosing a spa by
        star score no longer works — and what the numbers can still tell you.
      </p>

      <section className="mb-10">
        <h2 className="text-xl font-black mb-1">Finding 1 — the top of the scale is crowded</h2>
        <p className="text-sm text-[var(--muted)] mb-4">
          Rating distribution across {s.rated.toLocaleString()} rated venues.
        </p>
        <div className="space-y-2 bg-white border border-[var(--border)] rounded-2xl p-5">
          {s.buckets.map((b) => (
            <Bar key={b.label} label={b.label} n={b.n} total={s.rated} />
          ))}
        </div>
        <p className="text-sm leading-relaxed mt-4">
          {s.topBucketShare}% of venues sit in the top band alone. Sorting a Thai city&apos;s spas by
          star rating returns hundreds of ties, which is the practical reason a rating filter feels
          useless once you are actually choosing between two places.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-black mb-1">Finding 2 — a perfect score usually means few reviews</h2>
        <div className="grid grid-cols-2 gap-3 my-4">
          <div className="bg-white border border-[var(--border)] rounded-2xl p-5">
            <div className="text-3xl font-black tabular-nums">{s.perfectMedianReviews}</div>
            <div className="text-xs text-[var(--muted)] mt-1">
              median reviews among the {s.perfectCount} venues rated exactly 5.0
            </div>
          </div>
          <div className="bg-white border border-[var(--border)] rounded-2xl p-5">
            <div className="text-3xl font-black tabular-nums">{s.medianReviews}</div>
            <div className="text-xs text-[var(--muted)] mt-1">median reviews across all rated venues</div>
          </div>
        </div>
        <p className="text-sm leading-relaxed">
          A 5.0 is easier to hold the fewer people have rated you. {s.thinShare}% of rated venues have
          fewer than 100 reviews at all, so a large share of the perfect scores in this market are
          small-sample results rather than better ones.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-black mb-1">Finding 3 — cities differ by review volume, not by rating</h2>
        <div className="overflow-x-auto mt-4 border border-[var(--border)] rounded-2xl bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-[var(--muted)]">
                <th className="px-4 py-3 font-bold">City</th>
                <th className="px-4 py-3 font-bold text-right">Venues</th>
                <th className="px-4 py-3 font-bold text-right">Median rating</th>
                <th className="px-4 py-3 font-bold text-right">Median reviews</th>
              </tr>
            </thead>
            <tbody>
              {s.cities.map((c) => (
                <tr key={c.city} className="border-t border-[var(--border)]">
                  <td className="px-4 py-3 font-bold">{c.city}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{c.n.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{c.medianRating.toFixed(1)}★</td>
                  <td className="px-4 py-3 text-right tabular-nums">{c.medianReviews.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm leading-relaxed mt-4">
          Median ratings land within a few tenths of each other everywhere. Review volume does not:
          a typical {busiest.city} spa carries {busiest.medianReviews.toLocaleString()} reviews against{" "}
          {quietest.medianReviews.toLocaleString()} in {quietest.city}. That gap describes how
          contested each market is, and it is the more useful number of the two.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-black mb-1">What we use instead</h2>
        <p className="text-sm leading-relaxed mb-3">
          Because the star rating ties, our rankings score a venue on rating <em>and</em> how much
          evidence sits behind it, so a 4.7 with 800 reviews outranks a 5.0 with 40. Nothing on this
          site is a paid placement.
        </p>
        <div className="flex flex-wrap gap-2">
          <a href="/activities/spa" className="px-3 py-1.5 rounded-full border border-[var(--border)] text-sm font-bold hover:border-orange-400 transition">
            All spas, ranked →
          </a>
          <a href="/activities/spa/boutique" className="px-3 py-1.5 rounded-full border border-[var(--border)] text-sm font-bold hover:border-orange-400 transition">
            Boutique spas →
          </a>
          <a href="/methodology" className="px-3 py-1.5 rounded-full border border-[var(--border)] text-sm font-bold hover:border-orange-400 transition">
            How Trust Score works →
          </a>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-black mb-4">Questions about this report</h2>
        <div className="space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="bg-white border border-[var(--border)] rounded-xl p-4 group">
              <summary className="font-semibold cursor-pointer flex items-center justify-between gap-3 text-sm">
                <span>{f.q}</span>
                <span className="text-[var(--muted)] group-open:rotate-180 transition shrink-0">⌄</span>
              </summary>
              <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <p className="text-xs text-[var(--muted)] leading-relaxed border-t border-[var(--border)] pt-4">
        Free to quote with a link to this page. Figures are recomputed from the underlying dataset on
        every deploy, so they track the source rather than a snapshot.
      </p>

      <FaqJsonLd faqs={faqs} />
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Activities", url: "/activities" },
        { name: "Spa & Massage", url: "/activities/spa" },
        { name: "Rating Report", url: "/activities/spa/rating-report" },
      ]} />
    </div>
  );
}
