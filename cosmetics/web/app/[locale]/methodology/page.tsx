import type { Metadata } from "next";
import { LOCALES, type Locale } from "@/lib/i18n";
import { generatedAt } from "@/lib/data";

const BASE = "https://bangkokfillers.com";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
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
      languages: {
        th: `${BASE}/th/methodology`,
        en: `${BASE}/en/methodology`,
      },
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

  return (
    <article className="space-y-3 prose">
      <h1 className="text-2xl font-bold">
        {th ? "วิธีให้คะแนน" : "How we score"}
      </h1>
      <p>
        {th
          ? "คะแนนรวม = ส่วนผสม 45% + รีวิว 45% + ความคุ้มค่า 10%"
          : "Total = 45% ingredient science + 45% aggregated reviews + 10% value."}
      </p>
      <ul className="list-disc pl-5 text-sm">
        <li>
          {th
            ? "คะแนนส่วนผสม: ให้น้ำหนักตามหลักฐานของสารออกฤทธิ์ต่อปัญหานั้น หักคะแนนสารที่ควรระวัง"
            : "Ingredient: evidence-weighted actives for the concern, minus caution-flag penalties."}
        </li>
        <li>
          {th
            ? "คะแนนรีวิว: ค่าเฉลี่ยแบบเบย์ (ปรับตามจำนวนรีวิว)"
            : "Review: Bayesian average adjusted by review count."}
        </li>
        <li>
          {th
            ? "ความคุ้มค่า: ราคาต่อมล. เทียบค่ามัธยฐาน"
            : "Value: price-per-ml vs the median."}
        </li>
      </ul>
      <p className="text-xs text-gray-400">
        {th ? "อัปเดต" : "Updated"}: {generatedAt()?.slice(0, 10)}.{" "}
        {th ? "ข้อมูลรีวิวจาก Konvy" : "Review data from Konvy."}
      </p>
    </article>
  );
}
