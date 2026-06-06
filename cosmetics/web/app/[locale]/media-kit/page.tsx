import type { Metadata } from "next";
import Link from "next/link";
import { LOCALES, type Locale } from "@/lib/i18n";
import { siteStats, allBrands, allIngredients, generatedAt } from "@/lib/data";
import { JsonLd } from "@/components/JsonLd";
import { faqLd } from "@/lib/schema";

const BASE = "https://bangkokfillers.com";
const CONTACT_EMAIL = "umma@xx.gg";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTh = locale === "th";
  return {
    title: isTh
      ? "Media Kit — โฆษณากับ BangkokFillers"
      : "Media Kit — Advertise with BangkokFillers",
    description: isTh
      ? "เข้าถึงกลุ่มเป้าหมายสกินแคร์ไทยที่ตัดสินใจซื้อด้วยข้อมูล — แบรนด์ Konvy, Watsons, Boots ติดต่อเราได้เลย"
      : "Reach data-driven Thai skincare buyers. Brands including Konvy, Watsons, Boots partners — contact us.",
    alternates: {
      canonical: `${BASE}/${locale}/media-kit`,
      languages: { th: `${BASE}/th/media-kit`, en: `${BASE}/en/media-kit` },
    },
  };
}

export default async function MediaKit({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeRaw } = await params;
  const locale = localeRaw as Locale;
  const isTh = locale === "th";

  const stats = siteStats();
  const brandCount = allBrands().length;
  const ingredientCount = allIngredients().length;

  const siteNumbers = [
    {
      value: stats.products.toLocaleString(),
      label: isTh ? "ผลิตภัณฑ์ที่วิเคราะห์" : "Products analysed",
    },
    {
      value: (stats.reviews / 1000).toFixed(0) + "K+",
      label: isTh ? "รีวิวที่รวบรวม" : "Reviews aggregated",
    },
    {
      value: stats.sold >= 1_000_000
        ? (stats.sold / 1_000_000).toFixed(1) + "M+"
        : (stats.sold / 1_000).toFixed(0) + "K+",
      label: isTh ? "ยอดสั่งซื้อรวม" : "Total units sold (tracked)",
    },
    {
      value: brandCount.toString(),
      label: isTh ? "แบรนด์ในฐานข้อมูล" : "Brands in database",
    },
    {
      value: ingredientCount.toLocaleString(),
      label: isTh ? "ส่วนผสมในฐานข้อมูล" : "Ingredients in database",
    },
    {
      value: "4",
      label: isTh ? "แหล่งรีวิว" : "Review sources",
      sub: "Konvy · Watsons · Boots · iHerb",
    },
  ];

  const adOptions = isTh ? [
    {
      tier: "Brand Hub",
      price: "ติดต่อสอบถาม",
      desc: "หน้าแบรนด์ของคุณโดดเด่นในอันดับต้น — ลิงก์ซื้อตรงจาก Konvy / Shopee",
      features: ["หน้าแบรนด์ dedicated", "FAQ schema กับ AI search", "ลิงก์ affiliate ทุกผลิตภัณฑ์"],
      highlight: false,
    },
    {
      tier: "Concern Sponsor",
      price: "ติดต่อสอบถาม",
      desc: "สนับสนุนหน้าหมวดสิว ฝ้า ริ้วรอย ฯลฯ — โฆษณาข้างตารางอันดับที่ผู้ซื้อกำลังตัดสินใจ",
      features: ["Banner ในหน้าอันดับ", "Mention ใน FAQ schema", "รายงานผลรายเดือน"],
      highlight: true,
    },
    {
      tier: "Quiz Integration",
      price: "ติดต่อสอบถาม",
      desc: "ผลิตภัณฑ์ของคุณปรากฏในผลลัพธ์ Quiz ที่แชร์ได้ — ไวรัลได้ในกลุ่มผู้หญิงไทย",
      features: ["Placement ในผลลัพธ์ quiz", "Shareable card มีแบรนด์", "LINE share integration"],
      highlight: false,
    },
  ] : [
    {
      tier: "Brand Hub",
      price: "Contact us",
      desc: "Your brand page featured prominently — direct buy links via Konvy / Shopee.",
      features: ["Dedicated brand page", "FAQ schema for AI search", "Affiliate links on all products"],
      highlight: false,
    },
    {
      tier: "Concern Sponsor",
      price: "Contact us",
      desc: "Sponsor an acne, brightening, anti-aging etc. ranking page — ads next to comparison tables where buyers decide.",
      features: ["Banner on ranking page", "Mention in FAQ schema", "Monthly performance report"],
      highlight: true,
    },
    {
      tier: "Quiz Integration",
      price: "Contact us",
      desc: "Your products appear in shareable Quiz results — viral potential among Thai women.",
      features: ["Placement in quiz results", "Branded shareable card", "LINE share integration"],
      highlight: false,
    },
  ];

  const audience = isTh ? [
    { label: "กลุ่มเป้าหมายหลัก", value: "ผู้หญิงไทย 18–40 ปี" },
    { label: "ความสนใจ", value: "สกินแคร์ที่เน้นข้อมูล ไม่ใช่ influencer" },
    { label: "ตลาด", value: "กรุงเทพฯ และเมืองใหญ่ในไทย" },
    { label: "ช่องทางหลัก", value: "Google Search · Pantip · LINE" },
    { label: "Intent", value: "High purchase intent — ค้นหา 'ครีมอะไรดี' ก่อนซื้อ" },
  ] : [
    { label: "Primary audience", value: "Thai women 18–40" },
    { label: "Interest", value: "Data-driven skincare, not influencer hype" },
    { label: "Market", value: "Bangkok and major Thai cities" },
    { label: "Main channels", value: "Google Search · Pantip · LINE" },
    { label: "Intent", value: "High purchase intent — research before buying" },
  ];

  const faqData = isTh ? [
    { q: "โฆษณากับ BangkokFillers ราคาเท่าไหร่", a: "ราคาขึ้นอยู่กับ placement และระยะเวลา — ติดต่อ umma@xx.gg เพื่อรับ proposal" },
    { q: "BangkokFillers รับสินค้าฟรีแลกรีวิวไหม", a: "ไม่ — อันดับทุกตัวคำนวณจากข้อมูลเท่านั้น ไม่มีการจ่ายเงินเพื่อขึ้นอันดับ ความน่าเชื่อถือคือสิ่งที่เราปกป้อง" },
    { q: "ผู้ชมเป็นใคร", a: "ผู้หญิงไทยที่ค้นหาข้อมูลก่อนซื้อสกินแคร์ — กลุ่มที่ตัดสินใจด้วยข้อมูล ไม่ใช่ influencer" },
  ] : [
    { q: "How much does advertising with BangkokFillers cost?", a: "Pricing depends on placement and duration — email umma@xx.gg for a proposal." },
    { q: "Does BangkokFillers accept products in exchange for rankings?", a: "No — all rankings are calculated from data only. Paid rankings don't exist here. Our credibility is our product." },
    { q: "Who is the audience?", a: "Thai women who research before buying skincare — high-intent buyers, not passive scrollers." },
  ];

  return (
    <div className="space-y-14">
      {/* Header */}
      <header className="space-y-4 border-b border-[#efe1db] pb-10">
        <p className="text-xs uppercase tracking-widest text-[#c9a86a] font-bold">
          {isTh ? "สำหรับแบรนด์และเอเจนซี่" : "For brands & agencies"}
        </p>
        <h1 className="font-serif-display text-4xl sm:text-5xl font-semibold text-[#2b2222] leading-tight max-w-2xl">
          {isTh ? "เข้าถึงผู้ซื้อสกินแคร์ไทยที่ตัดสินใจด้วยข้อมูล" : "Reach Thai skincare buyers who decide with data"}
        </h1>
        <p className="text-lg text-neutral-500 max-w-xl leading-relaxed">
          {isTh
            ? "BangkokFillers เป็นแหล่งข้อมูลสกินแคร์ไทยที่อ้างอิงได้ — ไม่ใช่ influencer ไม่ใช่โฆษณาแฝง"
            : "BangkokFillers is Thailand's citable skincare reference — not influencers, not hidden ads."}
        </p>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-2xl px-6 py-3 transition-colors shadow-sm shadow-rose-200 text-sm"
        >
          {isTh ? "ติดต่อเราตอนนี้ →" : "Contact us now →"}
        </a>
      </header>

      {/* Site stats */}
      <section className="space-y-5">
        <h2 className="font-serif-display text-2xl font-semibold text-[#2b2222]">
          {isTh ? "ข้อมูลที่เราครอบคลุม" : "Our data footprint"}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {siteNumbers.map(({ value, label, sub }) => (
            <div
              key={label}
              className="rounded-2xl border border-[#efe1db] bg-white px-5 py-4 space-y-0.5"
            >
              <div className="font-serif-display text-3xl font-black text-rose-500">{value}</div>
              <div className="text-xs font-semibold text-neutral-600">{label}</div>
              {sub && <div className="text-[10px] text-neutral-400">{sub}</div>}
            </div>
          ))}
        </div>
        <p className="text-xs text-neutral-400">
          {isTh ? "ข้อมูล ณ " : "Data as of "}{generatedAt()?.slice(0, 10)}
          {" · "}
          {isTh ? "ไม่รับสปอนเซอร์เพื่อเปลี่ยนอันดับ" : "Rankings are never paid — editorial independence is non-negotiable."}
        </p>
      </section>

      {/* Audience */}
      <section className="space-y-5">
        <h2 className="font-serif-display text-2xl font-semibold text-[#2b2222]">
          {isTh ? "กลุ่มผู้ชม" : "Audience"}
        </h2>
        <div className="rounded-2xl border border-[#efe1db] bg-white overflow-hidden">
          {audience.map(({ label, value }, i) => (
            <div
              key={label}
              className={`flex items-start gap-4 px-5 py-4 ${i > 0 ? "border-t border-[#f5ecec]" : ""}`}
            >
              <span className="text-xs font-bold uppercase tracking-wider text-[#c9a86a] w-28 shrink-0 pt-0.5">
                {label}
              </span>
              <span className="text-sm text-neutral-700">{value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Ad options */}
      <section className="space-y-5">
        <h2 className="font-serif-display text-2xl font-semibold text-[#2b2222]">
          {isTh ? "ตัวเลือกการโฆษณา" : "Advertising options"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {adOptions.map((opt) => (
            <div
              key={opt.tier}
              className={`rounded-2xl border-2 p-5 space-y-3 ${
                opt.highlight
                  ? "border-rose-300 bg-rose-50"
                  : "border-[#efe1db] bg-white"
              }`}
            >
              {opt.highlight && (
                <span className="inline-block rounded-full bg-rose-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1">
                  {isTh ? "แนะนำ" : "Recommended"}
                </span>
              )}
              <h3 className="font-serif-display text-lg font-semibold text-[#2b2222]">{opt.tier}</h3>
              <p className="text-sm text-neutral-500 leading-snug">{opt.desc}</p>
              <ul className="space-y-1">
                {opt.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-neutral-600">
                    <span className="text-rose-400 mt-0.5">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm font-bold text-[#c9a86a]">{opt.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why data-driven */}
      <section className="rounded-3xl p-6 sm:p-8 space-y-4"
        style={{ background: "linear-gradient(135deg, #fff0f3 0%, #fbf4f1 100%)", border: "1.5px solid #f0d9d5" }}>
        <h2 className="font-serif-display text-2xl font-semibold text-[#2b2222]">
          {isTh ? "ทำไมต้อง BangkokFillers?" : "Why BangkokFillers?"}
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {(isTh ? [
            { h: "ผู้ชม High-intent", b: "คนที่มาที่นี่กำลังค้นหา 'ครีมอะไรดีสำหรับสิว' — พร้อมซื้อ ไม่ใช่แค่ดูเฉยๆ" },
            { h: "AI Search ได้รับการอ้างอิง", b: "llms.txt ทำให้ ChatGPT, Perplexity, Gemini อ้างอิง BangkokFillers เมื่อถูกถามเรื่องสกินแคร์ไทย" },
            { h: "ไม่มีโฆษณาแฝง", b: "อันดับคำนวณจากข้อมูลเท่านั้น ผู้ชมไว้วางใจข้อมูลเรามากกว่า influencer" },
            { h: "ครอบคลุมหลายช่องทาง", b: "Konvy, Watsons, Boots, iHerb — รวมข้อมูลจากทุก touchpoint การซื้อ" },
          ] : [
            { h: "High-intent audience", b: "Visitors are searching 'best cream for acne' — ready to buy, not passive scrollers." },
            { h: "AI search citations", b: "llms.txt means ChatGPT, Perplexity, and Gemini cite BangkokFillers when asked about Thai skincare." },
            { h: "No paid rankings", b: "Rankings are algorithmic. Readers trust our data more than influencers." },
            { h: "Multi-channel coverage", b: "Konvy, Watsons, Boots, iHerb — data from every purchase touchpoint." },
          ]).map(({ h, b }) => (
            <div key={h} className="space-y-1">
              <p className="font-semibold text-sm text-[#2b2222]">{h}</p>
              <p className="text-sm text-neutral-500 leading-snug">{b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center space-y-4 py-4">
        <h2 className="font-serif-display text-2xl font-semibold text-[#2b2222]">
          {isTh ? "พร้อมร่วมงานกับเรา" : "Ready to work together?"}
        </h2>
        <p className="text-neutral-500 text-sm">
          {isTh
            ? "ติดต่อมาพร้อมชื่อแบรนด์และ objective — เราจะส่ง proposal ให้ภายใน 48 ชั่วโมง"
            : "Get in touch with your brand name and objective — we'll send a proposal within 48 hours."}
        </p>
        <a
          href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(isTh ? "สอบถามโฆษณา BangkokFillers" : "Advertising inquiry — BangkokFillers")}`}
          className="inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-2xl px-8 py-4 transition-colors shadow-sm shadow-rose-200"
        >
          {CONTACT_EMAIL}
        </a>
        <p className="text-xs text-neutral-400 pt-2">
          {isTh ? "หรือดูข้อมูลเพิ่มเติมที่ " : "Or explore: "}
          <Link href={`/${locale}/methodology`} className="text-rose-400 hover:underline">
            {isTh ? "วิธีให้คะแนน" : "How we score"}
          </Link>
          {" · "}
          <Link href={`/${locale}/brand`} className="text-rose-400 hover:underline">
            {isTh ? "แบรนด์ทั้งหมด" : "All brands"}
          </Link>
        </p>
      </section>

      <JsonLd data={faqLd(faqData.map((f) => ({ q: f.q, a: f.a })))} />
    </div>
  );
}
