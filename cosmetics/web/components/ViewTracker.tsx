"use client";

import { useEffect } from "react";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import type { SavedProduct } from "@/lib/saved";

interface ViewTrackerProps {
  productId: string;
  slug: string;
  name: string;
  brand: string;
  imageUrl: string;
  score: number;
  priceTHB: number;
}

export function ViewTracker({
  productId,
  slug,
  name,
  brand,
  imageUrl,
  score,
  priceTHB,
}: ViewTrackerProps) {
  const { addItem } = useRecentlyViewed();

  useEffect(() => {
    const product: SavedProduct = { productId, slug, name, brand, imageUrl, score, priceTHB };
    addItem(product);
    // Only run once on mount — product identity props won't change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
