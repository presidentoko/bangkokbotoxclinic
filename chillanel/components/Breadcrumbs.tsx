import Link from "next/link";
import { SITE } from "@/lib/site";
import { BreadcrumbJsonLd } from "./JsonLd";

export type Crumb = { name: string; href: string };

export function Breadcrumbs({
  items,
  variant = "light",
}: {
  items: Crumb[];
  variant?: "light" | "ink";
}) {
  const isInk = variant === "ink";
  return (
    <nav
      aria-label="Breadcrumb"
      className={`mb-4 text-xs ${isInk ? "text-on-ink-muted" : "text-muted"}`}
    >
      <BreadcrumbJsonLd items={items.map((c) => ({ name: c.name, url: `${SITE.origin}${c.href}` }))} />
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => (
          <li key={item.href} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden="true">/</span>}
            {i === items.length - 1 ? (
              <span className={isInk ? "text-on-ink font-medium" : "text-fg font-medium"} aria-current="page">
                {item.name}
              </span>
            ) : (
              <Link
                href={item.href}
                className={isInk ? "hover:text-on-ink transition-colors" : "hover:text-accent transition-colors"}
              >
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
