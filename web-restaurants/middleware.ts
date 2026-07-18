import { NextRequest, NextResponse } from "next/server";

const LOCALES = ["th", "ko"] as const;
type Locale = (typeof LOCALES)[number];
const COOKIE = "NEXT_LOCALE";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

// Bots — do not redirect, serve URL as-is
const BOT_RE =
  /Googlebot|bingbot|Slurp|DuckDuckBot|Baiduspider|YandexBot|Sogou|Exabot|facebot|ia_archiver|GPTBot|OAI-SearchBot|PerplexityBot|ClaudeBot|Claude-Web|Google-Extended/i;

function getLocaleFromPath(pathname: string): Locale | null {
  for (const l of LOCALES) {
    if (pathname === `/${l}` || pathname.startsWith(`/${l}/`)) return l;
  }
  return null;
}

function getLocaleFromCookie(req: NextRequest): Locale | null {
  const v = req.cookies.get(COOKIE)?.value;
  if (v && (LOCALES as readonly string[]).includes(v)) return v as Locale;
  return null;
}

function getLocaleFromAcceptLanguage(req: NextRequest): Locale | null {
  const accept = req.headers.get("accept-language") ?? "";
  const langs = accept
    .split(",")
    .map((s) => s.split(";")[0].trim().toLowerCase().slice(0, 2));
  if (langs.includes("ko")) return "ko";
  if (langs.includes("th")) return "th";
  return null;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // www unification is handled at the Vercel domain level (apex -> www, 308) —
  // do not duplicate it here, it would cost a Fluid Function invocation on
  // every request for a redirect that already happens at the edge.

  // Skip bots — serve URL as-is, no redirect
  const ua = req.headers.get("user-agent") ?? "";
  if (BOT_RE.test(ua)) return NextResponse.next();

  const pathLocale = getLocaleFromPath(pathname);

  // If URL already has a locale prefix, record it in cookie and continue
  if (pathLocale) {
    const res = NextResponse.next();
    res.cookies.set(COOKIE, pathLocale, {
      path: "/",
      maxAge: COOKIE_MAX_AGE,
      sameSite: "lax",
    });
    return res;
  }

  // Root path — check cookie first, then Accept-Language
  const cookieLocale = getLocaleFromCookie(req);
  if (cookieLocale) {
    const url = req.nextUrl.clone();
    url.pathname = `/${cookieLocale}`;
    return NextResponse.redirect(url, 302);
  }
  // User explicitly chose English — respect it, skip Accept-Language redirect
  if (req.cookies.get(COOKIE)?.value === "en") {
    return NextResponse.next();
  }
  const acceptLocale = getLocaleFromAcceptLanguage(req);
  if (acceptLocale) {
    // First-time visitor auto-detect — set cookie and redirect
    const url = req.nextUrl.clone();
    url.pathname = `/${acceptLocale}`;
    const res = NextResponse.redirect(url, 302);
    res.cookies.set(COOKIE, acceptLocale, {
      path: "/",
      maxAge: COOKIE_MAX_AGE,
      sameSite: "lax",
    });
    return res;
  }

  return NextResponse.next();
}

// Only the root and locale-prefixed paths need this logic — every other
// route (restaurant/c/d/city/best/guide/famous-vs-good, ~8k prebuilt pages)
// must never invoke middleware at all; that was the single largest source
// of Fluid Active CPU usage on the hobby plan.
export const config = {
  matcher: ["/", "/th", "/th/:path*", "/ko", "/ko/:path*"],
};
