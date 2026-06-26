import type { Metadata } from "next";
import Link from "next/link";
import { type Locale, t } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Book a Health Check-Up in Bangkok — Enquiry",
  description: "Get personalised help booking a health check-up at a Bangkok hospital. We connect you with the right package for your needs.",
};

export default async function EnquiryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale as Locale;
  const lineUrl = process.env.LINE_OA_URL || "https://line.me/R/ti/p/@bangkokcheckup";

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <nav className="text-sm text-slate-400 mb-6">
        <Link href={`/${locale}`} className="hover:text-blue-600">Home</Link>
        {" › "}Enquiry
      </nav>

      <h1 className="text-2xl font-bold text-slate-900 mb-2">Book a Health Check-Up</h1>
      <p className="text-slate-500 mb-8">{t(loc, "enquiry_desc")}</p>

      {/* LINE CTA */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6 text-center">
        <p className="font-semibold text-slate-800 mb-1">Message us on LINE</p>
        <p className="text-sm text-slate-500 mb-4">Fastest response — reply within a few hours</p>
        <a
          href={lineUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-green-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-green-600 transition-colors"
        >
          Open LINE chat →
        </a>
      </div>

      {/* What to include */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h2 className="font-semibold text-slate-800 mb-3">What to tell us</h2>
        <ul className="text-sm text-slate-600 space-y-2">
          <li>✓ Which package type you&apos;re interested in (executive, comprehensive, etc.)</li>
          <li>✓ Preferred hospital or area in Bangkok</li>
          <li>✓ Nationality and language preference</li>
          <li>✓ Preferred dates</li>
          <li>✓ Any specific health concerns</li>
        </ul>
      </div>

      <p className="mt-6 text-xs text-slate-400 text-center">
        We earn a referral commission from partner hospitals. This does not affect which hospitals we recommend — all rankings on this site are price-sorted only.
      </p>
    </div>
  );
}
