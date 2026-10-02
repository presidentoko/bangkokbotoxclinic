import type { Metadata } from 'next'
import Link from 'next/link'
import { setRequestLocale } from 'next-intl/server'
import { getValueModels, getRanking, usd, pct, VALUE_GENERATED, monthLabel, ValueModel } from '@/lib/value'

const BASE = 'https://www.chicpreowned.com'

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  setRequestLocale(locale)
  const th = locale === 'th'
  return {
    title: th
      ? 'มูลค่าขายต่อแบรนด์เนมมือสอง — ราคาขายจริงเทียบราคาป้าย'
      : 'Designer Resale Value Database — What Bags Actually Sell For vs Retail',
    description: th
      ? `ราคาขายจริงของกระเป๋า เครื่องประดับ และนาฬิกาแบรนด์เนม ${getValueModels().length} รุ่น เทียบกับราคาป้าย อัปเดตทุกเดือน`
      : `Sold prices for ${getValueModels().length} designer bags, jewellery and watches against their retail price, by condition, updated monthly.`,
    alternates: {
      canonical: `${BASE}/${locale}/value`,
      languages: { en: `${BASE}/en/value`, th: `${BASE}/th/value`, 'x-default': `${BASE}/en/value` },
    },
  }
}

export default async function ValueHub({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const th = locale === 'th'
  const L = (en: string, thai: string) => (th ? thai : en)
  const models = getValueModels()
  const top = getRanking('value-retention').slice(0, 5)
  const bottom = getRanking('biggest-depreciation').slice(0, 5)

  const byBrand = new Map<string, ValueModel[]>()
  for (const m of models) byBrand.set(m.brand, [...(byBrand.get(m.brand) ?? []), m])
  const brands = [...byBrand.entries()].sort((a, b) => b[1].length - a[1].length)

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl sm:text-4xl font-serif mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>
        {L('Designer resale value', 'มูลค่าขายต่อแบรนด์เนม')}
      </h1>
      <p className="text-lg mb-2">
        {L(`What ${models.length} designer models actually sell for pre-owned, against what the boutique charges — by size and condition.`,
           `ราคาที่ ${models.length} รุ่นขายได้จริงในตลาดมือสอง เทียบกับราคาในช็อป แยกตามขนาดและสภาพ`)}
      </p>
      <p className="text-sm text-[#6B6052] mb-8">
        {L(`Sold listings on Vestiaire Collective · ${monthLabel(VALUE_GENERATED.slice(0, 7), locale)} · updated monthly`,
           `รายการที่ขายแล้วบน Vestiaire Collective · ${monthLabel(VALUE_GENERATED.slice(0, 7), locale)} · อัปเดตทุกเดือน`)}
      </p>

      {top.length > 0 && (
        <section className="grid sm:grid-cols-2 gap-6 mb-10">
          <div className="border border-[#E8E2D9] rounded-lg p-5 bg-white">
            <h2 className="font-serif text-xl mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>{L('Hold value best', 'รักษามูลค่าดีที่สุด')}</h2>
            <ol className="space-y-1 text-[15px]">
              {top.map(m => <li key={m.slug}><Link className="underline" href={`/${locale}/value/${m.slug}`}>{m.brand} {m.name}</Link> — {pct(m.retention)}</li>)}
            </ol>
            <Link className="text-sm underline mt-3 inline-block" href={`/${locale}/index/value-retention`}>{L('Full index', 'ดูทั้งหมด')} →</Link>
          </div>
          <div className="border border-[#E8E2D9] rounded-lg p-5 bg-white">
            <h2 className="font-serif text-xl mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>{L('Lose the most', 'เสียมูลค่ามากที่สุด')}</h2>
            <ol className="space-y-1 text-[15px]">
              {bottom.map(m => <li key={m.slug}><Link className="underline" href={`/${locale}/value/${m.slug}`}>{m.brand} {m.name}</Link> — {pct(m.retention)}</li>)}
            </ol>
            <Link className="text-sm underline mt-3 inline-block" href={`/${locale}/index/biggest-depreciation`}>{L('Full index', 'ดูทั้งหมด')} →</Link>
          </div>
        </section>
      )}

      {brands.map(([brand, list]) => (
        <section key={brand} className="mb-8">
          <h2 className="font-serif text-2xl mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>{brand}</h2>
          <table className="w-full text-sm">
            <tbody>
              {list.sort((a, b) => b.resale.n - a.resale.n).map(m => (
                <tr key={m.slug} className="border-t border-[#E8E2D9]">
                  <td className="py-2"><Link className="underline" href={`/${locale}/value/${m.slug}`}>{m.name}</Link></td>
                  <td>{usd(m.resale.median)}{m.basis === 'asking' ? <span className="text-[#9C8B7A]"> {L('asking', 'ตั้งขาย')}</span> : null}</td>
                  <td className="text-right">{m.retention != null ? `${pct(m.retention)} ${L('of retail', 'ของราคาป้าย')}` : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </main>
  )
}
