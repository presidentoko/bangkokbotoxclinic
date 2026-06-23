import { loadMasterDb } from "@/lib/data";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/JsonLd";
import { getSiteConfig } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Methodology & Data Sources",
  description:
    "How we compute Trust Score, where the data comes from, and our editorial principles. We are independent and not affiliated with any restaurant.",
  alternates: { canonical: "/about" },
};

const FAQS = [
  {
    q: "Where does this data come from?",
    a: "All restaurant listings, ratings, reviews, and metadata are sourced from public Google Maps listings. We do not edit, hide, or selectively filter any restaurant. Data refreshes every 30 minutes.",
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
    a: "Continuously. Scrapers run 24/7, master dataset rebuilds every 5 minutes, the website redeploys when data changes. New public reviews of a listed restaurant typically appear within 30 minutes.",
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

      <h1 className="text-4xl font-bold tracking-tight mb-3">About {cfg.brand}</h1>
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
