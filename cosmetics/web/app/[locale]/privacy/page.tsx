import type { Metadata } from "next";
import Link from "next/link";
import { STATIC_LOCALES, localeAlternates, localeOgImage, type Locale } from "@/lib/i18n";

const BASE = "https://bangkokfillers.com";

// Last substantive revision of this policy. Shown to readers so they can tell
// whether the terms changed since they last agreed to them — a date that moves
// on every deploy would tell them nothing.
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
  const title = isTh ? "นโยบายความเป็นส่วนตัว" : "Privacy Policy";
  const description = isTh
    ? "ข้อมูลที่ BangkokFillers เก็บ วิธีใช้ และสิทธิของคุณตาม PDPA — รวมถึงคุกกี้ อีเมลจากแบบทดสอบ และลิงก์พันธมิตร"
    : "What BangkokFillers collects, how it is used, and your rights under Thailand's PDPA — cookies, quiz emails, and affiliate links.";
  return {
    title,
    description,
    alternates: {
      canonical: `${BASE}/${loc}/privacy`,
      languages: localeAlternates((l) => `${BASE}/${l}/privacy`),
    },
    openGraph: { title, description, url: `${BASE}/${loc}/privacy`, images: [localeOgImage(loc)] },
  };
}

export default async function PrivacyPage({
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
          h: "เราเก็บข้อมูลอะไรบ้าง",
          body: [
            "อีเมล — เฉพาะเมื่อคุณกรอกในแบบทดสอบสภาพผิวหรือแบบฟอร์มติดต่อ เราเก็บอีเมลพร้อมคำตอบของแบบทดสอบ (สภาพผิว ปัญหาผิว งบประมาณ) เพื่อส่งคำแนะนำและดีลที่เกี่ยวข้อง",
            "ข้อความในแบบฟอร์มติดต่อ — ส่งต่อไปยังทีมงานเราผ่าน Telegram และไม่ได้เผยแพร่ที่ใด",
            "ข้อมูลการใช้งานแบบไม่ระบุตัวตน — จำนวนผู้เข้าชมหน้าเว็บ ผ่าน Vercel Analytics ซึ่งไม่ใช้คุกกี้และไม่เก็บ IP แบบระบุตัวบุคคล",
            "รายการที่คุณเพิ่งดูและรายการโปรด — เก็บไว้ในเบราว์เซอร์ของคุณเอง (localStorage) ไม่ได้ส่งมาที่เซิร์ฟเวอร์เรา",
          ],
        },
        {
          h: "เราไม่เก็บอะไร",
          body: [
            "เราไม่รับข้อมูลบัตรเครดิตหรือข้อมูลการชำระเงิน — การซื้อทั้งหมดเกิดขึ้นบนเว็บไซต์ของร้านค้า เช่น Konvy หรือ Watsons",
            "เราไม่ขายหรือให้เช่าข้อมูลส่วนบุคคลของคุณกับบุคคลที่สาม",
          ],
        },
        {
          h: "คุกกี้และเทคโนโลยีที่คล้ายกัน",
          body: [
            "เว็บไซต์นี้ใช้ localStorage สำหรับรายการที่ดูล่าสุดและรายการโปรด และคุกกี้เซสชันสำหรับหน้าผู้ดูแลระบบเท่านั้น",
            "เมื่อเราเริ่มแสดงโฆษณาจากเครือข่ายภายนอก ผู้ให้บริการเหล่านั้นอาจตั้งคุกกี้ของตนเองเพื่อวัดผลโฆษณา เราจะปรับปรุงหน้านี้ก่อนที่จะเริ่มแสดงโฆษณาดังกล่าว",
          ],
        },
        {
          h: "ลิงก์พันธมิตร (Affiliate)",
          body: [
            "ลิงก์ 'ดูราคาล่าสุด' เป็นลิงก์พันธมิตร หากคุณซื้อสินค้าผ่านลิงก์นั้น เราอาจได้รับค่าคอมมิชชันโดยที่ราคาของคุณไม่เพิ่มขึ้น",
            "ค่าคอมมิชชันไม่มีผลต่ออันดับ — คะแนนคำนวณจากส่วนผสมและรีวิวเท่านั้น",
          ],
        },
        {
          h: "สิทธิของคุณ (PDPA)",
          body: [
            "คุณมีสิทธิขอเข้าถึง แก้ไข หรือลบข้อมูลส่วนบุคคลของคุณที่เราเก็บไว้ และถอนความยินยอมได้ทุกเมื่อ",
            "ติดต่อผ่านแบบฟอร์มติดต่อ ระบุอีเมลที่คุณใช้ เราจะดำเนินการภายใน 30 วัน",
          ],
        },
        {
          h: "การเก็บรักษาข้อมูล",
          body: [
            "อีเมลจากแบบทดสอบจะถูกเก็บไว้จนกว่าคุณจะขอให้ลบ ข้อความจากแบบฟอร์มติดต่อจะถูกเก็บไว้ในประวัติแชทของทีมงาน",
          ],
        },
      ]
    : [
        {
          h: "What we collect",
          body: [
            "Your email — only if you enter it in the skin quiz or the contact form. We store it alongside your quiz answers (skin type, concern, budget) so the recommendations and deals we send are relevant.",
            "Contact form messages — forwarded to our team over Telegram and published nowhere.",
            "Anonymous usage data — page view counts via Vercel Analytics, which sets no cookies and stores no personally identifying IP address.",
            "Recently viewed products and favourites — kept in your own browser (localStorage) and never sent to our servers.",
          ],
        },
        {
          h: "What we never collect",
          body: [
            "No card or payment details — every purchase happens on the retailer's own site, such as Konvy or Watsons.",
            "We do not sell or rent your personal data to third parties.",
          ],
        },
        {
          h: "Cookies and similar technology",
          body: [
            "This site uses localStorage for recently viewed items and favourites, and a session cookie for the admin area only.",
            "If we begin serving ads from an external network, those providers may set their own measurement cookies. This page will be updated before that happens.",
          ],
        },
        {
          h: "Affiliate links",
          body: [
            "The 'check price' links are affiliate links. If you buy through one we may earn a commission, at no extra cost to you.",
            "Commission never affects ranking — scores are computed from ingredients and reviews alone.",
          ],
        },
        {
          h: "Your rights (Thailand PDPA)",
          body: [
            "You may request access to, correction of, or deletion of the personal data we hold about you, and withdraw consent at any time.",
            "Reach us through the contact form, quoting the email address you used. We respond within 30 days.",
          ],
        },
        {
          h: "Retention",
          body: [
            "Quiz emails are kept until you ask us to delete them. Contact form messages remain in our team's message history.",
          ],
        },
      ];

  return (
    <main className="max-w-2xl mx-auto px-4 py-10 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">
          {isTh ? "นโยบายความเป็นส่วนตัว" : "Privacy Policy"}
        </h1>
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

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">{isTh ? "ติดต่อเรา" : "Contact us"}</h2>
        <p className="text-sm leading-relaxed text-neutral-700">
          {isTh
            ? "คำถามเรื่องข้อมูลส่วนบุคคล ส่งผ่าน"
            : "Questions about your data go through the"}{" "}
          <Link href={`/${loc}/contact`} className="text-rose-600 underline">
            {isTh ? "แบบฟอร์มติดต่อ" : "contact form"}
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
