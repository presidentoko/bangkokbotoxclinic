import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { type Locale, catLabel, CATEGORIES, LOCALES } from "@/lib/i18n";
import { getPackage, getAllHospitalSlugs, getPackagesByCategory, type PackageRow } from "@/lib/db";

export const revalidate = 86400;

export async function generateStaticParams() {
  // Pre-render top 30 hospitals × top 6 categories = 180 combos per locale
  // Remaining pages generated on-demand via ISR fallback
  const TOP_CATEGORIES = ["comprehensive", "executive", "standard", "cancer", "cardiac", "women"];
  try {
    const slugs = (await getAllHospitalSlugs()).slice(0, 30);
    const params: { type: string; hospital: string }[] = [];
    for (const type of TOP_CATEGORIES) {
      for (const hospital of slugs) {
        params.push({ type, hospital });
      }
    }
    return params;
  } catch {
    return [];
  }
}

const BASE = "https://www.bangkoktopclinic.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; type: string; hospital: string }>;
}): Promise<Metadata> {
  const { locale, type, hospital } = await params;
  const label = catLabel(locale as Locale, type);
  const hospitalName = hospital.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `${label} Health Check-Up at ${hospitalName} — Price & Inclusions 2026`,
    description: `${label} check-up package at ${hospitalName}, Thailand. Real price, inclusions (blood, ultrasound, MRI, cancer markers), results timeline, and booking info.`,
    alternates: {
      canonical: `${BASE}/${locale}/checkup/${type}/${hospital}`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `${BASE}/${l}/checkup/${type}/${hospital}`])),
    },
  };
}

function Flag({ val }: { val: number | null }) {
  if (val === 1) return <span className="text-emerald-600 font-bold">✓ Included</span>;
  if (val === 0) return <span className="text-slate-400">✗ Not included</span>;
  return <span className="text-amber-500">? Not specified</span>;
}

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ locale: string; type: string; hospital: string }>;
}) {
  const { locale, type, hospital } = await params;
  const loc = locale as Locale;

  let pkg: PackageRow | null = null;
  let similar: PackageRow[] = [];
  try {
    [pkg, similar] = await Promise.all([
      getPackage(type, hospital),
      getPackagesByCategory(type, "price"),
    ]);
  } catch {
    // DB not ready
  }
  if (!pkg) notFound();

  const price = pkg.price ? `฿${parseFloat(pkg.price).toLocaleString()}` : "Price on request";
  const bookUrl = pkg.source_url || pkg.checkup_url || "#";
  const label = catLabel(loc, type);
  const otherPkgs = similar.filter((r) => r.hospital_slug !== hospital).slice(0, 3);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-slate-400 mb-6 flex items-center gap-2 flex-wrap">
        <Link href={`/${locale}`} className="hover:text-blue-600">Home</Link>
        <span>›</span>
        <Link href={`/${locale}/checkup/${type}`} className="hover:text-blue-600">{label}</Link>
        <span>›</span>
        <span className="text-slate-600">{pkg.hospital_name}</span>
      </nav>

      {/* Package header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8">
        <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">{pkg.package_name}</h1>
            <Link href={`/${locale}/hospital/${pkg.hospital_slug}`} className="text-blue-600 hover:underline font-medium">
              {pkg.hospital_name}
            </Link>
            {pkg.jci === 1 && (
              <span className="ms-2 bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">JCI</span>
            )}
            {pkg.area && <p className="text-sm text-slate-500 mt-1">📍 {pkg.area}</p>}
          </div>
          <div className="text-end">
            <p className="text-2xl font-bold text-blue-700">{price}</p>
            <p className="text-sm text-slate-400">{pkg.currency || "THB"}</p>
          </div>
        </div>

        {/* AEO sentence */}
        <p className="bg-blue-50 rounded-lg px-4 py-3 text-sm text-slate-700 mb-5">
          The {label.toLowerCase()} health check-up at {pkg.hospital_name} is priced at approximately {price}
          {pkg.has_mri === 1 ? ", and includes MRI scanning" : ""}
          {pkg.has_cancer_marker === 1 ? " and cancer marker tests" : ""}.
          {pkg.results_days ? ` Results are typically available within ${pkg.results_days} day${pkg.results_days > 1 ? "s" : ""}.` : ""}
        </p>

        {/* Inclusion list */}
        <h2 className="font-semibold text-slate-700 mb-3">What&apos;s included</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          <div><Flag val={pkg.has_blood} /> &nbsp;Blood tests</div>
          <div><Flag val={pkg.has_xray} /> &nbsp;X-Ray</div>
          <div><Flag val={pkg.has_ultrasound} /> &nbsp;Ultrasound</div>
          <div><Flag val={pkg.has_ecg} /> &nbsp;ECG / Electrocardiogram</div>
          <div><Flag val={pkg.has_ct} /> &nbsp;CT Scan</div>
          <div><Flag val={pkg.has_mri} /> &nbsp;MRI</div>
          <div><Flag val={pkg.has_treadmill} /> &nbsp;Treadmill / Stress test</div>
          <div><Flag val={pkg.has_cancer_marker} /> &nbsp;Cancer markers</div>
          <div><Flag val={pkg.has_doctor_consult} /> &nbsp;Doctor consultation</div>
          <div><Flag val={pkg.has_interpreter} /> &nbsp;Interpreter service</div>
        </div>

        {pkg.results_days != null && (
          <p className="mt-4 text-sm text-slate-600">📅 Results available in <strong>{pkg.results_days}</strong> day{pkg.results_days > 1 ? "s" : ""}</p>
        )}

        <div className="mt-6">
          <a
            href={`/api/track?pkg=${pkg.package_id}&url=${encodeURIComponent(bookUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
          >
            Book this package →
          </a>
        </div>
      </div>

      {/* Compare CTA */}
      <div className="mb-8">
        <Link
          href={`/${locale}/compare/${type}`}
          className="text-blue-600 hover:underline text-sm"
        >
          ← Compare all {label.toLowerCase()} packages in Bangkok
        </Link>
      </div>

      {/* Similar packages */}
      {otherPkgs.length > 0 && (
        <section>
          <h2 className="text-base font-bold text-slate-800 mb-3">Other {label.toLowerCase()} packages in Bangkok</h2>
          <div className="space-y-3">
            {otherPkgs.map((r) => (
              <div key={r.package_id} className="bg-white border border-slate-200 rounded-lg px-4 py-3 flex items-center justify-between gap-3">
                <div>
                  <Link href={`/${locale}/checkup/${type}/${r.hospital_slug}`} className="font-medium text-slate-800 hover:text-blue-700">
                    {r.hospital_name}
                  </Link>
                  <p className="text-xs text-slate-500">{r.package_name}</p>
                </div>
                <p className="font-bold text-slate-900 whitespace-nowrap">
                  {r.price ? `฿${parseFloat(r.price).toLocaleString()}` : "—"}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/${locale}` },
          { "@type": "ListItem", position: 2, name: label, item: `${BASE}/${locale}/checkup/${type}` },
          { "@type": "ListItem", position: 3, name: pkg.hospital_name, item: `${BASE}/${locale}/checkup/${type}/${hospital}` },
        ],
      }) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: pkg.package_name,
            description: `${label} health check-up at ${pkg.hospital_name}, Thailand. Price: ${pkg.price ? `฿${parseFloat(pkg.price).toLocaleString()}` : "on request"}`,
            offers: {
              "@type": "Offer",
              price: pkg.price ?? "0",
              priceCurrency: pkg.currency || "THB",
              availability: "https://schema.org/InStock",
              url: `${BASE}/${locale}/checkup/${type}/${hospital}`,
              seller: {
                "@type": "MedicalOrganization",
                name: pkg.hospital_name,
                ...(pkg.jci === 1 ? { medicalSpecialty: "International Patient Center" } : {}),
              },
            },
          }),
        }}
      />
    </div>
  );
}
