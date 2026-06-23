"use client";
import { usePathname, useRouter } from "next/navigation";

const COOKIE = "NEXT_LOCALE";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function setLocaleCookie(locale: string) {
  document.cookie = `${COOKIE}=${locale};path=/;max-age=${COOKIE_MAX_AGE};samesite=lax`;
}

// Map current path to target locale's equivalent path
function localePath(pathname: string, target: "en" | "th" | "ko"): string {
  // Strip existing locale prefix
  const stripped = pathname.replace(/^\/(th|ko)(\/|$)/, "/");
  if (target === "en") return stripped || "/";
  // For th/ko: only home + sub-pages that exist. For non-home, go to locale home.
  // We only have locale-specific versions of the home page.
  if (stripped === "/") return `/${target}`;
  // Other pages don't have locale versions — send to locale home
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
    `transition ${active ? "font-bold text-[var(--accent)]" : "hover:text-[var(--fg)]"}`;

  return (
    <span className="text-xs text-[var(--muted)] flex items-center gap-2">
      <button onClick={() => switchLang("en")} className={cls(isEn)}>EN</button>
      <span aria-hidden="true">·</span>
      <button onClick={() => switchLang("th")} className={cls(isTh)}>TH</button>
      <span aria-hidden="true">·</span>
      <button onClick={() => switchLang("ko")} className={cls(isKo)}>KO</button>
    </span>
  );
}
