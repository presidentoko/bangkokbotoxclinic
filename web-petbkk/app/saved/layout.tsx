import type { Metadata } from 'next'

// This page renders a visitor's personal bookmarks from localStorage. There is
// no server-renderable content for a crawler (the page intentionally renders
// nothing until client-side hydration resolves what, if anything, is saved),
// so it should never be indexed — Google was flagging it as a soft 404 because
// it always sees an effectively empty page here.
export const metadata: Metadata = {
  title: 'รายการที่บันทึก',
  robots: {
    index: false,
    follow: true,
  },
}

export default function SavedLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
