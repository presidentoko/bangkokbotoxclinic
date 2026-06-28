import type { Metadata } from "next";
import Link from "next/link";
import { LOCALES } from "@/lib/i18n";

export const revalidate = 2592000;

const BASE = "https://www.bangkoktopclinic.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  void locale;
  return {
    title: "Privacy Policy — BangkokCheckup",
    description: "BangkokCheckup privacy policy. How we handle your data when you use our health check-up comparison tool.",
    alternates: {
      canonical: `${BASE}/en/privacy`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `${BASE}/${l}/privacy`])),
    },
    robots: { index: false, follow: true },
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const lastUpdated = "2026-06-01";

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <nav className="text-sm text-slate-400 mb-6 flex items-center gap-2">
        <Link href={`/${locale}`} className="hover:text-blue-600">Home</Link>
        <span>›</span>
        <span className="text-slate-600">Privacy Policy</span>
      </nav>

      <h1 className="text-2xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
      <p className="text-slate-400 text-sm mb-8">Last updated: {lastUpdated}</p>

      <div className="prose prose-slate max-w-none space-y-6 text-slate-700 leading-relaxed text-sm">
        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2">What information we collect</h2>
          <p>
            BangkokCheckup collects minimal personal information. When you use our enquiry form, we collect your name, email address, and the message you send. This information is used solely to respond to your enquiry.
          </p>
          <p className="mt-2">
            We do not require account registration to use the price comparison tool. Saved packages are stored locally in your browser (localStorage) and are not transmitted to our servers.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2">Click tracking</h2>
          <p>
            When you click &quot;Book / Enquire&quot; on a package, we log the click anonymously (package ID, destination URL, hashed IP address, and timestamp). This helps us understand which packages users find useful. No personal identification is stored.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2">Analytics</h2>
          <p>
            We use server-side analytics only. We do not use Google Analytics, Facebook Pixel, or any third-party JavaScript trackers. No cookies are set for tracking purposes.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2">Third-party links</h2>
          <p>
            Our site links to hospital websites. We have no control over those websites&apos; privacy practices. When you leave our site via a &quot;Book&quot; link, you are subject to the hospital&apos;s own privacy policy.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2">Data retention</h2>
          <p>
            Enquiry form submissions are retained for 90 days. Click tracking data is retained for 12 months in aggregate form. No personal data is sold to third parties.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2">Contact</h2>
          <p>
            For privacy-related questions, use the{" "}
            <Link href={`/${locale}/enquiry`} className="text-blue-600 hover:underline">enquiry form</Link> with subject &quot;Privacy&quot;.
          </p>
        </section>
      </div>
    </div>
  );
}
