import { notFound } from "next/navigation";
import { POSTS, findPost, renderBody, inlineMd } from "@/lib/posts";
import { findPostKo } from "@/lib/posts_ko";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.thailandgolfguide.com";
const BRAND = process.env.NEXT_PUBLIC_BRAND || "Thailand Golf Guide";

export const dynamicParams = false;

export async function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const p = findPost(slug);
  if (!p) return { title: "Post not found" };
  return {
    title: p.metaTitle,
    description: p.metaDescription,
    alternates: {
      canonical: `/blog/${slug}`,
      languages: {
        "x-default": `/blog/${slug}`,
        "en-US": `/blog/${slug}`,
        ...(findPostKo(slug) ? { "ko-KR": `/ko/blog/${slug}` } : {}),
      },
    },
    openGraph: {
      title: p.metaTitle,
      description: p.metaDescription,
      type: "article",
      url: `${SITE}/blog/${slug}`,
      publishedTime: p.published,
      modifiedTime: p.updated ?? p.published,
    },
  };
}

function articleJsonLd(p: ReturnType<typeof findPost> & object) {
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
          mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE}/blog/${p.slug}` },
          inLanguage: /[가-힣]/.test(p.title) ? "ko" : "en",
          articleSection: p.category,
        }),
      }}
    />
  );
}

export default async function BlogPostPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const p = findPost(slug);
  if (!p) notFound();

  const blocks = renderBody(p.body);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <a href="/blog" className="hover:text-[var(--fg)]">Blog</a>
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
              return (
                <h2 key={i} className="text-2xl font-bold mt-8 mb-2">
                  {b.content as string}
                </h2>
              );
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
            if (b.type === "table") {
              const tbl = b.content as { header: string[]; rows: string[][] };
              return (
                <div key={i} className="overflow-x-auto -mx-4 sm:mx-0">
                  <table className="min-w-full text-sm border border-[var(--border)] rounded-lg my-3">
                    <thead className="bg-emerald-50">
                      <tr>
                        {tbl.header.map((h, j) => (
                          <th key={j} className="px-3 py-2 text-left font-semibold border-b border-[var(--border)]" dangerouslySetInnerHTML={{ __html: inlineMd(h) }} />
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tbl.rows.map((row, ri) => (
                        <tr key={ri} className={ri % 2 ? "bg-gray-50" : ""}>
                          {row.map((cell, ci) => (
                            <td key={ci} className="px-3 py-2 border-b border-[var(--border)]" dangerouslySetInnerHTML={{ __html: inlineMd(cell) }} />
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            }
            return (
              <p
                key={i}
                className="leading-relaxed"
                dangerouslySetInnerHTML={{ __html: inlineMd(b.content as string) }}
              />
            );
          })}
        </div>
      </article>

      {p.related && p.related.length > 0 && (
        <section className="mt-12 pt-8 border-t border-[var(--border)]">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
            Related posts
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {p.related.map((relSlug) => {
              const rel = findPost(relSlug);
              if (!rel) return null;
              return (
                <a
                  key={relSlug}
                  href={`/blog/${relSlug}`}
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
        { name: "Home", url: "/" },
        { name: "Blog", url: "/blog" },
        { name: p.title, url: `/blog/${slug}` },
      ]} />
      {articleJsonLd(p)}
    </div>
  );
}
