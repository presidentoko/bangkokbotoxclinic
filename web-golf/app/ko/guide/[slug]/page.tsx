import { notFound } from "next/navigation";
import { GUIDES_KO, findGuideKo } from "@/lib/guides_ko";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/JsonLd";
import { AffiliateInline, AdSlot } from "@/components/AffiliateSlot";
import { loadMasterDb, topByTrust } from "@/lib/data";
import { RestaurantCard } from "@/components/RestaurantCard";
import type { Metadata } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thailandgolfguide.com";

export async function generateStaticParams() {
  return GUIDES_KO.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const g = findGuideKo(slug);
  if (!g) return { title: "Guide not found" };
  return {
    title: g.metaTitle,
    description: g.metaDescription,
    alternates: {
      canonical: `/ko/guide/${slug}`,
      languages: {
        "en-US": `/guide/${slug}`,
        "ko-KR": `/ko/guide/${slug}`,
        "th-TH": `/th/guide/${slug}`,
      },
    },
    openGraph: {
      type: "article",
      locale: "ko_KR",
      title: g.title,
      description: g.metaDescription,
      publishedTime: g.updated,
      modifiedTime: g.updated,
    },
  };
}

export default async function KoGuidePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const g = findGuideKo(slug);
  if (!g) notFound();

  const db = await loadMasterDb();
  const featured = topByTrust(db.restaurants, 6);
  const related = (g.related ?? []).map((s) => findGuideKo(s)).filter(Boolean);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: g.title,
    description: g.metaDescription,
    inLanguage: "ko",
    datePublished: g.updated,
    dateModified: g.updated,
    publisher: { "@type": "Organization", name: "Thailand Golf Guide", url: SITE },
    author: { "@type": "Organization", name: "Thailand Golf Guide Editorial" },
    mainEntityOfPage: `${SITE}/ko/guide/${g.slug}`,
  };

  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/ko" className="hover:text-[var(--fg)]">홈</a>
        <span className="mx-2">›</span>
        <a href="/ko/guide" className="hover:text-[var(--fg)]">가이드</a>
        <span className="mx-2">›</span>
        <span>{g.title.replace(/ \(\d{4}\)$/, "")}</span>
      </nav>

      <header className="mb-8">
        <div className="text-xs text-[var(--muted)] mb-2">
          한국어 · <a href={`/guide/${slug}`} className="underline hover:text-[var(--fg)]">English</a>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 text-balance">
          {g.title}
        </h1>
        <p className="text-base text-[var(--muted)] leading-relaxed">{g.intro}</p>
        <p className="text-xs text-[var(--muted)] mt-3 italic">
          업데이트 {g.updated} · 편집자 가이드 · 코스로부터 독립
        </p>
      </header>

      <AdSlot slot="guide-top" />

      <div className="prose prose-sm max-w-none mt-8 space-y-8">
        {g.sections.map((s, i) => (
          <section key={i}>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-3 mt-2">{s.heading}</h2>
            <p className="text-base leading-relaxed text-[var(--fg)] whitespace-pre-line">{s.body}</p>
          </section>
        ))}
      </div>

      <AffiliateInline />

      {g.faqs.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-4">자주 묻는 질문</h2>
          <div className="space-y-3">
            {g.faqs.map((f, i) => (
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
      )}

      {featured.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold mb-4">신뢰도 Top 코스 — 지금 예약하기</h2>
          <p className="text-sm text-[var(--muted)] mb-4">실제 Google 리뷰 분석 신뢰도 점수 기준 상위 코스.</p>
          <div className="grid gap-3">
            {featured.slice(0, 3).map((r, i) => (
              <RestaurantCard key={r.id} r={r} rank={i + 1} />
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-12 border-t border-[var(--border)] pt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-4">
            관련 가이드
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {related.map((r) => r && (
              <a
                key={r.slug}
                href={`/ko/guide/${r.slug}`}
                className="block p-4 border border-[var(--border)] rounded-xl bg-white hover:border-[var(--accent)] transition"
              >
                <div className="font-medium leading-tight">{r.title.replace(/ \(\d{4}\)$/, "")}</div>
                <p className="text-xs text-[var(--muted)] mt-1">{r.metaDescription.slice(0, 100)}…</p>
              </a>
            ))}
          </div>
        </section>
      )}

      <BreadcrumbJsonLd items={[
        { name: "홈", url: "/ko" },
        { name: "가이드", url: "/ko/guide" },
        { name: g.title, url: `/ko/guide/${g.slug}` },
      ]} />
      <FaqJsonLd faqs={g.faqs} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
    </article>
  );
}
