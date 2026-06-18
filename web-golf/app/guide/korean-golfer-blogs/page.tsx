import { loadNaverCommunity } from "@/lib/community";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { AdSlot } from "@/components/AffiliateSlot";
import { TravelStackAffiliate } from "@/components/TravelStackAffiliate";
import type { Metadata } from "next";

export const dynamic = "force-static";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.thailandgolfguide.com";

export const metadata: Metadata = {
  title: "한국 골퍼들의 태국 골프 후기 모음 — 네이버 블로그 큐레이션",
  description:
    "방콕·파타야·후아힌·푸켓·치앙마이 등 태국 골프 지역별 한국 골퍼 네이버 블로그 후기 200+편. 실제 한국 골퍼들이 쓴 라운딩 후기, 패키지 비교, 캐디 팁 정보.",
  alternates: { canonical: "/guide/korean-golfer-blogs" },
  openGraph: {
    type: "article",
    title: "한국 골퍼들의 태국 골프 후기 모음",
    description: "지역별 한국 골퍼 네이버 블로그 후기 200+편 큐레이션.",
  },
};

export default async function KoreanBlogsPage() {
  const { groups, generated_at } = await loadNaverCommunity();
  const totalEntries = groups.reduce((s, g) => s + g.count, 0);

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <a href="/guide" className="hover:text-[var(--fg)]">Guides</a>
        <span className="mx-2">›</span>
        <span>한국 블로그 모음</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 text-balance">
          한국 골퍼들의 태국 골프 후기 모음
        </h1>
        <p className="text-base text-[var(--muted)] leading-relaxed">
          네이버 블로그에서 큐레이션한 한국 골퍼들의 태국 골프 후기 {totalEntries}편. 지역별·키워드별로 그룹화해 정리했습니다.
          캐디 팁, 패키지 가격, 코스 컨디션 등 한국 골퍼의 관점에서 본 실제 경험담입니다.
        </p>
        <p className="text-xs text-[var(--muted)] mt-3 italic">
          Aggregated {generated_at.slice(0, 10)} · 한국 네이버 검색 결과 기반 ·
          외부 블로그 링크 (블로그 본문은 각 작성자 소유)
        </p>
      </header>

      <AdSlot slot="guide-top" />

      <div className="space-y-10 mt-8">
        {groups.map((g) => (
          <section key={g.query} id={`q-${encodeURIComponent(g.query)}`}>
            <h2 className="text-xl font-bold tracking-tight mb-3 flex items-baseline gap-3">
              <span>{g.query}</span>
              <span className="text-xs text-[var(--muted)] font-normal">({g.count}편)</span>
              {g.city_slug && (
                <a
                  href={`/city/${g.city_slug}`}
                  className="text-xs text-[var(--accent)] hover:underline font-normal"
                >
                  → {g.city_label} 골프장 보기
                </a>
              )}
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {g.entries.map((b, i) => (
                <a
                  key={`${b.blog_url}-${i}`}
                  href={b.blog_url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="block bg-white border border-[var(--border)] rounded-lg p-4 hover:border-black transition"
                >
                  <div className="font-medium text-sm leading-snug">
                    {b.blog_title || b.blog_url}
                  </div>
                  {b.blog_snippet && (
                    <p className="text-xs text-[var(--muted)] mt-2 leading-relaxed line-clamp-2">
                      {b.blog_snippet}
                    </p>
                  )}
                  <div className="text-[11px] text-[var(--muted)] mt-2 flex gap-2">
                    {b.blogger_name && <span>blog.naver.com/{b.blogger_name}</span>}
                    {b.blog_date && <span>· {b.blog_date}</span>}
                  </div>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>

      <TravelStackAffiliate city="bangkok" context="guide" />

      <section className="mt-12 border-t border-[var(--border)] pt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-4">
          관련 페이지
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <a
            href="/best/korean-friendly"
            className="block p-4 border border-[var(--border)] rounded-xl bg-white hover:border-[var(--accent)] transition"
          >
            <div className="font-medium leading-tight">한국 캐디 / 한국 친화 골프장</div>
            <p className="text-xs text-[var(--muted)] mt-1">한국 골퍼들이 추천하는 태국 골프장 큐레이션.</p>
          </a>
          <a
            href="/ko/guide/korean-golf-tour-thailand"
            className="block p-4 border border-[var(--border)] rounded-xl bg-white hover:border-[var(--accent)] transition"
          >
            <div className="font-medium leading-tight">한국 골프 투어 가이드</div>
            <p className="text-xs text-[var(--muted)] mt-1">방콕·파타야 패키지 비교, 캐디 팁, 통관 가이드.</p>
          </a>
        </div>
      </section>

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Guides", url: "/guide" },
        { name: "Korean Blog Roundup", url: "/guide/korean-golfer-blogs" },
      ]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "한국 골퍼들의 태국 골프 후기 모음",
            url: `${SITE}/guide/korean-golfer-blogs`,
            inLanguage: "ko",
            isPartOf: { "@type": "WebSite", name: "Thailand Golf Guide", url: SITE },
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: totalEntries,
              itemListElement: groups.flatMap((g) =>
                g.entries.slice(0, 10).map((b, i) => ({
                  "@type": "ListItem",
                  position: i + 1,
                  name: b.blog_title || b.blog_url,
                  url: b.blog_url,
                })),
              ),
            },
          }),
        }}
      />
    </article>
  );
}
