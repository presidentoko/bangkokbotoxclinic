import type { Metadata } from "next";
import { getSiteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using this independent clinic directory.",
  alternates: { canonical: "/terms" },
};

export const dynamic = "force-static";

const BUILD_DATE = "2026-06-23";
const ENTITY_NAME = "[ENTITY_NAME]";
const CONTACT_EMAIL = "[CONTACT_EMAIL]";
const JURISDICTION = "[JURISDICTION / arbitration clause — 변호사 결정]";

export default function TermsPage() {
  const cfg = getSiteConfig();
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span>Terms of Service</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3">Terms of Service</h1>
      <p className="text-sm text-[var(--muted)] mb-8">Last updated: {BUILD_DATE}</p>

      <div className="prose prose-sm max-w-none space-y-6 text-[var(--fg)]">
        <section>
          <h2 className="text-xl font-bold mb-2">1. Acceptance</h2>
          <p className="text-sm leading-relaxed">
            By using {cfg.brand} you agree to these terms. If you do not agree, please do not use the site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">2. Nature of service</h2>
          <p className="text-sm leading-relaxed">
            {cfg.brand} is an independent directory that aggregates and summarises publicly available information and
            public reviews about clinics. We are not affiliated with, endorsed by, or sponsored by any listed clinic.
            Listing on this site does not imply any relationship or endorsement.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">3. No professional advice</h2>
          <p className="text-sm leading-relaxed">
            Content on this site is for general information only and is <strong>not</strong> medical, health, or
            professional advice. Always consult a licensed medical professional before any procedure or treatment
            decision.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">4. No warranty</h2>
          <p className="text-sm leading-relaxed">
            Information is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind,
            express or implied, including accuracy, completeness, or fitness for a particular purpose. Rankings,
            Trust Scores, and authenticity estimates are automated opinions based on publicly available data —
            they are <strong>not</strong> statements of fact about any business, clinic, or individual.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">5. Limitation of liability</h2>
          <p className="text-sm leading-relaxed">
            To the maximum extent permitted by applicable law, {ENTITY_NAME} is not liable for any direct, indirect,
            incidental, consequential, or special damages arising from use of the site or reliance on its content,
            including decisions made on the basis of rankings, Trust Scores, or review summaries.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">6. Listings &amp; corrections</h2>
          <p className="text-sm leading-relaxed">
            Businesses may request review, correction, reply to a score, or removal of information via{" "}
            <a href="/corrections" className="underline">{CONTACT_EMAIL} / Corrections page</a>. We aim to respond
            within a reasonable time and will review all requests in good faith.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">7. User conduct</h2>
          <p className="text-sm leading-relaxed">
            You may not scrape, republish, redistribute, or otherwise misuse site content without prior written
            permission. Automated access that disrupts site availability is prohibited.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">8. Indemnity</h2>
          <p className="text-sm leading-relaxed">
            You agree to indemnify and hold {ENTITY_NAME} harmless from any claims, damages, or expenses (including
            reasonable legal fees) arising from your misuse of the site or violation of these terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">9. Changes</h2>
          <p className="text-sm leading-relaxed">
            We may update these terms from time to time. Continued use of the site after changes are posted
            constitutes acceptance of the updated terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">10. Governing law &amp; disputes</h2>
          <p className="text-sm leading-relaxed">
            {JURISDICTION}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">11. Contact</h2>
          <p className="text-sm leading-relaxed">
            Questions about these terms: <a href="/contact" className="underline">{CONTACT_EMAIL}</a>
          </p>
        </section>

        <p className="text-xs text-[var(--muted)] pt-4 border-t border-[var(--border)]">
          This is a template pending legal review. ENTITY_NAME, CONTACT_EMAIL, and JURISDICTION placeholders
          must be confirmed by qualified counsel before relying on this document.
        </p>
      </div>
    </div>
  );
}
