import { loadMasterDb } from "@/lib/data";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/JsonLd";
import { getSiteConfig } from "@/lib/site";
import type { Metadata } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "About — Methodology & Data Sources",
  description:
    "How we compute Trust Score, where the data comes from, and our editorial principles. Independent golf course directory for Thailand.",
  alternates: { canonical: "/about" },
};

const FAQS = [
  {
    q: "Where does this data come from?",
    a: "All golf course listings, ratings, reviews, and metadata come from public Google Maps listings. We don't edit, hide, or selectively filter any course. Data refreshes when we add new scrape results — currently 479 courses across 47 Thai provinces with 9,996 verified Google reviews.",
  },
  {
    q: "How is the Trust Score calculated?",
    a: "Trust Score (0-100) combines: course Google rating (50% weight), review volume on logarithmic scale (40%), Local Guide reviewer ratio (10%), and reviewer authority (5%). It's our derived metric, not a Google ranking.",
  },
  {
    q: "What does 'AI Verified · X% real' mean?",
    a: "Confidence score from the proportion of reviewers who are Google Local Guides — Google's verified high-credibility reviewer status. We start at 50% baseline and add up to 50% based on Local Guide ratio. Defense against fake review concerns.",
  },
  {
    q: "Are listings sponsored?",
    a: "Organic listings are never paid. We offer Featured / Editor's Pick / Recommended slots that are clearly labelled with a coloured badge. We never delete or downrank organic listings — sponsored slots always appear ABOVE organic with explicit disclosure.",
  },
  {
    q: "Why is Korean coverage strong?",
    a: "Thailand is a top destination for Korean golf tourism. 105+ Korean-language Google reviews are aggregated from popular courses. Our /ko homepage caters specifically to Korean golfers.",
  },
  {
    q: "What are 'mentioned topics'?",
    a: "Phrases like 'well-maintained', 'challenging', 'scenic', 'Korean caddy', 'expensive' counted across all reviews of a course. Helps golfers spot patterns a star rating misses. Fixed keyword dictionary in English/Thai/Korean.",
  },
  {
    q: "How accurate are green fees?",
    a: "Green fees are NOT in the listings. Google Maps doesn't expose them. Each course page links to the club's website + booking partners (Golfsavers, Sawasdee Golf, Klook) where current rates are shown. Booking partners may earn us referral commissions which fund the site.",
  },
  {
    q: "Why no booking integration?",
    a: "Most Thai courses prefer direct phone or club-specific booking systems. We focus on accurate course intelligence (conditions, caddies, English/Korean support, value). Compare options and book directly via the club website or our affiliate partners.",
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
        Independent directory of Thailand golf courses. Value comes from one thing: applying consistent analysis to public Google review data so golfers can compare courses on objective signals — not just star ratings or marketing copy.
      </p>

      <div className="bg-white border border-[var(--border)] rounded-xl p-6 mb-10">
        <h2 className="text-lg font-bold mb-3">At a glance</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold tabular-nums">{db.total_courses.toLocaleString()}</div>
            <div className="text-xs text-[var(--muted)] uppercase tracking-wide">Courses</div>
          </div>
          <div>
            <div className="text-2xl font-bold tabular-nums">{db.with_reviews_scraped.toLocaleString()}</div>
            <div className="text-xs text-[var(--muted)] uppercase tracking-wide">Review analysis</div>
          </div>
          <div>
            <div className="text-2xl font-bold tabular-nums">{Object.keys(db.city_counts).length}</div>
            <div className="text-xs text-[var(--muted)] uppercase tracking-wide">Provinces</div>
          </div>
          <div>
            <div className="text-2xl font-bold tabular-nums">{db.language_total.ko.toLocaleString()}</div>
            <div className="text-xs text-[var(--muted)] uppercase tracking-wide">Korean reviews</div>
          </div>
        </div>
      </div>

      <section className="space-y-3 mb-12">
        <h2 className="text-2xl font-bold">Editorial principles</h2>
        <Principle
          title="Transparent ranking"
          body="Every course's Trust Score breakdown is visible on its detail page. Sponsored placements have explicit badges and never replace organic results."
        />
        <Principle
          title="No paid testimonials"
          body="All reviews shown are excerpted from real Google Maps reviews with attribution. We don't write, edit, or commission reviews."
        />
        <Principle
          title="Continuous, automated"
          body="No human curation in ranking. Data refreshes, master DB rebuilds, site redeploys. This removes editorial bias."
        />
        <Principle
          title="Golfer first"
          body="Trust Score weights are tuned for golfer relevance — strong recent ratings, large review volume, Local Guide reviewer credibility, language diversity."
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
