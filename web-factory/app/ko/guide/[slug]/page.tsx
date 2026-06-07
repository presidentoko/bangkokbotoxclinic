import { notFound } from "next/navigation";
import { GUIDES_KO, findGuideKo } from "@/lib/guides_ko";
import { extractHowToSteps } from "@/lib/guides";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/JsonLd";
import { loadMasterDb, topByTrust } from "@/lib/data";
import { SupplierCard } from "@/components/SupplierCard";
import type { Metadata } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thaisupplyhub.com";
const BRAND = process.env.NEXT_PUBLIC_BRAND || "Thai Supply Hub";

export const dynamicParams = false;

export async function generateStaticParams() {
  return GUIDES_KO.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const g = findGuideKo(slug);
  if (!g) return { title: "가이드를 찾을 수 없음" };
  return {
    title: g.metaTitle,
    description: g.metaDescription,
    alternates: { canonical: `/ko/guide/${slug}`, languages: { "ko-KR": `/ko/guide/${slug}`, "x-default": `/ko/guide/${slug}` } },
    openGraph: {
      title: g.metaTitle,
      description: g.metaDescription,
      type: "article",
      url: `${SITE}/ko/guide/${slug}`,
      locale: "ko_KR",
    },
  };
}

function howToJsonLd(g: ReturnType<typeof findGuideKo> & object) {
  const steps = extractHowToSteps(g);
  if (!steps) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: g.metaTitle,
          description: g.metaDescription,
          inLanguage: "ko",
          step: steps.map((s, i) => ({
            "@type": "HowToStep",
            position: i + 1,
            name: s.name,
            text: s.text,
          })),
        }),
      }}
    />
  );
}

function articleJsonLd(g: ReturnType<typeof findGuideKo> & object) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: g.metaTitle,
          description: g.metaDescription,
          datePublished: g.updated,
          dateModified: g.updated,
          author: { "@type": "Organization", name: BRAND, url: SITE },
          publisher: {
            "@type": "Organization",
            name: BRAND,
            url: SITE,
            logo: { "@type": "ImageObject", url: `${SITE}/icon` },
          },
          mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE}/ko/guide/${g.slug}` },
          inLanguage: "ko",
          articleSection: "Buyer Guides",
        }),
      }}
    />
  );
}

const GUIDE_TO_BEST_KO: Record<string, { slug: string; label: string }> = {
  "korea-sme-amata-wha-comparison": { slug: "industrial-estates", label: "산업단지 공급사 순위" },
  "korea-sme-thai-oem-process": { slug: "highly-recommended", label: "추천 공급사 Top 50" },
  "korea-sme-thailand-boi-guide": { slug: "boi-eligible", label: "BOI 승인 공장 목록" },
};

export default async function GuidePageKo(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const g = findGuideKo(slug);
  if (!g) notFound();

  const db = await loadMasterDb();
  const topSuppliers = topByTrust(db.suppliers, 6);
  const bestFor = GUIDE_TO_BEST_KO[slug];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/ko" className="hover:text-[var(--fg)]">홈</a>
        <span className="mx-2">›</span>
        <a href="/ko/guide" className="hover:text-[var(--fg)]">가이드</a>
        <span className="mx-2">›</span>
        <span>{g.title.replace(/ \(\d{4}\)$/, "")}</span>
      </nav>

      <article>
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-balance leading-[1.1]">
            {g.title}
          </h1>
          <p className="text-lg text-[var(--muted)] leading-relaxed text-balance">{g.intro}</p>
          <div className="mt-4 text-xs text-[var(--muted)] flex items-center gap-2">
            <time dateTime={g.updated}>업데이트 {g.updated}</time>
            <span>·</span>
            <span>{g.sections.length}개 섹션</span>
            <span>·</span>
            <span>{g.faqs.length}개 FAQ</span>
          </div>
        </header>

        <div className="prose prose-emerald max-w-none">
          {g.sections.map((s, i) => (
            <section key={i} className="mb-8">
              <h2 className="text-2xl font-bold mb-3 mt-8">{s.heading}</h2>
              <p className="text-base leading-relaxed text-[var(--fg)] whitespace-pre-line">{s.body}</p>
            </section>
          ))}
        </div>

        {g.faqs.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-5">자주 묻는 질문</h2>
            <div className="space-y-3">
              {g.faqs.map((f, i) => (
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
        )}
      </article>

      {bestFor && (
        <section className="mt-12 bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">큐레이션 목록</div>
            <div className="font-bold text-amber-900">{bestFor.label}</div>
            <p className="text-xs text-amber-800 mt-0.5">신뢰도 점수 순위 — DBD 검증, Google 리뷰 기반.</p>
          </div>
          <a href={`/best/${bestFor.slug}`}
             className="shrink-0 px-4 py-2 bg-amber-600 text-white text-sm font-bold rounded-lg hover:bg-amber-700 transition">
            목록 보기 →
          </a>
        </section>
      )}

      <section className="mt-16 bg-emerald-50/40 border border-emerald-100 rounded-2xl p-6 md:p-8">
        <h2 className="text-xl font-bold mb-4">신뢰도 Top 공급사</h2>
        <p className="text-sm text-[var(--muted)] mb-5">
          전체 카테고리 중 신뢰도 점수 가장 높은 곳들 — 공개 Google 리뷰 검증.
        </p>
        <div className="grid gap-3">
          {topSuppliers.slice(0, 3).map((r, i) => (
            <SupplierCard key={r.id} r={r} rank={i + 1} />
          ))}
        </div>
        <a
          href="/best/highly-recommended"
          className="inline-block mt-4 text-sm font-bold text-emerald-700 hover:underline"
        >
          전체 Top 50 보기 →
        </a>
      </section>

      {g.related && g.related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
            관련 가이드
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {g.related.map((relSlug) => {
              const rel = findGuideKo(relSlug);
              if (!rel) return null;
              return (
                <a
                  key={relSlug}
                  href={`/ko/guide/${relSlug}`}
                  className="block p-4 bg-white border border-[var(--border)] rounded-xl hover:border-emerald-400 transition"
                >
                  <div className="font-bold text-sm mb-1 leading-tight">{rel.title}</div>
                  <p className="text-xs text-[var(--muted)] line-clamp-2 leading-relaxed">
                    {rel.metaDescription}
                  </p>
                </a>
              );
            })}
          </div>
        </section>
      )}

      <BreadcrumbJsonLd items={[
        { name: "홈", url: "/ko" },
        { name: "가이드", url: "/ko/guide" },
        { name: g.title, url: `/ko/guide/${slug}` },
      ]} />
      <FaqJsonLd faqs={g.faqs} lang="ko" />
      {articleJsonLd(g)}
      {howToJsonLd(g)}
    </div>
  );
}
