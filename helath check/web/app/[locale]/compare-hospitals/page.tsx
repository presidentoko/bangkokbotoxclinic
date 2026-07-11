import type { Metadata } from "next";
import Link from "next/link";
import { type Locale, LOCALES } from "@/lib/i18n";
import { getHospital, type HospitalDetail, type PackageRow } from "@/lib/db";

export const revalidate = 86400;

const BASE = "https://www.bangkoktopclinic.com";

export async function generateMetadata({
  params, searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ a?: string; b?: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  void locale;
  const { a, b } = await searchParams;
  const languages = Object.fromEntries(LOCALES.map((l) => [l, `${BASE}/${l}/compare-hospitals`]));
  if (!a || !b) return {
    title: "Compare Hospitals — BangkokCheckup",
    alternates: { canonical: `${BASE}/en/compare-hospitals`, languages },
  };
  return {
    title: `Compare ${a} vs ${b} — Health Check-Up Packages Bangkok`,
    description: `Side-by-side comparison of health check-up packages, prices, and inclusions at ${a} vs ${b} in Thailand. JCI status, MRI, cancer markers.`,
    alternates: { canonical: `${BASE}/en/compare-hospitals?a=${a}&b=${b}`, languages },
  };
}

function catColor(cat: string | null) {
  const MAP: Record<string, string> = {
    comprehensive: "bg-purple-100 text-purple-800",
    executive: "bg-blue-100 text-blue-800",
    standard: "bg-sky-100 text-sky-800",
    cancer: "bg-rose-100 text-rose-800",
    women: "bg-pink-100 text-pink-800",
    men: "bg-cyan-100 text-cyan-800",
    senior: "bg-amber-100 text-amber-800",
    cardiac: "bg-red-100 text-red-800",
    heart: "bg-red-100 text-red-800",
    basic: "bg-slate-100 text-slate-700",
  };
  return MAP[cat ?? ""] ?? "bg-slate-100 text-slate-600";
}

function Flag({ val }: { val: number | null }) {
  if (val === 1) return <span className="text-emerald-500 font-bold">✓</span>;
  return <span className="text-slate-300">—</span>;
}

function HospitalCol({ h, locale }: { h: HospitalDetail; locale: string }) {
  const cats = [...new Set(h.packages.map((p) => p.category).filter(Boolean))];
  const minPkg = h.packages.reduce((best: PackageRow | null, p) => {
    if (!p.price) return best;
    if (!best || parseFloat(p.price) < parseFloat(best.price ?? "99999999")) return p;
    return best;
  }, null);

  return (
    <div className="flex-1 min-w-0">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-4">
        <h2 className="text-lg font-bold text-slate-900 leading-snug mb-1">{h.name}</h2>
        {h.city && <p className="text-sm text-slate-500 mb-2">📍 {h.city}</p>}
        <div className="flex flex-wrap gap-2 text-sm mb-3">
          {h.jci === 1 && <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded uppercase">JCI</span>}
          {h.rating && <span className="text-amber-500 font-semibold">★ {parseFloat(h.rating).toFixed(1)}</span>}
          {h.review_count != null && <span className="text-slate-400 text-xs">{h.review_count.toLocaleString()} reviews</span>}
        </div>
        {h.description && <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{h.description}</p>}
        <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
          {h.founded_year && <div><span className="text-slate-400">Founded</span><br /><strong>{h.founded_year}</strong></div>}
          {h.bed_count && <div><span className="text-slate-400">Beds</span><br /><strong>{h.bed_count.toLocaleString()}</strong></div>}
          {h.package_count > 0 && <div><span className="text-slate-400">Packages</span><br /><strong>{h.package_count}</strong></div>}
          {minPkg?.price && <div><span className="text-slate-400">From</span><br /><strong className="text-blue-700">฿{parseFloat(minPkg.price).toLocaleString()}</strong></div>}
        </div>
      </div>

      {/* Category coverage */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-4">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Package types</p>
        <div className="flex flex-wrap gap-1.5">
          {cats.map((c) => (
            <span key={c} className={`text-xs font-medium px-2 py-0.5 rounded-full ${catColor(c)}`}>{c}</span>
          ))}
        </div>
      </div>

      {/* Top packages */}
      <div className="space-y-2">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">All packages (sorted by price)</p>
        {[...h.packages].sort((a, b) => parseFloat(a.price ?? "9999999") - parseFloat(b.price ?? "9999999")).slice(0, 12).map((pkg) => (
          <div key={pkg.package_id} className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <p className="text-sm font-semibold text-slate-800 leading-snug">{pkg.package_name}</p>
                {pkg.category && <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded ${catColor(pkg.category)}`}>{pkg.category}</span>}
              </div>
              <p className="font-bold text-blue-700 whitespace-nowrap">฿{parseFloat(pkg.price ?? "0").toLocaleString()}</p>
            </div>
            <div className="grid grid-cols-4 gap-1 text-center text-xs">
              {[
                { label: "Blood", val: pkg.has_blood },
                { label: "X-Ray", val: pkg.has_xray },
                { label: "Ultrasound", val: pkg.has_ultrasound },
                { label: "ECG", val: pkg.has_ecg },
                { label: "CT", val: pkg.has_ct },
                { label: "MRI", val: pkg.has_mri },
                { label: "Cancer", val: pkg.has_cancer_marker },
                { label: "Interp.", val: pkg.has_interpreter },
              ].map((f) => (
                <div key={f.label} className="bg-slate-50 rounded py-1">
                  <div className="text-[10px] text-slate-400">{f.label}</div>
                  <Flag val={f.val} />
                </div>
              ))}
            </div>
            {h.checkup_url && (
              <a href={h.checkup_url} target="_blank" rel="noopener noreferrer"
                className="mt-2 block text-center text-xs text-blue-600 hover:underline">
                Book this package →
              </a>
            )}
          </div>
        ))}
        {h.packages.length > 12 && (
          <Link href={`/${locale}/hospital/${h.slug}`} className="block text-center text-sm text-blue-600 hover:underline py-2">
            View all {h.packages.length} packages →
          </Link>
        )}
      </div>
    </div>
  );
}

export default async function CompareHospitalsPage({
  params, searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ a?: string; b?: string }>;
}) {
  const { locale } = await params;
  const { a, b } = await searchParams;

  let hospA: HospitalDetail | null = null;
  let hospB: HospitalDetail | null = null;
  try {
    if (a) hospA = await getHospital(a);
    if (b) hospB = await getHospital(b);
  } catch { /* DB not ready */ }

  if (!a || !b || !hospA || !hospB) {
    const POPULAR_PAIRS = [
      { a: "bumrungrad-international-hospital", b: "samitivej-hospital-sukhumvit", label: "Bumrungrad vs Samitivej" },
      { a: "bumrungrad-international-hospital", b: "bangkok-hospital", label: "Bumrungrad vs Bangkok Hospital" },
      { a: "samitivej-hospital-sukhumvit", b: "vejthani-hospital", label: "Samitivej vs Vejthani" },
      { a: "bangkok-hospital", b: "phyathai-2-hospital", label: "Bangkok Hospital vs Phyathai 2" },
      { a: "bnh-hospital", b: "bumrungrad-international-hospital", label: "BNH vs Bumrungrad" },
      { a: "praram-9-hospital", b: "samitivej-hospital-sukhumvit", label: "Praram 9 vs Samitivej" },
    ];
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <nav className="text-sm text-slate-400 mb-6 flex items-center gap-2">
          <Link href={`/${locale}`} className="hover:text-blue-600">Home</Link>
          <span>›</span>
          <span className="text-slate-600">Compare Hospitals</span>
        </nav>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Compare Bangkok Hospital Packages</h1>
        <p className="text-slate-500 mb-8 text-sm">Side-by-side price and inclusion comparison for any two Bangkok hospitals.</p>
        <div className="mb-10">
          <h2 className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">Popular comparisons</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {POPULAR_PAIRS.map((pair) => (
              <Link key={pair.a + pair.b} href={`/${locale}/compare-hospitals?a=${pair.a}&b=${pair.b}`}
                className="bg-white border border-slate-200 rounded-xl px-4 py-3 hover:border-blue-300 hover:shadow-sm transition-all text-sm font-semibold text-slate-700 hover:text-blue-700">
                {pair.label} →
              </Link>
            ))}
          </div>
        </div>
        <p className="text-slate-400 text-xs mb-2">Or compare any two hospitals by visiting:</p>
        <code className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded block">/compare-hospitals?a=hospital-slug&b=other-hospital-slug</code>
        <div className="mt-6">
          <Link href={`/${locale}/hospital`} className="bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors inline-block">
            Browse all hospitals →
          </Link>
        </div>
        {(!hospA && a) && <p className="text-red-400 text-sm mt-4">Hospital &quot;{a}&quot; not found.</p>}
        {(!hospB && b) && <p className="text-red-400 text-sm mt-4">Hospital &quot;{b}&quot; not found.</p>}
      </div>
    );
  }

  const BASE = "https://www.bangkoktopclinic.com";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav className="text-sm text-slate-400 mb-6 flex items-center gap-2 flex-wrap">
        <Link href={`/${locale}`} className="hover:text-blue-600">Home</Link>
        <span>›</span>
        <Link href={`/${locale}/hospital`} className="hover:text-blue-600">Hospitals</Link>
        <span>›</span>
        <span className="text-slate-600">Compare</span>
      </nav>

      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
        {hospA.name} <span className="text-slate-400 font-normal">vs</span> {hospB.name}
      </h1>
      <p className="text-slate-500 text-sm mb-8">Side-by-side comparison of health check-up packages. Real prices, no ads.</p>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        <HospitalCol h={hospA} locale={locale} />
        <div className="hidden md:flex flex-col items-center pt-8 shrink-0">
          <div className="w-px h-full bg-slate-200 relative">
            <span className="absolute top-4 left-1/2 -translate-x-1/2 bg-white border border-slate-200 text-slate-500 text-xs font-bold px-2 py-1 rounded-full">VS</span>
          </div>
        </div>
        <HospitalCol h={hospB} locale={locale} />
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: `${hospA.name} vs ${hospB.name} — Health Check-Up Comparison`,
        numberOfItems: 2,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: hospA.name, url: `${BASE}/${locale}/hospital/${hospA.slug}` },
          { "@type": "ListItem", position: 2, name: hospB.name, url: `${BASE}/${locale}/hospital/${hospB.slug}` },
        ],
      }) }} />
    </div>
  );
}
