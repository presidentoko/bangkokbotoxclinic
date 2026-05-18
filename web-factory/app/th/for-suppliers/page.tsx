import { loadMasterDb } from "@/lib/data";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { getSiteConfig } from "@/lib/site";
import type { Metadata } from "next";

const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "umma@xx.gg";

export const metadata: Metadata = {
  title: "สำหรับซัพพลายเออร์ — ลงประกาศพิเศษและรับลีด",
  description:
    "การโปรโมตที่ติดป้าย ลีดผู้ซื้อต่างประเทศ และข้อมูลคู่แข่งรายสัปดาห์สำหรับผู้ผลิต นิคมอุตสาหกรรม และโลจิสติกส์ของไทย",
  alternates: {
    canonical: "/th/for-suppliers",
    languages: {
      "th-TH": "/th/for-suppliers",
      "ko-KR": "/ko/for-suppliers",
      "en-US": "/for-suppliers",
      "x-default": "/for-suppliers",
    },
  },
  openGraph: { locale: "th_TH" },
};

export default async function ThForSuppliersPage() {
  const cfg = getSiteConfig();
  const db = await loadMasterDb();
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/th" className="hover:text-[var(--fg)]">หน้าแรก</a>
        <span className="mx-2">›</span>
        <span>สำหรับซัพพลายเออร์</span>
      </nav>

      <header className="mb-12 text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4">
          สำหรับผู้ผลิตและผู้ประกอบการอุตสาหกรรมไทย
        </span>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 text-balance">
          ผู้ซื้อต่างประเทศที่กำลังสรรหาซัพพลายเออร์ในไทย,<br />
          <span style={{ color: cfg.themeAccent }}>ใช้ไดเรกทอรีนี้เป็นที่แรก.</span>
        </h1>
        <p className="text-base md:text-lg text-[var(--muted)] max-w-2xl mx-auto text-balance leading-relaxed">
          ซัพพลายเออร์ {db.total_suppliers.toLocaleString()} แห่ง ใน {Object.keys(db.city_counts).length} จังหวัด เปิดเผยเว็บไซต์ {db.with_website.toLocaleString()} ราย
        </p>
      </header>

      <section className="space-y-8 mb-16">
        <Offering tag="01 — Editor's Pick" title="อันดับ 1 ทุกหน้าหมวดหมู่และจังหวัด" price="฿15,000 / เดือน" body="ตำแหน่งบนสุดของลิสต์ทั้งหมดพร้อมป้ายทอง อันดับปกติยังอยู่ด้านล่าง ไม่ลบ ไม่ลดอันดับ" accent="#ca8a04" />
        <Offering tag="02 — ช่องผู้ซื้อต่างประเทศ" title="โปรโมตบน /ko (เกาหลี) และ /th" price="฿20,000 / เดือน" body="ทีมจัดซื้อจากเกาหลีและญี่ปุ่นใช้ไดเรกทอรีนี้ก่อนติดต่อ" accent="#dc2626" />
        <Offering tag="03 — Recommended" title="ตำแหน่งกลางหน้าพร้อมป้าย" price="฿8,000 / เดือน" body="กลางหน้าพร้อมป้ายฟ้า ราคาคุ้มสำหรับซัพพลายเออร์ที่ต้องการสร้างการมองเห็น" accent="#1e40af" />
        <Offering tag="04 — รับลีด (CPL)" title="คำถามจากผู้ซื้อที่ผ่านการคัดเลือก" price="฿2,500 / ลีด หรือ ฿30,000 / เดือน" body="คำถามที่ตรงกับโปรไฟล์ของคุณ พร้อมข้อมูลติดต่อ ปริมาณ และเป้าหมายผลิตภัณฑ์" accent="#16a34a" />
      </section>

      <section className="mb-16 bg-white border border-[var(--border)] rounded-xl p-6 text-center">
        <h2 className="text-2xl font-bold mb-2">เริ่มต้น</h2>
        <p className="text-[var(--muted)] mb-4">ส่งอีเมลพร้อมชื่อบริษัทและระดับที่ต้องการ — ตอบกลับภายใน 1 วันทำการ</p>
        <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("คำถามเกี่ยวกับการลงประกาศ — ซัพพลายเออร์")}`} className="inline-block bg-black text-white py-3 px-6 rounded-lg font-bold hover:bg-gray-800">
          ✉ {CONTACT_EMAIL}
        </a>
      </section>

      <BreadcrumbJsonLd items={[
        { name: "หน้าแรก", url: "/th" },
        { name: "สำหรับซัพพลายเออร์", url: "/th/for-suppliers" },
      ]} />
    </div>
  );
}

function Offering({ tag, title, price, body, accent }: { tag: string; title: string; price: string; body: string; accent: string }) {
  return (
    <div className="bg-white border border-[var(--border)] rounded-xl p-6">
      <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: accent }}>{tag}</div>
          <h3 className="text-2xl font-bold">{title}</h3>
        </div>
        <div className="text-sm font-medium px-3 py-1.5 rounded-full" style={{ background: `${accent}15`, color: accent }}>{price}</div>
      </div>
      <p className="text-sm text-[var(--muted)] leading-relaxed">{body}</p>
    </div>
  );
}
