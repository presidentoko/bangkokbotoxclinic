import Link from "next/link";
import { CONCERNS, bestSellersAllConcerns } from "@/lib/data";
import { concernLabelShort } from "@/lib/i18n";
import { ProductStrip } from "@/components/ProductStrip";

// Next's not-found.tsx boundary doesn't receive the parent segment's params,
// so the locale genuinely can't be known here — show both languages instead
// of guessing. Internal links default to /th (the primary market).
export default async function NotFound() {
  const trending = bestSellersAllConcerns(6);

  return (
    <div className="space-y-10 py-8 text-center">
      <div className="space-y-3">
        <p className="text-6xl">🌸</p>
        <h1 className="font-serif-display text-2xl sm:text-3xl font-semibold text-[#2b2222]">
          ไม่พบหน้านี้ · Page not found
        </h1>
        <p className="text-sm text-neutral-500 max-w-md mx-auto">
          ลิงก์นี้อาจถูกลบหรือย้ายไปแล้ว ลองค้นหาสิ่งที่คุณต้องการด้านล่าง
          <br />
          This link may have moved or been removed. Try searching below.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            href="/th/search"
            className="rounded-full bg-rose-500 hover:bg-rose-600 text-white px-5 py-2.5 min-h-[44px] flex items-center text-sm font-semibold transition-colors"
          >
            ค้นหาสินค้า · Search
          </Link>
          <Link
            href="/th"
            className="rounded-full border border-[#efe1db] bg-white px-5 py-2.5 min-h-[44px] flex items-center text-sm font-semibold text-[#2b2222] hover:border-rose-300 transition-colors"
          >
            หน้าแรก · Home
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {CONCERNS.map((c) => (
          <Link
            key={c}
            href={`/th/${c}`}
            className="rounded-full border border-[#efe1db] bg-white px-3.5 py-2 min-h-[44px] flex items-center text-sm text-[#8a7a76] hover:text-rose-500 hover:border-rose-300 transition-colors"
          >
            {concernLabelShort("th", c)}
          </Link>
        ))}
      </div>

      <div className="text-left">
        <ProductStrip
          title="สินค้าขายดี · Trending now"
          products={trending}
          locale="th"
          proof="sold"
        />
      </div>
    </div>
  );
}
