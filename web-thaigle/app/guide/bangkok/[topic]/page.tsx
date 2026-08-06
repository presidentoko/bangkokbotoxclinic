import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { GUIDE_TOPICS, findGuideTopic } from "@/lib/guideTopics";
import { GUIDE_TOPIC_LOADERS } from "@/lib/guideTopicLoaders";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { ShareButton } from "@/components/ShareButton";
import { AdSlot } from "@/components/AffiliateSlot";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thaigle.com";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return GUIDE_TOPICS.map((t) => ({ topic: t.slug }));
}

// The registry title is a full sentence-style headline ("Bangkok money
// essentials — ATM fees & exchange rates, PromptPay digital payments & real
// cost of living"), which is longer than a good <title>. Cut at the em dash
// for the tab title and keep the whole thing as the on-page H1.
function shortTitle(title: string): string {
  const head = title.split("—")[0].trim();
  return head.length >= 15 ? head : title;
}

export async function generateMetadata(
  { params }: { params: Promise<{ topic: string }> }
): Promise<Metadata> {
  const { topic } = await params;
  const t = findGuideTopic(topic);
  if (!t) return {};
  const desc = t.lead
    ? `${t.lead} — part of Thaigle's Bangkok guide. Practical detail, real prices in Thai Baht, updated 2026.`
    : `${t.title}. Practical Bangkok detail with real prices in Thai Baht — no influencer picks, updated 2026.`;
  return {
    title: `${shortTitle(t.title)} (2026) — Bangkok Guide`,
    description: desc.slice(0, 300),
    alternates: { canonical: `/guide/bangkok/${t.slug}` },
    openGraph: {
      type: "article",
      title: shortTitle(t.title),
      description: desc.slice(0, 300),
      url: `/guide/bangkok/${t.slug}`,
    },
  };
}

export default async function GuideTopicPage(
  { params }: { params: Promise<{ topic: string }> }
) {
  const { topic } = await params;
  const t = findGuideTopic(topic);
  if (!t) notFound();

  const loader = GUIDE_TOPIC_LOADERS[t.slug];
  if (!loader) notFound();
  const Block = await loader();

  const idx = GUIDE_TOPICS.findIndex((x) => x.slug === t.slug);
  const prev = idx > 0 ? GUIDE_TOPICS[idx - 1] : null;
  const next = idx < GUIDE_TOPICS.length - 1 ? GUIDE_TOPICS[idx + 1] : null;
  // Neighbours in the alphabetical registry are unrelated, so "related" is a
  // small rotating slice instead — enough internal linking for crawl depth
  // without pretending at topical relevance.
  const related = [...GUIDE_TOPICS.slice(idx + 1), ...GUIDE_TOPICS.slice(0, idx)]
    .filter((x) => x.emoji === t.emoji)
    .slice(0, 6);

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Thaigle", url: "/" },
        { name: "Guides", url: "/guide" },
        { name: "Bangkok A–Z", url: "/guide/bangkok" },
        { name: shortTitle(t.title), url: `/guide/bangkok/${t.slug}` },
      ]} />
      <article className="max-w-3xl mx-auto px-4 py-8">
        <nav className="text-sm text-[var(--muted)] mb-4">
          <a href="/" className="hover:text-[var(--fg)]">Home</a>
          <span className="mx-2">›</span>
          <a href="/guide" className="hover:text-[var(--fg)]">Guides</a>
          <span className="mx-2">›</span>
          <a href="/guide/bangkok" className="hover:text-[var(--fg)]">Bangkok A–Z</a>
        </nav>

        <header className="mb-6">
          <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-balance">
              <span className="mr-2">{t.emoji}</span>
              {t.title}
            </h1>
            <ShareButton
              title={shortTitle(t.title)}
              text={t.lead || t.title}
              url={`${SITE}/guide/bangkok/${t.slug}`}
              line whatsapp
            />
          </div>
          {t.lead && (
            <p className="text-base text-[var(--muted)] leading-relaxed">{t.lead}</p>
          )}
        </header>

        <Block />

        <AdSlot slot="guide-topic" />

        {related.length > 0 && (
          <section className="mt-10">
            <h2 className="text-lg font-bold mb-3">More Bangkok guides</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {related.map((r) => (
                <a
                  key={r.slug}
                  href={`/guide/bangkok/${r.slug}`}
                  className="flex gap-3 p-4 border border-[var(--border)] rounded-2xl bg-white hover:border-orange-300 hover:shadow-md transition"
                >
                  <span className="text-2xl shrink-0">{r.emoji}</span>
                  <span className="text-sm font-semibold leading-snug">{shortTitle(r.title)}</span>
                </a>
              ))}
            </div>
          </section>
        )}

        <nav className="mt-10 flex items-stretch justify-between gap-3 border-t border-[var(--border)] pt-6">
          {prev ? (
            <a href={`/guide/bangkok/${prev.slug}`} className="flex-1 min-w-0 text-sm hover:text-orange-600">
              <span className="block text-xs text-[var(--muted)] mb-1">← Previous</span>
              <span className="font-semibold line-clamp-2">{prev.emoji} {shortTitle(prev.title)}</span>
            </a>
          ) : <span className="flex-1" />}
          {next ? (
            <a href={`/guide/bangkok/${next.slug}`} className="flex-1 min-w-0 text-sm text-right hover:text-orange-600">
              <span className="block text-xs text-[var(--muted)] mb-1">Next →</span>
              <span className="font-semibold line-clamp-2">{next.emoji} {shortTitle(next.title)}</span>
            </a>
          ) : <span className="flex-1" />}
        </nav>

        <p className="mt-8 text-center">
          <a href="/guide/bangkok" className="text-sm font-semibold text-orange-600 hover:underline">
            Browse all {GUIDE_TOPICS.length} Bangkok guides →
          </a>
        </p>
      </article>
    </>
  );
}
