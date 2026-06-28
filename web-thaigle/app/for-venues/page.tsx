import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { RatingLegend } from "@/components/RatingLegend";
import { getSiteConfig } from "@/lib/site";
import { NICHES } from "@/lib/niches";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "List your venue on Thaigle — Featured placements for activity owners",
  description:
    "Featured listings, sponsored slots, and free visibility audits for Muay Thai gyms, spas, cooking schools, dive shops, yoga studios, and restaurants in Bangkok.",
  alternates: { canonical: "/for-venues" },
};

const VENUE_TYPES = [
  { icon: "🥊", label: "Muay Thai gym", niche: "muay-thai" },
  { icon: "💆", label: "Spa & massage", niche: "spa" },
  { icon: "👨‍🍳", label: "Cooking school", niche: "cooking" },
  { icon: "🤿", label: "Dive shop", niche: "diving" },
  { icon: "🧘", label: "Yoga studio", niche: "yoga-pilates" },
  { icon: "🌿", label: "Wellness center", niche: "wellness" },
  { icon: "🍽️", label: "Restaurant", niche: "restaurant" },
];

export default async function ForVenuesPage() {
  const cfg = getSiteConfig();
  const totalPlaces = NICHES.length * 200; // approximate — static for now

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span>For Venue Owners</span>
      </nav>

      <header className="mb-12 text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-orange-50 text-orange-800 text-xs font-bold uppercase tracking-wider mb-4">
          For venue owners
        </span>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 text-balance">
          Get discovered by travellers actively
          <br />
          <span style={{ color: cfg.themeAccent }}>searching for your activity in Bangkok.</span>
        </h1>
        <p className="text-base md:text-lg text-[var(--muted)] max-w-2xl mx-auto text-balance">
          {cfg.brand} indexes 1,600+ venues across 7 activity categories. Visitors searching "Muay Thai Bangkok" or "cooking class Silom" land here and book direct.
        </p>
      </header>

      {/* Venue type chips */}
      <div className="flex flex-wrap gap-2 justify-center mb-12">
        {VENUE_TYPES.map((v) => (
          <span key={v.niche} className="px-3 py-1.5 rounded-full bg-white border border-[var(--border)] text-sm font-medium">
            {v.icon} {v.label}
          </span>
        ))}
      </div>

      <section className="grid sm:grid-cols-3 gap-4 mb-16">
        <Stat n="1,600+" label="Venues indexed" />
        <Stat n="7" label="Activity categories" />
        <Stat n="< 30 min" label="From scrape to live" />
      </section>

      {/* Free audit CTA */}
      <section className="mb-16 bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-8">
        <div className="flex items-start gap-4 flex-col md:flex-row md:items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-orange-700 mb-1">Free — no strings attached</div>
            <h2 className="text-2xl font-bold mb-2">Get a free visibility audit</h2>
            <p className="text-sm text-[var(--muted)] max-w-md">
              We&apos;ll check if your venue appears correctly, how your Trust Score compares to local competitors, and what&apos;s pulling your ranking down. Free, in 24 hours.
            </p>
          </div>
          <a
            href={`/contact?type=audit&ref=for-venues`}
            className="shrink-0 inline-block bg-orange-500 text-white py-3 px-6 rounded-xl font-bold hover:bg-orange-600 transition active:scale-95"
          >
            Request free audit →
          </a>
        </div>
      </section>

      <section className="space-y-8 mb-16">
        <Offering
          tag="01 — Featured"
          title="Top spot on your category page"
          price="฿15,000 / month"
          body="Your venue gets a permanent ranked-first position on the relevant activity category page with a gold Featured badge. Organic listings appear below — never deleted or downranked."
          bullets={[
            "Top of the category list with gold badge",
            "Pin to specific niche + city combos",
            "Average click-through 3-5× baseline",
            "Ranking and Trust Score never touched",
            "Cancel anytime",
          ]}
          accent="#ca8a04"
        />

        <Offering
          tag="02 — Recommended"
          title="Mid-page sponsored placement"
          price="฿8,000 / month"
          body="Sponsored slot in the mid-page position with a blue Recommended badge. Great for new venues building early visibility in a competitive category."
          bullets={[
            "Mid-page placement with blue badge",
            "Multi-category targeting",
            "Geo-targeted (specific district or city)",
            "Cancel anytime",
          ]}
          accent="#1e40af"
        />

        <Offering
          tag="03 — Banner ads"
          title="Inline display placements"
          price="From ฿3,000 / month"
          body="Custom banner placements in the inline ad slots across activity detail pages and category hubs. CPM-based or fixed-fee."
          bullets={[
            "Targeted by category or city",
            "Custom creative",
            "Performance dashboard",
            "Klook / booking-platform referral integration available",
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
            body="Visitors arrive after Googling activity + city (e.g. 'Muay Thai Bangkok Silom'). They are booking a class or session this week."
          />
          <Why
            icon="📊"
            title="Real Google data"
            body="Every Trust Score is computed from public Google Maps reviews — not paid testimonials. Builds visitor trust which converts to bookings."
          />
          <Why
            icon="🇰🇷🇯🇵🇺🇸"
            title="International visitors"
            body={`${cfg.brand} is built for tourists who can't read Thai-only sites. We serve EN, KO, TH, JA, RU and AR pages — reaching every major tourist segment.`}
          />
          <Why
            icon="⚡"
            title="Live listings"
            body="Venue data refreshes continuously from Google Maps. New reviews and ratings appear here within the hour."
          />
        </div>
      </section>

      <section className="mb-16 bg-white border border-[var(--border)] rounded-xl p-6 text-center">
        <h2 className="text-2xl font-bold mb-2">Ready to start?</h2>
        <p className="text-[var(--muted)] mb-4">
          Email us with your venue name and the category you want to target. We&apos;ll respond within 24 hours with a 30-day pilot proposal.
        </p>
        <a
          href="/contact"
          className="inline-block bg-black text-white py-3 px-6 rounded-lg font-bold hover:bg-gray-800"
        >
          Contact us →
        </a>
      </section>

      <RatingLegend />
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "For Venues", url: "/for-venues" },
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
