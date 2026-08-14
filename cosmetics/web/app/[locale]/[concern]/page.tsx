import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  CONCERNS,
  getRanking,
  getOralRanking,
  getProduct,
  productSlug,
  allProducts,
  generatedAt,
  topPicks,
  bestSellers,
  mostLoved,
  getFilter,
  CONCERN_FILTER_SLUGS,
  type Concern,
} from "@/lib/data";
import { STATIC_LOCALES, localeAlternates, t, concernLabel, concernLabelShort, type Locale } from "@/lib/i18n";
import { itemListLd, concernFaqQas, faqLd, breadcrumbLd, howToLd } from "@/lib/schema";
import { getFeaturedMap } from "@/lib/adminData";
import { getActiveByType } from "@/lib/ads";
import { SponsoredBadge } from "@/components/SponsoredBadge";
import { JsonLd } from "@/components/JsonLd";
import { ComparisonTable } from "@/components/ComparisonTable";
import { ProductStrip } from "@/components/ProductStrip";
import { IngredientGuide } from "@/components/IngredientGuide";
import { ProductFilter } from "@/components/ProductFilter";
import { foldIngredients } from "@/lib/filter-sets";
import { scoreColor } from "@/lib/format";
import { ShareRow } from "@/components/ShareRow";

const BASE = "https://bangkokfillers.com";
export const revalidate = 86400;
// 2026-07-13 긴급 픽스: [concern]은 /{locale}/ 아래 전체를 캐치하는 catch-most 라우트라
// dynamicParams 기본값(true)이면 /th/wp-login 같은 봇 쓰레기 경로까지 전부 온디맨드
// 렌더+ISR 캐시 write 발생 — Hobby 월 200K 한도를 1.5M까지 초과시킨 원인.
// false로 고정해 미리 생성 안 된 concern은 라우팅 단계에서 즉시 404 (렌더/캐시 write 없음).
export const dynamicParams = false;

type GuideEntry = {
  causeTh: string; causeEn: string;
  ingredientsTh: string[]; ingredientsEn: string[];
  howTh: string; howEn: string;
};

const CONCERN_GUIDE: Record<string, GuideEntry> = {
  acne: {
    causeTh: "ต่อมไขมันทำงานมากเกิน + แบคทีเรีย P. acnes + รูขุมขนอุดตันจากเซลล์ผิวเก่า",
    causeEn: "Excess sebum, P. acnes bacteria, and clogged pores from dead skin cells.",
    ingredientsTh: ["Salicylic Acid (BHA) — ล้างรูขุมขนลึก", "Niacinamide — ลดการอักเสบ ควบคุมไขมัน", "Benzoyl Peroxide — ฆ่าแบคทีเรีย", "Azelaic Acid — ลดรอยแดงหลังสิว"],
    ingredientsEn: ["Salicylic Acid (BHA) — deep pore cleansing", "Niacinamide — reduces inflammation & sebum", "Benzoyl Peroxide — kills acne bacteria", "Azelaic Acid — fades post-acne marks"],
    howTh: "เลือกผลิตภัณฑ์ที่มี BHA (Salicylic Acid) ≥ 0.5% หลีกเลี่ยงส่วนผสมที่อุดตันรูขุมขน (Comedogenic) เช่น coconut oil และน้ำมันหอมระเหยหนัก",
    howEn: "Look for BHA (Salicylic Acid) ≥ 0.5%. Avoid comedogenic ingredients like coconut oil and heavy fragrance oils.",
  },
  whitening: {
    causeTh: "รังสี UV กระตุ้นเมลานิน + ฮอร์โมน (ฝ้า) + รอยดำหลังการอักเสบ (PIH)",
    causeEn: "UV-stimulated melanin, hormonal melasma, and post-inflammatory hyperpigmentation (PIH).",
    ingredientsTh: ["Vitamin C (Ascorbic Acid) — ยับยั้งเอนไซม์สร้างเมลานิน", "Niacinamide — ลดการส่งผ่านเมลานิน", "Alpha Arbutin — เบาะแสฝ้าจางลง", "Tranexamic Acid — ฝ้าฮอร์โมน"],
    ingredientsEn: ["Vitamin C (Ascorbic Acid) — inhibits melanin enzyme", "Niacinamide — blocks melanin transfer", "Alpha Arbutin — fades dark spots", "Tranexamic Acid — hormonal melasma"],
    howTh: "ต้องใช้ร่วมกับครีมกันแดด SPF 30+ ทุกเช้า ไม่เช่นนั้นส่วนผสมไวท์เทนนิ่งจะสูญเปล่า เลือก Vitamin C ในบรรจุภัณฑ์ทึบแสงเพื่อป้องกันออกซิเดชัน",
    howEn: "Always pair with SPF 30+ sunscreen every morning — without it, brightening actives are wasted. Choose Vitamin C in opaque airtight packaging to prevent oxidation.",
  },
  antiaging: {
    causeTh: "คอลลาเจนลดลงตามอายุ + ความเสียหายจาก UV + อนุมูลอิสระ",
    causeEn: "Collagen breakdown with age, UV damage, free radicals, and repeated facial movements.",
    ingredientsTh: ["Retinol — กระตุ้นคอลลาเจน เร่งเซลล์ผิวใหม่", "Peptides — สัญญาณสร้างคอลลาเจน", "Vitamin C — antioxidant ป้องกัน UV damage", "Hyaluronic Acid — เติมความชุ่มชื้น ลดริ้วรอยจากความแห้ง"],
    ingredientsEn: ["Retinol — boosts collagen & cell turnover", "Peptides — collagen signalling", "Vitamin C — antioxidant, UV damage defence", "Hyaluronic Acid — moisture-plumps fine lines"],
    howTh: "เริ่ม retinol ที่ความเข้มข้นต่ำ (0.025–0.05%) ใช้ตอนกลางคืน ใช้ SPF กลางวันเสมอ เพิ่มความเข้มข้นทีละน้อยเพื่อลด purging",
    howEn: "Start retinol at low concentration (0.025–0.05%), use at night only. Always wear SPF during the day. Increase strength gradually to minimise purging.",
  },
  pores: {
    causeTh: "ต่อมไขมันทำงานมาก + พันธุกรรม + อายุทำให้คอลลาเจนรอบรูขุมขนลดลง + UV damage",
    causeEn: "Overactive sebaceous glands, genetics, age-related collagen loss around pores, and UV damage.",
    ingredientsTh: ["Niacinamide — ลดการมองเห็นรูขุมขน ควบคุมไขมัน", "Salicylic Acid — ล้างสิ่งอุดตันในรูขุมขน", "Retinol — เพิ่มคอลลาเจนรอบรูขุมขน", "Clay (Kaolin/Bentonite) — ดูดซับไขมัน"],
    ingredientsEn: ["Niacinamide — minimises pore appearance, controls sebum", "Salicylic Acid — dissolves pore blockages", "Retinol — rebuilds collagen around pores", "Clay (Kaolin/Bentonite) — absorbs excess oil"],
    howTh: "ไม่มีส่วนผสมใดปิดรูขุมขนถาวรได้ แต่ niacinamide + BHA ช่วยให้รูขุมขนดูเล็กลงได้จริง หลีกเลี่ยงการบีบสิวที่ทำให้รูขุมขนขยาย",
    howEn: "No ingredient can permanently close pores, but niacinamide + BHA genuinely minimise their appearance. Avoid squeezing blackheads which stretch pore walls.",
  },
  oilcontrol: {
    causeTh: "ต่อมไขมัน sebaceous ทำงานมากเกิน เพิ่มขึ้นในอากาศร้อนชื้นและฮอร์โมน",
    causeEn: "Overactive sebaceous glands, exacerbated by Bangkok heat, humidity, and hormonal fluctuations.",
    ingredientsTh: ["Niacinamide — ลด sebum production ได้จริงในทางวิทยาศาสตร์", "Salicylic Acid (BHA) — ล้างรูขุมขน ลดมัน", "Zinc PCA — ควบคุมไขมัน ลดอักเสบ", "Hyaluronic Acid (light) — ให้ความชุ่มชื้นโดยไม่เพิ่มความมัน"],
    ingredientsEn: ["Niacinamide — clinically reduces sebum production", "Salicylic Acid (BHA) — cleanses pores, cuts oiliness", "Zinc PCA — controls oil & inflammation", "Hyaluronic Acid (light) — hydrates without greasiness"],
    howTh: "เลือก texture เบา (gel/fluid/water-based) หลีกเลี่ยง heavy cream และผลิตภัณฑ์ที่ใช้น้ำมันเป็นฐาน มอยเจอร์ไรเซอร์จำเป็นแม้ผิวมัน — ผิวขาดน้ำทำให้มันมากขึ้น",
    howEn: "Choose lightweight textures (gel/fluid/water-based). Avoid heavy creams and oil-based formulas. Moisturiser is still essential for oily skin — dehydration makes oil production worse.",
  },
  sensitive: {
    causeTh: "ผนังกั้นผิวบกพร่อง ทำให้สารระคายเคืองเข้าง่าย และน้ำระเหยออกเร็ว (TEWL)",
    causeEn: "Impaired skin barrier allows irritants in and moisture out (TEWL — transepidermal water loss).",
    ingredientsTh: ["Centella Asiatica — ซ่อมแซม barrier ลดการอักเสบ", "Ceramides — เติมเต็ม barrier ที่บกพร่อง", "Hyaluronic Acid — ดึงความชุ่มชื้น ไม่ระคายเคือง", "Panthenol (Pro-Vitamin B5) — สมานแผล ลดรอยแดง"],
    ingredientsEn: ["Centella Asiatica — repairs barrier, reduces redness", "Ceramides — replenishes impaired skin barrier", "Hyaluronic Acid — attracts moisture without irritation", "Panthenol (Pro-Vitamin B5) — soothes and heals"],
    howTh: "เลือกผลิตภัณฑ์ที่ปราศจาก fragrance และ alcohol ทดสอบที่ข้อมือก่อนทาหน้า เพิ่มผลิตภัณฑ์ใหม่ทีละ 1 ชิ้น เพื่อระบุตัวที่แพ้ได้",
    howEn: "Choose fragrance-free, alcohol-free formulas. Patch test on your wrist before full application. Introduce new products one at a time to identify triggers.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; concern: string }>;
}): Promise<Metadata> {
  const { locale: localeRaw, concern } = await params;
  const locale = localeRaw as Locale;
  const label = concernLabel(locale, concern);
  const shortLabel = concernLabelShort(locale, concern);
  const count = getRanking(concern as Concern).length;
  const year = new Date().getFullYear();
  // Keep titles near the ~60-char SERP cut — some concern labels (e.g. whitening's
  // full Thai label) run 25-30 chars on their own, so the short variant is used here.
  const title =
    locale === "th"
      ? `${shortLabel} อันดับสกินแคร์ไทย ${year} (${count} รายการ)`
      : `Best Thai ${shortLabel} Skincare ${year} — ${count} Ranked`;
  const description =
    locale === "th"
      ? `เปรียบเทียบ ${count} ผลิตภัณฑ์แก้ปัญหา${label} วิเคราะห์จากส่วนผสมจริง รีวิวจาก Konvy + Watsons + iHerb กว่า 10,000 รีวิว อัปเดต ${year}`
      : `${count} Thai skincare products for ${label} — ranked by ingredient efficacy (45%), verified buyer reviews from Konvy, Watsons & iHerb (45%), and value (10%). Updated ${year}.`;
  return {
    title,
    description,
    alternates: {
      canonical: `${BASE}/${locale}/${concern}`,
      languages: localeAlternates((l) => `${BASE}/${l}/${concern}`),
    },
    openGraph: { title, description, url: `${BASE}/${locale}/${concern}` },
    twitter: { card: "summary_large_image", title, description },
  };
}

export function generateStaticParams() {
  return STATIC_LOCALES.flatMap((locale) =>
    CONCERNS.map((concern) => ({ locale, concern }))
  );
}

// Rank badge colors for podium cards
const PODIUM_COLORS = [
  { badge: "bg-rose-500 text-white", border: "border-[#efe1db]", ring: "ring-rose-100" },
  { badge: "bg-emerald-500 text-white", border: "border-emerald-200", ring: "ring-emerald-50" },
  { badge: "bg-emerald-400 text-white", border: "border-emerald-200", ring: "ring-emerald-50" },
];

function productDisplayName(brand: string, name: string): string {
  if (name.toLowerCase().startsWith(brand.toLowerCase())) return name;
  return `${brand} ${name}`;
}

export default async function ConcernHub({
  params,
}: {
  params: Promise<{ locale: string; concern: string }>;
}) {
  const { locale: localeRaw, concern } = await params;
  const locale = localeRaw as Locale;

  if (!CONCERNS.includes(concern as Concern)) notFound();

  // A ranking entry pointing at a product that's since been removed from
  // master_db.json would previously crash the whole concern page via the `!`
  // assertion below — filter those out instead (rank is assigned after
  // filtering so numbering stays sequential, not gapped).
  const rankedEntries = getRanking(concern)
    .map((e) => ({ e, p: getProduct(e.product_id) }))
    .filter(
      (x): x is { e: (typeof x)["e"]; p: NonNullable<(typeof x)["p"]> } =>
        x.p != null
    );
  const rows = rankedEntries.map(({ e, p }, i) => {
    const key =
      p.ingredient_analysis.find((a) => a.concern_efficacy[concern] > 0)
        ?.inci ?? "—";
    return {
      rank: i + 1,
      id: p.product_id,
      slug: productSlug(p),
      name: p.name,
      brand: p.brand,
      score: e.total_score,
      keyIngredient: key,
      price: p.price_thb,
      rating: p.konvy_rating,
      reviews: p.konvy_review_count,
      image: p.image_url,
    };
  });

  // AEO: direct-answer paragraph for AI search engines
  const totalReviews = getRanking(concern)
    .slice(0, 20)
    .reduce((sum, e) => {
      const p = getProduct(e.product_id);
      return sum + (p?.konvy_review_count ?? 0);
    }, 0);
  const topProduct = rows[0];
  const rankingCount = rows.length;
  const directAnswer =
    locale === "ko" && topProduct
      ? `태국에서 ${concernLabel(locale, concern)} 최고 제품 TOP ${rankingCount}를 성분 데이터와 실제 리뷰로 분석했습니다. 1위는 ${topProduct.brand} ${topProduct.name}입니다.`
      : locale === "en" && topProduct
        ? `We ranked ${rankingCount} Thai skincare products for ${concernLabel(locale, concern)} by ingredient efficacy and ${totalReviews.toLocaleString()} verified reviews. Top pick: ${topProduct.brand} ${topProduct.name}.`
        : null;

  const top = rows.slice(0, 20);
  const podium = rows.slice(0, 3);

  // Oral supplements, same shape as `rows` so ComparisonTable can render both.
  // Scored separately (dose-weighted, see oral_ingredient_score) — never mixed
  // into the topical ranking above.
  const oralEntries = getOralRanking(concern)
    .map((e) => ({ e, p: getProduct(e.product_id) }))
    .filter(
      (x): x is { e: (typeof x)["e"]; p: NonNullable<(typeof x)["p"]> } =>
        x.p != null
    );
  const oralRows = oralEntries.slice(0, 5).map(({ e, p }, i) => {
    const key =
      p.ingredient_analysis.find((a) => a.concern_efficacy[concern] > 0)?.inci ?? "—";
    return {
      rank: i + 1,
      id: p.product_id,
      slug: productSlug(p),
      name: p.name,
      brand: p.brand,
      score: e.total_score,
      keyIngredient: key,
      price: p.price_thb,
      rating: p.konvy_rating,
      reviews: p.konvy_review_count,
      image: p.image_url,
    };
  });
  const products = getRanking(concern)
    .slice(0, 20)
    .map((e) => getProduct(e.product_id))
    .filter((p) => p != null);

  // Discovery strip data
  const picks = topPicks(concern, 8);
  const sellers = bestSellers(concern, 8);
  const loved = mostLoved(concern, 8);
  const featuredMap = await getFeaturedMap();
  const featuredId = featuredMap[concern];
  const featuredProduct = featuredId ? getProduct(featuredId) : null;

  const [takeoverSlot] = await getActiveByType("category_takeover", concern);
  const [editorsPickSlot] = await getActiveByType("editors_pick", concern);
  const takeoverProduct = takeoverSlot ? getProduct(takeoverSlot.productId) : null;
  const editorsPickProduct = editorsPickSlot ? getProduct(editorsPickSlot.productId) : null;

  const labels = {
    rank: t(locale, "rank"),
    product: t(locale, "product"),
    score: t(locale, "score"),
    key_ingredient: t(locale, "key_ingredient"),
    price: t(locale, "price"),
    rating: t(locale, "rating"),
  };

  const title =
    locale === "th"
      ? `${concernLabel(locale, concern)} : ผลิตภัณฑ์ที่ดีที่สุดจัดอันดับด้วยส่วนผสม + รีวิวจริง`
      : `Best products for ${concernLabel(locale, concern)} — ranked by ingredients + real reviews`;

  const intro =
    locale === "th"
      ? "อันดับคำนวณจากคะแนนส่วนผสม 45% รีวิว 45% ความคุ้มค่า 10%"
      : "Ranked by 45% ingredient science, 45% aggregated reviews, 10% value.";

  const fullIntro = `${title}. ${intro}`;

  const faqQas = concernFaqQas(concern, locale, rows[0]?.name ?? "", Math.round(rows[0]?.score ?? 0));

  return (
    <article className="space-y-6 sm:space-y-10">
      {/* Editorial page header */}
      <header className="space-y-2 sm:space-y-3">
        <h1 className="font-serif-display text-2xl sm:text-4xl font-semibold leading-tight text-[#1a1a1a]">
          {title}
        </h1>
        {directAnswer && (
          <p className="concern-summary text-sm text-neutral-600 max-w-prose">
            {directAnswer}
          </p>
        )}
        <p className="concern-summary text-base sm:text-lg text-neutral-700 max-w-prose leading-relaxed">
          {intro}
        </p>
        <p className="text-xs text-neutral-400">
          {t(locale, "updated")}: {generatedAt()?.slice(0, 10)}
        </p>
      </header>

      {/* Concern guide — cause / key ingredients / how to pick */}
      {CONCERN_GUIDE[concern] && (() => {
        const g = CONCERN_GUIDE[concern];
        const isTh = locale === "th";
        return (
          <section className="concern-guide-lead rounded-2xl border border-[#efe1db] bg-[#fdfaf9] p-5 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="space-y-1.5">
                <p className="text-[10px] uppercase tracking-widest text-[#c9a86a] font-bold">
                  {isTh ? "สาเหตุ" : "Why it happens"}
                </p>
                <p className="text-sm text-neutral-700 leading-relaxed">
                  {isTh ? g.causeTh : g.causeEn}
                </p>
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] uppercase tracking-widest text-[#c9a86a] font-bold">
                  {isTh ? "ส่วนผสมสำคัญ" : "Key ingredients"}
                </p>
                <ul className="space-y-1">
                  {(isTh ? g.ingredientsTh : g.ingredientsEn).map((item) => (
                    <li key={item} className="text-sm text-neutral-700 flex gap-1.5">
                      <span className="text-rose-400 mt-0.5 shrink-0">✦</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] uppercase tracking-widest text-[#c9a86a] font-bold">
                  {isTh ? "วิธีเลือก" : "How to pick"}
                </p>
                <p className="text-sm text-neutral-700 leading-relaxed">
                  {isTh ? g.howTh : g.howEn}
                </p>
              </div>
            </div>
          </section>
        );
      })()}

      {/* Filter chips — links to SEO sub-pages */}
      {(CONCERN_FILTER_SLUGS[concern] ?? []).length > 0 && (
        <div className="flex flex-wrap gap-2 -mt-2">
          {(CONCERN_FILTER_SLUGS[concern] ?? []).map((slug) => {
            const fc = getFilter(slug);
            if (!fc) return null;
            return (
              <Link
                key={slug}
                href={`/${locale}/${concern}/${slug}`}
                className="text-xs px-3 py-1.5 rounded-full border border-[#efe1db] bg-white text-[#8a7a76] hover:text-rose-500 hover:border-rose-300 transition-colors"
              >
                {fc.emoji} {locale === "th" ? fc.th : fc.en}
              </Link>
            );
          })}
        </div>
      )}

      {/* Top-3 Podium cards — moved directly under the header/guide/filters.
          Used to sit after two sponsored slots, an ingredient guide, and three
          product strips — a phone user had to scroll ~2,500-3,000px past ad
          placements to reach the ranking they came for. */}
      {podium.length > 0 && (
        <section>
          <h2 className="font-serif-display text-lg font-semibold text-neutral-700 mb-3">
            {locale === "th" ? "อันดับต้น 3" : "Top 3"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {podium.map((r, i) => {
              const c = PODIUM_COLORS[i];
              return (
                <div
                  key={r.id}
                  className={`relative rounded-xl border ${c.border} bg-white ring-2 ${c.ring} p-4 flex flex-col gap-2 shadow-sm`}
                >
                  {/* Rank badge */}
                  <span
                    className={`absolute -top-3 -left-2 inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold shadow ${c.badge}`}
                  >
                    {i + 1}
                  </span>
                  {/* Product name */}
                  <Link
                    href={`/${locale}/product/${r.slug}`}
                    className="text-rose-600 hover:text-rose-800 font-medium leading-snug pt-1 hover:underline underline-offset-2"
                  >
                    {productDisplayName(r.brand, r.name)}
                  </Link>
                  {/* Score pill */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${scoreColor(r.score)} ${
                        r.score >= 85
                          ? "bg-emerald-50"
                          : r.score >= 70
                            ? "bg-amber-50"
                            : "bg-rose-50"
                      }`}
                    >
                      {(Math.round(r.score * 10) / 10).toFixed(1)}
                    </span>
                    <span className="text-xs text-neutral-500">
                      ฿{Math.round(r.price).toLocaleString("en-US")}
                    </span>
                  </div>
                  {/* Key ingredient */}
                  {r.keyIngredient !== "—" && (
                    <p className="text-xs text-neutral-500 mt-auto">
                      <span className="font-medium text-neutral-600">
                        {labels.key_ingredient}:
                      </span>{" "}
                      {r.keyIngredient}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Full comparison table — moved up alongside the podium, same reasoning. */}
      <section>
        <h2 className="font-serif-display text-lg font-semibold text-neutral-700 mb-3">
          {locale === "th" ? "ตารางเปรียบเทียบทั้งหมด" : "Full comparison table"}
        </h2>
        <ComparisonTable rows={top} locale={locale} labels={labels} />
      </section>

      {/* Oral supplements — same page, separate section. A search for "ฝ้า" or
          "whitening" covers both what you apply and what you take, so this
          shares the page rather than splitting into its own URL (fewer pages
          to crawl, and the two forms answer the same intent together). Never
          merged into the topical table above: scoring is not comparable
          (dose-weighted vs. presence-weighted) and mixing them would silently
          rank a tablet against a serum on the same 0-100 scale. */}
      {oralRows.length > 0 && (
        <section>
          <h2 className="font-serif-display text-lg font-semibold text-neutral-700 mb-1">
            {locale === "th" ? "อาหารเสริมกินเสริมผิว" : "Oral supplements"}
          </h2>
          <p className="text-xs text-neutral-500 mb-3">
            {locale === "th"
              ? "จัดอันดับตามปริมาณสารออกฤทธิ์ที่ระบุฉลาก ไม่ใช่แค่การมีอยู่"
              : "Ranked by the labelled dose of the active ingredient, not just its presence."}
          </p>
          <ComparisonTable rows={oralRows} locale={locale} labels={labels} />
        </section>
      )}

      {/* ── Sponsored slot — clearly labelled, rankings not affected ── */}
      {featuredProduct && (
        <section className="rounded-2xl border-2 border-[#c9a86a]/40 bg-[#fffbf5] p-4 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {featuredProduct.image_url && (
              <div className="relative w-14 h-14 shrink-0 rounded-xl overflow-hidden border border-[#efe1db] bg-white">
                <Image src={featuredProduct.image_url} alt={featuredProduct.name} fill sizes="56px" className="object-contain p-1" />
              </div>
            )}
            <div className="min-w-0">
              <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-[#c9a86a] mb-0.5">
                {locale === "th" ? "ผู้สนับสนุน" : "Sponsored"}
              </span>
              <Link
                href={`/${locale}/product/${productSlug(featuredProduct)}`}
                className="block font-semibold text-sm text-[#2b2222] hover:text-rose-500 transition-colors truncate"
              >
                {featuredProduct.brand} {featuredProduct.name}
              </Link>
              <p className="text-xs text-neutral-500 mt-0.5">฿{Math.round(featuredProduct.price_thb).toLocaleString("en-US")}</p>
            </div>
          </div>
          <Link
            href={featuredProduct.url}
            target="_blank"
            rel="sponsored noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-1.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold rounded-xl px-4 py-2.5 transition-colors"
          >
            {locale === "th" ? "ดูสินค้า" : "View"} →
          </Link>
        </section>
      )}

      {/* ── 성분 가이드 ── */}
      <IngredientGuide concern={concern} locale={locale} />

      {/* Our Picks strip */}
      {picks.length > 0 && (
        <ProductStrip
          title={t(locale, "our_picks")}
          eyebrow={locale === "th" ? "บรรณาธิการแนะนำ" : "Editor's picks"}
          subtitle={
            locale === "th"
              ? "คัดโดยคะแนนส่วนผสม + รีวิวจริง"
              : "Top-scored by ingredient science + real reviews"
          }
          products={picks}
          locale={locale}
          concern={concern}
          proof="score"
        />
      )}

      {/* Bestsellers strip */}
      {sellers.length > 0 && (
        <ProductStrip
          title={t(locale, "bestsellers")}
          eyebrow={locale === "th" ? "ขายดี" : "Hot sellers"}
          subtitle={
            locale === "th"
              ? "สินค้าที่มียอดขายสูงสุด"
              : "Most purchased in this category"
          }
          products={sellers}
          locale={locale}
          concern={concern}
          proof="sold"
        />
      )}

      {/* Most Loved strip */}
      {loved.length > 0 && (
        <ProductStrip
          title={t(locale, "most_loved")}
          eyebrow={locale === "th" ? "คนรัก" : "Fan favourites"}
          subtitle={
            locale === "th"
              ? "รีวิวมากที่สุด เรตติ้งดีที่สุด"
              : "Most reviewed & highest rated"
          }
          products={loved}
          locale={locale}
          concern={concern}
          proof="loved"
        />
      )}

      {/* Sponsored: Editor's Pick */}
      {editorsPickProduct && (
        <section className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex gap-4 items-center">
          <div className="relative w-16 h-16 shrink-0 rounded-lg bg-white overflow-hidden">
            <Image
              src={editorsPickProduct.image_url}
              alt={editorsPickProduct.name}
              fill
              sizes="64px"
              className="object-contain"
            />
          </div>
          <div className="flex-1 min-w-0">
            <SponsoredBadge locale={locale} className="mb-1" />
            <p className="text-sm font-semibold line-clamp-2">{editorsPickProduct.name}</p>
            <p className="text-rose-600 font-semibold text-sm">฿{editorsPickProduct.price_thb}</p>
          </div>
          <a
            href={`/${locale}/product/${productSlug(editorsPickProduct)}`}
            className="shrink-0 rounded-lg bg-rose-600 px-3 py-1.5 text-sm text-white font-medium"
          >
            {locale === "th" ? "ดูเลย" : "View"}
          </a>
        </section>
      )}

      {/* ── แนะนำสำหรับคุณ / Find your match ──
          Flatten total_score/concern_efficacy from a 6-concern Record down to a single
          number for THIS concern, and cap the candidate pool — ProductFilter only ever
          surfaces 12 cards, so shipping all ~800+ matches (each with every ingredient's
          full 6-concern efficacy map + safety flags) to the client was pure waste. This
          was the dominant contributor to concern pages shipping ~1.2MB of RSC payload. */}
      <ProductFilter
        products={allProducts()
          .filter((p) => {
            const seeds = p.concern_seeds;
            return Array.isArray(seeds) ? seeds.includes(concern) : String(seeds).split("|").includes(concern);
          })
          .sort((a, b) => (b.total_score[concern] ?? 0) - (a.total_score[concern] ?? 0))
          .slice(0, 200)
          .map((p) => ({
            product_id: p.product_id,
            brand: p.brand,
            name: p.name,
            price_thb: p.price_thb,
            discount_pct: p.discount_pct,
            image_url: p.image_url,
            sold_count: p.sold_count,
            total_score: p.total_score[concern] ?? 0,
            // Fold ingredient_analysis down to the three scalars the filter
            // reads, instead of serialising every ingredient of all 200
            // candidates so the browser can recompute them.
            ...foldIngredients(p.ingredient_analysis, concern),
          }))}
        locale={locale}
      />

      {/* Sponsored: Category Takeover */}
      {takeoverProduct && (
        <section className="rounded-xl border-2 border-amber-300 bg-amber-50 p-4 flex gap-4 items-center">
          <div className="relative w-16 h-16 shrink-0 rounded-lg bg-white overflow-hidden">
            <Image
              src={takeoverProduct.image_url}
              alt={takeoverProduct.name}
              fill
              sizes="64px"
              className="object-contain"
            />
          </div>
          <div className="flex-1 min-w-0">
            <SponsoredBadge locale={locale} className="mb-1" />
            <p className="font-semibold text-sm line-clamp-2">{takeoverProduct.name}</p>
            <p className="text-rose-600 font-semibold text-sm">฿{takeoverProduct.price_thb}</p>
          </div>
          <a
            href={`/${locale}/product/${productSlug(takeoverProduct)}`}
            className="shrink-0 rounded-lg bg-rose-600 px-3 py-1.5 text-sm text-white font-medium"
          >
            {locale === "th" ? "ดูเลย" : "View"}
          </a>
        </section>
      )}

      {/* FAQ — same Q&A as the FAQPage JSON-LD below, rendered visibly so
          it's real on-page content (not a schema/content mismatch) and so
          AI search engines have actual text to cite. */}
      <section className="space-y-3">
        <h2 className="font-serif-display text-lg font-semibold text-neutral-700">
          {locale === "th" ? "คำถามที่พบบ่อย" : "Frequently asked questions"}
        </h2>
        <div className="space-y-2">
          {faqQas.map(({ q, a }) => (
            <details key={q} className="group rounded-2xl border border-[#efe1db] bg-white px-4 py-3">
              <summary className="cursor-pointer list-none text-sm font-semibold text-[#2b2222] flex items-center justify-between gap-2">
                {q}
                <span className="text-[#c9a86a] transition-transform group-open:rotate-45 shrink-0">+</span>
              </summary>
              <p className="mt-2 text-sm text-neutral-600 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <JsonLd
        data={itemListLd(
          `https://bangkokfillers.com/${locale}/${concern}`,
          products,
          (p) =>
            `https://bangkokfillers.com/${locale}/product/${productSlug(p)}`
        )}
      />
      {oralRows.length > 0 && (
        <JsonLd
          data={itemListLd(
            `https://bangkokfillers.com/${locale}/${concern}#oral`,
            oralEntries.map((x) => x.p),
            (p) =>
              `https://bangkokfillers.com/${locale}/product/${productSlug(p)}`
          )}
        />
      )}
      <JsonLd data={faqLd(faqQas)} />
      {CONCERN_GUIDE[concern] && (() => {
        const g = CONCERN_GUIDE[concern];
        const isTh = locale === "th";
        const label = concernLabel(locale, concern);
        return (
          <JsonLd data={howToLd({
            name: isTh ? `วิธีเลือกผลิตภัณฑ์${label}` : `How to choose the right ${label} skincare`,
            description: isTh ? g.causeTh : g.causeEn,
            url: `https://bangkokfillers.com/${locale}/${concern}`,
            steps: [
              {
                name: isTh ? "เข้าใจสาเหตุ" : "Understand the cause",
                text: isTh ? g.causeTh : g.causeEn,
              },
              {
                name: isTh ? "ส่วนผสมที่ควรมองหา" : "Key ingredients to look for",
                text: (isTh ? g.ingredientsTh : g.ingredientsEn).join(" · "),
              },
              {
                name: isTh ? "วิธีใช้อย่างถูกต้อง" : "How to use effectively",
                text: isTh ? g.howTh : g.howEn,
              },
              {
                name: isTh ? "เลือกจากคะแนนข้อมูลจริง" : "Select by data score",
                text: isTh
                  ? `ใช้ตารางอันดับ BangkokFillers เพื่อเปรียบเทียบ ${rows.length} ผลิตภัณฑ์ตามคะแนนส่วนผสม+รีวิวจริง`
                  : `Use the BangkokFillers ranking to compare ${rows.length} products by ingredient score + real reviews.`,
              },
            ],
          })} />
        );
      })()}
      <JsonLd data={breadcrumbLd([
        { name: "BangkokFillers", url: `https://bangkokfillers.com/${locale}` },
        { name: concernLabel(locale, concern), url: `https://bangkokfillers.com/${locale}/${concern}` },
      ])} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        url: `https://bangkokfillers.com/${locale}/${concern}`,
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", ".concern-summary", ".concern-guide-lead"],
        },
      }} />

      {/* Budget filter links — cross-link to /budget/* pages */}
      <div className="mt-8 flex flex-wrap gap-2">
        {[
          { slug: "under-300",  th: "งบ 300",  en: "Under ฿300"  },
          { slug: "under-500",  th: "งบ 500",  en: "Under ฿500"  },
          { slug: "under-1000", th: "งบ 1000", en: "Under ฿1000" },
        ].map((b) => (
          <a
            key={b.slug}
            href={`/${locale}/budget/${b.slug}`}
            className="rounded-full border px-3 py-1 text-sm text-gray-600 hover:bg-gray-100"
          >
            {locale === "th" ? b.th : b.en}
          </a>
        ))}
      </div>

      {/* Share this ranking */}
      <ShareRow
        pageUrl={`${BASE}/${locale}/${concern}`}
        shareText={
          locale === "th"
            ? `อันดับสกินแคร์${concernLabel(locale, concern)} ที่ดีที่สุดในไทย — bangkokfillers.com`
            : `Best Thai ${concernLabel(locale, concern)} skincare ranked by ingredients & reviews`
        }
        locale={locale}
        page={`concern:${concern}`}
        label={locale === "th" ? "แชร์อันดับนี้ให้เพื่อน" : "Share this ranking"}
      />
    </article>
  );
}
