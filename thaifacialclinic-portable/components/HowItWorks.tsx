import type { Lang } from "@/lib/types";

const STEPS: Record<Lang, { t: string; d: string; icon: string }[]> = {
  en: [
    { t: "We scrape, you trust", d: "Every clinic's Google reviews, read in full. Real reviews only — never clinic-paid testimonials.", icon: "shield" },
    { t: "Trust Score 0-100", d: "Weighted by rating, review volume and the procedures a clinic actually offers. One fake review can't game it.", icon: "ring" },
    { t: "Compare in one click", d: "Filter suspected viral clinics. Read what patients actually wrote, side by side.", icon: "compare" },
  ],
  ko: [
    { t: "우린 수집, 당신은 검증", d: "모든 클리닉의 구글 후기 원문을 끝까지 읽음. 진짜 후기만, 클리닉이 돈 준 가짜 후기 ❌", icon: "shield" },
    { t: "신뢰 점수 0-100", d: "평점 + 리뷰 수 + 실제 제공 시술로 가중. 가짜 후기 1개로는 점수 못 올림", icon: "ring" },
    { t: "한 클릭 비교", d: "광고/바이럴 의심 클리닉 필터링. 환자가 실제로 쓴 후기를 나란히 비교", icon: "compare" },
  ],
  th: [
    { t: "เราเก็บ คุณเชื่อ", d: "อ่านรีวิว Google ของทุกคลินิกครบทุกรีวิว รีวิวจริงเท่านั้น", icon: "shield" },
    { t: "Trust Score 0-100", d: "ถ่วงน้ำหนักจากคะแนน จำนวนรีวิว และหัตถการที่คลินิกมีจริง", icon: "ring" },
    { t: "เปรียบเทียบในคลิกเดียว", d: "กรองคลินิกที่มีพิรุธว่าเป็นไวรัล", icon: "compare" },
  ],
  zh: [
    { t: "我们抓取，您信任", d: "完整阅读每家诊所的 Google 评价。真实评价，无诊所付费证言。", icon: "shield" },
    { t: "信任分数 0-100", d: "按评分、评价数量与诊所实际提供的项目加权。1 条假评论无法操纵。", icon: "ring" },
    { t: "一键对比", d: "过滤可疑水军诊所。并排阅读患者的真实评价。", icon: "compare" },
  ],
  ar: [
    { t: "نحن نجمع، أنت تثق", d: "نقرأ جميع مراجعات Google لكل عيادة. تقييمات حقيقية فقط.", icon: "shield" },
    { t: "درجة الثقة 0-100", d: "مرجحة بالتقييم وعدد المراجعات والإجراءات المقدمة فعلاً. تقييم مزيف واحد لن يخدع النظام.", icon: "ring" },
    { t: "قارن بنقرة واحدة", d: "صفّ العيادات المشتبه بها.", icon: "compare" },
  ],
};

const TITLE: Record<Lang, string> = {
  en: "How we differ from clinic ad sites",
  ko: "왜 우리가 광고 사이트랑 다른가",
  th: "เราต่างจากเว็บโฆษณาคลินิกอย่างไร",
  zh: "我们与诊所广告网站的区别",
  ar: "كيف نختلف عن مواقع إعلانات العيادات",
};

const ICONS: Record<string, React.ReactNode> = {
  shield: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L4 5v6c0 5.5 3.5 10.5 8 11 4.5-.5 8-5.5 8-11V5l-8-3z"/>
      <path d="M9 12l2 2 4-4"/>
    </svg>
  ),
  ring: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" strokeDasharray="2 3" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  ),
  compare: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h6M3 12h6M3 18h6M15 6h6M15 12h6M15 18h6M11 9l2 3-2 3" />
    </svg>
  ),
};

export default function HowItWorks({ lang }: { lang: Lang }) {
  return (
    <section id="how-it-works" className="space-y-8">
      <div className="text-center">
        <div className="eyebrow justify-center">Method</div>
        <h2 className="mt-2 font-display text-3xl font-bold tracking-tighter-display sm:text-4xl">
          {TITLE[lang]}
        </h2>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {STEPS[lang].map((s, i) => (
          <div key={i} className="relative overflow-hidden card card-hover p-7">
            {/* Gold number badge */}
            <div className="flex items-start justify-between">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-navy-50 text-navy-700 dark:bg-navy-800 dark:text-gold-300">
                {ICONS[s.icon]}
              </div>
              <span className="font-display text-5xl font-bold leading-none tabular-nums text-gold-400/40">
                0{i + 1}
              </span>
            </div>
            <h3 className="mt-5 font-display text-xl font-bold leading-tight">{s.t}</h3>
            <p className="mt-2 text-sm leading-relaxed muted">{s.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
