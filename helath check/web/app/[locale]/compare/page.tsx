import type { Metadata } from "next";
import { CompareView, buildCompareMetadata } from "./CompareView";

// Bare /compare serves the default (executive) view statically. Category
// selection is path-based (/compare/[category]) — this page deliberately
// does NOT read searchParams, which would force per-request SSR. Legacy
// ?category= URLs are 308-redirected in next.config.ts.
// Static — see the note in app/[locale]/page.tsx.
export const revalidate = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildCompareMetadata(locale, null);
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <CompareView locale={locale} activeCat="executive" />;
}
