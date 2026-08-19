import { loadMasterDb, topByTrust } from "@/lib/data";
import { RestaurantCard } from "@/components/RestaurantCard";
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/lib/types";
import { FaqJsonLd, ItemListJsonLd } from "@/components/JsonLd";
import { AffiliateInline, AdSlot } from "@/components/AffiliateSlot";
import { StatsBar } from "@/components/StatsBar";
import { sortWithSponsored } from "@/lib/sponsored";
import { BEST_FOR } from "@/lib/bestFor";
import { HeroSearch } from "@/components/HeroSearch";
import { GUIDES_KO } from "@/lib/guides_ko";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "태국 골프 가이드 — 한국 골퍼 위한 진짜 후기",
  description:
    "태국 골프장 디렉토리. 인플루언서 협찬 없이 실제 Google 리뷰 분석으로 신뢰도 점수. 방콕·파타야·후아힌·치앙마이·푸켓 코스. 한국어 캐디·한국인 그룹 인기 코스 표시.",
  alternates: {
    canonical: "/ko",
    languages: { "ko-KR": "/ko", "th-TH": "/th", "en-US": "/" },
    // 네이버 서치어드바이저가 RSS 를 자동으로 찾아가도록 <link rel="alternate"> 로 건다.
    types: { "application/rss+xml": [{ url: "/ko/feed.xml", title: "태국 골프 가이드 - 한국어" }] },
  },
  openGraph: { locale: "ko_KR" },
};

const KO_FAQS = [
  {
    q: "신뢰도 점수는 어떻게 계산되나요?",
    a: "0-100 점수로 4가지 시그널을 합산: Google 평점 (50% 가중치), 리뷰 수 logarithmic scale (40%), Google Local Guide 리뷰어 비율 (10%), 평균 리뷰어 권위 점수 (5%). Google 순위가 아닌 자체 메트릭이며 지속적으로 갱신됩니다.",
  },
  {
    q: "한국어 캐디가 있는 코스를 어떻게 찾나요?",
    a: "각 코스 상세 페이지에서 'Korean caddy' 토픽 멘션 수와 한국어 리뷰 비율을 확인할 수 있습니다. 한국 투어그룹이 자주 가는 코스들은 Best of → Korean-friendly 페이지에서 모아볼 수 있습니다. 캐디 배정은 코스 정책이라 100% 보장은 아닙니다 — 예약시 요청하세요.",
  },
  {
    q: "그린피는 얼마나 하나요?",
    a: "퍼블릭 코스 평일 ~฿1,500-3,000, 주말 ฿2,500-5,000. 컨트리클럽은 평일 ฿3,500부터 주말 ฿8,000+. 캐디피 (~฿400) 와 팁 (~฿400-500) 은 별도. 방콕 근교가 가장 비싸고 치앙마이·후아힌이 가성비 좋습니다.",
  },
  {
    q: "예약은 어떻게 하나요?",
    a: "한국 골퍼들은 보통 Golfsavers, Sawasdee Golf, 또는 호텔 컨시어지를 통해 예약합니다. 주말 인기 코스는 1-2주 전 매진. 평일은 1-3일 전 가능. 코스 웹사이트 직접 예약도 가능 (각 상세 페이지 링크).",
  },
  {
    q: "여기 정보 믿을 수 있나요?",
    a: "모든 평점, 리뷰 수, 리뷰 텍스트는 Google Maps 공개 데이터에서 직접 가져옵니다. 편집·필터링 안 합니다. 인플루언서 협찬·유료 후기 일절 없습니다. 단, 명확히 라벨링된 Editor's Pick / Recommended 슬롯만 유료입니다 — 일반 리스트는 절대 손대지 않습니다.",
  },
  {
    q: "캐디 팁 얼마나 줘야 하나요?",
    a: "캐디 팁은 ฿400-500 (USD 12-15) 이 통상. 코스 컨디션이 좋고 캐디가 도움됐으면 ฿600-800. 한국어 캐디는 보통 더 후하게 (฿600-1000). 캐디피는 그린피와 별도로 클럽하우스에서 결제합니다.",
  },
];

export default async function KoHomePage() {
  const db = await loadMasterDb();
  const top = sortWithSponsored(topByTrust(db.restaurants, 30));

  const totalReviews = db.restaurants.reduce((s, r) => s + r.total_reviews, 0);
  const withScraped = db.restaurants.filter((r) => r.scraped_review_count > 0).length;
  const koCourses = db.restaurants.filter((c) => (c.language_breakdown?.ko ?? 0) > 0).length;

  const searchIndex = db.restaurants.map((r) => ({
    id: r.id,
    name: r.name,
    district: r.district,
    city_label: r.city_label,
    rating: r.rating,
    trust_score: r.trust_score,
  }));

  const cities = Object.entries(db.city_counts).sort((a, b) => b[1] - a[1]);

  const districtMap = new Map<string, number>();
  for (const r of db.restaurants) {
    if (r.district) districtMap.set(r.district, (districtMap.get(r.district) ?? 0) + 1);
  }
  const districts = [...districtMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12);

  const categories = Object.entries(db.cuisine_counts).sort((a, b) => b[1] - a[1]);

  // KO 인기 코스 — 검증된 한국 친화 코스만, korean_score 정렬
  const koTop = [...db.restaurants]
    .filter((r) => r.is_korean_friendly)
    .sort((a, b) => (b.korean_score ?? 0) - (a.korean_score ?? 0))
    .slice(0, 20);
  const koFriendlyCount = db.restaurants.filter((r) => r.is_korean_friendly).length;

  return (
    <>
      <div className="text-center pt-6 text-xs uppercase tracking-wider text-[var(--muted)]">
        한국어 · <a href="/" className="underline hover:text-[var(--fg)]">English</a> · <a href="/th" className="underline hover:text-[var(--fg)]">ภาษาไทย</a>
      </div>
      <HeroSearch
        entities={searchIndex}
        hrefBase="/course"
        hero="인플루언서 말고 진짜 후기로 태국 골프장 찾자"
        heroSub={`${db.total_restaurants.toLocaleString()}개 코스 · ${totalReviews.toLocaleString()}개 Google 리뷰 분석 · ${koCourses}개 코스에 한국어 리뷰`}
        popularSearches={[
          { label: "방콕", href: "/city/bangkok" },
          { label: "파타야", href: "/city/chon_buri" },
          { label: "후아힌", href: "/city/prachuap_khiri_khan" },
          { label: "한국어 캐디", href: "/best/korean-friendly" },
        ]}
        popularLabel="인기"
        searchLang="ko"
      />

      <StatsBar
        generatedAt={db.generated_at}
        totalClinics={db.total_restaurants}
        totalReviews={totalReviews}
        withScraped={withScraped}
        entityLabel="코스"
        label="리뷰로 검증됨"
      />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Korean-verified courses — featured */}
        {koTop.length >= 6 && (
          <section className="mb-10">
            <div className="flex items-baseline justify-between gap-4 mb-4 flex-wrap">
              <h2 className="text-xl font-bold">🇰🇷 한국 친화 검증 코스 Top 10</h2>
              <a href="/ko/best/korean-friendly" className="text-sm font-bold hover:text-emerald-700 hover:underline">
                {koFriendlyCount}개 전체 보기 →
              </a>
            </div>
            <p className="text-sm text-[var(--muted)] mb-4">
              구글 리뷰 · 캐디 멘션 · 네이버 블로그 시그널로 자동 검증한 한국 친화 코스. 광고·큐레이션 0.
            </p>
            <div className="grid gap-3">
              {koTop.slice(0, 10).map((r, i) => (
                <RestaurantCard key={r.id} r={r} rank={i + 1} />
              ))}
            </div>
          </section>
        )}

        {cities.length > 1 && (
          <section className="mb-10">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">지역별</h2>
            <div className="flex flex-wrap gap-2">
              {cities.map(([city, count]) => (
                <a
                  key={city}
                  href={`/city/${city.toLowerCase().replace(/\s+/g, "_")}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border)] text-sm bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition font-medium"
                >
                  {city}
                  <span className="text-[var(--muted)] tabular-nums">{count}</span>
                </a>
              ))}
            </div>
          </section>
        )}

        {categories.length > 0 && (
          <section className="mb-10">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">코스 유형별</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map(([cat, count]) => (
                <a
                  key={cat}
                  href={`/c/${cat}`}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
                >
                  <span aria-hidden>{CATEGORY_ICONS[cat] ?? "⛳"}</span>
                  {CATEGORY_LABELS[cat] ?? cat}
                  <span className="text-[var(--muted)] tabular-nums">{count}</span>
                </a>
              ))}
            </div>
          </section>
        )}

        <section className="mb-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">한국어 가이드</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {GUIDES_KO.map((g) => (
              <a
                key={g.slug}
                href={`/ko/guide/${g.slug}`}
                className="block p-4 border border-[var(--border)] rounded-xl bg-white hover:border-[var(--accent)] hover:shadow-sm transition"
              >
                <div className="font-medium leading-tight">{g.title.replace(/ \(\d{4}\)$/, "")}</div>
                <p className="text-xs text-[var(--muted)] mt-1.5 leading-relaxed line-clamp-2">{g.metaDescription.slice(0, 90)}…</p>
              </a>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">테마별 추천</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
            {BEST_FOR.slice(0, 9).map((c) => (
              <a
                key={c.slug}
                href={`/best/${c.slug}`}
                className="block px-4 py-3 rounded-xl border border-[var(--border)] text-sm bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
              >
                {c.title.replace(/^Best |^Most /, "").replace(/ in Thailand$/, "")}
              </a>
            ))}
          </div>
        </section>

        <AdSlot slot="ko-home-mid" />

        <section>
          <h2 className="text-xl font-bold mb-4">신뢰도 Top {Math.min(top.length, 30)}</h2>
          <div className="grid gap-3">
            {top.slice(0, 10).map((r, i) => (
              <RestaurantCard key={r.id} r={r} rank={i + 1} />
            ))}
          </div>
          <AffiliateInline />
          <div className="grid gap-3 mt-3">
            {top.slice(10).map((r, i) => (
              <RestaurantCard key={r.id} r={r} rank={i + 11} />
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">지역별 (행정구)</h2>
          <div className="flex flex-wrap gap-2">
            {districts.map(([d, count]) => (
              <a
                key={d}
                href={`/d/${encodeURIComponent(d.toLowerCase().replace(/\s+/g, "-"))}`}
                className="px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
              >
                📍 {d} <span className="text-[var(--muted)] tabular-nums">{count}</span>
              </a>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-bold mb-4">자주 묻는 질문</h2>
          <div className="space-y-3">
            {KO_FAQS.map((f, i) => (
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

        <FaqJsonLd faqs={KO_FAQS} />
        <ItemListJsonLd
          name="태국 골프장 신뢰도 Top 20"
          items={top.slice(0, 20).map((r) => ({ name: r.name, url: `/course/${r.id}` }))}
        />
      </div>
    </>
  );
}
