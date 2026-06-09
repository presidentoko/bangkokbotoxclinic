import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'คำนวณอายุน้องเทียบมนุษย์ — สุนัขและแมว',
  description: 'คำนวณว่าสุนัขหรือแมวอายุเท่าไหร่ในอายุมนุษย์ แชร์บัตรอายุน้องผ่าน LINE ได้เลย',
  alternates: {
    canonical: 'https://www.thailandpethub.com/age',
  },
  openGraph: {
    title: 'น้องอายุเท่าไหร่ในอายุมนุษย์?',
    description: 'คำนวณอายุสุนัข/แมวเทียบมนุษย์ แชร์ LINE ได้',
    url: 'https://www.thailandpethub.com/age',
    type: 'website',
  },
}

export default function AgeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
