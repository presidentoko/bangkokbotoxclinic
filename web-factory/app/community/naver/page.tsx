import { loadNaverCommunity } from "@/lib/community";
import type { Metadata } from "next";

export const dynamic = "force-static";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thaisupplyhub.com";

export const metadata: Metadata = {
  title: "Naver Blog OEM & Thai Factory Roundup — Korean Buyer Insights",
  description:
    "Korean-language Naver blog posts on Thai OEM/ODM manufacturers, sourcing trips, contract manufacturing experience — curated for Korean buyers evaluating Thai factories.",
  alternates: { canonical: "/community/naver" },
  openGraph: {
    type: "article",
    title: "Naver Blog OEM & Thai Factory Roundup",
    description: "Korean blog posts on Thai OEM, ODM, and factory sourcing.",
  },
};

export default async function NaverFactoryPage() {
  const { groups, generated_at } = await loadNaverCommunity();
  const totalEntries = groups.reduce((s, g) => s + g.count, 0);

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <a href="/community" className="hover:text-[var(--fg)]">Community</a>
        <span className="mx-2">›</span>
        <span>Naver Blogs</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 text-balance">
          Naver Blogs — Korean Buyer Insights on Thai OEM
        </h1>
        <p className="text-base text-[var(--muted)] leading-relaxed">
          Korean-language coverage from Naver blogs — {totalEntries} posts across {groups.length} search topics on Thai
          factories, OEM/ODM partnerships, sourcing trip reports, and import logistics.
        </p>
        <p className="text-xs text-[var(--muted)] mt-3 italic">
          Aggregated {generated_at.slice(0, 10)} · Links to original Naver blog posts. Content owned by original bloggers.
        </p>
      </header>

      <div className="space-y-10 mt-8">
        {groups.map((g) => (
          <section key={g.query}>
            <h2 className="text-xl font-bold tracking-tight mb-3 flex items-baseline gap-3 flex-wrap">
              <span>&quot;{g.query}&quot;</span>
              <span className="text-xs text-[var(--muted)] font-normal">({g.count} posts)</span>
              {g.city_slug && (
                <a
                  href={`/c/${g.city_slug}`}
                  className="text-xs text-[var(--accent)] hover:underline font-normal"
                >
                  → {g.city_label} suppliers
                </a>
              )}
            </h2>
            <div className="space-y-2">
              {g.entries.map((b, i) => (
                <a
                  key={`${b.blog_url}-${i}`}
                  href={b.blog_url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="block bg-white border border-[var(--border)] rounded-lg p-4 hover:border-black transition"
                >
                  <div className="font-medium text-sm leading-snug">{b.blog_title || b.blog_url}</div>
                  {b.blog_snippet && (
                    <p className="text-xs text-[var(--muted)] mt-2 leading-relaxed line-clamp-3">
                      {b.blog_snippet}
                    </p>
                  )}
                  <div className="text-[11px] text-[var(--muted)] mt-2 flex gap-2 flex-wrap">
                    {b.blogger_name && <span>by {b.blogger_name}</span>}
                    {b.blog_date && <span>· {b.blog_date}</span>}
                  </div>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Naver Blogs — Korean Buyer Insights on Thai OEM",
            url: `${SITE}/community/naver`,
            isPartOf: { "@type": "WebSite", name: "Thai Supply Hub", url: SITE },
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: totalEntries,
              itemListElement: groups.flatMap((g) =>
                g.entries.slice(0, 10).map((b, i) => ({
                  "@type": "ListItem",
                  position: i + 1,
                  name: b.blog_title || b.blog_url,
                  url: b.blog_url,
                })),
              ),
            },
          }),
        }}
      />
    </article>
  );
}
