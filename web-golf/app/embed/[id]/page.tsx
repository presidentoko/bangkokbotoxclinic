// Backlink-generator page for course operators. Shows a styled Trust Score
// badge with a paste-ready HTML snippet (plain anchor — gives us a real
// do-follow backlink when the course adds it to their own site).

import { notFound } from "next/navigation";
import { loadMasterDb, getRestaurantById } from "@/lib/data";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { EmbedSnippet } from "@/components/EmbedSnippet";
import type { Metadata } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.thailandgolfguide.com";

export async function generateStaticParams() {
  const db = await loadMasterDb();
  // Only generate for courses with meaningful trust signal
  return db.restaurants
    .filter((r) => r.trust_score >= 50 && r.rating > 0)
    .map((r) => ({ id: r.id }));
}

// 의도적으로 일부만 발행한다 — 신뢰도 임계 미만 코스는 배지를 주지 않는다.
// false = 그 외 id 는 즉시 404 (on-demand 렌더 없음).
export const dynamicParams = false;

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const db = await loadMasterDb();
  const r = getRestaurantById(db.restaurants, id);
  if (!r) return { title: "Badge not found" };
  return {
    title: `Trust Score badge — ${r.name}`,
    description: `Embed the Thailand Golf Guide Trust Score badge for ${r.name} on your own website. Copy-paste HTML.`,
    alternates: { canonical: `/embed/${id}` },
    robots: { index: false, follow: true },
  };
}

export default async function EmbedBadgePage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = await loadMasterDb();
  const r = getRestaurantById(db.restaurants, id);
  if (!r) notFound();

  const courseUrl = `${SITE}/course/${r.id}`;
  const trustColor =
    r.trust_score >= 75 ? "#16a34a" :
    r.trust_score >= 60 ? "#059669" :
    "#ca8a04";

  // Inline-styled paste-ready HTML — works on any site without external CSS.
  // Plain <a> anchor → real backlink (not iframe).
  const badgeSnippet = `<a href="${courseUrl}?utm_source=badge&utm_medium=embed&utm_campaign=course-site"
   target="_blank" rel="noopener"
   style="display:inline-flex;align-items:center;gap:8px;padding:8px 14px;border-radius:10px;border:1px solid #e5e7eb;background:#ffffff;color:#111827;text-decoration:none;font-family:system-ui,-apple-system,sans-serif;font-size:13px;line-height:1.3;box-shadow:0 1px 2px rgba(0,0,0,0.04)">
  <span style="display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:8px;background:${trustColor};color:#fff;font-weight:800;font-size:13px">${r.trust_score.toFixed(0)}</span>
  <span>
    <span style="display:block;font-weight:600">Trust Score · ${r.trust_score.toFixed(0)}/100</span>
    <span style="display:block;color:#6b7280;font-size:11px">★ ${r.rating.toFixed(1)} · ${r.total_reviews.toLocaleString()} reviews · Thailand Golf Guide</span>
  </span>
</a>`;

  const compactSnippet = `<a href="${courseUrl}?utm_source=badge&utm_medium=embed&utm_campaign=course-site" target="_blank" rel="noopener" style="display:inline-block;padding:6px 12px;border-radius:999px;background:${trustColor};color:#fff;font:600 12px/1.2 system-ui,-apple-system,sans-serif;text-decoration:none">⛳ Trust ${r.trust_score.toFixed(0)} on Thailand Golf Guide ★ ${r.rating.toFixed(1)}</a>`;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <a href={`/course/${r.id}`} className="hover:text-[var(--fg)]">{r.name}</a>
        <span className="mx-2">›</span>
        <span>Embed badge</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Embed your Trust Score badge
        </h1>
        <p className="text-[var(--muted)]">
          Paste the HTML below on your own website to show your{" "}
          <strong className="text-[var(--fg)]">Thailand Golf Guide Trust Score</strong>. Updates whenever this page rebuilds — no maintenance.
        </p>
      </header>

      <section className="mb-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">Preview</h2>
        <div className="bg-gray-50 border border-[var(--border)] rounded-xl p-6 flex items-center justify-center min-h-[100px]">
          <div dangerouslySetInnerHTML={{ __html: badgeSnippet }} />
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">Full badge — HTML</h2>
        <EmbedSnippet code={badgeSnippet} />
      </section>

      <section className="mb-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">Compact pill version</h2>
        <div className="bg-gray-50 border border-[var(--border)] rounded-xl p-6 flex items-center justify-center min-h-[60px] mb-3">
          <div dangerouslySetInnerHTML={{ __html: compactSnippet }} />
        </div>
        <EmbedSnippet code={compactSnippet} />
      </section>

      <section className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-5 mb-8">
        <h2 className="font-bold mb-2">Why embed this?</h2>
        <ul className="text-sm space-y-1.5 text-[var(--fg)]">
          <li>• Show visitors your verified, independent Trust Score (built from real Google reviews, never paid).</li>
          <li>• Backlink to your own course page — improves your site&apos;s SEO authority.</li>
          <li>• Auto-updates as new reviews come in. No widget script — just plain HTML.</li>
          <li>• No tracking, no JS. Just an anchor link styled inline.</li>
        </ul>
      </section>

      <section className="mb-8 text-sm text-[var(--muted)]">
        <h2 className="font-semibold text-[var(--fg)] mb-2">Want a custom design or featured listing?</h2>
        <p className="leading-relaxed">
          See <a href="/for-courses" className="text-[var(--accent)] hover:underline font-medium">our partnership page</a> — Editor&apos;s Pick, Recommended, and Korean tourism channel placement available for clubs that want to be top of category and city pages.
        </p>
      </section>

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: r.name, url: `/course/${r.id}` },
        { name: "Embed badge", url: `/embed/${r.id}` },
      ]} />
    </div>
  );
}
