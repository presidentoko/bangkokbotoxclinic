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

function buildFaq(c: Clinic): FaqItem[] {
  const reddit = c.reviews_sample.find((r) => /reddit/i.test(r.source || ""));
  const naver = c.reviews_sample.find((r) => /naver/i.test(r.source || ""));
  // 2026-08-06 감사에서 이 FAQ 세트가 통째로 문제로 잡혔다:
  //  - "안전한가?" 라는 의료 질문에 자체 지표(Trust Score)와 "검증된 사진 0장"
  //    으로 답하고 있었다.
  //  - "레딧에서 뭐라고 하나?" 는 데이터가 없는 클리닉이 대부분인데도 무조건
  //    질문을 만들어놓고 "색인된 레딧 후기가 없습니다" 라고 답했다. 답이
  //    없다고 답하는 Q&A 를 FAQPage 스키마로 내보내는 건 구조화 데이터 품질
  //    위반에 가깝고, 답변 엔진이 인용할 가능성이 가장 높은 표면이라 더 나쁘다.
  //  - 주소 끝에 "Thailand, Thailand" 가 중복으로 붙고 앞에 개행이 남아 있었다.
  // → 데이터가 있을 때만 그 질문을 만들고, 답에는 실제 정보를 담는다.
  const faqs: { q: string; a: string }[] = [];

  const addr = (c.address || "").replace(/\s+/g, " ").trim().replace(/,?\s*Thailand\s*$/i, "");

  faqs.push({
    q: `Is ${c.name} a legitimate clinic?`,
    a: c.is_suspected_viral
      ? `Our viral-filter flagged this listing as a suspected promoted/ad entry — verify independently before booking. Check the clinic's Thai medical facility licence number and ask to see the surgeon's registration.`
      : `${c.name} has ${c.reviews_scraped_count} reviews analysed across Google and Bookimed, and the cross-source review pattern looks organic (no burst of short same-day reviews). Before booking, ask for the clinic's Thai medical facility licence number and the operating surgeon's registration — every licensed clinic in Thailand can provide both.`,
  });

  if (c.procedures.length) {
    faqs.push({
      q: `What hair transplant procedures does ${c.name} offer?`,
      a: `${c.name} offers ${c.procedures.join(", ")}. Ask which technique the surgeon recommends for your specific hairline and donor density — FUE and DHI differ in graft handling and price per graft, not just in name.`,
    });
  }

  // 레딧 인용은 실제 인용문이 있을 때만. 없으면 질문 자체를 만들지 않는다.
  if (reddit?.text) {
    faqs.push({
      q: `What do patients say on Reddit about ${c.name}?`,
      a: `A Reddit reviewer wrote: "${reddit.text.slice(0, 240)}…"`,
    });
  }
  if (naver?.text) {
    faqs.push({
      q: `What do Korean patients say about ${c.name}?`,
      a: `A Naver reviewer wrote: "${naver.text.slice(0, 240)}…"`,
    });
  }

  if (addr) {
    faqs.push({
      q: `Where is ${c.name} located?`,
      a: `${addr}, Thailand${c.city && !addr.includes(c.city) ? ` (${c.city})` : ""}. Most Bangkok hair clinics cluster around Sukhumvit and Phrom Phong — confirm the exact branch when booking, since several operate more than one location.`,
    });
  }

  return faqs;
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
    // NOTE: 이전엔 Google/Reddit/Naver 등 제3자 리뷰를 schema.org Review로 마크업했으나
    // Google 리치결과 정책상 자사 사이트에서 직접 수집한 리뷰만 허용돼서 제거함.
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

  // BreadcrumbList 는 여기서 내보내지 않는다. 클리닉 페이지
  // (app/[lang]/clinic/[slug]/page.tsx)가 이미 하나를 내보내고 있어서 한 문서에
  // BreadcrumbList 가 두 개 실렸고, 심지어 position 2 가 서로 달랐다 —
  // 페이지 쪽은 /{lang}/city/{slug}/ (실제 존재하는 라우트), 여기 있던 건
  // /{lang}/?city=... (쿼리스트링, 그런 페이지 없음). 구글에 같은 문서의
  // 상위 경로를 두 가지로 동시에 주장하던 셈이라 실재하는 쪽만 남긴다
  // (2026-08-06 감사).

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
