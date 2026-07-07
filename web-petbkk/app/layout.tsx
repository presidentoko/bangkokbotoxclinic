import type { Metadata, Viewport } from 'next'
import './globals.css'
import CompareTray from '@/components/CompareTray'
import InstallPrompt from '@/components/InstallPrompt'
import NewsletterForm from '@/components/NewsletterForm'
import NotificationWatcher from '@/components/NotificationWatcher'
import GlobalSearch from '@/components/GlobalSearch'
import MobileNav from '@/components/MobileNav'

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
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'PetBKK',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
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
              <nav className="hidden sm:flex gap-3 text-sm overflow-x-auto scrollbar-none flex-1 min-w-0">
                <a href="/food"     className="whitespace-nowrap hover:text-orange-600 py-2">อาหาร</a>
                <a href="/hospital" className="whitespace-nowrap hover:text-orange-600 py-2">โรงพยาบาล</a>
                <a href="/adopt"    className="whitespace-nowrap hover:text-orange-600 text-green-600 font-medium py-2">รับเลี้ยง</a>
                <a href="/tips"     className="whitespace-nowrap hover:text-orange-600 py-2">เคล็ดลับ</a>
                <a href="/guides"   className="whitespace-nowrap hover:text-orange-600 font-medium text-orange-500 py-2">📚 คู่มือทั้งหมด</a>
                <a href="/emergency" className="whitespace-nowrap text-red-500 font-medium hover:text-red-600 py-2">🚨 ฉุกเฉิน</a>
              </nav>
              <div className="flex-1 sm:hidden" />
              <GlobalSearch />
              <MobileNav />
            </div>
            {/* Tools strip */}
            <nav className="hidden sm:flex gap-2 overflow-x-auto scrollbar-none text-xs text-gray-500 pb-0.5">
              {[
                { href: '/compare',         label: 'เปรียบเทียบ' },
                { href: '/cost',            label: 'ค่าใช้จ่าย' },
                { href: '/age',             label: 'คำนวณอายุ' },
                { href: '/vaccine',         label: '💉 วัคซีน' },
                { href: '/hospital/surgery',label: '🔪 ทำหมัน/ผ่าตัด' },
                { href: '/food/senior',     label: '👴 Senior' },
                { href: '/food/budget',     label: '💰 ประหยัด' },
                { href: '/dental',          label: '🦷 ดูแลฟัน' },
                { href: '/deworming',       label: '🪱 ถ่ายพยาธิ' },
                { href: '/flea',            label: '🦟 หมัด/เห็บ' },
                { href: '/grooming',        label: '🪮 Grooming' },
                { href: '/food/puppy',      label: '🐶 Puppy' },
                { href: '/toxic',           label: '⚠️ อาหารต้องห้าม' },
                { href: '/checklist',       label: '✅ เช็คลิสต์' },
                { href: '/newpet',          label: '🆕 เลี้ยงใหม่' },
                { href: '/training',        label: '🎓 ฝึกสุนัข' },
                { href: '/insurance',       label: '🛡️ ประกัน' },
                { href: '/microchip',       label: '📡 ไมโครชิป' },
                { href: '/first-aid',       label: '🩹 ปฐมพยาบาล' },
                { href: '/potty-training',  label: '🚽 ฝึกฉี่ถูกที่' },
                { href: '/weight',          label: '⚖️ น้ำหนัก' },
                { href: '/cat-behavior',    label: '🐱 พฤติกรรมแมว' },
                { href: '/neutering',       label: '✂️ ทำหมัน' },
                { href: '/heartworm',       label: '🦟 พยาธิหัวใจ' },
                { href: '/allergy',         label: '🤧 แพ้อาหาร' },
                { href: '/travel',          label: '✈️ เดินทาง' },
                { href: '/anxiety',         label: '😰 แยกไม่ได้' },
                { href: '/heatstroke',      label: '☀️ ลมแดด' },
                { href: '/dog-behavior',    label: '🐕 พฤติกรรมสุนัข' },
                { href: '/breeds',          label: '🐾 สายพันธุ์' },
                { href: '/kidney-disease',  label: '🫘 โรคไต' },
                { href: '/raw-food',        label: '🥩 Raw Food' },
                { href: '/symptoms',         label: '🩺 ตรวจอาการ' },
                { href: '/breed-quiz',       label: '🐾 ค้นหาสายพันธุ์' },
                { href: '/diarrhea',         label: '💩 ท้องเสีย' },
                { href: '/not-eating',       label: '🍽️ ไม่กินอาหาร' },
                { href: '/ingredients',      label: 'ส่วนผสม' },
                { href: '/saved',            label: '❤️ บันทึก' },
              ].map(l => (
                <a key={l.href} href={l.href}
                  className="whitespace-nowrap px-2.5 py-2 bg-gray-100 hover:bg-orange-50 hover:text-orange-600 rounded-full transition-colors flex-shrink-0">
                  {l.label}
                </a>
              ))}
            </nav>
          </div>
        </header>
        <div className="max-w-5xl mx-auto px-4 py-8 pb-28">
          {children}
        </div>
        <footer className="max-w-5xl mx-auto px-4 py-8 pb-24 text-center text-xs text-gray-400 border-t border-gray-100 mt-4">
          {/* Newsletter */}
          <div className="mb-5">
            <p className="font-semibold text-gray-600 text-sm mb-1">รับข้อมูลดูแลสัตว์เลี้ยงใหม่ๆ</p>
            <p className="text-xs text-gray-400 mb-3">ทิปส์ อาหารแนะนำ และข่าวสาร — ส่งให้ฟรี</p>
            <NewsletterForm />
          </div>
          <p className="mb-2">
            <a href="/contact" className="hover:text-orange-500 transition-colors">ติดต่อเรา</a>
            <span className="mx-2">·</span>
            <a href="/adopt" className="hover:text-green-600 transition-colors text-green-500 font-medium">รับเลี้ยงแทนการซื้อ</a>
            <span className="mx-2">·</span>
            <a href="/food" className="hover:text-orange-500 transition-colors">ตรวจสอบอาหาร</a>
            <span className="mx-2">·</span>
            <a href="/hospital" className="hover:text-orange-500 transition-colors">หาโรงพยาบาลสัตว์</a>
          </p>
          <p>© {new Date().getFullYear()} ThailandPetHub — ข้อมูลเพื่อการศึกษา ไม่ใช่คำแนะนำทางสัตวแพทย์</p>
        </footer>
        <NotificationWatcher />
        <InstallPrompt />
        <CompareTray />
        <script dangerouslySetInnerHTML={{ __html: `
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/sw.js').catch(function() {});
    });
  }
` }} />
      </body>
    </html>
  )
}
