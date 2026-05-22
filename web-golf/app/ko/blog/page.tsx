import { POSTS_KO } from "@/lib/posts_ko";
import { BreadcrumbJsonLd, ItemListJsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "태국 골프 블로그 — 한국 골퍼 후기, 코스 추천, 예약 팁",
  description:
    "방콕·파타야·후아힌·치앙마이·푸켓 골프장 한국 골퍼 후기와 추천. 그린피, 한국어 캐디, 패키지 vs 자유여행 비교. Google 리뷰 데이터 기반 주간 업데이트.",
  alternates: {
    canonical: "/ko/blog",
    languages: { "en-US": "/blog", "ko-KR": "/ko/blog" },
  },
};

export const dynamic = "force-static";

export default function KoBlogIndex() {
  const sorted = [...POSTS_KO].sort((a, b) => b.published.localeCompare(a.published));

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/ko" className="hover:text-[var(--fg)]">홈</a>
        <span className="mx-2">›</span>
        <span>블로그</span>
      </nav>

      <header className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">태국 골프 블로그</h1>
        <p className="text-base md:text-lg text-[var(--muted)] leading-relaxed text-balance">
          한국 골퍼 후기 톤. 광고 카피 아님 — 가본 사람 입장에서 가성비, 한국어 캐디, 예약 채널까지. Google 리뷰 데이터로 매주 업데이트.
        </p>
      </header>

      <div className="grid sm:grid-cols-2 gap-4">
        {sorted.map((p) => (
          <a
            key={p.slug}
            href={`/ko/blog/${p.slug}`}
            className="block p-6 bg-white border border-[var(--border)] rounded-xl hover:border-emerald-400 hover:shadow-md transition group"
          >
            <div className="text-xs font-bold uppercase tracking-widest text-emerald-700 mb-2">
              {p.category}
            </div>
            <h2 className="font-bold text-lg leading-snug mb-2 group-hover:text-emerald-700 transition">
              {p.title}
            </h2>
            <p className="text-sm text-[var(--muted)] leading-relaxed line-clamp-3">
              {p.metaDescription}
            </p>
            <div className="mt-3 text-xs text-[var(--muted)]">
              <time dateTime={p.published}>{p.published}</time>
            </div>
          </a>
        ))}
      </div>

      <BreadcrumbJsonLd items={[
        { name: "홈", url: "/ko" },
        { name: "블로그", url: "/ko/blog" },
      ]} />
      <ItemListJsonLd
        name="Thailand Golf Guide — 한국어 블로그"
        items={sorted.map((p) => ({ name: p.title, url: `/ko/blog/${p.slug}` }))}
      />
    </div>
  );
}
