import { loadMasterDb } from "@/lib/data";
import { applySiteFilter, getSiteConfig } from "@/lib/site";
import { CATEGORY_LABELS } from "@/lib/types";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

export const dynamic = "force-static";

export function generateMetadata(): Metadata {
  const cfg = getSiteConfig();
  return {
    title: `Compare Clinics Side-by-Side — ${cfg.brand}`,
    description: `Compare top ${cfg.brand} clinics side-by-side on Trust Score, reviews, doctors, and languages.`,
    alternates: { canonical: "/compare" },
    // 비교 도구 진입점. 고유 콘텐츠가 없는 선택 UI라 색인 대상이 아니다.
    // robots.txt 차단 대신 noindex — 사유는 /compare/[a]/[b] 주석 참조.
    robots: { index: false, follow: true },
  };
}

export default async function ComparePickerPage() {
  const cfg = getSiteConfig();
  const db = await loadMasterDb();
  const ranked = applySiteFilter(db.clinics, cfg)
    .sort((a, b) => b.trust_score - a.trust_score)
    .slice(0, 20);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span>Compare</span>
      </nav>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Compare clinics</h1>
      <p className="text-[var(--muted)] mb-8">
        Pick a top-ranked clinic below to see it compared side-by-side against the #2 clinic in its category —
        Trust Score, reviews, doctors, and languages.
      </p>
      <div className="grid gap-2">
        {ranked.map((c, i) => {
          const primaryCat = c.categories[0];
          const peer = primaryCat
            ? ranked.find((o) => o.id !== c.id && o.categories.includes(primaryCat))
            : ranked.find((o) => o.id !== c.id);
          if (!peer) return null;
          return (
            <a
              key={c.id}
              href={`/compare/${c.id}/${peer.id}`}
              rel="nofollow"
              className="group flex items-center gap-3 p-3 rounded-lg border border-[var(--border)] bg-white hover:border-[var(--accent)] transition"
            >
              <span className="text-xs font-bold bg-blue-50 text-blue-600 rounded px-1.5 py-0.5 shrink-0">#{i + 1}</span>
              <div className="min-w-0 flex-1">
                <div className="font-medium text-sm truncate group-hover:text-[var(--accent)] transition">{c.name}</div>
                <div className="text-xs text-[var(--muted)]">
                  vs {peer.name}
                  {primaryCat && <span> · {CATEGORY_LABELS[primaryCat] ?? primaryCat}</span>}
                </div>
              </div>
              <span className="text-[var(--muted)] group-hover:text-[var(--accent)] shrink-0 transition">⚖️ Compare →</span>
            </a>
          );
        })}
      </div>
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Compare", url: "/compare" },
      ]} />
    </div>
  );
}
