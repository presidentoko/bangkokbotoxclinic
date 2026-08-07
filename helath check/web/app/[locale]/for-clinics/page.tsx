import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/app/components/ContactForm";

// Must be generateMetadata, not a static object: without an explicit
// canonical this page inherited the layout default (`${BASE}/${locale}`) and
// told Google it was a duplicate of the home page — a canonical pointing
// somewhere else while the page is also noindex is a contradictory pair of
// signals, and Google resolves it by picking one arbitrarily.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "List Your Hospital — For Clinics",
    description:
      "List your Bangkok clinic or hospital on BangkokCheckup. Reach medical tourists searching for health check-up packages.",
    robots: { index: false, follow: true },
    alternates: { canonical: `https://www.bangkoktopclinic.com/${locale}/for-clinics` },
  };
}

const STATS = [
  { val: "Medical tourists", label: "Primary audience" },
  { val: "5 languages", label: "EN, ZH, JA, TH, AR" },
  { val: "SEO-optimised", label: "Google, AI search" },
  { val: "No pay-to-rank", label: "Transparent listings" },
];

export default async function ForClinicsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <nav className="text-sm text-slate-400 mb-6">
        <Link href={`/${locale}`} className="hover:text-blue-600">Home</Link>
        {" › "}For hospitals
      </nav>

      {/* Hero */}
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
        List Your Hospital on BangkokCheckup
      </h1>
      <p className="text-slate-600 mb-8 leading-relaxed">
        BangkokCheckup is the leading price-comparison directory for international health check-up packages in Bangkok.
        We serve medical tourists from the US, UK, China, Japan, the Middle East, and Southeast Asia — in 5 languages.
      </p>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        {STATS.map((s) => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-4 text-center">
            <p className="font-bold text-slate-800 text-sm">{s.val}</p>
            <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="text-2xl mb-2">📋</div>
          <h2 className="font-bold text-slate-800 mb-2">Standard Listing</h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-4">
            Your packages listed in all comparison tables, sorted by price. Free for hospitals with publicly listed pricing.
          </p>
          <ul className="text-xs text-slate-500 space-y-1">
            <li>✓ All 8 category pages</li>
            <li>✓ Hospital detail page</li>
            <li>✓ Google indexed</li>
            <li>✓ No monthly fee</li>
          </ul>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
          <div className="text-2xl mb-2">⭐</div>
          <h2 className="font-bold text-slate-800 mb-2">Featured Listing</h2>
          <p className="text-sm text-slate-600 leading-relaxed mb-4">
            Highlighted position at the top of category lists + Featured badge. Priority for enquiry leads.
          </p>
          <ul className="text-xs text-slate-600 space-y-1">
            <li>✓ Top-of-list placement</li>
            <li>✓ Featured badge on cards</li>
            <li>✓ Priority lead routing</li>
            <li>✓ Monthly subscription</li>
          </ul>
        </div>
      </div>

      {/* Correction / data update section */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-10">
        <h2 className="font-semibold text-slate-800 mb-1 flex items-center gap-2">
          <span>🔧</span> Update your prices or data
        </h2>
        <p className="text-sm text-slate-600 mb-0">
          If you&apos;re a hospital representative and your prices or package details are incorrect, use the contact form below — include your hospital name and the correction.
        </p>
      </div>

      {/* Contact form */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-1">Get in touch</h2>
        <p className="text-sm text-slate-500 mb-5">
          For listing enquiries, advertising, or data corrections — we reply within 24 hours.
        </p>
        <ContactForm
          type="advertising"
          placeholder="E.g. We are Vejthani Hospital and would like to update our executive package prices. / We are interested in a featured listing..."
          fields={["name", "email", "message"]}
        />
      </div>

      <p className="mt-6 text-xs text-slate-400 text-center">
        All standard listings are free. We verify package data directly from hospital websites before publishing.
      </p>
    </div>
  );
}
