import type { Metadata } from "next";
import { GUIDE_TOPICS } from "@/lib/guideTopics";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { ShareButton } from "@/components/ShareButton";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thaigle.com";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: `Bangkok A–Z — ${GUIDE_TOPICS.length} Practical Guides (2026)`,
  description:
    "Every practical Bangkok topic in one index — visas, transport, ATMs and exchange rates, temples, Songkran, street food, SIM cards, safety and more. Real prices in Thai Baht, updated 2026.",
  alternates: { canonical: "/guide/bangkok" },
};

function shortTitle(title: string): string {
  const head = title.split("—")[0].trim();
  return head.length >= 15 ? head : title;
}

export default function BangkokTopicIndex() {
  // Group by first letter so 253 links scan as an index rather than a wall.
  const groups = new Map<string, typeof GUIDE_TOPICS>();
  for (const t of [...GUIDE_TOPICS].sort((a, b) => shortTitle(a.title).localeCompare(shortTitle(b.title)))) {
    const letter = shortTitle(t.title).replace(/^Bangkok'?s? /i, "").charAt(0).toUpperCase();
    const key = /[A-Z]/.test(letter) ? letter : "#";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(t);
  }
  const letters = [...groups.keys()].sort();

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Thaigle", url: "/" },
        { name: "Guides", url: "/guide" },
        { name: "Bangkok A–Z", url: "/guide/bangkok" },
      ]} />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <nav className="text-sm text-[var(--muted)] mb-4">
          <a href="/" className="hover:text-[var(--fg)]">Home</a>
          <span className="mx-2">›</span>
          <a href="/guide" className="hover:text-[var(--fg)]">Guides</a>
          <span className="mx-2">›</span>
          <span>Bangkok A–Z</span>
        </nav>

        <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Bangkok A–Z</h1>
          <ShareButton
            title="Bangkok A–Z — practical guides"
            text={`${GUIDE_TOPICS.length} practical Bangkok guides — visas, transport, prices, culture`}
            url={`${SITE}/guide/bangkok`}
            line whatsapp
          />
        </div>
        <p className="text-base text-[var(--muted)] leading-relaxed mb-6 max-w-2xl">
          {GUIDE_TOPICS.length} practical Bangkok topics — visas and banking, BTS and boats, temple etiquette,
          Songkran, street food, safety. Prices in Thai Baht, no influencer picks.
        </p>

        <div className="flex flex-wrap gap-1.5 mb-8 sticky top-0 bg-[var(--bg,#fff)] py-2 z-10">
          {letters.map((l) => (
            <a
              key={l}
              href={`#letter-${l}`}
              className="inline-flex items-center justify-center min-w-[36px] min-h-[36px] px-2 rounded-lg border border-[var(--border)] text-sm font-bold hover:border-orange-400 hover:text-orange-600 transition"
            >
              {l}
            </a>
          ))}
        </div>

        {letters.map((l) => (
          <section key={l} id={`letter-${l}`} className="mb-8 scroll-mt-16">
            <h2 className="text-sm font-black uppercase tracking-widest text-[var(--muted)] mb-3">{l}</h2>
            <div className="grid sm:grid-cols-2 gap-2">
              {groups.get(l)!.map((t) => (
                <a
                  key={t.slug}
                  href={`/guide/bangkok/${t.slug}`}
                  className="flex gap-3 items-start p-3 border border-[var(--border)] rounded-xl bg-white hover:border-orange-300 hover:shadow-sm transition min-h-[44px]"
                >
                  <span className="text-xl shrink-0">{t.emoji}</span>
                  <span className="text-sm font-medium leading-snug">{shortTitle(t.title)}</span>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
