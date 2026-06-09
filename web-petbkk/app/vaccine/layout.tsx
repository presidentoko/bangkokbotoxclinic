import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ตารางวัคซีนสัตว์เลี้ยง — คำนวณจากวันเกิดน้อง',
  description: 'คำนวณตารางวัคซีนสุนัขและแมวจากวันเกิด รู้ว่าวัคซีนตัวไหนครบแล้ว ตัวไหนใกล้ถึงกำหนด',
  alternates: {
    canonical: 'https://www.thailandpethub.com/vaccine',
  },
  openGraph: {
    title: 'ตารางวัคซีนสัตว์เลี้ยง — คำนวณได้เลย',
    description: 'วัคซีน DA2PP, Rabies, FeLV และอื่นๆ คำนวณจากวันเกิดน้อง',
    url: 'https://www.thailandpethub.com/vaccine',
    type: 'website',
  },
}

export default function VaccineLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
