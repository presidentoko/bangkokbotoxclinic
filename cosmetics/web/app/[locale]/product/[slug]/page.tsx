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
} from "@/lib/data";
import { LOCALES, t, toBaseLocale, type Locale } from "@/lib/i18n";
import { productLd, breadcrumbLd } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import { AffiliateButton } from "@/components/AffiliateButton";
import { IngredientDecoder } from "@/components/IngredientDecoder";
import { ExpandableText } from "@/components/ExpandableText";
import { ShareCard } from "@/components/ShareCard";
import { YoutubeModule } from "@/components/YoutubeModule";
import { WatsonsModule } from "@/components/WatsonsModule";
import { scoreColor } from "@/lib/format";

const BASE = "https://bangkokfillers.com";

// Statically generate only high-value product pages:
// - All Konvy/Watsons/Boots/iHerb sourced products (have ingredient data)
// - Beautrium products with at least 1 review (meaningful SEO content)
// - All products ranking in top 30 of any concern
// Beautrium-only products with 0 reviews render on-demand (dynamicParams = true default)
export function generateStaticParams() {
  const topIds = new Set<string>();
  for (const concern of ["acne", "whitening", "antiaging", "pores", "oilcontrol", "sensitive"]) {
    getRanking(concern).slice(0, 30).forEach((r) => topIds.add(r.product_id));
  }
  const prioritized = allProducts().filter(
    (p) =>
      p.source !== "beautrium" ||            // all non-Beautrium products
      (p.beautrium_review_count ?? 0) > 0 || // Beautrium with reviews
      topIds.has(p.product_id)               // top-ranked any concern
  );
  return LOCALES.flatMap((locale) =>
    prioritized.map((p) => ({ locale, slug: productSlug(p) }))
  );
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
  const totalScoreMeta = Math.round(p.total_score?.[concern] ?? 0);
  const title =
    locale === "th"
      ? `${p.name} — รีวิว ส่วนผสม คะแนน ${totalScoreMeta}/100`
      : `${p.name} — Score ${totalScoreMeta}/100, Reviews & Ingredients`;
  // Use Konvy product description as meta description when available (richer keyword signal)
  const rawDesc = typeof p.description === "string" ? p.description.trim() : "";
  const descBase = rawDesc.slice(0, 140) || (
    locale === "th"
      ? `${p.name} ได้คะแนนจากส่วนผสมและรีวิว ${p.konvy_review_count} รายการ ดูรายละเอียดส่วนผสมและเปรียบเทียบราคา`
      : `${p.name} scored from ingredient analysis and ${p.konvy_review_count} reviews. See ingredients and compare prices.`
  );
  const description = rawDesc
    ? descBase
    : locale === "th"
      ? `${p.name} ได้คะแนนจากส่วนผสมและรีวิว ${p.konvy_review_count} รายการ ดูรายละเอียดส่วนผสมและเปรียบเทียบราคา`
      : `${p.name} scored from ingredient analysis and ${p.konvy_review_count} reviews. See ingredients and compare prices.`;
  return {
    title,
    description,
    alternates: {
      canonical: `${BASE}/${locale}/product/${slug}`,
      languages: {
        th: `${BASE}/th/product/${slug}`,
        en: `${BASE}/en/product/${slug}`,
      },
    },
  };
}

function fallbackSummary(
  p: { name: string; total_score?: Record<string, number>; konvy_review_count: number },
  locale: Locale,
  concern: string
) {
  const sc = (p.total_score?.[concern] ?? 0).toFixed(0);
  return locale === "th"
    ? `${p.name} ได้คะแนนรวม ${sc}/100 จากส่วนผสมและรีวิว ${p.konvy_review_count} รายการ`
    : `${p.name} scores ${sc}/100 from its ingredients and ${p.konvy_review_count} reviews.`;
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
      <span className="w-24 shrink-0 text-sm text-[#8a7a76]">{label}</span>
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

function HeadsUpModule({
  p,
  concern,
  locale,
}: {
  p: { ingredient_analysis: { inci: string; safety_flags: string[] }[] };
  concern: string;
  locale: Locale;
}) {
  // Collect unique flags across all ingredients
  const flagMap = new Map<string, string[]>(); // flag → [inci, ...]
  for (const a of p.ingredient_analysis) {
    for (const f of a.safety_flags) {
      const known = Object.keys(FLAG_COPY);
      // concern-aware: only show comedogenic for acne products
      if (f === "comedogenic" && concern !== "acne") continue;
      if (known.includes(f)) {
        if (!flagMap.has(f)) flagMap.set(f, []);
        flagMap.get(f)!.push(a.inci);
      }
    }
  }

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
              title={incis.join(", ")}
            >
              <span>⚠</span>
              <span>{locale === "th" ? copy.th : copy.en}</span>
              <span className="opacity-60">({incis.length})</span>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-[#8a7a76]">
        {locale === "th"
          ? "เลื่อนเมาส์หรือแตะที่ชิปเพื่อดูส่วนผสมที่เกี่ยวข้อง"
          : "Hover or tap a chip to see which ingredients triggered the flag."}
      </p>
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

  // Handle concern_seeds being a string, "|"-delimited string, or array
  const concern =
    (Array.isArray(p.concern_seeds)
      ? p.concern_seeds[0]
      : String(p.concern_seeds).split("|")[0]) || "acne";

  const baseLoc = toBaseLocale(locale);
  const summary = p.llm_summary?.[baseLoc] || fallbackSummary(p, baseLoc, concern);
  const pageUrl = `https://bangkokfillers.com/${locale}/product/${slug}`;
  const totalScore = Math.round(p.total_score?.[concern] ?? 0);
  const ingredientScore = Math.round(p.ingredient_score?.[concern] ?? 0);
  const hasDiscount = p.discount_pct > 0;
  const description = typeof p.description === "string" ? p.description.trim() : "";

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
                  loading="eager"
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

              {/* Big score badge */}
              <div className="flex items-baseline gap-2">
                <span
                  className={`text-5xl sm:text-6xl font-black tabular-nums leading-none ${scoreColor(totalScore)}`}
                >
                  {totalScore}
                </span>
                <span className="text-lg text-neutral-400 font-medium">/100</span>
              </div>

              {/* One-line verdict */}
              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                {summary}
              </p>

              {/* Price row — inline on desktop, replaces sticky bar */}
              <div className="hidden sm:flex flex-wrap items-center gap-3 pt-2">
                <AffiliateButton p={p} locale={locale} variant="inline" />
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

          {/* Mobile-only: price strip inside card (above sticky bar summary) */}
          {hasDiscount && (
            <div className="sm:hidden flex items-center gap-3 border-t border-[#efe1db] px-5 py-3">
              <span className="text-base font-bold text-[#2b2222]">
                ฿{Math.round(p.price_thb).toLocaleString()}
              </span>
              <span className="text-sm text-[#8a7a76] line-through">
                ฿{Math.round(p.list_price_thb).toLocaleString()}
              </span>
              <span className="rounded-full bg-rose-50 border border-[#efe1db] px-2.5 py-0.5 text-xs font-semibold text-rose-600">
                -{p.discount_pct}%
              </span>
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════
            SCORE BREAKDOWN
        ══════════════════════════════════════ */}
        <section className="space-y-3">
          <h2 className="font-serif-display text-lg font-semibold text-neutral-800">
            {locale === "th" ? "รายละเอียดคะแนน" : "Score Breakdown"}
          </h2>
          <div className="rounded-2xl border border-[#efe1db] bg-white px-5 py-4 space-y-4 shadow-sm shadow-rose-100">
            <ScoreBar
              label={locale === "th" ? "ส่วนผสม" : "Ingredients"}
              value={ingredientScore}
            />
            <ScoreBar
              label={locale === "th" ? "รีวิว" : "Reviews"}
              value={p.review_score ?? 0}
            />
            <ScoreBar
              label={locale === "th" ? "ความคุ้มค่า" : "Value"}
              value={p.value_score ?? 0}
            />
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

        <JsonLd data={productLd(p, pageUrl)} />
        <JsonLd data={breadcrumbLd([
          { name: "BangkokFillers", url: `https://bangkokfillers.com/${locale}` },
          { name: concern.charAt(0).toUpperCase() + concern.slice(1), url: `https://bangkokfillers.com/${locale}/${concern}` },
          { name: p.name, url: pageUrl },
        ])} />
      </article>

      {/* ══════════════════════════════════════
          STICKY BOTTOM BUY BAR — MOBILE ONLY
          fixed bottom-0, hidden on sm+
      ══════════════════════════════════════ */}
      <div className="fixed bottom-0 inset-x-0 z-40 sm:hidden bg-rose-500 shadow-[0_-2px_12px_rgba(224,96,126,0.25)]">
        <div className="flex items-center justify-center px-4 py-3.5 min-h-[56px]">
          <AffiliateButton p={p} locale={locale} variant="sticky" />
        </div>
      </div>
    </>
  );
}
