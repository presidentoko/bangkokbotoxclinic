import type { Metadata } from "next";
import { getSiteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "How Trust Score Works — Methodology",
  description: "How we calculate Trust Score: an automated, opinion-based metric from publicly available review signals.",
  alternates: { canonical: "/methodology" },
};

export const dynamic = "force-static";

const BUILD_DATE = "2026-06-23";

export default function MethodologyPage() {
  const cfg = getSiteConfig();
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span>Methodology</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3">How Trust Score Works</h1>
      <p className="text-sm text-[var(--muted)] mb-8">Last updated: {BUILD_DATE}</p>

      <div className="prose prose-sm max-w-none space-y-6 text-[var(--fg)]">
        <section className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm leading-relaxed text-amber-900">
            <strong>Important:</strong> Trust Score is an automated, opinion-based metric generated from publicly
            available signals. It is <strong>not</strong> a measure of medical quality, safety, or competence.
            It is <strong>not</strong> a verified factual finding about any business or its reviews. It is an
            estimate that may contain errors and can change as public data changes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">What Trust Score measures</h2>
          <p className="text-sm leading-relaxed">
            Trust Score is a 0–100 composite index that estimates the credibility and consistency of a
            clinic&apos;s public Google review profile. A higher score indicates a more consistent, high-volume
            review history from credible reviewer types — it does <strong>not</strong> certify clinical outcomes or
            safety.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">Signal breakdown</h2>
          <p className="text-sm leading-relaxed mb-3">
            The score is derived from four publicly available signals. Weights below are approximate and subject
            to ongoing calibration:
          </p>
          {/* overflow-x-auto safety net — same class of bug fixed on
              about/trust-score's table (2026-07-28 감사): a table with no
              scroll wrapper either clips silently or forces page-wide
              horizontal scroll on narrow viewports. */}
          <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left py-2 pr-4 font-semibold">Signal</th>
                <th className="text-left py-2 pr-4 font-semibold">Weight</th>
                <th className="text-left py-2 font-semibold">What it reflects</th>
              </tr>
            </thead>
            <tbody className="text-[var(--muted)]">
              <tr className="border-b border-[var(--border)]">
                <td className="py-2 pr-4">Average star rating</td>
                <td className="py-2 pr-4">~45%</td>
                <td className="py-2">Raw Google Maps rating (1–5 stars)</td>
              </tr>
              <tr className="border-b border-[var(--border)]">
                <td className="py-2 pr-4">Review volume</td>
                <td className="py-2 pr-4">~35%</td>
                <td className="py-2">Total number of reviews (log-scaled)</td>
              </tr>
              <tr className="border-b border-[var(--border)]">
                <td className="py-2 pr-4">Local Guide ratio</td>
                <td className="py-2 pr-4">~15%</td>
                <td className="py-2">Fraction of reviews by Google Local Guides</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">Rating consistency</td>
                <td className="py-2 pr-4">~5%</td>
                <td className="py-2">Stability of rating over recent vs. older periods</td>
              </tr>
            </tbody>
          </table>
          </div>
          <p className="text-xs text-[var(--muted)] mt-2">Weights sum to 100%. Subject to change.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">Authenticity estimate</h2>
          <p className="text-sm leading-relaxed">
            The &quot;Authenticity est. ~X%&quot; figure shown on some clinic cards is a separate automated estimate
            of review credibility, calculated from the Local Guide ratio with a 50% floor. It is{" "}
            <strong>not a finding that any review is fake or fraudulent</strong>. It is an automated opinion
            based on publicly observable review patterns. Values below 65% are not shown on listing cards.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">Data sources</h2>
          <p className="text-sm leading-relaxed">
            All signals are derived from publicly available Google Maps listings. We do not have access to Google&apos;s
            internal review verification systems. Our data is refreshed continuously via automated collection and
            may lag real-time changes by up to 30 days.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">Limitations</h2>
          <ul className="list-disc pl-5 text-sm space-y-1">
            <li>Trust Score does not measure actual medical outcomes, safety, or clinical quality.</li>
            <li>A high Trust Score does not guarantee a good patient experience.</li>
            <li>New or recently-opened clinics may have insufficient data for a reliable score.</li>
            <li>The metric can be influenced by review campaigns outside our control.</li>
            <li>Scores are automated estimates and may contain errors.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">Dispute or correct a score</h2>
          <p className="text-sm leading-relaxed">
            If you are a clinic and believe your Trust Score contains an error, or wish to dispute any figure,
            please use our{" "}
            <a href="/corrections" className="underline">Corrections page</a>. We review all requests and aim
            to respond within a reasonable timeframe.
          </p>
        </section>
      </div>
    </div>
  );
}
