import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { type Locale, catLabel } from "@/lib/i18n";
import { getHospital, getAllHospitalSlugs, type PackageRow } from "@/lib/db";
import { ShareButtons } from "@/app/components/ShareButtons";

export const revalidate = 3600;
export const dynamic = "force-dynamic";

const BASE = "https://www.bangkoktopclinic.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  try {
    const hospital = await getHospital(slug);
    if (!hospital) return {};
    const minPrice = hospital.min_price ? ` Packages from ฿${parseFloat(hospital.min_price).toLocaleString()}.` : "";
    return {
      title: `${hospital.name} Health Check-Up Packages & Prices — Bangkok`,
      description: `Compare all health check-up packages at ${hospital.name}, Bangkok.${hospital.jci ? " JCI accredited." : ""}${minPrice} ${hospital.package_count} packages compared.`,
      openGraph: {
        title: `${hospital.name} — Bangkok Health Check-Up Packages`,
        description: `Real prices for ${hospital.name} health check-up packages. ${hospital.jci ? "JCI accredited hospital." : ""}`,
        url: `${BASE}/${locale}/hospital/${slug}`,
      },
    };
  } catch {
    return {};
  }
}

function Flag({ val }: { val: number | null }) {
  if (val === 1) return <span className="text-emerald-600 font-bold">✓</span>;
  if (val === 0) return <span className="text-slate-300">✗</span>;
  return <span className="text-amber-400">?</span>;
}

function PackageCard({ pkg, locale }: { pkg: PackageRow; locale: string }) {
  const price = pkg.price ? `฿${parseFloat(pkg.price).toLocaleString()}` : "Price on request";
  const bookUrl = pkg.source_url || pkg.checkup_url || "#";
  const features = [
    { label: "Blood", val: pkg.has_blood },
    { label: "X-Ray", val: pkg.has_xray },
    { label: "Ultrasound", val: pkg.has_ultrasound },
    { label: "CT", val: pkg.has_ct },
    { label: "MRI", val: pkg.has_mri },
    { label: "Cancer markers", val: pkg.has_cancer_marker },
    { label: "Doctor consult", val: pkg.has_doctor_consult },
    { label: "Interpreter", val: pkg.has_interpreter },
  ];
  const included = features.filter((f) => f.val === 1).map((f) => f.label);
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-sm hover:border-blue-200 transition-all">
      <div className="flex items-start justify-between mb-2 gap-2">
        <div>
          <p className="font-semibold text-slate-800 leading-snug">{pkg.package_name}</p>
          {pkg.category && (
            <span className="inline-block mt-1 bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full capitalize">
              {catLabel(locale as Locale, pkg.category)}
            </span>
          )}
        </div>
        <div className="text-right shrink-0">
          <p className="font-bold text-xl text-blue-700 whitespace-nowrap">{price}</p>
          {pkg.results_days != null && (
            <p className="text-xs text-slate-400 mt-0.5">Results in {pkg.results_days}d</p>
          )}
        </div>
      </div>

      {included.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {included.map((label) => (
            <span key={label} className="bg-emerald-50 text-emerald-700 text-xs px-2 py-0.5 rounded-full">✓ {label}</span>
          ))}
          {features.filter((f) => f.val === 0).map((f) => (
            <span key={f.label} className="bg-slate-50 text-slate-400 text-xs px-2 py-0.5 rounded-full">{f.label}</span>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center gap-2">
        <a
          href={`/api/track?pkg=${pkg.package_id}&url=${encodeURIComponent(bookUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Book / Enquire
        </a>
        {pkg.source_url && (
          <a href={pkg.source_url} target="_blank" rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline px-2 py-2">
            View on hospital site →
          </a>
        )}
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

  const shareUrl = `${BASE}/${locale}/hospital/${slug}`;
  const shareTitle = `${hospital.name} Health Check-Up Packages — Bangkok`;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-slate-400 mb-6 flex items-center gap-2 flex-wrap">
        <Link href={`/${locale}`} className="hover:text-blue-600">Home</Link>
        <span>›</span>
        <Link href={`/${locale}/hospital`} className="hover:text-blue-600">Hospitals</Link>
        <span>›</span>
        <span className="text-slate-600">{hospital.name}</span>
      </nav>

      {/* Hospital header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">{hospital.name}</h1>
            {hospital.name_th && <p className="text-slate-500 text-sm mt-0.5">{hospital.name_th}</p>}
            {hospital.area && <p className="text-slate-500 mt-1.5">📍 {hospital.area}, Bangkok</p>}
            <div className="flex flex-wrap items-center gap-3 mt-3">
              {hospital.jci === 1 && (
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-lg uppercase">
                  JCI Accredited
                </span>
              )}
              {hospital.rating && (
                <span className="text-amber-500 font-bold">★ {parseFloat(hospital.rating).toFixed(1)}</span>
              )}
              {hospital.review_count != null && (
                <span className="text-slate-400 text-sm">{hospital.review_count.toLocaleString()} reviews</span>
              )}
              <span className="text-slate-400 text-sm">{hospital.package_count} packages</span>
            </div>
            {hospital.min_price && (
              <p className="mt-3 text-slate-700">
                Packages from <strong className="text-blue-700 text-lg">฿{parseFloat(hospital.min_price).toLocaleString()}</strong>
              </p>
            )}
          </div>
          <div className="shrink-0">
            <ShareButtons title={shareTitle} url={shareUrl} />
          </div>
        </div>
      </div>

      {/* Packages grouped by category */}
      {Object.entries(grouped).map(([cat, pkgs]) => (
        <section key={cat} className="mb-10">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="capitalize">{catLabel(locale as Locale, cat)} Packages</span>
            <span className="text-sm font-normal text-slate-400">({pkgs.length})</span>
          </h2>
          <div className="space-y-4">
            {pkgs.map((pkg) => (
              <PackageCard key={pkg.package_id} pkg={pkg} locale={locale} />
            ))}
        </div>
        </section>
      ))}

      {hospital.packages.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <p className="text-lg mb-2">No packages scraped yet for this hospital.</p>
          <p className="text-sm">Check back soon — we update weekly.</p>
        </div>
      )}

      {/* Map placeholder if coords exist */}
      {hospital.lat && hospital.lng && (
        <div className="bg-slate-100 rounded-xl overflow-hidden mb-8">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${hospital.lat},${hospital.lng}`}
            target="_blank" rel="noopener noreferrer"
            className="block p-4 text-center text-sm text-blue-600 hover:text-blue-700"
          >
            📍 View {hospital.name} on Google Maps →
          </a>
        </div>
      )}

      {/* Compare CTA */}
      <div className="mt-6 bg-blue-50 rounded-xl p-6">
        <p className="text-slate-800 font-semibold mb-1">Compare {hospital.name} with other hospitals</p>
        <p className="text-slate-500 text-sm mb-4">See how their packages rank on price, inclusions, and JCI status.</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={`/${locale}/compare?category=executive`}
            className="bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors text-center"
          >
            Compare all hospitals →
          </Link>
          <Link
            href={`/${locale}/enquiry`}
            className="border border-blue-200 text-blue-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-50 transition-colors text-center"
          >
            Ask for a recommendation
          </Link>
        </div>
      </div>

      {/* BreadcrumbList */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "BangkokCheckup", item: `${BASE}/${locale}` },
          { "@type": "ListItem", position: 2, name: "Hospitals", item: `${BASE}/${locale}/hospital` },
          { "@type": "ListItem", position: 3, name: hospital.name, item: `${BASE}/${locale}/hospital/${hospital.slug}` },
        ],
      }) }} />

      {/* Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalOrganization",
            name: hospital.name,
            ...(hospital.area ? { address: { "@type": "PostalAddress", addressLocality: hospital.area, addressRegion: "Bangkok", addressCountry: "TH" } } : {}),
            ...(hospital.lat && hospital.lng ? { geo: { "@type": "GeoCoordinates", latitude: hospital.lat, longitude: hospital.lng } } : {}),
            ...(hospital.rating ? { aggregateRating: { "@type": "AggregateRating", ratingValue: parseFloat(hospital.rating), bestRating: 5, reviewCount: hospital.review_count ?? 1 } } : {}),
            ...(hospital.jci ? { accreditedBy: { "@type": "Organization", name: "Joint Commission International (JCI)" } } : {}),
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: `Health Check-Up Packages at ${hospital.name}`,
              numberOfItems: hospital.package_count,
            },
          }),
        }}
      />
    </div>
  );
}
