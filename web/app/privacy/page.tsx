import type { Metadata } from "next";
import { getSiteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How we handle data submitted through booking and contact forms. What we collect, why, who receives it, and how to request deletion.",
  alternates: { canonical: "/privacy" },
};

export const dynamic = "force-static";

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
      <p className="text-sm text-[var(--muted)] mb-8">Last updated: 2026-05-21</p>

      <div className="prose prose-sm max-w-none space-y-6 text-[var(--fg)]">
        <section>
          <h2 className="text-xl font-bold mb-2">What we collect from forms</h2>
          <p className="text-sm leading-relaxed">
            When you submit a booking or contact form on {cfg.brand}, we collect:
          </p>
          <ul className="list-disc pl-5 text-sm space-y-1 mt-2">
            <li><strong>Name</strong> and <strong>email address</strong> — required, so the clinic can confirm and follow up.</li>
            <li><strong>Phone / LINE / WhatsApp</strong> — optional, for faster scheduling.</li>
            <li><strong>Service, preferred date, time slot, notes</strong> — to help the clinic prepare.</li>
            <li><strong>Clinic ID</strong> (when submitted from a clinic page) — so we know which clinic to forward to.</li>
          </ul>
          <p className="text-sm leading-relaxed mt-2">
            We do <strong>not</strong> collect government IDs, payment cards, or medical history through these forms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">Who receives it</h2>
          <p className="text-sm leading-relaxed">
            Your submission is forwarded to two places:
          </p>
          <ul className="list-disc pl-5 text-sm space-y-1 mt-2">
            <li>
              <strong>The clinic you selected</strong> (if you submitted from a clinic page) — so a staff member can
              confirm time, brand availability, and pricing.
            </li>
            <li>
              <strong>Our internal admin</strong> — so we can follow up if the clinic doesn&apos;t respond within
              24 hours and improve our recommendations.
            </li>
          </ul>
          <p className="text-sm leading-relaxed mt-2">
            We do <strong>not</strong> sell or rent your data to third parties. We do not run ad-network retargeting
            on the data you submit through forms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">How long we keep it</h2>
          <p className="text-sm leading-relaxed">
            Form submissions are retained for up to <strong>18 months</strong> for follow-up, analytics, and dispute
            resolution. After that they are deleted automatically. You can request earlier deletion at any time (see
            below).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">Cookies & analytics</h2>
          <p className="text-sm leading-relaxed">
            We use minimal first-party cookies for site preferences and an authenticated admin session. We use Vercel
            Analytics for aggregate page-view counts — these do not identify individual visitors. We do not run
            cross-site behavioural advertising trackers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">Your rights</h2>
          <p className="text-sm leading-relaxed">
            You can ask us to:
          </p>
          <ul className="list-disc pl-5 text-sm space-y-1 mt-2">
            <li>See what data we have about you.</li>
            <li>Correct anything inaccurate.</li>
            <li>Delete your submission(s) entirely.</li>
            <li>Stop forwarding to clinics on future submissions.</li>
          </ul>
          <p className="text-sm leading-relaxed mt-2">
            Email <a href="/contact" className="underline">us through the contact page</a> with your name and the
            email you used. We respond within 7 days.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">Security</h2>
          <p className="text-sm leading-relaxed">
            Submissions are transmitted over HTTPS, stored in encrypted form, and only accessible to authenticated
            admin staff. We hash any session tokens. We do not store payment card details — payment happens directly
            between you and the clinic.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">Changes to this policy</h2>
          <p className="text-sm leading-relaxed">
            We may update this policy when we add new features. Material changes will be flagged on the booking
            form. The &quot;Last updated&quot; date above tracks the most recent revision.
          </p>
        </section>
      </div>
    </div>
  );
}
