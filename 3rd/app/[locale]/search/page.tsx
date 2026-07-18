import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getSearchIndex } from '@/lib/data'
import { SearchPageClient } from '@/components/SearchPageClient'

interface Props {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ q?: string }>
}

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'search'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'search' })
  return {
    title: t('page_title'),
    description: t('page_meta'),
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

export default async function SearchPage({ params, searchParams }: Props) {
  const { locale } = await params
  const { q } = await searchParams
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'search' })
  const searchIndex = getSearchIndex()

  return (
    <>
      <h1
        className="font-serif text-4xl text-[#1A1A1A] mb-8"
        style={{ fontFamily: 'var(--font-playfair)' }}
      >
        {t('heading')}
      </h1>
      <SearchPageClient items={searchIndex} locale={locale} initialQuery={q ?? ''} />
    </>
  )
}
