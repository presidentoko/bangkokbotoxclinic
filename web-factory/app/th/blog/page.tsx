import { POSTS_TH } from "@/lib/posts_th";
import { BreadcrumbJsonLd, ItemListJsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "บล็อก — ข้อมูลเชิงลึกสำหรับ SME ไทย",
  description:
    "บทความสั้นสำหรับ SME ไทยที่กำลังหาผู้ผลิต OEM/ODM เลือกนิคมอุตสาหกรรม ส่งออกครั้งแรก และสิทธิ์ BOI.",
  alternates: {
    canonical: "/th/blog",
    languages: {
      "th-TH": "/th/blog",
      "en-US": "/blog",
      "ko-KR": "/ko/blog",
      "x-default": "/blog",
    },
  },
  openGraph: { locale: "th_TH" },
};

export default function ThBlogIndex() {
  const sorted = [...POSTS_TH].sort((a, b) => b.published.localeCompare(a.published));
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/th" className="hover:text-[var(--fg)]">หน้าแรก</a>
        <span className="mx-2">›</span>
        <span>บล็อก</span>
      </nav>

      <header className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">บล็อก</h1>
        <p className="text-base md:text-lg text-[var(--muted)] leading-relaxed text-balance">
          บทความเชิงปฏิบัติสำหรับ SME ไทย — OEM/ODM, นิคมอุตสาหกรรม, การส่งออก, BOI. ข้อมูลจริง ไม่มีโฆษณา.
        </p>
      </header>

      <div className="grid sm:grid-cols-2 gap-4">
        {sorted.map((p) => (
          <a
            key={p.slug}
            href={`/th/blog/${p.slug}`}
            className="block p-6 bg-white border border-[var(--border)] rounded-xl hover:border-emerald-400 hover:shadow-md transition group"
          >
            <div className="text-xs font-bold uppercase tracking-widest text-emerald-700 mb-2">
              {p.category}
            </div>
            <h2 className="font-bold text-lg leading-snug mb-2 group-hover:text-emerald-700 transition">
              {p.title}
            </h2>
            <p className="text-sm text-[var(--muted)] leading-relaxed line-clamp-3">
              {p.metaDescription}
            </p>
            <div className="mt-3 text-xs text-[var(--muted)]">
              <time dateTime={p.published}>{p.published}</time>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-8 pt-8 border-t border-[var(--border)] flex items-center justify-between gap-4 flex-wrap">
        <p className="text-sm text-[var(--muted)]">ต้องการคู่มือเชิงลึกเพิ่มเติม?</p>
        <a href="/th/guide" className="text-sm font-bold text-emerald-700 hover:underline">ดูคู่มือผู้ซื้อทั้งหมด →</a>
      </div>

      <BreadcrumbJsonLd items={[
        { name: "หน้าแรก", url: "/th" },
        { name: "บล็อก", url: "/th/blog" },
      ]} />
      <ItemListJsonLd
        name="Thai Supply Hub — บล็อกภาษาไทย"
        items={sorted.map((p) => ({ name: p.title, url: `/th/blog/${p.slug}` }))}
      />
    </div>
  );
}
