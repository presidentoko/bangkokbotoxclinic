import { AttrGroup, ValueModel, GRADE_LABEL, usd, monthLabel } from '@/lib/value'

/**
 * What moves the price of this particular model, read off its own sales.
 *
 * Every sentence here is computed from the model's matched sold listings, so
 * no two pages say the same thing — which is the point: a value page that is
 * a template with numbers swapped in is the kind of page that sat in "Crawled
 * - currently not indexed" after the October launch. A difference under
 * MIN_GAP is reported as no reliable premium rather than dressed up as one.
 */
const MIN_GAP = 0.08

function pair(groups: AttrGroup[] | undefined, a: string, b: string) {
  const x = groups?.find(g => g.value === a)
  const y = groups?.find(g => g.value === b)
  return x && y ? { x, y, gap: x.median / y.median - 1 } : null
}

const pctAbs = (g: number) => `${Math.round(Math.abs(g) * 100)}%`

const COLOUR_TH: Record<string, string> = {
  Black: 'ดำ', Beige: 'เบจ', Brown: 'น้ำตาล', White: 'ขาว', Red: 'แดง', Blue: 'น้ำเงิน', Pink: 'ชมพู',
  Grey: 'เทา', Green: 'เขียว', Gold: 'ทอง', Silver: 'เงิน', Yellow: 'เหลือง', Orange: 'ส้ม',
  Purple: 'ม่วง', Burgundy: 'เบอร์กันดี', Navy: 'กรมท่า', Camel: 'คาเมล', Multicolour: 'หลายสี', Ecru: 'ครีม',
  Khaki: 'กากี', Turquoise: 'เทอร์ควอยซ์', Metallic: 'เมทัลลิก', Other: 'อื่นๆ',
}

export function PriceDrivers({ m, locale }: { m: ValueModel; locale: string }) {
  const th = locale === 'th'
  const L = (en: string, thai: string) => (th ? thai : en)
  const a = m.attributes ?? {}
  const name = `${m.brand} ${m.name}`
  const lines: string[] = []

  const hw = pair(a.hardware, 'gold', 'silver')
  if (hw) {
    lines.push(Math.abs(hw.gap) >= MIN_GAP
      ? L(`${hw.gap > 0 ? 'Gold' : 'Silver'} hardware commands a premium on the ${m.name}: gold-hardware examples sold for a median ${usd(hw.x.median)} (${hw.x.n} sales) against ${usd(hw.y.median)} for silver (${hw.y.n}) — ${pctAbs(hw.gap)} ${hw.gap > 0 ? 'more' : 'less'}.`,
          `ฮาร์ดแวร์${hw.gap > 0 ? 'ทอง' : 'เงิน'}ขายได้ราคาดีกว่า: ทองราคากลาง ${usd(hw.x.median)} (${hw.x.n} ครั้ง) เทียบกับเงิน ${usd(hw.y.median)} (${hw.y.n} ครั้ง) ต่างกัน ${pctAbs(hw.gap)}`)
      : L(`Hardware colour makes little difference: gold and silver sold within ${pctAbs(hw.gap)} of each other (${usd(hw.x.median)} vs ${usd(hw.y.median)}, ${hw.x.n} and ${hw.y.n} sales).`,
          `สีฮาร์ดแวร์แทบไม่มีผล: ทองกับเงินขายได้ต่างกันเพียง ${pctAbs(hw.gap)} (${usd(hw.x.median)} กับ ${usd(hw.y.median)})`))
  }
  const fs = pair(a.full_set, 'with box or receipt', 'not mentioned')
  if (fs) {
    lines.push(Math.abs(fs.gap) >= MIN_GAP && fs.gap > 0
      ? L(`Paperwork pays: listings mentioning the box or receipt sold for a median ${usd(fs.x.median)} (${fs.x.n} sales) against ${usd(fs.y.median)} for those that didn't — ${pctAbs(fs.gap)} more. Keep them if you plan to sell.`,
          `กล่องหรือใบเสร็จช่วยให้ขายได้ราคาดีขึ้น: ราคากลาง ${usd(fs.x.median)} (${fs.x.n} ครั้ง) เทียบกับ ${usd(fs.y.median)} ถ้าไม่ระบุ มากกว่า ${pctAbs(fs.gap)} ถ้าคิดจะขายต่อควรเก็บไว้`)
      : L(`Box and receipt made no reliable difference in these sales (${usd(fs.x.median)} with, ${usd(fs.y.median)} without; ${fs.x.n} and ${fs.y.n} sales).`,
          `กล่องและใบเสร็จไม่ได้ทำให้ราคาต่างกันชัดเจนในข้อมูลนี้ (${usd(fs.x.median)} กับ ${usd(fs.y.median)})`))
  }
  const vt = pair(a.vintage, 'vintage', 'not mentioned')
  if (vt) {
    lines.push(Math.abs(vt.gap) >= MIN_GAP
      ? L(`Listings described as vintage sold for a median ${usd(vt.x.median)} (${vt.x.n} sales), ${pctAbs(vt.gap)} ${vt.gap > 0 ? 'above' : 'below'} the ${usd(vt.y.median)} for the rest.`,
          `รายการที่ระบุว่าวินเทจขายได้ราคากลาง ${usd(vt.x.median)} (${vt.x.n} ครั้ง) ${vt.gap > 0 ? 'สูงกว่า' : 'ต่ำกว่า'}ที่เหลือ ${pctAbs(vt.gap)}`)
      : L(`Vintage examples sold at about the same price as recent ones (${usd(vt.x.median)} vs ${usd(vt.y.median)}).`,
          `ของวินเทจขายได้ราคาใกล้เคียงกับรุ่นใหม่ (${usd(vt.x.median)} กับ ${usd(vt.y.median)})`))
  }
  const colours = (a.colour ?? []).filter(c => c.value !== 'Other')
  if (colours.length >= 2) {
    const sorted = [...colours].sort((p, q) => q.median - p.median)
    const top = sorted[0], low = sorted[sorted.length - 1], common = colours[0]
    const gap = top.median / low.median - 1
    const cn = (c: string) => (th ? COLOUR_TH[c] ?? c : c.toLowerCase())
    lines.push(gap >= MIN_GAP
      ? L(`${common.value} is the most traded colour (${common.n} of ${m.resale.n} sales, median ${usd(common.median)}). The highest median was ${cn(top.value)} at ${usd(top.median)}; the lowest, ${cn(low.value)} at ${usd(low.median)} — a ${pctAbs(gap)} spread.`,
          `สี${cn(common.value)}ซื้อขายมากที่สุด (${common.n} จาก ${m.resale.n} ครั้ง ราคากลาง ${usd(common.median)}) สีที่ขายได้ราคาสูงสุดคือ${cn(top.value)} ${usd(top.median)} ต่ำสุดคือ${cn(low.value)} ${usd(low.median)} ต่างกัน ${pctAbs(gap)}`)
      : L(`Colour barely moves the price: every colour with five or more sales landed within ${pctAbs(gap)} of the others.`,
          `สีแทบไม่มีผลต่อราคา: ทุกสีที่ขายได้ 5 ครั้งขึ้นไปอยู่ในช่วงต่างกันไม่เกิน ${pctAbs(gap)}`))
  }

  const ex = m.examples.filter(e => e.month)
  if (lines.length === 0 && ex.length === 0) return null

  return (
    <section className="mb-10">
      {lines.length > 0 && (
        <>
          <h2 className="text-2xl font-serif mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
            {L(`What moves the price of a ${name}`, `อะไรทำให้ราคา ${name} ต่างกัน`)}
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-[15px] leading-relaxed">
            {lines.map(l => <li key={l}>{l}</li>)}
          </ul>
          {colours.length >= 2 && (
            <table className="w-full text-sm mt-4">
              <thead className="text-left text-[#6B6052]"><tr><th className="py-1">{L('Colour', 'สี')}</th><th>{L('Sales', 'จำนวน')}</th><th>{L('Median sold', 'ราคากลาง')}</th></tr></thead>
              <tbody>
                {colours.map(c => (
                  <tr key={c.value} className="border-t border-[#E8E2D9]">
                    <td className="py-1">{th ? COLOUR_TH[c.value] ?? c.value : c.value}</td><td>{c.n}</td><td>{usd(c.median)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
      {ex.length > 0 && (
        <>
          <h3 className="text-lg font-medium mt-6 mb-2">{L('Recent sales', 'การขายล่าสุด')}</h3>
          <table className="w-full text-sm">
            <thead className="text-left text-[#6B6052]"><tr><th className="py-1">{L('Listed', 'ลงขาย')}</th><th>{L('Colour', 'สี')}</th><th>{L('Condition', 'สภาพ')}</th><th>{L('Sold for', 'ขายได้')}</th></tr></thead>
            <tbody>
              {ex.map(e => (
                <tr key={e.link} className="border-t border-[#E8E2D9]">
                  <td className="py-1">{monthLabel(e.month!, locale)}</td>
                  <td>{e.colour ? (th ? COLOUR_TH[e.colour] ?? e.colour : e.colour) : '—'}</td>
                  <td>{e.grade ? (th ? GRADE_LABEL[e.grade].th : GRADE_LABEL[e.grade].en) : '—'}</td>
                  <td><a className="underline" href={`https://us.vestiairecollective.com${e.link}`} rel="nofollow noopener" target="_blank">{usd(e.price)}</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </section>
  )
}
