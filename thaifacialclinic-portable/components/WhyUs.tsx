import type { Lang } from "@/lib/types";

const COPY: Record<Lang, { eyebrow: string; title: string; sub: string; items: { good: string; bad: string }[] }> = {
  en: {
    eyebrow: "Why we're different",
    title: "What other directories won't admit",
    sub: "Hair-transplant decisions are too important for paid-placement directories. Here's what makes us different.",
    items: [
      { good: "We aggregate 6 independent data sources (Google, Bookimed, Reddit, Naver, YouTube, Pantip)", bad: "Most directories show only what clinics tell them" },
      { good: "We can NOT delete or hide bad reviews — even for paying partners", bad: "Other sites bury negative reviews for advertisers" },
      { good: "Suspected viral-marketing clinics get flagged (visible only via opt-in toggle)", bad: "Other sites give viral clinics the same trust as legit ones" },
      { good: "Trust Score is a transparent formula you can audit", bad: "Other 'top-rated' lists are opaque pay-to-play" },
      { good: "Partner clinics pay for placement priority — never for review manipulation", bad: "Many sites quietly sell 'reputation management'" },
    ],
  },
  ko: {
    eyebrow: "왜 우리가 다른가",
    title: "다른 디렉토리가 인정 안 하는 것",
    sub: "모발이식 결정은 광고비 받는 디렉토리에 맡기기엔 너무 중요함. 이게 우리의 차이.",
    items: [
      { good: "6개 독립 출처 통합 (Google · Bookimed · Reddit · Naver · YouTube · Pantip)", bad: "다른 디렉토리는 클리닉이 제공한 정보만 표시" },
      { good: "부정 리뷰 삭제/숨기기 ❌ — 결제한 파트너도 마찬가지", bad: "다른 사이트는 광고주의 부정 리뷰를 묻어버림" },
      { good: "바이럴 마케팅 의심 클리닉 자동 플래그 (옵션 토글 시 표시)", bad: "다른 사이트는 바이럴 클리닉도 같은 신뢰도 부여" },
      { good: "신뢰 점수는 투명한 공식 — 검증 가능", bad: "다른 'TOP 추천' 은 광고비 기반 블랙박스" },
      { good: "파트너 우선 노출은 받지만, 리뷰 조작은 절대 X", bad: "많은 사이트가 'reputation management' 를 몰래 판매" },
    ],
  },
  th: {
    eyebrow: "เราต่างจากที่อื่น",
    title: "สิ่งที่ไดเรกทอรีอื่นไม่ยอมพูด",
    sub: "การตัดสินใจปลูกผมสำคัญเกินกว่าจะฝากให้ไดเรกทอรีที่รับโฆษณา",
    items: [
      { good: "รวมข้อมูลจาก 6 แหล่งอิสระ", bad: "ที่อื่นแสดงเฉพาะข้อมูลจากคลินิกเท่านั้น" },
      { good: "ไม่ลบรีวิวลบ ไม่ว่าจะเป็นพาร์ตเนอร์", bad: "ที่อื่นซ่อนรีวิวลบให้ผู้โฆษณา" },
      { good: "ระบุคลินิกที่สงสัยว่าใช้ไวรัล", bad: "ที่อื่นให้ความน่าเชื่อถือเท่ากัน" },
      { good: "คะแนนความน่าเชื่อถือเป็นสูตรโปร่งใส", bad: "TOP-rated lists อื่นๆ เป็น pay-to-play" },
      { good: "พาร์ตเนอร์จ่ายเพื่ออันดับ ไม่จ่ายเพื่อแก้รีวิว", bad: "หลายเว็บขาย reputation management" },
    ],
  },
  zh: {
    eyebrow: "为什么我们不同",
    title: "其他目录不会承认的事",
    sub: "植发决定不能依赖收取广告费的目录。",
    items: [
      { good: "整合 6 个独立来源", bad: "其他只显示诊所提供的信息" },
      { good: "不删除负面评论 — 即使是付费合作伙伴", bad: "其他网站为广告商埋葬差评" },
      { good: "标记疑似水军诊所", bad: "其他网站给予同样信任" },
      { good: "信任分数公式透明", bad: "其他 TOP 榜单是黑箱付费" },
      { good: "合作伙伴付费置顶，不付费修改评论", bad: "许多网站暗中出售'声誉管理'" },
    ],
  },
  ar: {
    eyebrow: "ما يميزنا",
    title: "ما لا تعترف به الأدلة الأخرى",
    sub: "قرار زراعة الشعر مهم جداً للاعتماد على أدلة مدفوعة.",
    items: [
      { good: "نجمع من 6 مصادر مستقلة", bad: "الأدلة الأخرى تعرض فقط ما تقوله العيادات" },
      { good: "لا نحذف التقييمات السلبية", bad: "المواقع الأخرى تخفي التقييمات السلبية للمعلنين" },
      { good: "نضع علامة على العيادات الفيروسية المشبوهة", bad: "المواقع الأخرى تمنحها نفس الثقة" },
      { good: "درجة الثقة معادلة شفافة", bad: "قوائم 'الأعلى تقييماً' الأخرى مدفوعة" },
      { good: "الشركاء يدفعون للأولوية لا لإخفاء التقييمات", bad: "كثير من المواقع تبيع 'إدارة السمعة'" },
    ],
  },
};

export default function WhyUs({ lang }: { lang: Lang }) {
  const c = COPY[lang];
  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-[rgb(var(--bg-elev))] p-6 sm:p-12 ring-1" style={{ ["--tw-ring-color" as never]: "rgb(var(--border))" }}>
      <div className="absolute inset-0 bg-gradient-to-br from-mint-50 via-transparent to-gold-50 opacity-50 dark:from-mint-950/20 dark:to-gold-950/20 pointer-events-none" />
      <div className="relative">
        <div className="text-center mb-10">
          <div className="eyebrow justify-center">{c.eyebrow}</div>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tighter-display sm:text-4xl">{c.title}</h2>
          <p className="mt-3 text-sm muted max-w-2xl mx-auto leading-relaxed">{c.sub}</p>
        </div>

        <div className="grid gap-3">
          {c.items.map((it, i) => (
            <div key={i} className="grid grid-cols-1 gap-3 rounded-2xl border bg-[rgb(var(--bg))] p-4 sm:grid-cols-2 sm:p-5"
              style={{ borderColor: "rgb(var(--border))" }}>
              <div className="flex items-start gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-mint-100 text-mint-700">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                </span>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-mint-700 dark:text-mint-400">Us</div>
                  <div className="mt-0.5 text-sm font-semibold leading-snug">{it.good}</div>
                </div>
              </div>
              <div className="flex items-start gap-3 border-t pt-3 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0"
                style={{ borderColor: "rgb(var(--border))" }}>
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-red-100 text-red-700">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                </span>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-red-700">Them</div>
                  <div className="mt-0.5 text-sm leading-snug muted">{it.bad}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
