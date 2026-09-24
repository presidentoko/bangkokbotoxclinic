import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LOCALES, STATIC_LOCALES, localeAlternates, localeOgImage, type Locale } from "@/lib/i18n";
import { productSlug } from "@/lib/data";
import {
  SALE_EVENTS,
  getSaleEvent,
  getSaleRanking,
  currentSaleEvent,
  saleEventDate,
  saleStats,
} from "@/lib/sale";
import { JsonLd } from "@/components/JsonLd";
import { FaqSection } from "@/components/FaqSection";
import { faqLd } from "@/lib/schema";

export const revalidate = 86400;
// 2026-07-13 긴급 픽스 — ISR Writes 한도 초과 대응. event는 고정 목록뿐이라
// 온디맨드 렌더 허용할 이유 없음.
export const dynamicParams = false;

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? "https://bangkokfillers.com";

export async function generateStaticParams() {
  return STATIC_LOCALES.flatMap((locale) =>
    SALE_EVENTS.map((e) => ({ locale, event: e.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; event: string }>;
}): Promise<Metadata> {
  const { locale, event } = await params;
  const loc = locale as Locale;
  const ev = getSaleEvent(event);
  if (!ev) return {};

  const title =
    loc === "th"
      ? `ดีลสกินแคร์ ${ev.labelTh} ที่คุ้มสุด 2026`
      : `Best Skincare ${ev.labelEn} Deals 2026`;
  const description =
    loc === "th"
      ? `รวมสกินแคร์ลดราคา ${ev.labelTh} จัดอันดับโดยข้อมูล — ส่วนลดสูงสุด × คะแนนจากรีวิวจริง`
      : `Top skincare ${ev.labelEn} discounts ranked by data — highest discount × real review scores`;

  // getSaleRanking() has no per-event data to key off of — every /sale/{event} page
  // renders the exact same "best deals right now" list. Rather than submit 6 byte-identical
  // pages, only the currently-active (or next-upcoming) event self-canonicals; the rest
  // point at it so Google consolidates ranking signal onto one URL instead of splitting it.
  const canonicalEvent = currentSaleEvent().slug;
  const pageUrl = `${BASE}/${locale}/sale/${event === canonicalEvent ? event : canonicalEvent}`;
  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
      languages: localeAlternates((l) => `${BASE}/${l}/sale/${event}`),
    },
    openGraph: {
      title,
      description,
      url: `${BASE}/${locale}/sale/${event}`,
      images: [localeOgImage(loc)],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [localeOgImage(loc).url],
    },
  };
}

const fmtDate = (d: Date, loc: Locale) =>
  d.toLocaleDateString(loc === "th" ? "th-TH" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

/**
 * Event-specific copy and FAQs.
 *
 * Every figure comes from saleStats() — counted from the catalogue — and each
 * block names the date the prices were collected. The dataset holds no price
 * history, so these pages never claim a product is cheaper *because* of the
 * event, and never predict the day's discounts.
 */
function saleFaqs(
  ev: (typeof SALE_EVENTS)[number],
  loc: Locale,
  stats: ReturnType<typeof saleStats>,
  when: Date
): { q: string; a: string }[] {
  const isTh = loc === "th";
  const label = isTh ? ev.labelTh : ev.labelEn;
  const date = fmtDate(when, loc);
  const seller = stats.retailer ?? (isTh ? "ร้านค้าออนไลน์" : "the retailers we track");
  const asOf = stats.asOf ?? "";
  const out: { q: string; a: string }[] = [
    isTh
      ? {
          q: `เซล ${ev.labelTh} ปีนี้ตรงกับวันไหน?`,
          a: `${date} — แคมเปญ ${ev.labelTh} ของร้านค้าไทยส่วนใหญ่เริ่มก่อนหน้านั้นไม่กี่วันและจบในวันนั้น ราคาบนหน้านี้เก็บจาก ${seller} เมื่อ ${asOf} จึงเป็นราคาก่อนแคมเปญ ไม่ใช่ราคาวันงาน`,
        }
      : {
          q: `When is the ${label} sale this year?`,
          a: `${date}. Most Thai retailers open the ${label} campaign a few days early and close it that night. The prices on this page were collected from ${seller} on ${asOf}, so they are pre-campaign prices, not the prices of the day.`,
        },
    isTh
      ? {
          q: "อันดับนี้คิดจากอะไร?",
          a: `ส่วนลด × คะแนนรวมจากส่วนผสมและรีวิวจริง สินค้าที่ลดเยอะแต่คะแนนต่ำจะไม่ขึ้นมาอยู่บนสุด ตอนนี้มีสินค้าที่ติดส่วนลด ${stats.discounted} จาก ${stats.total} รายการในฐานข้อมูล`,
        }
      : {
          q: "How is this ranking built?",
          a: `Discount multiplied by the product's overall score from its ingredients and real reviews, so a deep cut on a weak product does not reach the top. ${stats.discounted} of the ${stats.total} products in the database currently carry a discount.`,
        },
    isTh
      ? {
          q: `ส่วนลดช่วง ${ev.labelTh} ปกติลดกี่เปอร์เซ็นต์?`,
          a: `จากชุดข้อมูลนี้ ส่วนลดกลาง ๆ อยู่ที่ ${stats.medianPct}% สูงสุด ${stats.maxPct}% และมี ${stats.halfOffCount} รายการที่ลดตั้งแต่ครึ่งราคาขึ้นไป คิดเป็นเงินที่ประหยัดได้กลาง ๆ ประมาณ ฿${stats.medianSavingThb} ต่อชิ้น ตัวเลขนี้เป็นภาพรวมของวันที่เก็บข้อมูล ไม่ใช่การพยากรณ์ราคาวัน ${ev.labelTh}`,
        }
      : {
          q: `How deep do ${label} discounts usually go?`,
          a: `In this dataset the median discount is ${stats.medianPct}%, the deepest is ${stats.maxPct}%, and ${stats.halfOffCount} products are at half price or better — a median saving of about ฿${stats.medianSavingThb} per item. That describes the snapshot, and is not a forecast of ${label} pricing.`,
        },
    isTh
      ? {
          q: "ราคาตัดจากราคาเต็มจริงหรือเปล่า?",
          a: `เราเก็บทั้งราคาขายและราคาเต็มที่ร้านแสดงไว้ แล้วคำนวณส่วนลดจากสองค่านั้น เราไม่มีประวัติราคาย้อนหลัง จึงยืนยันไม่ได้ว่าราคาเต็มนั้นเคยขายจริงหรือไม่ — ถ้าต้องการความแน่ใจ ให้เทียบราคากับร้านอื่นก่อนกดซื้อ`,
        }
      : {
          q: "Are the crossed-out prices real?",
          a: `We record both the selling price and the list price the retailer displays, and compute the discount from those two. We hold no price history, so we cannot verify that the list price was ever charged — compare against another retailer before buying if that matters to you.`,
        },
  ];
  return out;
}

export default async function SalePage({
  params,
}: {
  params: Promise<{ locale: string; event: string }>;
}) {
  const { locale, event } = await params;
  const loc = locale as Locale;
  if (!LOCALES.includes(loc)) notFound();

  const ev = getSaleEvent(event);
  if (!ev) notFound();

  const products = getSaleRanking(60);
  const isTh = loc === "th";
  const stats = saleStats();
  const when = saleEventDate(ev);
  const faqs = saleFaqs(ev, loc, stats, when);

  const heading = isTh
    ? `ดีลสกินแคร์ ${ev.labelTh} คุ้มสุด`
    : `Best Skincare ${ev.labelEn} Deals`;
  const sub = isTh
    ? `จัดอันดับโดยส่วนลด × คะแนนจากรีวิวจริง`
    : `Ranked by discount × real review scores`;

  const pageUrl = `${BASE}/${loc}/sale/${event}`;

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": heading,
    "url": pageUrl,
    "numberOfItems": products.length,
    "itemListElement": products.map((p, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": p.name,
      "url": `${BASE}/${loc}/product/${productSlug(p)}`,
    })),
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-1">{heading}</h1>
      <p className="text-gray-500 mb-4">{sub}</p>

      <p className="mb-8 max-w-2xl text-sm leading-relaxed text-neutral-600">
        {isTh
          ? `${ev.labelTh} ปีนี้ตรงกับ${fmtDate(when, loc)} หน้านี้จัดอันดับสินค้าที่ติดส่วนลดอยู่ ${stats.discounted} รายการจากทั้งหมด ${stats.total} รายการ โดยเรียงตามส่วนลดคูณคะแนนจริง ไม่ใช่ตามงบโฆษณาของแบรนด์`
          : `${ev.labelEn} falls on ${fmtDate(when, loc)}. This page ranks the ${stats.discounted} discounted products out of ${stats.total} in the database by discount multiplied by their real score — not by what a brand paid to appear.`}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {products.map((p, i) => {
          const slug = productSlug(p);
          return (
            <a
              key={p.product_id}
              href={`/${loc}/product/${slug}`}
              className="group relative rounded-xl border bg-white p-3 flex flex-col hover:shadow-md transition-shadow"
            >
              <span className="absolute top-2 left-2 rounded-full bg-rose-600 text-white text-xs font-bold w-6 h-6 flex items-center justify-center">
                {i + 1}
              </span>
              <span className="absolute top-2 right-2 rounded-full bg-amber-400 text-white text-xs font-bold px-1.5 py-0.5">
                -{p.discount_pct}%
              </span>
              <img
                src={p.image_url}
                alt={p.name}
                className="w-full h-28 object-contain mb-2"
              />
              <p className="text-xs font-medium line-clamp-2 flex-1">{p.name}</p>
              <div className="mt-2 flex items-center gap-1">
                <span className="text-rose-600 font-bold text-sm">฿{p.price_thb}</span>
                {p.list_price_thb > p.price_thb && (
                  <span className="text-gray-400 text-xs line-through">฿{p.list_price_thb}</span>
                )}
              </div>
            </a>
          );
        })}
      </div>

      <div className="mt-12">
        <FaqSection faqs={faqs} locale={loc} />
      </div>

      {/* The old line here claimed the list was "updated every 5 minutes". It is
          not: this route renders from the build-time master_db.json import, so
          the prices are as old as the last scrape. Say the date instead. */}
      <p className="mt-8 max-w-2xl text-sm text-gray-500">
        {isTh
          ? `ราคาและส่วนลดเก็บจาก${stats.retailer ? ` ${stats.retailer}` : "ร้านค้า"} เมื่อ ${stats.asOf ?? "-"} และอาจเปลี่ยนแปลงแล้ว — กดเข้าไปดูราคาล่าสุดที่หน้าร้านก่อนสั่งซื้อเสมอ`
          : `Prices and discounts were collected from ${stats.retailer ?? "the retailers we track"} on ${stats.asOf ?? "-"} and may have changed since — always check the current price at the shop before ordering.`}
      </p>

      <JsonLd data={itemList} />
      <JsonLd data={faqLd(faqs)} />
    </main>
  );
}
