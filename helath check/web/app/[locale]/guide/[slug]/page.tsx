import type { Metadata } from "next";
import Link from "next/link";

export const revalidate = 86400;

// Static guide slugs — add more as you write content
const GUIDES: Record<string, { title: string; description: string; body: string }> = {
  "bangkok-health-checkup": {
    title: "Bangkok Health Check-Up Guide for Medical Tourists",
    description: "Everything you need to know about getting a health check-up in Bangkok — costs, what's included, best hospitals, and how to book.",
    body: `
Bangkok is one of Asia's top medical tourism destinations, with internationally accredited hospitals offering comprehensive health check-up packages at prices 30–70% lower than comparable facilities in the US, UK, or Australia.

**What does a Bangkok health check-up include?**

Most packages cover a blood panel (CBC, lipid profile, liver and kidney function, thyroid), chest X-ray, abdominal ultrasound, urinalysis, ECG, and a physician consultation. Executive and comprehensive packages add more tests — see our comparison table for exact inclusions per hospital.

**How long does it take?**

Most packages complete in half a day (3–5 hours). Results are typically ready the same day or within 24 hours.

**How much does a health check-up cost in Bangkok?**

- Basic packages: ฿2,000 – ฿6,000
- Comprehensive: ฿6,000 – ฿20,000
- Executive (flagship hospitals): ฿15,000 – ฿60,000

Prices vary significantly by hospital tier and what's included. Use our comparison table for current prices.

**Which hospitals are JCI accredited?**

JCI (Joint Commission International) is the international gold standard for hospital quality. Bangkok JCI-accredited hospitals include Bumrungrad, Bangkok Hospital, Samitivej, Vejthani, and BNH.

**Do I need to book in advance?**

Yes — popular hospitals like Bumrungrad require advance appointments for health screening. Book at least 1–2 weeks ahead for flagship hospitals.
    `.trim(),
  },
  "jci-hospitals-bangkok": {
    title: "JCI-Accredited Hospitals in Bangkok",
    description: "Full list of JCI-accredited hospitals in Bangkok offering health check-up packages.",
    body: `
JCI (Joint Commission International) accreditation means a hospital has passed rigorous international standards for patient safety and quality of care. In Bangkok, JCI-accredited hospitals include Bumrungrad International, Bangkok Hospital (BDMS), Samitivej, Vejthani, and BNH Hospital.
    `.trim(),
  },
  "what-is-included-checkup": {
    title: "What Is Included in a Health Check-Up in Bangkok?",
    description: "Detailed breakdown of tests in basic, comprehensive, and executive health check-up packages in Bangkok.",
    body: `
The exact tests in a Bangkok health check-up depend on the package type. Here is a typical breakdown:

**Basic package**
Blood count (CBC), fasting blood sugar, cholesterol, liver function, kidney function, urinalysis, chest X-ray, body weight/BMI, blood pressure.

**Comprehensive package**
Everything in basic, plus: abdominal ultrasound, thyroid (TSH), ECG, Hepatitis B/C screen, Pap smear (women), PSA (men over 40).

**Executive package**
Everything in comprehensive, plus: tumour markers (CA-125, CEA, AFP, PSA), treadmill/stress test, and often an MRI or CT scan. Doctor consultation included.
    `.trim(),
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
  const { slug } = await params;
  const guide = GUIDES[slug];
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.description,
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

  const paragraphs = guide.body.split("\n\n");

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <nav className="text-sm text-slate-400 mb-6 flex items-center gap-2">
        <Link href={`/${locale}`} className="hover:text-blue-600">Home</Link>
        <span>›</span>
        <span className="text-slate-600">Guide</span>
      </nav>

      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">{guide.title}</h1>

      <article className="prose prose-slate max-w-none">
        {paragraphs.map((para, i) => {
          if (para.startsWith("**") && para.endsWith("**")) {
            return <h2 key={i} className="text-lg font-bold text-slate-800 mt-6 mb-2">{para.replace(/\*\*/g, "")}</h2>;
          }
          if (para.startsWith("**")) {
            const [heading, ...rest] = para.split("\n");
            return (
              <div key={i}>
                <h2 className="text-lg font-bold text-slate-800 mt-6 mb-2">{heading.replace(/\*\*/g, "")}</h2>
                <p className="text-slate-600 leading-relaxed">{rest.join(" ")}</p>
              </div>
            );
          }
          return <p key={i} className="text-slate-600 leading-relaxed mb-4">{para}</p>;
        })}
      </article>

      <div className="mt-10 bg-blue-50 rounded-xl p-6">
        <p className="font-semibold text-slate-800 mb-3">Ready to compare prices?</p>
        <Link
          href={`/${locale}/compare?category=executive`}
          className="inline-block bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors"
        >
          Open comparison table →
        </Link>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: guide.title,
            description: guide.description,
            inLanguage: "en",
          }),
        }}
      />
    </div>
  );
}
