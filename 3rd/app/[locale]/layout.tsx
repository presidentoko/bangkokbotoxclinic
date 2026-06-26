import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'
import '../globals.css'

const inter = Inter({ subsets: ['latin', 'latin-ext'] })

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
      <body className={`${inter.className} bg-white text-gray-900`}>
        <NextIntlClientProvider messages={messages}>
          <header className="border-b border-gray-100">
            <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
              <a href={`/${locale}`} className="font-semibold text-lg tracking-tight">
                {t('site_name')}
              </a>
              <nav className="flex gap-4 text-sm text-gray-600 items-center">
                <a href={`/${locale}/handbags`} className="hover:text-gray-900">{t('nav_handbags')}</a>
                <a href={`/${locale}/watches`} className="hover:text-gray-900">{t('nav_watches')}</a>
                <a href={`/${locale}/clothing`} className="hover:text-gray-900">{t('nav_clothing')}</a>
                <LocaleSwitcher locale={locale} />
              </nav>
            </div>
          </header>
          <main className="max-w-4xl mx-auto px-4 py-8 pb-20 sm:pb-0">
            {children}
          </main>
          <footer className="border-t border-gray-100 mt-16">
            <div className="max-w-4xl mx-auto px-4 py-6 text-sm text-gray-400">
              <p>{t('footer_disclaimer')}</p>
              <p className="mt-1">{t('footer_copyright', { year: new Date().getFullYear() })}</p>
            </div>
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
