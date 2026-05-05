// B2B 영업 페이지 — CPL / Featured slot / Dashboard pitch.

import { loadMasterDb } from "@/lib/data";
import { BookingForm } from "@/components/BookingForm";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { getSiteConfig } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partner with us — Lead generation, Featured listings, Market intelligence",
  description:
    "We send pre-qualified booking requests to your clinic. CPL, Featured placement, and weekly competitor intelligence reports for Bangkok aesthetic clinics.",
  alternates: { canonical: "/for-clinics" },
};

export default async function ForClinicsPage() {
  const cfg = getSiteConfig();
  const db = await loadMasterDb();
  const totalReviews = db.clinics.reduce((s, c) => s + c.total_reviews, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span>For Clinics</span>
      </nav>

      <header className="mb-12 text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold uppercase tracking-wider mb-4">
          For clinic owners
        </span>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 text-balance">
          Bangkok&apos;s most credible aesthetic directory.
          <br />
          <span style={{ color: cfg.themeAccent }}>And it sends you customers.</span>
        </h1>
        <p className="text-base md:text-lg text-[var(--muted)] max-w-2xl mx-auto text-balance">
          {db.total_clinics.toLocaleString()} clinics tracked across Bangkok with {totalReviews.toLocaleString()} verified Google reviews. Patients searching &quot;Bangkok botox&quot; or &quot;Bangkok filler&quot; land here, ready to book.
        </p>
      </header>

      {/* Stats grid */}
      <section className="grid sm:grid-cols-3 gap-4 mb-16">
        <Stat n={db.total_clinics.toLocaleString()} label="Clinics indexed" />
        <Stat n={totalReviews.toLocaleString()} label="Reviews analyzed" />
        <Stat n="< 30 min" label="From scrape to live" />
      </section>

      {/* Three offerings */}
      <section className="space-y-8 mb-16">
        <Offering
          tag="01 — CPL"
          title="Pre-qualified bookings, paid per lead"
          price="From ฿50 / lead · ฿5,000 / month flat"
          body="Patients searching for your service in Bangkok land on a clinic detail page that ranks you by Trust Score. They click the LINE button, fill a multi-step booking form, and we relay the request to your team. You only see leads that completed the form."
          bullets={[
            "Real Google reviews are the source of truth — high search intent",
            "Each lead includes service, preferred date, time slot, and notes",
            "We can route to your existing LINE OA or your CRM webhook",
            "Cancel anytime, no contract minimum",
          ]}
          accent="#16a34a"
        />

        <Offering
          tag="02 — Featured Placement"
          title="Editor's Pick & Recommended slots"
          price="฿10,000 / month per slot · max 3 per category"
          body="Your clinic gets a permanent ranked-first position on the relevant category page (e.g. /c/botox, /c/filler) with a clearly labelled badge. Real organic listings appear below — we never delete or downrank them. Average CTR on top slots is 3-5x baseline."
          bullets={[
            "Editor's Pick badge — gold accent, top of every list",
            "Recommended badge — blue accent, between organic positions",
            "District-targeted: pay only for /c/botox/sukhumvit if that's your area",
            "Transparent disclosure — preserves user trust",
          ]}
          accent="#7c3aed"
        />

        <Offering
          tag="03 — Market Intelligence"
          title="Weekly competitor dashboard"
          price="฿8,000 / month per clinic"
          body="See exactly where your clinic ranks vs. competitors in your district and service category. Spot which clinics dropped or gained Trust Score this week, what reviewers are saying about you and them, and which districts are gaining search volume."
          bullets={[
            "Weekly delivered report (PDF + dashboard access)",
            "Compare your reviews-mentioned topics vs. top 10 in district",
            "Catch reputation issues — declining-quality alerts within hours",
            "Used by clinic GMs to set quarterly OKRs",
          ]}
          accent="#0891b2"
        />
      </section>

      <hr className="border-[var(--border)] my-12" />

      {/* Why us */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Why this works</h2>
        <div className="grid md:grid-cols-2 gap-5">
          <Why
            icon="🎯"
            title="High intent traffic"
            body="Visitors arrive after Googling specific procedures (Bangkok botox, Bangkok HIFU). They are ready to book — they just need to choose between you and 3-5 alternatives. We make that comparison favorable for paying partners."
          />
          <Why
            icon="📊"
            title="Real Google data, not paid reviews"
            body="Every Trust Score is computed from public Google Maps reviews — not paid testimonials. This builds trust with patients which converts to bookings."
          />
          <Why
            icon="🇰🇷"
            title="Korean & international tourist focus"
            body="Bangkokbotoxclinic.com is positioned for medical tourists who can't read Thai-only sites. They have higher willingness to pay and book larger packages."
          />
          <Why
            icon="⚡"
            title="Fresh data, fresh leads"
            body="Listings refresh every 30 minutes from continuous scraping. New patient reviews on your Google profile show up here within an hour, increasing your relevance score."
          />
        </div>
      </section>

      {/* Booking form */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-2">Get started — first 30 days free</h2>
        <p className="text-[var(--muted)] mb-6">
          Tell us your clinic name and service. We&apos;ll show you your current Trust Score ranking and a 30-day pilot proposal.
        </p>
        <BookingForm />
      </section>

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "For Clinics", url: "/for-clinics" },
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
