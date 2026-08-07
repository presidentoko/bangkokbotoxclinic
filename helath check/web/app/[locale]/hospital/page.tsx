import type { Metadata } from "next";
import Link from "next/link";
import { type Locale, hreflangMap } from "@/lib/i18n";
import { getHospitals, type HospitalSummary } from "@/lib/db";
import { HospitalSearch } from "@/app/components/HospitalSearch";

export const revalidate = 86400;

const BASE = "https://www.bangkoktopclinic.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  void locale;
  return {
    title: "Health Check-Up Hospitals in Thailand — Bangkok, Phuket, Chiang Mai",
    description: "Compare all hospitals offering health check-up packages across Thailand. Bangkok, Phuket, Chiang Mai and 19 more cities. Real prices, JCI-accredited hospitals listed.",
    alternates: {
      canonical: `${BASE}/${locale}/hospital`,
      languages: hreflangMap(`/hospital`),
    },
  };
}

const CITY_CITY: Record<string, string> = {
  Bangkok: "🏙️", "Chiang Mai": "🌸", Phuket: "🏝️", Pattaya: "🌊",
  "Hua Hin": "🏖️", "Ko Samui": "🌴", Krabi: "⛰️", "Chiang Rai": "🍵",
  "Hat Yai": "🦜", "Khon Kaen": "🌾", "Koh Chang": "🐘",
  "Udon Thani": "🏯", Korat: "🦁", Ayutthaya: "🛕",
  Rayong: "🏭", "Surat Thani": "🍜", Phitsanulok: "⚔️", Trang: "🦞",
};

export default async function HospitalsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale as Locale;

  // Unguarded on purpose: an empty directory cached as a 200 is worse than a
  // 500. See hospital/[slug]/page.tsx.
  const hospitals: HospitalSummary[] = await getHospitals();

  // Group by city
  const grouped: Record<string, HospitalSummary[]> = {};
  for (const h of hospitals) {
    const city = h.city || "Bangkok";
    if (!grouped[city]) grouped[city] = [];
    grouped[city].push(h);
  }
  const cityOrder = ["Bangkok", "Chiang Mai", "Phuket", "Pattaya", "Hua Hin", "Ko Samui",
    "Krabi", "Chiang Rai", "Hat Yai", "Khon Kaen", "Koh Chang", "Udon Thani",
    "Korat", "Ayutthaya", "Chon Buri", "Nakhon Si Thammarat", "Lampang", "Nakhon Pathom",
    "Rayong", "Surat Thani", "Phitsanulok", "Trang"];
  const sortedCities = [
    ...cityOrder.filter((c) => grouped[c]),
    ...Object.keys(grouped).filter((c) => !cityOrder.includes(c)),
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav className="text-sm text-slate-400 mb-6 flex items-center gap-2">
        <Link href={`/${locale}`} className="hover:text-blue-600">Home</Link>
        <span>›</span>
        <span className="text-slate-600">All Hospitals</span>
      </nav>

      <h1 className="text-2xl font-bold text-slate-900 mb-1">Health Check-Up Hospitals in Thailand</h1>
      <p className="text-slate-500 mb-6">{hospitals.length} hospitals across {sortedCities.length} cities — sorted by tier and rating</p>

      {/* JCI highlights */}
      {(() => {
        const jci = hospitals.filter((h) => h.jci === 1).slice(0, 6);
        if (!jci.length) return null;
        return (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded uppercase">JCI</span>
              <h2 className="text-base font-bold text-slate-800">Internationally accredited hospitals</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {jci.map((h) => (
                <Link key={h.slug} href={`/${locale}/hospital/${h.slug}`}
                  className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center hover:border-blue-400 hover:bg-blue-100 transition-all group">
                  <p className="text-[11px] font-bold text-slate-800 group-hover:text-blue-800 leading-snug mb-1">{h.name.replace("Hospital", "").replace("International", "Intl").trim()}</p>
                  {h.min_price && <p className="text-[10px] text-blue-600 font-semibold">฿{parseFloat(h.min_price).toLocaleString()}</p>}
                </Link>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Quick longtail links */}
      <div className="flex flex-wrap gap-2 mb-8">
        {[
          { href: `/${locale}/for/jci-accredited-health-checkup-bangkok`, label: "JCI hospitals only" },
          { href: `/${locale}/for/executive-health-checkup-bangkok`, label: "Executive packages" },
          { href: `/${locale}/for/budget-health-checkup-bangkok`, label: "Under ฿3,000" },
          { href: `/${locale}/for/cancer-screening-bangkok`, label: "Cancer screening" },
          { href: `/${locale}/for/womens-health-checkup-bangkok`, label: "Women's health" },
          { href: `/${locale}/for/japanese-health-checkup-bangkok`, label: "🇯🇵 Japanese" },
          { href: `/${locale}/for/arabic-health-checkup-bangkok`, label: "🌙 Arabic" },
          { href: `/${locale}/for/korean-health-checkup-bangkok`, label: "🇰🇷 Korean" },
          { href: `/${locale}/for/chinese-health-checkup-bangkok`, label: "🇨🇳 Chinese" },
          { href: `/${locale}/for/health-checkup-expats-bangkok`, label: "🌍 Expats" },
          { href: `/${locale}/for/digital-nomad-health-checkup-bangkok`, label: "💻 Digital Nomads" },
        ].map(({ href, label }) => (
          <Link key={href} href={href}
            className="text-xs border border-slate-200 rounded-full px-3 py-1.5 text-slate-600 hover:border-blue-300 hover:text-blue-700 bg-white transition-colors">
            {label}
          </Link>
        ))}
      </div>

      <HospitalSearch hospitals={hospitals} locale={locale} />

      {hospitals.length === 0 ? (
        <p className="text-slate-400">No hospitals yet.</p>
      ) : (
        <div className="space-y-10">
          {sortedCities.map((city) => (
            <section key={city}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-800">
                  {CITY_CITY[city] || "🏥"} {city}
                  <span className="text-sm font-normal text-slate-400 ms-2">({grouped[city].length})</span>
                </h2>
                <Link href={`/${locale}/city/${city.toLowerCase().replace(/ /g, '-')}`}
                  className="text-sm text-blue-600 hover:underline">
                  Compare {city} packages →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {grouped[city].map((h) => (
                  <Link
                    key={h.slug}
                    href={`/${locale}/hospital/${h.slug}`}
                    className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-slate-800 leading-snug text-sm">{h.name}</h3>
                      {h.jci === 1 && (
                        <span className="ms-2 bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase shrink-0">JCI</span>
                      )}
                    </div>
                    {h.area && h.area !== city && (
                      <p className="text-xs text-slate-400 mb-2">📍 {h.area}</p>
                    )}
                    {/* Google's classification. The scraped intake mixes real
                        hospitals with beauty salons and physiotherapy rooms,
                        so saying what each listing is beats letting the page
                        imply they are all hospitals. */}
                    {h.category_name && (
                      <p className="text-[11px] text-slate-500 mb-2">{h.category_name}</p>
                    )}
                    <div className="flex items-center gap-3 text-sm">
                      {h.rating && <span className="text-amber-500 font-semibold">★ {parseFloat(h.rating).toFixed(1)}</span>}
                      {h.review_count != null && h.review_count > 0 && (
                        <span className="text-slate-400 text-xs">{h.review_count.toLocaleString()} reviews</span>
                      )}
                    </div>
                    {(h.package_count > 0 || h.min_price) && (
                      <div className="flex gap-3 mt-2">
                        {h.package_count > 0 && <span className="text-slate-400 text-xs">{h.package_count} packages</span>}
                        {h.min_price && (
                          <span className="text-blue-700 font-semibold text-xs">from ฿{parseFloat(h.min_price).toLocaleString()}</span>
                        )}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Guide links */}
      <div className="mt-10 border-t border-slate-100 pt-8">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Health check-up guides</h2>
        <div className="flex flex-wrap gap-2">
          {[
            { href: `/${locale}/guide/what-is-included-checkup`, label: "What's included in each package tier" },
            { href: `/${locale}/guide/jci-hospitals-bangkok`, label: "JCI hospitals guide" },
            { href: `/${locale}/guide/bumrungrad-vs-samitivej-health-checkup`, label: "Bumrungrad vs Samitivej" },
            { href: `/${locale}/guide/vejthani-hospital-health-checkup`, label: "Vejthani Hospital guide" },
            { href: `/${locale}/guide/bnh-hospital-health-checkup`, label: "BNH Hospital guide" },
            { href: `/${locale}/guide/executive-health-checkup-bangkok`, label: "Executive packages guide" },
            { href: `/${locale}/guide/how-to-prepare-health-checkup-thailand`, label: "How to prepare" },
          ].map((g) => (
            <Link key={g.href} href={g.href}
              className="text-xs bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-colors">
              {g.label} →
            </Link>
          ))}
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Health Check-Up Hospitals in Thailand",
        description: "Compare health check-up packages across Thailand hospitals",
        numberOfItems: hospitals.length,
        itemListElement: hospitals.slice(0, 50).map((h, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "Hospital",
            name: h.name,
            url: `${BASE}/${locale}/hospital/${h.slug}`,
            ...(h.rating ? { aggregateRating: { "@type": "AggregateRating", ratingValue: parseFloat(h.rating), bestRating: 5, reviewCount: h.review_count ?? 1 } } : {}),
          },
        })),
      }) }} />
    </div>
  );
}
