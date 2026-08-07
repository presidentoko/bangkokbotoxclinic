import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { type Locale, catLabel, hreflangMap } from "@/lib/i18n";
import { getHospital, getAllHospitalSlugs, getHospitalReviews, getPriceHistoryBatch, type PackageRow, type ReviewRow } from "@/lib/db";
import { Sparkline } from "@/app/components/Sparkline";
import { ShareButtons } from "@/app/components/ShareButtons";
import { ReportButton } from "@/app/components/ReportButton";
import { HospitalTracker } from "@/app/components/HospitalTracker";

// Static — see the note in app/[locale]/page.tsx.
export const revalidate = false;

const BASE = "https://www.bangkoktopclinic.com";

export async function generateStaticParams() {
  // Pre-render the top 50 hospitals; the rest render on first visit and
  // are then cached for `revalidate` seconds (ISR fallback).
  try {
    const slugs = (await getAllHospitalSlugs()).slice(0, 50);
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
  const { slug, locale } = await params;
  try {
    const hospital = await getHospital(slug);
    if (!hospital) return {};
    const minPrice = hospital.min_price ? ` Packages from ฿${parseFloat(hospital.min_price).toLocaleString()}.` : "";
    const cityLabel = hospital.city || "Bangkok";
    return {
      title: `${hospital.name} Health Check-Up Packages & Prices — ${cityLabel}`,
      description: `Compare all health check-up packages at ${hospital.name}, ${cityLabel}, Thailand.${hospital.jci ? " JCI accredited." : ""}${minPrice} ${hospital.package_count} packages compared.`,
      alternates: {
        canonical: `${BASE}/${locale}/hospital/${slug}`,
        languages: hreflangMap(`/hospital/${slug}`),
      },
      openGraph: {
        title: `${hospital.name} — ${cityLabel} Health Check-Up Packages`,
        description: `Real prices for ${hospital.name} health check-up packages in ${cityLabel}. ${hospital.jci ? "JCI accredited hospital." : ""}`,
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

function PackageCard({ pkg, locale, history }: { pkg: PackageRow; locale: string; history?: number[] }) {
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
        <div className="text-end shrink-0">
          <p className="font-bold text-xl text-blue-700 whitespace-nowrap">{price}</p>
          {history && history.length >= 2 && (
            <div className="mt-1 flex justify-end"><Sparkline prices={history} /></div>
          )}
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
          rel="nofollow noopener noreferrer"
          className="bg-blue-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Book / Enquire
        </a>
        {pkg.source_url && (
          <a href={pkg.source_url} target="_blank" rel="nofollow noopener noreferrer"
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

  // Deliberately unguarded: a DB outage must throw (→ 500, which crawlers
  // retry and Next never caches) rather than fall through to notFound(). A
  // cached 404 tells Google to delete a hospital page that really exists, and
  // `revalidate` keeps it wrong for a full day.
  const hospital = await getHospital(slug);
  if (!hospital) notFound();

  // Reviews and sparklines are supplementary — let them degrade to empty
  // instead of failing a page whose main content already loaded.
  let reviews: ReviewRow[] = [];
  let priceHistory: Record<number, number[]> = {};
  try {
    [reviews, priceHistory] = await Promise.all([
      getHospitalReviews(slug, 5),
      getPriceHistoryBatch(hospital.packages.map((p) => p.package_id)),
    ]);
  } catch {
    // non-fatal
  }

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
      <HospitalTracker hospital={{ slug: hospital.slug, name: hospital.name, city: hospital.city, minPrice: hospital.min_price ? parseFloat(hospital.min_price) : null }} />
      {/* Breadcrumb */}
      <nav className="text-sm text-slate-400 mb-6 flex items-center gap-2 flex-wrap">
        <Link href={`/${locale}`} className="hover:text-blue-600">Home</Link>
        <span>›</span>
        <Link href={`/${locale}/hospital`} className="hover:text-blue-600">Hospitals</Link>
        {hospital.city && (
          <>
            <span>›</span>
            <Link href={`/${locale}/city/${hospital.city.toLowerCase().replace(/\s+/g, "-")}`} className="hover:text-blue-600">{hospital.city}</Link>
          </>
        )}
        <span>›</span>
        <span className="text-slate-600">{hospital.name}</span>
      </nav>

      {/* Hospital header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">{hospital.name}</h1>
            {hospital.name_th && <p className="text-slate-500 text-sm mt-0.5">{hospital.name_th}</p>}
            {(hospital.city || hospital.area) && (
              <p className="text-slate-500 mt-1.5">
                📍 {hospital.area && hospital.city && hospital.area !== hospital.city ? `${hospital.area}, ` : ""}{hospital.city || "Bangkok"}
              </p>
            )}
            {/* Google's own classification — see the note in hospital/page.tsx. */}
            {hospital.category_name && (
              <p className="text-slate-500 text-sm mt-1">{hospital.category_name}</p>
            )}
            {hospital.address && (
              <p className="text-slate-500 text-sm mt-0.5">
                🏠 {hospital.address}
                {hospital.google_maps_url && (
                  <>
                    {" "}
                    <a
                      href={hospital.google_maps_url}
                      target="_blank"
                      rel="nofollow noopener noreferrer"
                      className="text-blue-600 hover:underline whitespace-nowrap"
                    >
                      Directions ↗
                    </a>
                  </>
                )}
              </p>
            )}
            {hospital.phone && (
              <p className="text-slate-500 text-sm mt-0.5">
                📞 <a href={`tel:${hospital.phone}`} className="hover:text-blue-600">{hospital.phone}</a>
              </p>
            )}
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
          <div className="shrink-0 flex flex-col items-end gap-3">
            <ShareButtons title={shareTitle} url={shareUrl} />
            <ReportButton pageUrl={shareUrl} hospitalName={hospital.name} />
          </div>
        </div>
      </div>

      {/* Opening hours — the single most-asked question for a walk-in
          check-up, and the one thing a price list can't answer. */}
      {hospital.opening_hours && hospital.opening_hours.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8">
          <h2 className="font-bold text-slate-800 mb-3">Opening hours</h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5 text-sm">
            {hospital.opening_hours.map((oh) => (
              <div key={oh.day} className="flex justify-between gap-4 border-b border-slate-100 py-1">
                <dt className="text-slate-500">{oh.day}</dt>
                <dd className="text-slate-800 font-medium text-end">{oh.hours}</dd>
              </div>
            ))}
          </dl>
          <p className="text-xs text-slate-400 mt-3">
            Hours from Google. Confirm with the hospital before travelling.
          </p>
        </div>
      )}

      {/* Hospital description + details */}
      {(hospital.description || hospital.founded_year || hospital.bed_count || hospital.specialties || hospital.email || hospital.website) && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8">
          {hospital.description && (
            <p className="text-slate-700 leading-relaxed mb-4">{hospital.description}</p>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
            {hospital.founded_year && (
              <div><span className="text-slate-400">Founded</span><br /><span className="font-semibold text-slate-800">{hospital.founded_year}</span></div>
            )}
            {hospital.bed_count && (
              <div><span className="text-slate-400">Beds</span><br /><span className="font-semibold text-slate-800">{hospital.bed_count.toLocaleString()}</span></div>
            )}
            {hospital.accreditations && (
              <div><span className="text-slate-400">Accreditations</span><br /><span className="font-semibold text-slate-800">{hospital.accreditations}</span></div>
            )}
            {hospital.website && (
              <div><span className="text-slate-400">Website</span><br /><a href={hospital.website} target="_blank" rel="nofollow noopener noreferrer" className="font-semibold text-blue-600 hover:underline truncate block">{hospital.website.replace(/^https?:\/\//, "")}</a></div>
            )}
            {hospital.email && (
              <div><span className="text-slate-400">Email</span><br /><a href={`mailto:${hospital.email}`} className="font-semibold text-blue-600 hover:underline">{hospital.email}</a></div>
            )}
          </div>
          {hospital.specialties && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <span className="text-slate-400 text-sm">Specialties: </span>
              <span className="text-slate-700 text-sm">{hospital.specialties}</span>
            </div>
          )}
        </div>
      )}

      {/* Packages grouped by category */}
      {Object.entries(grouped).map(([cat, pkgs]) => (
        <section key={cat} className="mb-10">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="capitalize">{catLabel(locale as Locale, cat)} Packages</span>
            <span className="text-sm font-normal text-slate-400">({pkgs.length})</span>
          </h2>
          <div className="space-y-4">
            {pkgs.map((pkg) => (
              <PackageCard key={pkg.package_id} pkg={pkg} locale={locale} history={priceHistory[pkg.package_id]} />
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

      {/* Reviews */}
      {reviews.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Patient Reviews</h2>
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r.id} className="border-b border-slate-100 last:border-0 pb-4 last:pb-0">
                <div className="flex items-center gap-2 mb-1">
                  {r.rating && (
                    <span className="text-amber-400 text-sm">{"★".repeat(Math.round(r.rating))}{"☆".repeat(5 - Math.round(r.rating))}</span>
                  )}
                  <span className="text-sm font-semibold text-slate-700">{r.author_name ?? "Patient"}</span>
                  {r.review_date && <span className="text-xs text-slate-400">{r.review_date.slice(0, 10)}</span>}
                  {r.source && <span className="text-xs text-slate-300">via {r.source}</span>}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{r.review_text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Compare CTA */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-8">
        <p className="text-sm font-semibold text-slate-700 mb-1">Compare with another hospital</p>
        <p className="text-xs text-slate-400 mb-3">Side-by-side package comparison — prices, inclusions, JCI status.</p>
        <Link
          href={`/${locale}/compare-hospitals?a=${hospital.slug}&b=bumrungrad-international-hospital`}
          className="text-sm text-blue-600 hover:underline"
        >
          Compare {hospital.name} vs Bumrungrad →
        </Link>
      </div>

      {/* Map placeholder if coords exist */}
      {hospital.lat && hospital.lng && (
        <div className="bg-slate-100 rounded-xl overflow-hidden mb-8">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${hospital.lat},${hospital.lng}`}
            target="_blank" rel="nofollow noopener noreferrer"
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
            href={`/${locale}/compare`}
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

      {/* Related guides */}
      <div className="mt-8">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Health check-up guides</h2>
        <div className="flex flex-wrap gap-2">
          {[
            { href: `/${locale}/guide/what-is-included-checkup`, label: "What's included in each package" },
            { href: `/${locale}/guide/how-to-prepare-health-checkup-thailand`, label: "How to prepare" },
            { href: `/${locale}/guide/understanding-health-checkup-results`, label: "Understanding your results" },
            ...(hospital.jci ? [{ href: `/${locale}/guide/jci-hospitals-bangkok`, label: "JCI hospitals guide" }] : []),
            { href: `/${locale}/guide/executive-health-checkup-bangkok`, label: "Executive packages guide" },
          ].map((g) => (
            <Link key={g.href} href={g.href}
              className="text-xs bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-colors">
              {g.label} →
            </Link>
          ))}
        </div>
      </div>

      {/* More hospitals in city */}
      {hospital.city && (
        <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100 text-sm">
          <Link href={`/${locale}/city/${hospital.city.toLowerCase().replace(/\s+/g, "-")}`} className="font-semibold text-blue-600 hover:underline">
            Compare all hospitals in {hospital.city} →
          </Link>
          <span className="text-slate-400 ms-2">See prices from every hospital in {hospital.city}</span>
        </div>
      )}

      {/* Individual reviews schema */}
      {reviews.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Hospital",
          name: hospital.name,
          review: reviews.map((r) => ({
            "@type": "Review",
            author: { "@type": "Person", name: r.author_name ?? "Patient" },
            datePublished: r.review_date?.slice(0, 10),
            reviewRating: r.rating ? { "@type": "Rating", ratingValue: r.rating, bestRating: 5 } : undefined,
            reviewBody: r.review_text,
          })),
        }) }} />
      )}

      {/* BreadcrumbList */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "BangkokCheckup", item: `${BASE}/${locale}` },
          { "@type": "ListItem", position: 2, name: "Hospitals", item: `${BASE}/${locale}/hospital` },
          ...(hospital.city ? [{ "@type": "ListItem", position: 3, name: hospital.city, item: `${BASE}/${locale}/city/${hospital.city.toLowerCase().replace(/\s+/g, "-")}` }] : []),
          { "@type": "ListItem", position: hospital.city ? 4 : 3, name: hospital.name, item: `${BASE}/${locale}/hospital/${hospital.slug}` },
        ],
      }) }} />

      {/* Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Hospital",
            name: hospital.name,
            ...(hospital.address ? {
              address: { "@type": "PostalAddress", streetAddress: hospital.address, addressLocality: hospital.city || hospital.area || "Bangkok", addressCountry: "TH" }
            } : hospital.area ? {
              address: { "@type": "PostalAddress", addressLocality: hospital.area, addressRegion: hospital.city || "Bangkok", addressCountry: "TH" }
            } : {}),
            ...(hospital.phone ? { telephone: hospital.phone } : {}),
            ...(hospital.checkup_url ? { url: hospital.checkup_url } : {}),
            ...(hospital.lat && hospital.lng ? { geo: { "@type": "GeoCoordinates", latitude: hospital.lat, longitude: hospital.lng } } : {}),
            ...(hospital.rating ? { aggregateRating: { "@type": "AggregateRating", ratingValue: parseFloat(hospital.rating), bestRating: 5, reviewCount: hospital.review_count ?? 1 } } : {}),
            ...(hospital.jci ? { accreditedBy: { "@type": "Organization", name: "Joint Commission International (JCI)" } } : {}),
            ...(hospital.description ? { description: hospital.description } : {}),
            ...(hospital.website ? { url: hospital.website } : {}),
            ...(hospital.email ? { email: hospital.email } : {}),
            ...(hospital.founded_year ? { foundingDate: String(hospital.founded_year) } : {}),
            ...(hospital.bed_count ? { numberOfBeds: { "@type": "QuantitativeValue", value: hospital.bed_count } } : {}),
            ...(hospital.specialties ? { medicalSpecialty: hospital.specialties } : {}),
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
