import type { Metadata } from "next";
import { getSiteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Important disclaimers about the nature of this independent clinic directory and its automated metrics.",
  alternates: { canonical: "/disclaimer" },
};

export const dynamic = "force-static";

const BUILD_DATE = "2026-06-23";
const CONTACT_EMAIL = "[CONTACT_EMAIL]";

export default function DisclaimerPage() {
  const cfg = getSiteConfig();
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span>Disclaimer</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3">Disclaimer</h1>
      <p className="text-sm text-[var(--muted)] mb-8">Last updated: {BUILD_DATE}</p>

      <div className="prose prose-sm max-w-none space-y-6 text-[var(--fg)]">
        <section>
          <h2 className="text-xl font-bold mb-2">Not medical advice</h2>
          <p className="text-sm leading-relaxed">
            {cfg.brand} does not provide medical advice, diagnosis, or treatment recommendations. Nothing on this
            site should be construed as medical advice. Always consult a licensed medical professional before
            undergoing any cosmetic, dental, or medical procedure.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">Independent &amp; not affiliated</h2>
          <p className="text-sm leading-relaxed">
            We are an independent directory. We are not affiliated with, endorsed by, or acting as an agent of any
            clinic listed on this site. Listing does not imply a commercial relationship, endorsement, or
            recommendation by any professional body. Sponsored listings are clearly labelled and never replace
            organic ranking results.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">Aggregated public information</h2>
          <p className="text-sm leading-relaxed">
            Clinic listings summarise publicly available data and public reviews sourced from Google Maps. We do not
            originate the underlying reviews. Review content reflects the opinions of third-party reviewers, not
            {cfg.brand}. We do not verify the accuracy of individual reviews.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">Opinion, not fact</h2>
          <p className="text-sm leading-relaxed">
            Trust Scores, rankings, and authenticity estimates (including &quot;Authenticity est.&quot; figures) are{" "}
            <strong>automated metrics and editorial opinion</strong> — not verified statements of fact about any
            business, clinic, or the authenticity of any individual review. These figures are derived from
            publicly available signals and may contain errors. They are not findings of wrongdoing. See{" "}
            <a href="/methodology" className="underline">/methodology</a> for how they are calculated.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">Accuracy</h2>
          <p className="text-sm leading-relaxed">
            Information may be incomplete, outdated, or contain errors. Clinic hours, pricing, availability, and
            staff may change without notice. Always verify details directly with the clinic before booking.
            We make no warranty of accuracy or completeness.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">Right of reply &amp; correction</h2>
          <p className="text-sm leading-relaxed">
            Any clinic, business, or individual may request review, correction, reply, or removal of information
            about them. Contact us at{" "}
            <a href="/corrections" className="underline">{CONTACT_EMAIL} / Corrections page</a>.
            We take all requests seriously and respond in good faith.
          </p>
        </section>
      </div>
    </div>
  );
}
