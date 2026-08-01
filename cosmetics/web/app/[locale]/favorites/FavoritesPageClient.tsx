"use client";

import Image from "next/image";
import Link from "next/link";
import { useFavorites } from "@/hooks/useFavorites";
import { scoreColor } from "@/lib/format";

interface FavoritesPageClientProps {
  locale: string;
}

export function FavoritesPageClient({ locale }: FavoritesPageClientProps) {
  const { items, toggle } = useFavorites();
  const isTh = locale === "th";

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-widest text-[#c9a86a] font-medium">
          {isTh ? "บันทึกไว้" : "Saved"}
        </p>
        <h1 className="font-serif-display text-3xl font-semibold text-[#2b2222]">
          {isTh ? "สินค้าที่บันทึกไว้" : "Saved Products"}
        </h1>
        {items.length > 0 && (
          <p className="text-sm text-[#8a7a76]">
            {items.length} {isTh ? "รายการ" : "item" + (items.length !== 1 ? "s" : "")}
          </p>
        )}
      </div>

      {/* Empty state */}
      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
          <span className="text-5xl text-[#efe1db]" aria-hidden="true">♡</span>
          <p className="text-[#8a7a76] text-base max-w-xs leading-relaxed">
            {isTh
              ? "ยังไม่มีสินค้าที่บันทึกไว้ — แตะ ♡ บนสินค้าใดก็ได้เพื่อบันทึก"
              : "No saved products yet — tap ♡ on any product to save it"}
          </p>
          <Link
            href={`/${locale}`}
            className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-rose-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-600 transition-colors shadow-sm"
          >
            {isTh ? "ดูสินค้าทั้งหมด →" : "Browse products →"}
          </Link>
        </div>
      )}

      {/* Grid */}
      {items.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {items.map((product) => (
            <div key={product.productId} className="relative">
              {/* Remove button — visual circle stays small, but the tap target is
                  padded out to 44px so it doesn't take a precise tap to hit (and
                  isn't easily mis-tapped while reaching for the card underneath). */}
              <button
                onClick={() => toggle(product)}
                aria-label={isTh ? "ยกเลิกบันทึก" : "Remove from saved"}
                className="absolute top-0 right-0 z-10 w-11 h-11 flex items-center justify-center"
              >
                <span className="w-7 h-7 flex items-center justify-center rounded-full bg-white border border-[#efe1db] text-rose-400 hover:border-rose-400 hover:text-rose-600 text-base leading-none shadow-sm transition-colors">
                  ♥
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
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-contain p-2"
                    />
                  ) : (
                    <div className="w-full h-full bg-rose-50 rounded-2xl flex items-center justify-center">
                      <span className="text-neutral-300 text-3xl">✦</span>
                    </div>
                  )}
                  {/* Score badge */}
                  <span
                    className={`absolute top-2 left-2 rounded-full px-2 py-0.5 text-[10px] font-bold border bg-white shadow-sm ${scoreColor(product.score)}`}
                  >
                    {product.score}
                  </span>
                </div>

                {/* Brand eyebrow */}
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#c9a86a] truncate">
                  {product.brand}
                </p>

                {/* Name */}
                <p className="font-serif-display text-sm font-semibold text-[#2b2222] leading-snug line-clamp-2 group-hover:text-rose-500 transition-colors flex-1">
                  {product.name}
                </p>

                {/* Price */}
                {product.priceTHB > 0 && (
                  <p className="text-xs text-[#8a7a76] mt-auto">
                    ฿{Math.round(product.priceTHB).toLocaleString("en-US")}
                  </p>
                )}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
