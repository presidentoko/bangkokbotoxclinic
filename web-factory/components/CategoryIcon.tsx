// 큐진(cuisine) 아이콘 — types.ts 의 CATEGORY_ICONS 와 동일.
import { CATEGORY_ICONS } from "@/lib/types";

export function CategoryIcon({ category, size = 16 }: { category: string; size?: number }) {
  const icon = CATEGORY_ICONS[category] ?? "🏭";
  return (
    <span style={{ fontSize: size, lineHeight: 1 }} aria-hidden="true">
      {icon}
    </span>
  );
}
