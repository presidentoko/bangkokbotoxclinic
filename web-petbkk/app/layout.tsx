import type { Metadata, Viewport } from 'next'
import './globals.css'
import CompareTray from '@/components/CompareTray'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#f97316',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://www.thailandpethub.com'),
  title: {
    default: 'PetBKK — ตรวจสอบอาหารและโรงพยาบาลสัตว์เลี้ยงในไทย',
    template: '%s | ThailandPetHub',
  },
  description: 'ตรวจสอบส่วนประกอบอาหารสัตว์เลี้ยง เกรด A-F ค้นหาโรงพยาบาลสัตว์ 24 ชั่วโมงใกล้คุณ เครื่องมือครบครันสำหรับเจ้าของสัตว์เลี้ยง ฟรี 100%',
  keywords: ['อาหารสัตว์เลี้ยง', 'โรงพยาบาลสัตว์', 'สุนัข', 'แมว', 'ตรวจสอบอาหารสัตว์', 'โรงพยาบาลสัตว์ 24 ชั่วโมง', 'ไทย', 'pet food Thailand', 'vet Bangkok'],
  alternates: {
    canonical: 'https://www.thailandpethub.com',
  },
  openGraph: {
    type: 'website',
    locale: 'th_TH',
    url: 'https://www.thailandpethub.com',
    siteName: 'ThailandPetHub',
    title: 'PetBKK — ตรวจสอบอาหารและโรงพยาบาลสัตว์เลี้ยง',
    description: 'ตรวจสอบส่วนประกอบอาหารสัตว์เลี้ยง เกรด A-F ค้นหาโรงพยาบาลสัตว์ใกล้คุณ ฟรี 100%',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PetBKK — ดูแลสัตว์เลี้ยงครบจบที่นี่',
    description: 'ตรวจสอบอาหาร หาโรงพยาบาล เครื่องมือครบสำหรับเจ้าของสัตว์เลี้ยง ฟรี 100%',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

function WebSiteJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ThailandPetHub',
    url: 'https://www.thailandpethub.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://www.thailandpethub.com/food?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className="bg-[#FFF8F0] text-gray-900 antialiased">
        <WebSiteJsonLd />
        <header className="bg-white/95 backdrop-blur-sm border-b border-orange-100 px-4 py-3 sticky top-0 z-40 shadow-sm">
          <div className="max-w-5xl mx-auto">
            {/* Brand + primary nav */}
            <div className="flex items-center gap-4 mb-2">
              <a href="/" className="font-black text-xl text-orange-500 flex-shrink-0 tracking-tight">🐾 PetBKK</a>
              <nav className="flex gap-3 text-sm overflow-x-auto scrollbar-none">
                <a href="/food"     className="whitespace-nowrap hover:text-orange-600">อาหาร</a>
                <a href="/hospital" className="whitespace-nowrap hover:text-orange-600">โรงพยาบาล</a>
                <a href="/adopt"    className="whitespace-nowrap hover:text-orange-600 text-green-600 font-medium">รับเลี้ยง</a>
                <a href="/tips"     className="whitespace-nowrap hover:text-orange-600">เคล็ดลับ</a>
                <a href="/emergency" className="whitespace-nowrap text-red-500 font-medium hover:text-red-600">🚨 ฉุกเฉิน</a>
              </nav>
            </div>
            {/* Tools strip */}
            <nav className="flex gap-2 overflow-x-auto scrollbar-none text-xs text-gray-500 pb-0.5">
              {[
                { href: '/compare',     label: 'เปรียบเทียบ' },
                { href: '/cost',        label: 'ค่าใช้จ่าย' },
                { href: '/age',         label: 'คำนวณอายุ' },
                { href: '/vaccine',     label: '💉 วัคซีน' },
                { href: '/toxic',       label: '⚠️ อาหารต้องห้าม' },
                { href: '/newpet',      label: '🆕 เลี้ยงใหม่' },
                { href: '/ingredients', label: 'ส่วนผสม' },
                { href: '/saved',       label: '❤️ บันทึก' },
              ].map(l => (
                <a key={l.href} href={l.href}
                  className="whitespace-nowrap px-2.5 py-1 bg-gray-100 hover:bg-orange-50 hover:text-orange-600 rounded-full transition-colors flex-shrink-0">
                  {l.label}
                </a>
              ))}
            </nav>
          </div>
        </header>
        <div className="max-w-5xl mx-auto px-4 py-8 pb-28">
          {children}
        </div>
        <CompareTray />
      </body>
    </html>
  )
}
