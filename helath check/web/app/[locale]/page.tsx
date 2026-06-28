import type { Metadata } from "next";
import Link from "next/link";
import { type Locale, t, catLabel, CATEGORIES, LOCALES } from "@/lib/i18n";
import { getStatsForHome, getPackagesByCategory, getCategories, getRecentPriceChanges, type PackageRow, type CategoryCount } from "@/lib/db";

export const revalidate = 3600;

const BASE = "https://www.bangkoktopclinic.com";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as Locale;
  return {
    title: `${t(loc, "site_name")} — Compare Health Check-Up Prices in Thailand`,
    description: "Compare real health check-up prices from 235+ hospitals across 18 cities in Thailand. Bangkok, Chiang Mai, Phuket, Pattaya and more. No ads, no sponsored listings.",
    alternates: {
      canonical: `${BASE}/en`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `${BASE}/${l}`])),
    },
    openGraph: {
      title: "Compare Health Check-Up Prices in Thailand — Real Prices, No Ads",
      description: "Real prices from 235 hospitals across Bangkok, Chiang Mai, Phuket and 15 more Thai cities. Executive, cancer, cardiac, women's screening and more.",
      url: `${BASE}/${locale}`,
    },
  };
}

const CAT_ICONS: Record<string, string> = {
  comprehensive: "🔬", executive: "💼", cancer: "🎗️",
  cardiac: "❤️", women: "♀️", men: "♂️", basic: "📋", age: "🗓️",
};

const CAT_DESC: Record<string, string> = {
  comprehensive: "Full body screening", executive: "Premium all-inclusive",
  cancer: "Tumour marker tests", cardiac: "Heart & vascular",
  women: "Women-specific panels", men: "Men-specific panels",
  basic: "Essential blood panel", age: "Age-tailored programs",
};

function Flag({ val }: { val: number | null }) {
  if (val === 1) return <span className="text-emerald-500 font-bold text-xs">✓</span>;
  if (val === 0) return <span className="text-slate-300 text-xs">✗</span>;
  return <span className="text-slate-300 text-xs">—</span>;
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const loc = locale as Locale;
  const base = `/${locale}`;

  let stats = { jciCount: 0, packageCount: 0, hospitalCount: 0 };
  let executiveRows: PackageRow[] = [];
  let catCounts: CategoryCount[] = [];
  let recentDrops: import("@/lib/db").PriceTrendRow[] = [];
  try {
    [stats, executiveRows, catCounts, recentDrops] = await Promise.all([
      getStatsForHome(),
      getPackagesByCategory("executive", "price"),
      getCategories(),
      getRecentPriceChanges(6).then((r) => r.filter((x) => x.change_pct < 0)).catch(() => []),
    ]);
  } catch { /* DB not connected yet */ }
  const catCountMap = Object.fromEntries(catCounts.map((c) => [c.category, c.count]));

  const cheapest = executiveRows.filter((r) => r.price)[0];
  const previewRows = executiveRows.slice(0, 6);

  return (
    <div>
      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 text-white">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-blue-500/40 rounded-full px-3 py-1 text-xs font-semibold text-blue-100 mb-4">
              ✓ No ads · No sponsored rankings · Real prices only
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              Compare Bangkok<br className="hidden sm:block" /> Health Check-Up Prices
            </h1>
            <p className="text-blue-100 text-lg mb-2 max-w-xl">
              Real prices scraped directly from hospital websites.
              {cheapest?.price && (
                <> Executive packages from <strong className="text-white">฿{parseFloat(cheapest.price).toLocaleString()}</strong>.</>
              )}
            </p>
            {stats.hospitalCount > 0 && (
              <p className="text-blue-200 text-sm mb-8">
                {stats.hospitalCount} hospitals · {stats.packageCount} packages · {stats.jciCount} JCI-accredited
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href={`${base}/compare?category=executive`}
                className="bg-white text-blue-700 font-bold px-6 py-3.5 rounded-xl hover:bg-blue-50 transition-colors text-center shadow-lg">
                Compare Executive Packages →
              </Link>
              <Link href={`${base}/compare`}
                className="border-2 border-white/50 text-white font-semibold px-6 py-3.5 rounded-xl hover:border-white hover:bg-white/10 transition-colors text-center">
                All categories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust bar ── */}
      {stats.hospitalCount > 0 && (
        <section className="bg-white border-b border-slate-100">
          <div className="mx-auto max-w-6xl px-4 py-4 flex flex-wrap justify-center gap-6 md:gap-10 text-center">
            {[
              { val: stats.hospitalCount, label: "Hospitals" },
              { val: stats.packageCount, label: "Packages" },
              { val: stats.jciCount, label: "JCI-accredited" },
              { val: "0", label: "Paid placements" },
            ].map(({ val, label }) => (
              <div key={label}>
                <p className="text-2xl md:text-3xl font-bold text-blue-700">{val}</p>
                <p className="text-xs text-slate-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Category cards ── */}
      <section className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Browse by check-up type</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
          {CATEGORIES.map((cat) => (
            <Link key={cat} href={`${base}/compare?category=${cat}`}
              className="bg-white rounded-xl border border-slate-200 p-4 hover:border-blue-300 hover:shadow-md transition-all group active:scale-95">
              <div className="text-2xl mb-2">{CAT_ICONS[cat]}</div>
              <p className="font-semibold text-slate-800 group-hover:text-blue-700 text-sm leading-snug">{catLabel(loc, cat)}</p>
              <p className="text-xs text-slate-400 mt-1">{CAT_DESC[cat]}</p>
              {catCountMap[cat] > 0 && (
                <p className="text-xs text-blue-600 font-semibold mt-2">{catCountMap[cat]} packages →</p>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* ── Browse by city ── */}
      <section className="mx-auto max-w-6xl px-4 pb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-slate-800">Browse health check-ups by city</h2>
          <Link href={`${base}/hospital`} className="text-sm text-blue-600 hover:underline font-medium">All 22 cities →</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {[
            { city: "bangkok", label: "Bangkok", emoji: "🏙️" },
            { city: "chiang-mai", label: "Chiang Mai", emoji: "🌸" },
            { city: "phuket", label: "Phuket", emoji: "🏝️" },
            { city: "pattaya", label: "Pattaya", emoji: "🌊" },
            { city: "hua-hin", label: "Hua Hin", emoji: "🏖️" },
            { city: "ko-samui", label: "Ko Samui", emoji: "🌴" },
            { city: "krabi", label: "Krabi", emoji: "⛰️" },
            { city: "chiang-rai", label: "Chiang Rai", emoji: "🍵" },
            { city: "hat-yai", label: "Hat Yai", emoji: "🦜" },
            { city: "khon-kaen", label: "Khon Kaen", emoji: "🌾" },
            { city: "udon-thani", label: "Udon Thani", emoji: "🏯" },
            { city: "korat", label: "Korat", emoji: "🦁" },
          ].map(({ city, label, emoji }) => (
            <Link key={city} href={`${base}/city/${city}`}
              className="bg-white border border-slate-200 rounded-xl p-3 text-center hover:border-blue-300 hover:shadow-sm transition-all group active:scale-95">
              <div className="text-2xl mb-1">{emoji}</div>
              <p className="text-xs font-semibold text-slate-700 group-hover:text-blue-700 leading-snug">{label}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="bg-gradient-to-br from-slate-50 to-blue-50/30 border-t border-b border-slate-100">
        <div className="mx-auto max-w-5xl px-4 py-12 md:py-16">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-10 text-center">How BangkokCheckup works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                icon: "🔍",
                title: "Browse real prices",
                desc: "Our scrapers pull prices directly from hospital websites weekly. No mark-ups, no \"call for price\", no ads.",
              },
              {
                step: "2",
                icon: "⚖️",
                title: "Compare what's included",
                desc: "Use filters to see which packages include MRI, cancer markers, interpreter service, or CT scan — side by side.",
              },
              {
                step: "3",
                icon: "📋",
                title: "Book direct or get advice",
                desc: "Book directly on the hospital's website (no middleman fee) or send us your requirements for a personalised recommendation.",
              },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center relative">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4 shadow-sm">
                  {item.step}
                </div>
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-slate-800 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Executive price preview table ── */}
      {previewRows.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800">Executive packages — top picks</h2>
            <Link href={`${base}/compare?category=executive`} className="text-sm text-blue-600 hover:underline font-medium">
              Full comparison →
            </Link>
          </div>

          {/* Mobile cards */}
          <div className="block md:hidden space-y-3">
            {previewRows.slice(0, 4).map((row) => (
              <Link key={row.package_id} href={`${base}/compare?category=executive`}
                className="block bg-white border border-slate-200 rounded-xl p-4 hover:border-blue-200 transition-colors">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{row.hospital_name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{row.package_name}</p>
                  </div>
                  <p className="font-bold text-blue-700 whitespace-nowrap text-sm">
                    {row.price ? `฿${parseFloat(row.price).toLocaleString()}` : "—"}
                  </p>
                </div>
                <div className="flex gap-3 mt-2 text-xs text-slate-500">
                  {row.jci === 1 && <span className="text-blue-600 font-semibold">JCI</span>}
                  {row.has_mri === 1 && <span>MRI ✓</span>}
                  {row.has_cancer_marker === 1 && <span>Cancer ✓</span>}
                  {row.has_interpreter === 1 && <span>Interpreter ✓</span>}
                </div>
              </Link>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-left border-b border-slate-200">
                  <th className="px-4 py-3 font-semibold">Hospital</th>
                  <th className="px-3 py-3 font-semibold">Package</th>
                  <th className="px-3 py-3 font-semibold text-right">Price (THB)</th>
                  <th className="px-3 py-3 font-semibold text-center">MRI</th>
                  <th className="px-3 py-3 font-semibold text-center">Cancer</th>
                  <th className="px-3 py-3 font-semibold text-center">Interpreter</th>
                </tr>
              </thead>
              <tbody>
                {previewRows.map((row, i) => (
                  <tr key={row.package_id} className={`border-t border-slate-100 hover:bg-blue-50/30 transition-colors ${i % 2 ? "bg-slate-50/40" : "bg-white"}`}>
                    <td className="px-4 py-3">
                      <span className="font-medium text-slate-800">{row.hospital_name}</span>
                      {row.jci === 1 && <span className="ml-1.5 bg-blue-100 text-blue-800 text-[10px] font-bold px-1 py-0.5 rounded uppercase">JCI</span>}
                      {row.rating && <span className="ml-2 text-amber-500 text-xs">★{parseFloat(row.rating).toFixed(1)}</span>}
                    </td>
                    <td className="px-3 py-3 text-slate-600 text-xs">{row.package_name}</td>
                    <td className="px-3 py-3 text-right font-bold text-slate-900">
                      {row.price ? `฿${parseFloat(row.price).toLocaleString()}` : "—"}
                    </td>
                    <td className="px-3 py-3 text-center"><Flag val={row.has_mri} /></td>
                    <td className="px-3 py-3 text-center"><Flag val={row.has_cancer_marker} /></td>
                    <td className="px-3 py-3 text-center"><Flag val={row.has_interpreter} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex justify-center">
            <Link href={`${base}/compare?category=executive`}
              className="bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-colors text-sm">
              See all {executiveRows.length} executive packages →
            </Link>
          </div>
        </section>
      )}

      {/* ── Recent price drops (only shown once data exists) ── */}
      {recentDrops.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">📉</span>
              <h2 className="text-xl font-bold text-slate-800">Recent price drops</h2>
            </div>
            <Link href={`${base}/trends`} className="text-sm text-blue-600 hover:underline font-medium">
              All price trends →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {recentDrops.map((d) => (
              <Link key={d.package_id} href={`${base}/hospital/${d.hospital_slug}`}
                className="bg-white border border-emerald-100 rounded-xl p-4 hover:border-emerald-300 hover:shadow-sm transition-all">
                <p className="font-semibold text-slate-800 text-sm leading-snug">{d.hospital_name}</p>
                <p className="text-xs text-slate-500 mt-0.5 mb-2 line-clamp-1">{d.package_name}</p>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold text-sm">{d.change_pct}%</span>
                  <span className="text-xs text-slate-400 line-through">฿{d.prev_price.toLocaleString()}</span>
                  <span className="text-sm font-bold text-slate-700">฿{d.latest_price.toLocaleString()}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Guides section ── */}
      <section className="mx-auto max-w-6xl px-4 pb-10 md:pb-14">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-slate-800">Health check-up guides</h2>
          <Link href={`${base}/guide/bangkok-health-checkup`} className="text-sm text-blue-600 hover:underline font-medium">All guides →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { slug: "bangkok-health-checkup", icon: "📋", title: "Bangkok Health Check-Up Guide", desc: "Costs, best hospitals, what to bring, how to book — complete 2026 guide." },
            { slug: "cancer-screening-bangkok", icon: "🎗️", title: "Cancer Screening in Bangkok", desc: "Tumour markers, imaging options, prices — who should get screened and when." },
            { slug: "womens-health-checkup-bangkok", icon: "♀️", title: "Women's Health Check-Up", desc: "Pap smear, mammogram, HPV, hormonal panel — full guide for women." },
            { slug: "cardiac-health-checkup-bangkok", icon: "❤️", title: "Cardiac Health Check-Up", desc: "ECG, stress test, coronary CTA — heart screening packages explained." },
            { slug: "jci-hospitals-bangkok", icon: "🏆", title: "JCI-Accredited Hospitals", desc: "All JCI hospitals in Bangkok, what the accreditation means, and prices." },
            { slug: "what-is-included-checkup", icon: "🔬", title: "What's Included in Each Package?", desc: "Basic vs comprehensive vs executive — every test explained by tier." },
          ].map((g) => (
            <Link key={g.slug} href={`${base}/guide/${g.slug}`}
              className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all group">
              <div className="text-2xl mb-3">{g.icon}</div>
              <h3 className="font-bold text-slate-800 group-hover:text-blue-700 text-sm mb-1.5 leading-snug">{g.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{g.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── City guides ── */}
      <section className="mx-auto max-w-6xl px-4 pb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-slate-800">Country comparisons — how much you save</h2>
          <Link href={`${base}/guide`} className="text-sm text-blue-600 hover:underline font-medium">All guides →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { slug: "health-checkup-usa-vs-thailand", title: "USA vs Thailand — How Much You Save", emoji: "🇺🇸", desc: "Bangkok packages cost 75–90% less than US out-of-pocket prices." },
            { slug: "health-checkup-uk-vs-thailand", title: "UK vs Thailand Health Check-Up", emoji: "🇬🇧", desc: "Skip NHS waits. Executive packages 65–75% cheaper in Bangkok." },
            { slug: "health-checkup-japan-vs-thailand", title: "Japan vs Thailand (Ningen Dock)", emoji: "🇯🇵", desc: "人間ドック equivalent packages at 50–70% below Japanese prices." },
            { slug: "health-checkup-malaysia-vs-thailand", title: "Malaysia vs Thailand (Hat Yai)", emoji: "🇲🇾", desc: "Hat Yai serves 100k+ Malaysian visitors/year. 40–60% cheaper." },
            { slug: "thailand-vs-singapore-health-checkup", title: "Singapore vs Thailand", emoji: "🇸🇬", desc: "Save 50–70% vs Singapore private hospitals. Same JCI quality." },
            { slug: "understanding-health-checkup-results", title: "Understanding Your Results", emoji: "📊", desc: "Normal ranges for blood glucose, cholesterol, cancer markers — explained." },
          ].map(({ slug, title, emoji, desc }) => (
            <Link key={slug} href={`${base}/guide/${slug}`}
              className="group flex gap-4 bg-white border border-slate-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-sm transition-all">
              <span className="text-2xl shrink-0">{emoji}</span>
              <div>
                <p className="font-semibold text-slate-800 group-hover:text-blue-700 text-sm leading-snug mb-1">{title}</p>
                <p className="text-xs text-slate-500">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Who is this for ── */}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <h2 className="text-xl font-bold text-slate-800 mb-5">Find the right package for you</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[
            { href: `${base}/for/jci-accredited-health-checkup-bangkok`, icon: "🏆", label: "JCI-Accredited Hospitals" },
            { href: `${base}/for/health-checkup-expats-bangkok`, icon: "🌍", label: "Expats in Bangkok" },
            { href: `${base}/for/japanese-health-checkup-bangkok`, icon: "🗾", label: "Japanese Tourists" },
            { href: `${base}/for/arabic-health-checkup-bangkok`, icon: "🌙", label: "Arabic Speakers" },
            { href: `${base}/for/korean-health-checkup-bangkok`, icon: "🇰🇷", label: "Korean / 한국어" },
            { href: `${base}/for/cancer-screening-bangkok`, icon: "🎗️", label: "Cancer Screening" },
            { href: `${base}/for/womens-health-checkup-bangkok`, icon: "♀️", label: "Women's Health" },
            { href: `${base}/for/budget-health-checkup-bangkok`, icon: "💰", label: "Budget Under ฿3k" },
            { href: `${base}/for/executive-health-checkup-bangkok`, icon: "💼", label: "Executive Packages" },
            { href: `${base}/for/cardiac-health-checkup-bangkok`, icon: "❤️", label: "Cardiac / Heart" },
            { href: `${base}/for/comprehensive-health-checkup-bangkok`, icon: "🔬", label: "Comprehensive" },
            { href: `${base}/for/senior-health-checkup-bangkok`, icon: "🧓", label: "Senior / 60+" },
            { href: `${base}/for/diabetes-screening-bangkok`, icon: "🩸", label: "Diabetes Screening" },
            { href: `${base}/for/health-checkup-tourists-thailand`, icon: "✈️", label: "Tourists (day trip)" },
          ].map((item) => (
            <Link key={item.href} href={item.href}
              className="bg-white border border-slate-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-sm transition-all group flex items-center gap-3">
              <span className="text-xl shrink-0">{item.icon}</span>
              <span className="text-xs font-semibold text-slate-700 group-hover:text-blue-700 leading-snug">{item.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Why this site ── */}
      <section className="bg-white border-t border-slate-100">
        <div className="mx-auto max-w-4xl px-4 py-12 md:py-16">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-8 text-center">Why use BangkokCheckup?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: "🔍", title: "Real prices only", desc: "Every price is scraped from the hospital's own website — not aggregators or ad networks." },
              { icon: "🏆", title: "No paid rankings", desc: "Packages sort by price. Hospitals can't pay for higher placement. Ever." },
              { icon: "🌏", title: "Multiple languages", desc: "Compare in English, Chinese, Japanese, Korean, Thai, and Arabic." },
            ].map((item) => (
              <div key={item.title} className="text-center p-4">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-slate-800 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="bg-blue-700 text-white">
        <div className="mx-auto max-w-4xl px-4 py-10 text-center">
          <h2 className="text-xl font-bold mb-2">Not sure which package is right for you?</h2>
          <p className="text-blue-200 text-sm mb-5">Tell us your requirements and we'll find the best match.</p>
          <Link href={`${base}/enquiry`}
            className="bg-white text-blue-700 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors inline-block">
            Get personalised advice →
          </Link>
        </div>
      </section>

      {/* Schema: WebSite */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "BangkokCheckup",
        url: BASE,
        description: "Compare health check-up prices at Bangkok hospitals. Real prices, no ads.",
        potentialAction: { "@type": "SearchAction", target: `${BASE}/en/compare?category={search_term_string}`, "query-input": "required name=search_term_string" },
      }) }} />

      {/* Schema: Organization */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "BangkokCheckup",
        url: BASE,
        logo: `${BASE}/logo.png`,
        sameAs: [],
        contactPoint: { "@type": "ContactPoint", contactType: "customer support", url: `${BASE}/en/enquiry`, availableLanguage: ["English", "Chinese", "Japanese", "Thai", "Arabic"] },
      }) }} />

      {/* Schema: FAQPage */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "How much does a health check-up cost in Bangkok?",
            acceptedAnswer: { "@type": "Answer", text: "Health check-up prices in Bangkok range from ฿2,000 for a basic blood panel to ฿80,000+ for a full executive package with MRI at a JCI hospital. A mid-range comprehensive package covering blood tests, ultrasound, chest X-ray and ECG typically costs ฿6,000–฿20,000. Prices at Bumrungrad and Samitivej are 20–40% higher than smaller private hospitals." }
          },
          {
            "@type": "Question",
            name: "Which Bangkok hospitals are JCI accredited?",
            acceptedAnswer: { "@type": "Answer", text: "JCI-accredited hospitals in Bangkok include Bumrungrad International Hospital, Bangkok Hospital (BDMS), Samitivej Hospital, BNH Hospital, Vejthani Hospital, Saint Louis Hospital, and Phyathai 2 Hospital. JCI accreditation is the international gold standard for hospital quality, awarded by the Joint Commission International (USA)." }
          },
          {
            "@type": "Question",
            name: "What is included in a Thai health check-up?",
            acceptedAnswer: { "@type": "Answer", text: "A standard Thai health check-up typically includes complete blood count (CBC), fasting blood glucose, lipid panel (cholesterol), liver function tests, kidney function tests, thyroid function (TSH), Hepatitis B, chest X-ray, abdominal ultrasound, ECG (electrocardiogram), urinalysis, blood pressure, BMI measurement, and a physician consultation." }
          },
          {
            "@type": "Question",
            name: "How long does a health check-up take in Thailand?",
            acceptedAnswer: { "@type": "Answer", text: "Most comprehensive health check-up packages at Thai private hospitals take 3–5 hours to complete. Basic packages (blood tests + X-ray only) can complete in 1–2 hours. Same-day results are available for most blood tests. Imaging reports (MRI, CT scan) may take an additional 1–2 hours for the radiologist's report." }
          },
          {
            "@type": "Question",
            name: "Is a health check-up in Thailand cheaper than in my home country?",
            acceptedAnswer: { "@type": "Answer", text: "Yes, significantly. An executive health check-up at a JCI hospital in Bangkok costs ฿15,000–฿40,000 (USD 415–1,100). An equivalent package in the USA costs USD 2,000–5,000, in the UK £500–2,000, in Australia AUD 800–3,000, and in the UAE AED 3,000–10,000. The savings are 50–80% even when including flights and accommodation." }
          },
          {
            "@type": "Question",
            name: "Do I need to fast before a health check-up in Thailand?",
            acceptedAnswer: { "@type": "Answer", text: "Yes — you should fast for 8–12 hours before your health check-up to ensure accurate blood glucose, cholesterol, and liver enzyme readings. Drink water freely during the fasting period. Schedule your appointment for the morning and skip breakfast the night before. Coffee, juice, and other beverages (except plain water) should also be avoided." }
          },
        ],
      }) }} />
    </div>
  );
}
