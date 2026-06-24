"use client";

import { useFavorites } from "@/hooks/useFavorites";
import type { SavedProduct } from "@/lib/saved";

interface FavoriteButtonProps {
  productId: string;
  slug: string;
  name: string;
  brand: string;
  imageUrl: string;
  score: number;
  priceTHB: number;
  locale: string;
}

export function FavoriteButton({
  productId,
  slug,
  name,
  brand,
  imageUrl,
  score,
  priceTHB,
  locale,
}: FavoriteButtonProps) {
  const { items, toggle, isFavorited } = useFavorites();
  const favorited = isFavorited(productId);
  const isTh = locale === "th";

  function handleClick() {
    const product: SavedProduct = { productId, slug, name, brand, imageUrl, score, priceTHB };
    toggle(product);
  }

  return (
    <button
      onClick={handleClick}
      aria-label={favorited ? (isTh ? "ยกเลิกบันทึก" : "Remove from saved") : (isTh ? "บันทึก" : "Save")}
      aria-pressed={favorited}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-all active:scale-95 select-none ${
        favorited
          ? "border-rose-400 bg-rose-50 text-rose-600 hover:bg-rose-100"
          : "border-[#efe1db] bg-white text-[#8a7a76] hover:border-rose-300 hover:text-rose-500"
      }`}
    >
      <span aria-hidden="true" className="text-base leading-none">
        {favorited ? "♥" : "♡"}
      </span>
      <span>{isTh ? "บันทึก" : "Save"}</span>
      {items.length > 0 && (
        <span className="text-[10px] text-[#8a7a76] font-normal">
          ({items.length})
        </span>
      )}
    </button>
  );
}
