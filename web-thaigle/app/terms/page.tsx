import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use — Thaigle",
  description: "Thaigle aggregates public consumer reviews to help visitors make informed decisions. Our scores and summaries are aggregated opinions, not editorial judgements.",
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Terms of Use</h1>
      <p className="text-xs text-zinc-400 mb-8">Last updated: June 2026</p>

      <section className="mb-8">
        <h2 className="font-semibold text-zinc-900 dark:text-white mb-2">1. Purpose &amp; Nature of Content</h2>
        <p className="mb-3">
          Thaigle is a consumer information platform. All scores, summaries ("receipts"), and rankings on this site are <strong>aggregated opinions derived from publicly available third-party reviews</strong> (Google Maps, Pantip, Naver, and other sources). They represent Thaigle's synthesis of what reviewers collectively reported — they are not factual declarations about any business, and they are not editorial endorsements.
        </p>
        <p>
          Content on Thaigle is provided for <strong>public-interest consumer information purposes</strong>. Nothing on this site constitutes professional advice (medical, legal, financial, or otherwise).
        </p>
      </section>

      <section className="mb-8">
        <h2 className="font-semibold text-zinc-900 dark:text-white mb-2">2. Scores &amp; Summaries</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>The <em>Locals Score</em> is a Bayesian-weighted aggregate of reviewer ratings. It is a statistical estimate, not a certified quality rating.</li>
          <li>The <em>Feed Says / Data Says</em> summaries are synthesised from aggregated review text. Language like "reviewers report…", "in our reading of N reviews…", or "opinions suggest…" signals attributed opinion, not independent fact-finding.</li>
          <li>Scores are updated periodically. A score reflects the review data available at the time of computation and may not reflect recent changes.</li>
          <li>We exclude reviews with sponsored signals from scoring. The percentage excluded is used internally and is not attributed to any specific business.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="font-semibold text-zinc-900 dark:text-white mb-2">3. Business Listings</h2>
        <p className="mb-3">
          Businesses are listed based on publicly available data. Appearing on Thaigle does not imply endorsement or partnership. Businesses may <a href="/takedown" className="text-teal-600 underline">request correction or removal</a>.
        </p>
        <p>
          Affiliate links (Klook, Viator, GetYourGuide) may be included. These are clearly associated with the booking platform, not with editorial scores.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="font-semibold text-zinc-900 dark:text-white mb-2">4. No Warranty</h2>
        <p>
          Information is provided "as is." Thaigle makes no warranty that scores, hours, prices, or contact details are current or accurate. Always verify directly with the business before visiting.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="font-semibold text-zinc-900 dark:text-white mb-2">5. Limitation of Liability</h2>
        <p>
          Thaigle is not liable for decisions made based on content on this site. Aggregated review opinions are not professional recommendations.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="font-semibold text-zinc-900 dark:text-white mb-2">6. Corrections &amp; Takedowns</h2>
        <p>
          If you believe content about your business is inaccurate or harmful, you may <a href="/takedown" className="text-teal-600 underline">submit a correction or takedown request</a>. We aim to review all requests within 24 hours. Disputed listings may be temporarily suppressed pending review.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="font-semibold text-zinc-900 dark:text-white mb-2">7. Governing Law</h2>
        <p>
          This site is operated from Thailand. Content is subject to applicable Thai law including the Computer Crimes Act and Consumer Protection Act.
        </p>
      </section>

      <div className="mt-10 pt-6 border-t border-zinc-200 dark:border-zinc-700 text-xs text-zinc-400">
        Questions? <a href="/contact" className="underline">Contact us</a> · <a href="/takedown" className="underline">Business correction request</a>
      </div>
    </main>
  );
}
