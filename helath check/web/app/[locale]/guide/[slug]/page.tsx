import type { Metadata } from "next";
import Link from "next/link";
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
      { href: "/en/guide/jci-hospitals-bangkok", label: "JCI-accredited hospitals in Bangkok" },
      { href: "/en/hospital", label: "Browse all hospitals" },
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
      { href: "/en/guide/bangkok-health-checkup", label: "Full Bangkok health check-up guide" },
      { href: "/en/hospital/samitivej", label: "Samitivej Hospital packages" },
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
        <span className="text-slate-600">Guide</span>
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
        "@type": "Article",
        headline: guide.title,
        description: guide.description,
        inLanguage: "en",
        author: { "@type": "Organization", name: "BangkokCheckup" },
        publisher: { "@type": "Organization", name: "BangkokCheckup", url: BASE },
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
