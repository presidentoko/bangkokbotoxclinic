import { loadMasterDb, topByTrust } from "@/lib/data";
import { getSlugMap, restaurantUrl, slugifySegment } from "@/lib/restaurants";
import { RestaurantCard } from "@/components/RestaurantCard";
import { CUISINE_LABELS, CUISINE_ICONS } from "@/lib/types";
import { FaqJsonLd, ItemListJsonLd } from "@/components/JsonLd";
import { AffiliateInline, AdSlot } from "@/components/AffiliateSlot";
import { StatsBar } from "@/components/StatsBar";
import { HeroSearch } from "@/components/HeroSearch";
import { sortWithSponsored } from "@/lib/sponsored";
import { NICHES, loadNicheDb } from "@/lib/niches";
import type { NicheSlug } from "@/lib/niches";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "방콕 맛집 — 인스타 말고 진짜 후기로 찾자",
  description:
    "방콕과 파타야의 맛집 디렉토리. 인플루언서 광고 아닌 실제 Google 리뷰 분석으로 신뢰도 점수 매김. 한식, 일식, 태국요리, 이탈리안, 할랄까지.",
  alternates: {
    canonical: "/ko",
    languages: { "ko": "/ko", "th": "/th", "en": "/", "ja": "/ja", "ru": "/ru", "ar": "/ar", "x-default": "/" },
  },
  openGraph: { locale: "ko_KR" },
};

const KO_NICHE_LABELS: Record<string, string> = {
  "muay-thai": "무에타이",
  "spa": "스파·마사지",
  "wellness": "웰니스",
  "yoga-pilates": "요가·필라테스",
  "cooking": "쿠킹클래스",
  "coworking": "코워킹",
  "diving": "다이빙",
};

const KO_FAQS = [
  {
    q: "신뢰도 점수는 어떻게 계산되나요?",
    a: "0-100 점수로 4가지 시그널을 합산: Google 평점 (50% 가중치), 리뷰 수 logarithmic scale (40%), Google Local Guide 리뷰어 비율 (10%), 평균 리뷰어 권위 점수 (5%). Google 순위가 아닌 자체 메트릭이며 30분마다 갱신됩니다.",
  },
  {
    q: "여기 정보 믿을 수 있나요?",
    a: "모든 평점, 리뷰 수, 리뷰 텍스트는 Google Maps 공개 데이터에서 직접 가져옵니다. 편집하거나 필터링하지 않습니다. 인플루언서 협찬이나 유료 후기는 일절 표시하지 않습니다.",
  },
  {
    q: "한국어 리뷰만 볼 수 있나요?",
    a: "현재 대부분 리뷰는 영어로 작성됩니다 (Google이 자동 번역). 한국인 리뷰어 비율은 식당당 보통 1-3% 입니다. 향후 한국어 리뷰 별도 표시 기능 추가 예정.",
  },
  {
    q: "예약은 어떻게 하나요?",
    a: "방콕 식당들은 대부분 워크인이거나 LINE/전화로 직접 예약합니다. 각 식당 페이지에서 'Call' 버튼 또는 식당 웹사이트 링크로 직접 연락하세요.",
  },
  {
    q: "광고나 협찬이 있나요?",
    a: "일반 리스트는 무료입니다. Editor's Pick / Recommended / Featured 표시가 있는 슬롯만 유료이며, 명확히 라벨링되어 있습니다. 일반 식당을 삭제하거나 순위에서 떨어뜨리지 않습니다.",
  },
];

export default async function KoHomePage() {
  const [db, slugMap, nicheResults] = await Promise.all([
    loadMasterDb(),
    getSlugMap(),
    Promise.all(NICHES.map((n) => loadNicheDb(n.slug as NicheSlug).then((d) => ({ slug: n.slug, icon: n.icon, label: n.label, total: d.total })).catch(() => ({ slug: n.slug, icon: n.icon, label: n.label, total: 0 })))),
  ]);
  const nicheCounts = nicheResults;
  const top = sortWithSponsored(topByTrust(db.restaurants, 30));

  const totalReviews = db.restaurants.reduce((s, r) => s + r.total_reviews, 0);
  const withScraped = db.restaurants.filter((r) => r.scraped_review_count > 0).length;

  const districtMap = new Map<string, { city: string; count: number }>();
  for (const r of db.restaurants) {
    if (r.district) {
      const key = `${r.city}|${r.district}`;
      const existing = districtMap.get(key);
      districtMap.set(key, { city: r.city, count: (existing?.count ?? 0) + 1 });
    }
  }
  const districts = [...districtMap.entries()]
    .map(([key, v]) => ({ district: key.split("|")[1], city: v.city, count: v.count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);

  const cuisines = Object.entries(db.cuisine_counts);

  return (
    <div lang="ko">
      <section className="border-b border-[var(--border)]">
        <div className="max-w-3xl mx-auto px-4 pt-12 pb-8 text-center">
          <div className="text-xs uppercase tracking-wider text-[var(--muted)] mb-3">
            한국어 · <a href="/" className="underline hover:text-[var(--fg)]">English</a> · <a href="/th" className="underline hover:text-[var(--fg)]">ภาษาไทย</a>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 text-balance">
            인스타 말고 <span className="text-orange-600">진짜 후기</span>로 방콕 맛집 찾자
          </h1>
          <p className="text-base md:text-lg text-[var(--muted)] mb-6">
            {db.total_restaurants.toLocaleString()}개 식당 · {totalReviews.toLocaleString()}개 Google 리뷰 분석 · 인플루언서 협찬 없음
          </p>
          <div className="max-w-2xl mx-auto">
            <HeroSearch
              entities={db.restaurants.map((r) => ({
                id: restaurantUrl(slugMap[r.id] ?? { city: r.city, district: r.district || "other", slug: r.id }).slice(1),
                name: r.name, district: r.district,
                city_label: r.city_label, rating: r.rating, trust_score: r.trust_score,
              }))}
              hrefBase=""
              popularSearches={cuisines.slice(0, 4).map(([cat]) => ({
                label: CUISINE_LABELS[cat] ?? cat,
                href: `/restaurants/cuisine/${cat}`,
              }))}
              popularLabel="인기"
              searchLang="ko"
            />
          </div>
        </div>
      </section>

      <StatsBar
        generatedAt={db.generated_at}
        totalClinics={db.total_restaurants}
        totalReviews={totalReviews}
        withScraped={withScraped}
        entityLabel="식당"
        label="리뷰로 검증됨"
      />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {cuisines.length > 0 && (
          <section className="mb-10">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">음식 종류별</h2>
            <div className="flex flex-wrap gap-2">
              {cuisines.map(([cat, count]) => (
                <a
                  key={cat}
                  href={`/restaurants/cuisine/${cat}`}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
                >
                  <span aria-hidden>{CUISINE_ICONS[cat] ?? "🍴"}</span>
                  {CUISINE_LABELS[cat] ?? cat}
                  <span className="text-[var(--muted)] tabular-nums">{count}</span>
                </a>
              ))}
            </div>
          </section>
        )}

        <section className="mb-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">지역별</h2>
          <div className="flex flex-wrap gap-2">
            {districts.map(({ district: d, city, count }) => (
              <a
                key={`${city}-${d}`}
                href={`/restaurants/${city}/${slugifySegment(d)}`}
                className="px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
              >
                📍 {d} <span className="text-[var(--muted)] tabular-nums">{count}</span>
              </a>
            ))}
          </div>
        </section>

        {/* 액티비티 섹션 */}
        <section className="mb-10">
          <div className="flex items-baseline justify-between gap-4 mb-3 flex-wrap">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">방콕 액티비티</h2>
            <a href="/activities" className="text-xs text-[var(--muted)] hover:text-black">전체 보기 →</a>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {nicheCounts.map((n) => (
              <a
                key={n.slug}
                href={`/activities/${n.slug}`}
                className="group block bg-white border border-[var(--border)] rounded-2xl p-4 hover:border-orange-300 hover:shadow-md transition text-center"
              >
                <div className="text-3xl mb-2">{n.icon}</div>
                <div className="font-bold text-sm group-hover:text-orange-600 transition leading-tight">{KO_NICHE_LABELS[n.slug as string] ?? n.label}</div>
                <div className="text-xs text-[var(--muted)] mt-1">{n.total.toLocaleString()}개</div>
              </a>
            ))}
          </div>
          <div className="mt-3 p-4 rounded-xl bg-purple-50 border border-purple-100 text-sm text-purple-800">
            🇰🇷 한국어 사용 가능한 시설을 찾으시나요? 각 카테고리 페이지에서 <strong>한국어</strong> 배지를 확인하세요.
          </div>
        </section>

        <AdSlot slot="ko-home-mid" />

        <section>
          <h2 className="text-xl font-bold mb-4">신뢰도 Top {Math.min(top.length, 30)}</h2>
          <div className="grid gap-3">
            {top.slice(0, 10).map((r, i) => (
              <RestaurantCard key={r.id} r={r} rank={i + 1} slugMap={slugMap} />
            ))}
          </div>
          <AffiliateInline />
          <div className="grid gap-3 mt-3">
            {top.slice(10).map((r, i) => (
              <RestaurantCard key={r.id} r={r} rank={i + 11} slugMap={slugMap} />
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
          name="방콕 식당 신뢰도 Top 20"
          items={top.slice(0, 20).map((r) => ({ name: r.name, url: restaurantUrl(slugMap[r.id] ?? { city: r.city, district: r.district || "other", slug: r.id }) }))}
        />
      </div>
    </div>
  );
}
