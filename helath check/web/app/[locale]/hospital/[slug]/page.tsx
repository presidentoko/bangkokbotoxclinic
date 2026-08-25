import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { type Locale, catLabel, localeAlternates, t, fmt } from "@/lib/i18n";
import { getHospital, getAllHospitalSlugs, getHospitalReviews, getPriceHistoryBatch, type PackageRow, type ReviewRow } from "@/lib/db";
import { SLUG_REDIRECTS } from "@/lib/slug-redirects";
import { Sparkline } from "@/app/components/Sparkline";
import { ShareButtons } from "@/app/components/ShareButtons";
import { ReportButton } from "@/app/components/ReportButton";
import { HospitalTracker } from "@/app/components/HospitalTracker";

// Static — see the note in app/[locale]/page.tsx.
export const revalidate = false;

const BASE = "https://www.bangkoktopclinic.com";

export async function generateStaticParams() {
  try {
    return (await getAllHospitalSlugs()).map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

// The full slug list above is the complete param space, so an unknown slug is
// rejected by the router with a real 404.
//
// This is not a micro-optimisation. With dynamicParams left on, notFound()
// from this page rendered the not-found boundary but answered **200** —
// /en/hospital/anything-at-all returned a "Page not found" page that Google
// reads as a real page. That is an unbounded soft-404 space hanging off a site
// whose Search Console problem is too many low-value URLs. Renaming a slug now
// requires an entry in SLUG_REDIRECTS (below), which is the correct trade.
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  try {
    const hospital = await getHospital(slug);
    if (!hospital) return {};
    const loc = locale as Locale;
    const cityLabel = hospital.city || "Bangkok";
    const vars = { name: hospital.name, city: cityLabel, n: hospital.package_count };
    // The title and description are what a searcher actually reads in the
    // result. This page declares a self-referencing canonical per locale now,
    // so an English snippet under an Arabic URL would undercut the whole
    // reason for having the Arabic URL.
    const minPrice = hospital.min_price
      ? fmt(loc, "hosp_meta_from", { price: parseFloat(hospital.min_price).toLocaleString() })
      : "";
    return {
      title: fmt(loc, "hosp_meta_title", vars),
      description:
        fmt(loc, "hosp_meta_desc", vars) +
        (hospital.jci ? t(loc, "hosp_meta_jci") : "") +
        minPrice,
      alternates: localeAlternates(locale, `/hospital/${slug}`),
      openGraph: {
        title: fmt(loc, "hosp_og_title", vars),
        description:
          fmt(loc, "hosp_og_desc", vars) + (hospital.jci ? t(loc, "hosp_meta_jci") : ""),
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

/**
 * Google Places writes opening hours as prose ("11 AM to 8 PM", "9:30 AM to
 * 6:30 PM", "Open 24 hours", "Closed"). schema.org wants 24-hour times, and a
 * Hospital without openingHoursSpecification loses the hours panel in a rich
 * result even though the page displays them. Anything that does not parse is
 * dropped rather than guessed — a wrong opening time sends someone to a closed
 * clinic.
 */
function openingHoursSchema(hours: { day: string; hours: string }[] | null) {
  if (!hours?.length) return [];
  const to24 = (raw: string, fallbackMeridiem?: string): string | null => {
    const m = /^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/i.exec(raw.trim());
    if (!m) return null;
    let h = Number(m[1]);
    const min = m[2] ?? "00";
    const mer = (m[3] ?? fallbackMeridiem ?? "").toUpperCase();
    if (h < 1 || h > 12) return null;
    if (mer === "PM" && h !== 12) h += 12;
    if (mer === "AM" && h === 12) h = 0;
    if (!mer) return null;
    return `${String(h).padStart(2, "0")}:${min}`;
  };
  const out: Record<string, unknown>[] = [];
  for (const { day, hours: text } of hours) {
    const t = text.trim();
    if (/^closed$/i.test(t)) continue;
    if (/24\s*hours/i.test(t)) {
      out.push({ "@type": "OpeningHoursSpecification", dayOfWeek: day, opens: "00:00", closes: "23:59" });
      continue;
    }
    // "12 to 8 PM" leaves the opening meridiem implied by the closing one.
    const parts = /^(.+?)\s+to\s+(.+)$/i.exec(t);
    if (!parts) continue;
    const closeMer = /PM/i.test(parts[2]) ? "PM" : /AM/i.test(parts[2]) ? "AM" : undefined;
    const opens = to24(parts[1], closeMer);
    const closes = to24(parts[2]);
    if (!opens || !closes) continue;
    out.push({ "@type": "OpeningHoursSpecification", dayOfWeek: day, opens, closes });
  }
  return out;
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
          {t(locale as Locale, "book_now")}
        </a>
        {pkg.source_url && (
          <a href={pkg.source_url} target="_blank" rel="nofollow noopener noreferrer"
            className="text-sm text-blue-600 hover:underline px-2 py-2">
            {t(locale as Locale, "hosp_view_site")}
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
  const loc = locale as Locale;

  // Deliberately unguarded: a DB outage must throw (→ 500, which crawlers
  // retry and Next never caches) rather than fall through to notFound(). A
  // cached 404 tells Google to delete a hospital page that really exists, and
  // `revalidate` keeps it wrong for a full day.
  const hospital = await getHospital(slug);
  // The 2026-08 re-slug replaced 32 percent-encoded slugs with readable ASCII
  // ones. Google still has the old URLs, so honour them with a 308 rather than
  // adding to the 404 pile.
  if (!hospital) {
    const moved = SLUG_REDIRECTS[slug];
    if (moved) permanentRedirect(`/${locale}/hospital/${moved}`);
    notFound();
  }

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

  const openingHoursSpec = openingHoursSchema(hospital.opening_hours);
  const shareUrl = `${BASE}/${locale}/hospital/${slug}`;
  const shareTitle = `${hospital.name} Health Check-Up Packages — Bangkok`;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <HospitalTracker hospital={{ slug: hospital.slug, name: hospital.name, city: hospital.city, minPrice: hospital.min_price ? parseFloat(hospital.min_price) : null }} />
      {/* Breadcrumb */}
      <nav className="text-sm text-slate-400 mb-6 flex items-center gap-2 flex-wrap">
        <Link href={`/${locale}`} className="hover:text-blue-600">{t(loc, "nav_home")}</Link>
        <span>›</span>
        <Link href={`/${locale}/hospital`} className="hover:text-blue-600">{t(loc, "nav_hospitals")}</Link>
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
                      {t(loc, "hosp_directions")}
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
                  {t(loc, "hosp_jci")}
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
                {t(loc, "hosp_from")} <strong className="text-blue-700 text-lg">฿{parseFloat(hospital.min_price).toLocaleString()}</strong>
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
          <h2 className="font-bold text-slate-800 mb-3">{t(loc, "hosp_hours")}</h2>
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
              <div><span className="text-slate-400">{t(loc, "hosp_founded")}</span><br /><span className="font-semibold text-slate-800">{hospital.founded_year}</span></div>
            )}
            {hospital.bed_count && (
              <div><span className="text-slate-400">{t(loc, "hosp_beds")}</span><br /><span className="font-semibold text-slate-800">{hospital.bed_count.toLocaleString()}</span></div>
            )}
            {hospital.accreditations && (
              <div><span className="text-slate-400">{t(loc, "hosp_accred")}</span><br /><span className="font-semibold text-slate-800">{hospital.accreditations}</span></div>
            )}
            {hospital.website && (
              <div><span className="text-slate-400">{t(loc, "hosp_website")}</span><br /><a href={hospital.website} target="_blank" rel="nofollow noopener noreferrer" className="font-semibold text-blue-600 hover:underline truncate block">{hospital.website.replace(/^https?:\/\//, "")}</a></div>
            )}
            {hospital.email && (
              <div><span className="text-slate-400">{t(loc, "hosp_email")}</span><br /><a href={`mailto:${hospital.email}`} className="font-semibold text-blue-600 hover:underline">{hospital.email}</a></div>
            )}
          </div>
          {hospital.specialties && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <span className="text-slate-400 text-sm">{t(loc, "hosp_specialties")} </span>
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
          <p className="text-lg mb-2">{t(loc, "hosp_no_packages")}</p>
          <p className="text-sm">{t(loc, "hosp_check_back")}</p>
        </div>
      )}

      {/* Reviews */}
      {reviews.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4">{t(loc, "hosp_reviews")}</h2>
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
        <p className="text-sm font-semibold text-slate-700 mb-1">{t(loc, "hosp_compare_with")}</p>
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
            {t(loc, "hosp_compare_all")}
          </Link>
          <Link
            href={`/${locale}/enquiry`}
            className="border border-blue-200 text-blue-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-50 transition-colors text-center"
          >
            {t(loc, "hosp_ask_rec")}
          </Link>
        </div>
      </div>

      {/* Related guides */}
      <div className="mt-8">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">{t(loc, "hosp_guides")}</h2>
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
            {fmt(loc, "hosp_city_link", { city: hospital.city })}
          </Link>
          <span className="text-slate-400 ms-2">{fmt(loc, "hosp_city_sub", { city: hospital.city })}</span>
        </div>
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

      {/*
        One Hospital node, not two. The page used to emit a second, near-empty
        Hospital just to carry the review list, which leaves a validator (and
        an answer engine) to guess which of two same-named entities is the real
        one. Reviews, opening hours and the priced catalogue all hang off the
        single node now, keyed by @id so other pages can reference it.
      */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Hospital",
            "@id": `${shareUrl}#hospital`,
            name: hospital.name,
            mainEntityOfPage: shareUrl,
            ...(hospital.address ? {
              address: { "@type": "PostalAddress", streetAddress: hospital.address, addressLocality: hospital.city || hospital.area || "Bangkok", addressCountry: "TH" }
            } : hospital.area ? {
              address: { "@type": "PostalAddress", addressLocality: hospital.area, addressRegion: hospital.city || "Bangkok", addressCountry: "TH" }
            } : {}),
            ...(hospital.phone ? { telephone: hospital.phone } : {}),
            ...(hospital.lat && hospital.lng ? { geo: { "@type": "GeoCoordinates", latitude: hospital.lat, longitude: hospital.lng } } : {}),
            ...(hospital.rating ? { aggregateRating: { "@type": "AggregateRating", ratingValue: parseFloat(hospital.rating), bestRating: 5, reviewCount: hospital.review_count ?? 1 } } : {}),
            ...(reviews.length ? {
              review: reviews.map((r) => ({
                "@type": "Review",
                author: { "@type": "Person", name: r.author_name ?? "Patient" },
                ...(r.review_date ? { datePublished: r.review_date.slice(0, 10) } : {}),
                ...(r.rating ? { reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 } } : {}),
                ...(r.review_text ? { reviewBody: r.review_text } : {}),
              })),
            } : {}),
            ...(openingHoursSpec.length ? { openingHoursSpecification: openingHoursSpec } : {}),
            ...(hospital.jci ? { accreditedBy: { "@type": "Organization", name: "Joint Commission International (JCI)" } } : {}),
            ...(hospital.description ? { description: hospital.description } : {}),
            // The hospital's own site is the entity's `url`; the booking page
            // is a sameAs at best. Setting both to `url` silently kept
            // whichever spread ran last.
            ...(hospital.website ? { url: hospital.website } : {}),
            ...(hospital.checkup_url || hospital.google_maps_url ? {
              sameAs: [hospital.checkup_url, hospital.google_maps_url].filter(Boolean),
            } : {}),
            ...(hospital.email ? { email: hospital.email } : {}),
            ...(hospital.founded_year ? { foundingDate: String(hospital.founded_year) } : {}),
            ...(hospital.specialties ? { medicalSpecialty: hospital.specialties } : {}),
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: `Health Check-Up Packages at ${hospital.name}`,
              numberOfItems: hospital.package_count,
              // The prices are the whole reason this site exists; leaving the
              // catalogue as a bare count told an answer engine nothing it
              // could quote.
              itemListElement: hospital.packages
                .filter((p) => p.price)
                .slice(0, 40)
                .map((p, i) => ({
                  "@type": "Offer",
                  position: i + 1,
                  name: p.package_name,
                  price: parseFloat(p.price as string),
                  priceCurrency: "THB",
                  availability: "https://schema.org/InStock",
                  url: `${shareUrl}#pkg-${p.package_id}`,
                  ...(p.category ? { category: p.category } : {}),
                })),
            },
          }),
        }}
      />
    </div>
  );
}
