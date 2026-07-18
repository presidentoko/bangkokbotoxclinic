import type { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getGuidePages, humanizeSlug } from '@/lib/site-pages'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'guides'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'hubs' })
  return {
    title: t('guides_title'),
    description: t('guides_meta'),
    alternates: {
      canonical: `${BASE}/${locale}/${SLUG}`,
      languages: {
        en: `${BASE}/en/${SLUG}`,
        th: `${BASE}/th/${SLUG}`,
        'x-default': `${BASE}/en/${SLUG}`,
      },
    },
  }
}

export default async function GuidesHubPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'hubs' })
  const tc = await getTranslations({ locale, namespace: 'common' })

  const guides = getGuidePages()

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{tc('home')}</Link>
        <span className="mx-2">/</span>
        <span>{t('nav_guides')}</span>
      </nav>

      <div className="flex gap-4 text-sm mb-8 border-b border-gray-200">
        <span className="pb-3 border-b-2 border-gray-900 font-medium text-gray-900">{t('nav_guides')}</span>
        <Link href={`/${locale}/compare`} className="pb-3 text-gray-500 hover:text-gray-800">{t('nav_compare')}</Link>
        <Link href={`/${locale}/trends`} className="pb-3 text-gray-500 hover:text-gray-800">{t('nav_trends')}</Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-3">{t('guides_title')}</h1>
      <p className="text-gray-500 mb-2">{t('guides_intro')}</p>
      <p className="text-sm text-gray-400 mb-10">{t('count_articles', { count: guides.length })}</p>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {guides.map(page => (
          <li key={page.path}>
            <Link
              href={`/${locale}${page.path}`}
              className="block px-4 py-3 border border-gray-200 rounded hover:border-gray-400 hover:bg-gray-50 transition-colors text-sm text-gray-800"
            >
              {humanizeSlug(page.path)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
