import type { Clinic, Lang } from "@/lib/types";
import { SITE } from "@/lib/i18n";

type FaqItem = { q: string; a: string };

function fmtAddress(c: Clinic) {
  return {
    "@type": "PostalAddress",
    streetAddress: c.address || c.city,
    addressLocality: c.city,
    addressCountry: "TH",
  };
}

function fmtReviews(c: Clinic) {
  return c.reviews_sample
    .filter((r) => r.text && r.text.length >= 30)
    .slice(0, 10)
    .map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.reviewer || `Reviewer (${r.source})` },
      datePublished: r.date || undefined,
      reviewBody: r.text,
      reviewRating: r.rating
        ? { "@type": "Rating", ratingValue: r.rating, bestRating: 5 }
        : undefined,
      publisher: { "@type": "Organization", name: r.source || "google" },
    }));
}

function buildFaq(c: Clinic): FaqItem[] {
  const reddit = c.reviews_sample.find((r) => /reddit/i.test(r.source || ""));
  const naver = c.reviews_sample.find((r) => /naver/i.test(r.source || ""));
  return [
    {
      q: `Is ${c.name} safe?`,
      a: `${c.name} has a Trust Score of ${c.trust_score}/100, computed from ${c.reviews_scraped_count} scraped real-user reviews across Google, Bookimed${reddit ? ", Reddit" : ""}${naver ? ", Naver" : ""} and ${c.photos_count} verified photos. ${c.is_suspected_viral ? "However our viral-filter has flagged this listing as a suspected ad/promoted entry — investigate independently." : "Cross-source review patterns appear organic."}`,
    },
    {
      q: `What do real patients say on Reddit about ${c.name}?`,
      a: reddit
        ? `A Reddit reviewer wrote: "${reddit.text.slice(0, 240)}…"`
        : `No first-party Reddit reviews were indexed for ${c.name} at this time. Patient discussion is concentrated on Google reviews and Bookimed testimonials.`,
    },
    {
      q: `What procedures does ${c.name} offer?`,
      a: c.procedures.length
        ? `Procedures detected: ${c.procedures.join(", ")}.`
        : `Specific procedure list not yet verified. Contact via the clinic's LINE or official site for current offerings.`,
    },
    {
      q: `Where is ${c.name} located?`,
      a: `${c.address || c.city}, Thailand. View on Google Maps.`,
    },
  ];
}

export default function AeoSchema({ c, lang }: { c: Clinic; lang: Lang }) {
  const url = `${SITE.origin}/${lang}/clinic/${c.slug}/`;
  const idAnchor = `${url}#medicalbusiness`;
  const images = [c.top_photo_url, ...c.photos_sample.slice(0, 5)].filter(Boolean);

  const medicalBusiness = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    additionalType: "https://schema.org/MedicalClinic",
    "@id": idAnchor,
    url,
    name: c.name,
    image: images.length ? images : undefined,
    description:
      c.top_review_text?.slice(0, 240) ||
      `${c.name} — verified hair clinic in ${c.city}, Thailand. Trust Score ${c.trust_score}/100.`,
    address: fmtAddress(c),
    telephone: c.phone || undefined,
    sameAs: [c.website, c.website_facebook, c.website_instagram, c.bookimed_url].filter(Boolean),
    aggregateRating:
      c.rating && c.review_count
        ? {
            "@type": "AggregateRating",
            ratingValue: c.rating,
            reviewCount: c.review_count,
            bestRating: 5,
          }
        : undefined,
    review: fmtReviews(c),
    priceRange: c.bookimed_price_from || undefined,
    medicalSpecialty: ["Plastic Surgery", "Dermatology"],
    knowsAbout: c.procedures.length ? c.procedures : ["Hair Transplant", "FUE", "DHI"],
    availableService: (c.procedures.length ? c.procedures : ["Hair Transplant", "FUE", "DHI"]).map((p) => ({
      "@type": "MedicalProcedure",
      name: p,
      procedureType: "https://schema.org/SurgicalProcedure",
    })),
  };

  const faq = buildFaq(c);
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE.origin}/${lang}/` },
      { "@type": "ListItem", position: 2, name: c.city || "Clinics", item: `${SITE.origin}/${lang}/?city=${encodeURIComponent(c.city)}` },
      { "@type": "ListItem", position: 3, name: c.name, item: url },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalBusiness) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      {/* Plain-text FAQ block. LLM crawlers read raw markdown-ish HTML; ensures Q&A is in DOM (not just JSON-LD). */}
      <section
        id="faq"
        aria-label="Frequently asked"
        className="prose prose-sm prose-ink mt-12 max-w-none border-t border-ink-100 pt-8"
      >
        <h2 className="text-xl font-bold text-ink-900">Frequently asked about {c.name}</h2>
        <dl className="mt-4 space-y-5">
          {faq.map((f) => (
            <div key={f.q}>
              <dt className="font-semibold text-ink-900">{f.q}</dt>
              <dd className="mt-1 text-ink-700">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}
