import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { setRequestLocale } from 'next-intl/server'
import { getPairs, getPair, ValueModel, GRADE_LABEL, Grade, usd, pct } from '@/lib/value'

const BASE = 'https://www.chicpreowned.com'

interface Props { params: Promise<{ locale: string; pair: string }> }

export function generateStaticParams() {
  return getPairs().flatMap(p => ['en', 'th'].map(locale => ({ locale, pair: p.slug })))
}

export const dynamicParams = false

const name = (m: ValueModel) => `${m.brand} ${m.name}`

function verdict(a: ValueModel, b: ValueModel, th: boolean): string {
  if (a.retention != null && b.retention != null) {
    const [hi, lo] = a.retention >= b.retention ? [a, b] : [b, a]
    const diff = Math.round(hi.retention! - lo.retention!)
    if (diff < 5) {
      return th
        ? `ทั้งสองรุ่นรักษามูลค่าใกล้เคียงกัน (${pct(a.retention)} กับ ${pct(b.retention)} ของราคาป้าย)`
        : `They hold value about equally: ${name(a)} resells at ${pct(a.retention)} of retail, ${name(b)} at ${pct(b.retention)}.`
    }
    return th
      ? `${name(hi)} รักษามูลค่าได้ดีกว่า: ขายต่อได้ ${pct(hi.retention)} ของราคาป้าย เทียบกับ ${pct(lo.retention)} ของ ${name(lo)}`
      : `${name(hi)} holds its value better — it resells at ${pct(hi.retention)} of retail against ${pct(lo.retention)} for the ${name(lo)}.`
  }
  return th
    ? `${name(a)} ขายได้ราคากลาง ${usd(a.resale.median)} ส่วน ${name(b)} ${usd(b.resale.median)}`
    : `${name(a)} sells for a median ${usd(a.resale.median)} pre-owned; the ${name(b)}, ${usd(b.resale.median)}.`
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, pair } = await params
  setRequestLocale(locale)
  const p = getPair(pair)
  if (!p) return {}
  const th = locale === 'th'
  const path = `/value/compare/${pair}`
  return {
    title: th
      ? `${name(p.a)} หรือ ${name(p.b)} — รุ่นไหนขายต่อได้ดีกว่า`
      : `${name(p.a)} vs ${name(p.b)}: Which Holds Its Value Better?`,
    description: verdict(p.a, p.b, th),
    alternates: {
      canonical: `${BASE}/${locale}${path}`,
      languages: { en: `${BASE}/en${path}`, th: `${BASE}/th${path}`, 'x-default': `${BASE}/en${path}` },
    },
  }
}

export default async function ComparePage({ params }: Props) {
  const { locale, pair } = await params
  setRequestLocale(locale)
  const p = getPair(pair)
  if (!p) notFound()
  const th = locale === 'th'
  const L = (en: string, thai: string) => (th ? thai : en)
  const { a, b } = p
  const rows: { label: string; a: string; b: string }[] = [
    { label: L('US retail', 'ราคาป้าย'), a: usd(a.retail?.usd), b: usd(b.retail?.usd) },
    { label: L('Median sold', 'ขายได้ (กลาง)'), a: usd(a.resale.median), b: usd(b.resale.median) },
    { label: L('Of retail', 'เทียบราคาป้าย'), a: pct(a.retention), b: pct(b.retention) },
    ...(['A', 'B', 'C'] as Grade[]).map(g => ({
      label: th ? GRADE_LABEL[g].th : GRADE_LABEL[g].en,
      a: usd(a.grades[g]?.median),
      b: usd(b.grades[g]?.median),
    })),
    { label: L('Asking now (median)', 'ราคาตั้งขายตอนนี้'), a: usd(a.live?.median), b: usd(b.live?.median) },
    { label: L('Sales counted', 'จำนวนการขาย'), a: String(a.resale.n), b: String(b.resale.n) },
  ]
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <p className="text-sm text-[#9C8B7A] mb-2">
        <Link href={`/${locale}`}>{L('Home', 'หน้าแรก')}</Link> › <Link href={`/${locale}/value`}>{L('Resale value', 'มูลค่าขายต่อ')}</Link>
      </p>
      <h1 className="text-3xl font-serif mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>
        {th ? `${name(a)} หรือ ${name(b)}: รุ่นไหนขายต่อได้ดีกว่า` : `${name(a)} vs ${name(b)}: resale value`}
      </h1>
      <p className="text-lg mb-6">{verdict(a, b, th)}</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[420px]">
          <thead className="text-left text-[#6B6052] border-b border-[#E8E2D9]">
            <tr>
              <th className="py-2" />
              <th><Link className="underline" href={`/${locale}/value/${a.slug}`}>{name(a)}</Link></th>
              <th><Link className="underline" href={`/${locale}/value/${b.slug}`}>{name(b)}</Link></th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.label} className="border-b border-[#F0EBE3]">
                <td className="py-2 text-[#6B6052]">{r.label}</td><td>{r.a}</td><td>{r.b}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-[#6B6052] mt-8">
        {L(`Sold listings on Vestiaire Collective's US marketplace, matched by size; retail prices are linked to their source on each model's page. Data ${a.generated}.`,
           `ข้อมูลรายการที่ขายแล้วบน Vestiaire Collective สหรัฐ จับคู่ตามขนาด ข้อมูล ${a.generated}`)}
      </p>
    </main>
  )
}
