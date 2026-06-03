import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "How the Trust Score Works — Methodology",
  description:
    "Our supplier Trust Score is a 0–100 composite of five signals: registered capital, years in business, Google review strength, active verifications, and site-evidence photos. Here's the exact formula.",
  alternates: { canonical: "/trust-score" },
};

const SIGNALS = [
  {
    label: "Registered Capital",
    weight: "1/5",
    detail: "Registered capital from Thailand's DBD, log-scaled: ฿100K scores 0, ฿100M scores 75, ฿1B+ scores 100. Higher registered capital signals a more substantial operation.",
  },
  {
    label: "Years in Business",
    weight: "1/5",
    detail: "Company age from the DBD registration date (4 points per year, capped at 100 = 25+ years). Longevity is a strong proxy for reliability.",
  },
  {
    label: "Google Review Strength",
    weight: "1/5",
    detail: "Review volume (log-scaled) combined with average star rating, from public Google Maps listings. Many consistent reviews score highest.",
  },
  {
    label: "Active Verifications",
    weight: "1/5",
    detail: "How many of four credentials are present: DBD registration, Halal certification, industrial-estate membership, and an official TSIC industry code. 4 of 4 scores 100.",
  },
  {
    label: "Site-Evidence Photos",
    weight: "1/5",
    detail: "Number of facility/product photos available (12.5 points each, capped at 100 = 8+ photos). More visual evidence of a real operation scores higher.",
  },
];

export default function TrustScorePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span>Trust Score</span>
      </nav>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">How the Trust Score works</h1>
      <p className="text-[var(--muted)] leading-relaxed mb-8">
        Every supplier gets a <strong>Trust Score from 0 to 100</strong> — the average of the
        signals below for which we have data. (A supplier is never penalized for a signal we
        simply haven&apos;t collected.) It is computed automatically from public data (Google Maps
        and Thailand&apos;s Department of Business Development). It is not a paid rating and cannot
        be bought. Tiers: <strong>Excellent</strong> 75+, <strong>Strong</strong> 60+,
        {" "}<strong>Fair</strong> 40+, <strong>Limited</strong> below 40.
      </p>

      <div className="space-y-4">
        {SIGNALS.map((s) => (
          <section key={s.label} className="bg-white border border-[var(--border)] rounded-xl p-5">
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-bold text-lg">{s.label}</h2>
              <span className="text-xs font-semibold text-[var(--muted)] tabular-nums">weight {s.weight}</span>
            </div>
            <p className="text-sm text-[var(--muted)] leading-relaxed">{s.detail}</p>
          </section>
        ))}
      </div>

      <p className="text-xs text-[var(--muted)] mt-8 leading-relaxed">
        The Trust Score is informational and based on public data; always perform your own due
        diligence (sample orders, factory audits, contracts) before committing to a supplier.
      </p>

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Trust Score", url: "/trust-score" },
      ]} />
    </div>
  );
}
