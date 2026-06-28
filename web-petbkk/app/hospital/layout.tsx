import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'โรงพยาบาลสัตว์ในกรุงเทพ — 503 แห่ง ค้นหาใกล้คุณ เปิด 24 ชม.',
  description: 'ค้นหาโรงพยาบาลสัตว์ใกล้คุณในกรุงเทพและปริมณฑล กว่า 503 แห่ง มีทั้งบริการ 24 ชั่วโมง ฉุกเฉิน และผ่าตัด พร้อมคะแนน Google รีวิว และเส้นทาง',
  keywords: ['โรงพยาบาลสัตว์', 'สัตวแพทย์ใกล้ฉัน', 'คลินิกสัตว์เลี้ยง', 'สัตวแพทย์ 24 ชั่วโมง', 'vet Bangkok', 'animal hospital Thailand', 'โรงพยาบาลสัตว์กรุงเทพ'],
  alternates: {
    canonical: 'https://www.thailandpethub.com/hospital',
  },
  openGraph: {
    title: 'โรงพยาบาลสัตว์ในกรุงเทพ — 503 แห่ง ค้นหาใกล้คุณ',
    description: 'กว่า 503 แห่งในกรุงเทพและปริมณฑล มีทั้งบริการ 24 ชม. ฉุกเฉิน และผ่าตัด พร้อมคะแนน Google',
    url: 'https://www.thailandpethub.com/hospital',
    type: 'website',
  },
}

const hospitalFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'โรงพยาบาลสัตว์ที่ดีที่สุดในกรุงเทพคือที่ไหน?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'โรงพยาบาลสัตว์ที่ได้รับความนิยมสูงสุดในกรุงเทพ ได้แก่ โรงพยาบาลสัตว์มหาวิทยาลัยเกษตรศาสตร์, โรงพยาบาลสัตว์จุฬาลงกรณ์, Thonglor Pet Hospital และ Nakarin Veterinary Hospital ซึ่งมีคะแนน Google สูงกว่า 4.5 และรีวิวมากกว่า 200 รีวิว',
      },
    },
    {
      '@type': 'Question',
      name: 'โรงพยาบาลสัตว์เปิด 24 ชั่วโมงในกรุงเทพมีที่ไหนบ้าง?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'มีโรงพยาบาลสัตว์เปิด 24 ชั่วโมงในกรุงเทพกว่า 30 แห่ง รวมถึง Thonglor Pet Hospital, บางกอกสมุทร (Animal Medical Center), และอีกหลายแห่งในพื้นที่ต่างๆ ค้นหาได้จากตัวกรอง "24 ชม." ในหน้านี้',
      },
    },
    {
      '@type': 'Question',
      name: 'ค่าตรวจสัตวแพทย์ในกรุงเทพราคาเท่าไหร่?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'ค่าตรวจสัตวแพทย์ในกรุงเทพโดยทั่วไปอยู่ที่ 200–800 บาทต่อครั้ง ขึ้นอยู่กับโรงพยาบาลและประเภทการตรวจ ค่าผ่าตัดเล็กเริ่มต้น 2,000–5,000 บาท ค่าทำหมันสุนัข 2,000–8,000 บาท',
      },
    },
    {
      '@type': 'Question',
      name: 'สัตว์เลี้ยงป่วยฉุกเฉินกลางดึกต้องทำอย่างไร?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'ควรพาไปโรงพยาบาลสัตว์ที่เปิด 24 ชั่วโมงทันที ในกรุงเทพมีหลายแห่งที่เปิดตลอดคืน แนะนำโทรสอบถามก่อนเดินทางเพื่อแจ้งอาการเบื้องต้น สัญญาณฉุกเฉิน ได้แก่ ชัก หายใจลำบาก เลือดออกไม่หยุด หรือหมดสติ',
      },
    },
    {
      '@type': 'Question',
      name: 'โรงพยาบาลสัตว์ใกล้ฉันในกรุงเทพค้นหาได้อย่างไร?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'ค้นหาโรงพยาบาลสัตว์ใกล้คุณได้จาก ThailandPetHub ซึ่งรวบรวมข้อมูลกว่า 503 แห่งในกรุงเทพและปริมณฑล พร้อมคะแนน Google รีวิว ราคา และเส้นทาง Google Maps',
      },
    },
  ],
}

export default function HospitalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hospitalFaqSchema) }}
      />
      {children}
    </>
  )
}
