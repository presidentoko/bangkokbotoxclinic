'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export function LocaleSwitcher({ locale }: { locale: string }) {
  const pathname = usePathname()
  const otherLocale = locale === 'en' ? 'th' : 'en'
  // Replace the locale prefix: /en/foo/bar → /th/foo/bar
  const otherPath = pathname.replace(/^\/[a-z]{2}/, `/${otherLocale}`)
  return (
    <Link
      href={otherPath}
      className="ml-2 px-2 py-1 border border-gray-300 rounded text-xs hover:bg-gray-50"
    >
      {otherLocale === 'th' ? 'ภาษาไทย' : 'English'}
    </Link>
  )
}
