import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  allIngredients,
  ingredientSlug,
  getIngredient,
  productsWithIngredient,
  productSlug,
} from "@/lib/data";
import { LOCALES, t, type Locale } from "@/lib/i18n";
import { ingredientLd, faqLd } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import Link from "next/link";

const BASE = "https://bangkokfillers.com";
// 2026-07-13 긴급 픽스 — ISR Writes 한도 초과 대응. 유효 성분은
// generateStaticParams가 전부 열거하므로 온디맨드 렌더 허용할 이유 없음.
export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
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
      languages: Object.fromEntries(LOCALES.map((l) => [l, `${BASE}/${l}/ingredient/${slug}`])),
    },
    openGraph: { title, description, url: `${BASE}/${locale}/ingredient/${slug}` },
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
  const concernKeys = Object.keys(ing.concern_efficacy ?? {});

  return (
    <article className="prose space-y-8 max-w-3xl overflow-hidden">
      {/* ── Header ── */}
      <header className="space-y-1 border-b border-neutral-100 pb-6">
        <h1 className="font-serif-display text-2xl sm:text-3xl font-semibold text-neutral-900 leading-snug break-words">
          {name}
        </h1>
        <p className="text-sm text-neutral-400 font-mono tracking-wide break-all">{ing.inci}</p>
      </header>

      {/* ── Mechanism lead ── */}
      <p className="text-base text-neutral-700 leading-relaxed">{mech}</p>

      {/* AEO paragraph — indexed by AI search engines */}
      <div className="not-prose mt-6 mb-8 rounded-xl bg-rose-50 border border-rose-100 p-5 text-sm text-rose-900 max-w-2xl">
        <p className="font-medium mb-2">
          {isTh
            ? `${ing.th_name} คืออะไร?`
            : `What is ${ing.en_name}?`}
        </p>
        <p className="leading-relaxed">
          {isTh
            ? (ing.mechanism_th ?? ing.mechanism_en ?? "")
            : (ing.mechanism_en ?? "")}
        </p>
        {concernKeys.length > 0 && (
          <p className="mt-3 leading-relaxed">
            {isTh
              ? `เหมาะสำหรับ: ${concernKeys.join(", ")} — พบได้ในผลิตภัณฑ์ ${prods.length} รายการในฐานข้อมูลของเรา`
              : `Best for: ${concernKeys.join(", ")} — found in ${prods.length} products in our database`}
          </p>
        )}
        {ing.typical_pct && (
          <p className="mt-2 text-xs text-rose-600">
            {isTh
              ? `ความเข้มข้นที่แนะนำ: ${ing.typical_pct}`
              : `Typical effective concentration: ${ing.typical_pct}`}
          </p>
        )}
      </div>

      {/* ── Typical concentration stat ── */}
      <div className="not-prose flex items-center gap-3 rounded-2xl border border-[#efe1db] bg-white px-4 sm:px-5 py-4 shadow-sm shadow-rose-100 w-fit max-w-full">
        <span className="text-xs uppercase tracking-widest text-[#c9a86a]">
          {locale === "th" ? "ความเข้มข้นทั่วไป" : "Typical concentration"}
        </span>
        <span className="font-semibold text-rose-500 text-lg">{ing.typical_pct}</span>
      </div>

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

      <JsonLd data={ingredientLd(ing, url)} />
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
          ...(concernKeys.length > 0 ? [{
            q: isTh
              ? `${name} เหมาะกับปัญหาผิวอะไร`
              : `What skin concerns does ${name} help with?`,
            a: isTh
              ? `${name} เหมาะกับปัญหา: ${concernKeys.join(", ")} — พบได้ใน ${prods.length} ผลิตภัณฑ์ในฐานข้อมูล BangkokFillers`
              : `${name} is effective for: ${concernKeys.join(", ")} — found in ${prods.length} products in the BangkokFillers database.`,
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
