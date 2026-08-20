// Post-submit timeline — reduces booking-form-abandon anxiety.
// Visualizes the 24h response promise. Drops into home page right after booking form.

type Lang = "en" | "ko" | "th";

const STEPS: Record<Lang, { t: string; d: string; mins: string }[]> = {
  en: [
    { t: "We receive your request", d: "Form posts instantly to our team inbox. Real humans, no chatbots.", mins: "Instant" },
    { t: "We verify + match", d: "We forward your contact info and specific question to the clinic.", mins: "< 1 hour" },
    { t: "Clinic contacts you directly", d: "Their coordinator (English, Korean or Arabic on request) reaches out via your preferred channel.", mins: "Within 24h" },
    { t: "You decide on your own time", d: "No pressure, no follow-up spam. We don't sell your contact info.", mins: "No deadline" },
  ],
  ko: [
    { t: "요청 접수", d: "폼이 즉시 저희 팀 메일함으로 전송됩니다. 챗봇이 아닌 실제 담당자가 확인합니다.", mins: "즉시" },
    { t: "검증 + 매칭", d: "연락처와 구체적인 문의 내용을 클리닉에 전달합니다.", mins: "1시간 이내" },
    { t: "클리닉이 직접 연락", d: "클리닉 코디네이터(요청 시 영어·한국어·아랍어 가능)가 선호하는 채널로 연락드립니다.", mins: "24시간 이내" },
    { t: "본인 페이스로 결정", d: "압박이나 스팸성 follow-up 없습니다. 연락처를 판매하지 않습니다.", mins: "마감 없음" },
  ],
  th: [
    { t: "เราได้รับคำขอของคุณ", d: "แบบฟอร์มส่งถึงทีมงานทันที คนจริงตรวจสอบ ไม่ใช่แชทบอท", mins: "ทันที" },
    { t: "เราตรวจสอบและจับคู่", d: "เราส่งข้อมูลติดต่อและคำถามเฉพาะของคุณไปยังคลินิก", mins: "ไม่เกิน 1 ชม." },
    { t: "คลินิกติดต่อคุณโดยตรง", d: "ผู้ประสานงาน (ภาษาอังกฤษ เกาหลี หรืออาหรับตามคำขอ) จะติดต่อผ่านช่องทางที่คุณสะดวก", mins: "ภายใน 24 ชม." },
    { t: "ตัดสินใจตามจังหวะของคุณ", d: "ไม่กดดัน ไม่สแปมติดตาม เราไม่ขายข้อมูลติดต่อของคุณ", mins: "ไม่มีกำหนด" },
  ],
};

const COPY: Record<Lang, { eyebrow: string; heading: string; footer: string }> = {
  en: { eyebrow: "After you submit", heading: "What happens after you book a consult", footer: "If 24 hours pass with no contact, email {email} — we'll personally chase the clinic." },
  ko: { eyebrow: "신청 후", heading: "상담 신청 후 진행 과정", footer: "24시간이 지나도 연락이 없으면 {email}로 이메일 주세요 — 저희가 직접 클리닉에 확인하겠습니다." },
  th: { eyebrow: "หลังส่งคำขอ", heading: "เกิดอะไรขึ้นหลังจากคุณจองคำปรึกษา", footer: "หากผ่านไป 24 ชั่วโมงแล้วยังไม่มีการติดต่อ อีเมลมาที่ {email} — เราจะติดตามคลินิกให้เป็นการส่วนตัว" },
};

export default function AfterSubmitFlow({ contactEmail = "hello@bkkclinics.com", lang = "en" }: { contactEmail?: string; lang?: Lang }) {
  const t = COPY[lang] ?? COPY.en;
  const steps = STEPS[lang] ?? STEPS.en;
  const [before, after] = t.footer.split("{email}");
  return (
    <section className="rounded-[2rem] border-2 border-emerald-200 bg-emerald-50/50 p-6 sm:p-10">
      <div className="text-center mb-8">
        <div className="text-xs font-bold uppercase tracking-widest text-emerald-700">{t.eyebrow}</div>
        <h2 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight">{t.heading}</h2>
      </div>
      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <li key={i} className="relative rounded-2xl bg-white p-5 ring-1 ring-emerald-200">
            <div className="flex items-start justify-between">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-100 text-emerald-800 text-base font-bold">
                {i + 1}
              </span>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                {s.mins}
              </span>
            </div>
            <div className="mt-4 text-base font-bold leading-tight">{s.t}</div>
            <p className="mt-1.5 text-xs leading-relaxed text-[var(--muted)]">{s.d}</p>
          </li>
        ))}
      </ol>
      <p className="mt-6 text-center text-xs text-[var(--muted)]">
        {before}<a href={`mailto:${contactEmail}`} className="underline font-semibold">{contactEmail}</a>{after}
      </p>
    </section>
  );
}
