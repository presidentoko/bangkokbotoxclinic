import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  allProducts,
  getProduct,
  productSlug,
  productIdFromSlug,
  similarProducts,
  keyIngredients,
  cheaperAlternatives,
  pricePosition,
  CONCERNS,
} from "@/lib/data";
import { STATIC_LOCALES, thaiOnlyAlternates, t, toBaseLocale, concernLabel, type Locale } from "@/lib/i18n";
import { productLd, breadcrumbLd, faqLd } from "@/lib/schema";
import { thaiAlias } from "@/lib/thai-names";
import { fdaRecord, originLabel, type FdaRecord } from "@/lib/fda";
import { productVerdict, productFaqs, cleanName } from "@/lib/product-verdict";
import { JsonLd } from "@/components/JsonLd";
import { FaqSection } from "@/components/FaqSection";
import { AdvertiseCta } from "@/components/AdvertiseCta";
import { AffiliateButton } from "@/components/AffiliateButton";
import { IngredientDecoder } from "@/components/IngredientDecoder";
import { ExpandableText } from "@/components/ExpandableText";
import { ShareCard } from "@/components/ShareCard";
import { YoutubeModule } from "@/components/YoutubeModule";
import { WatsonsModule } from "@/components/WatsonsModule";
import { scoreColor } from "@/lib/format";
import { isLinkAlive } from "@/lib/affiliate";
import { ViewTracker } from "@/components/ViewTracker";
import { FavoriteButton } from "@/components/FavoriteButton";

// Was `revalidate = 86400`. This page's only data source is
// `import master from "@/data/master_db.json"` — a static import bundled at
// build time — so regenerating it produced a byte-identical page. That is
// 1,003 products × 4 locales = 4,012 ISR writes a day buying nothing, on the
// plan whose ISR write quota this site already blew through once (1.6M/200K,
// 2026-07-10). New product data arrives by committing master_db.json and
// deploying, and a deploy rebuilds every page anyway.
export const revalidate = false;

const BASE = "https://bangkokfillers.com";

// Statically generate every product. (An earlier attempt at a "high-value only"
// filter keyed off `p.source !== "beautrium"`, but no product in master_db.json
// has ever had a `source` field, so the condition was always true and every
// product was generated anyway — the filter was a no-op. Note this file's
// [locale] layout sets `dynamicParams = false`, so a real exclusion here would
// permanently 404 those products, not "render on-demand" as the old comment
// claimed — if a future selective filter is reintroduced, make sure excluded
// products are also dropped from app/sitemap.ts.)
// Thai only. The /en product pages were `noindex` for every product (no
// llm_summary.en exists, so the body reused the Thai copy verbatim), which made
// 1,003 pages plus 1,003 generated OG images permanently unable to rank while
// still costing a crawl each — on a site where Google indexes 548 pages total.
// middleware.ts now 308s /en/product/* onto the Thai URL. Restore
// STATIC_LOCALES.flatMap here, the "en" hreflang entry below, and remove the
// middleware block once the pipeline produces real English summaries.
export function generateStaticParams() {
  return allProducts().map((p) => ({ locale: "th", slug: productSlug(p) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: localeRaw, slug } = await params;
  const locale = localeRaw as Locale;
  const p = getProduct(productIdFromSlug(slug));
  if (!p) return {};
  const concern =
    Array.isArray(p.concern_seeds)
      ? p.concern_seeds[0]
      : String(p.concern_seeds || "").split("|")[0] || "acne";
  // All 57 makeup products carry total_score 0 across every concern and are
  // scored through makeup_score instead (see lib/types.ts). Reading the
  // concern score here published "0/100" for every one of them.
  const totalScoreMeta = p.makeup_category
    ? Math.round(p.makeup_score ?? 0)
    : Math.round(p.total_score?.[concern] ?? 0);
  const priceMeta = p.price_thb ? `฿${Math.round(p.price_thb).toLocaleString()}` : "";
  const alias = thaiAlias(p);
  const cleanedName = cleanName(p.name);
  // The old title led with "รีวิว ส่วนผสม" — words that put the page in direct
  // competition with Konvy/Shopee/Lazada/Watsons on the bare product-name
  // query, which a site with no backlink profile cannot win. "ดีไหม" is the
  // modifier a Thai shopper adds when they are checking a claim before buying,
  // and no marketplace listing can answer it, so that is the query shape this
  // page is actually competitive on. The Thai brand spelling rides along
  // because 987 of 1,003 product names are Latin-only (see lib/thai-names.ts).
  const title =
    locale === "th"
      ? [
          `${cleanedName} ดีไหม?`,
          alias,
          "รีวิว Pantip + ส่วนผสม",
          priceMeta,
        ]
          .filter(Boolean)
          .join(" ")
      : `${cleanedName} — Worth It? Score ${totalScoreMeta}/100, Reviews & Ingredients`;
  // Key active ingredient for this concern (first one with efficacy > 0)
  const keyActive = p.ingredient_analysis?.find(
    (a: { concern_efficacy?: Record<string, number>; inci: string }) =>
      (a.concern_efficacy?.[concern] ?? 0) > 0
  )?.inci ?? "";
  const priceStr = priceMeta;
  // The description used to be `rawDesc.slice(0, 155)` — the manufacturer's own
  // marketing blurb, i.e. the exact copy every marketplace listing already
  // shows. As a search snippet it gave a shopper no reason to pick us over
  // Konvy. Lead with what only this page has (an independent score, the flag
  // check, the Pantip count) and keep the vendor blurb as the tail.
  const mentions = p.pantip?.mention_count ?? 0;
  const description =
    locale === "th"
      ? [
          `${cleanedName}${alias ? ` (${alias})` : ""} ดีไหม?`,
          `คะแนนอิสระ ${totalScoreMeta}/100 จากส่วนผสม${keyActive ? ` (${keyActive})` : ""}`,
          `รีวิว ${p.konvy_review_count.toLocaleString()} รายการ`,
          mentions > 0 ? `${mentions} ความเห็นจาก Pantip` : "",
          priceStr,
        ]
          .filter(Boolean)
          .join(" · ")
          .slice(0, 158)
      : [
          `Is ${cleanedName} worth it?`,
          `Independent score ${totalScoreMeta}/100${keyActive ? ` · Key active: ${keyActive}` : ""}`,
          `${p.konvy_review_count.toLocaleString()} reviews`,
          priceStr,
        ]
          .filter(Boolean)
          .join(" · ")
          .slice(0, 158);
  // The English page reuses the (Thai-language) `p.description` body copy verbatim
  // whenever no `llm_summary.en` exists — which is every product today — making
  // /en/product/* near-duplicates of /th/product/*. Keep them crawlable (so the
  // canonical/hreflang graph stays intact) but out of the index until real
  // English summaries exist in the pipeline.
  const hasEnglishSummary = Boolean(p.llm_summary?.en);
  return {
    title,
    description,
    ...(locale === "en" && !hasEnglishSummary
      ? { robots: { index: false, follow: true } }
      : {}),
    alternates: {
      canonical: `${BASE}/${locale}/product/${slug}`,
      languages: thaiOnlyAlternates(`${BASE}/th/product/${slug}`),
    },
    openGraph: {
      title,
      description,
      url: `${BASE}/${locale}/product/${slug}`,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

/**
 * Takes the score already resolved by the caller rather than re-reading
 * total_score[concern], which is zero for all 57 makeup products and made this
 * line say "ได้คะแนนรวม 0/100" directly under a badge reading 45.
 */
function fallbackSummary(
  p: { name: string; konvy_review_count: number; makeup_category?: string | null },
  locale: Locale,
  score: number
) {
  const isTh = locale === "th";
  if (score <= 0) {
    return isTh
      ? `${p.name} ยังไม่มีรีวิวมากพอที่จะให้คะแนน — ดูส่วนผสมและราคาด้านล่าง`
      : `${p.name} does not yet have enough reviews to score — see the ingredients and price below.`;
  }
  const basis = p.makeup_category
    ? isTh
      ? "รีวิวผู้ใช้จริงและความคุ้มค่า"
      : "real user reviews and value"
    : isTh
      ? "ส่วนผสมและรีวิว"
      : "its ingredients and reviews";
  return isTh
    ? `${p.name} ได้คะแนนรวม ${score}/100 จาก${basis} ${p.konvy_review_count} รายการ`
    : `${p.name} scores ${score}/100 from ${basis} across ${p.konvy_review_count} reviews.`;
}

/* ─────────────────────────────────────────
   MODULE 0 — About this product (description)
───────────────────────────────────────── */
function DescriptionModule({
  p,
  locale,
}: {
  p: { description?: string };
  locale: Locale;
}) {
  if (!p.description) return null;
  return (
    <section className="space-y-3">
      <h2 className="font-serif-display text-lg font-semibold text-neutral-800">
        {locale === "th" ? "เกี่ยวกับสินค้านี้" : "About this product"}
      </h2>
      <div className="rounded-2xl border border-[#efe1db] bg-white px-5 py-4 shadow-sm shadow-rose-100">
        <ExpandableText text={p.description} locale={locale} lines={4} />
      </div>
    </section>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  const pct = Math.min(100, Math.max(0, Math.round(value)));
  return (
    <div className="flex items-center gap-3">
      <span className="w-32 shrink-0 text-sm text-[#8a7a76]">{label}</span>
      <div className="flex-1 h-2.5 rounded-full bg-rose-50 overflow-hidden">
        <div
          className="h-full rounded-full bg-rose-400"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-8 text-right text-sm font-semibold text-neutral-700">{pct}</span>
    </div>
  );
}

/* ─────────────────────────────────────────
   MODULE 1 — What real users say
───────────────────────────────────────── */
function ReviewModule({
  p,
  locale,
}: {
  p: {
    konvy_rating: number;
    konvy_review_count: number;
    review_summary: {
      count: number;
      avg: number;
      pos_keywords: string[];
      neg_keywords: string[];
      samples: { rating: number; body: string; author?: string }[];
    };
  };
  locale: Locale;
}) {
  const { pos_keywords, neg_keywords, samples } = p.review_summary;
  const hasContent =
    p.konvy_review_count > 0 ||
    pos_keywords.length > 0 ||
    neg_keywords.length > 0 ||
    samples.length > 0;
  if (!hasContent) return null;

  const displayRating =
    p.review_summary.avg > 0 ? p.review_summary.avg : p.konvy_rating;
  const displayCount =
    p.review_summary.count > 0 ? p.review_summary.count : p.konvy_review_count;

  return (
    <section className="space-y-4">
      {/* Section heading */}
      <h2 className="font-serif-display text-lg font-semibold text-neutral-800">
        {locale === "th" ? "ผู้ใช้จริงพูดว่า" : "What real users say"}
      </h2>

      {/* Big avg rating + count */}
      {displayCount > 0 && (
        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-black tabular-nums text-[#2b2222] leading-none">
            {displayRating > 0 ? displayRating.toFixed(1) : "—"}
          </span>
          <div className="flex flex-col">
            <span className="text-amber-500 text-lg leading-none">
              {"★".repeat(Math.round(displayRating))}
              {"☆".repeat(Math.max(0, 5 - Math.round(displayRating)))}
            </span>
            <span className="text-xs text-[#8a7a76] mt-0.5">
              {displayCount.toLocaleString()}{" "}
              {locale === "th" ? "รีวิว" : "reviews"}
            </span>
          </div>
        </div>
      )}

      {/* Keyword chips */}
      {(pos_keywords.length > 0 || neg_keywords.length > 0) && (
        <div className="flex flex-wrap gap-2">
          {pos_keywords.slice(0, 8).map((kw) => (
            <span
              key={kw}
              className="rounded-full bg-rose-50 border border-rose-200 px-3 py-1 text-xs text-rose-700 font-medium"
            >
              + {kw}
            </span>
          ))}
          {neg_keywords.slice(0, 5).map((kw) => (
            <span
              key={kw}
              className="rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs text-amber-700 font-medium"
            >
              − {kw}
            </span>
          ))}
        </div>
      )}

      {/* Sample review cards */}
      {samples.length > 0 && (
        <div className="space-y-3">
          {samples.slice(0, 3).map((r, i) => (
            <blockquote
              key={i}
              className="rounded-2xl border border-[#efe1db] bg-white px-5 py-4 shadow-sm shadow-rose-100"
            >
              <p className="text-sm text-neutral-700 leading-relaxed">
                &ldquo;{r.body}&rdquo;
              </p>
              <footer className="mt-2 flex items-center gap-2 text-xs text-neutral-400">
                <span className="text-amber-500">
                  {"★".repeat(r.rating)}
                  {"☆".repeat(Math.max(0, 5 - r.rating))}
                </span>
                {r.author && (
                  <span className="text-[#8a7a76]">{r.author}</span>
                )}
              </footer>
            </blockquote>
          ))}
        </div>
      )}
    </section>
  );
}

/* ─────────────────────────────────────────
   MODULE 1b — What Pantip says
───────────────────────────────────────── */
function PantipModule({
  p,
  locale,
}: {
  p: {
    pantip?: {
      mention_count: number;
      thread_count: number;
      snippets: { text: string; topic_id: string; author?: string }[];
    };
  };
  locale: Locale;
}) {
  if (!p.pantip || p.pantip.mention_count <= 0) return null;
  const { mention_count, thread_count, snippets } = p.pantip;

  return (
    <section className="space-y-4">
      {/* Section heading */}
      <h2 className="font-serif-display text-lg font-semibold text-neutral-800">
        {t(locale, "pantip_says")}
      </h2>

      {/* Stats row */}
      <div className="flex items-center gap-4 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3">
        <div className="flex flex-col items-center">
          <span className="text-2xl font-black tabular-nums text-amber-700 leading-none">
            {mention_count}
          </span>
          <span className="text-[10px] text-amber-600 mt-0.5 uppercase tracking-wide">
            {t(locale, "mentions")}
          </span>
        </div>
        <div className="w-px h-8 bg-amber-200" aria-hidden="true" />
        <div className="flex flex-col items-center">
          <span className="text-2xl font-black tabular-nums text-amber-700 leading-none">
            {thread_count}
          </span>
          <span className="text-[10px] text-amber-600 mt-0.5 uppercase tracking-wide">
            {locale === "th" ? "กระทู้" : "threads"}
          </span>
        </div>
        <div className="flex-1" />
        <span className="text-xs text-amber-500 font-medium">Pantip.com</span>
      </div>

      {/* Snippet cards */}
      {snippets.length > 0 && (
        <div className="space-y-3">
          {snippets.slice(0, 4).map((s, i) => (
            <a
              key={i}
              href={`https://pantip.com/topic/${s.topic_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-2xl border border-[#f5e6d3] bg-[#fffaf5] px-5 py-4 shadow-sm hover:border-amber-300 hover:bg-amber-50 transition-colors group"
            >
              <p className="text-sm text-neutral-700 leading-relaxed line-clamp-3">
                &ldquo;{s.text.trim()}&rdquo;
              </p>
              <footer className="mt-2 flex items-center gap-2 text-xs text-neutral-400">
                {s.author && (
                  <span className="text-[#b08050]">{s.author}</span>
                )}
                <span className="ml-auto text-amber-500 group-hover:text-amber-600 transition-colors">
                  {locale === "th" ? "อ่านต่อ →" : "Read thread →"}
                </span>
              </footer>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}

/* ─────────────────────────────────────────
   MODULE 2 — Key ingredients, explained
───────────────────────────────────────── */
function KeyIngredientsModule({
  p,
  concern,
  locale,
}: {
  p: Parameters<typeof keyIngredients>[0];
  concern: string;
  locale: Locale;
}) {
  const keys = keyIngredients(p, concern, 5);
  if (keys.length === 0) return null;

  return (
    <section className="space-y-4">
      <h2 className="font-serif-display text-lg font-semibold text-neutral-800">
        {locale === "th" ? "ส่วนผสมสำคัญ" : "Key ingredients, explained"}
      </h2>

      <div className="space-y-3">
        {keys.map((ing) => {
          const name = locale === "th" ? ing.th_name || ing.en_name : ing.en_name || ing.th_name;
          const mechanism =
            locale === "th" ? ing.mechanism_th : ing.mechanism_en;
          return (
            <Link
              key={ing.inci}
              href={`/${locale}/ingredient/${ing.slug}`}
              className="flex items-start gap-3 rounded-2xl border border-[#efe1db] bg-white px-4 py-3.5 shadow-sm shadow-rose-100 hover:border-rose-300 hover:bg-rose-50 transition-colors group"
            >
              {/* Efficacy stars */}
              <span className="shrink-0 mt-0.5 text-[13px] text-amber-500 font-semibold leading-none">
                {"★".repeat(ing.efficacy)}
                {"☆".repeat(Math.max(0, 3 - ing.efficacy))}
              </span>

              {/* Name + mechanism */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#2b2222] group-hover:text-rose-600 transition-colors">
                  {name}
                </p>
                {mechanism && (
                  <p className="mt-0.5 text-xs text-[#8a7a76] leading-relaxed line-clamp-2">
                    {mechanism}
                  </p>
                )}
              </div>

              {/* Arrow hint */}
              <span className="shrink-0 self-center text-[#8a7a76] group-hover:text-rose-500 transition-colors text-sm">
                →
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   MODULE 3 — Heads up (caution flags)
───────────────────────────────────────── */
const FLAG_COPY: Record<
  string,
  { th: string; en: string; chip_class: string }
> = {
  comedogenic: {
    th: "อาจอุดรูขุมขน",
    en: "May clog pores",
    chip_class: "bg-red-50 border-red-200 text-red-700",
  },
  fragrance: {
    th: "น้ำหอม — เสี่ยงแพ้ง่าย",
    en: "Fragrance — potential sensitiser",
    chip_class: "bg-amber-50 border-amber-200 text-amber-700",
  },
  alcohol: {
    th: "แอลกอฮอล์ — อาจระคายเคือง",
    en: "Alcohol — may be drying",
    chip_class: "bg-amber-50 border-amber-200 text-amber-700",
  },
  irritant: {
    th: "อาจระคายเคืองผิวบอบบาง",
    en: "Possible irritant for sensitive skin",
    chip_class: "bg-amber-50 border-amber-200 text-amber-700",
  },
};

/** Unique caution flags across the formula, keyed flag → contributing INCIs.
 *  Shared so the verdict block, the FAQ answers and the Heads-up chips can
 *  never disagree about what was flagged. */
function collectFlags(
  p: { ingredient_analysis: { inci: string; safety_flags: string[] }[] },
  concern: string
): Map<string, string[]> {
  const flagMap = new Map<string, string[]>();
  for (const a of p.ingredient_analysis) {
    for (const f of a.safety_flags) {
      // concern-aware: only show comedogenic for acne products
      if (f === "comedogenic" && concern !== "acne") continue;
      if (!(f in FLAG_COPY)) continue;
      if (!flagMap.has(f)) flagMap.set(f, []);
      flagMap.get(f)!.push(a.inci);
    }
  }
  return flagMap;
}

function HeadsUpModule({
  p,
  concern,
  locale,
}: {
  p: { ingredient_analysis: { inci: string; safety_flags: string[] }[] };
  concern: string;
  locale: Locale;
}) {
  const flagMap = collectFlags(p, concern);

  if (flagMap.size === 0) {
    // Show a soft positive note
    return (
      <section className="space-y-2">
        <h2 className="font-serif-display text-lg font-semibold text-neutral-800">
          {locale === "th" ? "ข้อควรระวัง" : "Heads up"}
        </h2>
        <p className="text-sm text-emerald-700 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
          {locale === "th"
            ? "✓ ไม่พบส่วนผสมที่น่ากังวลในรายการ"
            : "✓ No major red-flag ingredients detected"}
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      <h2 className="font-serif-display text-lg font-semibold text-neutral-800">
        {locale === "th" ? "ข้อควรระวัง" : "Heads up"}
      </h2>
      <div className="flex flex-wrap gap-2">
        {Array.from(flagMap.entries()).map(([flag, incis]) => {
          const copy = FLAG_COPY[flag];
          return (
            <div
              key={flag}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium flex items-center gap-1.5 ${copy.chip_class}`}
            >
              <span>⚠</span>
              <span>{locale === "th" ? copy.th : copy.en}</span>
              <span className="opacity-60">({incis.length})</span>
            </div>
          );
        })}
      </div>
      {/* This used to live in a `title` attribute ("hover or tap a chip") — title
          never fires on tap, so the ingredient names were unreachable on mobile.
          Just show them. */}
      <p className="text-xs text-[#8a7a76] leading-relaxed">
        {Array.from(flagMap.entries())
          .map(([flag, incis]) => `${locale === "th" ? FLAG_COPY[flag].th : FLAG_COPY[flag].en}: ${incis.join(", ")}`)
          .join(" · ")}
      </p>
    </section>
  );
}

/* ─────────────────────────────────────────
   MODULE 0b — Should you buy it?
   The page's answer to "<product> ดีไหม", stated before any of the
   supporting detail. Placed directly under the verdict card so the answer
   is above the fold on a phone.
───────────────────────────────────────── */
function ShouldYouBuyModule({
  name,
  verdict,
  locale,
}: {
  name: string;
  verdict: { buyIf: string; skipIf: string | null; priceNote: string | null };
  locale: Locale;
}) {
  const isTh = locale === "th";
  return (
    <section className="space-y-3">
      <h2 className="font-serif-display text-lg font-semibold text-neutral-800">
        {isTh ? `${name} ดีไหม? สรุปสั้น ๆ` : `Is ${name} worth it? The short answer`}
      </h2>
      <div className="rounded-2xl border border-[#efe1db] bg-white shadow-sm shadow-rose-100 divide-y divide-[#f5ebe7]">
        <div className="flex gap-3 px-5 py-4">
          <span aria-hidden="true" className="text-emerald-600 shrink-0">✓</span>
          <p className="text-sm text-neutral-700 leading-relaxed">
            <span className="font-semibold text-neutral-900">
              {isTh ? "ควรซื้อถ้า " : "Buy it if "}
            </span>
            {verdict.buyIf}
          </p>
        </div>
        {verdict.skipIf && (
          <div className="flex gap-3 px-5 py-4">
            <span aria-hidden="true" className="text-amber-600 shrink-0">⚠</span>
            <p className="text-sm text-neutral-700 leading-relaxed">
              <span className="font-semibold text-neutral-900">
                {isTh ? "ข้ามไปถ้า " : "Skip it if "}
              </span>
              {verdict.skipIf}
            </p>
          </div>
        )}
        {verdict.priceNote && (
          <div className="flex gap-3 px-5 py-4">
            <span aria-hidden="true" className="text-[#c9a86a] shrink-0">฿</span>
            <p className="text-sm text-neutral-700 leading-relaxed">
              <span className="font-semibold text-neutral-900">
                {isTh ? "ราคาเทียบตลาด " : "Price vs the market "}
              </span>
              {verdict.priceNote}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   MODULE 0c — Thai FDA notification check
   The one check a marketplace listing cannot reproduce. Rendered only when
   scripts/build_fda_registry.py resolved this product to a notification;
   a product with no record shows nothing, because absence means our name
   matcher failed, not that the product is unregistered.
───────────────────────────────────────── */
function FdaModule({
  fda,
  locale,
}: {
  fda: FdaRecord;
  locale: Locale;
}) {
  const isTh = locale === "th";
  const tone = fda.active
    ? "border-emerald-200 bg-emerald-50"
    : "border-amber-200 bg-amber-50";
  return (
    <section className="space-y-3">
      <h2 className="font-serif-display text-lg font-semibold text-neutral-800">
        {isTh ? "ตรวจสอบเลขที่จดแจ้ง อย." : "Thai FDA notification"}
      </h2>
      <div className={`rounded-2xl border ${tone} px-5 py-4 space-y-2`}>
        <p className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
          <span aria-hidden="true">{fda.active ? "✓" : "⚠"}</span>
          <span>
            {isTh
              ? `เลขที่ใบรับจดแจ้ง ${fda.lcnno} · สถานะ ${fda.status}`
              : `Notification ${fda.lcnno} · status ${fda.status}`}
          </span>
        </p>
        <dl className="text-sm text-neutral-700 space-y-1">
          <div className="flex gap-2">
            <dt className="shrink-0 text-[#8a7a76]">{isTh ? "ชื่อที่จดแจ้ง:" : "Notified as:"}</dt>
            <dd>{fda.notified_name_en || fda.notified_name_th}</dd>
          </div>
          {fda.holder && (
            <div className="flex gap-2">
              <dt className="shrink-0 text-[#8a7a76]">{isTh ? "ผู้จดแจ้ง:" : "Held by:"}</dt>
              <dd>{fda.holder}</dd>
            </div>
          )}
          {fda.type_allow && (
            <div className="flex gap-2">
              <dt className="shrink-0 text-[#8a7a76]">{isTh ? "ประเภท:" : "Type:"}</dt>
              <dd>{originLabel(fda.type_allow, locale)}</dd>
            </div>
          )}
        </dl>
        {fda.url && (
          <a
            href={fda.url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-block text-sm font-semibold text-rose-600 hover:text-rose-700 underline underline-offset-2"
          >
            {isTh ? "ตรวจสอบที่เว็บไซต์ อย. →" : "Verify on the FDA site →"}
          </a>
        )}
        <p className="text-xs text-[#8a7a76] leading-relaxed">
          {isTh
            ? "เราจับคู่จากชื่อผลิตภัณฑ์กับฐานข้อมูลจดแจ้งของ อย. เลขที่ที่ใช้อ้างอิงได้จริงคือเลขที่พิมพ์บนกล่องสินค้า โปรดตรวจสอบอีกครั้งก่อนซื้อ"
            : "Matched by product name against the Thai FDA notification database. The authoritative number is the one printed on the package — check it before you buy."}
        </p>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   MODULE 4 — Dual-verified badge
───────────────────────────────────────── */
function DualVerifiedBadge({
  p,
  concern,
  locale,
}: {
  p: {
    ingredient_score: Record<string, number>;
    review_score: number;
  };
  concern: string;
  locale: Locale;
}) {
  const ingScore = p.ingredient_score?.[concern] ?? 0;
  const revScore = p.review_score ?? 0;
  if (ingScore < 70 || revScore < 70) return null;

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 shadow-sm shadow-rose-100">
      {/* Badge icon */}
      <span className="shrink-0 text-rose-500 text-xl" aria-hidden="true">
        ✦
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-rose-700">
          {locale === "th"
            ? "ส่วนผสมดี ⊕ รีวิวดี"
            : "Backed by ingredients ⊕ loved by users"}
        </p>
        <p className="text-xs text-rose-500 mt-0.5">
          {locale === "th"
            ? `คะแนนส่วนผสม ${Math.round(ingScore)} · คะแนนรีวิว ${Math.round(revScore)}`
            : `Ingredient score ${Math.round(ingScore)} · Review score ${Math.round(revScore)}`}
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MODULE 5 — Similar products
───────────────────────────────────────── */
function SimilarProductsModule({
  p,
  concern,
  locale,
  slug,
}: {
  p: Parameters<typeof similarProducts>[0];
  concern: string;
  locale: Locale;
  slug: string;
}) {
  const sims = similarProducts(p, concern, 4);
  if (sims.length === 0) return null;

  return (
    <section className="space-y-4">
      <h2 className="font-serif-display text-lg font-semibold text-neutral-800">
        {locale === "th" ? "สินค้าใกล้เคียง" : "Similar products"}
      </h2>

      {/* Horizontal scroll on mobile, grid on sm+ */}
      <div className="flex gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-4 sm:overflow-visible snap-x snap-mandatory sm:snap-none">
        {sims.map((q) => {
          const qSlug = productSlug(q);
          const qScore = Math.round(q.total_score?.[concern] ?? 0);
          return (
            <Link
              key={q.product_id}
              href={`/${locale}/product/${qSlug}`}
              className="flex-shrink-0 snap-start w-40 sm:w-auto flex flex-col rounded-2xl border border-[#efe1db] bg-white overflow-hidden shadow-sm shadow-rose-100 hover:border-rose-300 hover:shadow-rose-200 transition-all"
            >
              {/* Thumbnail */}
              <div className="relative aspect-square bg-neutral-50 flex items-center justify-center">
                {q.image_url ? (
                  <Image
                    src={q.image_url}
                    alt={q.name}
                    width={120}
                    height={120}
                    className="object-contain w-full h-full p-2"
                  />
                ) : (
                  <span className="text-neutral-300 text-3xl">✦</span>
                )}
                {/* Score pill */}
                <span
                  className={`absolute top-2 right-2 rounded-full px-2 py-0.5 text-[10px] font-bold border bg-white shadow-sm ${scoreColor(qScore)}`}
                >
                  {qScore}
                </span>
              </div>

              {/* Info */}
              <div className="px-3 py-2.5 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[#c9a86a] truncate">
                  {q.brand}
                </p>
                <p className="text-xs text-[#2b2222] leading-snug mt-0.5 line-clamp-2">
                  {q.name}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   MODULE 6 — Cheaper alternatives
───────────────────────────────────────── */
function CheaperAlternativesModule({
  p,
  concern,
  locale,
}: {
  p: Parameters<typeof cheaperAlternatives>[0];
  concern: string;
  locale: Locale;
}) {
  const alts = cheaperAlternatives(p, concern, 4);
  if (alts.length === 0) return null;

  return (
    <section className="space-y-4">
      <h2 className="font-serif-display text-lg font-semibold text-neutral-800">
        {locale === "th" ? "ตัวเลือกที่ถูกกว่า" : "Cheaper alternatives"}
      </h2>

      <div className="flex gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-4 sm:overflow-visible snap-x snap-mandatory sm:snap-none">
        {alts.map((q) => {
          const qSlug = productSlug(q);
          const qScore = Math.round(q.total_score?.[concern] ?? 0);
          const savings = Math.round(p.price_thb - q.price_thb);
          return (
            <Link
              key={q.product_id}
              href={`/${locale}/product/${qSlug}`}
              className="flex-shrink-0 snap-start w-40 sm:w-auto flex flex-col rounded-2xl border border-[#efe1db] bg-white overflow-hidden shadow-sm shadow-rose-100 hover:border-rose-300 hover:shadow-rose-200 transition-all"
            >
              {/* Thumbnail */}
              <div className="relative aspect-square bg-neutral-50 flex items-center justify-center">
                {q.image_url ? (
                  <Image
                    src={q.image_url}
                    alt={q.name}
                    width={120}
                    height={120}
                    className="object-contain w-full h-full p-2"
                  />
                ) : (
                  <span className="text-neutral-300 text-3xl">✦</span>
                )}
                {/* Score pill */}
                <span
                  className={`absolute top-2 right-2 rounded-full px-2 py-0.5 text-[10px] font-bold border bg-white shadow-sm ${scoreColor(qScore)}`}
                >
                  {qScore}
                </span>
              </div>

              {/* Info */}
              <div className="px-3 py-2.5 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[#c9a86a] truncate">
                  {q.brand}
                </p>
                <p className="text-xs text-[#2b2222] leading-snug mt-0.5 line-clamp-2">
                  {q.name}
                </p>
                <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-bold text-[#2b2222]">
                    ฿{Math.round(q.price_thb).toLocaleString()}
                  </span>
                  {savings > 0 && (
                    <span className="rounded-full bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                      -{savings.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   PAGE
───────────────────────────────────────── */
export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: localeRaw, slug } = await params;
  const locale = localeRaw as Locale;

  const p = getProduct(productIdFromSlug(slug));
  if (!p) notFound();

  const linkAlive = await isLinkAlive(p.product_id);

  // Handle concern_seeds being a string, "|"-delimited string, or array
  const concern =
    (Array.isArray(p.concern_seeds)
      ? p.concern_seeds[0]
      : String(p.concern_seeds).split("|")[0]) || "acne";

  const baseLoc = toBaseLocale(locale);
  const pageUrl = `https://bangkokfillers.com/${locale}/product/${slug}`;
  const isMakeup = Boolean(p.makeup_category);
  const totalScore = isMakeup
    ? Math.round(p.makeup_score ?? 0)
    : Math.round(p.total_score?.[concern] ?? 0);
  const summary = p.llm_summary?.[baseLoc] || fallbackSummary(p, baseLoc, totalScore);
  const ingredientScore = Math.round(p.ingredient_score?.[concern] ?? 0);
  const hasDiscount = p.discount_pct > 0;
  const description = typeof p.description === "string" ? p.description.trim() : "";

  // ── "Should you buy it?" — the answer to "<product> ดีไหม" ──────────────
  const alias = baseLoc === "th" ? thaiAlias(p) : undefined;
  const actives = keyIngredients(p, concern, 3);
  const flagLabels = Array.from(collectFlags(p, concern).keys()).map((f) =>
    baseLoc === "th" ? FLAG_COPY[f].th : FLAG_COPY[f].en
  );
  // The concerns this product is actually catalogued under — `concern_seeds`,
  // the same field the page's primary `concern` is taken from. Deriving them
  // from total_score instead would list every concern the scorer happened to
  // emit a non-zero number for, which is most of them.
  const concernNames = (
    Array.isArray(p.concern_seeds)
      ? p.concern_seeds
      : String(p.concern_seeds ?? "").split("|")
  )
    .map((c) => c.trim())
    .filter((c) => CONCERNS.includes(c as (typeof CONCERNS)[number]))
    .map((c) => concernLabel(baseLoc, c));
  const verdictInput = {
    p,
    locale: baseLoc,
    concern,
    totalScore,
    ingredientScore,
    actives,
    flagLabels,
    pricePos: pricePosition(p),
    isMakeup,
  };
  const fda = fdaRecord(p.product_id);
  const verdict = productVerdict(verdictInput);
  const faqs = productFaqs(verdictInput, verdict, concernNames, fda);

  return (
    <>
      {/* ── Main content — bottom-padding on mobile to clear sticky bar ── */}
      <article className="space-y-8 pb-28 sm:pb-0">

        {/* ══════════════════════════════════════
            VERDICT CARD
            Single column on phone, side-by-side on sm+
        ══════════════════════════════════════ */}
        <div className="rounded-2xl border border-[#efe1db] bg-white shadow-sm shadow-rose-100 overflow-hidden">
          {/* Image + info */}
          <div className="flex flex-col sm:flex-row gap-0 sm:gap-6 items-stretch sm:items-start p-5 sm:p-6">
            {/* Product image */}
            {p.image_url && (
              <div className="mx-auto sm:mx-0 shrink-0 mb-4 sm:mb-0">
                <Image
                  src={p.image_url}
                  alt={p.name}
                  width={200}
                  height={200}
                  className="rounded-xl border border-neutral-100 object-contain bg-neutral-50"
                  style={{ width: 200, height: 200 }}
                  priority
                />
              </div>
            )}

            {/* Name + score + verdict */}
            <div className="flex-1 space-y-3">
              {/* Brand eyebrow */}
              <p className="text-xs font-semibold uppercase tracking-widest text-[#c9a86a]">
                {p.brand}
              </p>

              {/* Product name (serif) */}
              <h1 className="font-serif-display text-2xl sm:text-3xl font-semibold text-neutral-900 leading-snug">
                {p.name}
              </h1>

              {/* Thai spelling. 987 of 1,003 product names are Latin-only, so
                  without this line a shopper searching "นาทูรี่ ดีไหม" after
                  seeing the product in a Thai clip has nothing to match. */}
              {alias && (
                <p className="text-sm text-[#8a7a76]">
                  {locale === "th" ? `หรือที่เรียกกันว่า ${alias}` : alias}
                </p>
              )}

              {/* Favorite button */}
              <FavoriteButton
                productId={p.product_id}
                slug={slug}
                name={p.name}
                brand={p.brand}
                imageUrl={p.image_url}
                score={totalScore}
                priceTHB={p.price_thb}
                locale={locale}
              />

              {/* Big score badge */}
              <div className="flex items-baseline gap-2">
                <span
                  className={`text-5xl sm:text-6xl font-black tabular-nums leading-none ${scoreColor(totalScore)}`}
                >
                  {/* A 0 here always means "no reviews yet", never "rated zero". */}
                  {totalScore > 0 ? totalScore : "—"}
                </span>
                {totalScore > 0 && (
                  <span className="text-lg text-neutral-400 font-medium">/100</span>
                )}
              </div>

              {/* One-line verdict */}
              <p className="product-summary text-sm sm:text-base text-neutral-600 leading-relaxed">
                {summary}
              </p>

              {/* Price row — inline on desktop, replaces sticky bar */}
              <div className="hidden sm:flex flex-wrap items-center gap-3 pt-2">
                {linkAlive && <AffiliateButton p={p} locale={locale} variant="inline" />}
                {hasDiscount && (
                  <>
                    <span className="text-sm text-neutral-400 line-through">
                      ฿{Math.round(p.list_price_thb).toLocaleString()}
                    </span>
                    <span className="rounded-full bg-rose-50 border border-[#efe1db] px-2.5 py-0.5 text-xs font-semibold text-rose-600">
                      -{p.discount_pct}%
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Mobile-only: price strip inside card (above sticky bar summary).
              Used to be gated on hasDiscount, so a full-price product showed no
              price anywhere on mobile except inside the sticky CTA label — and
              nothing at all once linkAlive is false. Always show the price. */}
          <div className="sm:hidden flex items-center gap-3 border-t border-[#efe1db] px-5 py-3">
            <span className="text-base font-bold text-[#2b2222]">
              ฿{Math.round(p.price_thb).toLocaleString()}
            </span>
            {hasDiscount && (
              <>
                <span className="text-sm text-[#8a7a76] line-through">
                  ฿{Math.round(p.list_price_thb).toLocaleString()}
                </span>
                <span className="rounded-full bg-rose-50 border border-[#efe1db] px-2.5 py-0.5 text-xs font-semibold text-rose-600">
                  -{p.discount_pct}%
                </span>
              </>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════
            MODULE 0b — SHOULD YOU BUY IT?
        ══════════════════════════════════════ */}
        <ShouldYouBuyModule name={cleanName(p.name)} verdict={verdict} locale={locale} />

        {/* ══════════════════════════════════════
            MODULE 0c — THAI FDA NOTIFICATION
        ══════════════════════════════════════ */}
        {fda && <FdaModule fda={fda} locale={locale} />}

        {/* ══════════════════════════════════════
            SCORE BREAKDOWN
        ══════════════════════════════════════ */}
        <section className="space-y-3">
          <h2 className="font-serif-display text-lg font-semibold text-neutral-800">
            {locale === "th" ? "รายละเอียดคะแนน" : "Score Breakdown"}
          </h2>
          <div className="rounded-2xl border border-[#efe1db] bg-white px-5 py-4 space-y-4 shadow-sm shadow-rose-100">
            {/* Makeup is not scored on ingredients — that bar reads a field the
                makeup scorer leaves at zero, so showing it claimed a 0/100
                ingredient rating for products that were never rated on it. */}
            {!isMakeup && (
              <ScoreBar
                label={locale === "th" ? "ส่วนผสม · 45%" : "Ingredients · 45%"}
                value={ingredientScore}
              />
            )}
            <ScoreBar
              label={
                locale === "th"
                  ? `รีวิว · ${isMakeup ? "70%" : "45%"}`
                  : `Reviews · ${isMakeup ? "70%" : "45%"}`
              }
              value={p.review_score ?? 0}
            />
            <ScoreBar
              label={
                locale === "th"
                  ? `คุ้มค่า · ${isMakeup ? "30%" : "10%"}`
                  : `Value · ${isMakeup ? "30%" : "10%"}`
              }
              value={p.value_score ?? 0}
            />
            <p className="text-xs text-neutral-400 pt-1">
              {isMakeup
                ? locale === "th"
                  ? "คะแนนเครื่องสำอางแต่งหน้า = รีวิว×70% + คุ้มค่า×30% (+5 ถ้ามีค่า SPF) ไม่ใช้คะแนนส่วนผสมแบบสกินแคร์"
                  : "Makeup score = Reviews×70% + Value×30%, +5 when the product carries an SPF. It does not use the ingredient score applied to skincare."
                : locale === "th"
                  ? "คะแนนรวม = ส่วนผสม×45% + รีวิว×45% + คุ้มค่า×10%"
                  : "Total score = Ingredients×45% + Reviews×45% + Value×10%"}
            </p>
          </div>
        </section>

        {/* ══════════════════════════════════════
            MODULE 0 — ABOUT THIS PRODUCT
        ══════════════════════════════════════ */}
        {description && <DescriptionModule p={{ description }} locale={locale} />}

        {/* ══════════════════════════════════════
            MODULE 4 — DUAL-VERIFIED BADGE
            (Shown near the top, after score breakdown,
             as a trust signal before the deep content)
        ══════════════════════════════════════ */}
        <DualVerifiedBadge p={p} concern={concern} locale={locale} />

        {/* ══════════════════════════════════════
            MODULE 1 — WHAT REAL USERS SAY
        ══════════════════════════════════════ */}
        <ReviewModule p={p} locale={locale} />

        {/* ── Multi-source line (shown when both Konvy and Pantip data exist) ── */}
        {p.pantip && p.pantip.mention_count > 0 && (
          <p className="text-xs text-[#8a7a76] flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-rose-300" aria-hidden="true" />
            {t(locale, "sources_line")} Konvy + Pantip
          </p>
        )}

        {/* ══════════════════════════════════════
            MODULE 1b — WHAT PANTIP SAYS
        ══════════════════════════════════════ */}
        <PantipModule p={p} locale={locale} />

        {/* ══════════════════════════════════════
            MODULE 1c — YOUTUBE COMMENTS
        ══════════════════════════════════════ */}
        {p.youtube && <YoutubeModule data={p.youtube} locale={locale} />}

        {/* ══════════════════════════════════════
            MODULE 1d — WATSONS REVIEWS
        ══════════════════════════════════════ */}
        {p.watsons && <WatsonsModule data={p.watsons} locale={locale} />}

        {/* ══════════════════════════════════════
            MODULE 2 — KEY INGREDIENTS, EXPLAINED
        ══════════════════════════════════════ */}
        <KeyIngredientsModule p={p} concern={concern} locale={locale} />

        {/* ══════════════════════════════════════
            MODULE 3 — HEADS UP (CAUTION FLAGS)
        ══════════════════════════════════════ */}
        <HeadsUpModule p={p} concern={concern} locale={locale} />

        {/* ══════════════════════════════════════
            INGREDIENTS DECODER (existing)
        ══════════════════════════════════════ */}
        <section className="space-y-3">
          <h2 className="font-serif-display text-lg font-semibold text-neutral-800">
            {t(locale, "ingredients")}
          </h2>
          <IngredientDecoder
            analysis={p.ingredient_analysis}
            concern={concern}
            locale={baseLoc}
          />
        </section>

        {/* ══════════════════════════════════════
            MODULE 5 — SIMILAR PRODUCTS
        ══════════════════════════════════════ */}
        <SimilarProductsModule
          p={p}
          concern={concern}
          locale={locale}
          slug={slug}
        />

        {/* ══════════════════════════════════════
            MODULE 6 — CHEAPER ALTERNATIVES
        ══════════════════════════════════════ */}
        <CheaperAlternativesModule p={p} concern={concern} locale={locale} />

        {/* ══════════════════════════════════════
            MODULE 8 — FAQ (mirrors the FAQPage JSON-LD below)
        ══════════════════════════════════════ */}
        <FaqSection faqs={faqs} locale={locale} />

        {/* ══════════════════════════════════════
            MODULE 7 — SHARE CARD
        ══════════════════════════════════════ */}
        <ShareCard
          name={p.name}
          brand={p.brand}
          imageUrl={p.image_url}
          score={totalScore}
          rating={p.konvy_rating}
          reviewCount={p.konvy_review_count}
          soldCount={p.sold_count ?? 0}
          priceTHB={p.price_thb}
          listPriceTHB={p.list_price_thb ?? 0}
          discountPct={p.discount_pct ?? 0}
          llmSummary={p.llm_summary?.[baseLoc] ?? ""}
          locale={locale}
          pageUrl={pageUrl}
        />

        <AdvertiseCta locale={locale} brand={p.brand} />

        <JsonLd data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": ["h1", ".product-summary"],
          },
          "url": pageUrl,
        }} />
        <JsonLd data={productLd(p, pageUrl)} />
        {/* Same `faqs` array the FaqModule above renders — the answers are on
            the page, which is what FAQPage requires. */}
        {faqs.length > 0 && <JsonLd data={faqLd(faqs)} />}
        <JsonLd data={breadcrumbLd([
          { name: "BangkokFillers", url: `https://bangkokfillers.com/${locale}` },
          { name: concern.charAt(0).toUpperCase() + concern.slice(1), url: `https://bangkokfillers.com/${locale}/${concern}` },
          { name: p.name, url: pageUrl },
        ])} />

        <ViewTracker
          productId={p.product_id}
          slug={slug}
          name={p.name}
          brand={p.brand}
          imageUrl={p.image_url}
          score={totalScore}
          priceTHB={p.price_thb}
        />
      </article>

      {/* ══════════════════════════════════════
          STICKY BOTTOM BUY BAR — MOBILE ONLY
          fixed bottom-0, hidden on sm+
          Only rendered when there's an actual CTA — an always-on bar with
          a conditional button inside left an empty pink strip covering
          content whenever the affiliate link was dead.
      ══════════════════════════════════════ */}
      {linkAlive ? (
        <div className="fixed bottom-0 inset-x-0 z-40 sm:hidden bg-rose-500 shadow-[0_-2px_12px_rgba(224,96,126,0.25)]"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
          {/* items-stretch (not items-center) + px-only (no py) so the anchor's own
              self-stretch/py-3.5 can fill the entire 56px bar as one tap target,
              instead of centering a text-sized link inside dead padding. */}
          <div className="flex items-stretch justify-center px-4 min-h-[56px]">
            <AffiliateButton p={p} locale={locale} variant="sticky" />
          </div>
        </div>
      ) : (
        <div className="fixed bottom-0 inset-x-0 z-40 sm:hidden bg-white border-t border-[#efe1db] shadow-[0_-2px_12px_rgba(0,0,0,0.08)]"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
          <Link
            href={`/${locale}/${concern}`}
            className="flex items-center justify-center px-4 py-3.5 min-h-[56px] text-sm font-semibold text-rose-600"
          >
            {locale === "th" ? "ลิงก์นี้ใช้ไม่ได้ — ดูสินค้าใกล้เคียง →" : "This link is unavailable — see similar products →"}
          </Link>
        </div>
      )}
    </>
  );
}
