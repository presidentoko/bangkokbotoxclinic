import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { getSiteConfig } from "@/lib/site";

const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || "inquiry@thaisupplyhub.com";

// 이 페이지가 없어서 생기던 문제:
//  - 이메일을 받는 폼이 3종(RFQ, 알림 신청, 리드마그넷)인데 처리방침이 없었다 → 태국 PDPA 공백
//  - 광고 네트워크(AdSense 등) 승인 필수 요건 미충족
//  - 광고주가 계약 전 반드시 확인하는 페이지가 404
export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "What Thai Supply Hub collects, why, how long we keep it, and how to have it deleted. Covers inquiry forms, browser storage, and the public business data in the directory.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

const UPDATED = "21 August 2026";

export default function PrivacyPage() {
  const cfg = getSiteConfig();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span>Privacy</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Privacy Policy</h1>
      <p className="text-sm text-[var(--muted)] mb-10">Last updated {UPDATED}</p>

      <div className="space-y-8 text-[15px] leading-relaxed">
        <Section title="Who we are">
          <p>
            {cfg.brand} (thaisupplyhub.com) is an independent B2B supplier directory for Thailand.
            We are the data controller for the personal data described below. You can reach us at{" "}
            <a className="underline font-medium" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </p>
        </Section>

        <Section title="What we collect">
          <h3 className="font-bold mt-4 mb-1">1. Information you send us</h3>
          <p>
            When you submit an inquiry, RFQ, alert signup, or supplier application, we receive the
            fields on that form — typically your name, company, email, phone, country, product
            category, volume estimate, and your message. We only collect what you type.
          </p>

          <h3 className="font-bold mt-4 mb-1">2. Information stored in your browser</h3>
          <p>
            Favorites, your bulk-quote shortlist, and recently-viewed suppliers are kept in your
            browser&apos;s <code className="text-[13px] bg-stone-100 px-1 rounded">localStorage</code>{" "}
            (keys <code className="text-[13px] bg-stone-100 px-1 rounded">tsh_favorites</code>,{" "}
            <code className="text-[13px] bg-stone-100 px-1 rounded">tsh_shortlist</code>,{" "}
            <code className="text-[13px] bg-stone-100 px-1 rounded">tsh_recent</code>). This never
            leaves your device and we cannot read it. Clearing your browser data deletes it.
          </p>

          <h3 className="font-bold mt-4 mb-1">3. Aggregate traffic measurement</h3>
          <p>
            We use privacy-preserving analytics that count page views without cookies and without
            building a profile of you. We do not sell or share visitor data.
          </p>

          <h3 className="font-bold mt-4 mb-1">4. Business listing data</h3>
          <p>
            Supplier listings are compiled from publicly available sources — Google Maps Business
            Profiles and Thailand&apos;s Department of Business Development (DBD) company register.
            This is business information (company name, registered address, phone, website,
            registration number, capital), not the personal data of private individuals.
          </p>
        </Section>

        <Section title="Why we use it, and on what basis">
          <ul className="list-disc pl-5 space-y-1.5">
            <li><b>To answer your inquiry</b> — the only reason we ask for contact details. Basis: your request / our legitimate interest in replying to you.</li>
            <li><b>To send alerts you signed up for</b> — only to the address you gave us, only for the category you chose. Basis: your consent.</li>
            <li><b>To operate and improve the directory</b> — aggregate, non-identifying usage counts. Basis: legitimate interest.</li>
          </ul>
          <p className="mt-3">
            We do not use your details for unrelated marketing, and we do not sell your personal data
            to anyone — including advertisers.
          </p>
        </Section>

        <Section title="Who else sees it">
          <p>
            Inquiry submissions are delivered to our team through Telegram&apos;s messaging API and
            may be handled with email infrastructure (Resend). The site is served by Cloudflare
            Pages, which processes request metadata such as IP address for security and delivery.
            These providers act on our behalf. Nobody else receives your inquiry.
          </p>
          <p className="mt-3">
            <b>Sponsored listings do not receive your data.</b> Advertisers on this site buy
            placement, not leads. If we ever deliver a lead to a supplier, it is because you sent an
            inquiry to that specific supplier.
          </p>
        </Section>

        <Section title="How long we keep it">
          <p>
            Inquiry messages are kept for up to 24 months so we can follow up and maintain a record
            of the conversation. Alert signups are kept until you unsubscribe or ask us to remove
            you. Browser storage lives on your device until you clear it.
          </p>
        </Section>

        <Section title="Your rights">
          <p>
            Under Thailand&apos;s Personal Data Protection Act (PDPA) and, where applicable, the
            GDPR, you may request access to, correction of, or deletion of your personal data, and
            you may withdraw consent at any time. Email{" "}
            <a className="underline font-medium" href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Privacy request")}`}>{CONTACT_EMAIL}</a>{" "}
            and we will respond within 30 days.
          </p>
          <p className="mt-3">
            <b>If you are a listed supplier</b> and want your listing corrected or removed, email us
            with your company name and DBD registration number — see also our{" "}
            <a className="underline font-medium" href="/about">About page</a> for how listings are compiled.
          </p>
        </Section>

        <Section title="Children">
          <p>This is a business-to-business service and is not directed at anyone under 18.</p>
        </Section>

        <Section title="Changes">
          <p>
            If this policy changes materially we will update the date at the top of this page.
            Continued use of the site after a change means you accept the updated policy.
          </p>
        </Section>
      </div>

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Privacy", url: "/privacy" },
      ]} />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <div className="text-[var(--muted)] space-y-2">{children}</div>
    </section>
  );
}
