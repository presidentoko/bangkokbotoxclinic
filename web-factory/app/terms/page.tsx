import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { getSiteConfig } from "@/lib/site";

const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || "inquiry@thaisupplyhub.com";

export const metadata: Metadata = {
  title: "Terms of Use & Advertising Policy",
  description:
    "Terms for using the Thai Supply Hub directory, plus our advertising policy: what sponsored placement buys, what it never buys, and how paid slots are labelled.",
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
};

const UPDATED = "21 August 2026";

export default function TermsPage() {
  const cfg = getSiteConfig();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span>Terms</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Terms of Use &amp; Advertising Policy</h1>
      <p className="text-sm text-[var(--muted)] mb-10">Last updated {UPDATED}</p>

      <div className="space-y-8 text-[15px] leading-relaxed">
        <Section title="What this site is">
          <p>
            {cfg.brand} is an independent directory of Thai manufacturers, industrial estates,
            logistics operators, and B2B suppliers. Every listing shows the supplier&apos;s public
            phone number and website, and contacting them directly is free and always will be — we
            do not mark up a supplier&apos;s quote or gate contact details.
          </p>
          <p className="mt-3">
            We also offer sourcing help to buyers who want it, and that side is paid: the factory
            pays us a success fee when an order we brokered closes. Both paths are described in{" "}
            <a className="underline font-medium" href="#sourcing">Sourcing introductions and success
            fees</a> below. If you are only using the directory, none of it applies to you.
          </p>
        </Section>

        <Section title="Accuracy, and what we do not guarantee">
          <p>
            Listing data is compiled from public sources — Google Maps Business Profiles and
            Thailand&apos;s DBD company register — and is refreshed on a rolling basis. We check what
            we can automatically (registration status, review history, whether photos still resolve),
            but we cannot guarantee that any listing is current, complete, or that a supplier is fit
            for your purpose.
          </p>
          <p className="mt-3">
            <b>Do your own due diligence before sending money.</b> A Trust Score is a summary of
            public signals, not an endorsement, credit check, or quality certification. See{" "}
            <a className="underline font-medium" href="/trust-score">how the Trust Score works</a>.
          </p>
        </Section>

        {/* 광고주가 계약 전에 반드시 읽는 부분. 사이트 전반(FAQ, 푸터, /trust-score)에
            흩어져 있던 광고 구분 원칙을 한 곳에 모아 문서화한다. */}
        <Section title="Advertising policy">
          <p className="mb-3">
            This directory is funded by clearly-labelled advertising. Our commitments:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <b>Paid placement is always labelled.</b> Sponsored slots carry a visible badge
              (Editor&apos;s Pick, Recommended, or Featured). If it is paid, it says so.
            </li>
            <li>
              <b>Organic rankings are never sold.</b> Trust Score ordering is computed from public
              data. Buying a slot adds a labelled position; it does not change any other
              supplier&apos;s score or rank.
            </li>
            <li>
              <b>We never delete or downrank a listing because of money.</b> Not for a competitor&apos;s
              payment, and not for refusing to pay.
            </li>
            <li>
              <b>No pay-for-review.</b> Reviews shown are Google reviews from public Business
              Profiles. We do not solicit, write, edit, or filter them for positivity.
            </li>
            <li>
              <b>A Verified badge is earned, not bought.</b> The fee covers the verification work
              (registration check, certificate review, and for the top tier an on-site audit). If
              the checks fail, we refund the fee rather than issue the badge.
            </li>
            <li>
              <b>Advertisers do not receive visitor data.</b> Buying a sponsored slot buys
              visibility, not our inquiry pipeline. Sourcing partners are the one exception, and
              only for inquiries you send us on purpose: if you submit a quote request, we pass your
              details to the factories we shortlist for you. See the{" "}
              <a className="underline font-medium" href="/privacy">Privacy Policy</a>.
            </li>
          </ul>
          <p className="mt-3">
            Current rates and tiers are on the{" "}
            <a className="underline font-medium" href="/for-suppliers">For Suppliers</a> page. Monthly
            placements can be cancelled at any time and run to the end of the paid period.
          </p>
        </Section>

        <Section title="Sourcing introductions and success fees" id="sourcing">
          <p>
            Two ways to use this directory, and the difference matters:
          </p>
          <ul className="mt-2 space-y-2 list-disc pl-5">
            <li>
              <b>Direct, free, no involvement from us.</b> Every listing publishes the factory&apos;s
              own phone number and website, taken from its public Google Business Profile. Call them
              yourself. We do not hide, paywall, or withhold contact details to force an
              introduction, and we never will.
            </li>
            <li>
              <b>Sourcing help, paid by the factory.</b> If you ask us to source — shortlisting
              factories, handling English and Thai correspondence, comparing quotes, coordinating
              samples and quality checks — the factory pays us a success fee when an order closes.
              Buyers pay us nothing.
            </li>
          </ul>
          <p className="mt-3">
            We would rather state the obvious than let you discover it: a success fee can be
            reflected in the price a factory quotes. That is true of every sourcing agent; the
            difference is that we tell you the arrangement exists and you can always bypass it with
            the published phone number.
          </p>
          <p className="mt-3">
            Factories that register as sourcing partners get quote requests routed to them first and
            carry a labelled partner badge. That routing is a commercial arrangement and is marked
            as one wherever it appears. It does not change any other supplier&apos;s Trust Score,
            position, or listing, and non-partners are never removed or downranked for not paying.
          </p>
        </Section>

        <Section title="Using the site">
          <p>
            You may browse, search, and use listing information to contact suppliers for genuine
            business purposes. You may not scrape or bulk-copy the directory to build a competing
            dataset, resell the data, or use the contact details for unsolicited mass marketing.
            Automated access that degrades the service may be blocked.
          </p>
        </Section>

        <Section title="Your submissions">
          <p>
            When you send an inquiry you confirm the details are accurate and that you are contacting
            suppliers in good faith. Do not submit other people&apos;s personal data without their
            knowledge.
          </p>
        </Section>

        <Section title="Liability">
          <p>
            The site is provided &quot;as is&quot;. To the maximum extent permitted by Thai law, we are
            not liable for losses arising from dealings between you and a supplier you found here,
            including quality disputes, delivery failures, or payment loss. Our aggregate liability
            for any claim relating to the site is limited to the amount you paid us, if any, in the
            preceding twelve months.
          </p>
        </Section>

        <Section title="Corrections and removals">
          <p>
            If you are a listed company and something is wrong — or you want the listing removed —
            email{" "}
            <a className="underline font-medium" href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Listing correction / removal")}`}>{CONTACT_EMAIL}</a>{" "}
            with your company name and DBD registration number. We action verified requests without
            charge; being listed has never required payment and removal never requires it either.
          </p>
        </Section>

        <Section title="Governing law">
          <p>These terms are governed by the laws of Thailand.</p>
        </Section>
      </div>

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Terms", url: "/terms" },
      ]} />
    </div>
  );
}

function Section({ title, children, id }: { title: string; children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className={id ? "scroll-mt-20" : undefined}>
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <div className="text-[var(--muted)] space-y-2">{children}</div>
    </section>
  );
}
