import Link from "next/link";
import type { Lang } from "@/lib/site";
import type { ThemeCount } from "@/lib/types";
import { themeLabel, slugifyTheme } from "@/lib/theme-labels";

export function TagCloud({
  items,
  lang,
  max = 12,
  linkToService = false,
}: {
  items: ThemeCount[];
  lang: Lang;
  max?: number;
  linkToService?: boolean;
}) {
  const top = items.slice(0, max);
  if (top.length === 0) return null;
  const maxCount = top[0]?.count ?? 1;

  return (
    <div className="flex flex-wrap gap-2">
      {top.map((item) => {
        const ratio = maxCount > 0 ? item.count / maxCount : 0;
        const scale = 0.85 + ratio * 0.5;
        const label = themeLabel(item.label, lang);
        const pillClass =
          "inline-block rounded-full border border-border px-3 py-1 text-muted font-medium transition-colors" +
          (linkToService ? " hover:border-accent-warm hover:text-accent-warm" : "");
        const content = (
          <span className={pillClass} style={{ fontSize: `${scale * 0.8125}rem` }}>
            {label} <span className="text-accent-warm font-semibold">{item.count}</span>
          </span>
        );
        return linkToService ? (
          <Link key={item.label} href={`/${lang}/service/${slugifyTheme(item.label)}`}>
            {content}
          </Link>
        ) : (
          <span key={item.label}>{content}</span>
        );
      })}
    </div>
  );
}
