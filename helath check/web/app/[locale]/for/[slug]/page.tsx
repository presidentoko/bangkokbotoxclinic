import type { Metadata } from "next";
import Link from "next/link";
import { type Locale, LOCALES } from "@/lib/i18n";
import { getAllPackages, type PackageRow } from "@/lib/db";
import { FilteredPackageGrid } from "@/app/components/FilteredPackageGrid";

export const dynamic = "force-dynamic";

export const revalidate = 86400;

// Each longtail segment with its config
const SEGMENTS: Record<string, {
  title: string;
  h1: string;
  description: string;
  filter: (p: PackageRow) => boolean;
  intro: string;
  faqs: { q: string; a: string }[];
}> = {
  "jci-accredited-health-checkup-bangkok": {
    title: "JCI-Accredited Health Check-Up Bangkok — Certified Hospitals 2026",
    h1: "JCI-Accredited Health Check-Up in Bangkok",
    description: "Compare health check-up packages at JCI-accredited hospitals in Bangkok. All packages from internationally certified hospitals — Bumrungrad, Samitivej, Phyathai, Vejthani, and more.",
    filter: (p) => p.jci === 1,
    intro: "JCI (Joint Commission International) accreditation is the gold standard for hospital quality outside the United States. Bangkok has 9 JCI-accredited hospitals offering health check-up packages — more than almost any city outside the US. Compare their packages below.",
    faqs: [
      { q: "What does JCI accreditation mean for a health check-up?", a: "JCI-accredited hospitals meet 1,000+ international standards for patient safety, cleanliness, infection control, and care quality. For health check-ups, this means standardised laboratory procedures, certified technicians, and consistent result interpretation." },
      { q: "Are JCI hospitals in Bangkok more expensive for health check-ups?", a: "JCI hospitals typically charge 20–40% more than non-accredited private hospitals. However, package prices at Vejthani and Saint Louis JCI hospitals are competitive with non-JCI hospitals. The price difference narrows for executive packages." },
      { q: "Which JCI hospitals in Bangkok offer the best health check-up packages?", a: "Bumrungrad International has the widest range (50+ packages). Samitivej Sukhumvit is top-rated for women's health check-ups. Vejthani offers the best price-to-JCI ratio. Bangkok Hospital is best for full executive packages with CT and MRI." },
    ],
  },
  "health-checkup-expats-bangkok": {
    title: "Health Check-Up for Expats in Bangkok — English Service, All Hospitals",
    h1: "Health Check-Up for Expats in Bangkok",
    description: "The complete guide to annual health check-ups for expatriates living in Bangkok. English-speaking staff, international insurance accepted, same-day results at major private hospitals.",
    filter: (p) => (p.jci === 1 || p.city === "Bangkok") && (p.has_blood === 1),
    intro: "For expats in Bangkok, getting a health check-up is straightforward at any major private hospital. All Bangkok private hospitals with health check-up packages have English-speaking staff. Most accept international health insurance (Cigna, Bupa, AXA, Allianz). Results are typically available within 24 hours.",
    faqs: [
      { q: "Do Bangkok hospitals accept international health insurance for check-ups?", a: "Most private Bangkok hospitals accept major international health insurance: Cigna, Bupa, AXA, Allianz, Pacific Cross, and AIA. You'll usually need pre-authorisation from your insurer before the appointment. Government hospitals require cash payment." },
      { q: "How do I book a health check-up as a foreigner in Bangkok?", a: "Call the hospital's international health centre directly or book online. Bumrungrad, Samitivej, and Bangkok Hospital all have English-language websites and international patient desks. Walk-in appointments are available at most hospitals for morning check-ups." },
      { q: "What's included in a typical annual health check-up for expats in Bangkok?", a: "A standard expat annual check-up (฿3,000–฿8,000) includes: CBC blood panel, blood glucose, cholesterol, kidney and liver function, thyroid, chest X-ray, urinalysis, and a doctor consultation. Executive packages add ultrasound, ECG, and cancer marker panels." },
      { q: "Which Bangkok hospital is best for expat health check-ups?", a: "Bumrungrad International is the most popular for expats (1.1M patients/year, 190 nationalities). BNH Hospital is preferred by the European and Japanese expat community. Samitivej Sukhumvit is top-rated for families and women's check-ups." },
    ],
  },
  "japanese-health-checkup-bangkok": {
    title: "Japanese Health Check-Up Bangkok (人間ドック) — 日本語対応病院",
    h1: "Health Check-Up for Japanese Tourists in Bangkok",
    description: "Bangkok hospitals offering health check-up packages with Japanese interpreters, Ningen Dock packages, and Japan-standard health screening. Compare prices and inclusions.",
    filter: (p) => p.jci === 1 || ["Bumrungrad International Hospital", "Samitivej Hospital", "BNH Hospital", "Bangkok Hospital"].some(n => p.hospital_name.includes(n.split(" ")[0])),
    intro: "Bangkok is one of Asia's most popular medical tourism destinations for Japanese patients. Several Bangkok hospitals have dedicated Japanese-language departments with resident Japanese coordinators. Ningen Dock-equivalent packages (人間ドック) are available at Bumrungrad, BNH, and Samitivej starting from ฿8,000 — a fraction of the cost in Japan.",
    faqs: [
      { q: "Which Bangkok hospitals have Japanese interpreters for health check-ups?", a: "BNH Hospital has the longest history of serving Japanese patients with a dedicated Japanese desk. Samitivej Sukhumvit has full Japanese services. Bumrungrad has Japanese coordinators available. All charge ฿0–฿500 extra for Japanese interpreter service." },
      { q: "How much cheaper is a health check-up in Bangkok vs Japan?", a: "A Ningen Dock-equivalent package in Bangkok (฿8,000–฿20,000 / approximately ¥30,000–¥75,000) costs 50–70% less than the same package in Japan (typically ¥80,000–¥200,000). Travel and accommodation are additional, but the total saving is still significant for comprehensive packages." },
      { q: "What is included in a Bangkok health check-up equivalent to a Japanese Ningen Dock?", a: "The Thai executive package equivalent to Ningen Dock includes: blood panel (CBC, lipids, liver/kidney, diabetes, thyroid), urinalysis, stool test, chest X-ray, ECG, ultrasound (liver, gallbladder, kidney, spleen), and in some packages, gastroscopy or barium meal. Cancer marker panels are add-on options." },
    ],
  },
  "arabic-health-checkup-bangkok": {
    title: "Health Check-Up Bangkok for Arabic Speakers — أفضل مستشفيات بانكوك",
    h1: "Health Check-Up in Bangkok for Arabic Speakers",
    description: "Bangkok hospitals offering health check-up packages with Arabic interpreters and halal services. JCI-accredited hospitals popular with Middle Eastern medical tourists.",
    filter: (p) => (p.jci === 1) || p.has_interpreter === 1,
    intro: "Bangkok attracts a large number of medical tourists from the GCC (Saudi Arabia, UAE, Kuwait, Qatar, Bahrain, Oman) and other Arabic-speaking countries. Vejthani Hospital has the most comprehensive Arabic patient services, with a dedicated Arabic-speaking coordinator. Bumrungrad and Bangkok Hospital also serve Arabic-speaking patients with interpreter services.",
    faqs: [
      { q: "Which Bangkok hospitals have Arabic interpreters for health check-ups?", a: "Vejthani Hospital has the most established Arabic patient department with a resident Arabic coordinator. Bumrungrad International Hospital has Arabic interpreters available on request. Bangkok Hospital also accommodates Arabic-speaking patients." },
      { q: "Are halal food options available at Bangkok hospitals for check-up visits?", a: "Most Bangkok private hospitals, including Bumrungrad, Vejthani, and Bangkok Hospital, can provide halal meal options for inpatient stays. For outpatient health check-ups (half-day), meals are generally not provided, but staff can direct you to nearby halal restaurants." },
      { q: "Do Bangkok hospitals accept Saudi Aramco or DAMAN insurance?", a: "Some Bangkok hospitals accept specific GCC insurance plans, but this varies. Bumrungrad and Bangkok Hospital have the broadest international insurance acceptance. Contact the hospital's international patient office directly to verify your specific insurance plan." },
    ],
  },
  "cancer-screening-bangkok": {
    title: "Cancer Screening Packages Bangkok — Compare Prices 2026",
    h1: "Cancer Screening Health Check-Up in Bangkok",
    description: "Compare cancer screening health check-up packages in Bangkok. Tumour markers, PET scan, low-dose CT lung cancer screening — find the right cancer check-up at Thai hospitals.",
    filter: (p) => p.has_cancer_marker === 1 || (p.category === "cancer"),
    intro: "Bangkok hospitals offer comprehensive cancer screening packages — from basic tumour marker blood tests (AFP, CEA, CA-125, PSA) to full PET/CT body scanning. Cancer marker panels start from ฿1,500 as add-ons and ฿5,000–฿15,000 as standalone packages. For full-body PET scan, budget ฿25,000–฿45,000 at JCI hospitals.",
    faqs: [
      { q: "What cancer markers are tested in Bangkok health check-up packages?", a: "Standard cancer marker panels include: AFP (liver cancer), CEA (colon/lung/breast), CA-125 (ovarian cancer), CA 19-9 (pancreatic cancer), and PSA (prostate cancer, men). Extended panels add CA 15-3 (breast), SCC (lung/cervical), Cyfra 21-1, and NSE. Beta-HCG may also be included." },
      { q: "How much does a cancer screening package cost in Bangkok?", a: "Basic cancer marker blood panel: ฿1,500–฿3,000 (add-on to any check-up). Comprehensive cancer marker package: ฿5,000–฿15,000. Low-dose CT lung cancer screening: ฿8,000–฿15,000. Full PET/CT body scan: ฿25,000–฿45,000. Combination cancer + executive package: ฿15,000–฿50,000." },
      { q: "Which Bangkok hospital is best for cancer screening?", a: "Bumrungrad International has the most comprehensive cancer screening programme including PET/CT. Bangkok Hospital's Cancer Centre offers specialised oncology-led screening. Vejthani Hospital offers competitive-priced JCI cancer marker packages. Wattanosoth Hospital specialises in cancer care." },
    ],
  },
  "womens-health-checkup-bangkok": {
    title: "Women's Health Check-Up Bangkok 2026 — Compare Packages & Prices",
    h1: "Women's Health Check-Up Packages in Bangkok",
    description: "Compare women's health check-up packages in Bangkok. Pap smear, mammogram, pelvic ultrasound, bone density, HPV — comprehensive women's screening at private hospitals.",
    filter: (p) => p.category === "women" || (p.has_ultrasound === 1 && p.has_blood === 1),
    intro: "Bangkok private hospitals offer tailored women's health check-up packages including Pap smear (cervical cancer), mammogram, pelvic/breast ultrasound, bone density scan, hormone panel, and HPV testing. Samitivej Hospital is consistently ranked #1 for women's health in Bangkok. Packages are available from ฿2,500 for basic women's screening to ฿25,000 for comprehensive packages.",
    faqs: [
      { q: "What is included in a women's health check-up in Bangkok?", a: "A standard women's package (฿3,000–฿8,000) includes: blood panel, Pap smear (cervical cancer screen), pelvic ultrasound (uterus, ovaries), breast exam or breast ultrasound, and urinalysis. Executive women's packages (฿8,000–฿25,000) add mammogram, bone density, CA-125 (ovarian cancer marker), hormone panel (FSH, LH, estradiol), and thyroid." },
      { q: "How much does a Pap smear cost in Bangkok?", a: "Standalone Pap smear at a Bangkok private hospital: ฿500–฿1,500. As part of a women's package: included. As part of a standard check-up: often available as add-on for ฿500–฿800. Thin prep (liquid-based) Pap smear costs ฿800–฿1,500 and is more accurate." },
      { q: "Which Bangkok hospital is best for women's health check-ups?", a: "Samitivej Hospital Sukhumvit is consistently ranked best for women's health. Bumrungrad has the broadest women's package range. Bangkok Hospital Silom's Women's Centre is convenient for the Silom/Sathorn expat corridor. BNH Hospital is popular with European and Japanese expat women." },
    ],
  },
  "budget-health-checkup-bangkok": {
    title: "Cheap Health Check-Up Bangkok Under ฿3,000 — Best Value 2026",
    h1: "Budget Health Check-Up in Bangkok (Under ฿3,000)",
    description: "Affordable health check-up packages in Bangkok under 3,000 baht. Government hospitals, community hospitals, and budget private hospital packages with real prices.",
    filter: (p) => p.price != null && parseFloat(p.price) < 3000,
    intro: "Bangkok has excellent health check-up options under ฿3,000 at government hospitals (Siriraj, Chulalongkorn, Ramathibodi) and budget private hospitals. The cheapest packages start from ฿900–฿1,200 for a basic blood panel plus urinalysis. A value comprehensive package with X-ray and CBC typically costs ฿1,800–฿2,800.",
    faqs: [
      { q: "What health check-ups can I get under ฿3,000 in Bangkok?", a: "Under ฿3,000: basic blood panel (CBC, glucose, lipids, liver/kidney), urinalysis, and sometimes chest X-ray. The ฿1,200–฿2,800 range covers the most common annual check-up tests that GPs recommend for adults under 40 with no health concerns." },
      { q: "Are cheap health check-ups in Bangkok still accurate?", a: "Government hospital labs (Siriraj, Chulalongkorn, Ramathibodi) and accredited private hospital labs are highly accurate — many are ISO 15189 certified. The same lab machines are used regardless of package price. The difference is in consultation time and additional imaging, not lab accuracy." },
      { q: "Can tourists get a cheap health check-up in Bangkok?", a: "Yes. Private hospitals welcome walk-in patients without a hospital ID or Thai insurance. Government hospitals are cheaper but have longer waiting times and less English support. Budget around ฿1,500–฿3,000 for a basic check-up at a community private hospital in Bangkok." },
    ],
  },
  "executive-health-checkup-bangkok": {
    title: "Executive Health Check-Up Bangkok 2026 — Premium Packages Compared",
    h1: "Executive Health Check-Up Packages in Bangkok",
    description: "Compare executive and premium health check-up packages in Bangkok. Full body check-up with MRI, CT, cancer screening, cardiac assessment — prices from ฿8,000 to ฿50,000+.",
    filter: (p) => p.category === "executive" || p.category === "comprehensive" || (parseFloat(p.price ?? "0") >= 8000),
    intro: "Bangkok's executive health check-up packages are among the most comprehensive and best-priced in Asia. A full executive package at a JCI hospital in Bangkok (including CT, MRI, cancer markers, cardiac assessment, and specialist consultation) typically costs ฿15,000–฿35,000 — compared to US$3,000–US$8,000 for equivalent programmes in the US, UK, or Singapore.",
    faqs: [
      { q: "What is included in an executive health check-up in Bangkok?", a: "A Bangkok executive package (฿15,000–฿35,000) typically includes: full blood panel (30+ tests), chest X-ray, abdominal ultrasound, ECG, treadmill stress test, cancer markers (CEA, CA-125, PSA), CT scan (chest/abdomen/pelvis or coronary calcium scoring), specialist consultations, and same-day results with doctor review." },
      { q: "How long does an executive health check-up take in Bangkok?", a: "A full executive package typically takes 4–6 hours at the hospital. Most hospitals have dedicated executive health check-up lounges where you complete all tests in one visit, with a doctor consultation at the end to review results. Some premium packages spread over 2 visits." },
      { q: "How much does an executive health check-up cost in Bangkok vs Singapore?", a: "Bangkok executive package: ฿15,000–฿35,000 (approximately SGD 600–1,400). Singapore executive package: SGD 1,500–SGD 4,000 (approximately ฿40,000–฿110,000). Bangkok is 60–75% cheaper for equivalent JCI-standard executive programmes." },
    ],
  },
  "health-checkup-tourists-thailand": {
    title: "Health Check-Up for Tourists in Thailand — Quick Guide 2026",
    h1: "Health Check-Up for Tourists Visiting Thailand",
    description: "Can tourists get a health check-up in Thailand? Yes. Walk-in health check-ups at private hospitals across Bangkok, Phuket, Chiang Mai and Pattaya — same-day results, no appointment needed.",
    filter: (p) => p.has_blood === 1 && p.results_days != null && p.results_days <= 1,
    intro: "You don't need to be a Thai resident to get a health check-up in Thailand. Private hospitals across the country welcome walk-in medical tourists. Many visitors combine a holiday in Bangkok, Phuket, or Chiang Mai with a health check-up — saving 50–75% compared to prices in their home country.",
    faqs: [
      { q: "Can I get a health check-up without an appointment in Thailand?", a: "Yes. Most private hospitals in Bangkok, Phuket, and Chiang Mai accept walk-in patients for health check-ups, though morning appointments (7–8am) are recommended to complete fasting blood tests. Some hospitals have dedicated health check-up centres that can process walk-ins on the same day." },
      { q: "Do I need to fast before a health check-up in Thailand?", a: "Yes — fast for 8–12 hours before your appointment (water is fine). This is required for fasting blood glucose and lipid panel tests. Schedule your check-up for morning and skip breakfast. The hospital will provide a meal voucher after your fasting tests are complete." },
      { q: "How do I get my health check-up results back home after leaving Thailand?", a: "Most Bangkok private hospitals can email results as a PDF within 24–48 hours. Ask for a printed and stamped copy before you leave the hospital — this is standard practice for medical tourists. Bumrungrad and Samitivej have online patient portals where you can access results from anywhere." },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(SEGMENTS).map((slug) => ({ slug }));
}

const BASE = "https://www.bangkoktopclinic.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const seg = SEGMENTS[slug];
  if (!seg) return { title: "Health Check-Up Thailand" };
  return {
    title: seg.title,
    description: seg.description,
    keywords: seg.h1.split(" "),
    alternates: {
      canonical: `${BASE}/en/for/${slug}`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `${BASE}/${l}/for/${slug}`])),
    },
  };
}

export default async function LongtailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const loc = locale as Locale;
  const seg = SEGMENTS[slug];

  if (!seg) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-800 mb-3">Page not found</h1>
        <Link href={`/${locale}`} className="text-blue-600 hover:underline">← Back to home</Link>
      </div>
    );
  }

  let allRows: PackageRow[] = [];
  try {
    allRows = await getAllPackages();
  } catch { /* DB not ready */ }

  const rows = allRows.filter(seg.filter);
  const prices = rows.map((r) => parseFloat(r.price ?? "0")).filter(Boolean);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const hospitals = new Set(rows.map((r) => r.hospital_slug)).size;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-slate-400 mb-6 flex items-center gap-2 flex-wrap">
        <Link href={`/${locale}`} className="hover:text-blue-600">Home</Link>
        <span>›</span>
        <Link href={`/${locale}/guide`} className="hover:text-blue-600">Guide</Link>
        <span>›</span>
        <span className="text-slate-600 truncate">{seg.h1}</span>
      </nav>

      {/* Hero */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">{seg.h1}</h1>
        <p className="text-slate-600 text-lg max-w-3xl mb-4">{seg.description}</p>
        <div className="flex flex-wrap gap-4 mt-5">
          <div className="bg-blue-50 rounded-xl px-4 py-3 text-center">
            <p className="text-2xl font-bold text-blue-700">{hospitals}</p>
            <p className="text-xs text-blue-500 font-medium">Hospitals</p>
          </div>
          <div className="bg-emerald-50 rounded-xl px-4 py-3 text-center">
            <p className="text-2xl font-bold text-emerald-700">{rows.length}</p>
            <p className="text-xs text-emerald-500 font-medium">Packages</p>
          </div>
          {minPrice > 0 && (
            <div className="bg-amber-50 rounded-xl px-4 py-3 text-center">
              <p className="text-2xl font-bold text-amber-700">฿{minPrice.toLocaleString()}</p>
              <p className="text-xs text-amber-500 font-medium">From</p>
            </div>
          )}
        </div>
      </div>

      {/* Intro text */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-8">
        <p className="text-slate-700 leading-relaxed text-sm">{seg.intro}</p>
      </div>

      {/* Package grid */}
      {rows.length > 0 ? (
        <FilteredPackageGrid rows={rows} loc={loc} />
      ) : (
        <div className="text-center py-16 text-slate-400">
          <p className="text-4xl mb-3">🏥</p>
          <p>No packages match this filter yet — check back soon.</p>
        </div>
      )}

      {/* FAQ */}
      <div className="mt-12 space-y-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Frequently Asked Questions</h2>
        {seg.faqs.map((faq, i) => (
          <details key={i} className="bg-white border border-slate-200 rounded-xl group">
            <summary className="p-5 font-semibold text-slate-800 cursor-pointer flex items-center justify-between gap-3">
              <span>{faq.q}</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform shrink-0">▼</span>
            </summary>
            <div className="px-5 pb-5 text-slate-600 text-sm leading-relaxed">{faq.a}</div>
          </details>
        ))}
      </div>

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: seg.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      }) }} />
    </div>
  );
}
