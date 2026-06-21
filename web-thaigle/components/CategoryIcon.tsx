// 큐진(cuisine) 아이콘 — types.ts 의 CUISINE_ICONS 와 동일.
import { CUISINE_ICONS } from "@/lib/types";

export function CategoryIcon({ category, size = 16 }: { category: string; size?: number }) {
  const icon = CUISINE_ICONS[category] ?? "🍴";
  return (
    <span style={{ fontSize: size, lineHeight: 1 }} aria-hidden="true">
      {icon}
    </span>
  );
}
