import { notFound } from "next/navigation";
import { LOCALES, STATIC_LOCALES, localeAlternates, type Locale } from "@/lib/i18n";
import { getProduct, productSlug, productIdFromSlug } from "@/lib/data";
import { affiliateUrl } from "@/lib/affiliate";
import { getAdSlots } from "@/lib/ads";
import { SponsoredBadge } from "@/components/SponsoredBadge";
import { JsonLd } from "@/components/JsonLd";

export const revalidate = 86400;

// The parent app/[locale]/layout.tsx sets `dynamicParams = false` to keep bot-scanned
// junk paths from reaching this segment (see its 2026-07-14 comment) — and in the App
// Router that setting is enforced across the *entire* route (every segment must allow
// dynamicParams, not just this one), so returning [] here doesn't get on-demand ISR as
// the old comment claimed, it makes every sponsored URL 404 permanently. The real fix
// is to enumerate the ad slots that actually exist at build time. A slot created via
// the admin panel after the last deploy won't have a page until the next deploy — same
// as every other build-time data source on this site (master_db.json included).
export async function generateStaticParams() {
  const slots = await getAdSlots();
  const seen = new Set<string>();
  const result: { locale: string; slug: string }[] = [];
  for (const slot of slots) {
    if (seen.has(slot.productSlug)) continue;
    if (!getProduct(slot.productId)) continue;
    seen.add(slot.productSlug);
    for (const locale of STATIC_LOCALES) {
      result.push({ locale, slug: slot.productSlug });
    }
  }
  return result;
}

const BASE = "https://bangkokfillers.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const p = getProduct(productIdFromSlug(slug));
  if (!p || productSlug(p) !== slug) return {};
  const isTh = locale === "th";
  const title = isTh
    ? `${p.name} — รีวิวจากแบรนด์ (Sponsored)`
    : `${p.name} — Sponsored Review`;
  return {
    title,
    alternates: {
      canonical: `${BASE}/${locale}/sponsored/${slug}`,
      languages: localeAlternates((l) => `${BASE}/${l}/sponsored/${slug}`),
    },
  };
}

export default async function SponsoredReviewPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const loc = locale as Locale;
  if (!LOCALES.includes(loc)) notFound();

  // O(1) id lookup instead of scanning all products — bot-guessed slugs
  // still 404, but without an O(n) full-catalog scan per junk request.
  const p = getProduct(productIdFromSlug(slug));
  if (!p || productSlug(p) !== slug) notFound();

  const buyUrl = affiliateUrl(p);
  const isTh = loc === "th";

  const summary =
    p.llm_summary
      ? (isTh || loc === "ar" || loc === "ko" ? p.llm_summary.th : p.llm_summary.en)
      : p.description;

  return (
    <main className="max-w-2xl mx-auto px-4 py-10 font-sans">
      {/* Sponsored disclosure — above the fold */}
      <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 flex items-center gap-2">
        <SponsoredBadge locale={loc} />
        <span>
          {isTh
            ? "เนื้อหานี้ได้รับการสนับสนุนโดยแบรนด์ ความเห็นเป็นของทีมงาน BangkokFillers"
            : "This content is sponsored by the brand. Opinions are our own."}
        </span>
      </div>

      <h1 className="text-2xl font-bold mb-2">{p.name}</h1>
      <p className="text-gray-500 text-sm mb-6">{p.brand}</p>

      <img
        src={p.image_url}
        alt={p.name}
        className="w-full max-w-xs mx-auto h-64 object-contain mb-8"
      />

      <div className="prose prose-sm max-w-none mb-8">
        <p>{summary}</p>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-2xl font-bold text-rose-600">฿{p.price_thb}</p>
          {p.discount_pct > 0 && (
            <p className="text-sm text-gray-400 line-through">฿{p.list_price_thb}</p>
          )}
        </div>
        <a
          href={buyUrl}
          target="_blank"
          rel="sponsored noopener"
          className="rounded-xl bg-rose-600 px-6 py-3 text-white font-semibold"
        >
          {isTh ? "ดูราคาล่าสุด" : "Check price"}
        </a>
      </div>

      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": p.name,
        "description": p.description,
        "image": p.image_url,
        "author": { "@type": "Organization", "name": "BangkokFillers" },
        "publisher": { "@type": "Organization", "name": "BangkokFillers" },
        "isPartOf": { "@type": "PaidContent" },
      }} />
    </main>
  );
}
