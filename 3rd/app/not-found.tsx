import Link from 'next/link'

// Renders for requests that fall outside the /en and /th segments entirely
// (e.g. a garbage path with no locale prefix), so it can't rely on next-intl
// translations or the fonts loaded in app/[locale]/layout.tsx — just the
// global stylesheet imported by app/layout.tsx and the site's Tailwind palette.
export default function NotFound() {
  return (
    <html lang="en">
      <body className="bg-[#FAFAF9] text-[#1A1A1A] font-sans">
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="text-center max-w-sm">
            <p className="text-xs tracking-[0.2em] uppercase text-[#B8954A] mb-4">Chic Preowned</p>
            <h1 className="text-6xl font-semibold text-[#1A1A1A] mb-4">404</h1>
            <p className="text-[#6B6052] mb-8">หน้านี้ไม่มีอยู่ / Page not found</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link
                href="/en"
                className="bg-[#1A1A1A] text-white px-6 py-2.5 rounded text-sm font-medium hover:bg-[#B8954A] transition-colors"
              >
                English
              </Link>
              <Link
                href="/th"
                className="border border-[#E8E2D9] text-[#1A1A1A] px-6 py-2.5 rounded text-sm font-medium hover:border-[#B8954A] hover:text-[#B8954A] transition-colors"
              >
                ภาษาไทย
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
