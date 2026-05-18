// B2B 영업 페이지 — CPL / Featured slot / Dashboard pitch.

import { loadMasterDb } from "@/lib/data";
import { BookingForm } from "@/components/BookingForm";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/JsonLd";
import { getSiteConfig } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partner with us — Lead generation, Featured listings, Market intelligence",
  description:
    "We send pre-qualified booking requests to your Bangkok clinic. CPL ฿50/lead, Featured slots from ฿5,000/mo, weekly competitor intelligence. 30-day pilot, no contract.",
  alternates: { canonical: "/for-clinics" },
};

const FAQS = [
  {
    q: "Will sponsoring a slot affect my organic ranking?",
    a: "No. Sponsored slots show ABOVE organic results with a clearly labelled badge — your organic Trust Score and position are computed and displayed independently. We never delete, hide, or downrank organic listings.",
  },
  {
    q: "What does 'pre-qualified lead' mean?",
    a: "Visitor lands on a clinic detail page, reads the Trust Score and reviews, then fills out a multi-step booking form (service, preferred date, time slot, name, contact). Only completed forms count as a lead — abandoned forms cost you nothing.",
  },
  {
    q: "How quickly can I start?",
    a: "Same day. We add your clinic ID to the Featured slot env var, Vercel auto-redeploys (~2 min), badge appears. CPL setup is faster: just give us a LINE OA or webhook URL to forward leads to.",
  },
  {
    q: "Can I see existing data on my clinic before signing?",
    a: "Yes — fill the form below with your clinic name and we'll send a 1-page report: your current Trust Score, district ranking, top 5 reviewer-mentioned topics, and pages where you currently rank in our top 10.",
  },
  {
    q: "What if I want to cancel?",
    a: "Cancel anytime via LINE. CPL: paused immediately, no charge for any partial month. Featured slot: prorated refund for unused days in the month. No contracts, no minimums.",
  },
  {
    q: "Do you accept Korean / Thai language clinics?",
    a: "Yes. Our front-end already serves /ko and /th locales. Korean-trained doctors and Korean-speaking staff get a separate filter (high search demand from medical tourists). Korean clinics can submit content to fast-track that placement.",
  },
];

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

      {/* Scarcity banner */}
      <div
        className="mb-8 px-4 py-3 rounded-xl border flex items-center justify-between gap-4 flex-wrap"
        style={{ borderColor: `${cfg.themeAccent}40`, background: `${cfg.themeAccent}08` }}
      >
        <div className="text-sm">
          <span className="font-bold" style={{ color: cfg.themeAccent }}>Q2 launch pricing</span>
          <span className="text-[var(--muted)]"> · first 5 Editor&apos;s Pick slots at 50% off (฿7,500/mo first 3 months) · 2 categories already taken</span>
        </div>
        <a
          href="#pilot"
          className="text-xs font-bold px-3 py-1.5 rounded-full text-white whitespace-nowrap"
          style={{ background: cfg.themeAccent }}
        >
          Claim a slot →
        </a>
      </div>

      <header className="mb-12 text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold uppercase tracking-wider mb-4">
          For clinic owners
        </span>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 text-balance">
          Bangkok&apos;s most credible aesthetic directory.
          <br />
          <span style={{ color: cfg.themeAccent }}>And it sends you customers.</span>
        </h1>
        <p className="text-base md:text-lg text-[var(--muted)] max-w-2xl mx-auto text-balance mb-6">
          {db.total_clinics.toLocaleString()} clinics tracked across Bangkok with {totalReviews.toLocaleString()} verified Google reviews. Patients searching &quot;Bangkok botox&quot; or &quot;Bangkok filler&quot; land here, ready to book.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <a
            href="#pilot"
            className="inline-block px-6 py-3 rounded-full text-white font-bold shadow-sm hover:shadow-md transition"
            style={{ background: cfg.themeAccent }}
          >
            See your free 1-page report →
          </a>
          <a
            href="/dashboard/demo"
            className="inline-block px-6 py-3 rounded-full font-bold border-2 hover:shadow-sm transition"
            style={{ borderColor: cfg.themeAccent, color: cfg.themeAccent }}
          >
            See live demo dashboard ↗
          </a>
        </div>
      </header>

      {/* Stats grid */}
      <section className="grid sm:grid-cols-3 gap-4 mb-12">
        <Stat n={db.total_clinics.toLocaleString()} label="Clinics indexed" />
        <Stat n={totalReviews.toLocaleString()} label="Reviews analyzed" />
        <Stat n="< 30 min" label="From scrape to live" />
      </section>

      {/* Sample lead notification — show what clinic actually gets */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-2">What you actually receive</h2>
        <p className="text-sm text-[var(--muted)] mb-4">A sample lead notification — pushed to your LINE OA or webhook within seconds of form submission.</p>
        <div className="bg-[#0a0a0a] text-white rounded-2xl p-6 font-mono text-sm leading-relaxed shadow-md">
          <div className="text-emerald-400 mb-2">[NEW LEAD] · bangkokbotoxclinic.com · 14:32 ICT</div>
          <div className="space-y-1 text-gray-200">
            <div><span className="text-gray-500">Clinic:</span>     {`<your clinic name>`}</div>
            <div><span className="text-gray-500">Service:</span>    Botox (forehead + crow&apos;s feet)</div>
            <div><span className="text-gray-500">Preferred:</span>  Saturday afternoon, 14:00–17:00</div>
            <div><span className="text-gray-500">Patient:</span>    Sarah K. · 32 · Singapore</div>
            <div><span className="text-gray-500">Budget:</span>     ฿8,000–15,000</div>
            <div><span className="text-gray-500">Notes:</span>      &ldquo;First-time visitor. Prefers Allergan. English-speaking doctor.&rdquo;</div>
            <div><span className="text-gray-500">Contact:</span>    LINE @sarahk_sg · arriving Bangkok Thu</div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-700 text-xs text-gray-500">
            Reply within 15 min for best conversion. SLA: lead exclusive to you for 24h.
          </div>
        </div>
      </section>

      {/* Three offerings */}
      <section className="space-y-6 mb-12">
        <h2 className="text-2xl font-bold">Three ways to work with us</h2>
        <Offering
          tag="01 — CPL"
          title="Pre-qualified bookings, paid per lead"
          price="฿50 / lead · or ฿5,000 / month flat"
          mostPopular
          body="The simplest start. Lead arrives via the booking form, we relay to you instantly. Pay per result. ฿50/lead is roughly 1/40th of a typical Bangkok botox bill — you make money on the first lead even if your conversion is single-digit."
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
          price="From ฿5,000 / mo · max 3 per category"
          body="Permanent ranked-first position on the relevant category page (e.g. /c/botox, /c/filler) with a clearly labelled coloured badge. Real organic listings appear below — we never delete or downrank them. Top slots see 3-5x baseline CTR in the same district."
          bullets={[
            "Editor's Pick — gold accent, top of every list (฿15,000/mo, 1 per category)",
            "Recommended — blue accent, between organic positions (฿10,000/mo)",
            "Featured — neutral accent, in top group (฿5,000/mo)",
            "District targeting available — pay only for /c/botox/sukhumvit if that's your area",
          ]}
          accent="#7c3aed"
        />

        <Offering
          tag="03 — Intelligence & AI Tools"
          title="Premium dashboard — leverage your data"
          price="฿8,000 / month per clinic"
          body="Real-time clinic dashboard with 3 features you can't get elsewhere. Not just 'see your reviews' — actionable tools that move Trust Score and convert negative reviews into recovery."
          bullets={[
            "AI Review Reply Drafts — every negative review auto-categorized + reply draft (apology + remedy + LINE CTA). Copy, edit, paste to Google in 30s",
            "Competitor Weakness Reports — extracted negative review patterns from your top 5 competitors. Marketing positioning gold",
            "AEO Citation Tracker — count how often ChatGPT/Perplexity/Google AI cites your clinic in answers (launching Q3)",
            "Plus: Trust Score breakdown + rating trend + topic analysis + 50 latest review samples",
          ]}
          accent="#0891b2"
        />
      </section>

      {/* Comparison table */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-4">At a glance</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse bg-white border border-[var(--border)] rounded-xl overflow-hidden">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 font-bold">Plan</th>
                <th className="px-4 py-3 font-bold">Cost</th>
                <th className="px-4 py-3 font-bold">Best for</th>
                <th className="px-4 py-3 font-bold">Time to value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              <tr>
                <td className="px-4 py-3 font-medium">CPL</td>
                <td className="px-4 py-3 tabular-nums">฿50/lead</td>
                <td className="px-4 py-3 text-[var(--muted)]">Test the channel risk-free</td>
                <td className="px-4 py-3 text-[var(--muted)]">Same day</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Featured</td>
                <td className="px-4 py-3 tabular-nums">฿5–15K/mo</td>
                <td className="px-4 py-3 text-[var(--muted)]">High-volume specialist clinics</td>
                <td className="px-4 py-3 text-[var(--muted)]">2 min after env update</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Intelligence</td>
                <td className="px-4 py-3 tabular-nums">฿8K/mo</td>
                <td className="px-4 py-3 text-[var(--muted)]">Multi-location operators</td>
                <td className="px-4 py-3 text-[var(--muted)]">First report within 7 days</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-[var(--muted)] mt-2">
          Bundle CPL + Featured: 20% off Featured rate. Bundle all three: 30% off Intelligence.
        </p>
      </section>

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
            body="bangkokbotoxclinic.com is positioned for medical tourists who can't read Thai-only sites. Higher willingness to pay and book larger packages."
          />
          <Why
            icon="⚡"
            title="Fresh data, fresh leads"
            body="Listings refresh every 30 minutes from continuous scraping. New patient reviews on your Google profile show up here within an hour, increasing your relevance."
          />
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-4">Frequently asked</h2>
        <div className="space-y-3">
          {FAQS.map((f, i) => (
            <details key={i} className="bg-white border border-[var(--border)] rounded-lg p-4 group">
              <summary className="font-medium cursor-pointer flex items-center justify-between gap-3">
                <span>{f.q}</span>
                <span className="text-[var(--muted)] group-open:rotate-180 transition">⌄</span>
              </summary>
              <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Booking form */}
      <section id="pilot" className="mb-16 scroll-mt-20">
        <div
          className="rounded-2xl p-1 mb-6"
          style={{ background: `linear-gradient(135deg, ${cfg.themeAccent}, ${cfg.themeAccent}80)` }}
        >
          <div className="bg-white rounded-xl px-6 py-5">
            <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: cfg.themeAccent }}>
              30-day pilot · no payment unless we generate leads
            </div>
            <h2 className="text-2xl font-bold mb-2">See your clinic&apos;s 1-page report</h2>
            <p className="text-sm text-[var(--muted)]">
              Fill in clinic name and primary service. Within 24h we send: your current Trust Score, where you rank in your district, top 5 reviewer-mentioned topics, plus a 30-day pilot proposal.
            </p>
          </div>
        </div>
        <BookingForm />
        <p className="text-xs text-[var(--muted)] mt-4 text-center">
          Or message us directly · LINE: <strong>@405zhjqb</strong> · Email: <strong>partners@bangkokbotoxclinic.com</strong>
        </p>
      </section>

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "For Clinics", url: "/for-clinics" },
      ]} />
      <FaqJsonLd faqs={FAQS} />
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

function Offering({ tag, title, price, body, bullets, accent, mostPopular }: {
  tag: string; title: string; price: string; body: string; bullets: string[]; accent: string; mostPopular?: boolean;
}) {
  return (
    <div
      className="bg-white border-2 rounded-xl p-6 hover:shadow-md transition relative"
      style={{ borderColor: mostPopular ? accent : "var(--border)" }}
    >
      {mostPopular && (
        <div
          className="absolute -top-3 right-6 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full text-white"
          style={{ background: accent }}
        >
          Most popular
        </div>
      )}
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
