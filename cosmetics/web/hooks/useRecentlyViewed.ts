"use client";

import { useState, useEffect, useCallback } from "react";
import type { SavedProduct } from "@/lib/saved";

const STORAGE_KEY = "bf_recently_viewed";
const MAX_ITEMS = 10;

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

export function useRecentlyViewed() {
  const [items, setItems] = useState<SavedProduct[]>([]);

  // Hydrate from localStorage on mount
  useEffect(() => {
    setItems(readStorage());
  }, []);

  const addItem = useCallback((product: SavedProduct) => {
    setItems((prev) => {
      // Dedupe: remove existing entry for this productId
      const filtered = prev.filter((p) => p.productId !== product.productId);
      // Prepend and trim to max
      const next = [product, ...filtered].slice(0, MAX_ITEMS);
      writeStorage(next);
      return next;
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => {
      const next = prev.filter((p) => p.productId !== productId);
      writeStorage(next);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    writeStorage([]);
    setItems([]);
  }, []);

  return { items, addItem, removeItem, clearAll };
}
