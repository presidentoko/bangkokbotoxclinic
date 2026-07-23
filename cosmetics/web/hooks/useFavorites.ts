"use client";

import { useSyncExternalStore, useCallback } from "react";
import type { SavedProduct } from "@/lib/saved";

const STORAGE_KEY = "bf_favorites";
const EMPTY: SavedProduct[] = [];

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

let cache: SavedProduct[] | null = null;
const listeners = new Set<() => void>();

function getCache(): SavedProduct[] {
  if (cache === null) cache = readStorage();
  return cache;
}

function setCache(next: SavedProduct[]) {
  cache = next;
  writeStorage(next);
  listeners.forEach((l) => l());
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

function getServerSnapshot(): SavedProduct[] {
  return EMPTY;
}

export function useFavorites() {
  const items = useSyncExternalStore(subscribe, getCache, getServerSnapshot);

  const toggle = useCallback((product: SavedProduct) => {
    const prev = getCache();
    const exists = prev.some((p) => p.productId === product.productId);
    const next = exists
      ? prev.filter((p) => p.productId !== product.productId)
      : [...prev, product];
    setCache(next);
  }, []);

  const isFavorited = useCallback(
    (productId: string) => items.some((p) => p.productId === productId),
    [items]
  );

  return { items, toggle, isFavorited };
}
