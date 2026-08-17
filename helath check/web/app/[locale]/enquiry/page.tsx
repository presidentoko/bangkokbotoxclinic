import type { Metadata } from "next";
import Link from "next/link";
import { type Locale, localeAlternates } from "@/lib/i18n";
import { ContactForm } from "@/app/components/ContactForm";

const BASE = "https://www.bangkoktopclinic.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  void locale;
  return {
    title: "Book a Health Check-Up in Bangkok — Free Enquiry",
    description: "Get personalised help booking a health check-up at a Bangkok hospital. Tell us your age, concerns, and budget — we'll find the best package. Free, no obligation.",
    alternates: localeAlternates(locale, `/enquiry`),
  };
}

export default async function EnquiryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const lineUrl = process.env.LINE_OA_URL || "https://line.me/R/ti/p/@bangkokcheckup";

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <nav className="text-sm text-slate-400 mb-6">
        <Link href={`/${locale}`} className="hover:text-blue-600">Home</Link>
        {" › "}Enquiry
      </nav>

      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
        Book a Health Check-Up
      </h1>
      <p className="text-slate-500 mb-8 text-sm">
        Tell us your requirements and we&apos;ll find the best package. No obligation — we reply within a few hours.
      </p>

      {/* Contact form */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6 shadow-sm">
        <ContactForm
          type="enquiry"
          placeholder="E.g. I'm looking for an executive health check-up for a 45-year-old male. Prefer Sukhumvit area, mid-March. Budget around ฿20,000."
          fields={["name", "email", "message"]}
        />
      </div>

      {/* LINE alternative */}
      <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center mb-6">
        <p className="font-semibold text-slate-800 mb-1 text-sm">Prefer LINE?</p>
        <p className="text-xs text-slate-500 mb-3">Fastest response for same-day questions</p>
        <a href={lineUrl} target="_blank" rel="noopener noreferrer"
          className="inline-block bg-green-500 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-green-600 transition-colors text-sm">
          Open LINE chat →
        </a>
      </div>

      {/* What to include tips */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
        <h2 className="font-semibold text-slate-800 mb-3 text-sm">What to include</h2>
        <ul className="text-sm text-slate-600 space-y-1.5">
          {[
            "Which package type (executive, comprehensive, cancer screening, etc.)",
            "Preferred hospital or area in Bangkok",
            "Nationality and language preference",
            "Preferred dates",
            "Any specific health concerns or family history",
            "Your budget range",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-blue-500 shrink-0 mt-0.5">▸</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-6 text-xs text-slate-400 text-center">
        We may earn a referral commission from partner hospitals. This does not affect which hospitals we recommend — all comparison rankings are price-sorted only.
      </p>
    </div>
  );
}
