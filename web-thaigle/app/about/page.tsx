import { loadMasterDb } from "@/lib/data";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/JsonLd";
import { getSiteConfig } from "@/lib/site";
import { ShareButton } from "@/components/ShareButton";
import { BangkokFacts } from "@/components/BangkokFacts";
import { RatingLegend } from "@/components/RatingLegend";
import { TrustScoreExplainer } from "@/components/TrustScoreExplainer";
import { RelatedGuides } from "@/components/RelatedGuides";
import { BangkokThingsNearBTS } from "@/components/BangkokThingsNearBTS";
import type { Metadata } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thaigle.com";

export const metadata: Metadata = {
  title: "About — Methodology & Data Sources",
  description:
    "How we compute Trust Score, where the data comes from, and our editorial principles. We are independent and not affiliated with any restaurant.",
  alternates: { canonical: "/about" },
};

const FAQS = [
  {
    q: "Where does this data come from?",
    a: "All restaurant listings, ratings, reviews, and metadata are sourced from public Google Maps listings. We do not edit, hide, or selectively filter any restaurant. Data is refreshed in batches; every listing page shows when its own data was last updated.",
  },
  {
    q: "How is the Trust Score calculated?",
    a: "Trust Score (0-100) is built from four components: Google star rating (max 50 pts), review volume on a log scale (max 40 pts), Local Guide reviewer ratio (max 10 pts), and reviewer authority (max 5 pts). Raw total is capped at 100.",
  },
  {
    q: "What does 'AI Verified · X% real' mean?",
    a: "Confidence score derived from the proportion of reviewers who are Google Local Guides — a status given by Google to high-volume verified reviewers. We start at 50% baseline and add up to 50% based on Local Guide ratio. Defense against fake review concerns.",
  },
  {
    q: "Are listings sponsored?",
    a: "Organic listings are never paid. We offer Featured / Editor's Pick / Recommended slots that are clearly labelled with a coloured badge. We do not delete, hide, or downrank any organic listing.",
  },
  {
    q: "How fresh is the data?",
    a: "In batches, not continuously. Collection runs on a schedule and the dataset is rebuilt and redeployed when a run completes, so a given listing is typically weeks rather than minutes old. The exact date for each listing is shown on its own page — that timestamp is the authoritative one.",
  },
  {
    q: "What are 'mentioned topics'?",
    a: "Phrases like 'fresh', 'spicy', 'halal', 'long wait' counted across all reviews. Help diners spot patterns a star rating misses. Fixed keyword dictionary in English and Thai.",
  },
  {
    q: "How does the rating timeline work?",
    a: "Each Google review has a relative timestamp. We bucket into recent (<3mo), midterm (3-12mo), historical (1+ year). Comparing average rating per bucket gives a quality trajectory: improving / stable / declining.",
  },
  {
    q: "Why no booking?",
    a: "Most Bangkok restaurants take walk-ins or use direct phone/LINE. We focus on accurate, current information — view on Google Maps for directions, or call directly. Restaurants with their own booking offer it via the website link on their detail page.",
  },
];

export default async function AboutPage() {
  const cfg = getSiteConfig();
  const db = await loadMasterDb();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span>About</span>
      </nav>

      <div className="flex items-start justify-between gap-3 mb-3">
        <h1 className="text-4xl font-bold tracking-tight">About {cfg.brand}</h1>
        <ShareButton title={`About ${cfg.brand} — Real Bangkok Rankings`} text="Independent Bangkok guide: Trust Score methodology, no paid placements" url={`${SITE}/about`} line whatsapp />
      </div>
      <p className="text-base text-[var(--muted)] mb-8 leading-relaxed">
        Independent directory of Bangkok and Pattaya restaurants. Value comes from one thing: applying consistent analysis to public Google review data so diners can compare restaurants on objective signals — not just star ratings.
      </p>

      <div className="bg-white border border-[var(--border)] rounded-xl p-6 mb-10">
        <h2 className="text-lg font-bold mb-3">At a glance</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold tabular-nums">{db.total_restaurants.toLocaleString()}</div>
            <div className="text-xs text-[var(--muted)] uppercase tracking-wide">Restaurants</div>
          </div>
          <div>
            <div className="text-2xl font-bold tabular-nums">{db.with_reviews_scraped.toLocaleString()}</div>
            <div className="text-xs text-[var(--muted)] uppercase tracking-wide">Full review analysis</div>
          </div>
          <div>
            <div className="text-2xl font-bold tabular-nums">{Object.keys(db.cuisine_counts).length}</div>
            <div className="text-xs text-[var(--muted)] uppercase tracking-wide">Cuisines</div>
          </div>
          <div>
            <div className="text-2xl font-bold tabular-nums">30 min</div>
            <div className="text-xs text-[var(--muted)] uppercase tracking-wide">Refresh cycle</div>
          </div>
        </div>
      </div>

      <section className="space-y-3 mb-12">
        <h2 className="text-2xl font-bold">Editorial principles</h2>
        <Principle
          title="Transparent ranking"
          body="Every restaurant's Trust Score breakdown is visible on its detail page. We show how the score is composed. Sponsored placements have explicit badges and never replace organic results."
        />
        <Principle
          title="No paid testimonials"
          body="All reviews shown are excerpted from real Google Maps reviews with attribution. We do not write, edit, or commission reviews."
        />
        <Principle
          title="Continuous, automated"
          body="No human curation in ranking. Scrapers, master DB, and site redeploy automatically. This removes editorial bias."
        />
        <Principle
          title="Diner first"
          body="Trust Score weights are tuned for diner relevance — strong recent ratings (active operation), large review volume (statistical confidence), Local Guide reviewer credibility."
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold">Frequently asked</h2>
        {FAQS.map((f, i) => (
          <details key={i} className="bg-white border border-[var(--border)] rounded-lg p-4 group">
            <summary className="font-medium cursor-pointer flex items-center justify-between gap-3">
              <span>{f.q}</span>
              <span className="text-[var(--muted)] group-open:rotate-180 transition">⌄</span>
            </summary>
            <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">{f.a}</p>
          </details>
        ))}
      </section>

      {/* Engagement links */}
      <section className="border border-[var(--border)] rounded-2xl p-5 bg-white">
        <h2 className="font-black text-lg mb-3">Explore Thaigle</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <a href="/quiz" className="flex items-center gap-3 p-3 rounded-xl bg-orange-50 border border-orange-200 hover:border-orange-300 transition group">
            <span className="text-2xl shrink-0">🎯</span>
            <div>
              <div className="font-bold text-sm group-hover:text-orange-700 transition">Bangkok Traveler Quiz</div>
              <div className="text-xs text-[var(--muted)]">Find your traveler type in 5 questions</div>
            </div>
          </a>
          <a href="/bingo" className="flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-200 hover:border-green-300 transition group">
            <span className="text-2xl shrink-0">🏆</span>
            <div>
              <div className="font-bold text-sm group-hover:text-green-700 transition">Bucket List Bingo</div>
              <div className="text-xs text-[var(--muted)]">Track what you've done in Bangkok</div>
            </div>
          </a>
          <a href="/local-tips" className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 border border-blue-200 hover:border-blue-300 transition group">
            <span className="text-2xl shrink-0">🗺️</span>
            <div>
              <div className="font-bold text-sm group-hover:text-blue-700 transition">Local Insider Tips</div>
              <div className="text-xs text-[var(--muted)]">What locals know, tourist traps to avoid</div>
            </div>
          </a>
          <a href="/day-plan" className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] bg-white hover:border-orange-300 transition group">
            <span className="text-2xl shrink-0">📅</span>
            <div>
              <div className="font-bold text-sm group-hover:text-orange-700 transition">Bangkok Day Plans</div>
              <div className="text-xs text-[var(--muted)]">25 curated itineraries by area &amp; theme</div>
            </div>
          </a>
        </div>
      </section>

      <TrustScoreExplainer />
      <BangkokFacts />
      <RelatedGuides context="general" />
      <BangkokThingsNearBTS />
      <RatingLegend />
      <FaqJsonLd faqs={FAQS} />
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "About", url: "/about" },
      ]} />
    </div>
  );
}

function Principle({ title, body }: { title: string; body: string }) {
  return (
    <div className="bg-white border border-[var(--border)] rounded-lg p-4">
      <h3 className="font-bold text-base mb-1.5">{title}</h3>
      <p className="text-sm text-[var(--muted)] leading-relaxed">{body}</p>
    </div>
  );
}
