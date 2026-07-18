"use client";

import { useFavorites } from "@/hooks/useFavorites";

export function FavoritesBadge() {
  const { items } = useFavorites();
  if (items.length === 0) return null;

  return (
    <span
      className="absolute -top-1 -right-1 flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-bold leading-none"
      aria-hidden="true"
    >
      {items.length > 9 ? "9+" : items.length}
    </span>
  );
}
