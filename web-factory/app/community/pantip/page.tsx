import { loadPantipCommunity } from "@/lib/community";
import type { Metadata } from "next";

export const dynamic = "force-static";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thaisupplyhub.com";

// How many inlined comments to render per thread.
//
// This page renders every group in community_pantip.json on one URL. Unbounded,
// that was 2,323 threads with 8,481 inlined comments — about 10,800 elements,
// which built out to an 11.7MB HTML file (4.4MB markup + 6.9MB RSC payload).
// The comment bodies are only 13% of that by text; the weight is the element
// tree itself, each node carrying long Tailwind class strings.
//
// The comments sit inside a collapsed <details>, so they cost roughly two
// thirds of the page for content no visitor sees without expanding it. Capping
// them is the cheap part of the fix. The page still needs real pagination or
// per-topic routes — 323 topic groups do not belong on one URL — but that
// changes the site's URL structure and is a separate decision.
const INLINE_COMMENTS = 2;

export const metadata: Metadata = {
  title: "Pantip OEM & Factory Threads — Real Thai Manufacturer Discussions",
  description:
    "Curated Pantip threads on Thai OEM/ODM manufacturers, industrial estates, contract manufacturing — local Thai discussions on Amata, WHA, Hemaraj, factory tours, and supplier vetting.",
  alternates: { canonical: "/community/pantip" },
  openGraph: {
    type: "article",
    title: "Pantip OEM & Factory Threads",
    description: "Real Thai discussions on OEM, factories, and industrial estates.",
  },
};

export default async function PantipFactoryPage() {
  const { groups, generated_at } = await loadPantipCommunity();
  const totalEntries = groups.reduce((s, g) => s + g.count, 0);

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <a href="/community" className="hover:text-[var(--fg)]">Community</a>
        <span className="mx-2">›</span>
        <span>Pantip</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 text-balance">
          Pantip OEM & Factory Threads
        </h1>
        <p className="text-base text-[var(--muted)] leading-relaxed">
          Curated discussions from Pantip — Thailand&apos;s largest community forum — covering {totalEntries} threads
          across {groups.length} topics. Real conversations on OEM/ODM partners, industrial estate tenants, MOQ
          questions, contract terms, and buyer experiences.
        </p>
        <p className="text-xs text-[var(--muted)] mt-3 italic">
          Aggregated {generated_at.slice(0, 10)} · Links to original Pantip threads. Content owned by original authors.
        </p>
      </header>

      <div className="space-y-10 mt-8">
        {groups.map((g) => (
          <section key={g.query} id={`q-${encodeURIComponent(g.query)}`}>
            <h2 className="text-xl font-bold tracking-tight mb-3 flex items-baseline gap-3 flex-wrap">
              <span>&quot;{g.query}&quot;</span>
              <span className="text-xs text-[var(--muted)] font-normal">({g.count} threads)</span>
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
              {g.entries.map((t, i) => (
                <div
                  key={`${t.topic_url}-${i}`}
                  className="block bg-white border border-[var(--border)] rounded-lg p-4 hover:border-black transition"
                >
                  <a
                    href={t.topic_url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="font-medium text-sm leading-snug hover:underline"
                    dangerouslySetInnerHTML={{
                      __html: (t.title || t.topic_url)
                        .replace(/\{\{em\}\}/g, '<mark class="bg-yellow-100 px-0.5">')
                        .replace(/\{\{eem\}\}/g, "</mark>"),
                    }}
                  />
                  {(t.op_snippet || t.summary) && (
                    <p className="text-xs text-[var(--muted)] mt-2 leading-relaxed line-clamp-3">
                      {t.op_snippet || t.summary}
                    </p>
                  )}
                  <div className="text-[11px] text-[var(--muted)] mt-2 flex gap-2 flex-wrap">
                    {t.author && <span>by {t.author}</span>}
                    {t.posted_date && <span>· {t.posted_date}</span>}
                    {t.comments_count && t.comments_count !== "0" && <span>· 💬 {t.comments_count}</span>}
                    {t.like_count && t.like_count !== "0" && <span>· 👍 {t.like_count}</span>}
                  </div>
                  {t.comments_inlined && t.comments_inlined.length > 0 && (
                    <details className="mt-3 text-xs">
                      <summary className="cursor-pointer text-[var(--accent)] hover:underline">
                        Show first {Math.min(t.comments_inlined.length, INLINE_COMMENTS)} of {t.real_comment_count} comments
                      </summary>
                      <div className="mt-2 space-y-3 pl-3 border-l-2 border-[var(--border)]">
                        {t.comments_inlined.slice(0, INLINE_COMMENTS).map((c, j) => (
                          <div key={j}>
                            <div className="text-[10px] text-[var(--muted)]">
                              {c.author}
                              {c.vote_score > 0 && <span> · 👍 {c.vote_score}</span>}
                            </div>
                            <div className="leading-snug text-[var(--fg)]">{c.body}</div>
                          </div>
                        ))}
                      </div>
                    </details>
                  )}
                </div>
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
            name: "Pantip OEM & Factory Threads",
            url: `${SITE}/community/pantip`,
            isPartOf: { "@type": "WebSite", name: "Thai Supply Hub", url: SITE },
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: totalEntries,
              itemListElement: groups.flatMap((g) =>
                g.entries.slice(0, 10).map((t, i) => ({
                  "@type": "ListItem",
                  position: i + 1,
                  name: (t.title || t.topic_url).replace(/\{\{e?em\}\}/g, ""),
                  url: t.topic_url,
                })),
              ),
            },
          }),
        }}
      />
    </article>
  );
}
