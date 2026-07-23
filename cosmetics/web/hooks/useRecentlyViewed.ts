"use client";

import { useSyncExternalStore, useCallback } from "react";
import type { SavedProduct } from "@/lib/saved";

const STORAGE_KEY = "bf_recently_viewed";
const MAX_ITEMS = 10;
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

export function useRecentlyViewed() {
  const items = useSyncExternalStore(subscribe, getCache, getServerSnapshot);

  const addItem = useCallback((product: SavedProduct) => {
    const prev = getCache();
    const filtered = prev.filter((p) => p.productId !== product.productId);
    const next = [product, ...filtered].slice(0, MAX_ITEMS);
    setCache(next);
  }, []);

  const removeItem = useCallback((productId: string) => {
    const next = getCache().filter((p) => p.productId !== productId);
    setCache(next);
  }, []);

  const clearAll = useCallback(() => {
    setCache([]);
  }, []);

  return { items, addItem, removeItem, clearAll };
}
