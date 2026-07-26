import type { Metadata } from "next";
import { LOCALES, STATIC_LOCALES, type Locale } from "@/lib/i18n";
import { generatedAt } from "@/lib/data";

const BASE = "https://bangkokfillers.com";

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
  const title =
    loc === "th"
      ? "วิธีให้คะแนน — เกณฑ์คัดเลือกผลิตภัณฑ์"
      : "How We Score — Our Ranking Methodology";
  const description =
    loc === "th"
      ? "คะแนนรวม = ส่วนผสม 45% + รีวิว 45% + ความคุ้มค่า 10% อธิบายเกณฑ์การจัดอันดับผลิตภัณฑ์สกินแคร์"
      : "Total score = 45% ingredient science + 45% aggregated reviews + 10% value. How BangkokFillers ranks skincare.";
  return {
    title,
    description,
    alternates: {
      canonical: `${BASE}/${loc}/methodology`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `${BASE}/${l}/methodology`])),
    },
  };
}

export default async function Methodology({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeRaw } = await params;
  const locale = localeRaw as Locale;
  const th = locale === "th";

  const weights = [
    {
      pct: 45,
      label: th ? "ส่วนผสม" : "Ingredients",
      desc: th
        ? "ให้น้ำหนักตามหลักฐานของสารออกฤทธิ์ต่อปัญหานั้น หักคะแนนสารที่ควรระวัง"
        : "Evidence-weighted actives for the concern, minus caution-flag penalties.",
      color: "bg-rose-400",
    },
    {
      pct: 45,
      label: th ? "รีวิว" : "Reviews",
      desc: th
        ? "ค่าเฉลี่ยแบบเบย์ (ปรับตามจำนวนรีวิว)"
        : "Bayesian average adjusted by review count.",
      color: "bg-rose-300",
    },
    {
      pct: 10,
      label: th ? "ความคุ้มค่า" : "Value",
      desc: th
        ? "ราคาต่อมล. เทียบค่ามัธยฐาน"
        : "Price-per-ml vs the median.",
      color: "bg-amber-300",
    },
  ];

  return (
    <article className="prose max-w-2xl space-y-8">
      {/* ── Header ── */}
      <header className="border-b border-neutral-100 pb-6">
        <h1 className="font-serif-display text-3xl font-semibold text-neutral-900">
          {th ? "วิธีให้คะแนน" : "How We Score"}
        </h1>
        <p className="mt-2 text-base text-neutral-600 leading-relaxed">
          {th
            ? "คะแนนรวมคำนวณจาก 3 ปัจจัยหลัก เพื่อให้ได้ผลิตภัณฑ์ที่ดีที่สุดสำหรับปัญหาผิวของคุณ"
            : "The total score is calculated from three independent factors to find the best product for your skin concern."}
        </p>
      </header>

      {/* ── Formula: 3 labeled rows ── */}
      <section className="not-prose space-y-3">
        <h2 className="font-serif-display text-xl font-semibold text-neutral-800 mb-4">
          {th ? "สูตรคะแนนรวม" : "Score Formula"}
        </h2>
        {weights.map((w) => (
          <div
            key={w.label}
            className="flex items-start gap-4 rounded-2xl border border-[#efe1db] bg-white px-5 py-4 shadow-sm shadow-rose-100"
          >
            {/* Weight badge */}
            <div className="shrink-0 flex flex-col items-center justify-center w-14 h-14 rounded-full border-2 border-[#efe1db] bg-rose-50">
              <span className="text-xl font-bold text-rose-500 leading-none">{w.pct}</span>
              <span className="text-[10px] text-[#c9a86a] font-medium">%</span>
            </div>
            {/* Label + bar + desc */}
            <div className="flex-1 space-y-1.5">
              <p className="font-semibold text-neutral-800">{w.label}</p>
              <div className="h-1.5 w-full rounded-full bg-neutral-100 overflow-hidden">
                <div className={`h-full rounded-full ${w.color}`} style={{ width: `${w.pct}%` }} />
              </div>
              <p className="text-sm text-neutral-500">{w.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ── Formula equation ── */}
      <section className="not-prose space-y-3">
        <h2 className="font-serif-display text-xl font-semibold text-neutral-800 mb-2">
          {th ? "สมการคำนวณ" : "The Formula"}
        </h2>
        <div className="rounded-2xl border border-[#efe1db] bg-white px-5 py-4 shadow-sm shadow-rose-100 space-y-3">
          <p className="font-mono text-sm text-neutral-700 leading-relaxed">
            {th
              ? "คะแนนรวม = (ส่วนผสม × 0.45) + (รีวิว × 0.45) + (ความคุ้มค่า × 0.10)"
              : "total = (ingredient × 0.45) + (review × 0.45) + (value × 0.10)"}
          </p>
          <div className="border-t border-[#efe1db] pt-3">
            <p className="text-xs text-neutral-500 mb-1">
              {th ? "ตัวอย่าง:" : "Example:"}
            </p>
            <p className="font-mono text-sm text-neutral-600 leading-relaxed">
              (25 × 0.45) + (98 × 0.45) + (95 × 0.10) = 11.25 + 44.10 + 9.50 = 64.85 → 65
            </p>
            <p className="text-xs text-neutral-400 mt-1">
              {th ? "ปัดเป็นจำนวนเต็ม" : "Rounded to the nearest integer"}
            </p>
          </div>
        </div>
      </section>

      {/* ── Freshness note ── */}
      <p className="not-prose text-xs text-neutral-400">
        {th ? "อัปเดต" : "Updated"}: {generatedAt()?.slice(0, 10)}.{" "}
        {th ? "ข้อมูลรีวิวจาก Konvy, Watsons, Boots และ iHerb" : "Review data from Konvy, Watsons, Boots and iHerb."}
      </p>
    </article>
  );
}
