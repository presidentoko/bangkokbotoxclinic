import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Privacy Policy — Thaigle",
  description: "How Thaigle collects, uses, and protects your data. PDPA compliant.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12 text-sm leading-relaxed text-zinc-700">
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Privacy Policy", url: "/privacy" },
      ]} />

      <h1 className="text-2xl font-bold text-zinc-900 mb-1">Privacy Policy</h1>
      <p className="text-xs text-zinc-400 mb-8">Last updated: August 2026 · Complies with Thailand PDPA (B.E. 2562)</p>

      <section className="mb-7">
        <h2 className="font-bold text-zinc-900 mb-2">1. Who we are</h2>
        <p>
          Thaigle (<strong>thaigle.com</strong>) is an independent Bangkok activity and restaurant directory operated by a private individual. Contact: <a href="mailto:chillanel22@gmail.com" className="underline">chillanel22@gmail.com</a>
        </p>
      </section>

      <section className="mb-7">
        <h2 className="font-bold text-zinc-900 mb-2">2. Data we collect</h2>
        <div className="space-y-3">
          <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3">
            <div className="font-bold text-xs uppercase tracking-wide mb-1">Analytics (Vercel Analytics)</div>
            <p>Page views, referrer, device type, country. No personal identifiers. No cross-site tracking. Data retained 90 days.</p>
          </div>
          <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3">
            <div className="font-bold text-xs uppercase tracking-wide mb-1">Trip Planner (localStorage only)</div>
            <p>Your saved venues and day-plan data are stored <strong>locally in your browser only</strong>. We do not transmit or store this data on our servers.</p>
          </div>
          <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3">
            <div className="font-bold text-xs uppercase tracking-wide mb-1">Contact / Takedown forms</div>
            <p>Name and email address when you submit a correction or takedown request. Used only to respond to your request. Not shared with third parties.</p>
          </div>
          <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3">
            <div className="font-bold text-xs uppercase tracking-wide mb-1">Affiliate click tracking</div>
            <p>When you click a booking link (Klook, GetYourGuide, Viator), we track the click event for commission attribution. No personal data beyond anonymised session context is captured.</p>
          </div>
        </div>
      </section>

      <section className="mb-7">
        <h2 className="font-bold text-zinc-900 mb-2">3. Data we do NOT collect</h2>
        <ul className="list-disc list-inside space-y-1 text-zinc-600">
          <li>No account registration or passwords</li>
          <li>No payment information</li>
          <li>No Facebook Pixel or social-network tracking</li>
          <li>No data brokers, and no sale of personal data</li>
        </ul>
      </section>

      <section className="mb-7">
        <h2 className="font-bold text-zinc-900 mb-2">4. Cookies</h2>
        <p className="mb-2">We use one first-party cookie/localStorage key (<code>thaigle_cookie_consent</code>) to remember your cookie preference. Vercel Analytics and Google Analytics may set cookies for page-view measurement.</p>
        <p className="mb-2">You may decline analytics and advertising cookies via the cookie banner, and change your mind at any time by clearing this site&apos;s data in your browser. Declining does not affect site functionality.</p>
        <p>If you are in the EEA, the UK or Switzerland, advertising and analytics cookies are set to <em>denied</em> until you accept.</p>
      </section>

      <section className="mb-7">
        <h2 className="font-bold text-zinc-900 mb-2">5. Advertising</h2>
        <p className="mb-2">This site is supported by advertising. We use Google AdSense to serve ads.</p>
        <ul className="list-disc list-inside space-y-1 text-zinc-600 mb-3">
          <li>Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this and other websites.</li>
          <li>Google&apos;s use of advertising cookies enables it and its partners to serve ads to you based on your visit to this site and/or other sites on the Internet.</li>
          <li>You may opt out of personalised advertising by visiting <a href="https://www.google.com/settings/ads" className="underline" rel="noopener noreferrer" target="_blank">Google Ads Settings</a>.</li>
          <li>You may opt out of third-party vendors&apos; use of cookies for personalised advertising at <a href="https://www.aboutads.info/choices/" className="underline" rel="noopener noreferrer" target="_blank">aboutads.info/choices</a>.</li>
          <li>Google&apos;s advertising practices are described in its <a href="https://policies.google.com/technologies/ads" className="underline" rel="noopener noreferrer" target="_blank">Advertising Policies</a>.</li>
        </ul>
        <p>Advertising is never a ranking factor. Ads are visually separated from editorial content and labelled &ldquo;Advertisement&rdquo;.</p>
      </section>

      <section className="mb-7">
        <h2 className="font-bold text-zinc-900 mb-2">6. Affiliate links &amp; third-party services</h2>
        <p className="mb-2">Booking links (Klook, GetYourGuide, Viator) open third-party sites with their own privacy policies. We earn a commission if you complete a booking — this does not affect venue rankings.</p>
        <p>Affiliate links carry <code>rel="sponsored nofollow"</code> and are clearly labelled. Rankings are never paid.</p>
      </section>

      <section className="mb-7">
        <h2 className="font-bold text-zinc-900 mb-2">7. Data source & venue information</h2>
        <p>Venue names, addresses, ratings, and reviews are sourced from public Google Maps listings. We do not collect personal data about venue owners or reviewers beyond what is publicly available.</p>
      </section>

      <section className="mb-7">
        <h2 className="font-bold text-zinc-900 mb-2">8. Your rights (PDPA)</h2>
        <p className="mb-3">Under Thailand&apos;s Personal Data Protection Act B.E. 2562, you have the right to:</p>
        <ul className="list-disc list-inside space-y-1 text-zinc-600 mb-3">
          <li>Access personal data we hold about you</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your personal data</li>
          <li>Withdraw consent for analytics at any time (via cookie banner)</li>
        </ul>
        <p>To exercise any right, email <a href="mailto:chillanel22@gmail.com" className="underline">chillanel22@gmail.com</a> with subject line <strong>"PDPA Request"</strong>. We will respond within 30 days.</p>
      </section>

      <section className="mb-7">
        <h2 className="font-bold text-zinc-900 mb-2">9. Data retention</h2>
        <ul className="list-disc list-inside space-y-1 text-zinc-600">
          <li>Analytics data: 90 days (Vercel Analytics default)</li>
          <li>Contact/takedown form submissions: 12 months, then deleted</li>
          <li>Planner data: localStorage only, deleted when you clear browser data</li>
        </ul>
      </section>

      <section className="mb-7">
        <h2 className="font-bold text-zinc-900 mb-2">10. Data deletion request</h2>
        <p className="mb-3">To request deletion of any personal data we hold:</p>
        <a
          href="mailto:chillanel22@gmail.com?subject=PDPA%20Data%20Deletion%20Request&body=Please%20delete%20all%20personal%20data%20associated%20with%20this%20email%20address."
          className="inline-block bg-black text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-gray-800 transition"
        >
          Request data deletion →
        </a>
      </section>

      <section className="mb-7">
        <h2 className="font-bold text-zinc-900 mb-2">11. Changes to this policy</h2>
        <p>We may update this policy. The &quot;Last updated&quot; date at the top reflects the most recent revision. Continued use of the site constitutes acceptance.</p>
      </section>

      <div className="mt-10 pt-6 border-t border-zinc-200 text-xs text-zinc-400">
        <a href="/terms" className="underline mr-4">Terms of Use</a>
        <a href="/takedown" className="underline mr-4">Correction / Takedown</a>
        <a href="/contact" className="underline">Contact</a>
      </div>
    </main>
  );
}
