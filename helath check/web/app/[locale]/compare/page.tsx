import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { type Locale, LOCALES, t, catLabel, CATEGORIES } from "@/lib/i18n";
import { getPackagesByCategory, getAllPackages, type PackageRow } from "@/lib/db";
import { ShareButtons } from "@/app/components/ShareButtons";
import { FilteredPackageGrid } from "@/app/components/FilteredPackageGrid";
import { RecentlyViewedBar } from "@/app/components/RecentlyViewed";

export const revalidate = 3600;

const BASE = "https://www.bangkoktopclinic.com";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; city?: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { category, city } = await searchParams;
  const cat = category || "executive";
  const loc = locale as Locale;
  const label = catLabel(loc, cat);
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[l] = `${BASE}/${l}/compare?category=${cat}`;
  const cityLabel = city ? ` in ${city}` : " Thailand";
  const cities = city ? city : "Bangkok, Phuket, Chiang Mai";
  return {
    title: `${label} Health Check-Up${cityLabel} — Compare Prices 2026`,
    description: `Compare ${label.toLowerCase()} health check-up packages across ${cities} hospitals. Real scraped prices, JCI status, MRI/CT/cancer marker inclusion filters. Updated weekly.`,
    alternates: { canonical: `${BASE}/${locale}/compare?category=${cat}`, languages },
    openGraph: {
      title: `${label} Health Check-Up${cityLabel} — Compare Prices`,
      description: `Find the best ${label.toLowerCase()} health check-up in ${cities}. Real prices, no ads, filter by MRI/cancer screening.`,
      url: `${BASE}/${locale}/compare?category=${cat}${city ? `&city=${city}` : ""}`,
    },
  };
}

function SortLink({ locale, category, sortKey, current, children }: {
  locale: Locale; category: string; sortKey: string; current: string; children: React.ReactNode
}) {
  const isActive = current === sortKey;
  return (
    <Link href={`/${locale}/compare?category=${category}&sort=${sortKey}`}
      className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors whitespace-nowrap ${
        isActive ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-blue-400"
      }`}>
      {children}
    </Link>
  );
}

function buildAeoSummary(cat: string, rows: PackageRow[]): string {
  if (!rows.length) return "";
  const prices = rows.map((r) => parseFloat(r.price ?? "0")).filter(Boolean);
  if (!prices.length) return "";
  const min = Math.min(...prices).toLocaleString();
  const max = Math.max(...prices).toLocaleString();
  const label = cat.charAt(0).toUpperCase() + cat.slice(1);
  const withMri = rows.filter((r) => r.has_mri === 1).length;
  const withCancer = rows.filter((r) => r.has_cancer_marker === 1).length;
  const withInterp = rows.filter((r) => r.has_interpreter === 1).length;
  const jciCount = [...new Set(rows.filter((r) => r.jci === 1).map((r) => r.hospital_slug))].length;
  const parts = [`${label} health check-up packages in Bangkok range from ฿${min} to ฿${max} across ${rows.length} packages.`];
  if (jciCount > 0) parts.push(`${jciCount} JCI-accredited hospital${jciCount > 1 ? "s" : ""} available.`);
  if (withMri > 0) parts.push(`${withMri} package${withMri > 1 ? "s include" : " includes"} MRI scanning.`);
  if (withCancer > 0) parts.push(`${withCancer} include cancer marker tests.`);
  if (withInterp > 0) parts.push(`${withInterp} offer interpreter service.`);
  return parts.join(" ");
}

const CATEGORY_FAQS: Record<string, { q: string; a: string }[]> = {
  executive: [
    { q: "How much is an executive health check-up in Bangkok?", a: "Executive health check-ups in Bangkok typically range from ฿10,000 to ฿60,000 depending on the hospital tier and inclusions. JCI-accredited hospitals such as Bumrungrad and Bangkok Hospital sit at the higher end, while hospitals like Praram 9 and Phyathai offer competitive pricing." },
    { q: "Does an executive health check-up in Bangkok include MRI?", a: "Not always — MRI is an optional add-on at some hospitals. Use the comparison above to see which executive packages include MRI as standard. Expect to pay ฿5,000–฿15,000 extra if not bundled." },
    { q: "Which Bangkok hospital is best for an executive health check-up?", a: "Bumrungrad International and Bangkok Hospital (BDMS) are the most comprehensive. For better value, Vejthani Hospital and BNH Hospital offer excellent packages at lower price points." },
  ],
  comprehensive: [
    { q: "What is included in a comprehensive health check-up in Bangkok?", a: "A comprehensive health check-up in Bangkok typically includes a full blood panel, chest X-ray, abdominal ultrasound, ECG, thyroid function, urine and stool analysis, and a physician consultation. Premium packages add CT, MRI, and cancer markers." },
    { q: "How long does a comprehensive check-up take in Bangkok?", a: "Most comprehensive check-ups take 3–5 hours at the hospital. Results are typically available within 1–3 business days, though same-day results are offered at some hospitals." },
    { q: "How much is a comprehensive check-up in Bangkok?", a: "Comprehensive health check-up packages range from ฿5,000 for a basic panel to ฿80,000+ for a full-body scan with cancer screening. Most mid-range comprehensive packages fall between ฿15,000–฿35,000." },
  ],
  cancer: [
    { q: "Which Bangkok hospitals offer cancer marker screening?", a: "Most JCI-accredited hospitals offer tumour marker packages (AFP, CEA, CA-125, PSA). Bumrungrad, Bangkok Hospital, BNH, and Vejthani are among the most comprehensive. Prices range from ฿3,000 for a basic panel to ฿25,000+ for CT-enhanced cancer screening." },
    { q: "What cancer tests are included in a Bangkok cancer screening package?", a: "Standard cancer screening includes AFP (liver), CEA (colon), CA-125 (ovarian), CA 19-9 (pancreas), and PSA (prostate for men). Premium packages add mammogram, Pap smear, and low-dose CT for lung cancer detection." },
  ],
  cardiac: [
    { q: "What does a cardiac health check-up in Bangkok include?", a: "A cardiac health check-up typically includes resting ECG, echocardiogram, lipid panel, blood pressure monitoring, and a cardiology consultation. Advanced packages add exercise stress test (EST) or coronary CT angiography." },
    { q: "How much does a cardiac check-up cost in Bangkok?", a: "Basic cardiac screening starts from around ฿5,000. Comprehensive cardiac packages including echocardiogram and stress test range from ฿15,000–฿40,000 at JCI hospitals." },
  ],
  women: [
    { q: "What is included in a women's health check-up in Bangkok?", a: "Women's health packages typically include Pap smear, mammogram, breast ultrasound, pelvic ultrasound, bone density test (for 40+), complete blood count, hormonal panel, and thyroid function. Some add HPV testing and CA-125 cancer marker." },
    { q: "How much is a women's health check-up in Bangkok?", a: "Women's health check-up packages range from ฿5,000 for basic gynaecological screen to ฿30,000+ for comprehensive package including mammogram, bone density, and hormonal panel." },
  ],
  men: [
    { q: "What is included in a men's health check-up in Bangkok?", a: "Men's health packages typically include PSA (prostate cancer marker), testosterone levels, complete blood count, lipid panel, liver and kidney function, abdominal ultrasound, and a physician consultation. Advanced packages add cardiac stress test and cancer screening." },
    { q: "How much is a men's health check-up in Bangkok?", a: "Men's health check-up packages range from ฿4,000 for a basic panel to ฿25,000+ for a comprehensive package including PSA and cardiac screening." },
  ],
  basic: [
    { q: "What is a basic health check-up in Bangkok?", a: "A basic health check-up includes essential tests: complete blood count (CBC), fasting blood sugar, lipid panel, liver enzymes, kidney function, urine analysis, blood pressure, and BMI. Ideal for young, healthy adults as an annual baseline." },
    { q: "How much is a basic health check-up in Bangkok?", a: "Basic health check-up packages in Bangkok typically cost ฿1,500–฿5,000. Most hospitals offer annual basic packages at this price point." },
  ],
  age: [
    { q: "What health check-up should I get based on my age in Bangkok?", a: "Bangkok hospitals offer age-tailored programmes: Under 30 — basic blood panel (฿3,000–฿6,000). Age 30–45 — adds cholesterol, blood sugar, liver (฿8,000–฿18,000). Age 45–60 — adds cardiac, bone density (฿15,000–฿35,000). Age 60+ — comprehensive geriatric screen (฿20,000–฿50,000)." },
    { q: "Which Bangkok hospital has the best age-based health check-up packages?", a: "Bangkok Hospital (BDMS) and Phyathai Hospital group offer the most detailed age-stratified packages, with specific programmes for each age bracket clearly listed by gender." },
  ],
  senior: [
    { q: "What is a senior health check-up package in Bangkok?", a: "Senior packages are designed for adults 60+ and include age-appropriate tests: bone density scan (DEXA), cognitive function assessment, prostate health (PSA for men), colorectal cancer markers, cardiac risk assessment, thyroid, and a geriatric physician consultation. Prices range from ฿3,500 for a basic senior screen to ฿40,000 for an executive senior package." },
    { q: "Which Bangkok hospital is best for senior health check-ups?", a: "Bumrungrad International has a dedicated Geriatric & Senior Health Centre. Samitivej Sukhumvit has the most comprehensive senior packages for women. Bangkok Hospital (BDMS) has the widest senior programme range across all cities." },
  ],
  diabetes: [
    { q: "What diabetes tests can I get at Bangkok hospitals?", a: "Bangkok private hospitals offer fasting blood glucose (฿100–฿300), HbA1c (฿300–฿600), fasting insulin, 2-hour OGTT (oral glucose tolerance test), C-peptide, and microalbumin for kidney monitoring. A full diabetic metabolic panel costs ฿1,500–฿9,000 depending on what's included." },
    { q: "Do I need to fast for a diabetes blood test in Bangkok?", a: "Yes, fasting for 8–12 hours is required for fasting glucose and most HbA1c tests. Book a morning appointment, drink only water, and bring your current medications list. Most Bangkok private hospitals offer walk-in blood tests with same-day results." },
  ],
};

const CAT_ICONS: Record<string, string> = {
  executive: "💼", comprehensive: "🔬", cancer: "🎗️",
  cardiac: "❤️", women: "♀️", men: "♂️", basic: "📋", age: "🗓️",
};

export default async function ComparePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; sort?: string }>;
}) {
  const { locale } = await params;
  const { category, sort } = await searchParams;
  const loc = locale as Locale;

  const activeCat = CATEGORIES.includes(category as never) ? category! : "executive";
  const activeSort = sort || "price";

  let rows: PackageRow[] = [];
  let dbError = false;
  try {
    rows = activeCat === "all"
      ? await getAllPackages(activeSort)
      : await getPackagesByCategory(activeCat, activeSort);
  } catch {
    dbError = true;
  }

  const aeoSummary = buildAeoSummary(activeCat, rows);
  const faqs = CATEGORY_FAQS[activeCat] ?? [];
  const shareUrl = `${BASE}/${locale}/compare?category=${activeCat}`;
  const shareTitle = `${catLabel(loc, activeCat)} Health Check-Up Bangkok — Compare Prices`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
            Bangkok Health Check-Up
          </h1>
          <p className="text-slate-500 mt-1 text-sm flex items-center gap-1.5">
            <span>{CAT_ICONS[activeCat]}</span>
            <span className="font-semibold text-slate-700">{catLabel(loc, activeCat)}</span>
            <span>·</span>
            <span>{rows.length} packages</span>
            <span>·</span>
            <span className="text-emerald-600 font-medium">No sponsored listings</span>
          </p>
        </div>
        <div className="shrink-0">
          <ShareButtons title={shareTitle} url={shareUrl} />
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        {CATEGORIES.map((cat) => (
          <Link key={cat} href={`/${loc}/compare?category=${cat}`}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              cat === activeCat
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:border-blue-400 hover:text-blue-600"
            }`}>
            <span>{CAT_ICONS[cat]}</span>
            {catLabel(loc, cat)}
          </Link>
        ))}
      </div>

      {/* AEO answer box */}
      {aeoSummary && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl px-5 py-4 text-sm text-slate-700 mb-5 flex items-start gap-3">
          <span className="text-xl shrink-0">💡</span>
          <p><span className="font-semibold text-blue-800">Quick answer: </span>{aeoSummary}</p>
        </div>
      )}

      {/* Sort bar */}
      {rows.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <span className="text-xs text-slate-500 font-medium">Sort by:</span>
          <SortLink locale={loc} category={activeCat} sortKey="price" current={activeSort}>💰 Cheapest</SortLink>
          <SortLink locale={loc} category={activeCat} sortKey="price_desc" current={activeSort}>⬆ Most expensive</SortLink>
          <SortLink locale={loc} category={activeCat} sortKey="rating" current={activeSort}>⭐ Highest rated</SortLink>
          <SortLink locale={loc} category={activeCat} sortKey="results_days" current={activeSort}>⚡ Fastest results</SortLink>
        </div>
      )}

      {/* DB Error */}
      {dbError && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 text-sm text-amber-800 mb-5">
          <strong>Database not connected.</strong> Configure DB_HOST / DB_USER / DB_PASS.
        </div>
      )}

      <RecentlyViewedBar locale={locale} />
      {/* Filtered card grid with search */}
      {!dbError && rows.length === 0 ? (
        <p className="text-slate-400 text-center py-16">No packages found for this category yet.</p>
      ) : (
        <Suspense fallback={<div className="h-20" />}>
          <FilteredPackageGrid rows={rows} loc={loc} />
        </Suspense>
      )}

      {/* Legend */}
      <p className="text-xs text-slate-400 mb-8">
        <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded mr-1">JCI</span>
        JCI = Joint Commission International accreditation &nbsp;·&nbsp;
        <span className="text-emerald-600 font-bold">✓</span> Included &nbsp;·&nbsp;
        <span className="text-slate-300">✗</span> Not included &nbsp;·&nbsp;
        Prices in Thai Baht (฿). Updated weekly.
      </p>

      {/* AEO block for crawlers */}
      {rows.length > 0 && (
        <section className="bg-white rounded-2xl border border-slate-100 p-5 md:p-6 mb-8">
          <h2 className="text-base font-bold text-slate-800 mb-2">
            {catLabel(loc, activeCat)} Health Check-Up in Bangkok
          </h2>
          <p className="text-slate-600 text-sm">{aeoSummary}</p>
          <p className="text-slate-400 text-xs mt-3">
            Data scraped from hospital websites. No paid placement. Updated weekly.
          </p>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <details key={i} className="bg-white border border-slate-200 rounded-2xl px-5 py-4 group open:shadow-sm">
                <summary className="font-semibold text-slate-800 cursor-pointer list-none flex justify-between items-center gap-3">
                  <span>{faq.q}</span>
                  <span className="text-slate-400 group-open:rotate-180 transition-transform text-xs shrink-0">▼</span>
                </summary>
                <p className="mt-3 text-slate-600 text-sm leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Hospital browse */}
      {rows.length > 0 && (
        <section className="border-t border-slate-100 pt-6">
          <h2 className="text-sm font-semibold text-slate-600 mb-3">Browse by hospital</h2>
          <div className="flex flex-wrap gap-2">
            {[...new Set(rows.map((r) => r.hospital_slug))].map((slug) => {
              const name = rows.find((r) => r.hospital_slug === slug)?.hospital_name ?? slug;
              return (
                <Link key={slug} href={`/${loc}/hospital/${slug}`}
                  className="text-sm text-blue-600 hover:underline bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-full transition-colors">
                  {name}
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Related guides */}
      <section className="border-t border-slate-100 pt-6 mt-6">
        <h2 className="text-sm font-semibold text-slate-600 mb-3">Related guides</h2>
        <div className="flex flex-wrap gap-2">
          {[
            { href: `/${locale}/guide/what-is-included-checkup`, label: "What's in each package tier" },
            { href: `/${locale}/guide/how-to-prepare-health-checkup-thailand`, label: "How to prepare" },
            { href: `/${locale}/guide/understanding-health-checkup-results`, label: "Understanding your results" },
            { href: `/${locale}/guide/jci-hospitals-bangkok`, label: "JCI hospitals guide" },
            { href: `/${locale}/guide/private-vs-government-hospital-thailand`, label: "Private vs government" },
          ].map((g) => (
            <Link key={g.href} href={g.href}
              className="text-xs bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-colors">
              {g.label} →
            </Link>
          ))}
        </div>
      </section>

      {/* BreadcrumbList */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "BangkokCheckup", item: `${BASE}/${locale}` },
          { "@type": "ListItem", position: 2, name: "Compare", item: `${BASE}/${locale}/compare` },
          { "@type": "ListItem", position: 3, name: catLabel("en", activeCat), item: `${BASE}/${locale}/compare?category=${activeCat}` },
        ],
      }) }} />

      {/* Schema: ItemList */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "ItemList",
        name: `${catLabel("en", activeCat)} Health Check-Up Bangkok`,
        numberOfItems: rows.length,
        itemListElement: rows.map((r, i) => ({
          "@type": "ListItem", position: i + 1,
          item: {
            "@type": "Product", name: r.package_name,
            offers: { "@type": "Offer", price: r.price ?? "0", priceCurrency: "THB",
              availability: "https://schema.org/InStock",
              seller: { "@type": "MedicalOrganization", name: r.hospital_name } },
          },
        })),
      }) }} />

      {faqs.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org", "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question", name: faq.q,
            acceptedAnswer: { "@type": "Answer", text: faq.a },
          })),
        }) }} />
      )}
    </div>
  );
}
