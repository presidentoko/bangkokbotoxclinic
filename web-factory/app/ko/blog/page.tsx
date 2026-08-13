import { POSTS_KO } from "@/lib/posts_ko";
import { BreadcrumbJsonLd, ItemListJsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "블로그 — 한국 buyer 를 위한 태국 소싱 인사이트",
  description:
    "한국 SME 가 태국 OEM·산단·본사 발굴할 때 보는 짧은 read. 진출 패턴, Tier 1 일본계 OEM 분석, 태국 vs 베트남 비교.",
  alternates: {
    canonical: "/ko/blog",
    languages: {
      "ko-KR": "/ko/blog",
      "en-US": "/blog",
      "th-TH": "/th/blog",
      "x-default": "/blog",
    },
  },
  openGraph: { locale: "ko_KR" },
};

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
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">블로그</h1>
        <p className="text-base md:text-lg text-[var(--muted)] leading-relaxed text-balance">
          한국 buyer 가 태국 소싱·OEM·진출 검토할 때 보는 짧은 read. 시장 인사이트 + 본사 매핑 + 의사결정 노트.
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

      <div className="mt-8 pt-8 border-t border-[var(--border)] flex items-center justify-between gap-4 flex-wrap">
        <p className="text-sm text-[var(--muted)]">심층 가이드도 읽어보세요 —</p>
        <a href="/ko/guide" className="text-sm font-bold text-emerald-700 hover:underline">한국어 가이드 전체 보기 →</a>
      </div>

      <BreadcrumbJsonLd items={[
        { name: "홈", url: "/ko" },
        { name: "블로그", url: "/ko/blog" },
      ]} />
      <ItemListJsonLd
        name="Thai Supply Hub — 한국어 블로그"
        items={sorted.map((p) => ({ name: p.title, url: `/ko/blog/${p.slug}` }))}
      />
    </div>
  );
}
