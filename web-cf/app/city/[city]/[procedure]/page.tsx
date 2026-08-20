import { notFound } from "next/navigation";
import { loadMasterDb } from "@/lib/data";
import { ClinicCard } from "@/components/ClinicCard";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/JsonLd";
import { applySiteFilter, getSiteConfig, getSiteUrl, FOCUS_VALID } from "@/lib/site";
import { findGuide, guidesForFocus } from "@/lib/guides";
import type { Metadata } from "next";

// citySlug 은 master_db.json 의 clinic.city_slug 실제 값과 정확히 일치해야
// 함(하이픈, 언더스코어 아님) — 안 맞으면 filter 가 0건 매치라 빈 페이지가
// 색인됨 (2026-07-17 감사: chiang_mai/koh_samui/hua_hin 이 실제론 하이픈).
const CITIES: Record<string, { label: string; citySlug: string }> = {
  "bangkok":    { label: "Bangkok",    citySlug: "bangkok" },
  "pattaya":    { label: "Pattaya",    citySlug: "pattaya" },
  "phuket":     { label: "Phuket",     citySlug: "phuket" },
  "chiang-mai": { label: "Chiang Mai", citySlug: "chiang-mai" },
  "koh-samui":  { label: "Koh Samui", citySlug: "koh-samui" },
  "hua-hin":    { label: "Hua Hin",   citySlug: "hua-hin" },
};

const PROCEDURE_GUIDES: Record<string, string[]> = {
  implants:         ["dental-implants-bangkok-cost", "dental-implant-cost-thailand"],
  veneers:          ["veneers-bangkok-price"],
  whitening:        ["teeth-whitening-bangkok"],
  botox:            ["bangkok-botox-guide", "botox-price-bangkok-2026"],
  filler:           ["bangkok-filler-guide"],
  hifu:             ["hifu-ultherapy-bangkok-cost"],
  // PROCEDURES 의 실제 키는 "hair-transplant" — "hair" 였으면 절대 안 매치됨 (2026-07-17 감사)
  "hair-transplant": ["fue-hair-transplant-bangkok-cost", "dhi-vs-fue-bangkok"],
  rhinoplasty:      [],
  braces:           [],
  eyes:             [],
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
    // 실제 clinic.categories/service_mentions 키는 "hair_transplant"(언더스코어) —
    // "hair"였던 예전 값은 절대 안 매치돼서 이 조합이 항상 "결과 없음"만
    // 출력하는 영구 빈 페이지였음 (2026-07-31 감사).
    category: "hair_transplant",
    desc: "FUE, DHI, and SMP hair restoration",
    faqs: [
      { q: "How much does a hair transplant cost in Bangkok?", a: "FUE hair transplant in Bangkok costs ฿25,000–฿80,000 depending on the number of grafts (typically 1,000–3,000). DHI technique costs slightly more. This is 40–60% cheaper than equivalent clinics in the UK or US." },
    ],
  },
  "root-canal": {
    label: "Root Canal Treatment",
    category: "dental",
    desc: "root canal therapy, retreatment, and post-and-core restoration",
    faqs: [
      { q: "How much does a root canal cost in Thailand?", a: "Root canal treatment in Thailand costs ฿4,000–฿15,000 per tooth depending on the tooth type (front teeth are cheaper than molars) and complexity. A crown afterward adds ฿8,000–฿25,000. This is typically 60–80% cheaper than the US or UK." },
      { q: "Is root canal treatment painful?", a: "Modern root canal treatment is performed under local anesthesia and is generally no more uncomfortable than a filling. Most patients report mild soreness for 1–2 days afterward, manageable with over-the-counter pain relief." },
    ],
  },
};

const SITE = getSiteUrl();

// 봇 쓰레기 param(/d/wp-login.php 등)의 온디맨드 렌더+캐시 write 차단
// (Hobby ISR Writes 한도 누수, 2026-07-11 감사). GSP가 링크 공간 전체 커버.
export const dynamicParams = false;

export async function generateStaticParams() {
  // 예전엔 도메인 무관하게 city×procedure 전 조합(6도시×10시술=60개)을 매
  // 사이트에서 다 만들어서, 덴탈 사이트가 /city/bangkok/botox 같은 완전히
  // 무관한 시술 페이지까지 프리렌더했음 — 아무 데도 안 링크되는 고아
  // 페이지였고 내용도 이 사이트 focus 밖이라 항상 얇음 (2026-07-31 감사).
  // focus 안 카테고리 시술만 생성.
  const cfg = getSiteConfig();
  const focusValidCats = FOCUS_VALID[cfg.focus];
  const procedures = focusValidCats
    ? Object.entries(PROCEDURES).filter(([, p]) => focusValidCats.has(p.category)).map(([key]) => key)
    : Object.keys(PROCEDURES);
  return Object.keys(CITIES).flatMap((city) =>
    procedures.map((procedure) => ({ city, procedure }))
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

  // 결과 0건인 조합은 절대 색인 안 함 — "결과 없음" 페이지가 색인되면
  // 얇은 콘텐츠로 잡혀 도메인 전체 신뢰도에 영향 (2026-07-31 감사).
  const cfg = getSiteConfig();
  const db = await loadMasterDb();
  const focused = applySiteFilter(db.clinics, cfg);
  const cityClinicIds = new Set(db.clinics.filter((c) => c.city_slug === cityInfo.citySlug).map((c) => c.id));
  const count = focused.filter(
    (c) => cityClinicIds.has(c.id) &&
      (c.categories.includes(procInfo.category) || (c.service_mentions[procInfo.category] ?? 0) >= 2)
  ).length;
  const robots = count < 3 ? { index: false, follow: true } : undefined;

  return {
    title,
    description,
    ...(robots && { robots }),
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
  // 이 페이지는 city×procedure 전체 조합을 도메인 무관하게 생성하지만(기존
  // 동작, 별개 이슈), guide/[slug]는 focus 밖 가이드를 이제 prerender 안
  // 하므로(2026-07-17 감사) 그 슬러그만은 focus로 걸러야 404가 안 남.
  const focusGuideSlugs = new Set(guidesForFocus(cfg.focus).map((g) => g.slug));
  const relatedGuides = (PROCEDURE_GUIDES[procedure] ?? [])
    .filter((slug) => focusGuideSlugs.has(slug))
    .map((slug) => findGuide(slug))
    .filter(Boolean) as NonNullable<ReturnType<typeof findGuide>>[];

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

      {relatedGuides.length > 0 && (
        <section className="mb-10 p-5 bg-white border border-[var(--border)] rounded-xl">
          <h2 className="text-base font-semibold mb-3">
            {procInfo.label} guides
          </h2>
          <div className="space-y-2">
            {relatedGuides.map((g) => (
              <a
                key={g.slug}
                href={`/guide/${g.slug}`}
                className="flex items-start gap-2 text-sm text-[var(--accent)] hover:underline"
              >
                <span className="text-[var(--muted)] text-xs mt-0.5">📖</span>
                {g.title}
              </a>
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
