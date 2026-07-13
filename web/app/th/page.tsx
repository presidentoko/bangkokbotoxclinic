// Thai 홈 — 2026-07-13: EN과 별개 구현(섹션 5개)이던 걸 메인 HomePage 컴포넌트
// 재사용으로 전환. 섹션 20개 전체가 이제 TH에도 나옴 (헤딩 번역, 일부 본문은 EN 유지).
import type { Metadata } from "next";
import HomePage from "../page";

export const metadata: Metadata = {
  title: "คลินิกในกรุงเทพ — รีวิวที่ตรวจสอบแล้วและคะแนนความน่าเชื่อถือ",
  description: "ไดเรกทอรีคลินิกความงามและการแพทย์ในกรุงเทพ จัดอันดับด้วยคะแนนความน่าเชื่อถือจากรีวิว Google จริง",
  alternates: { canonical: "/th", languages: { "th-TH": "/th", "en-US": "/" } },
  openGraph: { locale: "th_TH" },
};

const TH_FAQS = [
  {
    q: "คะแนนความน่าเชื่อถือคำนวณอย่างไร?",
    a: "คะแนน 0-100 รวม 4 ปัจจัย: คะแนน Google ของคลินิก (น้ำหนัก 50%), จำนวนรีวิวแบบ logarithmic (40%), อัตราส่วนรีวิวจาก Local Guide (10%), และความน่าเชื่อถือเฉลี่ยของผู้รีวิว (5%) เป็นเมตริกของเรา ไม่ใช่อันดับ Google",
  },
  {
    q: "ข้อมูลอัปเดตบ่อยแค่ไหน?",
    a: "ทุก 30 นาที สแครเปอร์ทำงานต่อเนื่อง รีวิวใหม่บนหน้า Google Maps ของคลินิกจะปรากฏที่นี่ภายใน 30 นาที",
  },
  {
    q: "คลินิกที่แสดงเป็นโฆษณาหรือไม่?",
    a: "รายชื่อทั่วไปไม่ได้รับเงิน เรามีช่องโฆษณาที่ติดป้ายชัดเจน (Editor's Pick / Recommended / Featured) แต่ไม่ลบหรือซ่อนคลินิกใด",
  },
];

export default function ThHomePage() {
  return <HomePage lang="th" faqs={TH_FAQS} />;
}
