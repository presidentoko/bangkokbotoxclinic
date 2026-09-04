import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { tFor } from "@/lib/i18n";
import { isLang, SITE, hreflangAlternates, cityLabel, localeFor, ogLocale } from "@/lib/site";
import { getAllPlaces, loadCity, findPlaceByIdFast } from "@/lib/data";
import { categoryBadgeLabel, isRelevantCategory } from "@/lib/categories";
import { TherapistMentions } from "@/components/TherapistMentions";
import { LocalBusinessJsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RatingBars, hasRatingData } from "@/components/RatingBars";
import { TagCloud } from "@/components/TagCloud";
import { PlaceCard } from "@/components/PlaceCard";
import { ProsList } from "@/components/ProsList";
import { PlaceActions } from "@/components/PlaceActions";
import { TrustScoreDetail } from "@/components/TrustScoreDetail";
import { Faq } from "@/components/Faq";
import { CorrectionForm } from "@/components/CorrectionForm";
import { RecordView } from "@/components/RecordView";
import { ShareButton } from "@/components/ShareButton";
import { ArrowRightIcon } from "@/components/Icon";
import { themeLabel, themeEmoji } from "@/lib/theme-labels";
import { districtLabel, slugifyDistrict } from "@/lib/district-labels";
import { placeSummary, priceMedian, priceRange } from "@/lib/summary";
import { relatedPlaces } from "@/lib/related";
import type { Review } from "@/lib/types";
import VerificationCheck from "@/components/VerificationCheck";

function ReviewItem({ review, anonymousLabel, readMoreLabel }: { review: Review; anonymousLabel: string; readMoreLabel: string }) {
  return (
    <div className="rounded-xl border border-border bg-bg-elev p-4">
      <div className="flex items-center gap-2.5 mb-1.5">
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-accent/15 text-accent text-xs font-bold shrink-0">
          {(review.authorName || anonymousLabel).charAt(0).toUpperCase()}
        </div>
        <span className="font-semibold text-sm">{review.authorName || anonymousLabel}</span>
        {review.rating != null && <span className="text-xs text-accent font-bold">★ {review.rating}</span>}
        <span className="text-muted text-xs">{review.relativeDate}</span>
      </div>
      {/* 2026-09-04: 긴 리뷰 접기. 700자짜리 리뷰가 통짜로 펼쳐져 "텍스트 벽"이
          되고, 모바일에서 리뷰 하나가 화면을 다 먹는다 — 검증하러 온 방문자는
          처음 몇 문장으로 톤을 읽고 다음 리뷰로 넘어가고 싶어한다.
          Faq.tsx 와 같은 zero-JS <details> 패턴. */}
      {review.text.length > 280 ? (
        <details className="group">
          <summary className="cursor-pointer list-none">
            <p className="text-sm text-muted leading-relaxed group-open:hidden">
              {review.text.slice(0, 260).trimEnd()}…{" "}
              <span className="text-accent font-semibold">{readMoreLabel}</span>
            </p>
          </summary>
          <p className="text-sm text-muted leading-relaxed">{review.text}</p>
        </details>
      ) : (
        <p className="text-sm text-muted leading-relaxed">{review.text}</p>
      )}
    </div>
  );
}

// 빌드타임에 미리 만드는 건 리뷰가 충분한 곳만. 나머지는 첫 요청 때 생성해서
// 캐시한다(아래 dynamicParams=true).
//
// 왜 (2026-08-10): 장소 5,183곳 × 언어 3개 = 15,549 페이지가 되면서 Vercel 배포가
//   Running onBuildComplete from Vercel
//   Error: Maximum call stack size exceeded
// 로 죽었다. 빌드 자체(정적 생성 15,681개)는 성공하고 그 다음 Vercel 후처리 훅이
// 라우트를 재귀 처리하다 스택을 넘겼다. 방콕은 아직 수집 중이라 그대로 두면 계속 는다.
//
// 임계값 50의 근거 — 실측 분포:
//   리뷰  10+ : 4,371곳 → 13,113 페이지
//   리뷰  50+ : 2,236곳 →  6,708 페이지   ← 채택 (현재의 43%)
//   리뷰 100+ : 1,461곳 →  4,383 페이지
// 6,708 이면 터진 지점의 절반 이하라 방콕이 더 쌓여도 여유가 있다.
//
// SEO 손실은 없다: 걸러진 롱테일도 dynamicParams 로 접근 가능하고 정상 200 을 낸다.
// ISR 쓰기 부담도 낮다 — 이 페이지엔 revalidate 가 없어서 한 번 생성되면 다음
// 배포까지 캐시되므로, 페이지당 쓰기가 1회다 (Hobby ISR Writes 한도에 안전).
const PRERENDER_MIN_REVIEWS = 50;

export function generateStaticParams() {
  return getAllPlaces()
    .filter(({ place }) => isRelevantCategory(place.primaryType) && (place.reviewCount ?? 0) >= PRERENDER_MIN_REVIEWS)
    .map(({ place }) => ({ id: place.id }));
}

// 프리렌더 목록에 없는 장소도 요청 시 생성한다. 없는 id 는 본문의 notFound()
// 로 404 를 낸다.
//
// ⚠️ 이 라우트는 [lang] 세그먼트에서 유일하게 dynamicParams=true 다. 그래서
// 여기만 "요청 시 렌더" 경로를 탄다. 상위에 Suspense 경계(loading.tsx)가 있으면
// 셸이 200 으로 먼저 flush 된 뒤 스트림 안에서 404 UI 만 그려져 soft 404 가
// 된다 — 로컬 프로덕션 빌드로 실측 확인했다(경계 있음 200 / 없음 404).
// 그래서 loading.tsx 를 [lang] 루트가 아니라 정적 세그먼트에만 둔다.
// 이 라우트 위에 loading.tsx / Suspense 를 추가하지 말 것.
// generateMetadata 에서 notFound() 를 던지는 것으론 해결되지 않는다(검증함) —
// 메타데이터도 같은 경계 안에서 해소되기 때문이다.
export const dynamicParams = true;

// Must agree with app/sitemap.ts's relevantPlaces filter: an off-topic
// place (pediatric clinic, cosmetics store, etc. -- present in the raw
// Google Places scrape but excluded from home/city listings) is excluded
// from the sitemap, so it must also 404 here rather than serve a page the
// sitemap doesn't advertise.
function findPlace(id: string) {
  const found = findPlaceByIdFast(id);
  return found && isRelevantCategory(found.place.primaryType) ? found : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}): Promise<Metadata> {
  const { lang, id } = await params;
  if (!isLang(lang)) return {};
  const found = findPlace(id);
  if (!found) return {};
  const summary = placeSummary(found.place, lang);
  // 2026-08-23: 장소 상세는 en 한 벌만 색인시킨다.
  //
  // GSC 실측: 클릭 0 / 노출 17 (3개월) 인데 "크롤 후 미색인" 17,681 이 사이트맵
  // 17,115 와 사실상 같다 — 구글이 전부 크롤한 뒤 전부 색인을 거부했다.
  // 이유를 같은 장소의 세 언어를 받아 비교해 확인했다:
  //   /th 페이지의 태국어 글자 13%, /ko 의 한글 6%,
  //   세 언어 title 완전 동일, 본문 유사도 en↔th 86% / en↔ko 85%.
  // 장소 본문의 대부분은 리뷰 인용·주소·수치라 번역되지 않는다. 즉 권위 0 인
  // 새 도메인이 거의 같은 페이지 1만 7천 개를 내밀고 있었던 셈이고, 이건
  // 자동 생성 스팸과 구분되지 않는다.
  //
  // 그래서 th/ko 장소 페이지는 noindex + canonical→en 으로 내린다. 사이트맵도
  // en 만 싣는다(app/sitemap.ts). 17,115 → 5,658 로 줄어 "중복 묶음"이 아니라
  // "고유 페이지 5,658 개"로 보이게 하는 것이 목적이다.
  // 사용자에게는 그대로 보인다 — 링크를 끊지 않고 색인만 뺀다.
  //
  // ⚠️ 되돌릴 시점: en 장소가 실제로 색인되기 시작하면, th 를 **진짜 번역**으로
  // 채운 뒤 다시 색인시킨다. 태국 현지 스파 검색은 태국어라 th 는 결국 필요하다.
  // 지금 상태(13%)로 되살리면 같은 문제가 재발한다.
  const indexable = lang === "en";
  return {
    // 2026-09-02: 평점·리뷰수를 title 에. 넷 중 이 사이트만 브랜드명만 달고
    // 있었는데 데이터에는 rating·reviewCount 가 이미 있었다. 검증 검색에서
    // 클릭을 만드는 건 사이트 이름이 아니라 "★4.8 (312)" 다.
    title: found.place.rating != null
      ? `${found.place.name} — Reviews ★${found.place.rating.toFixed(1)} (${(found.place.reviewCount ?? 0).toLocaleString()})`
      : `${found.place.name} — ${SITE.name}`,
    description:
      summary ??
      (found.place.rating != null
        ? `${found.place.name}: ★${found.place.rating.toFixed(1)} (${found.place.reviewCount} reviews). ${found.place.address}`
        : found.place.address),
    alternates: {
      canonical: `/en/place/${id}`,
      ...(indexable ? { languages: hreflangAlternates((l) => `/${l}/place/${id}`) } : {}),
    },
    ...(indexable ? {} : { robots: { index: false, follow: true } }),
    openGraph: { url: `${SITE.origin}/${lang}/place/${id}`, siteName: SITE.name, locale: ogLocale(lang), type: "website", images: [`${SITE.origin}/opengraph-image`] },
  };
}

export default async function PlacePage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;
  if (!isLang(lang)) notFound();
  const found = findPlace(id);
  if (!found) notFound();
  const { city, place } = found;
  const t = tFor(lang);
  const label = cityLabel(city);
  const badge = categoryBadgeLabel(place.primaryType, lang);
  const priceMedianValue = priceMedian(place.priceMentions);
  const priceRangeValue = priceRange(place.priceMentions);
  const summary = placeSummary(place, lang);
  const cityData = loadCity(city);
  const related = relatedPlaces(place, cityData.places);
  // 3★ 이하 중 가장 낮은 평점의 실패 텍스트 있는 리뷰 하나 (정직 신호용)
  const criticalReview = [...place.reviews]
    .filter((r) => r.rating != null && r.rating <= 3 && r.text.trim().length > 0)
    .sort((a, b) => (a.rating ?? 9) - (b.rating ?? 9) || b.text.length - a.text.length)[0];
  // 에디토리얼 풀쿼트용 베스트 한 줄: 짧고 강한 고평점 리뷰
  const pullQuote = place.reviews
    .filter((r) => r.rating != null && r.rating >= 4 && r.text.trim().length >= 60 && r.text.trim().length <= 220)
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || a.text.length - b.text.length)[0];
  const visibleReviews = place.reviews.slice(0, 10);
  const moreReviews = place.reviews.slice(10, 20);

  const faqItems = [
    place.rating != null
      ? {
          q: t.place.ratingFaqQuestion.replace("{name}", place.name),
          a: t.place.ratingFaqAnswer
            .replace("{name}", place.name)
            .replace("{rating}", place.rating.toFixed(1))
            .replace("{reviewCount}", String(place.reviewCount)),
        }
      : null,
    place.address.trim()
      ? {
          q: t.place.locationFaqQuestion.replace("{name}", place.name),
          a: t.place.locationFaqAnswer.replace("{name}", place.name).replace("{address}", place.address),
        }
      : null,
    priceMedianValue != null
      ? {
          q: t.place.priceFaqQuestion.replace("{name}", place.name),
          a: t.place.priceFaqAnswer
            .replace("{name}", place.name)
            .replace("{price}", priceMedianValue.toLocaleString(localeFor(lang))),
        }
      : null,
  ].filter((item) => item != null);

  return (
    <div className="max-w-3xl mx-auto px-4 pt-10 sm:pt-12 pb-[calc(6rem+env(safe-area-inset-bottom))] sm:pb-12">
      <LocalBusinessJsonLd place={place} lang={lang} description={summary} />
      <RecordView placeId={place.id} />
      {/* FAQPage schema is emitted once, by <Faq> further down -- this used
          to also call FaqJsonLd here with the same faqItems, emitting the
          identical FAQPage block twice on the page. */}
      {/* 2026-09-04: 상단을 홈과 같은 잎크 히어로 밴드로. 주 수요층(인스타·틱톡
          보고 온 모바일 유저)은 페이지 첫 인상으로 머무를지 결정한다 —
          균일한 회색 카드 나열 대신 홈의 디자인 언어(잎크+글로우+금밖 포인트)를 이식. */}
      <section className="relative overflow-hidden bg-ink text-on-ink -mx-4 -mt-10 sm:-mt-12 sm:mx-[calc(50%-50vw)] mb-8">
        <div className="spa-glow bg-accent w-[320px] h-[320px] -top-24 -left-24" aria-hidden="true" />
        <div className="spa-glow bg-accent-warm w-[280px] h-[280px] -bottom-24 -right-16" aria-hidden="true" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-8 sm:pb-10">
          <Breadcrumbs
            variant="ink"
            items={[
              { name: t.nav.home, href: `/${lang}` },
              { name: label, href: `/${lang}/city/${city}` },
              { name: place.name, href: `/${lang}/place/${place.id}` },
            ]}
          />
          {place.district && (
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 backdrop-blur px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-on-ink-muted mb-4">
              <span className="text-accent-warm" aria-hidden="true">✦</span>
              {districtLabel(place.district, lang)} · {label}
            </div>
          )}
          <h1 className="font-display italic font-semibold text-3xl sm:text-5xl mb-4 tracking-tight leading-[1.12] text-balance">{place.name}</h1>
          <div className="flex items-center flex-wrap gap-2 text-sm">
            {place.rating != null && (
              <span className="inline-flex items-center gap-1 rounded-full bg-accent-warm text-ink font-bold px-3.5 py-1 shadow-lg shadow-accent-warm/20">
                <span aria-hidden="true">★</span> {place.rating.toFixed(1)}
              </span>
            )}
            <span className="text-on-ink-muted">
              {place.reviewCount} {t.place.reviewCountLabel}
            </span>
            {badge && (
              <span className="rounded-full border border-white/15 bg-white/5 backdrop-blur px-3 py-1 text-on-ink-muted font-medium">{badge}</span>
            )}
        {/* 2026-09-04: 가격을 첫 화면에. 리뷰에서 추출한 실측 가격(priceMentions)이
            1,437곳에 있는데 페이지 중반 가격 문단에만 있었다 — 검증 방문자의 3대
            질문은 "진짜 좋아? 얼마야? 어디야?"다. 상세 범위는 아래 문단이 계속 담당. */}
            {priceMedianValue != null && (
              <span className="rounded-full border border-accent-warm/40 bg-white/5 text-accent-warm font-semibold px-3 py-1">
                ฿{priceMedianValue.toLocaleString(localeFor(lang))}
                {priceRangeValue && priceRangeValue.min !== priceRangeValue.max ? "~" : ""}
              </span>
            )}
          </div>
        </div>
      </section>

      <TrustScoreDetail place={place} lang={lang} />

      {/* 2026-09-04: Chillanel Check — 구글과의 차별점. 별점 재배열이 아니라
          리뷰 원문 마이닝(바가지·팁강요·강매·위생·불친절) + 최근 추세 +
          지역 내 순위 + 지역 시세 비교 — 전부 빌드타임 계산. */}
      <VerificationCheck place={place} cityPlaces={cityData.places} lang={lang} />

      <PlaceActions placeId={place.id} t={t.place} />

      {summary && <p className="text-muted leading-relaxed mb-6 max-w-2xl">{summary}</p>}

      {place.moodKeywords.length > 0 && (
        <>
          <h2 className="text-xs uppercase tracking-wide text-muted font-semibold mb-2">{t.place.prosTitle}</h2>
          <ProsList items={place.moodKeywords} lang={lang} />
        </>
      )}

      {/* 데이터 블록 사이의 호흡 조절용 풀쿼트 — 홈의 세리프 리듬을 본문에도. */}
      {pullQuote && (
        <figure className="relative my-10 sm:my-12">
          <span className="absolute -top-8 -left-1 text-7xl font-display italic text-accent/15 select-none leading-none" aria-hidden="true">“</span>
          <blockquote className="relative font-display italic text-xl sm:text-2xl leading-relaxed pl-6 sm:pl-8 text-balance">
            {pullQuote.text.trim()}
          </blockquote>
          <figcaption className="pl-6 sm:pl-8 mt-3 text-xs text-muted">
            — {pullQuote.authorName || t.place.anonymousReviewer} · ★{pullQuote.rating} · {pullQuote.relativeDate}
          </figcaption>
        </figure>
      )}

      <div className="rounded-2xl border border-border bg-bg-elev p-5 mb-8">
        {place.address.trim() && (
          <>
            <div className="text-xs uppercase tracking-wide text-muted mb-1">{t.place.addressLabel}</div>
            <div className="mb-4">{place.address}</div>
          </>
        )}
        <div className="flex flex-wrap gap-2.5">
          {place.mapsUrl && (
            <a
              href={place.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-accent-warm text-ink font-semibold px-5 py-2.5 min-h-11 shadow-md shadow-accent-warm/20 hover:shadow-lg hover:shadow-accent-warm/30 hover:-translate-y-0.5 transition"
            >
              {t.place.viewOnMaps} <ArrowRightIcon className="w-4 h-4" />
            </a>
          )}
          {place.phone && (
            <a
              href={`tel:${place.phone.replace(/[^+\d]/g, "")}`}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-bg font-semibold px-5 py-2.5 min-h-11 hover:border-accent transition"
            >
              {t.place.callNow}
            </a>
          )}
          {place.website && /^https?:\/\//.test(place.website) && (
            <a
              href={place.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-bg font-semibold px-5 py-2.5 min-h-11 hover:border-accent transition"
            >
              {t.place.visitWebsite}
            </a>
          )}
          <ShareButton lang={lang} url={`${SITE.origin}/${lang}/place/${place.id}`} title={place.name} />
        </div>
        {priceMedianValue != null && (
          <p className="text-sm text-muted mt-4 pt-4 border-t border-border">
            {priceRangeValue && priceRangeValue.min !== priceRangeValue.max
              ? t.place.priceRangeLabelRange
                  .replace("{min}", priceRangeValue.min.toLocaleString(localeFor(lang)))
                  .replace("{max}", priceRangeValue.max.toLocaleString(localeFor(lang)))
              : t.place.priceRangeLabel.replace("{price}", priceMedianValue.toLocaleString(localeFor(lang)))}
          </p>
        )}
        {/* generatedAt was already computed at build time (scripts/build-data.mjs)
            and used for the sitemap's lastModified, but never shown to a
            human -- a visitor deciding whether to trust this listing has no
            way to tell if it's from last week or six months ago. */}
        <p className="text-xs text-muted mt-3 pt-3 border-t border-border">
          {t.place.dataUpdatedLabel.replace(
            "{date}",
            new Date(cityData.generatedAt).toLocaleDateString(localeFor(lang), { year: "numeric", month: "long", day: "numeric" })
          )}
        </p>
      </div>

      {/* Rating breakdown / service tags / mood tags are supplementary --
          collapsed by default (same zero-JS <details> pattern as Faq.tsx)
          to cut the page's default scroll length. Reviews and therapist
          mentions stay always-visible since they're this site's core
          content, not something to bury behind a click. */}
      {hasRatingData(place.ratingDistribution) && (
        <details className="group rounded-xl border border-border bg-bg-elev p-4 mb-10">
          <summary className="cursor-pointer list-none font-bold text-lg flex items-center justify-between gap-4">
            {t.place.ratingBreakdownTitle}
            <span className="shrink-0 text-muted transition-transform group-open:rotate-45 text-lg leading-none">
              +
            </span>
          </summary>
          <div className="mt-4">
            <RatingBars distribution={place.ratingDistribution} />
          </div>
        </details>
      )}

      <section className="mb-10">
        <h2 className="font-display italic text-2xl sm:text-3xl mb-4">🙋 {t.place.therapistMentionsTitle}</h2>
        <TherapistMentions mentions={place.therapistMentions} lang={lang} />
      </section>

      {place.serviceThemes.length > 0 && (
        <details className="group rounded-xl border border-border bg-bg-elev p-4 mb-10">
          <summary className="cursor-pointer list-none font-bold text-lg flex items-center justify-between gap-4">
            {t.place.serviceThemesTitle}
            <span className="shrink-0 text-muted transition-transform group-open:rotate-45 text-lg leading-none">
              +
            </span>
          </summary>
          <div className="flex flex-wrap gap-2 mt-4">
            {place.serviceThemes.map((theme) => (
              <span
                key={theme.label}
                className="rounded-full border border-accent-warm/30 bg-accent-warm/10 px-3 py-1.5 text-sm text-accent-warm font-medium"
              >
                {themeEmoji(theme.label) && <span aria-hidden="true">{themeEmoji(theme.label)} </span>}
                {themeLabel(theme.label, lang)} <span className="font-semibold">{theme.count}</span>
              </span>
            ))}
          </div>
        </details>
      )}

      {place.moodKeywords.length > 0 && (
        <details className="group rounded-xl border border-border bg-bg-elev p-4 mb-10">
          <summary className="cursor-pointer list-none font-bold text-lg flex items-center justify-between gap-4">
            {t.place.moodKeywordsTitle}
            <span className="shrink-0 text-muted transition-transform group-open:rotate-45 text-lg leading-none">
              +
            </span>
          </summary>
          <div className="mt-4">
            <TagCloud items={place.moodKeywords} lang={lang} />
          </div>
        </details>
      )}

      <section id="reviews" className="scroll-mt-4">
        <h2 className="font-display italic text-2xl sm:text-3xl mb-4">💬 {t.place.reviewsTitle}</h2>
        {/* 2026-09-04: 가장 비판적인 리뷰를 숨기지 않고 먼저 보여준다.
            칭찬 일색 페이지는 광고처럼 읽힌다 — 검증 사이트의 신뢰는 "나쁜 것도
            보여주는가"에서 나온다. 낮은 평점 리뷰가 아예 없으면 그 사실 자체를
            한 줄로 명시한다(그것도 정보다). */}
        {criticalReview ? (
          <div className="rounded-xl border-l-4 border-l-amber-500 rounded-l-none bg-bg-elev mb-4">
            <div className="px-4 pt-3 text-xs uppercase tracking-wide text-muted font-semibold">
              ⚖️ {t.place.mostCriticalTitle}
            </div>
            <ReviewItem review={criticalReview} anonymousLabel={t.place.anonymousReviewer} readMoreLabel={t.place.readMore} />
          </div>
        ) : (
          place.reviews.length >= 5 && (
            <p className="text-xs text-muted mb-4">
              {t.place.noCriticalReviews.replace("{n}", String(place.reviews.length))}
            </p>
          )
        )}
        <div className="space-y-4">
          {visibleReviews.map((r) => (
            <ReviewItem key={r.id} review={r} anonymousLabel={t.place.anonymousReviewer} readMoreLabel={t.place.readMore} />
          ))}
        </div>
        {/* build-data.mjs stores up to 20 reviews per place, but this only
            ever rendered the first 10 -- the other half sat in the data
            unused. Same zero-JS <details> pattern as the rating
            breakdown/service themes sections above, not a client
            component, since this is just more static markup, not
            interactive state. */}
        {moreReviews.length > 0 && (
          <details className="group mt-4">
            <summary className="cursor-pointer list-none text-sm font-semibold text-accent hover:underline flex items-center gap-1">
              {t.place.showMoreReviews.replace("{n}", String(moreReviews.length))}
              <span className="text-muted transition-transform group-open:rotate-180" aria-hidden="true">
                ▾
              </span>
            </summary>
            <div className="space-y-4 mt-4">
              {moreReviews.map((r) => (
                <ReviewItem key={r.id} review={r} anonymousLabel={t.place.anonymousReviewer} readMoreLabel={t.place.readMore} />
              ))}
            </div>
          </details>
        )}
      </section>

      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display italic text-2xl sm:text-3xl mb-4">{t.place.similarPlacesTitle}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map((r) => (
              <PlaceCard key={r.id} place={r} lang={lang} />
            ))}
          </div>
        </section>
      )}

      <Faq title={t.place.faqTitle} items={faqItems} />

      <CorrectionForm placeId={place.id} placeName={place.name} lang={lang} />

      {/* 2026-09-04: 광고 문의 진입로. /advertise 폼(텔레그램 연동)은 있었는데
          푸터 링크 하나뿐이라 업주가 자기 가게 페이지를 보고도 찾을 수 없었다.
          업주가 실제로 보는 곳은 자기 place 페이지다 — 전체 페이지에 깔린다. */}
      <div className="mt-8 rounded-xl border border-dashed border-accent-warm/40 bg-accent-warm/5 p-4 text-sm">
        <span className="font-semibold">{t.place.ownerCtaTitle}</span>{" "}
        <Link href={`/${lang}/advertise`} className="text-accent font-semibold hover:underline">
          {t.place.ownerCtaLink} →
        </Link>
      </div>

      {place.district && (
        <Link
          href={`/${lang}/district/${slugifyDistrict(place.district)}`}
          className="inline-block mt-8 text-sm text-accent font-semibold hover:underline"
        >
          {t.place.viewDistrict.replace("{district}", districtLabel(place.district, lang))}
        </Link>
      )}

      {/* 2026-09-04: 고정 CTA 를 구글맵 → 페이지 내 리뷰로 바꾸었다.
          이 버튼은 화면을 항상 덮는 최우선 행동인데, 그게 "구글로 나가기"였다 —
          검증하러 온 방문자를 우리가 먼저 내보내고 있던 것. 체류시간이 0에
          수렴하는 직접 원인. 지도 링크는 위 정보 카드에 그대로 있다. */}
      {place.reviews.length > 0 && (
        <a
          href="#reviews"
          className="sm:hidden fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] left-4 right-4 z-20 flex items-center justify-center gap-2 rounded-full bg-accent-warm text-ink font-semibold px-5 py-3.5 shadow-xl shadow-accent-warm/30 active:scale-[0.98] transition-transform"
        >
          💬 {t.place.stickyReviewsCta.replace("{n}", String(place.reviews.length))}
        </a>
      )}
    </div>
  );
}
