"use client";

import { useSearchParams } from "next/navigation";
import { decodeWishlist } from "@/lib/wishlist";

export function SharedWishlistBanner() {
  const params = useSearchParams();
  const w = params.get("w");
  const items = w ? decodeWishlist(w) : [];

  if (items.length === 0) return null;

  return (
    <div className="mb-8 p-4 rounded-2xl bg-red-50 border border-red-200">
      <p className="text-sm text-red-900 font-bold mb-3">
        ❤️ A friend shared their Bangkok wishlist ({items.length} place{items.length !== 1 ? "s" : ""})
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {items.map((item) => (
          <a
            key={item.id}
            href={item.url}
            className="flex items-center gap-2 p-3 bg-white border border-[var(--border)] rounded-xl hover:border-red-300 hover:bg-red-50 transition group"
          >
            {item.icon && <span className="text-lg shrink-0">{item.icon}</span>}
            <div className="min-w-0">
              <div className="text-xs font-bold truncate group-hover:text-red-700 transition">{item.name}</div>
              <div className="text-[10px] text-[var(--muted)] capitalize">{item.type}</div>
            </div>
          </a>
        ))}
      </div>
      <a href="/my-trip" className="mt-3 inline-block text-xs font-bold text-red-700 hover:underline">
        Start your own wishlist →
      </a>
    </div>
  );
}
