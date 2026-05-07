import { GUIDES_KO } from "@/lib/guides_ko";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "태국 골프 한국어 가이드 — 예약, 그린피, 한국 투어",
  description:
    "태국 골프 실용 가이드 (한국어): 예약, 그린피, 캐디 팁, 한국 투어 정보, 자유여행 한국 골퍼 팁.",
  alternates: { canonical: "/ko/guide", languages: { "en-US": "/guide", "ko-KR": "/ko/guide", "th-TH": "/th/guide" } },
};

export const dynamic = "force-static";

export default function KoGuideIndexPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/ko" className="hover:text-[var(--fg)]">홈</a>
        <span className="mx-2">›</span>
        <span>가이드</span>
      </nav>

      <h1 className="text-4xl font-bold tracking-tight mb-3">태국 골프 한국어 가이드</h1>
      <p className="text-base text-[var(--muted)] leading-relaxed mb-10 max-w-2xl">
        실제 라운드 플레이 편집자가 쓴 실용 가이드. 광고 없음, 에이전시 슬로건 없음 — 예약 전에 알아야 할 것만.
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        {GUIDES_KO.map((g) => (
          <a
            key={g.slug}
            href={`/ko/guide/${g.slug}`}
            className="group block p-6 border border-[var(--border)] rounded-2xl bg-white hover:border-[var(--accent)] hover:shadow-md transition"
          >
            <h2 className="text-lg font-bold leading-tight group-hover:text-[var(--accent)] transition">
              {g.title.replace(/ \(\d{4}\)$/, "")}
            </h2>
            <p className="text-sm text-[var(--muted)] mt-2 leading-relaxed">{g.metaDescription}</p>
            <div className="mt-3 text-xs text-[var(--muted)]">업데이트 {g.updated}</div>
          </a>
        ))}
      </div>

      <BreadcrumbJsonLd items={[
        { name: "홈", url: "/ko" },
        { name: "가이드", url: "/ko/guide" },
      ]} />
    </div>
  );
}
