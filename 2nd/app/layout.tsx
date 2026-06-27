import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { SiteSearch } from '@/components/SiteSearch'
import { EmailCapture } from '@/components/EmailCapture'
import { getAllItems } from '@/lib/data'

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
  const items = getAllItems()
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-[#FAFAF9] text-[#1A1A1A]`}>
        <header className="bg-[#FAFAF9] border-b border-[#E8E2D9]">
          <div className="max-w-5xl mx-auto px-6 py-5 flex items-center gap-4 justify-between">
            <a href="/" className="font-serif text-xl tracking-wider text-[#1A1A1A] shrink-0" style={{ fontFamily: 'var(--font-playfair)' }}>
              Second Luxury Items
            </a>
            <SiteSearch items={items} />
            <nav className="flex gap-6 text-sm text-[#6B6052] items-center tracking-wide uppercase shrink-0">
              <a href="/handbags" className="hover:text-[#1A1A1A] transition-colors">Handbags</a>
              <a href="/watches" className="hover:text-[#1A1A1A] transition-colors">Watches</a>
              <a href="/shoes" className="hover:text-[#1A1A1A] transition-colors">Shoes</a>
              <a href="/jewelry" className="hover:text-[#1A1A1A] transition-colors">Jewelry</a>
              <a href="/belts" className="hover:text-[#1A1A1A] transition-colors">Belts</a>
              <a href="/scarves" className="hover:text-[#1A1A1A] transition-colors">Scarves</a>
              <a href="/value-guide" className="hover:text-[#1A1A1A] transition-colors">Value Guide</a>
              <a href="/brands" className="hover:text-[#1A1A1A] transition-colors">Brands</a>
              <a href="/contact" className="hover:text-[#1A1A1A] transition-colors">Contact</a>
            </nav>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-6 py-10 pb-24 sm:pb-10">
          {children}
        </main>
        <EmailCapture />
        <footer className="border-t border-[#E8E2D9] mt-16">
          <div className="max-w-5xl mx-auto px-6 py-6 text-sm text-[#6B6052]">
            <p>Prices are estimates based on recent market data. Always verify current listings before purchasing.</p>
            <p className="mt-1">© {new Date().getFullYear()} SecondLuxuryItems.com</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
