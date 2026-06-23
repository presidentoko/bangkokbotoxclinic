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
  const { pathname, host, protocol } = req.nextUrl;

  // www 통일 — non-www → www 301
  if (host === "snsstopper.com") {
    const url = req.nextUrl.clone();
    url.host = "www.snsstopper.com";
    return NextResponse.redirect(url, 301);
  }

  // Skip static files, API, Next internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") // static assets
  ) {
    return NextResponse.next();
  }

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

  // Root or non-locale path — check cookie first, then Accept-Language
  if (pathname === "/") {
    const cookieLocale = getLocaleFromCookie(req);
    if (cookieLocale) {
      return NextResponse.redirect(new URL(`/${cookieLocale}`, req.url), 302);
    }
    const acceptLocale = getLocaleFromAcceptLanguage(req);
    if (acceptLocale) {
      // First-time visitor auto-detect — set cookie and redirect
      const res = NextResponse.redirect(new URL(`/${acceptLocale}`, req.url), 302);
      res.cookies.set(COOKIE, acceptLocale, {
        path: "/",
        maxAge: COOKIE_MAX_AGE,
        sameSite: "lax",
      });
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
