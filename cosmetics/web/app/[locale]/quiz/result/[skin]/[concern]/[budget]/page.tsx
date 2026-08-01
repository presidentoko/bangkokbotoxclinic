import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { concernLabel, STATIC_LOCALES, localeAlternates } from "@/lib/i18n";
import { CONCERNS, productSlug, getProduct, siteStats, type Concern } from "@/lib/data";
import { quizRecommendations, BUDGET_RANGE } from "@/lib/quiz";
import { getActiveByType } from "@/lib/ads";
import { SponsoredBadge } from "@/components/SponsoredBadge";
import { QuizResultCard } from "@/components/QuizResultCard";
import { QuizLeadCapture } from "@/components/QuizLeadCapture";
import { JsonLd } from "@/components/JsonLd";
import {
  SKIN_LABELS,
  BUDGET_LABELS,
  CONCERN_QUIZ_META,
  VALID_SKINS,
  VALID_BUDGETS,
  type SkinType,
  type Budget,
} from "@/lib/quiz-config";

const BASE = "https://bangkokfillers.com";

// Finite param space (4 skins × 6 concerns × 3 budgets × 4 locales = 288) —
// fully static, no per-request rendering or Redis reads needed.
export const dynamicParams = false;

export function generateStaticParams() {
  const result: { locale: string; skin: string; concern: string; budget: string }[] = [];
  for (const locale of STATIC_LOCALES) {
    for (const skin of VALID_SKINS) {
      for (const concern of CONCERNS) {
        for (const budget of VALID_BUDGETS) {
          result.push({ locale, skin, concern, budget });
        }
      }
    }
  }
  return result;
}

function parseParams(skin: string, concern: string, budget: string) {
  if (!VALID_SKINS.includes(skin as SkinType)) return null;
  if (!CONCERNS.includes(concern as Concern)) return null;
  if (!VALID_BUDGETS.includes(budget as Budget)) return null;
  return { skin: skin as SkinType, concern: concern as Concern, budget: budget as Budget };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; skin: string; concern: string; budget: string }>;
}): Promise<Metadata> {
  const { locale, skin: skinRaw, concern: concernRaw, budget: budgetRaw } = await params;
  const loc = locale as Locale;
  const isTh = loc === "th";
  const parsed = parseParams(skinRaw, concernRaw, budgetRaw);
  if (!parsed) return {};
  const { skin, concern, budget } = parsed;

  const skinLbl = isTh ? SKIN_LABELS[skin].th : SKIN_LABELS[skin].en;
  const concernLbl = concernLabel(loc, concern);
  const budgetLbl = isTh ? BUDGET_LABELS[budget].th : BUDGET_LABELS[budget].en;

  const title = isTh
    ? `${skinLbl} · ${concernLbl} — สกินแคร์ TOP 3`
    : `${skinLbl} skin · ${concernLbl} — Top 3 picks`;
  const description = isTh
    ? `TOP 3 สกินแคร์สำหรับ${skinLbl} กังวลเรื่อง${concernLbl} งบ${budgetLbl} — จัดอันดับโดยข้อมูลส่วนผสมและรีวิวจริง`
    : `Top 3 skincare for ${skinLbl.toLowerCase()} skin, ${concernLbl.toLowerCase()}, ${budgetLbl} budget — ranked by ingredient science and real reviews`;

  const url = `${BASE}/${locale}/quiz/result/${skin}/${concern}/${budget}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: localeAlternates((l) => `${BASE}/${l}/quiz/result/${skin}/${concern}/${budget}`),
    },
    openGraph: { title, description, url, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function QuizResultPage({
  params,
}: {
  params: Promise<{ locale: string; skin: string; concern: string; budget: string }>;
}) {
  const { locale, skin: skinRaw, concern: concernRaw, budget: budgetRaw } = await params;
  const loc = locale as Locale;
  const isTh = loc === "th";

  const parsed = parseParams(skinRaw, concernRaw, budgetRaw);
  if (!parsed) notFound();
  const { skin, concern, budget } = parsed;

  const products = quizRecommendations({ skin, concern, budget });
  const entries = products.map((p) => ({ product: p, href: `/${locale}/product/${productSlug(p)}` }));
  const [quizSlot] = await getActiveByType("quiz_result");
  const quizSponsorProduct = quizSlot ? getProduct(quizSlot.productId) : null;
  const resultUrl = `${BASE}/${locale}/quiz/result/${skin}/${concern}/${budget}`;
  const productCount = Math.floor(siteStats().products / 100) * 100;

  const skinLbl = isTh ? SKIN_LABELS[skin].th : SKIN_LABELS[skin].en;
  const concernMeta = CONCERN_QUIZ_META[concern];
  const concernLbl = (isTh ? concernMeta?.th : concernMeta?.en) ?? concernLabel(loc, concern);
  const budgetLbl = isTh ? BUDGET_LABELS[budget].th : BUDGET_LABELS[budget].en;
  const { max: budgetMax } = BUDGET_RANGE[budget];
  const expandedBeyondBudget = entries.some(
    ({ product: p }) => budgetMax !== Infinity && p.price_thb > budgetMax
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: isTh
      ? `สกินแคร์ TOP 3 สำหรับ${skinLbl} · ปัญหา${concernLbl} · งบ${budgetLbl}`
      : `Top 3 skincare for ${skinLbl} skin · ${concernLbl} · ${budgetLbl}`,
    description: isTh
      ? `ผลิตภัณฑ์สกินแคร์ที่เหมาะสำหรับผิว${skinLbl} กังวลเรื่อง${concernLbl} จากฐานข้อมูล ${productCount}+ รายการ`
      : `Best skincare products for ${skinLbl.toLowerCase()} skin with ${concernLbl?.toLowerCase()} concerns from ${productCount}+ products`,
    url: resultUrl,
    numberOfItems: entries.length,
    itemListElement: entries.map(({ product: p, href }, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.name,
      url: `${BASE}${href}`,
    })),
  };

  if (entries.length === 0) {
    return (
      <div className="max-w-lg mx-auto py-16 text-center space-y-4">
        <p className="text-neutral-500">
          {isTh ? "ไม่พบผลิตภัณฑ์ที่ตรงกับเงื่อนไข" : "No products found for your criteria"}
        </p>
        <Link href={`/${locale}/quiz`} className="text-rose-500 underline">
          {isTh ? "ลองใหม่" : "Try again"}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-widest text-[#c9a86a] font-medium">
          {isTh ? "ผลลัพธ์ของคุณ" : "Your results"}
        </p>
        <h1 className="font-serif-display text-2xl font-semibold text-[#2b2222]">
          {isTh ? "สกินแคร์ที่ใช่สำหรับคุณ 🌸" : "Your perfect skincare match 🌸"}
        </h1>
        <p className="text-sm text-neutral-500">
          {SKIN_LABELS[skin].emoji} {skinLbl} &nbsp;·&nbsp; {concernMeta?.emoji} {concernLbl} &nbsp;·&nbsp; {budgetLbl}
        </p>
        {expandedBeyondBudget && (
          <p className="text-xs text-amber-600">
            {isTh
              ? "* ผลลัพธ์บางรายการเกินงบที่เลือกไว้ เนื่องจากมีตัวเลือกในงบไม่เพียงพอ"
              : "* Some picks exceed your budget — not enough well-reviewed options were found within it."}
          </p>
        )}
      </div>

      <QuizResultCard
        entries={entries}
        skin={skin}
        concern={concern}
        budget={budget}
        locale={loc}
        resultUrl={resultUrl}
      />

      {/* Sponsored: Quiz Result Placement */}
      {quizSponsorProduct && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <SponsoredBadge locale={loc} />
            <span className="text-sm font-medium text-amber-800">
              {loc === "th" ? "สปอนเซอร์แนะนำ" : "Sponsored pick"}
            </span>
          </div>
          <div className="flex gap-3 items-center">
            <div className="relative w-16 h-16 shrink-0 rounded-lg bg-white overflow-hidden">
              <Image
                src={quizSponsorProduct.image_url}
                alt={quizSponsorProduct.name}
                fill
                sizes="64px"
                className="object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold line-clamp-2">{quizSponsorProduct.name}</p>
              <p className="text-rose-600 font-semibold">฿{Math.round(quizSponsorProduct.price_thb).toLocaleString("en-US")}</p>
            </div>
            <a
              href={`/${loc}/product/${productSlug(quizSponsorProduct)}`}
              className="shrink-0 rounded-lg bg-rose-600 px-3 py-1.5 text-sm text-white font-medium"
            >
              {loc === "th" ? "ดูเลย" : "View"}
            </a>
          </div>
        </div>
      )}

      <QuizLeadCapture
        skin={skin}
        concern={concern}
        budget={budget}
        locale={locale}
        labelTh="รับดีล"
        labelEn="Get deals"
      />

      {/* AEO paragraph — indexed by AI search */}
      <section className="prose prose-sm text-neutral-600 max-w-none pt-2 space-y-2">
        <p>
          {isTh
            ? `สำหรับ${skinLbl}ที่กังวลเรื่อง${concernLbl} ผลิตภัณฑ์ด้านบนถูกคัดเลือกจาก ${productCount}+ รายการ โดยพิจารณาจากคะแนนส่วนผสม รีวิวจากผู้ใช้จริง และความคุ้มค่าตามราคา`
            : `For ${skinLbl.toLowerCase()} skin concerned about ${concernLbl?.toLowerCase()}, the products above are selected from ${productCount}+ items based on ingredient efficacy scores, verified user reviews, and price-per-ml value.`}
        </p>
        <p>
          <Link href={`/${locale}/methodology`} className="text-rose-500 hover:underline text-sm">
            {isTh ? "ดูวิธีการจัดอันดับ →" : "See our methodology →"}
          </Link>
        </p>
      </section>

      <JsonLd data={jsonLd} />
    </div>
  );
}
