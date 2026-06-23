import type { Metadata } from "next";
import { getSiteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How we collect, use, and protect your data. Your rights under PDPA and applicable law.",
  alternates: { canonical: "/privacy" },
};

export const dynamic = "force-static";

const BUILD_DATE = "2026-06-23";
const ENTITY_NAME = "[ENTITY_NAME]";
const CONTACT_EMAIL = "[CONTACT_EMAIL]";

export default function PrivacyPage() {
  const cfg = getSiteConfig();
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span>Privacy</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3">Privacy Policy</h1>
      <p className="text-sm text-[var(--muted)] mb-8">Last updated: {BUILD_DATE}</p>

      <div className="prose prose-sm max-w-none space-y-6 text-[var(--fg)]">
        <section>
          <h2 className="text-xl font-bold mb-2">1. Who we are</h2>
          <p className="text-sm leading-relaxed">
            {ENTITY_NAME}, operating {cfg.brand}. Contact: {CONTACT_EMAIL}.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">2. Data we process</h2>
          <ul className="list-disc pl-5 text-sm space-y-2 mt-2">
            <li>
              <strong>(a) Publicly available business information and public reviews</strong> — aggregated from
              public sources (Google Maps). This may include reviewer display names as they appear publicly.
            </li>
            <li>
              <strong>(b) Visitor data</strong> — analytics (aggregate page-view counts via Vercel Analytics),
              device and usage data, and minimal first-party cookies for site preferences.
            </li>
            <li>
              <strong>(c) Data you submit</strong> — name, email, phone number, and message content when you use
              booking or contact forms. Also correction requests and correspondence.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">3. Purpose &amp; lawful basis</h2>
          <p className="text-sm leading-relaxed">
            We operate an information directory in the legitimate interest of public access to information.
            We process contact form data to forward enquiries to clinics as you request. We seek consent for
            any non-essential cookies or marketing communications.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">4. Cookies</h2>
          <p className="text-sm leading-relaxed">
            We use minimal first-party cookies for session authentication (admin only) and site preferences.
            Vercel Analytics is used for aggregate traffic measurement only — it does not identify individual
            visitors or track behaviour across sites. We do not run cross-site advertising trackers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">5. Sharing</h2>
          <p className="text-sm leading-relaxed">
            We do <strong>not</strong> sell or rent personal data. When you submit a booking enquiry, your
            contact details are forwarded to the clinic you selected and to our admin for follow-up.
            Infrastructure service providers (Vercel for hosting, Upstash for session storage) process data
            on our behalf under data processing agreements.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">6. Retention</h2>
          <p className="text-sm leading-relaxed">
            Form submission data is retained for up to 18 months for follow-up and dispute resolution, then
            deleted. Aggregate analytics data is retained indefinitely as it contains no personal data.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">7. Your rights (PDPA)</h2>
          <p className="text-sm leading-relaxed mb-2">
            Under applicable law (including Thailand&apos;s PDPA where relevant), you have the right to:
          </p>
          <ul className="list-disc pl-5 text-sm space-y-1">
            <li>Access the personal data we hold about you.</li>
            <li>Rectification of inaccurate data.</li>
            <li>Erasure (&quot;right to be forgotten&quot;).</li>
            <li>Object to processing based on legitimate interest.</li>
            <li>Withdraw consent at any time.</li>
            <li>Lodge a complaint with the relevant supervisory authority.</li>
          </ul>
          <p className="text-sm leading-relaxed mt-2">
            To exercise these rights, email <strong>{CONTACT_EMAIL}</strong> with your name and the email
            address you used. We respond within 7 business days.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">8. Reviewer &amp; business data requests</h2>
          <p className="text-sm leading-relaxed">
            If you appear in aggregated content on this site (as a reviewer display name or as a listed business)
            and wish to request correction or removal, contact {CONTACT_EMAIL} or use our{" "}
            <a href="/corrections" className="underline">Corrections page</a>. We will review promptly.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">9. Security</h2>
          <p className="text-sm leading-relaxed">
            All data is transmitted over HTTPS. Access to stored form submissions is restricted to authenticated
            admin staff. We do not store payment card details.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">10. Updates</h2>
          <p className="text-sm leading-relaxed">
            We may update this policy when we add new features or as legal requirements change. The &quot;Last
            updated&quot; date above tracks the most recent revision. Continued use after a change constitutes
            acceptance of the updated policy.
          </p>
        </section>

        <p className="text-xs text-[var(--muted)] pt-4 border-t border-[var(--border)]">
          ENTITY_NAME and CONTACT_EMAIL placeholders must be confirmed by qualified counsel before
          relying on this document.
        </p>
      </div>
    </div>
  );
}
