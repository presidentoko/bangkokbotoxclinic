import { loadMasterDb } from "@/lib/data";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { getSiteConfig } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partner with us — Featured listings & Direct ads",
  description:
    "Featured placement, sponsored slots, and weekly competitor intelligence for Bangkok and Pattaya restaurants.",
  alternates: { canonical: "/for-restaurants" },
};

export default async function ForRestaurantsPage() {
  const cfg = getSiteConfig();
  const db = await loadMasterDb();
  const totalReviews = db.restaurants.reduce((s, r) => s + r.total_reviews, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span>For Restaurants</span>
      </nav>

      <header className="mb-12 text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-red-50 text-red-800 text-xs font-bold uppercase tracking-wider mb-4">
          For restaurant owners
        </span>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 text-balance">
          Reach diners actively searching for your cuisine.
          <br />
          <span style={{ color: cfg.themeAccent }}>In their hometown or on holiday.</span>
        </h1>
        <p className="text-base md:text-lg text-[var(--muted)] max-w-2xl mx-auto text-balance">
          {db.total_restaurants.toLocaleString()} restaurants tracked across Bangkok and Pattaya with {totalReviews.toLocaleString()} verified Google reviews. Diners searching cuisine + neighbourhood land here.
        </p>
      </header>

      <section className="grid sm:grid-cols-3 gap-4 mb-16">
        <Stat n={db.total_restaurants.toLocaleString()} label="Restaurants indexed" />
        <Stat n={totalReviews.toLocaleString()} label="Reviews analyzed" />
        <Stat n="< 30 min" label="From scrape to live" />
      </section>

      <section className="space-y-8 mb-16">
        <Offering
          tag="01 — Editor's Pick"
          title="Top spot on every cuisine and district page"
          price="฿15,000 / month"
          body="Your restaurant gets a permanent ranked-first position on relevant cuisine and district pages with a clearly-labelled gold Editor's Pick badge. Real organic listings appear below — never deleted or downranked."
          bullets={[
            "Top of every list with gold badge",
            "Pin to specific cuisine + district combos",
            "Average click-through 3-5x baseline",
            "Cancel anytime",
          ]}
          accent="#ca8a04"
        />

        <Offering
          tag="02 — Recommended"
          title="Mid-page sponsored placement"
          price="฿8,000 / month"
          body="Sponsored slot in the mid-page position with a blue Recommended badge. Less prominent than Editor's Pick but more affordable for new restaurants building visibility."
          bullets={[
            "Mid-page placement with blue badge",
            "Multi-cuisine targeting",
            "Geo-targeted (specific district)",
            "Cancel anytime",
          ]}
          accent="#1e40af"
        />

        <Offering
          tag="03 — Direct banner ads"
          title="Inline display banner placements"
          price="From ฿3,000 / month"
          body="Custom banner placements in the inline ad slots across all restaurant detail pages, cuisine pages, and city pages. CPM-based or fixed-fee."
          bullets={[
            "Targeted by cuisine, city, or district",
            "Custom creative",
            "Performance dashboard",
            "Klook / GrabFood referral integration available",
          ]}
          accent="#dc2626"
        />
      </section>

      <hr className="border-[var(--border)] my-12" />

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Why this works</h2>
        <div className="grid md:grid-cols-2 gap-5">
          <Why
            icon="🎯"
            title="High-intent traffic"
            body="Visitors arrive after Googling cuisine + district (e.g. 'best Thai food Sukhumvit'). They are deciding where to eat now or this week."
          />
          <Why
            icon="📊"
            title="Real Google data"
            body="Every Trust Score is computed from public Google Maps reviews — not paid testimonials. Builds diner trust which converts to visits."
          />
          <Why
            icon="🇰🇷"
            title="Tourist focus"
            body={`${cfg.brand} is positioned for international visitors who can't read Thai-only sites. Higher willingness to pay and try new places.`}
          />
          <Why
            icon="⚡"
            title="Fresh data"
            body="Listings refresh every 30 minutes from continuous scraping. New patient reviews appear here within an hour."
          />
        </div>
      </section>

      <section className="mb-16 bg-white border border-[var(--border)] rounded-xl p-6 text-center">
        <h2 className="text-2xl font-bold mb-2">Ready to start?</h2>
        <p className="text-[var(--muted)] mb-4">
          Email us with your restaurant name and the cuisine or district you want to target. We&apos;ll respond within 24 hours with a 30-day pilot proposal.
        </p>
        <a
          href="/contact"
          className="inline-block bg-black text-white py-3 px-6 rounded-lg font-bold hover:bg-gray-800"
        >
          Contact us →
        </a>
      </section>

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "For Restaurants", url: "/for-restaurants" },
      ]} />
    </div>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div className="bg-white border border-[var(--border)] rounded-xl p-5 text-center">
      <div className="text-3xl font-bold tabular-nums">{n}</div>
      <div className="text-xs text-[var(--muted)] uppercase tracking-wide mt-1">{label}</div>
    </div>
  );
}

function Offering({ tag, title, price, body, bullets, accent }: {
  tag: string; title: string; price: string; body: string; bullets: string[]; accent: string;
}) {
  return (
    <div className="bg-white border border-[var(--border)] rounded-xl p-6 hover:shadow-md transition">
      <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: accent }}>
            {tag}
          </div>
          <h3 className="text-2xl font-bold">{title}</h3>
        </div>
        <div className="text-sm font-medium px-3 py-1.5 rounded-full" style={{ background: `${accent}15`, color: accent }}>
          {price}
        </div>
      </div>
      <p className="text-sm text-[var(--muted)] leading-relaxed mb-4">{body}</p>
      <ul className="space-y-1.5">
        {bullets.map((b, i) => (
          <li key={i} className="text-sm flex items-start gap-2">
            <span style={{ color: accent }} className="font-bold">✓</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Why({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <div className="bg-white border border-[var(--border)] rounded-xl p-5">
      <div className="text-2xl mb-2">{icon}</div>
      <h3 className="font-bold text-base mb-1.5">{title}</h3>
      <p className="text-sm text-[var(--muted)] leading-relaxed">{body}</p>
    </div>
  );
}
