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

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    allIngredients().map(([inci]) => ({ locale, slug: ingredientSlug(inci) }))
  );
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
    <article className="space-y-4">
      <h1 className="text-2xl font-bold">
        {name}{" "}
        <span className="text-base text-gray-400">({ing.inci})</span>
      </h1>
      <p>{mech}</p>
      <p className="text-sm text-gray-600">
        {locale === "th" ? "ความเข้มข้นทั่วไป" : "Typical concentration"}:{" "}
        {ing.typical_pct}
      </p>
      <section>
        <h2 className="font-semibold">
          {t(locale, "contains")} ({prods.length})
        </h2>
        <ul className="text-sm">
          {prods.slice(0, 30).map((p) => (
            <li key={p.product_id}>
              <Link
                className="text-pink-700"
                href={`/${locale}/product/${productSlug(p)}`}
              >
                {p.brand} {p.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>
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
