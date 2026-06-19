import { loadMasterDb } from "@/lib/data";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { getSiteConfig } from "@/lib/site";
import { RfqForm } from "@/components/RfqForm";
import { SupplierVerifiedCTA } from "@/components/SupplierVerifiedCTA";
import type { Metadata } from "next";

const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || "inquiry@thaisupplyhub.com";

export const metadata: Metadata = {
  title: "For Suppliers — Featured Listings & Lead Generation",
  description:
    "Featured placement, international buyer leads, weekly competitor intelligence for Thai manufacturers, industrial estates, and logistics operators.",
  alternates: {
    canonical: "/for-suppliers",
    languages: {
      "en-US": "/for-suppliers",
      "ko-KR": "/ko/for-suppliers",
      "th-TH": "/th/for-suppliers",
      "x-default": "/for-suppliers",
    },
  },
};

export default async function ForSuppliersPage() {
  const cfg = getSiteConfig();
  const db = await loadMasterDb();
  const totalReviews = db.suppliers.reduce((s, c) => s + c.total_reviews, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span>For Suppliers</span>
      </nav>

      <header className="mb-12 text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4">
          For Thai manufacturers and industrial operators
        </span>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 text-balance">
          Reach international buyers actively sourcing from Thailand.
          <br />
          <span style={{ color: cfg.themeAccent }}>Verified data, real placement.</span>
        </h1>
        <p className="text-base md:text-lg text-[var(--muted)] max-w-2xl mx-auto text-balance">
          {db.total_suppliers.toLocaleString()} suppliers tracked across {Object.keys(db.city_counts).length} provinces with {totalReviews.toLocaleString()} verified Google reviews. {cfg.brand} is the directory buyers reach for when sourcing-agent quotes start to feel inflated.
        </p>
      </header>

      <section className="grid sm:grid-cols-3 gap-4 mb-16">
        <Stat n={db.total_suppliers.toLocaleString()} label="Suppliers indexed" />
        <Stat n={db.with_website.toLocaleString()} label="With direct website" />
        <Stat n="< 30 min" label="Update latency" />
      </section>

      <section className="space-y-8 mb-16">
        <Offering
          tag="00 — Verified Supplier"
          title="Verified badge — proof beats marketing"
          price="฿5,000 (Verified) · ฿15,000 (Premium) · ฿40,000 (Enterprise) — one-time"
          body="A blue/green/gold Verified badge on your listing card and supplier page. Buyers shortlisting Thai suppliers explicitly filter for verification — many won't open an unverified listing for first-time orders. One-time fee, badge stays as long as your registration & certs remain valid."
          bullets={[
            "Verified — business registration + factory photo verified (฿5,000)",
            "Verified Premium — + ISO 9001 / IATF 16949 / HACCP / equivalent quality cert (฿15,000)",
            "Verified Enterprise — + on-site HQ audit + customer reference calls (฿40,000)",
            "Schema.org marker + JSON-LD identifier — buyer trust signal beyond visual badge",
            "One-time fee — annual renewal at 50% if registration / certs unchanged",
          ]}
          accent="#1e40af"
        />

        <Offering
          tag="01 — Editor's Pick"
          title="Top spot on every category & province page"
          price="฿15,000 / month"
          body="Permanent ranked-first position with gold Editor's Pick badge across /c/manufacturer, /c/auto_parts, /city/[your-province] and best-of pages. Real organic listings appear below — never deleted."
          bullets={[
            "Top of every relevant list with gold badge",
            "Pin to specific province × category",
            "Average click-through 3-5x baseline",
            "Cancel anytime",
          ]}
          accent="#ca8a04"
        />

        <Offering
          tag="02 — International Buyer Channel"
          title="Featured on /ko (Korean) and /en buyer landing pages"
          price="฿20,000 / month"
          body="Korean and Japanese sourcing teams research extensively before contacting suppliers. Be the first manufacturer they see on the Korean-language landing page. Includes priority placement on the English buyer-onboarding flow."
          bullets={[
            "Top 3 placement on /ko homepage",
            "Localized testimonial block (your existing reviewer quotes)",
            "Direct contact CTA with priority routing",
            "Includes Editor's Pick on relevant English pages too",
          ]}
          accent="#dc2626"
        />

        <Offering
          tag="03 — Recommended"
          title="Mid-page sponsored placement"
          price="฿8,000 / month"
          body="Sponsored slot in the mid-page position with a blue Recommended badge. Less prominent than Editor's Pick but more affordable for suppliers building visibility."
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
          title="Pre-qualified buyer inquiries"
          price="฿2,500 / lead · or ฿30,000 / month flat"
          body="Buyer inquiries that match your supplier profile (category, region, language). Each lead includes contact name, company, sourcing volume estimate, and target product/service."
          bullets={[
            "Pre-qualified by buyer category + volume filters",
            "Korean / English / Thai language segmentation",
            "Webhook delivery to your CRM or email",
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
            body="Visitors arrive after Googling 'Thailand manufacturer for [product]', 'Eastern Seaboard auto parts supplier', or specific industrial estate names. They're shortlisting suppliers within the next 1-4 weeks."
          />
          <Why
            icon="📊"
            title="Real Google data"
            body="Trust Score is computed from public Google Maps reviews — not paid testimonials. Builds buyer trust which converts to direct contact."
          />
          <Why
            icon="🌏"
            title="International buyer focus"
            body="Korean, Japanese, and English sourcing teams account for the majority of high-value B2B traffic. Our multilingual entry points are tuned for this audience."
          />
          <Why
            icon="⚡"
            title="Continuous freshness"
            body="New supplier reviews and profile changes propagate within 30 minutes of our next data rebuild. No slow batch refreshes."
          />
        </div>
      </section>

      <section className="mb-16 space-y-6">
        <h2 className="text-2xl font-bold">Ready to start?</h2>

        <SupplierVerifiedCTA />

        <div className="bg-white border border-[var(--border)] rounded-xl p-6">
          <h3 className="font-bold text-lg mb-2">Other tiers — contact us</h3>
          <p className="text-[var(--muted)] text-sm mb-4">
            For Editor&apos;s Pick, International Buyer Channel, or Lead Generation, email with your company name and target tier. Response within one business day.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Featured listing inquiry — supplier")}`}
              className="inline-flex items-center gap-2 bg-black text-white py-2.5 px-5 rounded-lg font-bold hover:bg-gray-800"
            >
              ✉ {CONTACT_EMAIL}
            </a>
            {process.env.NEXT_PUBLIC_LINE_OA_URL && (
              <a
                href={process.env.NEXT_PUBLIC_LINE_OA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border-2 border-[#06C755] text-[#06C755] py-2.5 px-5 rounded-lg font-bold hover:bg-[#06C755]/5"
              >
                LINE OA
              </a>
            )}
          </div>
          <p className="text-xs text-[var(--muted)] mt-3">
            To avoid Cloudflare email obfuscation, copy the address manually if the link doesn&apos;t open your mail app.
          </p>
        </div>
      </section>

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "For Suppliers", url: "/for-suppliers" },
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
