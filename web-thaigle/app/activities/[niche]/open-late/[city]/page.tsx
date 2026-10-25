import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NICHES, NICHE_CITY_SLUGS, loadNicheDb, qualifyingNichePlaces, type NichePlace, type NicheSlug } from "@/lib/niches";
import { AREAS } from "@/lib/areas";
import { formatClock } from "@/lib/vsMetrics";
import { BUCKETS, LATE, closeLabel, hasLatePage, lateReport, pct, type LateReport, type LateVenue } from "@/lib/lateNight";
import { BreadcrumbJsonLd, FaqJsonLd, ItemListJsonLd } from "@/components/JsonLd";
import { LATE_NICHES, allLateParams } from "@/lib/lateNightIndex";

export const dynamic = "force-static";
export const dynamicParams = false;



const CITY_BY_SLUG = Object.fromEntries(Object.entries(NICHE_CITY_SLUGS).map(([city, slug]) => [slug, city]));

export async function generateStaticParams() {
  return (await allLateParams()).map(({ niche, city }) => ({ niche, city }));
}

async function load(nicheParam: string, citySlug: string) {
  if (!(LATE_NICHES as readonly string[]).includes(nicheParam)) return null;
  const info = NICHES.find((n) => n.slug === nicheParam);
  const city = CITY_BY_SLUG[citySlug];
  if (!info || !city) return null;
  const db = await loadNicheDb(info.slug as NicheSlug);
  const places = qualifyingNichePlaces(info.slug, db.places);
  if (!hasLatePage(places, city)) return null;
  return { info, city, report: lateReport(places, city), collected: db.generated_at };
}

function areaOf(p: NichePlace): string | null {
  const hay = `${p.address ?? ""} ${p.name ?? ""}`;
  return AREAS.find((a) => a.pattern.test(hay))?.label ?? null;
}

function collectedOn(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

function faqs(r: LateReport<NichePlace>, city: string, topArea: { label: string; n: number } | null) {
  const rest = r.known - r.open24.length;
  const before11 = r.buckets[0] + r.buckets[1] + r.buckets[2];
  const out: { q: string; a: string }[] = [
    {
      q: `What time do massage shops in ${city} close?`,
      a: `Of ${r.known.toLocaleString()} ${city} massage and spa venues that list a full week of hours on Google Maps, ${pct(before11, rest)} of those not open round the clock close before 11 PM on at least one night they trade, and ${pct(r.midnight.length, rest)} stay open until midnight or later every night.`,
    },
    {
      q: `Can I get a massage after midnight in ${city}?`,
      a: `Yes. ${r.midnight.length} venues list midnight or later as their closing time on every day they open, and ${r.oneAm} of them stay open until 1 AM or later.${topArea ? ` ${topArea.label} has the most, with ${topArea.n}.` : ""}`,
    },
    {
      q: `Is there a 24-hour massage in ${city}?`,
      a: r.open24.length
        ? `${r.open24.length} venues with their own premises list "open 24 hours" every day. ${r.outcall} outcall-only services, which come to your hotel and have no shop, are left out of this page.`
        : `None of the venues with their own premises list 24-hour opening. ${r.outcall} outcall-only services, which have no shop, are left out of this page.`,
    },
    {
      q: "How is \"open late\" decided?",
      a: `By the earliest closing time across the days a venue opens, so a place that stays open until 2 AM only on Saturdays is counted at its weekday hour. Ranking within the list uses each venue's Google rating adjusted for how many reviews stand behind it.`,
    },
  ];
  return out;
}

export async function generateMetadata({ params }: { params: Promise<{ niche: string; city: string }> }): Promise<Metadata> {
  const { niche, city } = await params;
  const d = await load(niche, city);
  if (!d) return {};
  const { report: r } = d;
  const title = `${d.city} massage & spas open late — ${r.midnight.length} open past midnight every night`;
  const description = `${r.midnight.length} of ${r.known} ${d.city} massage and spa venues stay open until midnight or later every night they trade; ${r.oneAm} until 1 AM+. From each venue's Google Maps hours.`;
  const url = `/activities/${niche}/open-late/${city}`;
  return {
    title,
    description: description.slice(0, 158),
    alternates: { canonical: url },
    openGraph: { title, description, url },
  };
}

export default async function OpenLatePage({ params }: { params: Promise<{ niche: string; city: string }> }) {
  const { niche, city: citySlug } = await params;
  const d = await load(niche, citySlug);
  if (!d) notFound();
  const { info, city, report: r } = d;
  const url = `/activities/${niche}/open-late/${citySlug}`;
  const collected = collectedOn(d.collected);
  const rest = r.known - r.open24.length;

  const areaRows =
    city === "Bangkok"
      ? AREAS.map((a) => {
          const inArea = (v: LateVenue<NichePlace>) => a.pattern.test(`${v.p.address ?? ""} ${v.p.name ?? ""}`);
          return { label: a.label, slug: a.slug, late: r.midnight.filter(inArea).length };
        })
      : [];
  const areas = areaRows.filter((a) => a.late > 0).sort((a, b) => b.late - a.late);
  const topArea = areas[0] ? { label: areas[0].label, n: areas[0].late } : null;
  const qa = faqs(r, city, topArea);
  const shown = r.midnight.slice(0, LATE.show);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <BreadcrumbJsonLd
        items={[
          { name: "Activities", url: "/activities" },
          { name: info.label, url: `/activities/${niche}` },
          { name: `Open late in ${city}`, url },
        ]}
      />
      <FaqJsonLd faqs={qa} />
      <ItemListJsonLd
        name={`${city} massage and spas open past midnight`}
        items={shown.map((v) => ({ name: v.p.name, url: `/activities/${niche}/${v.p.slug}` }))}
      />

      <nav className="text-sm text-[var(--muted)] mb-4 flex items-center gap-2 flex-wrap">
        <a href="/activities" className="hover:text-black">Activities</a>
        <span>›</span>
        <a href={`/activities/${niche}`} className="hover:text-black">{info.label}</a>
        <span>›</span>
        <span className="text-[var(--fg)]">Open late in {city}</span>
      </nav>

      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight">{city} massage and spas open late</h1>
        <p className="text-sm text-[var(--muted)] mt-2 max-w-2xl leading-relaxed">
          Which places are still open at midnight, 1 AM and later — counted from the opening hours each venue lists on
          Google Maps, using the hour it closes on its earliest night, so a venue that stays up only at weekends is not
          passed off as a late-night spot.
        </p>
      </header>

      <section className="mb-6 rounded-2xl border border-[var(--border)] bg-white p-4 md:p-5" aria-labelledby="answer-heading">
        <h2 id="answer-heading" className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-2">The short answer</h2>
        <p className="leading-relaxed">
          <strong>{r.midnight.length}</strong> of {r.known.toLocaleString()} {city} massage and spa venues with listed hours
          stay open until <strong>midnight or later every night</strong> they trade, and <strong>{r.oneAm}</strong> until 1 AM
          or later. {r.open24.length > 0 && <><strong>{r.open24.length}</strong> with their own premises list 24-hour opening. </>}
          {topArea && <>{topArea.label} has the most late venues ({topArea.n}).</>}
        </p>
        <p className="text-xs text-[var(--muted)] mt-3">
          {(r.total - r.outcall - r.known).toLocaleString()} venues do not list a readable full week and are left out;{" "}
          {r.outcall} outcall-only services (no shop, they come to you) are left out as well.
        </p>
      </section>

      <section className="mb-8" aria-labelledby="dist-heading">
        <h2 id="dist-heading" className="text-lg font-black mb-1">When {city} massage places close</h2>
        <p className="text-sm text-[var(--muted)] mb-3">
          Earliest closing time across the days each venue opens. {r.open24.length} round-the-clock venues are not included.
        </p>
        <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-white">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wide text-[var(--muted)] border-b border-[var(--border)]">
              <tr>
                <th className="p-3 font-bold">Closes every night by</th>
                <th className="p-3 font-bold text-right">Venues</th>
                <th className="p-3 font-bold text-right">Share</th>
              </tr>
            </thead>
            <tbody>
              {BUCKETS.map((b, i) => (
                <tr key={b.label} className="border-b border-[var(--border)] last:border-0">
                  <td className="p-3">{b.label}</td>
                  <td className="p-3 text-right">{r.buckets[i]}</td>
                  <td className="p-3 text-right">{pct(r.buckets[i], rest)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8" aria-labelledby="list-heading">
        <h2 id="list-heading" className="text-lg font-black mb-1">Open until midnight or later, every night</h2>
        <p className="text-sm text-[var(--muted)] mb-3">
          Ranked by Google rating adjusted for review volume (each venue is pulled toward the {city} median of ★
          {r.prior.toFixed(1)} until it has enough reviews to stand on its own).
          {r.midnight.length > shown.length ? ` The ${shown.length} best-evidenced of ${r.midnight.length} are shown.` : ""}
        </p>
        <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-white">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wide text-[var(--muted)] border-b border-[var(--border)]">
              <tr>
                <th className="p-3 font-bold">Venue</th>
                <th className="p-3 font-bold text-right">Open until</th>
                <th className="p-3 font-bold text-right">Google</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((v) => {
                const later = v.hours.latestClose > v.hours.earliestClose;
                const area = areaOf(v.p);
                return (
                  <tr key={v.p.id} className="border-b border-[var(--border)] last:border-0 align-top">
                    <td className="p-3">
                      <a href={`/activities/${niche}/${v.p.slug}`} className="font-bold hover:underline">{v.p.name}</a>
                      {area && <div className="text-xs text-[var(--muted)]">{area}</div>}
                    </td>
                    <td className="p-3 text-right whitespace-nowrap">
                      {closeLabel(v.hours.earliestClose, formatClock)}
                      {later && <div className="text-xs text-[var(--muted)]">latest {closeLabel(v.hours.latestClose, formatClock)}</div>}
                      {v.hours.daysOpen < 7 && <div className="text-xs text-[var(--muted)]">{v.hours.daysOpen} days a week</div>}
                    </td>
                    <td className="p-3 text-right whitespace-nowrap">
                      ★{(v.p.rating ?? 0).toFixed(1)}
                      <div className="text-xs text-[var(--muted)]">{(v.p.review_count ?? 0).toLocaleString()} reviews</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {areas.length > 0 && (
        <section className="mb-8" aria-labelledby="area-heading">
          <h2 id="area-heading" className="text-lg font-black mb-1">Late-night venues by area</h2>
          <p className="text-sm text-[var(--muted)] mb-3">
            Venues open until midnight or later every night, by the area their address names. A venue on a road two
            areas share is counted in both.
          </p>
          <ul className="grid sm:grid-cols-2 gap-2">
            {areas.map((a) => (
              <li key={a.slug}>
                <a href={`/activities/${niche}/area/${a.slug}`} className="flex justify-between p-3 border border-[var(--border)] rounded-xl bg-white hover:border-orange-300 text-sm">
                  <span className="font-bold">{a.label}</span>
                  <span>{a.late}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {r.open24.length > 0 && (
        <section className="mb-8" aria-labelledby="h24-heading">
          <h2 id="h24-heading" className="text-lg font-black mb-1">Listed as open 24 hours</h2>
          <p className="text-sm text-[var(--muted)] mb-3">
            Venues with their own premises that list &ldquo;open 24 hours&rdquo; on every day. Call ahead at night — a
            listing can stay unchanged after a venue shortens its hours.
          </p>
          <ul className="grid sm:grid-cols-2 gap-2">
            {r.open24.slice(0, LATE.show).map((v) => (
              <li key={v.p.id}>
                <a href={`/activities/${niche}/${v.p.slug}`} className="block p-3 border border-[var(--border)] rounded-xl bg-white hover:border-orange-300 text-sm">
                  <span className="font-bold">{v.p.name}</span>
                  <span className="text-[var(--muted)]"> · ★{(v.p.rating ?? 0).toFixed(1)} ({(v.p.review_count ?? 0).toLocaleString()})</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mb-6 rounded-2xl border border-[var(--border)] bg-white p-4 md:p-5" aria-labelledby="limits-heading">
        <h2 id="limits-heading" className="text-lg font-black mb-2">How this is worked out, and what it can&apos;t tell you</h2>
        <div className="space-y-2 text-sm leading-relaxed text-[var(--muted)]">
          <p>
            <strong className="text-[var(--fg)]">Source.</strong> Opening hours, ratings and review counts are the ones
            each venue lists on its Google Maps page{collected ? `, collected ${collected}` : ""}. A venue is counted only
            when all seven days of its week can be read; anything else is left out rather than guessed.
          </p>
          <p>
            <strong className="text-[var(--fg)]">Limits.</strong> Listed hours are what the venue told Google, and late
            hours are the first thing to change. Last bookings usually come an hour or more before closing. Holidays are
            not reflected. Check with the venue before you go.
          </p>
        </div>
      </section>

      <section className="mb-8" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-lg font-black mb-3">Questions people ask</h2>
        <div className="space-y-4">
          {qa.map((f, i) => (
            <div key={i}>
              <h3 className="font-bold text-[15px]">{f.q}</h3>
              <p className="text-sm leading-relaxed text-[var(--muted)] mt-1">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <p className="text-sm">
        <a href={`/activities/${niche}`} className="font-bold text-orange-700 hover:underline">All {info.label.toLowerCase()} →</a>
      </p>
    </div>
  );
}

