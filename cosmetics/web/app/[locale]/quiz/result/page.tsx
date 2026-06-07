import type { Metadata } from "next";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { concernLabel } from "@/lib/i18n";
import { CONCERNS, productSlug, type Concern } from "@/lib/data";
import { quizRecommendations } from "@/lib/quiz";
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

function parseSkin(v: string | undefined): SkinType {
  return VALID_SKINS.includes(v as SkinType) ? (v as SkinType) : "combo";
}
function parseBudget(v: string | undefined): Budget {
  return VALID_BUDGETS.includes(v as Budget) ? (v as Budget) : "mid";
}
function parseConcern(v: string | undefined): Concern {
  return CONCERNS.includes(v as Concern) ? (v as Concern) : "acne";
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string>>;
}): Promise<Metadata> {
  const { locale } = await params;
  const sp = await searchParams;
  const loc = locale as Locale;
  const isTh = loc === "th";

  const skin = parseSkin(sp.skin);
  const concern = parseConcern(sp.concern);
  const budget = parseBudget(sp.budget);

  const skinLbl = isTh ? SKIN_LABELS[skin].th : SKIN_LABELS[skin].en;
  const concernLbl = concernLabel(loc, concern);
  const budgetLbl = isTh ? BUDGET_LABELS[budget].th : BUDGET_LABELS[budget].en;

  const title = isTh
    ? `${skinLbl} · ${concernLbl} — สกินแคร์ TOP 3 | BangkokFillers`
    : `${skinLbl} skin · ${concernLbl} — Top 3 picks | BangkokFillers`;
  const description = isTh
    ? `TOP 3 สกินแคร์สำหรับ${skinLbl} กังวลเรื่อง${concernLbl} งบ${budgetLbl} — จัดอันดับโดยข้อมูลส่วนผสมและรีวิวจริง`
    : `Top 3 skincare for ${skinLbl.toLowerCase()} skin, ${concernLbl.toLowerCase()}, ${budgetLbl} budget — ranked by ingredient science and real reviews`;

  const url = `${BASE}/${locale}/quiz/result?skin=${skin}&concern=${concern}&budget=${budget}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website" },
  };
}

export default async function QuizResultPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string>>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  const loc = locale as Locale;
  const isTh = loc === "th";

  const skin = parseSkin(sp.skin);
  const concern = parseConcern(sp.concern);
  const budget = parseBudget(sp.budget);

  const products = quizRecommendations({ skin, concern, budget });
  const entries = products.map((p) => ({ product: p, href: `/${locale}/product/${productSlug(p)}` }));
  const resultUrl = `${BASE}/${locale}/quiz/result?skin=${skin}&concern=${concern}&budget=${budget}`;

  const skinLbl = isTh ? SKIN_LABELS[skin].th : SKIN_LABELS[skin].en;
  const concernMeta = CONCERN_QUIZ_META[concern];
  const concernLbl = (isTh ? concernMeta?.th : concernMeta?.en) ?? concernLabel(loc, concern);
  const budgetLbl = isTh ? BUDGET_LABELS[budget].th : BUDGET_LABELS[budget].en;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: isTh
      ? `สกินแคร์ TOP 3 สำหรับ${skinLbl} · ปัญหา${concernLbl} · งบ${budgetLbl}`
      : `Top 3 skincare for ${skinLbl} skin · ${concernLbl} · ${budgetLbl}`,
    description: isTh
      ? `ผลิตภัณฑ์สกินแคร์ที่เหมาะสำหรับผิว${skinLbl} กังวลเรื่อง${concernLbl} จากฐานข้อมูล 1,700+ รายการ`
      : `Best skincare products for ${skinLbl.toLowerCase()} skin with ${concernLbl?.toLowerCase()} concerns from 1,700+ products`,
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
      </div>

      <QuizResultCard
        entries={entries}
        skin={skin}
        concern={concern}
        budget={budget}
        locale={loc}
        resultUrl={resultUrl}
      />

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
            ? `สำหรับ${skinLbl}ที่กังวลเรื่อง${concernLbl} ผลิตภัณฑ์ด้านบนถูกคัดเลือกจาก 1,700+ รายการ โดยพิจารณาจากคะแนนส่วนผสม รีวิวจากผู้ใช้จริง และความคุ้มค่าตามราคา`
            : `For ${skinLbl.toLowerCase()} skin concerned about ${concernLbl?.toLowerCase()}, the products above are selected from 1,700+ items based on ingredient efficacy scores, verified user reviews, and price-per-ml value.`}
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
