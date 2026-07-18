"use client";

const KEY = "snsstopper_recently_viewed";
const MAX = 12;

export function getRecentlyViewed(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    const ids = raw ? JSON.parse(raw) : [];
    return Array.isArray(ids) ? ids : [];
  } catch {
    return [];
  }
}

export function recordViewed(id: string): void {
  try {
    const ids = getRecentlyViewed().filter((x) => x !== id);
    ids.unshift(id);
    localStorage.setItem(KEY, JSON.stringify(ids.slice(0, MAX)));
  } catch {
    // best-effort — no localStorage access (private mode, quota, etc.)
  }
}
