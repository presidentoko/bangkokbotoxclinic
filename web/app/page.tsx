import { loadMasterDb, topByFocusRelevance } from "@/lib/data";
import { ClinicCard } from "@/components/ClinicCard";
import { ClinicCardCompact } from "@/components/ClinicCardCompact";
import { CATEGORY_LABELS } from "@/lib/types";
import { FaqJsonLd, ItemListJsonLd } from "@/components/JsonLd";
import { HOME_FAQS, CATEGORY_FAQS } from "@/lib/faq";
import { AffiliateInline, AdPlaceholder } from "@/components/AffiliateSlot";
import { loadPhotos } from "@/lib/photos";
import { SpinDiscover } from "@/components/SpinDiscover";
import { HiddenGem } from "@/components/HiddenGem";
import { SourcesStrip } from "@/components/SourcesStrip";
import { BookingForm } from "@/components/BookingForm";
import { HeroSearch } from "@/components/HeroSearch";
import { CategoryIcon } from "@/components/CategoryIcon";
import { SponsoredHero } from "@/components/SponsoredHero";
import { sortWithSponsored, sponsoredTier } from "@/lib/sponsored";
import { getSiteConfig, applySiteFilter } from "@/lib/site";
import { formatTrustScore } from "@/lib/utils";
import { guidesForFocus } from "@/lib/guides";
import { ClinicPhoto } from "@/components/ClinicPhoto";
import WhyUs from "@/components/WhyUs";
import AfterSubmitFlow from "@/components/AfterSubmitFlow";
import CityRow from "@/components/CityRow";
import { SpotlightCard } from "@/components/SpotlightCard";
import TestimonialMarquee from "@/components/TestimonialMarquee";
import CuratedCollections from "@/components/CuratedCollections";
import PatientCommunityCount from "@/components/PatientCommunityCount";
// Below-fold + heavy interactive 위젯들 — client only lazy hydrate.
// LazyWidgets.tsx 가 client component module 이라 ssr:false 사용 가능.
import {
  DownloadableGuide, MemberPerksStrip, ScrollReveal,
} from "@/components/LazyWidgets";
import type { Metadata } from "next";

export const revalidate = 86400; // ISR 24h — sponsored 변경은 admin API revalidatePath()로 즉시 반영. Hobby ISR Writes 한도 절약.

// layout.tsx 에서 이동 — 레이아웃에 있으면 /saved, /pay 등 metadata 없는
// 모든 하위 페이지가 홈으로 canonical 상속받는 버그 (2026-07-17 감사).
export const metadata: Metadata = {
  alternates: {
    canonical: "/",
    languages: {
      "en": "/",
      "th": "/th",
      "ko": "/ko",
      "x-default": "/",
    },
  },
};

type HomeLang = "en" | "ko" | "th";

// 2026-07-13: TH/KO 홈이 EN과 완전히 다른(섹션 5개 vs 20개) 별도 구현이라 콘텐츠
// 격차가 컸음 — 같은 HomePage 컴포넌트를 lang prop으로 재사용해 구조(섹션 전체)는
// 통일하고, 헤딩/라벨만 번역. 시술별 매니페스토 본문·가이드 카드 설명 등 긴 focus별
// 텍스트는 아직 EN — 후속 작업.
const HOME_T: Record<HomeLang, Record<string, string>> = {
  en: {
    verifiedBadge: "Verified · Independent · No sponsorship in rankings",
    ctaTop6: "See top 6 by Trust Score", ctaMatch: "Get matched (free)", visitorsFrom: "Visitors from",
    statClinics: "Clinics verified", statReviews: "Cross-source reviews", statDeep: "Deep-analyzed",
    top6: "Top 6 by Trust Score", seeFullRanking: "See full ranking →", rank: "Rank #", trust: "Trust", reviews: "reviews",
    realPatients: "What real patients say", fromVerified: "From verified Google reviews",
    byCity: "By City", byService: "By Service",
    compareTop: "Compare top clinics", sideBySide: "Side-by-side Trust Score analysis",
    editorsGuides: "Editor's guides", guidesSub: "Pricing reality, brand verification, what packages cover.", allGuides: "All guides →",
    topN: "Top {n} by Trust Score", runnerUp: "#11 – #{n} · runner-up rankings", sameDepth: "Same data depth, lighter view",
    faq: "Frequently asked",
  },
  ko: {
    verifiedBadge: "검증됨 · 독립 운영 · 순위에 광고비 영향 없음",
    ctaTop6: "신뢰도 TOP 6 보기", ctaMatch: "무료 매칭 받기", visitorsFrom: "방문자 출신국",
    statClinics: "검증된 클리닉", statReviews: "통합 리뷰 수", statDeep: "심층 분석 완료",
    top6: "신뢰도 TOP 6", seeFullRanking: "전체 순위 보기 →", rank: "순위 #", trust: "신뢰도", reviews: "리뷰",
    realPatients: "실제 환자들의 후기", fromVerified: "검증된 Google 리뷰 기준",
    byCity: "도시별", byService: "시술별",
    compareTop: "상위 클리닉 비교", sideBySide: "신뢰도 점수 나란히 비교",
    editorsGuides: "에디터 가이드", guidesSub: "실제 가격, 브랜드 검증, 패키지에 포함된 것.", allGuides: "전체 가이드 →",
    topN: "신뢰도 TOP {n}", runnerUp: "#11 – #{n} · 차순위 클리닉", sameDepth: "데이터는 동일, 가벼운 뷰",
    faq: "자주 묻는 질문",
  },
  th: {
    verifiedBadge: "ตรวจสอบแล้ว · เป็นอิสระ · อันดับไม่ได้รับอิทธิพลจากโฆษณา",
    ctaTop6: "ดู TOP 6 ตามคะแนนความน่าเชื่อถือ", ctaMatch: "จับคู่ฟรี", visitorsFrom: "ผู้เข้าชมจาก",
    statClinics: "คลินิกที่ตรวจสอบแล้ว", statReviews: "รีวิวรวมทุกแหล่ง", statDeep: "วิเคราะห์เชิงลึก",
    top6: "TOP 6 ตามคะแนนความน่าเชื่อถือ", seeFullRanking: "ดูอันดับทั้งหมด →", rank: "อันดับ #", trust: "ความน่าเชื่อถือ", reviews: "รีวิว",
    realPatients: "เสียงจริงจากผู้ป่วยจริง", fromVerified: "จากรีวิว Google ที่ยืนยันแล้ว",
    byCity: "ตามเมือง", byService: "ตามบริการ",
    compareTop: "เปรียบเทียบคลินิกยอดนิยม", sideBySide: "เทียบคะแนนความน่าเชื่อถือแบบเคียงข้าง",
    editorsGuides: "คู่มือจากบรรณาธิการ", guidesSub: "ราคาจริง การตรวจสอบแบรนด์ สิ่งที่รวมอยู่ในแพ็กเกจ", allGuides: "คู่มือทั้งหมด →",
    topN: "TOP {n} ตามคะแนนความน่าเชื่อถือ", runnerUp: "#11 – #{n} · อันดับรองลงมา", sameDepth: "ข้อมูลเดียวกัน มุมมองที่เบากว่า",
    faq: "คำถามที่พบบ่อย",
  },
};

export default async function HomePage(
  { lang = "en", faqs: faqsOverride }: { lang?: HomeLang; faqs?: { q: string; a: string }[] } = {}
) {
  const t = HOME_T[lang] ?? HOME_T.en;
  // /th, /ko 홈에서 클리닉을 눌러도 항상 영어 페이지로 빠지던 문제 수정 —
  // /th/clinic, /ko/clinic 은 이미 존재(ClinicCard와 동일 이유). /c/[service]는
  // ko만 존재(/th/c/*는 아직 없음), /city/*, /d/*는 로케일 변형 자체가 없어
  // 그대로 EN 링크 유지 (2026-07-31 감사).
  const clinicPrefix = lang === "en" ? "" : `/${lang}`;
  const servicePrefix = lang === "ko" ? "/ko" : "";
  const cfg = getSiteConfig();
  const db = await loadMasterDb();
  const focused = applySiteFilter(db.clinics, cfg);
  const top = await sortWithSponsored(topByFocusRelevance(focused, cfg.focus, 50));
  // Pre-compute sponsored tiers for hero lookup (sponsoredTier is now async)
  const heroTiers = await Promise.all(top.map((c) => sponsoredTier(c.id)));
  const heroIdx = heroTiers.findIndex((t) => t !== null);
  const heroClinic = heroIdx !== -1 ? top[heroIdx] : null;

  // Top 50 사진 미리 로드 (server-side, 캐시됨) — Top 6 카드 + SpinDiscover 풀
  const topPhotos = await Promise.all(top.slice(0, 50).map((c) => loadPhotos(c.id)));
  const top6Photos = topPhotos.slice(0, 6);

  // Hidden Gem: high-trust + low-volume — 매일 deterministic 선택
  const gemCandidates = focused.filter((c) => c.trust_score >= 70 && c.total_reviews >= 30 && c.total_reviews <= 250);
  const gemSeed = Math.floor((Date.now() / 86400000));
  const gemPick = gemCandidates.length > 0 ? gemCandidates[gemSeed % gemCandidates.length] : null;
  const gemPhoto = gemPick ? await loadPhotos(gemPick.id) : null;

  const totalReviews = focused.reduce((s, c) => s + c.total_reviews, 0);
  const withScraped = focused.filter((c) => c.scraped_review_count > 0).length;

  // District 섹션은 dominant city 한정 — Pattaya/Phuket district가 Bangkok과 섞이면
  // 외국인이 "Bangkok"으로 검색 후 150km 떨어진 클리닉 예약하는 사고 방지.
  // 다른 도시는 아래 "By City" 섹션에서 별도 진입.
  const cityCounts = new Map<string, number>();
  for (const c of focused) {
    if (c.city_label) cityCounts.set(c.city_label, (cityCounts.get(c.city_label) ?? 0) + 1);
  }
  const dominantCity = [...cityCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  const districtMap = new Map<string, number>();
  for (const c of focused) {
    if (!c.district) continue;
    // dominantCity가 있으면 그 도시만; city_label 없는 행은 안전하게 포함
    if (dominantCity && c.city_label && c.city_label !== dominantCity) continue;
    districtMap.set(c.district, (districtMap.get(c.district) ?? 0) + 1);
  }
  const districts = [...districtMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12);

  // 멀티시티 — focused 안에서 city별 count. 도시 1개면 섹션 숨김.
  const cityMap = new Map<string, { slug: string; count: number }>();
  for (const c of focused) {
    if (!c.city_label) continue;
    const cur = cityMap.get(c.city_label);
    if (cur) cur.count += 1;
    else cityMap.set(c.city_label, { slug: c.city_slug || c.city_label.toLowerCase(), count: 1 });
  }
  const cities = [...cityMap.entries()].sort((a, b) => b[1].count - a[1].count);

  const categoryMap = new Map<string, number>();
  for (const c of focused) {
    for (const cat of c.categories) categoryMap.set(cat, (categoryMap.get(cat) ?? 0) + 1);
  }
  // 사이트 focus와 무관한 카테고리 제거 (예: 치과 사이트에 보톡스/레이저, 보톡스 사이트에 치과/헤어)
  const FOCUS_ALLOWED_CATS: Partial<Record<string, Set<string>>> = {
    dental: new Set(["dental"]),
    hair:   new Set(["hair_transplant"]),
    botox:  new Set(["botox", "filler", "hifu", "facial", "laser"]),
    filler: new Set(["botox", "filler", "hifu", "facial", "laser"]),
    hifu:   new Set(["botox", "filler", "hifu", "facial", "laser"]),
    facial: new Set(["botox", "filler", "hifu", "facial", "laser"]),
    laser:  new Set(["botox", "filler", "hifu", "facial", "laser"]),
  };
  const allowedCats = FOCUS_ALLOWED_CATS[cfg.focus];
  const categories = [...categoryMap.entries()]
    .filter(([cat]) => !allowedCats || allowedCats.has(cat))
    .sort((a, b) => b[1] - a[1]);

  const homeFaqs = faqsOverride ?? (cfg.focus !== "all" && CATEGORY_FAQS[cfg.focus]
    ? [...CATEGORY_FAQS[cfg.focus], ...HOME_FAQS]
    : HOME_FAQS);

  const popularSearches = [
    ...(cfg.focus !== "all"
      ? districts.slice(0, 3).map(([d]) => ({
          label: `${cfg.focus} in ${d}`,
          href: `/c/${cfg.focus}/${d.toLowerCase().replace(/\s+/g, "-")}`,
        }))
      : categories.slice(0, 4).map(([cat]) => ({
          label: CATEGORY_LABELS[cat] ?? cat,
          href: `/c/${cat}`,
        }))),
  ];

  const searchIndex = focused.map((c) => ({
    id: c.id,
    name: c.name,
    district: c.district,
    rating: c.rating,
    trust_score: c.trust_score,
  }));

  // Recent positive reviews — social proof
  const reviewQuotes = focused
    .filter((c) => c.trust_score >= 75 && c.sample_reviews_en && c.sample_reviews_en.length > 0)
    .slice(0, 3)
    .map((c) => ({
      clinic: c.name,
      district: c.district,
      rating: c.rating,
      review: c.sample_reviews_en[0],
      id: c.id,
    }));

  const accent = cfg.themeAccent;
  const focusLabel = cfg.focus === "all" ? "Bangkok aesthetic" : cfg.focus;

  return (
    <>
      {/* MEGA HERO — trust/safety voice */}
      <section className="relative bg-gradient-to-b from-slate-50 via-white to-white overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div
            className="absolute top-10 left-10 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl"
            style={{ background: accent }}
          />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 pt-16 md:pt-20 pb-12 text-center">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
              style={{ background: `${accent}15`, color: accent }}
            >
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: accent }} />
              {t.verifiedBadge}
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.95] mb-6 text-balance">
            {lang === "ko" ? (
              cfg.focus === "dental" ? (<>진료 전에<br /><span style={{ color: accent }}>먼저 확인하세요.</span></>)
              : (<>시술 전에<br /><span style={{ color: accent }}>먼저 확인하세요.</span></>)
            ) : lang === "th" ? (
              cfg.focus === "dental" ? (<>ตรวจสอบก่อน<br /><span style={{ color: accent }}>ยิ้มอย่างมั่นใจ</span></>)
              : (<>ตรวจสอบก่อน<br /><span style={{ color: accent }}>ตัดสินใจทำ</span></>)
            ) : cfg.focus === "all" ? (
              <>Verify before<br /><span style={{ color: accent }}>you book.</span></>
            ) : cfg.focus === "botox" || cfg.focus === "filler" ? (
              <>Verify before<br /><span style={{ color: accent }}>you inject.</span></>
            ) : cfg.focus === "dental" ? (
              <>Verify before<br /><span style={{ color: accent }}>you smile.</span></>
            ) : cfg.focus === "hifu" || cfg.focus === "laser" ? (
              <>Verify before<br /><span style={{ color: accent }}>you treat.</span></>
            ) : (
              <>{cfg.hero.split(" — ")[0] ?? cfg.hero}<br /><span style={{ color: accent }}>{cfg.hero.split(" — ")[1] ?? "verified."}</span></>
            )}
          </h1>
          <p className="text-lg md:text-xl text-[var(--muted)] mb-8 max-w-2xl mx-auto text-balance">
            {lang === "ko" ? (
              <>
                <span className="font-bold text-[var(--fg)]">{focused.length.toLocaleString()}</span>개 {focusLabel} 클리닉을{" "}
                <span className="font-bold text-[var(--fg)]">{totalReviews.toLocaleString()}</span>개 리뷰(Google Maps, HDmall, Wongnai{cfg.focus === "hair" ? ", Bookimed, Pantip, Reddit" : ""} 등)로 순위화 —{" "}
                <span className="font-bold text-[var(--fg)]">{withScraped.toLocaleString()}</span>곳은 신뢰도 심층 분석 완료.
              </>
            ) : lang === "th" ? (
              <>
                จัดอันดับคลินิก{focusLabel} <span className="font-bold text-[var(--fg)]">{focused.length.toLocaleString()}</span> แห่ง จาก{" "}
                <span className="font-bold text-[var(--fg)]">{totalReviews.toLocaleString()}</span> รีวิวรวมจาก Google Maps, HDmall, Wongnai{cfg.focus === "hair" ? ", Bookimed, Pantip และ Reddit" : ""} —{" "}
                วิเคราะห์เชิงลึกแล้ว <span className="font-bold text-[var(--fg)]">{withScraped.toLocaleString()}</span> แห่ง
              </>
            ) : (
              <>
                <span className="font-bold text-[var(--fg)]">{focused.length.toLocaleString()}</span> {focusLabel} clinics ranked across{" "}
                <span className="font-bold text-[var(--fg)]">{totalReviews.toLocaleString()}</span> reviews aggregated from Google Maps, HDmall, Wongnai{cfg.focus === "hair" ? ", Bookimed, Pantip and Reddit" : " and other Thai platforms"} —{" "}
                <span className="font-bold text-[var(--fg)]">{withScraped.toLocaleString()}</span> deep-analyzed for credibility.
              </>
            )}
          </p>

          <HeroSearch
            entities={searchIndex}
            hrefBase="/clinic"
            popularSearches={popularSearches}
            popularLabel={lang === "ko" ? "인기 검색" : lang === "th" ? "ยอดนิยม" : "Popular"}
            searchPlaceholder={lang === "ko" ? "클리닉명 또는 지역 검색..." : lang === "th" ? "ค้นหาชื่อคลินิกหรือเขต..." : "Search clinic name or district..."}
            searchLang={lang}
          />

          {/* Dual CTA — 모바일 stacked, 데스크탑 horizontal */}
          <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 max-w-sm sm:max-w-none mx-auto">
            <a
              href="#top6"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-white text-sm font-bold shadow-md hover:shadow-lg active:scale-95 sm:hover:scale-105 transition-transform"
              style={{ background: accent }}
            >
              {t.ctaTop6} <span aria-hidden>↓</span>
            </a>
            <a
              href="#booking"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white border border-[var(--border)] text-[var(--fg)] text-sm font-bold hover:border-black transition-colors"
            >
              {t.ctaMatch}
            </a>
          </div>

          {/* Visitors-from strip — medical-tourism signal */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-xs text-[var(--muted)]">
            <span className="font-semibold uppercase tracking-wider text-[10px]">{t.visitorsFrom}</span>
            <span className="text-base">🇰🇷</span>
            <span className="text-base">🇸🇦</span>
            <span className="text-base">🇦🇪</span>
            <span className="text-base">🇸🇬</span>
            <span className="text-base">🇲🇾</span>
            <span className="text-base">🇭🇰</span>
            <span className="text-base">🇺🇸</span>
            <span className="text-base">🇬🇧</span>
            <span className="text-base">🇦🇺</span>
            <span className="text-base">🇨🇳</span>
            <span className="text-base">🇯🇵</span>
            <span className="text-base">🇩🇪</span>
            <span className="font-bold text-[var(--fg)] ml-1">+18 countries</span>
          </div>
        </div>
      </section>

      {/* MEGA STATS BAR — accent gradient */}
      <section
        className="border-y border-[var(--border)] text-white"
        style={{ background: `linear-gradient(90deg, ${accent} 0%, ${accent}dd 50%, ${accent} 100%)` }}
      >
        <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-3 gap-4 text-center">
          <Stat big={focused.length.toLocaleString()} label={t.statClinics} />
          <Stat big={`${(totalReviews / 1000).toFixed(0)}K`} label={t.statReviews} />
          <Stat big={withScraped.toLocaleString()} label={t.statDeep} />
        </div>
      </section>

      {/* Multi-source visualization — clearly communicate aggregation site */}
      <SourcesStrip focus={cfg.focus} accent={accent} lang={lang} />

      {/* Why us vs them — focus-aware differentiation */}
      <ScrollReveal className="max-w-5xl mx-auto px-4 pt-10">
        <WhyUs focus={cfg.focus} lang={lang} />
      </ScrollReveal>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {heroClinic ? <SponsoredHero c={heroClinic} lang={lang} /> : top[0] ? <SpotlightCard c={top[0]} accent={accent} lang={lang} /> : null}

        {/* Ad slot — hero 직하 leaderboard */}
        <AdPlaceholder
          variant="banner"
          lang={lang}
          hint={lang === "ko" ? "프리미엄 클리닉 & 파트너 상단 노출" : lang === "th" ? "ตำแหน่งบนสุดสำหรับคลินิกพรีเมียมและพาร์ตเนอร์" : "Top placement for premium clinics & partners"}
        />

        {/* MANIFESTO — site-aware trust signals */}
        <section className="mb-12 grid md:grid-cols-3 gap-4">
          <Manifesto
            icon="🛡️"
            title={lang === "ko" ? "다중 출처 검증" : lang === "th" ? "ตรวจสอบจากหลายแหล่ง" : "Multi-source verified"}
            body={lang === "ko" ? (
              cfg.focus === "hair"
                ? "Google Maps + HDmall + Bookimed + Pantip + Reddit + Naver — 7개 이상 플랫폼을 교차 검증해서 가짜 리뷰 한 파도로 순위가 올라가지 못하게 합니다."
                : "Google Maps + HDmall + Wongnai + 파트너 플랫폼 — 여러 출처를 교차 검증해서 가짜 리뷰 한 파도로 순위가 올라가지 못하게 합니다."
            ) : lang === "th" ? (
              cfg.focus === "hair"
                ? "Google Maps + HDmall + Bookimed + Pantip + Reddit + Naver — เราตรวจสอบข้ามแพลตฟอร์ม 7+ แห่ง เพื่อไม่ให้รีวิวปลอมชุดเดียวดันอันดับคลินิกได้"
                : "Google Maps + HDmall + Wongnai + แพลตฟอร์มพาร์ตเนอร์ — เราตรวจสอบข้ามหลายแหล่ง เพื่อไม่ให้รีวิวปลอมชุดเดียวดันอันดับคลินิกได้"
            ) : (
              cfg.focus === "hair"
                ? "Google Maps + HDmall + Bookimed + Pantip + Reddit + Naver — we cross-reference 7+ platforms so a single fake-review wave can't lift any clinic's rank."
                : "Google Maps + HDmall + Wongnai + partner platforms — we cross-reference multiple sources so a single fake-review wave can't lift any clinic's rank."
            )}
            accent={accent}
          />
          <Manifesto
            icon="📊"
            title={lang === "ko" ? "신뢰도 점수" : lang === "th" ? "คะแนนความน่าเชื่อถือ" : "Trust Score"}
            body={lang === "ko"
              ? "평점 + 리뷰량 + Local Guide 신뢰도 + 리뷰어 권위. 모든 클리닉에 투명한 하나의 숫자."
              : lang === "th"
              ? "คะแนน + จำนวนรีวิว + ความน่าเชื่อถือของ Local Guide + อำนาจของผู้รีวิว ตัวเลขเดียวที่โปร่งใส ทุกคลินิก"
              : "Rating + review volume + Local Guide credibility + reviewer authority. One transparent number, every clinic."}
            accent={accent}
          />
          {cfg.focus === "dental" ? (
            <Manifesto
              icon="🦷"
              title={lang === "ko" ? "전문의 자격 검증" : lang === "th" ? "ตรวจสอบคุณสมบัติผู้เชี่ยวชาญ" : "Specialist credentials"}
              body={lang === "ko"
                ? "임플란트 브랜드 언급(Straumann, Nobel, Osstem)과 전문성 시그널을 추적합니다 — 임플란트 전문의 vs 일반 치과의, 영어/한국어 가능 여부, 미국/영국/일본 연수 여부."
                : lang === "th"
                ? "เราติดตามการกล่าวถึงแบรนด์รากฟันเทียม (Straumann, Nobel, Osstem) และสัญญาณความเชี่ยวชาญ — implantologist vs ทันตแพทย์ทั่วไป พูดอังกฤษ/เกาหลีได้ ฝึกอบรมจากสหรัฐ/อังกฤษ/ญี่ปุ่น"
                : "We track implant brand mentions (Straumann, Nobel, Osstem) and specialist signals — implantologist vs general dentist, English/Korean-speaking, US/UK/JP-trained."}
              accent={accent}
            />
          ) : cfg.focus === "hifu" || cfg.focus === "laser" ? (
            <Manifesto
              icon="⚡"
              title={lang === "ko" ? "장비 검증" : lang === "th" ? "ตรวจสอบเครื่องมือ" : "Machine verification"}
              body={lang === "ko"
                ? "리뷰에서 Ultherapy / Thermage / Ultraformer / Pico / CO2 브랜드 언급을 추적합니다 — 정품가 받으면서 저가 범용 장비 쓰는 클리닉을 골라냅니다."
                : lang === "th"
                ? "เราติดตามการกล่าวถึงแบรนด์ Ultherapy / Thermage / Ultraformer / Pico / CO2 ในรีวิว — จับคลินิกที่ใช้เครื่องทั่วไปแต่คิดราคาแบรนด์"
                : "We track Ultherapy / Thermage / Ultraformer / Pico / CO2 brand mentions in reviews — spot generic-machine clinics charging brand prices."}
              accent={accent}
            />
          ) : cfg.focus === "facial" ? (
            <Manifesto
              icon="✨"
              title={lang === "ko" ? "시술 깊이" : lang === "th" ? "ความลึกของหัตถการ" : "Treatment depth"}
              body={lang === "ko"
                ? "HydraFacial, LED, 산소, 필링, 브라이트닝 — 각 클리닉이 실제로 하는 시술을 추적합니다(광고 문구가 아니라)."
                : lang === "th"
                ? "HydraFacial, LED, ออกซิเจน, ผลัดเซลล์ผิว, ทำให้ผิวกระจ่างใส — เราติดตามหัตถการที่คลินิกทำจริง (ไม่ใช่แค่คำโฆษณา)"
                : "HydraFacial, LED, oxygen, chemical peel, brightening — we track which treatments each clinic actually performs (vs marketing claims)."}
              accent={accent}
            />
          ) : (
            <Manifesto
              icon="💉"
              title={lang === "ko" ? "브랜드 검증" : lang === "th" ? "ตรวจสอบแบรนด์" : "Brand verification"}
              body={lang === "ko"
                ? "리뷰에서 Allergan / Dysport / Botulax / Juvederm / Restylane 언급을 추적합니다 — 가짜 제품 주장을 골라냅니다."
                : lang === "th"
                ? "เราติดตามการกล่าวถึง Allergan / Dysport / Botulax / Juvederm / Restylane ในรีวิว — จับข้อกล่าวอ้างผลิตภัณฑ์ปลอม"
                : "We track Allergan / Dysport / Botulax / Juvederm / Restylane mentions in reviews — spot fake product claims."}
              accent={accent}
            />
          )}
        </section>

        {/* Dental: Browse by procedure */}
        {cfg.focus === "dental" && (
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-4">{lang === "ko" ? "시술별 보기" : lang === "th" ? "เลือกตามหัตถการ" : "Browse by procedure"}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {[
                { label: "🦷 Implants",     href: "/city/bangkok/implants" },
                { label: "💎 Veneers",      href: "/city/bangkok/veneers" },
                { label: "✨ Whitening",    href: "/city/bangkok/whitening" },
                { label: "📐 Orthodontics", href: "/city/bangkok/orthodontics" },
                { label: "🩺 Root Canal",   href: "/city/bangkok/root-canal" },
              ].map((p) => (
                <a
                  key={p.href}
                  href={p.href}
                  className="border border-[var(--border)] rounded-xl p-3 text-center text-sm font-medium hover:bg-emerald-50 hover:border-emerald-300 transition"
                >
                  {p.label}
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Botox: Browse by treatment */}
        {cfg.focus === "botox" && (
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-4">{lang === "ko" ? "시술별 보기" : lang === "th" ? "เลือกตามหัตถการ" : "Browse by treatment"}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {[
                { label: "💉 Botox",      href: "/c/botox" },
                { label: "💧 Filler",     href: "/c/filler" },
                { label: "⚡ HIFU",       href: "/c/hifu" },
                { label: "✨ Laser",      href: "/c/laser" },
                { label: "🌸 Facial",     href: "/c/facial" },
              ].map((p) => (
                <a
                  key={p.href}
                  href={p.href}
                  className="border border-[var(--border)] rounded-xl p-3 text-center text-sm font-medium hover:bg-purple-50 hover:border-purple-300 transition"
                >
                  {p.label}
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Hair: Browse by treatment */}
        {cfg.focus === "hair" && (
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-4">{lang === "ko" ? "시술별 보기" : lang === "th" ? "เลือกตามหัตถการ" : "Browse by treatment"}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {[
                { label: "💇 FUE Transplant",  href: "/c/hair_transplant" },
                { label: "🔬 DHI Transplant",  href: "/c/hair_transplant" },
                { label: "🎨 SMP",             href: "/c/hair_transplant" },
                { label: "💉 PRP Therapy",     href: "/c/hair_transplant" },
                { label: "💪 Men's Clinic",    href: "/c/hair_transplant" },
              ].map((p) => (
                <a
                  key={p.label}
                  href={p.href}
                  className="border border-[var(--border)] rounded-xl p-3 text-center text-sm font-medium hover:bg-amber-50 hover:border-amber-300 transition"
                >
                  {p.label}
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Dental: Why Bangkok stat strip */}
        {cfg.focus === "dental" && (
          <section className="mb-10 bg-emerald-50 rounded-xl p-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold text-emerald-700">1,608+</p>
                <p className="text-sm text-[var(--muted)] mt-1">{lang === "ko" ? "태국 치과 클리닉" : lang === "th" ? "คลินิกทันตกรรมในไทย" : "dental clinics in Thailand"}</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-emerald-700">50–70%</p>
                <p className="text-sm text-[var(--muted)] mt-1">{lang === "ko" ? "미국·영국 대비 저렴" : lang === "th" ? "ถูกกว่าสหรัฐฯ และอังกฤษ" : "cheaper than US & UK"}</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-emerald-700">{lang === "ko" ? "영어가능" : lang === "th" ? "อังกฤษได้" : "English"}</p>
                <p className="text-sm text-[var(--muted)] mt-1">{lang === "ko" ? "주요 클리닉 영어 가능 직원" : lang === "th" ? "พนักงานพูดภาษาอังกฤษที่คลินิกชั้นนำ" : "speaking staff at top clinics"}</p>
              </div>
            </div>
          </section>
        )}

        {/* Botox: Why Bangkok stat strip */}
        {cfg.focus === "botox" && (
          <section className="mb-10 bg-purple-50 rounded-xl p-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold text-purple-700">2,000+</p>
                <p className="text-sm text-[var(--muted)] mt-1">{lang === "ko" ? "방콕 미용 클리닉" : lang === "th" ? "คลินิกความงามในกรุงเทพ" : "aesthetic clinics in Bangkok"}</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-purple-700">50–70%</p>
                <p className="text-sm text-[var(--muted)] mt-1">{lang === "ko" ? "싱가포르·한국 대비 저렴" : lang === "th" ? "ถูกกว่าสิงคโปร์และเกาหลี" : "cheaper than Singapore & Korea"}</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-purple-700">{lang === "ko" ? "정품" : lang === "th" ? "ของแท้" : "Genuine"}</p>
                <p className="text-sm text-[var(--muted)] mt-1">{lang === "ko" ? "Allergan·Dysport 정품 확인" : lang === "th" ? "ยืนยัน Allergan และ Dysport" : "Allergan & Dysport verified"}</p>
              </div>
            </div>
          </section>
        )}

        {/* Hair: Why Bangkok stat strip */}
        {cfg.focus === "hair" && (
          <section className="mb-10 bg-amber-50 rounded-xl p-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold text-amber-700">฿65K–150K</p>
                <p className="text-sm text-[var(--muted)] mt-1">{lang === "ko" ? "FUE 이식(2,000모 기준)" : lang === "th" ? "ปลูกผม FUE (2,000 กราฟต์)" : "FUE transplant (2,000 grafts)"}</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-amber-700">40–60%</p>
                <p className="text-sm text-[var(--muted)] mt-1">{lang === "ko" ? "한국·싱가포르 대비 저렴" : lang === "th" ? "ถูกกว่าเกาหลีและสิงคโปร์" : "cheaper than Korea & Singapore"}</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-amber-700">4–5 days</p>
                <p className="text-sm text-[var(--muted)] mt-1">{lang === "ko" ? "평균 여행 기간" : lang === "th" ? "ระยะเวลาเดินทางโดยทั่วไป" : "typical trip duration"}</p>
              </div>
            </div>
          </section>
        )}

        {/* FEATURED 6 — bigger cards with photos */}
        {top.length >= 6 && (
          <section className="mb-12 scroll-mt-20" id="top6">
            <div className="flex items-baseline justify-between gap-4 mb-5">
              <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                {t.top6}
              </h2>
              <a href="/best/highly-recommended" className="text-sm font-medium hover:underline" style={{ color: accent }}>
                {t.seeFullRanking}
              </a>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {top.slice(0, 6).map((c, i) => {
                const photo = top6Photos[i]?.photos[0];
                return (
                  <a
                    key={c.id}
                    href={`${clinicPrefix}/clinic/${c.id}`}
                    className="group block border border-[var(--border)] rounded-2xl bg-white hover:shadow-xl hover:-translate-y-0.5 transition relative overflow-hidden"
                  >
                    {/* Photo header — 실제 사진 있을 때만 표시 */}
                    {photo ? (
                    <div className="relative h-32 w-full overflow-hidden">
                      <ClinicPhoto
                          src={photo.thumb}
                          alt={`${c.name} exterior`}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          placeholderIcon="🏥"
                        />
                      {/* Rank badge — top-left over photo */}
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/75 text-white text-xs font-black tabular-nums">
                        {t.rank}{i + 1}
                      </div>
                      {/* Trust Score badge — top-right over photo */}
                      <div
                        className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-white text-xs font-black tabular-nums"
                        style={{ background: c.trust_score >= 75 ? "#16a34a" : c.trust_score >= 60 ? "#059669" : "#ca8a04" }}
                      >
                        <span className="opacity-80 font-normal">{t.trust}</span> {formatTrustScore(c.trust_score)}
                      </div>
                    </div>
                    ) : (
                    <div className="flex items-center justify-between px-3 pt-3">
                      <span className="px-2 py-0.5 rounded-md bg-black/10 text-[var(--fg)] text-xs font-black tabular-nums">{t.rank}{i + 1}</span>
                      <span className="px-2 py-0.5 rounded-md text-white text-xs font-black tabular-nums" style={{ background: c.trust_score >= 75 ? "#16a34a" : c.trust_score >= 60 ? "#059669" : "#ca8a04" }}>
                        <span className="opacity-80 font-normal">{t.trust}</span> {formatTrustScore(c.trust_score)}
                      </span>
                    </div>
                    )}
                    <div className="p-5">
                      <h3 className="font-bold text-base group-hover:opacity-90 transition leading-tight mb-1" style={{ color: "var(--fg)" }}>{c.name}</h3>
                      <p className="text-sm text-[var(--muted)]">📍 {c.district}</p>
                      <div className="flex items-center gap-2 mt-3 text-xs text-[var(--muted)]">
                        <span className="text-yellow-700 font-bold">★ {c.rating.toFixed(1)}</span>
                        <span>·</span>
                        <span>{c.total_reviews.toLocaleString()} {t.reviews}</span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1">
                        {c.categories.slice(0, 2).map((cat) => (
                          <span
                            key={cat}
                            className="text-xs px-2 py-0.5 rounded-full inline-flex items-center gap-1 font-medium"
                            style={{ background: `${accent}15`, color: accent }}
                          >
                            <CategoryIcon category={cat} size={11} />
                            {CATEGORY_LABELS[cat] ?? cat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </section>
        )}

        {/* Ad slot — Top 6 직하, 가장 viewing 많은 자리 */}
        <AdPlaceholder
          variant="banner"
          lang={lang}
          hint={lang === "ko" ? "중간 콘텐츠 위치 · 스크롤 70% 지점" : lang === "th" ? "ตำแหน่งกลางเนื้อหา · ความลึกสกรอลล์ ~70%" : "Mid-content placement · ~70% scroll depth"}
        />

        {/* REAL REVIEW QUOTES */}
        {reviewQuotes.length >= 3 && (
          <section className="mb-12">
            <div className="flex items-baseline justify-between gap-4 mb-5">
              <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                {t.realPatients}
              </h2>
              <span className="text-xs text-[var(--muted)]">{t.fromVerified}</span>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {reviewQuotes.map((q, i) => (
                <a
                  key={i}
                  href={`${clinicPrefix}/clinic/${q.id}`}
                  className="group block bg-white border border-[var(--border)] rounded-2xl p-5 hover:shadow-md transition"
                >
                  <div className="text-3xl leading-none mb-2" style={{ color: accent }}>"</div>
                  <p className="text-sm leading-relaxed mb-4 line-clamp-4">{q.review.text}</p>
                  <div className="border-t border-[var(--border)] pt-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-bold text-sm truncate group-hover:opacity-80 transition" style={{ color: "var(--fg)" }}>
                        {q.clinic}
                      </div>
                      <div className="text-xs text-[var(--muted)] truncate">{q.district}</div>
                    </div>
                    <div className="text-yellow-700 font-bold text-sm shrink-0">★ {q.rating.toFixed(1)}</div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* By City — 도시 2개 이상일 때만 표시 (Bangkok만 있으면 의미 없음) */}
        {cities.length >= 2 && (
          <section className="mb-10">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">{t.byCity}</h2>
            <div className="flex flex-wrap gap-2">
              {cities.map(([label, { slug, count }]) => (
                <a
                  key={label}
                  href={`/city/${slug}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border)] text-sm bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition font-medium"
                >
                  🏙️ {label}
                  <span className="text-[var(--muted)] tabular-nums">{count}</span>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* By Service — 카테고리 2개 이상일 때만 (dental/hair 단일 focus 사이트는 섹션 숨김) */}
        {categories.length > 1 && (
          <section className="mb-10">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">{t.byService}</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map(([cat, count]) => (
                <a
                  key={cat}
                  href={`${servicePrefix}/c/${cat}`}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
                >
                  <CategoryIcon category={cat} size={14} />
                  {CATEGORY_LABELS[cat] ?? cat}
                  <span className="text-[var(--muted)] tabular-nums">{count}</span>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Quick compare CTA — top 4 clinics paired up (ranked, not DB order) */}
        {top.length >= 4 && (() => {
          const top4 = top.slice(0, 4);
          return (
            <section className="mb-10">
              <div className="flex items-baseline justify-between gap-4 mb-4">
                <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--muted)]">{t.compareTop}</h2>
                <span className="text-xs text-[var(--muted)]">{t.sideBySide}</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {([[top4[0], top4[1]], [top4[2], top4[3]]] as [typeof top4[0], typeof top4[0]][]).map(([x, y]) => x && y ? (
                  <a key={`${x.id}-${y.id}`} href={`/compare/${x.id}/${y.id}`} rel="nofollow"
                    className="group flex items-center gap-3 p-4 rounded-xl border border-[var(--border)] bg-white hover:border-[var(--accent)] transition">
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="text-xs font-medium truncate">{x.name}</div>
                      <div className="text-[10px] font-bold text-[var(--muted)]">vs</div>
                      <div className="text-xs font-medium truncate">{y.name}</div>
                    </div>
                    <span className="text-lg text-[var(--muted)] group-hover:text-[var(--accent)] transition shrink-0">⚖️</span>
                  </a>
                ) : null)}
              </div>
            </section>
          );
        })()}

        {/* Netflix-style city rows — only shown when 2+ cities exist (single-city focus doesn't need it). */}
        {(() => {
          const cityClinics = new Map<string, typeof focused>();
          for (const c of focused) {
            if (!c.city_label) continue;
            const cur = cityClinics.get(c.city_label) ?? [];
            cur.push(c);
            cityClinics.set(c.city_label, cur);
          }
          const topCities = [...cityClinics.entries()].sort((a, b) => b[1].length - a[1].length).slice(0, 3);
          if (topCities.length < 2) return null;
          return (
            <div className="mb-12 space-y-10">
              {topCities.map(([city, clinics]) => (
                <CityRow
                  key={city}
                  city={city}
                  total={clinics.length}
                  seeAllHref={`/city/${(clinics[0]?.city_slug ?? city).toLowerCase().replace(/\s+/g, "-")}`}
                  lang={lang}
                >
                  {clinics.slice(0, 12).map((c, idx) => (
                    <div key={c.id} className="w-[280px] shrink-0 snap-start sm:w-[320px]">
                      <ClinicCardCompact clinic={c} rank={idx + 1} lang={lang} />
                    </div>
                  ))}
                </CityRow>
              ))}
            </div>
          );
        })()}

        <section className="mb-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
            {lang === "ko" ? "지역별" : lang === "th" ? "ตามเขต" : "By District"}{dominantCity ? ` · ${dominantCity}` : ""}
          </h2>
          <div className="flex flex-wrap gap-2">
            {districts.map(([d, count]) => (
              <a
                key={d}
                href={`/d/${encodeURIComponent(d.toLowerCase().replace(/\s+/g, "-"))}`}
                // inline-flex items-center — 모바일 min-height:44px 규칙(globals.css)이
                // 일반 inline <a>엔 안 먹어서 텍스트가 칩 위쪽에 붙어있었음
                // ("By City" 칩은 이미 이 패턴이라 정상이었음, 2026-07-28 감사)
                className="inline-flex items-center px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
              >
                📍 {d} <span className="text-[var(--muted)] tabular-nums">{count}</span>
              </a>
            ))}
          </div>
        </section>

        {/* Guides promo — focus 맞는 가이드만 (dental 사이트에 botox 가이드 X). */}
        {(() => { const focusGuides = guidesForFocus(cfg.focus); return focusGuides.length > 0 && (
          <section className="mb-12 border border-[var(--border)] rounded-2xl bg-slate-50/40 p-6 md:p-8">
            <div className="flex items-baseline justify-between gap-4 mb-4 flex-wrap">
              <div>
                <h2 className="text-xl md:text-2xl font-black tracking-tight">{t.editorsGuides}</h2>
                <p className="text-sm text-[var(--muted)] mt-1">{t.guidesSub}</p>
              </div>
              <a href="/guide" className="text-sm font-bold hover:underline" style={{ color: accent }}>{t.allGuides}</a>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              {focusGuides.map((g) => (
                <a
                  key={g.slug}
                  href={`/guide/${g.slug}`}
                  className="block bg-white rounded-xl border border-[var(--border)] p-4 hover:shadow-md transition"
                >
                  <div className="font-bold text-sm leading-tight mb-1">{g.title.replace(/ \(\d{4}\)$/, "")}</div>
                  <p className="text-xs text-[var(--muted)] line-clamp-2 leading-relaxed">{g.metaDescription}</p>
                </a>
              ))}
            </div>
          </section>
        ); })()}

        {/* Hidden Gem — 매일 다른 underrated 클리닉 spotlight */}
        {gemPick && (
          <HiddenGem pool={[gemPick]} accent={accent} photo={gemPhoto?.photos[0]} lang={lang} />
        )}

        {/* GAME WIDGET — random clinic reveal. Increases session time. */}
        {top.length >= 10 && (
          <SpinDiscover
            accent={accent}
            lang={lang}
            pool={top.slice(0, 50).map((c, i) => ({
              id: c.id,
              name: c.name,
              district: c.district,
              rating: c.rating,
              trust_score: c.trust_score,
              total_reviews: c.total_reviews,
              photo: topPhotos[i]?.photos[0]?.thumb,
            }))}
          />
        )}

        <section>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-5">{t.topN.replace("{n}", String(Math.min(top.length, 50)))}</h2>
          <div className="grid gap-3">
            {top.slice(0, 10).map((c, i) => (
              <ClinicCard key={c.id} clinic={c} rank={i + 1} lang={lang} />
            ))}
          </div>

          <AffiliateInline lang={lang} />

          {top.length > 10 && (
            <div className="mt-8">
              <div className="flex items-baseline justify-between mb-3">
                <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--muted)]">
                  {t.runnerUp.replace("{n}", String(top.length))}
                </h3>
                <span className="text-xs text-[var(--muted)] hidden sm:inline">
                  {t.sameDepth}
                </span>
              </div>
              <div className="grid gap-1.5">
                {top.slice(10).map((c, i) => (
                  <ClinicCardCompact key={c.id} clinic={c} rank={i + 11} lang={lang} />
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Dental: Guide links */}
        {cfg.focus === "dental" && (
          <section className="mt-10">
            <h2 className="text-xl font-bold mb-4">{lang === "ko" ? "치과 가이드" : lang === "th" ? "คู่มือทันตกรรม" : "Dental guides"}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { title: "Implants Cost Guide",  href: "/guide/dental-implants-bangkok-cost", desc: "Brands, timeline, what to pay" },
                { title: "Veneers Price Guide",  href: "/guide/veneers-bangkok-price",        desc: "Porcelain, E.max, composite" },
                { title: "Whitening Guide",      href: "/guide/teeth-whitening-bangkok",      desc: "Zoom vs take-home trays" },
              ].map((g) => (
                <a
                  key={g.href}
                  href={g.href}
                  className="border border-[var(--border)] rounded-xl p-4 hover:bg-gray-50 transition"
                >
                  <p className="font-semibold text-sm">{g.title}</p>
                  <p className="text-xs text-[var(--muted)] mt-1">{g.desc}</p>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Botox: Guide links */}
        {cfg.focus === "botox" && (
          <section className="mt-10">
            <h2 className="text-xl font-bold mb-4">{lang === "ko" ? "보톡스 가이드" : lang === "th" ? "คู่มือโบท็อกซ์" : "Botox guides"}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { title: "Jaw Slimming Guide",   href: "/guide/masseter-botox-bangkok-jaw-slimming", desc: "V-line results, units, cost" },
                { title: "HIFU Bangkok Guide",   href: "/guide/hifu-ultherapy-bangkok-cost",         desc: "Ultherapy vs Korean machines" },
                { title: "Forehead Botox Guide", href: "/guide/botox-forehead-bangkok",              desc: "Areas, units, natural results" },
              ].map((g) => (
                <a
                  key={g.href}
                  href={g.href}
                  className="border border-[var(--border)] rounded-xl p-4 hover:bg-gray-50 transition"
                >
                  <p className="font-semibold text-sm">{g.title}</p>
                  <p className="text-xs text-[var(--muted)] mt-1">{g.desc}</p>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Hair: Guide links */}
        {cfg.focus === "hair" && (
          <section className="mt-10">
            <h2 className="text-xl font-bold mb-4">{lang === "ko" ? "모발이식 가이드" : lang === "th" ? "คู่มือปลูกผม" : "Hair transplant guides"}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { title: "FUE Cost Guide",     href: "/guide/fue-hair-transplant-bangkok-cost", desc: "Grafts, pricing, trip planning" },
                { title: "DHI vs FUE Guide",   href: "/guide/dhi-vs-fue-bangkok",               desc: "Which technique suits you" },
                { title: "SMP Bangkok Guide",  href: "/guide/smp-scalp-micropigmentation-bangkok", desc: "Non-surgical option, cost & sessions" },
              ].map((g) => (
                <a
                  key={g.href}
                  href={g.href}
                  className="border border-[var(--border)] rounded-xl p-4 hover:bg-gray-50 transition"
                >
                  <p className="font-semibold text-sm">{g.title}</p>
                  <p className="text-xs text-[var(--muted)] mt-1">{g.desc}</p>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Patient community count */}
        <div className="mb-8">
          <PatientCommunityCount lang={lang} />
        </div>

        {/* Downloadable buyer's guide — lead magnet */}
        <div className="mb-10">
          <DownloadableGuide focus={cfg.focus} />
        </div>

        {/* Free membership perks strip */}
        <div className="mb-10">
          <MemberPerksStrip />
        </div>

        {/* Curated focus-aware collections */}
        <ScrollReveal>
          <CuratedCollections clinics={focused} focus={cfg.focus} lang={lang} />
        </ScrollReveal>

        {/* Patient-voice marquee — final persuasion before booking */}
        <ScrollReveal direction="scale">
          <TestimonialMarquee clinics={top} lang={lang} />
        </ScrollReveal>

        {/* Ad slot — booking 직전 */}
        <AdPlaceholder
          variant="banner"
          lang={lang}
          hint={lang === "ko" ? "예약 전 하단 노출" : lang === "th" ? "ตำแหน่งล่างสุดก่อนการจอง" : "Bottom placement before booking"}
        />

        <section className="mt-12 scroll-mt-20" id="booking">
          <BookingForm lang={lang} />
        </section>

        <section className="mt-10">
          <AfterSubmitFlow lang={lang} />
        </section>

        <section className="mt-12">
          <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-5">{t.faq}</h2>
          <div className="space-y-3">
            {homeFaqs.map((f, i) => (
              <details key={i} className="bg-white border border-[var(--border)] rounded-lg p-4 group">
                <summary className="font-medium cursor-pointer flex items-center justify-between gap-3">
                  <span>{f.q}</span>
                  <span className="text-[var(--muted)] group-open:rotate-180 transition">⌄</span>
                </summary>
                <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <FaqJsonLd faqs={homeFaqs} />
        <ItemListJsonLd
          name={`Top ${cfg.brand} by Trust Score`}
          items={top.slice(0, 20).map((c) => ({
            name: c.name,
            url: `/clinic/${c.id}`,
          }))}
        />
      </div>
    </>
  );
}

function Stat({ big, label }: { big: string; label: string }) {
  return (
    <div>
      <div className="text-3xl md:text-5xl font-black tabular-nums leading-none">{big}</div>
      <div className="text-[10px] md:text-xs uppercase tracking-widest opacity-90 mt-1.5 font-bold">{label}</div>
    </div>
  );
}

function Manifesto({ icon, title, body, accent }: { icon: string; title: string; body: string; accent: string }) {
  return (
    <div
      className="p-5 rounded-2xl border border-[var(--border)] bg-white hover:shadow-md transition"
      style={{ borderTop: `3px solid ${accent}` }}
    >
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-bold text-base mb-1">{title}</h3>
      <p className="text-sm text-[var(--muted)] leading-relaxed">{body}</p>
    </div>
  );
}
