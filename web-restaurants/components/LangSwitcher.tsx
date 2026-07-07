"use client";
import { usePathname, useRouter } from "next/navigation";

const COOKIE = "NEXT_LOCALE";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function setLocaleCookie(locale: string) {
  document.cookie = `${COOKIE}=${locale};path=/;max-age=${COOKIE_MAX_AGE};samesite=lax`;
}

// Route types that have real th/ko hub-page translations: /c/[cuisine], /d/[district], /city/[name]
const LOCALIZED_HUB = /^\/(c|d|city)\/[^/]+\/?$/;

// Map current path to target locale's equivalent path
function localePath(pathname: string, target: "en" | "th" | "ko"): string {
  // Strip existing locale prefix
  const stripped = pathname.replace(/^\/(th|ko)(\/|$)/, "/");
  if (target === "en") return stripped || "/";
  // th/ko have real translations for cuisine/district/city hub pages — keep those in place.
  if (LOCALIZED_HUB.test(stripped)) return `/${target}${stripped}`;
  // Everything else (restaurants, best/, guides, etc.) has no locale version yet — go to locale home.
  return `/${target}`;
}

export function LangSwitcher() {
  const path = usePathname();
  const router = useRouter();
  const isKo = path === "/ko" || path.startsWith("/ko/");
  const isTh = path === "/th" || path.startsWith("/th/");
  const isEn = !isKo && !isTh;

  function switchLang(locale: "en" | "th" | "ko") {
    setLocaleCookie(locale);
    router.push(localePath(path, locale));
  }

  const cls = (active: boolean) =>
    `min-h-[44px] min-w-[36px] px-1.5 flex items-center justify-center transition ${active ? "font-bold text-[var(--accent)]" : "hover:text-[var(--fg)]"}`;

  return (
    <span className="text-xs text-[var(--muted)] flex items-center">
      <button onClick={() => switchLang("en")} className={cls(isEn)}>EN</button>
      <button onClick={() => switchLang("th")} className={cls(isTh)}>TH</button>
      <button onClick={() => switchLang("ko")} className={cls(isKo)}>KO</button>
    </span>
  );
}
