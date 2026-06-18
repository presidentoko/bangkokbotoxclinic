import { loadMasterDb } from "@/lib/data";
import { RestaurantCard } from "@/components/RestaurantCard";
import { BreadcrumbJsonLd, ItemListJsonLd, FaqJsonLd } from "@/components/JsonLd";
import { AffiliateInline, AdSlot } from "@/components/AffiliateSlot";
import { TravelStackAffiliate } from "@/components/TravelStackAffiliate";
import { sortWithSponsored } from "@/lib/sponsored";
import type { Metadata } from "next";

export const dynamic = "force-static";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.thailandgolfguide.com";

export const metadata: Metadata = {
  title: "한국어 캐디 있는 태국 골프장 — 검증된 86개 코스 (2026)",
  description:
    "구글 리뷰에서 한국어 캐디·한국 골퍼 인기·네이버 블로그 매칭 시그널로 검증한 태국 골프장 86개. 방콕·파타야·후아힌·치앙마이·푸켓. 한국어 리뷰 수와 캐디 친화 점수 함께 표시.",
  alternates: {
    canonical: "/ko/best/korean-friendly",
    languages: {
      "ko-KR": "/ko/best/korean-friendly",
      "en-US": "/best/korean-friendly",
      "x-default": "/best/korean-friendly",
    },
  },
  openGraph: {
    locale: "ko_KR",
    title: "한국어 캐디 있는 태국 골프장 86개 — 진짜 후기로 검증",
    description: "구글 리뷰 + 네이버 블로그 시그널로 자동 검증한 한국 친화 태국 골프장 모음.",
  },
};

const KO_FAQS = [
  {
    q: "여기 '한국 친화' 어떻게 검증된 거죠?",
    a: "수작업 큐레이션이 아니라 구글 리뷰 시그널 4개로 자동 검증합니다. (1) 리뷰 텍스트에서 'Korean caddy / 한국 캐디' 명시 멘션, (2) Apify가 추출한 'korean_caddy' 토픽 카운트, (3) 한국어 리뷰 수, (4) 네이버 블로그 매칭. 이 중 하나라도 시그널 강도가 임계값 이상이면 자동으로 친화 코스로 등록됩니다. 현재 86개 코스가 통과.",
  },
  {
    q: "캐디가 한국어 한다고 100% 보장되나요?",
    a: "아니요 — 캐디 배정은 코스 운영진 재량이고 매번 한국어 캐디가 배정된다고 보장 못 합니다. 다만 한국어 캐디가 '존재한다'는 사실이 리뷰로 입증된 코스만 여기 노출됩니다. 예약시 명시적으로 'Korean caddy please / 한국어 가능한 캐디로 부탁드립니다' 라고 요청하면 거의 100% 배정해줍니다 (특히 한국 골퍼 트래픽 많은 파타야·치앙마이 코스).",
  },
  {
    q: "한국 골퍼들 평이 좋은 Top 3 코스는?",
    a: "ko_score 기준 (한국어 리뷰 수 + 캐디 멘션 + 네이버 블로그 가중치): 1) Phoenix Gold (파타야) — 한국 골프 투어 메카, 2) Alpine Golf Resort Chiangmai — Jack Nicklaus 디자인 시그너처, 3) Summit Green Valley (치앙마이) — 한국 골퍼 압도적 다수. 자세한 순위는 이 페이지 카드 정렬 기준.",
  },
  {
    q: "캐디 팁 얼마나 드려야?",
    a: "한국어 캐디는 일반 캐디 팁 (฿400-500) 보다 더 후하게 — ฿600-1,000 (USD 18-30) 이 통상. 라운드 만족스러웠으면 ฿1,000-1,500 까지도. 캐디피 (฿400, 클럽하우스 결제) 와는 별도로 라운드 끝나고 캐디에게 직접 현금으로 전달.",
  },
  {
    q: "Phoenix Gold·Alpine·Black Mountain 같은 유명 코스가 왜 없거나 위치가 다르죠?",
    a: "정렬은 ko_score (한국 친화 점수) 기준이라 한국 골퍼 리뷰 절대량이 많은 코스가 위로 옵니다. Black Mountain 처럼 평점은 높지만 한국 리뷰가 상대적으로 적은 코스는 점수가 낮을 수 있어요. 코스 자체 품질 순위는 /best/highly-recommended 페이지를 참고하세요.",
  },
  {
    q: "이 페이지 데이터는 얼마나 자주 갱신되나요?",
    a: "Master DB 가 새로 빌드될 때마다 (보통 주 1-2회) 자동 재라벨링됩니다. 구글에 새 한국어 리뷰가 달리면 다음 빌드 사이클에 반영. 수동 개입 없음 — 우리가 코스 평판을 임의로 조작하지 않습니다.",
  },
];

export default async function KoBestKoreanFriendlyPage() {
  const db = await loadMasterDb();
  const filtered = sortWithSponsored(
    db.restaurants
      .filter((r) => r.is_korean_friendly)
      .map((r) => ({
        ...r,
        _score:
          (r.korean_score ?? 0) * 2 +
          (r.is_korean_friendly ? 25 : 0) +
          (r.golf_score ?? 0) * 0.5 +
          r.trust_score * 0.5,
      }))
      .sort((a, b) => b._score - a._score)
      .slice(0, 100)
  );

  // City breakdown
  const cityCounts = filtered.reduce<Record<string, number>>((acc, r) => {
    const k = r.city_label || "?";
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});
  const cityRanked = Object.entries(cityCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="text-xs text-[var(--muted)] mb-2">
        한국어 ·{" "}
        <a href="/best/korean-friendly" className="underline hover:text-[var(--fg)]">English</a>
      </div>

      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/ko" className="hover:text-[var(--fg)]">홈</a>
        <span className="mx-2">›</span>
        <span>한국 친화 골프장</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 text-balance">
        한국어 캐디 있는 태국 골프장 — 검증된 {filtered.length}개 코스
      </h1>
      <p className="text-base text-[var(--muted)] leading-relaxed mb-3 max-w-3xl">
        한국 골퍼들이 실제 다녀온 후기로 검증된 태국 골프장만 모았습니다. 구글 리뷰의 한국어 캐디 멘션, 한국어 리뷰 비율, 네이버 블로그 매칭 — 세 가지 시그널을 합쳐 자동 라벨링했어요. <strong>수작업 큐레이션 0건, 광고 끼지 않음.</strong>
      </p>
      <p className="text-xs text-[var(--muted)] italic mb-8">
        ko_score 점수 순 정렬 (한국 골퍼 인기도 + 캐디 시그널 가중치). 코스 품질만 보고 싶으면{" "}
        <a href="/best/highly-recommended" className="underline hover:text-[var(--fg)]">/best/highly-recommended</a> 참고.
      </p>

      {/* City breakdown chips */}
      {cityRanked.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">지역별 분포</h2>
          <div className="flex flex-wrap gap-2">
            {cityRanked.map(([city, n]) => (
              <a
                key={city}
                href={`/city/${city.toLowerCase().replace(/\s+/g, "_")}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 transition"
              >
                {city}
                <span className="text-[var(--muted)] tabular-nums">{n}</span>
              </a>
            ))}
          </div>
        </section>
      )}

      <TravelStackAffiliate city="bangkok" cityLabel="태국 골프" context="guide" />
      <AdSlot slot="ko-korean-friendly-top" />

      {filtered.length === 0 ? (
        <p className="text-[var(--muted)]">아직 일치하는 코스 없음.</p>
      ) : (
        <section>
          <div className="grid gap-3">
            {filtered.slice(0, 10).map((r, i) => (
              <RestaurantCard key={r.id} r={r} rank={i + 1} />
            ))}
          </div>
          <AffiliateInline />
          <AdSlot slot="ko-korean-friendly-mid" />
          <div className="grid gap-3 mt-3">
            {filtered.slice(10).map((r, i) => (
              <RestaurantCard key={r.id} r={r} rank={i + 11} />
            ))}
          </div>
        </section>
      )}

      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-4">자주 묻는 질문</h2>
        <div className="space-y-3">
          {KO_FAQS.map((f, i) => (
            <details key={i} className="bg-white border border-[var(--border)] rounded-lg p-4 group">
              <summary className="font-medium cursor-pointer flex items-center justify-between gap-3">
                <span>{f.q}</span>
                <span className="text-[var(--muted)] group-open:rotate-180 transition">⌄</span>
              </summary>
              <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed whitespace-pre-line">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-12 border-t border-[var(--border)] pt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-4">
          관련 페이지
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <a href="/guide/korean-golfer-blogs" className="block p-4 border border-[var(--border)] rounded-xl bg-white hover:border-[var(--accent)] transition">
            <div className="font-medium leading-tight">한국 골퍼 네이버 블로그 후기 모음</div>
            <p className="text-xs text-[var(--muted)] mt-1">200+ 한국 골퍼 실제 라운딩 후기 큐레이션.</p>
          </a>
          <a href="/ko/guide/korean-golf-tour-thailand" className="block p-4 border border-[var(--border)] rounded-xl bg-white hover:border-[var(--accent)] transition">
            <div className="font-medium leading-tight">한국 골프 투어 가이드</div>
            <p className="text-xs text-[var(--muted)] mt-1">방콕·파타야 패키지 비교, 캐디 팁, 통관 가이드.</p>
          </a>
        </div>
      </section>

      <BreadcrumbJsonLd items={[
        { name: "홈", url: "/ko" },
        { name: "한국 친화 골프장", url: "/ko/best/korean-friendly" },
      ]} />
      <FaqJsonLd faqs={KO_FAQS} />
      <ItemListJsonLd
        name="한국어 캐디 있는 태국 골프장"
        items={filtered.slice(0, 30).map((r) => ({ name: r.name, url: `/course/${r.id}` }))}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            inLanguage: "ko",
            name: "한국어 캐디 있는 태국 골프장",
            url: `${SITE}/ko/best/korean-friendly`,
            isPartOf: { "@type": "WebSite", name: "Thailand Golf Guide", url: SITE },
          }),
        }}
      />
    </div>
  );
}
