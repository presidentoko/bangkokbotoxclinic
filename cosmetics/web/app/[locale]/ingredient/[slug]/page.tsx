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
      languages: {
        th: `${BASE}/th/ingredient/${slug}`,
        en: `${BASE}/en/ingredient/${slug}`,
      },
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

  const name = locale === "th" ? ing.th_name : ing.en_name;
  const mech = locale === "th" ? ing.mechanism_th : ing.mechanism_en;
  const prods = productsWithIngredient(ing.inci);
  const url = `https://bangkokfillers.com/${locale}/ingredient/${slug}`;

  return (
    <article className="prose space-y-8 max-w-3xl">
      {/* ── Header ── */}
      <header className="space-y-1 border-b border-neutral-100 pb-6">
        <h1 className="font-serif-display text-3xl font-semibold text-neutral-900 leading-snug">
          {name}
        </h1>
        <p className="text-sm text-neutral-400 font-mono tracking-wide">{ing.inci}</p>
      </header>

      {/* ── Mechanism lead ── */}
      <p className="text-base text-neutral-700 leading-relaxed">{mech}</p>

      {/* ── Typical concentration stat ── */}
      <div className="not-prose flex items-center gap-3 rounded-xl border border-neutral-100 bg-white px-5 py-4 shadow-sm w-fit">
        <span className="text-xs uppercase tracking-widest text-neutral-400">
          {locale === "th" ? "ความเข้มข้นทั่วไป" : "Typical concentration"}
        </span>
        <span className="font-semibold text-teal-700 text-lg">{ing.typical_pct}</span>
      </div>

      {/* ── Products with this ingredient ── */}
      {prods.length > 0 && (
        <section className="not-prose space-y-4">
          <h2 className="font-serif-display text-xl font-semibold text-neutral-800">
            {t(locale, "contains")}
            <span className="ml-2 text-sm font-normal text-neutral-400">({prods.length})</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {prods.slice(0, 30).map((p) => (
              <Link
                key={p.product_id}
                href={`/${locale}/product/${productSlug(p)}`}
                className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-teal-700 font-medium hover:bg-teal-50 hover:border-teal-300 transition-colors shadow-sm"
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
            q: `${name} ${locale === "th" ? "คืออะไร" : "— what is it?"}`,
            a: mech,
          },
        ])}
      />
    </article>
  );
}
