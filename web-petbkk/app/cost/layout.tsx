import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ประมาณค่าใช้จ่ายสัตว์เลี้ยง — รายเดือนและ 5 ปี',
  description: 'คำนวณค่าใช้จ่ายในการเลี้ยงสุนัขหรือแมว อาหาร สัตวแพทย์ ดูแลขน วัคซีน ค่าหมัน ครบทุกรายการ',
  alternates: {
    canonical: 'https://www.thailandpethub.com/cost',
  },
  openGraph: {
    title: 'ค่าใช้จ่ายสัตว์เลี้ยง — คำนวณได้เลย',
    description: 'รายเดือน รายปี และ 5 ปี สำหรับสุนัขและแมว',
    url: 'https://www.thailandpethub.com/cost',
    type: 'website',
  },
}

export default function CostLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
