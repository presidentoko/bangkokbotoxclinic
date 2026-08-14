"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Desktop header nav had no active-page indicator at all -- a visitor on
// /en/guide saw the exact same 5 links as one on /en/favorites, with no
// visual cue for where they were. Client component (usePathname) rather
// than something Header.tsx itself can compute, since these pages are
// 100% statically generated and Header is a server component with no
// access to the current route.
export function HeaderNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  // href is exactly "/{lang}" for the Home link, which is a string-prefix
  // of every other page's path -- so Home only matches exactly, while
  // every other link also matches its own sub-pages (e.g. "/en/guide"
  // should stay active on "/en/guide/couples-massage-in-bangkok").
  const isHome = /^\/[a-z]{2}$/.test(href);
  const active = isHome ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`transition-colors ${active ? "text-accent font-semibold" : "hover:text-accent"}`}
    >
      {children}
    </Link>
  );
}
