import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms of Service for ${SITE.name}.`,
  alternates: { canonical: `${SITE.origin}/terms/` },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <nav className="text-xs muted mb-6">
        <Link href="/" className="hover:text-[rgb(var(--fg))]">Home</Link>
        <span className="mx-2">›</span>
        <span>Terms</span>
      </nav>
      <h1 className="font-display text-4xl font-bold tracking-tighter-display">Terms of Service</h1>
      <p className="mt-3 text-sm muted">Last updated: 2026-05-25 · Plain-language summary.</p>

      <div className="mt-10 space-y-8 text-[15px] leading-relaxed">
        <section>
          <h2 className="font-display text-xl font-bold">What this site is</h2>
          <p className="mt-2 muted">
            {SITE.name} is an independent directory of hair-transplant clinics in Thailand. We aggregate public data (Google, Bookimed, Reddit, Naver, YouTube, Pantip) into a single Trust Score per clinic.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold">We are NOT</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1 muted">
            <li>A medical provider. We don't perform any treatments.</li>
            <li>A licensed broker. We connect patients to clinics for free consultations; financial terms are between you and the clinic.</li>
            <li>The author of any content scraped from external sources. We link back to originals.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold">Trust Score disclaimer</h2>
          <p className="mt-2 muted">
            Our Trust Score is a transparent formula based on public data signals. It is a guide, not a guarantee.
            Verified Partner clinics pay for placement priority but cannot influence their Trust Score or hide reviews.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold">Medical disclaimer</h2>
          <p className="mt-2 muted">
            Information on this site is for general guidance only. Always consult a qualified doctor before any procedure.
            Patient outcomes vary; before-after photos are not guaranteed results.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold">Affiliate disclosure</h2>
          <p className="mt-2 muted">
            We may earn a commission when you book through Bookimed via links labeled <code className="font-mono text-[13px]">↗ Bookimed</code>.
            This does not affect price or the clinic's Trust Score.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold">User responsibilities</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1 muted">
            <li>Provide truthful information when contacting clinics.</li>
            <li>Don't abuse the site (spam, scraping, bot traffic).</li>
            <li>Respect intellectual property — clinic photos belong to their respective owners.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold">Limitation of liability</h2>
          <p className="mt-2 muted">
            We provide this directory "as is". We are not liable for any outcomes from a procedure performed at a clinic listed here.
            Your relationship is with the clinic, not us.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold">Changes</h2>
          <p className="mt-2 muted">
            We may update these terms. Material changes will be noted at the top of this page.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold">Contact</h2>
          <p className="mt-2 muted">
            Questions: <a href="mailto:hello@thaifacialclinic.com" className="font-bold underline">hello@thaifacialclinic.com</a>
          </p>
        </section>
      </div>
    </div>
  );
}
