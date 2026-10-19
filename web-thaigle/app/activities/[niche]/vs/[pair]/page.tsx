import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NICHES, loadNicheDb, type NicheSlug } from "@/lib/niches";
import { allVsParams, getVsIndex, type VsPair } from "@/lib/vs";
import { EDGE, compareVenues, pairNames, type Edge } from "@/lib/vsMetrics";
import { nicheContext, nicheVerdict } from "@/lib/verdict";
import { trustTierLong } from "@/lib/trust";
import { BreadcrumbJsonLd, FaqJsonLd, ItemListJsonLd } from "@/components/JsonLd";

export const dynamic = "force-static";
export const dynamicParams = false;

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.thaigle.com";

export async function generateStaticParams() {
  return allVsParams();
}

async function load(nicheParam: string, pairParam: string) {
  const info = NICHES.find((n) => n.slug === nicheParam);
  if (!info) return null;
  const idx = await getVsIndex(info.slug as NicheSlug);
  const pair = idx.bySlug.get(pairParam);
  if (!pair) return null;
  const db = await loadNicheDb(info.slug as NicheSlug);
  const comparison = compareVenues(pair.a, pair.b, {
    niche: info.slug,
    nicheLabel: info.label,
    medianRating: idx.medianRating,
    scopeLabel: pair.group.label,
    generatedAt: db.generated_at,
  });
  return { info, idx, pair, db, comparison };
}

/** Cut at a word boundary so the snippet never ends mid-word. */
function clip(s: string, max: number): string {
  if (s.length <= max) return s;
  const cut = s.slice(0, max - 1);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(" "), 40))}…`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ niche: string; pair: string }>;
}): Promise<Metadata> {
  const { niche, pair: pairParam } = await params;
  const data = await load(niche, pairParam);
  if (!data) return {};
  const { info, pair, comparison } = data;
  const [a, b] = pairNames(pair.a, pair.b);
  const where = pair.group.label;
  const title = `${a} vs ${b} — ${info.label} in ${where}`;
  const description = clip(comparison.summary, 158);
  const canonical = `/activities/${info.slug}/vs/${pairParam}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, type: "article" },
  };
}

const VENUE_HREF = (niche: string, slug: string) => `/activities/${niche}/${encodeURIComponent(slug)}`;

function edgeClass(edge: Edge, side: "a" | "b") {
  return edge === side ? "bg-green-50 font-bold text-green-900" : "";
}

export default async function VsPage({ params }: { params: Promise<{ niche: string; pair: string }> }) {
  const { niche, pair: pairParam } = await params;
  const data = await load(niche, pairParam);
  if (!data) notFound();
  const { info, idx, pair, db, comparison } = data;

  const [nameA, nameB] = pairNames(pair.a, pair.b);
  const ctxVerdict = nicheContext(info.slug, db.places);
  const verdictA = nicheVerdict(pair.a, info.label, ctxVerdict);
  const verdictB = nicheVerdict(pair.b, info.label, ctxVerdict);
  const url = `${SITE}/activities/${info.slug}/vs/${pairParam}`;

  const collected = (() => {
    const d = new Date(db.generated_at);
    return Number.isNaN(d.getTime()) ? null : d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  })();

  // Other comparisons from the same neighbourhood / city, so a reader who has
  // not settled on these two has somewhere to go that is not the back button.
  const siblings: VsPair[] = idx.pairs.filter((p) => p.group.id === pair.group.id && p.slug !== pair.slug).slice(0, 5);

  const cards: { side: "a" | "b"; place: typeof pair.a; name: string; verdict: typeof verdictA }[] = [
    { side: "a", place: pair.a, name: nameA, verdict: verdictA },
    { side: "b", place: pair.b, name: nameB, verdict: verdictB },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <BreadcrumbJsonLd
        items={[
          { name: "Activities", url: "/activities" },
          { name: info.label, url: `/activities/${info.slug}` },
          { name: "Comparisons", url: `/activities/${info.slug}/vs` },
          { name: `${nameA} vs ${nameB}`, url },
        ]}
      />
      <FaqJsonLd faqs={comparison.faqs} />
      <ItemListJsonLd
        name={`${nameA} vs ${nameB}`}
        items={[
          { name: pair.a.name, url: VENUE_HREF(info.slug, pair.a.slug) },
          { name: pair.b.name, url: VENUE_HREF(info.slug, pair.b.slug) },
        ]}
      />

      <nav className="text-sm text-[var(--muted)] mb-4 flex items-center gap-2 flex-wrap">
        <a href="/activities" className="hover:text-black">Activities</a>
        <span>›</span>
        <a href={`/activities/${info.slug}`} className="hover:text-black">{info.label}</a>
        <span>›</span>
        <a href={`/activities/${info.slug}/vs`} className="hover:text-black">Comparisons</a>
        <span>›</span>
        <span className="text-[var(--fg)] truncate max-w-[220px]">{nameA} vs {nameB}</span>
      </nav>

      <header className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">{info.icon}</span>
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">
            {info.label} · {pair.group.label}
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight">
          {nameA} <span className="text-[var(--muted)] font-bold">vs</span> {nameB}
        </h1>
        <p className="text-sm text-[var(--muted)] mt-2">
          Two of the best-evidenced {info.label.toLowerCase()} venues in {pair.group.label}, compared on public Google
          data{collected ? ` collected ${collected}` : ""}.
        </p>
      </header>

      {/* The answer first. */}
      <section
        aria-labelledby="short-answer"
        className={`rounded-2xl border-2 p-4 md:p-5 mb-6 ${comparison.pick ? "border-green-300 bg-green-50" : "border-gray-300 bg-gray-50"}`}
      >
        <h2 id="short-answer" className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-2">
          The short answer
        </h2>
        <p className="text-[15px] leading-relaxed">{comparison.headline}</p>
      </section>

      {/* The two venues */}
      <section className="grid md:grid-cols-2 gap-4 mb-6" aria-label="The two venues">
        {cards.map(({ side, place, name, verdict }) => (
          <article key={place.id} className="bg-white border border-[var(--border)] rounded-2xl p-4">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] mb-1">
              {side === "a" ? "Venue A" : "Venue B"}
            </div>
            <h2 className="text-lg font-black leading-tight">
              <a href={VENUE_HREF(info.slug, place.slug)} className="hover:text-orange-700">{name}</a>
            </h2>
            {place.name.trim() !== name && (
              <p className="text-[11px] text-[var(--muted)] mt-0.5">Listed on Google as: {place.name}</p>
            )}
            <p className="text-xs text-[var(--muted)] mt-1">{place.address || place.city}</p>
            <div className="flex items-center gap-4 mt-3 text-sm">
              <span className="font-black text-yellow-700">★{place.rating?.toFixed(1) ?? "—"}</span>
              <span className="text-[var(--muted)]">{(place.review_count ?? 0).toLocaleString()} reviews</span>
              <span className="text-[var(--muted)]">Trust {Math.round(place.trust_score)} · {trustTierLong(place.trust_score)}</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed">
              <span className="font-bold">{verdict.emoji} {verdict.label}.</span> {verdict.summary}
            </p>
            <ul className="mt-2 space-y-1 text-xs text-[var(--muted)] leading-relaxed">
              {verdict.evidence.slice(0, 3).map((e, i) => (
                <li key={i}>{e.ok === true ? "✓ " : e.ok === false ? "✗ " : "• "}{e.text}</li>
              ))}
            </ul>
            <a href={VENUE_HREF(info.slug, place.slug)} className="inline-block mt-3 text-xs font-bold text-orange-700 hover:underline">
              Full profile →
            </a>
          </article>
        ))}
      </section>

      {/* Side by side */}
      <section className="mb-6" aria-labelledby="table-heading">
        <h2 id="table-heading" className="text-lg font-black mb-3">Side by side</h2>
        <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-white">
          <table className="w-full text-sm">
            <caption className="sr-only">{nameA} compared with {nameB}</caption>
            <thead>
              <tr className="border-b border-[var(--border)] text-left text-xs uppercase tracking-widest text-[var(--muted)]">
                <th scope="col" className="px-4 py-3 font-bold">Measure</th>
                <th scope="col" className="px-4 py-3 font-bold">{nameA}</th>
                <th scope="col" className="px-4 py-3 font-bold">{nameB}</th>
              </tr>
            </thead>
            <tbody>
              {comparison.rows.map((r) => (
                <tr key={r.id} className="border-b border-[var(--border)] last:border-0">
                  <th scope="row" className="px-4 py-3 text-left font-medium text-[var(--muted)]">{r.label}</th>
                  <td className={`px-4 py-3 ${edgeClass(r.edge, "a")}`}>{r.a}{r.edge === "a" ? " ✓" : ""}</td>
                  <td className={`px-4 py-3 ${edgeClass(r.edge, "b")}`}>{r.b}{r.edge === "b" ? " ✓" : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-[var(--muted)]">
          ✓ marks a measurable lead: {EDGE.rating} or more in rating, {EDGE.reviewRatio}× the reviews, {EDGE.adjusted} in
          adjusted rating, {EDGE.trust} Trust Score points, a day or {EDGE.dayHours} hour of difference in opening hours,
          or reviews {EDGE.recentDays} days more recent. Smaller gaps are left unmarked on purpose.
        </p>
      </section>

      {/* How to choose */}
      {comparison.howToChoose.length > 0 && (
        <section className="mb-6" aria-labelledby="choose-heading">
          <h2 id="choose-heading" className="text-lg font-black mb-3">How to choose</h2>
          <ul className="space-y-2 text-[15px] leading-relaxed list-disc pl-5">
            {comparison.howToChoose.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </section>
      )}

      {/* Limits, stated the way the data allows */}
      <section className="mb-6 rounded-2xl border border-[var(--border)] bg-white p-4 md:p-5" aria-labelledby="limits-heading">
        <h2 id="limits-heading" className="text-lg font-black mb-2">What this comparison can and can&apos;t tell you</h2>
        <div className="space-y-2 text-sm leading-relaxed text-[var(--muted)]">
          <p>
            <strong className="text-[var(--fg)]">Source.</strong> Ratings, review counts, hours and review languages come
            from each venue&apos;s Google Maps listing{collected ? `, collected ${collected}` : ""}. Nothing here is
            estimated: a row is simply absent when a venue does not list the data.
          </p>
          <p>
            <strong className="text-[var(--fg)]">Limits.</strong> Public ratings cannot tell you which therapist or
            instructor you get, and they reflect who chooses to review. Hours and prices change — confirm before you
            travel. <a href="/methodology" className="underline">How Thaigle scores venues</a>.
          </p>
        </div>
      </section>

      {/* FAQ — visible, not hidden behind a toggle, and the same text as the schema */}
      <section className="mb-8" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-lg font-black mb-3">Questions people ask</h2>
        <div className="space-y-4">
          {comparison.faqs.map((f, i) => (
            <div key={i}>
              <h3 className="font-bold text-[15px]">{f.q}</h3>
              <p className="text-sm leading-relaxed text-[var(--muted)] mt-1">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Onward */}
      <section className="mb-4" aria-labelledby="more-heading">
        <h2 id="more-heading" className="text-lg font-black mb-3">More from {pair.group.label}</h2>
        {siblings.length > 0 && (
          <ul className="grid sm:grid-cols-2 gap-2 mb-4">
            {siblings.map((s) => (
              <li key={s.slug}>
                <a
                  href={`/activities/${info.slug}/vs/${s.slug}`}
                  className="block p-3 border border-[var(--border)] rounded-xl bg-white hover:border-orange-300 text-sm font-medium hover:text-orange-700"
                >
                  {pairNames(s.a, s.b).join(" vs ")}
                </a>
              </li>
            ))}
          </ul>
        )}
        <div className="flex flex-wrap gap-4 text-sm font-bold text-orange-700">
          <a href={pair.group.href} className="hover:underline">All {info.label.toLowerCase()} in {pair.group.label} →</a>
          <a href={`/activities/${info.slug}/vs`} className="hover:underline">Every {info.label.toLowerCase()} comparison →</a>
        </div>
      </section>
    </div>
  );
}
