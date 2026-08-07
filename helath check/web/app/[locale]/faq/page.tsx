import type { Metadata } from "next";
import Link from "next/link";
import { type Locale, hreflangMap } from "@/lib/i18n";
import { faqT } from "@/lib/faq-i18n";

// Static — see the note in app/[locale]/page.tsx.
export const revalidate = false;

const BASE = "https://www.bangkoktopclinic.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const fc = faqT(locale as Locale);
  return {
    title: fc.pageTitle,
    description: fc.pageIntro,
    alternates: {
      canonical: `${BASE}/${locale}/faq`,
      languages: hreflangMap(`/faq`),
    },
  };
}

const FAQS = [
  {
    category: "Costs & Pricing",
    items: [
      {
        q: "How much does a health check-up cost in Bangkok?",
        a: "Bangkok health check-up prices range from ฿1,200 (basic blood panel) to ฿80,000+ (full executive with MRI at a JCI hospital). A good mid-range executive package covering blood tests, ultrasound, chest X-ray, ECG, and doctor consultation typically costs ฿6,000–฿15,000. Prices are 20–40% lower than Bumrungrad at smaller private hospitals.",
        link: null,
      },
      {
        q: "Is health check-up cheaper in Chiang Mai than Bangkok?",
        a: "Yes — equivalent packages in Chiang Mai are typically 20–35% cheaper than Bangkok. A comprehensive package at Chiang Mai Ram Hospital or McCormick costs ฿4,000–฿8,000 vs ฿6,000–฿15,000 for the same scope in Bangkok. JCI hospitals are less common outside Bangkok, but private hospitals maintain excellent standards.",
        link: { label: "Chiang Mai check-up guide", href: "/guide/chiang-mai-health-checkup" },
      },
      {
        q: "Why are prices at Bumrungrad so much higher?",
        a: "Bumrungrad is JCI-accredited, sees 1.1 million patients/year, and markets heavily to international medical tourists. Their prices are 40–80% above the Bangkok average. You're paying for reputation, international coordination services, and the premium location on Sukhumvit. Vejthani, Phyathai 2, and BNH offer similar JCI accreditation at lower prices.",
        link: null,
      },
      {
        q: "Does my international health insurance cover health check-ups in Thailand?",
        a: "Some international health insurance plans (Cigna, Bupa, AXA, Allianz) cover preventive health screening once per year. Coverage depends on your plan — some cover basic screening only, others cover executive packages up to a specific value. Always get pre-authorisation from your insurer before booking. Most Thai private hospitals have an insurance desk.",
        link: null,
      },
    ],
  },
  {
    category: "What's Included",
    items: [
      {
        q: "What does a basic health check-up include?",
        a: "A basic package (฿1,200–฿3,000) typically includes: CBC (complete blood count), blood glucose, cholesterol (lipid panel), kidney function (creatinine, BUN), liver enzymes (ALT, AST), urinalysis, and a brief physical examination. Some add chest X-ray. Blood pressure and BMI measurement are always included.",
        link: { label: "What's included guide", href: "/guide/what-is-included-checkup" },
      },
      {
        q: "What's the difference between an executive and comprehensive package?",
        a: "An executive package typically adds ultrasound of abdominal organs, ECG, eye screening, and a 30-60 minute consultation with an internal medicine doctor. A comprehensive package goes further with cancer tumour markers (AFP, PSA, CA125, CEA), optional CT or MRI, cardiac stress test, and may include gastroscopy. Prices range ฿15,000–฿80,000 for comprehensive.",
        link: null,
      },
      {
        q: "Are cancer screening tumour markers included in standard check-up packages?",
        a: "Cancer marker blood tests (AFP for liver, PSA for prostate, CA125 for ovarian, CEA for colorectal, CA19-9 for pancreatic) are usually optional add-ons or part of cancer-specific or comprehensive packages — not basic or standard packages. They add ฿1,500–฿5,000 to the package cost. Imaging (CT, PET) for cancer screening is always a separate package.",
        link: { label: "Cancer screening guide", href: "/guide/cancer-screening-bangkok" },
      },
      {
        q: "Is MRI included in executive health check-up packages?",
        a: "Most executive packages do NOT include MRI by default — it's usually an add-on (฿5,000–฿15,000 per scan). Some premium comprehensive packages priced ฿30,000+ include brain MRI or abdominal MRI. Always check the package details carefully on our comparison table.",
        link: null,
      },
    ],
  },
  {
    category: "Booking & Logistics",
    items: [
      {
        q: "How do I book a health check-up in Thailand as a tourist?",
        a: "You can book directly on the hospital website (most have English booking) or call the international patient centre. Walk-in appointments for morning health check-ups are accepted at most hospitals. Arrive fasting (nothing to eat or drink except water for 8-12 hours before). Bring your passport. Results are usually ready within 4-24 hours.",
        link: { label: "How to prepare guide", href: "/guide/how-to-prepare-health-checkup-thailand" },
      },
      {
        q: "Do I need to make an appointment or can I walk in?",
        a: "Walk-in is generally fine for morning health check-up packages, but appointments are recommended at busy hospitals (Bumrungrad, Samitivej). Booking 1-3 days in advance avoids waits. Some hospitals have dedicated health check-up centres open weekdays 7am–2pm. Weekend availability is more limited.",
        link: null,
      },
      {
        q: "How long does a health check-up take in Bangkok?",
        a: "A basic package takes 2-3 hours. An executive package with ultrasound and doctor consultation takes 4-6 hours. A comprehensive package with multiple imaging studies may take a full day. Most hospitals allow same-day or next-day result collection, though some specialist tests take 2-3 days.",
        link: null,
      },
      {
        q: "Do I need to fast before a health check-up?",
        a: "Yes — most health check-up packages require fasting for 8-12 hours before the appointment for accurate blood glucose and lipid (cholesterol) results. Water is allowed. Morning appointments (7am-9am) are most convenient for fasting. If you ate, inform the nurse — most hospitals can still perform the check-up but blood sugar/lipid results will be noted as non-fasting.",
        link: null,
      },
    ],
  },
  {
    category: "Senior & Specialist Screening",
    items: [
      {
        q: "What health tests should seniors (60+) get in Thailand?",
        a: "Seniors should get a comprehensive check-up covering: full blood panel, bone density scan (DEXA), cognitive assessment, ECG, echocardiogram, abdominal ultrasound, prostate (men) or ovarian (women) markers, thyroid, Vitamin D, and colorectal cancer screening. Bangkok hospitals like Bumrungrad offer dedicated senior geriatric packages from ฿10,000.",
        link: { label: "Senior health check-up guide", href: "/guide/senior-health-checkup-thailand" },
      },
      {
        q: "How much does diabetes screening cost in Bangkok?",
        a: "Basic diabetes screening (fasting glucose + HbA1c) costs ฿500–฿1,500 at Bangkok private hospitals. A comprehensive metabolic panel including fasting insulin, kidney function, and lipid profile costs ฿3,500–฿9,000. Walk-in blood tests are accepted at most hospitals; results are ready within 2–4 hours. Fasting for 8–12 hours is required.",
        link: { label: "Diabetes screening guide", href: "/guide/diabetes-screening-thailand" },
      },
      {
        q: "How much does an MRI cost in Bangkok?",
        a: "MRI scan prices in Bangkok range from ฿8,000–฿18,000 for a brain MRI, ฿12,000–฿25,000 for a spine MRI, and ฿35,000–฿65,000 for a whole-body MRI. Bangkok hospitals charge 40–70% less than equivalent scans in the US, UK, or Australia. Appointment-only — expect 1–3 hours for the scan and report.",
        link: { label: "MRI scan cost guide", href: "/guide/mri-scan-cost-bangkok" },
      },
    ],
  },
  {
    category: "Hospital Quality",
    items: [
      {
        q: "What is JCI accreditation and which Bangkok hospitals have it?",
        a: "JCI (Joint Commission International) is the US-based gold standard for hospital quality internationally. Bangkok has 9 JCI-accredited hospitals — among the most in Asia. They include Bumrungrad, Bangkok Hospital, Samitivej, BNH, Vejthani, Phyathai 2, Saint Louis, Praram 9 (BDMS), and Yanhee. JCI hospitals charge a premium but maintain the highest international standards.",
        link: { label: "JCI hospitals guide", href: "/guide/jci-hospitals-bangkok" },
      },
      {
        q: "Are non-JCI private hospitals in Thailand safe?",
        a: "Yes — Thailand's private hospitals have an excellent reputation even without JCI accreditation. Hospitals like Ramathibodi, Phyathai, and Paolo Memorial are internationally respected. The Joint Hospital Accreditation (HA) system provides local quality standards. For routine health screening, accreditation is less critical than for complex procedures.",
        link: null,
      },
    ],
  },
  {
    category: "Country Comparisons — How Much You Save",
    items: [
      {
        q: "How much cheaper is a health check-up in Bangkok vs the US?",
        a: "A comprehensive executive health check-up in Bangkok costs ฿8,000–฿20,000 (approximately US$220–$550). An equivalent package in the US would cost US$1,500–$5,000 out-of-pocket (without insurance) — 75–90% more expensive. Bangkok's JCI hospitals (Bumrungrad, Samitivej, Vejthani) use the same international lab standards and have English-speaking doctors.",
        link: { label: "USA vs Thailand comparison guide", href: "/guide/health-checkup-usa-vs-thailand" },
      },
      {
        q: "Is a health check-up in Thailand cheaper than in Singapore?",
        a: "Yes — Bangkok health check-up packages are 50–70% cheaper than equivalent packages at Mount Elizabeth, Gleneagles, or Parkway hospitals in Singapore. A comprehensive executive package at Bumrungrad or Samitivej costs ฿8,000–฿20,000 vs SGD 1,500–SGD 4,000 (approximately ฿40,000–฿110,000) in Singapore. Quality is comparable — both markets have multiple JCI-accredited hospitals.",
        link: { label: "Thailand vs Singapore comparison", href: "/guide/thailand-vs-singapore-health-checkup" },
      },
      {
        q: "Should Japanese visitors get a Ningen Dock check-up in Bangkok?",
        a: "Bangkok offers Ningen Dock (人間ドック) equivalent packages at 50–70% below Japanese prices. BNH Hospital, Samitivej, and Bumrungrad have dedicated Japanese departments with Japanese-speaking staff, Japanese-language reports, and gastroscopy (直接カメラ) instead of the barium swallow common in Japan. For patients outside the Japanese public system, Bangkok is an attractive alternative.",
        link: { label: "Japan vs Thailand guide (日本語)", href: "/guide/health-checkup-japan-vs-thailand" },
      },
      {
        q: "Is Hat Yai cheaper than Bangkok for health check-ups?",
        a: "Yes — Hat Yai packages are typically 25–35% cheaper than Bangkok for equivalent quality. Hat Yai is popular with Malaysian visitors (only 90 minutes from Penang by road). Bangkok Hospital Hat Yai and Hat Yai Ram Hospital offer standard packages from ฿1,800 and executive packages from ฿6,000. For complex or specialist screening, Bangkok is still recommended.",
        link: { label: "Malaysia vs Thailand / Hat Yai guide", href: "/guide/health-checkup-malaysia-vs-thailand" },
      },
    ],
  },
  {
    category: "Visa & Long-Stay",
    items: [
      {
        q: "What medical tests are required for a Thai retirement visa?",
        a: "The Non-Immigrant O-A (retirement visa) requires a medical certificate from a licensed Thai hospital including: chest X-ray (to rule out TB), HIV/AIDS test (must be negative), and syphilis (VDRL) test. All tests must be performed in Thailand. Most private hospitals can complete the full visa medical package in one morning (฿800–฿2,500).",
        link: { label: "Retirement visa health check guide", href: "/guide/health-checkup-for-retirement-visa-thailand" },
      },
      {
        q: "Do I need a medical visa to get a health check-up in Thailand?",
        a: "No — most health check-up visits are completed within a standard tourist visa or visa exemption (30–60 days depending on nationality). A dedicated Medical Treatment Visa is only needed for treatment or recovery exceeding 60 days, or major surgery with extended hospitalisation. For a one-day health check-up, your existing tourist entry is sufficient.",
        link: { label: "Medical visa Thailand guide", href: "/guide/medical-visa-thailand" },
      },
    ],
  },
  {
    category: "Procedure Costs (MRI, CT, Mammogram, Scope)",
    items: [
      {
        q: "How much does an MRI scan cost in Bangkok?",
        a: "MRI scan prices in Bangkok: single region (brain, spine, knee) ฿5,000–฿12,000 at private hospitals; full-body MRI ฿18,000–฿45,000. At government hospitals (Siriraj, Ramathibodi) prices are lower but waiting times can be 2–4 weeks. Most private hospital results are available within 24–48 hours. JCI hospitals like Bumrungrad and Samitivej include radiologist reports in English.",
        link: { label: "MRI scan cost Bangkok guide", href: "/guide/mri-scan-cost-bangkok" },
      },
      {
        q: "How much does a CT scan cost in Bangkok?",
        a: "CT scan prices in Bangkok range from ฿3,500–฿8,000 for a single region (chest, abdomen, head) at private hospitals. CT coronary angiography (CTCA) for heart screening costs ฿15,000–฿35,000. Low-dose chest CT (lung cancer screening) costs ฿4,000–฿9,000. Contrast CT (with iodine dye) costs ฿1,000–฿3,000 more than non-contrast. Results typically same-day or next morning.",
        link: { label: "CT scan cost Bangkok guide", href: "/guide/ct-scan-cost-bangkok" },
      },
      {
        q: "What is the cost of a mammogram in Bangkok?",
        a: "2D mammogram (standard bilateral): ฿1,500–฿4,000 at private Bangkok hospitals. 3D mammogram (tomosynthesis / digital breast tomography): ฿3,500–฿7,000. Breast ultrasound: ฿1,500–฿3,500 (often recommended alongside mammogram for dense breast tissue). Most women's health check-up packages at ฿8,000+ include a 2D mammogram; some include both ultrasound and mammogram.",
        link: { label: "Mammogram cost Bangkok guide", href: "/guide/mammogram-cost-bangkok" },
      },
      {
        q: "How much does a colonoscopy cost in Bangkok?",
        a: "Colonoscopy with sedation at Bangkok private hospitals: ฿12,000–฿30,000 including sedation fee and pathology. Without sedation: ฿6,000–฿12,000 (not recommended — sedation is standard internationally). At government hospitals: ฿3,000–฿6,000 but with long waits. For comparison, colonoscopy in the US costs US$1,200–$3,500 without insurance; Singapore SGD 1,800–3,500. Bangkok is 60–75% cheaper than these.",
        link: { label: "Colonoscopy cost Bangkok guide", href: "/guide/colonoscopy-cost-bangkok" },
      },
      {
        q: "How much does a gastroscopy (stomach endoscopy) cost in Bangkok?",
        a: "Gastroscopy (upper GI endoscopy / 胃カメラ / 위내시경) with sedation: ฿4,500–฿9,000 at Bangkok private hospitals. Without sedation: ฿2,500–฿5,000. Combined gastroscopy + colonoscopy package: ฿20,000–฿35,000 including sedation for both. The combined package is popular with Japanese and Korean medical tourists accustomed to annual stomach+bowel cancer screening.",
        link: { label: "Gastroscopy cost Bangkok guide", href: "/guide/gastroscopy-cost-bangkok" },
      },
    ],
  },
  {
    category: "Specific Tests & Add-Ons",
    items: [
      {
        q: "Can I get a Vitamin D test in Bangkok without a doctor's referral?",
        a: "Yes — all Bangkok private hospitals allow walk-in blood tests for Vitamin D (25-OH). No referral is needed. Go to the laboratory department, ask for a '25-hydroxyvitamin D test,' pay at the counter (฿500–฿1,200), and get results in 4–6 hours. Most executive health check-up packages from ฿8,000 include Vitamin D automatically — add it as an individual test for ฿500–฿900 if your package doesn't include it.",
        link: { label: "Vitamin D test Bangkok guide", href: "/guide/vitamin-d-test-bangkok" },
      },
      {
        q: "At what age should I get a PSA test in Bangkok?",
        a: "PSA (prostate cancer screening) is recommended from age 45–50 for average-risk men, or from age 40 if you have a first-degree relative with prostate cancer. Most Bangkok executive and men's health packages include PSA for men 45+. As a standalone test, PSA costs ฿400–฿900. Same-day results, and an internist is available to discuss results during the same check-up morning if elevated.",
        link: { label: "PSA test Bangkok guide", href: "/guide/psa-test-bangkok" },
      },
      {
        q: "Is a thyroid test (TSH) included in standard Bangkok health check-up packages?",
        a: "TSH (the primary thyroid screening test) is included in most executive packages (฿8,000+) and in women's health packages. Basic packages below ฿5,000 often do not include thyroid. Full thyroid panel (TSH + Free T3 + Free T4 + antibodies) is usually an add-on of ฿500–฿1,500 beyond a basic TSH. Thyroid ultrasound (for nodule screening) is an additional ฿1,500–฿4,000.",
        link: { label: "Thyroid screening Bangkok guide", href: "/guide/thyroid-screening-bangkok" },
      },
      {
        q: "Can digital nomads get a health check-up in Bangkok without insurance?",
        a: "Yes — all Bangkok private hospitals accept self-pay patients with no insurance required. Walk-in morning appointments are available at most hospitals. A comprehensive annual check-up (CBC, metabolic panel, thyroid, ultrasound, ECG, X-ray, doctor consultation) costs ฿5,000–฿12,000 as a self-pay patient. Individual blood tests can be done walk-in for ฿1,500–฿3,000. Bumrungrad, Samitivej, and Bangkok Hospital all have efficient international patient processes for self-pay visitors.",
        link: { label: "Digital nomad health check-up Bangkok", href: "/for/digital-nomad-health-checkup-bangkok" },
      },
      {
        q: "What blood tests are recommended for long-term Thailand residents?",
        a: "For long-term Thailand residents, key add-on blood tests beyond the standard panel: (1) Dengue NS1/IgG antibody — if you've been in Thailand long and had febrile episodes; (2) Vitamin D — very commonly deficient in indoor workers despite tropical climate; (3) Hepatitis B surface antigen (HBsAg) — if not vaccinated and sexually active; (4) Blood smear for malaria — if you've visited rural areas; (5) HIV — annual for sexually active adults. These add ฿300–฿1,000 each and can be added to any morning check-up.",
        link: { label: "Blood test prices Bangkok", href: "/guide/blood-test-price-bangkok" },
      },
    ],
  },
  {
    category: "Nationality & Language",
    items: [
      {
        q: "Which Bangkok hospital has the best Korean language services?",
        a: "Vejthani International Hospital and Samitivej Sukhumvit are generally considered to have the strongest Korean-language programs. Vejthani has a dedicated Korean Patient Center with Korean nurses and coordinators. Samitivej has a Korean Health Centre. Bumrungrad also has 40+ Korean-speaking staff. For health check-ups, all three are excellent options; Vejthani offers the best price-to-Korean-service ratio.",
        link: { label: "Korean tourist hospital guide (한국어)", href: "/guide/best-hospitals-korean-tourists" },
      },
      {
        q: "Is there Arabic language support at Bangkok hospitals?",
        a: "Yes — Bumrungrad International has a dedicated Arabic-speaking coordinator and Arabic-language materials. Samitivej and Bangkok Hospital can arrange Arabic interpreters on request. Halal food options are available. Muslim prayer facilities are available at Bumrungrad; other hospitals can arrange quiet prayer space. Bangkok's major hospitals are experienced with Gulf, Middle Eastern, and North African patients.",
        link: { label: "Arabic speakers Bangkok guide", href: "/guide/best-hospitals-arabic-speakers" },
      },
      {
        q: "Can I get my Bangkok health check-up results in English for use in my home country?",
        a: "Yes — all major Bangkok private hospitals (Bumrungrad, Samitivej, Bangkok Hospital, BNH, Vejthani, Phyathai) issue results in English with international reference ranges. Your GP or specialist at home can read and use these directly. Units are in international standards (mmol/L, mg/dL, g/dL) compatible with Western medical systems. Always request the full laboratory print-out, not just the physician summary letter. Imaging (MRI, CT, X-ray) can be provided on a USB or CD in DICOM format on request.",
        link: null,
      },
    ],
  },
];

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale as Locale;
  const fc = faqT(loc);

  // Only "Costs & Pricing" (the highest-traffic category) is translated —
  // merge its Q&A onto the base FAQS[0] entries by index, preserving each
  // item's `link` field which lib/faq-i18n.ts's QA type doesn't carry.
  // Every other category stays English (documented scope in faq-i18n.ts).
  const sections = FAQS.map((section, si) => {
    if (si !== 0) return section;
    return {
      category: fc.categoryCostsPricing,
      items: section.items.map((item, ii) => ({
        ...item,
        q: fc.costsPricing[ii]?.q ?? item.q,
        a: fc.costsPricing[ii]?.a ?? item.a,
      })),
    };
  });
  const allFaqs = sections.flatMap((cat) => cat.items);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <nav className="text-sm text-slate-400 mb-6 flex items-center gap-2">
        <Link href={`/${locale}`} className="hover:text-blue-600">{fc.breadcrumbHome}</Link>
        <span>›</span>
        <span className="text-slate-600">{fc.breadcrumbFaq}</span>
      </nav>

      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
        {fc.pageTitle}
      </h1>
      <p className="text-slate-500 mb-10">
        {fc.pageIntro}
      </p>

      <div className="space-y-12">
        {sections.map((section) => (
          <section key={section.category}>
            <h2 className="text-lg font-bold text-blue-700 mb-4 flex items-center gap-2">
              <span className="h-px flex-1 bg-blue-100" />
              {section.category}
              <span className="h-px flex-1 bg-blue-100" />
            </h2>
            <div className="space-y-3">
              {section.items.map((faq, i) => (
                <details key={i} className="bg-white border border-slate-200 rounded-xl group">
                  <summary className="px-5 py-4 font-semibold text-slate-800 cursor-pointer flex items-center justify-between gap-3 list-none">
                    <span>{faq.q}</span>
                    <span className="text-slate-400 group-open:rotate-180 transition-transform shrink-0 text-sm">▼</span>
                  </summary>
                  <div className="px-5 pb-5 text-slate-600 text-sm leading-relaxed space-y-2">
                    <p>{faq.a}</p>
                    {faq.link && (
                      <Link href={`/${locale}${faq.link.href}`}
                        className="inline-block text-blue-600 hover:underline font-medium mt-1">
                        → {faq.link.label}
                      </Link>
                    )}
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-12 bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <h3 className="font-bold text-slate-800 mb-2">{fc.ctaTitle}</h3>
        <p className="text-slate-500 text-sm mb-4">
          {fc.ctaSubtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href={`/${locale}/enquiry`}
            className="bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors text-center text-sm">
            {fc.ctaAsk}
          </Link>
          <Link href={`/${locale}/compare`}
            className="border border-blue-200 text-blue-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-50 transition-colors text-center text-sm">
            {fc.ctaCompare}
          </Link>
        </div>
      </div>

      {/* FAQ Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: allFaqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: fc.breadcrumbHome, item: `${BASE}/${locale}` },
          { "@type": "ListItem", position: 2, name: fc.breadcrumbFaq, item: `${BASE}/${locale}/faq` },
        ],
      }) }} />
    </div>
  );
}
