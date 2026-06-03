import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy practices for ${SITE.name}.`,
  alternates: { canonical: `${SITE.origin}/privacy/` },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <nav className="text-xs muted mb-6">
        <Link href="/" className="hover:text-[rgb(var(--fg))]">Home</Link>
        <span className="mx-2">›</span>
        <span>Privacy</span>
      </nav>
      <h1 className="font-display text-4xl font-bold tracking-tighter-display">Privacy Policy</h1>
      <p className="mt-3 text-sm muted">Last updated: 2026-05-25 · This is a plain-language summary, not legal advice.</p>

      <div className="mt-10 space-y-8 text-[15px] leading-relaxed">
        <section>
          <h2 className="font-display text-xl font-bold">What we collect</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1 muted">
            <li>Information you submit on our booking forms: name, email, phone, preferred procedure, optional message.</li>
            <li>Anonymous traffic data: page views, country, device type, referrer.</li>
            <li>Browser preferences: dark mode, language, compare-list selections (stored locally in your browser only).</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold">How we use it</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1 muted">
            <li><strong className="text-[rgb(var(--fg))]">Booking forms</strong> — forwarded directly to the clinic you selected, plus our coordinator inbox for follow-up.</li>
            <li><strong className="text-[rgb(var(--fg))]">Traffic data</strong> — aggregate analytics only. We do not track individuals across sites.</li>
            <li>We <strong>never sell</strong> your contact information.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold">Third-party services we use</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1 muted">
            <li><strong>Vercel</strong> — hosting (USA / Singapore edge).</li>
            <li><strong>Upstash Redis</strong> — encrypted database for booking forms (Singapore region).</li>
            <li><strong>Anthropic Claude</strong> — AI used by clinic admins to draft review replies. Does NOT process patient data.</li>
            <li><strong>Google Maps / YouTube</strong> — embedded for clinic info. Subject to their own privacy policies.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold">Your rights</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1 muted">
            <li>Request a copy of any data we hold about you.</li>
            <li>Request deletion of your data.</li>
            <li>Opt out of any future contact.</li>
          </ul>
          <p className="mt-3 muted">
            Email <a href="mailto:hello@thaifacialclinic.com" className="font-bold underline">hello@thaifacialclinic.com</a> with subject "Privacy request" — we respond within 7 days.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold">Cookies</h2>
          <p className="mt-2 muted">
            We use minimal first-party cookies for authentication (clinic admins) and your language/theme preferences.
            No third-party advertising cookies on the public site.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold">Contact</h2>
          <p className="mt-2 muted">
            Operated by the Thai Facial Clinic group. Questions: <a href="mailto:hello@thaifacialclinic.com" className="font-bold underline">hello@thaifacialclinic.com</a>
          </p>
        </section>
      </div>
    </div>
  );
}
