import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  allIngredients,
  ingredientSlug,
  getIngredient,
  productsWithIngredient,
  productSlug,
  effectiveConcerns,
} from "@/lib/data";
import { STATIC_LOCALES, localeAlternates, localeOgImage, t, concernLabel, SAFETY_FLAG_LABELS, type Locale } from "@/lib/i18n";
import { ingredientLd, faqLd } from "@/lib/schema";
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
  const mech = isTh ? ing.mechanism_th : ing.mechanism_en;
  const prods = productsWithIngredient(ing.inci);
  const url = `https://bangkokfillers.com/${locale}/ingredient/${slug}`;
  const concerns = effectiveConcerns(ing.concern_efficacy);
  const concernNames = concerns.map((c) => concernLabel(locale, c.concern));

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
          </p>
        )}
      </header>

      {/* ── Mechanism lead (AEO — the same sentence answers the on-page FAQ below) ── */}
      <div className="not-prose rounded-xl bg-rose-50 border border-rose-100 p-5 text-sm text-rose-900 max-w-2xl space-y-3">
        <p className="font-medium">
          {isTh ? `${ing.th_name} คืออะไร?` : `What is ${ing.en_name}?`}
        </p>
        <p className="leading-relaxed">{mech}</p>
        {ing.evidence_note && (
          <p className="leading-relaxed text-rose-700">
            {isTh ? "หลักฐานทางวิทยาศาสตร์: " : "Evidence: "}
            {ing.evidence_note}
          </p>
        )}
        {concernNames.length > 0 && (
          <p className="leading-relaxed">
            {isTh
              ? `เหมาะสำหรับ: ${concernNames.join(", ")} — พบได้ในผลิตภัณฑ์ ${prods.length} รายการในฐานข้อมูลของเรา`
              : `Best for: ${concernNames.join(", ")} — found in ${prods.length} products in our database`}
          </p>
        )}
      </div>

      {/* ── Stat row: concentration + safety ── */}
      <div className="not-prose flex flex-wrap gap-3">
        {ing.typical_pct && (
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

      {/* ── Products with this ingredient ── */}
      {prods.length > 0 && (
        <section className="not-prose space-y-4">
          <h2 className="font-serif-display text-lg sm:text-xl font-semibold text-neutral-800 break-words">
            {t(locale, "contains")}
            <span className="ml-2 text-sm font-normal text-neutral-400">({prods.length})</span>
          </h2>
          <div className="flex flex-wrap gap-2 overflow-hidden">
            {prods.slice(0, 30).map((p) => (
              <Link
                key={p.product_id}
                href={`/${locale}/product/${productSlug(p)}`}
                className="inline-flex items-center rounded-full border border-[#efe1db] bg-white px-3 py-1 text-xs text-rose-600 font-medium hover:bg-rose-50 hover:border-rose-300 transition-colors shadow-sm max-w-full break-words"
              >
                {p.brand} {p.name}
              </Link>
            ))}
          </div>
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
            q: isTh ? `${name} คืออะไร` : `What is ${name}?`,
            a: mech,
          },
          ...(ing.typical_pct ? [{
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
