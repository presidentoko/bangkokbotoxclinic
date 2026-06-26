import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  CONCERNS,
  getRanking,
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
import { LOCALES, t, concernLabel, type Locale } from "@/lib/i18n";
import { itemListLd, concernFaqLd, breadcrumbLd } from "@/lib/schema";
import { getFeaturedMap } from "@/lib/adminData";
import { getActiveByType } from "@/lib/ads";
import { SponsoredBadge } from "@/components/SponsoredBadge";
import { JsonLd } from "@/components/JsonLd";
import { ComparisonTable } from "@/components/ComparisonTable";
import { ProductStrip } from "@/components/ProductStrip";
import { IngredientGuide } from "@/components/IngredientGuide";
import { ProductFilter } from "@/components/ProductFilter";
import { scoreColor } from "@/lib/format";
import { CopyButton } from "@/components/CopyButton";

const BASE = "https://bangkokfillers.com";
export const revalidate = 86400;

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
  const count = getRanking(concern as Concern).length;
  const year = new Date().getFullYear();
  const KO_CONCERN: Record<string, string> = {
    acne: "여드름", whitening: "미백/브라이트닝", antiaging: "안티에이징",
    pores: "모공", oilcontrol: "지성 피부", sensitive: "민감성 피부",
  };
  const AR_CONCERN: Record<string, string> = {
    acne: "حب الشباب", whitening: "التبييض", antiaging: "مكافحة الشيخوخة",
    pores: "المسام", oilcontrol: "التحكم بالدهون", sensitive: "البشرة الحساسة",
  };
  const title =
    locale === "th"
      ? `สกินแคร์${label}ที่ดีที่สุดในไทย ${year} — ${count} ผลิตภัณฑ์ จัดอันดับจริง`
      : locale === "ko"
        ? `태국 ${KO_CONCERN[concern] ?? label} 스킨케어 추천 ${year} — ${count}개 제품 성분+리뷰 순위`
        : locale === "ar"
          ? `أفضل منتجات ${AR_CONCERN[concern] ?? label} في تايلاند ${year} — ${count} منتجاً مصنّفاً`
          : `Best Thai ${label} Skincare ${year} — ${count} Products Ranked by Science`;
  const description =
    locale === "th"
      ? `เปรียบเทียบ ${count} ผลิตภัณฑ์แก้ปัญหา${label} วิเคราะห์จากส่วนผสมจริง รีวิวจาก Konvy + Watsons + iHerb กว่า 10,000 รีวิว อัปเดต ${year}`
      : locale === "ko"
        ? `방콕 여행 쇼핑리스트: ${KO_CONCERN[concern] ?? label} 스킨케어 ${count}개 제품을 성분 데이터와 실제 구매자 리뷰 10,000+개로 순위 매긴 완벽 가이드`
        : locale === "ar"
          ? `${count} منتجاً لـ${AR_CONCERN[concern] ?? label} في تايلاند مصنّفة حسب فاعلية المكونات ومراجعات حقيقية من Konvy و Watsons و iHerb`
          : `${count} Thai skincare products for ${label} — ranked by ingredient efficacy (45%), verified buyer reviews from Konvy, Watsons & iHerb (45%), and value (10%). Updated ${year}.`;
  return {
    title,
    description,
    alternates: {
      canonical: `${BASE}/${locale}/${concern}`,
      languages: Object.fromEntries(
        LOCALES.map((l) => [l, `${BASE}/${l}/${concern}`])
      ),
    },
    openGraph: { title, description, url: `${BASE}/${locale}/${concern}` },
    twitter: { card: "summary_large_image", title, description },
  };
}

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
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

  const rows = getRanking(concern).map((e, i) => {
    const p = getProduct(e.product_id)!;
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
  const products = getRanking(concern)
    .slice(0, 20)
    .map((e) => getProduct(e.product_id)!);

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

  return (
    <article className="space-y-6 sm:space-y-10">
      {/* Editorial page header */}
      <header className="space-y-2 sm:space-y-3">
        <h1 className="font-serif-display text-2xl sm:text-4xl font-semibold leading-tight text-[#1a1a1a]">
          {title}
        </h1>
        {directAnswer && (
          <p className="text-sm text-neutral-600 max-w-prose">
            {directAnswer}
          </p>
        )}
        <p className="text-base sm:text-lg text-neutral-700 max-w-prose leading-relaxed">
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
          <section className="rounded-2xl border border-[#efe1db] bg-[#fdfaf9] p-5 sm:p-6 space-y-4">
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

      {/* ── Sponsored slot — clearly labelled, rankings not affected ── */}
      {featuredProduct && (
        <section className="rounded-2xl border-2 border-[#c9a86a]/40 bg-[#fffbf5] p-4 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {featuredProduct.image_url && (
              <div className="w-14 h-14 shrink-0 rounded-xl overflow-hidden border border-[#efe1db] bg-white">
                <img src={featuredProduct.image_url} alt={featuredProduct.name} className="w-full h-full object-contain p-1" />
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
          <img
            src={editorsPickProduct.image_url}
            alt={editorsPickProduct.name}
            className="w-16 h-16 object-contain rounded-lg shrink-0 bg-white"
          />
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

      {/* Top-3 Podium cards */}
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

      {/* ── แนะนำสำหรับคุณ / Find your match ── */}
      <ProductFilter
        products={allProducts().filter((p) => {
          const seeds = p.concern_seeds;
          return Array.isArray(seeds) ? seeds.includes(concern) : String(seeds).split("|").includes(concern);
        })}
        concern={concern}
        locale={locale}
      />

      {/* Sponsored: Category Takeover */}
      {takeoverProduct && (
        <section className="rounded-xl border-2 border-amber-300 bg-amber-50 p-4 flex gap-4 items-center">
          <img
            src={takeoverProduct.image_url}
            alt={takeoverProduct.name}
            className="w-16 h-16 object-contain rounded-lg shrink-0 bg-white"
          />
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

      {/* Full comparison table */}
      <section>
        <h2 className="font-serif-display text-lg font-semibold text-neutral-700 mb-3">
          {locale === "th" ? "ตารางเปรียบเทียบทั้งหมด" : "Full comparison table"}
        </h2>
        <ComparisonTable rows={top} locale={locale} labels={labels} />
      </section>

      <JsonLd
        data={itemListLd(
          `https://bangkokfillers.com/${locale}/${concern}`,
          products,
          (p) =>
            `https://bangkokfillers.com/${locale}/product/${productSlug(p)}`
        )}
      />
      <JsonLd data={concernFaqLd(
        concern,
        locale,
        rows[0]?.name ?? "",
        Math.round(rows[0]?.score ?? 0)
      )} />
      <JsonLd data={breadcrumbLd([
        { name: "BangkokFillers", url: `https://bangkokfillers.com/${locale}` },
        { name: concernLabel(locale, concern), url: `https://bangkokfillers.com/${locale}/${concern}` },
      ])} />

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
      {(() => {
        const pageUrl = `${BASE}/${locale}/${concern}`;
        const label = concernLabel(locale, concern);
        const shareText =
          locale === "th"
            ? `อันดับสกินแคร์${label} ที่ดีที่สุดในไทย — bangkokfillers.com`
            : `Best Thai ${label} skincare ranked by ingredients & reviews`;
        const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(pageUrl)}`;
        const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + pageUrl)}`;
        return (
          <section className="rounded-2xl border border-[#efe1db] bg-white p-4 space-y-3">
            <p className="text-sm font-semibold text-[#2b2222]">
              {locale === "th" ? "แชร์อันดับนี้ให้เพื่อน" : "Share this ranking"}
            </p>
            <div className="flex gap-2 flex-wrap">
              {/* LINE button */}
              <a
                href={lineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 rounded-xl bg-[#06C755] px-3 py-2.5 text-sm font-semibold text-white transition-all active:scale-95"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.070 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
                </svg>
                <span>{locale === "th" ? "แชร์ LINE" : "Share LINE"}</span>
              </a>

              {/* WhatsApp button */}
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 rounded-xl bg-[#25D366] px-3 py-2.5 text-sm font-semibold text-white transition-all active:scale-95"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span>WhatsApp</span>
              </a>

              {/* Copy button (client island) */}
              <CopyButton text={pageUrl} locale={locale} />
            </div>
          </section>
        );
      })()}
    </article>
  );
}
