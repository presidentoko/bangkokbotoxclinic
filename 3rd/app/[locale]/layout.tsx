import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'
import '../globals.css'

const inter = Inter({ subsets: ['latin', 'latin-ext'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

interface Props {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
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
  const messages = await getMessages()
  const t = await getTranslations({ locale, namespace: 'common' })

  return (
    <html lang={locale}>
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-[#FAFAF9] text-[#1A1A1A]`}>
        <NextIntlClientProvider messages={messages}>
          <header className="bg-[#FAFAF9] border-b border-[#E8E2D9]">
            <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
              <a href={`/${locale}`} className="font-serif text-xl tracking-wider text-[#1A1A1A]" style={{ fontFamily: 'var(--font-playfair)' }}>
                {t('site_name')}
              </a>
              <nav className="flex gap-6 text-sm text-[#6B6052] items-center tracking-wide uppercase">
                <a href={`/${locale}/handbags`} className="hover:text-[#1A1A1A] transition-colors">{t('nav_handbags')}</a>
                <a href={`/${locale}/watches`} className="hover:text-[#1A1A1A] transition-colors">{t('nav_watches')}</a>
                <a href={`/${locale}/brands`} className="hover:text-[#1A1A1A] transition-colors">{locale === 'th' ? 'คู่มือมูลค่า' : 'Value Guide'}</a>
                <a href={`/${locale}/clothing`} className="hover:text-[#1A1A1A] transition-colors">{t('nav_clothing')}</a>
                <a href={`/${locale}/contact`} className="hover:text-[#1A1A1A] transition-colors">{locale === 'th' ? 'ติดต่อ' : 'Contact'}</a>
                <LocaleSwitcher locale={locale} />
              </nav>
            </div>
          </header>
          <main className="max-w-5xl mx-auto px-6 py-10 pb-24 sm:pb-10">
            {children}
          </main>
          <footer className="border-t border-[#E8E2D9] mt-16">
            <div className="max-w-5xl mx-auto px-6 py-6 text-sm text-[#9C8B7A]">
              <p>{t('footer_disclaimer')}</p>
              <p className="mt-1">{t('footer_copyright', { year: new Date().getFullYear() })}</p>
            </div>
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
