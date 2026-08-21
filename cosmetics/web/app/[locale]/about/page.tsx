import type { Metadata } from "next";
import Link from "next/link";
import { STATIC_LOCALES, localeAlternates, localeOgImage, type Locale } from "@/lib/i18n";
import { siteStats, allBrands, generatedAt } from "@/lib/data";
import { JsonLd } from "@/components/JsonLd";

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
  const loc = locale as Locale;
  const isTh = loc === "th";
  const title = isTh ? "เกี่ยวกับเรา" : "About BangkokFillers";
  const description = isTh
    ? "ใครอยู่เบื้องหลัง BangkokFillers ข้อมูลมาจากไหน และเราหารายได้อย่างไร"
    : "Who runs BangkokFillers, where the data comes from, and how the site makes money.";
  return {
    title,
    description,
    alternates: {
      canonical: `${BASE}/${loc}/about`,
      languages: localeAlternates((l) => `${BASE}/${l}/about`),
    },
    openGraph: { title, description, url: `${BASE}/${loc}/about`, images: [localeOgImage(loc)] },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale as Locale;
  const isTh = loc === "th";

  const stats = siteStats();
  const brandCount = allBrands().length;
  const updated = generatedAt();

  const sections = isTh
    ? [
        {
          h: "เราทำอะไร",
          body: [
            `BangkokFillers จัดอันดับสกินแคร์ที่ซื้อได้จริงในไทย จากข้อมูล ไม่ใช่จากอินฟลูเอนเซอร์ ปัจจุบันฐานข้อมูลมี ${stats.products.toLocaleString()} ผลิตภัณฑ์จาก ${brandCount} แบรนด์`,
            "ทุกคะแนนคำนวณด้วยสูตรเดียวกันสำหรับทุกผลิตภัณฑ์ ไม่มีการปรับด้วยมือ ไม่มีการรับเงินเพื่อขึ้นอันดับ",
          ],
        },
        {
          h: "ข้อมูลมาจากไหน",
          body: [
            "ราคาและรีวิวรวบรวมจากร้านค้าออนไลน์ในไทย ได้แก่ Konvy, Watsons, Boots และ iHerb รวมถึงความเห็นจากกระทู้ Pantip",
            "ตารางส่วนผสม (INCI) มาจากหน้าผลิตภัณฑ์ของร้านค้า และจับคู่ข้ามร้านด้วยบาร์โค้ดเมื่อมี",
            `ข้อมูลอัปเดตล่าสุด ${updated}`,
          ],
        },
        {
          h: "เราหารายได้อย่างไร",
          body: [
            "ค่าคอมมิชชันจากลิงก์พันธมิตร เมื่อคุณซื้อผ่านลิงก์ไปยังร้านค้า โดยราคาของคุณไม่เพิ่มขึ้น",
            "พื้นที่โฆษณาและเนื้อหาที่ได้รับการสนับสนุน ซึ่งมีป้ายกำกับชัดเจนเสมอ",
            "เราไม่ขายอันดับ — นี่คือเส้นที่เราไม่ข้าม เพราะความน่าเชื่อถือคือสินทรัพย์เดียวของเว็บไซต์นี้",
          ],
        },
        {
          h: "ข้อผิดพลาดและการแก้ไข",
          body: [
            "ข้อมูลสเกลนี้ย่อมมีผิดพลาดได้ ถ้าคุณเจอราคาผิด ส่วนผสมผิด หรือผลิตภัณฑ์ที่เลิกขายแล้ว บอกเราได้ทางแบบฟอร์มติดต่อ เราแก้ไขและรีบิลด์ข้อมูล",
          ],
        },
      ]
    : [
        {
          h: "What we do",
          body: [
            `BangkokFillers ranks skincare you can actually buy in Thailand, from data rather than influencer opinion. The database currently holds ${stats.products.toLocaleString()} products across ${brandCount} brands.`,
            "Every score comes from the same formula applied to every product. No manual adjustment, and no paying to move up.",
          ],
        },
        {
          h: "Where the data comes from",
          body: [
            "Prices and reviews are aggregated from Thai online retailers — Konvy, Watsons, Boots and iHerb — plus discussion from Pantip threads.",
            "Ingredient (INCI) lists come from retailer product pages, joined across retailers by barcode where one exists.",
            `Data last rebuilt ${updated}.`,
          ],
        },
        {
          h: "How the site makes money",
          body: [
            "Affiliate commission when you buy through a link to a retailer, at no extra cost to you.",
            "Ad placements and sponsored content, always carrying a visible label.",
            "We do not sell rankings. That is the line we hold, because credibility is this site's only asset.",
          ],
        },
        {
          h: "Errors and corrections",
          body: [
            "Data at this scale contains mistakes. If you find a wrong price, a wrong ingredient list, or a discontinued product, tell us through the contact form and we will correct it and rebuild.",
          ],
        },
      ];

  return (
    <main className="max-w-2xl mx-auto px-4 py-10 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">
          {isTh ? "เกี่ยวกับ BangkokFillers" : "About BangkokFillers"}
        </h1>
        <p className="text-sm text-neutral-500">
          {isTh ? "เชื่อข้อมูล ไม่ใช่อินฟลูเอนเซอร์" : "Trust data, not influencers"}
        </p>
      </header>

      {sections.map((s) => (
        <section key={s.h} className="space-y-2">
          <h2 className="text-lg font-semibold">{s.h}</h2>
          {s.body.map((para, i) => (
            <p key={i} className="text-sm leading-relaxed text-neutral-700">
              {para}
            </p>
          ))}
        </section>
      ))}

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">{isTh ? "ลิงก์ที่เกี่ยวข้อง" : "Related"}</h2>
        <p className="text-sm leading-relaxed text-neutral-700">
          <Link href={`/${loc}/methodology`} className="text-rose-600 underline">
            {isTh ? "วิธีให้คะแนน" : "How we score"}
          </Link>
          {" · "}
          <Link href={`/${loc}/media-kit`} className="text-rose-600 underline">
            {isTh ? "ลงโฆษณากับเรา" : "Advertise with us"}
          </Link>
          {" · "}
          <Link href={`/${loc}/privacy`} className="text-rose-600 underline">
            {isTh ? "นโยบายความเป็นส่วนตัว" : "Privacy"}
          </Link>
          {" · "}
          <Link href={`/${loc}/contact`} className="text-rose-600 underline">
            {isTh ? "ติดต่อ" : "Contact"}
          </Link>
        </p>
      </section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "BangkokFillers",
          url: BASE,
          description: isTh
            ? "จัดอันดับสกินแคร์ในไทยจากส่วนผสมและรีวิวจริง"
            : "Data-driven skincare rankings for Thailand",
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer support",
            url: `${BASE}/${loc}/contact`,
          },
        }}
      />
    </main>
  );
}
