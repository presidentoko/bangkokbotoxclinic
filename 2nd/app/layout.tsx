import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import Link from 'next/link'
import './globals.css'
import { SiteSearch } from '@/components/SiteSearch'
import { EmailCapture } from '@/components/EmailCapture'
import { MobileMenu } from '@/components/MobileMenu'
import { getSearchIndex } from '@/lib/data'

const NAV_LINKS = [
  { href: '/handbags', label: 'Handbags' },
  { href: '/watches', label: 'Watches' },
  { href: '/shoes', label: 'Shoes' },
  { href: '/jewelry', label: 'Jewelry' },
  { href: '/belts', label: 'Belts' },
  { href: '/scarves', label: 'Scarves' },
  { href: '/value-guide', label: 'Value Guide' },
  { href: '/brands', label: 'Brands' },
  { href: '/guides', label: 'Guides' },
  { href: '/contact', label: 'Contact' },
]

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: 'Second Luxury Items — Pre-Owned Luxury Price Guide',
  description: 'Find the real price of pre-owned Chanel, Louis Vuitton, Rolex and more. Compare second-hand luxury prices updated weekly.',
  metadataBase: new URL('https://www.secondluxuryitems.com'),
  manifest: '/manifest.webmanifest',
  openGraph: {
    siteName: 'SecondLuxuryItems',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@secondluxury',
    creator: '@secondluxury',
  },
  other: {
    'pinterest-rich-pin': 'true',
  },
  alternates: {
    canonical: 'https://www.secondluxuryitems.com',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const searchIndex = getSearchIndex()
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-[#FAFAF9] text-[#1A1A1A]`}>
        <header className="bg-[#FAFAF9] border-b border-[#E8E2D9] relative">
          <div className="max-w-5xl mx-auto px-6 py-5 flex items-center gap-4 justify-between">
            <Link href="/" className="font-serif text-xl tracking-wider text-[#1A1A1A] shrink-0" style={{ fontFamily: 'var(--font-playfair)' }}>
              Second Luxury Items
            </Link>
            <SiteSearch items={searchIndex} />
            <nav className="hidden md:flex gap-6 text-sm text-[#6B6052] items-center tracking-wide uppercase shrink-0">
              {NAV_LINKS.map(link => (
                <Link key={link.href} href={link.href} className="hover:text-[#1A1A1A] transition-colors">
                  {link.label}
                </Link>
              ))}
            </nav>
            <MobileMenu links={NAV_LINKS} />
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-6 py-10 pb-24 sm:pb-10">
          {children}
        </main>
        <EmailCapture />
        <footer className="border-t border-[#E8E2D9] mt-16">
          <div className="max-w-5xl mx-auto px-6 py-6 text-sm text-[#6B6052]">
            <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4 uppercase tracking-wide text-xs">
              <Link href="/guides" className="hover:text-[#1A1A1A] transition-colors">Guides & Care</Link>
              <Link href="/compare" className="hover:text-[#1A1A1A] transition-colors">Brand Comparisons</Link>
              <Link href="/trends" className="hover:text-[#1A1A1A] transition-colors">Market Trends</Link>
            </div>
            <p>Prices are estimates based on recent market data. Always verify current listings before purchasing.</p>
            <p className="mt-1">© {new Date().getFullYear()} SecondLuxuryItems.com</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
