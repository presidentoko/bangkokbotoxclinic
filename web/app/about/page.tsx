// /about — methodology + trust + AEO 풍부.

import { loadMasterDb } from "@/lib/data";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/JsonLd";
import { getSiteConfig } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Methodology & Data Sources",
  description:
    "How we compute Trust Score, where the data comes from, and our editorial principles. We are independent and not affiliated with any clinic.",
  alternates: { canonical: "/about" },
};

const FAQS = [
  {
    q: "Where does this data come from?",
    a: "All clinic listings, ratings, reviews, and metadata are sourced from public Google Maps listings. We do not edit, hide, or selectively filter any clinic. Data is refreshed continuously and pages rebuild every 30 minutes.",
  },
  {
    q: "How is the Trust Score calculated?",
    a: "Trust Score (0-100) combines four signals: clinic Google rating (50% weight), review volume on logarithmic scale (40%), Local Guide reviewer ratio (10%), and average reviewer authority — i.e. how many reviews the average reviewer of this clinic has written elsewhere (5%). It's our derived metric, not a Google ranking.",
  },
  {
    q: "What does 'AI Verified · X% real' mean?",
    a: "It is a confidence score derived from the proportion of reviewers who are Google Local Guides — a status given by Google to high-volume, verified reviewers. We start with a 50% baseline and add up to 50% based on Local Guide ratio. It is intended as a defense against fake review concerns; it is not a guarantee.",
  },
  {
    q: "Are clinic listings sponsored?",
    a: "Organic listings are never paid. We offer Featured / Editor's Pick / Recommended slots that are clearly labelled with a coloured badge, but we do not delete, hide, or downrank any organic listing. Sponsored slots appear above organic ones with explicit disclosure.",
  },
  {
    q: "How fresh is the data?",
    a: "Continuously. Our scrapers run 24/7, the master dataset rebuilds every 5 minutes, and the website redeploys when data changes. Any new public review of a listed clinic typically appears here within 30 minutes.",
  },
  {
    q: "What are 'mentioned topics'?",
    a: "Phrases like 'genuine brand', 'long wait', 'English-speaking staff' that we count across all reviews of a clinic. These help patients spot patterns that a star rating alone misses. We use a fixed keyword dictionary in both English and Thai, applied uniformly.",
  },
  {
    q: "How does the rating timeline work?",
    a: "Each Google review has a relative timestamp. We bucket reviews into recent (less than 3 months), midterm (3-12 months), and historical (1+ year). Comparing the average rating in each bucket gives a quality trajectory: improving, stable, or declining.",
  },
  {
    q: "Why aren't prices shown?",
    a: "Google Maps does not expose service-by-service prices. Most Bangkok clinics publish per-service prices on their LINE channel or via direct enquiry. We display Google's price-level indicator (Inexpensive / Moderate / Expensive) where available and offer a one-click consultation request to get a current quote.",
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

      <h1 className="text-4xl font-bold tracking-tight mb-3">
        About {cfg.brand}
      </h1>
      <p className="text-base text-[var(--muted)] mb-8 leading-relaxed">
        We are an independent directory of Bangkok aesthetic and medical clinics. Our value comes from one thing: applying consistent analysis to public Google review data so patients can compare clinics on objective signals — not just star ratings.
      </p>

      <div className="bg-white border border-[var(--border)] rounded-xl p-6 mb-10">
        <h2 className="text-lg font-bold mb-3">At a glance</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold tabular-nums">{db.total_clinics.toLocaleString()}</div>
            <div className="text-xs text-[var(--muted)] uppercase tracking-wide">Clinics</div>
          </div>
          <div>
            <div className="text-2xl font-bold tabular-nums">{db.with_reviews_scraped.toLocaleString()}</div>
            <div className="text-xs text-[var(--muted)] uppercase tracking-wide">Full review analysis</div>
          </div>
          <div>
            <div className="text-2xl font-bold tabular-nums">{Object.keys(db.district_counts).length}</div>
            <div className="text-xs text-[var(--muted)] uppercase tracking-wide">Districts covered</div>
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
          body="Every clinic's Trust Score breakdown is visible on its detail page. We show how the score is composed (rating, volume, reviewer credibility, authority). Sponsored placements have explicit badges and never replace organic results."
        />
        <Principle
          title="No paid testimonials"
          body="All reviews shown are excerpted from real Google Maps reviews with attribution. We do not write, edit, or commission reviews. We do not accept payment to remove or hide reviews."
        />
        <Principle
          title="Continuous, automated"
          body="No human curation in ranking. Data refreshes from scrapers every 5 minutes, the master dataset rebuilds, and the site redeploys. This removes editorial bias and keeps freshness."
        />
        <Principle
          title="Patient first"
          body="Trust Score weights are tuned for patient safety — high Local Guide ratio (less likely to be fake), strong recent ratings (active operation), large review volume (statistical confidence)."
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
