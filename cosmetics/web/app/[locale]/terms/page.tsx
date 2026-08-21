import type { Metadata } from "next";
import Link from "next/link";
import { STATIC_LOCALES, localeAlternates, localeOgImage, type Locale } from "@/lib/i18n";

const BASE = "https://bangkokfillers.com";
const EFFECTIVE = "2026-08-21";

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
  const title = isTh ? "ข้อกำหนดการใช้งาน" : "Terms of Use";
  const description = isTh
    ? "เงื่อนไขการใช้เว็บไซต์ BangkokFillers — ข้อมูลผลิตภัณฑ์ ลิงก์พันธมิตร และข้อจำกัดความรับผิด"
    : "Terms for using BangkokFillers — product data, affiliate links, and limits of liability.";
  return {
    title,
    description,
    alternates: {
      canonical: `${BASE}/${loc}/terms`,
      languages: localeAlternates((l) => `${BASE}/${l}/terms`),
    },
    openGraph: { title, description, url: `${BASE}/${loc}/terms`, images: [localeOgImage(loc)] },
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale as Locale;
  const isTh = loc === "th";

  const sections = isTh
    ? [
        {
          h: "ข้อมูลบนเว็บไซต์นี้",
          body: [
            "เรารวบรวมข้อมูลผลิตภัณฑ์ ราคา และรีวิวจากร้านค้าออนไลน์ในไทย ข้อมูลอาจล้าสมัยได้ — ราคาและสต็อกที่ถูกต้องคือราคาบนหน้าร้านค้าในขณะที่คุณกดซื้อ",
            "อันดับและคะแนนเป็นการวิเคราะห์ข้อมูล ไม่ใช่คำแนะนำทางการแพทย์",
          ],
        },
        {
          h: "ไม่ใช่คำแนะนำทางการแพทย์",
          body: [
            "เนื้อหาเกี่ยวกับส่วนผสมและปัญหาผิวมีไว้เพื่อให้ข้อมูลเท่านั้น หากคุณมีปัญหาผิวที่รุนแรงหรือต่อเนื่อง โปรดปรึกษาแพทย์ผิวหนัง",
            "ทดสอบผลิตภัณฑ์ใหม่กับผิวบริเวณเล็กก่อนใช้เต็มหน้าเสมอ",
          ],
        },
        {
          h: "ลิงก์พันธมิตรและเนื้อหาที่ได้รับการสนับสนุน",
          body: [
            "ลิงก์ไปยังร้านค้าเป็นลิงก์พันธมิตร เราอาจได้รับค่าคอมมิชชันจากการซื้อของคุณ",
            "เนื้อหาที่ได้รับการสนับสนุนจะมีป้าย 'ได้รับการสนับสนุน' กำกับเสมอ",
            "เราไม่ขายอันดับ ตำแหน่งในตารางคะแนนคำนวณจากข้อมูลเท่านั้น",
          ],
        },
        {
          h: "การใช้งานที่ยอมรับได้",
          body: [
            "คุณใช้เว็บไซต์นี้เพื่อการค้นหาข้อมูลส่วนบุคคลได้ฟรี",
            "ห้ามดึงข้อมูลจำนวนมากด้วยเครื่องมืออัตโนมัติ หรือนำฐานข้อมูลของเราไปใช้ซ้ำในเชิงพาณิชย์โดยไม่ได้รับอนุญาต",
          ],
        },
        {
          h: "ข้อจำกัดความรับผิด",
          body: [
            "เว็บไซต์นี้ให้บริการ 'ตามสภาพที่เป็นอยู่' เราไม่รับผิดชอบต่อความเสียหายที่เกิดจากการใช้ข้อมูลบนเว็บไซต์นี้",
            "ธุรกรรมการซื้อขายเกิดขึ้นระหว่างคุณกับร้านค้าโดยตรง เราไม่ใช่คู่สัญญา",
          ],
        },
      ]
    : [
        {
          h: "The data on this site",
          body: [
            "We aggregate product data, prices, and reviews from Thai online retailers. Data can go stale — the price and stock that count are the ones on the retailer's page at the moment you buy.",
            "Rankings and scores are a data analysis, not medical advice.",
          ],
        },
        {
          h: "Not medical advice",
          body: [
            "Ingredient and skin-concern content is informational only. For severe or persistent skin problems, see a dermatologist.",
            "Always patch-test a new product on a small area before using it on your face.",
          ],
        },
        {
          h: "Affiliate links and sponsored content",
          body: [
            "Links to retailers are affiliate links, and we may earn a commission on your purchase.",
            "Sponsored content always carries a visible 'Sponsored' label.",
            "We do not sell rankings. Position in a scoring table is computed from data alone.",
          ],
        },
        {
          h: "Acceptable use",
          body: [
            "You may use this site freely for your own research.",
            "Bulk automated extraction, or commercial reuse of our database without permission, is not permitted.",
          ],
        },
        {
          h: "Limits of liability",
          body: [
            "The site is provided as is. We are not liable for losses arising from use of the information here.",
            "Purchases are transactions between you and the retailer; we are not a party to them.",
          ],
        },
      ];

  return (
    <main className="max-w-2xl mx-auto px-4 py-10 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">{isTh ? "ข้อกำหนดการใช้งาน" : "Terms of Use"}</h1>
        <p className="text-sm text-neutral-500">
          {isTh ? "มีผลตั้งแต่" : "Effective"} {EFFECTIVE} · BangkokFillers
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

      <p className="text-sm text-neutral-700">
        {isTh ? "ดูเพิ่มเติม" : "See also"}:{" "}
        <Link href={`/${loc}/privacy`} className="text-rose-600 underline">
          {isTh ? "นโยบายความเป็นส่วนตัว" : "Privacy Policy"}
        </Link>
        {" · "}
        <Link href={`/${loc}/methodology`} className="text-rose-600 underline">
          {isTh ? "วิธีให้คะแนน" : "How we score"}
        </Link>
      </p>
    </main>
  );
}
