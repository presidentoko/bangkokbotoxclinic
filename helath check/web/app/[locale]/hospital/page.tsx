import type { Metadata } from "next";
import Link from "next/link";
import { type Locale, t } from "@/lib/i18n";
import { getHospitals, type HospitalSummary } from "@/lib/db";

export const revalidate = 3600;
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  return {
    title: "Bangkok Health Check-Up Hospitals — All Hospitals",
    description: "Compare all Bangkok hospitals offering health check-up packages. JCI-accredited, mid-tier, and provincial hospitals with real prices.",
  };
}

export default async function HospitalsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale as Locale;

  let hospitals: HospitalSummary[] = [];
  try {
    hospitals = await getHospitals();
  } catch {
    // DB not ready
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Bangkok Health Check-Up Hospitals</h1>
      <p className="text-slate-500 mb-8">All hospitals in our database, sorted by tier</p>

      {hospitals.length === 0 ? (
        <p className="text-slate-400">No hospitals yet. Run <code className="bg-slate-100 px-1 rounded">python seed_hospitals.py && python fetch.py && python extract.py</code>.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {hospitals.map((h) => (
            <Link
              key={h.slug}
              href={`/${locale}/hospital/${h.slug}`}
              className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <h2 className="font-semibold text-slate-800 leading-snug">{h.name}</h2>
                {h.jci === 1 && (
                  <span className="ml-2 bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase shrink-0">JCI</span>
                )}
              </div>
              {h.area && <p className="text-sm text-slate-500 mb-2">📍 {h.area}</p>}
              <div className="flex items-center gap-3 text-sm">
                {h.rating && <span className="text-amber-500 font-semibold">★ {parseFloat(h.rating).toFixed(1)}</span>}
                {h.package_count > 0 && (
                  <span className="text-slate-400">{h.package_count} packages</span>
                )}
                {h.min_price && (
                  <span className="text-slate-600 font-medium">from ฿{parseFloat(h.min_price).toLocaleString()}</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
