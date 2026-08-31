import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'
import { SiteSearch } from '@/components/SiteSearch'
import { MobileMenu } from '@/components/MobileMenu'
import { EmailCapture } from '@/components/EmailCapture'
import { getSearchIndex } from '@/lib/data'
import '../globals.css'

const inter = Inter({ subsets: ['latin', 'latin-ext'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

interface Props {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'common' })
  return {
    metadataBase: new URL('https://www.chicpreowned.com'),
    title: t('page_title_home'),
    description: t('page_meta_home'),
    manifest: '/manifest.webmanifest',
    twitter: {
      card: 'summary_large_image',
      site: '@chicpreowned',
    },
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  if (!routing.locales.includes(locale as 'en' | 'th')) notFound()
  setRequestLocale(locale)
  const messages = await getMessages()
  const t = await getTranslations({ locale, namespace: 'common' })
  const searchIndex = getSearchIndex()

  const navLinks = [
    { href: `/${locale}/handbags`, label: t('nav_handbags') },
    { href: `/${locale}/watches`, label: t('nav_watches') },
    { href: `/${locale}/brands`, label: locale === 'th' ? 'แบรนด์' : 'Brands' },
    // Seller intent gets a top-level slot: it is a different visitor with a
    // different question, and the pages behind it are invisible to crawlers
    // if nothing links to them.
    { href: `/${locale}/sell`, label: locale === 'th' ? 'ขายของ' : 'Sell' },
    { href: `/${locale}/value-guide`, label: locale === 'th' ? 'คู่มือมูลค่า' : 'Value Guide' },
    { href: `/${locale}/guides`, label: t('nav_guides') },
    { href: `/${locale}/clothing`, label: t('nav_clothing') },
    { href: `/${locale}/contact`, label: locale === 'th' ? 'ติดต่อ' : 'Contact' },
  ]

  return (
    <html lang={locale}>
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-[#FAFAF9] text-[#1A1A1A]`}>
        <NextIntlClientProvider messages={messages}>
          <header className="bg-[#FAFAF9] border-b border-[#E8E2D9] relative">
            <div className="max-w-5xl mx-auto px-6 py-5 flex items-center gap-4 justify-between">
              <a href={`/${locale}`} className="font-serif text-xl tracking-wider text-[#1A1A1A] shrink-0" style={{ fontFamily: 'var(--font-playfair)' }}>
                {t('site_name')}
              </a>
              <SiteSearch items={searchIndex} locale={locale} />
              <nav className="hidden md:flex gap-6 text-sm text-[#6B6052] items-center tracking-wide uppercase shrink-0">
                {navLinks.map(link => (
                  <a key={link.href} href={link.href} className="hover:text-[#1A1A1A] transition-colors">{link.label}</a>
                ))}
                <LocaleSwitcher locale={locale} />
              </nav>
              <MobileMenu locale={locale} links={navLinks} />
            </div>
          </header>
          <main className="max-w-5xl mx-auto px-6 py-10 pb-24 sm:pb-10">
            {children}
          </main>
          <EmailCapture locale={locale} />
          <footer className="border-t border-[#E8E2D9] mt-16">
            <div className="max-w-5xl mx-auto px-6 py-6 text-sm text-[#9C8B7A]">
              {/* The disclaimer makes a provenance claim; this is the link that
                  lets a reader check it. Previously it named two platforms that
                  do not exist. */}
              <p>
                {t('footer_disclaimer')}{' '}
                <a href={`/${locale}/dealers`} className="underline hover:text-[#6B6052]">
                  {locale === 'th' ? 'ดูแหล่งข้อมูลราคา' : 'See our price sources'}
                </a>
                {' · '}
                <a href={`/${locale}/dealer-terms`} className="underline hover:text-[#6B6052]">
                  {locale === 'th' ? 'คำย่อในประกาศขาย แปลว่าอะไร' : 'What listing jargon means'}
                </a>
              </p>
              <p className="mt-1">{t('footer_copyright', { year: new Date().getFullYear() })}</p>
            </div>
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
