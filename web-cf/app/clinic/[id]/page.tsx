import { notFound, permanentRedirect } from "next/navigation";
import { LicenseCheck } from "@/components/LicenseCheck";
import { getClinicLicense } from "@/lib/licenses";
import { loadMasterDb, getClinicById, getClinicByRouteKey, isLegacyClinicKey, makeCompositeDoctorSlug } from "@/lib/data";
import { loadPricing, summarisePackages, priceRangeTHB } from "@/lib/pricing";
import { loadPhotos } from "@/lib/photos";
import { reviewExcerpt } from "@/lib/reviewExcerpt";
import { ClinicInsights } from "@/components/ClinicInsights";
import { getClinicInsights } from "@/lib/clinicInsights";
import { PhotoGallery } from "@/components/PhotoGallery";
import { CATEGORY_LABELS, CATEGORY_LABELS_TH } from "@/lib/types";
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
import { PatientReported } from "@/components/PatientReported";
import {
  getPublishedPrices,
  getPriceSourceDomain,
  priceDataGeneratedAt,
} from "@/lib/publishedPrices";
import { applySiteFilter, getSiteConfig, getSiteUrl, resolveOwnerUrl, safeEncodeURIComponent, FOCUS_VALID } from "@/lib/site";
import { groupBrands, brandKeyOf } from "@/lib/brands";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { loadDeepReviews } from "@/lib/clinicReviews";
import { loadClinicThai } from "@/lib/clinicThai";

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
const ReviewSignals = dynamic(
  () => import("@/components/ReviewSignals").then((m) => m.ReviewSignals),
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
  // Both URL shapes are prerendered: the slug the page lives at now, and the
  // Google place id it lived at until 2026-10-01, which every indexed link and
  // every backlink still points to. The legacy one renders nothing — the page
  // below redirects it permanently to the slug — but it has to be a known param
  // because `dynamicParams` is false, or those 844 indexed URLs would 404.
  return scoped.flatMap((c) => {
    const slug = c.url_slug ?? c.id;
    return slug === c.id ? [{ id: slug }] : [{ id: slug }, { id: c.id }];
  });
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  // 2026-08-29: /ko/clinic/{id} 는 상위 200곳만 존재한다(KO_PRERENDER).
  // 없는 페이지를 hreflang 으로 광고하면 구글이 가져가서 404 를 받는다.
  const { id } = await params;
  const db = await loadMasterDb();
  const c = getClinicByRouteKey(db.clinics, id);
  if (!c) return { title: "Clinic not found" };
  const cats = c.categories.map((x) => CATEGORY_LABELS[x] ?? x).join(", ");
  // "Reviews & Trust Score"는 1,846개 클리닉 페이지 전부에 동일하게 붙던
  // 문구고 "Trust Score"는 아무도 검색하지 않는 용어 — 대신 실제 검색 신호
  // (평점·리뷰수)로 대체 + 브랜드 접미사는 absolute로 꺼서 60자 내로 유지
  // (2026-07-31 감사, 실측 브랜드 포함 81자 → 잘림).
  // 2026-08-14 감사: " reviews" 단어 제거 (8자) — ★ 옆 괄호 숫자는 리뷰수로
  // 읽히므로 정보 손실 없음. (web/ 원본과 동기)
  // 2026-09-02: title 에는 정제 이름을 쓴다 — 키워드 나열·잘림이 SERP 에서
  // 스팸처럼 보이는 것을 막는다. H1·JSON-LD 는 원본 c.name 그대로.
  const dispName = c.display_name || c.name;
  // 2026-09-02: "Reviews & Prices" 추가 (web/ 과 동일). 검증 검색에서 사람들이
  // 실제로 넣는 단어는 "review" 다. th/ko 라우트는 이미 "รีวิว"·"후기" 를
  // 넣고 있었는데 영어판만 빠져 있었다.
  const title = `${dispName} — Reviews & Prices ★${c.rating} (${c.total_reviews.toLocaleString()})`;
  // 2026-09-23: 스니펫에 실제 정보를 넣는다. GSC 에서 업체명 쿼리
  // (thantakit reviews 621노출 8.7위, ic smile 569노출 4.6위)가 노출은 나는데
  // 클릭이 0이었다 — 1페이지권에서 클릭이 0이면 순위가 아니라 스니펫 문제다.
  // "See prices, photos & book a free consult" 같은 광고 문구 대신 사람이
  // 방문 전에 실제로 확인하는 값(가격대·주말/야간 진료)을 앞으로 뺀다.
  // 값이 없으면 그 조각을 통째로 뺀다 — 빈 라벨은 스팸처럼 보인다.
  //
  // 가격은 일부러 안 넣는다. 처음엔 리뷰에서 캔 금액의 범위를 넣었는데, 원문을
  // 읽어보니 한 곳당 표본이 0~1건인 데다 스케일링(฿900)·독감주사·프로모션 금액이
  // 뒤섞여 있었다. 그런 범위를 "이 치과 가격"으로 내보내는 건 거짓말이다.
  // 시술별로 분류한 가격은 도시 단위로만 말이 되고, 그건 PriceBands 가 맡는다.
  const _hours = (c as unknown as { hours?: { open_weekend?: boolean; open_evening?: boolean } }).hours;
  const _hoursBit = _hours
    ? ` ${[_hours.open_weekend ? "Open weekends" : "", _hours.open_evening ? "open late" : ""].filter(Boolean).join(", ")}.`.replace(" .", "")
    : "";
  // The licence is what this result can say that the clinic's own Google
  // listing, sitting next to it in the SERP, cannot.
  const _lic = getClinicLicense(c.id);
  const _licBit = _lic ? ` MOPH licence ${_lic.license_no}.` : "";
  // 2026-10-23: 우리 리뷰 집계에서 가장 많이 언급된 칭찬 항목 1~2개 (언급 8건+, 긍정 80%+).
  // 별점·리뷰 수는 옆 지도팩에도 있지만 이 숫자는 여기에만 있다.
  const _ins = getClinicInsights(c.id);
  const _ASPECT_EN: Record<string, string> = { painless: "little or no pain", explanation: "clear explanations", staff: "friendly staff", cleanliness: "cleanliness", value: "fair pricing", english: "English communication" };
  const _praised = _ins
    ? Object.entries(_ins.aspects)
        .map(([k, v]) => ({ k, n: v.pos + v.neg, pct: v.pos + v.neg ? Math.round((100 * v.pos) / (v.pos + v.neg)) : 0 }))
        .filter((x) => x.n >= 8 && x.pct >= 80)
        .sort((x, y) => y.n - x.n)
        .slice(0, 2)
    : [];
  const _insBit = _praised.length
    ? ` Reviewers praise ${_praised.map((x) => `${_ASPECT_EN[x.k]} (${x.pct}% of ${x.n} mentions)`).join(" and ")}.`
    : "";
  const fullDescription = `${c.name} in ${c.district || "Bangkok"}: ★${c.rating} from ${c.total_reviews} Google reviews.${_insBit}${_hoursBit}${_licBit} ${cats || "Aesthetic clinic"}.`.replace(/\s+/g, " ").trim();
  // 2026-10-25: 155자 안으로 — 실측 210자라 검색 결과에서 잘렸다.
  const description = reviewExcerpt(fullDescription, 155);

  // 이 사이트 소관이 아닌 클리닉이면 (예: 덴탈 사이트에 뜬 보톡스 전용 클리닉)
  // 절대 URL로 진짜 소유 도메인을 캐노니컬로 지정 + noindex — 두 도메인 동시 색인 방지.
  const cfg = getSiteConfig();
  const inSite = applySiteFilter([c], cfg).length > 0;
  const ownerUrl = !inSite ? resolveOwnerUrl(c.categories) : null;
  const canonical = ownerUrl ? `${ownerUrl}/clinic/${c.url_slug}` : `/clinic/${c.url_slug}`;

  return {
    title: { absolute: title },
    description,
    ...(!inSite && { robots: { index: false, follow: true } }),
    alternates: {
      canonical,
      // hreflang. The three clinic routes emitted no <link rel="alternate">
      // at all — verified on the live EN, TH and KO pages — while the hub
      // routes (/th, /th/c, /th/d, /ko) have always had it. So the gap was the
      // venue tree, which is the whole of the site's search traffic.
      // lib/ko-cap.ts was written for exactly this case and had become dead
      // code here: hasKoPage(id) was awaited and the result never read.
      //
      // Thai is not a nice-to-have here. In the 2026-10-15 export Thai queries
      // took 219 of 353 clicks from 11,765 of 31,759 impressions — 62% of the
      // clicks on 37% of the impressions, a CTR of 1.86% against English 0.67%
      // — and the "ใกล้ฉัน" cluster ranks 1.9-3.1, the best positions on the
      // site.
      //
      // Korean is deliberately left out of the cluster while /ko/clinic stays
      // noindex: 1 Korean query and 2 impressions in the same export. A
      // cluster that points at a page excluded from the index spends the
      // signal on nothing, and Google drops clusters that do not reciprocate.
      ...(inSite && {
        languages: {
          en: `/clinic/${c.url_slug}`,
          th: `/th/clinic/${c.url_slug}`,
          "x-default": `/clinic/${c.url_slug}`,
        },
      }),
    },
    openGraph: {
      // 2026-09-02: 페이지가 openGraph 를 정의하면 루트 layout 의 siteName 이
      // 통째로 사라진다(Next 는 객체 단위 교체). 실측: og:site_name 태그 부재.
      siteName: cfg.brand,
      title,
      description,
      url: `/clinic/${c.url_slug}`,
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

// 2026-10-15: /th 페이지 본문 현지화. 9/15 실측으로 /th 는 본문 99% 가 영어판과 같아
// (태국어 글자 15~18%) noindex + 영어판 canonical 이었다. 그런데 남은 검색 유입은
// 거의 전부 태국어 "근처 치과" 검색이다. 여기 문구와 하위 컴포넌트의 lang 을 채워
// 태국어 페이지를 실제 태국어 페이지로 만든다. (색인 재개는 app/th/clinic 쪽에서.)
const PT = {
  en: {
    branches: "branches", open: "Open", googleReviews: "Google reviews", packages: "packages",
    mentions: "mentions", trendingUp: "↗ Trending up", declining: "↘ Quality declining",
    bdRating: "Rating", bdVolume: "Volume", bdLocal: "Local Gd", bdAuthority: "Authority",
    samplePricing: "Sample pricing", viaHdmall: (n: number) => `via HDmall · ${n} packages total`,
    seeHdmall: "See all packages on HDmall →",
    hdmallNote: "Prices are package list prices from HDmall. Actual cost may vary based on consultation — confirm with the clinic before booking. Prices in THB.",
    reviews: "Real review excerpts", reviewer: "Google reviewer", untranslated: "Thai, untranslated", inEnglish: "",
    translated: "Translated from Thai by Google", original: "Original review (Thai)",
    doctors: (n: string) => `Doctors mentioned in reviews at ${n}`, dr: "Dr.",
    compareTag: "Side-by-side comparison", compareSub: "Trust Score · Reviews · Doctors · Languages",
    alsoFrom: "Also from Thai Facial Clinic Group",
    moreCatIn: (cat: string, d: string) => `More ${cat} clinics in ${d}`, moreIn: (d: string) => `More clinics in ${d}`,
    similar: "Similar clinics", seeAll: "See all →", trust: "Trust",
    address: "Address", phone: "Phone", website: "Website", email: "Email", social: "Social",
    bookTag: "Book consultation", bookSub: "Free · We confirm your slot within 24h",
    maps: "View photos & info on Google Maps", callClinic: "📞 Call clinic", visitSite: "Visit website", compare: "Compare",
  },
  th: {
    branches: "สาขา", open: "เปิดอยู่", googleReviews: "รีวิว Google", packages: "แพ็กเกจ",
    mentions: "ครั้งที่ถูกพูดถึง", trendingUp: "↗ คะแนนกำลังดีขึ้น", declining: "↘ คะแนนช่วงหลังลดลง",
    bdRating: "คะแนน", bdVolume: "จำนวนรีวิว", bdLocal: "Local Guide", bdAuthority: "ผู้รีวิว",
    samplePricing: "ตัวอย่างราคา", viaHdmall: (n: number) => `จาก HDmall · ทั้งหมด ${n} แพ็กเกจ`,
    seeHdmall: "ดูแพ็กเกจทั้งหมดบน HDmall →",
    hdmallNote: "ราคาเป็นราคาแพ็กเกจบน HDmall ราคาจริงขึ้นกับการประเมิน ควรยืนยันกับคลินิกก่อนจอง (หน่วย: บาท)",
    reviews: "รีวิวจริงจากคนไข้", reviewer: "ผู้รีวิว Google", untranslated: "", inEnglish: "รีวิวภาษาอังกฤษ",
    translated: "", original: "",
    doctors: (n: string) => `หมอที่คนไข้พูดถึงในรีวิวของ ${n}`, dr: "หมอ",
    compareTag: "เปรียบเทียบแบบเคียงข้าง", compareSub: "คะแนนความน่าเชื่อถือ · รีวิว · หมอ · ภาษา",
    alsoFrom: "เว็บในเครือเดียวกัน",
    moreCatIn: (cat: string, d: string) => `คลินิก${cat}อื่นใน ${d}`, moreIn: (d: string) => `คลินิกอื่นใน ${d}`,
    similar: "คลินิกใกล้เคียง", seeAll: "ดูทั้งหมด →", trust: "คะแนน",
    address: "ที่อยู่", phone: "โทรศัพท์", website: "เว็บไซต์", email: "อีเมล", social: "โซเชียล",
    bookTag: "จองคำปรึกษา", bookSub: "ฟรี · ยืนยันเวลาภายใน 24 ชม.",
    maps: "ดูรูปและข้อมูลบน Google Maps", callClinic: "📞 โทรหาคลินิก", visitSite: "เข้าเว็บไซต์คลินิก", compare: "เทียบ",
  },
} as const;

const PRIMARY_TYPE_TH: Record<string, string> = {
  "Dental clinic": "คลินิกทันตกรรม", Dentist: "ทันตแพทย์", Orthodontist: "คลินิกจัดฟัน",
  "Cosmetic dentist": "ทันตกรรมเพื่อความงาม", "Dental implants provider": "คลินิกรากฟันเทียม",
  "Pediatric dentist": "ทันตกรรมเด็ก", Dental: "ทันตกรรม", "Dental school": "โรงเรียนทันตแพทย์",
  "Skin care clinic": "คลินิกผิวหนัง", "Medical clinic": "คลินิก", "Plastic surgery clinic": "คลินิกศัลยกรรม",
};

export default async function ClinicPage(
  { params, lang = "en" }: { params: Promise<{ id: string }>; lang?: "en" | "th" | "ko" }
) {
  const localePrefix = LOCALE_PREFIX[lang];
  const L = lang === "th" ? "th" : "en";
  const t = PT[L];
  // /th/d·/th/c·/th/clinic 은 있고 /ko 는 클리닉만 있다 — 내부 링크는 th 만 따라간다.
  const tp = lang === "th" ? "/th" : "";
  const catLabels = L === "th" ? CATEGORY_LABELS_TH : CATEGORY_LABELS;
  const { id } = await params;
  const db = await loadMasterDb();
  const c = getClinicByRouteKey(db.clinics, id);
  if (!c) notFound();
  // A place-id URL is one of the 844 Google still has indexed. Send it, once
  // and permanently, to the readable slug the page lives at now.
  if (isLegacyClinicKey(id) && c.url_slug && c.url_slug !== id) {
    permanentRedirect(`${localePrefix}/clinic/${c.url_slug}`);
  }

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
  // /th 는 태국어 원문을 먼저 — 영어판과 같은 영어 리뷰가 태국어 페이지를 채우고 있었다.
  // 깊은 리뷰가 있으면 그걸 쓴다. build_master_db.py 의 pick_samples 는 리뷰를
  // 3개만, 그중 80~300자인 것만 남기므로 300자가 넘는 리뷰는 전부 버려진다.
  // 그 결과 클리닉 페이지의 리뷰 본문 중앙값이 478자였다 — 디스크에는 3,705자가
  // 있었고, data/clinic-reviews.json 이 가장 긴 8개를 담는다(중앙값 1,805자).
  // 페이지에서 고유한 건 환자가 쓴 문장뿐이다: 라이브 실측으로 <main> 4,313자
  // 중 44%가 모든 클리닉 페이지와 토씨까지 같았다.
  const deep = await loadDeepReviews();
  const deepRows = deep?.[c.id];
  // 태국어 원문 (scripts/build_clinic_thai.py). /th 에서만 쓴다.
  //
  // 영어 페이지에는 적용하지 않는다. 이 토픽 개수는 태국어 코퍼스에서 나온 값이고
  // 영어 페이지의 개수는 master_db 의 전체 코퍼스에서 나온 값이라, 영어 쪽을
  // 여기로 갈아끼우면 영어 코퍼스를 같이 고치지 않은 채 숫자만 바뀐다. 로케일별
  // 출처가 분명한 덮어쓰기로 두는 게 정확하다.
  const thai = L === "th" ? (await loadClinicThai())?.[c.id] : undefined;
  // 2026-10-16: 깊은 리뷰에 태국어 원문이 섞인다(Apify 병합). 예전엔 깊은 리뷰를
  // 통째로 "en" 으로 찍어서, /th 페이지가 태국어 원문에 "รีวิวภาษาอังกฤษ" 라벨을
  // 붙였다. 언어는 리뷰마다 글자로 판정한다.
  const isThai = (s: string) => /[฀-๿]/.test(s);
  const tagged = deepRows
    ? deepRows.map((r) => ({ ...r, srcLang: isThai(r.text) ? ("th" as const) : ("en" as const) }))
    : [
        ...(c.sample_reviews_en ?? []).map((r) => ({ ...r, srcLang: "en" as const })),
        ...(c.sample_reviews_th ?? []).map((r) => ({ ...r, srcLang: "th" as const })),
      ];
  // 페이지 언어와 같은 원문을 먼저. 영어 페이지에선 번역본이 있는 태국어 리뷰가
  // 번역 없는 것보다 앞 — 외국인이 읽을 수 있는 순서.
  const rank = (r: (typeof tagged)[number]) =>
    r.srcLang === L ? 0 : L === "en" && r.en ? 1 : 2;
  // 2026-10-22: 8개 전문 → 3개 발췌, 작성자 이름 제거 (사용자 결정).
  // 8개 전문은 페이지당 구글 리뷰 원문 ~14,000자 — 구글 지도에 그대로 있는
  // 글이라 고유 콘텐츠가 아니라 복제 콘텐츠다(8/18 스팸 업데이트 피격 사이트).
  // 고유한 건 위의 분석 블록(ReviewSignals·TrustDonut·RatingChart·TopicCluster·
  // LicenseCheck)이고, 리뷰는 그 분석을 뒷받침하는 짧은 인용으로만 쓴다.
  // /th 에 태국어 원문이 있으면 그것을 인용한다. 그게 없을 때 이 페이지는 영어
  // 페이지와 같은 영어 리뷰를 싣고 있었다 — 태국어 쿼리가 1.9~3.1위에서 클릭
  // 62%를 버는 페이지인데, 인용문만 읽는 사람에게는 번역도 안 된 남의 말이었다.
  // 개수는 3개 그대로다(2026-10-22 결정) — 많이 싣는 건 구글 지도에 그대로 있는
  // 글의 복제이고, 이 사이트가 8/18 에 강등된 이유가 그것이다.
  //
  // en 은 undefined 다 — 수집할 때 textTranslated 를 일부러 안 받았다. 영어 목적일
  // 때의 규칙을 태국어 페이지에 적용하면 원문 대신 번역본을 싣게 된다. /th 를 읽는
  // 사람에게 영어 번역을 붙일 이유도 없다.
  const samples: { text: string; rating: number; author: string; en?: string; srcLang: "th" | "en" }[] =
    thai?.quotes?.length
      ? thai.quotes.map((q) => ({
          text: q.text,
          rating: q.rating,
          author: "",
          en: undefined,
          srcLang: "th" as const,
        }))
      : [...tagged].sort((a, b) => rank(a) - rank(b)).slice(0, 3);

  // Pricing — hdmall package 데이터(있는 경우)
  // 2026-09-02: 멀티지점 브랜드면 허브로 링크 (web/ 과 동일).
  const brandKey = brandKeyOf(c.name);
  const brandOf = brandKey
    ? groupBrands(applySiteFilter(db.clinics, getSiteConfig())).find((b) => b.key === brandKey) ?? null
    : null;
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
    ? catLabels[c.categories[0]] ?? (L === "th" ? "กรุงเทพฯ" : "Bangkok")
    : (L === "th" ? "กรุงเทพฯ" : "Bangkok");

  // Trust Score breakdown for donut
  const ratingPart = (c.rating / 5) * 50;
  const volumePart = Math.min(40, Math.log10(Math.max(1, c.total_reviews)) * 12);
  const lgRatio = c.scraped_review_count > 0 ? c.local_guide_count / c.scraped_review_count : 0;
  const lgPart = Math.min(10, lgRatio * 20);
  const authPart = Math.min(5, Math.log10(Math.max(1, c.avg_author_review_count)) * 2);
  const breakdown = [
    { label: t.bdRating, value: ratingPart, max: 50, color: "#16a34a" },
    { label: t.bdVolume, value: volumePart, max: 40, color: "#2563eb" },
    { label: t.bdLocal, value: lgPart, max: 10, color: "#7c3aed" },
    { label: t.bdAuthority, value: authPart, max: 5, color: "#0891b2" },
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
  const faqs = buildClinicFaqs(c as Parameters<typeof buildClinicFaqs>[0], L);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <ViewBeacon clinicId={c.id} />
      <StickyClinicBar
        clinicName={c.name}
        phone={c.phone || undefined}
        lang={L}
      />
      <FloatingContactBar clinicId={c.id} clinicName={c.name} phone={c.phone} lang={L} />
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href={`${tp}/`} className="hover:text-[var(--fg)]">{HOME_CRUMB[lang]}</a>
        {c.district && (
          <>
            <span className="mx-2">›</span>
            <a
              href={`${tp}/d/${c.district.toLowerCase().replace(/\s+/g, "-")}`}
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
              <span>{L === "th" ? PRIMARY_TYPE_TH[c.primary_type] ?? c.primary_type : c.primary_type}</span>
              {c.district && (
                <>
                  <span>·</span>
                  <span className="flex items-center gap-1">📍 {c.district}</span>
                </>
              )}
              {brandOf && brandOf.clinics.length > 1 && (
                <>
                  <span>·</span>
                  <a href={`/brand/${brandOf.slug}`} className="underline">
                    {brandOf.name} · {brandOf.clinics.length} {t.branches}
                  </a>
                </>
              )}
              {c.business_status === "Open" && (
                <span className="flex items-center gap-1 text-green-700 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> {t.open}
                </span>
              )}
            </p>
          </div>
          <div className="text-right">
            <div className="bg-yellow-50 text-yellow-900 px-4 py-2 rounded-lg text-2xl font-bold">
              ★ {c.rating.toFixed(1)}
            </div>
            <div className="text-xs text-[var(--muted)] mt-1 tabular-nums">
              {c.total_reviews.toLocaleString()} {t.googleReviews}
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 items-center">
          {tier && <VerifiedPartnerBadge clinicId={c.id} />}
          <AIVerifiedBadge clinic={c} size="md" />
          {percentile <= 25 && (
            <RelativeRanking percentile={percentile} label={rankingLabel} lang={L} />
          )}
          <Freshness generatedAt={db.generated_at} mode="detail" lang={L} />
          {priceRange && (
            <span className="bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
              ฿{priceRange.min.toLocaleString()}–{priceRange.max.toLocaleString()}
              <span className="opacity-70 text-xs ml-1">· {pricing?.packages.length} {t.packages}</span>
            </span>
          )}
        </div>

        {focusCategories.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {focusCategories.map((cat) => (
              <a
                key={cat}
                href={`${tp}/c/${cat}`}
                className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm hover:bg-blue-100 inline-flex items-center gap-1.5"
              >
                <CategoryIcon category={cat} size={14} />
                {catLabels[cat] ?? cat}
                {c.service_mentions[cat] ? (
                  <span className="opacity-70 text-xs">· {c.service_mentions[cat]} {t.mentions}</span>
                ) : null}
              </a>
            ))}
            {trend === "improving" && (
              <span className="bg-green-50 text-green-800 px-3 py-1 rounded-full text-sm">
                {t.trendingUp}
              </span>
            )}
            {trend === "declining" && (
              <span className="bg-orange-50 text-orange-800 px-3 py-1 rounded-full text-sm">
                {t.declining}
              </span>
            )}
          </div>
        )}
      </header>

      {/* 2026-10-15: 이 사이트에만 있는 사실(사회보장·실제 낸 가격)을 첫 화면에. */}
      <PatientReported
        clinic={c}
        bands={(db as unknown as { price_bands?: Record<string, Record<string, { n: number; p25: number; median: number; p75: number }>> }).price_bands}
        lang={lang === "th" ? "th" : "en"}
      />

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
            <PhotoGallery photos={photos.photos} clinicName={c.name} lang={L} />
          )}

          {/* 클리닉 공식 가격표 — HDmall 패키지·리뷰 추정치와 출처가 다르므로
              별도 블록으로 둔다. 표라서 좁은 사이드바가 아니라 본문에 배치. */}
          <PublishedPriceTable
            items={publishedPrices}
            domain={publishedPriceDomain}
            generatedAt={priceDataGeneratedAt}
          />

          {/* 2026-09-30: 리뷰 원문에서 캔 불만 신호 + 평점 추세.
              아래 TrustDonut·RatingChart 는 전부 별점에서 파생된 값이라
              1,825곳이 같은 모양이었다. 여기만 페이지마다 다른 문장이 나온다. */}
          {/* The licence sits above the review analysis: it is the only block on
              this page that a Google listing cannot also show. */}
          <LicenseCheck clinicId={c.id} lang={lang} />

          <ClinicInsights clinicId={c.id} lang={L} />

          <ReviewSignals clinic={c} lang={L} />

          {/* Pantip — 태국 최대 커뮤니티 토픽 인용 + 외부 backlink */}
          <PantipMentions clinic={c} lang={L} />

          <TrustDonut score={c.trust_score} breakdown={breakdown} lang={L} />

          <RatingChart trend={c.rating_trend} lang={L} />

          {/* /th 에서는 태국어 원문에서 나온 토픽으로 교체한다 — 더하면 안 된다.
              영어 코퍼스는 같은 리뷰의 구글 번역본이라 같은 문장을 두 번 센다. */}
          {(thai?.topics?.length ? thai.topics : c.mentioned_topics).length > 0 && (
            <TopicCluster
              topics={(thai?.topics?.length ? thai.topics : c.mentioned_topics).slice(0, 12)}
              lang={L}
            />
          )}

          <MapEmbed lat={c.lat} lng={c.lng} name={c.name} height={320} />

          {pricing && pricingTop.length > 0 && (
            <section className="bg-white border border-[var(--border)] rounded-xl p-5">
              <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
                <h2 className="text-lg font-bold">{t.samplePricing}</h2>
                <span className="text-[11px] text-[var(--muted)]">
                  {t.viaHdmall(pricing.packages.length)}
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
                  {t.seeHdmall}
                </a>
              )}
              <p className="mt-3 text-[11px] text-[var(--muted)] leading-relaxed">
                {t.hdmallNote}
              </p>
            </section>
          )}

          {samples.length > 0 && (
            <section>
              <h2 className="text-lg font-bold mb-3">{t.reviews}</h2>
              <div className="space-y-3">
                {samples.map((r, i) => (
                  <blockquote key={i} className="border-l-4 border-[var(--accent)] bg-white px-4 py-3 rounded-r">
                    {L === "en" && r.srcLang === "th" && r.en ? (
                      <>
                        <p className="text-sm leading-relaxed">{reviewExcerpt(r.en)}</p>
                        <details className="mt-1 text-xs text-[var(--muted)]">
                          <summary className="cursor-pointer">{t.original}</summary>
                          <p lang="th" className="mt-1 leading-relaxed">{reviewExcerpt(r.text)}</p>
                        </details>
                      </>
                    ) : (
                      <p lang={r.srcLang} className="text-sm leading-relaxed">{reviewExcerpt(r.text)}</p>
                    )}
                    <footer className="mt-2 text-xs text-[var(--muted)] flex flex-wrap items-center gap-2">
                      <span className="font-medium">{t.reviewer}</span>
                      <span>·</span>
                      <span className="text-yellow-700">★ {r.rating}</span>
                      {L === "en" && r.srcLang === "th" && r.en ? (
                        <>
                          <span>·</span>
                          <span>{t.translated}</span>
                        </>
                      ) : (L === "th" ? r.srcLang === "en" : r.srcLang === "th") && (
                        <>
                          <span>·</span>
                          <span className="uppercase tracking-wide">{L === "th" ? t.inEnglish : t.untranslated}</span>
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
                  {t.doctors(c.name)}
                </h2>
                <ul className="flex flex-wrap gap-2">
                  {linkable.map((d) => (
                    <li key={d.slug}>
                      <a
                        href={`${localePrefix}/doctor/${encodeURI(makeCompositeDoctorSlug(d, c))}`}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-[var(--border)] text-sm bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
                      >
                        <span className="font-medium">{t.dr} {d.name}</span>
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
          <FaqSection faqs={faqs} lang={L} />

          {/* SEO: 카테고리/지역 long-tail 자동 내부 백링크 */}
          <RelatedExplore clinic={c} lang={L} />

          {/* Compare CTA — 같은 카테고리 최상위 클리닉과 비교 */}
          {comparePeer && (
            <a href={`/compare/${c.id}/${comparePeer.id}`} rel="nofollow"
              className="flex items-center gap-3 p-4 rounded-xl border border-[var(--border)] bg-white hover:border-[var(--accent)] transition group">
              <span className="text-2xl shrink-0">⚖️</span>
              <div className="min-w-0 flex-1">
                <div className="text-xs text-[var(--muted)] uppercase tracking-wide mb-0.5">{t.compareTag}</div>
                <div className="font-semibold text-sm group-hover:text-[var(--accent)] transition truncate">
                  {c.name} vs {comparePeer.name}
                </div>
                <div className="text-xs text-[var(--muted)]">{t.compareSub}</div>
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
                  <div className="text-xs text-[var(--muted)] uppercase tracking-wide mb-0.5">{t.alsoFrom}</div>
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
                    ? t.moreCatIn(catLabels[primaryCat] ?? primaryCat, c.district)
                    : c.district
                    ? t.moreIn(c.district)
                    : t.similar}
                </h2>
                {primaryCat && c.district && (
                  // 2026-10-25: tp — /th 에서는 태국어 조합 페이지(/th/c/{cat}/{district})로.
                  <a
                    href={`${tp}/c/${primaryCat}/${c.district.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-xs text-[var(--accent)] hover:underline font-medium"
                  >
                    {t.seeAll}
                  </a>
                )}
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {nearbyClinics.map((s) => (
                  <a
                    key={s.id}
                    href={`${tp}/clinic/${s.url_slug}`}
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
                        {t.trust} {s.trust_score.toFixed(0)}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}

          <section className="grid sm:grid-cols-2 gap-3">
            <div className="bg-white border border-[var(--border)] rounded-lg p-4">
              <div className="text-xs uppercase tracking-wide text-[var(--muted)] mb-1">{t.address}</div>
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
              <div className="text-xs uppercase tracking-wide text-[var(--muted)] mb-1">{t.phone}</div>
              {c.phone ? (
                <a href={`tel:${c.phone.replace(/[^+\d]/g, "")}`} className="text-sm text-[var(--accent)] hover:underline">
                  {c.phone}
                </a>
              ) : (
                <div className="text-sm">—</div>
              )}
              {c.website && (
                <>
                  <div className="text-xs uppercase tracking-wide text-[var(--muted)] mb-1 mt-3">{t.website}</div>
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
                  <div className="text-xs uppercase tracking-wide text-[var(--muted)] mb-1 mt-3">{t.email}</div>
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
                  <div className="text-xs uppercase tracking-wide text-[var(--muted)] mb-1 mt-3">{t.social}</div>
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
            lang={L}
          />
          <ClinicCtaCard
            clinicName={c.name}
            phone={c.phone || undefined}
            lang={L}
          />
          {/* Hero CTA — 가장 prominent. accent gradient + 강한 contrast */}
          <div
            className="rounded-xl p-4 text-white shadow-lg"
            style={{ background: `linear-gradient(135deg, var(--accent), var(--accent))` }}
          >
            <div className="text-[10px] uppercase tracking-widest font-bold opacity-90 mb-2">
              {t.bookTag}
            </div>
            <p className="text-[11px] mt-2 text-center opacity-90">
              {t.bookSub}
            </p>
          </div>

          {/* Sidebar ad slot — sticky 안에서 같이 스크롤되며 노출 길게 */}
          <AdPlaceholder variant="square" label="Sponsored" hint="Sidebar ad" />

          <BookingForm clinicId={c.id} clinicName={c.name} lang={L} />

          <div className="bg-white border border-[var(--border)] rounded-xl p-4 space-y-2">
            <a
              href={c.maps_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-black text-white py-2.5 px-4 rounded-lg font-bold text-center hover:bg-gray-800 text-sm"
            >
              {t.maps}
            </a>
            {c.phone && (
              <a
                href={`tel:${c.phone.replace(/[^+\d]/g, "")}`}
                className="block w-full bg-white border border-[var(--border)] py-2.5 px-4 rounded-lg font-bold text-center hover:border-black text-sm"
              >
                {t.callClinic}
              </a>
            )}
            {c.website && (
              <a
                href={c.website}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="block w-full bg-white border border-[var(--border)] py-2.5 px-4 rounded-lg font-bold text-center hover:border-black text-sm"
              >
                {t.visitSite}
              </a>
            )}
          </div>

          {/* Below-similar ad slot — 2nd ad position in sidebar */}
          <AdPlaceholder variant="square" label="Sponsored" hint="Below-fold sidebar" />

          {similar.length > 0 && (
            <div className="bg-white border border-[var(--border)] rounded-xl p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
                {t.similar}
              </h3>
              <div className="space-y-2">
                {similar.map((s) => (
                  <div key={s.id} className="group flex items-start justify-between gap-2">
                    <a href={`${tp}/clinic/${s.url_slug}`} className="flex-1 min-w-0">
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
                          {t.trust} {s.trust_score.toFixed(0)}
                        </span>
                      </div>
                    </a>
                    <a
                      href={`/compare/${c.id}/${s.id}`}
                      rel="nofollow"
                      className="shrink-0 text-[10px] uppercase tracking-widest text-[var(--muted)] hover:text-[var(--accent)] border border-[var(--border)] rounded px-2 py-0.5 hover:border-[var(--accent)] transition"
                      title={`Compare ${c.name} vs ${s.name}`}
                    >
                      {t.compare}
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
        <ClaimBanner clinicId={c.id} clinicName={c.name} accent="var(--accent)" lang={L} />
      )}

      {/* /th 변형은 canonical 이 /th/clinic/{id} 인데 JSON-LD 의 url·breadcrumb 은
          전부 영어 경로를 뱉고 있었다 — 같은 문서가 canonical 과 구조화 데이터에서
          서로 다른 URL 을 자기 자신이라고 주장하는 상태 (2026-08-06 감사). */}
      <ClinicJsonLd c={c} photos={photos?.photos} priceRange={priceRange ?? undefined} localePrefix={localePrefix} />
      <BreadcrumbJsonLd items={[
        { name: HOME_CRUMB[lang], url: `${localePrefix}/` },
        ...(c.district ? [{ name: c.district, url: `${localePrefix}/d/${c.district.toLowerCase().replace(/\s+/g, "-")}` }] : []),
        { name: c.name, url: `${localePrefix}/clinic/${c.url_slug}` },
      ]} />
      {/* AEO: FAQ schema — Google PAA / LLM 인용 친화 */}
      <FaqJsonLd faqs={faqs} />
      {/* AEO: Speakable — 음성검색 (Google Assistant 등) 응답 elig */}
      <SpeakableJsonLd url={`${localePrefix}/clinic/${c.url_slug}`} />
    </div>
  );
}
