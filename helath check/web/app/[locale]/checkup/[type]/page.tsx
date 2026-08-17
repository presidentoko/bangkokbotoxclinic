import type { Metadata } from "next";
import Link from "next/link";
import { type Locale, catLabel, CATEGORIES, localeAlternates } from "@/lib/i18n";
import { permanentRedirect } from "next/navigation";
import { getCheckupCombos, getPackagesByCategory, type PackageRow } from "@/lib/db";
// PackageRow used for type annotation below

// Static — see the note in app/[locale]/page.tsx.
export const revalidate = false;

export async function generateStaticParams() {
  // Only the categories that have priced packages behind them. CATEGORIES
  // still lists names the importers use as staging values ("comprehensive",
  // "cardiac", "diabetes", "eye", ...) which fix_all_data.py redistributes to
  // zero; pre-rendering those built pages with an empty table and a
  // "0 packages" heading, which is what Search Console calls a soft 404.
  try {
    const combos = await getCheckupCombos();
    const real = Array.from(new Set(combos.map((c) => c.category)));
    return real.map((type) => ({ type }));
  } catch {
    return CATEGORIES.map((type) => ({ type }));
  }
}

// The live categories above are the whole param space. The eight staging
// names that no longer hold rows are 308'd to /compare by next.config.ts
// before routing, so an unknown type here really is not found.
export const dynamicParams = false;

const BASE = "https://www.bangkoktopclinic.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; type: string }>;
}): Promise<Metadata> {
  const { locale, type } = await params;
  const label = catLabel(locale as Locale, type);
  return {
    title: `${label} Health Check-Up in Thailand — Compare Prices (2026)`,
    description: `Compare ${label.toLowerCase()} health check-up packages across Thailand. Real prices from 235+ hospitals in Bangkok, Chiang Mai, Phuket and more. JCI-accredited options available.`,
    alternates: localeAlternates(locale, `/checkup/${type}`),
  };
}

const CAT_EDITORIAL: Record<string, { intro: string; priceRange: string; forWho: string; guide?: string }> = {
  executive: {
    intro: "Executive health check-ups include a comprehensive blood panel, abdominal ultrasound, ECG, chest X-ray, and a physician consultation — all in one appointment. Many packages also include cancer markers and specialist referrals.",
    priceRange: "฿8,000 – ฿80,000",
    forWho: "Corporate professionals, medical tourists, adults 40+, anyone wanting a thorough annual assessment.",
    guide: "bangkok-health-checkup",
  },
  comprehensive: {
    intro: "Comprehensive packages cover the full range of standard diagnostic tests: blood tests, imaging (ultrasound, X-ray), ECG, and specialist review. They typically include more blood markers than basic packages and add thyroid, hepatitis B/C, and urinalysis.",
    priceRange: "฿5,000 – ฿35,000",
    forWho: "Adults 30+, anyone with a family history of chronic illness, expats requiring an annual health report.",
    guide: "what-is-included-checkup",
  },
  cancer: {
    intro: "Cancer screening packages focus on tumour marker blood tests (AFP, CEA, CA-125, PSA, CA 19-9) alongside imaging. They are most useful for individuals with a family history of cancer or aged 45+.",
    priceRange: "฿3,000 – ฿25,000",
    forWho: "Adults 45+, anyone with family history of cancer, people seeking proactive screening.",
    guide: "cancer-screening-bangkok",
  },
  cardiac: {
    intro: "Cardiac health check-ups include ECG, echocardiogram, lipid panel, blood pressure, and physician consultation. Advanced packages add coronary CT angiography or exercise stress testing.",
    priceRange: "฿5,000 – ฿40,000",
    forWho: "Adults with high cholesterol, smokers, people with a family history of heart disease, those experiencing chest pain.",
    guide: "cardiac-health-checkup-bangkok",
  },
  women: {
    intro: "Women's health packages combine gynaecological screening (Pap smear, mammogram, pelvic ultrasound) with full blood work and hormonal panels. Some add HPV genotyping and bone density testing.",
    priceRange: "฿5,000 – ฿30,000",
    forWho: "Women 25+, those overdue for a cervical smear or mammogram, women experiencing hormonal symptoms.",
    guide: "womens-health-checkup-bangkok",
  },
  men: {
    intro: "Men's health packages include PSA (prostate cancer marker), testosterone, lipid panel, liver/kidney function, and abdominal ultrasound. Advanced packages add cardiac stress test and colonoscopy referral.",
    priceRange: "฿4,000 – ฿25,000",
    forWho: "Men 40+, anyone with prostate concerns, those wanting a comprehensive male health assessment.",
  },
  basic: {
    intro: "Basic packages cover the essential annual screen: complete blood count, blood sugar, cholesterol, liver and kidney function, urinalysis, and blood pressure. Ideal for healthy young adults.",
    priceRange: "฿1,500 – ฿5,000",
    forWho: "Young adults 20–35, those wanting a quick annual baseline, budget-conscious patients.",
    guide: "what-is-included-checkup",
  },
  senior: {
    intro: "Senior health check-ups are designed for adults 60+ with age-appropriate tests including bone density (DEXA), cognitive assessment, prostate/colorectal cancer markers, and geriatric physician consultation. Bangkok's private hospitals offer senior programmes at 40–60% less than Western counterparts.",
    priceRange: "฿3,500 – ฿40,000",
    forWho: "Adults 60+, retirees, medical tourists, anyone with multiple chronic conditions.",
    guide: "senior-health-checkup-thailand",
  },
  diabetes: {
    intro: "Diabetes screening packages test fasting blood glucose, HbA1c (3-month average), and often include insulin resistance score (HOMA-IR), kidney function (microalbumin), and lipid panel. Same-day results available at most Bangkok private hospitals.",
    priceRange: "฿800 – ฿9,000",
    forWho: "Pre-diabetics, adults with family history of T2DM, overweight individuals, adults over 45.",
    guide: "diabetes-screening-thailand",
  },
};

function Flag({ val }: { val: number | null }) {
  if (val === 1) return <span className="text-emerald-600">✓</span>;
  if (val === 0) return <span className="text-slate-300">✗</span>;
  return <span className="text-amber-400">?</span>;
}

export default async function CheckupTypePage({
  params,
}: {
  params: Promise<{ locale: string; type: string }>;
}) {
  const { locale, type } = await params;
  const loc = locale as Locale;

  // Unguarded on purpose: an empty listing cached as a 200 is worse than a
  // 500. See hospital/[slug]/page.tsx.
  const rows: PackageRow[] = await getPackagesByCategory(type, "price");

  // Belt and braces: next.config.ts already 308s the known-empty categories
  // to /compare before routing. This catches a category that empties out
  // between deploys, where a 200 saying "0 packages" would be a soft 404.
  if (rows.length === 0) permanentRedirect(`/${locale}/compare`);

  const label = catLabel(loc, type);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <nav className="text-sm text-slate-400 mb-4 flex items-center gap-2">
        <Link href={`/${locale}`} className="hover:text-blue-600">Home</Link>
        <span>›</span>
        <span className="text-slate-600">{label} check-up</span>
      </nav>

      <h1 className="text-2xl font-bold text-slate-900 mb-1">{label} Health Check-Up Bangkok</h1>
      <p className="text-slate-500 mb-4">Sorted by price · {rows.length} package{rows.length !== 1 ? "s" : ""}</p>

      {/* Editorial intro */}
      {CAT_EDITORIAL[type] && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-6 space-y-3">
          <p className="text-slate-700 text-sm leading-relaxed">{CAT_EDITORIAL[type].intro}</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-0.5">Price range</p>
              <p className="font-bold text-blue-700">{CAT_EDITORIAL[type].priceRange}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-0.5">Recommended for</p>
              <p className="text-slate-700">{CAT_EDITORIAL[type].forWho}</p>
            </div>
          </div>
          {CAT_EDITORIAL[type].guide && (
            <Link href={`/${locale}/guide/${CAT_EDITORIAL[type].guide}`}
              className="inline-block text-blue-600 hover:underline text-xs font-medium">
              Read the full guide →
            </Link>
          )}
        </div>
      )}

      <div className="mb-6 flex flex-wrap gap-3">
        <Link
          href={`/${locale}/compare/${type}`}
          className="inline-block bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors"
        >
          Compare all in a table →
        </Link>
        <Link
          href={`/${locale}/enquiry`}
          className="inline-block border border-blue-200 text-blue-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-50 transition-colors"
        >
          Get free advice
        </Link>
      </div>

      {rows.length === 0 ? (
        <p className="text-slate-400">No packages found for this category yet.</p>
      ) : (
        <div className="space-y-4">
          {rows.map((row) => {
            const price = row.price ? `฿${parseFloat(row.price).toLocaleString()}` : "TBC";
            const bookUrl = row.source_url || row.checkup_url || "#";
            return (
              <div key={row.package_id} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div>
                    <Link
                      href={`/${locale}/hospital/${row.hospital_slug}`}
                      className="font-bold text-slate-800 hover:text-blue-700"
                    >
                      {row.hospital_name}
                    </Link>
                    {row.jci === 1 && (
                      <span className="ms-2 bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">JCI</span>
                    )}
                    {row.area && <p className="text-sm text-slate-500 mt-0.5">📍 {row.area}</p>}
                    <p className="text-slate-700 mt-1">{row.package_name}</p>
                  </div>
                  <div className="text-end">
                    <p className="text-xl font-bold text-blue-700">{price}</p>
                    {row.rating && (
                      <p className="text-sm text-amber-500">★ {parseFloat(row.rating).toFixed(1)}</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 mt-3">
                  <span><Flag val={row.has_blood} /> Blood</span>
                  <span><Flag val={row.has_ultrasound} /> Ultrasound</span>
                  <span><Flag val={row.has_ct} /> CT</span>
                  <span><Flag val={row.has_mri} /> MRI</span>
                  <span><Flag val={row.has_cancer_marker} /> Cancer markers</span>
                  <span><Flag val={row.has_doctor_consult} /> Doctor</span>
                  <span><Flag val={row.has_interpreter} /> Interpreter</span>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <a
                    href={`/api/track?pkg=${row.package_id}&url=${encodeURIComponent(bookUrl)}`}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Book / Enquire
                  </a>
                  <Link
                    href={`/${locale}/checkup/${type}/${row.hospital_slug}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Full details →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* BreadcrumbList */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "BangkokCheckup", item: `${BASE}/${locale}` },
          { "@type": "ListItem", position: 2, name: "Compare", item: `${BASE}/${locale}/compare` },
          { "@type": "ListItem", position: 3, name: catLabel(loc, type), item: `${BASE}/${locale}/checkup/${type}` },
        ],
      }) }} />

      {/* ItemList — priced rows only. `price: r.price ?? "0"` published
          "free" for every price-on-request package, contradicting the page. */}
      {(() => {
        const priced = rows.filter((r) => r.price).slice(0, 20);
        if (!priced.length) return null;
        return (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: `${catLabel("en", type)} Health Check-Up Packages in Thailand`,
            numberOfItems: priced.length,
            itemListElement: priced.map((r, i) => ({
              "@type": "ListItem",
              position: i + 1,
              item: {
                "@type": "Product",
                name: r.package_name,
                offers: {
                  "@type": "Offer",
                  price: r.price,
                  priceCurrency: "THB",
                  availability: "https://schema.org/InStock",
                  seller: { "@type": "MedicalOrganization", name: r.hospital_name },
                },
              },
            })),
          }) }} />
        );
      })()}
    </div>
  );
}
