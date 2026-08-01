import type { Metadata } from "next";
import { STATIC_LOCALES, localeAlternates, type Locale } from "@/lib/i18n";
import { QuizClient } from "@/components/QuizClient";

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
  return {
    title: isTh ? "หาสกินแคร์ที่ใช่สำหรับคุณ" : "Find Your Perfect Skincare",
    description: isTh
      ? "ตอบ 3 คำถาม รับคำแนะนำสกินแคร์ที่เหมาะกับผิวคุณ — สิว ฝ้า ริ้วรอย"
      : "Answer 3 questions and get skincare picks matched to your skin type, concern, and budget",
    alternates: {
      canonical: `${BASE}/${locale}/quiz`,
      languages: localeAlternates((l) => `${BASE}/${l}/quiz`),
    },
  };
}

export default async function QuizPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <QuizClient locale={locale as Locale} />;
}
