import type { Metadata } from "next";
import { loadMasterDb } from "@/lib/data";
import { getSiteConfig, getSiteUrl, applySiteFilter } from "@/lib/site";
import { licensedClinicCount, getClinicLicense, licenseStanding, LICENSE_SOURCE } from "@/lib/licenses";

/**
 * What a clinic must show you, and how to check it.
 *
 * The site's clinic pages now carry the Ministry of Public Health licence for
 * the clinics we could match. This is the page that explains what that means —
 * what the Sanatorium Act B.E. 2541 obliges every private clinic in Thailand to
 * display, and how to look one up yourself. Each legal statement names its
 * section; the counts come from the register collected in this repo.
 *
 * One page, written once. The site's problem in August was pages that looked
 * generated; this is the opposite kind.
 */

const SITE = getSiteUrl();
const LOOKUP = "https://hosp.hss.moph.go.th/";
const CHECKED = "30 September 2026";

export const metadata: Metadata = {
  title: { absolute: "Is this dental clinic licensed? How to check, in two minutes" },
  description:
    "Every private clinic in Thailand must display its licence number, its practitioners and its price list by law " +
    "(Sanatorium Act B.E. 2541, s.32). Here is what to look for on the wall, and how to search the Ministry of Public Health register.",
  keywords: [
    "dental clinic licence thailand",
    "is this clinic licensed bangkok",
    "สถานพยาบาล ใบอนุญาต",
    "ตรวจสอบคลินิก",
    "unlicensed clinic bangkok",
  ],
  alternates: { canonical: `${SITE}/verify` },
  openGraph: {
    title: "Is this dental clinic licensed? How to check",
    description: "Licence number, practitioner list and price list are required by law to be on display. Plus the official lookup.",
    url: `${SITE}/verify`,
    type: "article",
  },
};

const CHECKLIST = [
  {
    title: "An 11-digit licence number on the front sign",
    section: "Ministerial regulation on clinic signage",
    body: "The sign has to carry the clinic's name, the type of facility it is licensed as, and the licence number. Those eleven digits are what you search with — the same number appears on the certificate inside and in the ministry's register.",
  },
  {
    title: "The licence certificate itself, on display inside",
    section: "s.32",
    body: "Not in a drawer, not 'with the accountant'. If nobody can show it to you, that is your answer for the day.",
  },
  {
    title: "Who the practitioners are",
    section: "s.32",
    body: "Names and details of the people licensed to practise there. Dentistry in Thailand is a regulated profession; the person treating you should be identifiable before they start.",
  },
  {
    title: "The price list — treatment, medicines, services",
    section: "s.32",
    body: "Rates for treatment, medicines and medical supplies, service fees, and patients' rights are all required to be on display. Asking what something costs before agreeing to it is not rude here; it is the thing the law was written to make possible.",
  },
];

const FAQS = [
  {
    q: "What happens to a clinic operating without a licence?",
    a: "Operating an unlicensed facility carries up to three years' imprisonment, a fine of up to 60,000 baht, or both, under the Sanatorium Act B.E. 2541. The Department of Health Service Support runs inspections and publishes the register of the clinics that are licensed.",
  },
  {
    q: "How do I check a clinic myself?",
    a: "Open hosp.hss.moph.go.th, choose search by licence number or by clinic name, and type it in. The register answers with the registered name, the address, the licence number and the date the licence runs to. The registered name is often a company name, so searching a distinctive part of the name works better than the full shopfront wording.",
  },
  {
    q: "The clinic I am looking at is not shown as licensed on this site. Is it unlicensed?",
    a: "No — and we do not say that anywhere. We match our directory to the register by Thai name and province, conservatively, and leave anything ambiguous unmatched. A clinic registered under a company name, or under a different spelling, simply will not match. Ask at the clinic, or search the official lookup.",
  },
  {
    q: "The expiry date shown has already passed. What does that mean?",
    a: "It means the licence had passed its expiry on the day we read the register, which was " + CHECKED + ". Licences are renewed, and a renewal after that date would not show here. Treat it as a question to ask, not a verdict.",
  },
];

export default async function VerifyPage() {
  const db = await loadMasterDb();
  const cfg = getSiteConfig();
  const scoped = applySiteFilter(db.clinics, cfg);
  const withLicence = scoped.filter((c) => getClinicLicense(c.id));
  const expired = withLicence.filter((c) => {
    const lic = getClinicLicense(c.id);
    return lic ? licenseStanding(lic) === "expired_at_check" : false;
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Is this dental clinic licensed? How to check",
        url: `${SITE}/verify`,
        inLanguage: "en",
        author: { "@type": "Organization", name: "BangkokBestClinic" },
        citation: [LOOKUP],
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <h1 className="text-3xl font-black mb-3">Is this clinic licensed?</h1>
      <p className="text-[var(--muted)] leading-relaxed mb-8">
        Thai law does not leave this to trust. Every private clinic must display its licence, who practises there, and
        what things cost — and the Ministry of Public Health publishes a register anyone can search. Here is what to look
        for, and how to check.
      </p>

      <section className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-8">
        <h2 className="text-lg font-bold text-emerald-900 mb-4">Four things that must be on the wall</h2>
        <ol className="space-y-4">
          {CHECKLIST.map((c, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold grid place-items-center mt-0.5">
                {i + 1}
              </span>
              <div>
                <p className="font-semibold">
                  {c.title} <span className="font-normal text-emerald-700 text-sm">({c.section})</span>
                </p>
                <p className="text-sm text-[var(--muted)] leading-relaxed">{c.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-white border border-[var(--border)] rounded-xl p-5 mb-8">
        <h2 className="text-lg font-bold mb-2">What we checked, and what we did not</h2>
        <p className="text-sm text-[var(--muted)] leading-relaxed">
          We searched the ministry's register for every clinic on this site whose name carries Thai script, and matched a
          record only where the name and the province both agree and the result is unambiguous. That gives{" "}
          <strong>{withLicence.length.toLocaleString()}</strong> of the{" "}
          <strong>{scoped.length.toLocaleString()}</strong> clinics listed here a licence number and an expiry date on
          their page{expired.length > 0 && <>, of which {expired.length} had passed their expiry date when we read the register</>}.
          {" "}
          Across the whole register we matched {licensedClinicCount().toLocaleString()} facilities.
        </p>
        <p className="text-sm text-[var(--muted)] leading-relaxed mt-3">
          A clinic without a licence box on its page here is <strong>not</strong> an unlicensed clinic. Registered names
          are frequently company names, and the matcher deliberately skips anything it cannot pin down. The official
          lookup is the authority, not us.
        </p>
        <a
          href={LOOKUP}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Search the official register →
        </a>
      </section>

      <section className="bg-white border border-[var(--border)] rounded-xl p-5 mb-8">
        <h2 className="text-lg font-bold mb-4">Questions</h2>
        <div className="space-y-4 divide-y divide-[var(--border)]">
          {FAQS.map((f, i) => (
            <div key={i} className={i > 0 ? "pt-4" : ""}>
              <h3 className="font-semibold mb-1">{f.q}</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <p className="text-xs text-[var(--muted)] leading-relaxed">
        Sources: Sanatorium Act B.E. 2541 (s.32 on required disclosures; penalties for unlicensed operation) ·{" "}
        <a href={LOOKUP} target="_blank" rel="noopener noreferrer" className="underline">
          {LICENSE_SOURCE.publisher}
        </a>{" "}
        register, read {LICENSE_SOURCE.retrieved}. This page summarises the law for patients; it is not legal advice.
      </p>
    </main>
  );
}
