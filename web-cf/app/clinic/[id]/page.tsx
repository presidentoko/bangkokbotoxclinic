import { notFound } from "next/navigation";
import { loadMasterDb, getClinicById, makeCompositeDoctorSlug } from "@/lib/data";
import { loadPricing, summarisePackages, priceRangeTHB } from "@/lib/pricing";
import { loadPhotos } from "@/lib/photos";
import { PhotoGallery } from "@/components/PhotoGallery";
import { CATEGORY_LABELS } from "@/lib/types";
import { BreadcrumbJsonLd, ClinicJsonLd, FaqJsonLd, SpeakableJsonLd } from "@/components/JsonLd";
import { buildClinicFaqs } from "@/lib/clinic-faq";
import { BookingForm } from "@/components/BookingForm";
import { CategoryIcon } from "@/components/CategoryIcon";
import { TopicCluster } from "@/components/TopicCluster";
import { AIVerifiedBadge, SponsoredBadge, Freshness, RelativeRanking, VerifiedPartnerBadge } from "@/components/Badges";
import { sponsoredTier } from "@/lib/sponsored";
import { AdPlaceholder } from "@/components/AffiliateSlot";
import { ClaimBanner } from "@/components/ClaimBanner";
import { ViewBeacon } from "@/components/ViewBeacon";
import { FloatingContactBar } from "@/components/FloatingContactBar";
import { FaqSection } from "@/components/FaqSection";
import { RelatedExplore } from "@/components/RelatedExplore";
import { loadWikiSummary } from "@/lib/wiki";
import { StickyClinicBar } from "@/components/StickyClinicBar";
import { ClinicPriceBlock } from "@/components/ClinicPriceBlock";
import { ClinicCtaCard } from "@/components/ClinicCtaCard";
import { extractPriceEstimates } from "@/lib/priceEstimates";
import { PublishedPriceTable } from "@/components/PublishedPriceTable";
import {
  getPublishedPrices,
  getPriceSourceDomain,
  priceDataGeneratedAt,
} from "@/lib/publishedPrices";
import { applySiteFilter, getSiteConfig, getSiteUrl, resolveOwnerUrl, safeEncodeURIComponent, FOCUS_VALID } from "@/lib/site";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { hasKoPage } from "@/lib/ko-cap";

// resolveOwnerUrl 은 lib/site.ts 로 이동 — doctor/[slug] 도 동일 가드 사용.

// Below-fold components — lazy loaded into separate chunks for faster initial bundle
const TrustDonut = dynamic(
  () => import("@/components/TrustBadge").then((m) => m.TrustDonut),
  { ssr: true }
);
const MapEmbed = dynamic(
  () => import("@/components/MapEmbed").then((m) => m.MapEmbed),
  { ssr: true }
);
const RatingChart = dynamic(
  () => import("@/components/RatingChart").then((m) => m.RatingChart),
  { ssr: true }
);
const WikiSummaryCard = dynamic(
  () => import("@/components/WikiSummaryCard").then((m) => m.WikiSummaryCard),
  { ssr: true }
);
const PantipMentions = dynamic(
  () => import("@/components/PantipMentions").then((m) => m.PantipMentions),
  { ssr: true }
);

// top 500 클리닉 pre-build — Google 크롤 시 cold start 없애서 인덱싱 개선.
// 데이터는 배포(재빌드) 시에만 바뀌고 배포는 어차피 전체 prerender를 무효화
// 하므로, revalidate 기간 자체는 "핫픽스 없이 얼마나 오래 버틸까"의 의미만
// 있음 — 7일→30일로 늘려 크롤 재방문 시 불필요한 ISR write 절감 (2026-07-17 감사).
export const revalidate = 2592000;
export const dynamicParams = false;

export async function generateStaticParams() {
  const db = await (await import("@/lib/data")).loadMasterDb();
  // dynamicParams=false 와 짝 — Hobby ISR Writes 200K/월 한도를 봇이 무작위
  // id 두드릴 때마다(404도 캐시에 기록됨) 소진시키던 문제 방지
  // (bangkokfillers 2026-07-10 사고와 동일 패턴). 잘못된 id 는 라우팅
  // 단계에서 즉시 404 — ISR write 자체가 안 생김.
  //
  // 이 사이트 소관 클리닉만 prerender — doctor/[slug]와 동일 이유
  // (2026-07-17 감사: 도메인 무관 전량 프리렌더 시 ~90%가 noindex 처리될
  // 타 도메인 클리닉이라 빌드/배포/ISR write 낭비가 컸음). 범위 밖 id는
  // 이제 noindex 대신 404 — 어차피 색인 대상이 아니었고 내부링크도 이미
  // 소관 클리닉으로만 한정돼 있어(scopedClinics) 신규 유입 경로는 없음.
  const cfg = getSiteConfig();
  const scoped = applySiteFilter(db.clinics, cfg);
  return scoped.map((c) => ({ id: c.id }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  // 2026-08-29: /ko/clinic/{id} 는 상위 200곳만 존재한다(KO_PRERENDER).
  // 없는 페이지를 hreflang 으로 광고하면 구글이 가져가서 404 를 받는다.
  const { id } = await params;
  const koExists = await hasKoPage(id);
  const db = await loadMasterDb();
  const c = getClinicById(db.clinics, id);
  if (!c) return { title: "Clinic not found" };
  const cats = c.categories.map((x) => CATEGORY_LABELS[x] ?? x).join(", ");
  // "Reviews & Trust Score"는 1,846개 클리닉 페이지 전부에 동일하게 붙던
  // 문구고 "Trust Score"는 아무도 검색하지 않는 용어 — 대신 실제 검색 신호
  // (평점·리뷰수)로 대체 + 브랜드 접미사는 absolute로 꺼서 60자 내로 유지
  // (2026-07-31 감사, 실측 브랜드 포함 81자 → 잘림).
  // 2026-08-14 감사: " reviews" 단어 제거 (8자) — ★ 옆 괄호 숫자는 리뷰수로
  // 읽히므로 정보 손실 없음. (web/ 원본과 동기)
  const title = `${c.name} — ★${c.rating} (${c.total_reviews})`;
  const description = `${c.name} in ${c.district || "Bangkok"}: ★${c.rating} rating from ${c.total_reviews} Google reviews. ${cats || "Aesthetic clinic"}. See prices, photos & book a free consult.`;

  // 이 사이트 소관이 아닌 클리닉이면 (예: 덴탈 사이트에 뜬 보톡스 전용 클리닉)
  // 절대 URL로 진짜 소유 도메인을 캐노니컬로 지정 + noindex — 두 도메인 동시 색인 방지.
  const cfg = getSiteConfig();
  const inSite = applySiteFilter([c], cfg).length > 0;
  const ownerUrl = !inSite ? resolveOwnerUrl(c.categories) : null;
  const canonical = ownerUrl ? `${ownerUrl}/clinic/${c.id}` : `/clinic/${c.id}`;

  return {
    title: { absolute: title },
    description,
    ...(!inSite && { robots: { index: false, follow: true } }),
    alternates: {
      canonical,
      // hreflang — Google에게 같은 클리닉의 TH/EN/KO 다국어 변형 알림 (소관 클리닉만)
      ...(inSite && {
        languages: {
          "en-US": `/clinic/${c.id}`,
          "th-TH": `/th/clinic/${c.id}`,
          // 캡 밖 클리닉은 ko 페이지가 실재하지 않는다 — 광고하면 404 를 낳는다.
          ...(koExists && { "ko-KR": `/ko/clinic/${c.id}` }),
          "x-default": `/clinic/${c.id}`,
        },
      }),
    },
    openGraph: {
      title,
      description,
      url: `/clinic/${c.id}`,
      type: "article",
      locale: "en_US",
      images: [{
        url: `${getSiteUrl()}/api/og?title=${safeEncodeURIComponent(c.name.slice(0, 50))}&sub=${safeEncodeURIComponent(`Trust Score ${Math.round(c.trust_score)} · ★${c.rating} · ${c.district ?? "Bangkok"}`)}&count=${c.total_reviews}`,
        width: 1200,
        height: 630,
        alt: c.name,
      }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

// 로케일별 경로 접두사와 breadcrumb 루트 라벨. /ko 는 예전엔 이 컴포넌트를 그냥
// `export default ClinicPage` 로 재export 해서 lang 이 한 번도 안 넘어왔다 —
// /th 는 2026-07-31에 고쳤지만 /ko 는 그대로였다.
const LOCALE_PREFIX = { en: "", th: "/th", ko: "/ko" } as const;
const HOME_CRUMB = { en: "Home", th: "หน้าแรก", ko: "홈" } as const;

export default async function ClinicPage(
  { params, lang = "en" }: { params: Promise<{ id: string }>; lang?: "en" | "th" | "ko" }
) {
  const localePrefix = LOCALE_PREFIX[lang];
  const { id } = await params;
  const db = await loadMasterDb();
  const c = getClinicById(db.clinics, id);
  if (!c) notFound();

  // 추천 후보 풀은 항상 현재 사이트 소관 클리닉으로 한정 — 다른 도메인 클리닉을
  // similar/nearby로 내부링크해서 크롤러가 발견하는 걸 방지 (교차 도메인 중복 콘텐츠).
  const cfg = getSiteConfig();
  const scopedClinics = applySiteFilter(db.clinics, cfg);
  // 이 클리닉이 사이트 소관이어도 categories 중 일부는 이 사이트 focus 밖일 수
  // 있음(예: 보톡스+덴탈 겸업 클리닉) — /c/{cat} 링크는 focus 밖 카테고리면
  // FOCUS_VALID 체크로 404 나므로, 카테고리 칩/primaryCat 은 focus 내로 한정.
  const focusValidCats = FOCUS_VALID[cfg.focus];
  const focusCategories = focusValidCats
    ? c.categories.filter((cat) => focusValidCats.has(cat))
    : c.categories;

  const tier = await sponsoredTier(c.id);
  const trend = c.rating_trend?.trend ?? "insufficient_data";
  // EN 우선(이미 그랬음) + 출처 언어 태깅 — 예전엔 en/th를 그냥 이어붙여서
  // en 리뷰가 4개 미만이면 태그 없는 태국어 원문이 그냥 섞여 나왔음
  // (2026-07-17 감사). SampleReview 타입에 date/url 필드가 없어 상대날짜·
  // 원문링크는 추가 불가 — 데이터 없는 걸 지어내지 않음.
  const samples = [
    ...(c.sample_reviews_en ?? []).map((r) => ({ ...r, srcLang: "en" as const })),
    ...(c.sample_reviews_th ?? []).map((r) => ({ ...r, srcLang: "th" as const })),
  ].slice(0, 4);

  // Pricing — hdmall package 데이터(있는 경우)
  const pricing = await loadPricing(c.id);
  const pricingTop = pricing ? summarisePackages(pricing, 6) : [];
  const priceRange = pricing ? priceRangeTHB(pricing) : null;

  const allReviews = [...(c.sample_reviews_en ?? []), ...(c.sample_reviews_th ?? [])];
  const priceEstimates = extractPriceEstimates(allReviews);

  // 클리닉이 자기 홈페이지에 공개한 가격표(리뷰 추정치와 출처가 다르다).
  const publishedPrices = getPublishedPrices(c.id);
  const publishedPriceDomain = getPriceSourceDomain(c.id);

  // Photos — hair-project 스크랩 (헤어 사이트) / Places API (추후)
  const photos = await loadPhotos(c.id);

  // 동일 카테고리 내 trust score percentile (낮을수록 상위)
  const sameCategory = c.categories.length > 0
    ? db.clinics.filter((x) => x.categories.some((cat) => c.categories.includes(cat)))
    : db.clinics;
  const sortedTrust = sameCategory
    .map((x) => x.trust_score)
    .sort((a, b) => b - a);
  // indexOf는 동점 시 항상 첫 인덱스(0)를 반환해 동점자 전원이 "Top 1%"가 되는 버그가 있었음 —
  // 자신보다 엄격히 높은 개수 기준으로 계산해야 동점 그룹이 같은(정확한) percentile을 받음.
  const rankAbove = sortedTrust.filter((v) => v > c.trust_score).length;
  const percentile = sortedTrust.length > 0 ? Math.round((rankAbove / sortedTrust.length) * 100) : 100;
  const rankingLabel = c.categories.length > 0
    ? CATEGORY_LABELS[c.categories[0]] ?? "Bangkok"
    : "Bangkok";

  // Trust Score breakdown for donut
  const ratingPart = (c.rating / 5) * 50;
  const volumePart = Math.min(40, Math.log10(Math.max(1, c.total_reviews)) * 12);
  const lgRatio = c.scraped_review_count > 0 ? c.local_guide_count / c.scraped_review_count : 0;
  const lgPart = Math.min(10, lgRatio * 20);
  const authPart = Math.min(5, Math.log10(Math.max(1, c.avg_author_review_count)) * 2);
  const breakdown = [
    { label: "Rating", value: ratingPart, max: 50, color: "#16a34a" },
    { label: "Volume", value: volumePart, max: 40, color: "#2563eb" },
    { label: "Local Gd", value: lgPart, max: 10, color: "#7c3aed" },
    { label: "Authority", value: authPart, max: 5, color: "#0891b2" },
  ];

  // Similar clinics (sidebar — loose match: district OR category)
  const similar = scopedClinics
    .filter((other) =>
      other.id !== c.id &&
      (other.district === c.district || c.categories.some((cat) => other.categories.includes(cat)))
    )
    .sort((a, b) => b.trust_score - a.trust_score)
    .slice(0, 4);

  // Nearby clinics (main column — strict: same district AND same primary category, fallback to loose)
  const primaryCat = focusCategories[0];
  const strictNearby = primaryCat && c.district
    ? scopedClinics
        .filter((other) =>
          other.id !== c.id &&
          other.district === c.district &&
          other.categories.includes(primaryCat)
        )
        .sort((a, b) => b.trust_score - a.trust_score)
        .slice(0, 6)
    : [];
  const nearbyClinics = strictNearby.length >= 3
    ? strictNearby
    : scopedClinics
        .filter((other) =>
          other.id !== c.id &&
          (other.district === c.district || c.categories.some((cat) => other.categories.includes(cat)))
        )
        .sort((a, b) => b.trust_score - a.trust_score)
        .slice(0, 6);

  // Wiki summary (LLM 생성, 미존재 시 null — graceful degrade)
  const wikiSummary = await loadWikiSummary(c.id);

  // 크로스사이트 컨텍스트 CTA: 현재 사이트 포커스와 다른 카테고리가 있을 때 표시
  const siteFocus = cfg.focus;
  const CROSS_SITE_MAP: Partial<Record<string, { url: string; emoji: string; label: string; cta: string }>> = {
    dental: { url: "https://www.bangkokbestclinic.com/", emoji: "🦷", label: "Bangkok Best Clinic", cta: "Top dental implants & veneers →" },
    hair_transplant: { url: "https://thaifacialclinic.com/", emoji: "💇", label: "Thai Facial Clinic", cta: "Hair transplant specialists →" },
    botox: { url: "https://www.bangkokbotoxclinic.com/", emoji: "💉", label: "Bangkok Botox Clinic", cta: "Top botox & filler clinics →" },
  };
  // 현재 사이트가 커버 안 하는 카테고리 중 첫 번째 cross-site 추천
  const FOCUS_CATS: Record<string, string[]> = {
    botox: ["botox", "filler", "hifu", "facial", "laser"],
    dental: ["dental"],
    hair: ["hair_transplant"],
  };
  const myCats = FOCUS_CATS[siteFocus] ?? [];
  const crossCat = c.categories.find((cat) => !myCats.includes(cat) && CROSS_SITE_MAP[cat]);
  const crossSite = crossCat ? CROSS_SITE_MAP[crossCat] : null;
  // 현재 포커스가 없는 추천: botox 사이트 → 덴탈/헤어 둘 다 있으면 하나씩
  const suggestOtherSites = siteFocus !== "all" && !crossSite
    ? (["dental", "hair_transplant"] as const)
        .filter((cat) => !myCats.includes(cat))
        .map((cat) => CROSS_SITE_MAP[cat])
        .filter(Boolean)
        .slice(0, 1)
    : [];
  // "Compare vs #1" — 같은 primary 카테고리 최상위 클리닉 (자신이 #1이면 #2)
  const comparePeer = primaryCat
    ? scopedClinics
        .filter((other) => other.id !== c.id && other.categories.includes(primaryCat))
        .sort((a, b) => b.trust_score - a.trust_score)[0]
    : null;

  // AEO: 자동 FAQ — Google PAA 대응 + LLM 인용
  const faqs = buildClinicFaqs(c as Parameters<typeof buildClinicFaqs>[0]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <ViewBeacon clinicId={c.id} />
      <StickyClinicBar
        clinicName={c.name}
        phone={c.phone || undefined}
      />
      <FloatingContactBar clinicId={c.id} clinicName={c.name} phone={c.phone} />
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        {c.district && (
          <>
            <span className="mx-2">›</span>
            <a
              href={`/d/${c.district.toLowerCase().replace(/\s+/g, "-")}`}
              className="hover:text-[var(--fg)]"
            >
              {c.district}
            </a>
          </>
        )}
        <span className="mx-2">›</span>
        <span className="text-[var(--fg)]">{c.name}</span>
      </nav>

      {tier && (
        <div className="mb-3">
          <SponsoredBadge clinicId={c.id} />
        </div>
      )}

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="min-w-0 flex-1">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-1">{c.name}</h1>
            <p className="text-[var(--muted)] flex items-center gap-2 flex-wrap">
              <span>{c.primary_type}</span>
              {c.district && (
                <>
                  <span>·</span>
                  <span className="flex items-center gap-1">📍 {c.district}</span>
                </>
              )}
              {c.business_status === "Open" && (
                <span className="flex items-center gap-1 text-green-700 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Open
                </span>
              )}
            </p>
          </div>
          <div className="text-right">
            <div className="bg-yellow-50 text-yellow-900 px-4 py-2 rounded-lg text-2xl font-bold">
              ★ {c.rating.toFixed(1)}
            </div>
            <div className="text-xs text-[var(--muted)] mt-1 tabular-nums">
              {c.total_reviews.toLocaleString()} Google reviews
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 items-center">
          {tier && <VerifiedPartnerBadge clinicId={c.id} />}
          <AIVerifiedBadge clinic={c} size="md" />
          {percentile <= 25 && (
            <RelativeRanking percentile={percentile} label={rankingLabel} />
          )}
          <Freshness generatedAt={db.generated_at} mode="detail" />
          {priceRange && (
            <span className="bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
              ฿{priceRange.min.toLocaleString()}–{priceRange.max.toLocaleString()}
              <span className="opacity-70 text-xs ml-1">· {pricing?.packages.length} packages</span>
            </span>
          )}
        </div>

        {focusCategories.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {focusCategories.map((cat) => (
              <a
                key={cat}
                href={`/c/${cat}`}
                className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm hover:bg-blue-100 inline-flex items-center gap-1.5"
              >
                <CategoryIcon category={cat} size={14} />
                {CATEGORY_LABELS[cat] ?? cat}
                {c.service_mentions[cat] ? (
                  <span className="opacity-70 text-xs">· {c.service_mentions[cat]} mentions</span>
                ) : null}
              </a>
            ))}
            {trend === "improving" && (
              <span className="bg-green-50 text-green-800 px-3 py-1 rounded-full text-sm">
                ↗ Trending up
              </span>
            )}
            {trend === "declining" && (
              <span className="bg-orange-50 text-orange-800 px-3 py-1 rounded-full text-sm">
                ↘ Quality declining
              </span>
            )}
          </div>
        )}
      </header>

      {/* Wiki AI summary — 양국어, AEO/LLM 인용 친화. header 직하 prominent. */}
      {wikiSummary && (
        <div className="mb-6">
          {/* wiki_summaries 는 th/en 두 언어만 있다(lib/wiki.ts) — ko 페이지는
              영어 요약이 올바른 폴백이라 "th"가 아니면 전부 en 으로 넘긴다. */}
          <WikiSummaryCard summary={wikiSummary} lang={lang === "th" ? "th" : "en"} />
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          {photos && photos.photos.length > 0 && (
            <PhotoGallery photos={photos.photos} clinicName={c.name} />
          )}

          {/* 클리닉 공식 가격표 — HDmall 패키지·리뷰 추정치와 출처가 다르므로
              별도 블록으로 둔다. 표라서 좁은 사이드바가 아니라 본문에 배치. */}
          <PublishedPriceTable
            items={publishedPrices}
            domain={publishedPriceDomain}
            generatedAt={priceDataGeneratedAt}
          />

          {/* Pantip — 태국 최대 커뮤니티 토픽 인용 + 외부 backlink */}
          <PantipMentions clinic={c} />

          <TrustDonut score={c.trust_score} breakdown={breakdown} />

          <RatingChart trend={c.rating_trend} />

          {c.mentioned_topics.length > 0 && (
            <TopicCluster topics={c.mentioned_topics.slice(0, 12)} />
          )}

          <MapEmbed lat={c.lat} lng={c.lng} name={c.name} height={320} />

          {pricing && pricingTop.length > 0 && (
            <section className="bg-white border border-[var(--border)] rounded-xl p-5">
              <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
                <h2 className="text-lg font-bold">Sample pricing</h2>
                <span className="text-[11px] text-[var(--muted)]">
                  via HDmall · {pricing.packages.length} packages total
                </span>
              </div>
              <ul className="divide-y divide-[var(--border)]">
                {pricingTop.map((pk) => {
                  const url = pk.url_slug ? `https://hdmall.co.th/${pk.url_slug}` : pricing.hdmall_url;
                  const discounted = pk.original_price && pk.original_price > pk.current_price;
                  return (
                    <li key={pk.sku} className="py-2.5 flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        {url ? (
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer nofollow sponsored"
                            className="text-sm leading-snug hover:underline line-clamp-2"
                          >
                            {pk.name}
                          </a>
                        ) : (
                          <span className="text-sm leading-snug line-clamp-2">{pk.name}</span>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-sm font-bold tabular-nums">฿{pk.current_price.toLocaleString()}</div>
                        {discounted && (
                          <div className="text-[10px] text-[var(--muted)] line-through tabular-nums">
                            ฿{pk.original_price!.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
              {pricing.hdmall_url && (
                <a
                  href={pricing.hdmall_url}
                  target="_blank"
                  rel="noopener noreferrer nofollow sponsored"
                  className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[var(--accent)] hover:underline"
                >
                  See all packages on HDmall →
                </a>
              )}
              <p className="mt-3 text-[11px] text-[var(--muted)] leading-relaxed">
                Prices are package list prices from HDmall. Actual cost may vary based on consultation
                — confirm with the clinic before booking. Prices in THB.
              </p>
            </section>
          )}

          {samples.length > 0 && (
            <section>
              <h2 className="text-lg font-bold mb-3">Real review excerpts</h2>
              <div className="space-y-3">
                {samples.map((r, i) => (
                  <blockquote key={i} className="border-l-4 border-[var(--accent)] bg-white px-4 py-3 rounded-r">
                    <p className="text-sm leading-relaxed">{r.text}</p>
                    <footer className="mt-2 text-xs text-[var(--muted)] flex items-center gap-2">
                      <span className="font-medium">{r.author || "Google reviewer"}</span>
                      <span>·</span>
                      <span className="text-yellow-700">★ {r.rating}</span>
                      {r.srcLang === "th" && (
                        <>
                          <span>·</span>
                          <span className="uppercase tracking-wide">Thai, untranslated</span>
                        </>
                      )}
                    </footer>
                  </blockquote>
                ))}
              </div>
            </section>
          )}

          {/* 이 클리닉에서 리뷰에 자주 언급되는 의사들. 2026-08-06 감사 전까지
              /doctor/* 로 가는 내부 링크가 사이트 전체에 0개였고 /doctors 허브도
              어디에서도 링크되지 않아, 의사 페이지 900여 개가 사이트맵에만
              존재하는 고아였다 — 구글이 "발견됨 – 색인되지 않음"으로 분류하는
              전형적 형태다. mentions 임계값은 doctor/[slug] 의 noindex 기준과
              같이 움직여야 한다(그 아래는 noindex 라 링크해도 의미 없음). */}
          {(() => {
            const linkable = (c.doctor_stats ?? [])
              .filter((d) => d.mentions >= 10)
              .sort((a, b) => b.mentions - a.mentions)
              .slice(0, 8);
            if (linkable.length === 0) return null;
            return (
              <section className="mt-10">
                <h2 className="text-lg font-bold mb-3">
                  Doctors mentioned in reviews at {c.name}
                </h2>
                <ul className="flex flex-wrap gap-2">
                  {linkable.map((d) => (
                    <li key={d.slug}>
                      <a
                        href={`${localePrefix}/doctor/${encodeURI(makeCompositeDoctorSlug(d, c))}`}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-[var(--border)] text-sm bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
                      >
                        <span className="font-medium">Dr. {d.name}</span>
                        <span className="text-[var(--muted)]">
                          ★{d.rating_avg.toFixed(1)} · {d.mentions}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })()}

          {/* AEO: FAQ 가시 섹션 + JSON-LD 짝꿍 (페이지 끝 JsonLd) */}
          <FaqSection faqs={faqs} />

          {/* SEO: 카테고리/지역 long-tail 자동 내부 백링크 */}
          <RelatedExplore clinic={c} />

          {/* Compare CTA — 같은 카테고리 최상위 클리닉과 비교 */}
          {comparePeer && (
            <a href={`/compare/${c.id}/${comparePeer.id}`} rel="nofollow"
              className="flex items-center gap-3 p-4 rounded-xl border border-[var(--border)] bg-white hover:border-[var(--accent)] transition group">
              <span className="text-2xl shrink-0">⚖️</span>
              <div className="min-w-0 flex-1">
                <div className="text-xs text-[var(--muted)] uppercase tracking-wide mb-0.5">Side-by-side comparison</div>
                <div className="font-semibold text-sm group-hover:text-[var(--accent)] transition truncate">
                  {c.name} vs {comparePeer.name}
                </div>
                <div className="text-xs text-[var(--muted)]">Trust Score · Reviews · Doctors · Languages</div>
              </div>
              <span className="text-[var(--muted)] group-hover:text-[var(--accent)] transition shrink-0">→</span>
            </a>
          )}

          {/* 크로스사이트 컨텍스트 CTA — 현재 클리닉 카테고리 기반 자매 사이트 추천 */}
          {(crossSite ?? suggestOtherSites[0]) && (() => {
            const site = (crossSite ?? suggestOtherSites[0])!;
            return (
              <a
                href={site.url}
                target="_blank"
                rel="noopener noreferrer me"
                className="flex items-center gap-3 p-4 rounded-xl border border-[var(--border)] bg-gradient-to-r from-[var(--bg)] to-white hover:border-[var(--accent)] transition group"
              >
                <span className="text-2xl shrink-0">{site.emoji}</span>
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-[var(--muted)] uppercase tracking-wide mb-0.5">Also from Thai Facial Clinic Group</div>
                  <div className="font-semibold text-sm group-hover:text-[var(--accent)] transition">{site.cta}</div>
                  <div className="text-xs text-[var(--muted)]">{site.label}</div>
                </div>
                <span className="text-[var(--muted)] group-hover:text-[var(--accent)] transition shrink-0">→</span>
              </a>
            );
          })()}

          {/* STEP 4: 인접 클리닉 cross-link — 같은 구 + 같은 카테고리, 6개 카드 */}
          {nearbyClinics.length > 0 && (
            <section className="bg-white border border-[var(--border)] rounded-xl p-5">
              <div className="flex items-baseline justify-between mb-4 flex-wrap gap-2">
                <h2 className="text-lg font-bold">
                  {primaryCat && c.district
                    ? `More ${CATEGORY_LABELS[primaryCat] ?? primaryCat} clinics in ${c.district}`
                    : c.district
                    ? `More clinics in ${c.district}`
                    : "Similar clinics"}
                </h2>
                {primaryCat && c.district && (
                  <a
                    href={`/c/${primaryCat}/${c.district.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-xs text-[var(--accent)] hover:underline font-medium"
                  >
                    See all →
                  </a>
                )}
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {nearbyClinics.map((s) => (
                  <a
                    key={s.id}
                    href={`/clinic/${s.id}`}
                    className="group flex flex-col gap-1 p-3 rounded-lg border border-[var(--border)] hover:border-[var(--accent)] transition"
                  >
                    <div className="font-medium text-sm group-hover:text-[var(--accent)] transition line-clamp-2 leading-snug">
                      {s.name}
                    </div>
                    <div className="text-xs text-[var(--muted)] flex items-center gap-2 flex-wrap">
                      {s.district && <span>{s.district}</span>}
                      <span>★ {s.rating.toFixed(1)}</span>
                      <span
                        className="font-medium"
                        style={{
                          color:
                            s.trust_score >= 75
                              ? "#16a34a"
                              : s.trust_score >= 60
                              ? "#059669"
                              : "#ca8a04",
                        }}
                      >
                        Trust {s.trust_score.toFixed(0)}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}

          <section className="grid sm:grid-cols-2 gap-3">
            <div className="bg-white border border-[var(--border)] rounded-lg p-4">
              <div className="text-xs uppercase tracking-wide text-[var(--muted)] mb-1">Address</div>
              {/* 이전엔 탭 불가능한 맨 텍스트 — 모바일에서 길찾기 누르려는 사용자가
                  쓰는 바로 그 카드인데 작동하는 링크는 사이드바 아래쪽에 따로 있었음
                  (2026-07-31 감사). */}
              {c.address ? (
                <a
                  href={c.maps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm leading-relaxed text-[var(--accent)] hover:underline"
                >
                  {c.address}
                </a>
              ) : (
                <div className="text-sm leading-relaxed">—</div>
              )}
            </div>
            <div className="bg-white border border-[var(--border)] rounded-lg p-4">
              <div className="text-xs uppercase tracking-wide text-[var(--muted)] mb-1">Phone</div>
              {c.phone ? (
                <a href={`tel:${c.phone.replace(/[^+\d]/g, "")}`} className="text-sm text-[var(--accent)] hover:underline">
                  {c.phone}
                </a>
              ) : (
                <div className="text-sm">—</div>
              )}
              {c.website && (
                <>
                  <div className="text-xs uppercase tracking-wide text-[var(--muted)] mb-1 mt-3">Website</div>
                  <a
                    href={c.website}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="text-sm text-[var(--accent)] hover:underline truncate block"
                  >
                    {c.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                  </a>
                </>
              )}
              {c.website_email && (
                <>
                  <div className="text-xs uppercase tracking-wide text-[var(--muted)] mb-1 mt-3">Email</div>
                  <a
                    href={`mailto:${c.website_email}`}
                    className="text-sm text-[var(--accent)] hover:underline truncate block"
                  >
                    {c.website_email}
                  </a>
                </>
              )}
              {c.website_instagram && (
                <>
                  <div className="text-xs uppercase tracking-wide text-[var(--muted)] mb-1 mt-3">Social</div>
                  <div className="flex gap-3">
                    <a
                      href={c.website_instagram}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="text-sm text-[var(--accent)] hover:underline"
                    >
                      Instagram
                    </a>
                  </div>
                </>
              )}
            </div>
          </section>
        </div>

        {/* Sticky sidebar */}
        <aside className="lg:sticky lg:top-4 lg:self-start space-y-4">
          <ClinicPriceBlock
            estimates={priceEstimates}
            hdmallMin={priceRange?.min ?? null}
            hdmallMax={priceRange?.max ?? null}
          />
          <ClinicCtaCard
            clinicName={c.name}
            phone={c.phone || undefined}
          />
          {/* Hero CTA — 가장 prominent. accent gradient + 강한 contrast */}
          <div
            className="rounded-xl p-4 text-white shadow-lg"
            style={{ background: `linear-gradient(135deg, var(--accent), var(--accent))` }}
          >
            <div className="text-[10px] uppercase tracking-widest font-bold opacity-90 mb-2">
              Book consultation
            </div>
            <p className="text-[11px] mt-2 text-center opacity-90">
              Free · We confirm your slot within 24h
            </p>
          </div>

          {/* Sidebar ad slot — sticky 안에서 같이 스크롤되며 노출 길게 */}
          <AdPlaceholder variant="square" label="Sponsored" hint="Sidebar ad" />

          <BookingForm clinicId={c.id} clinicName={c.name} />

          <div className="bg-white border border-[var(--border)] rounded-xl p-4 space-y-2">
            <a
              href={c.maps_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-black text-white py-2.5 px-4 rounded-lg font-bold text-center hover:bg-gray-800 text-sm"
            >
              View photos & info on Google Maps
            </a>
            {c.phone && (
              <a
                href={`tel:${c.phone.replace(/[^+\d]/g, "")}`}
                className="block w-full bg-white border border-[var(--border)] py-2.5 px-4 rounded-lg font-bold text-center hover:border-black text-sm"
              >
                📞 Call clinic
              </a>
            )}
            {c.website && (
              <a
                href={c.website}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="block w-full bg-white border border-[var(--border)] py-2.5 px-4 rounded-lg font-bold text-center hover:border-black text-sm"
              >
                Visit website
              </a>
            )}
          </div>

          {/* Below-similar ad slot — 2nd ad position in sidebar */}
          <AdPlaceholder variant="square" label="Sponsored" hint="Below-fold sidebar" />

          {similar.length > 0 && (
            <div className="bg-white border border-[var(--border)] rounded-xl p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
                Similar clinics
              </h3>
              <div className="space-y-2">
                {similar.map((s) => (
                  <div key={s.id} className="group flex items-start justify-between gap-2">
                    <a href={`/clinic/${s.id}`} className="flex-1 min-w-0">
                      <div className="font-medium text-sm group-hover:text-[var(--accent)] truncate transition">
                        {s.name}
                      </div>
                      <div className="text-xs text-[var(--muted)] flex items-center gap-2 flex-wrap">
                        <span>{s.district}</span>
                        <span>·</span>
                        <span>★ {s.rating.toFixed(1)}</span>
                        <span>·</span>
                        <span className="font-medium" style={{
                          color: s.trust_score >= 75 ? "#16a34a" : s.trust_score >= 60 ? "#059669" : "#ca8a04"
                        }}>
                          Trust {s.trust_score.toFixed(0)}
                        </span>
                      </div>
                    </a>
                    <a
                      href={`/compare/${c.id}/${s.id}`}
                      rel="nofollow"
                      className="shrink-0 text-[10px] uppercase tracking-widest text-[var(--muted)] hover:text-[var(--accent)] border border-[var(--border)] rounded px-2 py-0.5 hover:border-[var(--accent)] transition"
                      title={`Compare ${c.name} vs ${s.name}`}
                    >
                      Compare
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* Owner lead funnel — 이미 sponsored/partner인 클리닉은 claim 유도 불필요.
          예전엔 H1보다 위, 첫 화면 최상단에 있어서 환자가 페이지 열자마자
          "이 사이트는 이 클리닉과 무관함"으로 읽혀 신뢰를 깎았음(2026-07-17 감사) —
          FAQ/RelatedExplore 다음, 페이지 최하단으로 이동. */}
      {!tier && (
        <ClaimBanner clinicId={c.id} clinicName={c.name} accent="var(--accent)" />
      )}

      {/* /th 변형은 canonical 이 /th/clinic/{id} 인데 JSON-LD 의 url·breadcrumb 은
          전부 영어 경로를 뱉고 있었다 — 같은 문서가 canonical 과 구조화 데이터에서
          서로 다른 URL 을 자기 자신이라고 주장하는 상태 (2026-08-06 감사). */}
      <ClinicJsonLd c={c} photos={photos?.photos} priceRange={priceRange ?? undefined} localePrefix={localePrefix} />
      <BreadcrumbJsonLd items={[
        { name: HOME_CRUMB[lang], url: `${localePrefix}/` },
        ...(c.district ? [{ name: c.district, url: `${localePrefix}/d/${c.district.toLowerCase().replace(/\s+/g, "-")}` }] : []),
        { name: c.name, url: `${localePrefix}/clinic/${c.id}` },
      ]} />
      {/* AEO: FAQ schema — Google PAA / LLM 인용 친화 */}
      <FaqJsonLd faqs={faqs} />
      {/* AEO: Speakable — 음성검색 (Google Assistant 등) 응답 elig */}
      <SpeakableJsonLd url={`${localePrefix}/clinic/${c.id}`} />
    </div>
  );
}
