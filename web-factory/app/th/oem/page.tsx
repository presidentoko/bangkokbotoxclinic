import { loadMasterDb } from "@/lib/data";
import { liveSmeOem } from "@/lib/smeOemTh";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "โรงงานรับผลิต OEM สำหรับแบรนด์ SME — ครีม อาหารเสริม เครื่องดื่ม ซอส บรรจุภัณฑ์",
  description:
    "รวมรายชื่อโรงงานรับผลิต OEM ในไทยสำหรับเจ้าของแบรนด์และร้านค้า SME — เครื่องสำอาง อาหารเสริม เครื่องดื่ม ซอส บรรจุภัณฑ์ สกรีนโลโก้ เสื้อผ้า พร้อมเบอร์ติดต่อโรงงานโดยตรง",
  alternates: { canonical: "/th/oem" },
  openGraph: { locale: "th_TH" },
};

export default async function ThOemHub() {
  const db = await loadMasterDb();
  const live = liveSmeOem(db.suppliers);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/th" className="hover:text-[var(--fg)]">หน้าแรก</a>
        <span className="mx-2">›</span>
        <span>รับผลิต OEM</span>
      </nav>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">โรงงานรับผลิต OEM สำหรับแบรนด์ของคุณ</h1>
      <p className="text-[var(--muted)] leading-relaxed max-w-2xl mb-8">
        อยากมีครีม อาหารเสริม ซอส หรือเครื่องดื่มแบรนด์ตัวเอง โดยไม่ต้องลงทุนโรงงาน? เลือกประเภทสินค้าด้านล่าง
        แล้วติดต่อโรงงานได้โดยตรง — จัดอันดับจากรีวิว Google และข้อมูลจดทะเบียน DBD ฟรีสำหรับผู้ซื้อ
      </p>
      <div className="grid sm:grid-cols-2 gap-3">
        {live.map(({ v, count }) => (
          <a key={v.slug} href={`/th/oem/${v.slug}`}
             className="block bg-white border border-[var(--border)] rounded-xl p-5 hover:border-emerald-400 hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-2xl" aria-hidden>{v.icon}</span>
              <span className="font-bold">{v.h1}</span>
            </div>
            <div className="text-sm text-[var(--muted)] tabular-nums">{count.toLocaleString()} โรงงาน →</div>
          </a>
        ))}
      </div>
      <BreadcrumbJsonLd items={[{ name: "หน้าแรก", url: "/th" }, { name: "รับผลิต OEM", url: "/th/oem" }]} />
    </div>
  );
}
