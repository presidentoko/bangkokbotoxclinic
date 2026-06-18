import { loadPantipCommunity } from "@/lib/community";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { AdSlot } from "@/components/AffiliateSlot";
import type { Metadata } from "next";

export const dynamic = "force-static";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.thailandgolfguide.com";

export const metadata: Metadata = {
  title: "Pantip Golf Threads — Real Thai Golfer Discussions",
  description:
    "Curated Pantip (Thailand's largest forum) golf threads — local Thai and expat discussions on Bangkok, Pattaya, Phuket, Hua Hin golf, course recommendations, green fees, and practical tips.",
  alternates: { canonical: "/guide/pantip-golf-threads" },
  openGraph: {
    type: "article",
    title: "Pantip Golf Threads — Real Thai Golfer Discussions",
    description: "Curated Pantip golf discussions across Thailand.",
  },
};

export default async function PantipThreadsPage() {
  const { groups, generated_at } = await loadPantipCommunity();
  const totalEntries = groups.reduce((s, g) => s + g.count, 0);

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <a href="/guide" className="hover:text-[var(--fg)]">Guides</a>
        <span className="mx-2">›</span>
        <span>Pantip Threads</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 text-balance">
          Pantip Golf Threads — Real Thai Golfer Discussions
        </h1>
        <p className="text-base text-[var(--muted)] leading-relaxed">
          Curated discussions from Pantip — Thailand&apos;s largest community forum — covering {totalEntries} golf threads across {groups.length} topics.
          Real conversations between Thai golfers and expats on course recommendations, green fees, caddy etiquette, and equipment.
        </p>
        <p className="text-xs text-[var(--muted)] mt-3 italic">
          Aggregated {generated_at.slice(0, 10)} · Links to original Pantip threads. Content owned by original authors.
        </p>
      </header>

      <AdSlot slot="guide-top" />

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
                  → {g.city_label} courses
                </a>
              )}
            </h2>
            <div className="space-y-2">
              {g.entries.map((t, i) => (
                <a
                  key={`${t.topic_url}-${i}`}
                  href={t.topic_url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="block bg-white border border-[var(--border)] rounded-lg p-4 hover:border-black transition"
                >
                  <div
                    className="font-medium text-sm leading-snug"
                    dangerouslySetInnerHTML={{
                      __html: (t.title || t.topic_url)
                        .replace(/\{\{em\}\}/g, '<mark class="bg-yellow-100 px-0.5">')
                        .replace(/\{\{eem\}\}/g, "</mark>"),
                    }}
                  />
                  {t.summary && (
                    <p className="text-xs text-[var(--muted)] mt-2 leading-relaxed line-clamp-2">
                      {t.summary}
                    </p>
                  )}
                  <div className="text-[11px] text-[var(--muted)] mt-2 flex gap-2 flex-wrap">
                    {t.author && <span>by {t.author}</span>}
                    {t.posted_date && <span>· {t.posted_date}</span>}
                    {t.comments_count && t.comments_count !== "0" && <span>· 💬 {t.comments_count}</span>}
                    {t.like_count && t.like_count !== "0" && <span>· 👍 {t.like_count}</span>}
                  </div>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="mt-12 border-t border-[var(--border)] pt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-4">
          Related
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <a
            href="/guide/booking-thai-golf"
            className="block p-4 border border-[var(--border)] rounded-xl bg-white hover:border-[var(--accent)] transition"
          >
            <div className="font-medium leading-tight">How to Book Golf in Thailand</div>
            <p className="text-xs text-[var(--muted)] mt-1">Booking channels, lead times, packages.</p>
          </a>
          <a
            href="/guide/green-fees-thailand"
            className="block p-4 border border-[var(--border)] rounded-xl bg-white hover:border-[var(--accent)] transition"
          >
            <div className="font-medium leading-tight">Green Fees in Thailand</div>
            <p className="text-xs text-[var(--muted)] mt-1">What you actually pay, by region and tier.</p>
          </a>
        </div>
      </section>

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Guides", url: "/guide" },
        { name: "Pantip Threads", url: "/guide/pantip-golf-threads" },
      ]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Pantip Golf Threads — Real Thai Golfer Discussions",
            url: `${SITE}/guide/pantip-golf-threads`,
            isPartOf: { "@type": "WebSite", name: "Thailand Golf Guide", url: SITE },
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
