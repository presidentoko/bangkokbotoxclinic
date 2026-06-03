import { loadYoutubeCommunity } from "@/lib/community";
import type { Metadata } from "next";

export const dynamic = "force-static";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thaisupplyhub.com";

function ytThumb(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

function fmtCount(n: string | undefined): string {
  if (!n) return "";
  const x = Number(n);
  if (!Number.isFinite(x)) return n;
  if (x >= 1_000_000) return `${(x / 1_000_000).toFixed(1)}M`;
  if (x >= 1_000) return `${(x / 1_000).toFixed(1)}K`;
  return String(x);
}

export const metadata: Metadata = {
  title: "YouTube — Thai Factory & OEM Tours",
  description:
    "Curated YouTube videos on Thai factories, OEM manufacturers, industrial estates, and sourcing trips. Multi-language coverage (English, Korean, Thai).",
  alternates: { canonical: "/community/youtube" },
  openGraph: {
    type: "article",
    title: "YouTube — Thai Factory & OEM Tours",
    description: "Video walkthroughs of Thai factories and supplier visits.",
  },
};

export default async function YoutubeFactoryPage() {
  const { groups, generated_at } = await loadYoutubeCommunity();
  const totalEntries = groups.reduce((s, g) => s + g.count, 0);

  return (
    <article className="max-w-5xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <a href="/community" className="hover:text-[var(--fg)]">Community</a>
        <span className="mx-2">›</span>
        <span>YouTube</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 text-balance">
          YouTube — Thai Factory & OEM Tours
        </h1>
        <p className="text-base text-[var(--muted)] leading-relaxed">
          Video walkthroughs and sourcing reports — {totalEntries} videos across {groups.length} search topics, covering
          factory tours, industrial estate visits, contract manufacturing experiences, and OEM partner reviews.
        </p>
        <p className="text-xs text-[var(--muted)] mt-3 italic">
          Aggregated {generated_at.slice(0, 10)} · Videos hosted by YouTube. Click to view on YouTube.
        </p>
      </header>

      <div className="space-y-10 mt-8">
        {groups.map((g) => (
          <section key={g.query}>
            <h2 className="text-xl font-bold tracking-tight mb-3 flex items-baseline gap-3 flex-wrap">
              <span>&quot;{g.query}&quot;</span>
              <span className="text-xs text-[var(--muted)] font-normal">({g.count} videos)</span>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {g.entries.map((v, i) => (
                <a
                  key={`${v.video_id}-${i}`}
                  href={v.video_url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="block bg-white border border-[var(--border)] rounded-lg overflow-hidden hover:border-black transition"
                >
                  <div className="aspect-video bg-gray-100 overflow-hidden">
                    {v.video_id && (
                      <img
                        src={ytThumb(v.video_id)}
                        alt={v.title || "YouTube video"}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    )}
                  </div>
                  <div className="p-3">
                    <div className="font-medium text-sm leading-snug line-clamp-2">{v.title || v.video_url}</div>
                    <div className="text-[11px] text-[var(--muted)] mt-2 flex gap-2 flex-wrap">
                      {v.channel && <span>{v.channel}</span>}
                      {v.view_count && <span>· {fmtCount(v.view_count)} views</span>}
                      {v.published_at && <span>· {v.published_at.slice(0, 10)}</span>}
                    </div>
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
            name: "YouTube — Thai Factory & OEM Tours",
            url: `${SITE}/community/youtube`,
            isPartOf: { "@type": "WebSite", name: "Thai Supply Hub", url: SITE },
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: totalEntries,
              itemListElement: groups.flatMap((g) =>
                g.entries.slice(0, 10).map((v, i) => ({
                  "@type": "ListItem",
                  position: i + 1,
                  name: v.title || v.video_url,
                  url: v.video_url,
                })),
              ),
            },
          }),
        }}
      />
    </article>
  );
}
