import type { Clinic, Lang } from "@/lib/types";

const COPY: Record<Lang, { title: string; sub: string; stat1: string; stat2: string; stat3: string; stat4: string }> = {
  en: {
    title: "Built on real data, not paid placements",
    sub: "Every clinic is graded the same way. No clinic can pay to hide a bad review.",
    stat1: "Independent sources",
    stat2: "Reviews aggregated",
    stat3: "Photos verified",
    stat4: "Cities covered",
  },
  ko: {
    title: "광고 아닌, 진짜 데이터 기반",
    sub: "모든 클리닉이 동일한 기준으로 평가됨. 돈 주고 부정 리뷰 못 가림.",
    stat1: "독립 출처",
    stat2: "수집된 리뷰",
    stat3: "검증된 사진",
    stat4: "커버 도시",
  },
  th: {
    title: "ข้อมูลจริง ไม่มีการจ่ายเงิน",
    sub: "ทุกคลินิกถูกประเมินด้วยมาตรฐานเดียวกัน",
    stat1: "แหล่งข้อมูลอิสระ",
    stat2: "รีวิวที่รวบรวม",
    stat3: "รูปที่ตรวจสอบ",
    stat4: "เมืองที่ครอบคลุม",
  },
  zh: {
    title: "基于真实数据，非付费投放",
    sub: "每家诊所采用相同评分标准。无诊所可付费隐藏差评。",
    stat1: "独立来源",
    stat2: "汇总评论",
    stat3: "验证照片",
    stat4: "覆盖城市",
  },
  ar: {
    title: "مبني على بيانات حقيقية، ليس إعلانات مدفوعة",
    sub: "كل عيادة يتم تقييمها بنفس الطريقة.",
    stat1: "مصادر مستقلة",
    stat2: "تقييمات مجمعة",
    stat3: "صور موثقة",
    stat4: "مدن مغطاة",
  },
};

export default function SocialProof({ clinics, lang }: { clinics: Clinic[]; lang: Lang }) {
  const c = COPY[lang];
  const reviewSum = clinics.reduce((s, x) => s + (x.reviews_scraped_count || 0) + (x.review_count || 0), 0);
  const photoSum = clinics.reduce((s, x) => s + (x.photos_count || 0), 0);
  const cities = new Set(clinics.map((x) => x.city).filter((x) => x && x !== "nan"));

  const stats = [
    { value: "6", label: c.stat1 },
    { value: reviewSum.toLocaleString(), label: c.stat2 },
    { value: photoSum.toLocaleString(), label: c.stat3 },
    { value: String(cities.size), label: c.stat4 },
  ];

  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-navy-950 px-6 py-12 text-white sm:px-12 sm:py-16">
      <div className="absolute inset-0 opacity-30 bg-grid" aria-hidden />
      <div className="blob -top-20 -right-20 h-72 w-72 bg-gold-500/30" aria-hidden />

      <div className="relative grid items-center gap-8 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <div className="eyebrow !text-gold-300">Our method</div>
          <h2 className="mt-2 font-display text-3xl font-bold leading-tight tracking-tighter-display sm:text-4xl">
            {c.title}
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-navy-100">
            {c.sub}
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-4 sm:gap-6">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <dt className="text-[10px] font-bold uppercase tracking-[0.15em] text-gold-300">{s.label}</dt>
              <dd className="mt-1 font-display text-3xl font-bold tabular-nums leading-none sm:text-4xl">
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
