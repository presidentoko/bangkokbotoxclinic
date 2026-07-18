// This root layout intentionally does NOT render <html>/<body> — the nested
// app/[locale]/layout.tsx owns those (it needs the locale param to set
// `lang` and to load the site fonts). Routes outside the [locale] segment
// (app/page.tsx's redirect, and this segment's own not-found.tsx) still pass
// through this layout, so it must at least load the site's global styles —
// otherwise app/not-found.tsx renders with zero CSS applied.
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
