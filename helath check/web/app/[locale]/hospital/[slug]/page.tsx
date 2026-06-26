import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { type Locale, catLabel } from "@/lib/i18n";
import { getHospital, getAllHospitalSlugs, type PackageRow } from "@/lib/db";

export const revalidate = 86400;

export async function generateStaticParams() {
  try {
    const slugs = await getAllHospitalSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const hospital = await getHospital(slug);
    if (!hospital) return {};
    return {
      title: `${hospital.name} Health Check-Up Packages — Bangkok`,
      description: `Compare all health check-up packages at ${hospital.name}, Bangkok. ${hospital.jci ? "JCI accredited. " : ""}Prices, inclusions, and booking.`,
    };
  } catch {
    return {};
  }
}

function Flag({ val }: { val: number | null }) {
  if (val === 1) return <span className="text-emerald-600">✓</span>;
  if (val === 0) return <span className="text-slate-300">✗</span>;
  return <span className="text-amber-400">?</span>;
}

function PackageCard({ pkg, locale }: { pkg: PackageRow; locale: string }) {
  const price = pkg.price ? `฿${parseFloat(pkg.price).toLocaleString()}` : "Price on request";
  const bookUrl = pkg.source_url || pkg.checkup_url || "#";
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between mb-2 gap-2">
        <div>
          <p className="font-semibold text-slate-800">{pkg.package_name}</p>
          {pkg.category && (
            <span className="inline-block mt-1 bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full capitalize">
              {catLabel(locale as Locale, pkg.category)}
            </span>
          )}
        </div>
        <p className="font-bold text-lg text-blue-700 whitespace-nowrap">{price}</p>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 mt-3">
        <span><Flag val={pkg.has_blood} /> Blood</span>
        <span><Flag val={pkg.has_ultrasound} /> Ultrasound</span>
        <span><Flag val={pkg.has_ct} /> CT</span>
        <span><Flag val={pkg.has_mri} /> MRI</span>
        <span><Flag val={pkg.has_cancer_marker} /> Cancer markers</span>
        <span><Flag val={pkg.has_interpreter} /> Interpreter</span>
        {pkg.results_days != null && <span>📅 Results in {pkg.results_days}d</span>}
      </div>
      <div className="mt-4">
        <a
          href={`/api/track?pkg=${pkg.package_id}&url=${encodeURIComponent(bookUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Book / Enquire
        </a>
      </div>
    </div>
  );
}

export default async function HospitalPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  let hospital = null;
  try {
    hospital = await getHospital(slug);
  } catch {
    // DB not ready
  }
  if (!hospital) notFound();

  const grouped: Record<string, PackageRow[]> = {};
  for (const pkg of hospital.packages) {
    const cat = pkg.category || "other";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(pkg);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-slate-400 mb-6 flex items-center gap-2">
        <Link href={`/${locale}`} className="hover:text-blue-600">Home</Link>
        <span>›</span>
        <Link href={`/${locale}/hospital`} className="hover:text-blue-600">Hospitals</Link>
        <span>›</span>
        <span className="text-slate-600">{hospital.name}</span>
      </nav>

      {/* Hospital header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{hospital.name}</h1>
            {hospital.name_th && <p className="text-slate-500 text-sm mt-0.5">{hospital.name_th}</p>}
            {hospital.area && <p className="text-slate-500 mt-1">📍 {hospital.area}, Bangkok</p>}
          </div>
          <div className="flex flex-col items-end gap-1">
            {hospital.jci === 1 && (
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-lg uppercase">
                JCI Accredited
              </span>
            )}
            {hospital.rating && (
              <span className="text-amber-500 font-bold">★ {parseFloat(hospital.rating).toFixed(1)}</span>
            )}
            {hospital.review_count && (
              <span className="text-slate-400 text-sm">{hospital.review_count.toLocaleString()} reviews</span>
            )}
          </div>
        </div>
        {hospital.min_price && (
          <p className="mt-4 text-slate-600">
            Packages from <strong className="text-blue-700">฿{parseFloat(hospital.min_price).toLocaleString()}</strong>
          </p>
        )}
      </div>

      {/* Packages grouped by category */}
      {Object.entries(grouped).map(([cat, pkgs]) => (
        <section key={cat} className="mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4 capitalize">{catLabel(locale as Locale, cat)} Packages</h2>
          <div className="space-y-4">
            {pkgs.map((pkg) => (
              <PackageCard key={pkg.package_id} pkg={pkg} locale={locale} />
            ))}
          </div>
        </section>
      ))}

      {hospital.packages.length === 0 && (
        <p className="text-slate-400">No packages scraped yet for this hospital.</p>
      )}

      {/* Compare CTA */}
      <div className="mt-10 bg-blue-50 rounded-xl p-6 text-center">
        <p className="text-slate-700 mb-3">Want to compare {hospital.name} with other hospitals?</p>
        <Link
          href={`/${locale}/compare?category=executive`}
          className="bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors inline-block"
        >
          Open comparison table →
        </Link>
      </div>

      {/* Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalOrganization",
            name: hospital.name,
            ...(hospital.area ? { address: { "@type": "PostalAddress", addressLocality: hospital.area, addressCountry: "TH" } } : {}),
            ...(hospital.rating ? { aggregateRating: { "@type": "AggregateRating", ratingValue: hospital.rating, reviewCount: hospital.review_count } } : {}),
          }),
        }}
      />
    </div>
  );
}
