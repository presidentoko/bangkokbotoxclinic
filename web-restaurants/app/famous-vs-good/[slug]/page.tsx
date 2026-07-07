import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  loadFamousVsGoodCollection,
  loadAllSlugs,
  loadHiddenGems,
  GAP_THRESHOLD_HIGH,
} from "@/lib/famous-vs-good";
import { GapList } from "@/components/GapList";
import { FaqJsonLd, ItemListJsonLd } from "@/components/JsonLd";
import { GenericShareButton, WhatsAppShare } from "@/components/ShareButton";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const slugs = await loadAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const label = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `Instagram Famous vs Actually Good: ${label} Ranked by Real Data (2026)`,
    description: `We analyzed ${label} that trend on Instagram and ranked them by Trust Score from verified Google reviews. Find out which are overrated and which actually deliver — based on real data, not sponsored posts.`,
    alternates: { canonical: `/famous-vs-good/${slug}` },
    openGraph: {
      title: `Instagram Famous vs Actually Good: ${label}`,
      description: `Social buzz vs real review credibility. ${label} ranked by Trust Score from Google review analysis.`,
      url: `/famous-vs-good/${slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `Instagram Famous vs Actually Good: ${label}`,
      description: `Social hype vs verified review data. ${label} ranked by Trust Score — no influencer fluff.`,
    },
  };
}

export default async function FamousVsGoodSlugPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const [collection, hiddenGems] = await Promise.all([
    loadFamousVsGoodCollection(slug),
    loadHiddenGems(slug),
  ]);

  const { entries, thresholds } = collection;
  if (entries.length === 0) notFound();

  const matched = entries.filter((e) => e.restaurant !== null);
  // Fix 2: M and X use the real dynamic threshold, not the hardcoded constant
  const belowThreshold = matched.filter(
    (e) => e.restaurant!.trust_score < thresholds.bigGapThreshold
  );
  const totalReviews = matched.reduce(
    (s, e) => s + (e.restaurant?.total_reviews ?? 0),
    0
  );
  const N = matched.length;
  const M = belowThreshold.length;
  const X = Math.round(thresholds.bigGapThreshold);

  const label = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const itemListItems = matched.map((e) => ({
    name: e.restaurant!.name,
    url: `/restaurant/${e.restaurant!.id}`,
  }));

  // Fix 2: FAQ JSON-LD text uses real N, M, X values so schema and visible text match
  const FAQS = [
    {
      q: "Are Bangkok's Instagram-famous cafés actually good?",
      a: `Of ${N} ${label.toLowerCase()} we analyzed, ${M} score below ${X} on SNS Stopper's Trust Score — derived from ${totalReviews.toLocaleString()} verified Google reviews. Some hold up; many don't.`,
    },
    {
      q: "What is a Trust Score?",
      a: "Trust Score (0–100) combines Google rating (50%), review volume log-scaled (40%), Local Guide reviewer ratio (10%), and reviewer authority (5%). It measures how statistically reliable a restaurant's reputation is — not just how high the star rating is.",
    },
    {
      q: "How do you determine if a café is Instagram-famous?",
      a: "Phase 1 uses a manually curated seed list of venues that appear frequently in Bangkok café Instagram content. Phase 2 integrates Outscraper Instagram data for tagged-post counts. We never invent engagement numbers — only report what we can verify.",
    },
    {
      q: "How fresh is the data?",
      a: "Scrapers run continuously. The master dataset rebuilds every few minutes. Trust Scores reflect current Google review data.",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-6">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <a href="/famous-vs-good" className="hover:text-[var(--fg)]">Famous vs Good</a>
        <span className="mx-2">›</span>
        <span>{label}</span>
      </nav>

      {/* HERO */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3 leading-tight">
          Instagram Famous vs Actually Good<br />
          <span style={{ color: "#ea580c" }}>— {label}</span>
        </h1>
        <p className="text-lg text-[var(--muted)] mb-5 max-w-2xl">
          The feed picked these. The data ranked them. Here&apos;s the gap.
        </p>

        {/* Stat strip */}
        <div className="flex flex-wrap gap-3 text-sm">
          <span className="bg-white border border-[var(--border)] rounded-full px-4 py-1.5 font-medium">
            {N} venues analyzed
          </span>
          <span className="bg-white border border-[var(--border)] rounded-full px-4 py-1.5 font-medium">
            {M} score below {X} on Trust Score
          </span>
          <span className="bg-white border border-[var(--border)] rounded-full px-4 py-1.5 font-medium">
            {totalReviews.toLocaleString()} Google reviews cross-checked
          </span>
        </div>

        <div className="flex flex-wrap gap-3 mt-5">
          <GenericShareButton
            title={`Instagram Famous vs Actually Good: ${label}`}
            text={`${M} of ${N} Instagram-famous ${label.toLowerCase()} in Bangkok score below ${X} on Trust Score. See the gap:`}
            url={`/famous-vs-good/${slug}`}
          />
          <WhatsAppShare name={`${label} — Instagram Famous vs Actually Good`} url={`/famous-vs-good/${slug}`} />
        </div>
      </header>

      {/* AEO quotable sentence — Fix 2: all numbers are real computed values */}
      <p className="text-base leading-relaxed mb-8 p-4 bg-white border-l-4 border-[#ea580c] rounded-r-xl">
        Of {N} {label.toLowerCase()} frequently featured on Instagram,{" "}
        <strong>{M} score below {X}</strong> on SNS Stopper&apos;s Trust Score,
        derived from{" "}
        <strong>{totalReviews.toLocaleString()} verified Google reviews</strong>.
      </p>

      <h2 className="text-2xl font-bold mb-6">
        Are Bangkok&apos;s Instagram-famous cafés actually good?
      </h2>

      {/* GAP LIST — Fix 3: thresholds passed for display in methodology caption */}
      <GapList entries={entries} hiddenGems={hiddenGems} thresholds={thresholds} hiddenGemThreshold={GAP_THRESHOLD_HIGH} />

      <div className="mt-12 mb-2">
        <h2 className="text-xl font-bold">Hyped on social, ranked by data</h2>
      </div>
      <p className="text-sm text-[var(--muted)] mb-8 max-w-2xl">
        Each entry above is matched to its Google Maps listing and scored by the same Trust Score
        algorithm we use across all {N > 5 ? "Bangkok" : "our"} restaurant rankings.
        Social popularity is logged as a qualitative signal only — we never invent engagement numbers.
      </p>

      <div className="mt-2 mb-8">
        <h2 className="text-xl font-bold">Hidden gems the feed ignores</h2>
        <p className="text-sm text-[var(--muted)] mt-1 max-w-2xl">
          Switch to the &quot;Hidden gems&quot; tab above to see high-Trust-Score cafés that rarely appear on your social feed.
        </p>
      </div>

      <p className="text-xs text-[var(--muted)] italic mb-8 border border-[var(--border)] rounded-lg px-4 py-3 bg-white">
        Scores derived from public Google reviews, updated every 30 min,
        reflecting review credibility — not food quality opinions.
      </p>

      {/* Methodology — Fix 1: surfaces the actual thresholds used for this collection */}
      <section className="mt-6 mb-8">
        <details className="bg-white border border-[var(--border)] rounded-xl p-5">
          <summary className="font-semibold cursor-pointer flex items-center justify-between gap-3 select-none">
            <span>How we measure this</span>
            <span className="text-[var(--muted)] text-sm">▼</span>
          </summary>
          <div className="mt-4 space-y-3 text-sm text-[var(--muted)] leading-relaxed">
            <p>
              <strong className="text-[var(--fg)]">Trust Score</strong> is a 0–100 composite:
              Google rating (50%) + review volume log-scaled (40%) + Local Guide reviewer ratio (10%)
              + reviewer authority score (5%). A restaurant can have a 4.5-star average but a low Trust
              Score if it has few reviews or few credible reviewers.
            </p>
            <p>
              <strong className="text-[var(--fg)]">Social signal sourcing</strong>: Phase 1 uses a
              manually curated seed list of Bangkok venues that appear prominently in Instagram café
              content. We record the qualitative signal (&quot;Frequently tagged&quot;, &quot;Viral on TikTok&quot;) and
              only report numeric tag counts when we have a verifiable source. We never invent
              engagement numbers.
            </p>
            <p>
              <strong className="text-[var(--fg)]">Local Guide ratio</strong>: the percentage of
              scraped reviews written by Google Local Guides — a proxy for reviewer depth and
              credibility.
            </p>
            <p>
              <strong className="text-[var(--fg)]">Gap thresholds (this collection)</strong>:{" "}
              Trust Score below {X} = &quot;credibility gap&quot;. Trust Score {X}–{Math.round(thresholds.holdsUpThreshold) - 1} = &quot;decent score&quot;.{" "}
              {Math.round(thresholds.holdsUpThreshold)}+ = &quot;hype that holds up&quot;.
              Thresholds are computed from the p33/p67 percentiles of this collection&apos;s matched Trust Scores,
              with a hard guardrail: no venue scoring 80+ is ever labelled a disappointment.
            </p>
          </div>
        </details>
      </section>

      {/* CTA */}
      <section className="mt-8 flex flex-wrap gap-4">
        <a
          href="/"
          className="px-5 py-2.5 bg-[#ea580c] text-white font-bold rounded-xl hover:opacity-90 transition text-sm"
        >
          See all Bangkok rankings →
        </a>
        <a
          href="/famous-vs-good"
          className="px-5 py-2.5 border border-[var(--border)] bg-white font-medium rounded-xl hover:border-gray-400 transition text-sm"
        >
          ← All collections
        </a>
      </section>

      {/* JSON-LD — Fix 2: real N/M/X values flow into the FAQ schema */}
      <ItemListJsonLd
        name={`Instagram Famous vs Actually Good — ${label}`}
        items={itemListItems}
      />
      <FaqJsonLd faqs={FAQS} />
    </div>
  );
}
