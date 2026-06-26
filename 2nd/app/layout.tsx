import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Second Luxury Items — Pre-Owned Luxury Price Guide',
  description: 'Find the real price of pre-owned Chanel, Louis Vuitton, Rolex and more. Compare second-hand luxury prices updated weekly.',
  metadataBase: new URL('https://www.secondluxuryitems.com'),
  openGraph: {
    siteName: 'SecondLuxuryItems.com',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.secondluxuryitems.com',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-gray-900`}>
        <header className="border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="font-semibold text-lg tracking-tight">
              Second Luxury Items
            </a>
            <nav className="flex gap-6 text-sm text-gray-600">
              <a href="/handbags" className="hover:text-gray-900">Handbags</a>
              <a href="/watches" className="hover:text-gray-900">Watches</a>
            </nav>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-8 pb-20 sm:pb-0">
          {children}
        </main>
        <footer className="border-t border-gray-100 mt-16">
          <div className="max-w-4xl mx-auto px-4 py-6 text-sm text-gray-400">
            <p>Prices are estimates based on recent market data. Always verify current listings before purchasing.</p>
            <p className="mt-1">© {new Date().getFullYear()} SecondLuxuryItems.com</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
