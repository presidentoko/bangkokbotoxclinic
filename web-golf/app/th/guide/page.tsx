import { GUIDES_TH } from "@/lib/guides_th";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "คู่มือกอล์ฟไทย — จองสนาม กรีนฟี ทิปแคดดี้",
  description:
    "คู่มือใช้งานจริงสำหรับการเล่นกอล์ฟในไทย: การจอง ค่ากรีนฟี ทิปแคดดี้ การเปรียบเทียบภูมิภาค.",
  alternates: { canonical: "/th/guide", languages: { "en-US": "/guide", "ko-KR": "/ko/guide", "th-TH": "/th/guide" } },
};

export const dynamic = "force-static";

export default function ThGuideIndexPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/th" className="hover:text-[var(--fg)]">หน้าแรก</a>
        <span className="mx-2">›</span>
        <span>คู่มือ</span>
      </nav>

      <h1 className="text-4xl font-bold tracking-tight mb-3">คู่มือกอล์ฟไทย</h1>
      <p className="text-base text-[var(--muted)] leading-relaxed mb-10 max-w-2xl">
        คู่มือใช้งานจริงเขียนโดยบรรณาธิการที่เล่นกอล์ฟในไทยเอง ไม่มีโฆษณา ไม่มีการพูดแทนตัวแทน — มีแค่สิ่งที่คุณต้องรู้ก่อนจอง.
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        {GUIDES_TH.map((g) => (
          <a
            key={g.slug}
            href={`/th/guide/${g.slug}`}
            className="group block p-6 border border-[var(--border)] rounded-2xl bg-white hover:border-[var(--accent)] hover:shadow-md transition"
          >
            <h2 className="text-lg font-bold leading-tight group-hover:text-[var(--accent)] transition">
              {g.title.replace(/ \(\d{4}\)$/, "")}
            </h2>
            <p className="text-sm text-[var(--muted)] mt-2 leading-relaxed">{g.metaDescription}</p>
            <div className="mt-3 text-xs text-[var(--muted)]">อัปเดต {g.updated}</div>
          </a>
        ))}
      </div>

      <BreadcrumbJsonLd items={[
        { name: "หน้าแรก", url: "/th" },
        { name: "คู่มือ", url: "/th/guide" },
      ]} />
    </div>
  );
}
