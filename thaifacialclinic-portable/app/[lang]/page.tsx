import type { Metadata } from "next";
import Link from "next/link";
import { loadClinics } from "@/lib/data";
import { SITE, SUPPORTED_LANGS } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { HOME_FAQS } from "@/lib/faq";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import FeaturedClinics from "@/components/FeaturedClinics";
import SocialProof from "@/components/SocialProof";
import LeadCaptureForm from "@/components/LeadCaptureForm";
import DirectoryClient from "@/components/DirectoryClient";
import TestimonialMarquee from "@/components/TestimonialMarquee";
import PressStrip from "@/components/PressStrip";
import CuratedCollections from "@/components/CuratedCollections";
import PhotoShowcase from "@/components/PhotoShowcase";
import ProcedureExplainer from "@/components/ProcedureExplainer";
import WhyUs from "@/components/WhyUs";
import AfterSubmitFlow from "@/components/AfterSubmitFlow";
import CostCalculator from "@/components/CostCalculator";
import CompareBar from "@/components/CompareBar";
import NewsletterSignup from "@/components/NewsletterSignup";

export const dynamic = "force-static";
// lang 이 SUPPORTED_LANGS 밖이면(예: 오타 URL이 [lang] 세그먼트에 그대로 매칭)
// on-demand 렌더를 시도하다 T[lang]/SITE.tagline[lang] undefined 접근으로 500 났음
// (2026-07-10 라이브 감사). false 로 고정해 즉시 notFound() → 정상 404.
export const dynamicParams = false;
export function generateStaticParams() {
  return SUPPORTED_LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Lang }> }): Promise<Metadata> {
  const { lang } = await params;
  const url = `${SITE.origin}/${lang}/`;
  const { total } = loadClinics();

  // 2026-08-06 감사:
  // (1) title 이 absolute 가 아니라 app/layout.tsx 의 template 이 브랜드명을 한 번
  //     더 붙였다 — /en/ 은 113자, 비영어 로케일은 "Thailand Hair Transplant
  //     Guide — Verified Thai Hair Clinics — Thailand Hair Transplant Guide" 처럼
  //     브랜드명이 두 번 나오는 92자가 됐다.
  // (2) en 을 뺀 4개 로케일(th/ko/zh/ar)이 전부 같은 영어 제목을 썼고,
  //     description 은 SITE.tagline 한 줄(th 50자, ko 31자)뿐이라 키워드도
  //     시술명도 없었다.
  // 콘텐츠 자체가 아직 영어 복제본이라 여기서 완전한 현지화까지는 못 하지만,
  // 최소한 로케일별로 구분되고 검색어를 담은 제목/설명은 낼 수 있다.
  const LOCALIZED: Partial<Record<Lang, { title: string; desc: string }>> = {
    th: {
      title: `ปลูกผมประเทศไทย — เปรียบเทียบคลินิกปลูกผม ${total} แห่ง FUE DHI`,
      desc: `เปรียบเทียบคลินิกปลูกผมในกรุงเทพฯ และทั่วไทย ${total} แห่ง จัดอันดับด้วยคะแนนความน่าเชื่อถือจากการวิเคราะห์รีวิว Google จริง ครอบคลุม FUE, DHI และ SMP`,
    },
    ko: {
      title: `태국 모발이식 — 방콕 클리닉 ${total}곳 비교 (FUE·DHI)`,
      desc: `방콕 등 태국 모발이식 클리닉 ${total}곳을 구글 실제 후기 분석 기반 신뢰도 점수로 비교. FUE, DHI, SMP 시술별 정리와 실제 환자 후기 제공.`,
    },
    zh: {
      title: `泰国植发 — 曼谷植发诊所 ${total} 家对比（FUE / DHI）`,
      desc: `对比曼谷及泰国 ${total} 家植发诊所，依据真实 Google 评价分析的可信度评分排名，涵盖 FUE、DHI 与 SMP。`,
    },
    ar: {
      title: `زراعة الشعر في تايلاند — مقارنة ${total} عيادة في بانكوك`,
      desc: `قارن ${total} عيادة لزراعة الشعر في بانكوك وتايلاند، مرتبة حسب درجة الثقة المحسوبة من تحليل تقييمات Google الحقيقية. تشمل FUE وDHI وSMP.`,
    },
  };
  const EN_TITLE = "Hair Transplant Thailand — Bangkok Clinics, FUE, DHI & Verified Reviews 2026";
  const EN_DESC = `Compare Bangkok hair transplant clinics by Trust Score from ${total} verified clinics. FUE, DHI, SMP specialists ranked by real Google review analysis. Free consultation.`;
  const title = lang === "en" ? EN_TITLE : (LOCALIZED[lang]?.title ?? EN_TITLE);
  const description = lang === "en" ? EN_DESC : (LOCALIZED[lang]?.desc ?? EN_DESC);

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(SUPPORTED_LANGS.map((l) => [l, `${SITE.origin}/${l}/`])),
        "x-default": `${SITE.origin}/en/`,
      },
    },
    openGraph: {
      title: lang === "en"
        ? "Hair Transplant Thailand — Bangkok Clinics, FUE, DHI & Verified Reviews 2026"
        : `${SITE.name} — Verified Thai Hair Clinics`,
      description: lang === "en"
        ? `Compare Bangkok hair transplant clinics by Trust Score from ${total} verified clinics. FUE, DHI, SMP specialists ranked by real Google review analysis.`
        : SITE.tagline[lang],
      url,
      images: [{ url: `${SITE.origin}/opengraph-image`, width: 1200, height: 630 }],
    },
  };
}

export default async function Page({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const { clinics, total, avg_trust, generated_at } = loadClinics();
  // Top hero photos — top-trust clinics with photos
  const heroPhotos = [...clinics]
    .filter((c) => c.top_photo_url && c.is_hair_relevant)
    .sort((a, b) => b.trust_score - a.trust_score)
    .slice(0, 6);

  // 2026-08-20 홈 페이로드 다이어트(재발 방지).
  // 클리닉 1건 3,480B 중 reviews_sample 이 1,822B(52%)다. 이걸 145건 × 7개
  // 클라이언트 컴포넌트에 그대로 넘기면서 RSC 페이로드가 710KB, 홈 HTML 이
  // 1.1MB 까지 부풀었다. reviews_sample 을 쓰는 건 TestimonialMarquee 하나뿐이고
  // 그마저 30개에서 끊으므로, 서버에서 미리 추려 그 컴포넌트에만 넘긴다.
  // 나머지는 전부 slim 배열을 받는다.
  // allowlist — 컴포넌트가 실제로 읽는 필드만. (드롭 대상: reviews_sample,
  // videos_sample, top_video_*, website_email/facebook/instagram,
  // google_maps_url, top_review_source, source_badges — 145건 × 전부 미사용)
  // address 는 DirectoryClient 의 Fuse 검색 키(weight 0.5)라 반드시 남긴다.
  const slimClinics = clinics.map((c) => ({
    id: c.id, slug: c.slug, name: c.name, city: c.city, category: c.category,
    address: c.address,
    rating: c.rating, review_count: c.review_count,
    reviews_scraped_count: c.reviews_scraped_count, trust_score: c.trust_score,
    procedures: c.procedures, languages: c.languages,
    photos_count: c.photos_count, top_photo_url: c.top_photo_url,
    photos_sample: c.photos_sample, videos_count: c.videos_count,
    top_review_text: c.top_review_text,
    bookimed_price_from: c.bookimed_price_from, bookimed_slug: c.bookimed_slug,
    bookimed_url: c.bookimed_url,
    is_hair_relevant: c.is_hair_relevant, is_partner: c.is_partner,
    is_suspected_viral: c.is_suspected_viral,
    website_line_id: c.website_line_id,
  })) as unknown as typeof clinics;

  // TestimonialMarquee 의 필터(4점 이상·60~240자·최대 30개)를 서버에서 선적용.
  // 컴포넌트 시그니처는 그대로 두고 입력만 줄여 회귀 위험을 없앤다.
  const testimonialClinics: typeof clinics = [];
  let pickedReviews = 0;
  for (const c of clinics) {
    const usable = (c.reviews_sample || []).filter(
      (r) => r.text && r.text.length >= 60 && r.text.length <= 240 && (r.rating === null || r.rating >= 4),
    );
    if (!usable.length) continue;
    const take = usable.slice(0, Math.max(0, 31 - pickedReviews));
    testimonialClinics.push({ ...c, reviews_sample: take });
    pickedReviews += take.length;
    if (pickedReviews > 30) break;
  }

  const noFouc = `(function(){try{var s=localStorage.getItem('theme');var d=s==='dark'||(!s&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark');}catch(e){}})();`;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HOME_FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.origin,
    description: SITE.tagline.en,
    knowsAbout: [
      "Hair Transplant", "FUE Hair Transplant", "DHI Hair Transplant",
      "Scalp Micropigmentation", "SMP", "PRP Hair Treatment",
      "Beard Transplant", "Eyebrow Transplant",
      "Men's Clinic Thailand", "Hair Loss Treatment Bangkok",
      "Medical Tourism Thailand",
    ],
    // 실제 보유 도시로 생성 — 하드코딩 시 데이터 없는 도시(Phuket)가 스키마에
    // 남거나 신규 도시가 누락됨 (2026-07-10 라이브 감사)
    areaServed: [...new Set(clinics.map((c) => c.city).filter(Boolean))].map((name) => ({
      "@type": "City",
      name,
    })),
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE.origin}/${lang}/#directory?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      <script dangerouslySetInnerHTML={{ __html: noFouc }} />
      <div className="mx-auto max-w-6xl px-4 pb-20">
        <Header lang={lang} />
        <main className="space-y-20 pt-4">
          <Hero lang={lang} total={total} avgTrust={avg_trust} photoClinics={heroPhotos} />
          <PressStrip />
          <WhyUs lang={lang} />
          <HowItWorks lang={lang} />
          <FeaturedClinics clinics={slimClinics} lang={lang} />
          <CostCalculator lang={lang} />
          <PhotoShowcase clinics={slimClinics} lang={lang} />
          <ProcedureExplainer lang={lang} />
          <CuratedCollections clinics={slimClinics} lang={lang} />

          <TestimonialMarquee clinics={testimonialClinics} lang={lang} />
          <LeadCaptureForm lang={lang} />
          <AfterSubmitFlow lang={lang} />
          <SocialProof clinics={slimClinics} lang={lang} />
          <section id="directory" className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <div className="eyebrow">Explore all</div>
                <h2 className="mt-1 font-display text-3xl font-bold tracking-tighter-display sm:text-4xl">
                  Browse every clinic by city
                </h2>
                <p className="mt-2 text-sm muted">Filter by city or procedure. Partners surface first. Suspected viral clinics auto-hidden.</p>
              </div>
              <span className="text-xs muted tabular-nums whitespace-nowrap">
                Updated {new Date(generated_at).toISOString().slice(0, 10)}
              </span>
            </div>
            <DirectoryClient clinics={slimClinics} lang={lang} />
          </section>
          <NewsletterSignup lang={lang} />
        </main>
        <CompareBar clinics={slimClinics} lang={lang} />
        <footer className="mt-20 border-t pt-8 text-xs muted" style={{ borderColor: "rgb(var(--border))" }}>
          <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-navy-900 text-gold-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1l3.09 6.26L22 8.27l-5 4.87 1.18 6.88L12 16.77l-6.18 3.25L7 13.14 2 8.27l6.91-1.01L12 1z"/></svg>
              </span>
              <div>
                <div className="font-display text-sm font-bold text-[rgb(var(--fg))]">Hair <span className="text-gold-600 dark:text-gold-400">by</span> Thai Facial Clinic</div>
                <div className="text-[10px] mt-0.5">Part of the <strong>Thai Facial Clinic group</strong> · Also operates botox · filler · HIFU directories</div>
              </div>
            </div>
            <div className="font-semibold sm:text-right">
              © {new Date().getFullYear()} · Independent · No clinic-paid placements without disclosure
              <div className="mt-1 flex justify-end gap-3 text-[10px]">
                <Link href="/privacy/" className="hover:text-[rgb(var(--fg))]">Privacy</Link>
                <Link href="/terms/" className="hover:text-[rgb(var(--fg))]">Terms</Link>
                <Link href="/for-clinics/" className="hover:text-[rgb(var(--fg))]">For Clinics</Link>
              </div>
              {/* 2026-08-14 감사: 언어 전환이 Header 의 <select>(JS) 뿐이라 크롤러가
                  로케일 홈으로 가는 <a> 를 한 번도 못 봤다 — /ko /th /zh /ar 가
                  사이트맵에 있으면서 내부링크 0 인 고아였던 원인. 크롤 가능한
                  링크를 여기 한 줄 둔다. */}
              <div className="mt-1.5 flex justify-end gap-2 text-[10px]">
                {SUPPORTED_LANGS.map((l) => (
                  <Link key={l} href={`/${l}/`} className="hover:text-[rgb(var(--fg))]"
                    aria-label={`Switch language to ${l.toUpperCase()}`}>{l.toUpperCase()}</Link>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
