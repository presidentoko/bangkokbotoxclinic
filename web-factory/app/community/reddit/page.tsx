import { loadRedditCommunity } from "@/lib/community";
import type { Metadata } from "next";

export const dynamic = "force-static";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thaisupplyhub.com";

export const metadata: Metadata = {
  title: "Reddit Discussions on Thai OEM & Contract Manufacturing",
  description:
    "Aggregated Reddit threads from r/Thailand, r/Entrepreneur, r/smallbusiness, r/manufacturing, r/supplychain — real buyer questions and warnings about Thai OEM/ODM sourcing.",
  alternates: { canonical: "/community/reddit" },
  openGraph: {
    type: "article",
    title: "Reddit on Thai OEM Sourcing",
    description: "Reddit discussions on Thai manufacturing, OEM, and contract sourcing.",
  },
};

export default async function RedditPage() {
  const { groups, generated_at } = await loadRedditCommunity();
  const totalEntries = groups.reduce((s, g) => s + g.count, 0);

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <a href="/community" className="hover:text-[var(--fg)]">Community</a>
        <span className="mx-2">›</span>
        <span>Reddit</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 text-balance">
          Reddit Discussions on Thai OEM Sourcing
        </h1>
        <p className="text-base text-[var(--muted)] leading-relaxed">
          {totalEntries} Reddit threads across {groups.length} topics on Thai manufacturing — sourced from
          r/Thailand, r/Entrepreneur, r/smallbusiness, r/manufacturing, r/supplychain, r/AlibabaScams. Reddit
          captures unfiltered buyer perspectives — including red flags and scam warnings — that polished agency
          content tends to omit.
        </p>
        <p className="text-xs text-[var(--muted)] mt-3 italic">
          Aggregated {generated_at.slice(0, 10)} · Links to original Reddit posts. Content owned by original posters.
        </p>
      </header>

      <div className="space-y-10 mt-8">
        {groups.map((g) => (
          <section key={g.query}>
            <h2 className="text-xl font-bold tracking-tight mb-3 flex items-baseline gap-3 flex-wrap">
              <span>&quot;{g.query}&quot;</span>
              <span className="text-xs text-[var(--muted)] font-normal">({g.count} threads)</span>
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
              {g.entries.map((p, i) => (
                <a
                  key={`${p.post_url}-${i}`}
                  href={p.post_url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="block bg-white border border-[var(--border)] rounded-lg p-4 hover:border-black transition"
                >
                  <div className="font-medium text-sm leading-snug">{p.title || p.post_url}</div>
                  {p.selftext_snippet && (
                    <p className="text-xs text-[var(--muted)] mt-2 leading-relaxed line-clamp-3">
                      {p.selftext_snippet}
                    </p>
                  )}
                  <div className="text-[11px] text-[var(--muted)] mt-2 flex gap-2 flex-wrap">
                    {p.subreddit && <span>r/{p.subreddit}</span>}
                    {p.author && <span>· u/{p.author}</span>}
                    {p.score && <span>· {p.score} pts</span>}
                    {p.num_comments && <span>· {p.num_comments} comments</span>}
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
            name: "Reddit Discussions on Thai OEM Sourcing",
            url: `${SITE}/community/reddit`,
            isPartOf: { "@type": "WebSite", name: "Thai Supply Hub", url: SITE },
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: totalEntries,
              itemListElement: groups.flatMap((g) =>
                g.entries.slice(0, 10).map((p, i) => ({
                  "@type": "ListItem",
                  position: i + 1,
                  name: p.title || p.post_url,
                  url: p.post_url,
                })),
              ),
            },
          }),
        }}
      />
    </article>
  );
}
