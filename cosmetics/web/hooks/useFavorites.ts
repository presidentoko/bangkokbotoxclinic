"use client";

import { useState, useEffect, useCallback } from "react";
import type { SavedProduct } from "@/lib/saved";

const STORAGE_KEY = "bf_favorites";

function readStorage(): SavedProduct[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedProduct[];
  } catch {
    return [];
  }
}

function writeStorage(items: SavedProduct[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // private browsing / storage quota — silently ignore
  }
}

export function useFavorites() {
  const [items, setItems] = useState<SavedProduct[]>([]);

  // Hydrate from localStorage on mount
  useEffect(() => {
    setItems(readStorage());
  }, []);

  const toggle = useCallback((product: SavedProduct) => {
    setItems((prev) => {
      const exists = prev.some((p) => p.productId === product.productId);
      const next = exists
        ? prev.filter((p) => p.productId !== product.productId)
        : [...prev, product];
      writeStorage(next);
      return next;
    });
  }, []);

  const isFavorited = useCallback(
    (productId: string) => items.some((p) => p.productId === productId),
    [items]
  );

  return { items, toggle, isFavorited };
}
