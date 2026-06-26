import type { Metadata } from "next";
import Link from "next/link";
import { type Locale, t, catLabel, CATEGORIES } from "@/lib/i18n";
import { getStatsForHome, getPackagesByCategory, type PackageRow } from "@/lib/db";

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as Locale;
  return {
    title: `${t(loc, "site_name")} — Compare Bangkok Health Check-Up Prices`,
    description: t(loc, "tagline"),
  };
}

const CAT_ICONS: Record<string, string> = {
  comprehensive: "🔬", executive: "💼", cancer: "🎗️",
  cardiac: "❤️", women: "♀️", men: "♂️", basic: "📋", age: "🗓️",
};

const CAT_DESC: Record<string, string> = {
  comprehensive: "Full body screening",
  executive: "Premium all-inclusive",
  cancer: "Tumour marker tests",
  cardiac: "Heart & vascular focus",
  women: "Women-specific panels",
  men: "Men-specific panels",
  basic: "Essential blood panel",
  age: "Age-tailored programs",
};

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale as Locale;
  const base = `/${locale}`;

  let stats = { jciCount: 0, packageCount: 0, hospitalCount: 0 };
  let executiveRows: PackageRow[] = [];
  try {
    [stats, executiveRows] = await Promise.all([
      getStatsForHome(),
      getPackagesByCategory("executive", "price"),
    ]);
  } catch {
    // DB not connected yet — show empty state
  }

  const previewRows = executiveRows.slice(0, 5);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-700 to-blue-600 text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            Compare Bangkok<br className="hidden md:block" /> Health Check-Up Prices
          </h1>
          <p className="text-blue-100 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Real prices scraped directly from hospital websites. JCI-accredited hospitals. No ads, no sponsored rankings.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`${base}/compare?category=executive`}
              className="bg-white text-blue-700 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors"
            >
              Compare Executive Packages
            </Link>
            <Link
              href={`${base}/compare`}
              className="border-2 border-white/50 text-white font-semibold px-6 py-3 rounded-xl hover:border-white hover:bg-white/10 transition-colors"
            >
              {t(loc, "all_categories")}
            </Link>
          </div>
        </div>
      </section>

      {/* Trust stats */}
      {(stats.jciCount > 0 || stats.hospitalCount > 0) && (
        <section className="bg-white border-b border-slate-100">
          <div className="mx-auto max-w-6xl px-4 py-6 flex flex-wrap justify-center gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-blue-700">{stats.hospitalCount}</p>
              <p className="text-sm text-slate-500 mt-0.5">Hospitals</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-700">{stats.packageCount}</p>
              <p className="text-sm text-slate-500 mt-0.5">Packages analysed</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-700">{stats.jciCount}</p>
              <p className="text-sm text-slate-500 mt-0.5">JCI-accredited</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-700">0</p>
              <p className="text-sm text-slate-500 mt-0.5">Paid placements</p>
            </div>
          </div>
        </section>
      )}

      {/* Category cards */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Browse by check-up type</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`${base}/compare?category=${cat}`}
              className="bg-white rounded-xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-md transition-all group"
            >
              <div className="text-3xl mb-2">{CAT_ICONS[cat]}</div>
              <p className="font-semibold text-slate-800 group-hover:text-blue-700">{catLabel(loc, cat)}</p>
              <p className="text-xs text-slate-400 mt-1">{CAT_DESC[cat]}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Executive preview table */}
      {previewRows.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800">Executive packages — price preview</h2>
            <Link href={`${base}/compare?category=executive`} className="text-sm text-blue-600 hover:underline">
              Full comparison →
            </Link>
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-600 text-left">
                  <th className="px-4 py-2.5 font-semibold">Hospital</th>
                  <th className="px-3 py-2.5 font-semibold">Package</th>
                  <th className="px-3 py-2.5 font-semibold text-right">Price (THB)</th>
                  <th className="px-3 py-2.5 font-semibold text-center">MRI</th>
                  <th className="px-3 py-2.5 font-semibold text-center">Cancer</th>
                </tr>
              </thead>
              <tbody>
                {previewRows.map((row, i) => (
                  <tr key={row.package_id} className={`border-t border-slate-100 ${i % 2 === 0 ? "" : "bg-slate-50/50"}`}>
                    <td className="px-4 py-3 font-medium text-slate-800">{row.hospital_name}</td>
                    <td className="px-3 py-3 text-slate-600">{row.package_name}</td>
                    <td className="px-3 py-3 text-right font-bold text-slate-900">
                      {row.price ? `฿${parseFloat(row.price).toLocaleString()}` : "—"}
                    </td>
                    <td className="px-3 py-3 text-center">
                      {row.has_mri === 1 ? "✓" : row.has_mri === 0 ? "✗" : "?"}
                    </td>
                    <td className="px-3 py-3 text-center">
                      {row.has_cancer_marker === 1 ? "✓" : row.has_cancer_marker === 0 ? "✗" : "?"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-400 mt-2">Sorted by price. ✓ included · ✗ not included · ? not specified.</p>
        </section>
      )}

      {/* Why this site */}
      <section className="bg-white border-t border-slate-100">
        <div className="mx-auto max-w-4xl px-4 py-12 text-center">
          <h2 className="text-xl font-bold text-slate-800 mb-3">Real prices. No ads.</h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Every price is scraped weekly from the hospital&apos;s own website — not from aggregators or ad networks.
            Hospitals can&apos;t pay for a higher ranking. The table sorts by price and nothing else.
          </p>
        </div>
      </section>
    </div>
  );
}
