import { loadMasterDb, topByFocusRelevance } from "@/lib/data";
import { ClinicCard } from "@/components/ClinicCard";
import { ClinicCardCompact } from "@/components/ClinicCardCompact";
import { CATEGORY_LABELS } from "@/lib/types";
import { FaqJsonLd, ItemListJsonLd } from "@/components/JsonLd";
import { AffiliateInline } from "@/components/AffiliateSlot";
import { CategoryIcon } from "@/components/CategoryIcon";
import { StatsBar } from "@/components/StatsBar";
import { HeroSearch } from "@/components/HeroSearch";
import { getSiteConfig, applySiteFilter } from "@/lib/site";
import { sortWithSponsored } from "@/lib/sponsored";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "방콕 보톡스 클리닉 — 인스타 말고 진짜 후기로 찾자",
  description:
    "방콕 클리닉 디렉토리. Google Maps 실제 후기 분석으로 신뢰도 점수 매김. 정품 보톡스, 영어 가능 직원, 한국인 의사 정보까지.",
  alternates: {
    canonical: "/ko",
    languages: { "ko-KR": "/ko", "th-TH": "/th", "en-US": "/" },
  },
  openGraph: { locale: "ko_KR" },
};

const KO_FAQS = [
  {
    q: "신뢰도 점수는 어떻게 계산되나요?",
    a: "0-100 점수로 4가지 시그널을 합산: Google 평점 (50% 가중치), 리뷰 수 logarithmic scale (40%), Google Local Guide 리뷰어 비율 (10%), 평균 리뷰어 권위 점수 (5%). 30분마다 갱신.",
  },
  {
    q: "방콕 보톡스 정품 어떻게 확인하나요?",
    a: "리뷰에 'genuine brand' / '정품' 언급 많은 클리닉이 신뢰할 만합니다. 시술 전 Allergan/Dysport/Botulax 박스 + 시리얼 스티커 직접 확인 요청하세요.",
  },
  {
    q: "방콕 시술 가격은 얼마인가요?",
    a: "보톡스: 유닛당 ฿80-250 (브랜드별 차이). 필러: 1ml당 ฿8,000-25,000. HIFU 1회: ฿8,000-80,000+. 클리닉별 정확한 가격은 LINE 또는 전화 문의.",
  },
  {
    q: "한국어 가능한 클리닉은 어디인가요?",
    a: "Sukhumvit Plaza (수쿰빗 12), Phrom Phong, Thong Lor 지역에 한국인 의사/통역 가능 클리닉 많음. 각 클리닉 페이지에서 'Korean-trained' 토픽 mention 확인.",
  },
  {
    q: "광고나 협찬이 있나요?",
    a: "Editor's Pick / Recommended / Featured 표시가 있는 슬롯만 유료. 일반 리스트는 모두 무료이며 Google 데이터 그대로 표시.",
  },
];

export default async function KoHomePage() {
  const cfg = getSiteConfig();
  const db = await loadMasterDb();
  const focused = applySiteFilter(db.clinics, cfg);
  const top = await sortWithSponsored(topByFocusRelevance(focused, cfg.focus, 30));

  const totalReviews = focused.reduce((s, c) => s + c.total_reviews, 0);
  const withScraped = focused.filter((c) => c.scraped_review_count > 0).length;

  const districtMap = new Map<string, number>();
  for (const c of focused) {
    if (c.district) districtMap.set(c.district, (districtMap.get(c.district) ?? 0) + 1);
  }
  const districts = [...districtMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12);

  const categoryMap = new Map<string, number>();
  for (const c of focused) {
    for (const cat of c.categories) categoryMap.set(cat, (categoryMap.get(cat) ?? 0) + 1);
  }
  const categories = [...categoryMap.entries()].sort((a, b) => b[1] - a[1]);

  return (
    <div lang="ko">
      <section className="border-b border-[var(--border)]">
        <div className="max-w-3xl mx-auto px-4 pt-12 pb-8 text-center">
          <div className="text-xs uppercase tracking-wider text-[var(--muted)] mb-3">
            한국어 · <a href="/" className="underline hover:text-[var(--fg)]">English</a> · <a href="/th" className="underline hover:text-[var(--fg)]">ภาษาไทย</a>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 text-balance">
            방콕 클리닉 — <span style={{ color: cfg.themeAccent }}>진짜 후기</span>로 검증
          </h1>
          <p className="text-base md:text-lg text-[var(--muted)] mb-6">
            {focused.length.toLocaleString()}개 클리닉 · {totalReviews.toLocaleString()}개 Google 리뷰 분석
          </p>
          <div className="max-w-2xl mx-auto">
            <HeroSearch
              entities={focused.map((c) => ({
                id: c.id, name: c.name, district: c.district,
                rating: c.rating, trust_score: c.trust_score,
              }))}
              hrefBase="/clinic"
              popularSearches={categories.slice(0, 4).map(([cat]) => ({
                label: CATEGORY_LABELS[cat] ?? cat,
                href: `/c/${cat}`,
              }))}
              popularLabel="인기"
              searchLang="ko"
            />
          </div>
        </div>
      </section>

      <StatsBar
        generatedAt={db.generated_at}
        totalClinics={focused.length}
        totalReviews={totalReviews}
        withScraped={withScraped}
        entityLabel="클리닉"
        label="리뷰로 검증됨"
      />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {categories.length > 0 && (
          <section className="mb-10">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">시술별</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map(([cat, count]) => (
                <a
                  key={cat}
                  href={`/c/${cat}`}
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

        <section className="mb-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">지역별</h2>
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

        {top.length >= 4 && (
          <section className="mb-10">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--muted)] mb-4">1:1 비교하기</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {([[top[0], top[1]], [top[2], top[3]]] as [typeof top[0], typeof top[0]][]).map(([x, y]) => x && y ? (
                <a key={`${x.id}-${y.id}`} href={`/compare/${x.id}/${y.id}`}
                  className="group flex items-center gap-3 p-4 rounded-xl border border-[var(--border)] bg-white hover:border-[var(--accent)] transition">
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="text-xs font-medium truncate">{x.name}</div>
                    <div className="text-[10px] font-bold text-[var(--muted)]">vs</div>
                    <div className="text-xs font-medium truncate">{y.name}</div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-[10px] text-[var(--muted)]">신뢰도</div>
                    <div className="text-xs font-bold">{x.trust_score.toFixed(0)} vs {y.trust_score.toFixed(0)}</div>
                  </div>
                  <span className="text-lg text-[var(--muted)] group-hover:text-[var(--accent)] transition">⚖️</span>
                </a>
              ) : null)}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-xl font-bold mb-4">신뢰도 Top {Math.min(top.length, 30)}</h2>
          <div className="grid gap-3">
            {top.slice(0, 10).map((c, i) => (
              <ClinicCard key={c.id} clinic={c} rank={i + 1} />
            ))}
          </div>
          <AffiliateInline />
          {top.length > 10 && (
            <div className="mt-8">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--muted)] mb-3">
                #11 – #{top.length} · 그 외 순위
              </h3>
              <div className="grid gap-1.5">
                {top.slice(10).map((c, i) => (
                  <ClinicCardCompact key={c.id} clinic={c} rank={i + 11} />
                ))}
              </div>
            </div>
          )}
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
          name="방콕 클리닉 신뢰도 Top 20"
          items={top.slice(0, 20).map((c) => ({ name: c.name, url: `/clinic/${c.id}` }))}
        />
      </div>
    </div>
  );
}
