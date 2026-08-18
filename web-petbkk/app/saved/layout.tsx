import type { Metadata } from 'next'

/**
 * /saved renders whatever is in this visitor's localStorage, so to Googlebot —
 * which has none — it is a permanently empty page. It is linked from the global
 * nav, so it gets crawled anyway and lands in "Crawled - currently not indexed".
 * Being a client component it cannot export metadata itself, hence this layout.
 * `follow` is kept so the nav links it carries still pass through.
 */
export const metadata: Metadata = {
  title: 'รายการที่บันทึกไว้',
  description: 'โรงพยาบาลสัตว์และอาหารสัตว์เลี้ยงที่คุณบันทึกไว้บนอุปกรณ์นี้',
  alternates: { canonical: 'https://www.thailandpethub.com/saved' },
  robots: { index: false, follow: true },
}

export default function SavedLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
