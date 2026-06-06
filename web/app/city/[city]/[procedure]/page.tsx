import { notFound } from "next/navigation";
import { loadMasterDb } from "@/lib/data";
import { ClinicCard } from "@/components/ClinicCard";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/JsonLd";
import { applySiteFilter, getSiteConfig } from "@/lib/site";
import type { Metadata } from "next";

const CITIES: Record<string, { label: string; citySlug: string }> = {
  "bangkok":    { label: "Bangkok",    citySlug: "bangkok" },
  "pattaya":    { label: "Pattaya",    citySlug: "pattaya" },
  "phuket":     { label: "Phuket",     citySlug: "phuket" },
  "chiang-mai": { label: "Chiang Mai", citySlug: "chiang_mai" },
  "koh-samui":  { label: "Koh Samui", citySlug: "koh_samui" },
  "hua-hin":    { label: "Hua Hin",   citySlug: "hua_hin" },
};

const PROCEDURES: Record<string, { label: string; category: string; desc: string; faqs: { q: string; a: string }[] }> = {
  "implants": {
    label: "Dental Implants",
    category: "dental",
    desc: "single implants, all-on-4, all-on-6, and mini implants",
    faqs: [
      { q: "How much do dental implants cost in Thailand?", a: "Dental implant costs in Thailand range from ฿30,000–฿80,000 per tooth depending on the clinic, brand, and complexity. All-on-4 ranges from ฿200,000–฿500,000 per arch. This is typically 50–70% cheaper than the US or UK." },
      { q: "Are dental implants in Thailand safe?", a: "Thailand has internationally accredited dental clinics. Look for clinics with JCI or ISO certification and doctors trained in the US, Europe, or Japan. Trust Score on this site factors in review credibility and patient volume." },
    ],
  },
  "veneers": {
    label: "Dental Veneers",
    category: "dental",
    desc: "porcelain veneers, e.max veneers, and composite bonding",
    faqs: [
      { q: "How much do veneers cost in Thailand?", a: "Porcelain veneers in Thailand cost ฿8,000–฿20,000 per tooth. E.max veneers are ฿12,000–฿25,000. Composite veneers (non-invasive) are ฿3,000–฿8,000 per tooth. Full smile makeovers (8–10 veneers) are ฿80,000–฿200,000." },
      { q: "What is the difference between porcelain and composite veneers?", a: "Porcelain veneers are permanent, require enamel removal, and last 15–20 years. Composite veneers are reversible, require minimal prep, and last 5–7 years. Most clinics offer both; discuss your case with the dentist first." },
    ],
  },
  "whitening": {
    label: "Teeth Whitening",
    category: "dental",
    desc: "in-office whitening, Zoom whitening, and laser whitening",
    faqs: [
      { q: "How much does teeth whitening cost in Thailand?", a: "In-office whitening (Zoom or laser) costs ฿3,000–฿10,000 in Thailand. Take-home kits from a dentist are ฿1,500–฿4,000. Results last 1–3 years with proper care." },
    ],
  },
  "orthodontics": {
    label: "Orthodontics & Braces",
    category: "dental",
    desc: "metal braces, ceramic braces, Invisalign, and clear aligners",
    faqs: [
      { q: "How much does Invisalign cost in Thailand?", a: "Invisalign in Thailand costs ฿80,000–฿180,000 for full treatment, compared to $5,000–$8,000 in the US. Ceramic braces are ฿50,000–฿90,000. Metal braces are ฿25,000–฿50,000." },
    ],
  },
  "botox": {
    label: "Botox",
    category: "botox",
    desc: "botulinum toxin injections for wrinkles, jaw slimming, and brow lifting",
    faqs: [
      { q: "How much does Botox cost in Bangkok?", a: "Botox in Bangkok costs ฿150–฿400 per unit depending on the brand (Allergan, Dysport, Xeomin, Botulax). A standard forehead treatment uses 20–30 units. Clinics often price by area: ฿3,000–฿8,000 per treatment area." },
      { q: "Which Botox brand is best in Thailand?", a: "Allergan (Botox) and Dysport are FDA-approved and widely available at reputable Bangkok clinics. Korean brands (Botulax, Hutox, Nabota) are cheaper and common. Ask your clinic which brand they use before booking." },
    ],
  },
  "filler": {
    label: "Dermal Fillers",
    category: "filler",
    desc: "hyaluronic acid fillers for lips, cheeks, jawline, and under-eye",
    faqs: [
      { q: "How much do fillers cost in Bangkok?", a: "HA fillers in Bangkok cost ฿8,000–฿25,000 per syringe (1ml) depending on the brand. Juvederm and Restylane are premium options. Korean alternatives (Neuramis, Princess) are cheaper but also safe." },
    ],
  },
  "hifu": {
    label: "HIFU Skin Lifting",
    category: "hifu",
    desc: "Ultherapy, Thermage, and Ultraformer skin tightening",
    faqs: [
      { q: "How much does HIFU cost in Bangkok?", a: "HIFU treatments in Bangkok range from ฿8,000–฿40,000 per session depending on the machine (Ultherapy, Ultraformer III, Thermage FLX) and treatment area. Ultherapy full face is typically ฿25,000–฿60,000." },
    ],
  },
  "laser": {
    label: "Laser Treatments",
    category: "laser",
    desc: "Pico laser, CO2 fractional, IPL, and laser hair removal",
    faqs: [
      { q: "How much does Pico laser cost in Bangkok?", a: "Pico laser in Bangkok costs ฿3,000–฿12,000 per session. CO2 fractional is ฿8,000–฿25,000. Most skin concerns require 3–6 sessions. Package deals reduce per-session cost significantly." },
    ],
  },
  "hair-transplant": {
    label: "Hair Transplant",
    category: "hair",
    desc: "FUE, DHI, and SMP hair restoration",
    faqs: [
      { q: "How much does a hair transplant cost in Bangkok?", a: "FUE hair transplant in Bangkok costs ฿25,000–฿80,000 depending on the number of grafts (typically 1,000–3,000). DHI technique costs slightly more. This is 40–60% cheaper than equivalent clinics in the UK or US." },
    ],
  },
};

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bangkokbotoxclinic.com";

export async function generateStaticParams() {
  return Object.keys(CITIES).flatMap((city) =>
    Object.keys(PROCEDURES).map((procedure) => ({ city, procedure }))
  );
}

export async function generateMetadata(
  { params }: { params: Promise<{ city: string; procedure: string }> }
): Promise<Metadata> {
  const { city, procedure } = await params;
  const cityInfo = CITIES[city];
  const procInfo = PROCEDURES[procedure];
  if (!cityInfo || !procInfo) return { title: "Not found" };

  const title = `${procInfo.label} in ${cityInfo.label} — Best Clinics & Prices ${new Date().getFullYear()}`;
  const description = `Top ${procInfo.label.toLowerCase()} clinics in ${cityInfo.label}, Thailand. Compare prices, Trust Scores, and patient reviews. ${procInfo.desc.charAt(0).toUpperCase()}${procInfo.desc.slice(1)}.`;

  return {
    title,
    description,
    alternates: { canonical: `/city/${city}/${procedure}` },
    openGraph: {
      title,
      description,
      url: `${SITE}/city/${city}/${procedure}`,
      type: "article",
    },
  };
}

export default async function ProcedureCityPage(
  { params }: { params: Promise<{ city: string; procedure: string }> }
) {
  const { city, procedure } = await params;
  const cityInfo = CITIES[city];
  const procInfo = PROCEDURES[procedure];
  if (!cityInfo || !procInfo) notFound();

  const cfg = getSiteConfig();
  const db = await loadMasterDb();
  const focused = applySiteFilter(db.clinics, cfg);

  // Filter by city + procedure category
  const cityClinicIds = new Set(
    db.clinics
      .filter((c) => c.city_slug === cityInfo.citySlug)
      .map((c) => c.id)
  );
  const procedureClinics = focused.filter(
    (c) =>
      cityClinicIds.has(c.id) &&
      (c.categories.includes(procInfo.category) ||
        (c.service_mentions[procInfo.category] ?? 0) >= 2)
  );
  const ranked = [...procedureClinics].sort((a, b) => b.trust_score - a.trust_score);
  const topClinics = ranked.slice(0, 12);

  const faqs = procInfo.faqs;

  const breadcrumbs = [
    { name: "Home", url: `${SITE}/` },
    { name: cityInfo.label, url: `${SITE}/city/${city}` },
    { name: procInfo.label, url: `${SITE}/city/${city}/${procedure}` },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <BreadcrumbJsonLd items={breadcrumbs} />
      {faqs.length > 0 && <FaqJsonLd faqs={faqs} />}

      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <a href={`/city/${city}`} className="hover:text-[var(--fg)]">{cityInfo.label}</a>
        <span className="mx-2">›</span>
        <span>{procInfo.label}</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 text-balance">
          Best {procInfo.label} Clinics in {cityInfo.label}
        </h1>
        <p className="text-base text-[var(--muted)] leading-relaxed max-w-2xl">
          {topClinics.length} clinics offering {procInfo.desc} in {cityInfo.label}, Thailand.
          Ranked by Trust Score from real patient reviews.
        </p>
      </header>

      {topClinics.length === 0 ? (
        <div className="text-center py-16 text-[var(--muted)]">
          <p className="text-lg mb-2">No matching clinics found in {cityInfo.label}.</p>
          <a href={`/city/${city}`} className="text-blue-600 underline">
            Browse all {cityInfo.label} clinics →
          </a>
        </div>
      ) : (
        <div className="space-y-4 mb-12">
          {topClinics.map((c) => (
            <ClinicCard key={c.id} clinic={c} />
          ))}
        </div>
      )}

      {faqs.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">
            {procInfo.label} in {cityInfo.label} — FAQ
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="border border-[var(--border)] rounded-xl p-4 group" open={i === 0}>
                <summary className="font-semibold cursor-pointer list-none">
                  {faq.q}
                </summary>
                <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      <nav className="text-sm text-[var(--muted)]">
        <a href={`/city/${city}`} className="underline hover:text-[var(--fg)]">
          ← All {cityInfo.label} clinics
        </a>
      </nav>
    </div>
  );
}
