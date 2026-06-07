import { GUIDES_KO } from "@/lib/guides_ko";
import { BreadcrumbJsonLd, ItemListJsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "한국 buyer 가이드 — 태국 OEM 직거래·산단 입주",
  description:
    "한국 SME가 태국에서 OEM 직거래, 산단 입주, 동부해안 협력사 발굴할 때 보는 가이드. 소싱 에이전트 마진 빼고 직접 가는 절차.",
  alternates: {
    canonical: "/ko/guide",
    languages: {
      "ko-KR": "/ko/guide",
      "en-US": "/guide",
      "x-default": "/guide",
    },
  },
  openGraph: { locale: "ko_KR" },
};

export default function GuideIndexKo() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/ko" className="hover:text-[var(--fg)]">홈</a>
        <span className="mx-2">›</span>
        <span>가이드</span>
      </nav>

      <header className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">한국 buyer 가이드</h1>
        <p className="text-base md:text-lg text-[var(--muted)] leading-relaxed text-balance">
          한국 SME가 태국 OEM·산단·창고 발굴할 때 펴 보는 실전 가이드. 에이전트 마진 빼고 직거래 절차 + 동부해안 클러스터 매핑.
        </p>
      </header>

      <div className="grid sm:grid-cols-2 gap-4">
        {GUIDES_KO.map((g) => (
          <a
            key={g.slug}
            href={`/ko/guide/${g.slug}`}
            className="block p-6 bg-white border border-[var(--border)] rounded-xl hover:border-emerald-400 hover:shadow-md transition group"
          >
            <h2 className="font-bold text-lg leading-snug mb-2 group-hover:text-emerald-700 transition">
              {g.title}
            </h2>
            <p className="text-sm text-[var(--muted)] leading-relaxed line-clamp-3">
              {g.metaDescription}
            </p>
            <div className="mt-3 text-xs text-[var(--muted)] flex items-center gap-2">
              <span>업데이트 {g.updated}</span>
              <span>·</span>
              <span>{g.sections.length}개 섹션</span>
              <span>·</span>
              <span>{g.faqs.length}개 FAQ</span>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-10 bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">큐레이션 목록</div>
          <div className="font-bold text-amber-900">14개 공급사 순위 목록</div>
          <p className="text-xs text-amber-800 mt-0.5">업종·산단·수출 여부별 — 신뢰도 점수 순위.</p>
        </div>
        <a href="/best" className="shrink-0 px-4 py-2 bg-amber-600 text-white text-sm font-bold rounded-lg hover:bg-amber-700 transition">
          전체 목록 보기 →
        </a>
      </div>

      <BreadcrumbJsonLd items={[
        { name: "홈", url: "/ko" },
        { name: "가이드", url: "/ko/guide" },
      ]} />
      <ItemListJsonLd
        name="Thai Supply Hub — 한국 buyer 가이드"
        items={GUIDES_KO.map((g) => ({ name: g.title, url: `/ko/guide/${g.slug}` }))}
      />
    </div>
  );
}
