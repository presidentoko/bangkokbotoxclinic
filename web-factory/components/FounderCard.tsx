// 한국어·태국어 About 페이지의 운영자·주소 블록. 영어 /about 은 본문이 길어 자체 마크업을 쓴다.
// 이름·주소·LinkedIn 은 JsonLd.tsx 의 OFFICE / FOUNDER_LINKEDIN 과 같은 값이어야 한다.
import { OFFICE, FOUNDER_LINKEDIN, FounderJsonLd } from "@/components/JsonLd";

const TEXT = {
  ko: {
    role: "창업자",
    name: "신윤민 (Yunmin Shin)",
    bio: "데이터 아키텍트 12년+. 방콕에 사는 한국인 창업자로, 태국 시장을 위한 제품을 만들고 있습니다. 구글 지도 비즈니스 프로필을 태국 상무부 DBD 법인 등기와 대조해, 바이어가 중개인 없이 공장과 직접 이야기할 수 있게 하려고 이 디렉토리를 만들었습니다.",
    contact: "연락처 · 주소",
  },
  th: {
    role: "ผู้ก่อตั้ง",
    name: "Yunmin Shin (신윤민)",
    bio: "สถาปนิกข้อมูลกว่า 12 ปี ผู้ก่อตั้งชาวเกาหลีที่อาศัยอยู่ในกรุงเทพฯ สร้างไดเรกทอรีนี้โดยตรวจสอบโปรไฟล์ธุรกิจบน Google Maps กับข้อมูลนิติบุคคลของกรมพัฒนาธุรกิจการค้า (DBD) เพื่อให้ผู้ซื้อคุยกับโรงงานได้โดยตรง ไม่ต้องผ่านคนกลาง",
    contact: "ติดต่อ · ที่อยู่",
  },
} as const;

export function FounderCard({ lang, brand }: { lang: "ko" | "th"; brand: string }) {
  const t = TEXT[lang];
  return (
    <>
      <section className="bg-white border border-[var(--border)] rounded-xl p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <img
            src="/founder.jpg"
            alt={`${t.name} — ${t.role}`}
            className="w-32 h-32 rounded-full object-cover border border-[var(--border)] shrink-0"
            loading="lazy"
          />
          <div>
            <div className="text-xs uppercase tracking-wide text-[var(--muted)] mb-1">{t.role}</div>
            <h2 className="text-xl font-bold mb-2">{t.name}</h2>
            <p className="text-sm text-[var(--muted)] leading-relaxed mb-3">{t.bio}</p>
            <a href={FOUNDER_LINKEDIN} rel="me noopener" target="_blank" className="text-sm font-bold text-[var(--gold-deep)] hover:underline">
              LinkedIn →
            </a>
          </div>
        </div>
      </section>

      <section className="bg-white border border-[var(--border)] rounded-xl p-6 mb-10">
        <h2 className="text-lg font-bold mb-3">{t.contact}</h2>
        <address className="not-italic text-sm leading-relaxed">
          {brand}<br />
          {OFFICE.street}<br />
          {OFFICE.district}, {OFFICE.region} {OFFICE.postalCode}, Thailand<br />
          <a href="mailto:inquiry@thaisupplyhub.com" className="underline">inquiry@thaisupplyhub.com</a>
        </address>
      </section>
      <FounderJsonLd />
    </>
  );
}
