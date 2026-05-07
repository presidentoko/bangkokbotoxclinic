import { loadMasterDb } from "@/lib/data";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { getSiteConfig } from "@/lib/site";
import type { Metadata } from "next";

const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "umma@xx.gg";

export const metadata: Metadata = {
  title: "For Golf Clubs — Featured Listings & Lead Generation",
  description:
    "Featured placement, Korean tourist marketing, weekly competitor intelligence for Thai golf clubs.",
  alternates: { canonical: "/for-courses" },
};

export default async function ForCoursesPage() {
  const cfg = getSiteConfig();
  const db = await loadMasterDb();
  const totalReviews = db.courses.reduce((s, c) => s + c.total_reviews, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span>For Golf Clubs</span>
      </nav>

      <header className="mb-12 text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-green-50 text-green-800 text-xs font-bold uppercase tracking-wider mb-4">
          For golf course operators
        </span>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 text-balance">
          Reach Korean & international golfers actively planning Thai trips.
          <br />
          <span style={{ color: cfg.themeAccent }}>Verified data, real placement.</span>
        </h1>
        <p className="text-base md:text-lg text-[var(--muted)] max-w-2xl mx-auto text-balance">
          {db.total_courses} courses tracked across {Object.keys(db.city_counts).length} provinces with {totalReviews.toLocaleString()} verified Google reviews. {db.language_total.ko}+ Korean reviews — {cfg.brand} dominates Korean golf-tour search.
        </p>
      </header>

      <section className="grid sm:grid-cols-3 gap-4 mb-16">
        <Stat n={db.total_courses.toLocaleString()} label="Courses indexed" />
        <Stat n={db.language_total.ko.toLocaleString() + "+"} label="Korean reviews" />
        <Stat n="< 30 min" label="Update latency" />
      </section>

      <section className="space-y-8 mb-16">
        <Offering
          tag="01 — Editor's Pick"
          title="Top spot on every category & province page"
          price="฿15,000 / month"
          body="Permanent ranked-first position with gold Editor's Pick badge across /c/course, /c/resort, /city/[your-province] and best-of pages. Real organic listings appear below — never deleted."
          bullets={[
            "Top of every relevant list with gold badge",
            "Pin to specific province × course type",
            "Average click-through 3-5x baseline",
            "Cancel anytime",
          ]}
          accent="#ca8a04"
        />

        <Offering
          tag="02 — Korean Tourism Channel"
          title="Featured on /ko Korean homepage"
          price="฿20,000 / month"
          body="Korean tour groups research extensively before booking. Be the first golf club they see on the Korean-language landing page. Includes Klook + Sawasdee Golf affiliate priority placement."
          bullets={[
            "Top 3 placement on /ko homepage",
            "Korean-language testimonials block",
            "Booking partner deep-link with priority routing",
            "Includes Editor's Pick on relevant English pages too",
          ]}
          accent="#dc2626"
        />

        <Offering
          tag="03 — Recommended"
          title="Mid-page sponsored placement"
          price="฿8,000 / month"
          body="Sponsored slot in the mid-page position with a blue Recommended badge. Less prominent than Editor's Pick but more affordable for clubs building visibility."
          bullets={[
            "Mid-page placement with blue badge",
            "Multi-category targeting",
            "Province-specific (e.g. only /city/chon_buri)",
            "Cancel anytime",
          ]}
          accent="#1e40af"
        />

        <Offering
          tag="04 — Lead Generation (CPL)"
          title="Pre-qualified booking inquiries"
          price="฿1,000 / lead · or ฿15,000 / month flat"
          body="Booking inquiries that match your course's profile (region, language need, group size). Each lead includes contact, preferred date, group size, and language preference."
          bullets={[
            "Pre-qualified by user filters",
            "Korean / English / Thai segmentation",
            "Webhook delivery to your CRM",
            "Pay only for delivered leads",
          ]}
          accent="#16a34a"
        />
      </section>

      <hr className="border-[var(--border)] my-12" />

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Why this works</h2>
        <div className="grid md:grid-cols-2 gap-5">
          <Why
            icon="🎯"
            title="High-intent traffic"
            body="Visitors arrive after Googling 'Bangkok golf', 'Thailand golf tour', or specific course names + Korean/Japanese variants. They're planning a tee time within 2 weeks."
          />
          <Why
            icon="📊"
            title="Real Google data"
            body="Trust Score is computed from public Google Maps reviews — not paid testimonials. Builds golfer trust which converts to bookings."
          />
          <Why
            icon="🇰🇷"
            title="Korean tourist focus"
            body="Korean golfers spend 3-5x average per round (group bookings + transfers + caddy tips). Our /ko channel is the primary entry point for Korean planning."
          />
          <Why
            icon="⚡"
            title="Continuous freshness"
            body="New patient reviews appear within 30 minutes. Your ranking responds immediately to new positive reviews — no slow batch refreshes."
          />
        </div>
      </section>

      <section className="mb-16 bg-white border border-[var(--border)] rounded-xl p-6 text-center">
        <h2 className="text-2xl font-bold mb-2">Ready to start?</h2>
        <p className="text-[var(--muted)] mb-4">
          Email us with your club name and target tier. We'll respond within 24 hours with a 30-day pilot proposal.
        </p>
        <a
          href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Featured listing inquiry — golf club")}`}
          className="inline-block bg-black text-white py-3 px-6 rounded-lg font-bold hover:bg-gray-800"
        >
          ✉ {CONTACT_EMAIL}
        </a>
      </section>

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "For Golf Clubs", url: "/for-courses" },
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
