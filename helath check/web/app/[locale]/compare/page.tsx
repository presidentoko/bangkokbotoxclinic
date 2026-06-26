import type { Metadata } from "next";
import Link from "next/link";
import { type Locale, LOCALES, t, catLabel, CATEGORIES } from "@/lib/i18n";
import { getPackagesByCategory, getAllPackages, type PackageRow } from "@/lib/db";
import { ShareButtons } from "@/app/components/ShareButtons";

export const revalidate = 86400;

const BASE = "https://www.bangkoktopclinic.com";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { category } = await searchParams;
  const cat = category || "executive";
  const loc = locale as Locale;
  const label = catLabel(loc, cat);
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[l] = `${BASE}/${l}/compare?category=${cat}`;
  return {
    title: `${label} Health Check-Up Bangkok — Price Comparison`,
    description: `Compare ${label.toLowerCase()} health check-up packages at Bangkok hospitals. Real prices, JCI hospitals, MRI/CT/cancer marker inclusion table. Updated weekly.`,
    alternates: { canonical: `${BASE}/${locale}/compare?category=${cat}`, languages },
    openGraph: {
      title: `${label} Health Check-Up Bangkok — Compare Prices`,
      description: `Find the cheapest ${label.toLowerCase()} health check-up in Bangkok. ${rows_placeholder} packages compared side-by-side.`,
      url: `${BASE}/${locale}/compare?category=${cat}`,
    },
  };
}
// placeholder removed at runtime — TS is happy since generateMetadata runs server-side
const rows_placeholder = "";

function Flag({ val }: { val: number | null }) {
  if (val === 1) return <span className="text-emerald-600 font-bold" title="Included">✓</span>;
  if (val === 0) return <span className="text-slate-300" title="Not included">✗</span>;
  return <span className="text-amber-400" title="Not specified">?</span>;
}

function JciBadge() {
  return (
    <span className="inline-block bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">JCI</span>
  );
}

function CategoryTab({ locale, cat, active, label }: { locale: Locale; cat: string; active: boolean; label: string }) {
  return (
    <Link
      href={`/${locale}/compare?category=${cat}`}
      className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
        active ? "bg-blue-600 text-white shadow-sm" : "bg-white text-slate-600 border border-slate-200 hover:border-blue-400 hover:text-blue-600"
      }`}
    >
      {label}
    </Link>
  );
}

function SortLink({ locale, category, sortKey, current, children }: { locale: Locale; category: string; sortKey: string; current: string; children: React.ReactNode }) {
  const isActive = current === sortKey;
  return (
    <Link href={`/${locale}/compare?category=${category}&sort=${sortKey}`}
      className={`inline-flex items-center gap-1 ${isActive ? "text-blue-300 font-bold" : "hover:text-blue-200"}`}>
      {children}
      <span className={`text-[10px] ${isActive ? "text-blue-300" : "text-slate-400"}`}>▲</span>
    </Link>
  );
}

/* Mobile card for a single package row */
function MobilePackageCard({ row, loc, activeCat }: { row: PackageRow; loc: Locale; activeCat: string }) {
  const price = row.price ? `฿${parseFloat(row.price).toLocaleString()}` : "—";
  const bookUrl = row.source_url || row.checkup_url || "#";
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2 mb-1">
        <div className="min-w-0">
          <Link href={`/${loc}/hospital/${row.hospital_slug}`} className="font-bold text-slate-800 hover:text-blue-700 text-sm leading-snug block truncate">
            {row.hospital_name}
          </Link>
          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
            {row.jci === 1 && <JciBadge />}
            {row.rating && <span className="text-xs text-amber-500 font-semibold">★ {parseFloat(row.rating).toFixed(1)}</span>}
            {row.area && <span className="text-xs text-slate-400">{row.area}</span>}
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-lg font-bold text-blue-700">{price}</p>
          {row.results_days != null && <p className="text-xs text-slate-400">{row.results_days}d results</p>}
        </div>
      </div>

      <p className="text-sm text-slate-600 mb-3 leading-snug">{row.package_name}</p>

      <div className="grid grid-cols-4 gap-1 text-xs mb-3">
        {[
          { label: "Blood", val: row.has_blood },
          { label: "MRI", val: row.has_mri },
          { label: "Cancer", val: row.has_cancer_marker },
          { label: "CT", val: row.has_ct },
          { label: "X-Ray", val: row.has_xray },
          { label: "Doctor", val: row.has_doctor_consult },
          { label: "Ultrasound", val: row.has_ultrasound },
          { label: "Interpreter", val: row.has_interpreter },
        ].map(({ label, val }) => (
          <div key={label} className="bg-slate-50 rounded px-1.5 py-1 text-center">
            <div className="text-[10px] text-slate-400 leading-tight">{label}</div>
            <Flag val={val} />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <a
          href={`/api/track?pkg=${row.package_id}&url=${encodeURIComponent(bookUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-blue-600 text-white text-sm font-bold py-2.5 rounded-xl text-center hover:bg-blue-700 transition-colors"
        >
          {t(loc, "book_now")}
        </a>
        <Link
          href={`/${loc}/hospital/${row.hospital_slug}`}
          className="text-sm text-blue-600 border border-blue-200 px-3 py-2.5 rounded-xl hover:bg-blue-50 transition-colors whitespace-nowrap"
        >
          Details →
        </Link>
      </div>
    </div>
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
  const parts = [
    `${label} health check-up packages in Bangkok range from ฿${min} to ฿${max} across ${rows.length} package${rows.length > 1 ? "s" : ""} at top international hospitals.`,
  ];
  if (jciCount > 0) parts.push(`${jciCount} JCI-accredited hospital${jciCount > 1 ? "s" : ""} offer this type.`);
  if (withMri > 0) parts.push(`${withMri} package${withMri > 1 ? "s include" : " includes"} MRI scanning.`);
  if (withCancer > 0) parts.push(`${withCancer} include cancer marker tests.`);
  if (withInterp > 0) parts.push(`${withInterp} offer an interpreter service.`);
  return parts.join(" ");
}

const CATEGORY_FAQS: Record<string, { q: string; a: string }[]> = {
  executive: [
    { q: "How much is an executive health check-up in Bangkok?", a: "Executive health check-ups in Bangkok typically range from ฿10,000 to ฿60,000 depending on the hospital tier and inclusions. JCI-accredited flagship hospitals such as Bumrungrad and Bangkok Hospital tend to sit at the higher end, while mid-tier hospitals like Praram 9 and Phyathai offer competitive pricing." },
    { q: "Does an executive health check-up in Bangkok include MRI?", a: "Not always — MRI is an optional add-on at some hospitals. Use the comparison table above and filter by the MRI column to see which executive packages include it as standard. Expect to pay ฿5,000–฿15,000 extra if MRI is not bundled." },
    { q: "Which Bangkok hospital is best for an executive health check-up?", a: "Bumrungrad International and Bangkok Hospital (BDMS) are the most comprehensive, with full English-speaking staff and the widest range of executive packages. For better value, Vejthani Hospital and BNH Hospital offer excellent packages at lower price points." },
  ],
  comprehensive: [
    { q: "What is included in a comprehensive health check-up in Bangkok?", a: "A comprehensive health check-up in Bangkok typically includes a full blood panel (CBC, lipids, liver, kidney, thyroid), chest X-ray, abdominal ultrasound, ECG, urine and stool analysis, and a physician consultation. Premium packages add CT, MRI, and cancer marker tests." },
    { q: "How long does a comprehensive check-up take in Bangkok?", a: "A comprehensive check-up usually takes 3–5 hours at the hospital. Results are typically available within 1–3 business days, though same-day results are offered by some hospitals for an additional fee." },
    { q: "How much is a comprehensive check-up in Bangkok?", a: "Comprehensive health check-up packages in Bangkok range from approximately ฿5,000 for a basic panel to over ฿80,000 for a full-body scan with cancer screening. Most mid-range comprehensive packages at reputable hospitals fall between ฿15,000–฿35,000." },
  ],
  cancer: [
    { q: "Which Bangkok hospitals offer cancer marker screening?", a: "Most JCI-accredited hospitals in Bangkok offer tumour marker packages (AFP, CEA, CA-125, PSA). Bumrungrad, Bangkok Hospital, BNH, and Vejthani are among the most comprehensive. Prices range from around ฿3,000 for a basic panel to ฿25,000+ for CT-enhanced cancer screening." },
    { q: "What cancer tests are included in a Bangkok cancer screening package?", a: "Standard cancer screening in Bangkok typically includes AFP (liver), CEA (colon), CA-125 (ovarian), CA 19-9 (pancreas), and PSA (prostate for men). Premium packages add mammogram, Pap smear, and low-dose CT for lung cancer detection." },
    { q: "Is cancer screening at Bangkok hospitals accurate?", a: "Yes — Bangkok's JCI-accredited hospitals use internationally certified laboratory equipment. Tumour marker tests have specific sensitivity/specificity rates and are best used alongside imaging (ultrasound, CT, MRI). A physician consultation to interpret results is always recommended." },
  ],
  cardiac: [
    { q: "What does a cardiac health check-up in Bangkok include?", a: "A cardiac health check-up in Bangkok typically includes resting ECG, echocardiogram, lipid panel (cholesterol, triglycerides, HDL, LDL), blood pressure monitoring, and a cardiology consultation. Advanced packages add exercise stress test (EST) or coronary CT angiography." },
    { q: "How much does a cardiac check-up cost in Bangkok?", a: "Basic cardiac screening packages in Bangkok start from around ฿5,000. Comprehensive cardiac packages including echocardiogram and stress test range from ฿15,000–฿40,000 at JCI hospitals. The exercise stress test alone costs approximately ฿3,000–฿8,000." },
  ],
  women: [
    { q: "What is included in a women's health check-up in Bangkok?", a: "Women's health check-up packages in Bangkok typically include Pap smear, mammogram, breast ultrasound, pelvic ultrasound, bone density test (for 40+), complete blood count, hormonal panel, and thyroid function. Some packages add HPV testing and CA-125 cancer marker." },
    { q: "How much is a women's health check-up in Bangkok?", a: "Women's health check-up packages in Bangkok range from ฿5,000 for a basic gynaecological screen to ฿30,000+ for a comprehensive package including mammogram, bone density, and hormonal panel. Most mid-range women's packages cost ฿8,000–฿18,000." },
  ],
  men: [
    { q: "What is included in a men's health check-up in Bangkok?", a: "Men's health check-up packages in Bangkok typically include PSA (prostate cancer marker), testosterone levels, complete blood count, lipid panel, liver and kidney function, abdominal ultrasound, and a physician consultation. Advanced packages add cardiac stress test and cancer screening." },
    { q: "How much is a men's health check-up in Bangkok?", a: "Men's health check-up packages in Bangkok range from ฿4,000 for a basic panel to ฿25,000+ for a comprehensive package including PSA and cardiac screening. Mid-range men's packages at reputable hospitals typically cost ฿8,000–฿15,000." },
  ],
  basic: [
    { q: "What is a basic health check-up in Bangkok?", a: "A basic health check-up in Bangkok includes essential tests: complete blood count (CBC), fasting blood sugar, lipid panel, liver enzymes, kidney function, urine analysis, blood pressure, and weight/BMI. It is ideal for young, healthy adults as an annual baseline." },
    { q: "How much is a basic health check-up in Bangkok?", a: "Basic health check-up packages in Bangkok typically cost ฿1,500–฿5,000. Most hospitals offer annual basic packages at this price point. For expats and tourists, ฿3,000–฿5,000 at a private hospital like Phyathai or Praram 9 provides a thorough baseline check." },
  ],
  age: [
    { q: "What health check-up should I get based on my age in Bangkok?", a: "Bangkok hospitals offer age-tailored programmes: Under 30 — basic blood panel + urine (฿3,000–฿6,000). Age 30–45 — adds cholesterol, blood sugar, liver (฿8,000–฿18,000). Age 45–60 — adds colonoscopy prep, bone density, cardiac (฿15,000–฿35,000). Age 60+ — comprehensive geriatric screen (฿20,000–฿50,000)." },
    { q: "Which Bangkok hospital has the best age-based health check-up packages?", a: "Bangkok Hospital (BDMS) and Phyathai Hospital group offer the most detailed age-stratified packages, with specific programmes for under-30, 30–40, 40–50, and 50+ age groups. Prices are clearly listed by age bracket and gender, making comparison straightforward." },
  ],
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
    <div className="mx-auto max-w-7xl px-4 py-6 md:py-8">
      {/* Page heading + share */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
            Bangkok Health Check-Up Price Comparison
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            {catLabel(loc, activeCat)} · {rows.length} packages · No sponsored listings
          </p>
        </div>
        <div className="shrink-0">
          <ShareButtons title={shareTitle} url={shareUrl} />
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((cat) => (
          <CategoryTab key={cat} locale={loc} cat={cat} active={cat === activeCat} label={catLabel(loc, cat)} />
        ))}
      </div>

      {/* AEO intro */}
      {aeoSummary && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-sm text-slate-700 mb-5">
          <span className="font-semibold text-blue-800">Quick answer: </span>
          {aeoSummary}
        </div>
      )}

      {/* DB error */}
      {dbError && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-4 text-sm text-amber-800 mb-5">
          <strong>Database not connected.</strong> Configure DB_HOST / DB_USER / DB_PASS in environment variables.
        </div>
      )}

      {!dbError && rows.length === 0 ? (
        <p className="text-slate-400 text-center py-16">No packages found for this category yet.</p>
      ) : (
        <>
          {/* ── MOBILE: card list (hidden on md+) ── */}
          <div className="block md:hidden space-y-3 mb-6">
            {rows.map((row) => (
              <MobilePackageCard key={row.package_id} row={row} loc={loc} activeCat={activeCat} />
            ))}
          </div>

          {/* ── DESKTOP: comparison table (hidden on mobile) ── */}
          <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-200 shadow-sm mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-700 text-white">
                  <th className="text-left px-4 py-3 font-semibold min-w-[160px]">
                    <SortLink locale={loc} category={activeCat} sortKey="hospital" current={activeSort}>Hospital</SortLink>
                  </th>
                  <th className="text-left px-3 py-3 font-semibold">Area</th>
                  <th className="text-left px-3 py-3 font-semibold min-w-[200px]">Package</th>
                  <th className="text-right px-3 py-3 font-semibold min-w-[110px]">
                    <SortLink locale={loc} category={activeCat} sortKey="price" current={activeSort}>Price (THB)</SortLink>
                  </th>
                  <th className="text-center px-2 py-3 font-semibold" title="Blood test">🩸</th>
                  <th className="text-center px-2 py-3 font-semibold" title="X-Ray">☢</th>
                  <th className="text-center px-2 py-3 font-semibold" title="Ultrasound">🔊</th>
                  <th className="text-center px-2 py-3 font-semibold" title="CT Scan">CT</th>
                  <th className="text-center px-2 py-3 font-semibold" title="MRI">MRI</th>
                  <th className="text-center px-2 py-3 font-semibold" title="Cancer Markers">🧬</th>
                  <th className="text-center px-2 py-3 font-semibold" title="Doctor">👨‍⚕️</th>
                  <th className="text-center px-2 py-3 font-semibold" title="Interpreter">🌐</th>
                  <th className=