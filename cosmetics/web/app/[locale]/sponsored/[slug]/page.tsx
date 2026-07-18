import { notFound } from "next/navigation";
import { LOCALES, type Locale } from "@/lib/i18n";
import { getProduct, productSlug, productIdFromSlug } from "@/lib/data";
import { affiliateUrl } from "@/lib/affiliate";
import { SponsoredBadge } from "@/components/SponsoredBadge";
import { JsonLd } from "@/components/JsonLd";

export const revalidate = 86400;

export async function generateStaticParams() {
  // Empty — pages are generated on-demand via ISR
  return [];
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
