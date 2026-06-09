import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'เปรียบเทียบอาหารสัตว์เลี้ยง — เทียบ 3 ยี่ห้อพร้อมกัน',
  description: 'เปรียบเทียบคุณค่าทางโภชนาการ ส่วนประกอบ และราคาของอาหารสัตว์เลี้ยงสูงสุด 3 ยี่ห้อในคราวเดียว',
  alternates: {
    canonical: 'https://www.thailandpethub.com/compare',
  },
  openGraph: {
    title: 'เปรียบเทียบอาหารสัตว์เลี้ยง 3 ยี่ห้อ',
    description: 'เทียบโปรตีน ไขมัน ราคา/กก. และส่วนประกอบ',
    url: 'https://www.thailandpethub.com/compare',
    type: 'website',
  },
}

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
