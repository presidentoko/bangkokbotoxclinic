import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  allIngredients,
  ingredientSlug,
  getIngredient,
  productsWithIngredient,
  productSlug,
  effectiveConcerns,
  generatedAt,
  pantipMentionsForIngredient,
} from "@/lib/data";
import { STATIC_LOCALES, localeAlternates, localeOgImage, t, concernLabel, SAFETY_FLAG_LABELS, type Locale } from "@/lib/i18n";
import { ingredientLd, faqLd } from "@/lib/schema";
import { ingredientNarrative } from "@/lib/ingredient-narrative";
import { JsonLd } from "@/components/JsonLd";
import Link from "next/link";

const BASE = "https://bangkokfillers.com";
// 2026-07-13 긴급 픽스 — ISR Writes 한도 초과 대응. 유효 성분은
// generateStaticParams가 전부 열거하므로 온디맨드 렌더 허용할 이유 없음.
export const dynamicParams = false;

export function generateStaticParams() {
  return STATIC_LOCALES.flatMap((locale) =>
    allIngredients().map(([inci]) => ({ locale, slug: ingredientSlug(inci) }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: localeRaw, slug } = await params;
  const locale = localeRaw as Locale;
  const ing = getIngredient(slug);
  if (!ing) return {};
  const name = locale === "th" ? ing.th_name : ing.en_name;
  const title =
    locale === "th"
      ? `${name} คืออะไร — ส่วนผสมสกินแคร์`
      : `${name} — What is it? Skincare Ingredient`;
  const description =
    locale === "th"
      ? `${name} (${ing.inci}) คืออะไร ทำงานอย่างไร และพบในผลิตภัณฑ์ใดบ้าง`
      : `${name} (${ing.inci}) — what it is, how it works, and which products contain it.`;
  return {
    title,
    description,
    alternates: {
      canonical: `${BASE}/${locale}/ingredient/${slug}`,
      languages: localeAlternates((l) => `${BASE}/${l}/ingredient/${slug}`),
    },
    openGraph: {
      title,
      description,
      url: `${BASE}/${locale}/ingredient/${slug}`,
      images: [localeOgImage(locale)],
    },
    // Without an explicit twitter block the card fell back to the root layout's
    // site-wide title/description, so the OG and Twitter previews disagreed.
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [localeOgImage(locale).url],
    },
  };
}

export default async function IngredientPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: localeRaw, slug } = await params;
  const locale = localeRaw as Locale;

  const ing = getIngredient(slug);
  if (!ing) notFound();

  const isTh = locale === "th";
  const name = isTh ? ing.th_name : ing.en_name;
  const prods = productsWithIngredient(ing.inci);
  const url = `https://bangkokfillers.com/${locale}/ingredient/${slug}`;
  const concerns = effectiveConcerns(ing.concern_efficacy);
  const concernNames = concerns.map((c) => concernLabel(locale, c.concern));
  const narrative = ingredientNarrative(ing, locale, prods.length, concernNames);
  const comboGood = isTh ? ing.combo_good_th : ing.combo_good_en;
  const comboAvoid = isTh ? ing.combo_avoid_th : ing.combo_avoid_en;
  const pantipMentions = pantipMentionsForIngredient(ing, 5);
  const visibleProds = prods.slice(0, 12);
  const restProds = prods.slice(12, 40);
  const lastVerified = generatedAt().slice(0, 10);

  return (
    <article className="prose space-y-8 max-w-3xl overflow-hidden">
      {/* ── Header ── */}
      <header className="space-y-1 border-b border-neutral-100 pb-6">
        <h1 className="font-serif-display text-2xl sm:text-3xl font-semibold text-neutral-900 leading-snug break-words">
          {name}
        </h1>
        <p className="text-sm text-neutral-400 font-mono tracking-wide break-all">{ing.inci}</p>
        {ing.aliases?.length > 0 && (
          <p className="text-sm text-neutral-500">
            {isTh ? "หรือเรียกว่า: " : "Also known as: "}
            {ing.aliases.join(", ")}
            {isTh && ing.alt_th_names && ing.alt_th_names.length > 0 && `, ${ing.alt_th_names.join(", ")}`}
          </p>
        )}
        {lastVerified && (
          <p className="text-xs text-neutral-400">
            {isTh ? `ข้อมูลอัปเดตล่าสุด: ${lastVerified}` : `Last verified: ${lastVerified}`}
          </p>
        )}
      </header>

      {/* ── Expanded narrative (AEO — answers "what is X" in full, not two sentences) ── */}
      <div className="not-prose rounded-xl bg-rose-50 border border-rose-100 p-5 text-sm text-rose-900 max-w-2xl space-y-3">
        <p className="font-medium">
          {isTh ? `${ing.th_name} คืออะไร?` : `What is ${ing.en_name}?`}
        </p>
        {narrative.map((para, i) => (
          <p key={i} className="leading-relaxed">
            {para}
          </p>
        ))}
      </div>

      {/* ── Stat row: concentration + safety ── */}
      <div className="not-prose flex flex-wrap gap-3">
        {ing.typical_pct && ing.typical_pct !== "n/a" && (
          <div className="flex items-center gap-3 rounded-2xl border border-[#efe1db] bg-white px-4 sm:px-5 py-4 shadow-sm shadow-rose-100 w-fit max-w-full">
            <span className="text-xs uppercase tracking-widest text-[#c9a86a]">
              {isTh ? "ความเข้มข้นทั่วไป" : "Typical concentration"}
            </span>
            <span className="font-semibold text-rose-500 text-lg">{ing.typical_pct}</span>
          </div>
        )}
      </div>

      {/* ── Per-concern efficacy ── */}
      {concerns.length > 0 && (
        <section className="not-prose space-y-3">
          <h2 className="font-serif-display text-lg sm:text-xl font-semibold text-neutral-800">
            {isTh ? "ประสิทธิภาพตามปัญหาผิว" : "Efficacy by skin concern"}
          </h2>
          <div className="space-y-2 max-w-md">
            {concerns.map(({ concern, score }) => (
              <div key={concern} className="flex items-center gap-3">
                <span className="text-sm text-neutral-600 w-40 shrink-0 truncate">
                  {concernLabel(locale, concern)}
                </span>
                <div className="flex-1 h-2 rounded-full bg-neutral-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-rose-400"
                    style={{ width: `${(score / 3) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Safety notes ── */}
      {ing.safety_flags?.length > 0 && (
        <section className="not-prose space-y-2">
          <h2 className="font-serif-display text-lg sm:text-xl font-semibold text-neutral-800">
            {isTh ? "ข้อควรระวัง" : "Safety notes"}
          </h2>
          <ul className="space-y-1.5">
            {ing.safety_flags.map((flag) => (
              <li key={flag} className="flex items-start gap-2 text-sm text-neutral-700">
                <span className="text-amber-500 mt-0.5">⚠</span>
                <span>{isTh ? (SAFETY_FLAG_LABELS[flag]?.th ?? flag) : (SAFETY_FLAG_LABELS[flag]?.en ?? flag)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── Pairing guidance — only for actives with established interactions ── */}
      {(comboGood || comboAvoid) && (
        <section className="not-prose space-y-3">
          <h2 className="font-serif-display text-lg sm:text-xl font-semibold text-neutral-800">
            {isTh ? `ใช้ร่วมกับส่วนผสมอื่นอย่างไร` : `Combining with other ingredients`}
          </h2>
          <div className="space-y-2 max-w-2xl">
            {comboGood && (
              <p className="flex items-start gap-2 text-sm text-neutral-700 leading-relaxed">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>{comboGood}</span>
              </p>
            )}
            {comboAvoid && (
              <p className="flex items-start gap-2 text-sm text-neutral-700 leading-relaxed">
                <span className="text-amber-500 mt-0.5">⚠</span>
                <span>{comboAvoid}</span>
              </p>
            )}
          </div>
        </section>
      )}

      {/* ── What Pantip says — real forum mentions, not authored Q&A ── */}
      {pantipMentions.length > 0 && (
        <section className="not-prose space-y-3">
          <h2 className="font-serif-display text-lg sm:text-xl font-semibold text-neutral-800">
            {isTh ? "คนไทยพูดถึงส่วนผสมนี้ใน Pantip อย่างไร" : "What Thai users say about this on Pantip"}
          </h2>
          <div className="space-y-3">
            {pantipMentions.map((m, i) => (
              <a
                key={i}
                href={`https://pantip.com/topic/${m.topicId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-2xl border border-[#f5e6d3] bg-[#fffaf5] px-5 py-4 shadow-sm hover:border-amber-300 hover:bg-amber-50 transition-colors"
              >
                <p className="text-sm text-neutral-700 leading-relaxed line-clamp-3">&ldquo;{m.text.trim()}&rdquo;</p>
                <p className="mt-2 text-xs text-amber-600 font-medium">
                  {m.author ? `${m.author} · ` : ""}Pantip.com
                </p>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* ── Products with this ingredient ── */}
      {prods.length > 0 && (
        <section className="not-prose space-y-4">
          <h2 className="font-serif-display text-lg sm:text-xl font-semibold text-neutral-800 break-words">
            {t(locale, "contains")}
            <span className="ml-2 text-sm font-normal text-neutral-400">({prods.length})</span>
          </h2>
          <div className="flex flex-wrap gap-2 overflow-hidden">
            {visibleProds.map((p) => (
              <Link
                key={p.product_id}
                href={`/${locale}/product/${productSlug(p)}`}
                className="inline-flex items-center rounded-full border border-[#efe1db] bg-white px-3 py-1 text-xs text-rose-600 font-medium hover:bg-rose-50 hover:border-rose-300 transition-colors shadow-sm max-w-full break-words"
              >
                {p.brand} {p.name}
              </Link>
            ))}
          </div>
          {restProds.length > 0 && (
            <details className="group">
              <summary className="cursor-pointer text-sm text-rose-500 font-medium list-none inline-flex items-center gap-1">
                {isTh ? `ดูอีก ${restProds.length} รายการ` : `Show ${restProds.length} more`}
                <span className="transition-transform group-open:rotate-180">▾</span>
              </summary>
              <div className="flex flex-wrap gap-2 overflow-hidden mt-3">
                {restProds.map((p) => (
                  <Link
                    key={p.product_id}
                    href={`/${locale}/product/${productSlug(p)}`}
                    className="inline-flex items-center rounded-full border border-[#efe1db] bg-white px-3 py-1 text-xs text-rose-600 font-medium hover:bg-rose-50 hover:border-rose-300 transition-colors shadow-sm max-w-full break-words"
                  >
                    {p.brand} {p.name}
                  </Link>
                ))}
              </div>
            </details>
          )}
        </section>
      )}

      {/* ── Sources ── */}
      {ing.sources?.length > 0 && (
        <section className="not-prose space-y-2">
          <h2 className="font-serif-display text-lg sm:text-xl font-semibold text-neutral-800">
            {isTh ? "แหล่งอ้างอิง" : "Sources"}
          </h2>
          <ul className="space-y-1 text-sm">
            {ing.sources.map((src) => (
              <li key={src}>
                <a href={src} target="_blank" rel="noopener noreferrer nofollow" className="text-rose-600 hover:underline break-all">
                  {src}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <JsonLd data={ingredientLd(ing, url, locale)} />
      <JsonLd
        data={faqLd([
          {
            q:
              isTh && ing.alt_th_names && ing.alt_th_names.length > 0
                ? `${name} (หรือ ${ing.alt_th_names.join(", ")}) คืออะไร`
                : isTh
                  ? `${name} คืออะไร`
                  : `What is ${name}?`,
            a: narrative.join(" "),
          },
          ...(ing.safety_flags?.length > 0 ? [{
            q: isTh ? `${name} มีข้อควรระวังอะไรบ้าง` : `What are the safety concerns with ${name}?`,
            a: isTh
              ? ing.safety_flags.map((f) => SAFETY_FLAG_LABELS[f]?.th ?? f).join(" ")
              : ing.safety_flags.map((f) => SAFETY_FLAG_LABELS[f]?.en ?? f).join(" "),
          }] : []),
          ...(comboGood || comboAvoid ? [{
            q: isTh ? `${name} ใช้ร่วมกับส่วนผสมอื่นได้ไหม` : `Can ${name} be combined with other ingredients?`,
            a: [comboGood, comboAvoid].filter(Boolean).join(" "),
          }] : []),
          ...(ing.typical_pct && ing.typical_pct !== "n/a" ? [{
            q: isTh
              ? `ควรใช้ ${name} ความเข้มข้นเท่าไหร่`
              : `What concentration of ${name} should I use?`,
            a: isTh
              ? `ความเข้มข้นที่แนะนำสำหรับ ${name} คือ ${ing.typical_pct} — ดูฉลากผลิตภัณฑ์และค่อยๆ เพิ่มความเข้มข้นเพื่อลดโอกาสระคายเคือง`
              : `The typical effective concentration for ${name} is ${ing.typical_pct}. Check the product label and increase gradually to minimise irritation.`,
          }] : []),
          ...(concernNames.length > 0 ? [{
            q: isTh
              ? `${name} เหมาะกับปัญหาผิวอะไร`
              : `What skin concerns does ${name} help with?`,
            a: isTh
              ? `${name} เหมาะกับปัญหา: ${concernNames.join(", ")} — พบได้ใน ${prods.length} ผลิตภัณฑ์ในฐานข้อมูล BangkokFillers`
              : `${name} is effective for: ${concernNames.join(", ")} — found in ${prods.length} products in the BangkokFillers database.`,
          }] : []),
          {
            q: isTh
              ? `ผลิตภัณฑ์ไหนที่มี ${name}`
              : `Which products contain ${name}?`,
            a: isTh
              ? prods.length > 0
                ? `มีผลิตภัณฑ์ ${prods.length} รายการในฐานข้อมูล BangkokFillers ที่มี ${name} ได้แก่ ${prods.slice(0,3).map(p => p.name).join(", ")}${prods.length > 3 ? ` และอีก ${prods.length - 3} รายการ` : ""}`
                : `ยังไม่มีผลิตภัณฑ์ในฐานข้อมูลที่มีส่วนผสมนี้`
              : prods.length > 0
                ? `There are ${prods.length} products in the BangkokFillers database containing ${name}, including ${prods.slice(0,3).map(p => p.name).join(", ")}${prods.length > 3 ? ` and ${prods.length - 3} more` : ""}.`
                : `No products in the database currently contain this ingredient.`,
          },
        ])}
      />
    </article>
  );
}
