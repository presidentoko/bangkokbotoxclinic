import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { routing } from './i18n'

const intl = createMiddleware(routing)

/**
 * next-intl answers a path without a locale (`/compare/fendi-vs-gucci`) with
 * a 307 to `/en/...`. A temporary redirect tells Google to keep the old URL
 * on file and come back, so those URLs sat in Search Console as "Page with
 * redirect" — 104 of them in the 2026-10-01 export — instead of handing
 * their signals to the /en page. The mapping never changes, so say so: 308.
 *
 * The bare root stays temporary. `/` picks a locale from Accept-Language, and
 * that choice genuinely depends on who is asking.
 */
export default function middleware(req: NextRequest) {
  const res = intl(req)
  if (res.status === 307 && req.nextUrl.pathname !== '/') {
    const location = res.headers.get('location')
    if (location) return NextResponse.redirect(new URL(location, req.url), 308)
  }
  return res
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}
