import { loadMasterDb } from "@/lib/data";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/JsonLd";
import { getSiteConfig } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Methodology & Data Sources",
  description:
    "How we compute Trust Score, where the data comes from, and why an independent supplier directory matters for B2B sourcing in Thailand.",
  alternates: {
    canonical: "/about",
    languages: {
      "en-US": "/about",
      "ko-KR": "/ko/about",
      "th-TH": "/th/about",
      "x-default": "/about",
    },
  },
};

const FAQS = [
  {
    q: "Where does this data come from?",
    a: "All supplier listings, ratings, and metadata come from public Google Maps Business Profiles via Apify's Google Maps actors. We don't edit, hide, or selectively filter listings. Categories are inferred from each supplier's own Google-assigned category plus our own filtering layer that strips B2C noise (retail stores, restaurants, factory outlet malls).",
  },
  {
    q: "How is the Trust Score calculated?",
    a: "Trust Score (0-100) combines: Google rating (50% weight, scaled from 5★ → 50 points) and review volume on a logarithmic scale (50% weight, capped at 50 points). It rewards both quality (rating) and longevity / scale (review count). It's a directional signal — pair it with direct due diligence (factory visits, audits, references).",
  },
  {
    q: "Why filter out so many B2C-looking listings?",
    a: "A naive Google Maps search for 'factory in Thailand' returns shopping malls (\"factory outlet\"), butcher shops, mattress stores named 'Latex Factory', and a Toy Store called 'ความสุข Toys Factory'. We filter against an explicit B2C category blocklist and require real B2B category signals (Manufacturer, Auto parts manufacturer, Industrial real estate agency, Warehouse, Logistics service, etc.).",
  },
  {
    q: "Why such heavy Eastern Seaboard concentration?",
    a: "Because that's where Thailand's manufacturing is. Chon Buri + Rayong host Toyota, Honda, Mitsubishi, Isuzu, Mazda, Nissan plants and the entire Tier 1 / Tier 2 supplier ecosystem. The 4 major industrial estate operators (Pinthong, Amata, WHA, Rojana) all anchor their flagship estates here. The directory reflects the real industrial geography.",
  },
  {
    q: "Are listings sponsored?",
    a: "Organic listings are never paid. We offer Featured / Editor's Pick / Recommended slots that are clearly badged. Sponsored slots appear ABOVE organic results with explicit disclosure. We never delete or downrank organic listings. See /for-suppliers for placement details.",
  },
  {
    q: "Do you take commission on deals?",
    a: "No. We're an independent directory. Buyers contact suppliers directly via the public phone or website on each listing. No middleman markup. Monetization is via clearly-labelled sponsored slots and (eventually) a verified-supplier subscription tier — never via deal commission.",
  },
  {
    q: "How do I get my company listed?",
    a: "If your company has a Google Business Profile in Thailand and matches one of our supply categories, you're likely already listed. If not, see /for-suppliers — basic listings are free for verified Thai manufacturers and industrial operators.",
  },
  {
    q: "How fresh is the data?",
    a: "Listings rebuild from new Apify exports periodically. Phone and website fields come straight from each supplier's Google Business Profile. We don't republish or cache contact data — if a supplier updates their profile, the next rebuild reflects it.",
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
        Independent directory of Thai manufacturers, industrial estates, warehouses, and logistics operators. The point: apply consistent analysis to public Google data so B2B buyers can compare suppliers on objective signals — not on which sourcing agent has the loudest sales pitch.
      </p>

      <div className="bg-white border border-[var(--border)] rounded-xl p-6 mb-10">
        <h2 className="text-lg font-bold mb-3">At a glance</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold tabular-nums">{db.total_suppliers.toLocaleString()}</div>
            <div className="text-xs text-[var(--muted)] uppercase tracking-wide">Suppliers</div>
          </div>
          <div>
            <div className="text-2xl font-bold tabular-nums">{db.with_website.toLocaleString()}</div>
            <div className="text-xs text-[var(--muted)] uppercase tracking-wide">With website</div>
          </div>
          <div>
            <div className="text-2xl font-bold tabular-nums">{Object.keys(db.city_counts).length}</div>
            <div className="text-xs text-[var(--muted)] uppercase tracking-wide">Provinces</div>
          </div>
          <div>
            <div className="text-2xl font-bold tabular-nums">{Object.keys(db.category_counts).length}</div>
            <div className="text-xs text-[var(--muted)] uppercase tracking-wide">Categories</div>
          </div>
        </div>
      </div>

      <section className="space-y-3 mb-12">
        <h2 className="text-2xl font-bold">Editorial principles</h2>
        <Principle
          title="Transparent ranking"
          body="Every supplier's Trust Score breakdown is visible on its detail page. Sponsored placements have explicit badges and never replace organic results."
        />
        <Principle
          title="No paid testimonials"
          body="We don't write, edit, or commission reviews. Ratings are aggregated straight from Google Maps."
        />
        <Principle
          title="Continuous, automated"
          body="No human curation in ranking. Data refreshes, master DB rebuilds, site redeploys — programmatically."
        />
        <Principle
          title="Buyer first"
          body="Trust Score weights are tuned for sourcing relevance — established operations with public proof get surfaced, anonymous fly-by-night listings stay buried."
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
