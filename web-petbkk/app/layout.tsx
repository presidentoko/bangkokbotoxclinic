import type { Metadata, Viewport } from 'next'
import './globals.css'
import CompareTray from '@/components/CompareTray'
import InstallPrompt from '@/components/InstallPrompt'
import NewsletterForm from '@/components/NewsletterForm'
import NotificationWatcher from '@/components/NotificationWatcher'
import GlobalSearch from '@/components/GlobalSearch'
import MobileNav from '@/components/MobileNav'
import BottomNav from '@/components/BottomNav'
import { NAV_PRIMARY, NAV_GROUPS } from '@/lib/navGroups'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#f97316',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://www.thailandpethub.com'),
  title: {
    default: 'ThailandPetHub — ตรวจสอบอาหารสัตว์เลี้ยงและหาโรงพยาบาลสัตว์ในกรุงเทพ',
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

const SITE_URL = 'https://www.thailandpethub.com'

/**
 * One @graph rather than three loose blobs, so the Organization, the WebSite
 * and the search action resolve to each other by @id. Answer engines lean on
 * the publisher entity to decide whether a directory is worth citing, and the
 * site previously declared no publisher at all.
 */
function SiteJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'ThailandPetHub',
        alternateName: 'PetBKK',
        url: SITE_URL,
        logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon.svg` },
        description:
          'ฐานข้อมูลอาหารสัตว์เลี้ยงและโรงพยาบาลสัตว์ในกรุงเทพ พร้อมการวิเคราะห์ส่วนผสมและเกรดอาหาร',
        areaServed: { '@type': 'City', name: 'Bangkok', alternateName: 'กรุงเทพมหานคร' },
        knowsAbout: [
          'อาหารสัตว์เลี้ยง', 'ส่วนผสมอาหารสุนัข', 'ส่วนผสมอาหารแมว',
          'โรงพยาบาลสัตว์กรุงเทพ', 'คลินิกสัตว์ 24 ชั่วโมง',
          'วัคซีนสัตว์เลี้ยง', 'ค่ารักษาสัตว์เลี้ยง',
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          url: `${SITE_URL}/contact`,
          availableLanguage: ['th', 'en'],
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: 'ThailandPetHub',
        alternateName: 'PetBKK',
        url: SITE_URL,
        inLanguage: 'th-TH',
        publisher: { '@id': `${SITE_URL}/#organization` },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${SITE_URL}/food?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className="bg-[#FFF8F0] text-gray-900 antialiased">
        <SiteJsonLd />
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
            {/* Tools strip — popular chips first, the long tail behind dropdowns */}
            <nav aria-label="เครื่องมือ" className="hidden sm:flex flex-wrap items-center gap-2 text-xs text-gray-500 pb-0.5">
              {NAV_PRIMARY.slice(0, 8).map(l => (
                <a key={l.href} href={l.href}
                  className="whitespace-nowrap px-2.5 py-2 bg-gray-100 hover:bg-orange-50 hover:text-orange-600 rounded-full transition-colors flex-shrink-0">
                  {l.label}
                </a>
              ))}
              {NAV_GROUPS.map(group => (
                <details key={group.title} className="relative flex-shrink-0">
                  <summary className="cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden whitespace-nowrap px-2.5 py-2 bg-gray-100 hover:bg-orange-50 hover:text-orange-600 rounded-full transition-colors">
                    {group.title} ▾
                  </summary>
                  <div className="absolute left-0 top-full mt-1 z-50 w-56 max-h-80 overflow-y-auto bg-white border border-gray-100 rounded-xl shadow-lg p-1.5">
                    {group.items.map(i => (
                      <a key={i.href} href={i.href}
                        className="block px-2.5 py-1.5 rounded-lg whitespace-nowrap hover:bg-orange-50 hover:text-orange-600 transition-colors">
                        {i.label}
                      </a>
                    ))}
                  </div>
                </details>
              ))}
            </nav>
          </div>
        </header>
        {/* pb-16 on mobile keeps the fixed BottomNav from covering content */}
        <div className="max-w-5xl mx-auto px-4 py-8 pb-16 sm:pb-28">
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
        <BottomNav />
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
