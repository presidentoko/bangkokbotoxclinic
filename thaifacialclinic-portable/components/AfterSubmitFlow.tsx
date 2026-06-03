import type { Lang } from "@/lib/types";

const COPY: Record<Lang, { title: string; steps: { t: string; d: string; mins: string }[]; promise: string }> = {
  en: {
    title: "What happens after you submit",
    steps: [
      { t: "We receive your request", d: "Form posts instantly to our team inbox. Real humans, no chatbots.", mins: "Instant" },
      { t: "We verify + match", d: "We forward your contact info to the clinic with your specific question.", mins: "< 1 hour" },
      { t: "Clinic contacts you directly", d: "Their coordinator (English or Korean speaker if requested) reaches out via your preferred channel.", mins: "Within 24h" },
      { t: "You decide on your own time", d: "No pressure, no follow-up spam. We don't sell your contact info.", mins: "No deadline" },
    ],
    promise: "If 24 hours pass with no contact, email hello@thaifacialclinic.com — we'll personally chase the clinic.",
  },
  ko: {
    title: "신청 후 어떻게 진행되나",
    steps: [
      { t: "신청 즉시 접수", d: "폼이 우리 운영팀 인박스로 즉시 전송. 챗봇 아닌 실제 사람이 처리.", mins: "즉시" },
      { t: "확인 + 매칭", d: "귀하 정보 + 질문을 해당 클리닉에 전달.", mins: "1시간 이내" },
      { t: "클리닉이 직접 연락", d: "코디네이터 (요청시 영어/한국어 가능) 가 원하는 채널로 연락.", mins: "24시간 이내" },
      { t: "여유롭게 결정", d: "재촉 ❌, 추후 스팸 ❌. 연락처 절대 판매 안 함.", mins: "기한 X" },
    ],
    promise: "24시간 지나도 연락 없으면 hello@thaifacialclinic.com — 직접 챙김.",
  },
  th: {
    title: "เมื่อคุณส่งคำขอแล้วเกิดอะไรขึ้น",
    steps: [
      { t: "เรารับคำขอทันที", d: "ฟอร์มส่งตรงไปยังทีมงานเรา ไม่ใช่บอท", mins: "ทันที" },
      { t: "ตรวจสอบและจับคู่", d: "เราส่งข้อมูลของคุณพร้อมคำถามไปยังคลินิก", mins: "ภายใน 1 ชม." },
      { t: "คลินิกติดต่อคุณโดยตรง", d: "ผู้ประสานงาน (อังกฤษ/เกาหลี ตามที่ขอ) ติดต่อกลับทางช่องที่คุณเลือก", mins: "ภายใน 24 ชม." },
      { t: "ตัดสินใจในเวลาของคุณ", d: "ไม่มีกดดัน ไม่มี follow-up ที่น่ารำคาญ", mins: "ไม่มีกำหนด" },
    ],
    promise: "หากผ่าน 24 ชม. แล้วยังไม่มีการติดต่อ ส่งอีเมลถึง hello@thaifacialclinic.com",
  },
  zh: {
    title: "提交后会发生什么",
    steps: [
      { t: "我们立即收到您的请求", d: "表单直接送达我们团队收件箱。真人处理，非机器人。", mins: "即刻" },
      { t: "我们核实并匹配", d: "我们将您的联系方式和具体问题转给诊所。", mins: "1 小时内" },
      { t: "诊所直接联系您", d: "他们的协调员（如需可提供英语或韩语）通过您偏好的渠道联系。", mins: "24 小时内" },
      { t: "您按自己节奏决定", d: "无压力，无骚扰跟进。我们绝不出售您的联系信息。", mins: "无截止" },
    ],
    promise: "24 小时未联系？发邮件至 hello@thaifacialclinic.com — 我们亲自跟进。",
  },
  ar: {
    title: "ماذا يحدث بعد الإرسال",
    steps: [
      { t: "نستلم طلبك فوراً", d: "النموذج يصل مباشرة إلى فريقنا. بشر حقيقيون، لا روبوتات محادثة.", mins: "فوري" },
      { t: "نتحقق ونطابق", d: "نمرر معلومات الاتصال الخاصة بك مع سؤالك المحدد إلى العيادة.", mins: "خلال ساعة" },
      { t: "العيادة تتواصل معك مباشرة", d: "منسقهم (يتحدث الإنجليزية أو الكورية حسب الطلب) يتواصل عبر القناة المفضلة لديك.", mins: "خلال 24 ساعة" },
      { t: "أنت تقرر في وقتك", d: "بدون ضغط، بدون متابعة مزعجة. لا نبيع معلومات الاتصال.", mins: "بدون موعد نهائي" },
    ],
    promise: "إذا مرت 24 ساعة دون اتصال، راسلنا على hello@thaifacialclinic.com",
  },
};

export default function AfterSubmitFlow({ lang }: { lang: Lang }) {
  const c = COPY[lang];
  return (
    <section className="rounded-[2rem] border-2 border-mint-200 bg-mint-50/50 p-6 sm:p-10 dark:border-mint-900/40 dark:bg-mint-950/20">
      <div className="text-center mb-8">
        <div className="eyebrow !text-mint-700">After you submit</div>
        <h2 className="mt-2 font-display text-2xl font-bold tracking-tighter-display sm:text-3xl">{c.title}</h2>
      </div>
      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {c.steps.map((s, i) => (
          <li key={i} className="relative rounded-2xl bg-[rgb(var(--bg-elev))] p-5 ring-1 ring-mint-200 dark:ring-mint-900/40">
            <div className="flex items-start justify-between">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-mint-100 text-mint-800 font-display text-base font-bold dark:bg-mint-900/50 dark:text-mint-200">
                {i + 1}
              </span>
              <span className="rounded-full bg-mint-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-mint-800 dark:bg-mint-900/50 dark:text-mint-200">
                {s.mins}
              </span>
            </div>
            <div className="mt-4 font-display text-base font-bold leading-tight">{s.t}</div>
            <p className="mt-1.5 text-xs leading-relaxed muted">{s.d}</p>
          </li>
        ))}
      </ol>
      <p className="mt-6 text-center text-xs muted">{c.promise}</p>
    </section>
  );
}
