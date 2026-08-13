import type { Metadata } from "next";
import Link from "next/link";
import { allIngredients, ingredientSlug, effectiveConcerns } from "@/lib/data";
import { STATIC_LOCALES, localeAlternates, concernLabelShort, type Locale } from "@/lib/i18n";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/schema";

const BASE = "https://bangkokfillers.com";

export function generateStaticParams() {
  return STATIC_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTh = locale === "th";
  const count = allIngredients().length;
  return {
    title: isTh
      ? `คู่มือส่วนผสมสกินแคร์ — ${count} ส่วนผสม อธิบายด้วยข้อมูล`
      : `Skincare Ingredient Guide — ${count} Ingredients Explained`,
    description: isTh
      ? `ส่วนผสมออกฤทธิ์ ${count} ตัวที่พบในสกินแคร์ไทย — กลไกการทำงาน ความเข้มข้นที่แนะนำ และข้อควรระวัง`
      : `${count} active skincare ingredients found in Thai products — how they work, typical concentrations, and safety notes.`,
    alternates: {
      canonical: `${BASE}/${locale}/ingredient`,
      languages: localeAlternates((l) => `${BASE}/${l}/ingredient`),
    },
  };
}

export default async function IngredientIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeRaw } = await params;
  const locale = localeRaw as Locale;
  const isTh = locale === "th";

  const ingredients = allIngredients()
    .map(([inci, entry]) => ({
      inci,
      slug: ingredientSlug(inci),
      name: isTh ? entry.th_name : entry.en_name,
      concerns: effectiveConcerns(entry.concern_efficacy),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <nav className="text-xs text-neutral-400 flex items-center gap-1.5">
          <Link href={`/${locale}`} className="hover:text-rose-500 transition-colors">
            {isTh ? "หน้าหลัก" : "Home"}
          </Link>
          <span>›</span>
          <span className="text-neutral-600">{isTh ? "ส่วนผสม" : "Ingredients"}</span>
        </nav>
        <h1 className="font-serif-display text-3xl sm:text-4xl font-semibold text-[#2b2222]">
          {isTh ? "คู่มือส่วนผสมสกินแคร์" : "Skincare ingredient guide"}
        </h1>
        <p className="text-neutral-500 text-sm max-w-prose">
          {isTh
            ? `${ingredients.length} ส่วนผสมออกฤทธิ์ที่พบในฐานข้อมูล — กลไก ความเข้มข้น และข้อควรระวัง อ้างอิงจากงานวิจัย`
            : `${ingredients.length} active ingredients in our database — mechanism, typical concentration, and safety notes, backed by research.`}
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {ingredients.map(({ slug, name, concerns }) => (
          <Link
            key={slug}
            href={`/${locale}/ingredient/${slug}`}
            className="rounded-2xl border border-[#efe1db] bg-white hover:shadow-sm hover:border-rose-200 transition-all p-4 space-y-1.5"
          >
            <p className="font-semibold text-[#2b2222] leading-snug">{name}</p>
            {concerns.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {concerns.slice(0, 3).map(({ concern }) => (
                  <span key={concern} className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-medium text-rose-600">
                    {concernLabelShort(locale, concern)}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>

      <JsonLd
        data={breadcrumbLd([
          { name: "BangkokFillers", url: `${BASE}/${locale}` },
          { name: isTh ? "ส่วนผสม" : "Ingredients", url: `${BASE}/${locale}/ingredient` },
        ])}
      />
    </div>
  );
}
