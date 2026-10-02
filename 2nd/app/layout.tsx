import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import Link from 'next/link'
import './globals.css'
import { EmailCapture } from '@/components/EmailCapture'
import { MobileMenu } from '@/components/MobileMenu'

// Tools only. The price catalogue this domain used to duplicate lives on
// chicpreowned.com; this site is the calculators that run on its data.
const NAV_LINKS = [
  { href: '/calculator/resale-value', label: 'Resale Value' },
  { href: '/calculator/retail-vs-resale', label: 'New vs Used' },
  { href: '/calculator/depreciation', label: 'Worth Now' },
  { href: '/checklist/authenticity', label: 'Authenticity' },
  { href: '/sizes/chanel', label: 'Sizes' },
]

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: 'Second Luxury Items — Designer Resale Calculators & Checklists',
  description: 'Free tools for buying and selling pre-owned designer bags: resale value calculator, new vs pre-owned cost calculator, authenticity checklist and size guides, from real sale prices.',
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
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-[#FAFAF9] text-[#1A1A1A]`}>
        <header className="bg-[#FAFAF9] border-b border-[#E8E2D9] relative">
          <div className="max-w-5xl mx-auto px-6 py-5 flex items-center gap-4 justify-between">
            <Link href="/" className="font-serif text-xl tracking-wider text-[#1A1A1A] shrink-0" style={{ fontFamily: 'var(--font-playfair)' }}>
              Second Luxury Items
            </Link>
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
              {NAV_LINKS.map(l => (
                <Link key={l.href} href={l.href} className="hover:text-[#1A1A1A] transition-colors">{l.label}</Link>
              ))}
              <Link href="/contact" className="hover:text-[#1A1A1A] transition-colors">Contact</Link>
              <a href="https://www.chicpreowned.com/en/value" className="hover:text-[#1A1A1A] transition-colors">Resale value database ↗</a>
            </div>
            <p>Figures are medians of real sold listings, from the <a className="underline" href="https://www.chicpreowned.com/en/value">chicpreowned.com resale value database</a>. Not an offer to buy or sell.</p>
            <p className="mt-1">© {new Date().getFullYear()} SecondLuxuryItems.com</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
