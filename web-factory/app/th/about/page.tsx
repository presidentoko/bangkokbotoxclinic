import { loadMasterDb } from "@/lib/data";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/JsonLd";
import { getSiteConfig } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "เกี่ยวกับ — วิธีคำนวณ Trust Score และแหล่งข้อมูล",
  description:
    "วิธีคำนวณคะแนนความน่าเชื่อถือ ที่มาของข้อมูล และเหตุใดไดเรกทอรีอิสระจึงสำคัญต่อการสรรหาซัพพลายเออร์ B2B ในประเทศไทย",
  alternates: {
    canonical: "/th/about",
    languages: {
      "th-TH": "/th/about",
      "ko-KR": "/ko/about",
      "en-US": "/about",
      "x-default": "/about",
    },
  },
  openGraph: { locale: "th_TH" },
};

const FAQS = [
  {
    q: "ข้อมูลมาจากไหน?",
    a: "Apify Google Maps actor 2 ตัว (crawler-google-places และ google-maps-extractor) เก็บข้อมูล Business Profile สาธารณะของไทย เรากรองหมวดหมู่ B2C (ร้านค้าปลีก ร้านอาหาร factory outlet mall) ออก และคงไว้เฉพาะหมวดหมู่ B2B ที่ชัดเจน — Manufacturer, ผู้ผลิตชิ้นส่วนยานยนต์, นิคมอุตสาหกรรม, คลังสินค้า, บริการโลจิสติกส์",
  },
  {
    q: "Trust Score คำนวณอย่างไร?",
    a: "สูตร: (คะแนน Google ÷ 5) × 50 + log10(จำนวนรีวิว) × 15 (สูงสุด 50) คะแนน 50% + ปริมาณ 50% เพื่อให้บริษัทที่ดำเนินกิจการมานานพร้อมรีวิวสาธารณะมากปรากฏก่อนผู้ประกอบการรายใหม่ที่มีรีวิว 3-5 รายการ",
  },
  {
    q: "ทำไมเน้นเขตอีสเทิร์นซีบอร์ด?",
    a: "ชุดข้อมูลแรก (957 รายการ → กรองเหลือ 650) เน้นเขตนี้และสะท้อนภูมิศาสตร์อุตสาหกรรมจริงของไทย — โรงงานยานยนต์ อิเล็กทรอนิกส์ และเคมีกว่า 80% อยู่ในชลบุรี/ระยอง/ฉะเชิงเทรา ข้อมูลกรุงเทพรอบนอก อยุธยา สระบุรี จะเพิ่มในการอัปเดตถัดไป",
  },
  {
    q: "มีโฆษณาที่ส่งผลต่อการจัดอันดับหรือไม่?",
    a: "ช่อง Editor's Pick / Recommended ติดป้ายชัดเจน อันดับปกติไม่ถูกแก้ไข สูตรคำนวณคะแนนเปิดเผยเพื่อให้ผู้ใช้ตรวจสอบได้",
  },
  {
    q: "เก็บค่าธรรมเนียมจากการทำสัญญาหรือไม่?",
    a: "ไม่ ผู้ซื้อติดต่อซัพพลายเออร์โดยตรงผ่านโทรศัพท์หรือเว็บไซต์ที่แสดง โมเดลรายได้คือ ช่องสปอนเซอร์ที่ติดป้าย และในอนาคตจะมีระดับสมาชิกซัพพลายเออร์ที่ผ่านการตรวจสอบ — ไม่มีค่าคอมมิชชั่นจากการทำดีล",
  },
];

export default async function ThAboutPage() {
  const cfg = getSiteConfig();
  const db = await loadMasterDb();
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/th" className="hover:text-[var(--fg)]">หน้าแรก</a>
        <span className="mx-2">›</span>
        <span>เกี่ยวกับ</span>
      </nav>

      <h1 className="text-4xl font-bold tracking-tight mb-3">เกี่ยวกับ {cfg.brand}</h1>
      <p className="text-base text-[var(--muted)] mb-8 leading-relaxed">
        ไดเรกทอรีอิสระสำหรับผู้ผลิต นิคมอุตสาหกรรม คลังสินค้า และโลจิสติกส์ในประเทศไทย จุดมุ่งหมาย: ใช้การวิเคราะห์ที่สอดคล้องกันบนข้อมูล Google สาธารณะ เพื่อให้ผู้ซื้อ B2B เปรียบเทียบซัพพลายเออร์ด้วยสัญญาณที่เป็นกลาง — ไม่ใช่จากเอเจนซี่ที่ขายแรงที่สุด
      </p>

      <div className="bg-white border border-[var(--border)] rounded-xl p-6 mb-10">
        <h2 className="text-lg font-bold mb-3">สถิติ</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold tabular-nums">{db.total_suppliers.toLocaleString()}</div>
            <div className="text-xs text-[var(--muted)] uppercase tracking-wide">ซัพพลายเออร์</div>
          </div>
          <div>
            <div className="text-2xl font-bold tabular-nums">{db.with_website.toLocaleString()}</div>
            <div className="text-xs text-[var(--muted)] uppercase tracking-wide">มีเว็บไซต์</div>
          </div>
          <div>
            <div className="text-2xl font-bold tabular-nums">{Object.keys(db.city_counts).length}</div>
            <div className="text-xs text-[var(--muted)] uppercase tracking-wide">จังหวัด</div>
          </div>
          <div>
            <div className="text-2xl font-bold tabular-nums">{Object.keys(db.category_counts).length}</div>
            <div className="text-xs text-[var(--muted)] uppercase tracking-wide">หมวดหมู่</div>
          </div>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold">คำถามที่พบบ่อย</h2>
        {FAQS.map((f, i) => (
          <details key={i} className="bg-white border border-[var(--border)] rounded-lg p-4 group">
            <summary className="font-medium cursor-pointer flex items-center justify-between gap-3">
              <span>{f.q}</span>
              <span className="text-[var(--muted)] group-open:rotate-180 transition">⌄</span>
            </summary>
            <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">{f.a}</p>
          </details>
        ))}
      </section>

      <FaqJsonLd faqs={FAQS} />
      <BreadcrumbJsonLd items={[
        { name: "หน้าแรก", url: "/th" },
        { name: "เกี่ยวกับ", url: "/th/about" },
      ]} />
    </div>
  );
}
