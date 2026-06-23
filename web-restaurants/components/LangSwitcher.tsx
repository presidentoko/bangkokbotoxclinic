"use client";
import { usePathname } from "next/navigation";

export function LangSwitcher() {
  const path = usePathname();
  const isKo = path === "/ko";
  const isTh = path === "/th";
  const isEn = !isKo && !isTh;

  const cls = (active: boolean) =>
    active
      ? "font-bold text-[var(--accent)]"
      : "hover:text-[var(--fg)]";

  return (
    <span className="text-xs text-[var(--muted)] flex items-center gap-2">
      <a href="/" className={cls(isEn)}>EN</a>
      <span aria-hidden="true">·</span>
      <a href="/th" className={cls(isTh)}>TH</a>
      <span aria-hidden="true">·</span>
      <a href="/ko" className={cls(isKo)}>KO</a>
    </span>
  );
}
