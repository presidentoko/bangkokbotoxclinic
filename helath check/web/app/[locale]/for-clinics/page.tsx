import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "For Clinics — Bangkok Health Directory",
  description: "Featured listing and lead generation for Bangkok clinics and hospitals. Join the Bangkok health check-up comparison directory.",
  robots: { index: false, follow: true },
};

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
        {" › "}For clinics
      </nav>

      <h1 className="text-2xl font-bold text-slate-900 mb-4">List Your Hospital or Clinic</h1>
      <p className="text-slate-600 mb-8">
        BangkokCheckup is a price-comparison directory for international health check-up packages.
        We connect medical tourists searching for executive, comprehensive, and specialist checkups with Bangkok hospitals.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h2 className="font-bold text-slate-800 mb-2">Featured Listing</h2>
          <p className="text-sm text-slate-500">Highlighted position in category lists + "Featured" badge. Monthly subscription.</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h2 className="font-bold text-slate-800 mb-2">Standard Listing</h2>
          <p className="text-sm text-slate-500">Your packages listed in the comparison table, sorted by price. Free for hospitals with public pricing.</p>
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl p-6 text-center">
        <p className="font-semibold text-slate-800 mb-3">Get in touch</p>
        <a
          href="mailto:hello@bangkoktopclinic.com"
          className="inline-block bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors"
        >
          Email us →
        </a>
      </div>
    </div>
  );
}
