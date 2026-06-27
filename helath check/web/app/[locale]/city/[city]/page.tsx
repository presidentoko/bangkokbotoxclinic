import type { Metadata } from "next";
import Link from "next/link";
import { type Locale } from "@/lib/i18n";
import { getPackagesByCity } from "@/lib/db";
import { FilteredPackageGrid } from "@/app/components/FilteredPackageGrid";
import type { PackageRow } from "@/lib/db";

export const revalidate = 3600;

const CITY_SLUGS: Record<string, string> = {
  "bangkok": "Bangkok",
  "chiang-mai": "Chiang Mai",
  "phuket": "Phuket",
  "pattaya": "Pattaya",
  "hua-hin": "Hua Hin",
  "ko-samui": "Ko Samui",
  "krabi": "Krabi",
  "chiang-rai": "Chiang Rai",
  "hat-yai": "Hat Yai",
  "khon-kaen": "Khon Kaen",
  "koh-chang": "Koh Chang",
  "udon-thani": "Udon Thani",
  "korat": "Korat",
  "ayutthaya": "Ayutthaya",
  "chon-buri": "Chon Buri",
  "nakhon-si-thammarat": "Nakhon Si Thammarat",
  "lampang": "Lampang",
  "nakhon-pathom": "Nakhon Pathom",
};

export async function generateStaticParams() {
  return Object.keys(CITY_SLUGS).map((city) => ({ city }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; city: string }>;
}): Promise<Metadata> {
  const { city } = await params;
  const cityName = CITY_SLUGS[city] || city;
  return {
    title: `Health Check-Up Packages in ${cityName} — Compare Prices`,
    description: `Compare health check-up packages at hospitals in ${cityName}, Thailand. Real prices, all hospitals, all package types. Find the best value health screening in ${cityName}.`,
    keywords: [`health checkup ${cityName}`, `health screening ${cityName}`, `hospital ${cityName} health package`, `ตรวจสุขภาพ${cityName}`],
  };
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ locale: string; city: string }>;
}) {
  const { locale, city } = await params;
  const loc = locale as Locale;
  const cityName = CITY_SLUGS[city] || city;

  let rows: PackageRow[] = [];
  try {
    rows = await getPackagesByCity(cityName);
  } catch {
    // DB not ready
  }

  const hospitals = new Set(rows.map((r) => r.hospital_slug)).size;
  const prices = rows.map((r) => parseFloat(r.price ?? "0")).filter(Boolean);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-slate-400 mb-6 flex items-center gap-2">
        <Link href={`/${locale}`} className="hover:text-blue-600">Home</Link>
        <span>›</span>
        <span className="text-slate-600">Health Checkup in {cityName}</span>
      </nav>

      {/* Hero */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
          Health Check-Up in {cityName}
        </h1>
        <p className="text-slate-600 text-lg max-w-2xl">
          Compare {rows.length} health checkup packages across {hospitals} hospitals in {cityName}.
          {minPrice > 0 && ` Prices from ฿${minPrice.toLocaleString()} to ฿${maxPrice.toLocaleString()}.`}
        </p>

        {/* Stats strip */}
        <div className="flex flex-wrap gap-4 mt-5">
          <div className="bg-blue-50 rounded-xl px-4 py-3 text-center">
            <p className="text-2xl font-bold text-blue-700">{hospitals}</p>
            <p className="text-xs text-blue-500 font-medium">Hospitals</p>
          </div>
          <div className="bg-emerald-50 rounded-xl px-4 py-3 text-center">
            <p className="text-2xl font-bold text-emerald-700">{(rows as PackageRow[]).length}</p>
            <p className="text-xs text-emerald-500 font-medium">Packages</p>
          </div>
          {minPrice > 0 && (
            <div className="bg-amber-50 rounded-xl px-4 py-3 text-center">
              <p className="text-2xl font-bold text-amber-700">฿{minPrice.toLocaleString()}</p>
              <p className="text-xs text-amber-500 font-medium">From</p>
            </div>
          )}
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <p className="text-4xl mb-3">🏥</p>
          <p className="font-medium">No packages found for {cityName} yet.</p>
          <Link href={`/${locale}`} className="mt-3 inline-block text-sm text-blue-600 hover:underline">
            Browse all cities →
          </Link>
        </div>
      ) : (
        <FilteredPackageGrid rows={rows} loc={loc} />
      )}

      {/* SEO content */}
      <div className="mt-12 prose prose-slate max-w-none">
        <h2>Health Check-Up Options in {cityName}</h2>
        <p>
          {cityName} offers a range of health screening packages at both private and government hospitals.
          Whether you need a basic annual check-up or a comprehensive executive package with MRI, cancer markers,
          and specialist consultations, you can find and compare all options above.
        </p>
        <p>
          Packages start from ฿{minPrice > 0 ? minPrice.toLocaleString() : "1,200"} for basic blood tests and
          annual screening, up to ฿{maxPrice > 0 ? maxPrice.toLocaleString() : "50,000+"} for premium executive
          packages including full body imaging and specialist consultations.
        </p>
        <h3>How to Choose a Health Checkup in {cityName}</h3>
        <ul>
          <li><strong>Basic packages (฿1,200–฿3,000)</strong>: CBC, blood glucose, cholesterol, urinalysis — ideal for young adults with no health concerns.</li>
          <li><strong>Standard packages (฿3,000–฿8,000)</strong>: Adds chest X-ray, liver/kidney function, thyroid — best for most adults 30–50.</li>
          <li><strong>Executive packages (฿8,000+)</strong>: Includes ultrasound, ECG, cancer markers, specialist review — recommended for 50+ or high-risk individuals.</li>
        </ul>
      </div>
    </div>
  );
}
