import { GUIDES_TH } from "@/lib/guides_th";
import { BreadcrumbJsonLd, ItemListJsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "คู่มือผู้ซื้อ — สรรหาผู้ผลิตและนิคมอุตสาหกรรมไทย",
  description:
    "คู่มือสำหรับ SME ไทยในการหาผู้ผลิต OEM/ODM, เลือกนิคมอุตสาหกรรม, ใช้สิทธิ BOI. มุมมองในประเทศ ไม่ใช่การแปลคู่มืออังกฤษ.",
  alternates: {
    canonical: "/th/guide",
    languages: {
      "th-TH": "/th/guide",
      "en-US": "/guide",
      "x-default": "/guide",
    },
  },
  openGraph: { locale: "th_TH" },
};

export default function GuideIndexTh() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/th" className="hover:text-[var(--fg)]">หน้าแรก</a>
        <span className="mx-2">›</span>
        <span>คู่มือ</span>
      </nav>

      <header className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">คู่มือผู้ซื้อ</h1>
        <p className="text-base md:text-lg text-[var(--muted)] leading-relaxed text-balance">
          คู่มือเชิงปฏิบัติสำหรับ SME ไทยที่กำลังหาผู้ผลิต OEM/ODM ในประเทศและพิจารณานิคมอุตสาหกรรม.
        </p>
      </header>

      <div className="grid sm:grid-cols-2 gap-4">
        {GUIDES_TH.map((g) => (
          <a
            key={g.slug}
            href={`/th/guide/${g.slug}`}
            className="block p-6 bg-white border border-[var(--border)] rounded-xl hover:border-emerald-400 hover:shadow-md transition group"
          >
            <h2 className="font-bold text-lg leading-snug mb-2 group-hover:text-emerald-700 transition">
              {g.title}
            </h2>
            <p className="text-sm text-[var(--muted)] leading-relaxed line-clamp-3">
              {g.metaDescription}
            </p>
            <div className="mt-3 text-xs text-[var(--muted)] flex items-center gap-2">
              <span>อัปเดต {g.updated}</span>
              <span>·</span>
              <span>{g.sections.length} ส่วน</span>
              <span>·</span>
              <span>{g.faqs.length} คำถาม</span>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-10 bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">รายการคัดสรร</div>
          <div className="font-bold text-amber-900">14 รายการซัพพลายเออร์จัดอันดับ</div>
          <p className="text-xs text-amber-800 mt-0.5">ตามสาขา, นิคม, สถานะส่งออก — จัดอันดับตามคะแนนความน่าเชื่อถือ.</p>
        </div>
        <a href="/best" className="shrink-0 px-4 py-2 bg-amber-600 text-white text-sm font-bold rounded-lg hover:bg-amber-700 transition">
          ดูรายการทั้งหมด →
        </a>
      </div>

      <BreadcrumbJsonLd items={[
        { name: "หน้าแรก", url: "/th" },
        { name: "คู่มือ", url: "/th/guide" },
      ]} />
      <ItemListJsonLd
        name="Thai Supply Hub — คู่มือผู้ซื้อ"
        items={GUIDES_TH.map((g) => ({ name: g.title, url: `/th/guide/${g.slug}` }))}
      />
    </div>
  );
}
