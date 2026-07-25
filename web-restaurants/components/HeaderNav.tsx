"use client";
import Link from "next/link";
import { useLocale } from "@/hooks/useLocale";
import { strings, tr } from "@/lib/strings";
import { localizedHubHref } from "@/lib/localizedHref";
import { LangSwitcher } from "@/components/LangSwitcher";
import { MobileMenu } from "@/components/MobileMenu";
import { SearchOverlay } from "@/components/SearchOverlay";

export function HeaderNav() {
  const locale = useLocale();
  return (
    <nav className="text-sm flex gap-4 md:gap-5 text-[var(--muted)] items-center">
      <Link href="/famous-vs-good" className="hover:text-[var(--fg)] font-medium text-[var(--accent)] hidden sm:inline">
        {tr(strings.common.snsCheck, locale)}
      </Link>
      <Link href={localizedHubHref("/c/thai", locale)} className="hover:text-[var(--fg)] hidden md:inline">
        {tr(strings.common.thai, locale)}
      </Link>
      <Link href="/best/halal" className="hover:text-[var(--fg)] hidden md:inline">
        {tr(strings.common.bestOf, locale)}
      </Link>
      <Link href="/guide" className="hover:text-[var(--fg)] hidden lg:inline">
        {tr(strings.common.guides, locale)}
      </Link>
      <Link href="/about" className="hover:text-[var(--fg)] hidden md:inline">
        {tr(strings.common.about, locale)}
      </Link>
      <Link
        href="/for-restaurants"
        className="px-3 py-1.5 rounded-full bg-[var(--fg)] text-white hover:opacity-80 text-xs font-bold hidden sm:inline-flex transition"
      >
        {tr(strings.common.forOwners, locale)}
      </Link>
      <SearchOverlay />
      <LangSwitcher />
      <MobileMenu />
    </nav>
  );
}
