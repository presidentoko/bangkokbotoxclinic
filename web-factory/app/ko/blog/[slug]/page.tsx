import { notFound } from "next/navigation";
import { POSTS_KO, findPostKo } from "@/lib/posts_ko";
import { renderBody, inlineMd } from "@/lib/posts";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thaisupplyhub.com";
const BRAND = process.env.NEXT_PUBLIC_BRAND || "Thai Supply Hub";

export const dynamicParams = false;

export async function generateStaticParams() {
  return POSTS_KO.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const p = findPostKo(slug);
  if (!p) return { title: "포스트를 찾을 수 없음" };
  return {
    title: p.metaTitle,
    description: p.metaDescription,
    alternates: { canonical: `/ko/blog/${slug}`, languages: { "ko-KR": `/ko/blog/${slug}`, "x-default": `/ko/blog/${slug}` } },
    openGraph: {
      title: p.metaTitle,
      description: p.metaDescription,
      type: "article",
      url: `${SITE}/ko/blog/${slug}`,
      locale: "ko_KR",
      publishedTime: p.published,
    },
  };
}

function articleJsonLd(p: ReturnType<typeof findPostKo> & object) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: p.metaTitle,
          description: p.metaDescription,
          datePublished: p.published,
          dateModified: p.updated ?? p.published,
          author: { "@type": "Organization", name: BRAND, url: SITE },
          publisher: {
            "@type": "Organization",
            name: BRAND,
            url: SITE,
            logo: { "@type": "ImageObject", url: `${SITE}/icon` },
          },
          mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE}/ko/blog/${p.slug}` },
          inLanguage: "ko",
          articleSection: p.category,
        }),
      }}
    />
  );
}

export default async function KoBlogPostPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const p = findPostKo(slug);
  if (!p) notFound();

  const blocks = renderBody(p.body);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/ko" className="hover:text-[var(--fg)]">홈</a>
        <span className="mx-2">›</span>
        <a href="/ko/blog" className="hover:text-[var(--fg)]">블로그</a>
        <span className="mx-2">›</span>
        <span className="text-emerald-700">{p.category}</span>
      </nav>

      <article>
        <header className="mb-8">
          <div className="text-xs font-bold uppercase tracking-widest text-emerald-700 mb-3">
            {p.category}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-balance leading-[1.1]">
            {p.title}
          </h1>
          <div className="text-sm text-[var(--muted)]">
            <time dateTime={p.published}>{p.published}</time>
          </div>
        </header>

        <div className="space-y-5 text-[var(--fg)]">
          {blocks.map((b, i) => {
            if (b.type === "h2") {
              return <h2 key={i} className="text-2xl font-bold mt-8 mb-2">{b.content as string}</h2>;
            }
            if (b.type === "ul") {
              return (
                <ul key={i} className="list-disc pl-6 space-y-1.5 leading-relaxed">
                  {(b.content as string[]).map((it, j) => (
                    <li key={j} dangerouslySetInnerHTML={{ __html: inlineMd(it) }} />
                  ))}
                </ul>
              );
            }
            return (
              <p key={i} className="leading-relaxed" dangerouslySetInnerHTML={{ __html: inlineMd(b.content as string) }} />
            );
          })}
        </div>
      </article>

      {p.related && p.related.length > 0 && (
        <section className="mt-12 pt-8 border-t border-[var(--border)]">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
            관련 포스트
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {p.related.map((relSlug) => {
              const rel = findPostKo(relSlug);
              if (!rel) return null;
              return (
                <a
                  key={relSlug}
                  href={`/ko/blog/${relSlug}`}
                  className="block p-4 bg-white border border-[var(--border)] rounded-xl hover:border-emerald-400 transition"
                >
                  <div className="text-xs font-bold uppercase tracking-widest text-emerald-700 mb-1">
                    {rel.category}
                  </div>
                  <div className="font-bold text-sm leading-tight mb-1">{rel.title}</div>
                  <p className="text-xs text-[var(--muted)] line-clamp-2">{rel.metaDescription}</p>
                </a>
              );
            })}
          </div>
        </section>
      )}

      <BreadcrumbJsonLd items={[
        { name: "홈", url: "/ko" },
        { name: "블로그", url: "/ko/blog" },
        { name: p.title, url: `/ko/blog/${slug}` },
      ]} />
      {articleJsonLd(p)}
    </div>
  );
}
