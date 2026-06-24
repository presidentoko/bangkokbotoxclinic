"use client";

import Image from "next/image";
import Link from "next/link";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { scoreColor } from "@/lib/format";

interface RecentlyViewedStripProps {
  locale: string;
}

export function RecentlyViewedStrip({ locale }: RecentlyViewedStripProps) {
  const { items, removeItem } = useRecentlyViewed();

  if (items.length === 0) return null;

  return (
    <div className="relative">
      <div
        className="flex gap-3 overflow-x-auto pb-3 snap-x snap-mandatory -mx-4 px-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((product) => (
          <div
            key={product.productId}
            className="relative flex-shrink-0 snap-start w-40"
          >
            {/* Remove button — min 44px tap target via padding, visually small */}
            <button
              onClick={() => removeItem(product.productId)}
              aria-label="Remove"
              className="absolute -top-2 -right-2 z-10 p-2.5 group"
            >
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/90 border border-[#efe1db] text-[#8a7a76] group-hover:border-rose-300 group-hover:text-rose-500 text-xs leading-none shadow-sm transition-colors">
                ×
              </span>
            </button>

            <Link
              href={`/${locale}/product/${product.slug}`}
              className="group flex flex-col gap-2 rounded-2xl bg-white border border-[#efe1db] p-3 hover:shadow-md hover:shadow-rose-100 hover:-translate-y-0.5 transition-all duration-200 h-full"
            >
              {/* Thumbnail */}
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-white border border-[#f5ebe7] flex items-center justify-center">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    sizes="160px"
                    className="object-contain p-1"
                  />
                ) : (
                  <div className="w-full h-full bg-rose-50 rounded-2xl" />
                )}
                {/* Score badge */}
                <span
                  className={`absolute top-1.5 left-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold border bg-white shadow-sm ${scoreColor(product.score)}`}
                >
                  {product.score}
                </span>
              </div>

              {/* Brand eyebrow */}
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#c9a86a] truncate">
                {product.brand}
              </p>

              {/* Name */}
              <p className="font-serif-display text-xs font-semibold text-[#2b2222] leading-snug line-clamp-2 group-hover:text-rose-500 transition-colors">
                {product.name}
              </p>

              {/* Price */}
              {product.priceTHB > 0 && (
                <p className="text-[10px] text-[#8a7a76] mt-auto">
                  ฿{Math.round(product.priceTHB).toLocaleString()}
                </p>
              )}
            </Link>
          </div>
        ))}
        {/* Spacer */}
        <div className="w-4 shrink-0" aria-hidden />
      </div>
      {/* Fade hint */}
      <div className="pointer-events-none absolute right-0 top-0 bottom-3 w-10 bg-gradient-to-l from-[#fbf4f1] to-transparent" />
    </div>
  );
}
