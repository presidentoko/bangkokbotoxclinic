import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: 'Second Luxury Items — Pre-Owned Luxury Price Guide',
  description: 'Find the real price of pre-owned Chanel, Louis Vuitton, Rolex and more. Compare second-hand luxury prices updated weekly.',
  metadataBase: new URL('https://www.secondluxuryitems.com'),
  manifest: '/manifest.webmanifest',
  openGraph: {
    siteName: 'SecondLuxuryItems.com',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@secondluxury',
  },
  alternates: {
    canonical: 'https://www.secondluxuryitems.com',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-[#FAFAF9] text-[#1A1A1A]`}>
        <header className="bg-[#FAFAF9] border-b border-[#E8E2D9]">
          <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
            <a href="/" className="font-serif text-xl tracking-wider text-[#1A1A1A]" style={{ fontFamily: 'var(--font-playfair)' }}>
              Second Luxury Items
            </a>
            <nav className="flex gap-6 text-sm text-[#6B6052] items-center tracking-wide uppercase">
              <a href="/handbags" className="hover:text-[#1A1A1A] transition-colors">Handbags</a>
              <a href="/watches" className="hover:text-[#1A1A1A] transition-colors">Watches</a>
              <a href="/shoes" className="hover:text-[#1A1A1A] transition-colors">Shoes</a>
              <a href="/jewelry" className="hover:text-[#1A1A1A] transition-colors">Jewelry</a>
              <a href="/belts" className="hover:text-[#1A1A1A] transition-colors">Belts</a>
              <a href="/scarves" className="hover:text-[#1A1A1A] transition-colors">Scarves</a>
              <a href="/brands" className="hover:text-[#1A1A1A] transition-colors">Value Guide</a>
              <a href="/contact" className="hover:text-[#1A1A1A] transition-colors">Contact</a>
              <form action="/search" method="get" className="hidden sm:flex items-center">
                <input name="q" placeholder="Search..." className="border-0 border-b border-[#E8E2D9] bg-transparent text-sm px-2 py-1 w-28 focus:outline-none focus:border-[#B8954A] text-[#1A1A1A]" />
              </form>
            </nav>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-6 py-10 pb-24 sm:pb-10">
          {children}
        </main>
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
