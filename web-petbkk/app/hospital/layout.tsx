import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'โรงพยาบาลสัตว์ในกรุงเทพ — ค้นหาใกล้คุณ 24 ชั่วโมง',
  description: 'ค้นหาโรงพยาบาลสัตว์ใกล้คุณในกรุงเทพและปริมณฑล กว่า 503 แห่ง เปิด 24 ชั่วโมง บริการฉุกเฉิน พร้อมเส้นทาง Google Maps',
  keywords: ['โรงพยาบาลสัตว์', 'สัตวแพทย์ใกล้ฉัน', 'คลินิกสัตว์เลี้ยง', 'สัตวแพทย์ 24 ชั่วโมง', 'vet Bangkok', 'animal hospital Thailand'],
  alternates: {
    canonical: 'https://www.thailandpethub.com/hospital',
  },
  openGraph: {
    title: 'โรงพยาบาลสัตว์ในกรุงเทพ — ค้นหาใกล้คุณ',
    description: 'กว่า 503 แห่งในกรุงเทพและปริมณฑล เปิด 24 ชม. บริการฉุกเฉิน',
    url: 'https://www.thailandpethub.com/hospital',
    type: 'website',
  },
}

export default function HospitalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
