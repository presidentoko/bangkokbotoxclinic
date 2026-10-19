import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { getSiteConfig } from "@/lib/site";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "What Thailand Golf Guide collects, what it does not, how advertising and analytics work, and how to ask for your data to be corrected or deleted.",
  alternates: { canonical: "/privacy" },
};

const CONTACT = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "umma@xx.gg";

// This page describes what the site actually does, and only that. It was
// written from an audit of the code (2026-10-20): the layout loads Vercel
// Analytics and the AdSense loader, there is no cookie banner, no account
// system, no localStorage, and the only form is /contact, which forwards the
// message to the operator. If any of that changes, this page has to change
// with it — a privacy policy that promises things the site does not do, or
// omits things it does, is worse than none.
export default function PrivacyPage() {
  const cfg = getSiteConfig();
  return (
    <main className="max-w-2xl mx-auto px-4 py-12 text-sm leading-relaxed text-zinc-700">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Privacy Policy", url: "/privacy" },
        ]}
      />

      <h1 className="text-2xl font-bold text-zinc-900 mb-1">Privacy Policy</h1>
      <p className="text-xs text-zinc-400 mb-8">Last updated: October 2026 · Applies to {cfg.domain.replace(/^https?:\/\//, "")}</p>

      <section className="mb-7">
        <h2 className="font-bold text-zinc-900 mb-2">1. Who we are</h2>
        <p>
          {cfg.brand} is an independent golf-course directory for Thailand, run by a private individual. It is not
          affiliated with any club. Contact: <a href={`mailto:${CONTACT}`} className="underline">{CONTACT}</a> or the{" "}
          <a href="/contact" className="underline">contact page</a>.
        </p>
      </section>

      <section className="mb-7">
        <h2 className="font-bold text-zinc-900 mb-2">2. What we collect</h2>
        <div className="space-y-3">
          <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3">
            <div className="font-bold text-xs uppercase tracking-wide mb-1">Site analytics (Vercel Analytics)</div>
            <p>
              Page views, referring page, device and browser type, and country. It is cookie-less and does not
              identify you or follow you across other sites.
            </p>
          </div>
          <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3">
            <div className="font-bold text-xs uppercase tracking-wide mb-1">Contact form</div>
            <p>
              If you write to us through the contact form, we receive the name (optional), email address and message
              you typed. We use them only to reply, and the message is forwarded to the site operator through a private
              messaging service (it is not stored on this site). We do not add you to any mailing list and do not share the message with advertisers.
            </p>
          </div>
          <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3">
            <div className="font-bold text-xs uppercase tracking-wide mb-1">Embedded Google Maps</div>
            <p>
              Course pages embed a Google Maps view. Loading it connects your browser to Google, which may set its own
              cookies under Google&apos;s{" "}
              <a href="https://policies.google.com/privacy" className="underline" rel="noopener noreferrer" target="_blank">privacy policy</a>.
              We receive nothing from that connection.
            </p>
          </div>
          <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3">
            <div className="font-bold text-xs uppercase tracking-wide mb-1">Server logs</div>
            <p>
              Our hosting provider (Vercel) and CDN (Cloudflare) record standard request data such as IP address and
              user-agent for security and operation. We do not use these logs to build profiles of visitors.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-7">
        <h2 className="font-bold text-zinc-900 mb-2">3. What we do not do</h2>
        <ul className="list-disc list-inside space-y-1 text-zinc-600">
          <li>No user accounts, passwords or payment details — we never take payment on this site</li>
          <li>No cookies or browser storage set by this site itself (Google, via ads and the embedded map, may set its own — sections 2 and 4)</li>
          <li>No social-network tracking pixels</li>
          <li>No sale of personal data</li>
        </ul>
      </section>

      <section className="mb-7">
        <h2 className="font-bold text-zinc-900 mb-2">4. Advertising</h2>
        <p className="mb-2">
          The site is funded by advertising and affiliate links. The page includes Google AdSense&apos;s loader script.
          When Google serves ads on a page, Google and its advertising partners may use cookies and similar technologies
          to show ads based on your visits to this and other websites.
        </p>
        <ul className="list-disc list-inside space-y-1 text-zinc-600 mb-3">
          <li>
            Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to this
            and other websites.
          </li>
          <li>
            You can opt out of personalised advertising at{" "}
            <a href="https://www.google.com/settings/ads" className="underline" rel="noopener noreferrer" target="_blank">Google Ads Settings</a>{" "}
            or at{" "}
            <a href="https://www.aboutads.info/choices/" className="underline" rel="noopener noreferrer" target="_blank">aboutads.info/choices</a>.
          </li>
          <li>
            How Google uses data from sites that use its services is described at{" "}
            <a href="https://policies.google.com/technologies/partner-sites" className="underline" rel="noopener noreferrer" target="_blank">policies.google.com/technologies/partner-sites</a>.
          </li>
        </ul>
        <p>Advertising and sponsorship never change a course&apos;s ranking or rating; see the <a href="/methodology" className="underline">methodology</a>.</p>
      </section>

      <section className="mb-7">
        <h2 className="font-bold text-zinc-900 mb-2">5. Affiliate links and third-party sites</h2>
        <p>
          Some links to booking partners are affiliate links: if you book through one we may earn a commission at no extra
          cost to you. Those sites have their own privacy policies and we do not control what they collect.
        </p>
      </section>

      <section className="mb-7">
        <h2 className="font-bold text-zinc-900 mb-2">6. Where course information comes from</h2>
        <p>
          Course names, locations, ratings, review counts and opening details come from public Google Maps listings.
          We do not collect personal data about course owners or reviewers beyond what Google publishes. If you represent a
          course and want something corrected or removed, use the <a href="/contact" className="underline">contact page</a>.
        </p>
      </section>

      <section className="mb-7">
        <h2 className="font-bold text-zinc-900 mb-2">7. Your rights</h2>
        <p className="mb-2">
          Under Thailand&apos;s Personal Data Protection Act B.E. 2562 (PDPA), and similar laws elsewhere, you can ask us to
          show you, correct or delete personal data we hold about you. In practice that is limited to anything you sent
          through the contact form. Email{" "}
          <a href={`mailto:${CONTACT}?subject=Privacy%20request`} className="underline">{CONTACT}</a> with the subject
          &ldquo;Privacy request&rdquo; and we will answer within 30 days.
        </p>
      </section>

      <section className="mb-7">
        <h2 className="font-bold text-zinc-900 mb-2">8. Retention</h2>
        <p>
          This site does not store contact-form messages in a database or file. They are forwarded to the operator&apos;s
          private messaging account, where they remain until deleted, and we delete them on request. Analytics data is
          aggregated and retained according to Vercel&apos;s defaults.
        </p>
      </section>

      <section className="mb-7">
        <h2 className="font-bold text-zinc-900 mb-2">9. Changes</h2>
        <p>
          We will update this page when what the site does changes, and the &ldquo;Last updated&rdquo; date above will
          move with it.
        </p>
      </section>

      <div className="mt-10 pt-6 border-t border-zinc-200 text-xs text-zinc-400">
        <a href="/about" className="underline mr-4">About</a>
        <a href="/methodology" className="underline mr-4">Methodology</a>
        <a href="/contact" className="underline">Contact</a>
      </div>
    </main>
  );
}
