import Link from "next/link";
import { t, type Locale } from "@/lib/i18n";
import { generatedAt } from "@/lib/data";

const CONCERNS = ["acne", "whitening", "antiaging", "pores", "oilcontrol", "sensitive"] as const;
const CONCERN_LABELS: Record<string, { th: string; en: string }> = {
  acne:       { th: "สิว",         en: "Acne" },
  whitening:  { th: "ฝ้า/กระ",    en: "Whitening" },
  antiaging:  { th: "ริ้วรอย",    en: "Anti-aging" },
  pores:      { th: "รูขุมขน",   en: "Pores" },
  oilcontrol: { th: "ควบคุมมัน", en: "Oil control" },
  sensitive:  { th: "ผิวแพ้ง่าย", en: "Sensitive" },
};

export function Footer({ locale }: { locale: Locale }) {
  const date = generatedAt();
  const isTh = locale === "th";

  return (
    <footer className="border-t border-[#efe1db] mt-12">
      <div className="mx-auto max-w-5xl px-4 py-8 space-y-8">
        {/* Top: wordmark + quick links grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1 space-y-2">
            <p className="font-serif-display font-semibold text-[#2b2222]">BangkokFillers</p>
            <p className="text-xs text-[#8a7a76] leading-relaxed">{t(locale, "tagline")}</p>
          </div>

          {/* Concerns */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#c9a86a]">
              {isTh ? "หมวดหมู่" : "Categories"}
            </p>
            {CONCERNS.map((c) => (
              <Link
                key={c}
                href={`/${locale}/${c}`}
                className="block text-xs text-[#8a7a76] hover:text-rose-500 transition-colors"
              >
                {isTh ? CONCERN_LABELS[c].th : CONCERN_LABELS[c].en}
              </Link>
            ))}
          </div>

          {/* Discover */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#c9a86a]">
              {isTh ? "ค้นพบ" : "Discover"}
            </p>
            <Link href={`/${locale}/quiz`} className="block text-xs text-[#8a7a76] hover:text-rose-500 transition-colors">
              {isTh ? "ทดสอบสกินแคร์" : "Skincare quiz"}
            </Link>
            <Link href={`/${locale}/brand`} className="block text-xs text-[#8a7a76] hover:text-rose-500 transition-colors">
              {isTh ? "แบรนด์ทั้งหมด" : "All brands"}
            </Link>
            <Link href={`/${locale}/budget/under-500`} className="block text-xs text-[#8a7a76] hover:text-rose-500 transition-colors">
              {isTh ? "งบไม่เกิน 500" : "Under ฿500"}
            </Link>
            <Link href={`/${locale}/sale/7-7`} className="block text-xs text-[#8a7a76] hover:text-rose-500 transition-colors">
              {isTh ? "ดีลพิเศษ" : "Sale events"}
            </Link>
            <Link href={`/${locale}/search`} className="block text-xs text-[#8a7a76] hover:text-rose-500 transition-colors">
              {isTh ? "ค้นหาสินค้า" : "Search products"}
            </Link>
          </div>

          {/* About */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#c9a86a]">
              {isTh ? "เกี่ยวกับ" : "About"}
            </p>
            <Link href={`/${locale}/methodology`} className="block text-xs text-[#8a7a76] hover:text-rose-500 transition-colors">
              {t(locale, "methodology")}
            </Link>
            <Link href={`/${locale}/media-kit`} className="block text-xs text-[#8a7a76] hover:text-amber-600 transition-colors">
              {isTh ? "โฆษณากับเรา" : "Advertise with us"}
            </Link>
            <Link href={`/${locale}/contact`} className="block text-xs text-[#8a7a76] hover:text-rose-500 transition-colors">
              {isTh ? "ติดต่อเรา" : "Contact us"}
            </Link>
          </div>
        </div>

        {/* Advertising contact */}
        <div className="rounded-2xl border border-[#efe1db] bg-white px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="text-sm text-neutral-600">
            {isTh
              ? "สนใจลงโฆษณาหรือความร่วมมือทางธุรกิจ?"
              : "Interested in advertising or business partnerships?"}
          </p>
          <Link
            href={`/${locale}/contact`}
            className="text-sm font-semibold text-rose-500 hover:text-rose-600 transition-colors whitespace-nowrap"
          >
            {isTh ? "ติดต่อเราเลย →" : "Get in touch →"}
          </Link>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-xs text-[#8a7a76]">
          <p>{isTh ? "บางลิงก์เป็นลิงก์พันธมิตร" : "Some links are affiliate links"}</p>
          <p>{t(locale, "updated")}: {date}</p>
        </div>
      </div>
    </footer>
  );
}
