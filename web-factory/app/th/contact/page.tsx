import { BreadcrumbJsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ติดต่อ",
  description: "ความร่วมมือกับซัพพลายเออร์ การแก้ไขข้อมูล สื่อ หรือคำถามทั่วไป",
  alternates: {
    canonical: "/th/contact",
    languages: {
      "th-TH": "/th/contact",
      "ko-KR": "/ko/contact",
      "en-US": "/contact",
      "x-default": "/contact",
    },
  },
  openGraph: { locale: "th_TH" },
};

export default function ThContactPage() {
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "umma@xx.gg";
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/th" className="hover:text-[var(--fg)]">หน้าแรก</a>
        <span className="mx-2">›</span>
        <span>ติดต่อ</span>
      </nav>

      <h1 className="text-4xl font-bold tracking-tight mb-3">ติดต่อ</h1>
      <p className="text-base text-[var(--muted)] mb-8 leading-relaxed">
        ความร่วมมือ การแก้ไขข้อมูล สื่อ หรือคำถามทั่วไป — กรุณาส่งอีเมล เราตอบกลับภายใน 1 วันทำการ
      </p>

      <div className="space-y-3">
        <Reason icon="🏭" title="ความร่วมมือซัพพลายเออร์" body="ช่อง Editor's Pick / Recommended / Featured, การโปรโมตที่ติดป้าย, การส่งมอบลีด — ดูรายละเอียดที่ /th/for-suppliers" />
        <Reason icon="✏️" title="การแก้ไขข้อมูล" body="ที่อยู่ผิด โรงงานปิดกิจการ ข้อมูลล้าสมัย หมวดหมู่ผิด แจ้งชื่อซัพพลายเออร์และปัญหา" />
        <Reason icon="📰" title="สื่อ" body="ข้อมูลอุตสาหกรรม คำถามเกี่ยวกับวิธีการ การสัมภาษณ์" />
        <Reason icon="❓" title="ทั่วไป" body="อื่นๆ เราอ่านทุกข้อความ" />
      </div>

      <div className="mt-8 bg-white border border-[var(--border)] rounded-xl p-6">
        <h2 className="font-bold text-lg mb-2">อีเมล</h2>
        <a href={`mailto:${email}`} className="inline-flex items-center gap-2 bg-black text-white py-3 px-5 rounded-lg font-bold hover:bg-gray-800 text-base">
          <span aria-hidden>✉</span>{email}
        </a>
      </div>

      <BreadcrumbJsonLd items={[
        { name: "หน้าแรก", url: "/th" },
        { name: "ติดต่อ", url: "/th/contact" },
      ]} />
    </div>
  );
}

function Reason({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <div className="flex gap-3 p-4 bg-white border border-[var(--border)] rounded-lg">
      <span className="text-xl shrink-0">{icon}</span>
      <div>
        <div className="font-bold text-sm">{title}</div>
        <p className="text-xs text-[var(--muted)] mt-0.5">{body}</p>
      </div>
    </div>
  );
}
