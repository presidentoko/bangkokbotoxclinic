import type { Metadata } from "next";
import { FavoritesPageClient } from "./FavoritesPageClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTh = locale === "th";
  const title = isTh ? "สินค้าที่บันทึกไว้ | BangkokFillers" : "Saved Products | BangkokFillers";
  return {
    title,
    robots: { index: false, follow: false },
  };
}

export default async function FavoritesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <FavoritesPageClient locale={locale} />;
}
