import {
  loadPantipCommunity,
  loadNaverCommunity,
  loadYoutubeCommunity,
  loadNaverCafeCommunity,
  loadRedditCommunity,
} from "@/lib/community";
import type { Metadata } from "next";

export const dynamic = "force-static";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thaisupplyhub.com";

export const metadata: Metadata = {
  title: "Community — Real Buyer Discussions on Thai OEM",
  description:
    "Aggregated Pantip threads, Korean Naver blog posts, and YouTube factory tours covering Thai OEM/ODM manufacturers and industrial estates.",
  alternates: { canonical: "/community" },
};

export default async function CommunityHubPage() {
  const [pantip, naver, youtube, cafe, reddit] = await Promise.all([
    loadPantipCommunity(),
    loadNaverCommunity(),
    loadYoutubeCommunity(),
    loadNaverCafeCommunity(),
    loadRedditCommunity(),
  ]);

  const items = [
    {
      href: "/community/pantip",
      title: "Pantip Threads",
      desc: "Thai-language forum discussions on OEM, ODM, industrial estates, and supplier vetting.",
      count: pantip.groups.reduce((s, g) => s + g.count, 0),
      groups: pantip.groups.length,
    },
    {
      href: "/community/naver",
      title: "Naver Blogs",
      desc: "Korean-language sourcing reports and factory visit posts from Korean buyers.",
      count: naver.groups.reduce((s, g) => s + g.count, 0),
      groups: naver.groups.length,
    },
    {
      href: "/community/youtube",
      title: "YouTube Factory Tours",
      desc: "Video walkthroughs of Thai factories, industrial estates, and OEM partner visits.",
      count: youtube.groups.reduce((s, g) => s + g.count, 0),
      groups: youtube.groups.length,
    },
    {
      href: "/community/cafe",
      title: "Naver Cafes",
      desc: "Korean cafe community posts — informal Q&A, warning signals, sourcing tips from Korean buyers.",
      count: cafe.groups.reduce((s, g) => s + g.count, 0),
      groups: cafe.groups.length,
    },
    {
      href: "/community/reddit",
      title: "Reddit Threads",
      desc: "English-language Reddit discussions from r/Thailand, r/Entrepreneur, r/manufacturing, r/supplychain.",
      count: reddit.groups.reduce((s, g) => s + g.count, 0),
      groups: reddit.groups.length,
    },
  ];

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 text-balance">
          Community — Real Buyer Discussions on Thai OEM
        </h1>
        <p className="text-base text-[var(--muted)] leading-relaxed">
          External community content aggregated from Thai, Korean, and global discussions on Thai OEM/ODM manufacturers,
          industrial estates, and contract manufacturing. Use these as a sanity check before reaching out to suppliers.
        </p>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {items.map((it) => (
          <a
            key={it.href}
            href={it.href}
            className="block p-5 border border-[var(--border)] rounded-xl bg-white hover:border-black transition"
          >
            <div className="font-semibold text-lg mb-2">{it.title}</div>
            <p className="text-sm text-[var(--muted)] leading-snug mb-3">{it.desc}</p>
            <div className="text-xs text-[var(--muted)]">
              {it.count.toLocaleString()} entries · {it.groups} topics
            </div>
          </a>
        ))}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Community — Real Buyer Discussions on Thai OEM",
            url: `${SITE}/community`,
            isPartOf: { "@type": "WebSite", name: "Thai Supply Hub", url: SITE },
          }),
        }}
      />
    </article>
  );
}
