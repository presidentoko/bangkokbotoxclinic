import type { Metadata } from "next";
import { CATEGORIES } from "@/lib/i18n";
import { getCheckupCombos } from "@/lib/db";
import { CompareView, buildCompareMetadata } from "../CompareView";

// Static — see the note in app/[locale]/page.tsx.
export const revalidate = false;

export async function generateStaticParams() {
  // Categories with packages only — see the same note in
  // app/[locale]/checkup/[type]/page.tsx. CATEGORIES still lists eight
  // staging names that hold zero rows.
  try {
    const real = new Set((await getCheckupCombos()).map((c) => c.category));
    return CATEGORIES.filter((c) => real.has(c)).map((category) => ({ category }));
  } catch {
    return CATEGORIES.map((category) => ({ category }));
  }
}

// The live categories above are the whole param space. Names that used to
// hold rows ("comprehensive", "cardiac", ...) are 308'd to /compare by
// next.config.ts before they ever reach the router; anything else is a real
// 404. Leaving dynamicParams on meant /en/compare/totalnonsense answered 200
// with an empty table, because compare/loading.tsx streams the shell before
// the component can set a status.
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}): Promise<Metadata> {
  const { locale, category } = await params;
  return buildCompareMetadata(locale, category);
}

export default async function CompareCategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  return <CompareView locale={locale} activeCat={category} />;
}
