import type { Metadata } from "next";
import { CATEGORIES } from "@/lib/i18n";
import { CompareView, buildCompareMetadata } from "../CompareView";

export const revalidate = 86400;

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ category }));
}

// CATEGORIES is the complete param space — unknown categories 404 at the
// router without a function invocation or ISR write.
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
