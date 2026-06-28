import type { Metadata } from "next";
import Link from "next/link";
import { LOCALES } from "@/lib/i18n";
import { ShareButtons } from "@/app/components/ShareButtons";

export const revalidate = 86400;

const BASE = "https://www.bangkoktopclinic.com";

type GuideSection = { heading: string; content: string; list?: string[] };
type Guide = {
  title: string;
  description: string;
  intro: string;
  sections: GuideSection[];
  faqs: { q: string; a: string }[];
  relatedLinks: { href: string; label: string }[];
};

const GUIDES: Record<string, Guide> = {
  "bangkok-health-checkup": {
    title: "Bangkok Health Check-Up Guide for Medical Tourists (2026)",
    description: "Complete guide to getting a health check-up in Bangkok: costs, best hospitals, what's included, how to book, and what to bring.",
    intro: "Bangkok is Asia's top medical tourism destination, attracting over 3 million health tourists annually. International hospitals offer comprehensive health check-up packages at prices 30–70% lower than comparable facilities in the US, UK, or Australia — with shorter waiting times and English-speaking staff.",
    sections: [
      {
        heading: "How much does a health check-up cost in Bangkok?",
        content: "Prices vary significantly by hospital tier and package type. Budget private hospitals start from ฿2,000 for a basic blood panel; flagship JCI hospitals charge up to ฿80,000+ for full executive packages with MRI and cancer screening.",
        list: [
          "Basic (CBC, sugar, cholesterol, urine): ฿2,000 – ฿6,000",
          "Comprehensive (adds ultrasound, ECG, thyroid): ฿6,000 – ฿20,000",
          "Executive (flagship hospitals, full consultation): ฿15,000 – ฿60,000",
          "Executive with MRI: ฿30,000 – ฿80,000",
          "Cancer screening add-on: ฿3,000 – ฿25,000",
        ],
      },
      {
        heading: "What is included in a Bangkok health check-up?",
        content: "The tests included depend on the package tier. Here is what each level typically covers.",
        list: [
          "Basic: Complete blood count (CBC), fasting blood glucose, lipid panel, liver enzymes (AST/ALT), kidney function (creatinine, BUN), urinalysis, blood pressure, BMI",
          "Comprehensive: Everything in Basic + chest X-ray, abdominal ultrasound, ECG, thyroid function (TSH, T3, T4), Hepatitis B surface antigen, Hepatitis C antibody, Pap smear (women), PSA (men 40+)",
          "Executive: Everything in Comprehensive + tumour markers (AFP, CEA, CA-125, CA 19-9, PSA), physician consultation, often includes MRI brain or cardiac CT",
          "Cancer screening add-on: Low-dose chest CT (lung), mammogram, bone density (DEXA), colonoscopy prep consultation",
        ],
      },
      {
        heading: "Which Bangkok hospitals are best for health check-ups?",
        content: "These hospitals consistently receive high ratings from international medical tourists for their health screening departments:",
        list: [
          "Bumrungrad International — JCI since 2002, 5.4 million patients/year, widest executive range, highest prices",
          "Bangkok Hospital (BDMS) — Largest Thai hospital group, locations city-wide, highly systematic check-up programme",
          "Samitivej Hospital — JCI accredited, strong women's health focus, Sukhumvit location ideal for tourists",
          "Vejthani Hospital — JCI accredited, competitive pricing, strong cancer marker packages",
          "BNH Hospital — Silom location, international patient focus, French-speaking staff available",
          "Praram 9 Hospital — Good value, central location, shorter wait times than flagship hospitals",
        ],
      },
      {
        heading: "How long does a Bangkok health check-up take?",
        content: "Most comprehensive packages complete in half a day (3–5 hours). Same-day results are available at most hospitals for standard blood tests. Imaging results (MRI, CT) may take 1–2 additional hours.",
        list: [
          "Arrival and registration: 15–30 minutes",
          "Blood draw, ECG, vitals: 30–45 minutes",
          "Ultrasound / imaging: 30–60 minutes",
          "Waiting for lab results: 1–2 hours",
          "Doctor consultation: 20–40 minutes",
          "Total: 3–5 hours for a comprehensive package",
        ],
      },
      {
        heading: "Do I need to fast before a Bangkok health check-up?",
        content: "Yes — most health check-up packages require 8–12 hours of fasting for accurate blood glucose and lipid panel results. Water is allowed. Avoid alcohol for 24 hours before.",
        list: [
          "Fasting required: 8–12 hours (most packages)",
          "Water: allowed",
          "Medications: continue unless told otherwise — inform the doctor",
          "Alcohol: avoid 24 hours before",
          "Heavy exercise: avoid 24 hours before strenuous physical tests",
        ],
      },
      {
        heading: "Do I need to book in advance?",
        content: "Yes — Bangkok's top hospitals require advance appointments for health screening, especially for executive packages at flagship hospitals. Walk-ins may be refused or face 2–4 hour waits.",
        list: [
          "Bumrungrad / Bangkok Hospital: book 1–2 weeks in advance",
          "Mid-tier hospitals (Vejthani, BNH, Praram 9): 3–7 days",
          "Basic packages at smaller clinics: often walk-in friendly",
          "Online booking is available on most hospital websites — or use our enquiry form",
        ],
      },
      {
        heading: "What to bring to a health check-up in Bangkok",
        content: "Bring these items to your appointment for a smooth check-up experience.",
        list: [
          "Passport or government-issued ID",
          "Travel/health insurance documents if applicable",
          "List of current medications (including supplements)",
          "Previous health check-up results if you have them (for comparison)",
          "Comfortable loose clothing for physical examinations",
          "Light snack and water for after the fasting period",
        ],
      },
      {
        heading: "Is health insurance accepted?",
        content: "International hospitals in Bangkok accept major insurance providers, but check in advance. Most operate on a direct billing system for major insurers.",
        list: [
          "Accepted at most JCI hospitals: AXA, Cigna, Allianz, Bupa, AETNA",
          "Thai government insurance (Gold Card, Social Security): not valid at private hospitals",
          "Travel insurance: varies — check your policy for wellness/screening coverage",
          "Out-of-pocket payment is straightforward — all major credit cards accepted",
          "Thai baht is best — exchange rate is applied for USD/EUR payments",
        ],
      },
    ],
    faqs: [
      { q: "Is it safe to get a health check-up in Bangkok?", a: "Yes. Bangkok's JCI-accredited hospitals maintain international standards for equipment, hygiene, and laboratory certification. Bumrungrad and Bangkok Hospital routinely top international hospital quality rankings." },
      { q: "Can I get a health check-up in Bangkok without speaking Thai?", a: "Yes. All major private hospitals have English-speaking staff. Bumrungrad, BNH, and Samitivej also offer services in Chinese, Japanese, Arabic, and European languages." },
      { q: "How do I get my health check-up results from Bangkok back home?", a: "Hospitals provide a physical results booklet and most now offer online patient portals. Ask for a digital copy in PDF format — you can share it with your GP or specialist back home." },
      { q: "Is Bangkok cheaper than Singapore or Hong Kong for health check-ups?", a: "Yes, significantly. An executive health check-up that costs ฿20,000 at a JCI Bangkok hospital would typically cost USD 1,500–3,000 at a comparable Singapore or Hong Kong hospital." },
    ],
    relatedLinks: [
      { href: "/en/compare?category=executive", label: "Compare executive packages →" },
      { href: "/en/compare?category=comprehensive", label: "Compare comprehensive packages →" },
      { href: "/en/guide/jci-hospitals-bangkok", label: "JCI-accredited hospitals in Bangkok" },
      { href: "/en/hospital", label: "Browse all hospitals" },
    ],
  },
  "jci-hospitals-bangkok": {
    title: "JCI-Accredited Hospitals in Bangkok — Full List (2026)",
    description: "All Joint Commission International (JCI) accredited hospitals in Bangkok, with health check-up packages, prices, and what JCI accreditation means for patients.",
    intro: "JCI (Joint Commission International) accreditation is the international gold standard for hospital quality and patient safety. Bangkok has more JCI-accredited hospitals than almost any city outside the US — making it one of the safest medical tourism destinations in the world.",
    sections: [
      {
        heading: "What is JCI accreditation?",
        content: "Joint Commission International (JCI) is a non-profit that evaluates hospitals against international standards covering patient care, safety, cleanliness, infection control, and staff training. An accreditation survey involves 1,000+ standards checked across every department. JCI certification must be renewed every 3 years.",
      },
      {
        heading: "JCI-accredited hospitals in Bangkok (2025–2026)",
        content: "The following hospitals hold current JCI accreditation and offer health check-up packages for international patients:",
        list: [
          "Bumrungrad International Hospital — JCI since 2002, re-accredited 2024",
          "Bangkok Hospital (BDMS) — JCI accredited, multiple locations",
          "Samitivej Hospital — JCI accredited, Sukhumvit location",
          "Vejthani Hospital — JCI accredited, competitive pricing",
          "BNH Hospital — JCI accredited, Silom location, boutique experience",
          "Phyathai 2 Hospital — JCI accredited",
          "Bangkok Dusit Medical Services (BDMS) group — group-level JCI",
        ],
      },
      {
        heading: "What JCI accreditation means for you",
        content: "When you choose a JCI hospital, you can expect these standards:",
        list: [
          "International patient rights — informed consent in your language",
          "Standardised medication safety protocols",
          "Infection control meeting international norms",
          "Staff trained to international clinical standards",
          "Independent verification — not self-reported",
          "Patient complaint resolution process",
        ],
      },
      {
        heading: "Does JCI accreditation mean higher prices?",
        content: "JCI hospitals generally charge more than non-accredited private hospitals, but the difference is often 20–40% — not tenfold. Vejthani and BNH offer competitive pricing despite full JCI status. The main cost drivers are hospital prestige and package inclusions, not just the accreditation itself.",
      },
    ],
    faqs: [
      { q: "Is JCI accreditation required for a health check-up in Bangkok?", a: "No — many non-JCI private hospitals have excellent quality. JCI is a useful proxy for minimum-quality assurance, especially for complex packages. For a basic blood panel, the accreditation matters less." },
      { q: "How can I verify a Bangkok hospital's JCI status?", a: "Check the official JCI Gold Seal directory at jointcommissioninternational.org. The hospital's current accreditation, expiry date, and accreditation type are listed publicly." },
    ],
    relatedLinks: [
      { href: "/en/compare?category=executive", label: "Compare JCI hospital prices →" },
      { href: "/en/hospital/bumrungrad", label: "Bumrungrad packages" },
      { href: "/en/guide/bangkok-health-checkup", label: "Full Bangkok health check-up guide" },
    ],
  },
  "what-is-included-checkup": {
    title: "What Is Included in a Health Check-Up in Bangkok? (All Package Types)",
    description: "Detailed breakdown of every test included in Bangkok health check-up packages: basic, comprehensive, executive, cancer screening, cardiac, and women's health.",
    intro: "Health check-up packages in Bangkok vary widely in what they include. This guide gives a complete breakdown of every test type by package tier, so you can choose the right level for your needs.",
    sections: [
      {
        heading: "Basic health check-up package",
        content: "Ideal for young adults aged 20–35 with no known conditions as an annual baseline. Typically completed in 1–2 hours.",
        list: [
          "Complete blood count (CBC): red cells, white cells, platelets, haemoglobin",
          "Fasting blood glucose (diabetes screening)",
          "Lipid panel: total cholesterol, LDL, HDL, triglycerides",
          "Liver function: AST, ALT, alkaline phosphatase",
          "Kidney function: creatinine, BUN, eGFR",
          "Urinalysis (urine dipstick + microscopy)",
          "Blood pressure, pulse, BMI",
          "Cost range: ฿2,000 – ฿6,000",
        ],
      },
      {
        heading: "Comprehensive health check-up package",
        content: "The most popular tier for medical tourists aged 30–50. Adds imaging and specialist tests to the basic panel.",
        list: [
          "Everything in Basic package +",
          "Chest X-ray (2 views)",
          "Abdominal ultrasound (liver, gallbladder, spleen, kidneys, pancreas)",
          "12-lead ECG (resting)",
          "Thyroid function: TSH, free T3, free T4",
          "Hepatitis B surface antigen (HBsAg)",
          "Hepatitis C antibody (anti-HCV)",
          "Pap smear (women) or PSA prostate marker (men 40+)",
          "Doctor consultation for results",
          "Cost range: ฿6,000 – ฿20,000",
        ],
      },
      {
        heading: "Executive health check-up package",
        content: "The premium tier used by corporate clients and those wanting the most complete screening. Includes tumour markers and advanced imaging.",
        list: [
          "Everything in Comprehensive package +",
          "Tumour markers: AFP (liver), CEA (colon), CA-125 (ovarian), CA 19-9 (pancreas/bile), PSA (prostate)",
          "Stool occult blood test (colorectal cancer screening)",
          "Bone density (DEXA scan) at some hospitals",
          "MRI brain / full-body MRI at premium tier",
          "Cardiac CT angiography at some hospitals",
          "Senior physician consultation (extended)",
          "Same-day results where available",
          "Cost range: ฿15,000 – ฿80,000",
        ],
      },
      {
        heading: "Cancer screening add-on",
        content: "Cancer marker tests and imaging can be added to most packages. Detection at early stages dramatically improves outcomes.",
        list: [
          "AFP — liver cancer (normal: <20 ng/mL)",
          "CEA — colon, lung, breast cancer (normal: <2.5 ng/mL non-smoker)",
          "CA-125 — ovarian cancer in women (normal: <35 U/mL)",
          "CA 19-9 — pancreatic/bile duct cancer (normal: <37 U/mL)",
          "PSA (total + free) — prostate cancer in men (age-adjusted normal ranges)",
          "Low-dose CT chest — lung cancer (for smokers 50+)",
          "Mammogram — breast cancer (women 40+)",
          "Cost range: ฿3,000 – ฿25,000 depending on tests selected",
        ],
      },
      {
        heading: "Cardiac / heart health check-up",
        content: "Focused cardiac screening is available as a standalone package or add-on at most hospitals.",
        list: [
          "Resting ECG (12-lead)",
          "Echocardiogram (cardiac ultrasound)",
          "Exercise stress test (treadmill ECG)",
          "Lipid panel (cardiac-specific interpretation)",
          "Homocysteine (cardiovascular risk marker)",
          "hsCRP (high-sensitivity C-reactive protein, inflammation marker)",
          "Coronary CT angiography at select hospitals",
          "Cardiology physician consultation",
          "Cost range: ฿8,000 – ฿40,000",
        ],
      },
      {
        heading: "Women's health check-up",
        content: "Women's packages add gynaecological screening to the standard panel.",
        list: [
          "Pap smear / liquid-based cytology (cervical cancer)",
          "HPV DNA test (human papillomavirus)",
          "Breast ultrasound / mammogram",
          "Pelvic ultrasound (uterus, ovaries)",
          "CA-125 (ovarian cancer marker)",
          "Bone density (DEXA) — especially for 45+",
          "Hormonal panel: estradiol, FSH, LH, progesterone",
          "Thyroid panel (more common in women)",
          "Cost range: ฿5,000 – ฿30,000",
        ],
      },
    ],
    faqs: [
      { q: "Which health check-up package is best for a 35-year-old?", a: "A comprehensive package (฿8,000–฿20,000) is ideal for a healthy 35-year-old. It covers all major organ systems, adds thyroid and hepatitis screening, and includes imaging. If there is a family history of cancer, add tumour markers for ฿3,000–฿5,000 extra." },
      { q: "Is an MRI included in a standard executive check-up in Bangkok?", a: "Not always — MRI is included in premium executive packages at flagship hospitals (Bumrungrad, Bangkok Hospital) but costs extra at many mid-tier hospitals. Use our comparison table's MRI filter to see which packages include it as standard." },
    ],
    relatedLinks: [
      { href: "/en/compare?category=comprehensive", label: "Compare comprehensive packages →" },
      { href: "/en/compare?category=executive", label: "Compare executive packages →" },
      { href: "/en/compare?category=cancer", label: "Compare cancer screening packages →" },
    ],
  },
  "cancer-screening-bangkok": {
    title: "Cancer Screening in Bangkok — Cost, Tests & Best Hospitals (2026)",
    description: "Complete guide to cancer screening packages in Bangkok. What tumour markers are tested, which hospitals offer them, and how much they cost.",
    intro: "Bangkok is one of Southeast Asia's top destinations for cancer screening. JCI-accredited hospitals offer comprehensive tumour marker panels, PET-CT, low-dose CT for lung cancer, and colonoscopy at prices 40–70% lower than equivalent facilities in the West.",
    sections: [
      {
        heading: "What cancer tests are included in a Bangkok screening package?",
        content: "Cancer screening packages in Bangkok typically include a combination of blood tumour markers and imaging. Here is what each level covers:",
        list: [
          "AFP (Alpha-fetoprotein) — liver cancer marker",
          "CEA (Carcinoembryonic antigen) — colon, lung, breast marker",
          "CA 125 — ovarian cancer marker (women)",
          "CA 19-9 — pancreatic and bile duct cancer marker",
          "PSA (Prostate-Specific Antigen) — prostate cancer marker (men 40+)",
          "CA 15-3 — breast cancer monitoring marker",
          "Basic panel (5–6 markers): ฿3,000 – ฿6,000",
          "Full panel + imaging (low-dose CT or mammogram): ฿15,000 – ฿35,000",
        ],
      },
      {
        heading: "Imaging cancer screening options in Bangkok",
        content: "Blood markers alone cannot diagnose cancer — imaging adds critical early detection capability for solid tumours:",
        list: [
          "Low-dose chest CT (LDCT) — best for lung cancer screening in smokers aged 50+",
          "Mammogram + breast ultrasound — standard for women 40+, or 35+ with family history",
          "Whole-body MRI — available at Bumrungrad and Bangkok Hospital for premium cancer screen",
          "PET-CT — most sensitive but expensive (฿35,000–฿70,000); typically for monitoring, not first-screen",
          "Colonoscopy — required for colorectal cancer detection; tumour markers are not sufficient alone",
          "Pap smear + HPV test — cervical cancer; inexpensive and highly effective",
        ],
      },
      {
        heading: "Which Bangkok hospitals are best for cancer screening?",
        content: "These hospitals have dedicated oncology and health screening departments with comprehensive cancer detection capabilities:",
        list: [
          "Bumrungrad International — full tumour panel + MRI/CT, highest volume international programme",
          "Bangkok Hospital — BDMS Cancer Centre, PET-CT on site, research-grade diagnostics",
          "Vejthani Hospital — competitive tumour marker pricing, JCI accredited",
          "BNH Hospital — boutique experience, Silom location, strong women's cancer screening",
          "Praram 9 Hospital — value pricing, full marker panel, good for budget-conscious",
          "Samitivej Hospital — strong women's programme, HPV + mammogram included in women's packages",
        ],
      },
      {
        heading: "How much does cancer screening cost in Bangkok?",
        content: "Cancer screening costs in Bangkok vary by package scope and hospital tier:",
        list: [
          "Basic tumour marker blood panel only: ฿3,000 – ฿6,000",
          "Full marker panel (8–10 markers): ฿6,000 – ฿12,000",
          "Marker panel + chest X-ray + ultrasound: ฿10,000 – ฿18,000",
          "Cancer screening + low-dose CT: ฿18,000 – ฿35,000",
          "Full executive with MRI and full cancer screen: ฿35,000 – ฿65,000",
          "PET-CT scan only (monitoring): ฿35,000 – ฿70,000",
        ],
      },
      {
        heading: "Who should get cancer screening in Bangkok?",
        content: "Cancer screening recommendations by risk group:",
        list: [
          "Age 40+: annual PSA (men), mammogram and Pap smear (women), basic tumour panel",
          "Age 50+: add low-dose chest CT (especially smokers or former smokers)",
          "Family history of cancer: start 10 years before the youngest diagnosed relative's age",
          "Smokers: low-dose CT annually from age 50",
          "High-risk occupations: consider annual full marker panel regardless of age",
          "All adults: Hepatitis B and C screening (liver cancer risk factors)",
        ],
      },
    ],
    faqs: [
      { q: "Are cancer tumour markers accurate?", a: "Tumour markers are screening tools, not definitive diagnoses. Elevated markers indicate risk and prompt further investigation (imaging, biopsy). They should not be used alone to diagnose cancer — always follow up with a doctor." },
      { q: "How quickly can I get cancer screening results in Bangkok?", a: "Blood tumour markers: results in 1–3 hours at most hospitals. Imaging (CT, mammogram) results: same day in most cases. Full written report: 1–2 business days. Rush same-day reports available at Bumrungrad and Bangkok Hospital." },
      { q: "Does travel insurance cover cancer screening in Bangkok?", a: "Most standard travel insurance does NOT cover elective screening. International health insurance (Cigna, Bupa, AXA) may cover preventive screening if your policy includes wellness benefits — check your policy document before booking." },
    ],
    relatedLinks: [
      { href: "/en/compare?category=cancer", label: "Compare cancer screening packages →" },
      { href: "/en/compare?category=executive", label: "Compare executive packages (with cancer markers) →" },
      { href: "/en/guide/colonoscopy-cost-bangkok", label: "Colonoscopy cost Bangkok" },
      { href: "/en/guide/jci-hospitals-bangkok", label: "JCI-accredited hospitals in Bangkok" },
    ],
  },

  "colonoscopy-cost-bangkok": {
    title: "Colonoscopy Cost in Bangkok — 2026 Price Guide",
    description: "How much does a colonoscopy cost in Bangkok? Compare colonoscopy prices at JCI and private hospitals. From ฿7,000. Sedation, same-day results, English reports.",
    intro: "A colonoscopy in Bangkok costs 50–80% less than in the US, UK, or Japan — with the same standard of care, HD imaging, and English-speaking gastroenterologists at all major private hospitals. Bangkok's JCI hospitals perform thousands of colonoscopies annually for both local patients and medical tourists. Sedation (conscious or deep) is standard, and results including biopsy if taken are typically available within 1–7 days.",
    sections: [
      {
        heading: "Colonoscopy prices in Bangkok (2026)",
        content: "Colonoscopy cost comparison at Bangkok private hospitals:",
        list: [
          "Colonoscopy (diagnostic, no polyp): ฿7,000 – ฿15,000 (US equivalent: $1,500–$4,000)",
          "Colonoscopy with polypectomy (polyp removal): ฿12,000 – ฿25,000 (US equivalent: $2,500–$7,000)",
          "Combined gastroscopy + colonoscopy ('scope from both ends'): ฿12,000 – ฿25,000 (separate price: ฿4,500–฿8,000 for gastroscopy)",
          "Colonoscopy add-on to executive health package: ฿7,000 – ฿12,000",
          "Virtual colonoscopy (CT colonoscopy): ฿8,000 – ฿18,000",
          "Biopsy analysis (if polyp found): ฿1,500 – ฿4,000 extra per sample",
        ],
      },
      {
        heading: "Preparation for colonoscopy in Bangkok",
        content: "Colonoscopy preparation at Bangkok hospitals follows international protocols:",
        list: [
          "Low-fibre diet: 2–3 days before the procedure, avoid high-fibre foods, raw vegetables, fruits with seeds",
          "Clear liquid diet: 1 day before — water, broth, clear juices, electrolyte drinks only; nothing red or purple",
          "Bowel prep solution: hospital provides a solution (typically Fortrans/PEG or sodium phosphate); drink 2–4 litres the afternoon/evening before",
          "Fasting: nothing by mouth (including water) for 4–6 hours before procedure",
          "Sedation: conscious sedation (midazolam + fentanyl) or deep sedation (propofol) is standard; you will not feel pain; bring a companion to drive you home",
          "Duration: the procedure takes 20–60 minutes; you stay 1–2 hours for recovery",
        ],
      },
      {
        heading: "Best Bangkok hospitals for colonoscopy",
        content: "Top-rated hospitals for gastroenterology and colonoscopy in Bangkok:",
        list: [
          "Bumrungrad International — largest gastroenterology department in Thailand; HD colonoscopy; full sedation options; results same day",
          "Bangkok Hospital — BDMS Gastrointestinal Centre; experienced endoscopists; competitive pricing for procedures",
          "Samitivej Sukhumvit — dedicated endoscopy suite; Korean gastroscopy specialists popular with Japanese and Korean visitors",
          "Vejthani Hospital — most competitive JCI pricing; English-speaking gastroenterologists; good for combination gastroscopy + colonoscopy",
          "BNH Hospital — preferred by Japanese and European expat community; personal atmosphere; qualified gastroenterologists",
          "Praram 9 Hospital — good value non-JCI option; central location; experienced endoscopy team",
        ],
      },
      {
        heading: "Who needs a colonoscopy?",
        content: "Colonoscopy is recommended for:",
        list: [
          "Adults age 45+: first-line colorectal cancer screening for average-risk individuals (ACS 2024 guideline — down from 50)",
          "Adults age 40+ with family history: if a parent/sibling had colorectal cancer, start 10 years before their diagnosis age",
          "Repeat screening: every 10 years if no polyps found; every 3–5 years if adenomatous polyps were found",
          "Symptomatic: rectal bleeding, change in bowel habits, unexplained anaemia, abdominal pain, unintentional weight loss",
          "Japanese visitors: colonoscopy is commonly added to health check-up packages; Tokyo hospitals often have 6–12 month waits vs same-week in Bangkok",
          "Korean visitors: 대장내시경 (colonoscopy) is standard in Korean 건강검진 from age 50; Bangkok offers it from age 45 without waiting",
        ],
      },
    ],
    faqs: [
      { q: "How much does a colonoscopy cost in Bangkok vs the US?", a: "A colonoscopy in Bangkok costs ฿7,000–฿15,000 (approximately US$190–$410). In the US without insurance: $1,500–$4,000. Even with insurance, US co-pays can be $500–$1,500. A colonoscopy with polypectomy in Bangkok: ฿12,000–฿25,000 (US$330–$690) vs US$2,500–$7,000 in America. Bangkok offers the same HD endoscopy equipment and board-certified gastroenterologists." },
      { q: "Is sedation available for a colonoscopy in Bangkok?", a: "Yes — all major Bangkok private hospitals offer sedation for colonoscopy. Conscious sedation (midazolam + fentanyl) is most common — you are relaxed and pain-free but may have some awareness. Propofol (deep sedation) is available at most JCI hospitals on request — you are fully asleep. The sedation cost is typically included in the colonoscopy price at Bangkok private hospitals." },
      { q: "How long does a colonoscopy take in Bangkok?", a: "The colonoscopy procedure itself takes 20–60 minutes depending on bowel preparation quality and any polyps found. Recovery from sedation takes 1–2 hours. You will need to fast the day before and follow bowel preparation. Plan for a full-day commitment — arrive early, undergo prep review, the procedure, and recovery. A same-day appointment is usually possible with advance notice." },
      { q: "Can I combine a colonoscopy with my executive health check-up?", a: "Yes — all Bangkok JCI hospitals offer colonoscopy as an add-on to health check-up packages. Adding a colonoscopy to your executive package typically adds ฿7,000–฿12,000 to the package price. Note: colonoscopy requires separate preparation the day before your health check-up, so you will need 2 days in Bangkok. Most hospitals will schedule your health check-up bloods and imaging on day 1, and the scope on day 2." },
    ],
    relatedLinks: [
      { href: "/en/guide/cancer-screening-bangkok", label: "Cancer screening Bangkok" },
      { href: "/en/guide/gastroscopy-cost-bangkok", label: "Gastroscopy cost Bangkok" },
      { href: "/en/guide/health-checkup-japan-vs-thailand", label: "Japan vs Thailand — Ningen Dock" },
      { href: "/en/guide/best-hospitals-korean-tourists", label: "Korean tourists guide (한국어)" },
    ],
  },

  "gastroscopy-cost-bangkok": {
    title: "Gastroscopy Cost in Bangkok — 2026 Price Guide (Endoscopy)",
    description: "How much does a gastroscopy (upper endoscopy) cost in Bangkok? From ฿4,500. Sedation available, same-day results, popular with Japanese and Korean tourists.",
    intro: "A gastroscopy (胃カメラ / 위내시경 / upper endoscopy / OGD) in Bangkok costs ฿4,500–฿9,000 — compared to US$700–$3,000 in the US, or ¥20,000–฿40,000 in Japan. Bangkok's private hospitals use HD Olympus or Fujifilm endoscopes, and experienced gastroenterologists perform thousands of procedures annually. Sedation (conscious or light) is routinely available.",
    sections: [
      {
        heading: "Gastroscopy prices in Bangkok (2026)",
        content: "Gastroscopy cost at Bangkok private hospitals (outpatient, including sedation and report):",
        list: [
          "Gastroscopy only (no sedation): ฿3,500 – ฿6,000",
          "Gastroscopy with sedation: ฿4,500 – ฿9,000",
          "Gastroscopy + biopsy (if ulcer/H.pylori suspected): ฿5,500 – ฿12,000",
          "Combined gastroscopy + colonoscopy ('top and tail'): ฿12,000 – ฿25,000",
          "H. Pylori urea breath test (non-endoscopic alternative): ฿800 – ฿2,000",
          "H. Pylori rapid test (blood, stool, or biopsy): ฿500 – ฿2,500",
        ],
      },
      {
        heading: "What is a gastroscopy — and who needs one?",
        content: "A gastroscopy examines the oesophagus, stomach, and the first part of the small intestine (duodenum) using a flexible camera on a tube:",
        list: [
          "Diagnostic uses: persistent heartburn/GERD, difficulty swallowing, unexplained weight loss, nausea, upper abdominal pain, suspected stomach ulcer or H. pylori infection",
          "Screening uses: Japan and Korea have high rates of stomach cancer (among the highest in the world) — annual or biennial gastroscopy screening is routine in these countries from age 40–50",
          "Not required routinely in Western countries: US/UK guidelines recommend gastroscopy only for symptoms, not routine screening for average-risk individuals",
          "Tourist add-on: many Japanese and Korean medical tourists in Bangkok add gastroscopy to their health check-up package — Bangkok hospitals process the same day, Japanese hospitals often have 6–12 month waits",
        ],
      },
      {
        heading: "Gastroscopy preparation in Bangkok",
        content: "Preparation for a gastroscopy is simpler than colonoscopy:",
        list: [
          "Fasting: 6–8 hours before the procedure; water allowed up to 2 hours before",
          "Sedation: conscious sedation (midazolam ± fentanyl) makes the procedure comfortable; you may have mild awareness",
          "Throat spray: local anaesthetic throat spray is typically given even with sedation to suppress the gag reflex",
          "Duration: procedure takes 10–20 minutes; recovery from sedation 30–60 minutes",
          "After the procedure: minor throat discomfort is normal; eat soft foods for the first 24 hours; no driving after sedation",
        ],
      },
      {
        heading: "Gastroscopy vs barium swallow — why Bangkok is better",
        content: "Japanese Ningen Dock traditionally uses a barium swallow (バリウム検査) rather than direct gastroscopy. Bangkok hospitals use direct gastroscopy as standard:",
        list: [
          "Accuracy: direct gastroscopy is significantly more sensitive than barium swallow for detecting early gastric cancer, ulcers, and polyps",
          "Biopsy: gastroscopy allows immediate biopsy of suspicious lesions; barium swallow cannot",
          "H. pylori: biopsy during gastroscopy allows direct detection (CLO test); barium swallow cannot detect H. pylori",
          "Patient experience: barium swallow requires drinking a thick chalky liquid and lying at angles; modern sedation makes gastroscopy comfortable",
          "Price: Bangkok gastroscopy (฿4,500–฿9,000) is comparable to Japanese barium swallow cost (¥5,000–฿20,000) and offers superior clinical value",
        ],
      },
    ],
    faqs: [
      { q: "How much does a gastroscopy cost in Bangkok?", a: "A gastroscopy with sedation in Bangkok costs ฿4,500–฿9,000 (approximately US$125–$250). In the US without insurance: $700–$3,000. In Japan: ¥20,000–¥40,000 (barium equivalent). In the UK (Spire/BMI private): £800–£1,500. Bangkok offers the same HD endoscope quality at 70–80% lower cost." },
      { q: "Is sedation available for a gastroscopy in Bangkok?", a: "Yes — conscious sedation (midazolam with or without fentanyl) is available at all major Bangkok private hospitals. Propofol (full sedation) is also available on request at JCI hospitals. Most patients report little or no discomfort with sedation. Bring a companion to drive you home — you should not drive or make important decisions for 12–24 hours after sedation." },
      { q: "Can I combine a gastroscopy with my health check-up?", a: "Yes — gastroscopy is one of the most popular health check-up add-ons at Bangkok private hospitals, especially for Japanese and Korean visitors. You can combine it with an executive health check-up. Note: the gastroscopy should be scheduled on the same morning as your blood tests and fasting — all in one appointment. Most hospitals arrange this seamlessly." },
      { q: "Is gastroscopy the same as an endoscopy?", a: "Yes — 'gastroscopy', 'upper endoscopy', and 'OGD' (oesophago-gastro-duodenoscopy) all refer to the same procedure: camera examination of the upper gastrointestinal tract from the mouth to the duodenum. 'Endoscopy' alone can mean either upper or lower (colonoscopy). When booking, specify 'upper GI endoscopy' or 'gastroscopy' to ensure you get the stomach camera, not the colonoscopy." },
    ],
    relatedLinks: [
      { href: "/en/guide/colonoscopy-cost-bangkok", label: "Colonoscopy cost Bangkok" },
      { href: "/en/guide/health-checkup-japan-vs-thailand", label: "Japan vs Thailand — Ningen Dock" },
      { href: "/en/guide/best-hospitals-korean-tourists", label: "Korean tourists guide" },
      { href: "/en/guide/cancer-screening-bangkok", label: "Cancer screening Bangkok" },
    ],
  },

  "womens-health-checkup-bangkok": {
    title: "Women's Health Check-Up in Bangkok — Packages, Prices & Best Hospitals (2026)",
    description: "Complete guide to women's health check-up packages in Bangkok. Pap smear, mammogram, HPV testing, hormone panel — what's included and where.",
    intro: "Bangkok hospitals offer comprehensive women's health screening packages covering gynaecological, hormonal, and cancer screening needs — at prices significantly lower than equivalent services in Europe or North America. This guide covers what to expect, which tests are included, and how to choose the right package.",
    sections: [
      {
        heading: "What is included in a women's health check-up in Bangkok?",
        content: "Women's health packages in Bangkok vary by tier. Here is a breakdown of what each level covers:",
        list: [
          "Basic: CBC, blood glucose, lipid panel, thyroid (TSH), liver/kidney function, urinalysis",
          "Standard women's: + Pap smear, breast ultrasound, pelvic ultrasound, CA-125 marker",
          "Comprehensive women's: + mammogram, HPV DNA test, hormonal panel (estradiol, FSH, LH), bone density",
          "Premium: + full tumour panel, low-dose CT or MRI, cardiology consult",
          "Cost range: ฿5,000 (basic gynaecological screen) to ฿35,000 (comprehensive with imaging)",
        ],
      },
      {
        heading: "Pap smear and HPV testing in Bangkok",
        content: "Cervical cancer screening is available at all major private hospitals. Bangkok offers both traditional and liquid-based cytology (LBC) options, plus HPV DNA testing.",
        list: [
          "Traditional Pap smear: ฿500 – ฿1,500",
          "Liquid-based cytology (LBC/ThinPrep): ฿1,500 – ฿3,000",
          "HPV DNA test (high-risk genotyping): ฿2,000 – ฿4,500",
          "Combined LBC + HPV: recommended for women 30–65 by most international guidelines",
          "Results in 1–3 business days",
          "Available at Samitivej, Bumrungrad, BNH, Vejthani, and most major private hospitals",
        ],
      },
      {
        heading: "Mammogram and breast screening in Bangkok",
        content: "Breast cancer is the most common cancer in Thai women and most expatriates aged 40+. Bangkok hospitals offer digital mammography and breast ultrasound:",
        list: [
          "2D digital mammogram: ฿1,500 – ฿3,500",
          "3D tomosynthesis mammogram (more accurate): ฿3,000 – ฿6,000",
          "Breast ultrasound (standalone): ฿1,000 – ฿2,500",
          "Mammogram + ultrasound combined: included in most comprehensive women's packages",
          "Recommended from age 40 (35+ with family history)",
          "Same-day results at Bumrungrad, Bangkok Hospital, BNH",
        ],
      },
      {
        heading: "Hormonal panel for women in Bangkok",
        content: "Women approaching or going through menopause, or experiencing hormonal symptoms, can access a full hormonal panel in Bangkok:",
        list: [
          "Estradiol (E2): reproductive health, menopause monitoring",
          "FSH (Follicle-Stimulating Hormone): ovarian reserve, menopause",
          "LH (Luteinizing Hormone): ovulation and cycle irregularities",
          "Progesterone: luteal phase assessment",
          "AMH (Anti-Müllerian Hormone): ovarian reserve, fertility planning",
          "DHEA-S and testosterone: androgen imbalance",
          "Full hormonal panel: ฿3,000 – ฿8,000 depending on number of markers",
        ],
      },
      {
        heading: "Best hospitals for women's health check-ups in Bangkok",
        content: "These hospitals have dedicated women's health departments with experienced gynaecologists and breast specialists:",
        list: [
          "Samitivej Hospital (Sukhumvit) — largest dedicated women's health centre in Bangkok",
          "BNH Hospital — boutique, English-speaking gynaecology team, Silom location",
          "Bumrungrad International — largest comprehensive programme, most languages",
          "Bangkok Hospital (BDMS) — Women's Centre, mammography suite on site",
          "Vejthani Hospital — JCI accredited, competitive pricing for women's packages",
        ],
      },
    ],
    faqs: [
      { q: "Do I need a referral for a women's health check-up in Bangkok?", a: "No — you can book directly at any private hospital in Bangkok without a GP referral. Most hospitals accept self-referred international patients for health screening packages." },
      { q: "At what age should I start mammography in Bangkok?", a: "International guidelines vary. The American Cancer Society recommends annual mammography from age 45; UK NHS from age 50. Thai and most Asian guidelines recommend starting at 40. If you have a first-degree relative with breast cancer, start 10 years before their diagnosis age." },
      { q: "Is a Pap smear required every year?", a: "Current evidence supports less frequent screening. NICE (UK) guidelines: every 3 years age 25–49, every 5 years age 50–64. With a negative HPV test: every 5 years. If you have not been screened recently, book now — Bangkok hospitals offer walk-in cervical screening from ฿1,000." },
    ],
    relatedLinks: [
      { href: "/en/compare?category=women", label: "Compare women's health packages →" },
      { href: "/en/compare?category=cancer", label: "Compare cancer screening packages →" },
      { href: "/en/guide/mammogram-cost-bangkok", label: "Mammogram cost Bangkok guide" },
      { href: "/en/guide/bangkok-health-checkup", label: "Full Bangkok health check-up guide" },
    ],
  },

  "mammogram-cost-bangkok": {
    title: "Mammogram Cost in Bangkok — 2026 Price Guide",
    description: "How much does a mammogram cost in Bangkok? Digital mammography and 3D tomosynthesis prices at JCI hospitals. From ฿1,200 for a standalone mammogram.",
    intro: "A mammogram in Bangkok costs 50–75% less than in the US, UK, or Australia — with same-day results and English-speaking radiologists at all private hospitals. Bangkok's top hospitals use digital mammography and 3D tomosynthesis (Hologic) for the highest resolution breast imaging. Mammography is available standalone or as part of women's health check-up packages.",
    sections: [
      {
        heading: "Mammogram prices in Bangkok (2026)",
        content: "Standalone and package mammogram prices at Bangkok private hospitals:",
        list: [
          "Digital mammogram (2D): ฿1,200 – ฿2,800 (US equivalent: $200–$500)",
          "3D mammography (tomosynthesis): ฿2,500 – ฿5,500 (US equivalent: $350–$600)",
          "Mammogram + breast ultrasound combo: ฿3,500 – ฿7,500",
          "Women's health package (pap smear + mammogram + pelvic ultrasound): ฿5,000 – ฿15,000",
          "Mammogram + bone density (DEXA): ฿5,000 – ฿10,000",
          "Breast MRI (problem-solving, not routine screening): ฿12,000 – ฿25,000",
        ],
      },
      {
        heading: "2D vs 3D mammogram — which to choose?",
        content: "Understanding the difference helps you pick the right mammogram for your needs:",
        list: [
          "2D digital mammogram: standard breast cancer screening; involves two X-ray images per breast (CC and MLO views); takes 20–30 minutes; recommended as first-line screening for most women",
          "3D mammography (tomosynthesis): takes multiple X-ray slices through the breast (like a CT scan for breast tissue); 30–50% better at detecting cancer in dense breasts; reduces false positives by 30–40%; Hologic 3D systems at Bumrungrad, Samitivej, and Bangkok Hospital",
          "Who should get 3D: women with dense breast tissue (BIRADS C or D), those with prior abnormal results, first-time screening in their 40s",
          "Both types: no special preparation needed, same-day results at major Bangkok hospitals",
        ],
      },
      {
        heading: "Best Bangkok hospitals for mammograms",
        content: "Top hospitals for breast imaging in Bangkok:",
        list: [
          "Samitivej Hospital Sukhumvit — dedicated Women's Centre; Hologic 3D mammography; on-site breast specialist; most popular for women's health in Bangkok",
          "Bumrungrad International — full women's health programme; 3D tomosynthesis; Breast Centre with same-day specialist consultation",
          "Bangkok Hospital — Women's Wellness Centre; 3D mammography; competitive pricing for packages",
          "BNH Hospital — popular with European and Japanese expat women; friendly environment; 2D digital mammography",
          "Vejthani Hospital — most competitive pricing among JCI hospitals; 2D digital mammography; women's packages from ฿3,500",
        ],
      },
      {
        heading: "When to get a mammogram — age and risk",
        content: "Age guidelines for mammogram screening:",
        list: [
          "Age 40–44: many guidelines recommend optional annual mammogram if personal risk factors exist",
          "Age 45–54: ACS recommends annual mammogram; most Thai private hospital guidelines align with this",
          "Age 55+: biennial (every 2 years) mammogram recommended by most guidelines; some prefer annual",
          "Family history: if a first-degree relative had breast cancer, start screening 10 years before her diagnosis age (minimum age 25–30)",
          "Dense breast tissue: annual screening recommended; 3D mammography preferred over 2D",
          "If you have never had a mammogram: book now regardless of age 40+ — many Bangkok hospitals have no waiting list for women's health packages",
        ],
      },
    ],
    faqs: [
      { q: "How much does a mammogram cost in Bangkok vs the US?", a: "A standard 2D digital mammogram in Bangkok costs ฿1,200–฿2,800 (approximately US$33–$77), compared to US$100–$250 in the US without insurance. A 3D mammogram (tomosynthesis) costs ฿2,500–฿5,500 (US$69–$150) in Bangkok vs US$250–$400 in the US. Even including flights, Bangkok is significantly cheaper for comprehensive women's health packages." },
      { q: "Do I need a referral for a mammogram in Bangkok?", a: "No referral is required at Bangkok private hospitals. Walk in to the women's health centre or call the hospital's international desk to book directly. Most hospitals offer same-day appointments for routine mammography. If you're combining with other women's health tests (pap smear, pelvic ultrasound), book a women's health package to save time and money." },
      { q: "Are mammogram results available the same day in Bangkok?", a: "Yes — at all major Bangkok private hospitals, mammogram results (radiologist report in English) are available within 2–4 hours. 3D mammogram reports may take slightly longer (up to 24 hours for complex cases). Samitivej, Bumrungrad, and Bangkok Hospital all offer same-day consultation with a breast specialist to review results immediately." },
    ],
    relatedLinks: [
      { href: "/en/guide/womens-health-checkup-bangkok", label: "Women's health check-up Bangkok" },
      { href: "/en/guide/cancer-screening-bangkok", label: "Cancer screening Bangkok" },
      { href: "/en/guide/ct-scan-cost-bangkok", label: "CT scan cost Bangkok" },
      { href: "/en/compare?category=women", label: "Compare women's health packages" },
    ],
  },

  "senior-health-checkup-thailand": {
    title: "Senior Health Check-Up in Thailand — Tests, Hospitals & Costs (2026)",
    description: "Complete guide to health check-ups for seniors (60+) in Thailand. Which tests you need, best hospitals for elderly patients, prices, and how to prepare.",
    intro: "Thailand's private hospitals offer outstanding senior health screening programmes designed for patients aged 60 and above. These packages go beyond standard check-ups with age-appropriate tests including bone density, cognitive screening, prostate health, colorectal screening, and specialist consultations. Prices are 40–60% lower than comparable programmes in Western countries.",
    sections: [
      {
        heading: "What tests should seniors get in a health check-up?",
        content: "Senior health check-up packages in Thailand typically include age-specific tests beyond the standard adult screen:",
        list: [
          "Standard blood panel: CBC, lipids, liver/kidney function, blood glucose, HbA1c, thyroid (TSH)",
          "Bone density (DEXA scan): osteoporosis screening for men 70+, women 65+ (or earlier with risk factors)",
          "Colorectal cancer screening: faecal occult blood test (FOBT) or colonoscopy referral for 50+",
          "Prostate health (men): PSA (prostate-specific antigen) from age 50; from 45 with family history",
          "Mammogram (women 40–70): annual or biennial depending on risk; breast ultrasound as alternative",
          "Cognitive screening: mini-mental state exam (MMSE) or MoCA for patients 65+",
          "Ophthalmology: intraocular pressure (glaucoma), visual acuity",
          "Hearing test: pure-tone audiometry from age 60",
          "ECG + echocardiogram: atrial fibrillation risk increases significantly after 65",
          "Chest X-ray: lung cancer risk screening, especially for ex-smokers",
        ],
      },
      {
        heading: "Best hospitals for senior health check-ups in Thailand",
        content: "These hospitals have dedicated geriatric health programmes and senior-friendly facilities:",
        list: [
          "Bumrungrad International (Bangkok) — dedicated Seniors' Health Check programme, geriatric specialist on team, wheelchair access throughout",
          "Bangkok Hospital BDMS — Senior CheckUp packages explicitly designed for 60+, teleconsultation available",
          "Samitivej Sukhumvit — Women's senior programme (women 50+), comprehensive executive range",
          "Vejthani Hospital — competitive senior package pricing, JCI accredited",
          "Chiang Mai Ram Hospital — Northern Thailand's best senior check-up programme, less crowded than Bangkok",
          "Bangkok Hospital Phuket — good option for senior medical tourists combining holiday and check-up",
        ],
      },
      {
        heading: "Cost of senior health check-ups in Thailand",
        content: "Senior check-up packages cost more than standard packages due to additional tests, but remain significantly cheaper than Western equivalents:",
        list: [
          "Basic senior package (60+, standard + ECG + FOBT + PSA/Pap): ฿5,000 – ฿10,000",
          "Comprehensive senior (adds ultrasound, mammogram/breast ultrasound, bone density): ฿12,000 – ฿25,000",
          "Executive senior (adds cancer markers, cognitive screening, specialist consult): ฿25,000 – ฿60,000",
          "Premium senior with MRI brain: ฿40,000 – ฿90,000",
          "Comparison: equivalent US programme costs USD 3,000–8,000; UK private: GBP 2,000–5,000",
        ],
      },
      {
        heading: "How to prepare for a senior health check-up in Thailand",
        content: "Senior patients should take additional preparation steps for the best results:",
        list: [
          "Fasting: 10–12 hours recommended (more strict than younger adults for accurate glucose readings)",
          "Medications: do NOT stop blood thinners, blood pressure, or heart medications without consulting your doctor — inform the hospital",
          "Water: stay well-hydrated, especially for kidney function tests",
          "Mobility: all major hospitals have wheelchair access, golf carts, and porter assistance",
          "Companion: it is advisable to bring a companion for assistance and to remember the doctor's advice",
          "Previous results: bring your last 2–3 years of check-up results for trend comparison",
          "Hearing aids: bring and wear them for the consultation",
        ],
      },
    ],
    faqs: [
      { q: "At what age should I get a senior health check-up?", a: "Most hospitals classify 'senior' packages for patients 60+. However, some tests — like colonoscopy screening, mammogram, and PSA — are recommended from age 40–50. If you are 50+, use the senior package to ensure age-appropriate tests are included." },
      { q: "How long does a senior health check-up take in Thailand?", a: "A senior package typically takes 5–7 hours including specialist consultation. Some hospitals offer two half-day sessions. Book early morning appointments as most packages require fasting." },
      { q: "Can I get a senior health check-up in Thailand if I take daily medications?", a: "Yes. Inform the hospital at booking and on the day. For most medications (blood pressure, heart, thyroid), continue as normal and take with a small sip of water. Specific tests (FOBT, PSA) may have separate preparation requirements." },
      { q: "Does health insurance cover senior check-ups in Thailand?", a: "It depends on your policy. Major international insurers (Bupa Global, Cigna, Allianz Care) often cover annual health check-ups as a benefit. Thai LTR visa holders with Thai health insurance should check their policy schedule for wellness benefits." },
    ],
    relatedLinks: [
      { href: "/en/for/senior-health-checkup-bangkok", label: "Senior packages in Bangkok →" },
      { href: "/en/compare?category=senior", label: "Compare senior health packages →" },
      { href: "/en/compare?category=cancer", label: "Compare cancer screening packages →" },
      { href: "/en/compare?category=cardiac", label: "Compare cardiac packages →" },
      { href: "/en/guide/bangkok-health-checkup", label: "Full Bangkok health check-up guide" },
    ],
  },
  "health-checkup-expats-thailand": {
    title: "Health Check-Up for Expats in Thailand — Where, What & How Much (2026)",
    description: "Guide to annual health check-ups for expats living in Thailand. Which tests you need, best hospitals, insurance, prices, and how to set up regular health screening.",
    intro: "Thailand is home to over 400,000 long-term foreign residents. Regular health check-ups are essential for expats who may not be registered with a local GP or may have limited access to subsidised healthcare. Thailand's private hospitals make this easy — comprehensive annual check-ups with English-speaking doctors, modern equipment, and results in 1–2 days.",
    sections: [
      {
        heading: "Which health tests do expats need annually?",
        content: "The recommended annual health screening for expats in Thailand varies by age and risk profile, but these tests are universally recommended:",
        list: [
          "Complete blood count (CBC): anaemia, infection markers — annually",
          "Fasting blood glucose + HbA1c: diabetes screening — annually (especially in Thailand with its high-sugar cuisine)",
          "Lipid panel: cholesterol, LDL, HDL, triglycerides — annually from age 35",
          "Liver function tests: AST, ALT, ALP, GGT — annually (alcohol consumption and fatty liver are common expat health issues)",
          "Kidney function: creatinine, BUN, eGFR — annually",
          "Thyroid function (TSH): thyroid disease is common but often undiagnosed — annually",
          "Hepatitis B & C: test if not vaccinated or haven't tested recently — once, or more if high-risk",
          "HIV: recommended annually for sexually active adults",
          "Blood pressure + BMI: at every check-up",
          "Chest X-ray: every 1–2 years for smokers; TB exposure if travelling rural Thailand",
        ],
      },
      {
        heading: "Best hospitals for expats in Thailand",
        content: "These hospitals are most popular with the expat community due to language access, continuity of care, and international insurance acceptance:",
        list: [
          "Bangkok: Bumrungrad International, Samitivej, BNH Hospital, Vejthani — all with large expat patient bases and English-speaking GPs",
          "Chiang Mai: Chiang Mai Ram, Bangkok Hospital CM — strong expat communities, GP and check-up services",
          "Phuket: Bangkok Hospital Phuket, Phuket International Hospital — popular with long-stay expats and retirees",
          "Pattaya: Bangkok Pattaya Hospital — large Russian, European, and US expat population served",
          "Hua Hin: Bangkok Hospital Hua Hin — growing retiree community, good continuity-of-care",
          "Koh Samui: Samui International Hospital, Bangkok Hospital Samui — expat-friendly, English throughout",
        ],
      },
      {
        heading: "Health insurance for expats in Thailand",
        content: "Having health insurance in Thailand simplifies billing and ensures access to the best hospitals. Key points for expats:",
        list: [
          "International health insurance (IPMI): Cigna, Allianz Care, AXA Global Health, Bupa Global — all cover health check-ups at Thai private hospitals",
          "Thai insurance (AIA, Muang Thai, Prudential): some packages include health check-up benefits — check your policy",
          "OPD vs IPD: most Thai insurance policies are IPD (in-patient) only — health check-ups are outpatient, so may not be covered",
          "LTR visa (Long-Term Resident): Thai government requires health insurance with minimum ฿100,000 OPD and ฿1M IPD coverage",
          "Cashless billing: major Bangkok hospitals have direct billing agreements with most international insurers",
          "If uninsured: pay out-of-pocket — very affordable compared to home countries",
        ],
      },
      {
        heading: "Setting up regular health screening as an expat in Thailand",
        content: "Tips for establishing a sustainable annual check-up routine as a Thailand expat:",
        list: [
          "Choose a hospital: select one near your home or with online booking and patient portal for continuity",
          "Schedule annually: set a fixed date — many expats use their birthday month or visa renewal month",
          "Build your medical history: keep digital copies of all results — hospitals offer PDF downloads on request",
          "Register as a long-term patient: hospitals like Bumrungrad and Samitivej have 'patient membership' schemes for better rates",
          "Bring results home: if you travel back to your home country, bring your results to share with your home GP",
          "Check-up during 'off-season': avoid peak tourist months (Dec–Feb) when hospitals are busiest",
        ],
      },
    ],
    faqs: [
      { q: "How much does an annual health check-up cost for expats in Thailand?", a: "A comprehensive annual check-up for expats typically costs ฿5,000–฿15,000 at a reputable private hospital. This covers all essential blood tests, chest X-ray, ECG, ultrasound, and physician consultation. Executive packages with cancer markers cost ฿15,000–฿40,000." },
      { q: "Do I need health insurance to get a check-up in Thailand?", a: "No — anyone can pay out-of-pocket at Thai private hospitals. Health check-up packages are typically outpatient services that many insurance policies don't cover anyway. Check your policy, but be prepared to pay directly if OPD isn't covered." },
      { q: "Can I get my prescription medications reviewed during a health check-up?", a: "Yes. Ask for a physician consultation to be included in your package. The doctor can review your current medications, check for interactions with Thai versions (generic brands), and issue Thai prescriptions if needed." },
      { q: "How do I get my health check-up results in English in Thailand?", a: "All major private hospitals provide results in English as standard for international patients. Some hospitals also offer online patient portals where you can download PDF results. Always ask for an English summary letter for your home GP." },
    ],
    relatedLinks: [
      { href: "/en/compare?category=comprehensive", label: "Compare comprehensive packages →" },
      { href: "/en/compare?category=executive", label: "Compare executive packages →" },
      { href: "/en/guide/bangkok-health-checkup", label: "Bangkok health check-up guide" },
      { href: "/en/guide/what-is-included-checkup", label: "What is included in a health check-up?" },
    ],
  },
  "chiang-mai-health-checkup": {
    title: "Health Check-Up in Chiang Mai — Hospitals, Prices & Guide (2026)",
    description: "Complete guide to health check-up packages in Chiang Mai, Thailand. Compare prices at Chiang Mai Ram, Lanna, Bangkok Hospital Chiang Mai and more. From ฿1,800.",
    intro: "Chiang Mai is Northern Thailand's leading medical hub, with a growing cluster of international-standard private hospitals serving both expats and medical tourists. Health check-up packages here typically cost 20–40% less than Bangkok equivalents, with shorter waiting times and excellent English-language service.",
    sections: [
      {
        heading: "Health check-up prices in Chiang Mai",
        content: "Prices at Chiang Mai's private hospitals are competitive and transparent. Here is what to expect across package tiers:",
        list: [
          "Basic package (CBC, blood glucose, cholesterol, urine): ฿1,800 – ฿4,500",
          "Standard package (adds chest X-ray, ultrasound, ECG, thyroid): ฿4,500 – ฿12,000",
          "Executive package (adds cancer markers, specialist consult): ฿12,000 – ฿35,000",
          "Women's health package (adds Pap smear, mammogram): ฿5,000 – ฿18,000",
          "Cancer screening package (tumour markers, imaging): ฿8,000 – ฿30,000",
        ],
      },
      {
        heading: "Best hospitals for health check-ups in Chiang Mai",
        content: "Chiang Mai has several high-quality private hospitals with dedicated health screening departments for international patients:",
        list: [
          "Chiang Mai Ram Hospital — the largest private hospital in Northern Thailand, comprehensive executive programmes, English staff",
          "Bangkok Hospital Chiang Mai (BDMS) — part of Thailand's largest hospital group, full range of packages, international patient centre",
          "Lanna Hospital — long-established private hospital, competitive pricing, strong expat community reputation",
          "Rajavej Chiang Mai Hospital — central location, mid-range pricing, good standard packages",
          "Nakornping Hospital — government hospital, lower prices for basic check-ups, longer waiting times",
          "McCormick Hospital — mission hospital with good value packages, friendly to budget travellers",
        ],
      },
      {
        heading: "How to book a health check-up in Chiang Mai",
        content: "Most Chiang Mai hospitals allow online and walk-in bookings. Here is what to expect:",
        list: [
          "Chiang Mai Ram and Bangkok Hospital CM: book 2–7 days in advance for executive packages",
          "Lanna and Rajavej: walk-in friendly, but advance booking recommended for mornings",
          "Fasting required: 8–12 hours before your appointment for blood tests",
          "Bring: passport, list of medications, any previous results for comparison",
          "Results: same-day for most blood tests; 1–3 days for imaging reports",
          "English-language results booklets available at all major hospitals",
        ],
      },
      {
        heading: "Chiang Mai vs Bangkok: which is better for a health check-up?",
        content: "Both cities offer excellent health screening. Here is how they compare for medical tourists:",
        list: [
          "Price: Chiang Mai 20–40% cheaper than Bangkok for equivalent packages",
          "Waiting times: shorter at Chiang Mai hospitals — no need to book weeks ahead",
          "Quality: Bangkok's JCI hospitals (Bumrungrad, Samitivej) are marginally higher tier, but Chiang Mai Ram meets international standards",
          "Convenience: if you are already visiting Chiang Mai as a tourist, it is ideal to schedule your check-up there",
          "Language: English excellent at all major Chiang Mai private hospitals",
          "Getting there: Chiang Mai Airport (CNX) has direct flights from 30+ international destinations",
        ],
      },
    ],
    faqs: [
      { q: "Which hospital is best for health check-ups in Chiang Mai?", a: "Chiang Mai Ram Hospital and Bangkok Hospital Chiang Mai are the top choices for international patients. Both have English-speaking staff, modern equipment, and comprehensive executive packages from ฿12,000." },
      { q: "How much is a basic health check-up in Chiang Mai?", a: "A basic health check-up (CBC, blood glucose, cholesterol, urinalysis) starts from ฿1,800 at mid-range hospitals. A comprehensive standard package with chest X-ray and ultrasound typically costs ฿4,500–฿8,000." },
      { q: "Is Chiang Mai cheaper than Bangkok for health check-ups?", a: "Yes, typically 20–40% cheaper. An executive package that costs ฿30,000 at Bumrungrad Bangkok may cost ฿18,000–฿22,000 at Chiang Mai Ram or Bangkok Hospital Chiang Mai." },
      { q: "Do Chiang Mai hospitals offer English-language results?", a: "Yes. All major private hospitals in Chiang Mai (Chiang Mai Ram, Bangkok Hospital CM, Lanna) provide results in English with a consultation from an English-speaking physician." },
    ],
    relatedLinks: [
      { href: "/en/city/chiang-mai", label: "All health check-up packages in Chiang Mai →" },
      { href: "/en/compare?category=executive", label: "Compare executive packages →" },
      { href: "/en/guide/bangkok-health-checkup", label: "Bangkok health check-up guide" },
      { href: "/en/guide/what-is-included-checkup", label: "What is included in a health check-up?" },
    ],
  },
  "phuket-health-checkup": {
    title: "Health Check-Up in Phuket — Hospitals, Prices & Guide (2026)",
    description: "Guide to health check-up packages in Phuket, Thailand. Compare prices at Bangkok Hospital Phuket, Siriroj, Mission Hospital and more. Packages from ฿1,900.",
    intro: "Phuket is Thailand's premier island destination and a growing medical tourism hub. The island has several modern private hospitals catering to international tourists and expats, with health screening packages available year-round. Combining a beach holiday with a health check-up is increasingly popular — Phuket's hospitals are well-equipped for this.",
    sections: [
      {
        heading: "Health check-up prices in Phuket",
        content: "Phuket's private hospitals offer competitive pricing for health screening across all tiers:",
        list: [
          "Basic package (CBC, blood glucose, cholesterol, urinalysis): ฿1,900 – ฿5,000",
          "Standard package (adds chest X-ray, abdominal ultrasound, ECG): ฿5,000 – ฿15,000",
          "Executive package (adds cancer markers, full specialist consultation): ฿15,000 – ฿40,000",
          "Women's health (Pap smear, breast ultrasound or mammogram): ฿5,500 – ฿20,000",
          "Cancer screening add-on: ฿8,000 – ฿28,000",
        ],
      },
      {
        heading: "Best hospitals for health check-ups in Phuket",
        content: "Phuket has a well-developed private hospital sector with strong international patient services:",
        list: [
          "Bangkok Hospital Phuket (BDMS) — largest private hospital in southern Thailand, most comprehensive package range, dedicated health check-up centre",
          "Phuket International Hospital (PIH) — long-established international hospital, competitive pricing, 3 locations in Phuket",
          "Siriroj Hospital (Thalang) — new modern facility north of Patong, good value executive packages",
          "Mission Hospital Phuket — central location in Phuket Town, mid-range packages, friendly to long-stay visitors",
          "Vachira Phuket Hospital — government hospital, very low prices for basic check-ups, primarily serves locals",
          "Dibuk Hospital — compact private hospital near Patong, convenient for tourists in the Patong/Kata area",
        ],
      },
      {
        heading: "Planning your Phuket health check-up",
        content: "Tips for combining a Phuket visit with a health check-up:",
        list: [
          "Best time to book: early in your trip — you get your results before you leave",
          "Book in advance: Bangkok Hospital Phuket executive packages fill up 3–5 days ahead in peak season (Dec–Mar)",
          "Location: Patong area is most convenient for most tourists; Phuket Town has the most hospital options",
          "Fasting: schedule an early morning appointment to minimise fasting disruption during your holiday",
          "Results: most blood results same-day; ask for PDF copy to share with your home doctor",
          "Cost vs Bangkok: comparable for basic/standard; executive packages can be 10–20% pricier due to island logistics",
        ],
      },
      {
        heading: "What to expect at a Phuket hospital",
        content: "Phuket's private hospitals are well-prepared for international patients:",
        list: [
          "Language: English at all major hospitals; Bangkok Hospital Phuket has staff speaking Chinese, Russian, German",
          "Payment: all major credit/debit cards, USD, EUR, and THB accepted",
          "Insurance: Bangkok Hospital Phuket and PIH accept major international insurers (AXA, Allianz, Cigna, Bupa)",
          "Dress code: light comfortable clothing; bring a light layer as Thai hospitals are air-conditioned",
          "Transport: all major hospitals provide shuttle services from major Phuket hotels on request",
        ],
      },
    ],
    faqs: [
      { q: "Which hospital is best for health check-ups in Phuket?", a: "Bangkok Hospital Phuket (BDMS) is the most comprehensive option with the widest range of packages. Phuket International Hospital is a good value alternative. Both have English-speaking staff and international patient centres." },
      { q: "How much is a health check-up in Phuket?", a: "Basic packages start from ฿1,900. Standard packages with X-ray and ultrasound cost ฿5,000–฿12,000. Executive packages range from ฿15,000–฿40,000. Use the compare tool above to see current prices." },
      { q: "Can I get a health check-up while on holiday in Phuket?", a: "Yes — this is increasingly common. Schedule an early morning appointment (most check-ups start 7–8am) on day 2 or 3 of your trip. Basic results are ready same-day and you can continue your holiday as normal." },
      { q: "Is Phuket or Bangkok better for a health check-up?", a: "Bangkok offers more hospitals and the JCI-accredited flagships (Bumrungrad, Samitivej). But if you are already visiting Phuket, Bangkok Hospital Phuket offers excellent quality at competitive prices without needing a separate trip to Bangkok." },
    ],
    relatedLinks: [
      { href: "/en/city/phuket", label: "All health check-up packages in Phuket →" },
      { href: "/en/compare?category=executive", label: "Compare executive packages →" },
      { href: "/en/guide/bangkok-health-checkup", label: "Bangkok health check-up guide" },
      { href: "/en/guide/cancer-screening-bangkok", label: "Cancer screening guide" },
    ],
  },
  "cardiac-health-checkup-bangkok": {
    title: "Cardiac Health Check-Up in Bangkok — Tests, Costs & Best Hospitals (2026)",
    description: "Complete guide to cardiac screening packages in Bangkok. ECG, stress test, echocardiogram, coronary CT — what's included and which hospitals offer the best value.",
    intro: "Heart disease is the leading cause of death worldwide. Bangkok's JCI-accredited hospitals offer comprehensive cardiac screening packages — from basic ECG and lipid panels to advanced coronary CT angiography — at prices significantly lower than equivalent services in the US, UK, or Australia.",
    sections: [
      {
        heading: "What tests are included in a Bangkok cardiac health check-up?",
        content: "Cardiac packages in Bangkok range from basic heart-risk blood tests to full interventional cardiology assessments:",
        list: [
          "Resting 12-lead ECG (electrocardiogram): heart rhythm and electrical activity",
          "Lipid panel: total cholesterol, LDL, HDL, triglycerides — core cardiac risk marker",
          "Blood glucose and HbA1c: diabetes is a major cardiac risk factor",
          "hsCRP (high-sensitivity C-reactive protein): arterial inflammation marker",
          "NT-proBNP: heart failure marker",
          "Echocardiogram (heart ultrasound): structure, valve function, ejection fraction",
          "Exercise stress test (EST/treadmill): cardiac function under controlled exertion",
          "Coronary CT angiography (CTA): non-invasive imaging of coronary arteries",
          "Cost range: ฿5,000 (basic ECG + lipids) to ฿50,000 (full cardiac programme with CTA)",
        ],
      },
      {
        heading: "Exercise stress test (treadmill test) in Bangkok",
        content: "The exercise stress test (EST) is a standard part of comprehensive cardiac evaluation. It detects coronary artery disease that isn't apparent at rest.",
        list: [
          "Duration: 30–60 minutes including setup and monitoring",
          "Protocol: graded treadmill (Bruce protocol) with 12-lead ECG throughout",
          "Requires physician supervision — available at all major cardiology departments",
          "Contraindicated if: recent MI, unstable angina, uncontrolled hypertension",
          "Cost: ฿3,000 – ฿8,000 standalone; included in many executive cardiac packages",
          "Same-day results: yes at Bumrungrad, Bangkok Hospital, Vejthani",
        ],
      },
      {
        heading: "Coronary CT angiography (CTA) in Bangkok",
        content: "Coronary CTA is a non-invasive test that visualises the coronary arteries and calcification score. It's used to assess atherosclerosis risk before symptoms appear.",
        list: [
          "256-slice or 320-slice CT scanners at major Bangkok hospitals",
          "Calcium scoring only (Agatston score): ฿3,000 – ฿6,000",
          "Full CTA with contrast: ฿15,000 – ฿30,000",
          "Takes 30–45 minutes including preparation",
          "Not suitable for: irregular heart rhythm, high heart rate, renal impairment, contrast allergy",
          "Available at: Bumrungrad, Bangkok Hospital, Vejthani, Phyathai 2",
        ],
      },
      {
        heading: "Best hospitals for cardiac health check-ups in Bangkok",
        content: "Bangkok hospitals with dedicated cardiology departments and comprehensive cardiac screening programmes:",
        list: [
          "Bumrungrad International — dedicated Heart Centre, full CTA and stress echo, highest volume international cardiac programme",
          "Bangkok Hospital (BDMS) — Cardiovascular Centre, interventional cardiology on-site",
          "Vejthani Hospital — JCI accredited, competitive cardiac package pricing, 24h cardiac care",
          "Phyathai 2 Hospital — JCI accredited, strong cardiac reputation",
          "BNH Hospital — smaller, boutique, good for outpatient cardiac evaluation without surgical capabilities",
        ],
      },
    ],
    faqs: [
      { q: "At what age should I get a cardiac health check-up?", a: "General guidelines: men from age 35, women from age 45. Start earlier (25–30) if you have: a family history of early heart disease, hypertension, diabetes, high cholesterol, smoking history, or obesity. Annual cardiac review is recommended once any risk factor is identified." },
      { q: "How long does a cardiac check-up take in Bangkok?", a: "A basic cardiac package (ECG, bloods, physician consult) takes 2–3 hours. A comprehensive package including echocardiogram and stress test takes 4–6 hours. Coronary CTA requires a separate half-day appointment with preparation." },
      { q: "Is a referral needed for cardiac screening in Bangkok?", a: "No referral is needed at private hospitals. You can book a cardiology screening package directly. If an issue is found, the hospital cardiology team will advise on next steps including specialist consultation." },
    ],
    relatedLinks: [
      { href: "/en/compare?category=cardiac", label: "Compare cardiac health packages →" },
      { href: "/en/compare?category=executive", label: "Executive packages (includes cardiac screening) →" },
      { href: "/en/guide/jci-hospitals-bangkok", label: "JCI-accredited hospitals in Bangkok" },
      { href: "/en/hospital/bumrungrad", label: "Bumrungrad cardiac packages" },
    ],
  },
  "pattaya-health-checkup": {
    title: "Health Check-Up in Pattaya — Hospitals, Prices & Guide (2026)",
    description: "Guide to health check-up packages in Pattaya, Thailand. Compare prices at Bangkok Pattaya Hospital, Pattaya International and more. Packages from ฿1,990.",
    intro: "Pattaya is one of Thailand's most visited cities and has a mature private hospital sector serving a large expat community and medical tourists. Several international-standard hospitals offer health screening packages at prices well below Bangkok, with English-speaking staff and direct insurance billing.",
    sections: [
      {
        heading: "Health check-up prices in Pattaya",
        content: "Pattaya hospitals offer competitive pricing across all screening tiers:",
        list: [
          "Basic package (CBC, blood glucose, cholesterol, urinalysis): ฿1,990 – ฿4,500",
          "Standard package (adds chest X-ray, ultrasound, ECG): ฿4,500 – ฿12,000",
          "Executive package (adds cancer markers, specialist consult): ฿12,000 – ฿35,000",
          "Women's health package (adds Pap smear, breast ultrasound): ฿6,000 – ฿18,000",
          "Senior package (60+, adds bone density, PSA/ovarian markers): ฿9,000 – ฿25,000",
        ],
      },
      {
        heading: "Best hospitals for health check-ups in Pattaya",
        content: "Pattaya has several modern private hospitals with dedicated health screening programmes:",
        list: [
          "Bangkok Pattaya Hospital (BDMS) — largest hospital in the Eastern Seaboard, most comprehensive packages, JCI certified",
          "Pattaya International Hospital — popular with European expats, English service, competitive mid-range packages",
          "Phyathai Sriracha Hospital — JCI accredited, slightly south of Pattaya, excellent executive range",
          "Bangkok Hospital Chonburi — BDMS group, modern facility, good for day-trip check-ups from Pattaya",
          "Chonburi Hospital — government hospital, very low prices for basic check-ups, longer waiting times",
        ],
      },
      {
        heading: "What to expect at a Pattaya hospital",
        content: "Pattaya hospitals are well-adapted to serve international patients:",
        list: [
          "Languages: English at all private hospitals; Bangkok Pattaya Hospital also has Russian, German, and Scandinavian-speaking staff",
          "Location: most hospitals are on Sukhumvit Road (Highway 3) — 15–30 minutes from central Pattaya",
          "Timing: book early morning (7–8am) to minimise fasting time during your day",
          "Insurance: Bangkok Pattaya Hospital accepts most major international insurers",
          "Results: same-day for blood tests; 1–2 days for imaging and specialist reports",
          "Follow-up: most Pattaya hospitals offer teleconsultation for international patients",
        ],
      },
    ],
    faqs: [
      { q: "Which hospital is best for health check-ups in Pattaya?", a: "Bangkok Pattaya Hospital (BDMS) is the most comprehensive option and best for executive packages. For mid-range packages, Pattaya International Hospital offers good value with English-speaking staff." },
      { q: "How much is a health check-up in Pattaya?", a: "Basic check-ups start from ฿1,990. A comprehensive standard package with X-ray and ultrasound costs ฿4,500–฿9,000. Executive packages with cancer markers and specialist consultation run ฿12,000–฿35,000." },
      { q: "Is Pattaya cheaper than Bangkok for health check-ups?", a: "Yes, typically 15–30% cheaper than equivalent packages at Bangkok's premium hospitals. Bangkok Pattaya Hospital (BDMS) charges similar to Bangkok mid-tier hospitals." },
    ],
    relatedLinks: [
      { href: "/en/city/pattaya", label: "All health check-up packages in Pattaya →" },
      { href: "/en/compare?category=executive", label: "Compare executive packages →" },
      { href: "/en/guide/bangkok-health-checkup", label: "Bangkok health check-up guide" },
      { href: "/en/guide/senior-health-checkup-thailand", label: "Senior health check-up guide" },
    ],
  },
  "hua-hin-health-checkup": {
    title: "Health Check-Up in Hua Hin — Hospitals, Prices & Guide (2026)",
    description: "Guide to health check-up packages in Hua Hin, Thailand. Compare Bangkok Hospital Hua Hin, San Paulo Hospital and more. Expat-friendly packages from ฿2,000.",
    intro: "Hua Hin is Thailand's most popular expat retirement destination, with a growing cluster of quality private hospitals. The city's medical facilities have expanded significantly in recent years to serve a large international community. Health check-ups here offer Bangkok-quality care at better prices with a relaxed beach-town atmosphere.",
    sections: [
      {
        heading: "Health check-up prices in Hua Hin",
        content: "Hua Hin's private hospitals offer competitive pricing with a focus on expat patients:",
        list: [
          "Basic package: ฿2,000 – ฿5,000",
          "Standard package (adds chest X-ray, ultrasound, ECG, thyroid): ฿5,000 – ฿13,000",
          "Executive package (adds cancer markers, specialist consult): ฿13,000 – ฿38,000",
          "Women's health (adds Pap smear, mammogram or breast ultrasound): ฿6,000 – ฿18,000",
          "Heart health package (ECG, echocardiogram, cardiac markers): ฿8,000 – ฿25,000",
        ],
      },
      {
        heading: "Best hospitals for health check-ups in Hua Hin",
        content: "Hua Hin has a small but well-equipped private hospital sector:",
        list: [
          "Bangkok Hospital Hua Hin (BDMS) — part of Thailand's largest hospital group, full executive range, English-speaking staff",
          "San Paulo Hospital Hua Hin — central location, good value mid-range packages, popular with European expats",
          "Hua Hin Hospital — government hospital, very affordable basic check-ups but limited English",
          "Vichaivej Hospital Hua Hin — mid-range private hospital, good standard and executive packages",
        ],
      },
      {
        heading: "Hua Hin as a health check-up destination for retirees",
        content: "Hua Hin is particularly well-suited for expat retirees who want regular health monitoring:",
        list: [
          "Continuity of care: Bangkok Hospital Hua Hin has a GP service and long-term patient records",
          "Annual check-up routine: many expats use their birthday or Thai new year (April) as their annual check-up trigger",
          "Medical tourism package deals: some Hua Hin resorts offer health check-up + accommodation packages",
          "Proximity to Bangkok: 200km south of Bangkok — easy access to major Bangkok hospitals if specialist referral needed",
          "Senior packages: Bangkok Hospital Hua Hin and San Paulo both have dedicated 60+ packages with bone density and cognitive screening",
        ],
      },
    ],
    faqs: [
      { q: "Which hospital is best for health check-ups in Hua Hin?", a: "Bangkok Hospital Hua Hin is the most comprehensive option with the widest package range. For budget-conscious patients, San Paulo Hospital offers good value standard packages." },
      { q: "Is Hua Hin good for expat health check-ups?", a: "Yes — Hua Hin is one of the best cities outside Bangkok for expat health care. Bangkok Hospital Hua Hin offers continuity of care, GP services, and comprehensive annual health screening packages specifically designed for long-term residents." },
      { q: "How far is Hua Hin from Bangkok for medical trips?", a: "Hua Hin is approximately 200km south of Bangkok — a 3-hour drive or 4-hour minibus journey. Many expats combine their Bangkok visit with a Hua Hin health check-up, or use Hua Hin hospitals exclusively for their annual screening." },
    ],
    relatedLinks: [
      { href: "/en/city/hua-hin", label: "All health check-up packages in Hua Hin →" },
      { href: "/en/compare?category=executive", label: "Compare executive packages →" },
      { href: "/en/guide/health-checkup-expats-thailand", label: "Expat health check-up guide" },
      { href: "/en/guide/senior-health-checkup-thailand", label: "Senior health check-up guide" },
    ],
  },
  "khon-kaen-health-checkup": {
    title: "Khon Kaen Health Check-Up Guide — Northeast Thailand (2026)",
    description: "Get a health check-up in Khon Kaen: best hospitals, prices, packages, and tips for medical tourists visiting Isan's capital.",
    intro: "Khon Kaen is Northeast Thailand's medical and educational hub, home to Khon Kaen University Hospital and several BDMS-network private hospitals. For medical tourists from Laos, Myanmar, and domestic visitors, it offers quality health screenings at prices 20–40% lower than Bangkok.",
    sections: [
      { heading: "Health check-up costs in Khon Kaen", content: "Prices at private hospitals in Khon Kaen range from ฿1,500 for basic screens to ฿30,000 for full executive packages. Public hospital options (Khon Kaen University Hospital, Srinagarind Hospital) offer high quality at government pricing.", list: ["Basic: ฿1,500 – ฿4,500", "Standard: ฿4,000 – ฿9,000", "Executive: ฿9,000 – ฿25,000", "Senior (60+): ฿13,000 – ฿22,000"] },
      { heading: "Best hospitals in Khon Kaen for health check-ups", content: "Bangkok Hospital Khon Kaen is the top private option with English-language services and Lao interpretation. Khon Kaen Ram Hospital offers comparable quality with slightly lower prices. For budget screening, Khon Kaen University Hospital's Srinagarind Hospital is internationally respected.", list: ["Bangkok Hospital Khon Kaen – full English services", "Khon Kaen Ram Hospital – competitive pricing", "KKU Srinagarind Hospital – academic excellence"] },
      { heading: "Getting to Khon Kaen", content: "Khon Kaen Airport has daily flights from Bangkok (55 min). The city is also accessible by bus (7–8 hrs) or the Nong Khai express train (9 hrs). Most hospitals offer pick-up services from the airport." },
    ],
    faqs: [
      { q: "Do Khon Kaen hospitals speak English?", a: "Bangkok Hospital Khon Kaen has English-speaking staff available daily. Other private hospitals have at least one English coordinator on duty. University hospitals have lower English proficiency but can arrange interpreters." },
      { q: "Can I combine a Khon Kaen health check-up with a trip to the Mekong?", a: "Yes. Khon Kaen is within 2 hours of Nong Khai (Mekong riverside), making it easy to combine a morning check-up with an afternoon excursion across to Vientiane, Laos." },
    ],
    relatedLinks: [{ href: "/guide/bangkok-health-checkup", label: "Bangkok health check-up guide" }, { href: "/city/khon-kaen", label: "Compare packages in Khon Kaen" }],
  },
  "udon-thani-health-checkup": {
    title: "Udon Thani Health Check-Up Guide — Northern Isan (2026)",
    description: "Health check-up in Udon Thani: hospitals, prices, and tips for expats, retirees, and medical tourists visiting Northern Isan.",
    intro: "Udon Thani is home to a large expat retiree community and sits close to the Laos border, making it a convenient health check-up destination for both foreign residents and cross-border visitors from Vientiane. The city has several well-equipped private hospitals at affordable prices.",
    sections: [
      { heading: "Health check-up costs in Udon Thani", content: "Private hospital check-up packages in Udon Thani range from ฿1,800 to ฿28,000. Bangkok Hospital Udon Thani is the premium option with English services; AEK Udon International and Ram Udon offer lower-priced alternatives.", list: ["Basic: ฿1,800 – ฿4,000", "Standard: ฿4,500 – ฿9,000", "Executive: ฿10,000 – ฿22,000", "Senior: ฿14,000 – ฿25,000"] },
      { heading: "Best hospitals in Udon Thani", content: "Bangkok Hospital Udon Thani has the strongest English-language capability and digital result delivery. For budget-conscious visitors, Udon Thani Ram Hospital offers standard packages starting from ฿2,500 with same-day results.", list: ["Bangkok Hospital Udon Thani – expat-friendly, English staff", "Udon Thani Ram Hospital – affordable, same-day results", "AEK Udon International – popular with Lao cross-border patients"] },
    ],
    faqs: [
      { q: "Is Udon Thani convenient for Laos visitors to get a health check-up?", a: "Yes. Udon Thani is only 55 km from the Nong Khai–Vientiane Friendship Bridge. Many Lao residents cross the border for medical care, and Bangkok Hospital Udon Thani has Lao-speaking coordinators." },
      { q: "How long does a check-up take in Udon Thani?", a: "Basic packages take 2–3 hours. Standard and executive packages typically take half a day (4–6 hours) and results are ready within 24 hours." },
    ],
    relatedLinks: [{ href: "/guide/senior-health-checkup-thailand", label: "Senior health check-up guide" }, { href: "/city/udon-thani", label: "Compare packages in Udon Thani" }],
  },
  "korat-health-checkup": {
    title: "Korat (Nakhon Ratchasima) Health Check-Up Guide (2026)",
    description: "Health check-ups in Korat, Northeast Thailand's largest city: hospitals, packages, prices, and practical tips.",
    intro: "Korat (Nakhon Ratchasima) is Thailand's second-largest city by area and the economic gateway to the Northeast. With several well-equipped private hospitals and significantly lower prices than Bangkok, it's an attractive option for residents of the surrounding region and those coming from Khao Yai.",
    sections: [
      { heading: "Health check-up prices in Korat", content: "Packages range from ฿1,500 (basic) to ฿30,000 (full executive with cardiac workup). Bangkok Hospital Ratchasima is the premium option; Maharaj Nakhon Ratchasima (government) offers affordable university-affiliated care.", list: ["Basic: ฿1,500 – ฿4,000", "Standard: ฿4,000 – ฿9,000", "Executive: ฿9,000 – ฿26,000", "Senior: ฿13,000 – ฿22,000"] },
      { heading: "Top hospitals in Korat", content: "Bangkok Hospital Ratchasima is the flagship private hospital serving corporate clients and expats in Korat's industrial zones. It offers check-up packages tailored to factory workers including occupational health assessments.", list: ["Bangkok Hospital Ratchasima – JCI-standard private care", "Korat Ram Hospital – established private hospital", "Maharaj Nakhon Ratchasima – affordable university hospital"] },
    ],
    faqs: [
      { q: "Can I get an English-language health check-up in Korat?", a: "Bangkok Hospital Ratchasima has English-speaking staff and provides results in English. Other private hospitals have limited English but can arrange interpreters on request." },
      { q: "Is Korat worth visiting for a health check-up over Bangkok?", a: "If you're staying in Korat or visiting Khao Yai National Park, absolutely. Prices are 20–30% lower than Bangkok and wait times are shorter. The journey from Bangkok is only 2.5 hours by road." },
    ],
    relatedLinks: [{ href: "/guide/bangkok-health-checkup", label: "Bangkok health check-up guide" }, { href: "/city/korat", label: "Compare packages in Korat" }],
  },
  "hat-yai-health-checkup": {
    title: "Hat Yai Health Check-Up Guide — Southern Thailand (2026)",
    description: "Health check-up in Hat Yai: best hospitals, prices, and tips for Malaysian and Singaporean medical tourists visiting Southern Thailand.",
    intro: "Hat Yai is Southern Thailand's largest city and a major medical tourism hub driven by Malaysian and Singaporean cross-border visitors seeking lower-cost private hospital care. Thai private hospitals in Hat Yai offer prices 30–60% below comparable Malaysian private hospitals, with English and Malay staff available.",
    sections: [
      { heading: "Why Malaysian visitors choose Hat Yai for health check-ups", content: "The Padang Besar or Sadao border crossings make Hat Yai easily accessible from Northern Malaysia. Bangkok Hospital Hat Yai actively targets Malaysian patients with Malay-language staff, MyCC payment acceptance, and hotel partnerships.", list: ["30–60% savings vs Malaysian private hospitals", "Malay-speaking staff at major hospitals", "JCI-level standards at Bangkok Hospital Hat Yai", "Same-day results for most packages"] },
      { heading: "Health check-up costs in Hat Yai", content: "Prices range from ฿1,800 for a basic panel to ฿35,000 for a full executive package. Bangkok Hospital Hat Yai is the premium option; Hatyai Hospital and Hat Yai Ram offer more affordable alternatives.", list: ["Basic: ฿1,800 – ฿5,000", "Standard: ฿5,000 – ฿12,000", "Executive: ฿12,000 – ฿32,000", "Senior: ฿15,000 – ฿30,000"] },
    ],
    faqs: [
      { q: "Do Hat Yai hospitals accept Malaysian ringgit?", a: "Most Hat Yai hospitals accept credit cards and some have arrangements for MYR acceptance or currency exchange on-site. Bangkok Hospital Hat Yai is most experienced with Malaysian patients." },
      { q: "What's the best way to travel from Penang to Hat Yai for a health check-up?", a: "The train from Butterworth (Penang) to Hat Yai takes about 4 hours. Buses run from Penang and KL directly to Hat Yai. Several tour operators offer Hat Yai medical tourism day trips with transport included." },
    ],
    relatedLinks: [{ href: "/guide/health-checkup-expats-thailand", label: "Guide for expats in Thailand" }, { href: "/city/hat-yai", label: "Compare packages in Hat Yai" }],
  },
  "koh-samui-health-checkup": {
    title: "Koh Samui Health Check-Up Guide — Thailand Island (2026)",
    description: "Health check-up on Koh Samui: hospitals, packages, prices, and practical tips for island residents, tourists, and expats.",
    intro: "Koh Samui has two international-grade private hospitals — Samui International Hospital (SIH) and Bangkok Hospital Samui — both offering health check-up packages for tourists, expats, and island residents. Getting a check-up on Samui eliminates the need to travel to the mainland for routine screening.",
    sections: [
      { heading: "Health check-up costs on Koh Samui", content: "Prices on Samui are 10–20% higher than equivalent packages in Chiang Mai or Bangkok due to island operating costs. However, they remain far below Western pricing. Basic packages start at ฿2,500.", list: ["Basic: ฿2,500 – ฿6,000", "Standard: ฿6,000 – ฿14,000", "Executive: ฿14,000 – ฿32,000", "Senior: ฿15,000 – ฿28,000", "Heart screening: ฿18,000 – ฿30,000"] },
      { heading: "Samui International Hospital vs Bangkok Hospital Samui", content: "SIH (established 1996) is larger with 60 beds and offers hyperbaric oxygen therapy unavailable elsewhere on the island. Bangkok Hospital Samui (opened 2008) leverages the BDMS network for air ambulance transfer and specialist referrals to Bangkok. Both offer English and multilingual services.", list: ["SIH: larger facility, hyperbaric chamber, longer track record", "BH Samui: BDMS network, air ambulance, digital health records"] },
    ],
    faqs: [
      { q: "Can I get a health check-up during a holiday on Koh Samui?", a: "Yes. Both hospitals offer same-day appointments and half-day package completion. An executive check-up starts at 7 AM and results are ready by early afternoon, leaving the rest of the day free." },
      { q: "What if something serious is found during a Koh Samui check-up?", a: "Bangkok Hospital Samui has a direct air ambulance to Bangkok Hospital (BH Samui). SIH can also arrange medical evacuation. Both hospitals have telehealth connections to specialists in Bangkok for immediate consultation." },
    ],
    relatedLinks: [{ href: "/guide/health-checkup-expats-thailand", label: "Expat health check-up guide" }, { href: "/city/ko-samui", label: "Compare packages on Koh Samui" }],
  },
  "krabi-health-checkup": {
    title: "Krabi Health Check-Up Guide — Andaman Coast (2026)",
    description: "Health check-ups in Krabi: available hospitals, packages, prices, and tips for tourists and expats on the Andaman coast.",
    intro: "Krabi is a smaller hospital market than Phuket, but offers basic to standard health check-up services at its private hospitals. For comprehensive executive packages, Phuket (90 min by road) remains the recommended destination. Krabi is suitable for basic and standard annual health screening for island residents.",
    sections: [
      { heading: "Health check-up options in Krabi", content: "Krabi has two main private hospitals: Krabi Nakharin International Hospital and Krabi Hospital (government). For executive packages or specialist referrals, most expats travel to Phuket or use Bangkok Hospital Krabi for coordination.", list: ["Basic packages: ฿1,800 – ฿4,500", "Standard packages: ฿4,500 – ฿9,000", "Executive (Phuket recommended): ฿10,000 – ฿30,000"] },
      { heading: "When to go to Phuket instead", content: "If you need cardiac stress testing (treadmill), advanced imaging (CT/MRI), specialist consultations, or comprehensive cancer screening, Bangkok Hospital Phuket or Phuket International Hospital is strongly recommended. The 90-minute drive is worthwhile for the superior facilities." },
    ],
    faqs: [
      { q: "Is there a JCI-accredited hospital in Krabi?", a: "No. The nearest JCI-accredited hospital is Bangkok Hospital Phuket (about 90 minutes by road or 45 minutes by speedboat to Phuket Town)." },
      { q: "Can English-speaking tourists get health check-ups in Krabi?", a: "Yes. Krabi Nakharin International Hospital has English-speaking staff and caters to Krabi's large tourist population. Results are available in English within 24 hours." },
    ],
    relatedLinks: [{ href: "/guide/phuket-health-checkup", label: "Phuket health check-up guide" }, { href: "/city/krabi", label: "Compare packages in Krabi" }],
  },
  "diabetes-screening-thailand": {
    title: "Diabetes & Blood Sugar Screening in Thailand — Complete Guide (2026)",
    description: "Compare diabetes screening packages at Thai hospitals: HbA1c, OGTT, fasting glucose tests. Prices from ฿3,500. Bangkok, Phuket, Chiang Mai.",
    intro: "Thailand has one of Asia's highest rates of type 2 diabetes, with an estimated 4.8 million adults living with the condition. Early screening is critical — prediabetes is reversible, but undetected T2DM leads to kidney failure, neuropathy, and cardiovascular disease. Thai hospitals offer comprehensive metabolic screening at a fraction of Western costs.",
    sections: [
      { heading: "What's included in a Thai diabetes screening package?", content: "A comprehensive diabetes panel at a Thai hospital typically includes:", list: ["Fasting plasma glucose (FPG)", "HbA1c (3-month blood sugar average)", "2-hour oral glucose tolerance test (OGTT)", "Fasting insulin + HOMA-IR (insulin resistance score)", "Lipid panel (LDL/HDL/triglycerides)", "Kidney function: creatinine, eGFR, microalbumin", "Liver enzymes (fatty liver is common with T2DM)", "Urine albumin-to-creatinine ratio (ACR)"] },
      { heading: "How much does diabetes screening cost in Thailand?", content: "Standalone diabetes screening packages cost ฿3,500–฿9,000 depending on the hospital and tests included. Many patients combine diabetes screening with an annual health check-up package for better value.", list: ["Basic (FPG + HbA1c only): ฿800 – ฿2,000", "Comprehensive metabolic panel: ฿3,500 – ฿6,500", "Full diabetes + kidney + liver screen: ฿6,000 – ฿9,000"] },
      { heading: "Best hospitals for diabetes screening in Thailand", content: "All JCI-accredited hospitals offer ISO 15189-certified labs, meaning your results are internationally standardised. Bumrungrad's endocrinology department is Thailand's largest; Ramathibodi (Mahidol) is the academic standard.", list: ["Bumrungrad International – largest endocrinology team", "Ramathibodi Hospital – research-grade academic lab", "Bangkok Hospital – BDMS network, all cities", "Chiang Mai Ram – Northern Thailand's best endocrinology"] },
    ],
    faqs: [
      { q: "What's the difference between fasting glucose and HbA1c?", a: "Fasting glucose (FPG) shows your blood sugar at one point in time. HbA1c reflects your average blood sugar over the past 3 months. Both are needed for a complete diabetes assessment — a normal FPG with a high HbA1c can reveal undiagnosed diabetes." },
      { q: "Do I need to fast before a diabetes screening in Thailand?", a: "Yes, for a complete panel you need 8–12 hours of fasting (water only). The 2-hour OGTT also requires fasting. Schedule your appointment for early morning to make fasting convenient." },
    ],
    relatedLinks: [
      { href: "/en/for/diabetes-screening-bangkok", label: "Diabetes screening packages in Bangkok →" },
      { href: "/checkup/diabetes", label: "Compare diabetes screening packages" },
      { href: "/guide/bangkok-health-checkup", label: "Bangkok health check-up guide" },
    ],
  },
  "heart-screening-thailand": {
    title: "Heart & Cardiac Screening in Thailand — Complete Guide (2026)",
    description: "Cardiac health check-ups in Thailand: ECG, echocardiogram, treadmill stress test, and full cardiac screening packages. Compare prices from ฿8,000.",
    intro: "Cardiovascular disease is the leading cause of death in Thailand and globally. A comprehensive cardiac screening can detect coronary artery disease, arrhythmias, and heart failure risk years before symptoms appear. Thai hospitals offer world-class cardiac screening — JCI-accredited facilities at 20–50% of US or European costs.",
    sections: [
      { heading: "What's included in a Thai cardiac screening package?", content: "A full cardiac health check-up at a Thai hospital typically includes:", list: ["12-lead ECG (resting electrocardiogram)", "Echocardiogram (2D echo — ultrasound of the heart)", "Exercise stress test (treadmill/EST)", "Lipid panel: LDL, HDL, total cholesterol, triglycerides", "High-sensitivity CRP (hsCRP — inflammation marker)", "NT-proBNP (heart failure marker)", "HbA1c and fasting glucose", "Chest X-ray", "Cardiologist consultation with written report"] },
      { heading: "Cardiac screening prices in Thailand", content: "Basic ECG-only packages start at ฿800; comprehensive cardiac programmes with echo and treadmill cost ฿12,000–฿45,000.", list: ["ECG only: ฿800 – ฿1,500", "ECG + echo: ฿5,000 – ฿12,000", "Full cardiac (echo + treadmill + labs): ฿12,000 – ฿35,000", "Advanced (+ calcium score CT): ฿25,000 – ฿55,000"] },
      { heading: "Best cardiac hospitals in Thailand", content: "Bangkok Hospital's Heart Centre is Thailand's largest cardiac programme. Samitivej Sukhumvit has the shortest wait times for elective cardiac checks. In Chiang Mai, Chiang Mai Ram Hospital runs the region's most advanced cardiac catheterisation lab.", list: ["Bangkok Hospital Heart Centre – Thailand's largest", "Vejthani Hospital – orthopaedic + cardiac combo packages", "Chiang Mai Ram – Northern Thailand cardiac leader", "Bangkok Pattaya Hospital – Eastern Seaboard's best"] },
    ],
    faqs: [
      { q: "Who should get a cardiac screening in Thailand?", a: "Anyone over 40, with a family history of heart disease, hypertension, diabetes, high cholesterol, obesity, or a history of smoking should consider an annual cardiac screening. Younger patients with multiple risk factors should start at 35." },
      { q: "Is a treadmill stress test safe?", a: "Yes, when performed under a cardiologist's supervision with emergency equipment available, a treadmill stress test is very safe. Thai hospitals follow ACC/AHA protocols and halt the test immediately if any concerning signs appear." },
    ],
    relatedLinks: [{ href: "/checkup/heart", label: "Compare heart screening packages" }, { href: "/checkup/cardiac", label: "Compare cardiac packages" }, { href: "/guide/senior-health-checkup-thailand", label: "Senior check-up guide" }],
  },

  "medical-visa-thailand": {
    title: "Medical Visa for Thailand — Complete Guide (2026)",
    description: "How to get a medical visa to visit Thailand for a health check-up or treatment. Requirements, documents, costs, and step-by-step process from the Thai embassy.",
    intro: "Thailand issues a Medical Treatment Visa (Non-Immigrant O-A or Non-Immigrant MED) for foreigners who wish to enter for medical purposes. For a standard health check-up that completes within 30 days, most tourists use a Tourist Visa or Visa Exemption — no medical visa required. A dedicated medical visa is relevant for longer treatment, surgery, or extended hospital stays.",
    sections: [
      {
        heading: "Do I need a medical visa for a health check-up in Thailand?",
        content: "For most medical tourists visiting Thailand for a health check-up, no special visa is needed:",
        list: [
          "Tourist Visa or Visa Exemption: covers stays up to 30 days (or 60 days for many nationalities) — sufficient for most health check-ups",
          "Visa exemption: 93 nationalities can enter Thailand visa-free for 30–60 days — this covers virtually all medical check-up visits",
          "Non-Immigrant O-A (Medical): required only for stays exceeding 60 days, surgery, or in-patient hospital care",
          "SMART Visa for medical: a new category for medical tourism hub investors — not applicable for individual check-ups",
        ],
      },
      {
        heading: "Who needs a Medical Visa (Non-Immigrant MED)?",
        content: "You should apply for a formal medical visa if your visit involves:",
        list: [
          "Treatment or recovery requiring more than 60 days in Thailand",
          "Major surgery with extended hospitalisation",
          "Repeated treatment cycles (e.g. chemotherapy, dialysis)",
          "Accompanying a patient for an extended stay",
          "Your home country requires proof of medical visa for insurance reimbursement",
        ],
      },
      {
        heading: "Medical visa requirements and documents",
        content: "To apply for a Thai Medical Treatment Visa (Non-Immigrant O-A Medical), you typically need:",
        list: [
          "Valid passport (minimum 6 months validity beyond intended stay)",
          "Medical letter from a Thai hospital confirming treatment plan and estimated duration",
          "Letter from your treating doctor in your home country (if relevant)",
          "Proof of funds: bank statement showing sufficient funds for treatment and stay",
          "Application form from the Thai Embassy or Consulate",
          "Passport-size photos (typically 2)",
          "Visa fee: varies by country, typically USD 80–200 (single entry) or USD 200–500 (multiple entry)",
          "Medical insurance: some embassies require proof of insurance with THB 40,000 OPD/THB 400,000 IPD minimums",
        ],
      },
      {
        heading: "Step-by-step: applying for a Thai medical visa",
        content: "Follow these steps to obtain a Thai medical visa from your home country:",
        list: [
          "Step 1: Contact your chosen Thai hospital and request an official invitation/confirmation letter for the visa application",
          "Step 2: Download the Non-Immigrant Visa application form from the Thai Embassy or Consulate website in your country",
          "Step 3: Gather all required documents: passport, photos, medical letter, bank statement, insurance proof",
          "Step 4: Submit in person at the Thai Embassy or Consulate, or via authorised visa agent (processing: 3–5 business days)",
          "Step 5: Upon arrival in Thailand, present your medical visa at immigration — you will be admitted for 90 days",
          "Step 6: For extended stays, your hospital can assist with a 90-day extension at the Immigration Bureau (THB 1,900 fee)",
        ],
      },
      {
        heading: "Health check-up visits: visa exemption is sufficient",
        content: "The vast majority of medical tourists visiting Thailand for a health check-up do not need a medical visa. Key facts:",
        list: [
          "EU citizens: visa-free entry up to 30 days (60 days with a Tourist Visa)",
          "US citizens: visa-free entry up to 60 days (from June 2024 update)",
          "UK citizens: visa-free entry up to 30 days",
          "Australian citizens: visa-free entry up to 60 days",
          "Japanese citizens: visa-free entry up to 30 days",
          "All health check-up packages at Thai hospitals complete within 1–5 days",
          "If you need more time to recover from any minor procedure, Tourist Visa (60 days) is sufficient",
        ],
      },
    ],
    faqs: [
      { q: "Can I get a health check-up in Thailand on a tourist visa?", a: "Yes — and this is what the vast majority of medical tourists do. Thailand's visa exemption policy allows most nationalities to enter for 30–60 days without a visa, which is more than enough for any health check-up package (which typically takes 1 day)." },
      { q: "Does Thailand have a special medical tourist visa?", a: "Thailand has a Non-Immigrant MED visa and the SMART Visa (medical category) for healthcare investors, but there is no special 'medical tourist visa' for short-stay check-up visitors. Regular visa exemption or a Tourist Visa covers all standard health screening visits." },
      { q: "Will my travel insurance cover a health check-up in Thailand?", a: "Most travel insurance policies do not cover elective health check-ups — these are considered routine preventive care. However, if any condition is discovered during the check-up and requires treatment, that may be covered as a medical emergency. Check your policy's wording carefully." },
    ],
    relatedLinks: [
      { href: "/en/guide/health-checkup-expats-thailand", label: "Expat health check-up guide" },
      { href: "/en/guide/health-insurance-thailand", label: "Health insurance in Thailand" },
      { href: "/en/guide/bangkok-health-checkup", label: "Bangkok health check-up guide" },
    ],
  },

  "health-insurance-thailand": {
    title: "Health Insurance in Thailand for Medical Tourists & Expats (2026)",
    description: "Which insurance plans cover health check-ups in Thailand? AXA, Cigna, BUPA international plans compared. Does your policy pay for Thai hospital care?",
    intro: "Health insurance for Thailand falls into three categories: international health insurance (covers everything worldwide including Thailand), travel insurance (covers emergencies only), and domestic Thai health insurance (for residents). Understanding which type you have — and what it covers — determines how much you'll pay out of pocket for a health check-up.",
    sections: [
      {
        heading: "Does travel insurance cover health check-ups in Thailand?",
        content: "Standard travel insurance does NOT cover elective health check-ups in Thailand. Key distinctions:",
        list: [
          "Travel insurance: covers medical emergencies and accidents — not preventive or elective care",
          "Routine health screening: classified as preventive care — excluded from virtually all travel insurance policies",
          "Emergency treatment: if a serious condition is found during your check-up (e.g. acute cardiac event), emergency treatment MAY be covered",
          "Pre-existing conditions: most travel insurance excludes treatment of known pre-existing conditions",
          "Bottom line: expect to pay for your health check-up out-of-pocket and claim only if an emergency arises",
        ],
      },
      {
        heading: "International health insurance plans that cover Thai hospitals",
        content: "If you hold an international health insurance plan, health check-ups may be partially or fully covered. Major providers with good Thailand coverage:",
        list: [
          "AXA — Global Health Elite: comprehensive outpatient coverage including check-ups, good direct billing at Bumrungrad, Samitivej",
          "Cigna Global Health: strong Southeast Asia network, preventive care add-ons available",
          "BUPA International: good Bangkok network, routine check-up coverage available on premium plans",
          "Now Health International: strong direct billing network at JCI hospitals in Bangkok",
          "Pacific Cross: popular with expats in Thailand, covers health check-ups as routine OPD",
          "Allianz Care: international corporate plans with check-up coverage",
        ],
      },
      {
        heading: "Direct billing at Thai hospitals",
        content: "Many major Thai hospitals have direct billing agreements with international insurers, meaning you don't pay upfront:",
        list: [
          "Bumrungrad International: direct billing with 500+ insurance companies worldwide",
          "Bangkok Hospital (BDMS): direct billing with AXA, Cigna, Allianz, BUPA and 200+ others",
          "Samitivej Hospital: cashless billing available for most international plans",
          "Vejthani Hospital: good direct billing network, competitive with major Bangkok hospitals",
          "Process: present your insurance card at admissions, hospital bills insurer directly",
          "Always pre-authorise: call your insurer before your appointment to confirm coverage and avoid out-of-pocket surprises",
        ],
      },
      {
        heading: "How much does a health check-up cost without insurance in Thailand?",
        content: "Paying out-of-pocket in Thailand is significantly cheaper than in most Western countries, even without insurance:",
        list: [
          "Basic package: ฿2,000 – ฿6,000 (~USD 55–165) — cheaper than a GP appointment in the US or UK",
          "Comprehensive package: ฿6,000 – ฿20,000 (~USD 165–555)",
          "Executive with cancer markers: ฿15,000 – ฿40,000 (~USD 415–1,110)",
          "Executive with MRI: ฿25,000 – ฿80,000 (~USD 695–2,220)",
          "JCI hospital premium: 20–50% higher than non-JCI equivalents",
          "Comparison: a comprehensive executive check-up at Bumrungrad for ฿40,000 would cost USD 2,000–4,000 in the US",
        ],
      },
      {
        heading: "Thai domestic health insurance for residents",
        content: "Expats residing in Thailand can purchase domestic health insurance. Key options:",
        list: [
          "OPD (outpatient) plans: cover routine visits and some check-ups — premiums from ฿5,000/year",
          "IPD (inpatient) plans: cover hospitalisation — premiums from ฿15,000/year",
          "AIA, Muang Thai Life, Krungthai-AXA: main domestic insurers offering expat-friendly plans",
          "Government Universal Coverage Scheme (UC): for Thai nationals and long-term residents with work permits only",
          "Key tip: buy domestic insurance before getting your health check-up, as results showing pre-existing conditions may affect future insurability",
        ],
      },
    ],
    faqs: [
      { q: "Which insurance covers health check-ups at Bumrungrad Hospital Bangkok?", a: "Bumrungrad has direct billing agreements with over 500 insurance companies. AXA, Cigna, BUPA International, Allianz, and Now Health are among the most commonly used. Call Bumrungrad's insurance coordination desk (+66 2 667 2121) before your visit to confirm your coverage and set up direct billing." },
      { q: "Can I claim a Thai health check-up on my home country insurance?", a: "Possibly, if you have an international health insurance plan with outpatient preventive care coverage. Standard health insurance in the US, UK, or EU typically does not reimburse overseas preventive check-ups. Submit itemised receipts and a hospital report to your insurer for reimbursement consideration." },
      { q: "Do I need insurance to visit a hospital in Thailand?", a: "No — Thai private hospitals accept self-paying patients without insurance. You pay at discharge for outpatient services. Credit cards are universally accepted at Bangkok's international hospitals. A deposit may be required for longer inpatient stays." },
    ],
    relatedLinks: [
      { href: "/en/guide/medical-visa-thailand", label: "Medical visa guide" },
      { href: "/en/guide/health-checkup-expats-thailand", label: "Expat health check-up guide" },
      { href: "/en/guide/health-checkup-for-retirement-visa-thailand", label: "Health check for retirement visa Thailand" },
      { href: "/en/compare?category=executive", label: "Compare executive packages" },
    ],
  },

  "health-checkup-for-retirement-visa-thailand": {
    title: "Health Check-Up for Thailand Retirement Visa & Long-Stay Visa (2026)",
    description: "What medical tests are required for a Thailand retirement visa, Non-Immigrant O-A visa, and Thailand Elite Visa? X-ray, blood test, HIV — full requirements and where to get them.",
    intro: "Applying for a Thai Retirement Visa (Non-Immigrant O-A), Thailand Elite Visa, or Work Permit often requires specific medical tests from a licensed Thai hospital. The requirements vary by visa type but typically include a chest X-ray, blood test, and a signed medical certificate. Bangkok private hospitals provide same-day medical certificate services for visa applicants.",
    sections: [
      {
        heading: "Non-Immigrant O-A (Retirement Visa) medical requirements",
        content: "The Non-Immigrant O-A visa (for retirees aged 50+) requires a medical certificate from a licensed Thai physician. Requirements as of 2026:",
        list: [
          "Chest X-ray (PA view) — to rule out active tuberculosis",
          "HIV/AIDS test (ELISA or equivalent) — must be negative",
          "Syphilis (VDRL) test — must be negative",
          "Complete blood count (CBC) is sometimes requested",
          "All tests must be performed at a licensed Thai hospital (not a clinic)",
          "The medical certificate must be signed by a licensed Thai doctor on hospital letterhead",
          "Results valid for 3 months — book tests shortly before your visa appointment",
          "Cost at a private Bangkok hospital: ฿800–฿2,500 for the full visa medical package",
        ],
      },
      {
        heading: "Thailand Elite Visa medical requirements",
        content: "Thailand Elite Visa (5-year, 10-year, 20-year) has no mandatory medical test at the application stage. However:",
        list: [
          "Some Elite Visa benefits include access to health check-up packages at partner hospitals",
          "For the Elite Ultimate Privilege (20-year) membership, an annual executive health check-up is included at specific hospitals",
          "No medical test is required to purchase or renew Elite Visa — only a clean criminal record",
        ],
      },
      {
        heading: "Work permit medical requirements in Thailand",
        content: "To obtain or renew a Thai work permit, employees must provide a medical certificate stating they are free from specific conditions:",
        list: [
          "Required declaration: freedom from 9 prohibited diseases including leprosy, tuberculosis (active), drug addiction, alcoholism, and syphilis (stage 3)",
          "Certificate signed by a licensed Thai physician",
          "Chest X-ray may be requested by the employer or Ministry of Labour",
          "HIV/AIDS status: NOT required for work permits (illegal to discriminate based on HIV status under Thai law)",
          "Cost for work permit medical at a Bangkok private hospital: ฿500–฿1,500",
        ],
      },
      {
        heading: "Where to get a visa medical check-up in Bangkok",
        content: "The best hospitals for fast, same-day visa medical certificates in Bangkok:",
        list: [
          "Bumrungrad International Hospital — international patient department handles visa medicals; English letter same day; ฿1,800–฿2,500",
          "BNH Hospital — experienced with expat visa medicals; certificate in 2–3 hours; ฿1,500–฿2,200",
          "Samitivej Hospital Sukhumvit — dedicated expat services; English certificate; ฿1,800–฿2,500",
          "Phyathai 2 Hospital — more affordable option; certificates same day; ฿800–฿1,500",
          "Kasemrad Hospital — budget-friendly; popular with budget expats; ฿600–฿1,200",
          "Most hospitals: bring your passport, arrive in the morning, and expect 2–4 hours total",
        ],
      },
    ],
    faqs: [
      { q: "Can I use a medical certificate from my home country for a Thai retirement visa?", a: "No — for the Non-Immigrant O-A retirement visa, the Thai immigration authority requires a medical certificate issued by a licensed Thai physician on Thai hospital letterhead, not a certificate from your home country. The tests must be performed in Thailand." },
      { q: "How long is a Thai visa medical certificate valid?", a: "Medical certificates for Thai visa purposes are generally valid for 3 months from the date of issue. Book your medical tests close to your intended visa application date. Some consulates may accept certificates up to 6 months old — check with the specific Thai Embassy or Consulate." },
      { q: "Do I need an HIV test for a Thai retirement visa?", a: "Yes — the Non-Immigrant O-A visa application requires an HIV test result (ELISA or equivalent). The result must be negative (non-reactive). HIV-positive applicants are technically prohibited from obtaining the O-A visa under Thai immigration regulations, though this policy has been debated as discriminatory by international health organisations." },
      { q: "How much does a retirement visa medical check-up cost in Bangkok?", a: "A full medical package for Non-Immigrant O-A visa purposes (chest X-ray, HIV test, syphilis test, CBC, medical certificate) costs ฿800–฿2,500 at Bangkok private hospitals. Budget private hospitals (Phyathai, Kasemrad) are at the lower end; JCI hospitals (Bumrungrad, BNH) are at the higher end with more detailed English documentation." },
    ],
    relatedLinks: [
      { href: "/en/guide/medical-visa-thailand", label: "Medical visa for treatment in Thailand" },
      { href: "/en/guide/health-checkup-expats-thailand", label: "Expat health check-up guide" },
      { href: "/en/guide/health-insurance-thailand", label: "Health insurance for expats in Thailand" },
      { href: "/en/for/health-checkup-expats-bangkok", label: "Expat health check-up packages" },
    ],
  },

  "how-to-prepare-health-checkup-thailand": {
    title: "How to Prepare for a Health Check-Up in Thailand (2026)",
    description: "What to eat, what to bring, how long to fast — complete preparation guide for getting a health check-up at a Thai hospital. Avoid common mistakes.",
    intro: "Proper preparation for your health check-up ensures accurate test results and a smooth experience. Most Thai hospitals provide preparation instructions at booking, but knowing what to expect — and what common mistakes to avoid — will make a significant difference to your results.",
    sections: [
      {
        heading: "How long should I fast before a health check-up in Thailand?",
        content: "Fasting is required for accurate blood glucose and cholesterol readings. Thai hospitals typically specify:",
        list: [
          "Standard fasting: 8–12 hours before your appointment — no food, only plain water allowed",
          "Most hospitals recommend: last meal the night before, appointment the following morning",
          "Water: drink water freely — dehydration makes blood draws harder and affects kidney markers",
          "Coffee, tea, juice: NOT allowed — even black coffee affects blood glucose and liver enzymes",
          "Chewing gum: avoid — can stimulate digestive enzymes and affect results",
          "Medications: take essential medications (blood pressure, heart) with a small sip of water — check with your doctor",
          "If you are diabetic: follow your diabetologist's specific fasting guidance; standard fasting rules may not apply",
        ],
      },
      {
        heading: "What to bring to your health check-up appointment",
        content: "Bring the following documents and items to your appointment:",
        list: [
          "Passport: required for international patient registration at all Thai private hospitals",
          "Insurance card: if you have international health insurance with direct billing",
          "List of current medications: name, dosage, frequency — both brand name and generic if possible",
          "Previous health check-up results: especially useful for comparison of trending values (cholesterol, HbA1c)",
          "Glasses or contact lenses: removed for eye exams if included in your package",
          "Comfortable clothing: loose-fitting for ECG, blood pressure cuff, ultrasound access",
          "Underwear (for women): you may be asked to change into a hospital gown for imaging",
          "Any specialist referral letters: if your GP requested specific tests",
        ],
      },
      {
        heading: "What to avoid before your health check-up",
        content: "Activities and substances that can affect your test results:",
        list: [
          "Alcohol: avoid for at least 48 hours before — raises liver enzymes (AST/ALT/GGT), triglycerides, and uric acid",
          "Strenuous exercise: avoid 24 hours before — raises CK (creatine kinase), AST, and LDH falsely",
          "High-fat meals: avoid 48 hours before — affects cholesterol and triglyceride readings",
          "Protein supplements: avoid 24 hours before — can raise creatinine and affect kidney function markers",
          "Sexual activity (for men): abstain 24–72 hours before if PSA (prostate) test is included",
          "Menstruation (for women): inform the hospital — Pap smear may need to be rescheduled if heavy flow",
          "Iron supplements: avoid 24 hours before — affects serum iron and ferritin levels",
        ],
      },
      {
        heading: "Understanding your health check-up results",
        content: "Most Thai hospitals provide results with normal range references and an explanatory physician consultation. Key things to know:",
        list: [
          "Normal ranges: printed alongside each result — flag any value outside the range for discussion",
          "Physician consultation: included in most packages — ask specific questions, don't rush",
          "Digital copies: request a PDF download — most hospitals offer this via patient portal or email",
          "English results: standard at all major private hospitals — ask if only Thai provided",
          "Trending: most value comes from comparing year-on-year results — keep a digital record",
          "Follow-up referrals: if any abnormal results require specialist follow-up, the doctor will advise",
          "Second opinion: for any concerning result, all Thai international hospitals offer specialist referrals",
        ],
      },
    ],
    faqs: [
      { q: "Can I drink coffee before a Thai health check-up?", a: "No — you should not drink coffee (even black) before fasting blood tests. Caffeine affects blood glucose levels and can raise liver enzyme readings. Drink plain water only during your fasting period." },
      { q: "How early should I arrive for my health check-up in Thailand?", a: "Arrive 15–30 minutes before your appointment to complete registration paperwork. For walk-in morning appointments at busy hospitals like Bumrungrad, arrive by 7:00–7:30 AM to minimise waiting. Most comprehensive packages take 3–5 hours to complete." },
      { q: "What happens if my results show something abnormal?", a: "The physician consultation at the end of your check-up will flag any abnormal results and advise next steps. For minor abnormalities (slightly elevated cholesterol, borderline blood sugar), lifestyle advice is provided. For more serious findings, you will be referred to the appropriate specialist on the same day in most cases." },
      { q: "Can I eat after the blood draw?", a: "Yes — once your blood has been drawn (typically the first step), you can eat normally. Hospitals usually have a cafeteria or bring you light snacks. Eat before the physician consultation if you feel faint or lightheaded." },
    ],
    relatedLinks: [
      { href: "/en/guide/what-is-included-checkup", label: "What's included in each package?" },
      { href: "/en/guide/bangkok-health-checkup", label: "Bangkok health check-up guide" },
      { href: "/en/compare?category=comprehensive", label: "Compare comprehensive packages" },
    ],
  },

  "best-hospitals-japanese-tourists": {
    title: "Best Hospitals for Japanese Tourists in Thailand (2026)",
    description: "Japanese-speaking health check-ups in Bangkok, Phuket and Chiang Mai. Which Thai hospitals have Japanese coordinators, Japanese-language consent forms, and Japanese interpreters?",
    intro: "Japan sends over 200,000 medical tourists to Thailand annually, making Japanese nationals the second-largest group of medical tourists in the country after ASEAN neighbours. Major Bangkok hospitals have dedicated Japanese patient departments (日本語窓口) with coordinators, translated documentation, and in some cases Japanese-qualified physicians. Here is what to know.",
    sections: [
      {
        heading: "Which Bangkok hospitals have Japanese-speaking staff?",
        content: "These hospitals have established Japanese patient services with confirmed Japanese-speaking coordinators:",
        list: [
          "Bumrungrad International Hospital — Japan Desk (日本語窓口) on the 1st floor, Japanese coordinators Mon–Sat, Japanese-language consent forms and results summaries",
          "Bangkok Hospital Silom (BDMS) — Japanese Medical Service team, Japanese-language package materials, Japanese coordinator available weekdays",
          "Samitivej Sukhumvit Hospital — Japanese language services, translated result summaries, popular with Japanese business community",
          "BNH Hospital (British–Nippon Hospital Foundation) — historically the most Japanese-friendly hospital in Bangkok, co-founded with Japanese partners, strong Japanese community connection",
          "Vejthani Hospital — Japanese coordinator, competitive executive packages popular with Japanese medical tourists",
          "Praram 9 Hospital — Japanese coordinator on-site, mid-tier pricing suitable for Japanese corporate groups",
        ],
      },
      {
        heading: "Japanese health check-up packages in Thailand",
        content: "Japanese medical tourists typically seek Japanese-style ningen dock (人間ドック) equivalent packages. Thai hospitals offer comparable programmes:",
        list: [
          "Standard Ningen Dock equivalent: blood panel, chest X-ray, abdominal ultrasound, ECG, gastroscopy (upper GI) — ฿8,000–฿20,000",
          "Comprehensive (with cancer markers): adds tumour markers AFP, CEA, CA 19-9, PSA/CA-125 — ฿15,000–฿35,000",
          "Cardiac add-on: coronary CT (64-slice or 256-slice), echocardiogram — ฿12,000–฿45,000",
          "Gastroscopy: H. pylori testing, upper GI scope — ฿4,000–฿12,000 as add-on (popular with Japanese guests)",
          "Full-body MRI: increasingly popular Japanese preference — ฿20,000–฿60,000",
          "Price comparison: equivalent programmes in Japan cost ¥100,000–¥400,000 vs ฿15,000–฿50,000 in Thailand",
        ],
      },
      {
        heading: "What Japanese tourists should know before their check-up in Thailand",
        content: "Practical considerations for Japanese medical tourists visiting Thai hospitals:",
        list: [
          "Fasting: Thai hospitals follow the same 8–12 hour fast as Japan — skip breakfast the night before",
          "Gastroscopy preference: Japanese patients often request gastroscopy (stomach camera) — confirm availability when booking, as it requires sedation",
          "H. pylori: common concern for Japanese patients — request H. pylori breath test or biopsy during gastroscopy",
          "Results in Japanese: Bumrungrad and BNH offer results summaries in Japanese; most hospitals provide English + Japanese on request",
          "Credit cards: major Japanese credit cards (JCB, AMEX, Visa) accepted at all Bangkok international hospitals",
          "Payment: Japanese patients note that payment is at discharge for OPD — no upfront payment unlike some Japanese clinics",
          "Airport transfer: many hospitals offer free pick-up for Japanese patients booking executive packages — inquire in advance",
        ],
      },
      {
        heading: "Phuket and Chiang Mai hospitals for Japanese tourists",
        content: "Outside Bangkok, these hospitals offer Japanese-language services:",
        list: [
          "Bangkok Hospital Phuket: Japanese coordinator, Japanese patient materials, popular with Japanese resort holidaymakers combining beach stay with health check",
          "Samitivej Phuket (Mission Hospital network): Japanese services available, convenient for Patong Beach area",
          "Chiang Mai Ram Hospital: Japanese coordinator on request, comprehensive packages, popular with Japanese trekkers and art market visitors",
          "Bangkok Hospital Chiang Mai: BDMS chain, Japanese patient support, coordinated with Bangkok Hospital's main Japanese team",
        ],
      },
    ],
    faqs: [
      { q: "Is it cheaper to get a health check-up in Thailand or Japan?", a: "Significantly cheaper in Thailand. A ningen dock (人間ドック) health check-up in Japan typically costs ¥100,000–¥400,000 (฿24,000–฿95,000). An equivalent comprehensive package at a Bangkok international hospital costs ฿15,000–฿40,000 — typically 50–70% less, with similar or shorter waiting times and English results." },
      { q: "Can I get a gastroscopy (胃カメラ) in Thailand?", a: "Yes — gastroscopy is widely available at Bangkok international hospitals and is a popular add-on for Japanese medical tourists. Most hospitals use the same Olympus scopes as Japanese clinics. Sedated (comfort) scopes are available for an additional fee. Results and images are provided digitally." },
      { q: "Which hospital in Bangkok is best known for Japanese patients?", a: "BNH Hospital has the longest history of Japanese patient care — it was co-founded with Japanese involvement and maintains strong ties with the Tokyo Medical University alumni network. Bumrungrad International has the largest dedicated Japan Desk with daily Japanese-speaking coordinators and the widest range of Japanese-language materials." },
    ],
    relatedLinks: [
      { href: "/en/compare?category=executive", label: "Compare executive packages →" },
      { href: "/en/guide/what-is-included-checkup", label: "What's included in a Thai health check-up?" },
      { href: "/en/guide/how-to-prepare-health-checkup-thailand", label: "How to prepare guide" },
    ],
  },

  "best-hospitals-arabic-speakers": {
    title: "Best Hospitals for Arabic-Speaking Patients in Thailand (2026)",
    description: "Arabic health check-ups in Bangkok. Hospitals with Arabic-speaking staff, halal food, prayer facilities, and Arabic-language patient materials — for Gulf, Middle East, and North African visitors.",
    intro: "The Gulf Cooperation Council (GCC) countries and the broader Arab world send tens of thousands of medical tourists to Thailand each year, particularly from Saudi Arabia, UAE, Kuwait, Qatar, and Egypt. Bangkok's top international hospitals have invested significantly in Arabic-language services, Halal dining, and prayer facilities to accommodate Muslim medical tourists. This guide covers your options.",
    sections: [
      {
        heading: "Which Bangkok hospitals have Arabic-speaking staff?",
        content: "These hospitals have confirmed Arabic-speaking coordinators and Gulf-friendly services:",
        list: [
          "Bumrungrad International Hospital — Arabic Language Services team, Arabic website and patient materials, Halal food available via hospital kitchen, Qibla markers in patient rooms",
          "Bangkok Hospital — Arabic coordinators at Bangkok Hospital Phuket and Bangkok Hospital Silom, popular with Saudi and Kuwaiti patients",
          "Vejthani Hospital — Arabic-speaking coordinator, competitive executive packages, growing reputation in Gulf markets",
          "Samitivej Hospital — Arabic language support at Sukhumvit branch, experienced with GCC visitors",
          "Praram 9 Hospital — Arabic interpreter available, competitive pricing for groups",
        ],
      },
      {
        heading: "Halal food and Islamic facilities at Thai hospitals",
        content: "Muslim medical tourists have specific dietary and religious requirements. Thai hospitals have adapted:",
        list: [
          "Bumrungrad International: fully Halal kitchen with separate Halal preparation area, Qibla markers in all patient rooms, Muslim prayer room on premises",
          "Bangkok Hospital Phuket: Halal food available on request, prayer room available",
          "Vejthani Hospital: Halal-certified meal options, prayer space available",
          "Ramadan: hospitals can accommodate pre-dawn (suhoor) and after-sunset (iftar) meal schedules — notify admissions in advance",
          "Prayer times: Bangkok prayer times (Dhuhur ~12:30, Asr ~15:45, Maghrib ~18:00 in winter) — appointments can be structured around prayer times on request",
          "Women's care: female doctor and female ultrasound technician available on request at all major hospitals",
        ],
      },
      {
        heading: "Health check-up packages popular with Arabic-speaking patients",
        content: "GCC visitors to Thailand typically seek comprehensive executive check-ups with cancer markers and advanced imaging. Recommended packages:",
        list: [
          "Executive + Cancer Marker: full blood panel, tumour markers, chest X-ray, abdominal ultrasound, ECG — ฿15,000–฿35,000",
          "Executive + Full Cardiac: adds coronary CT (64-slice), echocardiogram, stress test — ฿25,000–฿65,000",
          "Whole-body MRI screen: popular with high-net-worth Gulf patients — ฿30,000–฿80,000 at flagship hospitals",
          "Executive + Colonoscopy: colorectal cancer is among the top concerns for Arab males over 50 — ฿20,000–฿45,000",
          "Women's executive + Gynaecology: Pap smear, breast ultrasound, pelvic scan, female physician consultation — ฿15,000–฿40,000",
          "Price comparison: similar packages in private Dubai hospitals cost AED 3,000–15,000 vs ฿15,000–฿65,000 in Bangkok",
        ],
      },
      {
        heading: "Practical information for Arabic-speaking medical tourists in Bangkok",
        content: "Key practical facts for GCC and Arab visitors planning a health check-up in Bangkok:",
        list: [
          "Visa: Saudi, UAE, Kuwait, Qatar, Bahrain, and Oman nationals: visa-free entry to Thailand for 30 days (2024 reciprocal agreement)",
          "Flight: Bangkok (BKK / Suvarnabhumi) direct from Dubai (~6h), Riyadh (~7h), Kuwait (~7h), Cairo (~9h)",
          "Currency: Thai Baht (THB) — exchange is available 24/7 at Suvarnabhumi airport; rate is better at city exchange booths",
          "Arabic restaurants: Sukhumvit Soi 3 (Arab Street) has Lebanese, Yemeni, and Egyptian restaurants near many international hospitals",
          "Hotel proximity: hospitals recommend staying at hotels within 15 minutes — Bumrungrad is close to Asoke BTS, easy for Nana area hotels",
          "Communication: all hospitals have Arabic-speaking staff available during business hours — WhatsApp contact often provided for Gulf patients",
        ],
      },
    ],
    faqs: [
      { q: "Is Halal food available at Bangkok hospitals?", a: "Yes — Bumrungrad International has a dedicated Halal kitchen with fully Halal-certified meals for inpatients. Vejthani and Bangkok Hospital also offer Halal meal options on request. For day-surgery outpatient check-ups, the stay is typically too short to need hospital meals, but the hospital cafeterias at major Bangkok international hospitals include Halal options." },
      { q: "Can I see a female doctor for my check-up in Thailand?", a: "Yes — all major Bangkok international hospitals can arrange a female physician for the health check-up consultation upon request. Female ultrasound technicians are also available. Make this request when booking your appointment." },
      { q: "Do Thai hospitals have Arabic signage and Arabic patient materials?", a: "Bumrungrad International provides the most comprehensive Arabic patient experience — Arabic signage, website, consent forms, and result summaries in Arabic. Most other hospitals rely on Arabic-speaking coordinators rather than translated written materials, so verbal communication is covered even if written materials may primarily be in English." },
    ],
    relatedLinks: [
      { href: "/en/compare?category=executive", label: "Compare executive packages →" },
      { href: "/en/guide/medical-visa-thailand", label: "Medical visa guide" },
      { href: "/en/guide/how-to-prepare-health-checkup-thailand", label: "How to prepare for your check-up" },
    ],
  },

  "best-hospitals-chinese-speakers": {
    title: "曼谷最佳体检医院推荐 2026 — Best Bangkok Hospitals for Chinese Speakers",
    description: "曼谷顶级体检医院推荐：泰国JCI认证医院，中文服务，体检套餐价格。Bangkok health check-up guide for Chinese-speaking visitors from mainland China, Hong Kong, and Taiwan.",
    intro: "曼谷是中国大陆、香港和台湾游客最受欢迎的医疗旅游目的地之一。曼谷国际医院（Bangkok International Hospital）、康民国际医院（Samitivej）和泰国康健医院（Vejthani）均提供中文服务，并有中文翻译协助。与上海或北京顶级私立医院相比，曼谷同等体检套餐价格节省60–75%。Bangkok is among the top medical tourism destinations for visitors from mainland China, Hong Kong, and Taiwan. JCI-accredited hospitals offer Mandarin-speaking coordinators and comprehensive check-up packages.",
    sections: [
      {
        heading: "曼谷体检价格对比 — Bangkok vs China price comparison (价格对比)",
        content: "曼谷顶级医院体检套餐价格与中国主要城市私立医院对比：",
        list: [
          "基础体检套餐 — 曼谷：฿1,500–3,000（约人民币310–620元）vs 上海私立：RMB 2,000–6,000",
          "高端执行套餐 — 曼谷：฿8,000–25,000（约人民币1,650–5,150元）vs 上海/北京私立：RMB 8,000–30,000",
          "癌症筛查套餐 — 曼谷：฿12,000–35,000 vs 北京国际医院：RMB 15,000–50,000",
          "女性专项筛查（含妇科+乳腺+宫颈） — 曼谷：฿8,000–18,000 vs 同等级中国私立：RMB 10,000–25,000",
          "含胃肠镜（胃镜+肠镜） — 曼谷：฿9,000–20,000 vs 中国私立同等套餐：RMB 8,000–18,000",
          "总结：曼谷JCI认证医院体检费用比中国同等级私立医院节省30–60%，加上签证和机票后综合性价比仍相当可观",
        ],
      },
      {
        heading: "中文服务最佳医院推荐 (Top hospitals with Chinese-language services)",
        content: "以下医院专为中文客户提供完善的中文体检服务：",
        list: [
          "Vejthani Hospital（泰国康健医院）— 设有中文部，中文协调员，中文体检报告，最受大陆游客欢迎",
          "Bumrungrad International（康民国际）— 国际标准最高，多名中文翻译，支持大陆/香港/台湾客户，JCI认证",
          "Samitivej Sukhumvit（三美泰医院）— 曼谷核心地段，中文服务，东南亚医疗旅游老牌品牌",
          "Bangkok Hospital（曼谷国际医院）— 多个分院，部分设有中文接待",
          "Praram 9 Hospital（帕拉玛9医院）— 价格适中，有中文接待，适合预算有限的体检游客",
          "所有上述医院均为JCI国际认证，医疗质量达国际水准",
        ],
      },
      {
        heading: "签证与出行实用信息 (Visa and travel logistics for Chinese visitors)",
        content: "中国大陆、香港、台湾游客赴泰实用信息：",
        list: [
          "签证：中国大陆公民可享免签入境泰国30天（2023年12月起实施互免签证协议）",
          "香港/澳门居民：持BNO或HKSAR护照可免签30天",
          "台湾公民：免签30天",
          "直飞：北京/上海/广州直飞曼谷素万那普（BKK）约4–5小时，成都约3.5小时",
          "建议提前预约：JCI医院热门时段（早8–10点）需提前至少1周预约体检",
          "结果时间：大多数套餐当日出结果摘要，完整报告2–3个工作日，中文翻译需额外2–3天",
          "支付：支持微信支付（WeChat Pay）和银联卡的医院：Vejthani、Bumrungrad（通过第三方）",
        ],
      },
      {
        heading: "什么套餐适合您？体检套餐选择指南",
        content: "根据您的年龄和健康关注点，推荐以下套餐：",
        list: [
          "30岁以下健康体检 — 选基础套餐（Basic/Standard）：฿1,500–3,500，含血常规、尿检、心电图、胸片",
          "35–50岁全面体检 — 选综合套餐（Comprehensive）：฿5,000–12,000，另加肿瘤标志物",
          "50岁以上或有家族病史 — 选执行套餐（Executive）：฿10,000–25,000，含超声、CT选项、完整内分泌检查",
          "女性专项 — 妇科+宫颈癌筛查+乳腺超声/钼靶：฿6,000–15,000",
          "胃肠道问题/家族胃癌史 — 加选胃镜（gastroscopy）：通常额外฿4,500–9,000",
        ],
      },
    ],
    faqs: [
      { q: "曼谷医院体检报告是否提供中文版本？", a: "Vejthani Hospital提供中文报告翻译服务，通常需额外2–3个工作日。Bumrungrad等医院的报告主要为英文，配有中文翻译协助解读。建议在预约时提前说明需要中文报告，以便安排翻译。" },
      { q: "曼谷体检需要预约多早？", a: "热门医院（尤其是Bumrungrad和Vejthani）在旅游旺季（11月–3月）的早上时段通常需提前1–2周预约。旺季前建议提前通过医院国际服务部官网或中国代理预约。4–9月（淡季）通常1–3天内可约到。" },
      { q: "体检当天需要空腹吗？需要多长时间？", a: "大多数综合体检套餐要求前晚10点后禁食（空腹8–12小时），包括禁水（少量饮水通常可接受）。基础体检约需2–3小时，综合套餐含超声约需4–5小时，含胃镜则建议预留全天。当日可拿到初步结果摘要。" },
      { q: "曼谷JCI认证医院水平如何？与中国三甲医院相比？", a: "JCI（国际医疗卫生机构认证联合委员会）标准与中国三甲医院评审等级相当，在某些流程标准上更为严格。Bumrungrad、Samitivej等医院设备齐全，服务流程专为国际患者设计，候诊时间通常比中国三甲医院短得多。" },
    ],
    relatedLinks: [
      { href: "/en/for/chinese-health-checkup-bangkok", label: "Chinese speakers — package comparison" },
      { href: "/en/guide/jci-hospitals-bangkok", label: "JCI hospitals guide" },
      { href: "/en/guide/executive-health-checkup-bangkok", label: "Executive packages guide" },
      { href: "/en/guide/how-to-prepare-health-checkup-thailand", label: "How to prepare" },
    ],
  },

  "thailand-vs-singapore-health-checkup": {
    title: "Thailand vs Singapore Health Check-Up — Price Comparison 2026",
    description: "Compare health check-up prices, hospital quality, and logistics between Bangkok and Singapore. Bangkok hospitals are 50–70% cheaper for the same JCI-accredited quality.",
    intro: "Bangkok and Singapore are the two most popular medical tourism destinations in Southeast Asia. Both cities have JCI-accredited hospitals with world-class facilities. The key difference: Bangkok is 50–70% cheaper for equivalent health check-up packages, with comparable or better international patient services at top hospitals like Bumrungrad and Samitivej.",
    sections: [
      {
        heading: "Price comparison: Bangkok vs Singapore",
        content: "Side-by-side package prices at comparable JCI hospitals:",
        list: [
          "Executive health check-up — Bangkok: ฿8,000–฿25,000 (SGD 310–970) vs Singapore: SGD 1,200–3,500",
          "Comprehensive check-up with MRI — Bangkok: ฿25,000–฿55,000 vs Singapore: SGD 3,500–7,000",
          "Women's executive (mammogram + ultrasound + pap smear) — Bangkok: ฿8,500–฿18,000 vs Singapore: SGD 1,500–3,200",
          "Cancer screening panel (all markers) — Bangkok: ฿5,000–฿15,000 vs Singapore: SGD 1,500–3,500",
          "MRI brain — Bangkok: ฿8,000–฿18,000 vs Singapore: SGD 1,500–3,000",
          "Gastroscopy — Bangkok: ฿4,500–฿9,000 vs Singapore: SGD 1,200–2,200",
          "Overall savings: Bangkok packages are 50–70% cheaper on average",
        ],
      },
      {
        heading: "Hospital quality: Bangkok vs Singapore",
        content: "Both cities have internationally accredited hospitals, but differ in coverage:",
        list: [
          "JCI hospitals — Bangkok: 9 (Bumrungrad, Bangkok Hospital, Samitivej, BNH, Vejthani, Saint Louis, Phyathai 2, Praram 9, Yanhee); Singapore: 5 (NUH, SGH, Mount Elizabeth, Gleneagles, Raffles)",
          "Bumrungrad Bangkok handles ~1.1M patients/year including 520,000 international patients — similar scale to Singapore General Hospital",
          "Bangkok hospitals have significant advantage in language coverage for Asian languages (Japanese, Korean, Arabic, Chinese coordinators on staff)",
          "Singapore has an advantage for English speakers and Malay-speaking patients from Malaysia/Indonesia",
          "Both cities have comparable wait times (1–3 days for appointments, same-day results for most tests)",
        ],
      },
      {
        heading: "Bangkok advantages over Singapore",
        content: "Specific advantages for choosing Bangkok:",
        list: [
          "Cost: 50–70% cheaper across all package types — significant savings on executive and comprehensive packages",
          "Specialisation: Bumrungrad is consistently ranked Asia's #1 medical tourism hospital by IMTJ (International Medical Travel Journal)",
          "Nationality coverage: dedicated Japanese, Korean, Arabic, and Chinese patient programmes beyond what Singapore offers",
          "Package variety: Bangkok has 3–4x more package options across more hospitals in the same city",
          "No GST: Singapore's 9% GST adds cost; Thailand has no medical service tax for foreign patients",
          "Tourism: Bangkok's entertainment, food, and accommodation is 40–60% cheaper — lower total trip cost",
        ],
      },
      {
        heading: "Singapore advantages over Bangkok",
        content: "Reasons some travellers prefer Singapore:",
        list: [
          "English-first environment: Singapore operates entirely in English with no translation concerns",
          "Proximity to Malaysia: Singapore is preferred for Malaysian patients, especially from Johor Bahru",
          "Tier 1 Western accreditation: Singapore hospitals are Joint Commission International (USA) accredited — same as Bangkok JCI hospitals, but with more familiarity for Western patients",
          "Connectivity: Singapore Changi is a major Asian hub — no stopovers for some long-haul routes",
          "ASEAN hub: Singapore has deeper ties with Australian, New Zealand, and UK private insurance networks",
        ],
      },
    ],
    faqs: [
      { q: "Is Bangkok or Singapore better for a health check-up?", a: "For cost: Bangkok wins by 50–70%. For English-first environment: Singapore is slightly more comfortable. For quality: both are comparable — Bangkok's JCI hospitals (Bumrungrad, Samitivej) match or exceed Singapore's private hospital quality. Most medical tourists who go to Bangkok don't switch back to Singapore for cost reasons alone." },
      { q: "Do Malaysian medical tourists go to Bangkok or Singapore?", a: "Malaysians are split: those from Johor Bahru and the South typically use Singapore for convenience. Malaysians from Kuala Lumpur, Penang, and northern states are increasingly going to Bangkok — particularly Hat Yai for border-area Thais and Penangites, and Bangkok for comprehensive packages. Hat Yai's hospitals are 30–60% cheaper than Penang private hospitals." },
      { q: "Is it worth flying from Singapore to Bangkok just for a health check-up?", a: "For comprehensive or executive packages: typically yes — the savings (SGD 1,500–4,000+) more than offset a Bangkok flight (SGD 120–250 return). Budget 2 days minimum: one for the check-up, one buffer for results collection. Budget travellers can do Bangkok as a round-trip in 36 hours for a comprehensive check-up." },
    ],
    relatedLinks: [
      { href: "/en/guide/jci-hospitals-bangkok", label: "JCI hospitals in Bangkok" },
      { href: "/en/guide/executive-health-checkup-bangkok", label: "Executive packages in Bangkok" },
      { href: "/en/guide/health-checkup-expats-thailand", label: "Expat health check-up guide" },
    ],
  },

  "mens-health-checkup-bangkok": {
    title: "Men's Health Check-Up in Bangkok (2026) — Packages, Prices & Best Hospitals",
    description: "Complete guide to men's health check-up packages in Bangkok. PSA prostate test, testosterone, cardiac risk, liver, kidney — what's included and where to go.",
    intro: "Men's health check-up packages in Bangkok are tailored to male-specific screening needs: prostate health (PSA test), testosterone, erectile function markers, cardiovascular risk (which is higher in men), testicular ultrasound, and liver function (men have higher alcohol-related liver disease rates). Packages range from ฿3,500 for a focused men's panel to ฿25,000 for a comprehensive executive men's check-up.",
    sections: [
      {
        heading: "What is included in a men's health check-up?",
        content: "Men's health packages in Bangkok typically cover:",
        list: [
          "PSA (prostate-specific antigen) — screens for prostate issues, recommended for men 40+",
          "Total and free testosterone — hormonal assessment including total T, free T, LH, FSH",
          "Lipid panel — LDL, HDL, triglycerides (men have higher cardiovascular risk)",
          "Liver function (ALT, AST, GGT) — relevant for alcohol intake and metabolic health",
          "Blood glucose + HbA1c — metabolic risk assessment",
          "Renal function (creatinine, BUN, uric acid for gout)",
          "Testicular ultrasound — available as add-on at most Bangkok hospitals",
          "Abdominal ultrasound — prostate, liver, kidneys",
          "ECG (electrocardiogram) — cardiac rhythm and baseline",
          "Chest X-ray — lung and cardiac shadow",
          "Blood pressure and BMI assessment",
        ],
      },
      {
        heading: "Men's health check-up prices in Bangkok",
        content: "Package tiers for men:",
        list: [
          "Men's basic (PSA + testosterone + metabolic panel): ฿3,500 – ฿6,000",
          "Men's standard (+ ultrasound + ECG + chest X-ray): ฿6,000 – ฿12,000",
          "Men's executive (+ cardiac assessment + cancer markers + specialist): ฿12,000 – ฿28,000",
          "Premium cardiac men's (+ stress ECG + coronary CTA): ฿25,000 – ฿55,000",
          "Erectile dysfunction workup (testosterone + vascular + psychological): ฿8,000 – ฿18,000 add-on",
          "PSA test standalone: ฿300 – ฿800 (add to any package)",
        ],
      },
      {
        heading: "Best Bangkok hospitals for men's health check-ups",
        content: "Top hospitals for male-focused health screening:",
        list: [
          "Bumrungrad International — dedicated Men's Health Centre, widest prostate and urology specialist access",
          "Bangkok Hospital — strong urology department, erectile and hormonal medicine specialist on-site",
          "Samitivej Sukhumvit — men's executive packages include testosterone and cardiac risk, strong Sukhumvit location",
          "Vejthani Hospital — competitive men's packages at 15–20% below Bumrungrad, same JCI standard",
          "BNH Hospital — boutique feel, discreet, popular with expats for testosterone and hormonal assessment",
          "Praram 9 Hospital — BDMS, central location, competitive executive men's packages",
        ],
      },
    ],
    faqs: [
      { q: "At what age should men start getting a health check-up in Bangkok?", a: "Men in their 20s should get a baseline blood panel every 2–3 years (blood pressure, cholesterol, blood glucose). From 35–40, an annual executive check-up is recommended to detect early cardiac risk and hormonal changes. PSA screening for prostate cancer is recommended from age 40 for high-risk groups and 45–50 for average risk." },
      { q: "Can I get a testosterone level test at Bangkok hospitals?", a: "Yes — all major Bangkok private hospitals offer a full male hormonal panel (total testosterone, free testosterone, LH, FSH, SHBG, prolactin). Walk-in blood tests are accepted at most hospitals; morning appointments give the most accurate testosterone readings (levels peak 7–10 AM). Same-day results available." },
      { q: "Is colonoscopy recommended as part of a men's check-up?", a: "Colonoscopy is recommended from age 45–50 for average-risk men, or earlier if there's a family history of colorectal cancer. Bangkok hospitals offer colonoscopy as an add-on to executive check-ups. The procedure costs ฿7,000–฿15,000 under sedation, compared to USD 1,500–3,500 in the US without insurance. Colonoscopy requires a separate bowel prep appointment the day before." },
    ],
    relatedLinks: [
      { href: "/en/compare?category=men", label: "Compare men's health packages" },
      { href: "/en/guide/cancer-screening-bangkok", label: "Cancer screening guide" },
      { href: "/en/guide/cardiac-health-checkup-bangkok", label: "Cardiac health check-up guide" },
      { href: "/en/guide/understanding-health-checkup-results", label: "Understanding your results" },
    ],
  },

  "health-checkup-usa-vs-thailand": {
    title: "USA vs Thailand Health Check-Up Prices (2026) — How Much Americans Save",
    description: "Health check-up packages in Bangkok cost 70–90% less than US private clinics. JCI-accredited hospitals with English staff, same-day results. How much Americans save.",
    intro: "The United States is the most expensive country in the world for healthcare. A comprehensive health check-up with blood work, imaging, and physician review costs USD 1,500–8,000 out-of-pocket at a US private clinic or hospital. The same scope at Bangkok's JCI-accredited Bumrungrad International Hospital costs USD 280–1,200 — a saving of 70–90%. Americans are the third-largest group of international patients at Bangkok's top hospitals.",
    sections: [
      {
        heading: "Price comparison: US vs Bangkok",
        content: "Cost comparison at JCI-accredited hospitals (USD at roughly 0.027 to THB):",
        list: [
          "Basic annual physical (blood work + doctor visit) — Bangkok: ฿2,500–฿5,500 (USD 70–155) vs US out-of-pocket: USD 250–600",
          "Comprehensive blood panel (40+ tests) — Bangkok: ฿3,500–฿7,000 (USD 95–190) vs US: USD 500–2,500 (without insurance)",
          "Executive package (full blood + ultrasound + ECG + doctor) — Bangkok: ฿9,000–฿25,000 (USD 243–680) vs US: USD 2,000–8,000",
          "MRI brain — Bangkok: ฿8,000–฿18,000 (USD 216–490) vs US: USD 1,000–3,500 (without insurance)",
          "Colonoscopy — Bangkok: ฿7,000–฿15,000 (USD 190–406) vs US: USD 1,000–3,500 (without insurance)",
          "Mammogram — Bangkok: ฿1,800–฿5,000 (USD 49–135) vs US: USD 200–500+ (copay even with insurance)",
          "PSA test (prostate) — Bangkok: ฿300–฿800 (USD 8–22) vs US: USD 40–100 per test",
          "Average savings: 75–90% vs US out-of-pocket costs",
        ],
      },
      {
        heading: "Why Americans choose Bangkok for health check-ups",
        content: "Specific advantages for US patients:",
        list: [
          "Cost: 75–90% cheaper out-of-pocket than US private clinics — savings typically USD 1,500–7,000 per trip",
          "No insurance required: Bangkok private hospitals charge transparent flat rates, no surprise bills, no insurance coordination",
          "Bumrungrad International is consistently ranked in the top 5 Asian hospitals — serves 520,000+ international patients per year",
          "Same-day results for most tests — US often requires 3–14 business days for lab and imaging results",
          "No deductibles, no co-insurance, no out-of-pocket maximums: you pay one flat fee for the complete package",
          "Gastroscopy and colonoscopy same day in one visit: US requires separate specialist, separate facility, multiple appointments",
          "English as the working language at all major Bangkok JCI hospitals",
        ],
      },
      {
        heading: "Things US patients should know",
        content: "Practical notes for American patients:",
        list: [
          "Health insurance: US domestic health insurance (Blue Cross, Aetna, UnitedHealth, etc.) generally does not cover elective check-ups in Thailand — you pay out-of-pocket and save vs US out-of-pocket anyway",
          "Travel insurance: Some travel insurance plans have emergency medical coverage in Thailand — check for exclusions for pre-existing conditions",
          "Results: Bangkok hospitals issue results in English — compatible with US physicians and electronic health record systems",
          "Flight cost: Return fare from LAX/JFK to Bangkok runs USD 400–900 — still net savings of USD 1,000+ on an executive package",
          "Timing: Allow 2 days minimum in Bangkok — Day 1 for fasting check-up, Day 2 to collect results and meet with doctor",
          "Medical records transfer: Bumrungrad offers a MyBumrungrad patient portal and can electronically share records with US physicians",
        ],
      },
    ],
    faqs: [
      { q: "Is it really worth flying to Bangkok from the US for a health check-up?", a: "For Americans without insurance or with high deductibles: yes, frequently. A comprehensive executive check-up at Bumrungrad costs ~USD 600. A return flight from the West Coast costs ~USD 500. Total: ~USD 1,100. The same scope in the US without insurance: USD 3,000–8,000. Even with a trip that's just for a check-up, the math works. Many Americans combine it with a Thailand holiday, reducing the effective cost further." },
      { q: "Do Bangkok hospital results work with US doctors?", a: "Yes — Bangkok's major international hospitals (Bumrungrad, Bangkok Hospital, Samitivej, Vejthani) issue English-language laboratory reports using CLSI reference ranges (same as US labs). Imaging reports are written by board-certified radiologists in English. Your US GP or specialist can read them directly. Ask for CD/USB with DICOM imaging files for scan results." },
      { q: "Can I use my US FSA/HSA money for a Bangkok health check-up?", a: "FSA and HSA funds are generally for qualified medical expenses. Expenses at foreign hospitals are eligible if they are medically necessary — preventive health check-ups are included under IRS Publication 502 as a qualified medical expense. Keep all receipts and official hospital documentation. Consult your FSA/HSA administrator to confirm your specific plan's rules for overseas medical expenses." },
    ],
    relatedLinks: [
      { href: "/en/guide/jci-hospitals-bangkok", label: "JCI hospitals in Bangkok" },
      { href: "/en/guide/executive-health-checkup-bangkok", label: "Executive packages" },
      { href: "/en/guide/understanding-health-checkup-results", label: "Understanding your results" },
    ],
  },

  "understanding-health-checkup-results": {
    title: "Understanding Your Thai Health Check-Up Results (2026 Guide)",
    description: "How to read Thai hospital health check-up results. Normal ranges explained for CBC, liver function, kidney function, cholesterol, blood glucose, and cancer markers.",
    intro: "Thai hospitals issue health check-up results in English (at private international hospitals) or Thai/English bilingual format. Understanding the numbers is the most important part of your check-up. This guide explains the key tests and what your results mean — including when to be concerned and when to ask for a doctor follow-up.",
    sections: [
      {
        heading: "Blood test results: normal ranges to know",
        content: "Key blood test reference ranges used by Thai hospitals (WHO/international standards):",
        list: [
          "Fasting blood glucose: 70–100 mg/dL (normal), 100–125 (pre-diabetes), 126+ (diabetes threshold)",
          "HbA1c (3-month blood sugar average): <5.7% (normal), 5.7–6.4% (pre-diabetes), 6.5%+ (diabetes)",
          "Total cholesterol: <200 mg/dL (desirable), 200–239 (borderline), 240+ (high)",
          "LDL cholesterol: <100 mg/dL (optimal for most), <70 for high-risk individuals",
          "HDL cholesterol: >60 mg/dL (good), <40 for men / <50 for women (low, risk factor)",
          "Triglycerides: <150 mg/dL (normal), 150–199 (borderline), 200+ (high)",
          "ALT/AST (liver enzymes): ALT normal 7–40 U/L, AST 10–40 U/L — elevated may indicate liver stress",
          "Creatinine (kidney): Male 0.7–1.3 mg/dL, Female 0.6–1.1 mg/dL",
          "TSH (thyroid): 0.4–4.0 mIU/L (normal); outside range requires follow-up",
          "Uric acid: Male <7.0 mg/dL, Female <6.0 mg/dL — elevated linked to gout",
        ],
      },
      {
        heading: "Cancer marker results: what they mean",
        content: "Cancer tumour markers included in Bangkok hospital packages — what to know:",
        list: [
          "AFP (alpha-fetoprotein, liver cancer): <10 ng/mL is normal; elevated doesn't mean cancer — can be elevated in liver disease, pregnancy, or other conditions",
          "PSA (prostate, men only): <4.0 ng/mL (normal); 4–10 is a grey zone; >10 warrants urology referral",
          "CA-125 (ovarian, women): <35 U/mL normal; elevated in many conditions (endometriosis, fibroids) not just cancer",
          "CEA (colon/lung/breast): <2.5 ng/mL (non-smokers), <5.0 (smokers); mild elevation is common and often not cancer",
          "CA 19-9 (pancreatic): <37 U/mL; single elevated result requires repeat testing — highly variable",
          "⚠️ Important: A single elevated cancer marker result is NOT a cancer diagnosis. It requires clinical context, repeat testing, and specialist review. Do not panic over a borderline result.",
        ],
      },
      {
        heading: "CBC (complete blood count) explained",
        content: "What each CBC measurement means:",
        list: [
          "Haemoglobin (Hb): Male 13.5–17.5 g/dL, Female 12.0–15.5 g/dL — low indicates anaemia",
          "WBC (white blood cells): 4,500–11,000 cells/μL — high may indicate infection or inflammation",
          "Platelets: 150,000–400,000/μL — low may affect clotting; high may increase clot risk",
          "MCV (red blood cell size): 80–100 fL — low indicates iron-deficiency anaemia; high indicates B12/folate deficiency",
          "Thai hospitals flag out-of-range values with H (high) or L (low) markers on the report",
        ],
      },
    ],
    faqs: [
      { q: "My Bangkok health check-up results are in Thai — what do I do?", a: "If you had your check-up at a major international hospital (Bumrungrad, Samitivej, Bangkok Hospital, Vejthani, BNH), ask for an English copy — all these hospitals issue English reports as standard. If your report is in Thai only, the international patient centre can arrange a translated summary. Alternatively, photograph the numerical results — the laboratory values (numbers and units) are universal." },
      { q: "What if one of my results is flagged as 'out of range'?", a: "An out-of-range flag means the value falls outside the statistical normal range — it does NOT necessarily mean you are sick. Many out-of-range results are minor, transient, or clinically insignificant. The attending doctor's written assessment at the end of the report tells you which abnormal results require follow-up. If in doubt, book a 15-minute doctor consultation at the hospital (฿300–800) to review specific concerns." },
      { q: "How do I share my Bangkok test results with my doctor back home?", a: "Ask the hospital to email a PDF copy of your full laboratory report — all major Bangkok international hospitals provide this service free of charge. For imaging (X-ray, ultrasound, CT, MRI), request a CD or USB stick of the DICOM files and a radiologist's written report. Most Western hospitals and GPs can read DICOM files directly." },
    ],
    relatedLinks: [
      { href: "/en/guide/what-is-included-checkup", label: "What's included in a health check-up" },
      { href: "/en/guide/how-to-prepare-health-checkup-thailand", label: "How to prepare for your check-up" },
      { href: "/en/compare?category=executive", label: "Compare executive packages" },
    ],
  },

  "health-checkup-uk-vs-thailand": {
    title: "UK vs Thailand Health Check-Up Cost (2026) — NHS vs Private Bangkok",
    description: "NHS health checks vs Bangkok private hospital packages. Private health check-ups in Bangkok cost 60–80% less than UK private clinics. What you can get and what you save.",
    intro: "The UK's NHS offers a free 'NHS Health Check' for adults aged 40–74 every 5 years, covering basic cardiovascular risk (blood pressure, cholesterol, blood glucose). This is far less comprehensive than private Bangkok hospital packages. UK private health check-ups (Bupa Health Clinics, Nuffield Health, BMI Healthcare) cost £300–2,500 — 60–80% more than equivalent packages at Bangkok's JCI-accredited hospitals.",
    sections: [
      {
        heading: "Price comparison: UK private clinics vs Bangkok",
        content: "Cost comparison for equivalent health screening (GBP at roughly 0.022 to THB):",
        list: [
          "Standard annual check-up (blood + ECG + X-ray) — Bangkok: ฿5,500–฿9,000 (£120–200) vs UK Bupa/Nuffield: £350–600",
          "Executive health check-up — Bangkok: ฿10,000–฿25,000 (£220–550) vs UK: £800–2,500",
          "Comprehensive with ultrasound + cancer markers — Bangkok: ฿18,000–฿45,000 (£395–990) vs UK: £1,500–4,000",
          "MRI brain — Bangkok: ฿8,000–฿18,000 (£175–395) vs UK private: £500–1,200",
          "Colonoscopy — Bangkok: ฿7,000–฿15,000 (£155–330) vs UK private: £1,500–3,000 (NHS: 2–4 year wait for non-urgent)",
          "Women's executive (mammogram + smear + blood) — Bangkok: ฿9,000–฿18,000 (£195–395) vs UK: £600–1,500",
          "Average savings: 65–75% less in Bangkok vs UK private",
        ],
      },
      {
        heading: "What Bangkok hospitals offer that UK private clinics don't",
        content: "Advantages of Bangkok for UK patients:",
        list: [
          "Same-day results for most blood tests and imaging — UK private clinics take 3–10 days",
          "Gastroscopy and colonoscopy available in a single visit — UK requires separate specialist referrals",
          "Full-body MRI available without 12-month GP referral wait time (even UK private)",
          "Cancer marker panels (PSA, CA125, AFP, CEA, CA19-9) as part of an executive package — UK private charges separately",
          "English-speaking doctors at all major Bangkok JCI hospitals — no language barrier",
          "On-site radiologist interpretation within 2–4 hours — UK private often outsources",
        ],
      },
    ],
    faqs: [
      { q: "Is it worth flying to Bangkok from the UK for a health check-up?", a: "For a comprehensive executive package (worth £1,500–2,500 at UK private rates), you save £1,000–2,000 after accounting for a return flight (£350–600) and 2–3 nights hotel (£100–200). The total cost in Bangkok for the same scope is typically £500–800 all-in vs £1,500+ in the UK. Annual travellers, expats, or those who want a Thai holiday at the same time find this most compelling." },
      { q: "Do UK GPs and specialists accept Bangkok hospital results?", a: "Yes — Bangkok's major hospitals issue results in English with standard international reference ranges. The report format from Bumrungrad, Samitivej, and Bangkok Hospital is identical in structure to UK private clinic reports. Always request the full laboratory printout (not just the doctor summary) and bring a copy to your GP." },
      { q: "Does BUPA or AXA UK cover health check-ups in Bangkok?", a: "BUPA UK plans typically do not cover routine health check-ups overseas — only emergency or acute care. Some executive BUPA international plans include overseas preventive screening, but standard UK domestic plans do not. AXA Health has similar restrictions. Check your policy for 'health screening' or 'well-person check' clauses." },
    ],
    relatedLinks: [
      { href: "/en/guide/health-insurance-thailand", label: "Health insurance for Thailand" },
      { href: "/en/guide/executive-health-checkup-bangkok", label: "Executive packages in Bangkok" },
      { href: "/en/guide/how-to-prepare-health-checkup-thailand", label: "How to prepare" },
    ],
  },

  "health-checkup-cost-australia-vs-thailand": {
    title: "Health Check-Up Cost: Australia vs Thailand (2026) — How Much You Save",
    description: "Compare health check-up prices between Australia and Thailand. Bangkok hospitals offer executive packages at 60–80% below Australian private hospital rates — same JCI quality.",
    intro: "Australia's public health system (Medicare) does not cover comprehensive health check-ups beyond basic GP assessments. Private health check-up packages at Australian private hospitals and specialist centres cost AUD 800–4,000+. The same scope at a Bangkok JCI-accredited hospital costs AUD 280–1,200 — saving 60–80%. Many Australians now combine a Thai holiday with a health check-up.",
    sections: [
      {
        heading: "Price comparison: Australia vs Bangkok",
        content: "Executive health check-up price comparison (AUD at roughly 0.038 to THB):",
        list: [
          "Comprehensive blood panel (40+ tests) — Bangkok: ฿3,500–฿6,000 (AUD 130–230) vs Australia: AUD 450–900",
          "Standard annual check-up (blood + X-ray + ECG + ultrasound) — Bangkok: ฿5,000–฿9,000 (AUD 190–340) vs Australia: AUD 600–1,200",
          "Executive package — Bangkok: ฿9,000–฿25,000 (AUD 340–950) vs Australia: AUD 1,500–3,500",
          "MRI brain — Bangkok: ฿8,000–฿18,000 (AUD 300–685) vs Australia: AUD 500–1,500 (Medicare gap, private)",
          "Gastroscopy — Bangkok: ฿4,500–฿9,000 (AUD 170–340) vs Australia: AUD 700–2,500 (private, no Medicare rebate for screening)",
          "Cancer screening panel — Bangkok: ฿5,000–฿15,000 (AUD 190–570) vs Australia: AUD 800–2,800",
          "Savings: 60–80% less for the same scope, at JCI-accredited hospitals",
        ],
      },
      {
        heading: "Is Bangkok hospital quality comparable to Australia?",
        content: "Quality comparison points:",
        list: [
          "JCI accreditation: Bangkok has 9 JCI-accredited hospitals vs Australia's 0 (Australia uses ACHS, not JCI, but JCI is the international benchmark)",
          "IMTJ Medical Travel Awards: Bangkok's hospitals consistently rank in the top 5 Asian hospitals globally",
          "Technology: Bumrungrad, Bangkok Hospital, and Samitivej all use GE/Philips 3T MRI scanners, the same as top Australian hospitals",
          "Wait times: Australia's public system has 2–12 month waits for imaging and specialist referrals; Bangkok private hospitals: 1–3 days",
          "Language: All major Bangkok hospitals have English-speaking staff. Bumrungrad has staff from 70+ countries",
          "Post-visit follow-up: Bangkok hospitals email and telehealth-follow-up at no extra charge",
        ],
      },
    ],
    faqs: [
      { q: "Should I get a health check-up in Thailand or Australia?", a: "If you're paying privately in Australia, Thailand is significantly cheaper (60–80%) for the same or better scope. If Medicare or your private health insurer covers your check-up in Australia, the cost difference may not justify travel. For complex screening (cancer markers, MRI, full executive), the Thailand saving is usually AUD 1,000–3,000 per trip, making it worthwhile for an annual or biennial check-up." },
      { q: "Are Bangkok hospital results accepted by Australian doctors?", a: "Yes — Bangkok's major hospitals issue results in English with recognised laboratory reference ranges. Bumrungrad, Bangkok Hospital, and Samitivej all issue official reports that Australian GPs and specialists accept without translation. Ask for a copy of all raw lab results (not just the summary) for your GP back home." },
      { q: "Do Australian private health insurers cover health check-ups in Bangkok?", a: "Most Australian private health insurers do not cover overseas preventive health check-ups. Some international travel insurance plans have limited emergency medical coverage. For planned health screening, you pay out-of-pocket in Bangkok — the out-of-pocket cost in Bangkok is typically less than the Australian out-of-pocket (gap payment) for the same procedure with private insurance." },
    ],
    relatedLinks: [
      { href: "/en/guide/health-checkup-expats-thailand", label: "Expat health check-up guide" },
      { href: "/en/guide/executive-health-checkup-bangkok", label: "Executive packages in Bangkok" },
      { href: "/en/guide/jci-hospitals-bangkok", label: "JCI hospitals in Bangkok" },
    ],
  },

  "best-hospitals-korean-tourists": {
    title: "Best Hospitals for Korean Tourists in Bangkok (2026) — 한국어 가이드",
    description: "Korean-speaking staff, Korean-language menus, and Korean-preferred health check-up packages in Bangkok. Bumrungrad, Samitivej, Vejthani — which is best for Koreans?",
    intro: "Korea is the largest single source of medical tourists to Thailand. Bangkok's top hospitals — especially Bumrungrad International, Samitivej, and Vejthani — have developed dedicated Korean patient programmes with Korean-speaking nurses and coordinators, Korean-language printed materials, and package formats adapted to Korean health screening preferences (similar to Korean 건강검진). Health check-up costs are 50–75% below Seoul private clinic prices.",
    sections: [
      {
        heading: "Korean health check-up packages in Bangkok",
        content: "Bangkok hospitals that cater to Korean patients offer packages adapted to Korean 건강검진 standards:",
        list: [
          "Standard 건강검진 equivalent (CBC, metabolic panel, urinalysis, X-ray, ECG, ultrasound): ฿6,500 – ฿12,000",
          "Comprehensive (cancer markers: AFP, CEA, PSA/CA125 + endoscopy option): ฿15,000 – ฿35,000",
          "Executive premium (MRI brain + full panel + specialist): ฿30,000 – ฿70,000",
          "Gastroscopy add-on (stomach camera, popular with Koreans): ฿4,500 – ฿9,000",
          "Colonoscopy add-on: ฿7,000 – ฿15,000",
          "Helicobacter pylori test (high prevalence in Korea): ฿800 – ฿2,000",
        ],
      },
      {
        heading: "Best Bangkok hospitals for Korean patients",
        content: "Top-rated hospitals for Korean medical tourists:",
        list: [
          "Bumrungrad International — largest Korean patient department in Thailand, Korean coordinators, Korean-language app, 40+ Korean staff",
          "Samitivej Sukhumvit — dedicated Korean Health Centre with 한국어 상담 (Korean consultation) service",
          "Vejthani Hospital — the hospital most Koreans choose for value, 15–25% cheaper than Bumrungrad, Korean nurses on staff",
          "BNH Hospital — smaller, boutique feel, Korean coordinator, good for private comprehensive packages",
          "Bangkok Hospital — BDMS network, Korean International Patient Centre, good for cancer screening",
        ],
      },
      {
        heading: "Practical tips for Korean tourists",
        content: "Things to know before you go:",
        list: [
          "Book via the hospital's Korean international patient desk in advance — Bumrungrad has a Korean-language phone line",
          "Fasting (금식) for 10–12 hours is required; most hospitals recommend arriving 7:00–8:00 AM",
          "Results in Korean are available at Bumrungrad and Samitivej within 24 hours",
          "Thai tourist visa: no special medical visa is needed for a health check-up trip under 30 days",
          "Translation of Thai medical records to Korean is available through the international patient office",
          "AXA, Samsung Fire & Marine, and DB Insurance Korea have direct billing agreements with Thai JCI hospitals",
        ],
      },
    ],
    faqs: [
      { q: "방콕에서 건강검진 비용은 얼마인가요? (How much does a health check-up cost in Bangkok?)", a: "방콕 종합건강검진 패키지는 ฿6,500(약 25만원)부터 시작하며, MRI포함 프리미엄 패키지는 ฿70,000(약 270만원)까지입니다. 서울 강남 사립병원 대비 50–75% 저렴합니다. 범롱랏(Bumrungrad), 사미티벳(Samitivej), 벳타니(Vejthani) 병원이 한국인에게 가장 인기 있습니다." },
      { q: "Do Bangkok hospitals have Korean-speaking staff?", a: "Yes — Bumrungrad International has 40+ Korean-speaking staff including nurses, coordinators, and doctors. Samitivej Sukhumvit has a dedicated Korean Health Centre. Vejthani Hospital has Korean-speaking nurses. You can communicate entirely in Korean at these facilities from booking through results." },
      { q: "What health checks are Koreans most likely to add?", a: "Koreans commonly add gastroscopy (위내시경, ฿4,500–฿9,000) and colonoscopy (대장내시경, ฿7,000–฿15,000) which have high uptake in Korea. H. pylori testing is also popular (high prevalence in Korean adults). Cancer markers including AFP, CEA, CA19-9, and PSA/CA125 are commonly requested." },
    ],
    relatedLinks: [
      { href: "/en/for/korean-health-checkup-bangkok", label: "Korean health check-up packages (한국어)" },
      { href: "/en/guide/jci-hospitals-bangkok", label: "JCI hospitals in Bangkok" },
      { href: "/en/compare?category=executive", label: "Compare executive packages" },
    ],
  },

  "health-checkup-malaysia-vs-thailand": {
    title: "Health Check-Up: Malaysia vs Thailand (2026) — Hat Yai & Bangkok",
    description: "Compare health check-up costs between Malaysia and Thailand. Hat Yai (Southern Thailand) and Bangkok attract thousands of Malaysian medical tourists annually. Save 40–60% vs KL private hospitals.",
    intro: "Thailand is Malaysia's #1 medical tourism destination, with Hat Yai alone receiving an estimated 100,000+ Malaysian visitors annually for medical and dental care. Bangkok's JCI hospitals offer comparable quality to Gleneagles, Prince Court, and Pantai KL — at 40–60% lower prices. Even accounting for travel, medical tourists from Kuala Lumpur often save significantly on comprehensive packages.",
    sections: [
      {
        heading: "Price comparison: Malaysia vs Thailand health check-up 2026",
        content: "Direct price comparison for equivalent health check-up packages (exchange rate ~MYR 1 = ฿8.5):",
        list: [
          "Basic (blood, X-ray, urine): KL MYR 400–800 | Bangkok ฿1,500–฿2,500 (MYR 175–290) | Saving 50–60%",
          "Standard (+ ECG, ultrasound): KL MYR 1,200–2,000 | Bangkok ฿3,500–฿6,000 (MYR 410–700) | Saving 55–65%",
          "Executive (full organ panel): KL MYR 3,500–6,000 | Bangkok ฿8,000–฿15,000 (MYR 940–1,750) | Saving 55–70%",
          "Premium (CT, MRI, cancer markers): KL MYR 8,000–15,000 | Bangkok ฿20,000–฿40,000 (MYR 2,330–4,650) | Saving 55–70%",
          "Women's health package: KL MYR 2,000–3,500 | Bangkok ฿5,000–฿10,000 (MYR 580–1,160) | Saving 50–60%",
        ],
      },
      {
        heading: "Hat Yai: the medical hub for Malaysian visitors",
        content: "Hat Yai in Songkhla Province, Southern Thailand, is only 90 minutes by road from Penang and 5 hours from KL. Key facts for Malaysian medical tourists:",
        list: [
          "Hat Yai Ram Hospital and Bangkok Hospital Hat Yai are the main private hospitals — both offer check-up packages from ฿1,800",
          "Many hospitals in Hat Yai have Malay-speaking staff and accept Thai Baht / Malaysian Ringgit",
          "Hat Yai is 80km from the Malaysian border at Sadao — day trips for medical care are common",
          "Bus service from Penang to Hat Yai: ~RM 50, 5–6 hours. Budget airlines (AirAsia, Firefly) from KL or Penang: from RM 80–200",
          "Hat Yai packages are typically 25–35% cheaper than Bangkok for equivalent quality",
        ],
      },
      {
        heading: "Bangkok vs KL hospitals: quality comparison",
        content: "Both cities have internationally-accredited hospitals, but Bangkok's ecosystem is larger:",
        list: [
          "JCI accreditation: Bangkok has 9 JCI hospitals; Malaysia has ~8 (Gleneagles KL, Prince Court, Pantai, KPJ Ampang, and others)",
          "Scale: Bumrungrad International treats 1.1M patients/year from 190 countries — larger than any single Malaysian hospital",
          "Specialised cancer care: Bangkok Hospital's cancer centre and Wattanosoth Hospital exceed Malaysia's oncology depth",
          "Waiting times: Bangkok JCI hospitals offer appointments within 1–3 days; KL private hospitals 3–10 days for complex imaging",
          "Language: English is used throughout both systems; Bangkok hospitals add Malay/Bahasa support at Hat Yai and some Bangkok hospitals",
        ],
      },
      {
        heading: "Should Malaysians choose Hat Yai or Bangkok?",
        content: "The choice depends on your location and package needs:",
        list: [
          "Hat Yai: best for Malaysians from Penang, Alor Setar, Kedah, Kelantan — short journey, lower prices, good for standard/executive packages",
          "Bangkok: best for complex or specialist needs (cancer screening, cardiac, cardiac imaging), or if you're combining with tourism",
          "Phuket: convenient for Malaysian visitors from Penang via ferry or AirAsia — comparable to Bangkok pricing but in a resort setting",
          "Koh Samui: smaller hospital network, not ideal for comprehensive packages",
        ],
      },
    ],
    faqs: [
      { q: "Is it worth travelling from KL to Bangkok for a health check-up?", a: "For comprehensive or executive packages (above MYR 2,000 equivalent in Malaysia), the savings in Bangkok (40–60%) typically exceed round-trip AirAsia flights from KL to Bangkok (from ~MYR 300–600 return). For basic check-ups under MYR 800, the saving is less compelling unless you're combining with tourism." },
      { q: "Which Bangkok hospitals are most popular with Malaysian patients?", a: "Bumrungrad International is the most well-known among Malaysians, with Bahasa Malay-speaking staff available. Vejthani Hospital offers the best value among JCI hospitals. Samitivej Sukhumvit is preferred for women's health. For Islamic-observant patients, most major Bangkok hospitals provide halal meal options and can accommodate prayer needs." },
      { q: "Do Hat Yai hospitals accept Malaysian Ringgit?", a: "Some Hat Yai hospitals accept MYR at the counter or have money changers in the building. Thai Baht is preferred — exchange before travel at better rates, or withdraw from ATMs in Hat Yai. Major credit cards (Visa, Mastercard) are accepted at all private hospitals." },
      { q: "Can I use Malaysian insurance at Thai hospitals?", a: "Most Malaysian health insurance policies (Great Eastern, AIA, Prudential, Allianz) do not cover planned medical trips abroad. However, Allianz Care, AXA, and Pacific Cross international health insurance plans can be used at JCI hospitals in Bangkok. Check with your insurer before travel. Keep all receipts for potential reimbursement claims." },
    ],
    relatedLinks: [
      { href: "/en/guide/hat-yai-health-checkup", label: "Hat Yai health check-up guide" },
      { href: "/en/guide/thailand-vs-singapore-health-checkup", label: "Thailand vs Singapore comparison" },
      { href: "/en/guide/jci-hospitals-bangkok", label: "JCI hospitals in Bangkok" },
      { href: "/en/compare?city=hat-yai", label: "Compare Hat Yai packages" },
    ],
  },

  "health-checkup-japan-vs-thailand": {
    title: "Health Check-Up: Japan vs Thailand (2026) — Ningen Dock in Bangkok",
    description: "Compare health check-up costs between Japan and Thailand. Bangkok hospitals offer Ningen Dock-equivalent packages at 50–70% below Japanese prices. Japanese-speaking staff at BNH, Samitivej, and Bumrungrad.",
    intro: "Japan has one of the world's most thorough health screening cultures — the Ningen Dock (人間ドック) is a standard annual check-up for most working adults. Thailand's Bangkok hospitals offer equivalent packages at 50–70% lower prices, with dedicated Japanese departments, Japanese-speaking staff, and same-day results. BNH Hospital has served Japanese patients in Bangkok for over 40 years.",
    sections: [
      {
        heading: "Price comparison: Japan vs Thailand health check-up 2026",
        content: "Ningen Dock-equivalent package cost comparison (exchange rate ~¥4.3 = ฿1):",
        list: [
          "Ningen Dock basic (blood panel, X-ray, urine, ECG, ultrasound): Japan ¥50,000–¥100,000 | Bangkok ฿8,000–฿15,000 (¥34,000–¥65,000) | Saving 35–65%",
          "Ningen Dock comprehensive (+ endoscopy, cancer markers): Japan ¥100,000–¥200,000 | Bangkok ฿18,000–฿35,000 (¥77,000–¥150,000) | Saving 40–55%",
          "Executive premium (+ MRI, full imaging): Japan ¥200,000–¥400,000+ | Bangkok ฿35,000–฿70,000 (¥150,000–¥300,000) | Saving 40–60%",
          "Gastroscopy standalone: Japan ¥20,000–¥40,000 | Bangkok ฿4,500–฿9,000 (¥19,000–¥39,000) | Similar price",
          "PET/CT full body scan: Japan ¥100,000–¥120,000 | Bangkok ฿25,000–฿45,000 (¥107,000–¥194,000) | Saving 30–50%",
        ],
      },
      {
        heading: "What is Ningen Dock — and what does Bangkok offer?",
        content: "Ningen Dock (人間ドック) is Japan's standard annual health screening — far more comprehensive than a typical Western annual check-up. Bangkok hospitals offer equivalent or superior packages:",
        list: [
          "Standard Ningen Dock includes: blood CBC, metabolic panel, urinalysis, stool occult blood, chest X-ray, ECG, abdominal ultrasound, lung function test, eye test, and a doctor consultation",
          "Bangkok equivalent: available at Bumrungrad (「フルボディチェックアップ」), BNH (Japanese-branded package), and Samitivej — all with Japanese-language reports",
          "Gastroscopy (胃内視鏡): Japan typically uses barium swallow (バリウム検査); Bangkok hospitals offer gastroscopy (直接カメラ) as the standard — more accurate, results same day",
          "Colonoscopy (大腸内視鏡): common add-on in Japan, available at Bangkok hospitals for ฿7,000–฿15,000",
          "H. Pylori (ピロリ菌) test: common in Japan given high prevalence; available in Bangkok as add-on from ฿800",
        ],
      },
      {
        heading: "Best Bangkok hospitals for Japanese patients",
        content: "These hospitals have established Japanese patient departments with full Japanese-language services:",
        list: [
          "BNH Hospital — the original Japanese-community hospital in Bangkok; 40+ years serving Japanese residents; smallest and most personal feel; competitive pricing",
          "Samitivej Sukhumvit — full Japanese Health Centre; 日本語でのサービス full Japanese-language reporting; popular with Japanese families",
          "Bumrungrad International — 40+ Japanese-speaking staff; Japanese-language patient app; widest package selection; most recognisable brand to Japanese patients",
          "Bangkok Hospital (main) — BDMS Japanese desk; popular for Japanese corporate groups",
          "Phyathai 2 — Japanese coordinator on-site; competitive pricing for standard/executive packages",
        ],
      },
      {
        heading: "Practical guide for Japanese visitors",
        content: "Everything you need to know to book a health check-up in Bangkok:",
        list: [
          "Booking: contact the hospital's Japanese desk (日本語窓口) directly — BNH, Samitivej, and Bumrungrad all have Japanese-language phone/email support",
          "Fasting (絶食): 10–12 hours before the appointment; water only; morning appointments (7–8 AM) are best",
          "Travel: ANA, JAL, Thai Airways, and budget carriers fly Bangkok from major Japanese cities from ¥30,000–¥80,000 return",
          "Medical records: request Japanese-language results — available at Bumrungrad and Samitivej within 24–48 hours",
          "Medical travel insurance: Japan travel insurance (海外旅行保険) from companies like Sony, Tokio Marine can sometimes cover emergency treatment but not planned check-ups",
          "Payment: all major credit cards (Visa, Mastercard, JCB) accepted; no need for cash conversion beforehand",
        ],
      },
    ],
    faqs: [
      { q: "バンコクで人間ドックを受けるのはいくらですか？ (How much is a Ningen Dock-equivalent health check in Bangkok?)", a: "バンコクの人間ドック相当パッケージは฿8,000（約34,000円）から始まります。胃カメラ付き総合パッケージは฿18,000–฿35,000（約77,000–150,000円）。日本の同等パッケージ（¥50,000–¥200,000）と比べて50–70%節約できます。BNH病院、サミティベット病院、バムルンラード病院が日本語サービスを提供しています。" },
      { q: "Which Bangkok hospitals have Japanese-speaking staff for health check-ups?", a: "BNH Hospital has the longest history of Japanese patient care with a dedicated Japanese department. Samitivej Sukhumvit has a full Japanese Health Centre with Japanese-language reports. Bumrungrad International has 40+ Japanese-speaking staff. All three hospitals offer Japanese-language consultations, appointments, and printed results." },
      { q: "Is a gastroscopy (胃カメラ) better in Bangkok than Japan's barium swallow?", a: "Yes — Bangkok hospitals use direct gastroscopy (カメラ内視鏡) as standard, which is more accurate and faster than the barium swallow (バリウム検査) common at Japanese Ningen Dock centres. Gastroscopy is available in Bangkok for ฿4,500–฿9,000 as an add-on. You can request light sedation (鎮静剤) at most Bangkok hospitals for comfort." },
    ],
    relatedLinks: [
      { href: "/en/for/japanese-health-checkup-bangkok", label: "Japanese health check-up packages" },
      { href: "/en/guide/best-hospitals-japanese-tourists", label: "Best hospitals for Japanese tourists" },
      { href: "/en/guide/thailand-vs-singapore-health-checkup", label: "Thailand vs Singapore comparison" },
    ],
  },

  "rayong-health-checkup": {
    title: "Rayong Health Check-Up Guide (2026)",
    description: "Health check-up hospitals in Rayong, Thailand. Bangkok Hospital Rayong, Camillian, and more. Prices from ฿1,500.",
    intro: "Rayong is an industrial province on the Eastern Seaboard, 180km east of Bangkok, known for the Map Ta Phut petrochemical complex and beautiful beaches along the Gulf of Thailand. Bangkok Hospital Rayong leads the city's private healthcare market, serving both the industrial workforce and tourists passing through to Ko Samet.",
    sections: [
      {
        heading: "Health check-up prices in Rayong",
        content: "Prices in Rayong are typically 20–35% lower than Bangkok equivalents:",
        list: [
          "Basic package (blood, urine, X-ray): ฿1,500 – ฿2,500",
          "Standard package (adds ECG, ultrasound, thyroid): ฿3,800 – ฿6,000",
          "Executive package A: ฿8,500 – ฿12,000",
          "Executive package B (with CT/imaging): ฿18,000 – ฿28,000",
          "Women's health package: ฿7,500 – ฿9,000",
          "Senior package (60+): ฿13,000 – ฿18,000",
        ],
      },
      {
        heading: "Best hospitals for health check-ups in Rayong",
        content: "Rayong has several hospitals serving its industrial and tourist population:",
        list: [
          "Bangkok Hospital Rayong — top tier, interpreter service, full range of packages, GPS: 12.683°N 101.280°E",
          "Phyathai Rayong Hospital — BDMS affiliate, mid-tier, good standard and executive packages",
          "Camillian Hospital Rayong — Catholic mission hospital, affordable, strong reputation for basic to standard checks",
          "Rayong Hospital — government hospital, lowest prices, longer wait times",
        ],
      },
    ],
    faqs: [
      { q: "Is it worth getting a health check-up in Rayong vs Bangkok?", a: "If you are already based in Rayong (working in the industrial zone, visiting Ko Samet, or passing through the Eastern Seaboard), Bangkok Hospital Rayong offers Bangkok-quality care at 20–30% lower prices with no travel time. For very comprehensive packages with MRI or specialist follow-up, Bangkok remains preferable." },
    ],
    relatedLinks: [
      { href: "/en/guide/bangkok-health-checkup", label: "Bangkok health check-up guide" },
      { href: "/en/city/rayong", label: "Compare Rayong packages" },
    ],
  },

  "surat-thani-health-checkup": {
    title: "Surat Thani Health Check-Up Guide (2026)",
    description: "Health check-up hospitals in Surat Thani. Bangkok Hospital Surat Thani and other options. Prices from ฿1,300.",
    intro: "Surat Thani is the main gateway city to Koh Samui, Koh Phangan, and Koh Tao in southern Thailand. Bangkok Hospital Surat Thani provides the highest standard of care in the province, and many travellers en route to the Gulf coast islands combine a health check-up in Surat Thani with their island visit.",
    sections: [
      {
        heading: "Health check-up prices in Surat Thani",
        content: "Prices are competitive — 25–40% below Bangkok rates:",
        list: [
          "Basic package: ฿1,300 – ฿1,900",
          "Standard package: ฿3,500 – ฿5,500",
          "Executive package A: ฿7,500 – ฿11,000",
          "Executive package B (with imaging): ฿15,000 – ฿25,000",
          "Women's health: ฿7,000 – ฿8,500",
          "Senior package (60+): ฿12,000 – ฿16,000",
        ],
      },
      {
        heading: "Best hospitals in Surat Thani for health check-ups",
        content: "Main hospital options:",
        list: [
          "Bangkok Hospital Surat Thani — BDMS flagship in the province, English-speaking staff, interpreter",
          "Taksin Hospital — mid-tier private, popular with local professionals, women's health packages",
          "Surat Thani Hospital — government hospital, most affordable, longer waiting",
          "Kasemrad Surat Thani — private, competitive pricing, standard packages",
        ],
      },
    ],
    faqs: [
      { q: "Can I get a health check-up in Surat Thani before catching the ferry to Koh Samui?", a: "Yes — Bangkok Hospital Surat Thani offers morning packages (arrive 7:30 AM, complete by noon) leaving the afternoon free for the ferry to Koh Samui (1.5 hours to Donsak Pier, then ferry). Book basic or standard packages; executive packages require longer." },
    ],
    relatedLinks: [
      { href: "/en/guide/koh-samui-health-checkup", label: "Koh Samui health check-up guide" },
      { href: "/en/city/surat-thani", label: "Compare Surat Thani packages" },
    ],
  },

  "phitsanulok-health-checkup": {
    title: "Phitsanulok Health Check-Up Guide (2026)",
    description: "Health check-up hospitals in Phitsanulok, northern Thailand. Bangkok Hospital Phitsanulok and other options. Prices from ฿1,400.",
    intro: "Phitsanulok is a major provincial capital in Lower Northern Thailand, home to the famous Phra Buddha Chinnarat shrine and an important transport hub between Bangkok and Chiang Mai. Bangkok Hospital Phitsanulok is the leading private hospital in the province, serving patients from neighbouring provinces including Phrae, Nan, and Uttaradit.",
    sections: [
      {
        heading: "Health check-up prices in Phitsanulok",
        content: "Phitsanulok offers excellent value — 25–40% below Bangkok prices:",
        list: [
          "Basic package: ฿1,400 – ฿2,000",
          "Standard package: ฿3,500 – ฿5,500",
          "Executive package A: ฿7,500 – ฿11,500",
          "Executive package B (with CT): ฿15,000 – ฿22,000",
          "Women's health: ฿7,500 – ฿8,500",
          "Senior package (60+): ฿12,000 – ฿16,000",
          "Comprehensive full-body: ฿22,000 – ฿28,000",
        ],
      },
      {
        heading: "Best hospitals in Phitsanulok for health check-ups",
        content: "Options in Phitsanulok:",
        list: [
          "Bangkok Hospital Phitsanulok — top private hospital in the province, English available, full range",
          "Buddhachinaraj Hospital — large government teaching hospital, very affordable, public patients",
          "Phitsanulok Ram Hospital — established private, mid-tier, good standard packages",
          "Phitsanulok Hospital — government, lowest prices, long waiting times",
        ],
      },
    ],
    faqs: [
      { q: "Is Phitsanulok worth visiting specifically for a health check-up?", a: "Not typically from Bangkok — the 5-hour bus or 4-hour train journey makes it less practical than Chiang Mai or Phuket as a dedicated medical tourism destination. However, if you are already visiting Phitsanulok (Sukhothai Historical Park, Phra Buddha Chinnarat), Bangkok Hospital Phitsanulok offers quality care at 30%+ savings." },
    ],
    relatedLinks: [
      { href: "/en/guide/chiang-mai-health-checkup", label: "Chiang Mai health check-up guide" },
      { href: "/en/city/phitsanulok", label: "Compare Phitsanulok packages" },
    ],
  },

  "trang-health-checkup": {
    title: "Trang Health Check-Up Guide (2026)",
    description: "Health check-up hospitals in Trang, southern Thailand. Bangkok Hospital Trang and other options. Prices from ฿1,300.",
    intro: "Trang is a laid-back provincial capital in the Andaman coast region, famous for dim sum breakfast culture, pristine offshore islands, and the Trang Vegetarian Festival. Bangkok Hospital Trang leads the private healthcare market in the province, serving locals and the increasing number of visitors exploring the quieter Andaman alternatives to Krabi and Phuket.",
    sections: [
      {
        heading: "Health check-up prices in Trang",
        content: "Trang is very affordable — 30–45% below Bangkok rates:",
        list: [
          "Basic package: ฿1,300 – ฿2,000",
          "Standard package: ฿3,500 – ฿5,000",
          "Executive package A: ฿7,500 – ฿10,500",
          "Executive package B (with CT): ฿14,000 – ฿21,000",
          "Women's health: ฿7,000 – ฿8,000",
          "Senior package (60+): ฿12,000 – ฿14,500",
        ],
      },
      {
        heading: "Best hospitals in Trang for health check-ups",
        content: "Main options in Trang:",
        list: [
          "Bangkok Hospital Trang — BDMS flagship in Trang, highest standard, English available",
          "Trang Hospital — government hospital, cheapest, longer wait times",
          "Wattanaphet Hospital — established private, mid-tier, reliable for standard packages",
        ],
      },
    ],
    faqs: [
      { q: "Should I get a health check-up in Trang or Krabi?", a: "Both cities have Bangkok Hospital branches of similar standard. Krabi has slightly more international medical tourism infrastructure and a larger English-speaking patient population. Trang is more local and quieter — better if you are already visiting Trang's islands (Ko Muk, Ko Kradan) rather than going to Krabi." },
    ],
    relatedLinks: [
      { href: "/en/guide/krabi-health-checkup", label: "Krabi health check-up guide" },
      { href: "/en/guide/phuket-health-checkup", label: "Phuket health check-up guide" },
    ],
  },

  "private-vs-government-hospital-thailand": {
    title: "Private vs Government Hospital in Thailand — Which to Choose (2026)",
    description: "Should you go to a government hospital or private hospital for a health check-up in Thailand? Cost, waiting time, quality, English service — full comparison for expats and medical tourists.",
    intro: "Thailand has two parallel healthcare systems: an extensive government hospital network (funded by taxes, ultra-cheap, long waits) and a world-class private hospital sector (fee-based, fast, English-friendly). For health check-ups, the right choice depends heavily on your priorities — cost vs time, Thai language vs English, basic testing vs comprehensive screening.",
    sections: [
      {
        heading: "Cost comparison: private vs government hospitals",
        content: "Price difference is the most significant factor. Government hospitals are heavily subsidised:",
        list: [
          "Basic blood panel at government hospital: ฿200–฿600 (Thai citizens via Universal Coverage Scheme may pay ฿30–฿100)",
          "Same basic blood panel at private hospital: ฿800–฿2,000",
          "Comprehensive check-up at government hospital: ฿1,500–฿4,500 (longer queue, fewer inclusions)",
          "Comprehensive check-up at private hospital: ฿4,000–฿12,000 (faster, more inclusions, English results)",
          "Executive check-up (not widely available at govt hospitals): ฿8,000–฿15,000 at select university hospitals vs ฿15,000–฿40,000 at top private hospitals",
          "For foreigners: government hospitals charge non-resident rates, narrowing the price gap significantly",
        ],
      },
      {
        heading: "Waiting time: the biggest practical difference",
        content: "Waiting time is where government and private hospitals diverge most:",
        list: [
          "Government hospital walk-in queue: 2–6 hours is common; popular hospitals (Siriraj, Chulalongkorn) may mean all-day waits",
          "Government hospital appointment: 2–4 weeks for non-urgent check-ups",
          "Private hospital walk-in health check-up: 15–45 minutes to start; full check-up completed in 3–5 hours",
          "Private hospital appointment: same day or next day for most packages",
          "Results: government hospitals 3–14 days; private hospitals typically same-day to 24 hours",
        ],
      },
      {
        heading: "English language support",
        content: "Language is a critical consideration for foreign visitors:",
        list: [
          "Government hospitals: English is available at International Patient departments, but depth of English service varies. Siriraj International, Chulalongkorn (King Chulalongkorn Memorial Hospital) and Ramathibodi have dedicated English-language services, but availability is limited",
          "Private hospitals (JCI): all staff at Bumrungrad, Samitivej, Vejthani, BNH, Bangkok Hospital speak English. Results, reports, and consultations are fully in English",
          "Non-JCI private hospitals: English support is usually available but less consistent",
          "For medical tourists: private hospitals are strongly recommended for English-language experience",
        ],
      },
      {
        heading: "When to choose a government hospital",
        content: "Government hospitals make sense in specific situations:",
        list: [
          "You have Thai national health insurance (30-Baht Scheme, CSMBS, SSF) — check-ups may be free or ฿30",
          "You want the lowest absolute price for a simple blood test and can wait",
          "You are a long-term resident comfortable navigating the Thai-language system",
          "You want specific specialist care not available at private hospitals — some government university hospitals lead in rare-disease treatment",
          "Budget check-ups: Siriraj, Chulalongkorn Memorial, and Ramathibodi offer quality lab testing at low prices",
        ],
      },
      {
        heading: "When to choose a private hospital",
        content: "Private hospitals are the right choice for most health check-up scenarios:",
        list: [
          "You are a foreign visitor, expat, or medical tourist — English service, fast results, international payment options",
          "You want a comprehensive check-up completed in one day — private hospitals process blood, imaging, and ECG simultaneously",
          "You want same-day results with a doctor consultation to review findings",
          "You have international health insurance — private hospitals provide the documentation insurers require",
          "You want JCI accreditation standards, international safety protocols, and a verifiable quality benchmark",
        ],
      },
    ],
    faqs: [
      { q: "Can foreigners use Thai government hospitals for health check-ups?", a: "Yes — government hospitals are open to all patients, including foreigners. However, foreigners pay the 'non-registered' rate rather than the subsidised Thai citizen rate. This reduces the price advantage. Expect to pay ฿1,500–฿5,000 for a comprehensive check-up at a government hospital as a foreigner, compared to ฿4,000–฿8,000 at a private hospital — but with much longer waits and less English support at the government facility." },
      { q: "Is a Siriraj health check-up as accurate as a private hospital?", a: "Lab accuracy is comparable — government university hospitals like Siriraj and Chulalongkorn use ISO 15189-accredited laboratories with the same equipment as private hospitals. The difference is in speed, patient experience, English reporting, imaging scope, and specialist consultation time. For the lab tests themselves, accuracy is not a concern." },
      { q: "Are Bangkok's government hospitals really that slow?", a: "Popular government hospitals during peak times (7–9 AM) have queues of 200–400+ patients. Health check-ups are lower priority than acute care. Realistically, a foreigner attempting a walk-in health check-up at Siriraj would likely wait 3–6 hours and may not complete all tests the same day. Private hospitals process health check-up patients on a dedicated fast track, typically finishing in 3–5 hours." },
      { q: "Which private hospitals are closest in price to government hospitals?", a: "Phyathai 1, Phyathai 2, and Phyathai 3 hospitals offer competitive pricing close to the budget end of the private market. Vibhavadi Hospital, Kasemrad, and Ramkhamhaeng Hospital are also competitively priced. These non-JCI private hospitals offer basic packages from ฿1,200–฿2,500 with English service and fast results — the best compromise between government hospital price and private hospital experience." },
    ],
    relatedLinks: [
      { href: "/en/guide/bangkok-health-checkup", label: "Bangkok health check-up complete guide" },
      { href: "/en/guide/jci-hospitals-bangkok", label: "JCI hospitals in Bangkok" },
      { href: "/en/for/budget-health-checkup-bangkok", label: "Budget packages under ฿3,000" },
      { href: "/en/compare?category=basic", label: "Compare basic packages" },
    ],
  },

  "executive-health-checkup-bangkok": {
    title: "Executive Health Check-Up Bangkok — Best Packages, Prices & Hospitals (2026)",
    description: "Complete guide to executive health check-up packages in Bangkok. Compare prices at Bumrungrad, Samitivej, Bangkok Hospital. What's included, how to book, what to expect.",
    intro: "An executive health check-up in Bangkok is the gold standard in preventive medicine — a comprehensive all-day screen covering every major organ system, with specialist consultations, advanced imaging (MRI or CT), and cancer marker panels. Bangkok's executive packages at JCI hospitals cost 30–60% less than equivalent packages in the US, UK, or Singapore.",
    sections: [
      {
        heading: "What is an executive health check-up in Bangkok?",
        content: "An executive health check-up in Bangkok typically includes all of the following in one appointment:",
        list: [
          "Full blood panel: CBC, metabolic panel, lipids, liver, kidney, thyroid, HbA1c, uric acid",
          "Cancer markers: AFP, CEA, CA-125 (women), CA 19-9, PSA (men), CA 15-3 (women)",
          "Cardiovascular: ECG, blood pressure, coronary risk score",
          "Imaging: chest X-ray, abdominal ultrasound (full), +/- coronary CT, brain MRI",
          "Women's specific: Pap smear, breast ultrasound or mammogram, pelvic ultrasound",
          "Men's specific: PSA, testicular ultrasound (optional), prostate check",
          "Specialist consultation: internist (or cardiologist/oncologist as needed)",
          "Results review with detailed health report — often PDF format, sharable with your home doctor",
        ],
      },
      {
        heading: "Executive health check-up prices in Bangkok (2026)",
        content: "Price ranges across all hospital tiers:",
        list: [
          "Budget / provincial private hospital: ฿8,000 – ฿12,000 (full blood + X-ray + ultrasound + ECG + consult)",
          "Established private hospital (non-JCI): ฿12,000 – ฿25,000 (above + cancer markers + MRI option)",
          "JCI hospital — entry level: ฿18,000 – ฿35,000 (Vejthani, Saint Louis, Phyathai)",
          "JCI hospital — premium: ฿35,000 – ฿60,000 (Bangkok Hospital, BNH, Samitivej)",
          "JCI flagship (Bumrungrad): ฿45,000 – ฿85,000 (full executive A to Executive Platinum)",
          "Executive package with MRI brain + body: add ฿15,000 – ฿35,000 to above prices",
        ],
      },
      {
        heading: "Best hospitals for executive health check-ups in Bangkok",
        content: "Top-rated hospitals for comprehensive executive packages:",
        list: [
          "Bumrungrad International — widest package range (3 executive tiers), most experienced team, largest international patient base, 2.5 hours average check-up time",
          "Samitivej Sukhumvit — best rated for women's executive packages, excellent oncology team, slightly lower prices than Bumrungrad",
          "Bangkok Hospital (Phaya Thai) — BDMS flagship, strong imaging department, dedicated health check-up floor, Bangkok-standard care",
          "BNH Hospital — preferred by Europeans and Japanese, quieter, efficient, 3.5 hours average check-up, JCI accredited",
          "Vejthani Hospital — best price-to-quality ratio for JCI executive packages, English and Mandarin services",
          "Saint Louis Hospital — good value JCI, central location (Sathon), strong reputation for thorough exams",
        ],
      },
      {
        heading: "How long does an executive health check-up take in Bangkok?",
        content: "Timeline for a full executive check-up:",
        list: [
          "Registration and pre-check (blood draw, weight, BP, vision, hearing): 30–45 min",
          "Imaging (chest X-ray, abdominal ultrasound): 45–90 min",
          "ECG + treadmill test (if included): 30–45 min",
          "MRI (if included): 30–60 min",
          "Lunch break (most executive packages include lunch at the hospital): 30–60 min",
          "Specialist consultation and results review: 45–60 min",
          "Total: 4–6 hours for a full executive package without MRI; 6–8 hours with MRI",
        ],
      },
      {
        heading: "How to book an executive health check-up in Bangkok",
        content: "Booking tips for first-time visitors:",
        list: [
          "Book at least 2–3 days in advance — executive check-up slots are limited, especially at Bumrungrad",
          "Fast from midnight the night before; water is fine; no alcohol for 24 hours before",
          "Bring passport and any previous health records or lab results",
          "Wear comfortable clothing — you will change into a hospital gown for imaging",
          "Arrange transport for the return journey — you may feel lightheaded after fasting all morning",
          "Ask for your results in PDF format — most hospitals provide a digital copy that day",
        ],
      },
    ],
    faqs: [
      { q: "What is the difference between a comprehensive and executive health check-up in Bangkok?", a: "A comprehensive package covers the essential tests (blood panel, X-ray, ECG, ultrasound) without a physician consultation. An executive package adds specialist consultations, advanced imaging (MRI or CT), cancer markers, and a detailed health report. Executive packages typically take a full day vs 3 hours for comprehensive packages." },
      { q: "Are Bangkok executive health check-up results recognised internationally?", a: "Yes — all JCI-accredited Bangkok hospitals issue results in international standard formats (HL7/FHIR-compatible PDFs) that are recognised by doctors worldwide. Lab normal ranges may differ slightly from US/European references — your home doctor should be informed that the reference ranges are based on Thai population data." },
      { q: "Can I combine an executive health check-up with cancer screening in Bangkok?", a: "Yes — most executive packages include basic cancer markers. For a comprehensive cancer screen, look for packages that include a low-dose CT chest (lung cancer detection), gastroscopy or barium meal, colonoscopy referral, and full tumour marker panel. Ask the hospital's health check-up coordinator to build a customised cancer-plus-executive package." },
    ],
    relatedLinks: [
      { href: "/en/compare?category=executive", label: "Compare all executive packages" },
      { href: "/en/guide/jci-hospitals-bangkok", label: "JCI hospitals in Bangkok" },
      { href: "/en/guide/cancer-screening-bangkok", label: "Cancer screening in Bangkok" },
      { href: "/en/guide/what-is-included-checkup", label: "What's included in a health check-up?" },
    ],
  },

  "blood-test-price-bangkok": {
    title: "Blood Test Price in Bangkok — 2026 Cost Guide",
    description: "How much does a blood test cost in Bangkok? Complete guide to blood test packages at Thai private hospitals — CBC, lipid panel, liver function, diabetes screening and more.",
    intro: "Blood tests are the foundation of every health check-up in Thailand. Bangkok's private hospitals offer individual blood tests and full blood panel packages at prices 60–80% lower than equivalent tests in the US, UK, or Australia — with same-day results at most hospitals.",
    sections: [
      {
        heading: "How much does a blood test cost in Bangkok?",
        content: "Individual blood test prices at Bangkok private hospitals:",
        list: [
          "Complete Blood Count (CBC): ฿180 – ฿450",
          "Fasting blood glucose: ฿120 – ฿280",
          "Lipid panel (total cholesterol, HDL, LDL, triglycerides): ฿350 – ฿700",
          "Liver function tests (ALT, AST, ALP, bilirubin): ฿350 – ฿650",
          "Kidney function (creatinine, BUN, eGFR): ฿280 – ฿550",
          "Thyroid function (TSH + T3 + T4): ฿450 – ฿900",
          "HbA1c (3-month blood sugar average): ฿350 – ฿650",
          "Hepatitis B surface antigen (HBsAg): ฿280 – ฿500",
          "PSA (prostate, men 40+): ฿450 – ฿900",
          "Full hormone panel (testosterone/estrogen/FSH/LH): ฿1,200 – ฿2,500",
        ],
      },
      {
        heading: "Blood test package pricing",
        content: "Bundling blood tests into a package is always cheaper than individual tests:",
        list: [
          "Basic blood panel (CBC + glucose + lipids + liver + kidney): ฿900 – ฿2,200",
          "Standard blood panel (adds thyroid, Hep B/C, uric acid, iron): ฿1,800 – ฿4,500",
          "Comprehensive blood panel (adds cancer markers, hormones, vitamins): ฿5,000 – ฿12,000",
          "Cancer marker panel (AFP, CEA, CA-125, CA 19-9, PSA): ฿2,500 – ฿6,000 separately",
          "STD/STI panel (HIV, syphilis, gonorrhoea, chlamydia): ฿1,200 – ฿3,500",
        ],
      },
      {
        heading: "Where to get a blood test in Bangkok",
        content: "Options for blood tests without a full health check-up package:",
        list: [
          "Walk-in blood draw: available at most Bangkok private hospitals, no appointment needed, start from ฿300 for a single test",
          "Government hospitals (Siriraj, Ramathibodi): cheapest (฿80–฿150/test), but expect 2–4 hour waits",
          "Private lab chains (Samitivej Lab, Medtech): competitive pricing, multiple locations, results by LINE app",
          "Health check-up package: most cost-effective if you need 5+ tests — saves 30–50% vs individual pricing",
        ],
      },
      {
        heading: "How to prepare for a blood test in Bangkok",
        content: "Standard preparation requirements:",
        list: [
          "Fasting: 8–12 hours before blood draw for glucose, lipid, and comprehensive panels",
          "Water is fine — stay hydrated; avoid black coffee before the draw",
          "Do NOT fast for CBC-only, thyroid, or specific cancer marker panels (check with the lab)",
          "Morning appointments are easiest — arrive 7–8am, test done before breakfast",
          "Results: most routine tests ready within 4–6 hours; comprehensive panels often same-day or next morning",
        ],
      },
    ],
    faqs: [
      { q: "Can I get a blood test in Bangkok without a doctor's referral?", a: "Yes — Bangkok private hospitals allow walk-in blood tests without a referral. You can go directly to the laboratory department, specify which tests you want, pay at the counter, and have blood drawn. A doctor consultation to review results costs ฿300–฿800 extra but is optional." },
      { q: "How long does a blood test take in Bangkok?", a: "The blood draw itself takes 5–10 minutes. Results for routine blood tests (CBC, glucose, lipids) are typically ready in 2–4 hours at Bangkok private hospitals. Thyroid, Hepatitis, and cancer marker results take 4–6 hours. Vitamin D and B12 may require overnight processing." },
      { q: "What blood tests should I get as a foreigner in Bangkok?", a: "For a first health screen in Bangkok, the most useful blood tests for foreigners are: CBC (general health), blood glucose (diabetes risk), lipid panel (heart risk), liver function (especially if you drink alcohol), kidney function, thyroid (TSH), and Hepatitis B surface antigen. Total cost: ฿1,500–฿3,000 as a package." },
    ],
    relatedLinks: [
      { href: "/en/guide/what-is-included-checkup", label: "What's included in a health check-up?" },
      { href: "/en/guide/bangkok-health-checkup", label: "Bangkok health check-up guide" },
      { href: "/en/compare?category=basic", label: "Compare basic packages" },
    ],
  },

  "mri-scan-cost-bangkok": {
    title: "MRI Scan Cost in Bangkok — 2026 Price Guide",
    description: "How much does an MRI scan cost in Bangkok? Compare MRI prices at JCI hospitals vs private hospitals. Brain MRI, full body MRI, cardiac MRI — all prices compared.",
    intro: "Bangkok's private hospitals offer MRI scans at 40–70% below US or European prices, with same-day results and English-speaking radiologists at all major facilities. MRI is available standalone or as part of an executive health check-up package.",
    sections: [
      {
        heading: "MRI scan prices in Bangkok (2026)",
        content: "Approximate MRI prices at Bangkok private hospitals:",
        list: [
          "Brain MRI (without contrast): ฿8,000 – ฿18,000",
          "Brain MRI (with contrast/gadolinium): ฿12,000 – ฿24,000",
          "Spine MRI (cervical/thoracic/lumbar): ฿10,000 – ฿22,000 per region",
          "Knee/shoulder/hip MRI: ฿8,500 – ฿16,000",
          "Abdominal MRI (liver, pancreas, kidneys): ฿14,000 – ฿28,000",
          "Cardiac MRI (heart function & structure): ฿22,000 – ฿45,000",
          "MRI whole body (1.5T basic): ฿35,000 – ฿60,000",
          "MRI whole body (3T advanced): ฿55,000 – ฿90,000",
        ],
      },
      {
        heading: "Executive health check-ups with MRI",
        content: "The most cost-effective way to get an MRI in Bangkok is as part of an executive package:",
        list: [
          "Many hospitals bundle MRI brain + full blood panel + doctor consultation for ฿25,000–฿55,000",
          "MRI packages at Bumrungrad, Bangkok Hospital, Vejthani include radiologist interpretation and same-day results",
          "Executive packages with MRI often include CT scan, cancer markers, and specialist follow-up",
          "Compare executive packages with MRI using the filter on our compare page",
        ],
      },
      {
        heading: "Best hospitals for MRI in Bangkok",
        content: "Hospitals with 3T (high-resolution) MRI scanners and fast results:",
        list: [
          "Bumrungrad International — multiple 3T scanners, fastest result turnaround (2–3 hours), most experience with complex cases",
          "Bangkok Hospital — 3T Philips Ingenia, excellent cardiac and neuro MRI protocols",
          "Vejthani Hospital — 3T GE, competitive pricing, quiet machine environment",
          "Samitivej Sukhumvit — 1.5T and 3T, best value for brain and spine MRI",
          "BNH Hospital — 3T, specialist team, good for MRI alongside Japanese/European protocol check-ups",
        ],
      },
    ],
    faqs: [
      { q: "Do I need a doctor's referral for an MRI in Bangkok?", a: "At most Bangkok private hospitals, you can request an MRI directly without a referral — especially if you are a medical tourist. However, the hospital may require a brief consultation with an on-site doctor (฿300–฿800) to confirm the clinical indication before ordering the MRI. JCI hospitals require clinical documentation." },
      { q: "How long does an MRI take in Bangkok?", a: "The scan itself takes 20–60 minutes depending on body part. Brain or spine MRI: 20–40 min. Cardiac MRI: 45–60 min. MRI with contrast: add 15 minutes. Results from the radiologist are usually ready within 2–4 hours at Bangkok private hospitals." },
      { q: "Is MRI in Bangkok safe and hygienic?", a: "Yes — Bangkok's JCI-accredited hospitals use modern MRI scanners (mostly GE and Philips 3T machines) maintained to international standards. Staff are trained to international protocols for contrast agent safety, patient positioning, and infection control." },
    ],
    relatedLinks: [
      { href: "/en/guide/executive-health-checkup-bangkok", label: "Executive health check-up guide" },
      { href: "/en/compare?category=executive", label: "Compare executive packages" },
      { href: "/en/guide/jci-hospitals-bangkok", label: "JCI hospitals in Bangkok" },
      { href: "/en/guide/ct-scan-cost-bangkok", label: "CT scan cost Bangkok" },
    ],
  },

  "ct-scan-cost-bangkok": {
    title: "CT Scan Cost in Bangkok — 2026 Price Guide",
    description: "How much does a CT scan cost in Bangkok? Chest CT, abdominal CT, coronary calcium CT, full-body CT — all prices compared at JCI and private hospitals.",
    intro: "CT (computed tomography) scans in Bangkok cost 40–70% less than equivalent scans in the US, UK, or Australia — with same-day results at most private hospitals. Bangkok's top hospitals use 64-slice and 128-slice CT scanners for accurate diagnostic imaging. CT is available standalone or as part of an executive health check-up package.",
    sections: [
      {
        heading: "CT scan prices in Bangkok (2026)",
        content: "Approximate CT scan prices at Bangkok private hospitals:",
        list: [
          "Chest CT (low-dose, lung screening): ฿3,500 – ฿8,000 (US equivalent: $400–$1,200)",
          "Abdominal CT (with contrast): ฿5,000 – ฿12,000 (US equivalent: $500–$1,500)",
          "Chest + abdomen + pelvis CT: ฿9,000 – ฿20,000",
          "Coronary calcium score CT (CACS): ฿4,500 – ฿9,000 (US equivalent: $150–$600)",
          "Coronary CT angiography (CCTA): ฿15,000 – ฿35,000 (US equivalent: $1,000–$4,000)",
          "Brain CT: ฿3,500 – ฿8,000",
          "Whole-body CT scan: ฿15,000 – ฿35,000",
          "Neck CT: ฿4,000 – ฿8,500",
        ],
      },
      {
        heading: "CT vs MRI — which do you need?",
        content: "CT and MRI are both imaging technologies but used for different purposes:",
        list: [
          "CT scan: uses X-rays, faster (5–15 min), better for bone, lung, calcification, acute bleeding, coronary calcium; involves radiation",
          "MRI: uses magnetic fields, slower (30–60 min), better for soft tissue, brain, spinal cord, joints, soft-tissue tumours; no radiation",
          "For cardiac screening: coronary calcium score CT is the standard first-line test for heart disease risk",
          "For lung cancer screening: low-dose CT (LDCT) is recommended for high-risk individuals (smokers, age 50+)",
          "For abdominal check-up: CT shows liver, gallbladder, kidneys, spleen, colon clearly; ultrasound is cheaper for initial screening",
          "For brain check-up: MRI is preferred for soft-tissue detail; CT is faster and used for acute/emergency situations",
        ],
      },
      {
        heading: "Best Bangkok hospitals for CT scans",
        content: "Top-rated hospitals for CT scanning with newest equipment:",
        list: [
          "Bumrungrad International — 256-slice CT scanner; fastest imaging in Bangkok; used for complex cardiac CT angiography",
          "Bangkok Hospital — 128-slice CT with dual-energy capability; excellent for abdominal and cardiac",
          "Samitivej Sukhumvit — 128-slice CT; strong cardiac CT programme; competitive pricing",
          "Vejthani Hospital — 128-slice CT; most competitive JCI pricing for standalone CT scans",
          "Phyathai 2 — 64-slice CT; good value for straightforward chest/abdominal CT; non-JCI but reputable",
        ],
      },
      {
        heading: "Coronary calcium score CT (CACS) — Bangkok guide",
        content: "The coronary calcium score CT is one of the most popular add-on tests for health check-up visitors from abroad:",
        list: [
          "Price in Bangkok: ฿4,500 – ฿9,000 (US equivalent: $150–$600, often without insurance coverage)",
          "No contrast injection required — lower risk than coronary CTA",
          "Scan time: 5–10 minutes; results within 1 hour",
          "Score interpretation: 0 = very low risk; 1–99 = mild risk; 100–399 = moderate risk; 400+ = high risk",
          "Best candidates: men over 45, women over 55, smokers, family history of heart disease",
          "Available as standalone or included in executive cardiac packages",
        ],
      },
    ],
    faqs: [
      { q: "How much does a CT scan cost in Bangkok vs the US?", a: "A chest CT in Bangkok costs ฿3,500–฿8,000 (approximately US$95–$220), compared to US$300–$1,200 in the US without insurance. A coronary calcium score CT costs ฿4,500–฿9,000 (US$125–$250) in Bangkok vs $150–$600 in the US (often not covered by insurance). Whole-body CT: ฿15,000–฿35,000 (US$410–$960) in Bangkok vs $1,500–$4,000 in the US." },
      { q: "Do I need a referral for a CT scan in Bangkok?", a: "No referral is required at Bangkok private hospitals. You can request a CT scan as part of a health check-up package or standalone. The hospital will have a physician review your request to ensure the scan is appropriate. Walk-in CT requests for straightforward cases (chest, abdominal, coronary calcium) are routinely accommodated." },
      { q: "How long do CT scan results take in Bangkok?", a: "Results are typically available within 2–4 hours for a straightforward CT. More complex scans (coronary CTA, full-body) may take 24 hours for a complete radiologist report. All major Bangkok private hospitals provide results via an online patient portal, and English-language reports can be emailed to you after leaving Thailand." },
    ],
    relatedLinks: [
      { href: "/en/guide/mri-scan-cost-bangkok", label: "MRI scan cost in Bangkok" },
      { href: "/en/guide/blood-test-price-bangkok", label: "Blood test prices in Bangkok" },
      { href: "/en/guide/cardiac-health-checkup-bangkok", label: "Cardiac health check-up Bangkok" },
      { href: "/en/compare?category=executive", label: "Compare executive packages (includes CT)" },
    ],
  },

  "chon-buri-health-checkup": {
    title: "Chon Buri Health Check-Up Guide — Bangkok Pattaya Hospital (2026)",
    description: "Health check-up hospitals in Chon Buri province — including Bangkok Pattaya Hospital, Phyathai Sriracha, and others. Near Pattaya and Sriracha.",
    intro: "Chon Buri is a major industrial province east of Bangkok, home to Pattaya beach resort, Sriracha industrial estates, and a large expat community. The province has some of Thailand's best regional hospitals, particularly Bangkok Pattaya Hospital which serves the international community from across the Eastern Seaboard.",
    sections: [
      {
        heading: "Health check-up prices in Chon Buri",
        content: "Chon Buri prices are 15–25% lower than Bangkok:",
        list: [
          "Basic package: ฿1,500 – ฿3,000",
          "Standard package: ฿3,800 – ฿7,500",
          "Executive package A: ฿8,000 – ฿15,000",
          "Executive package B (with MRI/CT): ฿18,000 – ฿35,000",
          "Women's health: ฿5,500 – ฿12,000",
          "Senior/cardiac package: ฿12,000 – ฿28,000",
        ],
      },
      {
        heading: "Best hospitals in Chon Buri for health check-ups",
        content: "Main hospitals serving the Chon Buri / Pattaya area:",
        list: [
          "Bangkok Pattaya Hospital — largest in the area, full specialist centre, widest package range, strong international patient unit",
          "Phyathai Sriracha Hospital — excellent standard and executive packages, serves Sriracha industrial zone",
          "Pattaya Memorial Hospital — competitive mid-tier packages, central Pattaya location",
          "Bangkok Hospital Pattaya (second branch) — BDMS, very high standard, specialist care",
          "Sawang Fa Hospital — more affordable, good for basic and standard packages",
        ],
      },
    ],
    faqs: [
      { q: "Is it better to get a health check-up in Pattaya or Bangkok?", a: "For basic to comprehensive packages, Chon Buri / Pattaya offers equivalent care at 15–25% lower prices, with no commute. Bangkok is preferable for very specialised packages (cardiac MRI, complex cancer screening) where subspecialty expertise is needed. Bangkok Pattaya Hospital handles 95% of what Bumrungrad can do, at lower cost." },
    ],
    relatedLinks: [
      { href: "/en/guide/pattaya-health-checkup", label: "Pattaya health check-up guide" },
      { href: "/en/city/chon-buri", label: "Compare Chon Buri packages" },
      { href: "/en/guide/bangkok-health-checkup", label: "Bangkok health check-up guide" },
    ],
  },

  "chiang-rai-health-checkup": {
    title: "Health Check-Up in Chiang Rai — Prices, Hospitals & Packages (2026)",
    description: "Compare health check-up packages at Chiang Rai hospitals. Prices from ฿1,800 at private hospitals. Near the Golden Triangle — conveniently combined with northern Thailand travel.",
    intro: "Chiang Rai is Thailand's northernmost major city, popular with travellers exploring the Golden Triangle, Doi Tung, and the border with Myanmar and Laos. The city has several private hospitals offering competitive health check-up packages — ideal for travellers who want to combine sightseeing with a check-up at prices 20–40% lower than Chiang Mai or Bangkok.",
    sections: [
      {
        heading: "Health check-up prices in Chiang Rai",
        content: "Health check-up packages at Chiang Rai private hospitals offer good value:",
        list: [
          "Basic package (blood panel, blood pressure, urinalysis): ฿1,800 – ฿4,000",
          "Standard package (+ chest X-ray, ECG): ฿4,000 – ฿8,500",
          "Comprehensive package (+ ultrasound, hepatitis, thyroid): ฿7,500 – ฿15,000",
          "Executive package (full screening with specialist): ฿14,000 – ฿30,000",
        ],
      },
      {
        heading: "Best hospitals in Chiang Rai for health check-ups",
        content: "Chiang Rai's main private hospitals:",
        list: [
          "Chiang Rai Prachanukroh Hospital — major government hospital, lower cost, longer wait",
          "Overbrook Hospital — oldest private hospital, central location, English service available",
          "Mae Fah Luang University Hospital — newer facility, strong academic backing, modern equipment",
          "Bangkok Hospital Chiang Rai — BDMS branch, highest international standard in Chiang Rai",
        ],
      },
    ],
    faqs: [
      { q: "Is it worth getting a health check-up in Chiang Rai vs Chiang Mai?", a: "Chiang Rai is a good option if you are already visiting the area — prices are 15–25% lower than Chiang Mai and wait times are shorter. However, Chiang Mai has a broader range of packages, more JCI-accredited facilities, and better specialist coverage for complex cases." },
    ],
    relatedLinks: [
      { href: "/en/guide/chiang-mai-health-checkup", label: "Chiang Mai health check-up guide" },
      { href: "/en/city/chiang-rai", label: "Compare Chiang Rai packages" },
    ],
  },

  "ayutthaya-health-checkup": {
    title: "Health Check-Up in Ayutthaya — Prices, Hospitals & Packages (2026)",
    description: "Compare health check-up packages in Ayutthaya, Thailand's ancient capital. From ฿2,000 at private hospitals, 1 hour from Bangkok. Day trip health checkup option.",
    intro: "Ayutthaya, UNESCO World Heritage city and former Thai capital, is just 80 kilometres north of Bangkok — a 1-hour drive or 1.5-hour train ride. Its private hospitals offer good-value health check-ups for visitors exploring the historic temples, or residents who prefer shorter queues than Bangkok.",
    sections: [
      {
        heading: "Health check-up prices in Ayutthaya",
        content: "Private hospital packages in Ayutthaya:",
        list: [
          "Basic package (blood, blood pressure, urine): ฿2,000 – ฿4,500",
          "Standard package (+ ECG, chest X-ray): ฿4,500 – ฿9,000",
          "Comprehensive (+ ultrasound, hepatitis, thyroid): ฿8,000 – ฿16,000",
          "Executive: ฿15,000 – ฿28,000",
        ],
      },
      {
        heading: "Best hospitals in Ayutthaya for health check-ups",
        content: "Ayutthaya's private hospitals:",
        list: [
          "Krung Sri Hospital — largest private hospital in Ayutthaya, widest package range",
          "Ayutthaya Hospital — major government facility, cheapest option, long queues",
          "Bangkok Hospital Ayutthaya — BDMS branch, highest standard, English service",
          "Theppakorn Hospital — mid-tier private, good for standard packages",
        ],
      },
    ],
    faqs: [
      { q: "Can I combine a health check-up day trip with sightseeing in Ayutthaya?", a: "Yes — most check-up packages take 3–5 hours. Arrive at 7–8am fasting, complete the check-up by noon, then visit the temples in the afternoon. Bangkok Hospital Ayutthaya is conveniently located near the train station. Results are ready same day for most tests." },
    ],
    relatedLinks: [
      { href: "/en/guide/bangkok-health-checkup", label: "Bangkok health check-up guide" },
      { href: "/en/city/ayutthaya", label: "Compare Ayutthaya packages" },
    ],
  },

  "nakhon-si-thammarat-health-checkup": {
    title: "Health Check-Up in Nakhon Si Thammarat — Prices & Hospitals (2026)",
    description: "Compare health check-up packages at hospitals in Nakhon Si Thammarat. Southern Thailand's largest inland city. Packages from ฿2,200 at private hospitals.",
    intro: "Nakhon Si Thammarat (NST) is the largest and oldest city in southern Thailand, a regional hub with a strong healthcare infrastructure serving residents from across the southern provinces. Private hospitals in NST offer comprehensive health check-ups at some of the most competitive prices in the country — without Bangkok waiting times.",
    sections: [
      {
        heading: "Health check-up prices in Nakhon Si Thammarat",
        content: "Health check-up packages in NST private hospitals:",
        list: [
          "Basic package: ฿2,200 – ฿5,000",
          "Standard package (+ ECG, X-ray): ฿5,000 – ฿10,000",
          "Comprehensive package (+ ultrasound, cancer markers): ฿8,000 – ฿18,000",
          "Executive: ฿16,000 – ฿35,000",
        ],
      },
      {
        heading: "Best hospitals in Nakhon Si Thammarat",
        content: "Main hospital options in NST:",
        list: [
          "Bangkok Hospital Nakhon Si Thammarat — BDMS branch, highest standard, full package range",
          "Maharaj Nakhon Si Thammarat Hospital — major government hospital, cheaper, longer wait",
          "Nawamin Hospital — established private, mid-tier pricing",
          "Thaksin Hospital — mid-size private, standard packages, competitive pricing",
        ],
      },
    ],
    faqs: [
      { q: "Is Nakhon Si Thammarat or Hat Yai better for a health check-up?", a: "Hat Yai has more hospitals, more package options, and slightly stronger international patient services. NST is better if you are already there — prices are similar, but NST hospitals tend to have shorter wait times. Both cities have Bangkok Hospital branches of equivalent quality." },
    ],
    relatedLinks: [
      { href: "/en/guide/hat-yai-health-checkup", label: "Hat Yai health check-up guide" },
      { href: "/en/guide/phuket-health-checkup", label: "Phuket health check-up guide" },
      { href: "/en/city/nakhon-si-thammarat", label: "Compare NST packages" },
    ],
  },

  "koh-chang-health-checkup": {
    title: "Health Check-Up in Koh Chang — Prices, Hospitals & Packages (2026)",
    description: "Compare health check-up packages at hospitals in and near Koh Chang, Thailand's second-largest island. Nearest facilities in Trat. Basic packages from ฿2,500.",
    intro: "Koh Chang island itself has limited medical infrastructure — for anything beyond basic care, visitors use Trat Province on the mainland (30 minutes by ferry). Trat Hospital and Bang Phloi Hospital offer basic and standard health check-up packages for tourists. For comprehensive or executive packages, Bangkok Hospital Chanthaburi (1.5 hours away) or Bangkok Pattaya Hospital (3 hours) are better options.",
    sections: [
      {
        heading: "Health check-up options near Koh Chang",
        content: "Practical options depending on your budget and requirements:",
        list: [
          "Koh Chang International Clinic — on-island, for basic tests and consultation only",
          "Trat Hospital — government facility in Trat town, cheapest, basic check-up packages ฿2,500+",
          "Bang Phloi Hospital Trat — mid-tier private, better for annual check-ups, ฿3,000–฿8,000",
          "Bangkok Hospital Chanthaburi — 90 min drive, full executive packages from ฿15,000 (recommended for comprehensive screening)",
        ],
      },
      {
        heading: "Tips for getting a health check-up around Koh Chang",
        content: "Planning advice for island visitors:",
        list: [
          "Book the Bangkok Hospital Chanthaburi executive package in advance — it fills up weeks ahead",
          "On-island clinics are for basic blood tests or repeat medication only — not for real health check-ups",
          "The ferry to Trat mainland takes 45 minutes from Koh Chang Pier (Ban Dan Ao)",
          "Most check-up packages at Trat hospitals give same-day results for basic blood panels",
        ],
      },
    ],
    faqs: [
      { q: "Is there a hospital on Koh Chang for health check-ups?", a: "Koh Chang has international clinics for basic care and minor emergencies, but no full hospital offering comprehensive health check-up packages. For a proper annual health screening with blood tests, ECG, ultrasound, and doctor consultation, take the 45-minute ferry to Trat and visit Bang Phloi Hospital or Trat Hospital." },
    ],
    relatedLinks: [
      { href: "/en/guide/pattaya-health-checkup", label: "Pattaya health check-up guide" },
      { href: "/en/city/koh-chang", label: "Compare Koh Chang packages" },
    ],
  },

  "lampang-health-checkup": {
    title: "Health Check-Up in Lampang — Prices, Hospitals & Packages (2026)",
    description: "Compare health check-up packages at hospitals in Lampang, northern Thailand. 2 hours south of Chiang Mai. Packages from ฿2,000 at private hospitals.",
    intro: "Lampang is a charming northern city 100 km south of Chiang Mai, famous for horse-drawn carriages and traditional Lanna culture. Its private hospitals serve both residents and visitors passing through to Chiang Rai or heading south. Prices are 20–35% lower than Chiang Mai and wait times are shorter — a good option for those already in the area.",
    sections: [
      {
        heading: "Health check-up prices in Lampang",
        content: "Private hospital packages in Lampang:",
        list: [
          "Basic package (CBC, blood glucose, urine): ฿2,000 – ฿4,200",
          "Standard package (+ ECG, X-ray, kidney/liver): ฿4,200 – ฿8,500",
          "Comprehensive (+ ultrasound, thyroid, hepatitis): ฿7,500 – ฿14,000",
          "Executive: ฿13,000 – ฿25,000",
        ],
      },
      {
        heading: "Best hospitals in Lampang for health check-ups",
        content: "Main options in Lampang:",
        list: [
          "Bangkok Hospital Lampang — BDMS branch, highest standard, English service, full package range",
          "Lampang Hospital — large government hospital, cheapest prices, longer queue",
          "Muanng Lampang Hospital — established mid-tier private, reliable for standard packages",
          "Lampangkosol Hospital — smaller private, competitive for basic and standard tiers",
        ],
      },
    ],
    faqs: [
      { q: "Should I get a health check-up in Lampang or Chiang Mai?", a: "If you are already in Lampang, it is worth getting your check-up there — Bangkok Hospital Lampang offers comparable quality to Bangkok Hospital Chiang Mai at 15–25% lower prices. If you are based in Chiang Mai, the extra travel to Lampang is not usually worthwhile unless you have specific time savings." },
    ],
    relatedLinks: [
      { href: "/en/guide/chiang-mai-health-checkup", label: "Chiang Mai health check-up guide" },
      { href: "/en/city/lampang", label: "Compare Lampang packages" },
    ],
  },

  "nakhon-pathom-health-checkup": {
    title: "Health Check-Up in Nakhon Pathom — Prices, Hospitals & Packages (2026)",
    description: "Compare health check-up packages in Nakhon Pathom, 56 km west of Bangkok. Day trip option. Packages from ฿2,200 at private hospitals with shorter queues than Bangkok.",
    intro: "Nakhon Pathom is Thailand's tallest pagoda city, just 56 kilometres west of Bangkok — easily reached by train (45 min) or expressway (1 hour). Its private hospitals offer a practical alternative to Bangkok for medical tourists who want the convenience of Bangkok prices without the traffic. Queue times are significantly shorter than major Bangkok hospitals.",
    sections: [
      {
        heading: "Health check-up prices in Nakhon Pathom",
        content: "Private hospital packages in Nakhon Pathom:",
        list: [
          "Basic package: ฿2,200 – ฿4,500",
          "Standard package (+ ECG, X-ray): ฿4,500 – ฿9,000",
          "Comprehensive (+ ultrasound, cancer markers, thyroid): ฿8,500 – ฿16,000",
          "Executive: ฿15,000 – ฿30,000",
        ],
      },
      {
        heading: "Best hospitals in Nakhon Pathom",
        content: "Main hospital options:",
        list: [
          "Nakhon Pathom Hospital — government facility, cheapest but long queue",
          "Bangkok Hospital Nakhon Pathom — BDMS branch, highest standard, full package range, English service",
          "Vejthani Nakhon Pathom — mid-tier private, competitive pricing for executive packages",
          "Pinklao Nakhon Pathom Hospital — reliable for standard and basic packages",
        ],
      },
    ],
    faqs: [
      { q: "Is Nakhon Pathom worth the trip from Bangkok for a health check-up?", a: "If you want to avoid Bangkok hospital queues and can reach Nakhon Pathom easily (45-min train from Thonburi or 1-hour drive on Route 4), it is a practical option. Bangkok Hospital Nakhon Pathom has the same BDMS quality as Bangkok Hospital in the capital, at roughly similar prices — the main benefit is shorter wait times and easier parking." },
    ],
    relatedLinks: [
      { href: "/en/guide/bangkok-health-checkup", label: "Bangkok health check-up guide" },
      { href: "/en/city/nakhon-pathom", label: "Compare Nakhon Pathom packages" },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(GUIDES).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const guide = GUIDES[slug];
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.description,
    alternates: {
      canonical: `${BASE}/en/guide/${slug}`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `${BASE}/${l}/guide/${slug}`])),
    },
    openGraph: {
      title: guide.title,
      description: guide.description,
      url: `${BASE}/${locale}/guide/${slug}`,
    },
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const guide = GUIDES[slug];

  if (!guide) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-800 mb-3">Guide not found</h1>
        <Link href={`/${locale}`} className="text-blue-600 hover:underline">Back to home</Link>
      </div>
    );
  }

  const shareUrl = `${BASE}/${locale}/guide/${slug}`;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <nav className="text-sm text-slate-400 mb-6 flex items-center gap-2 flex-wrap">
        <Link href={`/${locale}`} className="hover:text-blue-600">Home</Link>
        <span>›</span>
        <Link href={`/${locale}/guide`} className="hover:text-blue-600">Guides</Link>
        <span>›</span>
        <span className="text-slate-600 truncate max-w-xs">{guide.title}</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight flex-1">{guide.title}</h1>
        <div className="shrink-0">
          <ShareButtons title={guide.title} url={shareUrl} />
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 px-5 py-4 rounded-r-xl mb-8 text-slate-700 leading-relaxed">
        {guide.intro}
      </div>

      {guide.sections.length > 2 && (
        <nav className="bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 mb-8">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">In this guide</p>
          <ol className="space-y-1.5">
            {guide.sections.map((sec, i) => (
              <li key={i}>
                <a href={`#section-${i}`} className="text-blue-600 hover:underline text-sm">
                  {i + 1}. {sec.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}

      <article className="space-y-8">
        {guide.sections.map((sec, i) => (
          <section key={i} id={`section-${i}`} className="scroll-mt-20">
            <h2 className="text-xl font-bold text-slate-800 mb-3">{sec.heading}</h2>
            {sec.content && <p className="text-slate-600 leading-relaxed mb-3">{sec.content}</p>}
            {sec.list && (
              <ul className="space-y-2">
                {sec.list.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-slate-600 text-sm leading-relaxed">
                    <span className="text-blue-500 mt-0.5 shrink-0">▸</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </article>

      {guide.faqs.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {guide.faqs.map((faq, i) => (
              <details key={i} className="bg-white border border-slate-200 rounded-xl px-5 py-4 group">
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

      <div className="mt-10 bg-blue-50 rounded-xl p-6">
        <p className="font-semibold text-slate-800 mb-1">Ready to compare prices?</p>
        <p className="text-slate-500 text-sm mb-4">Real prices scraped directly from hospital websites. No ads, no paid rankings.</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href={`/${locale}/compare?category=executive`}
            className="bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors text-center">
            Open comparison table →
          </Link>
          <Link href={`/${locale}/enquiry`}
            className="border border-blue-200 text-blue-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-50 transition-colors text-center">
            Get personalised advice
          </Link>
        </div>
      </div>

      {guide.relatedLinks.length > 0 && (
        <div className="mt-8 border-t border-slate-100 pt-6">
          <p className="text-sm font-semibold text-slate-500 mb-3">Related</p>
          <div className="flex flex-wrap gap-2">
            {guide.relatedLinks.map((link) => (
              <Link key={link.href} href={`/${locale}${link.href.replace("/en", "")}`}
                className="text-sm text-blue-600 hover:underline bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/${locale}` },
          { "@type": "ListItem", position: 2, name: "Guides", item: `${BASE}/${locale}/guide` },
          { "@type": "ListItem", position: 3, name: guide.title, item: `${BASE}/${locale}/guide/${slug}` },
        ],
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: guide.title,
        description: guide.description,
        inLanguage: "en",
        dateModified: "2026-06-28",
        datePublished: "2026-01-01",
        author: { "@type": "Organization", name: "BangkokCheckup", url: BASE },
        publisher: { "@type": "Organization", name: "BangkokCheckup", url: BASE, logo: { "@type": "ImageObject", url: `${BASE}/logo.png` } },
        mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE}/${locale}/guide/${slug}` },
      }) }} />
      {guide.faqs.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: guide.faqs.map((faq) => ({
            "@type": "Question", name: faq.q,
            acceptedAnswer: { "@type": "Answer", text: faq.a },
          })),
        }) }} />
      )}
    </div>
  );
}
