import { loadNaverCafeCommunity } from "@/lib/community";
import type { Metadata } from "next";

export const dynamic = "force-static";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thaisupplyhub.com";

export const metadata: Metadata = {
  title: "Naver Cafe Posts — Korean OEM Buyers on Thai Manufacturing",
  description:
    "Korean-language Naver Cafe community posts on Thai OEM/ODM manufacturers, sourcing experiences, contract manufacturing — curated for Korean buyers evaluating Thai factories.",
  alternates: { canonical: "/community/cafe" },
  openGraph: {
    type: "article",
    title: "Naver Cafe Posts on Thai OEM",
    description: "Korean cafe community posts on Thai OEM, ODM, and factory sourcing.",
  },
};

export default async function NaverCafePage() {
  const { groups, generated_at } = await loadNaverCafeCommunity();
  const totalEntries = groups.reduce((s, g) => s + g.count, 0);

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <a href="/community" className="hover:text-[var(--fg)]">Community</a>
        <span className="mx-2">›</span>
        <span>Naver Cafes</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 text-balance">
          Naver Cafes — Korean Community Posts on Thai OEM
        </h1>
        <p className="text-base text-[var(--muted)] leading-relaxed">
          Korean-language community discussions from Naver Cafes — {totalEntries} posts across {groups.length} topics on
          Thai factories, OEM/ODM partnerships, private-label sourcing, and import logistics. Cafe posts often capture
          informal Q&amp;A and warning signals you won&apos;t find in formal blog reviews.
        </p>
        <p className="text-xs text-[var(--muted)] mt-3 italic">
          Aggregated {generated_at.slice(0, 10)} · Links to original Naver Cafe posts. Content owned by original posters.
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
                  href={`/city/${g.city_slug}`}
                  className="text-xs text-[var(--accent)] hover:underline font-normal"
                >
                  → {g.city_label} suppliers
                </a>
              )}
            </h2>
            <div className="space-y-2">
              {g.entries.map((p, i) => (
                <a
                  key={`${p.cafe_url}-${i}`}
                  href={p.cafe_url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="block bg-white border border-[var(--border)] rounded-lg p-4 hover:border-black transition"
                >
                  <div className="font-medium text-sm leading-snug">{p.post_title || p.cafe_url}</div>
                  {p.post_snippet && (
                    <p className="text-xs text-[var(--muted)] mt-2 leading-relaxed line-clamp-3">
                      {p.post_snippet}
                    </p>
                  )}
                  <div className="text-[11px] text-[var(--muted)] mt-2 flex gap-2 flex-wrap">
                    {p.cafe_name && <span>cafe: {p.cafe_name}</span>}
                    {p.author && <span>· {p.author}</span>}
                    {p.post_date && <span>· {p.post_date}</span>}
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
            name: "Naver Cafes — Korean Community Posts on Thai OEM",
            url: `${SITE}/community/cafe`,
            isPartOf: { "@type": "WebSite", name: "Thai Supply Hub", url: SITE },
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: totalEntries,
              itemListElement: groups.flatMap((g) =>
                g.entries.slice(0, 10).map((p, i) => ({
                  "@type": "ListItem",
                  position: i + 1,
                  name: p.post_title || p.cafe_url,
                  url: p.cafe_url,
                })),
              ),
            },
          }),
        }}
      />
    </article>
  );
}
