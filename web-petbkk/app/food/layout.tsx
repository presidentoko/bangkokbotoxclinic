import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ตรวจสอบอาหารสัตว์เลี้ยง — เกรด A-F พร้อมส่วนประกอบ',
  description: 'ตรวจสอบคุณภาพอาหารสุนัขและแมวกว่า 49 รายการ จัดเกรด A-F ตามส่วนประกอบ เปรียบเทียบราคาและโภชนาการ',
  keywords: ['อาหารสุนัข', 'อาหารแมว', 'ตรวจสอบอาหารสัตว์', 'อาหารสัตว์เกรด A', 'pet food review Thailand'],
  alternates: {
    canonical: 'https://www.thailandpethub.com/food',
  },
  openGraph: {
    title: 'ตรวจสอบอาหารสัตว์เลี้ยง — เกรด A-F',
    description: 'อาหารสุนัขและแมวกว่า 49 รายการ จัดเกรดตามส่วนประกอบ เปรียบเทียบราคา/กก.',
    url: 'https://www.thailandpethub.com/food',
    type: 'website',
  },
}

export default function FoodLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
