"use client";

const COOKIE = "NEXT_LOCALE";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

// Plain <a href="/"> gets bounced right back by middleware while the th/ko
// cookie is still set, so this clears it to "en" before navigating.
export function EnHomeLink({ children }: { children: React.ReactNode }) {
  return (
    <a
      href="/"
      className="underline hover:text-[var(--fg)]"
      onClick={() => {
        document.cookie = `${COOKIE}=en;path=/;max-age=${COOKIE_MAX_AGE};samesite=lax`;
      }}
    >
      {children}
    </a>
  );
}
